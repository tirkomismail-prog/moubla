// Simple town quests: bandit bounties and cargo deliveries.
import { rng } from '../core/rng.js';
import { dist } from '../core/util.js';
import { FACTIONS } from '../data/factions.js';
import { addTroops } from './party.js';
import { invAdd, invRemove, invCount } from './economy.js';

const GANG_NAMES = ['Банда Чорного Вовка', 'Зграя Рудого Кнура', 'Ватага Кривого Ножа', 'Шайка Сліпого Мирона', 'Братство Сірої Сови', 'Банда Залізного Зуба'];

export function generateQuests(world) {
  const st = world.state;
  st.quests = st.quests.filter((q) => q.status !== 'offered');
  const towns = st.settlements.filter((s) => s.kind === 'town');
  for (const town of towns) {
    if (!rng.chance(0.75)) continue;
    const type = rng.chance(0.5) ? 'bounty' : 'delivery';
    if (type === 'bounty') {
      const gang = rng.pick(GANG_NAMES);
      st.quests.push({
        id: world.newId('q'),
        type,
        giver: town.id,
        status: 'offered',
        title: `Полювання на «${gang}»`,
        gang,
        desc: `Банда «${gang}» грабує подорожніх біля міста ${town.name}. Знищіть її протягом 10 днів.`,
        reward: rng.int(22, 40) * 10,
        xp: 220,
        days: 10,
      });
    } else {
      const targets = towns.filter((t) => t !== town && dist(t.x, t.y, town.x, town.y) > 350 && dist(t.x, t.y, town.x, town.y) < 1500);
      if (!targets.length) continue;
      const target = rng.pick(targets);
      const d = dist(target.x, target.y, town.x, town.y);
      const days = Math.ceil(d / 260) + 3;
      st.quests.push({
        id: world.newId('q'),
        type,
        giver: town.id,
        target: target.id,
        status: 'offered',
        title: `Вантаж до ${target.name}`,
        desc: `Купці міста ${town.name} просять доставити опечатаний вантаж до міста ${target.name} за ${days} днів.`,
        reward: Math.round((80 + d * 0.28) / 10) * 10,
        xp: 120,
        days,
      });
    }
  }
}

export function questsOffered(world, settlementId) {
  return world.state.quests.filter((q) => q.status === 'offered' && q.giver === settlementId);
}

export function acceptQuest(world, q) {
  const st = world.state;
  const giver = world.sById.get(q.giver);
  if (world.isHostile(giver.faction, 'player')) return 'Ворожі міста не довіряють вам.';
  q.status = 'active';
  q.deadline = world.day + q.days;
  if (q.type === 'bounty') {
    const p = world.spawnBandits(giver);
    if (!p) {
      q.status = 'offered';
      return 'Не вдалося знайти банду.';
    }
    p.name = q.gang;
    p.questId = q.id;
    p.troops = [];
    addTroops(p.troops, 'deserter', rng.int(3, 6));
    addTroops(p.troops, 'looter', rng.int(6, 12));
    addTroops(p.troops, 'forest_bandit', rng.int(2, 5));
    p.gold = rng.int(150, 300);
    q.targetParty = p.id;
  } else {
    invAdd(st.player.inventory, 'cargo', 1);
  }
  world.message(`Нове завдання: ${q.title}.`, 'good');
  return null;
}

export function deliverableQuests(world, settlementId) {
  return world.state.quests.filter((q) => q.status === 'active' && q.type === 'delivery' && q.target === settlementId);
}

export function completeDelivery(world, q) {
  const st = world.state;
  if (invCount(st.player.inventory, 'cargo') <= 0) return false;
  invRemove(st.player.inventory, 'cargo', 1);
  q.status = 'done';
  st.player.gold += q.reward;
  world.addPlayerXp(q.xp);
  const giver = world.sById.get(q.giver);
  if (FACTIONS[giver.faction]) world.changeRelation(giver.faction, 2);
  st.player.renown += 3;
  world.message(`Завдання виконано: ${q.title}. Нагорода ${q.reward} золота.`, 'good');
  return true;
}

export function onPartyDestroyed(world, p, byPlayer = false) {
  if (!p.questId) return;
  const q = world.state.quests.find((x) => x.id === p.questId);
  if (!q || q.status !== 'active') return;
  if (byPlayer) {
    q.status = 'done';
    world.state.player.gold += q.reward;
    world.addPlayerXp(q.xp);
    const giver = world.sById.get(q.giver);
    if (FACTIONS[giver.faction]) world.changeRelation(giver.faction, 3);
    world.state.player.renown += 5;
    world.message(`Завдання виконано: ${q.title}. Нагорода ${q.reward} золота.`, 'good');
  } else {
    q.status = 'failed';
    world.message(`Завдання «${q.title}» провалено: банду знищив хтось інший.`, 'warn');
  }
}

export function checkQuestDeadlines(world) {
  const st = world.state;
  for (const q of st.quests) {
    if (q.status !== 'active' || world.day <= q.deadline) continue;
    q.status = 'failed';
    const giver = world.sById.get(q.giver);
    if (FACTIONS[giver.faction]) world.changeRelation(giver.faction, -3);
    if (q.type === 'delivery') invRemove(st.player.inventory, 'cargo', 1);
    if (q.type === 'bounty' && q.targetParty) {
      const p = world.pById.get(q.targetParty);
      if (p) p.questId = null;
    }
    world.message(`Завдання «${q.title}» провалено — минув термін.`, 'danger');
  }
  // keep the list tidy
  if (st.quests.length > 60) st.quests = st.quests.filter((q) => q.status === 'offered' || q.status === 'active');
}
