// A soldier on the battlefield: equipment, stats, action state machine,
// movement physics and procedural animation.
import * as THREE from 'three';
import { ITEMS } from '../data/items.js';
import { TROOPS } from '../data/troops.js';
import { buildHuman, buildHorse, weaponGeo, shieldGeo, arrowGeo, stringGeo, bowNock, armQuat, pickSkin, pickHair, ARROW_NOCK, ARROW_REST, BOW_CANT, BOW_LOWER, STRING_NOCK } from './models.js';
import { SkinnedHorse, horseReady } from './horse.js';
import { T, allowedDir } from './combat.js';
import { SkinnedHuman, charactersReady, itemMaterial, knightArms, LIE, lieHeight, lieTarget, lieTurn, onGround, GROUND_FOLLOW } from './character.js';
import { groundFit, fitNormal, layFlat, footprint, lowest, rigidGrip, secondFor, secondRanges, STEEPEST } from './grips.js';
import { stature, scaledY, hitZone, NEUTRAL } from './stature.js';
import { coatFor, ownCoat } from './coats.js';
import { clamp, wrapAngle, approachAngle, smoothstep } from '../core/util.js';
import { sideCloth } from '../data/dyes.js';

// colour of the mud and dust on legs and hooves, by the ground fought on
const MUD = { steppe: '#8a7457', desert: '#a08a68', arena: '#a08a68', snow: '#5b5650', forest: '#3e3226', taiga: '#3e3226', hills: '#56473a' };
export const mudOf = (terrain) => MUD[terrain] || '#4b3d2c';

const Q = (arm, hint) => armQuat(arm, hint);
const HALF_PI = Math.PI / 2;
// how far a soldier turns his head to his foe from
const LOOK_DIST = 40;
// a rider's hip joints above the seat of a (realistic) saddle; the pose rig's
// hips above its feet (models.js buildHuman, of the model's size)
const SEAT_PELVIS = 0.1;
const HIPS = 0.92;

// Build a pose from the arm direction and the desired direction of the held
// item (blade). The wrist angle bends the item towards the arm axis.
function P(arm, blade, twist = 0, pitch = 0) {
  const d = new THREE.Vector3(arm[0], arm[1], arm[2]).normalize();
  const b = new THREE.Vector3(blade[0], blade[1], blade[2]).normalize();
  const along = b.dot(d);
  const zp = b.clone().addScaledVector(d, -along);
  let wrist;
  if (zp.lengthSq() < 1e-4) {
    zp.set(0, 1, 0).addScaledVector(d, -d.y);
    wrist = along > 0 ? HALF_PI : -HALF_PI;
  } else {
    wrist = Math.atan2(along, zp.length());
  }
  return { q: armQuat([d.x, d.y, d.z], [zp.x, zp.y, zp.z]), wrist, twist, pitch };
}

// The right arm's poses of the pose rig (the realistic body's right hand
// goes where the rig's does). Each gives
// - `arm`: a straight arm that way; or `hand`: the hand there (m, in the
//   torso's space: x his left, y up from his hips, z forward): the
//   realistic body bends its elbow to put it there, the low graphics'
//   straight arm points at it (or `low`: that way);
// - `blade`: the way the held item points; `twist`, `pitch`: the torso's
//   turn and bend;
// - `ground`: a pole stood on the ground: it slides down in the hand till
//   its butt is there (Agent.slideFor);
// - `free`: the second hand rests (lets go of a two-handed weapon);
// - `floor`: a long weapon held point down: on a man shorter than the model
//   (stature.js) the hand no lower above the ground than the model's, the
//   weapon being as long (its point would go into the ground); and the
//   hands raised (or lowered) as the ground under its point is higher (or
//   lower) than under his feet (Agent.floorLift).
// poseTable builds them for a rig's shoulder and arm.
const ONE = {
  // the blade forward and down, the arm by the side
  idle: { arm: [-0.15, -1, 0.22], blade: [-0.06, -0.6, 1] },
  ready: {
    right: { arm: [-0.9, 0.35, -0.3], blade: [-0.4, 0.5, -0.8], twist: -0.7 },
    left: { arm: [0.7, 0.45, 0.1], blade: [0.5, 0.4, -0.8], twist: 0.6 },
    overhead: { arm: [-0.25, 1, -0.15], blade: [0, 0.2, -1], twist: -0.1, pitch: -0.15 },
    thrust: { arm: [-0.35, -0.9, -0.25], blade: [0, 0.05, 1], twist: -0.35 },
  },
  strike: {
    right: { arm: [0.75, -0.05, 0.65], blade: [1, 0.05, 0.35], twist: 0.6, pitch: 0.05 },
    left: { arm: [-0.8, -0.05, 0.55], blade: [-1, 0.05, 0.3], twist: -0.6, pitch: 0.05 },
    overhead: { arm: [-0.1, -0.35, 1], blade: [0, -0.6, 1], pitch: 0.28 },
    thrust: { arm: [-0.1, 0, 1], blade: [0, -0.02, 1], twist: 0.25, pitch: 0.1 },
  },
  block: {
    left: { arm: [0.3, -0.2, 0.8], blade: [0.1, 1, 0.1] },
    right: { arm: [-0.7, -0.2, 0.6], blade: [-0.1, 1, 0.1] },
    up: { arm: [-0.2, 0.5, 0.8], blade: [1, 0.1, 0] },
    down: { arm: [-0.1, -0.5, 0.8], blade: [0.7, 0.6, 0.2] },
  },
};
// A spear or a fork: upright by the right foot at rest (its butt a little
// ahead of the foot and out, clear of a long coat's skirt as he shifts his
// weight); carried upright off the ground, lower in the hand, its point a
// little ahead, on the move (Agent.restShare) or on a horse; the player's
// at the trail, at rest too (by his side at the hip, its point ahead and a
// little down: out of his sight, the camera over his right shoulder); in a
// fight held low at the hip and thrust, or overhand, the second hand ahead
// of the right (grips.js SECOND) where it reaches. (Held at the hip, the
// right hand stays out by his side, its butt end crossing behind it outside
// his hip, not through his belly.)
const POLE = {
  idle: { hand: [-0.36, 0.28, 0.18], blade: [0.017, 1, -0.05], ground: 1, free: 1 },
  carry: { hand: [-0.34, 0.12, 0.16], blade: [0.03, 1, 0.12], free: 1 },
  trail: { arm: [-0.2, -1, 0.15], blade: [0, -0.1, 1], free: 1 },
  ready: {
    thrust: { hand: [-0.27, 0.22, 0.16], blade: [0.3, 0.1, 1], twist: -0.3 },
    overhead: { hand: [-0.24, 0.82, 0], blade: [0.1, -0.22, 1], twist: -0.2 },
  },
  strike: {
    thrust: { hand: [-0.25, 0.3, 0.36], blade: [0.22, 0.03, 1], twist: -0.2, pitch: 0.12 },
    overhead: { hand: [-0.16, 0.5, 0.36], blade: [0.06, -0.4, 1], twist: 0.25, pitch: 0.15 },
  },
  block: {
    left: { hand: [0, 0.2, 0.36], blade: [0.25, 1, 0.1] },
    right: { hand: [-0.2, 0.18, 0.38], blade: [-0.15, 1, 0.1] },
    up: { hand: [-0.25, 0.78, 0.3], blade: [1, 0.05, 0.1] },
    down: { hand: [-0.12, 0.12, 0.38], blade: [0.55, -0.45, 0.7] },
  },
};
// A two-handed sword or axe, both hands on its grip (grips.js SECOND): at
// rest point down before him, carried on the right shoulder when he moves;
// cocked over a shoulder or overhead, swept across, thrust from the right
// hip (its pommel by the hip, not in his belly).
const TWO = {
  idle: { hand: [-0.08, 0.3, 0.36], blade: [0, -1, 0.45], floor: 1 },
  carry: { hand: [-0.2, 0.26, 0.26], blade: [0.05, 0.78, -0.62], free: 1 },
  ready: {
    right: { hand: [-0.16, 0.6, 0.3], blade: [-0.3, 0.55, -0.78], twist: -0.6 },
    left: { hand: [0.12, 0.58, 0.28], blade: [0.3, 0.55, -0.78], twist: 0.5 },
    overhead: { hand: [-0.04, 0.88, 0.2], blade: [0, 0.6, -0.8], pitch: -0.12 },
    thrust: { hand: [-0.25, 0.24, 0.3], blade: [0.25, 0.35, 1], twist: -0.3 },
  },
  strike: {
    right: { hand: [0.08, 0.25, 0.42], blade: [0.8, -0.1, 0.6], twist: 0.55 },
    left: { hand: [-0.2, 0.25, 0.4], blade: [-0.8, -0.1, 0.6], twist: -0.5 },
    overhead: { hand: [-0.05, 0.22, 0.45], blade: [0, -0.45, 1], pitch: 0.25 },
    thrust: { hand: [-0.06, 0.36, 0.52], blade: [0.05, 0.02, 1], twist: 0.2, pitch: 0.1 },
  },
  block: {
    left: { hand: [0.1, 0.3, 0.38], blade: [0.15, 1, 0.12] },
    right: { hand: [-0.16, 0.36, 0.4], blade: [-0.15, 1, 0.12] },
    up: { hand: [0.14, 0.82, 0.3], blade: [-1, 0.12, 0.15] },
    down: { hand: [-0.08, 0.2, 0.4], blade: [-0.45, -0.8, 0.4], floor: 1 },
  },
};
const OTHER = {
  // a one-handed weapon on a horse, and javelins or throwing axes at rest:
  // held up, a little forward, clear of the horse's neck and head and of his
  // own legs (ONE.idle's would go down into them)
  upright: { hand: [-0.33, 0.32, 0.16], blade: [0.06, 1, 0.35] },
  // a lance on foot stood on the ground by the right foot, carried upright
  // off it on the move (as a pole: POLE); upright or couched on a horse
  idleLance: { hand: [-0.36, 0.28, 0.18], blade: [0.017, 1, -0.04], ground: 1 },
  carryLance: { hand: [-0.34, 0.12, 0.16], blade: [0.03, 1, 0.1] },
  rideLance: { arm: [-0.2, -1, 0.15], blade: [0, 1, 0.25] },
  couch: { arm: [-0.28, -0.96, -0.1], blade: [0, 0.02, 1] },
  // a crossbow: aimed with its butt at the cheek, the second hand under its
  // stock; spanned bent over it; carried at the hip
  xbow: { hand: [-0.12, 0.55, 0.28], blade: [0, 0, 1], low: [-0.12, -0.2, 1] },
  xbowReload: { hand: [-0.08, 0.27, 0.3], blade: [0, -0.55, 0.83], pitch: 0.3, low: [-0.1, -1, 0.35] },
  xbowRest: { hand: [-0.22, 0.12, 0.2], blade: [0.1, -0.4, 1], free: 1, low: [-0.12, -1, 0.3] },
  // the drawing arm of an archer at rest (Agent.archerRig draws it)
  bowRest: { arm: [-0.12, -1, 0.05], blade: [0, -0.3, 1] },
};

// The poses of the specs above for a rig whose right shoulder is at
// `shoulder` (torso space) with an arm `len` long, that bends (the realistic
// body) or not, of a man `k` times the model's height (the rig is as much
// larger): {q, wrist, ext (the hand's distance from the shoulder, of len),
// twist, pitch, ground, free, floor}, in the specs' shape. (The model's shoulder,
// `k` to the hundredth and 1 for the taller: a few tables, kept for good.)
const poseTables = new Map();
function poseTable(shoulder, len, bends, k = 1) {
  const key = `${shoulder.x},${shoulder.y},${shoulder.z},${len},${bends},${k}`;
  let table = poseTables.get(key);
  if (table) return table;
  const arm = new THREE.Vector3();
  const build = (spec) => {
    if (!spec.blade) return Object.fromEntries(Object.entries(spec).map(([name, v]) => [name, build(v)]));
    let ext = 1;
    if (spec.low && !bends) arm.fromArray(spec.low);
    else if (spec.hand) {
      arm.fromArray(spec.hand);
      if (spec.floor) arm.y = (HIPS + arm.y) / k - HIPS;
      arm.sub(shoulder);
      if (bends) ext = Math.min(1, arm.length() / len);
    } else arm.fromArray(spec.arm);
    const p = P([arm.x, arm.y, arm.z], spec.blade, spec.twist, spec.pitch);
    return { ...p, ext, ground: spec.ground || 0, free: spec.free || 0, floor: spec.floor || 0 };
  };
  table = { one: build(ONE), pole: build(POLE), two: build(TWO), ...build(OTHER) };
  poseTables.set(key, table);
  return table;
}

// `out` a pose `t` of the way from `p0` to `p1`.
function blendPose(out, p0, p1, t) {
  out.q.copy(p0.q).slerp(p1.q, t);
  out.wrist = p0.wrist + (p1.wrist - p0.wrist) * t;
  out.twist = p0.twist + (p1.twist - p0.twist) * t;
  out.pitch = p0.pitch + (p1.pitch - p0.pitch) * t;
  out.ext = p0.ext + (p1.ext - p0.ext) * t;
  out.ground = p0.ground + (p1.ground - p0.ground) * t;
  out.free = p0.free + (p1.free - p0.free) * t;
  out.floor = p0.floor + (p1.floor - p0.floor) * t;
}

// The left arm of the low graphics' rig: hanging free, holding a bow
// lowered (it points forward and down), holding the reins.
const LEFT = {
  free: Q([0.15, -1, 0.1], [0, 0, 1]),
  bowRest: Q([0.3, -1, 0.3], [0, -0.4, 1]),
  lance: Q([0.2, -0.9, 0.3], [0, 0, 1]),
};

// The archer (Agent.drawPose): his chest turns this far from the target,
// to his right (rad; side-on: his bow arm's shoulder towards it), his feet
// this far of it on foot (the rest is his spine's). On a horse his hips
// turn in the saddle this share of it, at most SEAT_TURN, his spine the
// rest, at most SPINE_TURN (a man's spine turns 45-50 degrees): no farther
// from the horse's way (he cannot turn side-on to a target much to his
// right: ai.js keeps it on his left). He leans away from the target (rad,
// of his aim's pitch) to aim up. How fast he raises and lowers the bow and
// draws (1/s), and turns side-on and back (1/s, eased: a turn takes
// 1/SIDE_RATE s); how long he keeps his stance after a shot (s), if he does
// not move off, to draw again.
const SIDE = -1.36;
const FEET_TURN = -0.95;
const SEAT_SHARE = 0.4;
const SEAT_TURN = 0.5;
const SPINE_TURN = 0.8;
const LEAN = 0.6;
const DRAW_EASE = 14;
const SIDE_RATE = 2.5;
const STANCE_HOLD = 1.5;
// He raises the bow over this share of his draw; the arrow is on the string
// once his drawing hand is there (it is this share of the way from hanging),
// and then he draws.
const DRAW_RAISE = 0.35;
const NOCK_AT = 0.99;
// (the low graphics' drawing hand takes the string from this share of the
// way to his jaw: archerRig)
const LOW_TAKE = 0.85;
// The anchor of the low graphics' archer: the drawing hand by the right of
// his jaw (models.js headGeo, in the neck's space).
const JAW_LOW = new THREE.Vector3(-0.105, 0.12, 0.04);
// where a pole's butt stands, above the ground (m); it slides down in the
// hand to stand there as it comes upright, from and to how far it rises a
// metre along it (Agent.slideFor)
const BUTT_CLEAR = 0.03;
const SLIDE_UP = [0.9, 0.97];
// a pole stands on the ground, a two-handed weapon rests point down, while
// he stands: wholly below the first speed, not at all above the second
// (m/s; Agent.restShare)
const REST_SPEED = [0.4, 1.4];
// a weapon held point down (a pose's `floor`): its lowest corner kept from
// FLOOR_CLEAR to FLOOR_HOVER m above the ground under it, the hands raised
// FLOOR_LIFT m at most (and lowered FLOOR_DROP m at most) for it
// (Agent.floorLift)
const FLOOR_CLEAR = 0.02;
const FLOOR_HOVER = 0.1;
const FLOOR_LIFT = 0.3;
const FLOOR_DROP = 0.12;
// the low graphics' straight left arm takes a two-handed weapon this much
// shorter or longer than it is, at most (of its length)
const LOW_REACH = [0.85, 1.1];

const Z = new THREE.Vector3(0, 0, 1);
// (the low graphics' second hand's place on the weapon: secondRig)
const SECOND_AT = [0, 0, 0];
// an archer's way to his target in his torso's space (animateRig)
const AIM = new THREE.Vector3();
const SG = { b: new THREE.Vector3(), d: new THREE.Vector3() };

// A bowstring's holder (models.js stringGeo) spanning from `a` to `b` (in its
// parent's space).
function span(h, a, b) {
  const d = SG.d.subVectors(b, a);
  const len = d.length();
  h.position.copy(a);
  h.quaternion.setFromUnitVectors(Z, d.divideScalar(len || 1));
  h.scale.set(1, 1, Math.max(len, 1e-3));
}
// Turn a part of a rig (its rotation, or its quaternion to `q`) only if that
// changes it: each turn works out the other of the two (three.js keeps them
// in step), most of the cost of posing a rig, and a man standing or holding
// a guard keeps most of his.
function turnTo(o, x, y, z) {
  const e = o.rotation;
  if (e.x !== x || e.y !== y || e.z !== z) e.set(x, y, z);
}
function quatTo(o, q) {
  if (!o.quaternion.equals(q)) o.quaternion.copy(q);
}

const SHIELD_POSE = {
  idle: { pos: new THREE.Vector3(0.33, 0.1, 0.18), rotY: 1.0, rotX: 0 },
  block: { pos: new THREE.Vector3(0.06, 0.4, 0.45), rotY: 0.05, rotX: -0.08 },
  back: { pos: new THREE.Vector3(0, 0.3, -0.19), rotY: Math.PI, rotX: 0 },
  ride: { pos: new THREE.Vector3(0.36, 0.14, 0.12), rotY: 1.25, rotX: 0 },
};

const tmpQ = new THREE.Quaternion();
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();

// a fall to the ground takes this long (s)
const FALL_TIME = 0.8;
// the ways of lying (character.js LIE) after a fall on the back: on the back
// or on a side; on the face: on the face or on a side. (A long stiff skirt,
// the mail look's surcoat, does not lie on the back with a knee up: its hem
// would stand up off the knee as a sheet. SkinnedHuman.longSkirt)
const BACK_LIES = [0, 1, 3];
const BACK_LIES_SKIRT = [0, 3];
const FACE_LIES = [2, 3];
// how far a falling body turns, at most, to fall straight away from the blow
const FALL_TURN = 0.7;
// a hand or foot the ground under which is this much (m) farther below or
// above the plane he lies on than his hands and feet follow it
// (character.js GROUND_FOLLOW) is over a drop or in a bank (fallHeading)
const LIMB_SLACK = 0.03;
// turned farther round in these steps (rad), if he would lie over a drop,
// up a wall or across a sharp bend of the ground that way (a sample farther
// off the fitted plane than FALL_BEND m: natural ground stays within 7 cm),
// or on ground sloping more than FALL_TILT (rad) from where he stood or
// steeper than any natural ground (grips.js STEEPEST: the banks between the
// plateau and the ramp) (his pelvis landing as far from his feet as the way
// he will lie has it: LIE[].reach)
const FALL_STEP = 0.35;
const FALL_BEND = 0.08;
const FALL_TILT = 0.3;
// with his back to a wall (his feet in it as he lies) he lands this much
// farther from it (m)
const FALL_PUSH = 0.4;
// Where a body will lie, about (Agent.lieSketch): points along his trunk
// (m up the model from its feet), then his wrists and ankles (LIE's). A
// point of his within CORPSE_CLEAR m of one of a body lying there already
// (its feet within CORPSE_NEAR m of his) is over it: he turns to lie over
// fewer of them, no farther round than CORPSE_TURN (rad) from the way he
// falls (Agent.fallHeading).
const SKETCH_TRUNK = [0.35, 0.65, 0.95, 1.2, 1.45, 1.65];
const SKETCH_LIMBS = ['arm_l', 'arm_r', 'leg_l', 'leg_r'];
const SKETCH = new Float64Array(2 * (SKETCH_TRUNK.length + SKETCH_LIMBS.length));
const CORPSE_CLEAR = 0.35;
const CORPSE_NEAR = 4;
const CORPSE_TURN = 1.05;
// a thing he drops falls to the ground in this long, at least and at most
// (s); and stays this far above it while it falls (m)
const DROP_TIME = [0.25, 0.6];
const DROP_CLEAR = 0.01;
// (the points of the bodies by him and what they let fall that a thing he
// drops keeps clear of: within this of the middle of his body, m)
const DROP_REACH = 3.2;
const F = {
  q: new THREE.Quaternion(),
  q2: new THREE.Quaternion(),
  e: new THREE.Euler(),
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
  c: new THREE.Vector3(),
  m: new THREE.Matrix4(),
  m2: new THREE.Matrix4(),
  fit: {},
};

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// How many of the points `pts` (x, z, ...) are within CORPSE_CLEAR of one of
// those of the bodies `near` (each x, z, ...).
function crowding(pts, near) {
  const r2 = CORPSE_CLEAR * CORPSE_CLEAR;
  let n = 0;
  for (let i = 0; i < pts.length; i += 2) {
    let over = false;
    for (let b = 0; b < near.length && !over; b++) {
      const q = near[b];
      for (let j = 0; j < q.length; j += 2) {
        if ((pts[i] - q[j]) ** 2 + (pts[i + 1] - q[j + 1]) ** 2 < r2) {
          over = true;
          break;
        }
      }
    }
    if (over) n++;
  }
  return n;
}

let nextAgentId = 1;

export class Agent {
  constructor(battle, opts) {
    this.battle = battle;
    this.id = nextAgentId++;
    this.team = opts.team;
    this.key = opts.key;
    this.troopId = opts.troopId || null;
    this.isPlayer = !!opts.isPlayer;
    this.isHero = !!opts.hero;
    this.alive = true;
    this.pos = new THREE.Vector3(opts.x, battle.terrain.heightAt(opts.x, opts.z), opts.z);
    this.vel = new THREE.Vector3();
    this.yaw = opts.yaw || 0;
    this.faceYaw = this.yaw;
    this.aimYaw = this.yaw;
    // where he looks, relative to his body (or horse), and the neck's turn
    this.look = 0;
    this.lookYaw = 0;
    this.aimPitch = 0;
    this.move = { x: 0, z: 0, walk: false };
    this.ride = { throttle: 0, turn: 0 };
    this.action = { s: 'idle', t: 0, dur: 0 };
    this.couched = false;
    this.couchCd = 0;
    this.loaded = true;
    this.fallT = 0;
    // how he lies once fallen (lieLayout), what he let fall (dropItems), and
    // whether his fall is over
    this.lie = null;
    this.drops = null;
    this.settled = false;
    this.lastHitBy = null;
    this.kills = 0;
    this.wounded = false;
    this.bumpCd = 0;
    this.ai = { nextThink: Math.random() * 0.4, attackCd: Math.random(), strafe: Math.random() < 0.5 ? 1 : -1, strafeT: 0 };
    this.group = opts.group || 'inf';
    this.name = opts.name || '';
    // his build by his id (stature.js; a chosen one instead, the model's for
    // the player: his camera, his reach and where he is hit as they were; a
    // companion's by his name, the same in every battle as his horse's coat:
    // makeHorse), and where missiles hit him on foot and on a horse
    this.stature = opts.stature || (this.isPlayer ? NEUTRAL : stature(opts.hero ? opts.hero.key || opts.hero.name : this.id));
    this.zones = [hitZone(this.stature, false), hitZone(this.stature, true)];

    // ---- equipment and stats
    const rnd = Math.random;
    const pick = (list) => (list && list.length ? list[Math.floor(rnd() * list.length)] : null);
    let eq;
    if (opts.loadout) {
      eq = opts.loadout;
    } else if (opts.hero) {
      const e = opts.hero.equipment;
      eq = { weapons: [e.w1, e.w2, e.w3].filter(Boolean), shield: e.shield, armor: e.armor, helmet: e.helmet, horse: e.horse };
    } else {
      const t = TROOPS[this.troopId];
      eq = {
        weapons: [pick(t.eq.melee), pick(t.eq.ranged)].filter(Boolean),
        shield: pick(t.eq.shield),
        armor: pick(t.eq.armor),
        helmet: pick(t.eq.helmet),
        horse: pick(t.eq.horse),
      };
    }
    if (!eq.weapons.length) eq.weapons = ['club'];
    this.weapons = eq.weapons;
    this.shield = eq.shield || null;
    this.armorItem = eq.armor ? ITEMS[eq.armor] : null;
    this.helmItem = eq.helmet ? ITEMS[eq.helmet] : null;
    this.bodyArmor = this.armorItem ? this.armorItem.armor : 0;
    this.headArmor = this.helmItem ? this.helmItem.armor : 0;
    this.ammo = {};
    for (const w of this.weapons) if (ITEMS[w].slot === 'ranged') this.ammo[w] = ITEMS[w].ammo;

    if (opts.hero) {
      const h = opts.hero;
      this.maxHp = h.maxHp;
      this.hp = Math.max(1, h.hp);
      this.atkSpeed = 0.95 + h.attrs.agi * 0.012;
      this.power = 1 + h.skills.power_strike * 0.08 + h.attrs.str * 0.01;
      this.rpower = 1 + h.skills.power_draw * 0.1;
      this.runSpeed = 4.7 * (1 + h.skills.athletics * 0.04);
      this.riding = h.skills.riding;
      this.blockSkill = this.isPlayer ? 0.6 : Math.min(0.85, 0.35 + h.level * 0.05);
      this.aimErr = this.isPlayer ? 0.012 : Math.max(0.015, 0.05 - (h.skills.power_draw || 0) * 0.006);
      this.tier = Math.max(3, Math.round(h.level / 2));
    } else if (this.troopId) {
      const t = TROOPS[this.troopId];
      this.maxHp = t.hp;
      this.hp = t.hp;
      this.atkSpeed = 0.88 + t.ms * 0.02;
      this.power = 1 + t.tier * 0.05;
      this.rpower = 1 + t.rs * 0.03;
      this.runSpeed = 3.95 + t.ms * 0.06;
      this.riding = t.rd;
      this.blockSkill = Math.min(0.88, 0.16 + t.ms * 0.075);
      this.aimErr = Math.max(0.012, 0.062 - t.rs * 0.0048);
      this.tier = t.tier;
    } else {
      this.maxHp = opts.hp || 60;
      this.hp = this.maxHp;
      this.atkSpeed = 1;
      this.power = 1.1;
      this.rpower = 1;
      this.runSpeed = 4.3;
      this.riding = 3;
      this.blockSkill = 0.5 + Math.random() * 0.3;
      this.aimErr = 0.03;
      this.tier = 3;
    }
    this.reaction = 0.28 - Math.min(0.18, this.blockSkill * 0.18);

    // horse
    this.horse = null;
    if (eq.horse && !opts.noHorse) this.mountHorse(this.makeHorse(eq.horse, opts));
    this.radius = this.horse ? 0.85 : 0.36;

    // prefer the ranged weapon for archers, the melee one otherwise
    this.wi = 0;
    const rangedIdx = this.weapons.findIndex((w) => ITEMS[w].slot === 'ranged');
    const meleeIdx = this.weapons.findIndex((w) => ITEMS[w].slot === 'melee');
    if (!this.isPlayer) {
      const t = this.troopId ? TROOPS[this.troopId] : null;
      if (((t && (t.type === 'arch' || t.type === 'harch')) || opts.preferRanged) && rangedIdx >= 0) this.wi = rangedIdx;
      else if (meleeIdx >= 0) this.wi = meleeIdx;
    }

    // visuals
    const colors = opts.colors || { team: '#888888', team2: '#dddddd' };
    const r1 = Math.random;
    // clothes: the side's dyed field colour on the big garment (or each
    // man's own among bandits), the rest from the side's pool, each man's
    // cloth a little faded and lighter or darker
    const cloth = colors.cloth || sideCloth('bandits');
    const troop = this.troopId ? TROOPS[this.troopId] : null;
    const spec = {
      look: this.armorItem ? this.armorItem.look : 'cloth',
      coif: !!(this.armorItem && this.armorItem.coif),
      // the Nords' own clothes (character.js NORSE)
      kit: (opts.hero && opts.hero.kit) || (troop ? troop.kit || (troop.faction === 'nordheim' ? 'norse' : null) : null),
      helmet: this.helmItem ? this.helmItem.look : null,
      team: colors.team,
      team2: colors.team2,
      faction: troop ? troop.faction : 'player',
      sign: cloth.sign || pick(cloth.pool),
      fade: r1() * 0.25,
      shade: 0.94 + r1() * 0.12,
      // a hood: one of the first colours of the pool
      hood: cloth.pool[Math.floor(r1() * Math.min(3, cloth.pool.length))],
      // mud and dust from the ground on the legs: footmen more than riders
      dirt: (0.25 + r1() * 0.45) * (this.horse ? 0.4 : 1) * (this.tier >= 5 ? 0.7 : 1),
      mud: mudOf(battle.terrain && battle.terrain.type),
      skin: pickSkin(r1),
      hair: pickHair(r1),
      beard: r1() < 0.45 ? (r1() < 0.6 ? 'full' : 'moustache') : null,
      stubble: r1() < 0.5,
      pants: pick(cloth.pool),
      // the army's sign (dyes.js sideSign), and a knight's own coat of arms:
      // on his garment when he fights for his faction (else the sign of the
      // side he fights for), on his shield always
      badge: colors.badge || null,
      arms: troop && troop.arms ? knightArms(this.id) : -1,
      armsWorn: !!troop && troop.faction === colors.faction,
      stature: this.stature,
      // a chosen face (skin, hair, beard, stubble) instead of a random one
      ...opts.appearance,
    };
    // (arms are sewn new for the campaign)
    if (spec.arms >= 0) spec.fade = Math.min(spec.fade, 0.1);
    this.arms = spec.arms;
    // the worn edges of the clothes (partmat.js PART_MASKS): as worn as faded
    spec.wear = 0.5 + 2 * spec.fade;
    // realistic skinned body (medium/high graphics) or the procedural one
    spec.driverOnly = !!(battle.gfx && battle.gfx.standard && charactersReady());
    this.rig = buildHuman(spec);
    if (spec.driverOnly) {
      this.body = new SkinnedHuman(spec, battle.props);
      this.rig.root.add(this.body.object);
      this.body.fitDriver(this.rig);
    }
    this.rig.root.rotation.order = 'YXZ';
    this.rig.torso.rotation.order = 'YXZ';
    this.rig.neck.rotation.order = 'YXZ';
    battle.scene.add(this.rig.root);
    this.colors = colors;
    // (what setupMeshes and animate set, the same for every soldier from
    // the start: a bow's string and arrow, the way his body faces)
    this.weaponMesh = this.shieldMesh = this.backMesh = null;
    this.strings = this.nocked = this.backStrings = null;
    this.stringStraight = false;
    this.stringAt = new THREE.Vector3();
    this.bodyYaw = this.yaw;
    this.seatTurn = 0;
    this._pose = this._poses = this._draw = this._idle = null;
    this.setupMeshes();
    this.walkPhase = Math.random() * 6;
    this.animate(0);
  }

  // ---- equipment helpers --------------------------------------------------------------

  get weapon() {
    return ITEMS[this.weapons[this.wi]];
  }

  isRanged() {
    return this.weapon.slot === 'ranged';
  }

  hasAmmo() {
    const w = this.weapons[this.wi];
    return this.weapon.slot !== 'ranged' || (this.ammo[w] || 0) > 0;
  }

  canUseWeapon(w = this.weapon) {
    if (w.slot === 'ranged' && this.horse && !w.mounted) return false;
    return true;
  }

  // Shield usable with the current weapon?
  activeShield() {
    if (!this.shield) return null;
    const w = this.weapon;
    if (w.twoHanded) return null;
    if (w.cls === 'bow' || w.cls === 'crossbow') return null;
    return this.shield;
  }

  // (opts: the rider's, as the constructor got them)
  makeHorse(itemId, opts) {
    const it = ITEMS[itemId];
    const colors = opts.colors;
    // (the cloth of the side's field colour)
    const team = colors ? (colors.cloth && colors.cloth.sign) || colors.team : '#777';
    // its coat (coats.js): the breed's own under the player (the same horse
    // in every battle), a companion's by his name (the same too), a
    // soldier's by his id; or a chosen one ({key, marks})
    const coat = opts.coat ? ownCoat(it, opts.coat.key, !!opts.coat.marks)
      : this.isPlayer ? ownCoat(it)
        : coatFor(it, opts.hero ? opts.hero.key || opts.hero.name : this.id);
    // the realistic horse with medium/high graphics, else the procedural one
    const realistic = this.battle.gfx && this.battle.gfx.standard && horseReady();
    const rig = realistic
      ? new SkinnedHorse({ coat, team, barding: !!it.barding, dirt: 0.35 + Math.random() * 0.45, mud: mudOf(this.battle.terrain && this.battle.terrain.type) }, this.battle.props)
      : buildHorse(coat, team, !!it.barding);
    rig.root.rotation.order = 'YXZ';
    this.battle.scene.add(rig.root);
    return {
      item: it,
      coat,
      hp: it.hp,
      maxHp: it.hp,
      armor: it.armor,
      maxSpeed: it.speed * (1 + this.riding * 0.03),
      turn: 1.45 * it.maneuver * (1 + this.riding * 0.03),
      speed: 0,
      yaw: this.yaw,
      alive: true,
      rig,
      phase: Math.random() * 6,
      pos: this.pos,
      hoofT: 0,
    };
  }

  mountHorse(h) {
    if (h.pos && h.pos !== this.pos) {
      this.pos.copy(h.pos);
      this.yaw = h.yaw;
    }
    h.pos = this.pos;
    h.yaw = this.yaw;
    h.rider = this;
    this.horse = h;
    this.radius = 0.85;
  }

  setupMeshes() {
    const r = this.rig;
    const props = this.battle.props;
    for (const m of this.carried()) props.remove(m);
    // realistic soldiers carry textured items
    const mat = this.body ? itemMaterial() : null;
    const w = this.weapon;
    this.weaponMesh = props.add(weaponGeo(w.model), mat);
    if (this.body) this.body.attach(this.weaponMesh, w.cls === 'bow' ? 'l' : 'r');
    else if (w.cls === 'bow') r.handL.add(this.weaponMesh);
    else r.wristR.add(this.weaponMesh);
    this.strings = this.nocked = null;
    if (w.cls === 'bow') {
      // its string towards the archer; the string and the arrow on it drawn
      // with the bow (drawString)
      this.weaponMesh.rotation.z = Math.PI;
      this.weaponMesh.updateMatrix();
      this.strings = this.stringBow(this.weaponMesh, mat);
      this.nocked = this.carry(this.weaponMesh, arrowGeo('arrow'), mat);
      this.stringStraight = false;
      this.drawString(null, false);
    }
    if (this.shield) {
      const it = ITEMS[this.shield];
      // (a knight's heater painted with his arms: one model for all, the arms
      // of each in its instance, props.js)
      const coat = !!mat && this.arms >= 0 && it.model === 'heater';
      this.shieldMesh = props.add(shieldGeo(it.model, it.color, this.colors.team, this.colors.team2, coat), mat);
      if (coat) this.shieldMesh.userData.coat = this.arms;
      r.shieldMount.add(this.shieldMesh);
    }
    // show an inactive bow / crossbow on the back
    const other = this.weapons.find((id, i) => i !== this.wi && (ITEMS[id].cls === 'bow' || ITEMS[id].cls === 'crossbow'));
    this.backStrings = null;
    if (other) {
      const model = ITEMS[other].model;
      this.backMesh = props.add(weaponGeo(model), mat);
      this.backMesh.rotation.set(0, HALF_PI, 0.6);
      this.backMesh.position.set(0, 0, -0.04);
      r.backMount.add(this.backMesh);
      if (ITEMS[other].cls === 'bow') {
        this.backStrings = this.stringBow(this.backMesh, mat);
        for (const [k, h] of [[1, this.backStrings[0]], [-1, this.backStrings[1]]]) span(h, bowNock(model, k, SG.b), STRING_NOCK);
      }
    } else this.backMesh = null;
  }

  // A carried item of `geo` held by the holder `parent` (in its space).
  carry(parent, geo, mat) {
    const h = this.battle.props.add(geo, mat);
    parent.add(h);
    h.userData.space = parent.userData.space;
    return h;
  }

  // The two stretches of a bow's string (models.js stringGeo), from its
  // nocks to where they meet (drawString).
  stringBow(bow, mat) {
    return [this.carry(bow, stringGeo(), mat), this.carry(bow, stringGeo(), mat)];
  }

  // The holders of what he carries (props.js).
  carried() {
    return [this.weaponMesh, this.shieldMesh, this.backMesh, this.nocked, ...(this.strings || []), ...(this.backStrings || [])].filter(Boolean);
  }

  // ---- actions ----------------------------------------------------------------------------

  busy() {
    const s = this.action.s;
    return s === 'stun' || s === 'bounce' || s === 'switch' || s === 'dead' || s === 'reload';
  }

  setAction(s, dur = 0, extra = {}) {
    this.action = { s, t: 0, dur, ...extra };
  }

  beginAttack(dir) {
    if (!this.alive || this.busy()) return false;
    const w = this.weapon;
    if (w.slot === 'ranged') return this.beginDraw();
    const s = this.action.s;
    if (s === 'idle' || s === 'block' || (s === 'recover' && this.action.t > this.action.dur * 0.5)) {
      const d = this.couched ? 'thrust' : allowedDir(w, dir);
      const speed = w.speed * this.atkSpeed;
      this.setAction('windup', T.windup / speed, { dir: d, release: false, id: ++this.battle.attackSeq, holdFor: 0 });
      this.couched = false;
      return true;
    }
    return false;
  }

  releaseAttack() {
    const a = this.action;
    if (a.s === 'windup') a.release = true;
    else if (a.s === 'hold') this.toSwing();
    else if (a.s === 'draw' || a.s === 'aim') this.releaseDraw();
  }

  toSwing() {
    const w = this.weapon;
    const speed = w.speed * this.atkSpeed;
    const a = this.action;
    const holdT = a.s === 'hold' ? a.t : 0;
    this.setAction('swing', T.swing / speed, { dir: a.dir, id: a.id, hitDone: false, holdT });
    this.battle.sound('swing', this);
  }

  beginBlock(dir) {
    if (!this.alive || this.busy()) return false;
    const s = this.action.s;
    if (s === 'block') {
      this.action.blockDir = dir;
      return true;
    }
    if (this.isRanged()) return false;
    if (s === 'idle' || s === 'windup' || s === 'hold' || (s === 'recover' && this.action.t > this.action.dur * 0.3)) {
      this.setAction('block', 0, { blockDir: dir });
      return true;
    }
    return false;
  }

  endBlock() {
    if (this.action.s === 'block') this.setAction('idle');
  }

  stun(dur) {
    if (!this.alive) return;
    this.setAction('stun', dur);
    this.couched = false;
  }

  switchWeapon(idx) {
    if (!this.alive || idx === this.wi || idx < 0 || idx >= this.weapons.length) return false;
    if (this.busy()) return false;
    this.setAction('switch', T.switch, { to: idx });
    this.couched = false;
    return true;
  }

  nextWeapon(delta = 1) {
    if (this.weapons.length < 2) return;
    this.switchWeapon((this.wi + delta + this.weapons.length) % this.weapons.length);
  }

  beginDraw() {
    const w = this.weapon;
    const id = this.weapons[this.wi];
    if ((this.ammo[id] || 0) <= 0) return false;
    if (!this.canUseWeapon(w)) return false;
    const s = this.action.s;
    if (s !== 'idle' && s !== 'recover') return false;
    if (w.cls === 'crossbow') {
      if (!this.loaded) return false;
      this.setAction('aim', 0, { ready: 0.25 });
    } else {
      const drawMul = 0.8 + (this.isHero ? this.battle.heroSkill('power_draw') * 0.03 : this.aimErr < 0.03 ? 0.3 : 0.15);
      this.setAction('draw', w.draw / drawMul);
    }
    return true;
  }

  releaseDraw() {
    const a = this.action;
    const w = this.weapon;
    if (a.s === 'draw') {
      if (w.cls === 'throw' && a.t > a.dur * 0.6) this.shoot();
      else this.setAction('idle');
      return;
    }
    if (a.s === 'aim') {
      if (a.ready && a.t < a.ready) {
        a.releaseQueued = true;
        return;
      }
      this.shoot();
    }
  }

  // Accuracy spread (radians) of the current ranged shot.
  spread() {
    const w = this.weapon;
    let s = (1 - (w.acc || 0.8)) * 0.07 + this.aimErr * (this.isPlayer ? 0.3 : 1);
    const a = this.action;
    if (w.cls === 'bow' && a.s === 'aim' && a.t > 1.6) s += Math.min(0.06, (a.t - 1.6) * 0.03);
    const sp = this.horse ? Math.abs(this.horse.speed) : Math.hypot(this.vel.x, this.vel.z);
    s += sp * (this.horse ? 0.0025 : 0.006);
    if (a.s === 'draw') s += 0.05 * (1 - a.t / Math.max(0.01, a.dur));
    return s;
  }

  shoot(dirOverride) {
    const w = this.weapon;
    const id = this.weapons[this.wi];
    if ((this.ammo[id] || 0) <= 0) return;
    this.ammo[id]--;
    this.battle.fireProjectile(this, w, dirOverride);
    // (the arrow flies: off the string at once, not when he is next posed)
    this.drawString(null, false);
    if (w.cls === 'crossbow') this.loaded = false;
    this.setAction('recover', 0.35);
  }

  // ---- damage --------------------------------------------------------------------------------

  takeDamage(amount, attacker, dtype, opts = {}) {
    if (!this.alive) return;
    if (this.isPlayer) amount *= this.battle.settings.playerDamage ?? 1;
    this.hp -= amount;
    this.lastHitBy = attacker;
    if (this.hp <= 0) {
      this.die(attacker, dtype);
      return;
    }
    const heavy = amount > 12;
    if (!opts.noStun && (heavy || this.action.s !== 'swing' || this.action.t < this.action.dur * 0.3)) this.stun(T.stun + (heavy ? 0.12 : 0));
    if (opts.push && !this.horse) {
      this.vel.x += opts.push[0];
      this.vel.z += opts.push[1];
    }
  }

  damageHorse(amount, attacker) {
    const h = this.horse;
    if (!h || !h.alive) return;
    h.hp -= amount;
    if (h.hp <= 0) this.killHorse(attacker);
  }

  killHorse(attacker) {
    const h = this.horse;
    if (this.isPlayer) this.battle.hud.message(`Ваш кінь загинув!`, '#ff9a8a');
    else if (attacker && attacker.isPlayer) this.battle.hud.message('Ви вбили коня під вершником', '#ffe9b0');
    h.alive = false;
    h.rider = null;
    this.battle.addCorpseHorse(h);
    this.horse = null;
    this.radius = 0.36;
    this.vel.set(0, 0, 0);
    this.stun(1.3);
    this.hp -= 5;
    if (this.hp <= 0) this.die(attacker, 'blunt');
    // weapons that cannot be used on foot are fine; lance stays usable on foot
  }

  die(killer, dtype) {
    if (!this.alive) return;
    this.alive = false;
    this.hp = 0;
    this.setAction('dead');
    this.couched = false;
    // (the string let go, the arrow on it gone)
    this.drawString(null, false);
    // (he falls from the way his body faces: an archer's feet may be turned
    // side-on, animateRig)
    if (!this.horse) this.yaw = this.bodyYaw;
    // He falls away from the blow (or the last one, or one way or the other
    // by his id): on his back when it came from the front, on his face from
    // behind.
    const from = killer && killer.pos ? killer : this.lastHitBy;
    const ax = from && from.pos ? this.pos.x - from.pos.x : 0;
    const az = from && from.pos ? this.pos.z - from.pos.z : 0;
    const away = Math.hypot(ax, az) > 1e-3;
    const hash = Math.imul(this.id, 2654435761) >>> 0;
    const fx = Math.sin(this.yaw);
    const fz = Math.cos(this.yaw);
    const back = away ? ax * fx + az * fz < 0 : (hash & 1) === 0;
    // his head goes away from the blow, the body turning a little to it
    const ahead = this.yaw + (back ? Math.PI : 0);
    let head = away ? ahead + clamp(wrapAngle(Math.atan2(ax, az) - ahead), -FALL_TURN, FALL_TURN) : ahead;
    if (this.horse) {
      const h = this.horse;
      h.rider = null;
      this.battle.releaseHorse(h);
      this.horse = null;
      // fall off the horse on the side away from the blow
      const side = away ? (ax * fz - az * fx >= 0 ? 1 : -1) : back ? 1 : -1;
      this.pos = this.pos.clone();
      this.pos.x += Math.cos(this.yaw) * 0.9 * side;
      this.pos.z -= Math.sin(this.yaw) * 0.9 * side;
      this.pos.y = this.battle.terrain.heightAt(this.pos.x, this.pos.z);
    }
    // (or farther round, onto ground of his own level, off the bodies lying
    // there; on his back if his head then goes behind him), the way he lies
    // by his id (lieOf)
    const fall = this.fallHeading(head);
    head = fall.head;
    this.fallDir = fall.back ? 1 : -1;
    this.lie = this.lieLayout(fall.variant, fall.mirror, Math.sin(head), Math.cos(head), fall.push);
    // (where he will lie, for those who fall by him after: fallHeading)
    this.lieAt = Float64Array.from(fall.at);
    this.battle.onDeath(this, killer, dtype);
  }

  // The way his head goes as he falls (head, rad, a heading): `head`, or as
  // little farther round as lets him lie on ground of the level he stood
  // on, not over a drop, up a wall or across the edge between them (the
  // siege's plateau, its cliff and its ramp: grips.js groundFit leaves the
  // first two out, and fits the third badly, or steeply), his hands and feet
  // as he will lie there (lieOf, lieSketch) on ground they follow too (not
  // over a drop or in a bank: LIMB_SLACK), his feet pushed off a wall behind
  // them if need be (push, m); the way that comes nearest if none. Of the
  // ways no farther round than CORPSE_TURN, the one he lies over fewest of
  // the bodies lying there in, and what they let fall (corpsesNear). With
  // the way he lies then (variant, mirror: lieOf), whether on his back
  // (back), and where (at: lieSketch).
  fallHeading(head) {
    const terrain = this.battle.terrain;
    const heightAt = (x, z) => terrain.heightAt(x, z);
    const { x, z } = this.pos;
    // the ground's slope where he stood (right there: he may stand by an
    // edge; level if no natural ground is so steep)
    const up = F.b.set(heightAt(x - 0.1, z) - heightAt(x + 0.1, z), 0.2, heightAt(x, z - 0.1) - heightAt(x, z + 0.1)).normalize();
    if (up.y < Math.cos(STEEPEST)) up.set(0, 1, 0);
    const best = { head, push: 0, back: false, variant: 0, mirror: 1, at: new Float64Array(SKETCH.length) };
    const tall = this.stature.height;
    const near = this.corpsesNear();
    const pts = SKETCH;
    const limbs = 2 * SKETCH_TRUNK.length;
    // (how far from all right: samples left out count most; any way on
    // ground he may lie on, scored by the bodies he would lie over (below 1),
    // beats any other)
    let worst = Infinity;
    for (let k = 0; k * FALL_STEP <= Math.PI + 1e-6; k++) {
      const crowded = k * FALL_STEP <= CORPSE_TURN + 1e-6;
      if (!crowded && worst < 1) return best;
      for (const s of k ? [1, -1] : [1]) {
        const a = head + s * k * FALL_STEP;
        const dx = Math.sin(a);
        const dz = Math.cos(a);
        const back = Math.cos(a - this.yaw) < 0;
        const [variant, mirror] = this.lieOf(back);
        const reach = LIE[variant].reach * tall;
        for (const push of [0, FALL_PUSH]) {
          const fit = groundFit(heightAt, x + dx * (reach + push), z + dz * (reach + push), dx, dz, this.pos, F.fit, tall);
          const n = fitNormal(fit, dx, dz, F.c);
          const tilt = Math.acos(clamp(n.dot(up), -1, 1));
          // (his wrists and ankles where the ground is farther from the
          // plane he lies on than they follow it, half as bad as a sample
          // left out: groundFit's u along him, v to his left)
          this.lieSketch(variant, mirror, back, dx, dz, push, pts);
          const px = x + dx * (reach + push);
          const pz = z + dz * (reach + push);
          let off = 0;
          for (let i = limbs; i < pts.length; i += 2) {
            const u = (pts[i] - px) * dx + (pts[i + 1] - pz) * dz;
            const v = (pts[i] - px) * dz - (pts[i + 1] - pz) * dx;
            const d = heightAt(pts[i], pts[i + 1]) - (fit.y + fit.a * u + fit.b * v);
            if (d > GROUND_FOLLOW[1] + LIMB_SLACK || d < GROUND_FOLLOW[0] - LIMB_SLACK) off++;
          }
          const bad = fit.off + 0.5 * off + Math.max(0, fit.err - FALL_BEND) + 3 * Math.max(0, tilt - FALL_TILT) + 3 * Math.max(0, Math.acos(n.y) - STEEPEST);
          const score = bad > 0 ? 1 + bad : crowded && near.length ? crowding(pts, near) / (pts.length / 2 + 1) : 0;
          if (score < worst) {
            Object.assign(best, { head: a, push, back, variant, mirror });
            best.at.set(pts);
            worst = score;
          }
          if (!score) return best;
          // (pushed, only if his feet alone were in a wall)
          if (fit.off !== 1 || !fit.feetOff) break;
        }
      }
    }
    return best;
  }

  // The way he lies (character.js LIE) after a fall on his back or on his
  // face, by his id: [variant, mirror].
  lieOf(back) {
    const hash = Math.imul(this.id, 2654435761) >>> 0;
    const lies = !back ? FACE_LIES : this.body && this.body.longSkirt ? BACK_LIES_SKIRT : BACK_LIES;
    return [lies[Math.floor((hash / 4294967296) * lies.length)], hash & 0x100 ? -1 : 1];
  }

  // Where he would lie as LIE[variant] (mirrored by `mirror`; `back`: after
  // a fall on his back), his head along (dx, dz), his pelvis LIE's reach
  // (and `push`) m from his feet: x, z of points along his trunk and of his
  // wrists and ankles (SKETCH_TRUNK, SKETCH_LIMBS), into `out` (about: the
  // ground taken as level under him).
  lieSketch(variant, mirror, back, dx, dz, push, out) {
    const L = LIE[variant];
    const k = this.stature.height;
    const rho = (Array.isArray(L.rho) ? L.rho[back ? 0 : 1] : L.rho) * mirror;
    const c = Math.cos(rho);
    const sn = Math.sin(rho);
    const pelvis = (this.body ? this.body.t.pelvisY : HIPS) * k;
    const px = this.pos.x + dx * (L.reach * k + push);
    const pz = this.pos.z + dz * (L.reach * k + push);
    let i = 0;
    // (a point of his own space: up his length from the pelvis, and to his
    // left as he lies, along (-dz, dx): his own x and z rolled by rho)
    const add = (ox, oy, oz) => {
      const a = oy * k - pelvis;
      const w = (ox * c - oz * sn) * k;
      out[i++] = px + dx * a - dz * w;
      out[i++] = pz + dz * a + dx * w;
    };
    for (const y of SKETCH_TRUNK) add(0, y, 0);
    for (const limb of SKETCH_LIMBS) add(L[limb].at[0] * mirror, L[limb].at[1], L[limb].at[2]);
    return out;
  }

  // The bodies lying near him (their feet within CORPSE_NEAR m of his): the
  // points of each, as its bones lie (dropItems) or will (lieSketch), and of
  // the things it let fall (dropItems: dropAt).
  corpsesNear() {
    const out = [];
    for (const c of this.battle.corpses || []) {
      if (c === this || c.disposed || !c.lieAt) continue;
      if (Math.hypot(c.pos.x - this.pos.x, c.pos.z - this.pos.z) > CORPSE_NEAR) continue;
      out.push(c.lying || c.lieAt);
      if (c.dropAt) out.push(c.dropAt);
    }
    return out;
  }

  // Where and how he will lie (LIE[variant], mirrored by -1): his own space
  // laid on the ground, its up (his length) along (dx, dz), the side LIE
  // names facing the sky, fitted to the ground's slope under him (grips.js
  // groundFit). The root's rotation and place at the start of the fall and
  // at its end, and his own space's ground (sky . p = c, `sky` the side up).
  // `push`: he lands that much farther than LIE's reach. (LIE is the
  // model's: all of it k times as far for a man k times as tall.)
  lieLayout(variant, mirror, dx, dz, push = 0) {
    const L = LIE[variant];
    const terrain = this.battle.terrain;
    const k = this.stature.height;
    const rho = (Array.isArray(L.rho) ? L.rho[this.fallDir > 0 ? 0 : 1] : L.rho) * mirror;
    const sky = new THREE.Vector3(Math.sin(rho), 0, Math.cos(rho));
    // his pelvis lands `reach` m from his feet; the ground under the body
    const x = this.pos.x + dx * (L.reach * k + push);
    const z = this.pos.z + dz * (L.reach * k + push);
    const fit = groundFit((px, pz) => terrain.heightAt(px, pz), x, z, dx, dz, this.pos, undefined, k);
    const n = fitNormal(fit, dx, dz);
    const along = new THREE.Vector3(dx, fit.a, dz).normalize();
    // own (up, sky, up x sky) to the world's (along, n, along x n)
    F.m.makeBasis(along, n, F.a.crossVectors(along, n));
    F.m2.makeBasis(tmpV.set(0, 1, 0), sky, F.b.crossVectors(tmpV, sky)).transpose();
    const q1 = new THREE.Quaternion().setFromRotationMatrix(F.m.multiply(F.m2));
    // the pelvis lieHeight above the ground under it, `g` (his hips as broad
    // as his waist)
    const pelvis = new THREE.Vector3(0, (this.body ? this.body.t.pelvisY : this.rig.hips.position.y) * k, 0);
    const hp = lieHeight(rho, k * this.stature.waist);
    const g = new THREE.Vector3(x, fit.y, z);
    const r1 = F.c.copy(pelvis).addScaledVector(sky, -hp).applyQuaternion(q1).negate().add(g).clone();
    return {
      variant, mirror, push, rho, sky, dx, dz, n, g, pelvis, q1, r1, k,
      c: sky.dot(pelvis) - hp,
      q0: new THREE.Quaternion().setFromAxisAngle(tmpV.set(0, 1, 0), this.yaw),
      r0: this.pos.clone(),
    };
  }

  // ---- per-frame update ------------------------------------------------------------------------

  updateAction(dt) {
    const a = this.action;
    a.t += dt;
    if (this.couchCd > 0) this.couchCd -= dt;
    if (this.bumpCd > 0) this.bumpCd -= dt;
    switch (a.s) {
      case 'windup':
        if (a.t >= a.dur) {
          if (a.release) this.toSwing();
          else this.setAction('hold', 0, { dir: a.dir, id: a.id, holdFor: a.holdFor });
        }
        break;
      case 'hold':
        if (!this.isPlayer && a.t >= (a.holdFor || 0)) this.toSwing();
        break;
      case 'swing':
        if (!a.hitDone && a.t >= a.dur * T.hitAt) {
          a.hitDone = true;
          this.battle.resolveMelee(this);
        }
        if (this.action === a && a.t >= a.dur) this.setAction('recover', T.recover / (this.weapon.speed * this.atkSpeed), { dir: a.dir });
        break;
      case 'recover':
      case 'bounce':
      case 'stun':
        if (a.t >= a.dur) this.setAction('idle');
        break;
      case 'switch':
        if (a.t >= a.dur) {
          this.wi = a.to;
          this.setupMeshes();
          this.setAction('idle');
          if (this.weapon.cls === 'crossbow' && !this.loaded) this.startReload();
        }
        break;
      case 'draw':
        if (a.t >= a.dur) this.setAction('aim', 0);
        break;
      case 'aim':
        if (a.releaseQueued && a.t >= (a.ready || 0)) this.shoot();
        break;
      case 'reload':
        if (a.t >= a.dur) {
          this.loaded = true;
          this.setAction('idle');
        }
        break;
      default:
    }
    // crossbows reload automatically
    if (this.action.s === 'idle' && this.weapon.cls === 'crossbow' && !this.loaded && (this.ammo[this.weapons[this.wi]] || 0) > 0) this.startReload();
    // couched lance
    const w = this.weapon;
    if (this.horse && w.lance && this.action.s === 'idle' && this.horse.speed > 7 && this.couchCd <= 0) this.couched = true;
    else if (!this.horse || !w.lance || this.horse.speed < 5.5 || this.action.s !== 'idle') this.couched = false;
    if (this.couched) this.battle.resolveCouch(this);
  }

  startReload() {
    if (this.horse && !this.weapon.mounted) return;
    const w = this.weapon;
    this.setAction('reload', w.reload * (this.isHero ? 1 : 1.1));
  }

  moveSpeedFactor() {
    const s = this.action.s;
    if (s === 'windup' || s === 'hold' || s === 'swing') return 0.62;
    if (s === 'block') return this.activeShield() ? 0.55 : 0.65;
    if (s === 'draw' || s === 'aim') return this.weapon.cls === 'throw' ? 0.7 : 0.4;
    if (s === 'reload') return 0.35;
    if (s === 'stun' || s === 'bounce') return 0.25;
    return 1;
  }

  integrate(dt) {
    const terrain = this.battle.terrain;
    if (!this.alive) {
      this.fallT = Math.min(1, this.fallT + dt / FALL_TIME);
      return;
    }
    if (this.horse) {
      const h = this.horse;
      const turnRate = h.turn * (Math.abs(h.speed) < 3 ? 1.6 : 1.15);
      h.yaw += clamp(this.ride.turn, -1, 1) * turnRate * dt;
      const th = this.ride.throttle;
      const max = h.maxSpeed * (this.move.walk ? 0.45 : 1);
      const target = th > 0.05 ? max * th : th < -0.05 ? -2 : 0;
      if (h.speed < target) h.speed = Math.min(target, h.speed + 5.5 * dt);
      else h.speed = Math.max(target, h.speed - (th < -0.05 ? 9 : th > 0.05 ? 4 : 2.5) * dt);
      // slope slows the horse
      const ahead = terrain.heightAt(this.pos.x + Math.sin(h.yaw) * 1.5, this.pos.z + Math.cos(h.yaw) * 1.5) - this.pos.y;
      if (ahead > 0.3) h.speed *= 1 - Math.min(0.5, ahead * 0.5) * dt * 3;
      this.yaw = h.yaw;
      this.vel.x = Math.sin(h.yaw) * h.speed;
      this.vel.z = Math.cos(h.yaw) * h.speed;
    } else {
      const f = this.moveSpeedFactor();
      let mx = this.move.x;
      let mz = this.move.z;
      const len = Math.hypot(mx, mz);
      if (len > 1) {
        mx /= len;
        mz /= len;
      }
      let speed = this.runSpeed * f * (this.move.walk ? 0.4 : 1);
      // moving backwards is slower
      if (len > 0.01) {
        const dirYaw = Math.atan2(mx, mz);
        const back = Math.abs(wrapAngle(dirYaw - this.yaw));
        if (back > 2) speed *= 0.62;
        else if (back > 1.2) speed *= 0.82;
      }
      const tx = mx * speed;
      const tz = mz * speed;
      const acc = Math.min(1, dt * 9);
      this.vel.x += (tx - this.vel.x) * acc;
      this.vel.z += (tz - this.vel.z) * acc;
      const turnSpeed = this.isPlayer ? 16 : 7;
      this.yaw = approachAngle(this.yaw, this.faceYaw, turnSpeed * dt);
    }
    let nx = this.pos.x + this.vel.x * dt;
    let nz = this.pos.z + this.vel.z * dt;
    if (!terrain.walkable(this.pos.x, this.pos.z, nx, nz)) {
      if (terrain.walkable(this.pos.x, this.pos.z, nx, this.pos.z)) {
        nz = this.pos.z;
        this.vel.z = 0;
      } else if (terrain.walkable(this.pos.x, this.pos.z, this.pos.x, nz)) {
        nx = this.pos.x;
        this.vel.x = 0;
      } else {
        nx = this.pos.x;
        nz = this.pos.z;
        this.vel.set(0, 0, 0);
        if (this.horse) this.horse.speed *= 0.2;
      }
    }
    this.pos.x = nx;
    this.pos.z = nz;
    this.battle.collideObstacles(this);
    this.pos.y = terrain.heightAt(this.pos.x, this.pos.z);
    if (this.horse) {
      this.horse.hoofT -= dt * Math.abs(this.horse.speed);
      if (this.horse.hoofT < 0 && Math.abs(this.horse.speed) > 2) {
        this.horse.hoofT = 2.2;
        this.battle.sound('hoof', this);
      }
    }
  }

  // ---- animation ---------------------------------------------------------------------------------

  // The pose table of this soldier's rig (poseTable): the model's right
  // shoulder (his own is out or in by a few mm: models.js buildHuman) and
  // its arm, bending if he has a realistic body; his height.
  poses() {
    if (this._poses) return this._poses;
    const r = this.rig;
    this._poses = poseTable(r.shoulder, r.armLen, !!this.body, Math.min(1, Math.round(this.stature.height * 100) / 100));
    return this._poses;
  }

  rightPose(out) {
    const a = this.action;
    const w = this.weapon;
    const tab = this.poses();
    const set = w.cls === 'spear' ? tab.pole : w.twoHanded ? tab.two : tab.one;
    let idle = set.idle;
    // (at rest and on the move: restShare)
    const rest = (still, moving) => {
      idle = this._idle || (this._idle = { q: new THREE.Quaternion() });
      blendPose(idle, moving, still, this.restShare());
    };
    if (w.lance) {
      if (this.couched) idle = tab.couch;
      else if (this.horse) idle = tab.rideLance;
      else if (this.isPlayer) idle = tab.pole.trail;
      else rest(tab.idleLance, tab.carryLance);
    } else if (set === tab.one && (this.horse || w.cls === 'throw')) idle = tab.upright;
    // (a pole stood on the ground at rest, carried upright on the move or
    // on a horse; the player's at the trail)
    else if (set === tab.pole) {
      if (this.isPlayer) idle = set.trail;
      else rest(set.idle, set.carry);
    }
    // (point down at rest, on the shoulder on the move or on a horse)
    else if (w.twoHanded) rest(set.idle, set.carry);
    if (w.cls === 'bow') {
      blendPose(out, tab.bowRest, tab.bowRest, 0);
      return;
    }
    if (w.cls === 'crossbow') {
      if (a.s === 'reload') blendPose(out, tab.xbowReload, tab.xbowReload, 0);
      else if (a.s === 'aim' || a.s === 'recover') blendPose(out, tab.xbow, tab.xbow, 0);
      else blendPose(out, tab.xbowRest, tab.xbowRest, 0);
      return;
    }
    if (w.cls === 'throw') {
      if (a.s === 'draw') blendPose(out, idle, set.ready.overhead, ease(Math.min(1, a.t / Math.max(0.01, a.dur))));
      else if (a.s === 'aim') blendPose(out, set.ready.overhead, set.ready.overhead, 0);
      else if (a.s === 'recover') blendPose(out, set.strike.overhead, idle, Math.min(1, a.t / 0.35));
      else blendPose(out, idle, idle, 0);
      return;
    }
    const dir = set.ready[a.dir] ? a.dir : w.cls === 'spear' ? 'thrust' : 'right';
    const p = Math.min(1, a.t / Math.max(0.01, a.dur));
    switch (a.s) {
      case 'windup':
        blendPose(out, idle, set.ready[dir], ease(p));
        // (a pole stood on the ground lifted off it first)
        out.ground = idle.ground * (1 - smoothstep(0, 0.25, p));
        break;
      case 'hold':
        blendPose(out, set.ready[dir], set.ready[dir], 0);
        out.twist += Math.sin(a.t * 30) * 0.01;
        break;
      case 'swing':
        blendPose(out, set.ready[dir], set.strike[dir], ease(p));
        break;
      case 'recover':
        // (a pole drawn back to its guard first, then brought upright and
        // only then slid down to stand on the ground: its butt end not swept
        // through him or the skirt of his coat)
        if (w.cls !== 'spear') blendPose(out, set.strike[dir], idle, ease(p));
        else if (p < 0.5) blendPose(out, set.strike[dir], set.ready[dir], ease(2 * p));
        else blendPose(out, set.ready[dir], idle, ease(2 * p - 1));
        out.ground = idle.ground * smoothstep(0.85, 1, p);
        break;
      case 'bounce':
        blendPose(out, set.ready[dir], idle, p);
        out.pitch -= 0.15 * (1 - a.t / a.dur);
        break;
      case 'block':
        if (this.activeShield()) blendPose(out, idle, idle, 0);
        else blendPose(out, idle, set.block[a.blockDir || 'up'], Math.min(1, a.t / T.blockRaise));
        break;
      case 'stun':
        blendPose(out, idle, idle, 0);
        out.pitch = -0.2 * (1 - a.t / Math.max(0.01, a.dur));
        break;
      default:
        blendPose(out, idle, idle, 0);
    }
  }

  // How much he stands at rest (1) or moves (0), for a pole stood on the
  // ground or a two-handed weapon point down (REST_SPEED); never on a horse.
  restShare() {
    return this.horse ? 0 : 1 - smoothstep(REST_SPEED[0], REST_SPEED[1], Math.hypot(this.vel.x, this.vel.z));
  }

  animate(dt) {
    this.animateRig(dt);
    if (this.body) this.body.update(this, dt);
    if (this.alive) return;
    // a fall: his things let go of as it begins (once his body has worked out
    // how it will lie), falling to the ground by him; its end, posed as he
    // lies (once)
    if (!this.drops && (!this.body || this.body.fallen)) this.dropItems();
    if (this.drops) this.fallItems();
    if (this.fallT >= 1) this.settled = true;
  }

  // The root at the time g (0..1) of his fall: his body tips over to the
  // frame it lies in faster and faster, as a falling thing does; his pelvis
  // comes down, on his back first to the ground (he sits down), on his face
  // first to his knees, and along the ground to where it lies.
  fallRoot(root, g) {
    const lie = this.lie;
    const back = this.fallDir > 0;
    const tip = back ? Math.pow(g, 2.2) : g * g;
    const drop = back ? Math.min(1, (g / 0.6) ** 2) : 0.45 * Math.min(1, (g / 0.4) ** 2) + 0.55 * smoothstep(0.4, 1, g);
    root.quaternion.slerpQuaternions(lie.q0, lie.q1, tip);
    const p0 = F.a.copy(lie.pelvis).applyQuaternion(lie.q0).add(lie.r0);
    const p1 = F.b.copy(lie.pelvis).applyQuaternion(lie.q1).add(lie.r1);
    const p = F.c.lerpVectors(p0, p1, smoothstep(0, 0.8, g));
    p.y = p0.y + (p1.y - p0.y) * drop;
    root.position.copy(lie.pelvis).applyQuaternion(root.quaternion).negate().add(p);
  }

  // The procedural body lying (the low graphics), `w` of the way there from
  // how he stood as he died: its torso and head turned as LIE's spine and
  // head, its straight limbs pointed at where LIE puts the wrists and
  // ankles, their ends on the ground (an arm drawn shorter or longer, to a
  // bowstring or a haft, back to its length).
  lieRig(w) {
    const r = this.rig;
    const lie = this.lie;
    const L = LIE[lie.variant];
    if (!lie.rig) {
      // (once: the limbs' rotations lying)
      const terrain = this.battle.terrain;
      const torso = F.q.setFromEuler(lieTurn(L.spine, lie.mirror, F.e));
      // (the torso, neck and arms from where they were as he died)
      lie.rig = {
        from_t: r.torso.quaternion.clone(),
        from_n: r.neck.quaternion.clone(),
        from_l: r.armL.quaternion.clone(),
        from_r: r.armR.quaternion.clone(),
        scale_l: r.armL.scale.y,
        scale_r: r.armR.scale.y,
      };
      for (const [limb, from, len, clear] of [['arm_l', r.armL, 0.6, 0.04], ['arm_r', r.armR, 0.6, 0.04], ['leg_l', r.legL, 0.9, 0.06], ['leg_r', r.legR, 0.9, 0.06]]) {
        const leg = limb[0] === 'l';
        // its root in his own space (the rig's, his height times larger)
        const root = F.a.copy(from.position);
        if (!leg) root.applyQuaternion(torso);
        root.add(r.hips.position).multiplyScalar(lie.k);
        const spec = lieTarget(lie, limb, terrain, F.b);
        const end = F.c.subVectors(F.b, root).setLength(len * lie.k).add(root);
        if (spec.ground !== undefined) onGround(end, clear, lie, terrain);
        const d = end.sub(root).normalize();
        if (leg) lie.rig[limb] = [Math.atan2(-d.z, -d.y), Math.asin(clamp(d.x, -1, 1))];
        else lie.rig[limb] = armQuat([d.x, d.y, d.z], [0, 0, 1], new THREE.Quaternion()).premultiply(F.q2.copy(torso).invert());
      }
    }
    const k = lie.rig;
    r.torso.quaternion.slerpQuaternions(k.from_t, F.q.setFromEuler(lieTurn(L.spine, lie.mirror * w, F.e)), w);
    r.neck.quaternion.slerpQuaternions(k.from_n, F.q.setFromEuler(lieTurn(L.head, lie.mirror * w, F.e)), w);
    r.legL.rotation.set(k.leg_l[0] * w, 0, k.leg_l[1] * w);
    r.legR.rotation.set(k.leg_r[0] * w, 0, k.leg_r[1] * w);
    r.armL.quaternion.slerpQuaternions(k.from_l, k.arm_l, w);
    r.armR.quaternion.slerpQuaternions(k.from_r, k.arm_r, w);
    r.armL.scale.y = k.scale_l + (1 - k.scale_l) * w;
    r.armR.scale.y = k.scale_r + (1 - k.scale_r) * w;
  }

  // As his fall begins, the weapon he held and his shield (and what he
  // carried on his back) are let go of: out of his hands and his rig into
  // the world, to fall to where they will lie, flat on the ground by him
  // (grips.js layFlat), clear of his body as it will lie and of each other,
  // and of the bodies lying by him and what they let fall where they can be.
  // (Where his body lies and what he let fall, kept for those who fall by him
  // after: lying, dropFoot, dropAt.)
  dropItems() {
    const terrain = this.battle.terrain;
    const heightAt = (x, z) => terrain.heightAt(x, z);
    // where they are now
    this.rig.root.updateMatrixWorld(true);
    const held = [];
    for (const h of [this.weaponMesh, this.shieldMesh, this.backMesh]) {
      const model = h && h.userData.prop;
      if (!model) continue;
      if (!model.geo.boundingBox) model.geo.computeBoundingBox();
      const m = h.matrixWorld.clone();
      if (h.userData.space) m.premultiply(h.userData.space.matrixWorld);
      held.push([h, model.geo.boundingBox, m]);
    }
    const body = this.lyingPoints();
    const items = [];
    // (theirs near enough to matter: within reach of where his may lie)
    const others = { body: [], items: [] };
    const mid = F.c.set((body[0] + body[2]) / 2, 0, (body[1] + body[3]) / 2);
    const keep = (list, pts) => {
      for (let i = 0; i < pts.length; i += 2) if (Math.hypot(pts[i] - mid.x, pts[i + 1] - mid.z) < DROP_REACH) list.push(pts[i], pts[i + 1]);
    };
    for (const c of this.battle.corpses || []) {
      if (c === this || c.disposed || !c.lieAt || Math.hypot(c.pos.x - this.pos.x, c.pos.z - this.pos.z) > CORPSE_NEAR) continue;
      keep(others.body, c.lying || c.lieAt);
      if (c.dropFoot) keep(others.items, c.dropFoot);
    }
    const list = held.map(([h, box, from]) => {
      const to = new THREE.Matrix4();
      const clear = layFlat(heightAt, box, from, body, to, h === this.shieldMesh, this.lie, items, others);
      footprint(box, to, items);
      this.battle.props.toWorld(h, from);
      // its box's centre and its turn, where it was let go and where it lies
      const centre = box.getCenter(new THREE.Vector3());
      const d = { h, box, centre, clear, t: 0, g0: this.fallT };
      d.c0 = centre.clone().applyMatrix4(from);
      d.c1 = centre.clone().applyMatrix4(to);
      d.q0 = h.quaternion.clone();
      d.q1 = new THREE.Quaternion().setFromRotationMatrix(to);
      // (as long as it takes to fall that far, over before his fall is)
      d.time = clamp(Math.sqrt((2 * Math.max(0, d.c0.y - d.c1.y)) / 9.8), DROP_TIME[0], Math.min(DROP_TIME[1], (1 - d.g0) * FALL_TIME));
      return d;
    });
    this.drops = { list, heightAt };
    this.lying = body;
    this.dropFoot = items;
    // (fewer of them, for those who fall by him: fallHeading)
    this.dropAt = items.filter((v, i) => i % 6 < 2);
  }

  // Where his body will lie on the ground: x, z of his feet (between them)
  // and his head (his length), then of the rest of him (his bones, or the
  // parts of the low graphics' rig, posed so a moment).
  lyingPoints() {
    const lie = this.lie;
    const pts = [];
    if (this.body) {
      const o = this.body.object;
      F.m.compose(lie.r1, lie.q1, this.rig.root.scale).multiply(F.m2.compose(o.position, o.quaternion, o.scale));
      return this.body.lyingPoints(F.m, pts);
    }
    const r = this.rig;
    r.root.position.copy(lie.r1);
    r.root.quaternion.copy(lie.q1);
    this.lieRig(1);
    r.root.updateMatrixWorld(true);
    const add = (v) => pts.push(v.x, v.z);
    add(r.legL.localToWorld(tmpV.set(0, -0.9, 0)).add(r.legR.localToWorld(tmpV2.set(0, -0.9, 0))).multiplyScalar(0.5));
    for (const o of [r.neck, r.hips, r.torso, r.armL, r.armR, r.handL, r.handR]) add(o.getWorldPosition(tmpV));
    for (const leg of [r.legL, r.legR]) for (const y of [-0.45, -0.9]) add(leg.localToWorld(tmpV.set(0, y, 0)));
    this.fallRoot(r.root, this.fallT);
    this.lieRig(ease(this.fallT));
    return pts;
  }

  // The things he let go of, falling: down faster and faster from where he
  // let go of them to where they lie (dropItems), turning over as they go,
  // never into the ground; by the time into his fall (paused, they stay).
  fallItems() {
    const { list, heightAt } = this.drops;
    for (const d of list) {
      if (d.t >= 1) continue;
      const t = clamp(((this.fallT - d.g0) * FALL_TIME) / d.time, 0, 1);
      d.t = t;
      const h = d.h;
      h.quaternion.slerpQuaternions(d.q0, d.q1, t);
      const c = F.a.lerpVectors(d.c0, d.c1, t);
      c.y = d.c0.y + (d.c1.y - d.c0.y) * t * t;
      h.position.copy(d.centre).applyQuaternion(h.quaternion).negate().add(c);
      if (t < 1) {
        h.updateMatrix();
        h.position.y += Math.max(0, DROP_CLEAR - lowest(heightAt, d.box, h.matrix));
      }
    }
  }

  // Pose the (procedural) rig; a skinned body then follows it.
  animateRig(dt) {
    const r = this.rig;
    const root = r.root;
    if (!this.alive) {
      this.fallRoot(root, this.fallT);
      // (the realistic body bends itself: SkinnedHuman.fall)
      if (!this.body) this.lieRig(ease(this.fallT));
      return;
    }
    const w = this.weapon;
    const bow = w.cls === 'bow';
    const draw = this.drawPose(dt);
    let bob = 0;
    let twistBase;
    // the way his body faces (on foot an archer turns his feet as he raises
    // the bow)
    let bodyYaw;
    if (this.horse) {
      const h = this.horse;
      const hr = h.rig;
      // (his hips on the saddle, however tall he is)
      const k = this.stature.height;
      if (hr.skinned) {
        // sit on the saddle: it moves and tilts with the horse's back
        hr.update(h, dt, this.battle);
        const pelvis = (this.body ? this.body.t.pelvisY : HIPS) * k;
        root.position.set(this.pos.x, this.pos.y + hr.seatY + hr.seatDY + SEAT_PELVIS - pelvis, this.pos.z);
        root.rotation.set(hr.pitch, h.yaw, hr.roll);
      } else {
        const sp = Math.abs(h.speed);
        h.phase += sp * dt * 1.25;
        const amp = Math.min(0.75, sp * 0.085);
        const ph = h.phase;
        hr.legs[0].rotation.x = Math.sin(ph) * amp;
        hr.legs[1].rotation.x = Math.sin(ph + 0.5) * amp;
        hr.legs[2].rotation.x = Math.sin(ph + Math.PI) * amp;
        hr.legs[3].rotation.x = Math.sin(ph + Math.PI + 0.5) * amp;
        bob = Math.abs(Math.sin(ph)) * 0.08 * Math.min(1, sp / 6);
        hr.body.position.y = bob;
        hr.body.rotation.x = Math.sin(ph * 2) * 0.025 * Math.min(1, sp / 6);
        hr.root.position.copy(this.pos);
        hr.root.rotation.y = h.yaw;
        root.position.set(this.pos.x, this.pos.y + 0.8 + HIPS * (1 - k) + bob, this.pos.z);
        root.rotation.set(0, h.yaw, 0);
      }
      r.hips.position.y = HIPS;
      turnTo(r.legL, -1.15, 0, 0.42);
      turnTo(r.legR, -1.15, 0, -0.42);
      bodyYaw = h.yaw;
      twistBase = clamp(wrapAngle(this.aimYaw - h.yaw), -1.5, 1.5);
    } else {
      bodyYaw = this.yaw + FEET_TURN * draw.side;
      root.position.copy(this.pos);
      turnTo(root, 0, bodyYaw, 0);
      const sp = Math.hypot(this.vel.x, this.vel.z);
      // (a taller man's strides are longer)
      this.walkPhase += (sp * dt * 2.4) / this.stature.height;
      const amp = Math.min(0.75, sp * 0.18);
      // walking backwards / sideways: swing legs relative to motion
      const moveYaw = Math.atan2(this.vel.x, this.vel.z);
      const rel = wrapAngle(moveYaw - bodyYaw);
      const fwd = Math.cos(rel);
      const side = Math.sin(rel);
      const s = Math.sin(this.walkPhase);
      turnTo(r.legL, s * amp * fwd, 0, s * amp * side * 0.5);
      turnTo(r.legR, -s * amp * fwd, 0, -s * amp * side * 0.5);
      r.hips.position.y = HIPS - Math.abs(Math.cos(this.walkPhase)) * 0.035 * amp;
      twistBase = clamp(wrapAngle(this.aimYaw - bodyYaw), -1.2, 1.2);
    }
    this.bodyYaw = bodyYaw;

    const pose = this._pose || (this._pose = { q: new THREE.Quaternion(), wrist: 0, twist: 0, pitch: 0, ext: 1, ground: 0, free: 0, floor: 0 });
    this.rightPose(pose);
    const ranged = this.isRanged();
    let turn = twistBase + pose.twist;
    // an archer turns side-on to the target (on a horse as far as his hips
    // in the saddle and his spine let him: the hips their share, and what the
    // spine cannot take)
    if (bow) {
      const aim = this.horse ? wrapAngle(this.aimYaw - bodyYaw) : twistBase;
      const most = this.horse ? SEAT_TURN + SPINE_TURN : Infinity;
      turn += (clamp(aim + SIDE, -most, most) - turn) * draw.side;
    }
    const seat = Math.min(SEAT_TURN, Math.max(Math.abs(turn) * SEAT_SHARE, Math.abs(turn) - SPINE_TURN));
    this.seatTurn = this.horse && bow ? Math.sign(turn) * seat * draw.side : 0;
    // (and leans away from it to aim up)
    turnTo(r.torso, pose.pitch - this.aimPitch * (ranged ? 0.75 : 0.3) * (1 - draw.side), turn, this.aimPitch * LEAN * draw.side);
    // the head turns to the foe he means to fight (while fighting the torso
    // already turns that way), not further than over a shoulder. Where he
    // looks is eased relative to the body, which turns smoothly, not to the
    // torso, which turns at once to a new aim.
    let look = turn;
    const foe = !this.isPlayer && this.ai.target;
    if (foe && foe.alive && foe.pos.distanceToSquared(this.pos) < LOOK_DIST * LOOK_DIST) {
      look = wrapAngle(Math.atan2(foe.pos.x - this.pos.x, foe.pos.z - this.pos.z) - bodyYaw);
    }
    this.look += wrapAngle(look - this.look) * Math.min(1, dt * 3);
    this.lookYaw = clamp(wrapAngle(this.look - turn), -1.1, 1.1);
    // (an archer looks along his arrow, archerRig)
    let nx = -this.aimPitch * 0.35;
    let ny = this.lookYaw;
    const toAim = bow && draw.raise >= 1e-3 && this.aimInTorso(AIM);
    if (toAim && draw.side > 0) {
      nx += (-Math.asin(clamp(toAim.y, -1, 1)) - nx) * draw.side;
      ny += (Math.atan2(toAim.x, toAim.z) - ny) * draw.side;
    }
    turnTo(r.neck, nx, ny, 0);
    quatTo(r.armR, pose.q);
    r.armR.scale.y = 1;
    r.armL.scale.y = 1;
    turnTo(r.wristR, pose.wrist, 0, 0);
    // (the realistic body's hand nearer the shoulder: its elbow bends)
    r.handR.position.y = -r.armLen * (this.body ? pose.ext : 1);
    // a pole stood on the ground slides down in the hand; a weapon held
    // point down up in it, clear of the ground (the realistic body's as it
    // poses its hand: SkinnedHuman.arms)
    if (!bow && !this.body) {
      const m = this.weaponMesh;
      m.position.z = pose.ground && !this.horse ? -pose.ground * this.groundSlide() : 0;
      if (pose.floor && !this.horse) {
        m.updateWorldMatrix(true, false);
        const lift = Math.max(0, this.floorLift(m.matrixWorld));
        // (along its axis, as far as raises it so)
        const fall = -tmpV.setFromMatrixColumn(m.matrixWorld, 2).normalize().y;
        if (lift > 0 && fall > 0.2) m.position.z -= (pose.floor * lift) / fall;
      }
    }

    // left arm / shield
    const sh = this.activeShield();
    if (this.shieldMesh) {
      let sp;
      if (!sh) sp = SHIELD_POSE.back;
      else if (this.action.s === 'block') sp = SHIELD_POSE.block;
      else sp = this.horse ? SHIELD_POSE.ride : SHIELD_POSE.idle;
      const m = r.shieldMount;
      const k = Math.min(1, dt * 14);
      m.position.lerp(sp.pos, k);
      m.rotation.y += (sp.rotY - m.rotation.y) * k;
      m.rotation.x += (sp.rotX - m.rotation.x) * k;
    }
    if (bow) {
      this.archerRig(draw);
    } else if (sh) {
      // point the left arm at the shield grip
      tmpV.copy(r.shieldMount.position).sub(r.armL.position);
      armQuat([tmpV.x, tmpV.y, tmpV.z], [0, 0, 1], tmpQ);
      quatTo(r.armL, tmpQ);
    } else if (w.lance && this.horse) {
      quatTo(r.armL, LEFT.lance);
    } else if (this.body || !secondRanges(w) || pose.free > 0.5 || !this.secondRig()) {
      // (the realistic body places its second hand itself)
      quatTo(r.armL, LEFT.free);
    }
  }

  // How far the archer has raised his bow (raise), drawn its string (pull:
  // 0 at the bow, 1 at his jaw) and turned side-on (side), eased towards
  // where his action puts them; whether an arrow is on the string (nocked:
  // drawing and aiming, from when his drawing hand has the string until he
  // shoots). He stays side-on between shots while he stands (STANCE_HOLD).
  drawPose(dt) {
    const d = this._draw || (this._draw = { raise: 0, pull: 0, side: 0, turn: 0, stance: 0, nocked: false });
    const a = this.action;
    const bow = this.weapon.cls === 'bow';
    const drawing = bow && (a.s === 'draw' || a.s === 'aim');
    const k = Math.min(1, dt * DRAW_EASE);
    let raise = 0;
    let pull = 0;
    if (bow) {
      if (a.s === 'draw') {
        const p = a.t / Math.max(0.01, a.dur);
        raise = smoothstep(0, DRAW_RAISE, p);
        pull = smoothstep(0.3, 1, p);
      } else if (a.s === 'aim') {
        raise = 1;
        pull = 1;
      } else if (a.s === 'recover') {
        // (the string let go, the hand stays back as the bow comes down)
        raise = 1 - smoothstep(0.3, 1, a.t / Math.max(0.01, a.dur));
        pull = 1;
      }
    }
    d.raise += (raise - d.raise) * k;
    d.nocked = drawing && d.raise >= NOCK_AT;
    // (he draws once the arrow is on the string)
    if (a.s === 'draw' && !d.nocked) pull = 0;
    d.pull += (pull - d.pull) * k;
    if (drawing || (bow && a.s === 'recover')) d.stance = STANCE_HOLD;
    else d.stance = bow && (this.horse || this.vel.lengthSq() < 1) ? Math.max(0, d.stance - dt) : 0;
    // (turning at a steady rate, smoothly started and ended)
    d.turn = clamp(d.turn + (d.stance > 0 ? dt : -dt) * SIDE_RATE, 0, 1);
    d.side = smoothstep(0, 1, d.turn);
    return d;
  }

  // The unit way to his target (aimYaw, aimPitch) in the torso's space.
  aimInTorso(out) {
    const r = this.rig;
    out.set(Math.sin(this.aimYaw) * Math.cos(this.aimPitch), Math.sin(this.aimPitch), Math.cos(this.aimYaw) * Math.cos(this.aimPitch));
    return out.applyQuaternion(tmpQ.copy(r.root.quaternion).multiply(r.torso.quaternion).invert());
  }

  // The archer's arms on the pose rig (drawPose): he looks along the arrow,
  // his bow arm from hanging to straight at the target, the bow upright
  // (canted); his drawing arm (the low graphics' straight one, made shorter
  // or longer) from hanging to the string at its nocking point, drawing it
  // to the anchor by his jaw, and the string to his hand. (The realistic
  // body places its hands itself: SkinnedHuman.archer.)
  archerRig(d) {
    const r = this.rig;
    if (d.raise < 1e-3) {
      // (at rest: the bow lowered)
      quatTo(r.armL, LEFT.bowRest);
      if (this.body) return;
      turnTo(this.weaponMesh, BOW_LOWER, 0, Math.PI);
      this.drawString(null, false);
      return;
    }
    // (the way to the target in the torso's space: animateRig)
    const T = AIM;
    // the bow upright, its top canted to his right
    const up = F.b.set(0, 1, 0).addScaledVector(T, -T.y).normalize();
    const right = F.c.crossVectors(T, up);
    up.multiplyScalar(Math.cos(BOW_CANT)).addScaledVector(right, Math.sin(BOW_CANT));
    armQuat([T.x, T.y, T.z], [up.x, up.y, up.z], F.q);
    quatTo(r.armL, F.q2.copy(LEFT.bowRest).slerp(F.q, d.raise));
    if (this.body) return;
    // (lowered, the bow points down ahead)
    const bow = this.weaponMesh;
    turnTo(bow, BOW_LOWER * (1 - d.raise), 0, Math.PI);
    // the anchor by his jaw (once the neck's turn is in its quaternion): the
    // drawing hand goes there (the straight arm, made shorter, cannot reach
    // the string by the bow first)
    const jaw = F.c.copy(JAW_LOW).applyQuaternion(r.neck.quaternion).add(r.neck.position).sub(r.armR.position);
    const len = jaw.length();
    armQuat([jaw.x, jaw.y, jaw.z], [0, 0, 1], F.q);
    quatTo(r.armR, F.q2.copy(r.armR.quaternion).slerp(F.q, d.raise));
    r.armR.scale.y = 1 + (len / r.armLen - 1) * d.raise;
    // the string to the hand, in the bow's space: taken as the hand comes,
    // the arrow on it once the hand is there (nocked)
    const take = d.nocked ? 1 : smoothstep(LOW_TAKE, NOCK_AT, d.raise);
    if (!(take > 0) || !(this.action.s === 'draw' || this.action.s === 'aim')) {
      this.drawString(null, false);
      return;
    }
    // (the bow hand's space is the size of what it holds: stature.js)
    const hand = F.b.set(0, -r.armLen * r.armR.scale.y, 0).applyQuaternion(r.armR.quaternion).add(r.armR.position);
    hand.sub(r.armL.position).applyQuaternion(F.q.copy(r.armL.quaternion).invert()).sub(r.handL.position).multiplyScalar(this.stature.height).sub(bow.position);
    this.drawString(hand.applyQuaternion(F.q.copy(bow.quaternion).invert()).lerp(STRING_NOCK, 1 - take), d.nocked);
  }

  // The held bow's string drawn to `meet` (in the bow's own space; null:
  // straight between its nocks) and the nocked arrow on it there, through
  // its rest on the bow hand (shown only while `nocked`).
  drawString(meet, nocked) {
    if (!this.strings) return;
    // (as it is: straight, or drawn to where it is with the arrow as it is)
    const at = this.stringAt;
    if (meet ? !this.stringStraight && this.nocked.visible === nocked && meet.distanceToSquared(at) < 1e-8 : this.stringStraight && !nocked) return;
    this.stringStraight = !meet;
    at.copy(meet || STRING_NOCK);
    const model = this.weapon.model;
    span(this.strings[0], bowNock(model, 1, SG.b), at);
    span(this.strings[1], bowNock(model, -1, SG.b), at);
    const arrow = this.nocked;
    arrow.visible = nocked;
    if (nocked) {
      const dir = SG.b.subVectors(ARROW_REST, at).normalize();
      arrow.quaternion.setFromUnitVectors(Z, dir);
      arrow.position.copy(at).addScaledVector(dir, ARROW_NOCK.arrow);
    }
  }

  // The low graphics' second hand on a two-handed weapon (grips.js SECOND):
  // the straight left arm at a point of its axis about its length away
  // (LOW_REACH: the arm made that much shorter or longer). False if there is
  // none.
  secondRig() {
    const r = this.rig;
    // the weapon's axis in the torso's space: from the wrist along the held item
    const p = F.a.set(0, r.handR.position.y, 0).applyQuaternion(r.armR.quaternion).add(r.armR.position);
    const dir = F.b.set(0, -Math.sin(r.wristR.rotation.x), Math.cos(r.wristR.rotation.x)).applyQuaternion(r.armR.quaternion);
    // (his, in the rig's space: his height times larger)
    const k = this.stature.height;
    let s = NaN;
    for (const range of secondRanges(this.weapon)) {
      const [want, from, to] = secondFor(range, k, SECOND_AT);
      s = rigidGrip(r.armL.position, p, dir, from / k, to / k, want / k, r.armLen * LOW_REACH[0], r.armLen * LOW_REACH[1]);
      if (!Number.isNaN(s)) break;
    }
    if (Number.isNaN(s)) return false;
    p.addScaledVector(dir, s).sub(r.armL.position);
    armQuat([p.x, p.y, p.z], [dir.x, dir.y, dir.z], tmpQ);
    quatTo(r.armL, tmpQ);
    r.armL.scale.y = p.length() / r.armLen;
    return true;
  }

  // How far a held pole slides down in the hand (up if less than 0) for its
  // butt to stand on the ground (m): the low graphics' rig as it is posed.
  groundSlide() {
    const r = this.rig;
    // (in his own space: slideFor)
    const hand = tmpV.set(0, r.handR.position.y, 0).applyQuaternion(r.armR.quaternion).add(r.armR.position).applyQuaternion(r.torso.quaternion).add(r.hips.position).multiplyScalar(this.stature.height);
    const q = tmpQ.copy(r.torso.quaternion).multiply(r.armR.quaternion);
    const dir = tmpV2.set(0, -Math.sin(r.wristR.rotation.x), Math.cos(r.wristR.rotation.x)).applyQuaternion(q);
    return this.slideFor(hand, dir);
  }

  // As groundSlide, the hand at `p` and the pole along the unit `dir`, in his
  // own space (his feet at the origin, turned as his body: bodyYaw; the
  // realistic body's hand is where the clips sway it to: SkinnedHuman.arms):
  // its butt on the ground where it stands, not the level of his feet (on a
  // slope). (It slides down only as it comes upright, SLIDE_UP: not swept
  // along through him, its butt far behind the hand, as he raises it or
  // levels it.)
  slideFor(p, dir) {
    const geo = this.weaponMesh.userData.prop && this.weaponMesh.userData.prop.geo;
    const k = this.planted(dir.y);
    if (!geo || k <= 0) return 0;
    if (!geo.boundingBox) geo.computeBoundingBox();
    // (the ground where the pole meets the level of his feet: about under
    // its butt, the pole about upright)
    const t = p.y / dir.y;
    const g = this.groundAt(p.x - dir.x * t, p.z - dir.z * t);
    return k * ((p.y - g - BUTT_CLEAR) / dir.y + geo.boundingBox.min.z);
  }

  // The height of the ground above his feet at (x, z) of his own space.
  groundAt(x, z) {
    const c = Math.cos(this.bodyYaw);
    const s = Math.sin(this.bodyYaw);
    return this.battle.terrain.heightAt(this.pos.x + x * c + z * s, this.pos.z - x * s + z * c) - this.pos.y;
  }

  // How far a weapon held point down (a pose's `floor`) is to be raised (m;
  // lowered if less than 0) for its lowest corner to be FLOOR_CLEAR to
  // FLOOR_HOVER m above the ground under it, the weapon placed by `matrix`
  // in the world: at most FLOOR_LIFT (FLOOR_DROP lower).
  floorLift(matrix) {
    const geo = this.weaponMesh.userData.prop && this.weaponMesh.userData.prop.geo;
    if (!geo) return 0;
    if (!geo.boundingBox) geo.computeBoundingBox();
    const terrain = this.battle.terrain;
    const low = lowest((x, z) => terrain.heightAt(x, z), geo.boundingBox, matrix);
    if (low < FLOOR_CLEAR) return Math.min(FLOOR_CLEAR - low, FLOOR_LIFT);
    if (low > FLOOR_HOVER) return -Math.min(low - FLOOR_HOVER, FLOOR_DROP);
    return 0;
  }

  // How much a pole rising `up` m a metre along it stands on the ground (0..1,
  // SLIDE_UP), if its pose stands it there.
  planted(up) {
    return smoothstep(SLIDE_UP[0], SLIDE_UP[1], up);
  }

  // How high above his feet (or the ground under his horse) the point of the
  // model at `y` is on him (stature.js scaledY).
  bodyY(y) {
    return scaledY(this.stature, y, !!this.horse);
  }

  // Where missiles hit him (stature.js hitZone): on foot or on his horse.
  hitZone() {
    return this.zones[this.horse ? 1 : 0];
  }

  dispose() {
    this.disposed = true;
    const scene = this.battle.scene;
    for (const m of [...this.carried(), this.body && this.body.helmet]) if (m) this.battle.props.remove(m);
    for (const root of [this.rig.root, this.horse && this.horse.rig.root]) {
      if (!root) continue;
      scene.remove(root);
      // free the bone textures of the skinned meshes
      root.traverse((o) => {
        if (o.isSkinnedMesh) o.skeleton.dispose();
      });
    }
  }
}
