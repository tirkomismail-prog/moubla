"""Helmets and hoods, built around the measured skull of the body so that
they fit without scaling in the game. Exported as meshes named
Helmet_<look> in the rest pose; the game moves them with the head bone.

Every vertex says how the game should shade it: _tile (a material of
materials.TILES, -1 for plain colour), the colour (a tint), _metal
(metalness) and _team (1: painted in the team colour). UVs are in metres.
"""
import math

import bpy
from mathutils import Vector

import materials

TILE = {name: float(i) for i, name in enumerate(materials.TILES)}
STEEL = ('plate', (1.0, 1.0, 1.0), 0.9)
DARK_STEEL = ('plate', (0.55, 0.57, 0.6), 0.9)
BRASS = ('plate', (1.0, 0.7, 0.28), 0.8)
MAIL = ('mail', (1.0, 1.0, 1.0), 0.75)
LEATHER = ('leather', (1.2, 1.05, 0.95), 0.0)
DARK_LEATHER = ('leather', (0.6, 0.55, 0.5), 0.0)
FUR = ('fur', (0.55, 0.4, 0.28), 0.0)
TEAM = ('wool', (1.0, 1.0, 1.0), 0.0, True)
SLIT = (None, (0.01, 0.01, 0.01), 0.0)


class Mesh:
    """Collects quads with per-vertex material attributes and UVs."""

    def __init__(self):
        self.verts = []
        self.attrs = []  # (tile, tint, metal, team) per vertex
        self.faces = []
        self.uvs = []  # per face: list of (u, v)

    def grid(self, rows, mat, closed=True, apex=None, flip=False):
        """A surface through rings of points (lists of Vectors, same length).
        `apex`: a point closing the last ring. UVs follow the surface in metres."""
        n = len(rows[0])
        base = len(self.verts)
        tile, tint, metal = mat[:3]
        team = len(mat) > 3 and mat[3]
        for row in rows:
            for p in row:
                self.verts.append(p)
                self.attrs.append((tile, tint, metal, team))
        # arc length along each ring (u) and along the meridians (v)
        us = []
        for row in rows:
            u = [0.0]
            for i in range(1, n + (1 if closed else 0)):
                u.append(u[-1] + (row[i % n] - row[i - 1]).length)
            us.append(u)
        vs = [[0.0] * n]
        for r in range(1, len(rows)):
            vs.append([vs[-1][i] + (rows[r][i] - rows[r - 1][i]).length for i in range(n)])
        segs = n if closed else n - 1
        for r in range(len(rows) - 1):
            for i in range(segs):
                j = (i + 1) % n
                a, b = base + r * n + i, base + r * n + j
                c, d = base + (r + 1) * n + j, base + (r + 1) * n + i
                uv = [(us[r][i], vs[r][i]), (us[r][i + 1], vs[r][j]), (us[r + 1][i + 1], vs[r + 1][j]), (us[r + 1][i], vs[r + 1][i])]
                self.add_face([a, b, c, d], uv, flip)
        if apex is not None:
            top = len(self.verts)
            self.verts.append(apex)
            self.attrs.append((tile, tint, metal, team))
            last = len(rows) - 1
            vt = max(vs[last]) + (apex - rows[last][0]).length
            for i in range(segs):
                j = (i + 1) % n
                a, b = base + last * n + i, base + last * n + j
                self.add_face([a, b, top], [(us[last][i], vs[last][i]), (us[last][i + 1], vs[last][j]), ((us[last][i] + us[last][i + 1]) / 2, vt)], flip)

    def add_face(self, idx, uv, flip):
        if flip:
            idx = idx[::-1]
            uv = uv[::-1]
        self.faces.append(idx)
        self.uvs.append(uv)

    def box(self, center, size, axes, mat):
        """A box: `axes` = three unit vectors (x, y, z of the box)."""
        c = Vector(center)
        hx, hy, hz = (s / 2 for s in size)
        ax, ay, az = (Vector(a) for a in axes)
        corners = [c + ax * sx * hx + ay * sy * hy + az * sz * hz for sz in (-1, 1) for sy in (-1, 1) for sx in (-1, 1)]
        base = len(self.verts)
        tile, tint, metal = mat[:3]
        for p in corners:
            self.verts.append(p)
            self.attrs.append((tile, tint, metal, len(mat) > 3 and mat[3]))
        quads = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
        dims = [(size[0], size[1]), (size[0], size[1]), (size[0], size[2]), (size[0], size[2]), (size[1], size[2]), (size[1], size[2])]
        for q, (w, h) in zip(quads, dims):
            self.add_face([base + k for k in q], [(0, 0), (w, 0), (w, h), (0, h)], False)

    def to_object(self, name):
        me = bpy.data.meshes.new(name)
        me.from_pydata([tuple(v) for v in self.verts], [], self.faces)
        me.update()
        # create every layer first: adding one moves the others in memory
        me.uv_layers.new(name='UVMap')
        me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
        for attr in ('_tile', '_metal', '_team'):
            me.attributes.new(attr, 'FLOAT', 'POINT')
        uv = me.uv_layers['UVMap']
        for poly, fuv in zip(me.polygons, self.uvs):
            for li, (u, v) in zip(poly.loop_indices, fuv):
                uv.data[li].uv = (u, v)
        col = me.color_attributes['Col']
        tile, metal, team = (me.attributes[a] for a in ('_tile', '_metal', '_team'))
        for i, (t, tint, m, tm) in enumerate(self.attrs):
            col.data[i].color = (*tint, 1.0)
            tile.data[i].value = TILE.get(t, -1.0)
            metal.data[i].value = m
            team.data[i].value = 1.0 if tm else 0.0
        me.color_attributes.active_color = col
        for p in me.polygons:
            p.use_smooth = True
        obj = bpy.data.objects.new(name, me)
        bpy.context.collection.objects.link(obj)
        return obj


class Skull:
    """Cross-sections of the head: an ellipse (centre y, half width, half
    depth) at any height, containing all the skin at that height."""

    def __init__(self, human, neck_z):
        body = human.vertex_groups['body'].index
        ears = human.vertex_groups['ears'].index
        self.pts = []
        for v in human.data.vertices:
            gs = {g.group: g.weight for g in v.groups}
            if gs.get(body, 0) > 0.5 and gs.get(ears, 0) < 0.3 and v.co.z > neck_z + 0.02:
                self.pts.append(v.co.copy())
        self.top = max(p.z for p in self.pts)
        self.cache = {}

    def at(self, z, band=0.008):
        key = round(z, 3)
        if key in self.cache:
            return self.cache[key]
        sl = [p for p in self.pts if abs(p.z - z) < band]
        if len(sl) < 6:
            sl = sorted(self.pts, key=lambda p: abs(p.z - z))[:40]
        cy = (min(p.y for p in sl) + max(p.y for p in sl)) / 2
        rx = max(abs(p.x) for p in sl)
        ry = (max(p.y for p in sl) - min(p.y for p in sl)) / 2
        s = max(math.hypot(p.x / rx, (p.y - cy) / ry) for p in sl)
        self.cache[key] = (cy, rx * s, ry * s)
        return self.cache[key]


def ring(cy, rx, ry, z, n, a0=0.0, a1=2 * math.pi, closed=True):
    """Points on an ellipse around the head; angle 0 is the front (-Y)."""
    count = n if closed else n + 1
    out = []
    for i in range(count):
        a = a0 + (a1 - a0) * i / n
        out.append(Vector((rx * math.sin(a), cy - ry * math.cos(a), z)))
    return out


def shell(m, skull, z0, z1, pad, mat, shape, n=24, rows=8, apex_extra=0.0, a0=0.0, a1=2 * math.pi, closed=True):
    """A dome from height z0 (rim) up to the skull top: each ring is the rim
    ellipse scaled by shape(t) (t = 0 at the rim, 1 at the top), never closer
    than `pad` to the skin. Ends in an apex `apex_extra` above the skull."""
    cy0, rx0, ry0 = skull.at(z0)
    rx0 += pad
    ry0 += pad
    rows_pts = []
    for r in range(rows):
        t = r / rows
        z = z0 + (z1 - z0) * t
        cy, rx, ry = skull.at(min(z, skull.top - 0.004))
        f = shape(t)
        # blend the ellipse centre towards the skull's at this height
        c = cy0 + (cy - cy0) * t
        sx = max(rx0 * f, rx + pad if z < skull.top else 0.0)
        sy = max(ry0 * f, ry + pad if z < skull.top else 0.0)
        rows_pts.append(ring(c, sx, sy, z, n, a0, a1, closed))
    cy_top = skull.at(skull.top - 0.01)[0]
    apex = Vector((0.0, cy_top, z1 + apex_extra))
    m.grid(rows_pts, mat, closed=closed, apex=apex)
    return rows_pts[0]


def band(m, skull, z, height, pad, mat, n=24, a0=0.0, a1=2 * math.pi, closed=True, flare=0.0):
    """A band (brow band, rim) around the head: outer surface and a lip."""
    cy, rx, ry = skull.at(z)
    lo = ring(cy, rx + pad + flare, ry + pad + flare, z - height / 2, n, a0, a1, closed)
    hi = ring(cy, rx + pad, ry + pad, z + height / 2, n, a0, a1, closed)
    m.grid([lo, hi], mat, closed=closed)
    inner = ring(cy, rx + pad - 0.004, ry + pad - 0.004, z - height / 2, n, a0, a1, closed)
    m.grid([inner, lo], mat, closed=closed)


def aventail(m, skull, z_top, z_bottom, pad, spread, a_open, n=24):
    """A curtain of mail hanging from the rim over the neck, open over the
    face (angles within a_open of the front). Two layers: it is seen from
    outside and, through the face opening, from inside."""
    cy, rx, ry = skull.at(z_top)
    steps = 4
    for inset, flip in ((0.0, False), (0.003, True)):
        rows = []
        for r in range(steps + 1):
            t = r / steps
            z = z_top + (z_bottom - z_top) * t
            grow = spread * t * t - inset
            rows.append(ring(cy + 0.008 * t, rx + pad + grow, ry + pad + grow, z, n, a_open, 2 * math.pi - a_open, closed=False))
        m.grid(rows, MAIL, closed=False, flip=flip)


def nasal(m, skull, z_brow, length, pad, mat, width=0.022):
    """A nose guard hanging from the brow, following the face."""
    cy, rx, ry = skull.at(z_brow)
    front = cy - ry - pad
    top = Vector((0, front, z_brow + 0.01))
    bottom = Vector((0, front - 0.012, z_brow - length))
    axis_z = (top - bottom).normalized()
    m.box((top + bottom) / 2 + Vector((0, -0.002, 0)), (width, 0.004, (top - bottom).length), ((1, 0, 0), (0, 1, 0), tuple(axis_z)), mat)


def build_all(human, rig, landmarks):
    """Returns {look: object} for the helmet looks of src/data/items.js."""
    from garments import group_center

    neck_z = rig.data.bones['neck_01'].head_local.z
    skull = Skull(human, neck_z)
    eye, _ = group_center(human, 'helper-l-eye')
    lips, _ = group_center(human, 'lips')
    brow = eye.z + 0.035  # rim of a helmet: just above the eyebrows
    top = skull.top
    chin = lips.z - 0.06
    shoulder = landmarks['shoulder']
    out = {}

    def done(look, m):
        out[look] = m.to_object('Helmet_' + look)

    dome = lambda t: math.sqrt(max(0.0, 1 - t * t))  # noqa: E731

    # Norman conical helmet with a nasal
    m = Mesh()
    shell(m, skull, brow, top + 0.012, 0.012, STEEL, lambda t: 1 - t ** 1.25, apex_extra=0.05)
    band(m, skull, brow + 0.012, 0.028, 0.015, DARK_STEEL)
    nasal(m, skull, brow, 0.075, 0.016, STEEL)
    done('nasal', m)

    # spangenhelm: dome, brass ribs and brow band, nasal, mail aventail
    m = Mesh()
    shell(m, skull, brow, top + 0.012, 0.012, STEEL, lambda t: 1 - 0.85 * t ** 1.6, apex_extra=0.03)
    band(m, skull, brow + 0.014, 0.03, 0.016, BRASS)
    for k in range(4):
        a = k * math.pi / 2
        pts = []
        for r in range(7):
            t = r / 7
            z = brow + (top + 0.03 - brow) * t
            cy, rx, ry = skull.at(min(z, top - 0.004))
            f = max(0.08, 1 - 0.85 * t ** 1.6)
            c0 = skull.at(brow)
            sx = max((c0[1] + 0.012) * f, rx + 0.012 if z < top else 0) + 0.003
            sy = max((c0[2] + 0.012) * f, ry + 0.012 if z < top else 0) + 0.003
            pts.append((sx * math.sin(a), cy - sy * math.cos(a), z))
        side = Vector((math.cos(a), math.sin(a), 0)) * 0.009
        rows = [[Vector(p) - side for p in pts], [Vector(p) + side for p in pts]]
        m.grid([list(r) for r in zip(*rows)], BRASS, closed=False)
    nasal(m, skull, brow, 0.07, 0.017, STEEL, width=0.026)
    aventail(m, skull, brow - 0.004, neck_z + 0.01, 0.016, 0.035, math.radians(58))
    done('spangen', m)

    # kettle hat: a dome with a wide sloping brim and a comb
    m = Mesh()
    rim = shell(m, skull, brow + 0.01, top + 0.02, 0.014, STEEL, dome, apex_extra=0.0)
    cy, rx, ry = skull.at(brow + 0.01)
    brim_in = ring(cy, rx + 0.016, ry + 0.016, brow + 0.012, 24)
    brim_out = ring(cy, rx + 0.09, ry + 0.085, brow - 0.02, 24)
    m.grid([brim_out, brim_in], STEEL)
    m.grid([brim_in, brim_out], DARK_STEEL)  # underside
    band(m, skull, brow + 0.02, 0.022, 0.016, DARK_STEEL)
    done('kettle', m)

    # great helm: a flat-topped cylinder over the whole head, eye slits,
    # breaths, a brass cross
    m = Mesh()
    cyb, rxb, ryb = skull.at(eye.z - 0.03)
    rxg, ryg = rxb + 0.03, ryb + 0.035
    rows = [ring(cyb, rxg * s, ryg * s, z, 24) for z, s in ((chin - 0.035, 1.02), (eye.z - 0.03, 1.0), (top - 0.01, 1.0), (top + 0.015, 0.97))]
    m.grid(rows, STEEL, apex=Vector((0, cyb, top + 0.03)))
    for side in (-1, 1):
        a0, a1 = (0.12, 1.1) if side > 0 else (-1.1, -0.12)
        z = eye.z + 0.004
        lo = ring(cyb, rxg + 0.002, ryg + 0.002, z - 0.007, 6, a0, a1, closed=False)
        hi = ring(cyb, rxg + 0.002, ryg + 0.002, z + 0.007, 6, a0, a1, closed=False)
        m.grid([lo, hi], SLIT, closed=False)
    for i in range(3):
        for j in range(3):
            a = 0.35 + 0.16 * i
            z = chin + 0.02 + 0.022 * j
            p = Vector((rxg * math.sin(a), cyb - ryg * math.cos(a), z))
            n = Vector((math.sin(a) / rxg, -math.cos(a) / ryg, 0)).normalized()
            m.box(p + n * 0.001, (0.009, 0.004, 0.009), (tuple(n.cross(Vector((0, 0, 1)))), tuple(n), (0, 0, 1)), SLIT)
    front = Vector((0, cyb - ryg - 0.003, 0))
    m.box(front + Vector((0, 0, (chin + top) / 2 - 0.02)), (0.024, 0.005, top - chin - 0.03), ((1, 0, 0), (0, 1, 0), (0, 0, 1)), BRASS)
    m.box(front + Vector((0, 0, eye.z + 0.022)), (0.16, 0.005, 0.02), ((1, 0, 0), (0, 1, 0), (0, 0, 1)), BRASS)
    band(m, skull, top - 0.02, 0.02, 0.034, BRASS)
    done('great', m)

    # steppe helmet: tall pointed dome, brass band, spike with a team plume,
    # mail aventail
    m = Mesh()
    shell(m, skull, brow, top + 0.012, 0.013, STEEL, lambda t: 1 - t ** 0.8 * 0.92, apex_extra=0.1)
    band(m, skull, brow + 0.012, 0.03, 0.016, BRASS)
    cyt = skull.at(top - 0.01)[0]
    spike = [ring(cyt, 0.012, 0.012, top + 0.12, 8), ring(cyt, 0.006, 0.006, top + 0.16, 8)]
    m.grid(spike, BRASS, apex=Vector((0, cyt, top + 0.2)))
    plume = [ring(cyt, 0.005, 0.005, top + 0.17, 6), ring(cyt, 0.02, 0.02, top + 0.21, 6)]
    m.grid(plume, TEAM, apex=Vector((0, cyt + 0.03, top + 0.27)))
    aventail(m, skull, brow - 0.004, neck_z + 0.0, 0.016, 0.04, math.radians(52))
    done('spiked', m)

    # leather cap: a dome with seams and a rolled rim
    m = Mesh()
    shell(m, skull, brow + 0.008, top + 0.01, 0.01, LEATHER, dome)
    band(m, skull, brow + 0.012, 0.022, 0.014, DARK_LEATHER)
    done('cap', m)

    # hood with a short collar resting on the shoulders, open over the face.
    # Every row runs round the head from the front; around the face it
    # starts further round. Two layers: the inside shows around the face.
    m = Mesh()
    open_a = math.radians(64)
    n = 24
    cyc, rxc, ryc = skull.at(chin)
    for inset, flip in ((0.0, False), (0.004, True)):
        rows = []
        for z in (neck_z - 0.05, neck_z + 0.0, chin - 0.01, eye.z - 0.02, brow + 0.02, top - 0.03, top + 0.012):
            if z >= chin - 0.011:
                cy, rx, ry = skull.at(min(z, top - 0.005))
                sx, sy = rx + 0.018, ry + 0.018
                if z > top - 0.035:
                    sx, sy = sx * 0.9, sy * 0.95
            else:
                k = (chin - 0.01 - z) / (chin - 0.01 - (neck_z - 0.05))
                cy = cyc + 0.015 * k
                sx, sy = rxc + 0.02 + 0.07 * k * k, ryc + 0.02 + 0.045 * k * k
            a0 = open_a if chin - 0.02 < z < brow + 0.01 else 0.03
            rows.append(ring(cy, sx - inset, sy - inset, z, n, a0, 2 * math.pi - a0, closed=False))
        m.grid(rows, TEAM, closed=False, flip=flip, apex=Vector((0, skull.at(top - 0.01)[0] + 0.012, top + 0.03 - inset)))
    done('hood', m)

    # fur hat: a thick fur band with a rounded top edge, a cloth crown in
    # the team colour
    m = Mesh()
    cy, rx, ry = skull.at(brow + 0.02)
    prof = [(-0.006, 0.02), (0.03, 0.03), (0.06, 0.031), (0.078, 0.024), (0.084, 0.012), (0.082, 0.004)]
    m.grid([ring(cy, rx + d, ry + d, brow + z, 24) for z, d in prof], FUR)
    shell(m, skull, brow + 0.075, top + 0.025, 0.006, TEAM, lambda t: math.sqrt(max(0.0, 1 - t * t)))
    done('fur', m)

    for obj in out.values():
        obj.data.materials.append(bpy.data.materials.get('helmet') or bpy.data.materials.new('helmet'))
        print(f'{obj.name:16s} {sum(len(p.vertices) - 2 for p in obj.data.polygons):5d} tris')
    return out
