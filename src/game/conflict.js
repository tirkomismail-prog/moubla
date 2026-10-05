// Glue between the world map and battles: building battle setups from parties,
// applying results (casualties, loot, prisoners, experience, captures).
import { rng } from '../core/rng.js';
import { dist, clamp } from '../core/util.js';
import { TROOPS } from '../data/troops.js';
import { ITEMS } from '../data/items.js';
import { FACTIONS, factionInfo } from '../data/factions.js';
import { playerMaxHp, partySkill, hiredCompanions } from '../data/character.js';
import { BIOME_BATTLE } from '../world/terrain.js';
import { autoResolve } from '../world/autoresolve.js';
import {
  addTroops, applyLosses, healthyCount, totalCount, addStackXp, removeTroops, woundedCount,
} from '../world/party.js';
import { invAdd, invLoad, CARRY_CAPACITY } from '../world/economy.js';
import { warKey } from '../world/world.js';

export function playerHero(world) {
  const p = world.state.player;
  const skills = { ...p.skills };
  // party-wide skills (surgery, tactics...) come from the best member
  for (const k of ['surgery', 'tactics', 'looting']) skills[k] = partySkill(world.state, k);
  return {
    key: 'player',
    name: p.name,
    hp: p.hp,
    maxHp: playerMaxHp(p),
    equipment: { ...p.equipment },
    skills,
    attrs: { ...p.attrs },
    level: p.level,
  };
}

// Battle specs for hired companions.
export function companionSpecs(world) {
  return hiredCompanions(world.state)
    .filter((c) => c.st.hp > 5)
    .map((c) => {
      const skills = {};
      for (const k of Object.keys(world.state.player.skills)) skills[k] = c.def.skills[k] || 0;
      const a = 6 + Math.round(c.def.level * 0.6);
      return {
        key: `comp:${c.id}`,
        id: c.id,
        name: c.def.name,
        hp: c.st.hp,
        maxHp: c.def.hp,
        equipment: { ...c.def.equipment },
        skills,
        attrs: { str: a, agi: a, int: 6, cha: 6 },
        level: c.def.level,
      };
    });
}

// Companions as abstract heroes for auto-resolve.
export function companionHeroes(world) {
  return hiredCompanions(world.state)
    .filter((c) => c.st.hp > 5)
    .map((c) => ({ key: `comp:${c.id}`, hp: c.st.hp, power: 12 + c.def.level * 2, armor: 20 }));
}

function applyCompanionResult(world, result) {
  const st = world.state;
  if (result.companionHp) {
    for (const [id, hp] of Object.entries(result.companionHp)) if (st.companions[id]) st.companions[id].hp = Math.max(1, Math.round(hp));
  }
  if (result.heroesDown) {
    for (const key of result.heroesDown) {
      const id = String(key).startsWith('comp:') ? key.slice(5) : null;
      if (id && st.companions[id]) st.companions[id].hp = 1;
    }
  }
}

function unitsOf(parties) {
  const units = [];
  for (const p of parties) {
    for (const s of p.troops) {
      const n = s.count - s.wounded;
      if (n > 0) units.push({ key: p.id, troopId: s.id, count: n });
    }
  }
  return units;
}

// Colour of the player's side: blue unless the enemy wears blue too.
export function allyColor(enemyFaction) {
  return enemyFaction === 'nordheim' ? '#7d3c98' : '#3f6fb5';
}

export function battleTerrain(world, x, y) {
  return BIOME_BATTLE[world.nav.biomeAt(x, y)] || 'plains';
}

// ---------------------------------------------------------------------------
// Field battle between the player's side and a set of enemy parties
// ---------------------------------------------------------------------------

export function startFieldBattle(game, { enemies, allies = [], mapBattle = null }) {
  const world = game.world;
  const st = world.state;
  const pp = st.party;
  for (const p of [...enemies, ...allies]) p.held = true;
  if (mapBattle) mapBattle.playerJoined = true;
  const enemyNames = enemies.map((p) => p.name).join(', ');
  const config = {
    kind: 'field',
    terrain: battleTerrain(world, pp.x, pp.y),
    hour: st.time % 24,
    sides: [
      { name: 'Ваші сили', units: [...unitsOf([pp]), ...unitsOf(allies)], hero: playerHero(world), companions: companionSpecs(world), playerKey: 'player' },
      { name: enemyNames, units: unitsOf(enemies), hero: null },
    ],
    factionColors: [allyColor(enemies[0]?.faction), factionInfo(enemies[0]?.faction).color],
    enemyFaction: enemies[0]?.faction,
    allyFaction: allies[0]?.faction,
  };
  game.startBattle(config, (result) => {
    for (const p of [...enemies, ...allies]) p.held = false;
    const summary = applyFieldResult(game, { enemies, allies, mapBattle }, result);
    game.ui.showBattleResult(summary);
  });
}

// "Send troops": fight without the player.
export function autoFieldBattle(game, { enemies, allies = [], mapBattle = null }) {
  const world = game.world;
  const pp = world.state.party;
  const tactics = partySkill(world.state, 'tactics');
  const res = autoResolve([
    {
      stacks: [...unitsOf([pp]), ...unitsOf(allies)].map((u) => ({ key: u.key, troopId: u.troopId, count: u.count })),
      heroes: companionHeroes(world),
      bonus: 1 + tactics * 0.04,
      woundChance: 0.25 + partySkill(world.state, 'surgery') * 0.05,
    },
    { stacks: unitsOf(enemies).map((u) => ({ key: u.key, troopId: u.troopId, count: u.count })), heroes: [], bonus: 1, woundChance: 0.3 },
  ]);
  const result = {
    outcome: res.winner === 0 ? 'victory' : 'defeat',
    losses: res.losses,
    playerDown: false,
    playerKills: [],
    auto: true,
    heroesDown: [...res.heroesDown],
  };
  // on an automatic defeat the player escapes with whatever is left
  if (res.winner === 1) result.outcome = 'autoDefeat';
  const summary = applyFieldResult(game, { enemies, allies, mapBattle }, result);
  game.ui.showBattleResult(summary);
}

function lossTotals(loss) {
  let killed = 0;
  let wounded = 0;
  if (!loss) return { killed, wounded };
  for (const n of Object.values(loss.killed)) killed += n;
  for (const n of Object.values(loss.wounded)) wounded += n;
  return { killed, wounded };
}

function mergeLoss(into, loss) {
  if (!loss) return;
  for (const k of ['killed', 'wounded']) {
    for (const [id, n] of Object.entries(loss[k])) into[k][id] = (into[k][id] || 0) + n;
  }
}

export function applyFieldResult(game, ctx, result) {
  const world = game.world;
  const st = world.state;
  const pl = st.player;
  const pp = st.party;
  const { enemies, allies, mapBattle } = ctx;
  const summary = {
    outcome: result.outcome,
    playerLoss: { killed: {}, wounded: {} },
    enemyLoss: { killed: {}, wounded: {} },
    allyLoss: { killed: {}, wounded: {} },
    gold: 0,
    items: [],
    prisoners: {},
    xp: 0,
    renown: 0,
    kills: result.playerKills?.length || 0,
    notes: [],
  };
  st.stats.battles++;

  // casualties
  applyLosses(pp.troops, result.losses[0].get('player'));
  mergeLoss(summary.playerLoss, result.losses[0].get('player'));
  for (const a of allies) {
    const l = result.losses[0].get(a.id);
    applyLosses(a.troops, l);
    mergeLoss(summary.allyLoss, l);
  }
  for (const e of enemies) {
    const l = result.losses[1].get(e.id);
    applyLosses(e.troops, l);
    mergeLoss(summary.enemyLoss, l);
  }
  if (result.playerHp != null) pl.hp = clamp(result.playerHp, 1, playerMaxHp(pl));
  applyCompanionResult(world, result);

  const enemyDown = lossTotals(summary.enemyLoss);
  let tierSum = 0;
  for (const k of ['killed', 'wounded']) for (const [id, n] of Object.entries(summary.enemyLoss[k])) tierSum += TROOPS[id].tier * n;

  if (result.outcome === 'victory') {
    st.stats.won++;
    pl.battlesWon++;
    // loot
    const looting = partySkill(st, 'looting');
    for (const e of enemies) {
      summary.gold += Math.round((e.gold || 0) * (0.5 + looting * 0.08));
      if (e.goods) for (const g of e.goods) summary.items.push([g.id, g.qty]);
    }
    const itemChance = 0.07 * (1 + looting * 0.15);
    const lootCounts = {};
    for (const k of ['killed', 'wounded']) {
      for (const [id, n] of Object.entries(summary.enemyLoss[k])) {
        const t = TROOPS[id];
        for (let i = 0; i < n; i++) {
          if (!rng.chance(itemChance)) continue;
          const slots = Object.values(t.eq).flat().filter(Boolean);
          const it = rng.pick(slots);
          if (it && !ITEMS[it].training) lootCounts[it] = (lootCounts[it] || 0) + 1;
        }
      }
    }
    for (const [id, n] of Object.entries(lootCounts)) summary.items.push([id, n]);
    // prisoners: enemy wounded (taken out of the defeated parties)
    const limit = world.prisonerLimit();
    let have = totalCount(pp.prisoners);
    for (const e of enemies) {
      for (const stck of [...e.troops]) {
        const take = Math.min(stck.wounded, Math.max(0, limit - have));
        if (take <= 0) continue;
        const id = stck.id;
        removeTroops(e.troops, id, take, true);
        addTroops(pp.prisoners, id, take);
        summary.prisoners[id] = (summary.prisoners[id] || 0) + take;
        have += take;
      }
    }
    // freed prisoners of the enemy join as prisoners-to-rescue: they become recruits if they are ours
    for (const e of enemies) {
      for (const pr of e.prisoners || []) {
        if (TROOPS[pr.id].faction === 'bandits') continue;
        summary.notes.push(`Звільнено полонених: ${TROOPS[pr.id].name} ×${pr.count}.`);
        summary.freed = summary.freed || [];
        summary.freed.push({ id: pr.id, count: pr.count });
      }
    }
    // remove defeated parties
    for (const e of enemies) {
      const rest = healthyCount(e.troops);
      if (rest <= 0 || e.kind !== 'lord') world.removeParty(e, true);
      else {
        world.flee(e, pp);
        e.fleeUntil = st.time + 8;
        e.fledFrom = 'player';
      }
      if (e.lordId) summary.notes.push(`${world.lById.get(e.lordId).name} втік з поля бою.`);
    }
    summary.xp = tierSum * (result.auto ? 4 : 9) + summary.kills * 25;
    summary.renown = Math.round(tierSum / (enemies.every((e) => e.kind === 'bandit') ? 6 : 3));
    pp.moraleBoost += 8;
    // relations
    for (const e of enemies) {
      if (FACTIONS[e.faction]) {
        if (st.contract && world.atWar(st.contract.faction, e.faction)) world.changeRelation(st.contract.faction, 1);
      }
    }
    for (const a of allies) if (FACTIONS[a.faction]) world.changeRelation(a.faction, 3);
    if (enemies.some((e) => e.kind === 'bandit')) {
      // local gratitude: nearest town's faction
      const town = nearestSettlement(world, pp.x, pp.y);
      if (town && FACTIONS[town.faction] && rng.chance(0.5)) world.changeRelation(town.faction, 1);
    }
  } else if (result.outcome === 'retreat') {
    pp.graceUntil = st.time + 3;
    nudgeAway(world, pp, enemies[0]);
    summary.xp = Math.round(tierSum * 4 + summary.kills * 25);
    pp.moraleBoost -= 6;
    for (const a of allies) {
      if (healthyCount(a.troops) <= 0) world.removeParty(a);
    }
    for (const e of enemies) if (healthyCount(e.troops) <= 0) world.removeParty(e, true);
  } else if (result.outcome === 'autoDefeat') {
    pp.graceUntil = st.time + 4;
    nudgeAway(world, pp, enemies[0]);
    pp.moraleBoost -= 12;
    summary.notes.push('Ваші воїни зазнали поразки, але вам вдалося відступити.');
    for (const a of allies) if (healthyCount(a.troops) <= 0) world.removeParty(a);
  } else {
    // defeat: captured
    const lostGold = Math.round(pl.gold * rng.range(0.2, 0.4));
    pl.gold -= lostGold;
    const lostTroops = totalCount(pp.troops);
    const winner = enemies[0];
    if (winner) for (const s of pp.troops) addTroops(winner.prisoners, s.id, Math.ceil(s.count * 0.4));
    pp.troops = [];
    // lose some trade goods
    for (const e of [...pl.inventory]) {
      if (ITEMS[e.id].type === 'good' && rng.chance(0.6)) pl.inventory.splice(pl.inventory.indexOf(e), 1);
    }
    for (const e of enemies) if (healthyCount(e.troops) <= 0) world.removeParty(e, true);
    const days = rng.int(1, 3);
    world.skipTime(days * 24);
    const town = world.respawnPlayerAfterDefeat();
    pl.hp = Math.max(pl.hp, playerMaxHp(pl) * 0.3);
    pp.moraleBoost = 0;
    summary.notes.push(`Вас узяли в полон. Втрачено ${lostGold} золота${lostTroops ? ` і весь загін (${lostTroops})` : ''}.`);
    summary.notes.push(`Через ${days} ${days === 1 ? 'день' : 'дні'} вам вдалося втекти. Ви дісталися до ${town.name}.`);
  }

  // experience
  if (summary.xp) {
    world.addPlayerXp(summary.xp);
    const alive = pp.troops.filter((s) => s.count - s.wounded > 0);
    const pool = tierSum * (result.outcome === 'victory' ? 14 : 5);
    const n = alive.reduce((a, s) => a + s.count, 0);
    for (const s of alive) addStackXp(s, (pool * s.count) / Math.max(1, n) * 1.0);
  }
  pl.renown += summary.renown;
  pl.gold += summary.gold;
  for (const [id, n] of summary.items) {
    const room = CARRY_CAPACITY - invLoad(pl.inventory);
    const take = Math.min(room, n);
    if (take > 0) invAdd(pl.inventory, id, take);
    if (take < n) summary.notes.push(`Не вистачило місця для частини здобичі (${ITEMS[id].name}).`);
  }
  pl.kills += summary.kills;
  st.stats.killed += enemyDown.killed + enemyDown.wounded;

  if (mapBattle) {
    mapBattle.playerJoined = false;
    // any remaining parties just go back to the map
    world.endBattle(mapBattle);
  }
  return summary;
}

function nearestSettlement(world, x, y) {
  let best = null;
  let bd = Infinity;
  for (const s of world.state.settlements) {
    const d = dist(s.x, s.y, x, y);
    if (d < bd) {
      bd = d;
      best = s;
    }
  }
  return best;
}

function nudgeAway(world, pp, from) {
  if (!from) return;
  const dx = pp.x - from.x;
  const dy = pp.y - from.y;
  const d = Math.hypot(dx, dy) || 1;
  for (const k of [30, 20, 10]) {
    const x = pp.x + (dx / d) * k;
    const y = pp.y + (dy / d) * k;
    if (world.nav.speedAt(x, y) > 0) {
      pp.x = x;
      pp.y = y;
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// Sieges
// ---------------------------------------------------------------------------

export function startPlayerSiege(world, s) {
  if (s.siege && !s.siege.player) return false;
  s.siege = { faction: world.playerSide(), parties: [], start: world.state.time, player: true };
  world.message(`Ви взяли в облогу ${s.name}.`, 'war');
  return true;
}

export function siegeDefenders(world, s) {
  return world.state.parties.filter((p) => p.inside === s.id && !world.isHostile(p.faction, s.faction));
}

export function startSiegeAssault(game, s) {
  const world = game.world;
  const st = world.state;
  const defenders = siegeDefenders(world, s);
  const garrisonUnits = s.garrison.filter((g) => g.count - g.wounded > 0).map((g) => ({ key: 'garrison', troopId: g.id, count: g.count - g.wounded }));
  const config = {
    kind: 'siege',
    terrain: battleTerrain(world, s.x, s.y),
    hour: st.time % 24,
    sides: [
      { name: 'Ваші сили', units: unitsOf([st.party]), hero: playerHero(world), companions: companionSpecs(world), playerKey: 'player' },
      { name: `Гарнізон ${s.name}`, units: [...garrisonUnits, ...unitsOf(defenders)], hero: null },
    ],
    factionColors: [allyColor(s.faction), factionInfo(s.faction).color],
    enemyFaction: s.faction,
    fortName: s.name,
  };
  for (const d of defenders) d.held = true;
  game.startBattle(config, (result) => {
    for (const d of defenders) d.held = false;
    const summary = applySiegeResult(game, s, defenders, result);
    game.ui.showBattleResult(summary);
  });
}

export function applySiegeResult(game, s, defenders, result) {
  const world = game.world;
  const st = world.state;
  const garrisonParty = { id: 'garrison', x: s.x, y: s.y, troops: s.garrison, gold: s.kind === 'town' ? 900 : 400, kind: 'garrison', faction: s.faction, prisoners: [] };
  const fakeEnemies = [garrisonParty, ...defenders];
  // reuse the field result logic without removing the garrison "party"
  const origRemove = world.removeParty.bind(world);
  world.removeParty = (p, by) => {
    if (p === garrisonParty) return;
    origRemove(p, by);
  };
  const origFlee = world.flee.bind(world);
  world.flee = (p, from) => {
    if (p === garrisonParty) return;
    origFlee(p, from);
  };
  let summary;
  try {
    summary = applyFieldResult(game, { enemies: fakeEnemies, allies: [], mapBattle: null }, result);
  } finally {
    world.removeParty = origRemove;
    world.flee = origFlee;
  }
  if (result.outcome === 'victory') {
    const oldFaction = s.faction;
    for (const d of defenders) if (world.pById.has(d.id)) world.removeParty(d, true);
    s.garrison = [];
    s.siege = null;
    const c = st.contract;
    if (c && !c.vassal) {
      const lords = st.lords.filter((l) => l.faction === c.faction);
      const lord = rng.pick(lords);
      world.captureSettlement(s, c.faction, lord ? lord.id : null);
      const reward = s.kind === 'town' ? 1500 : 700;
      st.player.gold += reward;
      summary.notes.push(`${s.name} переходить до ${FACTIONS[c.faction].name}. Нагорода за штурм: ${reward} золота.`);
      world.changeRelation(c.faction, 6);
    } else if (c && c.vassal) {
      world.captureSettlement(s, c.faction, 'player');
      summary.notes.push(`${FACTIONS[c.faction].king} дарує вам ${s.name} як лен!`);
      world.changeRelation(c.faction, 8);
    } else {
      world.captureSettlement(s, 'player', 'player');
      summary.notes.push(`${s.name} тепер належить вам! Залиште гарнізон, щоб утримати володіння.`);
      if (FACTIONS[oldFaction]) {
        st.wars[warKey('player', oldFaction)] = true;
        st.warSince[warKey('player', oldFaction)] = world.day;
      }
    }
    st.player.renown += s.kind === 'town' ? 40 : 25;
    world.message(`Ви захопили ${s.name}!`, 'good');
  } else {
    s.siege = null;
  }
  return summary;
}

// ---------------------------------------------------------------------------
// Arena
// ---------------------------------------------------------------------------

export function startArena(game, s) {
  const world = game.world;
  const config = {
    kind: 'arena',
    terrain: 'arena',
    hour: 13,
    sides: [{ name: 'Ви', units: [], hero: playerHero(world), playerKey: 'player' }, { name: 'Бійці арени', units: [], hero: null }],
    arenaFighters: 7,
    factionColors: [allyColor(s.faction), factionInfo(s.faction).color],
  };
  game.startBattle(config, (result) => {
    const pl = world.state.player;
    const kd = result.playerKills?.length || 0;
    const won = result.outcome === 'victory';
    const gold = kd * 15 + (won ? 150 : 0);
    const xp = kd * 30 + (won ? 150 : 20);
    pl.gold += gold;
    world.addPlayerXp(xp);
    pl.renown += won ? 3 : 0;
    const notes = [won ? 'Ви — останній, хто стоїть на ногах! Натовп шаленіє.' : 'Вас збили з ніг. Глядачі свистять, але це лише тренування.'];
    game.ui.showBattleResult({
      outcome: won ? 'arenaWin' : 'arenaLoss',
      playerLoss: { killed: {}, wounded: {} },
      enemyLoss: { killed: {}, wounded: {} },
      allyLoss: { killed: {}, wounded: {} },
      gold,
      items: [],
      prisoners: {},
      xp,
      renown: won ? 3 : 0,
      kills: kd,
      notes,
    });
  });
}

// Try to escape from an enemy that caught the player: sacrifice some troops.
export function attemptRetreat(world, enemy) {
  const pp = world.state.party;
  const n = totalCount(pp.troops);
  const lost = [];
  if (n > 0) {
    const toLose = Math.max(1, Math.round(n * rng.range(0.1, 0.2)));
    const sorted = [...pp.troops].sort((a, b) => TROOPS[a.id].tier - TROOPS[b.id].tier);
    let left = toLose;
    for (const s of sorted) {
      if (left <= 0) break;
      const k = Math.min(left, s.count);
      removeTroops(pp.troops, s.id, k, true);
      lost.push([s.id, k]);
      left -= k;
    }
  }
  pp.graceUntil = world.state.time + 4;
  nudgeAway(world, pp, enemy);
  return lost;
}

export function playerPartyReady(world) {
  return healthyCount(world.state.party.troops) > 0;
}

export { woundedCount };
