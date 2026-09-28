"""Clothes for the soldier, built from the MakeHuman helper shells (tights,
skirt). The eyes, hair and beards are MakeHuman assets (mhassets.py)."""
import math

import bmesh
import bpy
from mathutils import Matrix, Vector

UPPER = {'spine_01', 'spine_02', 'spine_03', 'neck_01', 'clavicle_l', 'clavicle_r', 'upperarm_l', 'upperarm_r', 'lowerarm_l', 'lowerarm_r'}
LEGS = {'thigh_l', 'thigh_r', 'calf_l', 'calf_r', 'foot_l', 'foot_r', 'ball_l', 'ball_r'}

H = None  # helper functions from build_soldier
L = {}  # landmarks (heights in metres) measured on the generated body


def landmarks(human, rig):
    b = rig.data.bones
    skirt_top = max(v.co.z for v in shell_verts(human, 'helper-skirt'))
    L.update(
        neck=b['neck_01'].head_local.z,
        shoulder=b['upperarm_l'].head_local.z,
        knee=b['calf_l'].head_local.z,
        ankle=b['foot_l'].head_local.z,
        waist=skirt_top - 0.03,
    )
    L['boot'] = L['ankle'] + 0.55 * (L['knee'] - L['ankle'])
    L['hem'] = L['knee'] + 0.04
    print('landmarks', {k: round(v, 3) for k, v in L.items()})


def shell_verts(human, group):
    gi = human.vertex_groups[group].index
    return [v for v in human.data.vertices if any(g.group == gi and g.weight > 0.5 for g in v.groups)]


def split_shell(human, rig, group, name, pred):
    """Copy the part of a helper shell whose vertices pass pred(v, bone, co)."""
    new = H['copy_object'](human, name)
    gi = human.vertex_groups[group].index
    bidx = H['bone_index'](human, rig)
    bm = bmesh.new()
    bm.from_mesh(new.data)
    dl = bm.verts.layers.deform.active
    keep = set()
    for v in bm.verts:
        if H['group_weight'](v, dl, gi) > 0.5 and pred(v, H['dominant_bone'](v, dl, bidx), v.co):
            keep.add(v)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v not in keep], context='VERTS')
    bm.to_mesh(new.data)
    bm.free()
    new.data.materials.clear()
    return new


def relax_edges(obj, iterations):
    """Smooth the open edges of a garment (cuts through the helper mesh are
    stair-stepped): each boundary vertex moves towards its boundary neighbours."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    for _ in range(iterations):
        moves = []
        for v in bm.verts:
            if not v.is_boundary:
                continue
            nb = [e.other_vert(v) for e in v.link_edges if e.is_boundary]
            if len(nb) == 2:
                moves.append((v, (nb[0].co + nb[1].co) * 0.5))
        for v, target in moves:
            v.co = v.co.lerp(target, 0.5)
    bm.to_mesh(obj.data)
    bm.free()


def slit(obj, axis_y, z_top):
    """Cut the skirt open at the front and the back below `z_top`, like the
    riding slits of a medieval tunic, so each half can follow its own leg."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    seam = [e for e in bm.edges
            if all(abs(v.co.x) < 1e-3 and v.co.z < z_top for v in e.verts)]
    bmesh.ops.split_edges(bm, edges=seam)
    # nudge the two sides of each cut apart
    for f in bm.faces:
        side = 1 if f.calc_center_median().x > 0 else -1
        for v in f.verts:
            if abs(v.co.x) < 1e-3 and v.co.z < z_top:
                v.co.x = side * 0.004
    bm.to_mesh(obj.data)
    bm.free()


def reweight_skirt(obj, top, bottom, slit_top=None):
    """Smooth, predictable weights for a skirt: pelvis at the waist, blending to
    the thighs towards the hem (the centre line shares both thighs, except
    below the slits where each half follows its own leg)."""
    names = ['pelvis', 'thigh_l', 'thigh_r', 'calf_l', 'calf_r']
    for g in list(obj.vertex_groups):
        obj.vertex_groups.remove(g)
    groups = {n: obj.vertex_groups.new(name=n) for n in names}
    for v in obj.data.vertices:
        t = max(0.0, min(1.0, (top - v.co.z) / (top - bottom)))
        t = t * t * (3 - 2 * t)
        width = 0.09
        if slit_top is not None and v.co.z < slit_top:
            width = 0.09 * max(0.08, (v.co.z - bottom) / (slit_top - bottom))
        side = max(-1.0, min(1.0, v.co.x / width))
        wl = 0.5 + 0.5 * side
        leg = min(1.0, 1.1 * t ** 0.55)
        groups['pelvis'].add([v.index], 1.0 - leg, 'REPLACE')
        groups['thigh_l'].add([v.index], leg * wl, 'REPLACE')
        groups['thigh_r'].add([v.index], leg * (1 - wl), 'REPLACE')


def flare(obj, top, bottom, axis_y, amount):
    """Widen a skirt towards the hem (A-line), leaving room for the legs."""
    for v in obj.data.vertices:
        t = max(0.0, min(1.0, (top - v.co.z) / (top - bottom)))
        k = 1 + amount * t ** 1.5
        v.co.x *= k
        v.co.y = axis_y + (v.co.y - axis_y) * k


def make_belt(around, z_top, axis_y, width=0.042, segments=40):
    """A leather belt hugging the clothes at height z_top, with a buckle."""
    from mathutils.bvhtree import BVHTree
    bm = bmesh.new()
    for o in around:
        bm.from_mesh(o.data)
    tree = BVHTree.FromBMesh(bm)
    bm.free()
    out = bmesh.new()
    radius = []
    for i in range(segments):
        a = i / segments * 2 * math.pi
        d = Vector((math.sin(a), -math.cos(a), 0.0))
        r = 0.0
        for k in range(6):  # the widest point of the clothes under the belt
            c = Vector((0.0, axis_y, z_top - width * k / 5))
            hit = tree.ray_cast(c + d * 0.5, -d, 1.0)
            if hit[0]:
                r = max(r, (hit[0] - c).length)
        radius.append((r or 0.2) + 0.006)
    rings = []
    for z in (z_top, z_top - width):
        ring = []
        for i in range(segments):
            a = i / segments * 2 * math.pi
            d = Vector((math.sin(a), -math.cos(a), 0.0))
            ring.append(out.verts.new(Vector((0.0, axis_y, z)) + d * radius[i]))
        rings.append(ring)
    for i in range(segments):
        j = (i + 1) % segments
        out.faces.new((rings[0][i], rings[0][j], rings[1][j], rings[1][i]))
    # buckle at the front
    front = (rings[0][0].co + rings[1][0].co) / 2
    bmesh.ops.create_cube(out, size=1.0, matrix=Matrix.Translation(front + Vector((0, -0.006, 0))) @ Matrix.Diagonal((0.055, 0.012, 0.05, 1)))
    out.normal_update()
    bmesh.ops.recalc_face_normals(out, faces=out.faces[:])
    mesh = bpy.data.meshes.new('Belt')
    out.to_mesh(mesh)
    out.free()
    obj = bpy.data.objects.new('Belt', mesh)
    bpy.context.collection.objects.link(obj)
    # mostly on the hips, partly following the torso like the clothes under it
    for name, w in (('pelvis', 0.6), ('spine_01', 0.4)):
        g = obj.vertex_groups.new(name=name)
        g.add([v.index for v in mesh.vertices], w, 'REPLACE')
    return obj


def group_center(human, group):
    gi = human.vertex_groups[group].index
    pts = [v.co for v in human.data.vertices if any(g.group == gi and g.weight > 0.5 for g in v.groups)]
    c = sum(pts, Vector()) / len(pts)
    r = sum((p - c).length for p in pts) / len(pts)
    return c, r


def build_all(human, rig, helpers):
    global H
    H = helpers
    parts = {}

    landmarks(human, rig)
    axis_y = rig.data.bones['pelvis'].head_local.y
    # the belt sits at the height of the front of the skirt helper's waist band
    L['belt_top'] = max(v.co.z for v in shell_verts(human, 'helper-skirt') if v.co.y < axis_y - 0.07) + 0.004
    neck = rig.data.bones['neck_01'].head_local

    def neckline(co):
        # a round neck opening: low in front, at the base of the neck behind
        d = math.hypot(co.x, co.y - neck.y)
        if d > 0.14:
            return True
        front = max(0.0, min(1.0, (neck.y - co.y) / 0.08))
        return co.z < L['neck'] - 0.012 - 0.055 * front

    shirt = split_shell(human, rig, 'helper-tights', 'Shirt',
                        lambda v, b, co: co.z > L['belt_top'] - 0.1 and b in UPPER | {'pelvis'} and neckline(co))
    H['offset'](shirt, 0.004)
    relax_edges(shirt, 4)
    parts['Shirt'] = shirt

    hose = split_shell(human, rig, 'helper-tights', 'Hose', lambda v, b, co: co.z < L['waist'] + 0.02 and (b in LEGS or b == 'pelvis'))
    H['offset'](hose, 0.002)
    parts['Hose'] = hose

    boots = split_shell(human, rig, 'helper-tights', 'Boots', lambda v, b, co: co.z < L['boot'] and b in LEGS)
    H['offset'](boots, 0.009)
    parts['Boots'] = boots

    skirt = split_shell(human, rig, 'helper-skirt', 'Skirt', lambda v, b, co: co.z > L['hem'])
    H['offset'](skirt, 0.018)
    # the skirt starts under the belt with a level top edge
    belt_top = L['belt_top']
    top = belt_top - 0.012
    for v in skirt.data.vertices:
        v.co.z = min(v.co.z, top)
    flare(skirt, top, L['hem'], axis_y, 0.45)
    slit_top = L['hem'] + 0.68 * (top - L['hem'])
    slit(skirt, axis_y, slit_top)
    reweight_skirt(skirt, top, L['hem'], slit_top)
    parts['Skirt'] = skirt
    parts['Belt'] = make_belt([shirt, skirt], belt_top, axis_y)

    parts['Scalp'] = scalp(human)

    for name, mat in [('Shirt', 'shirt'), ('Hose', 'hose'), ('Boots', 'boots'), ('Skirt', 'skirt'), ('Belt', 'belt')]:
        H['set_material'](parts[name], mat)
        H['shade_smooth'](parts[name])
    return parts


def scalp(human):
    """The skin where hair grows on the head (to size the helmets)."""
    eye_l, _ = group_center(human, 'helper-l-eye')
    ears = human.vertex_groups['ears'].index
    top = human.vertex_groups['scalp'].index

    def region(v):
        groups = human.data.vertices[v.index].groups
        if any(g.group == ears and g.weight > 0.3 for g in groups):
            return False
        if any(g.group == top and g.weight > 0.5 for g in groups):
            return True
        co = v.co
        # back and sides of the head down to the nape, behind the temples
        behind = co.y - (eye_l.y + 0.07)
        return behind > 0 and co.z > eye_l.z - 0.07 + max(0.0, 0.03 - behind) * 1.5

    obj = H['extract'](human, ['body'], 'Scalp', keep=region)
    H['offset'](obj, 0.005)
    return obj
