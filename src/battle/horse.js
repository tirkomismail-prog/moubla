// Realistic horses: a skinned horse with saddle and bridle (built by
// tools/characters/build_horse.py and packed into dist/characters.js) whose
// legs, back, neck, head and tail are posed procedurally: walk, trot and
// gallop with the hooves put on the ground, turning, idling and falling dead.
// The rider sits on its saddle and puts the feet in its stirrups.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bytesOf, decodeLayers, partMaterial, shadowStandIn, surface, tiled } from './partmat.js';
import { clamp, smoothstep, wrapAngle } from '../core/util.js';

let T = null;

export async function loadHorse(assets, tiles) {
  const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(bytesOf(assets.horse).buffer, '', resolve, reject));
  const t = prepare(gltf);
  const tex = assets.horseTextures;
  t.layers = tex ? await decodeLayers(tex.size, tex.layers, THREE.SRGBColorSpace) : null;
  const normals = tex && tex.normals ? Object.fromEntries(Object.entries(tex.normals).map(([k, f]) => [k, [f]])) : null;
  t.normals = normals ? await decodeLayers(tex.size, normals, THREE.NoColorSpace) : null;
  t.tiles = tiles;
  T = t;
}

export function horseReady() {
  return !!T;
}

// ---------------------------------------------------------------------------
// Template: the rest pose measured once
// ---------------------------------------------------------------------------

const LEGS = ['front_l', 'front_r', 'hind_l', 'hind_r'];

function prepare(gltf) {
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);
  const bones = {};
  let fit = {};
  let armature = null;
  scene.traverse((o) => {
    if (o.isBone) bones[o.name] = o;
    if (o.userData && o.userData.bone_tails) {
      fit = o.userData;
      armature = o;
    }
  });
  const toModel = (p) => new THREE.Vector3().fromArray(p).applyMatrix4(armature.matrixWorld);
  const t = { scene, parts: fit.parts, partLayers: fit.part_layers || {}, rest: {}, common: [], pieces: {} };
  // per bone: rest local rotation, rest model-space rotation of its parent,
  // position of its head
  for (const [name, b] of Object.entries(bones)) {
    t.rest[name] = {
      q: b.quaternion.clone(),
      p: b.position.clone(),
      parentQ: b.parent.getWorldQuaternion(new THREE.Quaternion()),
      parentInv: b.parent.getWorldQuaternion(new THREE.Quaternion()).invert(),
      parent: b.parent.isBone ? b.parent.name : null,
      head: b.getWorldPosition(new THREE.Vector3()),
    };
  }
  t.hips = t.rest.root.head.clone();
  t.tails = {};
  for (const [name, p] of Object.entries(fit.bone_tails)) t.tails[name] = toModel(p);
  // the legs in the plane of the body (z forward, y up): joints, lengths and
  // rest angles (0 pointing down, + forwards)
  t.legs = {};
  for (const leg of LEGS) {
    const j = [1, 2, 3].map((k) => t.rest[`${leg}_${k}`].head);
    j.push(t.tails[`${leg}_3`]);
    const len = (a, b) => Math.hypot(b.y - a.y, b.z - a.z);
    t.legs[leg] = {
      j,
      a: len(j[1], j[2]),
      b: len(j[2], j[3]),
      rest: [angle(j[0], j[1]), angle(j[1], j[2]), angle(j[2], j[3])],
      reach: angle(j[0], j[3]),
      front: leg.startsWith('front'),
    };
  }
  t.seat = toModel(fit.seat);
  t.stirrups = fit.stirrups.map(toModel);
  // the saddle cloth or caparison (Piece_<name>_LOD<n>) are joined with the
  // horse of each level of detail (Horse_LOD<n>)
  const pieces = [];
  scene.traverse((o) => {
    const m = o.isSkinnedMesh && /^(Horse|Piece_(.+))_LOD(\d)$/.exec(o.name);
    if (!m) return;
    if (m[2]) {
      (t.pieces[m[2]] ||= [])[+m[3]] = o.geometry;
      pieces.push(o);
    } else t.common[+m[3]] = o.geometry;
  });
  for (const o of pieces) o.removeFromParent();
  return t;
}

// direction angle of b - a in the body's plane: 0 down, + forwards
function angle(a, b) {
  return Math.atan2(b.z - a.z, -(b.y - a.y));
}

const variants = new Map();

function geometry(piece, level) {
  const key = `${piece}:${level}`;
  let g = variants.get(key);
  if (!g) {
    const p = T.pieces[piece] && T.pieces[piece][level];
    g = p ? mergeGeometries([T.common[level], p]) : T.common[level];
    variants.set(key, g);
  }
  return g;
}

// ---------------------------------------------------------------------------
// Look
// ---------------------------------------------------------------------------

// the coat and hair textures are grey with this mean
const COAT_MEAN = 0.62;
const CARDS = new Set(['Mane']);
const MARKED = new Set(['Coat']);

function palette(spec) {
  const coat = new THREE.Color(spec.coat);
  const light = coat.getHSL({}).l > 0.55;
  // dark manes and tails, except on light horses
  const mane = light ? coat.clone().lerp(new THREE.Color('#f0ece4'), 0.2) : new THREE.Color('#1c1611');
  const steel = tiled('plate', '#ffffff', 1, 0.9);
  return {
    Coat: surface(coat.clone().multiplyScalar(1 / COAT_MEAN), 0.62),
    Mane: surface(mane.multiplyScalar(1 / COAT_MEAN), 0.5),
    Eyes: surface('#0e0907', 0.06),
    Saddle: tiled('leather', '#8a6a55', 0.85),
    Tack: tiled('leather', '#6a5244'),
    Iron: steel,
    Cloth: tiled('wool', spec.team),
    Barding: tiled('wool', spec.team),
    Chanfron: steel,
  };
}

function horseMat(spec) {
  const white = spec.marks ? '#f2eee6' : null;
  const coat = new THREE.Color(spec.coat).multiplyScalar(1 / COAT_MEAN);
  return partMaterial({
    key: `horse|${spec.coat}|${spec.team}|${spec.marks}`,
    program: 'horse',
    parts: T.parts,
    palette: palette(spec),
    layerOf: (name) => T.partLayers[name],
    layers: T.layers,
    normals: T.normals,
    tiles: T.tiles,
    cards: CARDS,
    marked: MARKED,
    markColor: white ? new THREE.Color(white).multiplyScalar(1 / 0.8) : coat,
  });
}

// ---------------------------------------------------------------------------
// Gaits: order of the legs (the fraction of a stride at which each hoof
// comes down: front left, front right, hind left, hind right), the part of
// the stride a hoof is on the ground, how high it is lifted, strides per
// second at a speed and how the body moves.
// ---------------------------------------------------------------------------

const GAITS = {
  walk: { legs: [0.25, 0.75, 0, 0.5], duty: 0.64, lift: [0.13, 0.1], freq: (v) => 0.6 + 0.22 * v, bob: 0.018, beats: 2, pitch: 0.008, nod: 0.07 },
  trot: { legs: [0.5, 0, 0, 0.5], duty: 0.42, lift: [0.24, 0.2], freq: (v) => 1.25 + 0.06 * v, bob: 0.045, beats: 2, pitch: 0.01, nod: 0.03 },
  gallop: { legs: [0.46, 0.36, 0.1, 0], duty: 0.27, lift: [0.34, 0.3], freq: (v) => 1.55 + 0.045 * v, bob: 0.07, beats: 1, pitch: 0.06, nod: 0.13 },
};
const GAIT_KEYS = ['legs', 'duty', 'bob', 'pitch', 'nod'];

// levels of detail: full model up close, then about 3.5k and 1.3k triangles
const LOD_DIST = [16, 36];
const CULL_SPHERE = new THREE.Sphere(new THREE.Vector3(0, 1.1, 0), 1.9);
const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);
const TAU = Math.PI * 2;

// scratch
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _t = new THREE.Vector3();

export class SkinnedHorse {
  // spec: {coat, team, barding}
  constructor(spec) {
    this.skinned = true;
    this.spec = { ...spec, marks: Math.random() < 0.55 };
    this.root = new THREE.Group();
    this.object = cloneSkinned(T.scene);
    this.root.add(this.object);
    this.bones = {};
    this.lod = [];
    // per bone: [bone, its model-space rotation, its parent's, rest]
    this.chain = [];
    this.D = {};
    this.object.traverse((o) => {
      if (o.isBone) {
        this.bones[o.name] = o;
        this.D[o.name] = new THREE.Quaternion();
      }
      const m = o.isSkinnedMesh && /_LOD(\d)$/.exec(o.name);
      if (m) this.lod[+m[1]] = o;
    });
    const mat = horseMat(this.spec);
    const shared = this.lod[0].skeleton;
    const piece = spec.barding ? 'Barding' : 'Cloth';
    this.lod.forEach((o, level) => {
      if (o.skeleton !== shared) o.bind(shared, o.bindMatrix);
      o.geometry = geometry(piece, level);
      o.material = mat;
      o.customDepthMaterial = mat.userData.depth;
      // shadows: the full model up close, further away the lightest level
      o.castShadow = level === 0;
      o.receiveShadow = true;
      o.boundingSphere = CULL_SPHERE;
    });
    this.shadow = shadowStandIn(this.lod[2], mat, CULL_SPHERE);
    this.lodLevel = -1;
    this.setLod(0);
    this.frameNo = Math.floor(Math.random() * 4);
    this.pending = 0;
    // gait state
    this.cycle = Math.random();
    this.gait = 'walk';
    this.mix = { legs: [...GAITS.walk.legs], duty: GAITS.walk.duty, bob: 0, pitch: 0, nod: 0 };
    this.move = 0; // 0 standing .. 1 moving
    this.prevYaw = null;
    this.turn = 0;
    this.idle = Math.random() * 100;
    for (const [name, b] of Object.entries(this.bones)) {
      const r = T.rest[name];
      this.chain.push([b, this.D[name], r.parent ? this.D[r.parent] : null, r]);
    }
    this.offset = new THREE.Vector3();
    // for the rider: how far the seat moved from its rest height, the
    // pitch and roll of the back, the stirrups (model space)
    this.seatY = T.seat.y;
    this.seatDY = 0;
    this.pitch = 0;
    this.roll = 0;
    this.stirrups = T.stirrups.map((p) => p.clone());
  }

  setLod(level) {
    if (level === this.lodLevel) return;
    this.lodLevel = level;
    this.lod.forEach((o, i) => (o.visible = i === level));
    this.shadow.visible = level === 1;
  }

  // where a stirrup's tread is in the world (side 'l' or 'r')
  stirrup(side, out) {
    out.copy(this.stirrups[side === 'l' ? 0 : 1]).applyAxisAngle(Y, this.root.rotation.y);
    return out.add(this.root.position);
  }

  // h: the horse's state (pos, yaw, speed, alive, fallT, fallDir)
  update(h, dt, battle) {
    // (a dead horse is placed by fall())
    if (h.alive) {
      this.root.position.copy(h.pos);
      this.root.rotation.set(0, h.yaw, 0);
    }
    // turning rate
    if (this.prevYaw === null) this.prevYaw = h.yaw;
    if (dt > 0) this.turn += (clamp(wrapAngle(h.yaw - this.prevYaw) / dt, -3, 3) - this.turn) * Math.min(1, dt * 6);
    this.prevYaw = h.yaw;
    const d2 = battle.camera.position.distanceToSquared(h.pos);
    const level = d2 < LOD_DIST[0] ** 2 ? 0 : d2 < LOD_DIST[1] ** 2 ? 1 : 2;
    this.setLod(level);
    // animation level of detail: distant horses are posed less often
    this.pending += dt;
    const every = [1, 2, 4][level];
    if (dt > 0 && this.frameNo++ % every !== 0) return;
    dt = this.pending;
    this.pending = 0;
    if (h.alive) this.stride(h, dt, battle.terrain);
    else if (this.fallen !== h.fallT) {
      this.fall(h);
      this.fallen = h.fallT;
    }
  }

  // ---- moving ------------------------------------------------------------------------------

  stride(h, dt, terrain) {
    const v = h.speed;
    const sp = Math.abs(v);
    // turning on the spot also moves the legs
    const eff = Math.max(sp, Math.abs(this.turn) * 0.9);
    let gait = this.gait;
    if (v < 0) gait = 'walk';
    else if (gait === 'walk' && sp > 2.6) gait = 'trot';
    else if (gait === 'trot' && sp > 5.6) gait = 'gallop';
    else if (gait === 'gallop' && sp < 5.0) gait = 'trot';
    else if (gait === 'trot' && sp < 2.1) gait = 'walk';
    this.gait = gait;
    const g = GAITS[gait];
    // blend the timing of the legs and the body's motion towards the gait
    const k = Math.min(1, dt * 4);
    const mix = this.mix;
    for (let i = 0; i < 4; i++) mix.legs[i] = (mix.legs[i] + wrapAngle((g.legs[i] - mix.legs[i]) * TAU) / TAU * k + 1) % 1;
    for (const key of GAIT_KEYS) if (key !== 'legs') mix[key] += (g[key] - mix[key]) * k;
    this.move += (smoothstep(0.05, 0.8, eff) - this.move) * Math.min(1, dt * 5);
    const move = this.move;
    const freq = g.freq(Math.max(eff, 0.8));
    this.cycle = (this.cycle + dt * freq * move * (v < 0 ? -1 : 1) + 1) % 1;
    this.idle += dt;
    const c = this.cycle;
    // hooves travel back on the ground by the distance the body moves
    const travel = Math.min(1.25, (Math.max(sp, Math.abs(this.turn) * 0.5) * mix.duty) / freq) * move;

    // the ground under the hooves: the body pitches to the slope
    const yaw = h.yaw;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    const ground = (z) => terrain.heightAt(h.pos.x + sin * z, h.pos.z + cos * z) - h.pos.y;
    const gf = ground(0.1);
    const gh = ground(-0.95);
    const slope = Math.atan2(gh - gf, 1.05);

    // body: bob, rocking, lean into turns, breathing when standing
    const beat = TAU * c * g.beats;
    const bob = (-mix.bob * Math.cos(beat) - 0.02 * move) * move + (gf + gh) * 0.5;
    const pitch = mix.pitch * Math.sin(TAU * c) * move + slope;
    const breathe = Math.sin(this.idle * 1.7) * 0.004 * (1 - move);
    const roll = clamp(-this.turn * sp * 0.012, -0.12, 0.12);
    this.offset.set(0, bob + breathe, 0);
    const D = this.D;
    D.root.setFromAxisAngle(X, pitch);
    D.root.multiply(_q.setFromAxisAngle(Z, roll));
    D.spine.copy(D.root).multiply(_q.setFromAxisAngle(X, -0.015 * Math.sin(beat) * move));

    // neck and head: nodding with the stride, stretched at speed, turned
    // into the turn; looking around when standing
    const stretch = smoothstep(4, 11, sp);
    const look = (1 - move) * (Math.sin(this.idle * 0.23) * 0.25 + Math.sin(this.idle * 0.61) * 0.1);
    const graze = (1 - move) * Math.max(0, Math.sin(this.idle * 0.11) - 0.6) * 0.8;
    const nod = mix.nod * Math.sin(TAU * c * g.beats + 0.8) * move;
    D.neck.copy(D.spine)
      .multiply(_q.setFromAxisAngle(Y, clamp(this.turn * 0.22, -0.4, 0.4) + look))
      .multiply(_q2.setFromAxisAngle(X, nod + stretch * 0.25 + graze - pitch * 0.5));
    D.head.copy(D.neck).multiply(_q.setFromAxisAngle(X, -nod * 0.6 - stretch * 0.1 + graze * 0.3));
    // ears: forward when moving, flicking now and then when standing
    for (let s = 0; s < 2; s++) {
      const flick = (1 - move) * Math.max(0, Math.sin(this.idle * (0.9 + s * 0.37) + s * 2) - 0.85) * 5;
      const name = s ? 'ear_r' : 'ear_l';
      D[name].copy(D.head).multiply(_q.setFromAxisAngle(Y, (s ? -1 : 1) * flick * 0.6)).multiply(_q2.setFromAxisAngle(X, 0.15 * move));
    }
    // tail: carried higher at speed, swishing when standing
    const swish = Math.sin(this.idle * 2.3) * (1 - move) * Math.max(0, Math.sin(this.idle * 0.37)) * 0.5;
    const lift = 0.15 * move + 0.3 * stretch + 0.05 * Math.sin(TAU * c * g.beats) * move;
    D.tail_1.copy(D.root).multiply(_q.setFromAxisAngle(Y, swish)).multiply(_q2.setFromAxisAngle(X, lift));
    D.tail_2.copy(D.tail_1).multiply(_q.setFromAxisAngle(Y, swish * 0.8)).multiply(_q2.setFromAxisAngle(X, lift * 0.4 - pitch));

    // legs
    for (let i = 0; i < 4; i++) {
      const leg = LEGS[i];
      const L = T.legs[leg];
      const u = (c - mix.legs[i] + 2) % 1;
      let dz;
      let dy = 0;
      if (u < mix.duty) dz = travel * (0.5 - u / mix.duty);
      else {
        const w = (u - mix.duty) / (1 - mix.duty);
        dz = travel * (-0.5 + w * w * (3 - 2 * w));
        // lifted early in the swing, the front feet higher
        dy = g.lift[L.front ? 0 : 1] * Math.sin(Math.PI * Math.pow(w, 0.8)) * smoothstep(0, 0.5, travel);
      }
      const hoof = L.j[3];
      _t.set(hoof.x, hoof.y + dy + ground(hoof.z + dz), hoof.z + dz);
      this.leg(leg, L, _t, L.front ? D.spine : D.root);
    }
    this.apply();

    // for the rider
    this.pitch = pitch;
    this.roll = roll;
    this.bodyPoint(T.seat, _v);
    this.seatDY = _v.y - T.seat.y;
    for (let s = 0; s < 2; s++) this.bodyPoint(T.stirrups[s], this.stirrups[s]);
  }

  // a point that moves with the back (the saddle): rest position -> now
  bodyPoint(p, out) {
    out.subVectors(p, T.hips).applyQuaternion(this.D.spine);
    return out.add(T.hips).add(this.offset);
  }

  // Put the hoof of a leg at `target` (model space). The upper bone swings
  // part of the way; the two lower bones bend at the knee (front, forwards)
  // or the hock (hind, backwards) in the plane of the body.
  leg(name, L, target, parentD) {
    const D = this.D;
    // the top of the leg where the body has moved it
    const top = _v.subVectors(L.j[0], T.hips).applyQuaternion(parentD).add(T.hips).add(this.offset);
    const reach = Math.atan2(target.z - top.z, -(target.y - top.y));
    const a1 = L.rest[0] + (reach - L.reach) * (L.front ? 0.75 : 0.6);
    const u = Math.hypot(L.j[1].y - L.j[0].y, L.j[1].z - L.j[0].z);
    const ky = top.y - Math.cos(a1) * u;
    const kz = top.z + Math.sin(a1) * u;
    const ty = target.y - ky;
    const tz = target.z - kz;
    const d = clamp(Math.hypot(ty, tz), Math.abs(L.a - L.b) + 1e-3, (L.a + L.b) * 0.9995);
    const cosA = clamp((L.a * L.a + d * d - L.b * L.b) / (2 * L.a * d), -1, 1);
    const dir = Math.atan2(tz, -ty);
    const a2 = dir + (L.front ? 1 : -1) * Math.acos(cosA);
    const my = ky - Math.cos(a2) * L.a;
    const mz = kz + Math.sin(a2) * L.a;
    const a3 = Math.atan2(target.z - mz, -(target.y - my));
    // absolute rotations about the body's side axis (+ forwards is -X)
    D[`${name}_1`].setFromAxisAngle(X, -(a1 - L.rest[0]));
    D[`${name}_2`].setFromAxisAngle(X, -(a2 - L.rest[1]));
    D[`${name}_3`].setFromAxisAngle(X, -(a3 - L.rest[2]));
  }

  // bone rotations from their model-space rotations D (relative to rest):
  // local = parentRest^-1 * D_parent^-1 * D * parentRest * localRest
  apply() {
    for (const [b, d, parent, r] of this.chain) {
      _q.copy(r.parentInv);
      if (parent) _q.multiply(_q2.copy(parent).invert());
      b.quaternion.copy(_q).multiply(d).multiply(r.parentQ).multiply(r.q);
    }
    // the root carries the body's bob
    _v.copy(this.offset).applyQuaternion(T.rest.root.parentInv);
    this.bones.root.position.copy(T.rest.root.p).add(_v);
  }

  // ---- falling dead ------------------------------------------------------------------------

  fall(h) {
    const f = h.fallT || 0;
    const e = f * f * (3 - 2 * f);
    const D = this.D;
    // onto its side, legs folding, the head dropping
    this.root.rotation.set(0, h.yaw, 0);
    this.root.rotateZ((h.fallDir || 1) * (Math.PI / 2) * e);
    this.offset.set(0, -0.1 * e, 0);
    D.root.identity();
    D.spine.identity();
    // the neck bends down to the ground (the side it lies on) and back
    const down = -(h.fallDir || 1);
    D.neck.setFromAxisAngle(Y, down * 0.45 * e).multiply(_q.setFromAxisAngle(X, -0.15 * e));
    D.head.copy(D.neck).multiply(_q.setFromAxisAngle(Y, down * 0.3 * e));
    D.ear_l.copy(D.head);
    D.ear_r.copy(D.head);
    D.tail_1.identity();
    D.tail_2.identity();
    for (const leg of LEGS) {
      const front = leg.startsWith('front');
      D[`${leg}_1`].setFromAxisAngle(X, (front ? -0.2 : 0.25) * e);
      D[`${leg}_2`].setFromAxisAngle(X, (front ? -0.3 : 0.1) * e);
      D[`${leg}_3`].setFromAxisAngle(X, (front ? 0.5 : -0.4) * e);
    }
    this.apply();
    // lying on the side of the barrel, not in the ground
    this.root.position.set(h.pos.x, h.pos.y, h.pos.z).addScaledVector(Y, 0.34 * e);
  }
}
