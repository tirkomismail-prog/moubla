// Markets, shops, prices and inventory helpers.
import { ITEMS, GOOD_IDS, FOOD_IDS, isEquipment } from '../data/items.js';
import { TROOPS, FACTION_TREES } from '../data/troops.js';

export const CARRY_CAPACITY = 60;

// ---- inventory -------------------------------------------------------------

export function invCount(inv, id) {
  const e = inv.find((x) => x.id === id);
  return e ? e.qty : 0;
}

export function invAdd(inv, id, qty = 1) {
  let e = inv.find((x) => x.id === id);
  if (!e) {
    e = { id, qty: 0 };
    if (ITEMS[id].type === 'food') e.left = ITEMS[id].servings;
    inv.push(e);
  }
  e.qty += qty;
  return e;
}

export function invRemove(inv, id, qty = 1) {
  const e = inv.find((x) => x.id === id);
  if (!e) return 0;
  const n = Math.min(qty, e.qty);
  e.qty -= n;
  if (e.qty <= 0) inv.splice(inv.indexOf(e), 1);
  return n;
}

export function invLoad(inv) {
  let n = 0;
  for (const e of inv) n += e.qty;
  return n;
}

export function foodServings(inv) {
  let n = 0;
  for (const e of inv) {
    const it = ITEMS[e.id];
    if (it.type === 'food') n += (e.qty - 1) * it.servings + (e.left ?? it.servings);
  }
  return n;
}

// Eat `servings` spread across the available food types. Returns servings missing.
export function consumeFood(inv, servings) {
  let need = servings;
  let guard = 0;
  while (need > 0 && guard++ < 10000) {
    const foods = inv.filter((e) => ITEMS[e.id].type === 'food' && e.qty > 0);
    if (!foods.length) break;
    for (const e of foods) {
      if (need <= 0) break;
      if (e.left == null) e.left = ITEMS[e.id].servings;
      e.left -= 1;
      need -= 1;
      if (e.left <= 0) {
        e.qty -= 1;
        e.left = ITEMS[e.id].servings;
        if (e.qty <= 0) inv.splice(inv.indexOf(e), 1);
      }
    }
  }
  return Math.max(0, need);
}

export function foodMorale(inv) {
  let m = 0;
  for (const e of inv) {
    const it = ITEMS[e.id];
    if (it.type === 'food' && e.qty > 0) m += 2 + it.morale;
  }
  return m;
}

// ---- markets ----------------------------------------------------------------

export function setupMarket(rng, settlement) {
  const market = {};
  for (const g of GOOD_IDS) market[g] = rng.range(0.9, 1.12);
  for (const f of FOOD_IDS) market[f] = rng.range(0.9, 1.15);
  const goods = rng.shuffle([...GOOD_IDS]);
  settlement.produces = [];
  settlement.demands = [];
  if (settlement.kind === 'town') {
    settlement.produces = goods.slice(0, 2);
    settlement.demands = goods.slice(2, 4);
  } else if (settlement.kind === 'village') {
    settlement.produces = [goods[0]];
    for (const f of FOOD_IDS) market[f] *= 0.75;
  }
  for (const g of settlement.produces) market[g] = rng.range(0.55, 0.7);
  for (const g of settlement.demands) market[g] = rng.range(1.35, 1.6);
  settlement.market = market;
  settlement.marketBase = { ...market };
}

export function driftMarket(settlement) {
  if (!settlement.market) return;
  for (const k of Object.keys(settlement.market)) {
    const base = settlement.marketBase[k];
    settlement.market[k] += (base - settlement.market[k]) * 0.08;
  }
}

export function buyPrice(state, settlement, id) {
  const it = ITEMS[id];
  const trade = state.player.skills.trade;
  let mod = 1;
  if (it.type === 'good' || it.type === 'food') mod = settlement.market ? settlement.market[id] ?? 1 : 1;
  return Math.max(1, Math.round(it.price * mod * (1.1 - trade * 0.012)));
}

export function sellPrice(state, settlement, id) {
  const it = ITEMS[id];
  const trade = state.player.skills.trade;
  if (it.type === 'good' || it.type === 'food') {
    const mod = settlement.market ? settlement.market[id] ?? 1 : 1;
    return Math.max(1, Math.round(it.price * mod * (0.88 + trade * 0.012)));
  }
  if (it.type === 'quest') return 0;
  return Math.max(1, Math.round(it.price * (0.3 + trade * 0.025)));
}

export function onTraded(settlement, id, bought) {
  if (!settlement.market || settlement.market[id] == null) return;
  settlement.market[id] *= bought ? 1.035 : 0.965;
  settlement.market[id] = Math.max(0.35, Math.min(2.5, settlement.market[id]));
}

// Equipment stock of a town shop, refreshed weekly.
export function refreshShop(rng, settlement) {
  const culture = settlement.culture;
  const pool = new Map();
  const addPool = (id, w) => {
    if (!id || !isEquipment(id)) return;
    if (ITEMS[id].training) return;
    pool.set(id, (pool.get(id) || 0) + w);
  };
  for (const tid of FACTION_TREES[culture] || []) {
    const t = TROOPS[tid];
    for (const list of Object.values(t.eq)) for (const id of list) addPool(id, 3);
  }
  for (const id of Object.keys(ITEMS)) addPool(id, 1);
  const entries = [...pool.entries()];
  const stock = new Set();
  const n = settlement.kind === 'town' ? 18 : 0;
  let guard = 0;
  while (stock.size < n && guard++ < 500) stock.add(rng.weighted(entries));
  settlement.shop = [...stock];
}

export function ransomPrice(state, troopId) {
  const t = TROOPS[troopId];
  return Math.round((15 + t.tier * t.tier * 12) * (1 + state.player.skills.trade * 0.03));
}
