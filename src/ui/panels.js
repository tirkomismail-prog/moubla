// Party, character, equipment, journal and factions windows.
import { h, btn, bar, factionDot } from './dom.js';
import { plural, formatHour } from '../core/util.js';
import { FACTIONS, FACTION_IDS } from '../data/factions.js';
import { ITEMS, SLOT_NAMES, describeItem, isEquipment } from '../data/items.js';
import { TROOPS, TYPE_NAMES } from '../data/troops.js';
import { ATTRIBUTES, SKILLS, xpForNextLevel, playerMaxHp, maxSkillLevel } from '../data/character.js';
import { totalCount, woundedCount, upgradableCount, upgradeStack, removeTroops, addTroops, stacksWages } from '../world/party.js';
import { invAdd, invRemove, invLoad, CARRY_CAPACITY, foodServings } from '../world/economy.js';
import { warKey } from '../world/world.js';

const PLAYER_SLOTS = ['w1', 'w2', 'w3', 'shield', 'armor', 'helmet', 'horse'];
const PLAYER_SLOT_NAMES = { w1: 'Зброя 1', w2: 'Зброя 2', w3: 'Зброя 3', shield: 'Щит', armor: 'Обладунок', helmet: 'Шолом', horse: 'Кінь' };

function slotsFor(it) {
  if (!it) return [];
  if (it.type === 'weapon') return ['w1', 'w2', 'w3'];
  return [it.slot];
}

export const panelScreens = {
  // ---- party ---------------------------------------------------------------------------

  openParty(parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    const pp = st.party;
    let win;
    const render = () => {
      const total = totalCount(pp.troops);
      const limit = world.partyLimit();
      const table = h('table', { class: 'list' }, h('tr', null,
        h('th', null, 'Воїни'), h('th', null, 'Тип'), h('th', { class: 'num' }, 'К-сть'), h('th', null, 'Досвід'), h('th', null, 'Покращення'), h('th', null, '')));
      pp.troops.forEach((s, i) => {
        const t = TROOPS[s.id];
        const up = upgradableCount(s);
        const upBtns = t.up.map((uid) => {
          const u = TROOPS[uid];
          const cost = t.upgradeCost;
          const n = Math.min(up, cost ? Math.floor(pl.gold / cost) : up);
          return btn(`→ ${u.name}${cost ? ` (${cost})` : ''}`, () => {
            pl.gold -= cost * upgradeStack(pp.troops, s, uid, 1);
            render();
          }, 'tiny', { disabled: n <= 0, title: `Покращити одного. ${TYPE_NAMES[u.type]}, рівень ${u.tier}` });
        });
        const upAll = t.up.length === 1 && up > 1 ? btn('усіх', () => {
          const cost = t.upgradeCost;
          const n = Math.min(up, cost ? Math.floor(pl.gold / cost) : up);
          pl.gold -= cost * upgradeStack(pp.troops, s, t.up[0], n);
          render();
        }, 'tiny') : null;
        table.append(h('tr', null,
          h('td', null, h('b', null, t.name), h('div', { class: 'muted', style: { fontSize: '12px' } }, `Рівень ${t.tier} · ${t.hp} здоров’я · платня ${t.wage}`)),
          h('td', null, TYPE_NAMES[t.type]),
          h('td', { class: 'num' }, s.count, s.wounded ? h('span', { class: 'bad' }, ` (${s.wounded} пор.)`) : ''),
          h('td', { style: { width: '90px' } }, t.up.length ? bar(Math.min(1, s.xp / (t.upgradeXp * Math.max(1, s.count))) || (up > 0 ? 1 : 0), 'xp') : h('span', { class: 'muted' }, 'еліта'), up ? h('div', { class: 'good', style: { fontSize: '12px' } }, `готові: ${up}`) : null),
          h('td', null, ...upBtns, upAll),
          h('td', { class: 'num' },
            btn('▲', () => { if (i > 0) { [pp.troops[i - 1], pp.troops[i]] = [pp.troops[i], pp.troops[i - 1]]; render(); } }, 'tiny', { disabled: i === 0, title: 'Вище (раніше виходять на поле бою)' }),
            btn('▼', () => { if (i < pp.troops.length - 1) { [pp.troops[i + 1], pp.troops[i]] = [pp.troops[i], pp.troops[i + 1]]; render(); } }, 'tiny', { disabled: i === pp.troops.length - 1 }),
            btn('✕', () => { if (confirm(`Розпустити одного воїна (${t.name})?`)) { removeTroops(pp.troops, s.id, 1, true); render(); } }, 'tiny danger', { title: 'Розпустити одного' }),
          ),
        ));
      });
      if (!pp.troops.length) table.append(h('tr', null, h('td', { colSpan: 6, class: 'muted' }, 'Ви подорожуєте самі. Наберіть добровольців у селах або найміть найманців у таверні.')));

      const pris = h('table', { class: 'list' }, h('tr', null, h('th', null, 'Полонені'), h('th', { class: 'num' }, 'К-сть'), h('th', null, '')));
      for (const p of pp.prisoners) {
        const t = TROOPS[p.id];
        pris.append(h('tr', null, h('td', null, t.name), h('td', { class: 'num' }, p.count),
          h('td', { class: 'num' },
            t.faction !== 'bandits' || t.tier <= 2 ? btn('Завербувати', () => {
              if (world.isPlayerFull()) return;
              // prisoners are reluctant: only some agree
              const willing = Math.max(1, Math.round(p.count * (0.3 + pl.skills.leadership * 0.05)));
              const n = Math.min(willing, world.partyLimit() - totalCount(pp.troops));
              removeTroops(pp.prisoners, p.id, n);
              addTroops(pp.troops, p.id, n);
              world.message(`${n} полонених погодилися служити вам.`, 'good');
              render();
            }, 'tiny', { disabled: world.isPlayerFull(), title: 'Частина полонених перейде на ваш бік' }) : null,
            btn('Відпустити', () => { pp.prisoners.splice(pp.prisoners.indexOf(p), 1); render(); }, 'tiny'),
          )));
      }
      const food = foodServings(pl.inventory);
      const perDay = Math.ceil((total + 1) / 3);
      const summary = h('p', null,
        `Розмір загону: `, h('b', null, `${total + 1} / ${limit + 1}`), ` · Поранені: ${woundedCount(pp.troops)} · Платня: `, h('b', { class: 'gold' }, world.weeklyWages()), ' на тиждень · Мораль: ', h('b', null, world.playerMorale()),
        ` · Провізія: ${food} порцій (${Math.floor(food / perDay)} ${plural(Math.floor(food / perDay), 'день', 'дні', 'днів')})`);
      const body = h('div', null, summary, table,
        pp.prisoners.length ? h('div', null, h('div', { class: 'section-title' }, `Полонені (${totalCount(pp.prisoners)} / ${world.prisonerLimit()})`), pris) : null,
        h('p', { class: 'muted', style: { fontSize: '13px' } }, 'Воїни отримують досвід у боях (і від навички «Тренер»). Порядок у списку визначає, хто першим виходить на поле бою.'),
      );
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: 'Загін', body, cls: 'wide', onClose: parentRefresh, footer: [btn('Готово', () => this.windows.close(win), 'primary')] });
    };
    render();
  },

  // ---- character ---------------------------------------------------------------------------

  openCharacter(parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    let win;
    const render = () => {
      const attrs = h('div', { class: 'stat-grid' });
      for (const [k, a] of Object.entries(ATTRIBUTES)) {
        attrs.append(h('span', { title: a.desc }, a.name), h('b', null, pl.attrs[k]), btn('+', () => {
          if (pl.attrPoints <= 0) return;
          pl.attrPoints--;
          pl.attrs[k]++;
          if (k === 'int') pl.skillPoints++;
          if (k === 'str') pl.hp += 1;
          render();
        }, 'tiny', { disabled: pl.attrPoints <= 0 }));
      }
      const skills = h('div', { class: 'stat-grid' });
      for (const [k, sk] of Object.entries(SKILLS)) {
        const max = maxSkillLevel(pl, k);
        skills.append(h('span', { title: `${sk.desc} Максимум: ${ATTRIBUTES[sk.attr].name}/3 = ${max}` }, sk.name, h('span', { class: 'muted', style: { fontSize: '12px' } }, ` (${ATTRIBUTES[sk.attr].name.slice(0, 3)})`)),
          h('b', null, pl.skills[k]), btn('+', () => {
            if (pl.skillPoints <= 0 || pl.skills[k] >= max) return;
            pl.skillPoints--;
            pl.skills[k]++;
            if (k === 'ironflesh') pl.hp += 3;
            render();
          }, 'tiny', { disabled: pl.skillPoints <= 0 || pl.skills[k] >= max, title: pl.skills[k] >= max ? 'Підвищіть атрибут' : sk.desc }));
      }
      const need = xpForNextLevel(pl.level);
      const rels = h('table', { class: 'list' });
      for (const f of FACTION_IDS) {
        const rel = Math.round(st.factions[f].relation);
        rels.append(h('tr', null, h('td', null, factionDot(FACTIONS[f].color), FACTIONS[f].name), h('td', { class: `num ${rel >= 0 ? 'good' : 'bad'}` }, rel)));
      }
      const body = h('div', { class: 'cols' },
        h('div', null,
          h('div', { class: 'section-title' }, pl.name),
          h('p', null, `Рівень ${pl.level} · Досвід ${pl.xp} / ${need}`), bar(pl.xp / need, 'xp'),
          h('p', null, `Здоров’я: ${Math.round(pl.hp)} / ${playerMaxHp(pl)} · Слава: ${pl.renown} · Золото: ${pl.gold}`),
          h('p', null, `Перемог: ${pl.battlesWon} · Повалено ворогів власноруч: ${pl.kills}`),
          h('div', { class: 'section-title' }, `Атрибути ${pl.attrPoints ? `(вільних очок: ${pl.attrPoints})` : ''}`),
          attrs,
          h('div', { class: 'section-title' }, 'Стосунки з фракціями'),
          rels,
        ),
        h('div', null,
          h('div', { class: 'section-title' }, `Навички ${pl.skillPoints ? `(вільних очок: ${pl.skillPoints})` : ''}`),
          skills,
          h('p', { class: 'muted', style: { fontSize: '13px' } }, 'Кожен рівень дає очко атрибуту і очко навички. Рівень навички не може перевищувати третину пов’язаного атрибута.'),
        ),
      );
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: 'Персонаж', body, cls: 'wide', onClose: parentRefresh, footer: [btn('Готово', () => this.windows.close(win), 'primary')] });
    };
    render();
  },

  // ---- inventory -------------------------------------------------------------------------------

  openInventory(parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    let win;
    const render = () => {
      const eq = pl.equipment;
      const grid = h('div', { class: 'equip-grid' });
      for (const slot of PLAYER_SLOTS) {
        const it = ITEMS[eq[slot]];
        grid.append(h('div', { class: 'slot' },
          h('div', { class: 'slot-name' }, PLAYER_SLOT_NAMES[slot]),
          it ? h('div', null, h('div', { class: 'item-name' }, it.name), h('div', { class: 'item-desc' }, describeItem(it)),
            btn('Зняти', () => {
              if (invLoad(pl.inventory) >= CARRY_CAPACITY) {
                this.toast('Немає місця в інвентарі');
                return;
              }
              invAdd(pl.inventory, eq[slot], 1);
              eq[slot] = null;
              render();
            }, 'tiny')) : h('div', { class: 'muted' }, '— порожньо —'),
        ));
      }
      const inv = h('table', { class: 'list' }, h('tr', null, h('th', null, 'Інвентар'), h('th', { class: 'num' }, 'К-сть'), h('th', null, '')));
      const sorted = [...pl.inventory].sort((a, b) => ITEMS[a.id].type.localeCompare(ITEMS[b.id].type));
      for (const e of sorted) {
        const it = ITEMS[e.id];
        const actions = [];
        if (isEquipment(e.id)) {
          for (const slot of slotsFor(it)) {
            actions.push(btn(slot.startsWith('w') ? `У ${slot.slice(1)}` : 'Вдягнути', () => {
              const old = eq[slot];
              if (it.twoHanded && eq.shield && false) return;
              invRemove(pl.inventory, e.id, 1);
              if (old) invAdd(pl.inventory, old, 1);
              eq[slot] = e.id;
              render();
            }, 'tiny', { title: `Вдягнути: ${PLAYER_SLOT_NAMES[slot]}` }));
          }
        }
        inv.append(h('tr', null,
          h('td', null, h('b', null, it.name), h('div', { class: 'muted', style: { fontSize: '12px' } }, describeItem(it))),
          h('td', { class: 'num' }, e.qty),
          h('td', { class: 'num' }, ...actions, ' ', it.type !== 'quest' ? btn('Викинути', () => { if (confirm(`Викинути ${it.name}?`)) { invRemove(pl.inventory, e.id, 1); render(); } }, 'tiny danger') : null),
        ));
      }
      if (!pl.inventory.length) inv.append(h('tr', null, h('td', { colSpan: 3, class: 'muted' }, 'Порожньо')));
      const body = h('div', { class: 'cols' },
        h('div', null, h('div', { class: 'section-title' }, 'Спорядження'), grid,
          h('p', { class: 'muted', style: { fontSize: '13px' } }, 'У бою: клавіша Q або коліщатко миші перемикають зброю 1–3. Дворучна зброя не дозволяє тримати щит.')),
        h('div', null, h('div', { class: 'section-title' }, `Інвентар (${invLoad(pl.inventory)} / ${CARRY_CAPACITY})`), inv),
      );
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: 'Спорядження та інвентар', body, cls: 'wide', onClose: parentRefresh, footer: [btn('Готово', () => this.windows.close(win), 'primary')] });
    };
    render();
  },

  // ---- journal ----------------------------------------------------------------------------------

  openJournal() {
    const world = this.game.world;
    const st = world.state;
    const active = st.quests.filter((q) => q.status === 'active');
    const qs = h('div', null);
    if (!active.length) qs.append(h('p', { class: 'muted' }, 'Активних завдань немає. Цехові майстри в містах шукають сміливців.'));
    for (const q of active) {
      qs.append(h('div', { class: 'slot', style: { marginBottom: '6px' } },
        h('div', { class: 'item-name' }, q.title), h('div', null, q.desc),
        h('div', { class: 'muted' }, `Залишилось днів: ${Math.max(0, q.deadline - world.day)} · Нагорода: ${q.reward} золота`)));
    }
    const contract = st.contract
      ? h('p', null, st.contract.vassal ? `Ви — васал: ${FACTIONS[st.contract.faction].name}.` : `Найманський контракт з ${FACTIONS[st.contract.faction].name} до дня ${st.contract.until}.`)
      : h('p', { class: 'muted' }, 'Ви — вільний найманець без сюзерена.');
    const owned = st.settlements.filter((s) => s.owner === 'player');
    const fiefs = owned.length ? h('p', null, `Ваші володіння: ${owned.map((s) => s.name).join(', ')}.`) : null;
    const log = h('div', { style: { maxHeight: '280px', overflow: 'auto', fontSize: '14px' } });
    for (const e of [...st.log].reverse().slice(0, 120)) {
      const { day, text } = formatHour(e.t);
      log.append(h('div', null, h('span', { class: 'muted' }, `День ${day}, ${text} — `), e.text));
    }
    const body = h('div', null, h('div', { class: 'section-title' }, 'Служба'), contract, fiefs, h('div', { class: 'section-title' }, 'Завдання'), qs, h('div', { class: 'section-title' }, 'Хроніка'), log);
    const win = this.windows.show({ title: 'Журнал', body, footer: [btn('Закрити', () => this.windows.close(win), 'primary')] });
  },

  // ---- factions ----------------------------------------------------------------------------------

  openFactions() {
    const world = this.game.world;
    const st = world.state;
    let win;
    const render = () => {
      const t = h('table', { class: 'list' }, h('tr', null, h('th', null, 'Фракція'), h('th', { class: 'num' }, 'Міста'), h('th', { class: 'num' }, 'Замки'), h('th', { class: 'num' }, 'Лорди'), h('th', null, 'Воює з'), h('th', { class: 'num' }, 'Стосунки'), h('th', null, '')));
      for (const f of FACTION_IDS) {
        const info = FACTIONS[f];
        const towns = st.settlements.filter((s) => s.faction === f && s.kind === 'town').length;
        const castles = st.settlements.filter((s) => s.faction === f && s.kind === 'castle').length;
        const lords = st.parties.filter((p) => p.faction === f && p.kind === 'lord').length;
        const wars = FACTION_IDS.filter((o) => o !== f && world.atWar(f, o)).map((o) => FACTIONS[o].short);
        const hostile = world.isHostile(f, 'player');
        const pw = st.wars[warKey('player', f)];
        if (pw) wars.push('вами');
        const rel = Math.round(st.factions[f].relation);
        const cost = this.peaceCost(f);
        t.append(h('tr', null,
          h('td', null, factionDot(info.color), h('b', null, info.name), st.factions[f].defeated ? h('span', { class: 'muted' }, ' (знищено)') : null, h('div', { class: 'muted', style: { fontSize: '12px' } }, info.king)),
          h('td', { class: 'num' }, towns), h('td', { class: 'num' }, castles), h('td', { class: 'num' }, lords),
          h('td', null, wars.join(', ') || '—'),
          h('td', { class: `num ${rel >= 0 ? 'good' : 'bad'}` }, rel, hostile ? h('div', { class: 'bad', style: { fontSize: '12px' } }, 'ворожі') : null),
          h('td', null, pw ? btn(`Мир (${cost})`, () => { this.makePeace(f); render(); }, 'tiny', { disabled: st.player.gold < cost }) : null),
        ));
      }
      const own = st.settlements.filter((s) => s.faction === 'player');
      const body = h('div', null, t,
        own.length ? h('p', null, h('b', null, 'Ваше королівство: '), own.map((s) => s.name).join(', ')) : null,
        h('p', { class: 'muted', style: { fontSize: '13px' } }, 'Ворожі фракції атакуватимуть ваш загін. Стосунки нижче −10 роблять фракцію ворожою. Найманець воює з ворогами свого наймача.'));
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: 'Фракції Кальдерії', body, cls: 'wide', footer: [btn('Закрити', () => this.windows.close(win), 'primary')] });
    };
    render();
  },
};

export { stacksWages, SLOT_NAMES };
