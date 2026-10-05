"""Replace some of the soldier's animation clips without building the model again.

Runs inside Blender's Python, like build_soldier.py:

    .venv/bin/python tools/characters/clips.py --mpfb /tmp/mpfb2/src/mpfb --clips idle,idle2,idle3,idle4

Makes the same body and skeleton as build_soldier.py, retargets the clips
named (mocap.py: ACCAD's are downloaded into --cache, CMU's come from --bvh)
and writes them into the model (--glb) in place of its clips of the same name;
the meshes, skins and textures stay as they are.
"""
import argparse
import json
import os
import struct
import sys
import tempfile

import bpy  # noqa: I001  (must come first: it provides the modules below)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_soldier  # noqa: E402
import mocap  # noqa: E402


def read_glb(path):
    with open(path, 'rb') as f:
        data = f.read()
    magic, _, _ = struct.unpack_from('<III', data, 0)
    assert magic == 0x46546C67, f'{path}: not a GLB'
    n, kind = struct.unpack_from('<II', data, 12)
    assert kind == 0x4E4F534A
    gltf = json.loads(data[20:20 + n])
    off = 20 + n
    m, kind = struct.unpack_from('<II', data, off)
    assert kind == 0x004E4942
    return gltf, data[off + 8:off + 8 + m]


def write_glb(path, gltf, binary):
    text = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    text += b' ' * (-len(text) % 4)
    binary += b'\0' * (-len(binary) % 4)
    size = 12 + 8 + len(text) + 8 + len(binary)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, size))
        f.write(struct.pack('<II', len(text), 0x4E4F534A) + text)
        f.write(struct.pack('<II', len(binary), 0x004E4942) + binary)


def accessor_refs(gltf):
    """Every place that names an accessor: (container, key)."""
    for mesh in gltf.get('meshes', []):
        for prim in mesh['primitives']:
            for k in prim['attributes']:
                yield prim['attributes'], k
            if 'indices' in prim:
                yield prim, 'indices'
            for target in prim.get('targets', []):
                for k in target:
                    yield target, k
    for skin in gltf.get('skins', []):
        if 'inverseBindMatrices' in skin:
            yield skin, 'inverseBindMatrices'
    for anim in gltf.get('animations', []):
        for sampler in anim['samplers']:
            yield sampler, 'input'
            yield sampler, 'output'


def view_refs(gltf):
    """Every place that names a buffer view."""
    for acc in gltf.get('accessors', []):
        if 'bufferView' in acc:
            yield acc, 'bufferView'
        sparse = acc.get('sparse')
        if sparse:
            yield sparse['indices'], 'bufferView'
            yield sparse['values'], 'bufferView'
    for image in gltf.get('images', []):
        if 'bufferView' in image:
            yield image, 'bufferView'


def compact(gltf, binary):
    """Drop the accessors and buffer views nothing names; the new binary."""
    used = sorted({c[k] for c, k in accessor_refs(gltf)})
    remap = {old: new for new, old in enumerate(used)}
    for c, k in list(accessor_refs(gltf)):
        c[k] = remap[c[k]]
    gltf['accessors'] = [gltf['accessors'][i] for i in used]
    used = sorted({c[k] for c, k in view_refs(gltf)})
    remap = {old: new for new, old in enumerate(used)}
    for c, k in list(view_refs(gltf)):
        c[k] = remap[c[k]]
    out = bytearray()
    views = []
    for i in used:
        view = dict(gltf['bufferViews'][i])
        start = view.get('byteOffset', 0)
        out += b'\0' * (-len(out) % 4)
        chunk = binary[start:start + view['byteLength']]
        view['byteOffset'] = len(out)
        out += chunk
        views.append(view)
    gltf['bufferViews'] = views
    gltf['buffers'] = [{'byteLength': len(out)}]
    return bytes(out)


def splice(model, clips_glb, names):
    """Write the animations of `clips_glb` whose names start with one of
    `names` into `model`, in place of its own of those names."""
    gltf, binary = read_glb(model)
    src, src_bin = read_glb(clips_glb)
    base = lambda a: a['name'].split('|')[0]  # noqa: E731
    node_of = {n['name']: i for i, n in enumerate(gltf['nodes']) if 'name' in n}
    # the skeletons are to be the same (the same body and rig as the model's)
    for n in src['nodes']:
        if n.get('name') in node_of:
            mine = gltf['nodes'][node_of[n['name']]]
            for k in ('translation', 'rotation'):
                a, b = n.get(k), mine.get(k)
                # (q and -q are the same rotation)
                if a and b and min(max(abs(x - s * y) for x, y in zip(a, b)) for s in (1, -1)) > 1e-4:
                    raise RuntimeError(f'{n["name"]}: rest {k} {a} is not the model\'s {b}')
    gltf['animations'] = [a for a in gltf.get('animations', []) if base(a) not in names]
    binary = bytearray(binary)
    for anim in src.get('animations', []):
        if base(anim) not in names:
            continue
        acc_map = {}

        def copy_accessor(i):
            if i in acc_map:
                return acc_map[i]
            acc = dict(src['accessors'][i])
            view = dict(src['bufferViews'][acc['bufferView']])
            start = view.get('byteOffset', 0)
            binary.extend(b'\0' * (-len(binary) % 4))
            chunk = src_bin[start:start + view['byteLength']]
            view['byteOffset'] = len(binary)
            view['buffer'] = 0
            binary.extend(chunk)
            gltf['bufferViews'].append(view)
            acc['bufferView'] = len(gltf['bufferViews']) - 1
            gltf['accessors'].append(acc)
            acc_map[i] = len(gltf['accessors']) - 1
            return acc_map[i]

        samplers = [{**s, 'input': copy_accessor(s['input']), 'output': copy_accessor(s['output'])} for s in anim['samplers']]
        channels = []
        for ch in anim['channels']:
            name = src['nodes'][ch['target']['node']].get('name')
            if name not in node_of:
                raise RuntimeError(f'{anim["name"]}: no node {name} in the model')
            channels.append({'sampler': ch['sampler'], 'target': {**ch['target'], 'node': node_of[name]}})
        gltf['animations'].append({'name': anim['name'], 'samplers': samplers, 'channels': channels})
        print('spliced', anim['name'], len(channels), 'channels')
    gltf['animations'].sort(key=lambda a: a['name'])
    binary = compact(gltf, bytes(binary))
    write_glb(model, gltf, binary)
    print('wrote', model, os.path.getsize(model), 'bytes')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--mpfb', required=True, help='path to the mpfb2 source folder (src/mpfb)')
    p.add_argument('--glb', default='assets/characters/soldier.glb')
    p.add_argument('--clips', required=True, help='names of the clips to make, comma separated (mocap.CLIPS)')
    p.add_argument('--cache', default=os.path.join(os.path.expanduser('~'), '.cache', 'makehuman-assets'))
    p.add_argument('--bvh', default='', help='folder with CMU BVH files (for the CMU clips)')
    args = p.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:])
    names = set(args.clips.split(','))
    bpy.ops.wm.read_factory_settings(use_empty=True)
    hs, ts = build_soldier.setup_mpfb(args.mpfb)
    body, rig = build_soldier.make_human(hs, ts)
    bpy.context.view_layer.update()
    accad = mocap.fetch_accad(args.cache) if any(rel.startswith('accad:') for n, rel, _, _ in mocap.CLIPS if n in names) else None
    mocap.add_clips(rig, args.bvh, accad, names)
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, 'clips.glb')
        bpy.ops.export_scene.gltf(
            filepath=out, export_format='GLB', use_selection=True, export_apply=True, export_yup=True,
            export_animations=True, export_animation_mode='ACTIONS', export_force_sampling=True,
            export_skins=True, export_morph=False, export_extras=False)
        splice(os.path.abspath(args.glb), out, names)


if __name__ == '__main__':
    main()
