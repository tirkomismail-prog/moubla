import { test, beforeEach } from 'node:test';
import { rng } from '../src/core/rng.js';

// gameplay randomness uses a shared generator: make it reproducible in tests
beforeEach(() => rng.reseed(12345));
import assert from 'node:assert/strict';
import { createNewState, World } from '../src/world/world.js';
import { totalCount } from '../src/world/party.js';
import { TROOPS } from '../src/data/troops.js';
import { ITEMS } from '../src/data/items.js';

test('troop equipment references existing items and upgrades exist', () => {
  for (const t of Object.values(TROOPS)) {
    for (const [slot, list] of Object.entries(t.eq)) {
      for (const id of list) if (id) assert.ok(ITEMS[id], `${t.id}.${slot}: ${id}`);
    }
    for (const u of t.up) assert.ok(TROOPS[u], `${t.id} upgrade ${u}`);
  }
});

test('new world has settlements, lords and parties, all on the mainland', () => {
  for (const seed of [1, 7, 12345]) {
    const state = createNewState({ seed, name: 'Тест', background: 'knight' });
    const world = new World(state);
    assert.equal(state.settlements.length, 4 * (3 + 2 + 6));
    for (const s of state.settlements) {
      assert.ok(world.nav.isMainland(s.x, s.y), `${s.name} not on mainland (seed ${seed})`);
    }
    assert.ok(state.parties.length > 30);
    assert.ok(world.roads.length > 20);
  }
});

test('world simulation runs for 60 days without errors', () => {
  const state = createNewState({ seed: 99, name: 'Тест', background: 'merchant' });
  const world = new World(state);
  const t0 = Date.now();
  let encounters = 0;
  for (let h = 0; h < 24 * 60; h += 1) {
    const ev = world.advance(1);
    if (ev && ev.type === 'encounter') {
      encounters++;
      // simulate player retreat so time can continue
      state.party.graceUntil = state.time + 5;
    }
  }
  const lords = state.parties.filter((p) => p.kind === 'lord').length;
  assert.ok(lords > 5, 'lords alive');
  assert.ok(state.time >= 24 * 60);
  console.log('sim ms', Date.now() - t0, 'parties', state.parties.length, 'encounters', encounters,
    'wars', Object.keys(state.wars), 'log', state.log.length,
    'owners changed', state.settlements.filter((s) => s.faction !== s.culture).length,
    'total troops', state.parties.reduce((a, p) => a + totalCount(p.troops), 0));
});

test('save round-trip through JSON keeps world usable', () => {
  const state = createNewState({ seed: 5, background: 'hunter' });
  const world = new World(state);
  world.advance(30);
  const copy = JSON.parse(JSON.stringify(state));
  const w2 = new World(copy);
  w2.advance(30);
  assert.equal(w2.state.settlements.length, state.settlements.length);
});
