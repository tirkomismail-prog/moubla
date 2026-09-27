// Arrows, bolts and thrown weapons with simple ballistic physics.
import * as THREE from 'three';
import { MATERIAL, weaponGeo } from './models.js';
import { computeDamage } from './combat.js';

const G = 9.8;
const MAX_STUCK = 160;

function arrowGeo(kind) {
  if (kind === 'javelin') return weaponGeo('javelin');
  if (kind === 'throwaxe') return weaponGeo('throwaxe');
  const g = new THREE.BufferGeometry();
  const b = [];
  const n = [];
  const c = [];
  const L = kind === 'bolt' ? 0.45 : 0.8;
  const box = (w, h, d, z, col) => {
    const bg = new THREE.BoxGeometry(w, h, d).toNonIndexed();
    bg.translate(0, 0, z);
    const cc = new THREE.Color(col);
    const pa = bg.attributes.position.array;
    const na = bg.attributes.normal.array;
    for (let i = 0; i < pa.length; i++) {
      b.push(pa[i]);
      n.push(na[i]);
    }
    for (let i = 0; i < pa.length / 3; i++) c.push(cc.r, cc.g, cc.b);
  };
  box(0.02, 0.02, L, -L / 2 + 0.05, '#8a6a3a');
  box(0.035, 0.035, 0.08, 0.06, '#555');
  box(0.005, 0.06, 0.12, -L + 0.12, '#eee');
  box(0.06, 0.005, 0.12, -L + 0.12, '#eee');
  g.setAttribute('position', new THREE.Float32BufferAttribute(b, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(n, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  return g;
}

const GEOS = {};
function geoFor(kind) {
  return (GEOS[kind] ||= arrowGeo(kind));
}

// distance between segments p1-q1 and p2-q2, returns [dist, s] where s is the
// parameter along the first segment.
function segSeg(p1, q1, p2, q2) {
  const d1x = q1.x - p1.x;
  const d1y = q1.y - p1.y;
  const d1z = q1.z - p1.z;
  const d2x = q2.x - p2.x;
  const d2y = q2.y - p2.y;
  const d2z = q2.z - p2.z;
  const rx = p1.x - p2.x;
  const ry = p1.y - p2.y;
  const rz = p1.z - p2.z;
  const a = d1x * d1x + d1y * d1y + d1z * d1z;
  const e = d2x * d2x + d2y * d2y + d2z * d2z;
  const f = d2x * rx + d2y * ry + d2z * rz;
  let s;
  let t;
  const c = d1x * rx + d1y * ry + d1z * rz;
  const b = d1x * d2x + d1y * d2y + d1z * d2z;
  const denom = a * e - b * b;
  s = denom > 1e-9 ? Math.min(1, Math.max(0, (b * f - c * e) / denom)) : 0;
  t = (b * s + f) / e;
  if (t < 0) {
    t = 0;
    s = Math.min(1, Math.max(0, -c / a));
  } else if (t > 1) {
    t = 1;
    s = Math.min(1, Math.max(0, (b - c) / a));
  }
  const dx = p1.x + d1x * s - (p2.x + d2x * t);
  const dy = p1.y + d1y * s - (p2.y + d2y * t);
  const dz = p1.z + d1z * s - (p2.z + d2z * t);
  return [Math.sqrt(dx * dx + dy * dy + dz * dz), s, p2.y + d2y * t];
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _prev = new THREE.Vector3();

export class Projectiles {
  constructor(battle) {
    this.battle = battle;
    this.list = [];
    this.stuck = [];
  }

  spawn(o) {
    const kind = o.model === 'javelin' ? 'javelin' : o.model === 'throwaxe' ? 'throwaxe' : o.model === 'crossbow' ? 'bolt' : 'arrow';
    const m = new THREE.Mesh(geoFor(kind), MATERIAL);
    m.castShadow = false;
    this.battle.scene.add(m);
    const p = { ...o, kind, mesh: m, age: 0, speed0: o.vel.length(), spin: kind === 'throwaxe' ? 0 : null };
    // defenders shoot over their own parapet
    p.fromFort = !!(o.owner && this.battle.terrain.fort && this.battle.terrain.level(o.owner.pos.x, o.owner.pos.z) === 1);
    this.orient(p);
    this.list.push(p);
  }

  orient(p) {
    p.mesh.position.copy(p.pos);
    _a.copy(p.pos).add(p.vel);
    p.mesh.lookAt(_a);
    if (p.spin != null) {
      p.spin += 0.5;
      p.mesh.rotateX(p.spin);
    }
  }

  update(dt) {
    const battle = this.battle;
    const terrain = battle.terrain;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.age += dt;
      _prev.copy(p.pos);
      p.vel.y -= G * dt;
      p.pos.addScaledVector(p.vel, dt);
      // agents
      const midx = (p.pos.x + _prev.x) / 2;
      const midz = (p.pos.z + _prev.z) / 2;
      const seg = Math.hypot(p.pos.x - _prev.x, p.pos.z - _prev.z);
      const cands = battle.nearby(midx, midz, seg / 2 + 2.2);
      let hit = null;
      let hitS = 2;
      let hitHorse = false;
      let hitY = 0;
      for (const a of cands) {
        if (!a.alive || a === p.owner) continue;
        if (!battle.areEnemies(p.owner, a) && !p.anyTeam) continue;
        const base = a.horse ? a.pos.y + 1.55 : a.pos.y + 0.1;
        const top = base + (a.horse ? 1.05 : 1.75);
        _a.set(a.pos.x, base, a.pos.z);
        _b.set(a.pos.x, top, a.pos.z);
        const [d, s, y] = segSeg(_prev, p.pos, _a, _b);
        if (d < 0.3 && s < hitS) {
          hit = a;
          hitS = s;
          hitHorse = false;
          hitY = y - base;
        }
        if (a.horse) {
          const hx = a.pos.x + Math.sin(a.horse.yaw) * 0.2;
          const hz = a.pos.z + Math.cos(a.horse.yaw) * 0.2;
          _a.set(hx - Math.sin(a.horse.yaw) * 0.7, a.pos.y + 1.3, hz - Math.cos(a.horse.yaw) * 0.7);
          _b.set(hx + Math.sin(a.horse.yaw) * 0.9, a.pos.y + 1.45, hz + Math.cos(a.horse.yaw) * 0.9);
          const [d2, s2] = segSeg(_prev, p.pos, _a, _b);
          if (d2 < 0.45 && s2 < hitS) {
            hit = a;
            hitS = s2;
            hitHorse = true;
          }
        }
      }
      if (hit) {
        p.pos.lerpVectors(_prev, p.pos, hitS);
        this.onHit(p, hit, hitHorse, hitY);
        this.remove(i);
        continue;
      }
      // obstacles (tree trunks, towers)
      let blocked = false;
      for (const o of battle.obstaclesNear(p.pos.x, p.pos.z, 1.5)) {
        if (Math.hypot(o.x - p.pos.x, o.z - p.pos.z) < o.r && p.pos.y - terrain.heightAt(o.x, o.z) < 6) {
          blocked = true;
          break;
        }
      }
      if (!blocked && !p.fromFort && terrain.hitsWall(p.pos.x, p.pos.y, p.pos.z)) blocked = true;
      const ground = terrain.heightAt(p.pos.x, p.pos.z);
      if (blocked || p.pos.y <= ground) {
        if (p.pos.y < ground) p.pos.y = ground + 0.02;
        battle.sound('arrowHit', p);
        this.stick(p);
        this.list.splice(i, 1);
        continue;
      }
      if (p.age > 8 || Math.abs(p.pos.x) > terrain.half + 40 || Math.abs(p.pos.z) > terrain.half + 40) {
        this.remove(i);
        continue;
      }
      this.orient(p);
    }
  }

  onHit(p, a, horse, hy) {
    const battle = this.battle;
    // shields stop missiles coming from the front
    const sh = a.activeShield();
    if (!horse && sh) {
      const from = Math.atan2(-p.vel.x, -p.vel.z);
      let rel = Math.abs(((from - a.aimYaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      const raised = a.action.s === 'block';
      if ((raised && rel < 1.35) || (!raised && rel < 0.55 && Math.random() < 0.5)) {
        battle.sound('wood', a);
        return;
      }
      void rel;
    }
    const speedF = Math.min(1.2, p.vel.length() / Math.max(1, p.speed0));
    const raw = p.dmg * (0.5 + speedF * 0.5) * (0.9 + Math.random() * 0.2);
    if (horse) {
      const dmg = computeDamage(raw, p.dtype, a.horse.armor);
      battle.onRangedHit(p.owner, a, dmg, true);
      a.damageHorse(dmg, p.owner);
      battle.sound('arrowHit', a);
      return;
    }
    const head = hy > 1.45 && !a.horse ? true : a.horse && hy > 0.75;
    const armor = head ? a.headArmor : a.bodyArmor;
    const dmg = computeDamage(raw, p.dtype, armor) * (head ? 1.6 : 1);
    battle.onRangedHit(p.owner, a, dmg, false, head);
    a.takeDamage(dmg, p.owner, p.dtype, { noStun: dmg < 8 });
    battle.sound('hit', a);
  }

  stick(p) {
    p.mesh.position.copy(p.pos);
    this.stuck.push(p.mesh);
    if (this.stuck.length > MAX_STUCK) {
      const m = this.stuck.shift();
      this.battle.scene.remove(m);
    }
  }

  remove(i) {
    const p = this.list[i];
    this.battle.scene.remove(p.mesh);
    this.list.splice(i, 1);
  }
}
