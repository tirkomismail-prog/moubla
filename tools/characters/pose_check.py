"""Poke-through check of the outfits over the mocap clips and three
procedural poses (riding, overhead strike, both arms up), for one soldier.glb.

    .venv/bin/python tools/characters/pose_check.py assets/characters/soldier.glb out.json [LOD]

For each (outer, inner) layer pair of an outfit: the inner vertices that the
outer layer covers in the rest pose (a ray along the inner normal hits it
within 12 cm) and, per frame, how many of them end up outside the outer
surface by more than 1 mm / 3 mm. The sum over the pairs of the worst frame
(3 mm), for the clips and for the procedural poses, is checked against
LIMITS: the exit status is 1 when either is over (run it after each build).
"""
import json
import math
import sys
import time

import bpy  # noqa: I001
import bmesh
from mathutils import Vector
from mathutils.bvhtree import BVHTree

GLB, OUT = sys.argv[1], sys.argv[2]
LOD = sys.argv[3] if len(sys.argv) > 3 else '0'
T0 = time.time()


def log(*a):
    print(f'[{time.time() - T0:6.1f}s]', *a, flush=True)


# (outer, inner) pairs per outfit (src/battle/character.js OUTFITS): the
# inner must stay under the outer
PAIRS = {
    'cloth': [('Tunic', 'Hose'), ('Tunic', 'Boots'), ('Tunic', 'Body')],
    'padded': [('Gambeson', 'Hose'), ('Gambeson', 'Boots'), ('Gambeson', 'Body')],
    'leather': [('Jerkin', 'Tunic'), ('Tunic', 'Hose'), ('Tunic', 'Body'), ('Jerkin', 'Body')],
    'mail': [('Surcoat', 'Hauberk'), ('Hauberk', 'Hose'), ('Hauberk', 'Body'), ('Surcoat', 'Hose'), ('Surcoat', 'Body')],
    'lamellar': [('Cuirass', 'Tunic'), ('Tunic', 'Hose'), ('Tunic', 'Body'), ('Cuirass', 'Body')],
    'brigandine': [('Cuirass', 'Hauberk'), ('Hauberk', 'Hose'), ('Hauberk', 'Body')],
    'plate': [('Cuirass', 'Hauberk'), ('Plates', 'Hauberk'), ('Hauberk', 'Hose'), ('Hauberk', 'Body'),
              ('Plates', 'Hose'), ('Plates', 'Boots')],
}
# the most vertices through by 3 mm (summed over the pairs, worst frame) per
# level of detail: (clips, procedural poses)
LIMITS = {'0': (30, 18), '1': (25, 22), '2': (8, 6)}
PROCEDURAL = ('ride', 'overhead', 'arms_up')

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
scene = bpy.context.scene
rig = bpy.data.objects['Soldier']
objs = {}
for o in bpy.data.objects:
    if o.type != 'MESH':
        continue
    if o.name == f'Soldier_LOD{LOD}':
        objs['Common'] = o
    elif o.name.startswith('Piece_') and o.name.endswith(f'_LOD{LOD}'):
        objs[o.name[6:-5]] = o
parts = list(rig['parts'])
BODY_ID = parts.index('Body')


def body_mask(o):
    a = o.data.attributes.get('_PART') or o.data.attributes.get('_part')
    return [abs(d.value - BODY_ID) < 0.5 for d in a.data]


MASK = {'Body': body_mask(objs['Common'])}
SRC = {**objs, 'Body': objs['Common']}


def coords(o, posed):
    if not posed:
        return [o.matrix_world @ v.co for v in o.data.vertices], [o.matrix_world.to_3x3() @ v.normal for v in o.data.vertices]
    dg = bpy.context.evaluated_depsgraph_get()
    ev = o.evaluated_get(dg)
    me = ev.to_mesh()
    co = [o.matrix_world @ v.co for v in me.vertices]
    no = [(o.matrix_world.to_3x3() @ v.normal).normalized() for v in me.vertices]
    ev.to_mesh_clear()
    return co, no


def tree_of(o, posed):
    dg = bpy.context.evaluated_depsgraph_get()
    if posed:
        ev = o.evaluated_get(dg)
        me = ev.to_mesh()
    else:
        me = o.data
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.transform(o.matrix_world)
    bm.normal_update()
    t = BVHTree.FromBMesh(bm)
    bm.free()
    if posed:
        ev.to_mesh_clear()
    return t


def edge_faces(o):
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bverts = {v for v in bm.verts if v.is_boundary}
    ring = set(bverts)
    out = {f.index for f in bm.faces if any(v in ring for v in f.verts)}
    bm.free()
    return out


EDGE = {n: edge_faces(o) for n, o in objs.items() if n != 'Common'}

# ---- rest: which inner vertices each outer layer covers
covered = {}
for look, pairs in PAIRS.items():
    for outer, inner in pairs:
        key = (outer, inner)
        if key in covered or outer not in objs:
            continue
        t = tree_of(objs[outer], False)
        co, no = coords(SRC[inner], False)
        mask = MASK.get(inner)
        sel = []
        for i, (p, n) in enumerate(zip(co, no)):
            if mask is not None and not mask[i]:
                continue
            hit = t.ray_cast(p + n * 0.0005, n, 0.12)
            if hit[0] is None:
                continue
            loc, fn, idx, d = t.find_nearest(p, 0.12)
            if loc is not None and (p - loc).dot(fn) < 0:
                sel.append(i)
        covered[key] = sel
        log('covered', key, len(sel))


# ---- poses
def clear_pose():
    for pb in rig.pose.bones:
        pb.location = (0, 0, 0)
        pb.rotation_mode = 'QUATERNION'
        pb.rotation_quaternion = (1, 0, 0, 0)
        for c in list(pb.constraints):
            pb.constraints.remove(c)


def set_action(name):
    act = next(a for a in bpy.data.actions if a.name.startswith(name + '|'))
    rig.animation_data_create()
    rig.animation_data.action = act
    try:
        rig.animation_data.action_slot = act.slots[0]
    except Exception:
        pass
    return act


def empty(name, loc):
    e = bpy.data.objects.get(name) or bpy.data.objects.new(name, None)
    if e.name not in scene.collection.objects:
        scene.collection.objects.link(e)
    e.location = loc
    return e


def ik(bone, target, pole, chain=2, pole_angle=0.0):
    pb = rig.pose.bones[bone]
    c = pb.constraints.new('IK')
    c.target = target
    c.pole_target = pole
    c.pole_angle = pole_angle
    c.chain_count = chain
    return c


def bone_world(name, tail=False):
    pb = rig.pose.bones[name]
    return rig.matrix_world @ (pb.tail if tail else pb.head)


def procedural(kind):
    """Idle frame 1 plus IK: 'ride' (legs astride, feet in stirrups),
    'overhead' (right hand above the head, left forward) and 'arms_up'."""
    set_action('idle')
    scene.frame_set(1)
    bpy.context.view_layer.update()
    for s, side in (('l', 1), ('r', -1)):
        hip = bone_world('thigh_' + s)
        sh = bone_world('upperarm_' + s)
        if kind == 'ride':
            # runtime fallback in character.js: foot = hip + (side*0.3, -0.78, 0.18) (three.js) -> Blender
            ik('calf_' + s, empty('foot_' + s, hip + Vector((side * 0.30, -0.18, -0.78))),
               empty('knee_' + s, hip + Vector((side * 0.30, -1.0, 0.0))), pole_angle=-math.pi / 2)
        elif kind == 'overhead':
            tgt = sh + (Vector((side * 0.05, -0.15, 0.55)) if s == 'r' else Vector((side * 0.05, -0.45, 0.05)))
            ik('lowerarm_' + s, empty('hand_' + s, tgt), empty('elbow_' + s, sh + Vector((side * 0.6, 0.2, 0.0))),
               pole_angle=0.0)
        elif kind == 'arms_up':
            ik('lowerarm_' + s, empty('hand_' + s, sh + Vector((side * 0.12, -0.08, 0.62))),
               empty('elbow_' + s, sh + Vector((side * 0.6, 0.0, 0.3))), pole_angle=0.0)
    bpy.context.view_layer.update()


def frames_of(name, step):
    act = set_action(name)
    a, b = act.frame_range
    return [int(round(f)) for f in frange(a, b, step)]


def frange(a, b, s):
    x = a
    while x <= b:
        yield x
        x += s


POSES = []
CLIPS = [('walk', 2), ('run', 2), ('walk_back', 3)]
CLIPS += [(a.name.split('|')[0], 6) for a in bpy.data.actions if a.name.startswith('idle')]
for clip, step in CLIPS:
    for f in frames_of(clip, step):
        POSES.append((clip, f))
POSES += [(p, 0) for p in PROCEDURAL]

results = {}
for clip, f in POSES:
    clear_pose()
    if clip in PROCEDURAL:
        procedural(clip)
    else:
        set_action(clip)
        scene.frame_set(f)
    bpy.context.view_layer.update()
    trees = {}
    cache = {}
    for (outer, inner), sel in covered.items():
        if outer not in trees:
            trees[outer] = tree_of(objs[outer], True)
        if inner not in cache:
            cache[inner] = coords(SRC[inner], True)
        co, no = cache[inner]
        n1 = n3 = ne = 0
        worst = 0.0
        tr = trees[outer]
        for i in sel:
            p, n = co[i], no[i]
            # visible poke: nothing of the outer layer in front of the inner
            # vertex (along its normal), but the outer surface right behind it
            if tr.ray_cast(p + n * 0.0002, n, 0.15)[0] is not None:
                continue
            hit = tr.ray_cast(p, -n, 0.04)
            if hit[0] is None:
                continue
            s = hit[3]
            if hit[2] in EDGE[outer]:
                ne += 1
                continue
            if s > 0.001:
                n1 += 1
            if s > 0.003:
                n3 += 1
            worst = max(worst, s)
        r = results.setdefault(f'{outer}>{inner}', {}).setdefault(clip, dict(n=len(sel), max1=0, max3=0, sum1=0, frames=0, worst_mm=0.0, edge=0))
        r['edge'] = max(r['edge'], ne)
        r['max1'] = max(r['max1'], n1)
        r['max3'] = max(r['max3'], n3)
        r['sum1'] += n1
        r['frames'] += 1
        r['worst_mm'] = round(max(r['worst_mm'], worst * 1000), 1)
    log('pose', clip, f)

# the sum over the pairs of the worst frame, clips and procedural poses
total = {'clips': 0, 'procedural': 0}
for pair, clips in sorted(results.items()):
    worst = {'clips': 0, 'procedural': 0}
    for clip, r in clips.items():
        group = 'procedural' if clip in PROCEDURAL else 'clips'
        worst[group] = max(worst[group], r['max3'])
    for g in total:
        total[g] += worst[g]
    if worst['clips'] or worst['procedural']:
        print(f'{pair:20s} clips {worst["clips"]:4d}  procedural {worst["procedural"]:4d}')
limit = dict(zip(('clips', 'procedural'), LIMITS.get(LOD, LIMITS['2'])))
print(f'LOD{LOD}: clips {total["clips"]} (limit {limit["clips"]}), procedural {total["procedural"]} (limit {limit["procedural"]})')
with open(OUT, 'w') as fh:
    json.dump({'glb': GLB, 'lod': LOD, 'poses': len(POSES), 'total': total, 'limit': limit, 'results': results}, fh, indent=1)
log('wrote', OUT)
sys.exit(1 if any(total[g] > limit[g] for g in total) else 0)
