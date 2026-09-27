// Strategic world simulation: settlements, lords, bandits, caravans,
// diplomacy, sieges and the player's party.
import { Rng, rng } from '../core/rng.js';
import { clamp, dist, dist2, plural } from '../core/util.js';
import { FACTIONS, FACTION_IDS, factionInfo } from '../data/factions.js';
import { TROOPS, RECRUITS, FACTION_TREES, MERCENARY_POOL, randomFactionTroop } from '../data/troops.js';
import { ITEMS, GOOD_IDS, FOOD_IDS } from '../data/items.js';
import { BACKGROUNDS, BASE_ATTRS, SKILLS, xpForNextLevel, playerMaxHp, partyLimit, prisonerLimit } from '../data/character.js';
import { TerrainGen, NavGrid, WORLD_W, WORLD_H, BIOME, CELL } from './terrain.js';
import { Pathfinder } from './pathfind.js';
import { autoResolve } from './autoresolve.js';
import {
  addTroops, removeTroops, totalCount, healthyCount, woundedCount, mountedFraction, applyLosses,
  stacksStrength, stacksWages, addStackXp, upgradableCount,
} from './party.js';
import {
  invAdd, invCount, invRemove, consumeFood, foodMorale, foodServings, setupMarket, driftMarket, refreshShop,
} from './economy.js';
import { generateQuests, checkQuestDeadlines, onPartyDestroyed } from './quests.js';

export const BASE_SPEED = 34;
export const VISION = 170;
export const ENCOUNTER_R = 10;
export const SIEGE_HOURS = 18;

export const warKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

// ---------------------------------------------------------------------------
// New game creation
// ---------------------------------------------------------------------------

function findSpot(nav, x, y, minSpeed = 0.9) {
  const c0 = nav.cellAt(x, y);
  const cx0 = c0 % nav.w;
  const cy0 = (c0 / nav.w) | 0;
  for (let r = 0; r < 120; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const nx = cx0 + dx;
        const ny = cy0 + dy;
        if (nx < 2 || ny < 2 || nx >= nav.w - 2 || ny >= nav.h - 2) continue;
        const c = ny * nav.w + nx;
        if (nav.region[c] !== nav.mainRegion) continue;
        if (nav.speed[c] < minSpeed || nav.biome[c] === BIOME.BEACH) continue;
        return [(nx + 0.5) * CELL, (ny + 0.5) * CELL];
      }
    }
  }
  return nav.nearestMainland(x, y);
}

function genTroops(r, faction, count, maxTier = 5) {
  const stacks = [];
  for (let i = 0; i < count; i++) addTroops(stacks, randomFactionTroop(r, faction, maxTier), 1);
  return stacks;
}

function placeSettlements(state, nav, r) {
  const list = [];
  const anchors = {};
  const good = (x, y, minSpeed = 0.7) => {
    const c = nav.cellAt(x, y);
    return nav.region[c] === nav.mainRegion && nav.speed[c] >= minSpeed && nav.biome[c] !== BIOME.BEACH;
  };
  const tooClose = (x, y, d) => list.some((s) => dist2(s.x, s.y, x, y) < d * d);
  // spread anchors a bit so capitals do not collapse onto each other
  for (const f of FACTION_IDS) {
    const [ax, ay] = FACTIONS[f].anchor;
    anchors[f] = findSpot(nav, ax * WORLD_W, ay * WORLD_H);
  }
  const nearestFaction = (x, y) => {
    let best = null;
    let bd = Infinity;
    for (const f of FACTION_IDS) {
      const d = dist2(anchors[f][0], anchors[f][1], x, y);
      if (d < bd) {
        bd = d;
        best = f;
      }
    }
    return best;
  };
  const cands = [];
  for (let i = 0; i < 9000; i++) {
    const x = r.range(80, WORLD_W - 80);
    const y = r.range(80, WORLD_H - 80);
    if (good(x, y)) cands.push({ x, y, f: nearestFaction(x, y) });
  }
  let sid = 0;
  const add = (f, kind, name, x, y) => {
    const s = {
      id: `s${sid++}`, name, kind, faction: f, culture: f, owner: null, x, y, boundTo: null,
      garrison: [], prosperity: r.int(40, 70), siege: null, volunteers: r.int(2, 6), shop: [],
      tavern: null, visited: false,
    };
    setupMarket(r, s);
    list.push(s);
    return s;
  };

  for (const f of FACTION_IDS) {
    add(f, 'town', FACTIONS[f].towns[0], anchors[f][0], anchors[f][1]).capital = true;
  }
  for (const f of FACTION_IDS) {
    const ax = anchors[f][0];
    const ay = anchors[f][1];
    const kinds = [['town', FACTIONS[f].towns[1]], ['castle', FACTIONS[f].castles[0]], ['town', FACTIONS[f].towns[2]], ['castle', FACTIONS[f].castles[1]]];
    for (const [kind, name] of kinds) {
      let placed = false;
      for (let relax = 0; relax < 4 && !placed; relax++) {
        const minD = 200 - relax * 35;
        const pool = r.shuffle(cands.filter((c) => c.f === f));
        for (const c of pool) {
          const d = dist(c.x, c.y, ax, ay);
          if (d < 180 - relax * 30 || d > 720 + relax * 150) continue;
          if (tooClose(c.x, c.y, minD)) continue;
          add(f, kind, name, c.x, c.y);
          placed = true;
          break;
        }
      }
      if (!placed) {
        const [x, y] = findSpot(nav, ax + r.range(-250, 250), ay + r.range(-250, 250));
        add(f, kind, name, x, y);
      }
    }
  }
  // villages around fiefs
  for (const f of FACTION_IDS) {
    const fiefs = list.filter((s) => s.faction === f && s.kind !== 'village');
    const names = FACTIONS[f].villages;
    for (let i = 0; i < names.length; i++) {
      const fief = fiefs[i % fiefs.length];
      let placed = false;
      for (let tries = 0; tries < 400 && !placed; tries++) {
        const a = r.range(0, Math.PI * 2);
        const d = r.range(70, 210 + tries * 0.4);
        const x = fief.x + Math.cos(a) * d;
        const y = fief.y + Math.sin(a) * d;
        if (x < 60 || y < 60 || x > WORLD_W - 60 || y > WORLD_H - 60) continue;
        if (!good(x, y, 0.6)) continue;
        if (tooClose(x, y, tries > 250 ? 60 : 85)) continue;
        add(f, 'village', names[i], x, y).boundTo = fief.id;
        placed = true;
      }
      if (!placed) {
        const [x, y] = findSpot(nav, fief.x + 90, fief.y + 60, 0.6);
        add(f, 'village', names[i], x, y).boundTo = fief.id;
      }
    }
  }
  state.settlements = list;
}

function makePlayer(name, bgId) {
  const bg = BACKGROUNDS[bgId];
  const attrs = { ...BASE_ATTRS };
  for (const [k, v] of Object.entries(bg.attrs)) attrs[k] += v;
  const skills = {};
  for (const k of Object.keys(SKILLS)) skills[k] = 0;
  for (const [k, v] of Object.entries(bg.skills)) skills[k] = v;
  const p = {
    name: name || 'Мандрівник',
    background: bgId,
    level: 1,
    xp: 0,
    attrs,
    skills,
    attrPoints: 0,
    skillPoints: 1,
    gold: bg.gold,
    renown: 0,
    equipment: { ...bg.equipment },
    inventory: [],
    kills: 0,
    battlesWon: 0,
  };
  p.hp = playerMaxHp(p);
  for (const [id, q] of bg.inventory) invAdd(p.inventory, id, q);
  return p;
}

export function createNewState({ seed = (Math.random() * 1e9) | 0, name, background = 'knight' } = {}) {
  const r = new Rng(seed);
  const gen = new TerrainGen(seed);
  const nav = new NavGrid(gen);
  const state = {
    version: 1,
    seed,
    time: 8,
    nextId: 1,
    player: makePlayer(name, background),
    party: { id: 'player', kind: 'player', faction: 'player', x: 0, y: 0, troops: [], prisoners: [], moraleBoost: 10, path: null, target: null, graceUntil: 0 },
    factions: {},
    wars: {},
    warSince: {},
    settlements: [],
    lords: [],
    parties: [],
    battles: [],
    quests: [],
    contract: null,
    log: [],
    stats: { battles: 0, won: 0, killed: 0 },
  };
  for (const f of FACTION_IDS) state.factions[f] = { id: f, relation: 0 };
  placeSettlements(state, nav, r);

  // Lords and fiefs
  let lid = 0;
  for (const f of FACTION_IDS) {
    const info = FACTIONS[f];
    const fiefs = state.settlements.filter((s) => s.faction === f && s.kind !== 'village');
    const capital = fiefs.find((s) => s.capital);
    const lordNames = [info.king, ...info.lords];
    lordNames.forEach((ln, i) => {
      const lord = { id: `l${lid++}`, name: ln, faction: f, king: i === 0, partyId: null, respawnAt: 0, homeId: capital.id, relation: 0 };
      state.lords.push(lord);
    });
    const lords = state.lords.filter((l) => l.faction === f);
    capital.owner = lords[0].id;
    const others = fiefs.filter((s) => s !== capital);
    others.forEach((s, i) => {
      const lord = lords[1 + (i % (lords.length - 1))];
      s.owner = lord.id;
      lord.homeId = s.id;
    });
  }
  for (const s of state.settlements) {
    if (s.kind === 'village') s.owner = state.settlements.find((x) => x.id === s.boundTo).owner;
    else {
      s.garrison = genTroops(r, s.faction, s.kind === 'town' ? r.int(45, 65) : r.int(25, 40), 4);
      refreshShop(r, s);
    }
  }

  // Initial wars: two random pairs
  const pairs = [];
  for (let i = 0; i < FACTION_IDS.length; i++) for (let j = i + 1; j < FACTION_IDS.length; j++) pairs.push([FACTION_IDS[i], FACTION_IDS[j]]);
  r.shuffle(pairs);
  for (const [a, b] of pairs.slice(0, 2)) {
    state.wars[warKey(a, b)] = true;
    state.warSince[warKey(a, b)] = 0;
  }

  // player start: a random town of a random faction
  const towns = state.settlements.filter((s) => s.kind === 'town');
  const start = r.pick(towns);
  state.party.x = start.x + 26;
  state.party.y = start.y - 4;
  state.startTown = start.id;
  for (const [id, n] of BACKGROUNDS[background].troops) addTroops(state.party.troops, id, n);
  return state;
}

// ---------------------------------------------------------------------------
// Runtime world
// ---------------------------------------------------------------------------

export class World {
  constructor(state) {
    this.state = state;
    this.gen = new TerrainGen(state.seed);
    this.nav = new NavGrid(this.gen);
    this.pf = new Pathfinder(this.nav);
    this.listeners = {};
    this.roads = [];
    this.index();
    this.buildRoads();
    if (!state.initialized) this.populate();
  }

  index() {
    const st = this.state;
    this.sById = new Map(st.settlements.map((s) => [s.id, s]));
    this.lById = new Map(st.lords.map((l) => [l.id, l]));
    this.pById = new Map(st.parties.map((p) => [p.id, p]));
  }

  on(evt, fn) {
    (this.listeners[evt] ||= []).push(fn);
  }

  emit(evt, data) {
    for (const fn of this.listeners[evt] || []) fn(data);
  }

  newId(prefix) {
    return `${prefix}${this.state.nextId++}`;
  }

  message(text, kind = 'info') {
    const st = this.state;
    st.log.push({ t: st.time, text, kind });
    if (st.log.length > 200) st.log.splice(0, st.log.length - 200);
    this.emit('message', { text, kind });
  }

  buildRoads() {
    const st = this.state;
    const fiefs = st.settlements.filter((s) => s.kind !== 'village');
    const done = new Set();
    const link = (a, b) => {
      const k = a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
      if (done.has(k)) return;
      done.add(k);
      const pts = this.pf.markRoad(a.x, a.y, b.x, b.y);
      if (pts) this.roads.push(pts);
    };
    for (const s of fiefs) {
      const near = fiefs
        .filter((o) => o !== s)
        .sort((a, b) => dist2(a.x, a.y, s.x, s.y) - dist2(b.x, b.y, s.x, s.y))
        .slice(0, 2);
      for (const o of near) if (dist(o.x, o.y, s.x, s.y) < 900) link(s, o);
    }
    for (const v of st.settlements.filter((s) => s.kind === 'village')) link(v, this.sById.get(v.boundTo));
  }

  // Spawn the initial moving parties.
  populate() {
    const st = this.state;
    st.initialized = true;
    for (const lord of st.lords) this.spawnLordParty(lord, lord.king ? rng.int(80, 110) : rng.int(35, 70));
    for (let i = 0; i < 13; i++) this.spawnBandits();
    for (const f of FACTION_IDS) for (let i = 0; i < 2; i++) this.spawnCaravan(f);
    generateQuests(this);
  }

  // ---- queries -------------------------------------------------------------

  get time() {
    return this.state.time;
  }

  get day() {
    return Math.floor(this.state.time / 24) + 1;
  }

  isNight() {
    const h = this.state.time % 24;
    return h < 5 || h >= 21;
  }

  atWar(a, b) {
    return !!this.state.wars[warKey(a, b)];
  }

  // Faction id the player's party fights for.
  playerSide() {
    return this.state.contract ? this.state.contract.faction : 'player';
  }

  isHostile(fa, fb) {
    if (fa === fb) return false;
    if (fa === 'bandits' || fb === 'bandits') return true;
    const st = this.state;
    if (fa === 'player' || fb === 'player') {
      const other = fa === 'player' ? fb : fa;
      if (st.contract) {
        if (other === st.contract.faction) return false;
        if (this.atWar(st.contract.faction, other)) return true;
      }
      return st.factions[other].relation <= -10 || !!st.wars[warKey('player', other)];
    }
    if (st.contract && (fa === st.contract.faction || fb === st.contract.faction)) {
      // parties of the player's employer vs player-owned faction are friends
      const other = fa === st.contract.faction ? fb : fa;
      if (other === 'player') return false;
    }
    return this.atWar(fa, fb);
  }

  partyFaction(p) {
    return p.id === 'player' ? 'player' : p.faction;
  }

  heroPower() {
    const p = this.state.player;
    const eq = p.equipment;
    let wd = 0;
    for (const k of ['w1', 'w2', 'w3']) {
      const it = ITEMS[eq[k]];
      if (!it) continue;
      wd = Math.max(wd, it.slot === 'ranged' ? it.dmg : Math.max(it.swing ? it.swing[0] : 0, it.thrust ? it.thrust[0] : 0));
    }
    const armor = (ITEMS[eq.armor]?.armor || 0) + (ITEMS[eq.helmet]?.armor || 0) * 0.4;
    return 10 + p.level * 1.5 + wd * 0.6 + armor * 0.25 + (eq.horse ? 6 : 0);
  }

  strength(p) {
    if (p.id === 'player') return stacksStrength(p.troops) + this.heroPower() * (this.state.player.hp > 15 ? 1 : 0.3);
    return stacksStrength(p.troops) + (p.lordId ? 25 : 0);
  }

  garrisonStrength(s) {
    let str = stacksStrength(s.garrison);
    // lords resting inside help defend
    for (const p of this.state.parties) if (p.inside === s.id && !this.isHostile(p.faction, s.faction)) str += this.strength(p);
    return str;
  }

  partySpeed(p) {
    const st = this.state;
    const isPlayer = p.id === 'player';
    const total = totalCount(p.troops) + (isPlayer ? 1 : 0);
    let mf = mountedFraction(p.troops);
    if (isPlayer) {
      const t = totalCount(p.troops);
      mf = (mf * t + (st.player.equipment.horse ? 1 : 0)) / (t + 1);
    }
    const wf = total ? woundedCount(p.troops) / total : 0;
    let s = BASE_SPEED * (1 - Math.min(0.35, total / 260)) * (1 + 0.32 * mf) * (1 - 0.3 * wf);
    if (isPlayer) s *= 1 + st.player.skills.pathfinding * 0.03;
    if (p.kind === 'caravan') s *= 0.82;
    if (p.kind === 'bandit') s *= 1.02;
    if (p.ai?.mode === 'flee') s *= 1.05;
    if (this.isNight()) s *= 0.85;
    return s;
  }

  // ---- spawning --------------------------------------------------------------

  addParty(p) {
    this.state.parties.push(p);
    this.pById.set(p.id, p);
    return p;
  }

  removeParty(p, byPlayer = false) {
    const st = this.state;
    const i = st.parties.indexOf(p);
    if (i >= 0) st.parties.splice(i, 1);
    this.pById.delete(p.id);
    if (p.lordId) {
      const lord = this.lById.get(p.lordId);
      if (lord) {
        lord.partyId = null;
        lord.respawnAt = st.time + rng.range(48, 110);
      }
    }
    for (const s of st.settlements) {
      if (s.siege) {
        s.siege.parties = s.siege.parties.filter((id) => id !== p.id);
      }
    }
    onPartyDestroyed(this, p, byPlayer);
  }

  spawnLordParty(lord, size) {
    const st = this.state;
    const home = this.sById.get(lord.homeId);
    let base = home && home.faction === lord.faction ? home : st.settlements.find((s) => s.faction === lord.faction && s.kind !== 'village');
    if (!base) return null; // faction has no settlements left
    lord.homeId = base.id;
    const p = this.addParty({
      id: this.newId('p'),
      kind: 'lord',
      faction: lord.faction,
      name: `Загін: ${lord.name}`,
      lordId: lord.id,
      x: base.x + rng.range(-8, 8),
      y: base.y + rng.range(-8, 8),
      troops: genTroops(rng, lord.faction, size),
      prisoners: [],
      gold: rng.int(300, 1200),
      ai: { mode: 'rest', thinkAt: st.time + rng.range(0, 6), until: st.time + rng.range(2, 12), path: null, pi: 0 },
      inside: base.id,
    });
    lord.partyId = p.id;
    return p;
  }

  spawnBandits(near) {
    const st = this.state;
    let x;
    let y;
    let ok = false;
    for (let t = 0; t < 200 && !ok; t++) {
      if (near) {
        x = near.x + rng.range(-220, 220);
        y = near.y + rng.range(-220, 220);
      } else {
        x = rng.range(100, WORLD_W - 100);
        y = rng.range(100, WORLD_H - 100);
      }
      if (!this.nav.isMainland(x, y) || this.nav.speedAt(x, y) <= 0) continue;
      const minD = near ? 70 : 170;
      if (st.settlements.some((s) => dist2(s.x, s.y, x, y) < minD * minD)) continue;
      if (dist2(st.party.x, st.party.y, x, y) < 200 * 200) continue;
      ok = true;
    }
    if (!ok) return null;
    const biome = this.nav.biomeAt(x, y);
    let kind;
    let name;
    if (biome === BIOME.STEPPE || biome === BIOME.DESERT) [kind, name] = ['steppe_bandit', 'Степові грабіжники'];
    else if (biome === BIOME.FOREST || biome === BIOME.TAIGA) [kind, name] = ['forest_bandit', 'Лісові розбійники'];
    else if (biome === BIOME.MOUNTAIN || biome === BIOME.SNOW) [kind, name] = ['mountain_bandit', 'Гірські розбійники'];
    else if (rng.chance(0.25)) [kind, name] = ['sea_raider', 'Морські рейдери'];
    else if (rng.chance(0.2)) [kind, name] = ['deserter', 'Дезертири'];
    else [kind, name] = ['looter', 'Мародери'];
    const troops = [];
    const n = kind === 'looter' ? rng.int(6, 22) : rng.int(5, 18);
    addTroops(troops, kind, n);
    if (kind !== 'looter' && rng.chance(0.5)) addTroops(troops, 'looter', rng.int(2, 8));
    return this.addParty({
      id: this.newId('p'),
      kind: 'bandit',
      faction: 'bandits',
      name,
      x,
      y,
      troops,
      prisoners: [],
      gold: rng.int(40, 220),
      ai: { mode: 'roam', thinkAt: st.time, path: null, pi: 0, homeX: x, homeY: y },
      inside: null,
    });
  }

  spawnCaravan(faction) {
    const st = this.state;
    const towns = st.settlements.filter((s) => s.kind === 'town' && s.faction === faction);
    if (!towns.length) return null;
    const from = rng.pick(towns);
    const troops = [];
    addTroops(troops, 'caravan_guard', rng.int(8, 18));
    addTroops(troops, 'watchman', rng.int(4, 10));
    const goods = [];
    for (let i = 0; i < 3; i++) goods.push({ id: rng.pick(GOOD_IDS), qty: rng.int(2, 5) });
    return this.addParty({
      id: this.newId('p'),
      kind: 'caravan',
      faction,
      name: `Караван (${FACTIONS[faction].short})`,
      x: from.x + 6,
      y: from.y + 6,
      troops,
      prisoners: [],
      gold: rng.int(300, 900),
      goods,
      ai: { mode: 'rest', thinkAt: st.time + rng.range(0, 4), until: st.time + rng.range(0, 6), path: null, pi: 0 },
      inside: from.id,
    });
  }

  // ---- movement -------------------------------------------------------------

  setPath(p, tx, ty) {
    const path = this.pf.find(p.x, p.y, tx, ty);
    if (p.id === 'player') {
      p.path = path;
      p.pi = 0;
    } else {
      p.ai.path = path;
      p.ai.pi = 0;
    }
    return !!path;
  }

  stepAlong(p, pathHolder, dtH) {
    const path = pathHolder.path;
    if (!path || pathHolder.pi >= path.length) return true;
    const terrain = Math.max(0.35, this.nav.speedAt(p.x, p.y));
    let remaining = this.partySpeed(p) * terrain * dtH;
    while (remaining > 0 && pathHolder.pi < path.length) {
      const [tx, ty] = path[pathHolder.pi];
      const dx = tx - p.x;
      const dy = ty - p.y;
      const d = Math.hypot(dx, dy);
      if (d <= remaining) {
        p.x = tx;
        p.y = ty;
        remaining -= d;
        pathHolder.pi++;
      } else {
        p.x += (dx / d) * remaining;
        p.y += (dy / d) * remaining;
        remaining = 0;
      }
    }
    return pathHolder.pi >= path.length;
  }

  // Player orders ---------------------------------------------------------------

  orderPlayerMove(x, y) {
    const pp = this.state.party;
    pp.target = { type: 'point', x, y };
    return this.setPath(pp, x, y);
  }

  orderPlayerTarget(type, id) {
    const pp = this.state.party;
    const e = type === 'settlement' ? this.sById.get(id) : type === 'battle' ? this.state.battles.find((b) => b.id === id) : this.pById.get(id);
    if (!e) return false;
    pp.target = { type, id };
    pp.repathAt = this.state.time + 0.4;
    return this.setPath(pp, e.x, e.y);
  }

  stopPlayer() {
    const pp = this.state.party;
    pp.path = null;
    pp.target = null;
  }

  playerMoving() {
    const pp = this.state.party;
    return !!(pp.path && pp.pi < pp.path.length);
  }

  // ---- main update -------------------------------------------------------------

  // Advance the world by `hours`, in small steps. Returns early when an event
  // requires the player's attention (encounter, arrival) — the caller should
  // stop advancing time until it is handled.
  advance(hours) {
    let left = hours;
    while (left > 1e-6) {
      const dt = Math.min(0.2, left);
      left -= dt;
      const ev = this.tick(dt);
      if (ev) return ev;
    }
    return null;
  }

  // Let time pass while the player is out of action (captivity, long rests):
  // world events around the player are ignored.
  skipTime(hours) {
    const st = this.state;
    this.stopPlayer();
    st.party.graceUntil = Math.max(st.party.graceUntil, st.time + hours + 2);
    let left = hours;
    while (left > 1e-6) {
      const dt = Math.min(0.25, left);
      left -= dt;
      this.tick(dt);
    }
  }

  tick(dt) {
    const st = this.state;
    const before = st.time;
    st.time += dt;
    if (Math.floor(st.time) !== Math.floor(before)) this.hourly(Math.floor(st.time));

    // parties
    for (const p of [...st.parties]) {
      if (!this.pById.has(p.id)) continue;
      if (p.battleId || p.held) continue;
      if (st.time >= p.ai.thinkAt) this.think(p);
      if (!p.inside && p.ai.path) {
        const arrived = this.stepAlong(p, p.ai, dt);
        if (arrived) this.onArrive(p);
      }
    }
    this.checkAiEncounters();
    this.updateBattles();

    // player
    const pp = st.party;
    if (pp.path) {
      if (pp.target && (pp.target.type === 'party') && st.time >= (pp.repathAt || 0)) {
        const t = this.pById.get(pp.target.id);
        if (!t) {
          this.stopPlayer();
        } else {
          pp.repathAt = st.time + 0.4;
          this.setPath(pp, t.x, t.y);
        }
      }
      if (pp.path) {
        const arrived = this.stepAlong(pp, pp, dt);
        if (arrived) {
          pp.path = null;
          const tgt = pp.target;
          if (tgt?.type === 'settlement') {
            pp.target = null;
            return { type: 'settlement', id: tgt.id };
          }
          if (tgt?.type === 'battle') {
            pp.target = null;
            return { type: 'battleSite', id: tgt.id };
          }
          if (tgt?.type === 'point') pp.target = null;
        }
      }
    }
    return this.checkPlayerEncounters();
  }

  checkPlayerEncounters() {
    const st = this.state;
    const pp = st.party;
    // reached targeted party
    if (pp.target?.type === 'party') {
      const t = this.pById.get(pp.target.id);
      if (t && !t.inside && dist2(t.x, t.y, pp.x, pp.y) < ENCOUNTER_R * ENCOUNTER_R) {
        this.stopPlayer();
        if (t.battleId) return { type: 'battleSite', id: t.battleId };
        return { type: 'encounter', id: t.id, initiator: 'player' };
      }
    }
    if (st.time < pp.graceUntil) return null;
    for (const p of st.parties) {
      if (p.inside || p.battleId || p.kind === 'caravan') continue;
      if (!this.isHostile(p.faction, 'player')) continue;
      if (p.ai.mode === 'flee') continue;
      if (dist2(p.x, p.y, pp.x, pp.y) < ENCOUNTER_R * ENCOUNTER_R * 0.8) {
        if (this.strength(p) < this.strength(pp) * 0.6 && p.ai.mode !== 'hunt') continue;
        this.stopPlayer();
        return { type: 'encounter', id: p.id, initiator: 'ai' };
      }
    }
    return null;
  }

  // ---- AI --------------------------------------------------------------------

  visibleHostiles(p) {
    const st = this.state;
    const r = this.isNight() ? VISION * 0.65 : VISION;
    const out = [];
    for (const o of st.parties) {
      if (o === p || o.inside || o.battleId) continue;
      if (!this.isHostile(p.faction, o.faction)) continue;
      if (dist2(o.x, o.y, p.x, p.y) < r * r) out.push(o);
    }
    const pp = st.party;
    if (p.faction !== 'player' && this.isHostile(p.faction, 'player') && st.time >= pp.graceUntil && dist2(pp.x, pp.y, p.x, p.y) < r * r) {
      out.push(pp);
    }
    return out;
  }

  think(p) {
    const st = this.state;
    p.ai.thinkAt = st.time + rng.range(0.4, 0.9);
    const myStr = this.strength(p);

    // besieging parties stay put
    if (p.ai.mode === 'siege' && p.ai.besieging) {
      const s = this.sById.get(p.ai.besieging);
      if (s && s.siege && this.isHostile(p.faction, s.faction)) {
        // abandon siege if a much stronger enemy approaches
        const threat = this.visibleHostiles(p).find((o) => this.strength(o) > myStr * 1.4 && dist(o.x, o.y, p.x, p.y) < 80);
        if (!threat) return;
      }
      p.ai.besieging = null;
      p.ai.mode = 'patrol';
    }

    if (p.inside) {
      if (st.time < (p.ai.until || 0)) return;
      if (p.kind === 'lord' && healthyCount(p.troops) < 25) {
        p.ai.until = st.time + 12;
        return;
      }
      p.inside = null;
      p.ai.mode = 'idle';
    }

    const hostiles = this.visibleHostiles(p);
    // flee from stronger enemies
    let worst = null;
    let worstStr = 0;
    for (const o of hostiles) {
      const s = this.strength(o);
      if (s > worstStr && dist(o.x, o.y, p.x, p.y) < VISION * 0.7) {
        worst = o;
        worstStr = s;
      }
    }
    if (worst && worstStr > myStr * 1.25) {
      this.flee(p, worst);
      return;
    }
    if (p.kind !== 'caravan') {
      let prey = null;
      let bestD = Infinity;
      for (const o of hostiles) {
        const s = this.strength(o);
        if (s > myStr * (p.kind === 'bandit' ? 0.8 : 0.95)) continue;
        if (p.kind === 'bandit' && o.kind === 'lord') continue;
        const d = dist2(o.x, o.y, p.x, p.y);
        if (d < bestD) {
          bestD = d;
          prey = o;
        }
      }
      if (prey) {
        p.ai.mode = 'hunt';
        p.ai.target = prey.id;
        this.setPath(p, prey.x, prey.y);
        return;
      }
    }
    if (p.ai.mode === 'hunt' || p.ai.mode === 'flee') {
      p.ai.mode = 'idle';
      p.ai.path = null;
    }
    if (p.ai.path && p.ai.pi < p.ai.path.length) return; // keep going

    if (p.kind === 'lord') this.thinkLord(p, myStr);
    else if (p.kind === 'bandit') this.thinkBandit(p);
    else if (p.kind === 'caravan') this.thinkCaravan(p);
  }

  flee(p, from) {
    const dx = p.x - from.x;
    const dy = p.y - from.y;
    const d = Math.hypot(dx, dy) || 1;
    let best = null;
    for (let k = 0; k < 8; k++) {
      const a = Math.atan2(dy, dx) + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.4;
      const tx = p.x + Math.cos(a) * 160;
      const ty = p.y + Math.sin(a) * 160;
      if (tx < 20 || ty < 20 || tx > WORLD_W - 20 || ty > WORLD_H - 20) continue;
      if (this.nav.speedAt(tx, ty) > 0 && this.nav.isMainland(tx, ty)) {
        best = [tx, ty];
        break;
      }
    }
    // friendly settlement nearby is the best refuge
    if (p.kind !== 'bandit') {
      const refuge = this.state.settlements
        .filter((s) => s.kind !== 'village' && s.faction === p.faction && !s.siege)
        .sort((a, b) => dist2(a.x, a.y, p.x, p.y) - dist2(b.x, b.y, p.x, p.y))[0];
      if (refuge && dist(refuge.x, refuge.y, p.x, p.y) < 150) {
        const toRef = Math.atan2(refuge.y - p.y, refuge.x - p.x);
        const away = Math.atan2(dy, dx);
        if (Math.abs(((toRef - away + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 1.6) {
          best = [refuge.x, refuge.y];
          p.ai.destId = refuge.id;
        }
      }
    }
    p.ai.mode = 'flee';
    if (best) this.setPath(p, best[0], best[1]);
    void d;
  }

  thinkLord(p, myStr) {
    const st = this.state;
    const lord = this.lById.get(p.lordId);
    const n = healthyCount(p.troops);
    const own = st.settlements.filter((s) => s.faction === p.faction && s.kind !== 'village');
    if (!own.length) return;
    // go home to recruit
    if (n < 22) {
      const home = this.sById.get(lord.homeId);
      const dest = home && home.faction === p.faction && !home.siege ? home : own.sort((a, b) => dist2(a.x, a.y, p.x, p.y) - dist2(b.x, b.y, p.x, p.y))[0];
      p.ai.mode = 'return';
      p.ai.destId = dest.id;
      this.setPath(p, dest.x, dest.y);
      return;
    }
    // defend own besieged settlements
    const besieged = own.filter((s) => s.siege).sort((a, b) => dist2(a.x, a.y, p.x, p.y) - dist2(b.x, b.y, p.x, p.y))[0];
    if (besieged && dist(besieged.x, besieged.y, p.x, p.y) < 900 && rng.chance(0.7)) {
      p.ai.mode = 'defend';
      p.ai.destId = besieged.id;
      this.setPath(p, besieged.x + rng.range(-20, 20), besieged.y + rng.range(-20, 20));
      return;
    }
    // go on the offensive
    const enemies = FACTION_IDS.filter((f) => f !== p.faction && this.atWar(p.faction, f));
    const playerWar = !!st.wars[warKey('player', p.faction)];
    if ((enemies.length || playerWar) && n >= 45 && rng.chance(0.35)) {
      const targets = st.settlements
        .filter((s) => s.kind !== 'village' && this.isHostile(p.faction, s.faction) && s.faction !== 'bandits')
        .filter((s) => dist(s.x, s.y, p.x, p.y) < 1000)
        .filter((s) => this.garrisonStrength(s) * 1.5 < myStr)
        .sort((a, b) => dist2(a.x, a.y, p.x, p.y) - dist2(b.x, b.y, p.x, p.y));
      if (targets.length) {
        const t = targets[0];
        p.ai.mode = 'siege';
        p.ai.destId = t.id;
        this.setPath(p, t.x + rng.range(-10, 10), t.y + rng.range(-10, 10));
        return;
      }
    }
    // patrol: visit an own settlement (or village) nearby
    const cands = st.settlements.filter((s) => s.faction === p.faction && dist(s.x, s.y, p.x, p.y) < 700);
    const dest = cands.length ? rng.pick(cands) : rng.pick(own);
    p.ai.mode = 'patrol';
    p.ai.destId = dest.id;
    this.setPath(p, dest.x + rng.range(-25, 25), dest.y + rng.range(-25, 25));
  }

  thinkBandit(p) {
    for (let k = 0; k < 10; k++) {
      const tx = p.ai.homeX + rng.range(-260, 260);
      const ty = p.ai.homeY + rng.range(-260, 260);
      if (this.nav.isMainland(tx, ty) && this.nav.speedAt(tx, ty) > 0) {
        p.ai.mode = 'roam';
        this.setPath(p, tx, ty);
        return;
      }
    }
  }

  thinkCaravan(p) {
    const st = this.state;
    const towns = st.settlements.filter((s) => s.kind === 'town' && !this.isHostile(s.faction, p.faction) && s.id !== p.ai.destId && !s.siege);
    if (!towns.length) return;
    const near = towns.sort((a, b) => dist2(a.x, a.y, p.x, p.y) - dist2(b.x, b.y, p.x, p.y)).slice(0, 4);
    const dest = rng.pick(near);
    p.ai.mode = 'travel';
    p.ai.destId = dest.id;
    this.setPath(p, dest.x, dest.y);
  }

  onArrive(p) {
    const st = this.state;
    p.ai.path = null;
    const dest = p.ai.destId ? this.sById.get(p.ai.destId) : null;
    if (p.ai.mode === 'siege' && dest) {
      if (!this.isHostile(p.faction, dest.faction)) {
        p.ai.mode = 'idle';
        return;
      }
      if (dist(dest.x, dest.y, p.x, p.y) > 30) return;
      p.ai.besieging = dest.id;
      if (!dest.siege) {
        dest.siege = { faction: p.faction, parties: [p.id], start: st.time };
        if (dest.owner === 'player') this.message(`${p.name} бере в облогу ваше володіння ${dest.name}!`, 'danger');
        else if (this.isVisibleToPlayer(dest)) this.message(`${p.name} бере в облогу ${dest.name}.`, 'war');
      } else if (!dest.siege.parties.includes(p.id) && dest.siege.faction === p.faction) {
        dest.siege.parties.push(p.id);
      }
      return;
    }
    if (dest && (p.ai.mode === 'return' || p.ai.mode === 'travel' || p.ai.mode === 'flee' || (p.ai.mode === 'patrol' && dest.kind !== 'village')) && !this.isHostile(p.faction, dest.faction)) {
      if (dist(dest.x, dest.y, p.x, p.y) < 30) {
        p.inside = dest.id;
        p.x = dest.x;
        p.y = dest.y;
        p.ai.until = st.time + (p.ai.mode === 'return' ? 24 : rng.range(3, 10));
        p.ai.mode = 'rest';
        if (p.kind === 'caravan' && dest.market) {
          p.gold += rng.int(50, 200);
          for (const g of p.goods) dest.market[g.id] = Math.max(0.35, (dest.market[g.id] || 1) * 0.97);
        }
        return;
      }
    }
    p.ai.mode = 'idle';
  }

  isVisibleToPlayer(e) {
    const pp = this.state.party;
    return dist(e.x, e.y, pp.x, pp.y) < VISION * 1.5;
  }

  // ---- AI vs AI battles ---------------------------------------------------------

  checkAiEncounters() {
    const st = this.state;
    const ps = st.parties;
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i];
      if (a.inside || a.battleId || a.held) continue;
      for (let j = i + 1; j < ps.length; j++) {
        const b = ps[j];
        if (b.inside || b.battleId || b.held) continue;
        if (dist2(a.x, a.y, b.x, b.y) > 9 * 9) continue;
        if (!this.isHostile(a.faction, b.faction)) continue;
        // caravans / bandit pairs that are both fleeing do not fight
        if (a.ai.mode === 'flee' && b.ai.mode === 'flee') continue;
        this.startAiBattle(a, b);
        break;
      }
    }
  }

  startAiBattle(a, b) {
    const st = this.state;
    const battle = { id: this.newId('b'), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, sides: [[a.id], [b.id]], endsAt: st.time + rng.range(1.5, 3.5) };
    // nearby allies join
    for (const o of st.parties) {
      if (o === a || o === b || o.inside || o.battleId || o.held) continue;
      if (dist2(o.x, o.y, battle.x, battle.y) > 40 * 40) continue;
      const withA = !this.isHostile(o.faction, a.faction) && this.isHostile(o.faction, b.faction);
      const withB = !this.isHostile(o.faction, b.faction) && this.isHostile(o.faction, a.faction);
      if (withA) battle.sides[0].push(o.id);
      else if (withB) battle.sides[1].push(o.id);
      else continue;
      o.battleId = battle.id;
    }
    a.battleId = battle.id;
    b.battleId = battle.id;
    st.battles.push(battle);
    if (this.isVisibleToPlayer(battle)) this.message(`Бій: ${a.name} проти ${b.name}.`, 'war');
  }

  updateBattles() {
    const st = this.state;
    for (const b of [...st.battles]) {
      if (b.playerJoined) continue;
      // drop missing parties
      b.sides = b.sides.map((s) => s.filter((id) => this.pById.has(id)));
      if (!b.sides[0].length || !b.sides[1].length) {
        this.endBattle(b);
        continue;
      }
      if (st.time >= b.endsAt) this.resolveAiBattle(b);
    }
  }

  endBattle(b) {
    const st = this.state;
    for (const side of b.sides) for (const id of side) {
      const p = this.pById.get(id);
      if (p) p.battleId = null;
    }
    const i = st.battles.indexOf(b);
    if (i >= 0) st.battles.splice(i, 1);
  }

  // Auto-resolve a map battle. Also used for "send troops" by the player.
  resolveAiBattle(b) {
    const sides = b.sides.map((ids) => ids.map((id) => this.pById.get(id)).filter(Boolean));
    const res = autoResolve(sides.map((ps) => ({
      stacks: ps.flatMap((p) => p.troops.map((s) => ({ key: p.id, troopId: s.id, count: s.count - s.wounded }))),
      heroes: [],
      bonus: 1,
      woundChance: 0.3,
    })));
    this.applyAutoResult(b, sides, res);
  }

  applyAutoResult(b, sides, res) {
    const w = res.winner;
    for (let s = 0; s < 2; s++) {
      for (const p of sides[s]) {
        const loss = res.losses[s].get(p.id);
        if (loss) applyLosses(p.troops, loss);
      }
    }
    const winners = sides[w];
    const losers = sides[1 - w];
    let lootGold = 0;
    const names = losers.map((p) => p.name).join(', ');
    for (const p of losers) {
      lootGold += Math.round((p.gold || 0) * 0.6);
      if (healthyCount(p.troops) <= 3 || p.kind !== 'lord' || rng.chance(0.6)) {
        // winners take some wounded as prisoners
        const wp = winners[0];
        if (wp) for (const st2 of p.troops) if (st2.wounded) addTroops(wp.prisoners, st2.id, Math.ceil(st2.wounded * 0.5));
        if (p.lordId && this.isVisibleToPlayer(p)) this.message(`${this.lById.get(p.lordId).name} розбитий і втік з поля бою.`, 'war');
        this.removeParty(p);
      } else {
        this.flee(p, winners[0] || p);
        p.fleeUntil = this.state.time + 6;
      }
    }
    for (const p of winners) p.gold = (p.gold || 0) + Math.round(lootGold / Math.max(1, winners.length));
    if (this.isVisibleToPlayer(b)) this.message(`${winners.map((p) => p.name).join(', ')} перемагає (${names}).`, 'war');
    this.endBattle(b);
  }

  // ---- hourly / daily / weekly -----------------------------------------------------

  hourly(hour) {
    const st = this.state;
    const p = st.player;
    const max = playerMaxHp(p);
    if (p.hp < max) p.hp = Math.min(max, p.hp + max * (st.party.resting ? 0.045 : 0.012));
    this.updateSieges();
    if (hour % 24 === 0) this.daily();
  }

  daily() {
    const st = this.state;
    const day = this.day;
    const pl = st.player;
    const pp = st.party;

    // food
    const eaters = totalCount(pp.troops) + Math.ceil(totalCount(pp.prisoners) / 2) + 1;
    const need = Math.ceil(eaters / 3);
    const missing = consumeFood(pl.inventory, need);
    if (missing > 0) {
      pp.moraleBoost -= 12;
      this.message('Ваш загін голодує! Купіть провізію.', 'danger');
    } else if (foodServings(pl.inventory) < need * 2) {
      this.message('Провізія закінчується.', 'warn');
    }
    pp.moraleBoost *= 0.85;

    // healing & training
    for (const s of pp.troops) {
      if (s.wounded) {
        const heal = Math.max(rng.chance(0.6) ? 1 : 0, Math.floor(s.wounded * (0.18 + pl.skills.surgery * 0.04)));
        s.wounded = Math.max(0, s.wounded - heal);
      }
      if (pl.skills.trainer) {
        const t = TROOPS[s.id];
        if (t.tier <= pl.level / 3 + 2) addStackXp(s, s.count * pl.skills.trainer * 2);
      }
    }

    // morale & desertion
    const morale = this.playerMorale();
    if (morale < 20 && totalCount(pp.troops) > 0) {
      const s = rng.pick(pp.troops);
      const n = Math.max(1, Math.round(s.count * 0.15));
      removeTroops(pp.troops, s.id, n);
      this.message(`${n} ${plural(n, 'воїн дезертирував', 'воїни дезертирували', 'воїнів дезертирували')} через низький бойовий дух.`, 'danger');
    }

    // settlements
    for (const s of st.settlements) {
      driftMarket(s);
      if (s.kind === 'village') s.volunteers = Math.min(8, s.volunteers + (rng.chance(0.5) ? 1 : 0));
      if (s.kind !== 'village') {
        for (const g of s.garrison) addStackXp(g, g.count * 3);
        this.autoUpgrade(s.garrison, 0.3);
      }
    }

    // lords recruit while resting in friendly settlements
    for (const party of st.parties) {
      if (party.kind !== 'lord') continue;
      for (const g of party.troops) addStackXp(g, g.count * 4);
      this.autoUpgrade(party.troops, 0.5);
      if (party.inside) {
        const target = this.lById.get(party.lordId)?.king ? 130 : 85;
        const n = totalCount(party.troops);
        if (n < target) {
          for (let i = 0; i < rng.int(4, 9); i++) addTroops(party.troops, randomFactionTroop(rng, party.faction, 2), 1);
        }
        for (const g of party.troops) g.wounded = Math.max(0, g.wounded - Math.ceil(g.wounded * 0.4));
      } else {
        for (const g of party.troops) g.wounded = Math.max(0, g.wounded - Math.ceil(g.wounded * 0.15));
      }
    }

    // lords come back
    for (const lord of st.lords) {
      if (!lord.partyId && st.time >= lord.respawnAt) this.spawnLordParty(lord, rng.int(20, 35));
    }

    // bandits & caravans
    const bandits = st.parties.filter((q) => q.kind === 'bandit').length;
    if (bandits < 14 && rng.chance(0.7)) this.spawnBandits();
    for (const f of FACTION_IDS) {
      const c = st.parties.filter((q) => q.kind === 'caravan' && q.faction === f).length;
      if (c < 2 && rng.chance(0.3)) this.spawnCaravan(f);
    }

    this.diplomacy();
    checkQuestDeadlines(this);
    if (day % 7 === 1 && day > 1) this.weekly();
    this.emit('day', { day });
  }

  weekly() {
    const st = this.state;
    const pl = st.player;
    const pp = st.party;
    // wages
    const wages = this.weeklyWages();
    if (wages > 0) {
      if (pl.gold >= wages) {
        pl.gold -= wages;
        this.message(`Виплачено платню загону: ${wages} золота.`, 'info');
      } else {
        this.message(`Не вистачило золота на платню (${wages})! Бойовий дух падає.`, 'danger');
        pl.gold = 0;
        pp.moraleBoost -= 25;
      }
    }
    // mercenary contract
    if (st.contract) {
      if (this.day >= st.contract.until && !st.contract.vassal) {
        this.message(`Ваш найманський контракт з ${FACTIONS[st.contract.faction].name} завершився.`, 'info');
        st.contract = null;
      } else if (!st.contract.vassal) {
        const pay = this.contractPay();
        pl.gold += pay;
        this.message(`Отримано найманську платню: ${pay} золота.`, 'good');
      }
    }
    // fief income
    let income = 0;
    for (const s of st.settlements) {
      if (s.owner !== 'player') continue;
      income += Math.round((s.kind === 'town' ? 450 : s.kind === 'castle' ? 160 : 90) * (0.5 + s.prosperity / 100));
    }
    if (income) {
      pl.gold += income;
      this.message(`Прибуток з ваших володінь: ${income} золота.`, 'good');
    }
    // settlements refresh
    for (const s of st.settlements) {
      if (s.kind === 'town') {
        refreshShop(rng, s);
        s.tavern = { merc: rng.pick(MERCENARY_POOL), count: rng.int(3, 8) };
      }
      if (s.kind !== 'village' && s.owner !== 'player') {
        const cap = s.kind === 'town' ? 110 : 60;
        const n = totalCount(s.garrison);
        if (n < cap && !s.siege) for (let i = 0; i < rng.int(5, 10); i++) addTroops(s.garrison, randomFactionTroop(rng, s.faction === 'player' ? s.culture : s.faction, 3), 1);
      }
      if (s.kind !== 'village') for (const g of s.garrison) g.wounded = 0;
    }
    generateQuests(this);
  }

  weeklyWages() {
    const st = this.state;
    let w = stacksWages(st.party.troops) * (1 - st.player.skills.leadership * 0.05);
    for (const s of st.settlements) if (s.owner === 'player') w += stacksWages(s.garrison) * 0.5;
    return Math.round(w);
  }

  contractPay() {
    return 40 + totalCount(this.state.party.troops) * 4;
  }

  autoUpgrade(stacks, chance) {
    for (const s of [...stacks]) {
      const n = upgradableCount(s);
      if (n > 0 && rng.chance(chance)) {
        const t = TROOPS[s.id];
        const target = rng.pick(t.up);
        const k = Math.max(1, Math.floor(n * 0.5));
        s.xp -= k * t.upgradeXp;
        removeTroops(stacks, s.id, k);
        addTroops(stacks, target, k);
      }
    }
  }

  playerMorale() {
    const st = this.state;
    const pl = st.player;
    const size = totalCount(st.party.troops);
    let m = 50 + pl.skills.leadership * 6 + foodMorale(pl.inventory) + st.party.moraleBoost - Math.max(0, size - 10) * 0.35;
    if (foodServings(pl.inventory) <= 0) m -= 25;
    return Math.round(clamp(m, 0, 100));
  }

  diplomacy() {
    const st = this.state;
    const day = this.day;
    for (let i = 0; i < FACTION_IDS.length; i++) {
      for (let j = i + 1; j < FACTION_IDS.length; j++) {
        const a = FACTION_IDS[i];
        const b = FACTION_IDS[j];
        const k = warKey(a, b);
        const since = st.warSince[k] ?? -99;
        const age = day - since;
        const warsOf = (f) => FACTION_IDS.filter((o) => o !== f && st.wars[warKey(f, o)]).length;
        if (st.wars[k]) {
          if (age > 18 && rng.chance(0.035)) {
            delete st.wars[k];
            st.warSince[k] = day;
            this.message(`${FACTIONS[a].name} і ${FACTIONS[b].name} уклали мир.`, 'war');
            this.onPeace(a, b);
          }
        } else if (age > 8 && warsOf(a) < 2 && warsOf(b) < 2) {
          const anyWar = Object.keys(st.wars).some((kk) => !kk.includes('player'));
          if (rng.chance(anyWar ? 0.012 : 0.06)) {
            st.wars[k] = true;
            st.warSince[k] = day;
            this.message(`${FACTIONS[a].name} оголошує війну ${FACTIONS[b].name}!`, 'danger');
          }
        }
      }
    }
    // player wars can cool down
    for (const f of FACTION_IDS) {
      const k = warKey('player', f);
      if (st.wars[k] && day - (st.warSince[k] ?? 0) > 25 && rng.chance(0.02)) {
        delete st.wars[k];
        st.factions[f].relation = Math.max(st.factions[f].relation, -5);
        this.message(`${FACTIONS[f].name} погоджується на перемир’я з вами.`, 'good');
      }
    }
  }

  onPeace(a, b) {
    for (const s of this.state.settlements) {
      if (s.siege && ((s.faction === a && s.siege.faction === b) || (s.faction === b && s.siege.faction === a))) this.liftSiege(s);
    }
  }

  // ---- sieges ----------------------------------------------------------------------

  liftSiege(s) {
    if (!s.siege) return;
    for (const id of s.siege.parties) {
      const p = this.pById.get(id);
      if (p) {
        p.ai.besieging = null;
        p.ai.mode = 'idle';
      }
    }
    s.siege = null;
  }

  updateSieges() {
    const st = this.state;
    for (const s of st.settlements) {
      if (!s.siege) continue;
      if (s.siege.player) continue; // player siege handled via UI
      s.siege.parties = s.siege.parties.filter((id) => {
        const p = this.pById.get(id);
        return p && p.ai.besieging === s.id && !p.battleId;
      });
      if (!s.siege.parties.length) {
        s.siege = null;
        continue;
      }
      if (st.time - s.siege.start >= SIEGE_HOURS) this.resolveSiege(s);
    }
  }

  resolveSiege(s) {
    const st = this.state;
    const attackers = s.siege.parties.map((id) => this.pById.get(id)).filter(Boolean);
    const defenders = st.parties.filter((p) => p.inside === s.id && !this.isHostile(p.faction, s.faction));
    const res = autoResolve([
      { stacks: attackers.flatMap((p) => p.troops.map((t) => ({ key: p.id, troopId: t.id, count: t.count - t.wounded }))), bonus: 1, woundChance: 0.3 },
      {
        stacks: [
          ...s.garrison.map((t) => ({ key: 'garrison', troopId: t.id, count: t.count - t.wounded })),
          ...defenders.flatMap((p) => p.troops.map((t) => ({ key: p.id, troopId: t.id, count: t.count - t.wounded }))),
        ],
        bonus: 1.45,
        woundChance: 0.3,
      },
    ]);
    for (const p of attackers) {
      const loss = res.losses[0].get(p.id);
      if (loss) applyLosses(p.troops, loss);
    }
    const gl = res.losses[1].get('garrison');
    if (gl) applyLosses(s.garrison, gl);
    for (const p of defenders) {
      const loss = res.losses[1].get(p.id);
      if (loss) applyLosses(p.troops, loss);
    }
    const wasPlayer = s.owner === 'player';
    if (res.winner === 0) {
      const lead = attackers[0];
      const oldFaction = s.faction;
      for (const p of defenders) this.removeParty(p);
      this.captureSettlement(s, lead.faction, lead.lordId || null);
      // part of the army becomes the new garrison
      s.garrison = [];
      for (const t of lead.troops) {
        const n = Math.floor((t.count - t.wounded) * 0.3);
        if (n > 0) {
          removeTroops(lead.troops, t.id, n);
          addTroops(s.garrison, t.id, n);
        }
      }
      const msg = `${factionInfo(lead.faction).name} захоплює ${s.name} (раніше: ${factionInfo(oldFaction).short})!`;
      this.message(wasPlayer ? `Ви втратили ${s.name}! ${msg}` : msg, wasPlayer ? 'danger' : 'war');
      for (const p of attackers) {
        p.ai.besieging = null;
        p.ai.mode = 'idle';
      }
    } else {
      for (const p of attackers) {
        if (healthyCount(p.troops) < 10) this.removeParty(p);
        else {
          p.ai.besieging = null;
          this.flee(p, s);
        }
      }
      this.message(`Штурм ${s.name} відбито.`, wasPlayer ? 'good' : 'war');
    }
    s.siege = null;
  }

  captureSettlement(s, faction, owner) {
    s.faction = faction;
    s.owner = owner;
    s.prosperity = Math.max(10, s.prosperity - 15);
    for (const v of this.state.settlements) {
      if (v.boundTo === s.id) {
        v.faction = faction;
        v.owner = owner;
      }
    }
    // lords of the old faction lose their home
    for (const lord of this.state.lords) {
      if (lord.homeId === s.id && lord.faction !== faction) {
        const alt = this.state.settlements.find((x) => x.faction === lord.faction && x.kind !== 'village');
        if (alt) lord.homeId = alt.id;
      }
    }
    this.checkFactionDefeat();
  }

  checkFactionDefeat() {
    const st = this.state;
    for (const f of FACTION_IDS) {
      if (st.factions[f].defeated) continue;
      if (!st.settlements.some((s) => s.faction === f && s.kind !== 'village')) {
        st.factions[f].defeated = true;
        this.message(`${FACTIONS[f].name} припинило існування!`, 'danger');
        for (const p of st.parties.filter((q) => q.faction === f)) this.removeParty(p);
        for (const k of Object.keys(st.wars)) if (k.split('|').includes(f)) delete st.wars[k];
        if (st.contract?.faction === f) st.contract = null;
      }
    }
  }

  // ---- player helpers ----------------------------------------------------------------

  addPlayerXp(amount) {
    const p = this.state.player;
    p.xp += Math.round(amount);
    let lv = false;
    while (p.xp >= xpForNextLevel(p.level)) {
      p.xp -= xpForNextLevel(p.level);
      p.level++;
      p.attrPoints += 1;
      p.skillPoints += 1;
      lv = true;
    }
    if (lv) this.message(`Новий рівень: ${p.level}! Розподіліть очки у вікні персонажа.`, 'good');
  }

  changeRelation(faction, delta) {
    if (!this.state.factions[faction]) return;
    const f = this.state.factions[faction];
    const before = f.relation;
    f.relation = clamp(f.relation + delta, -100, 100);
    if (Math.round(f.relation) !== Math.round(before)) {
      this.message(`Стосунки з ${FACTIONS[faction].name}: ${delta > 0 ? '+' : ''}${delta} (зараз ${Math.round(f.relation)}).`, delta > 0 ? 'good' : 'warn');
    }
  }

  // Player attacks a non-hostile faction: war.
  declarePlayerWar(faction) {
    const st = this.state;
    if (!FACTIONS[faction]) return;
    if (st.contract?.faction === faction) {
      this.message(`Ви зрадили ${FACTIONS[faction].name}. Контракт розірвано!`, 'danger');
      st.contract = null;
      for (const s of st.settlements) if (s.owner === 'player' && s.faction === faction) this.captureSettlement(s, 'player', 'player');
    }
    st.wars[warKey('player', faction)] = true;
    st.warSince[warKey('player', faction)] = this.day;
    this.changeRelation(faction, -20);
  }

  partyLimit() {
    return partyLimit(this.state);
  }

  prisonerLimit() {
    return prisonerLimit(this.state);
  }

  isPlayerFull() {
    return totalCount(this.state.party.troops) >= this.partyLimit();
  }

  carryFood() {
    return foodServings(this.state.player.inventory);
  }

  hasItem(id) {
    return invCount(this.state.player.inventory, id) > 0;
  }

  takeItem(id, n = 1) {
    return invRemove(this.state.player.inventory, id, n);
  }

  giveItem(id, n = 1) {
    invAdd(this.state.player.inventory, id, n);
  }

  foodIds() {
    return FOOD_IDS;
  }

  // Place the player party after a defeat near a friendly town.
  respawnPlayerAfterDefeat() {
    const st = this.state;
    const towns = st.settlements.filter((s) => s.kind === 'town' && !this.isHostile(s.faction, 'player'));
    const pool = towns.length ? towns : st.settlements;
    const pp = st.party;
    const t = pool.sort((a, b) => dist2(a.x, a.y, pp.x, pp.y) - dist2(b.x, b.y, pp.x, pp.y))[0];
    pp.x = t.x + 26;
    pp.y = t.y - 4;
    pp.path = null;
    pp.target = null;
    pp.graceUntil = st.time + 24;
    return t;
  }
}
