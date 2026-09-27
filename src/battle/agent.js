// A soldier on the battlefield: equipment, stats, action state machine,
// movement physics and procedural animation.
import * as THREE from 'three';
import { ITEMS } from '../data/items.js';
import { TROOPS } from '../data/troops.js';
import { buildHuman, buildHorse, weaponGeo, shieldGeo, mesh, armQuat, pickSkin, pickHair } from './models.js';
import { T, allowedDir } from './combat.js';
import { clamp, wrapAngle, approachAngle } from '../core/util.js';

const Q = (arm, hint) => armQuat(arm, hint);
const HALF_PI = Math.PI / 2;

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
const SHOULDER_L = new THREE.Vector3(0.28, 0.53, 0);
const SHOULDER_R = new THREE.Vector3(-0.28, 0.53, 0);

const tmpQ = new THREE.Quaternion();
const tmpQ2 = new THREE.Quaternion();
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();

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
    this.aimPitch = 0;
    this.move = { x: 0, z: 0, walk: false };
    this.ride = { throttle: 0, turn: 0 };
    this.action = { s: 'idle', t: 0, dur: 0 };
    this.couched = false;
    this.couchCd = 0;
    this.loaded = true;
    this.fallT = 0;
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
    this.rig = buildHuman({
      look: this.armorItem ? this.armorItem.look : 'cloth',
      helmet: this.helmItem ? this.helmItem.look : null,
      team: colors.team,
      team2: colors.team2,
      skin: pickSkin(r1),
      hair: pickHair(r1),
      beard: r1() < 0.45,
      pants: ['#4a3a2a', '#3a3a44', '#5a4a3a', '#2e3a2a'][Math.floor(r1() * 4)],
    });
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
    const rig = buildHorse(it.coat, colors ? colors.team : '#777', !!it.barding);
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
    for (const m of [this.weaponMesh, this.shieldMesh, this.backMesh]) if (m && m.parent) m.parent.remove(m);
    const w = this.weapon;
    this.weaponMesh = mesh(weaponGeo(w.model));
    if (w.cls === 'bow') r.handL.add(this.weaponMesh);
    else r.wristR.add(this.weaponMesh);
    if (this.shield) {
      const it = ITEMS[this.shield];
      this.shieldMesh = mesh(shieldGeo(it.model, it.color, this.colors.team));
      r.shieldMount.add(this.shieldMesh);
    }
    // show an inactive bow / crossbow on the back
    const other = this.weapons.find((id, i) => i !== this.wi && (ITEMS[id].cls === 'bow' || ITEMS[id].cls === 'crossbow'));
    if (other) {
      this.backMesh = mesh(weaponGeo(ITEMS[other].model));
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
    this.fallDir = Math.random() < 0.5 ? 1 : -1;
    if (this.horse) {
      const h = this.horse;
      h.rider = null;
      this.battle.releaseHorse(h);
      this.horse = null;
      // fall off the horse to the side
      const side = this.fallDir;
      this.pos = this.pos.clone();
      this.pos.x += Math.cos(this.yaw) * 0.9 * side;
      this.pos.z -= Math.sin(this.yaw) * 0.9 * side;
      this.pos.y = this.battle.terrain.heightAt(this.pos.x, this.pos.z);
    }
    this.battle.onDeath(this, killer, dtype);
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
      this.fallT = Math.min(1, this.fallT + dt * 2.2);
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
    const r = this.rig;
    const root = r.root;
    if (!this.alive) {
      const f = ease(this.fallT);
      root.position.set(this.pos.x, this.pos.y + 0.12 * f, this.pos.z);
      root.rotation.y = this.yaw;
      root.rotation.x = -HALF_PI * f * (this.fallDir > 0 ? 1 : -0.95);
      r.legL.rotation.set(0, 0, 0);
      r.legR.rotation.set(0, 0, 0.1);
      r.armR.quaternion.slerp(POSE.lowered.q, Math.min(1, dt * 5));
      return;
    }
    let bob = 0;
    let twistBase;
    if (this.horse) {
      const h = this.horse;
      const hr = h.rig;
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
      root.rotation.y = h.yaw;
      root.rotation.x = 0;
      r.hips.position.y = 0.92;
      r.legL.rotation.set(-1.15, 0, 0.42);
      r.legR.rotation.set(-1.15, 0, -0.42);
      twistBase = clamp(wrapAngle(this.aimYaw - h.yaw), -1.5, 1.5);
    } else {
      root.position.copy(this.pos);
      root.rotation.y = this.yaw;
      root.rotation.x = 0;
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
    r.neck.rotation.x = -this.aimPitch * 0.35;
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
      tmpV.copy(r.shieldMount.position).sub(SHOULDER_L);
      armQuat([tmpV.x, tmpV.y, tmpV.z], [0, 0, 1], tmpQ);
      r.armL.quaternion.copy(tmpQ);
    } else if (w.twoHanded || w.cls === 'spear') {
      // left hand follows the right hand
      tmpV2.set(0, -0.6, 0).applyQuaternion(pose.q).add(SHOULDER_R);
      if (pose.wrist) tmpV2.addScaledVector(tmpV.set(0, 0, 0.25).applyQuaternion(pose.q), 0);
      tmpV.copy(tmpV2).sub(SHOULDER_L);
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
    const scene = this.battle.scene;
    scene.remove(this.rig.root);
    if (this.horse) scene.remove(this.horse.rig.root);
  }
}
