// Helpers for troop stacks: [{ id, count, wounded, xp }], where count includes wounded.
import { TROOPS } from '../data/troops.js';

export function addTroops(stacks, id, count, wounded = 0) {
  if (count <= 0) return;
  let s = stacks.find((x) => x.id === id);
  if (!s) {
    s = { id, count: 0, wounded: 0, xp: 0 };
    stacks.push(s);
  }
  s.count += count;
  s.wounded += Math.min(wounded, count);
}

// Remove soldiers; healthy ones first unless woundedFirst.
export function removeTroops(stacks, id, count, woundedFirst = false) {
  const s = stacks.find((x) => x.id === id);
  if (!s || count <= 0) return 0;
  const n = Math.min(count, s.count);
  const healthy = s.count - s.wounded;
  let fromWounded;
  if (woundedFirst) fromWounded = Math.min(n, s.wounded);
  else fromWounded = Math.max(0, n - healthy);
  s.wounded -= fromWounded;
  s.count -= n;
  if (s.count <= 0) stacks.splice(stacks.indexOf(s), 1);
  else s.xp = Math.min(s.xp, s.count * TROOPS[s.id].upgradeXp);
  return n;
}

export function woundTroops(stacks, id, count) {
  const s = stacks.find((x) => x.id === id);
  if (!s) return;
  s.wounded = Math.min(s.count, s.wounded + count);
}

export function totalCount(stacks) {
  let n = 0;
  for (const s of stacks) n += s.count;
  return n;
}

export function healthyCount(stacks) {
  let n = 0;
  for (const s of stacks) n += s.count - s.wounded;
  return n;
}

export function woundedCount(stacks) {
  let n = 0;
  for (const s of stacks) n += s.wounded;
  return n;
}

export function mountedFraction(stacks) {
  let m = 0;
  let n = 0;
  for (const s of stacks) {
    const h = s.count - s.wounded;
    n += s.count;
    if (TROOPS[s.id].mounted) m += h;
  }
  return n ? m / n : 0;
}

export function healthyStacks(stacks) {
  return stacks.filter((s) => s.count - s.wounded > 0).map((s) => ({ id: s.id, count: s.count - s.wounded }));
}

// Apply losses: killed troops are removed (healthy first), wounded are marked.
export function applyLosses(stacks, loss) {
  if (!loss) return;
  for (const [id, n] of Object.entries(loss.killed || {})) removeTroops(stacks, id, n, false);
  for (const [id, n] of Object.entries(loss.wounded || {})) woundTroops(stacks, id, n);
}

export function cloneStacks(stacks) {
  return stacks.map((s) => ({ ...s }));
}

export function stacksStrength(stacks) {
  let p = 0;
  for (const s of stacks) p += TROOPS[s.id].power * (s.count - s.wounded);
  return p;
}

export function stacksWages(stacks) {
  let w = 0;
  for (const s of stacks) w += TROOPS[s.id].wage * s.count;
  return w;
}

// Add experience to a stack; returns nothing. XP pool caps at count * upgradeXp.
export function addStackXp(stack, amount) {
  const t = TROOPS[stack.id];
  if (!t.up.length) return;
  stack.xp = Math.min(stack.count * t.upgradeXp, stack.xp + amount);
}

export function upgradableCount(stack) {
  const t = TROOPS[stack.id];
  if (!t.up.length) return 0;
  return Math.min(stack.count - stack.wounded, Math.floor(stack.xp / t.upgradeXp));
}

export function upgradeStack(stacks, stack, targetId, n) {
  const t = TROOPS[stack.id];
  n = Math.min(n, upgradableCount(stack));
  if (n <= 0) return 0;
  stack.xp -= n * t.upgradeXp;
  const id = stack.id;
  removeTroops(stacks, id, n, false);
  addTroops(stacks, targetId, n);
  return n;
}

export function describeStacks(stacks, limit = 4) {
  const sorted = [...stacks].sort((a, b) => b.count - a.count);
  const parts = sorted.slice(0, limit).map((s) => `${TROOPS[s.id].name} ×${s.count}`);
  if (sorted.length > limit) parts.push('…');
  return parts.join(', ');
}
