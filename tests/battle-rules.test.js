import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requiredBlock, allowedDir, computeDamage, attackDamage } from '../src/battle/combat.js';
import { ITEMS } from '../src/data/items.js';
import { autoResolve } from '../src/world/autoresolve.js';
import { Rng } from '../src/core/rng.js';

test('blocks must face the side the attack comes from', () => {
  assert.equal(requiredBlock('right'), 'left');
  assert.equal(requiredBlock('left'), 'right');
  assert.equal(requiredBlock('overhead'), 'up');
  assert.equal(requiredBlock('thrust'), 'down');
});

test('weapons fall back to a direction they support', () => {
  assert.equal(allowedDir(ITEMS.spear, 'left'), 'thrust');
  assert.equal(allowedDir(ITEMS.axe_hand, 'thrust'), 'overhead');
  assert.equal(allowedDir(ITEMS.lance, 'overhead'), 'thrust');
  assert.equal(allowedDir(ITEMS.sword_arming, 'left'), 'left');
});

test('armour reduces damage, blunt weapons suffer less from it', () => {
  const r = () => 1;
  const cutNaked = computeDamage(30, 'cut', 0, r);
  const cutPlate = computeDamage(30, 'cut', 45, r);
  const bluntPlate = computeDamage(30, 'blunt', 45, r);
  assert.ok(cutNaked > cutPlate);
  assert.ok(bluntPlate > cutPlate);
  assert.deepEqual(attackDamage(ITEMS.sword_arming, 'thrust'), ITEMS.sword_arming.thrust);
  assert.deepEqual(attackDamage(ITEMS.sword_arming, 'left'), ITEMS.sword_arming.swing);
});

test('auto-resolve favours the stronger side and reports losses per party', () => {
  let wins = 0;
  for (let i = 0; i < 20; i++) {
    const res = autoResolve([
      { stacks: [{ key: 'a', troopId: 'velmar_knight', count: 20 }], bonus: 1, woundChance: 0.3 },
      { stacks: [{ key: 'b', troopId: 'looter', count: 20 }], bonus: 1, woundChance: 0.3 },
    ], new Rng(i + 1));
    if (res.winner === 0) wins++;
    const lb = res.losses[1].get('b');
    if (res.winner === 0) assert.ok(lb, 'loser has losses');
  }
  assert.ok(wins >= 19, `knights should beat looters (won ${wins}/20)`);
});
