"""The garments of the soldiers' outfits (one set per armour look, see
OUTFITS in src/battle/character.js): tunic, gambeson, mail hauberk,
surcoat, leather jerkin, cuirass (lamellar or plate) and plate pieces, plus
a belt fitted to each outer garment.

They are cut from the MakeHuman helper shells (tights, skirt) like the
basic clothes in garments.py, then pushed away from the body by the
thickness of the cloth, widened towards the cuffs and hems and given
folds: pleats in the skirts, bunching at the elbows and wrists, blousing
above the belt. Plates are rigid: each follows one bone only.
"""
import math

import bmesh
from mathutils import Vector

import garments as G

TORSO = {'spine_01', 'spine_02', 'spine_03', 'neck_01', 'clavicle_l', 'clavicle_r', 'pelvis'}
ARMS = {'upperarm_l', 'upperarm_r', 'lowerarm_l', 'lowerarm_r'}

H = None
RIG = None


def bone(name):
    b = RIG.data.bones[name]
    return b.head_local.copy(), b.tail_local.copy()


def along(co, name):
    """Position of a point along a bone: 0 at its head, 1 at its tail."""
    a, b = bone(name)
    d = b - a
    return (co - a).dot(d) / d.length_squared


def arm_pos(co, b):
    """0 at the shoulder, 0.5 at the elbow, 1 at the wrist (None off the arm)."""
    if b and b.startswith('upperarm'):
        return 0.5 * max(0.0, min(1.0, along(co, b)))
    if b and b.startswith('lowerarm'):
        return 0.5 + 0.5 * max(0.0, min(1.0, along(co, b)))
    return None


def neckline(kind):
    L = G.L
    neck = RIG.data.bones['neck_01'].head_local

    def ok(co):
        d = math.hypot(co.x, co.y - neck.y)
        front = max(0.0, min(1.0, (neck.y - co.y) / 0.08))
        if kind == 'high':  # a standing collar
            return co.z < L['neck'] + 0.02
        if kind == 'low':  # wide and low (worn over other clothes)
            return d > 0.17 or co.z < L['neck'] - 0.035 - 0.07 * front
        if d > 0.14:
            return True
        return co.z < L['neck'] - 0.012 - 0.055 * front
    return ok


def subdivide(obj, pick):
    """Split the edges whose both ends pass pick(co) (more vertices for folds)."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    edges = [e for e in bm.edges if pick(e.verts[0].co) and pick(e.verts[1].co)]
    if edges:
        bmesh.ops.subdivide_edges(bm, edges=edges, cuts=1, use_grid_fill=True)
    bm.to_mesh(obj.data)
    bm.free()


def push(obj, dist):
    """Move each vertex out along its normal by dist(co, dominant bone)."""
    bidx = H['bone_index'](obj, RIG)
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.normal_update()
    dl = bm.verts.layers.deform.active
    moves = [(v, v.normal.copy() * dist(v.co, H['dominant_bone'](v, dl, bidx))) for v in bm.verts]
    for v, d in moves:
        v.co += d
    bm.to_mesh(obj.data)
    bm.free()


def torso(human, name, sleeves, neck, bottom, off, sleeve_off=(0.0, 0.0), smooth=0):
    """The upper part of a garment from the tights: the torso down to
    `bottom`, with long sleeves or none."""
    bones = TORSO | (ARMS if sleeves else set())
    fits = neckline(neck)
    obj = G.split_shell(human, RIG, 'helper-tights', name, lambda v, b, co: co.z > bottom and b in bones and fits(co))
    if smooth:
        # a rigid shell (a cuirass) does not follow the chest and belly
        H['smooth_verts'](obj, iterations=smooth, factor=0.5)

    def dist(co, b):
        s = arm_pos(co, b)
        if s is None:
            return off
        return sleeve_off[0] + (sleeve_off[1] - sleeve_off[0]) * s
    push(obj, dist)
    G.relax_edges(obj, 4)
    return obj


def skirt(human, name, hem, off, flare_amount, pleats=None, slits=True):
    """The lower part of a garment from the skirt helper, down to `hem`."""
    L = G.L
    axis_y = RIG.data.bones['pelvis'].head_local.y
    obj = G.split_shell(human, RIG, 'helper-skirt', name, lambda v, b, co: co.z > hem)
    H['offset'](obj, off)
    top = L['belt_top'] - 0.012
    for v in obj.data.vertices:
        v.co.z = min(v.co.z, top)
    if pleats:
        subdivide(obj, lambda co: co.z < top - 0.03)
    G.flare(obj, top, hem, axis_y, flare_amount)
    if pleats:
        pleat(obj, top, hem, axis_y, *pleats)
    slit_top = hem + 0.68 * (top - hem) if slits else None
    if slits:
        G.slit(obj, axis_y, slit_top)
    G.reweight_skirt(obj, top, hem, slit_top)
    return obj


def pleat(obj, top, hem, axis_y, count, amp, seed=1.3):
    """Folds hanging down a skirt: a wave round the waist, growing to the
    hem, with its phase wandering so the folds are not all alike."""
    for v in obj.data.vertices:
        t = max(0.0, min(1.0, (top - v.co.z) / (top - hem)))
        dx, dy = v.co.x, v.co.y - axis_y
        r = math.hypot(dx, dy)
        if r < 1e-6:
            continue
        a = math.atan2(dx, -dy)
        wander = 0.35 * math.sin(3 * a + seed) + 0.2 * math.sin(7 * a - 2 * seed) + 0.25 * t * math.sin(2 * a + 5 * t)
        d = amp * t ** 1.2 * math.sin(count * a + wander * 2.0)
        v.co.x += dx / r * d
        v.co.y += dy / r * d


def sleeve_folds(obj, amp, seed=0.7):
    """Bunching of a sleeve: rings of folds at the inside of the elbow and at
    the wrist, uneven round the arm."""
    bidx = H['bone_index'](obj, RIG)
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.normal_update()
    dl = bm.verts.layers.deform.active
    moves = []
    for v in bm.verts:
        b = H['dominant_bone'](v, dl, bidx)
        s = arm_pos(v.co, b)
        if s is None:
            continue
        side = b[-1]
        ea, eb = bone('lowerarm_' + side)
        axis = (eb - ea).normalized()
        rad = v.co - ea - axis * (v.co - ea).dot(axis)
        a = math.atan2(rad.z, rad.y)
        x = (v.co - ea).dot(axis)  # metres from the elbow along the forearm
        elbow = math.exp(-(x / 0.07) ** 2) * (0.55 + 0.45 * math.sin(a * 2 + seed))
        wrist = max(0.0, 1 - abs(s - 0.93) / 0.07) * 0.8
        wave = math.sin(x / 0.03 * 2 * math.pi + math.sin(a * 3 + seed) * 1.2)
        moves.append((v, v.normal.copy() * amp * (elbow + wrist) * wave))
    for v, d in moves:
        v.co += d
    bm.to_mesh(obj.data)
    bm.free()


def blouse(obj, amp, seed=2.1):
    """Cloth sagging over the belt: fuller just above it, in soft folds."""
    L = G.L
    axis_y = RIG.data.bones['pelvis'].head_local.y
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.normal_update()
    moves = []
    for v in bm.verts:
        h = v.co.z - L['belt_top']
        if not 0.005 < h < 0.14:
            continue
        # fullest a little above the belt, which stays in sight below it
        k = 1 - abs(h - 0.045) / 0.095 if h > 0.045 else 1 - abs(h - 0.045) / 0.04
        a = math.atan2(v.co.x, -(v.co.y - axis_y))
        k *= 0.6 + 0.4 * math.sin(7 * a + 1.3 * math.sin(3 * a + seed))
        moves.append((v, v.normal.copy() * amp * max(0.0, k)))
    for v, d in moves:
        v.co += d
    bm.to_mesh(obj.data)
    bm.free()


def join(objs, name):
    import bpy
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    obj.name = obj.data.name = name
    return obj


def rigid(obj, bone_name):
    """Make a plate follow one bone only."""
    for g in list(obj.vertex_groups):
        obj.vertex_groups.remove(g)
    g = obj.vertex_groups.new(name=bone_name)
    g.add([v.index for v in obj.data.vertices], 1.0, 'REPLACE')


def plate(human, name, bone_name, pick, off, smooth=3):
    """A rigid plate from the part of the tights for which pick(co, b) holds."""
    obj = G.split_shell(human, RIG, 'helper-tights', name, lambda v, b, co: pick(co, b))
    H['smooth_verts'](obj, iterations=smooth, factor=0.5)
    H['offset'](obj, off)
    G.relax_edges(obj, 3)
    rigid(obj, bone_name)
    return obj


def plates(human):
    """Pauldrons, couters, vambraces, poleyns and greaves."""
    out = []
    for s in ('l', 'r'):
        shoulder = bone('upperarm_' + s)[0]
        elbow = bone('lowerarm_' + s)[0]
        knee = bone('calf_' + s)[0]
        out.append(plate(human, 'pauldron_' + s, 'upperarm_' + s,
                         lambda co, b, s=s, sh=shoulder: (b == 'upperarm_' + s and along(co, b) < 0.42)
                         or (b == 'clavicle_' + s and (co - sh).length < 0.09), 0.03))
        out.append(plate(human, 'couter_' + s, 'lowerarm_' + s,
                         lambda co, b, s=s, e=elbow: b in ('upperarm_' + s, 'lowerarm_' + s) and (co - e).length < 0.065, 0.024))
        out.append(plate(human, 'vambrace_' + s, 'lowerarm_' + s,
                         lambda co, b, s=s: b == 'lowerarm_' + s and 0.3 < along(co, b) < 0.92, 0.02))
        out.append(plate(human, 'poleyn_' + s, 'calf_' + s,
                         lambda co, b, s=s, k=knee: b in ('thigh_' + s, 'calf_' + s) and (co - k).length < 0.07, 0.026))
        out.append(plate(human, 'greave_' + s, 'calf_' + s,
                         lambda co, b, s=s: b == 'calf_' + s and 0.14 < along(co, b) < 0.72, 0.024))
    return join(out, 'Plates')


def build_all(human, rig, helpers):
    """Returns {piece name: object}. A piece is one part of the model; belts
    are named 'Belt-<garment they go round>' (glTF loaders drop ':' from names)."""
    global H, RIG
    H, RIG = helpers, rig
    L = G.L
    knee = L['knee']
    below = L['belt_top'] - 0.1  # torso shells reach under the belt and the skirt
    axis_y = rig.data.bones['pelvis'].head_local.y
    out = {}

    def arms(obj, amp):
        subdivide(obj, lambda co: abs(co.x) > 0.2)
        sleeve_folds(obj, amp)

    # tunic: knee length, long sleeves, riding slits
    t = torso(human, 'Tunic_top', True, 'round', below, 0.012, (0.01, 0.02))
    arms(t, 0.006)
    blouse(t, 0.012)
    out['Tunic'] = join([t, skirt(human, 'Tunic_skirt', L['hem'], 0.024, 0.45, pleats=(12, 0.011))], 'Tunic')

    # gambeson: thick quilted coat to mid-thigh, standing collar
    t = torso(human, 'Gambeson_top', True, 'high', below, 0.024, (0.02, 0.024))
    arms(t, 0.004)
    out['Gambeson'] = join([t, skirt(human, 'Gambeson_skirt', knee + 0.17, 0.034, 0.22, pleats=(8, 0.006), slits=False)], 'Gambeson')

    # mail hauberk: knee length, long sleeves, hangs straight and heavy
    t = torso(human, 'Hauberk_top', True, 'round', below, 0.011, (0.009, 0.012))
    arms(t, 0.004)
    out['Hauberk'] = join([t, skirt(human, 'Hauberk_skirt', L['hem'] - 0.01, 0.021, 0.3, pleats=(10, 0.005))], 'Hauberk')

    # surcoat over the hauberk: sleeveless, to mid-calf
    t = torso(human, 'Surcoat_top', False, 'low', below, 0.03)
    out['Surcoat'] = join([t, skirt(human, 'Surcoat_skirt', knee - 0.2, 0.058, 0.6, pleats=(12, 0.011))], 'Surcoat')

    # leather jerkin over the tunic: sleeveless, to the hips
    out['Jerkin'] = torso(human, 'Jerkin', False, 'low', L['belt_top'] - 0.14, 0.03)

    # cuirass (lamellar or plate) with short tassets over the tunic or hauberk
    t = torso(human, 'Cuirass_top', False, 'round', L['belt_top'] - 0.03, 0.05, smooth=4)
    out['Cuirass'] = join([t, skirt(human, 'Cuirass_skirt', knee + 0.2, 0.05, 0.25)], 'Cuirass')

    out['Plates'] = plates(human)

    for name in ('Tunic', 'Gambeson', 'Surcoat', 'Jerkin', 'Cuirass'):
        belt = G.make_belt([out[name]], L['belt_top'], axis_y)
        belt.name = belt.data.name = 'Belt-' + name
        out['Belt-' + name] = belt

    for name, obj in out.items():
        H['set_material'](obj, name.split(':')[0].lower())
        H['shade_smooth'](obj)
    return out
