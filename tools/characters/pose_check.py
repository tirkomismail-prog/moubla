"""Poke-through check of the outfits over the mocap clips and four
procedural poses (riding, overhead strike, both arms up, head turned), for
one soldier.glb.

    .venv/bin/python tools/characters/pose_check.py assets/characters/soldier.glb out.json [LOD]

For each (outer, inner) layer pair of an outfit: the inner vertices that the
outer layer covers in the rest pose (a ray along the inner normal hits it
within 12 cm) and, per frame, how many of them end up outside the outer
surface by more than 1 mm / 3 mm (not counted where the outer layer's hit
is next to its open edge: a hem or a cuff lifting is no poke). The sum over
the pairs of the worst frame (3 mm), for the clips and for the procedural
poses, is checked against LIMITS (the Norse pairs apart, NORSE_LIMITS).

Holes: the body's skin is removed where no outfit shows it, so in each
outfit (outfits.DRESS) the edge of what is left must stay out of sight: the
points of that edge seen from outside (along a direction within 60 degrees
of the skin's normal nothing of the body or the outfit is in the way for
30 cm; the skin through the cloth is counted above instead), the worst
frame summed over the outfits, against HOLE_LIMITS. The exit status is 1
when any total is over (run it after each build).
"""
import json
import math
import sys
import time

import bpy  # noqa: I001
import bmesh
from mathutils import Quaternion, Vector
from mathutils.bvhtree import BVHTree
from mathutils.kdtree import KDTree

import outfits

GLB, OUT = sys.argv[1], sys.argv[2]
LOD = sys.argv[3] if len(sys.argv) > 3 else '0'
T0 = time.time()


def log(*a):
    print(f'[{time.time() - T0:6.1f}s]', *a, flush=True)


# (outer, inner) pairs per outfit (src/battle/character.js OUTFITS): the
# inner must stay under the outer
PAIRS = {
    'cloth': [('Tunic', 'Hose'), ('Tunic', 'Boots'), ('Tunic', 'Body'), ('Tunic', 'Hands'), ('Shoes', 'Hose')],
    'padded': [('Gambeson', 'Hose'), ('Gambeson', 'Boots'), ('Gambeson', 'Body'), ('Gambeson', 'Hands')],
    'leather': [('Jerkin', 'Tunic'), ('Tunic', 'Hose'), ('Tunic', 'Body'), ('Jerkin', 'Body'), ('Boots', 'Hose')],
    'mail': [('Surcoat', 'Hauberk'), ('Hauberk', 'Hose'), ('Hauberk', 'Body'), ('Surcoat', 'Hose'), ('Surcoat', 'Body'),
             ('Hauberk', 'Gloves')],
    'lamellar': [('Cuirass', 'Tunic'), ('Tunic', 'Hose'), ('Tunic', 'Body'), ('Cuirass', 'Body'), ('Tunic', 'Gloves')],
    'brigandine': [('Cuirass', 'Hauberk'), ('Hauberk', 'Hose'), ('Hauberk', 'Body')],
    'plate': [('Jupon', 'Hauberk'), ('Plates', 'Hauberk'), ('Plates', 'Jupon'), ('Hauberk', 'Hose'), ('Hauberk', 'Body'),
              ('Jupon', 'Hose'), ('Plates', 'Hose'), ('Plates', 'Boots'), ('Plates', 'Gloves')],
    'mail+coif': [('Coif-Surcoat', 'Surcoat'), ('Coif-Surcoat', 'Hauberk'), ('Coif-Surcoat', 'Body')],
    'plate+coif': [('Coif-Jupon', 'Jupon'), ('Coif-Jupon', 'Hauberk'), ('Coif-Jupon', 'Plates'), ('Coif-Jupon', 'Body')],
    'cloth+hood': [('Hood', 'Tunic'), ('Hood', 'Body')],
    'padded+hood': [('Hood-Gambeson', 'Gambeson'), ('Hood-Gambeson', 'Body')],
    'leather+hood': [('Hood', 'Jerkin')],
    # the Norse clothes (their own total and limits, NORSE_LIMITS)
    'norse': [('VikingTunic', 'VikingPants'), ('VikingTunic', 'Body'), ('VikingTunic', 'Hands'), ('VikingBoots', 'VikingPants')],
    'norse-padded': [('Gambeson', 'VikingPants'), ('Gambeson', 'VikingBoots')],
    'norse-brigandine': [('Hauberk', 'VikingPants'), ('Hauberk', 'VikingBoots')],
}
NORSE = {pair for look, pairs in PAIRS.items() if look.startswith('norse') for pair in pairs}
# the most vertices through by 3 mm (summed over the pairs, worst frame) per
# level of detail: (clips, procedural poses)
# (measured with the hems found on welded points, 10 % over and at least 2;
# most are where the garments' own layers meet: the coats, the plates and the
# coif's mantle over the hauberk, the cuffs over the gloves and the hands, the
# jerkin over the tunic, the hauberk's skirt over the hose and the trousers;
# far away also the coarse collars and cuffs over the skin kept under them)
LIMITS = {'0': (82, 14), '1': (42, 15), '2': (42, 18)}
NORSE_LIMITS = {'0': (11, 2), '1': (15, 4), '2': (35, 5)}
# the most points of the skin's edge seen through an outfit, summed over the
# outfits (clips, procedural poses; measured the same way: no skin kept round
# the bare skin gives 177 and 177 near by)
HOLE_LIMITS = {'0': (26, 26), '1': (61, 24), '2': (51, 48)}
PROCEDURAL = ('ride', 'overhead', 'arms_up', 'look')

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
    """Faces touching an open edge of the piece (a hem, a cuff, a collar).
    The import keeps the points split where the UVs or the parts change, so
    the edges are found on the points welded by position (else nearly half
    the faces of a garment would count as hems)."""
    me = o.data
    key = [tuple(round(c, 5) for c in v.co) for v in me.vertices]
    count = {}
    for p in me.polygons:
        n = len(p.vertices)
        for i in range(n):
            k = tuple(sorted((key[p.vertices[i]], key[p.vertices[(i + 1) % n]])))
            count[k] = count.get(k, 0) + 1
    ring = {c for k, n in count.items() if n == 1 for c in k}
    return {p.index for p in me.polygons if any(key[i] in ring for i in p.vertices)}


EDGE = {n: edge_faces(o) for n, o in objs.items() if n != 'Common'}


def skin_rim():
    """The edge of the body's skin (where the hidden skin was removed), one
    point per welded position; not where the hands were cut off (the hands'
    piece goes on there)."""
    me = objs['Common'].data
    body = MASK['Body']
    key = [tuple(round(c, 5) for c in v.co) for v in me.vertices]
    count = {}
    for p in me.polygons:
        if not all(body[i] for i in p.vertices):
            continue
        n = len(p.vertices)
        for i in range(n):
            k = tuple(sorted((key[p.vertices[i]], key[p.vertices[(i + 1) % n]])))
            count[k] = count.get(k, 0) + 1
    ring = {c for k, n in count.items() if n == 1 for c in k}
    hands = objs.get('Hands')
    kd = None
    if hands is not None:
        kd = KDTree(len(hands.data.vertices))
        for v in hands.data.vertices:
            kd.insert(v.co, v.index)
        kd.balance()
    out, seen = [], set()
    for i, v in enumerate(me.vertices):
        if body[i] and key[i] in ring and key[i] not in seen and (kd is None or kd.find(v.co)[2] > 0.003):
            seen.add(key[i])
            out.append(i)
    return out


RIM = skin_rim()
DRESS = {look: names for look, names in outfits.DRESS.items() if all(n in objs for n in names)}
# directions to look at the skin's edge from (spread evenly over the sphere)
GOLDEN = math.pi * (3 - math.sqrt(5))
DIRS = [Vector((math.sqrt(1 - z * z) * math.cos(k * GOLDEN), math.sqrt(1 - z * z) * math.sin(k * GOLDEN), z))
        for k, z in ((k, 1 - 2 * (k + 0.5) / 96) for k in range(96))]
log('skin edge points', len(RIM), 'outfits', len(DRESS))

# ---- rest: which inner vertices each outer layer covers
covered = {}
for look, pairs in PAIRS.items():
    for outer, inner in pairs:
        key = (outer, inner)
        # (a model without one of the two pieces: the pair is not checked)
        if key in covered or outer not in objs or inner not in SRC:
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
    'overhead' (right hand above the head, left forward) and 'arms_up';
    or with the head turned 60 degrees and bent 20 ('look', as far as
    agent.js turns it towards what the soldier looks at)."""
    set_action('idle')
    scene.frame_set(1)
    bpy.context.view_layer.update()
    if kind == 'look':
        for b in ('neck_01', 'head'):
            pb = rig.pose.bones[b]
            pb.rotation_quaternion = Quaternion((0, 1, 0), math.radians(30)) @ Quaternion((1, 0, 0), math.radians(10))
        bpy.context.view_layer.update()
        return
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
holes = {}
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
        # (no Norse troop rides)
        if clip == 'ride' and (outer, inner) in NORSE:
            continue
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
    # holes: the skin's edge seen through each outfit
    if RIM:
        co, no = cache['Body'] if 'Body' in cache else coords(SRC['Body'], True)
        body_tree = tree_of(SRC['Body'], True)
        for look, names in DRESS.items():
            if clip == 'ride' and look.startswith('norse'):
                continue
            tr = []
            for n in names:
                if n not in trees:
                    trees[n] = tree_of(objs[n], True)
                tr.append(trees[n])
            seen = 0
            for i in RIM:
                p, n = co[i], no[i]
                # (the cloth right behind it: the skin is through, not bare)
                if any(t.ray_cast(p, -n, 0.03)[0] is not None for t in tr):
                    continue
                for d in DIRS:
                    if d.dot(n) < 0.5:
                        continue
                    q = p + d * 0.002
                    if body_tree.ray_cast(q, d, 0.3)[0] is None and all(t.ray_cast(q, d, 0.3)[0] is None for t in tr):
                        seen += 1
                        break
            group = 'procedural' if clip in PROCEDURAL else 'clips'
            h = holes.setdefault(look, {'clips': [0, None], 'procedural': [0, None]})[group]
            if seen > h[0]:
                h[:] = [seen, f'{clip}:{f}']
    log('pose', clip, f)

# the sum over the pairs of the worst frame, clips and procedural poses (the
# Norse pairs apart)
total = {'clips': 0, 'procedural': 0}
norse = {'clips': 0, 'procedural': 0}
for pair, clips in sorted(results.items()):
    worst = {'clips': 0, 'procedural': 0}
    for clip, r in clips.items():
        group = 'procedural' if clip in PROCEDURAL else 'clips'
        worst[group] = max(worst[group], r['max3'])
    into = norse if tuple(pair.split('>')) in NORSE else total
    for g in into:
        into[g] += worst[g]
    if worst['clips'] or worst['procedural']:
        print(f'{pair:20s} clips {worst["clips"]:4d}  procedural {worst["procedural"]:4d}')
hole_total = {'clips': 0, 'procedural': 0}
for look, h in holes.items():
    for g in hole_total:
        hole_total[g] += h[g][0]
    if h['clips'][0] or h['procedural'][0]:
        print(f'holes {look:16s} clips {h["clips"][0]:4d} ({h["clips"][1]})  procedural {h["procedural"][0]:4d} ({h["procedural"][1]})')
limit = dict(zip(('clips', 'procedural'), LIMITS.get(LOD, LIMITS['2'])))
norse_limit = dict(zip(('clips', 'procedural'), NORSE_LIMITS.get(LOD, NORSE_LIMITS['2'])))
print(f'LOD{LOD}: clips {total["clips"]} (limit {limit["clips"]}), procedural {total["procedural"]} (limit {limit["procedural"]})')
print(f'LOD{LOD} Norse: clips {norse["clips"]} (limit {norse_limit["clips"]}), procedural {norse["procedural"]} (limit {norse_limit["procedural"]})')
hole_limit = dict(zip(('clips', 'procedural'), HOLE_LIMITS.get(LOD, HOLE_LIMITS['2'])))
print(f'LOD{LOD} holes: clips {hole_total["clips"]} (limit {hole_limit["clips"]}), procedural {hole_total["procedural"]} (limit {hole_limit["procedural"]})')
with open(OUT, 'w') as fh:
    json.dump({'glb': GLB, 'lod': LOD, 'poses': len(POSES), 'total': total, 'limit': limit, 'norse': norse,
               'norse_limit': norse_limit, 'holes': hole_total, 'hole_limit': hole_limit, 'hole_outfits': holes,
               'results': results}, fh, indent=1)
log('wrote', OUT)
sys.exit(1 if any(total[g] > limit[g] or norse[g] > norse_limit[g] or hole_total[g] > hole_limit[g] for g in total) else 0)
