// Encounters on the world map and battle result screens.
import { h, btn, gameMenu } from './dom.js';
import { scene } from './scenes.js';
import { rng } from '../core/rng.js';
import { FACTIONS, factionInfo } from '../data/factions.js';
import { TROOPS } from '../data/troops.js';
import { ITEMS } from '../data/items.js';
import { totalCount, healthyCount, describeStacks, addTroops } from '../world/party.js';
import { startFieldBattle, autoFieldBattle, attemptRetreat } from '../game/conflict.js';

const TALK = {
  lord: ['«Дороги нині небезпечні, мандрівнику. Тримай меч напоготові.»', '«Мої люди втомилися, але служба королю понад усе.»', '«Якщо шукаєш слави — приходь до тронної зали.»'],
  caravan: ['«Ми лише чесні купці. Товари з півдня, ціни — найкращі!»', '«Бачили розбійників біля броду. Будьте обережні.»'],
  bandit: ['«Гаманець або життя!»'],
};

function comparePower(world, p) {
  const rel = world.strength(p) / Math.max(1, world.strength(world.state.party));
  if (rel > 1.8) return 'Вони значно переважають вас.';
  if (rel > 1.15) return 'Вони сильніші за вас.';
  if (rel > 0.85) return 'Сили приблизно рівні.';
  if (rel > 0.5) return 'Ви сильніші за них.';
  return 'Ви значно сильніші.';
}

function stackList(stacks) {
  const sorted = [...stacks].sort((a, b) => TROOPS[b.id].tier - TROOPS[a.id].tier || b.count - a.count);
  return sorted.map((s) => `  ${TROOPS[s.id].name}: ${s.count - s.wounded}${s.wounded ? ` (+${s.wounded} пор.)` : ''}`).join('\n');
}

export const encounterScreens = {
  openEncounter(partyId, initiator) {
    const game = this.game;
    const world = game.world;
    const st = world.state;
    const p = world.pById.get(partyId);
    if (!p) return;
    p.held = true;
    const hostile = world.isHostile(p.faction, 'player');
    const f = factionInfo(p.faction);
    let win;
    const close = () => {
      p.held = false;
      this.windows.close(win);
    };
    const fight = () => {
      this.windows.close(win);
      if (!hostile && FACTIONS[p.faction]) world.declarePlayerWar(p.faction);
      p.held = false;
      startFieldBattle(game, { enemies: [p] });
    };
    const lines = [];
    if (initiator === 'ai' && hostile) {
      lines.push(p.kind === 'bandit' ? `${p.name} перегороджують вам шлях! ${rng.pick(TALK.bandit)}` : `${p.name} атакує вас!`);
    } else {
      lines.push(`Ви зустріли: ${p.name} (${f.name}).`);
    }
    lines.push(`\nВоїнів: ${totalCount(p.troops)}. ${comparePower(world, p)}`);
    lines.push(stackList(p.troops));
    lines.push(`\nВаших боєздатних воїнів: ${healthyCount(st.party.troops)} + ви.`);
    if (st.player.hp < 25) lines.push('Ви поранені і ослаблені.');

    const opts = [];
    if (hostile) {
      opts.push({ label: '⚔ До бою!', cls: 'primary', onClick: fight });
      opts.push({ label: '⚑ Доручити бій загону', hint: 'без вас', disabled: healthyCount(st.party.troops) === 0, onClick: () => {
        this.windows.close(win);
        p.held = false;
        autoFieldBattle(game, { enemies: [p] });
      } });
      if (initiator === 'ai') {
        opts.push({ label: '↩ Спробувати втекти', hint: totalCount(st.party.troops) ? 'втратите частину загону' : '', onClick: () => {
          const lost = attemptRetreat(world, p);
          close();
          if (lost.length) world.message(`Ви втекли, залишивши позаду: ${lost.map(([id, n]) => `${TROOPS[id].name} ×${n}`).join(', ')}.`, 'warn');
          else world.message('Вам вдалося відірватися від переслідувачів.', 'info');
        } });
      } else {
        opts.push({ label: '← Відійти', onClick: () => { st.party.graceUntil = st.time + 1; close(); } });
      }
    } else {
      opts.push({ label: '☺ Поговорити', onClick: () => {
        const pool = TALK[p.kind] || TALK.lord;
        this.toast(rng.pick(pool), 3500);
      } });
      if (p.kind === 'lord' && st.contract && st.contract.faction === p.faction) {
        opts.push({ label: '⚑ Запитати про ворогів', onClick: () => {
          const enemies = Object.keys(FACTIONS).filter((o) => world.atWar(p.faction, o)).map((o) => FACTIONS[o].name);
          this.toast(enemies.length ? `«Ми воюємо з: ${enemies.join(', ')}.»` : '«Нині в королівстві мир.»', 3500);
        } });
      }
      opts.push({ label: `⚔ Напасти (війна з ${f.short || f.name})`, cls: 'danger', onClick: () => {
        if (confirm(`Напад на ${p.name} означає війну з ${f.name}. Ви впевнені?`)) fight();
      } });
      opts.push({ label: '← Піти своєю дорогою', onClick: () => { st.party.graceUntil = st.time + 0.5; close(); } });
    }
    const body = gameMenu({ text: lines.join('\n'), scene: scene('battle', f.color, st.time % 24), options: opts });
    win = this.windows.show({ title: p.name, body, cls: 'wide', closable: false, onClose: () => game.onMenuClosed() });
  },

  openBattleSite(battleId) {
    const game = this.game;
    const world = game.world;
    const st = world.state;
    const b = st.battles.find((x) => x.id === battleId);
    if (!b) {
      game.onMenuClosed();
      return;
    }
    const sides = b.sides.map((ids) => ids.map((id) => world.pById.get(id)).filter(Boolean));
    if (!sides[0].length || !sides[1].length) {
      game.onMenuClosed();
      return;
    }
    b.playerJoined = true; // freeze while deciding
    let win;
    const close = () => {
      b.playerJoined = false;
      this.windows.close(win);
    };
    const text = [
      'Ви натрапили на битву!',
      '',
      ...sides.map((ps, i) => `${i ? 'Проти них: ' : 'З одного боку: '}${ps.map((p) => `${p.name} (${totalCount(p.troops)})`).join(', ')}`),
    ].join('\n');
    const opts = [];
    sides.forEach((ps, i) => {
      const other = sides[1 - i];
      const lead = ps[0];
      const canHelp = !world.isHostile(lead.faction, 'player');
      opts.push({
        label: `⚔ Допомогти: ${lead.name}`,
        disabled: !canHelp,
        title: canHelp ? '' : 'Вони ворожі до вас',
        onClick: () => {
          this.windows.close(win);
          // attacking the other side may start a war
          for (const e of other) if (FACTIONS[e.faction] && !world.isHostile(e.faction, 'player')) world.declarePlayerWar(e.faction);
          startFieldBattle(game, { enemies: other, allies: ps, mapBattle: b });
        },
      });
    });
    opts.push({ label: '← Не втручатися', onClick: () => { st.party.graceUntil = st.time + 0.5; close(); } });
    const body = gameMenu({ text, scene: scene('battle', '#a8322a', st.time % 24), options: opts });
    win = this.windows.show({ title: 'Битва', body, cls: 'wide', closable: false, onClose: () => game.onMenuClosed() });
  },

  showBattleResult(summary) {
    const game = this.game;
    const world = game.world;
    const st = world.state;
    const titles = {
      victory: 'Перемога!',
      defeat: 'Поразка',
      retreat: 'Відступ',
      autoDefeat: 'Поразка',
      arenaWin: 'Тріумф на арені',
      arenaLoss: 'Арена',
    };
    const lossList = (loss) => {
      const rows = [];
      const ids = new Set([...Object.keys(loss.killed), ...Object.keys(loss.wounded)]);
      for (const id of ids) {
        const k = loss.killed[id] || 0;
        const w = loss.wounded[id] || 0;
        rows.push(h('tr', null, h('td', null, TROOPS[id].name), h('td', { class: 'num bad' }, k || ''), h('td', { class: 'num' }, w || '')));
      }
      if (!rows.length) return h('p', { class: 'muted' }, 'Без втрат.');
      return h('table', { class: 'list' }, h('tr', null, h('th', null, ''), h('th', { class: 'num' }, 'Загинули'), h('th', { class: 'num' }, 'Поранені')), ...rows);
    };
    const parts = [];
    for (const n of summary.notes) parts.push(h('p', null, n));
    const rewards = [];
    if (summary.gold) rewards.push(`${summary.gold} золота`);
    if (summary.xp) rewards.push(`${summary.xp} досвіду`);
    if (summary.renown) rewards.push(`${summary.renown} слави`);
    if (summary.kills) rewards.push(`власноруч повалено: ${summary.kills}`);
    if (rewards.length) parts.push(h('p', null, h('b', null, 'Здобуто: '), rewards.join(' · ')));
    if (summary.items.length) parts.push(h('p', null, h('b', null, 'Трофеї: '), summary.items.map(([id, n]) => `${ITEMS[id].name}${n > 1 ? ` ×${n}` : ''}`).join(', ')));
    const pris = Object.entries(summary.prisoners);
    if (pris.length) parts.push(h('p', null, h('b', null, 'Полонені: '), pris.map(([id, n]) => `${TROOPS[id].name} ×${n}`).join(', ')));
    const isArena = summary.outcome.startsWith('arena');
    let freedBtn = null;
    if (summary.freed?.length) {
      freedBtn = btn('Прийняти звільнених до загону', () => {
        let space = world.partyLimit() - totalCount(st.party.troops);
        for (const f of summary.freed) {
          const n = Math.min(space, f.count);
          if (n > 0) addTroops(st.party.troops, f.id, n);
          space -= n;
        }
        summary.freed = null;
        freedBtn.disabled = true;
        freedBtn.textContent = 'Звільнені приєдналися';
      }, 'small');
      parts.push(freedBtn);
    }
    const body = h('div', null,
      scene(isArena ? 'arena' : 'battle', summary.outcome === 'victory' ? '#3f7a3a' : '#a8322a', st.time % 24),
      ...parts,
      isArena ? null : h('div', { class: 'cols' },
        h('div', null, h('div', { class: 'section-title' }, 'Ваші втрати'), lossList(summary.playerLoss)),
        h('div', null, h('div', { class: 'section-title' }, 'Втрати ворога'), lossList(summary.enemyLoss))),
    );
    const win = this.windows.show({
      title: titles[summary.outcome] || 'Результат битви',
      body,
      cls: 'wide',
      onClose: () => {
        game.autosave();
        game.onMenuClosed();
      },
      footer: [btn('Продовжити', () => this.windows.close(win), 'primary')],
    });
    void describeStacks;
  },
};
