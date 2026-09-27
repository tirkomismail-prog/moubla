"""Clothes, hair and eyes for the soldier, built from the MakeHuman helper
shells (tights, skirt) and from regions of the body mesh."""
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


def head_only(obj):
    for g in list(obj.vertex_groups):
        obj.vertex_groups.remove(g)
    g = obj.vertex_groups.new(name='head')
    g.add([v.index for v in obj.data.vertices], 1.0, 'REPLACE')


def color_layer(obj, fn):
    me = obj.data
    attr = me.color_attributes.get('Col') or me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    me.color_attributes.active_color = attr
    for v in me.vertices:
        c = fn(v)
        attr.data[v.index].color = (c[0], c[1], c[2], 1.0)


def edge_fade(obj, width):
    """Store in the vertex colour alpha how far each vertex is from the open
    edge of the mesh (0 at the edge, 1 deeper than `width`); the game uses it
    to fray the outline of hair and beards."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    dist = {v.index: (0.0 if v.is_boundary else math.inf) for v in bm.verts}
    frontier = [v for v in bm.verts if v.is_boundary]
    while frontier:
        nxt = []
        for v in frontier:
            for e in v.link_edges:
                o = e.other_vert(v)
                d = dist[v.index] + e.calc_length()
                if d < dist[o.index]:
                    dist[o.index] = d
                    nxt.append(o)
        frontier = nxt
    bm.free()
    me = obj.data
    attr = me.color_attributes.get('Col') or me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    me.color_attributes.active_color = attr
    for v in me.vertices:
        a = min(1.0, dist[v.index] / width) if dist[v.index] != math.inf else 1.0
        attr.data[v.index].color = (1.0, 1.0, 1.0, a)


def group_center(human, group):
    gi = human.vertex_groups[group].index
    pts = [v.co for v in human.data.vertices if any(g.group == gi and g.weight > 0.5 for g in v.groups)]
    c = sum(pts, Vector()) / len(pts)
    r = sum((p - c).length for p in pts) / len(pts)
    return c, r


def make_eye(center, radius, name):
    """An eyeball with sclera, iris and pupil painted in vertex colours."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=radius)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = center
    fwd = Vector((0, -1, 0))

    def col(v):
        d = v.co.normalized().dot(fwd)
        if d > 0.93:
            return (0.03, 0.02, 0.02)
        if d > 0.8:
            return (0.28, 0.2, 0.12)
        return (0.86, 0.84, 0.8)

    color_layer(obj, col)
    H['shade_smooth'](obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=True)
    obj.select_set(False)
    head_only(obj)
    return obj


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

    lips, _ = group_center(human, 'lips')
    eye_l, eye_r_rad = group_center(human, 'helper-l-eye')
    eye_r, _ = group_center(human, 'helper-r-eye')
    ears = human.vertex_groups['ears'].index

    scalp = human.vertex_groups['scalp'].index

    def hair_region(v):
        groups = human.data.vertices[v.index].groups
        if any(g.group == ears and g.weight > 0.3 for g in groups):
            return False
        if any(g.group == scalp and g.weight > 0.5 for g in groups):
            return True
        co = v.co
        # back and sides of the head down to the nape, behind the temples
        behind = co.y - (eye_l.y + 0.07)
        return behind > 0 and co.z > eye_l.z - 0.07 + max(0.0, 0.03 - behind) * 1.5

    hair = H['extract'](human, ['body'], 'Hair', keep=hair_region)
    H['offset'](hair, 0.005)
    head_only(hair)
    edge_fade(hair, 0.012)
    parts['Hair'] = hair

    def beard_region(v):
        co = v.co
        dy = co.y - lips.y  # 0 at the lips, growing towards the back of the head
        dz = co.z - lips.z
        if dy > 0.115 or dz > 0.028:
            return False
        if dz < -0.075 + 0.35 * max(0.0, dy - 0.05):
            return False  # follow the jaw line, keep the neck bare
        if abs(co.x) < 0.028 and abs(dz) < 0.012 and dy < 0.03:
            return False  # the lips themselves
        if dz > 0.012 and abs(co.x) < 0.016 and dy < -0.004:
            return False  # nostrils
        if dz > 0.012 and abs(co.x) > 0.05:
            return False  # upper cheeks stay bare
        return True

    beard = H['extract'](human, ['body'], 'Beard', keep=beard_region)
    H['offset'](beard, 0.0025)
    head_only(beard)
    edge_fade(beard, 0.01)
    parts['Beard'] = beard

    parts['EyeL'] = make_eye(eye_l, eye_r_rad * 1.02, 'EyeL')
    parts['EyeR'] = make_eye(eye_r, eye_r_rad * 1.02, 'EyeR')

    for name, mat in [('Shirt', 'shirt'), ('Hose', 'hose'), ('Boots', 'boots'), ('Skirt', 'skirt'), ('Belt', 'belt'),
                      ('Hair', 'hair'), ('Beard', 'hair'), ('EyeL', 'eye'), ('EyeR', 'eye')]:
        H['set_material'](parts[name], mat)
        H['shade_smooth'](parts[name])
    return parts


def paint_face(body, human):
    """Vertex colours that modulate the skin tone: lips, brows, cheeks."""
    lips, _ = group_center(human, 'lips')
    eye_l, _ = group_center(human, 'helper-l-eye')
    lip_idx = set()
    gi = body.vertex_groups['lips'].index if 'lips' in body.vertex_groups else None
    if gi is not None:
        for v in body.data.vertices:
            if any(g.group == gi and g.weight > 0.5 for g in v.groups):
                lip_idx.add(v.index)
    nails = body.vertex_groups['fingernails'].index if 'fingernails' in body.vertex_groups else None

    def col(v):
        co = v.co
        c = [1.0, 1.0, 1.0]
        if v.index in lip_idx:
            return (0.86, 0.62, 0.6)
        if nails is not None and any(g.group == nails and g.weight > 0.5 for g in v.groups):
            return (1.08, 1.0, 0.98)
        # brows
        bx = abs(co.x) - abs(eye_l.x)
        bz = co.z - (eye_l.z + 0.022)
        if co.y < eye_l.y + 0.035 and abs(bx) < 0.026 and abs(bz - bx * 0.12) < 0.0065:
            k = 1 - abs(bx) / 0.026
            return (1 - 0.55 * k, 1 - 0.6 * k, 1 - 0.62 * k)
        # warmer cheeks, nose and ears
        dc = math.hypot(abs(co.x) - 0.045, co.z - (lips.z + 0.03))
        if co.y < eye_l.y + 0.045 and dc < 0.03:
            k = 1 - dc / 0.03
            c = [1.0, 1 - 0.07 * k, 1 - 0.07 * k]
        # a little darker around the eyes
        de = math.hypot(abs(co.x) - abs(eye_l.x), co.z - eye_l.z)
        if co.y < eye_l.y + 0.045 and de < 0.024:
            k = 1 - de / 0.024
            c = [c[0] - 0.1 * k, c[1] - 0.12 * k, c[2] - 0.1 * k]
        return tuple(c)

    color_layer(body, col)
