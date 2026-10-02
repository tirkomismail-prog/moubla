"""Build the grass of the battles (Blender's Python, headless):

    .venv/bin/python tools/ground/build_grass.py --out assets/ground

Clumps of real grass, modelled blade by blade (Poly Haven "Grass Medium 01"
and "Grass Medium 02", CC0, downloaded into --cache), each rendered from the
side into a square tile of an atlas, unlit (their colour; the game lights
them): grass.webp (colour), grass_dry.webp (the same clumps dried, from the
assets' dry colour maps) and grass_alpha.webp. The game stands two crossed
cards of a tile on the ground per tuft. grass.json: the grid of tiles, each
tile's size in metres and the box of it its clump fills (from, to across,
top), and the outline (8 sides) around all the clumps in their boxes - the
cards are cut to the box and the outline.
"""
import argparse
import json
import math
import os
import sys
import urllib.request

import bpy  # noqa: I001
from mathutils import Vector

API = 'https://api.polyhaven.com/files/'
GRID = (4, 2)  # tiles across, down
PX = 256  # pixels of a tile

# the clumps, one per tile (Poly Haven asset, object)
TILES = [
    ('grass_medium_01', 'grass_medium_01_large_a_LOD0'),
    ('grass_medium_01', 'grass_medium_01_large_b_LOD0'),
    ('grass_medium_01', 'grass_medium_01_large_c_LOD0'),
    ('grass_medium_01', 'grass_medium_01_mid_a_LOD0'),
    ('grass_medium_01', 'grass_medium_01_mid_b_LOD0'),
    ('grass_medium_01', 'grass_medium_01_mid_c_LOD0'),
    ('grass_medium_02', 'grass_medium_02_c'),
    ('grass_medium_02', 'grass_medium_02_d'),
]


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--out', default='assets/ground')
    p.add_argument('--cache', default=os.path.join(os.path.expanduser('~'), '.cache', 'polyhaven-grass'))
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    return p.parse_args(argv)


def get(url, path):
    if os.path.exists(path):
        return path
    os.makedirs(os.path.dirname(path), exist_ok=True)
    print('downloading', url)
    req = urllib.request.Request(url, headers={'User-Agent': 'moubla-build'})
    with urllib.request.urlopen(req) as r, open(path + '.part', 'wb') as f:
        f.write(r.read())
    os.replace(path + '.part', path)
    return path


def fetch(cache, asset):
    """The asset's glTF (1k textures), its alpha and dry colour maps (not in
    the glTF package); their paths."""
    folder = os.path.join(cache, asset)
    gltf = os.path.join(folder, f'{asset}.gltf')
    listing = os.path.join(folder, 'files.json')
    if not os.path.exists(listing):
        os.makedirs(folder, exist_ok=True)
        req = urllib.request.Request(API + asset, headers={'User-Agent': 'moubla-build'})
        with urllib.request.urlopen(req) as r, open(listing, 'wb') as f:
            f.write(r.read())
    with open(listing) as f:
        files = json.load(f)
    g = files['gltf']['1k']['gltf']
    for rel, inc in g['include'].items():
        get(inc['url'], os.path.join(folder, rel))
    get(g['url'], gltf)
    alpha = get(files['Alpha']['1k']['jpg']['url'], os.path.join(folder, 'textures', f'{asset}_alpha_1k.jpg'))
    dry = get(files['dry_diff']['1k']['jpg']['url'], os.path.join(folder, 'textures', f'{asset}_dry_diff_1k.jpg'))
    return gltf, alpha, dry


def flat_material(mat, alpha_path):
    """The material's colour texture as emission (unlit), see-through by the
    alpha map (the blades are cut out of cards). Returns the colour texture
    node (its image is swapped for the dry one)."""
    nt = mat.node_tree
    img = next(n.image for n in nt.nodes if n.type == 'TEX_IMAGE' and n.image and 'diff' in n.image.name)
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = img
    at = nt.nodes.new('ShaderNodeTexImage')
    at.image = bpy.data.images.load(alpha_path, check_existing=True)
    at.image.colorspace_settings.name = 'Non-Color'
    em = nt.nodes.new('ShaderNodeEmission')
    clear = nt.nodes.new('ShaderNodeBsdfTransparent')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(tex.outputs['Color'], em.inputs['Color'])
    nt.links.new(at.outputs['Color'], mix.inputs['Fac'])
    nt.links.new(clear.outputs[0], mix.inputs[1])
    nt.links.new(em.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return tex


def setup_render():
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = 32
    sc.cycles.use_denoising = False
    sc.render.film_transparent = True
    sc.render.resolution_x = PX
    sc.render.resolution_y = PX
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    cam = bpy.data.cameras.new('cam')
    cam.type = 'ORTHO'
    obj = bpy.data.objects.new('cam', cam)
    bpy.context.collection.objects.link(obj)
    # from the side (looking along +y)
    obj.rotation_euler = (math.pi / 2, 0, 0)
    sc.camera = obj
    return obj


def build(args):
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o)
    clumps = {}
    colour_nodes = []  # (texture node, green image, dry image)
    for asset in sorted({a for a, _ in TILES}):
        gltf, alpha, dry = fetch(args.cache, asset)
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=gltf)
        dry_img = bpy.data.images.load(dry, check_existing=True)
        for o in sorted(set(bpy.data.objects) - before, key=lambda o: o.name):
            if o.type != 'MESH':
                continue
            for m in o.data.materials:
                if not m.get('flat'):
                    tex = flat_material(m, alpha)
                    colour_nodes.append((tex, tex.image, dry_img))
                    m['flat'] = True
            o.hide_render = True
            clumps[o.name] = o
    cam = setup_render()
    work = os.path.join(args.cache, 'work')
    os.makedirs(work, exist_ok=True)
    sizes = []
    variants = {'green': [], 'dry': []}
    for k, (_, name) in enumerate(TILES):
        o = clumps[name]
        o.hide_render = False
        bb = [o.matrix_world @ Vector(v) for v in o.bound_box]
        lo = Vector((min(v.x for v in bb), min(v.y for v in bb), min(v.z for v in bb)))
        hi = Vector((max(v.x for v in bb), max(v.y for v in bb), max(v.z for v in bb)))
        # the tile: square around the clump, its foot on the bottom edge
        size = max(hi.x - lo.x, hi.z - lo.z) * 1.06
        cam.data.ortho_scale = size
        cam.location = ((lo.x + hi.x) / 2, lo.y - 5, lo.z + size / 2 - size * 0.01)
        sizes.append(round(size, 4))
        for variant in variants:
            for tex, green, dry_img in colour_nodes:
                tex.image = green if variant == 'green' else dry_img
            path = os.path.join(work, f'tile_{variant}_{k}.png')
            bpy.context.scene.render.filepath = path
            bpy.ops.render.render(write_still=True)
            variants[variant].append(path)
        o.hide_render = True
    atlas(variants, sizes, args.out)


def atlas(variants, sizes, out_dir):
    from PIL import Image, ImageFilter
    import numpy as np
    W, H = GRID[0] * PX, GRID[1] * PX
    os.makedirs(out_dir, exist_ok=True)
    files = {}
    pts = []
    boxes = []
    for variant, paths in variants.items():
        color = Image.new('RGB', (W, H), (60, 70, 40))
        alpha = Image.new('L', (W, H), 0)
        for k, path in enumerate(paths):
            im = Image.open(path).convert('RGBA')
            r, g, b, a = im.split()
            # colour under the see-through parts too: the grass's own (far
            # away the game raises the alpha, these texels then show)
            c = np.asarray(Image.merge('RGB', (r, g, b)), dtype=np.float32)
            av = np.asarray(a, dtype=np.float32)[..., None] / 255
            mean = (c * av).sum((0, 1)) / max(av.sum(), 1)
            filled = c * av + mean * (1 - av)
            # (blurred: the blades' colour next to them, their mean further)
            under = np.asarray(Image.fromarray(filled.astype(np.uint8)).filter(ImageFilter.GaussianBlur(4)), dtype=np.float32)
            rgb = Image.fromarray(np.clip(c * av + under * (1 - av), 0, 255).astype(np.uint8))
            x, y = (k % GRID[0]) * PX, (k // GRID[0]) * PX
            color.paste(rgb, (x, y))
            alpha.paste(a, (x, y))
            if variant == 'green':
                ys, xs = np.nonzero(av[..., 0] > 0.15)
                st = np.stack([(xs + 0.5) / PX, 1 - (ys + 0.5) / PX], 1)
                pad = 3 / PX
                box = [max(st[:, 0].min() - pad, 0), min(st[:, 0].max() + pad, 1), min(st[:, 1].max() + pad, 1)]
                boxes.append([round(float(v), 4) for v in box])
                # in the box's own coordinates (0..1 both ways)
                pts.append(np.stack([(st[:, 0] - box[0]) / (box[1] - box[0]), st[:, 1] / box[2]], 1))
        name = 'grass' if variant == 'green' else f'grass_{variant}'
        color.save(os.path.join(out_dir, f'{name}.webp'), 'WEBP', quality=88, method=6)
        files[variant] = f'{name}.webp'
        if variant == 'green':
            alpha.save(os.path.join(out_dir, 'grass_alpha.webp'), 'WEBP', quality=90, method=6)
    outline = octagon(np.concatenate(pts), 1 / PX)
    with open(os.path.join(out_dir, 'grass.json'), 'w', encoding='utf-8') as f:
        json.dump({'color': files, 'alpha': 'grass_alpha.webp', 'grid': list(GRID), 'tile': PX,
                   'sizes': sizes, 'boxes': boxes, 'outline': outline}, f, indent=1)
    print('wrote', out_dir, sizes, boxes, outline)


def octagon(p, pad):
    """The 8-sided outline (axis-aligned and diagonal sides, counter-
    clockwise, t up) around points p (s, t), `pad` out."""
    s, t = p[:, 0], p[:, 1]
    d2 = pad * math.sqrt(2)
    s0, s1, t0, t1 = s.min() - pad, s.max() + pad, max(t.min() - pad, 0), t.max() + pad
    a0, a1 = (s + t).min() - d2, (s + t).max() + d2
    b0, b1 = (s - t).min() - d2, (s - t).max() + d2
    corners = [(a0 - t0, t0), (b1 + t0, t0), (s1, s1 - b1), (s1, a1 - s1),
               (a1 - t1, t1), (b0 + t1, t1), (s0, s0 - b0), (s0, a0 - s0)]
    out = []
    for cs, ct in corners:
        q = (round(min(max(cs, s0, 0.0), s1, 1.0), 4), round(min(max(ct, t0, 0.0), t1, 1.0), 4))
        if not out or abs(q[0] - out[-1][0]) + abs(q[1] - out[-1][1]) > 1e-4:
            out.append(q)
    if len(out) > 2 and abs(out[0][0] - out[-1][0]) + abs(out[0][1] - out[-1][1]) <= 1e-4:
        out.pop()
    return out


if __name__ == '__main__':
    build(parse_args())
