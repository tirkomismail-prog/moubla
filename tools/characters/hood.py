"""A cloth hood with a short cape for the soldiers who wear one instead of a
helmet: the monk's hood of MakeHuman's suits02 pack (by Donitz, CC0, fitted
to the body by mhassets.fit_garments), simplified, made shallower and open
for the face (shallow), its cape fitted over the garments under it.

The hood is a closed shell (its cloth has thickness), so it is not pushed
point by point like a single sheet: where a point of it is too close to the
skin or a garment, all the points round it (both sides of the cloth) move
out along that surface's normal, the push fading over a few centimetres.
The gambeson's standing collar needs a hood of its own (VARIANTS).
"""
import bpy
from mathutils import Vector
from mathutils.kdtree import KDTree

import coif

RATIO = 0.1           # of the pack's 9008 triangles
GAP = 0.005           # over the garments
SKIN = 0.003          # over the skin
FRONT = (0.012, 0.4)  # the hood's front, how far ahead of the face it is left (shallow)
# the face opening widened by OPEN[0] at its rim, nothing OPEN[1] from its
# middle (OPEN[2] under the eyes)
OPEN = (0.045, 0.14, 0.02)
CARRY = (0.013, 0.035)  # a push is carried whole this far (the cloth's thickness), then fades
# the garments under each hood's cape
VARIANTS = {
    'Hood': ('Tunic', 'Jerkin', 'Hauberk', 'Surcoat', 'Cuirass', 'Jupon'),
    'Hood-Gambeson': ('Gambeson',),
}


def fit(obj, layers, rounds=4):
    """Push the hood off the layers [(BVH tree, gap)], see above. Returns
    how many points moved."""
    moved = set()
    for _ in range(rounds):
        verts = obj.data.vertices
        need = []
        for v in verts:
            best = (0.0, None)
            for tree, gap in layers:
                loc, n, _, d = tree.find_nearest(v.co, 0.06)
                if loc is None:
                    continue
                s = (v.co - loc).dot(n)
                if abs(s) > 0.8 * d and gap - s > best[0]:
                    best = (gap - s, n.copy())
            need.append(best)
        if not any(n for n, _ in need):
            break
        kd = KDTree(len(verts))
        for v in verts:
            kd.insert(v.co, v.index)
        kd.balance()
        push = [Vector() for _ in verts]
        for i, (n, dirn) in enumerate(need):
            if dirn is None:
                continue
            for co, j, d in kd.find_range(verts[i].co, CARRY[1]):
                k = 1.0 if d <= CARRY[0] else (CARRY[1] - d) / (CARRY[1] - CARRY[0])
                if n * k > push[j].length:
                    push[j] = dirn * (n * k)
        for v, p in zip(verts, push):
            if p.length > 0:
                v.co += p
                moved.add(v.index)
        obj.data.update()
    return len(moved)


def shallow(obj, body):
    """A shallower hood, open for the face (the pack's is a deep cowl, its
    peak 9 cm in front of the face, shading the eyes): what lies more than
    FRONT[0] in front of the face (the skin's front at that height) is drawn
    back to FRONT[1] of that, and the opening widened (OPEN)."""
    front = {}
    for v in body.data.vertices:
        if abs(v.co.x) < 0.05:
            k = round(v.co.z, 2)
            front[k] = min(front.get(k, 1.0), v.co.y)
    keys = sorted(front)
    eye_z = eye_height(body)
    for v in obj.data.vertices:
        k = min(keys, key=lambda z: abs(z - v.co.z))
        line = front[k] - FRONT[0]
        if v.co.y < line:
            ahead = line - v.co.y
            v.co.y = line - FRONT[1] * ahead
    # the face opening widened: the cloth round it moved away from its middle
    # (in front of the face, most at the rim)
    mid_y = front[min(keys, key=lambda z: abs(z - eye_z))]
    for v in obj.data.vertices:
        if v.co.y > mid_y + 0.06:
            continue
        d = Vector((v.co.x, 0.0, v.co.z - (eye_z - OPEN[2])))
        k = max(0.0, 1 - d.length / OPEN[1]) * min(1.0, (mid_y + 0.06 - v.co.y) / 0.04)
        if d.length > 1e-6:
            v.co += d.normalized() * OPEN[0] * k
    obj.data.update()


def eye_height(body):
    """Height of the eyes: of the deepest hollow of the face's front line
    between the nose and the brows."""
    rows = {}
    for v in body.data.vertices:
        if abs(abs(v.co.x) - 0.032) < 0.006:
            k = round(v.co.z, 3)
            rows[k] = min(rows.get(k, 1.0), v.co.y)
    top = max(rows)
    cand = [(y, z) for z, y in rows.items() if top - 0.15 < z < top - 0.08]
    return max(cand)[1]


def build_all(pieces, hood, human, rig, helpers):
    """{name: object} for each of VARIANTS, from the fitted pack hood (which
    is removed)."""
    near = helpers['decimate'](hood, RATIO, 'HoodNear')
    bpy.data.objects.remove(hood)
    body = helpers['extract'](human, ['body'], 'HoodBody')
    shallow(near, body)
    skin = coif.tree_of([body])
    out = {}
    for name, garments in VARIANTS.items():
        obj = helpers['copy_object'](near, name)
        moved = fit(obj, [(skin, SKIN)] + [(coif.tree_of([pieces[g]]), GAP) for g in garments])
        helpers['set_material'](obj, 'hood')
        helpers['shade_smooth'](obj)
        print(f'hood {name}: {len(obj.data.polygons)} faces, {moved} points moved')
        out[name] = obj
    bpy.data.objects.remove(near)
    bpy.data.objects.remove(body)
    return out
