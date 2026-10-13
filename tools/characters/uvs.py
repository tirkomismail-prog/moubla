"""UVs whose v runs along the body or the limb (stage 4.1), for the
garments whose tiles have a direction: the rows of mail, the quilting of a
gambeson, the plates of lamellar, the weave of cloth.

Each face belongs to a segment by the bones that weigh most on it: the
torso, the skirt below the belt, a belt sewn on, or a bone of a limb (upper
arm, forearm, hand, thigh, calf, foot), each a rough cylinder round its own
axis. The seams go between the torso, the skirt, each arm and each leg, and
where each cylinder is cut open: under the arm, inside the leg, down both
sides of the body and the skirt (a front and a back, as a tunic is sewn: no
seam across the front, the flare leans the skirt's pattern by up to about
20 degrees at the sides), a belt in four (else its knot in front folds
flat); a mail coif in three equal pieces, one through the face, a hood in
four gores (as each was cut).
Blender unwraps the islands with the least distortion (angle based), and
each island is then turned so that its axis runs up v, at one UV unit to
the metre, and packed without turning, with margins between the islands:
UV / k (k: the piece's scale) is an atlas (where the cloth is slit or
folded an island laps over itself, at most two thousandths of its area:
the hoods' throats, the slits at the front of the skirts, the gambeson's
armpits, the knot of the kyrtle's belt).
"""
import math
import statistics

import bmesh
import bpy
from mathutils import Vector

ARM = ('upperarm', 'lowerarm', 'hand', 'thumb', 'index', 'middle', 'ring', 'pinky')
# a limb's bones by the segment they belong to (fingers go with the hand,
# the ball of the foot with the foot)
SEGMENT = {'upperarm': 'upperarm', 'lowerarm': 'lowerarm', 'hand': 'hand', 'thumb': 'hand', 'index': 'hand',
           'middle': 'hand', 'ring': 'hand', 'pinky': 'hand', 'thigh': 'thigh', 'calf': 'calf', 'foot': 'foot',
           'ball': 'foot'}
MARGIN = 0.01  # between the islands, of the atlas


def segment_of(bone, legged):
    """(region, segment) of a bone: a limb's bone (a leg's only for clothes
    with legs: on a skirt the thighs' faces are the skirt), else the torso."""
    if bone and bone[-2:] in ('_l', '_r'):
        side = bone[-1]
        seg = SEGMENT.get(bone[:-2].split('_')[0])
        if seg:
            if bone.startswith(ARM):
                return 'arm_' + side, seg + '_' + side
            if legged:
                return 'leg_' + side, seg + '_' + side
    return 'torso', 'torso'


# where a segment is cut open: the direction of the first cut and the number
# of equal pieces round the axis (the other cuts at equal angles from it)
SIDES = (Vector((1, 0, 0)), 2)
GORES = (Vector((1, 0, 0)), 4)


def axes(rig):
    """Per segment: a point on its axis, its 'up' (towards the shoulder or
    the hip on a limb, up the body on the torso) and where it is cut open
    round it (see SIDES)."""
    b = rig.data.bones
    pel = b['pelvis'].head_local
    centre = Vector((pel.x, pel.y, 0.0))
    up = Vector((0, 0, 1))
    head = b['head'].head_local
    round_head = Vector((head.x, head.y, 0.0))
    out = {'torso': (centre, up, SIDES),
           'skirt': (centre, up, SIDES),
           # (a belt sewn on: in four, through the knot in front)
           'belt': (centre, up, GORES),
           # (head wear and its cape round the head: a coif in three equal
           # pieces, one through the face)
           'coif': (round_head, up, (Vector((0, -1, 0)), 3)),
           'hood': (round_head, up, GORES)}
    chains = (('upperarm', 'lowerarm', 'hand', None), ('thigh', 'calf', 'foot', None))
    for s, side in (('l', 1), ('r', -1)):
        for chain in chains:
            for seg, tail in zip(chain, chain[1:]):
                bone = b[seg + '_' + s]
                end = b[tail + '_' + s].head_local if tail else bone.tail_local
                a = (bone.head_local - end).normalized()
                # under the arm, inside the leg
                towards = Vector((0, 0, -1)) if chain[0] == 'upperarm' else Vector((-side, 0, 0))
                cut = towards - a * towards.dot(a)
                if cut.length < 1e-3:
                    cut = Vector((0, 1, 0)) - a * a.y
                out[seg + '_' + s] = (bone.head_local.copy(), a, (cut.normalized(), 1))
    return out


def sewn_belt(me, part, belt_part, centre, sectors=12):
    """The middle of a belt sewn on (the faces whose part is belt_part) as a
    function of a point: in each of `sectors` equal angles round `centre`,
    its top edge less half its height (the median over the angles: its
    hanging end, at the front, does not count)."""
    top = {}
    bottom = {}

    def sector(co):
        d = co - centre
        return int(math.atan2(d.y, d.x) % (2 * math.pi) * sectors / (2 * math.pi)) % sectors
    for p in me.polygons:
        if part[p.index] != belt_part:
            continue
        for i in p.vertices:
            co = me.vertices[i].co
            k = sector(co)
            top[k] = max(top.get(k, -math.inf), co.z)
            bottom[k] = min(bottom.get(k, math.inf), co.z)
    if not top:
        return None
    half = statistics.median(top[k] - bottom[k] for k in top) / 2
    lowest = min(top.values())
    return lambda co: top.get(sector(co), lowest) - half


def face_segments(obj, rig, belt, legged, head=None, belt_part=None):
    """(region, segment) of each face, by the bones weighing most on its
    corners; the torso's faces wholly below the top of the belt are the skirt
    (the seam between them hides under the belt). A belt sewn on (its faces'
    `_sub` = belt_part, viking.SUBPARTS) goes round the waist apart, and the
    skirt is then the faces whose middle is below the middle of that belt
    (the outfits' belts are not worn over it; the cloth under it has a row of
    faces as tall as the belt, and the seam zigzags through them). (Head
    wear, head = 'coif' or 'hood': all one segment round the head.)"""
    if head:
        return [(head, head)] * len(obj.data.polygons)
    me = obj.data
    sub = me.attributes.get('_sub') if belt_part is not None else None
    part = [0] * len(me.polygons)
    middle = None
    if sub is not None:
        sub.data.foreach_get('value', part)
        middle = sewn_belt(me, part, belt_part, rig.data.bones['pelvis'].head_local)
    names = {b.name for b in rig.data.bones}
    group = {g.index: g.name for g in obj.vertex_groups if g.name in names}
    per_vert = []
    for v in me.vertices:
        acc = {}
        for g in v.groups:
            if g.group in group:
                k = segment_of(group[g.group], legged)
                acc[k] = acc.get(k, 0.0) + g.weight
        per_vert.append(acc)
    out = []
    for p in me.polygons:
        acc = {}
        for i in p.vertices:
            for k, w in per_vert[i].items():
                acc[k] = acc.get(k, 0.0) + w
        seg = max(acc, key=acc.get) if acc else ('torso', 'torso')
        if sub is not None and part[p.index] == belt_part:
            seg = ('belt', 'belt')
        elif seg[0] == 'torso' and (p.center.z < middle(p.center) if middle
                                    else max(me.vertices[i].co.z for i in p.vertices) < belt):
            seg = ('skirt', 'skirt')
        out.append(seg)
    return out


def mark_seams(bm, segs, ax):
    """Seams where the regions meet (the torso, the skirt, the belt, each
    arm, each leg: a limb's segments run on in one island), where each
    segment is cut open, and between the outside and the inside of cloth
    with a thickness (a hood, the kyrtle: faces turned towards the axis are
    its inside)."""
    angle = []
    piece = []
    inside = []
    for f in bm.faces:
        c, a, (x, n) = ax[segs[f.index][1]]
        p = f.calc_center_median() - c
        p -= a * p.dot(a)
        t = math.atan2(p.dot(a.cross(x)), p.dot(x)) % (2 * math.pi)
        angle.append(t)
        piece.append(int(t * n / (2 * math.pi)) % n)
        inside.append(p.length > 1e-6 and f.normal.dot(p.normalized()) < -0.3)
    for e in bm.edges:
        e.seam = False
        if len(e.link_faces) != 2:
            continue
        i, j = (f.index for f in e.link_faces)
        # (across the first cut the angle jumps from 2 pi to 0)
        if segs[i][0] != segs[j][0] or piece[i] != piece[j] or abs(angle[i] - angle[j]) > math.pi or inside[i] != inside[j]:
            e.seam = True


def islands(bm, uvl):
    """The UV islands: faces joined by edges whose UVs agree on both sides."""
    parent = list(range(len(bm.faces)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    for e in bm.edges:
        if len(e.link_loops) != 2:
            continue
        l1, l2 = e.link_loops
        # (the two faces run along the edge the opposite ways)
        if (l1[uvl].uv - l2.link_loop_next[uvl].uv).length < 1e-6 and (l1.link_loop_next[uvl].uv - l2[uvl].uv).length < 1e-6:
            parent[find(l1.face.index)] = find(l2.face.index)
    out = {}
    for f in bm.faces:
        out.setdefault(find(f.index), []).append(f)
    return list(out.values())


def upright(faces, uvl, segs, ax):
    """Turn an island so that its axis runs up v (the mean direction, by
    area, in which the height along the axis grows) and scale it to metres."""
    gx = gy = area3 = area2 = 0.0
    for f in faces:
        c, a = ax[segs[f.index][1]][:2]
        ls = list(f.loops)
        for k in range(1, len(ls) - 1):
            tri = (ls[0], ls[k], ls[k + 1])
            u = [lp[uvl].uv for lp in tri]
            h = [(lp.vert.co - c).dot(a) for lp in tri]
            du1, du2 = u[1] - u[0], u[2] - u[0]
            det = du1.x * du2.y - du1.y * du2.x
            if abs(det) < 1e-14:
                continue
            # the gradient of the height in UV: h(u) = h0 + g . (u - u0)
            dh1, dh2 = h[1] - h[0], h[2] - h[0]
            g = Vector(((dh1 * du2.y - dh2 * du1.y) / det, (du1.x * dh2 - du2.x * dh1) / det))
            a3 = (tri[1].vert.co - tri[0].vert.co).cross(tri[2].vert.co - tri[0].vert.co).length / 2
            if g.length > 0:
                gx += g.x / g.length * a3
                gy += g.y / g.length * a3
            area3 += a3
            area2 += abs(det) / 2
    turn = math.pi / 2 - math.atan2(gy, gx)
    s = math.sqrt(area3 / max(area2, 1e-14))
    cs, sn = math.cos(turn) * s, math.sin(turn) * s
    for f in faces:
        for lp in f.loops:
            u = lp[uvl].uv.copy()
            lp[uvl].uv = (u.x * cs - u.y * sn, u.x * sn + u.y * cs)


def axis_uvs(obj, rig, belt, legged=False, head=None, belt_part=None):
    """New UVs (UVMap, in metres) for a garment, see above (belt: the
    height of the top of the belt; head: 'coif' or 'hood' for head wear;
    belt_part: see face_segments). Returns the number of islands."""
    ax = axes(rig)
    segs = face_segments(obj, rig, belt, legged, head, belt_part)
    me = obj.data
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.faces.ensure_lookup_table()
    bm.normal_update()
    mark_seams(bm, segs, ax)
    bm.to_mesh(me)
    bm.free()
    while me.uv_layers:
        me.uv_layers.remove(me.uv_layers[0])
    me.uv_layers.new(name='UVMap')
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=MARGIN)
    bpy.ops.object.mode_set(mode='OBJECT')
    bm = bmesh.new()
    bm.from_mesh(me)
    uvl = bm.loops.layers.uv.active
    parts = islands(bm, uvl)
    for faces in parts:
        upright(faces, uvl, segs, ax)
    bm.to_mesh(me)
    bm.free()
    # packed without turning (the islands keep their scale to each other),
    # by their outlines: the gores and the torso fill their boxes poorly
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.select_all(action='SELECT')
    bpy.ops.uv.pack_islands(rotate=False, scale=True, margin_method='FRACTION', margin=MARGIN, shape_method='CONCAVE')
    bpy.ops.object.mode_set(mode='OBJECT')
    to_metres(me)
    return len(parts)


def to_metres(me):
    """Scale the UVs so that one unit is one metre on the surface."""
    uv = me.uv_layers['UVMap']
    area3 = sum(p.area for p in me.polygons)
    area2 = 0.0
    for p in me.polygons:
        pts = [uv.data[i].uv.copy() for i in p.loop_indices]
        area2 += abs(sum(pts[i].x * pts[i - 1].y - pts[i - 1].x * pts[i].y for i in range(len(pts)))) / 2
    k = math.sqrt(area3 / max(area2, 1e-9))
    for d in uv.data:
        d.uv = d.uv * k
