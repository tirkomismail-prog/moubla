"""A mail coif: a hood of mail over a padded arming cap, open for the face,
falling from the head onto the shoulders as a short mantle (13th-14th c.;
worn under the kettle hat, the nasal helmet and the great helm).

Built as rows of points round a vertical axis through the head. Each column
(a half-plane through the axis) hangs like mail:

* over the skull it lies on the skin plus the cap's padding, made convex
  in the column and in each row (it bridges the ears and the temples);
* below the widest point of the head it comes in towards the neck no
  faster than DRAPE (it hangs from the chin, the jaw and the back of the
  head instead of wrapping the neck), resting on the garments under it;
* the mantle's rows are measured along the column from the neck row, so
  the hem is MANTLE below it whether the column goes down the chest or out
  over the shoulder (short of the pauldrons, which lie over it).

The mantle lies on the outer garment of an outfit, so there is one coif
per garment (VARIANTS); their heads are the same. Skinned with the body's
weights (nearest face), smoothed along the rows and columns.
"""
import math

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

import garments as G
import helmets as HM

N = 28                      # columns round the head
PAD = 0.008                 # padded cap and mail over the skin of the head
GAP = 0.006                 # mail over the garments
DRAPE = 0.25                # dr/dz: how fast hanging mail comes in towards the neck
MANTLE = 0.15               # the mantle's length below the neck row, along it
MANTLE_ROWS = (0.025, 0.055, 0.09, 0.125, MANTLE)
OPEN = math.radians(58)     # half-angle of the face opening at its widest
LIP = 0.005                 # the opening's rim turned in (its thickness)
STEP = 0.003                # height step of the columns' profiles
STOP_SHORT = 0.015          # how far short of the pauldrons a mantle ends
# the outer garments each coif's mantle lies on (the hauberk under them)
VARIANTS = {'Coif-Surcoat': ('Hauberk', 'Surcoat'), 'Coif-Jupon': ('Hauberk', 'Jupon', 'Plates')}


def tree_of(objs):
    bm = bmesh.new()
    for o in objs:
        bm.from_mesh(o.data)
    bm.normal_update()
    t = BVHTree.FromBMesh(bm)
    bm.free()
    return t


class Head:
    """Heights of the head (from the skin) and the axis the coif is built round."""

    def __init__(self, human, rig, body):
        neck = rig.data.bones['neck_01'].head_local
        skull = HM.Skull(human, neck.z)
        eye, _ = G.group_center(human, 'helper-l-eye')
        lips, _ = G.group_center(human, 'lips')
        self.neck = neck.z
        self.top = skull.top
        self.eye = eye.z
        # the bottom of the chin: the lowest skin in front under the lips
        self.chin = min(v.co.z for v in body.data.vertices
                        if abs(v.co.x) < 0.012 and neck.z < v.co.z < lips.z and v.co.y < lips.y + 0.03)
        self.axis = skull.at(eye.z)[0]
        # the face opening: from under the chin to above the brows
        self.open_lo = self.chin - 0.012
        self.open_hi = eye.z + 0.06
        # the last row by height; the mantle's rows hang from it
        self.neck_row = self.chin - 0.025

    def opening(self, z):
        """Half-angle of the face opening at height z (0 outside it): a
        rounded oval, widest a little above the middle."""
        if not self.open_lo < z < self.open_hi:
            return 0.0
        mid = 0.45 * self.open_lo + 0.55 * self.open_hi
        t = (z - mid) / ((self.open_hi - self.open_lo) * (0.55 if z < mid else 0.45))
        return OPEN * max(0.0, 1 - abs(t) ** 2.5) ** 0.4

    def direction(self, a):
        """Outwards from the axis at angle a (0 is the front, -Y)."""
        return Vector((math.sin(a), -math.cos(a), 0.0))

    def point(self, a, r, z):
        return Vector((0.0, self.axis, z)) + self.direction(a) * r


def face_angle(a):
    """Angle from the front, 0 .. pi."""
    a = math.fmod(a, 2 * math.pi)
    return min(a, 2 * math.pi - a)


class Column:
    """The coif's line in the half-plane at angle a: the radius at any height
    (by height) and its points below the neck row (by length along it)."""

    def __init__(self, head, layers, a, stop=None):
        self.head = head
        d = head.direction(a)
        z_hi = head.top + 0.004
        z_lo = head.neck_row - MANTLE - 0.12
        zs = []
        # heights where the layer `stop` (the plates) is the outermost
        self.stops = []
        z = z_hi
        while z > z_lo:
            zs.append(z)
            z -= STEP
        # the outermost layer along a ray from outside (each layer with its gap)
        samples = []
        for z in zs:
            c = head.point(a, 0.0, z)
            best = None
            for k, (tree, gap) in enumerate(layers):
                hit, n, _, _ = tree.ray_cast(c + d * 0.6, -d, 0.6)
                if hit is None:
                    continue
                if n.dot(d) < 0:
                    n = -n
                p = hit + n * gap
                r = (p - Vector((0.0, head.axis, p.z))).length
                if best is None or r > best[0]:
                    best = (r, k)
            # (inside the face opening: holds the mail hanging under it out,
            # but is no part of the hood's shape)
            face = face_angle(a) < head.opening(z)
            samples.append((best[0] if best else 0.0, z, face))
            if stop is not None and best and best[1] == stop:
                self.stops.append(z)
        # the head: convex down to its widest point
        above = [(r, z) for r, z, face in samples if not face and z > head.neck]
        _, z_w = max(above)
        hull = upper_hull(sorted([(z, r) for r, z in above if z >= z_w] + [(head.top + PAD, 0.0)]))
        out = []
        prev = None
        for r, z, face in samples:
            if z >= z_w:
                v = interp(hull, z)
            else:
                v = max(r, prev - DRAPE * STEP)
            out.append(v)
            prev = v
        self.zs = zs
        self.rs = out
        self.a = a

    def at(self, z):
        """Radius at height z."""
        zs, rs = self.zs, self.rs
        if z >= zs[0]:
            return rs[0]
        for i in range(1, len(zs)):
            if zs[i] <= z:
                t = (zs[i - 1] - z) / (zs[i - 1] - zs[i])
                return rs[i - 1] + (rs[i] - rs[i - 1]) * t
        return rs[-1]

    def below(self, z0, lengths):
        """Points at the given lengths along the column below height z0; the
        lengths shortened to end before the layer `stop`, if it is in reach."""
        pts = [(self.at(z0), z0)] + [(r, z) for r, z in zip(self.rs, self.zs) if z < z0]
        stops = [z for z in self.stops if z < z0]
        if stops:
            run = 0.0
            for (r0, za), (r1, zb) in zip(pts, pts[1:]):
                if zb <= stops[0]:
                    break
                run += math.hypot(r1 - r0, zb - za)
            cap = run - STOP_SHORT
            if cap < lengths[-1]:
                lengths = [x * max(cap, 0.3 * lengths[-1]) / lengths[-1] for x in lengths]
        out = []
        run = 0.0
        k = 0
        for s in lengths:
            while k + 1 < len(pts):
                seg = math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1])
                if run + seg >= s:
                    t = (s - run) / max(seg, 1e-9)
                    r = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t
                    z = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t
                    out.append(self.head.point(self.a, r, z))
                    break
                run += seg
                k += 1
            else:
                out.append(self.head.point(self.a, *pts[-1]))
        return out


def upper_hull(pts):
    """The upper convex hull of (x, y) points sorted by x."""
    h = []
    for p in pts:
        while len(h) >= 2 and (h[-1][0] - h[-2][0]) * (p[1] - h[-2][1]) - (h[-1][1] - h[-2][1]) * (p[0] - h[-2][0]) >= 0:
            h.pop()
        h.append(p)
    return h


def interp(hull, x):
    for i in range(1, len(hull)):
        if hull[i][0] >= x:
            x0, y0 = hull[i - 1]
            x1, y1 = hull[i]
            return y0 + (y1 - y0) * (x - x0) / max(x1 - x0, 1e-9)
    return hull[-1][1]


def convex_row(head, pts):
    """Push the points of a row out onto their convex hull (seen from above),
    each along its own direction from the axis."""
    c = Vector((0.0, head.axis))
    flat = [Vector((p.x, p.y)) for p in pts]
    # (Andrew's monotone chain)
    s = sorted(set((round(p.x, 6), round(p.y, 6)) for p in flat))
    if len(s) < 3:
        return pts

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in s:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(s):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    poly = [Vector(p) for p in lower[:-1] + upper[:-1]]
    out = []
    for p, f in zip(pts, flat):
        d = f - c
        if d.length < 1e-6:
            out.append(p)
            continue
        d.normalize()
        best = d.dot(f - c)
        # the farthest crossing of the ray from the axis with the hull
        for i in range(len(poly)):
            a, b = poly[i], poly[(i + 1) % len(poly)]
            e = b - a
            den = d.x * e.y - d.y * e.x
            if abs(den) < 1e-12:
                continue
            w = a - c
            t = (w.x * e.y - w.y * e.x) / den
            u = (w.x * d.y - w.y * d.x) / den
            if 0 <= u <= 1 and t > best:
                best = t
        q = c + d * best
        out.append(Vector((q.x, q.y, p.z)))
    return out


def head_rows(head):
    """Heights of the rows over the head, from the crown down to the neck row:
    closer together across the face opening, whose edge they make."""
    zs = [head.top - 0.012, head.top - 0.03]
    k = 11
    for i in range(k + 1):
        zs.append(head.open_hi + (head.open_lo - head.open_hi) * i / k)
    zs.append(head.neck_row)
    return zs


def build_one(head, layers, name, stop=None):
    rows = []      # lists of N + 1 points, from the crown down
    opened = []    # half-angle of the opening of each row (0: closed)
    columns = {}

    def column(a):
        key = round(a, 5)
        if key not in columns:
            columns[key] = Column(head, layers, a, stop)
        return columns[key]
    for z in head_rows(head):
        a0 = head.opening(z)
        angles = [a0 + (2 * math.pi - 2 * a0) * j / N for j in range(N + 1)]
        pts = [head.point(a, column(a).at(z), z) for a in angles]
        if z > head.neck - 0.02:
            pts = convex_row(head, pts)
        rows.append(pts)
        opened.append(a0)
    angles = [2 * math.pi * j / N for j in range(N + 1)]
    hang = [column(a).below(head.neck_row, MANTLE_ROWS) for a in angles]
    for k in range(len(MANTLE_ROWS)):
        rows.append([hang[j][k] for j in range(N + 1)])
        opened.append(0.0)

    # vertices: closed rows share their first and last point
    verts = []
    index = []
    for pts, a0 in zip(rows, opened):
        ids = []
        for j, p in enumerate(pts):
            if a0 == 0.0 and j == N:
                ids.append(ids[0])
                continue
            ids.append(len(verts))
            verts.append(p)
        index.append(ids)
    apex = len(verts)
    verts.append(Vector((0.0, head.axis, head.top + PAD)))
    faces = []
    for j in range(N):
        faces.append((index[0][j + 1], index[0][j], apex))
    for i in range(len(rows) - 1):
        for j in range(N):
            a, b = index[i][j], index[i][j + 1]
            c, d = index[i + 1][j + 1], index[i + 1][j]
            quad = [a, b, c, d]
            # (where an open row meets a closed one the corner is shared)
            uniq = [q for k, q in enumerate(quad) if q not in quad[:k]]
            if len(uniq) >= 3:
                faces.append(tuple(uniq))
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.update()
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    # (the grid is wound alike): it faces out at the back of the head
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.normal_update()
    back = index[len(rows) // 3][N // 2]
    probe = next(f for f in bm.faces if back in [v.index for v in f.verts])
    if probe.normal.dot(probe.calc_center_median() - Vector((0.0, head.axis, head.eye))) < 0:
        for f in bm.faces:
            f.normal_flip()
    bm.to_mesh(me)
    bm.free()
    moved = clear(obj, layers, GAP)

    # the opening's rim turned in: a narrow band facing the face
    rim = [index[i][0] for i in range(len(rows)) if opened[i] > 0]
    rim_r = [index[i][N] for i in range(len(rows)) if opened[i] > 0]
    first = next(i for i in range(len(rows)) if opened[i] > 0)
    last = max(i for i in range(len(rows)) if opened[i] > 0)
    loop = [index[first - 1][0]] + rim + [index[last + 1][0]] + rim_r[::-1]
    bm = bmesh.new()
    bm.from_mesh(me)
    old = list(bm.verts)
    inner = {}
    for v in set(loop):
        p = old[v].co
        d = Vector((p.x, p.y - head.axis, 0.0))
        inner[v] = bm.verts.new(p - d.normalized() * LIP)
    band = [bm.faces.new((old[a], inner[a], inner[b], old[b]))
            for a, b in zip(loop, loop[1:] + loop[:1])]
    bm.normal_update()
    centre = Vector((0.0, head.axis - 0.15, 0.5 * (head.open_lo + head.open_hi)))
    f0 = band[len(band) // 4]
    if f0.normal.dot(centre - f0.calc_center_median()) < 0:
        for f in band:
            f.normal_flip()
    bm.to_mesh(me)
    bm.free()
    me.update()
    return obj, moved


def clear(obj, layers, mn, rounds=3):
    """Nothing closer than mn (or a layer's own gap, if less) to the layers
    under it (the skin first): checked at the points, and over the garments
    also at the middles of the edges and of the faces (the coif's faces are
    wider than the curves of the garments under them); the points pushed
    out along their normals."""
    moved = set()
    for _ in range(rounds):
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        bm.normal_update()
        need = [0.0] * len(bm.verts)
        probes = [(v.co, (v,), True) for v in bm.verts]
        probes += [((e.verts[0].co + e.verts[1].co) / 2, tuple(e.verts), False) for e in bm.edges]
        probes += [(f.calc_center_median(), tuple(f.verts), False) for f in bm.faces]
        for co, vs, point in probes:
            for k, (tree, gap) in enumerate(layers):
                # (the skin under the head only at the points: the head is
                # convex and its rim lies on the face's features)
                if k == 0 and not point:
                    continue
                loc, n, _, dist = tree.find_nearest(co, 0.05)
                if loc is None:
                    continue
                s = (co - loc).dot(n)
                want = min(mn, gap)
                if s < want and abs(s) > 0.8 * dist:
                    for v in vs:
                        need[v.index] = max(need[v.index], want - s)
        if not any(need):
            bm.free()
            break
        for v in bm.verts:
            if need[v.index]:
                v.co += v.normal * need[v.index]
                moved.add(v.index)
        bm.to_mesh(obj.data)
        bm.free()
        obj.data.update()
    return len(moved)


def skin(obj, body, rig, iters=3):
    """The body's weights (nearest face, interpolated), smoothed over the
    coif's grid."""
    for g in body.vertex_groups:
        if g.name in rig.data.bones and g.name not in obj.vertex_groups:
            obj.vertex_groups.new(name=g.name)
    m = obj.modifiers.new('DT', 'DATA_TRANSFER')
    m.object = body
    m.use_vert_data = True
    m.data_types_verts = {'VGROUP_WEIGHTS'}
    m.vert_mapping = 'POLYINTERP_NEAREST'
    m.layers_vgroup_select_src = 'ALL'
    m.layers_vgroup_select_dst = 'NAME'
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier='DT')
    me = obj.data
    nb = [set() for _ in me.vertices]
    for e in me.edges:
        a, b = e.vertices
        nb[a].add(b)
        nb[b].add(a)
    w = [{g.group: g.weight for g in v.groups if g.weight > 0} for v in me.vertices]
    for _ in range(iters):
        new = []
        for i, ws in enumerate(w):
            acc = {k: 0.5 * x for k, x in ws.items()}
            for j in nb[i]:
                for k, x in w[j].items():
                    acc[k] = acc.get(k, 0.0) + 0.5 * x / len(nb[i])
            new.append(acc)
        w = new
    for i, ws in enumerate(w):
        top = sorted(ws.items(), key=lambda kv: -kv[1])[:4]
        total = sum(x for _, x in top) or 1.0
        for g in obj.vertex_groups:
            g.remove([i])
        for k, x in top:
            obj.vertex_groups[k].add([i], x / total, 'REPLACE')


def build_all(pieces, human, rig, helpers):
    """{'Coif-<garment>': object} for each of VARIANTS."""
    body = helpers['extract'](human, ['body'], 'CoifBody')
    head = Head(human, rig, body)
    skin_tree = tree_of([body])
    out = {}
    for name, garments in VARIANTS.items():
        layers = [(skin_tree, PAD)] + [(tree_of([pieces[g]]), GAP) for g in garments]
        # (a knight's mantle ends where the pauldrons begin: they lie over it)
        stop = 1 + garments.index('Plates') if 'Plates' in garments else None
        obj, moved = build_one(head, layers, name, stop)
        skin(obj, body, rig)
        helpers['set_material'](obj, 'coif')
        helpers['shade_smooth'](obj)
        print(f'coif {name}: {len(obj.data.polygons)} faces, {moved} points cleared')
        out[name] = obj
    bpy.data.objects.remove(body)
    return out
