import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNewState, World } from '../src/world/world.js';

test('every settlement is reachable from the player start', () => {
  for (const seed of [2, 19, 77, 1234]) {
    const state = createNewState({ seed, background: 'knight' });
    const world = new World(state);
    const pp = state.party;
    for (const s of state.settlements) {
      const path = world.pf.find(pp.x, pp.y, s.x, s.y);
      assert.ok(path && path.length, `seed ${seed}: no path to ${s.name}`);
      const last = path[path.length - 1];
      assert.ok(Math.hypot(last[0] - s.x, last[1] - s.y) < 30, `seed ${seed}: path to ${s.name} ends far away`);
    }
  }
});

test('paths never cross impassable cells', () => {
  const state = createNewState({ seed: 5, background: 'knight' });
  const world = new World(state);
  const towns = state.settlements.filter((s) => s.kind === 'town');
  const a = towns[0];
  const b = towns[towns.length - 1];
  const path = world.pf.find(a.x, a.y, b.x, b.y);
  let prev = [a.x, a.y];
  for (const p of path) {
    const steps = Math.ceil(Math.hypot(p[0] - prev[0], p[1] - prev[1]) / 4);
    for (let i = 1; i <= steps; i++) {
      const x = prev[0] + ((p[0] - prev[0]) * i) / steps;
      const y = prev[1] + ((p[1] - prev[1]) * i) / steps;
      assert.ok(world.nav.speedAt(x, y) > 0, `impassable at ${x.toFixed(0)},${y.toFixed(0)}`);
    }
    prev = p;
  }
});
