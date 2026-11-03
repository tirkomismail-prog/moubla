// A soldier on the battlefield: equipment, stats, action state machine,
// movement physics and procedural animation.
import * as THREE from 'three';
import { ITEMS } from '../data/items.js';
import { TROOPS } from '../data/troops.js';
import { buildHuman, buildHorse, weaponGeo, shieldGeo, armQuat, pickSkin, pickHair } from './models.js';
import { SkinnedHorse, horseReady } from './horse.js';
import { T, allowedDir } from './combat.js';
import { SkinnedHuman, charactersReady, itemMaterial, knightArms, LIE, lieHeight, lieTarget, lieTurn, onGround } from './character.js';
import { groundFit, fitNormal, layFlat, footprint, lowest, STEEPEST } from './grips.js';
import { clamp, wrapAngle, approachAngle, smoothstep } from '../core/util.js';
import { sideCloth } from '../data/dyes.js';

// colour of the mud and dust on legs and hooves, by the ground fought on
const MUD = { steppe: '#8a7457', desert: '#a08a68', arena: '#a08a68', snow: '#5b5650', forest: '#3e3226', taiga: '#3e3226', hills: '#56473a' };
export const mudOf = (terrain) => MUD[terrain] || '#4b3d2c';

const Q = (arm, hint) => armQuat(arm, hint);
const HALF_PI = Math.PI / 2;
// how far a soldier turns his head to his foe from
const LOOK_DIST = 40;
// a rider's hip joints above the seat of a (realistic) saddle
const SEAT_PELVIS = 0.1;

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

const POSE = {
  idle: P([-0.15, -1, 0.25], [-0.05, 0.45, 1]),
  idlePole: P([-0.2, -1, 0.15], [0, 0.12, 1]),
  idleLance: P([-0.2, -1, 0.15], [0, 1, 0.25]),
  idleTwo: P([-0.05, -0.75, 0.6], [0.15, 1, 0.45]),
  couch: P([-0.28, -0.96, -0.1], [0, 0.02, 1]),
  lowered: P([-0.12, -1, 0.05], [0, -0.3, 1]),
  ready: {
    right: P([-0.9, 0.35, -0.3], [-0.4, 0.5, -0.8], -0.7, 0),
    left: P([0.7, 0.45, 0.1], [0.5, 0.4, -0.8], 0.6, 0),
    overhead: P([-0.25, 1, -0.15], [0, 0.2, -1], -0.1, -0.15),
    thrust: P([-0.35, -0.9, -0.25], [0, 0.05, 1], -0.35, 0),
  },
  strike: {
    right: P([0.75, -0.05, 0.65], [1, 0.05, 0.35], 0.6, 0.05),
    left: P([-0.8, -0.05, 0.55], [-1, 0.05, 0.3], -0.6, 0.05),
    overhead: P([-0.1, -0.35, 1], [0, -0.6, 1], 0, 0.28),
    thrust: P([-0.1, 0, 1], [0, -0.02, 1], 0.25, 0.1),
  },
  block: {
    left: P([0.3, -0.2, 0.8], [0.1, 1, 0.1]),
    right: P([-0.7, -0.2, 0.6], [-0.1, 1, 0.1]),
    up: P([-0.2, 0.5, 0.8], [1, 0.1, 0]),
    down: P([-0.1, -0.5, 0.8], [0.7, 0.6, 0.2]),
  },
  bowRest: P([0.05, -0.1, 1], [0, 1, 0]),
  bowDraw: P([-0.6, 0.12, -0.3], [0, 1, 0]),
  xbow: P([-0.12, -0.2, 1], [0, 0, 1]),
  xbowReload: P([-0.1, -1, 0.35], [0, -0.8, 0.6]),
};
const LEFT = {
  free: Q([0.15, -1, 0.1], [0, 0, 1]),
  bow: P([0.02, 0, 1], [0, 1, 0]).q,
  xbow: Q([-0.25, -0.15, 1], [0, 1, 0]),
  lance: Q([0.2, -0.9, 0.3], [0, 0, 1]),
};
const SHIELD_POSE = {
  idle: { pos: new THREE.Vector3(0.33, 0.1, 0.18), rotY: 1.0, rotX: 0 },
  block: { pos: new THREE.Vector3(0.06, 0.4, 0.45), rotY: 0.05, rotX: -0.08 },
  back: { pos: new THREE.Vector3(0, 0.3, -0.19), rotY: Math.PI, rotX: 0 },
  ride: { pos: new THREE.Vector3(0.36, 0.14, 0.12), rotY: 1.25, rotX: 0 },
};

const tmpQ = new THREE.Quaternion();
const tmpQ2 = new THREE.Quaternion();
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();

// a fall to the ground takes this long (s)
const FALL_TIME = 0.8;
// the ways of lying (character.js LIE) after a fall on the back: on the back
// or on a side; on the face: on the face or on a side
const BACK_LIES = [0, 1, 3];
const FACE_LIES = [2, 3];
// how far a falling body turns, at most, to fall straight away from the blow
const FALL_TURN = 0.7;
// turned farther round in these steps (rad), if he would lie over a drop,
// up a wall or across a sharp bend of the ground that way (a sample farther
// off the fitted plane than FALL_BEND m: natural ground stays within 7 cm),
// or on ground sloping more than FALL_TILT (rad) from where he stood or
// steeper than any natural ground (grips.js STEEPEST: the banks between the
// plateau and the ramp); how far from his feet his pelvis lands then (m,
// about: LIE[].reach)
const FALL_STEP = 0.35;
const FALL_BEND = 0.08;
const FALL_TILT = 0.3;
const FALL_REACH = 0.45;
// with his back to a wall (his feet in it as he lies) he lands this much
// farther from it (m)
const FALL_PUSH = 0.4;
// a thing he drops falls to the ground in this long, at least and at most
// (s); and stays this far above it while it falls (m)
const DROP_TIME = [0.25, 0.6];
const DROP_CLEAR = 0.01;
const F = {
  q: new THREE.Quaternion(),
  q2: new THREE.Quaternion(),
  e: new THREE.Euler(),
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
  c: new THREE.Vector3(),
  one: new THREE.Vector3(1, 1, 1),
  m: new THREE.Matrix4(),
  m2: new THREE.Matrix4(),
  fit: {},
};

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

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
    if (eq.horse && !opts.noHorse) this.mountHorse(this.makeHorse(eq.horse, opts.colors));
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
    battle.scene.add(this.rig.root);
    this.colors = colors;
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

  makeHorse(itemId, colors) {
    const it = ITEMS[itemId];
    // (the cloth of the side's field colour)
    const team = colors ? (colors.cloth && colors.cloth.sign) || colors.team : '#777';
    // the realistic horse with medium/high graphics, else the procedural one
    const realistic = this.battle.gfx && this.battle.gfx.standard && horseReady();
    const rig = realistic
      ? new SkinnedHorse({ coat: it.coat, team, barding: !!it.barding, dirt: 0.35 + Math.random() * 0.45, mud: mudOf(this.battle.terrain && this.battle.terrain.type) }, this.battle.props)
      : buildHorse(it.coat, team, !!it.barding);
    rig.root.rotation.order = 'YXZ';
    this.battle.scene.add(rig.root);
    return {
      item: it,
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
    for (const m of [this.weaponMesh, this.shieldMesh, this.backMesh]) if (m) props.remove(m);
    // realistic soldiers carry textured items
    const mat = this.body ? itemMaterial() : null;
    const w = this.weapon;
    this.weaponMesh = props.add(weaponGeo(w.model), mat);
    if (this.body) this.body.attach(this.weaponMesh, w.cls === 'bow' ? 'l' : 'r');
    else if (w.cls === 'bow') r.handL.add(this.weaponMesh);
    else r.wristR.add(this.weaponMesh);
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
    if (other) {
      this.backMesh = props.add(weaponGeo(ITEMS[other].model), mat);
      this.backMesh.rotation.set(0, HALF_PI, 0.6);
      this.backMesh.position.set(0, 0, -0.04);
      r.backMount.add(this.backMesh);
    } else this.backMesh = null;
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
    let back = away ? ax * fx + az * fz < 0 : (hash & 1) === 0;
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
    // (or farther round, onto ground of his own level; on his back if his
    // head then goes behind him)
    const fall = this.fallHeading(head);
    head = fall.head;
    back = Math.cos(head - this.yaw) < 0;
    this.fallDir = back ? 1 : -1;
    // the way he lies, by his id
    const lies = back ? BACK_LIES : FACE_LIES;
    this.lie = this.lieLayout(lies[Math.floor((hash / 4294967296) * lies.length)], hash & 0x100 ? -1 : 1, Math.sin(head), Math.cos(head), fall.push);
    this.battle.onDeath(this, killer, dtype);
  }

  // The way his head goes as he falls (head, rad, a heading): `head`, or as
  // little farther round as lets him lie on ground of the level he stood
  // on, not over a drop, up a wall or across the edge between them (the
  // siege's plateau, its cliff and its ramp: grips.js groundFit leaves the
  // first two out, and fits the third badly, or steeply), his feet pushed
  // off a wall behind them if need be (push, m); the way that comes nearest
  // if none.
  fallHeading(head) {
    const terrain = this.battle.terrain;
    const heightAt = (x, z) => terrain.heightAt(x, z);
    const { x, z } = this.pos;
    // the ground's slope where he stood (right there: he may stand by an
    // edge; level if no natural ground is so steep)
    const up = F.b.set(heightAt(x - 0.1, z) - heightAt(x + 0.1, z), 0.2, heightAt(x, z - 0.1) - heightAt(x, z + 0.1)).normalize();
    if (up.y < Math.cos(STEEPEST)) up.set(0, 1, 0);
    const best = { head, push: 0 };
    let worst = Infinity;
    for (let k = 0; k * FALL_STEP <= Math.PI + 1e-6; k++) {
      for (const s of k ? [1, -1] : [1]) {
        const a = head + s * k * FALL_STEP;
        const dx = Math.sin(a);
        const dz = Math.cos(a);
        for (const push of [0, FALL_PUSH]) {
          const fit = groundFit(heightAt, x + dx * (FALL_REACH + push), z + dz * (FALL_REACH + push), dx, dz, this.pos, F.fit);
          const n = fitNormal(fit, dx, dz, F.c);
          const tilt = Math.acos(clamp(n.dot(up), -1, 1));
          // (how far from all right: samples left out count most)
          const bad = fit.off + Math.max(0, fit.err - FALL_BEND) + 3 * Math.max(0, tilt - FALL_TILT) + 3 * Math.max(0, Math.acos(n.y) - STEEPEST);
          if (bad < worst) {
            best.head = a;
            best.push = push;
            worst = bad;
          }
          if (!bad) return best;
          // (pushed, only if his feet alone were in a wall)
          if (fit.off !== 1 || !fit.feetOff) break;
        }
      }
    }
    return best;
  }

  // Where and how he will lie (LIE[variant], mirrored by -1): his own space
  // laid on the ground, its up (his length) along (dx, dz), the side LIE
  // names facing the sky, fitted to the ground's slope under him (grips.js
  // groundFit). The root's rotation and place at the start of the fall and
  // at its end, and his own space's ground (sky . p = c, `sky` the side up).
  // `push`: he lands that much farther than LIE's reach.
  lieLayout(variant, mirror, dx, dz, push = 0) {
    const L = LIE[variant];
    const terrain = this.battle.terrain;
    const rho = (Array.isArray(L.rho) ? L.rho[this.fallDir > 0 ? 0 : 1] : L.rho) * mirror;
    const sky = new THREE.Vector3(Math.sin(rho), 0, Math.cos(rho));
    // his pelvis lands `reach` m from his feet; the ground under the body
    const x = this.pos.x + dx * (L.reach + push);
    const z = this.pos.z + dz * (L.reach + push);
    const fit = groundFit((px, pz) => terrain.heightAt(px, pz), x, z, dx, dz, this.pos);
    const n = fitNormal(fit, dx, dz);
    const along = new THREE.Vector3(dx, fit.a, dz).normalize();
    // own (up, sky, up x sky) to the world's (along, n, along x n)
    F.m.makeBasis(along, n, F.a.crossVectors(along, n));
    F.m2.makeBasis(tmpV.set(0, 1, 0), sky, F.b.crossVectors(tmpV, sky)).transpose();
    const q1 = new THREE.Quaternion().setFromRotationMatrix(F.m.multiply(F.m2));
    // the pelvis lieHeight above the ground under it, `g`
    const pelvis = new THREE.Vector3(0, this.body ? this.body.t.pelvisY : this.rig.hips.position.y, 0);
    const hp = lieHeight(rho);
    const g = new THREE.Vector3(x, fit.y, z);
    const r1 = F.c.copy(pelvis).addScaledVector(sky, -hp).applyQuaternion(q1).negate().add(g).clone();
    return {
      variant, mirror, push, rho, sky, dx, dz, n, g, pelvis, q1, r1,
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

  rightPose(out) {
    const a = this.action;
    const w = this.weapon;
    const idle = w.lance ? (this.couched ? POSE.couch : POSE.idleLance) : w.cls === 'spear' ? POSE.idlePole : w.twoHanded ? POSE.idleTwo : POSE.idle;
    const lerpPose = (p0, p1, t) => {
      out.q.copy(p0.q).slerp(p1.q, t);
      out.wrist = p0.wrist + (p1.wrist - p0.wrist) * t;
      out.twist = (p0.twist || 0) + ((p1.twist || 0) - (p0.twist || 0)) * t;
      out.pitch = (p0.pitch || 0) + ((p1.pitch || 0) - (p0.pitch || 0)) * t;
    };
    if (w.cls === 'bow') {
      if (a.s === 'draw') lerpPose(POSE.bowRest, POSE.bowDraw, ease(Math.min(1, a.t / Math.max(0.01, a.dur))));
      else if (a.s === 'aim') lerpPose(POSE.bowDraw, POSE.bowDraw, 0);
      else lerpPose(POSE.bowRest, POSE.lowered, a.s === 'recover' ? Math.min(1, a.t / 0.35) : 1);
      return;
    }
    if (w.cls === 'crossbow') {
      if (a.s === 'reload') lerpPose(POSE.xbowReload, POSE.xbowReload, 0);
      else if (a.s === 'aim' || a.s === 'recover') lerpPose(POSE.xbow, POSE.xbow, 0);
      else lerpPose(POSE.xbowReload, POSE.xbow, 0.4);
      return;
    }
    if (w.cls === 'throw') {
      if (a.s === 'draw') lerpPose(POSE.idle, POSE.ready.overhead, ease(Math.min(1, a.t / Math.max(0.01, a.dur))));
      else if (a.s === 'aim') lerpPose(POSE.ready.overhead, POSE.ready.overhead, 0);
      else if (a.s === 'recover') lerpPose(POSE.strike.overhead, POSE.idle, Math.min(1, a.t / 0.35));
      else lerpPose(POSE.idle, POSE.idle, 0);
      return;
    }
    const dir = a.dir || 'right';
    switch (a.s) {
      case 'windup':
        lerpPose(idle, POSE.ready[dir], ease(Math.min(1, a.t / Math.max(0.01, a.dur))));
        break;
      case 'hold':
        lerpPose(POSE.ready[dir], POSE.ready[dir], 0);
        out.twist += Math.sin(a.t * 30) * 0.01;
        break;
      case 'swing':
        lerpPose(POSE.ready[dir], POSE.strike[dir], ease(Math.min(1, a.t / Math.max(0.01, a.dur))));
        break;
      case 'recover':
        lerpPose(POSE.strike[dir], idle, ease(Math.min(1, a.t / Math.max(0.01, a.dur))));
        break;
      case 'bounce':
        lerpPose(POSE.ready[dir] || idle, idle, Math.min(1, a.t / Math.max(0.01, a.dur)));
        out.pitch -= 0.15 * (1 - a.t / a.dur);
        break;
      case 'block':
        if (this.activeShield()) lerpPose(idle, idle, 0);
        else lerpPose(idle, POSE.block[a.blockDir || 'up'], Math.min(1, a.t / T.blockRaise));
        break;
      case 'stun':
        lerpPose(idle, idle, 0);
        out.pitch = -0.2 * (1 - a.t / Math.max(0.01, a.dur));
        break;
      default:
        lerpPose(idle, idle, 0);
    }
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

  // The procedural body lying (the low graphics), `w` of the way there: its
  // torso and head turned as LIE's spine and head, its straight limbs
  // pointed at where LIE puts the wrists and ankles, their ends on the ground.
  lieRig(w) {
    const r = this.rig;
    const lie = this.lie;
    const L = LIE[lie.variant];
    r.torso.rotation.copy(lieTurn(L.spine, lie.mirror * w, F.e));
    r.neck.rotation.copy(lieTurn(L.head, lie.mirror * w, F.e));
    if (!lie.rig) {
      // (once: the limbs' rotations lying)
      const terrain = this.battle.terrain;
      const torso = F.q.setFromEuler(lieTurn(L.spine, lie.mirror, F.e));
      // (the arms from where they were as he died)
      lie.rig = { from_l: r.armL.quaternion.clone(), from_r: r.armR.quaternion.clone() };
      for (const [limb, from, len, clear] of [['arm_l', r.armL, 0.6, 0.04], ['arm_r', r.armR, 0.6, 0.04], ['leg_l', r.legL, 0.9, 0.06], ['leg_r', r.legR, 0.9, 0.06]]) {
        const leg = limb[0] === 'l';
        // its root in his own space
        const root = F.a.copy(from.position);
        if (!leg) root.applyQuaternion(torso);
        root.add(r.hips.position);
        const spec = lieTarget(lie, limb, terrain, F.b);
        const end = F.c.subVectors(F.b, root).setLength(len).add(root);
        if (spec.ground !== undefined) onGround(end, clear, lie, terrain);
        const d = end.sub(root).normalize();
        if (leg) lie.rig[limb] = [Math.atan2(-d.z, -d.y), Math.asin(clamp(d.x, -1, 1))];
        else lie.rig[limb] = armQuat([d.x, d.y, d.z], [0, 0, 1], new THREE.Quaternion()).premultiply(F.q2.copy(torso).invert());
      }
    }
    r.legL.rotation.set(lie.rig.leg_l[0] * w, 0, lie.rig.leg_l[1] * w);
    r.legR.rotation.set(lie.rig.leg_r[0] * w, 0, lie.rig.leg_r[1] * w);
    r.armL.quaternion.slerpQuaternions(lie.rig.from_l, lie.rig.arm_l, w);
    r.armR.quaternion.slerpQuaternions(lie.rig.from_r, lie.rig.arm_r, w);
  }

  // As his fall begins, the weapon he held and his shield (and what he
  // carried on his back) are let go of: out of his hands and his rig into
  // the world, to fall to where they will lie, flat on the ground by him
  // (grips.js layFlat), clear of his body as it will lie and of each other.
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
    const list = held.map(([h, box, from]) => {
      const to = new THREE.Matrix4();
      const clear = layFlat(heightAt, box, from, body, to, h === this.shieldMesh, this.lie, items);
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
  }

  // Where his body will lie on the ground: x, z of his feet (between them)
  // and his head (his length), then of the rest of him (his bones, or the
  // parts of the low graphics' rig, posed so a moment).
  lyingPoints() {
    const lie = this.lie;
    const pts = [];
    if (this.body) {
      const o = this.body.object;
      F.m.compose(lie.r1, lie.q1, F.one).multiply(F.m2.compose(o.position, o.quaternion, o.scale));
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
    let bob = 0;
    let twistBase;
    if (this.horse) {
      const h = this.horse;
      const hr = h.rig;
      if (hr.skinned) {
        // sit on the saddle: it moves and tilts with the horse's back
        hr.update(h, dt, this.battle);
        const pelvis = this.body ? this.body.t.pelvisY : 0.92;
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
        root.position.set(this.pos.x, this.pos.y + 0.8 + bob, this.pos.z);
        root.rotation.set(0, h.yaw, 0);
      }
      r.hips.position.y = 0.92;
      r.legL.rotation.set(-1.15, 0, 0.42);
      r.legR.rotation.set(-1.15, 0, -0.42);
      twistBase = clamp(wrapAngle(this.aimYaw - h.yaw), -1.5, 1.5);
    } else {
      root.position.copy(this.pos);
      root.rotation.set(0, this.yaw, 0);
      const sp = Math.hypot(this.vel.x, this.vel.z);
      this.walkPhase += sp * dt * 2.4;
      const amp = Math.min(0.75, sp * 0.18);
      // walking backwards / sideways: swing legs relative to motion
      const moveYaw = Math.atan2(this.vel.x, this.vel.z);
      const rel = wrapAngle(moveYaw - this.yaw);
      const fwd = Math.cos(rel);
      const side = Math.sin(rel);
      const s = Math.sin(this.walkPhase);
      r.legL.rotation.set(s * amp * fwd, 0, s * amp * side * 0.5);
      r.legR.rotation.set(-s * amp * fwd, 0, -s * amp * side * 0.5);
      r.hips.position.y = 0.92 - Math.abs(Math.cos(this.walkPhase)) * 0.035 * amp;
      twistBase = clamp(wrapAngle(this.aimYaw - this.yaw), -1.2, 1.2);
    }

    const pose = this._pose || (this._pose = { q: new THREE.Quaternion(), wrist: 0, twist: 0, pitch: 0 });
    this.rightPose(pose);
    const ranged = this.isRanged();
    r.torso.rotation.y = twistBase + pose.twist;
    r.torso.rotation.x = pose.pitch - this.aimPitch * (ranged ? 0.75 : 0.3);
    // the head turns to the foe he means to fight (while fighting the torso
    // already turns that way), not further than over a shoulder. Where he
    // looks is eased relative to the body, which turns smoothly, not to the
    // torso, which turns at once to a new aim.
    let look = r.torso.rotation.y;
    const foe = !this.isPlayer && this.ai.target;
    if (foe && foe.alive && foe.pos.distanceToSquared(this.pos) < LOOK_DIST * LOOK_DIST) {
      look = wrapAngle(Math.atan2(foe.pos.x - this.pos.x, foe.pos.z - this.pos.z) - (this.horse ? this.horse.yaw : this.yaw));
    }
    this.look += wrapAngle(look - this.look) * Math.min(1, dt * 3);
    this.lookYaw = clamp(wrapAngle(this.look - r.torso.rotation.y), -1.1, 1.1);
    r.neck.rotation.order = 'YXZ';
    r.neck.rotation.set(-this.aimPitch * 0.35, this.lookYaw, 0);
    r.armR.quaternion.copy(pose.q);
    r.wristR.rotation.x = pose.wrist;

    // left arm / shield
    const w = this.weapon;
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
    if (w.cls === 'bow') {
      r.armL.quaternion.copy(LEFT.bow);
    } else if (w.cls === 'crossbow') {
      r.armL.quaternion.copy(LEFT.xbow);
    } else if (sh) {
      // point the left arm at the shield grip
      tmpV.copy(r.shieldMount.position).sub(r.armL.position);
      armQuat([tmpV.x, tmpV.y, tmpV.z], [0, 0, 1], tmpQ);
      r.armL.quaternion.copy(tmpQ);
    } else if (w.twoHanded || w.cls === 'spear') {
      // left hand follows the right hand
      tmpV2.copy(r.handR.position).applyQuaternion(pose.q).add(r.armR.position);
      if (pose.wrist) tmpV2.addScaledVector(tmpV.set(0, 0, 0.25).applyQuaternion(pose.q), 0);
      tmpV.copy(tmpV2).sub(r.armL.position);
      armQuat([tmpV.x, tmpV.y, tmpV.z], [0, 0, 1], tmpQ);
      r.armL.quaternion.copy(tmpQ);
    } else if (w.lance && this.horse) {
      r.armL.quaternion.copy(LEFT.lance);
    } else {
      tmpQ2.copy(LEFT.free);
      r.armL.quaternion.copy(tmpQ2);
    }
  }

  // Head position (for camera, projectiles and hit tests).
  headPos(out) {
    out.copy(this.pos);
    out.y += this.horse ? 2.45 : 1.65;
    return out;
  }

  dispose() {
    this.disposed = true;
    const scene = this.battle.scene;
    for (const m of [this.weaponMesh, this.shieldMesh, this.backMesh, this.body && this.body.helmet]) if (m) this.battle.props.remove(m);
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
