import { test, beforeEach } from 'node:test';
import { rng } from '../src/core/rng.js';

// gameplay randomness uses a shared generator: make it reproducible in tests
beforeEach(() => rng.reseed(12345));
import assert from 'node:assert/strict';
import { createNewState, World } from '../src/world/world.js';
import { acceptQuest, completeDelivery, deliverableQuests, generateQuests } from '../src/world/quests.js';
import { autoFieldBattle } from '../src/game/conflict.js';
import { addTroops } from '../src/world/party.js';
import { invCount } from '../src/world/economy.js';

function setup(seed = 11) {
  const state = createNewState({ seed, background: 'merchant' });
  const world = new World(state);
  // make sure both quest types are on offer
  for (let i = 0; i < 30; i++) {
    const has = (type) => state.quests.some((q) => q.type === type && q.status === 'offered' && !world.isHostile(world.sById.get(q.giver).faction, 'player'));
    if (has('delivery') && has('bounty')) break;
    generateQuests(world);
  }
  return { state, world };
}

test('delivery quest: cargo is handed over for a reward', () => {
  const { state, world } = setup();
  const q = state.quests.find((x) => x.type === 'delivery' && x.status === 'offered' && !world.isHostile(world.sById.get(x.giver).faction, 'player'));
  assert.ok(q, 'a delivery quest is offered');
  assert.equal(acceptQuest(world, q), null);
  assert.equal(q.status, 'active');
  assert.equal(invCount(state.player.inventory, 'cargo'), 1);
  assert.equal(deliverableQuests(world, q.target).length, 1);
  const gold = state.player.gold;
  assert.ok(completeDelivery(world, q));
  assert.equal(q.status, 'done');
  assert.equal(state.player.gold, gold + q.reward);
  assert.equal(invCount(state.player.inventory, 'cargo'), 0);
});

test('delivery quest fails after the deadline', () => {
  const { state, world } = setup();
  const q = state.quests.find((x) => x.type === 'delivery' && x.status === 'offered');
  acceptQuest(world, q);
  world.skipTime((q.days + 1) * 24);
  assert.equal(q.status, 'failed');
  assert.equal(invCount(state.player.inventory, 'cargo'), 0);
});

test('bounty quest completes when the player defeats the gang', () => {
  const { state, world } = setup(12);
  const q = state.quests.find((x) => x.type === 'bounty' && x.status === 'offered');
  assert.ok(q, 'a bounty quest is offered');
  acceptQuest(world, q);
  const gang = world.pById.get(q.targetParty);
  assert.ok(gang && gang.questId === q.id);
  addTroops(state.party.troops, 'merc_footman', 40);
  const game = { world, ui: { showBattleResult() {} } };
  const gold = state.player.gold;
  autoFieldBattle(game, { enemies: [gang] });
  assert.equal(q.status, 'done');
  assert.ok(state.player.gold >= gold + q.reward);
});

test('mercenary contract makes the employer friendly and its enemies hostile', () => {
  const { state, world } = setup();
  const [a, b] = Object.keys(state.wars)[0].split('|');
  assert.equal(world.isHostile(a, 'player'), false);
  state.contract = { faction: a, until: world.day + 30, vassal: false };
  assert.equal(world.isHostile(a, 'player'), false);
  assert.equal(world.isHostile(b, 'player'), true);
  const gold = state.player.gold;
  world.skipTime(24 * 8);
  assert.ok(state.player.gold !== gold, 'weekly pay or wages applied');
});
