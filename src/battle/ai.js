// Soldier AI: target selection, formations and orders, melee duelling,
// archery and cavalry charges.
import { ITEMS } from '../data/items.js';
import { wrapAngle, clamp } from '../core/util.js';
import { requiredBlock } from './combat.js';

const BLOCK_DIRS = ['left', 'right', 'up', 'down'];

function angleTo(a, x, z) {
  return Math.atan2(x - a.pos.x, z - a.pos.z);
}

export function aiThink(battle, a) {
  const ai = a.ai;
  ai.nextThink = battle.time + 0.25 + Math.random() * 0.2;
  // choose target
  let t = ai.target;
  if (!t || !t.alive || Math.random() < 0.12) {
    let best = null;
    let bd = Infinity;
    const near = battle.nearby(a.pos.x, a.pos.z, 40);
    const pool = near.length > 1 ? near : battle.agents;
    for (const e of pool) {
      if (!e.alive || !battle.areEnemies(a, e)) continue;
      let d = (e.pos.x - a.pos.x) ** 2 + (e.pos.z - a.pos.z) ** 2;
      if (e === t) d *= 0.7;
      // spread attackers: avoid piling onto the same enemy
      if (e.ai && e.ai.attackers > 2) d *= 1.4;
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    if (!best && pool !== battle.agents) {
      for (const e of battle.agents) {
        if (!e.alive || !battle.areEnemies(a, e)) continue;
        const d = (e.pos.x - a.pos.x) ** 2 + (e.pos.z - a.pos.z) ** 2;
        if (d < bd) {
          bd = d;
          best = e;
        }
      }
    }
    if (t && t.ai) t.ai.attackers = Math.max(0, (t.ai.attackers || 1) - 1);
    ai.target = best;
    if (best && best.ai) best.ai.attackers = (best.ai.attackers || 0) + 1;
    t = best;
  }
  if (!t || a.busy()) return;

  // weapon choice
  const g = battle.groupOf(a);
  const dist = Math.hypot(t.pos.x - a.pos.x, t.pos.z - a.pos.z);
  const rangedIdx = a.weapons.findIndex((id) => ITEMS[id].slot === 'ranged' && (a.ammo[id] || 0) > 0 && a.canUseWeapon(ITEMS[id]));
  const meleeIdx = a.weapons.findIndex((id) => ITEMS[id].slot === 'melee');
  const s = a.action.s;
  if (s !== 'idle' && s !== 'recover') return;
  const minRange = a.horse ? 5 : 6.5;
  const wantRanged = rangedIdx >= 0 && g.fire && dist > minRange && dist < 150;
  if (wantRanged && a.wi !== rangedIdx) {
    // throwing weapons are only thrown at close-ish range
    const w = ITEMS[a.weapons[rangedIdx]];
    if (w.cls !== 'throw' || dist < 28) a.switchWeapon(rangedIdx);
  } else if (!wantRanged && a.isRanged() && meleeIdx >= 0 && (dist <= minRange || !a.hasAmmo() || !g.fire)) {
    a.switchWeapon(meleeIdx);
  } else if (a.isRanged() && !a.hasAmmo() && meleeIdx >= 0) {
    a.switchWeapon(meleeIdx);
  }
}

// Point to walk to so the soldier keeps its place in the formation.
function slotTarget(battle, a) {
  const g = battle.groupOf(a);
  if (g.order === 'follow' && battle.player && battle.player.alive) {
    const p = battle.player;
    const i = a.slotIndex || 0;
    const row = Math.floor(i / 6);
    const col = (i % 6) - 2.5;
    const f = p.yaw;
    const back = 3 + row * 1.8;
    return [p.pos.x - Math.sin(f) * back + Math.cos(f) * col * 1.6, p.pos.z - Math.cos(f) * back - Math.sin(f) * col * 1.6, f];
  }
  if (a.slot) return [a.slot[0], a.slot[1], g.facing];
  return null;
}

export function aiControl(battle, a, dt) {
  const ai = a.ai;
  if (battle.time >= ai.nextThink) aiThink(battle, a);
  if (ai.attackCd > 0) ai.attackCd -= dt;
  const t = ai.target && ai.target.alive ? ai.target : null;
  const g = battle.groupOf(a);
  a.move.x = 0;
  a.move.z = 0;
  a.move.walk = false;
  a.ride.throttle = 0;
  a.ride.turn = 0;

  const dist = t ? Math.hypot(t.pos.x - a.pos.x, t.pos.z - a.pos.z) : Infinity;
  let engage = false;
  if (t) {
    if (g.order === 'charge') engage = true;
    else if (a.isRanged() && g.fire) engage = true;
    else {
      const r = a.horse ? 16 : g.engageR || 7;
      engage = dist < r;
      // defenders stay on their level
      if (engage && battle.terrain.fort && g.order === 'hold' && battle.terrain.level(t.pos.x, t.pos.z) !== battle.terrain.level(a.pos.x, a.pos.z) && dist > 3) engage = false;
    }
  }

  defend(battle, a, t, dist);

  // an order to hold fire (or losing the target) lowers drawn bows
  if ((a.action.s === 'draw' || a.action.s === 'aim') && (!g.fire || !t)) a.setAction('idle');

  // foot archers holding a position walk to it first, then shoot from there
  if (t && !a.horse && a.isRanged() && a.hasAmmo() && g.fire && g.order !== 'charge') {
    const st = slotTarget(battle, a);
    if (st && Math.hypot(st[0] - a.pos.x, st[1] - a.pos.z) > 2.5 && dist > 8) {
      if (a.action.s === 'draw' || a.action.s === 'aim') a.setAction('idle');
      moveTo(battle, a, st[0], st[1], st[2], false);
      return;
    }
  }

  if (!engage) {
    const st = slotTarget(battle, a);
    if (st) moveTo(battle, a, st[0], st[1], st[2], dist < 30);
    else if (t && g.order === 'charge') engage = true;
    else idleFace(a, g);
    if (!engage) {
      // archers keep shooting from their spot
      if (t && a.isRanged() && g.fire) rangedAttack(battle, a, t, dist);
      return;
    }
  }

  if (a.horse) {
    if (a.isRanged() && a.hasAmmo()) horseArcher(battle, a, t, dist);
    else cavalryCharge(battle, a, t, dist);
    return;
  }
  if (a.isRanged()) {
    if (a.hasAmmo()) {
      // advance until in comfortable range
      const range = a.weapon.cls === 'throw' ? 18 : 65;
      if (dist > range && g.order === 'charge') moveTo(battle, a, t.pos.x, t.pos.z, null, false);
      else a.faceYaw = angleTo(a, t.pos.x, t.pos.z);
      rangedAttack(battle, a, t, dist);
      return;
    }
  }
  meleeFoot(battle, a, t, dist);
}

function idleFace(a, g) {
  if (g.facing != null) a.faceYaw = g.facing;
  a.aimYaw = a.faceYaw;
}

function moveTo(battle, a, x, z, faceYaw, walk) {
  const wp = battle.terrain.waypoint(a.pos.x, a.pos.z, x, z);
  if (wp) {
    x = wp[0];
    z = wp[1];
  }
  const dx = x - a.pos.x;
  const dz = z - a.pos.z;
  const d = Math.hypot(dx, dz);
  if (a.horse) {
    if (d < 3) {
      a.ride.throttle = 0;
      if (faceYaw != null) a.ride.turn = clamp(wrapAngle(faceYaw - a.horse.yaw) * 2, -1, 1) * 0.5;
      a.aimYaw = a.horse.yaw;
      return true;
    }
    const want = Math.atan2(dx, dz);
    const diff = wrapAngle(want - a.horse.yaw);
    a.ride.turn = clamp(diff * 2.5, -1, 1);
    a.ride.throttle = Math.abs(diff) > 1.4 ? 0.35 : d < 15 ? 0.4 : 0.9;
    a.aimYaw = a.horse.yaw;
    avoidObstacles(battle, a, dx / d, dz / d);
    return false;
  }
  if (d < 0.7) {
    a.faceYaw = faceYaw != null ? faceYaw : a.faceYaw;
    a.aimYaw = a.faceYaw;
    return true;
  }
  let mx = dx / d;
  let mz = dz / d;
  [mx, mz] = avoidObstacles(battle, a, mx, mz);
  a.move.x = mx;
  a.move.z = mz;
  a.move.walk = walk && d < 6;
  a.faceYaw = Math.atan2(mx, mz);
  a.aimYaw = a.faceYaw;
  return false;
}

function avoidObstacles(battle, a, mx, mz) {
  const obs = battle.obstaclesNear(a.pos.x, a.pos.z, 3.5);
  let ax = 0;
  let az = 0;
  for (const o of obs) {
    const ox = o.x - a.pos.x;
    const oz = o.z - a.pos.z;
    const along = ox * mx + oz * mz;
    if (along < 0 || along > 3.5) continue;
    // lateral offset along p = (-mz, mx), which is the soldier's right side
    const perp = -ox * mz + oz * mx;
    const clearance = o.r + a.radius + 0.4;
    if (Math.abs(perp) < clearance) {
      const side = perp > 0 ? -1 : 1;
      ax += -mz * side;
      az += mx * side;
      if (a.horse) a.ride.turn = clamp(a.ride.turn - side * 0.8, -1, 1);
    }
  }
  if (ax || az) {
    mx += ax * 0.9;
    mz += az * 0.9;
    const l = Math.hypot(mx, mz) || 1;
    mx /= l;
    mz /= l;
  }
  return [mx, mz];
}

// React to incoming attacks with a block.
function defend(battle, a, t, dist) {
  const ai = a.ai;
  const now = battle.time;
  // find the most urgent attacker around
  if (a.horse && !a.activeShield()) return;
  let threat = null;
  let best = Infinity;
  const near = battle.nearby(a.pos.x, a.pos.z, 5);
  for (const e of near) {
    if (!e.alive || !battle.areEnemies(a, e)) continue;
    const s = e.action.s;
    if (s !== 'windup' && s !== 'hold' && !(s === 'swing' && !e.action.hitDone)) continue;
    const aimsAtMe = e.isPlayer
      ? Math.abs(wrapAngle(Math.atan2(a.pos.x - e.pos.x, a.pos.z - e.pos.z) - e.aimYaw)) < 0.7
      : e.ai.target === a;
    if (!aimsAtMe) continue;
    const d = Math.hypot(e.pos.x - a.pos.x, e.pos.z - a.pos.z) - e.weapon.reach;
    if (d > 2.5) continue;
    if (d < best) {
      best = d;
      threat = e;
    }
  }
  if (threat && ai.reacted !== threat.action.id) {
    ai.reacted = threat.action.id;
    const shield = !!a.activeShield();
    const p = shield ? 0.35 + a.blockSkill * 0.6 : 0.2 + a.blockSkill * 0.7;
    if (Math.random() < p && !a.isRanged()) {
      const correct = shield || Math.random() < a.blockSkill;
      ai.blockDir = correct ? requiredBlock(threat.action.dir) : BLOCK_DIRS[Math.floor(Math.random() * 4)];
      ai.blockAt = now + a.reaction * (0.6 + Math.random() * 0.8);
      ai.blockUntil = ai.blockAt + 0.75 + Math.random() * 0.3;
      ai.blockFrom = threat;
    }
  }
  // keep shields up against archers
  if (a.activeShield() && t && t.isRanged() && dist > 8 && !a.horse && Math.random() < 0.02) {
    ai.blockDir = 'up';
    ai.blockAt = now;
    ai.blockUntil = now + 1.2;
    ai.blockFrom = null;
  }
  if (ai.blockAt && now >= ai.blockAt && now < ai.blockUntil) {
    const s = a.action.s;
    if (s === 'idle' || s === 'recover' || ((s === 'windup' || s === 'hold') && Math.random() < a.blockSkill * 0.3)) a.beginBlock(ai.blockDir);
  }
  if (a.action.s === 'block' && now >= (ai.blockUntil || 0)) {
    a.endBlock();
    ai.blockAt = 0;
    ai.attackCd = Math.min(ai.attackCd, 0.1); // riposte
  }
}

function pickDir(a, t) {
  const w = a.weapon;
  const dirs = w.dirs || ['right'];
  // skilled fighters avoid the direction the opponent is guarding
  if (t.action.s === 'block' && !t.activeShield() && Math.random() < a.blockSkill) {
    const guarded = dirs.filter((d) => requiredBlock(d) === t.action.blockDir);
    const open = dirs.filter((d) => !guarded.includes(d));
    if (open.length) return open[Math.floor(Math.random() * open.length)];
  }
  if (w.cls === 'spear' && dirs.includes('thrust') && Math.random() < 0.75) return 'thrust';
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function meleeFoot(battle, a, t, dist) {
  const ai = a.ai;
  const w = a.weapon;
  const reach = w.reach + 0.55 + t.radius;
  const want = Math.max(0.9, reach * (t.horse ? 0.7 : 0.78));
  const tx = t.pos.x + t.vel.x * 0.25;
  const tz = t.pos.z + t.vel.z * 0.25;
  const wp = battle.terrain.waypoint(a.pos.x, a.pos.z, tx, tz);
  if (wp && dist > 3) {
    moveTo(battle, a, tx, tz, null, false);
    return;
  }
  const dx = tx - a.pos.x;
  const dz = tz - a.pos.z;
  const d = Math.hypot(dx, dz) || 1;
  const nx = dx / d;
  const nz = dz / d;
  if (dist > want + 0.35) {
    let [mx, mz] = avoidObstacles(battle, a, nx, nz);
    a.move.x = mx;
    a.move.z = mz;
  } else if (dist < want - 0.6) {
    a.move.x = -nx * 0.5;
    a.move.z = -nz * 0.5;
  } else {
    ai.strafeT -= 1 / 60;
    if (ai.strafeT <= 0) {
      ai.strafe = Math.random() < 0.5 ? -1 : Math.random() < 0.5 ? 1 : 0;
      ai.strafeT = 0.6 + Math.random() * 1.2;
    }
    a.move.x = -nz * ai.strafe * 0.3;
    a.move.z = nx * ai.strafe * 0.3;
  }
  const yaw = Math.atan2(nx, nz);
  a.faceYaw = yaw;
  a.aimYaw = yaw;
  const facing = Math.abs(wrapAngle(yaw - a.yaw)) < 0.5;
  if (a.action.s === 'idle' && ai.attackCd <= 0 && dist <= reach + 0.15 && facing) {
    if (a.beginAttack(pickDir(a, t))) {
      a.action.holdFor = 0.05 + Math.random() * (0.5 - a.blockSkill * 0.3);
      ai.attackCd = (0.35 + Math.random() * 1.1) * (1.25 - a.blockSkill * 0.5);
    }
  }
}

function cavalryCharge(battle, a, t, dist) {
  const ai = a.ai;
  const h = a.horse;
  const w = a.weapon;
  const now = battle.time;
  const lead = Math.min(1.2, dist / 12);
  const px = t.pos.x + t.vel.x * lead;
  const pz = t.pos.z + t.vel.z * lead;
  let dx = px - a.pos.x;
  let dz = pz - a.pos.z;
  const d = Math.hypot(dx, dz) || 1;
  const rel = wrapAngle(Math.atan2(dx, dz) - h.yaw);
  // passing through: keep riding straight for a moment before turning back
  if (ai.passUntil && now < ai.passUntil) {
    a.ride.throttle = 1;
    a.ride.turn = 0;
  } else {
    if (Math.abs(rel) > 1.8 && dist < 9) ai.passUntil = now + 1.1;
    let aimX = px;
    let aimZ = pz;
    if (!w.lance) {
      // pass the target on our weapon (right) side
      const rx = -dz / d;
      const rz = dx / d;
      aimX += rx * 1.4;
      aimZ += rz * 1.4;
    }
    const wp = battle.terrain.waypoint(a.pos.x, a.pos.z, aimX, aimZ);
    if (wp) {
      aimX = wp[0];
      aimZ = wp[1];
    }
    const want = Math.atan2(aimX - a.pos.x, aimZ - a.pos.z);
    const diff = wrapAngle(want - h.yaw);
    a.ride.turn = clamp(diff * 2.8, -1, 1);
    a.ride.throttle = Math.abs(diff) > 1.6 && dist < 12 ? 0.5 : 1;
    avoidObstacles(battle, a, Math.sin(h.yaw), Math.cos(h.yaw));
  }
  // stuck? back off and turn
  if (Math.abs(h.speed) < 0.5 && ai.stuckT == null) ai.stuckT = now;
  if (Math.abs(h.speed) > 1.5) ai.stuckT = null;
  if (ai.stuckT != null && now - ai.stuckT > 1.5) {
    a.ride.throttle = -1;
    a.ride.turn = 1;
    if (now - ai.stuckT > 2.5) ai.stuckT = null;
  }
  a.aimYaw = Math.atan2(t.pos.x - a.pos.x, t.pos.z - a.pos.z);
  if (w.lance) return; // couching is automatic
  const reach = w.reach + 1.1 + t.radius;
  const s = a.action.s;
  if (s === 'idle' && dist < 11 && Math.abs(rel) < 1.0 && ai.attackCd <= 0) {
    const tRel = wrapAngle(a.aimYaw - h.yaw);
    const dir = tRel > 0.25 ? 'left' : tRel < -0.25 ? 'right' : Math.random() < 0.5 ? 'overhead' : 'right';
    if (a.beginAttack(dir)) {
      a.action.holdFor = 99;
      ai.attackCd = 0.8;
    }
  }
  if ((s === 'hold' || s === 'windup') && dist < reach) {
    if (s === 'hold') a.toSwing();
    else a.action.release = true;
  }
  if (s === 'hold' && dist > 16) a.setAction('idle');
}

function horseArcher(battle, a, t, dist) {
  const h = a.horse;
  const toT = Math.atan2(t.pos.x - a.pos.x, t.pos.z - a.pos.z);
  let want;
  if (dist < 18) want = toT + Math.PI * 0.8 * (a.ai.strafe || 1);
  else if (dist > 42) want = toT;
  else want = toT + (Math.PI / 2) * (a.ai.strafe || 1);
  const wp = battle.terrain.waypoint(a.pos.x, a.pos.z, t.pos.x, t.pos.z);
  if (wp) want = Math.atan2(wp[0] - a.pos.x, wp[1] - a.pos.z);
  // do not ride off the map
  const lim = battle.terrain.half - 18;
  if (Math.abs(a.pos.x) > lim || Math.abs(a.pos.z) > lim) want = Math.atan2(-a.pos.x, -a.pos.z);
  const diff = wrapAngle(want - h.yaw);
  a.ride.turn = clamp(diff * 2.2, -1, 1);
  a.ride.throttle = 0.8;
  avoidObstacles(battle, a, Math.sin(h.yaw), Math.cos(h.yaw));
  a.aimYaw = toT;
  if (Math.abs(wrapAngle(toT - h.yaw)) < 2.3) rangedAttack(battle, a, t, dist);
  else if (a.action.s === 'aim' && a.action.t > 1.5) a.setAction('idle');
}

function rangedAttack(battle, a, t, dist) {
  const w = a.weapon;
  if (!a.hasAmmo() || !a.canUseWeapon(w)) return;
  a.aimYaw = Math.atan2(t.pos.x - a.pos.x, t.pos.z - a.pos.z);
  if (!a.horse) a.faceYaw = a.aimYaw;
  const s = a.action.s;
  const maxRange = w.cls === 'throw' ? 30 : w.cls === 'crossbow' ? 140 : 120;
  if (dist > maxRange) return;
  const sol = battle.aimSolution(a, t, w.projSpeed);
  a.aimPitch = sol ? Math.asin(clamp(sol.y, -1, 1)) : 0;
  if (s === 'idle') {
    if (w.cls !== 'crossbow' || a.loaded) a.beginDraw();
    a.ai.aimTime = 0.25 + Math.random() * 0.5 + a.aimErr * 5;
  } else if (s === 'aim' && a.action.t >= (a.action.ready || 0) + (a.ai.aimTime || 0.4)) {
    if (!sol) {
      a.setAction('idle');
      return;
    }
    const err = a.spread() * (1 + dist / 120);
    const yaw = Math.atan2(sol.x, sol.z) + (Math.random() - 0.5) * 2 * err;
    const pitch = Math.asin(clamp(sol.y, -1, 1)) + (Math.random() - 0.5) * 2 * err;
    const cp = Math.cos(pitch);
    a.shoot({ x: Math.sin(yaw) * cp, y: Math.sin(pitch), z: Math.cos(yaw) * cp });
    a.ai.attackCd = 0.3 + Math.random() * 0.6;
  }
}
