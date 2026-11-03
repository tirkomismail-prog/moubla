// Where a body or a held item meets the ground. Plain functions of a height
// function (Terrain.heightAt), kept apart from the scene so that the tests
// can run them in node.
import * as THREE from 'three';

// how far along a lying body its heights are sampled: the feet behind the
// pelvis, the head ahead of it, and to each side of it (m)
const FIT = { feet: 0.85, head: 0.75, across: 0.25 };
// steeper than this from where a man stood is a drop or a wall, not a slope
// he lies on (the edge of the siege's plateau and its cliff, the sides of
// its ramp)
const DROP_GRADE = 0.8;
// no natural ground in a battle is steeper than this (rad; 35 degrees at
// most, on 'hills'): steeper is the terrain's 2 m grid bridging a drop
// (by the siege's plateau and its ramp, where planks and walls stand)
export const STEEPEST = 0.68;

// The ground under a body lying along (dx, dz) (a unit vector from its feet
// to its head) with its pelvis over (x, z): a plane fitted (least squares)
// to five heights, at the feet, the pelvis and the head along the body and
// `across` m to each side of the pelvis. `floor` (optional): where he stood
// ({x, y, z}); a sample more than DROP_GRADE per metre of its distance below
// or above it is over a drop or up a wall, not a slope he lies on: the plane
// is fitted to the others (level where they leave it open; with none, at
// where he stood).
// Out: the plane's rise per metre towards the head (a) and towards the
// body's left (b: along (dz, -dx), the left of a man facing (dx, dz)), the
// pitch and roll they make (rad), its height under the pelvis (y), never
// below the ground there (unless that was left out), how many samples were
// left out (off; feetOff: the feet's among them) and how far the farthest
// of the others is off the plane (err, m: a few cm on natural ground; more
// where it bends sharply, as at the edge of the plateau).
const SAMPLES = [[-FIT.feet, 0], [0, 0], [FIT.head, 0], [0, FIT.across], [0, -FIT.across]];
const FH = new Float64Array(5);
const FW = new Float64Array(5);
export function groundFit(heightAt, x, z, dx, dz, floor = null, out = {}) {
  out.off = 0;
  out.feetOff = false;
  for (let i = 0; i < 5; i++) {
    const [u, v] = SAMPLES[i];
    const px = x + dx * u + dz * v;
    const pz = z + dz * u - dx * v;
    const h = heightAt(px, pz);
    FH[i] = h;
    FW[i] = !floor || Math.abs(h - floor.y) <= DROP_GRADE * Math.hypot(px - floor.x, pz - floor.z) ? 1 : 0;
    out.off += 1 - FW[i];
  }
  out.feetOff = !FW[0];
  if (!fitPlane(out)) {
    out.a = 0;
    out.b = 0;
    out.y = floor.y;
  }
  out.pitch = Math.atan(out.a);
  out.roll = Math.atan(out.b);
  out.err = 0;
  for (let i = 0; i < 5; i++) if (FW[i]) out.err = Math.max(out.err, Math.abs(FH[i] - out.y - out.a * SAMPLES[i][0] - out.b * SAMPLES[i][1]));
  if (FW[1]) out.y = Math.max(out.y, FH[1]);
  return out;
}

// The plane h = y + a u + b v through the samples of weight FW, by its
// normal equations; level along the body or across it if they lie in a
// line that way (or both: at one of them); false if there are none.
function fitPlane(out) {
  let s = 0, su = 0, sv = 0, suu = 0, svv = 0, suv = 0, sh = 0, suh = 0, svh = 0;
  for (let i = 0; i < 5; i++) {
    const w = FW[i];
    const [u, v] = SAMPLES[i];
    const h = FH[i];
    s += w;
    su += w * u;
    sv += w * v;
    suu += w * u * u;
    svv += w * v * v;
    suv += w * u * v;
    sh += w * h;
    suh += w * u * h;
    svh += w * v * h;
  }
  if (s === 0) return false;
  // Cramer's rule on [[s, su, sv], [su, suu, suv], [sv, suv, svv]]
  const det = s * (suu * svv - suv * suv) - su * (su * svv - suv * sv) + sv * (su * suv - suu * sv);
  const detU = s * suu - su * su;
  const detV = s * svv - sv * sv;
  if (Math.abs(det) > 1e-9) {
    out.y = (sh * (suu * svv - suv * suv) - su * (suh * svv - suv * svh) + sv * (suh * suv - suu * svh)) / det;
    out.a = (s * (suh * svv - suv * svh) - sh * (su * svv - suv * sv) + sv * (su * svh - suh * sv)) / det;
    out.b = (s * (suu * svh - suh * suv) - su * (su * svh - suh * sv) + sh * (su * suv - suu * sv)) / det;
  } else if (detU > 1e-9) {
    out.a = (s * suh - su * sh) / detU;
    out.b = 0;
    out.y = (sh - out.a * su) / s;
  } else if (detV > 1e-9) {
    out.a = 0;
    out.b = (s * svh - sv * sh) / detV;
    out.y = (sh - out.b * sv) / s;
  } else {
    out.a = 0;
    out.b = 0;
    out.y = sh / s;
  }
  return true;
}

// The up direction of the plane groundFit found, for a body lying along
// (dx, dz): rising `a` towards the head and `b` towards its left.
export function fitNormal(fit, dx, dz, out = new THREE.Vector3()) {
  // the gradient a * d + b * left, left = (dz, -dx)
  return out.set(-(fit.a * dx + fit.b * dz), 1, -(fit.a * dz - fit.b * dx)).normalize();
}

// ---------------------------------------------------------------------------
// A dropped item lying flat on the ground
// ---------------------------------------------------------------------------

const L = {
  axes: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
  local: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
  n: new THREE.Vector3(),
  dir: new THREE.Vector3(),
  p: new THREE.Vector3(),
  c: new THREE.Vector3(),
  h: new Float64Array(4),
};
// above the ground (m); how far from the body's points (bones) an item
// keeps, and from those of items dropped before it; how far out from the
// body's length (either side, in steps) and along it it may be laid to keep
// so; how far from the body it starts, at most
const ITEM_LIFT = 0.015;
const BODY_CLEAR = 0.14;
const ITEM_CLEAR = 0.04;
const MOVE_STEP = 0.05;
const MOVE_MAX = 1.2;
const SLIDE = [0, 0.4, -0.4, 0.8, -0.8];
const NEAR = 0.8;
// ground an item may lie on: within this of the body's plane (m), and
// sloping no more than this from it (rad) (not over a drop or up a bank)
const PLANE_GAP = 0.25;
const PLANE_TILT = 0.35;
// the points of a dropped item's footprint are this far apart, at most (m)
const FOOT_STEP = 0.08;

// Is a 2D segment (centre cx, cz, direction dx, dz, half length hl) of half
// width hw clear of the body's points?
function clearOf(body, cx, cz, dx, dz, hl, hw) {
  const r2 = (hw + BODY_CLEAR) ** 2;
  for (let i = 0; i < body.length; i += 2) {
    const px = body[i] - cx;
    const pz = body[i + 1] - cz;
    const t = Math.max(-hl, Math.min(hl, px * dx + pz * dz));
    if ((px - dx * t) ** 2 + (pz - dz * t) ** 2 < r2) return false;
  }
  return true;
}

// Is a 2D rectangle (centre cx, cz, its length along dx, dz, half length
// hl, half width hw) clear of the points of items dropped before?
function clearOfItems(items, cx, cz, dx, dz, hl, hw) {
  for (let i = 0; i < items.length; i += 2) {
    const px = items[i] - cx;
    const pz = items[i + 1] - cz;
    if (Math.abs(px * dx + pz * dz) < hl + ITEM_CLEAR && Math.abs(px * dz - pz * dx) < hw + ITEM_CLEAR) return false;
  }
  return true;
}

// The height of a body's ground (plane: {g, n}, a point on it and its
// normal) under (x, z).
function planeAt(plane, x, z) {
  const { g, n } = plane;
  return g.y - (n.x * (x - g.x) + n.z * (z - g.z)) / n.y;
}

// The ground under an item at (cx, cz) lying along (dx, dz): its heights at
// its ends (ex m out) and sides (ey m) (L.h) and its normal (L.n). True if
// it is ground the body lies on too (`plane`, if given): no farther from
// its plane than PLANE_GAP, sloping no more than PLANE_TILT from it (nor
// more than STEEPEST).
function groundUnder(heightAt, plane, cx, cz, dx, dz, ex, ey) {
  const h = L.h;
  h[0] = heightAt(cx + dx * ex, cz + dz * ex);
  h[1] = heightAt(cx - dx * ex, cz - dz * ex);
  h[2] = heightAt(cx - dz * ey, cz + dx * ey);
  h[3] = heightAt(cx + dz * ey, cz - dx * ey);
  const ga = (h[0] - h[1]) / (2 * ex);
  const gb = (h[2] - h[3]) / (2 * ey);
  L.n.set(-(ga * dx - gb * dz), 1, -(ga * dz + gb * dx)).normalize();
  if (!plane) return true;
  if (Math.abs(heightAt(cx, cz) - planeAt(plane, cx, cz)) > PLANE_GAP) return false;
  for (let k = 0; k < 4; k++) {
    const e = k < 2 ? (k ? -ex : ex) : 0;
    const s = k < 2 ? 0 : k === 2 ? ey : -ey;
    if (Math.abs(h[k] - planeAt(plane, cx + dx * e - dz * s, cz + dz * e + dx * s)) > PLANE_GAP) return false;
  }
  return L.n.dot(plane.n) >= Math.cos(PLANE_TILT) && L.n.y >= Math.cos(STEEPEST);
}

// Lay an item of bounding box `box` (in its own space), now at `matrix` (its
// world matrix), flat on the ground near where it is: its thinnest side
// down (the side that faces down now), its length along the ground the way
// it points now, ITEM_LIFT m above the ground at its lowest corner, off the
// body that lies there: `body`, its points on the ground (x, z, ...), the
// first two its feet and its head, and off the items dropped before
// (`items`, their footprints' points). Moved across the body's length (on
// the side it is on, or the other) and if need be turned along it, as
// little as will clear them, onto ground the body lies on too (`plane`:
// {g, n}, the body's ground, see groundFit; any ground without it), from
// no farther than NEAR m from the body. `faceUp`: its thin axis up
// whichever way it faces now (a shield shows its painted face, and the grip
// behind it stands out less than its boss). Writes the new world matrix
// into `out`; false if no such place was found (it then lies along the
// body, MOVE_MAX out on its side, on the body's plane).
export function layFlat(heightAt, box, matrix, body, out, faceUp = false, plane = null, items = []) {
  const { axes, local, n, dir, p, c } = L;
  matrix.extractBasis(axes[0], axes[1], axes[2]);
  for (const v of axes) v.normalize();
  const size = [box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z];
  // the thinnest axis is the one that lies across the ground; the longest
  // keeps its heading
  let thin = 0;
  let long = 0;
  for (let k = 1; k < 3; k++) {
    if (size[k] < size[thin]) thin = k;
    if (size[k] > size[long]) long = k;
  }
  if (long === thin) long = (thin + 2) % 3;
  const third = 3 - thin - long;
  const up = faceUp || axes[thin].y >= 0 ? 1 : -1;
  const hw = size[third] / 2;
  const hl = Math.max(0, size[long] / 2 - hw);
  const half = size[long] / 2;
  // the ground is sampled at its ends and sides
  const ex = Math.max(0.15, half);
  const ey = Math.max(0.1, hw);
  // where its centre is now, which way it points along the ground
  c.copy(box.min).add(box.max).multiplyScalar(0.5).applyMatrix4(matrix);
  // the body's length, and the way out from it on the item's side
  let ux = body[2] - body[0];
  let uz = body[3] - body[1];
  const ul = Math.hypot(ux, uz) || 1;
  ux /= ul;
  uz /= ul;
  let ox = uz;
  let oz = -ux;
  let off = (c.x - body[0]) * ox + (c.z - body[1]) * oz;
  if (off < 0) {
    ox = -ox;
    oz = -oz;
    off = -off;
  }
  // (no farther than NEAR from the body's length, or beyond its ends)
  off = Math.min(off, NEAR);
  const along = clamp((c.x - body[0]) * ux + (c.z - body[1]) * uz, -NEAR, ul + NEAR);
  const x0 = body[0] + ux * along;
  const z0 = body[1] + uz * along;
  dir.set(axes[long].x, 0, axes[long].z);
  if (dir.lengthSq() < 1e-6) dir.set(ux, 0, uz);
  dir.normalize();
  // along the body: the way of its length nearer the item's
  const k = dir.x * ux + dir.z * uz >= 0 ? 1 : -1;
  const fits = (cx, cz, dx, dz) => clearOf(body, cx, cz, dx, dz, hl, hw) && clearOfItems(items, cx, cz, dx, dz, half, hw) && groundUnder(heightAt, plane, cx, cz, dx, dz, ex, ey);
  // (out to MOVE_MAX on either side of the body's length, the nearer to
  // where it was let go first; slid along the body if need be)
  let found = false;
  for (let d = 0; d <= off + MOVE_MAX && !found; d += MOVE_STEP) {
    for (const s of [1, -1]) {
      const o = off + s * d;
      if (Math.abs(o) > MOVE_MAX) continue;
      for (const t of SLIDE) {
        const cx = x0 + ox * o + ux * t;
        const cz = z0 + oz * o + uz * t;
        if (fits(cx, cz, dir.x, dir.z)) found = true;
        else if (fits(cx, cz, ux * k, uz * k)) {
          dir.set(ux * k, 0, uz * k);
          found = true;
        }
        if (found) {
          c.set(cx, 0, cz);
          break;
        }
      }
      if (found) break;
    }
  }
  // (nowhere: along the body, as far out as it goes, on the body's plane)
  const ground = found || !plane ? heightAt : (x, z) => planeAt(plane, x, z);
  if (!found) {
    dir.set(ux * k, 0, uz * k);
    c.set(x0 + ox * MOVE_MAX, 0, z0 + oz * MOVE_MAX);
    groundUnder(ground, null, c.x, c.z, dir.x, dir.z, ex, ey);
  }
  // its axes in the world: the thin one along the ground's normal, the long
  // one along its heading laid on the ground, the third to make a
  // right-handed frame (x = y × z, y = z × x, z = x × y)
  dir.addScaledVector(n, -dir.dot(n)).normalize();
  local[thin].copy(n).multiplyScalar(up);
  local[long].copy(dir);
  local[third].crossVectors(local[(third + 1) % 3], local[(third + 2) % 3]);
  out.makeBasis(local[0], local[1], local[2]);
  // its box's centre over c; raised so that its lowest corner clears the
  // ground under it
  const h = L.h;
  p.copy(box.min).add(box.max).multiplyScalar(0.5).applyMatrix4(out);
  out.setPosition(c.x - p.x, (h[0] + h[1] + h[2] + h[3]) / 4 - p.y, c.z - p.z);
  out.elements[13] += ITEM_LIFT - lowest(ground, box, out);
  return found;
}

// How high the lowest corner of a box `box` placed by `matrix` is over the
// ground under it.
export function lowest(heightAt, box, matrix) {
  const p = L.p;
  let low = Infinity;
  for (let i = 0; i < 8; i++) {
    p.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).applyMatrix4(matrix);
    low = Math.min(low, p.y - heightAt(p.x, p.z));
  }
  return low;
}

// The footprint of an item lying as `matrix` (its box `box`, its thinnest
// side down): points over its two longer sides, at most FOOT_STEP apart (x,
// z, ... pushed onto `out`), for the items dropped after it to keep clear of.
export function footprint(box, matrix, out) {
  const size = [box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z];
  let thin = 0;
  for (let k = 1; k < 3; k++) if (size[k] < size[thin]) thin = k;
  const a = (thin + 1) % 3;
  const b = (thin + 2) % 3;
  const na = Math.ceil(size[a] / FOOT_STEP);
  const nb = Math.ceil(size[b] / FOOT_STEP);
  const p = L.p;
  const min = box.min.toArray();
  for (let i = 0; i <= na; i++) {
    for (let j = 0; j <= nb; j++) {
      const q = [0, 0, 0];
      q[thin] = min[thin] + size[thin] / 2;
      q[a] = min[a] + (size[a] * i) / na;
      q[b] = min[b] + (size[b] * j) / nb;
      p.fromArray(q).applyMatrix4(matrix);
      out.push(p.x, p.z);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// The second hand on a held weapon
// ---------------------------------------------------------------------------

// how far a hand round a handle slants along it, at most (rad): reaching
// along a haft, the hand points partly along it and the haft lies across
// the palm at a slant
const HAND_SLANT = 0.5;
const G = { n: new THREE.Vector3(), o: new THREE.Vector3(), c: 0, d: 0 };

// The shoulder's foot on a weapon's axis (the line through `p` along the
// unit `dir`): how far along it (G.c) and the unit way from the shoulder to
// it, square to the axis (G.n); the shoulder's distance from it (G.d).
function foot(shoulder, p, dir) {
  const o = G.o.subVectors(shoulder, p);
  G.c = o.dot(dir);
  const n = G.n.copy(o).addScaledVector(dir, -G.c).negate();
  G.d = n.length();
  if (G.d > 1e-6) n.divideScalar(G.d);
  else {
    // (on the axis: any way square to it)
    n.set(Math.abs(dir.x) > 0.9 ? 0 : 1, Math.abs(dir.x) > 0.9 ? 1 : 0, 0);
    n.addScaledVector(dir, -n.dot(dir)).normalize();
  }
}

// How far the hand slants (rad, HAND_SLANT at most) at s m along the axis,
// seen from a shoulder d m off it with its foot at c: half the angle it
// reaches along the axis at.
const slant = (s, c, d) => clamp(0.5 * Math.atan2(s - c, d), -HAND_SLANT, HAND_SLANT);

// A left hand round a weapon's axis (the line through `p` along the unit
// `dir`) at `s` m along it, reached from `shoulder`: its length (len, wrist to
// knuckles) square to the axis, away from the shoulder, slanted along the
// axis (slant); its knuckle line (knuck, little finger to index) along the
// axis so, the index towards +dir; its palm (palm = len x knuck) square to
// both. Its grip point (grip) on the axis, its wrist (wrist) `back` m behind
// that along its length and `side` m off it, away from the palm (a hand's
// grip point: character.js t.hands). Into `out` ({grip, wrist, len, knuck,
// palm}: vectors).
export function handOnAxis(shoulder, p, dir, s, back, side, out) {
  foot(shoulder, p, dir);
  const a = slant(s, G.c, G.d);
  out.grip.copy(p).addScaledVector(dir, s);
  out.len.copy(G.n).multiplyScalar(Math.cos(a)).addScaledVector(dir, Math.sin(a));
  out.knuck.copy(G.n).multiplyScalar(-Math.sin(a)).addScaledVector(dir, Math.cos(a));
  out.palm.crossVectors(out.len, out.knuck);
  out.wrist.copy(out.grip).addScaledVector(out.len, -back).addScaledVector(out.palm, -side);
  return out;
}

// The distance (squared) from the shoulder of the wrist of a hand on the
// axis at s (handOnAxis), the shoulder's foot as G has it.
function wristFar(s, back, side) {
  const a = slant(s, G.c, G.d);
  return (G.d - back * Math.cos(a)) ** 2 + (s - G.c - back * Math.sin(a)) ** 2 + side * side;
}

// Where along a weapon's axis (as handOnAxis) the other hand takes it: the
// point of [from, to] (m along it) nearest `want` whose wrist (handOnAxis)
// is within `reach` of the shoulder; NaN if none is (the hand then lets go).
export function secondGrip(shoulder, p, dir, from, to, want, reach, back = 0, side = 0) {
  foot(shoulder, p, dir);
  const r2 = reach * reach;
  const w = clamp(want, from, to);
  if (wristFar(w, back, side) <= r2) return w;
  // (nearest the shoulder: out of reach there, out of reach everywhere)
  let near = clamp(G.c, from, to);
  if (wristFar(near, back, side) > r2) return NaN;
  // the edge of the reach between there and `want`
  let off = w;
  for (let i = 0; i < 24; i++) {
    const m = (near + off) / 2;
    if (wristFar(m, back, side) <= r2) near = m;
    else off = m;
  }
  return near;
}

// As secondGrip for an arm that does not bend (the low graphics' straight
// arm, made a little shorter or longer if need be): the point of [from, to]
// nearest `want` between `min` and `max` m from the shoulder; NaN if there
// is none.
export function rigidGrip(shoulder, p, dir, from, to, want, min, max) {
  foot(shoulder, p, dir);
  const { c, d } = G;
  if (d > max) return NaN;
  // (within max of the shoulder: c +- far; beyond min: outside c +- near)
  const far = Math.sqrt(max * max - d * d);
  const near = d < min ? Math.sqrt(min * min - d * d) : 0;
  let best = NaN;
  for (let k = -1; k <= 1; k += 2) {
    const lo = Math.max(from, k < 0 ? c - far : c + near);
    const hi = Math.min(to, k < 0 ? c - near : c + far);
    const s = clamp(want, lo, hi);
    if (lo <= hi && !(Math.abs(s - want) >= Math.abs(best - want))) best = s;
  }
  return best;
}

// Where the second (left) hand takes a two-handed weapon, along its axis
// from the right hand's grip (m, + towards its point): [want, from, to], the
// first of them it reaches (secondGrip). A spear or a fork ahead of the
// right hand; a sword's long grip and a great axe's haft at their end,
// behind it; a crossbow under its stock, ahead of the trigger.
export const SECOND = {
  spear: [[0.4, 0.12, 0.9]],
  greatsword: [[-0.13, -0.17, -0.1]],
  greataxe: [[-0.12, -0.15, -0.1]],
  crossbow: [[0.3, 0.12, 0.42]],
};

// The second hand's places on weapon `w` (an item), or null: it has none.
export function secondRanges(w) {
  if (w.cls === 'spear' || w.cls === 'crossbow') return SECOND[w.cls];
  return w.twoHanded ? SECOND[w.model] || SECOND.greatsword : null;
}

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
