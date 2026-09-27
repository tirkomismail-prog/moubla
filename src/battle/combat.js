// Melee rules: timings, directional blocking, hit detection and damage.
import { ITEMS } from '../data/items.js';
import { clamp, wrapAngle } from '../core/util.js';

export const T = {
  windup: 0.42,
  swing: 0.3,
  hitAt: 0.45, // fraction of the swing when the hit is checked
  recover: 0.34,
  bounce: 0.6,
  stun: 0.38,
  blockRaise: 0.1,
  switch: 0.55,
};

// Direction the defender must block for a given attack direction.
// An attack from the attacker's right arrives at the defender's left.
export function requiredBlock(dir) {
  switch (dir) {
    case 'right':
      return 'left';
    case 'left':
      return 'right';
    case 'overhead':
      return 'up';
    default:
      return 'down';
  }
}

export function allowedDir(weapon, dir) {
  const dirs = weapon.dirs || ['right'];
  if (dirs.includes(dir)) return dir;
  if (dir === 'thrust' && dirs.includes('overhead')) return 'overhead';
  if ((dir === 'left' || dir === 'right') && dirs.includes('thrust') && !dirs.includes('left')) return 'thrust';
  if (dir === 'overhead' && dirs.includes('right')) return 'right';
  return dirs[0];
}

export function attackDamage(weapon, dir) {
  if (dir === 'thrust' && weapon.thrust) return weapon.thrust;
  if (weapon.swing) return weapon.swing;
  return weapon.thrust || [10, 'blunt'];
}

const SOAK = { cut: 0.5, pierce: 0.33, blunt: 0.25 };
const REDUCE = { cut: 0.012, pierce: 0.009, blunt: 0.007 };

export function computeDamage(raw, dtype, armor, rand = Math.random) {
  const soak = armor * (SOAK[dtype] ?? 0.4) * (0.5 + rand() * 0.5);
  const reduce = Math.min(0.75, armor * (REDUCE[dtype] ?? 0.01));
  return Math.max(0, raw - soak) * (1 - reduce);
}

// Is `def` blocking the attack coming from `att` in direction `dir`?
export function isBlocked(att, def, dir) {
  const a = def.action;
  if (a.s !== 'block' || a.t < T.blockRaise) return false;
  const toAtt = Math.atan2(att.pos.x - def.pos.x, att.pos.z - def.pos.z);
  const rel = Math.abs(wrapAngle(toAtt - def.aimYaw));
  const sh = def.activeShield();
  if (sh) return rel < (ITEMS[sh].arc || 1.4);
  if (rel > 1.1) return false;
  return a.blockDir === requiredBlock(dir);
}

// Find the victim of a melee swing at the moment of impact.
// Returns { target, horse:boolean } or null.
export function findMeleeTarget(battle, att, weapon, dir) {
  const reach = weapon.reach + 0.55 + (att.horse ? 0.5 : 0);
  const cands = battle.nearby(att.pos.x, att.pos.z, reach + 1.6);
  let best = null;
  let bestKey = Infinity;
  for (const t of cands) {
    if (t === att || !t.alive || !battle.areEnemies(att, t)) continue;
    const dx = t.pos.x - att.pos.x;
    const dz = t.pos.z - att.pos.z;
    const d = Math.hypot(dx, dz) - t.radius;
    if (d > reach) continue;
    if (Math.abs(t.pos.y - att.pos.y) > 2.6) continue;
    const rel = wrapAngle(Math.atan2(dx, dz) - att.aimYaw);
    let key;
    if (dir === 'left' || dir === 'right') {
      if (Math.abs(rel) > 1.3) continue;
      key = dir === 'right' ? rel : -rel; // first thing the blade meets
    } else {
      const arc = dir === 'thrust' ? 0.38 : 0.5;
      if (Math.abs(rel) > arc + Math.atan2(t.radius, Math.max(0.3, d + t.radius))) continue;
      key = d;
    }
    if (key < bestKey) {
      bestKey = key;
      best = t;
    }
  }
  if (!best) return null;
  let horse = false;
  if (best.horse && !att.horse) {
    const polearm = weapon.reach >= 1.5;
    horse = !(dir === 'overhead' || polearm) && Math.random() < 0.55;
  }
  return { target: best, horse };
}

// Speed bonus from relative motion (mounted charges hit harder).
export function speedBonus(att, target, lance = false) {
  const dx = target.pos.x - att.pos.x;
  const dz = target.pos.z - att.pos.z;
  const d = Math.hypot(dx, dz) || 1;
  const rel = ((att.vel.x - target.vel.x) * dx + (att.vel.z - target.vel.z) * dz) / d;
  if (lance) return clamp(1 + rel * 0.13, 0.6, 3);
  return clamp(1 + rel * 0.05, 0.75, 1.7);
}
