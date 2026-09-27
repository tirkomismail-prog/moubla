// Abstract battle simulation used when the player is not fighting in person
// (AI vs AI battles, sieges, "send troops" and finishing a battle after the
// player has been knocked out).
import { TROOPS } from '../data/troops.js';
import { ITEMS } from '../data/items.js';
import { rng as defaultRng } from '../core/rng.js';

function troopArmor(t) {
  const a = t.eq.armor ? ITEMS[t.eq.armor[0]] : null;
  const h = t.eq.helmet ? ITEMS[t.eq.helmet.find((x) => x) || ''] : null;
  return (a ? a.armor : 0) + (h ? h.armor * 0.3 : 0);
}

/**
 * sides: [sideA, sideB]; side = {
 *   stacks: [{ key, troopId, count }],   // count = healthy soldiers taking part
 *   heroes: [{ key, hp, power, armor }], // player / companions (never killed)
 *   bonus: 1,                            // damage multiplier (tactics, walls)
 *   woundChance: 0.25,                   // chance that a fallen soldier survives
 * }
 * Returns { winner: 0|1, losses: [Map(key -> {killed, wounded}), Map], heroesDown: Set(key) }
 */
export function autoResolve(sides, rand = defaultRng, maxRounds = 60) {
  const units = [[], []];
  for (let s = 0; s < 2; s++) {
    for (const st of sides[s].stacks) {
      const t = TROOPS[st.troopId];
      if (!t) continue;
      const armor = troopArmor(t);
      for (let i = 0; i < st.count; i++) {
        units[s].push({ key: st.key, troopId: st.troopId, hp: t.hp, power: t.power, armor, hero: false });
      }
    }
    for (const h of sides[s].heroes || []) {
      units[s].push({ key: h.key, hp: h.hp, power: h.power, armor: h.armor || 10, hero: true });
    }
  }
  const losses = [new Map(), new Map()];
  const heroesDown = new Set();
  const alive = [units[0].slice(), units[1].slice()];

  const record = (s, u, killed) => {
    if (u.hero) {
      heroesDown.add(u.key);
      return;
    }
    let e = losses[s].get(u.key);
    if (!e) {
      e = { killed: {}, wounded: {} };
      losses[s].set(u.key, e);
    }
    const bucket = killed ? e.killed : e.wounded;
    bucket[u.troopId] = (bucket[u.troopId] || 0) + 1;
  };

  let round = 0;
  while (alive[0].length && alive[1].length && round < maxRounds) {
    round++;
    for (let s = 0; s < 2; s++) {
      const o = 1 - s;
      const attacks = Math.max(1, Math.round(alive[s].length * 0.35));
      for (let k = 0; k < attacks && alive[o].length && alive[s].length; k++) {
        const att = alive[s][Math.floor(rand.float() * alive[s].length)];
        const di = Math.floor(rand.float() * alive[o].length);
        const def = alive[o][di];
        const raw = att.power * (sides[s].bonus || 1) * rand.range(0.55, 1.45);
        const dmg = Math.max(1, raw - def.armor * 0.25) * (1 - Math.min(0.5, def.armor * 0.006));
        def.hp -= dmg;
        if (def.hp <= 0) {
          alive[o][di] = alive[o][alive[o].length - 1];
          alive[o].pop();
          const survived = rand.float() < (sides[o].woundChance ?? 0.25);
          record(o, def, !survived);
        }
      }
    }
  }
  let winner;
  if (!alive[1].length && alive[0].length) winner = 0;
  else if (!alive[0].length && alive[1].length) winner = 1;
  else {
    // ran out of rounds: side with more remaining strength wins, the loser flees
    const str = (arr) => arr.reduce((a, u) => a + u.power * Math.max(0, u.hp), 0);
    winner = str(alive[0]) >= str(alive[1]) ? 0 : 1;
  }
  return { winner, losses, heroesDown, remaining: [alive[0].length, alive[1].length] };
}

export function stackPower(stacks) {
  let p = 0;
  for (const s of stacks) {
    const t = TROOPS[s.id || s.troopId];
    if (!t) continue;
    p += t.power * Math.max(0, s.count - (s.wounded || 0));
  }
  return p;
}
