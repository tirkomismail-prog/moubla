// Settlement menus: towns, castles, villages and everything inside them.
import { h, btn, gameMenu, factionDot } from './dom.js';
import { scene } from './scenes.js';
import { rng } from '../core/rng.js';
import { plural } from '../core/util.js';
import { FACTIONS, factionInfo } from '../data/factions.js';
import { ITEMS, GOOD_IDS, FOOD_IDS, describeItem, isEquipment } from '../data/items.js';
import { TROOPS, RECRUITS, TYPE_NAMES } from '../data/troops.js';
import { SIEGE_HOURS, warKey } from '../world/world.js';
import { addTroops, removeTroops, totalCount, healthyCount, describeStacks } from '../world/party.js';
import {
  buyPrice, sellPrice, onTraded, invAdd, invRemove, invCount, invLoad, CARRY_CAPACITY, ransomPrice,
} from '../world/economy.js';
import { questsOffered, acceptQuest, deliverableQuests, completeDelivery } from '../world/quests.js';
import { startPlayerSiege, startSiegeAssault, startArena, siegeDefenders, applySiegeResult } from '../game/conflict.js';
import { autoResolve } from '../world/autoresolve.js';

const KIND_NAMES = { town: 'Місто', castle: 'Замок', village: 'Село' };
const MERC_PRICE = [0, 25, 60, 120, 210, 330];
const RUMORS = [
  'Кажуть, степові грабіжники тримаються подалі від гір — їхнім коням там важко.',
  'Купці шепочуть: сіль у північних містах дорожча, ніж будь-де.',
  'Досвідчені арбалетники легко пробивають навіть кольчугу. Бережіться роданських снайперів!',
  'Якщо удар летить зліва — блокуйте ліворуч. Так кажуть старі ветерани.',
  'Лицарі Вельмару нищівні в атаці, але в тісному бою їхні коні вразливі до списів.',
  'Хускарли Нордгейму б’ються як ведмеді. Краще засипати їх стрілами здалеку.',
  'Кінні лучники Каганату ніколи не приймають ближнього бою — тримайте щит напоготові.',
  'Хто володіє замком, той отримує щотижневий прибуток. Але й захищати його доведеться.',
  'Добрий хірург у загоні рятує життя: поранені виживають, а не гинуть.',
  'Кажуть, на арені можна добре заробити, якщо рука тверда.',
];

export const settlementScreens = {
  openSettlement(id) {
    const game = this.game;
    const world = game.world;
    const s = world.sById.get(id);
    if (!s) return;
    if (s.siege?.player) {
      this.openSiegeCamp(s);
      return;
    }
    s.visited = true;
    let win;
    const render = () => {
      if (!win) return;
      this.windows.update(win, { title: s.name, body: this.settlementBody(s, render, () => this.windows.close(win)) });
    };
    win = this.windows.show({ title: s.name, body: h('div'), cls: 'wide', onClose: () => game.onMenuClosed() });
    render();
  },

  settlementBody(s, refresh, leave) {
    const game = this.game;
    const world = game.world;
    const st = world.state;
    const f = factionInfo(s.faction);
    const hostile = world.isHostile(s.faction, 'player');
    const ownerName = s.owner === 'player' ? 'ви' : s.owner ? world.lById.get(s.owner)?.name : 'ніхто';
    const lines = [];
    lines.push(`${KIND_NAMES[s.kind]} ${s.name} — володіння ${f.name}. Власник: ${ownerName}.`);
    if (s.kind === 'village') {
      const fief = world.sById.get(s.boundTo);
      lines.push(`Село належить до ${fief ? fief.name : '—'}. Селяни займаються господарством${s.produces[0] ? `, тут виробляють ${ITEMS[s.produces[0]].name.toLowerCase()}` : ''}.`);
      lines.push(`Добровольців, готових вирушити з вами: ${s.volunteers}.`);
    } else {
      lines.push(`Гарнізон: близько ${Math.round(totalCount(s.garrison) / 5) * 5 || totalCount(s.garrison)} воїнів. Процвітання: ${s.prosperity}.`);
      const inside = st.parties.filter((p) => p.inside === s.id && p.kind === 'lord');
      if (inside.length) lines.push(`У стінах перебувають: ${inside.map((p) => world.lById.get(p.lordId)?.name).join(', ')}.`);
    }
    if (s.kind === 'town') {
      lines.push(`\nМісцеві товари: ${s.produces.map((g) => ITEMS[g].name).join(', ')}. Попит на: ${s.demands.map((g) => ITEMS[g].name).join(', ')}.`);
    }
    if (s.siege) lines.push(`\n⚠ Місто в облозі (${factionInfo(s.siege.faction).name})!`);
    if (hostile) lines.push('\nВорота зачинені перед вами: це ворожа територія.');

    const opts = [];
    if (hostile) {
      if (s.kind !== 'village') {
        opts.push({ label: '⚔ Взяти в облогу', onClick: () => {
          if (healthyCount(st.party.troops) < 3 && !confirm('У вас замало воїнів для облоги. Все одно розпочати?')) return;
          startPlayerSiege(world, s);
          leave();
          this.openSiegeCamp(s);
        } });
      }
      if (st.wars[warKey('player', s.faction)] && FACTIONS[s.faction]) {
        const cost = this.peaceCost(s.faction);
        opts.push({ label: `✉ Надіслати посланця з миром`, hint: `${cost} зол.`, disabled: st.player.gold < cost, onClick: () => { this.makePeace(s.faction); refresh(); } });
      }
    } else {
      if (s.kind === 'town') {
        opts.push({ label: '⚖ Ринок: товари і провізія', onClick: () => this.openMarket(s, refresh) });
        opts.push({ label: '⚒ Зброяр і кольчужник', onClick: () => this.openShop(s, refresh) });
        opts.push({ label: '🍺 Таверна', onClick: () => this.openTavern(s, refresh) });
        opts.push({ label: '⚔ Арена', hint: 'тренувальний бій', disabled: st.player.hp < 20, title: st.player.hp < 20 ? 'Ви надто поранені' : '', onClick: () => { leave(); startArena(game, s); } });
        const offered = questsOffered(world, s.id);
        opts.push({ label: '📜 Цеховий майстер (завдання)', hint: offered.length ? `${offered.length}` : '', onClick: () => this.openQuestBoard(s, refresh) });
      }
      if (s.kind === 'village') {
        opts.push({ label: '⚑ Набрати добровольців', hint: `${s.volunteers}`, onClick: () => this.openRecruit(s, refresh) });
        opts.push({ label: '⚖ Купити провізію', onClick: () => this.openMarket(s, refresh, true) });
      }
      for (const q of deliverableQuests(world, s.id)) {
        opts.push({ label: `📦 Доставити вантаж (${q.title})`, cls: 'primary', onClick: () => { completeDelivery(world, q); refresh(); } });
      }
      if (s.kind !== 'village') {
        opts.push({ label: '♛ Тронна зала', onClick: () => this.openHall(s, refresh) });
        if (s.owner === 'player') opts.push({ label: '⛨ Керувати гарнізоном', onClick: () => this.openGarrison(s, refresh) });
      }
      opts.push({ label: '☾ Відпочити до ранку', hint: 'лікування', disabled: !!s.siege, onClick: () => this.restIn(s, refresh) });
    }
    opts.push({ label: '← Покинути', onClick: leave });
    const kind = s.kind;
    return gameMenu({ text: lines.join('\n'), scene: scene(kind, f.color, st.time % 24), options: opts });
  },

  async restIn(s, refresh) {
    const game = this.game;
    const world = game.world;
    const hour = world.state.time % 24;
    const hours = hour < 7 ? 7 - hour : 31 - hour;
    world.state.party.graceUntil = world.state.time + hours + 0.5;
    await game.waitHours(hours, { heal: true });
    world.state.party.moraleBoost += 2;
    refresh();
  },

  peaceCost(faction) {
    const st = this.game.world.state;
    return 400 + st.player.renown * 3 + Math.max(0, -st.factions[faction].relation) * 10;
  },

  makePeace(faction) {
    const world = this.game.world;
    const st = world.state;
    const cost = this.peaceCost(faction);
    if (st.player.gold < cost) return;
    st.player.gold -= cost;
    delete st.wars[warKey('player', faction)];
    st.warSince[warKey('player', faction)] = world.day;
    st.factions[faction].relation = Math.max(0, st.factions[faction].relation);
    world.message(`${FACTIONS[faction].name} приймає ваші дари і погоджується на мир.`, 'good');
    // player-owned lands of that faction's enemies stay as they are
  },

  // ---- market -----------------------------------------------------------------------

  openMarket(s, parentRefresh, foodOnly = false) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    let win;
    const render = () => {
      const ids = foodOnly ? FOOD_IDS : [...FOOD_IDS, ...GOOD_IDS];
      const table = h('table', { class: 'list' },
        h('tr', null, h('th', null, 'Товар'), h('th', null, ''), h('th', { class: 'num' }, 'У вас'), h('th', { class: 'num' }, 'Купівля'), h('th', { class: 'num' }, 'Продаж'), h('th', null, '')));
      for (const id of ids) {
        const it = ITEMS[id];
        const have = invCount(pl.inventory, id);
        const bp = buyPrice(st, s, id);
        const sp = sellPrice(st, s, id);
        const mod = s.market[id] ?? 1;
        const tag = mod < 0.8 ? h('span', { class: 'pill', style: { background: '#3f7a3a' } }, 'дешево') : mod > 1.25 ? h('span', { class: 'pill', style: { background: '#a8322a' } }, 'попит') : null;
        const full = invLoad(pl.inventory) >= CARRY_CAPACITY;
        table.append(h('tr', null,
          h('td', null, it.name, ' ', h('span', { class: 'muted', style: { fontSize: '12px' } }, describeItem(it))),
          h('td', null, tag),
          h('td', { class: 'num' }, have || ''),
          h('td', { class: 'num gold' }, bp),
          h('td', { class: 'num' }, sp),
          h('td', { class: 'num' },
            btn('Купити', () => { if (pl.gold >= bp && !full) { pl.gold -= bp; invAdd(pl.inventory, id, 1); onTraded(s, id, true); render(); } }, 'small', { disabled: pl.gold < bp || full }),
            ' ',
            btn('Продати', () => { if (invRemove(pl.inventory, id, 1)) { pl.gold += sp; onTraded(s, id, false); render(); } }, 'small', { disabled: !have }),
          ),
        ));
      }
      const body = h('div', null,
        h('p', null, `Золото: `, h('b', { class: 'gold' }, pl.gold), ` · Вантаж: ${invLoad(pl.inventory)} / ${CARRY_CAPACITY}`,
          foodOnly ? null : h('span', { class: 'muted' }, ' · Ціни змінюються, коли ви купуєте або продаєте багато одного товару.')),
        table,
      );
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: foodOnly ? `Провізія — ${s.name}` : `Ринок — ${s.name}`, body, onClose: parentRefresh, footer: [btn('Готово', () => this.windows.close(win), 'primary')] });
    };
    render();
  },

  // ---- equipment shop -----------------------------------------------------------------

  openShop(s, parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    let win;
    const render = () => {
      const buyT = h('table', { class: 'list' }, h('tr', null, h('th', null, 'Товар'), h('th', { class: 'num' }, 'Ціна'), h('th', null, '')));
      const sorted = [...s.shop].sort((a, b) => ITEMS[a].type.localeCompare(ITEMS[b].type) || ITEMS[a].price - ITEMS[b].price);
      for (const id of sorted) {
        const it = ITEMS[id];
        const price = buyPrice(st, s, id);
        const full = invLoad(pl.inventory) >= CARRY_CAPACITY;
        buyT.append(h('tr', null,
          h('td', null, h('b', null, it.name), h('div', { class: 'muted', style: { fontSize: '12.5px' } }, describeItem(it))),
          h('td', { class: 'num gold' }, price),
          h('td', { class: 'num' }, btn('Купити', () => {
            if (pl.gold < price || full) return;
            pl.gold -= price;
            invAdd(pl.inventory, id, 1);
            render();
          }, 'small', { disabled: pl.gold < price || full })),
        ));
      }
      const sellT = h('table', { class: 'list' }, h('tr', null, h('th', null, 'Ваші речі'), h('th', { class: 'num' }, 'Ціна'), h('th', null, '')));
      const mine = pl.inventory.filter((e) => isEquipment(e.id));
      for (const e of mine) {
        const it = ITEMS[e.id];
        const price = sellPrice(st, s, e.id);
        sellT.append(h('tr', null,
          h('td', null, h('b', null, it.name), e.qty > 1 ? ` ×${e.qty}` : '', h('div', { class: 'muted', style: { fontSize: '12.5px' } }, describeItem(it))),
          h('td', { class: 'num' }, price),
          h('td', { class: 'num' }, btn('Продати', () => { invRemove(pl.inventory, e.id, 1); pl.gold += price; render(); }, 'small')),
        ));
      }
      if (!mine.length) sellT.append(h('tr', null, h('td', { colSpan: 3, class: 'muted' }, 'Немає зайвого спорядження. Трофеї з боїв з’являться тут.')));
      const body = h('div', null,
        h('p', null, 'Золото: ', h('b', { class: 'gold' }, pl.gold), ' · Куплене потрапляє до інвентаря — вдягніть його у вікні спорядження (I).'),
        h('div', { class: 'cols' }, h('div', null, h('div', { class: 'section-title' }, 'Продається'), buyT), h('div', null, h('div', { class: 'section-title' }, 'Продати'), sellT)),
      );
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: `Зброяр — ${s.name}`, body, cls: 'wide', onClose: parentRefresh, footer: [btn('Спорядження…', () => this.openInventory(render)), btn('Готово', () => this.windows.close(win), 'primary')] });
    };
    render();
  },

  // ---- tavern -----------------------------------------------------------------------------

  openTavern(s, parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    let win;
    const rumor = rng.pick(RUMORS);
    const render = () => {
      const parts = [];
      parts.push(h('p', { style: { fontStyle: 'italic' } }, `У кутку старий ветеран бурмоче: «${rumor}»`));
      // mercenaries
      parts.push(h('div', { class: 'section-title' }, 'Найманці'));
      if (s.tavern && s.tavern.count > 0) {
        const t = TROOPS[s.tavern.merc];
        const price = MERC_PRICE[t.tier];
        const space = world.partyLimit() - totalCount(st.party.troops);
        const n = Math.max(0, Math.min(s.tavern.count, space, Math.floor(pl.gold / price)));
        parts.push(h('p', null, `Загін найманців шукає роботу: ${t.name} ×${s.tavern.count} (${TYPE_NAMES[t.type]}, рівень ${t.tier}). Ціна: ${price} золота за кожного, платня ${t.wage}/тиждень.`));
        parts.push(h('div', null,
          btn(`Найняти ${n} за ${n * price} зол.`, () => {
            pl.gold -= n * price;
            addTroops(st.party.troops, t.id, n);
            s.tavern.count -= n;
            world.message(`До загону приєдналися найманці: ${t.name} ×${n}.`, 'good');
            render();
          }, 'primary', { disabled: n <= 0 }),
          space <= 0 ? h('span', { class: 'bad' }, ' Загін переповнений.') : null,
        ));
      } else parts.push(h('p', { class: 'muted' }, 'Найманців зараз немає. Загляньте наступного тижня.'));
      // ransom broker
      parts.push(h('div', { class: 'section-title' }, 'Посередник викупу'));
      if (st.party.prisoners.length) {
        const t = h('table', { class: 'list' });
        let total = 0;
        for (const p of st.party.prisoners) {
          const price = ransomPrice(st, p.id);
          total += price * p.count;
          t.append(h('tr', null, h('td', null, TROOPS[p.id].name), h('td', { class: 'num' }, `×${p.count}`), h('td', { class: 'num gold' }, `${price}`),
            h('td', { class: 'num' }, btn('Продати', () => { pl.gold += price * p.count; st.party.prisoners.splice(st.party.prisoners.indexOf(p), 1); render(); }, 'small'))));
        }
        parts.push(t, h('div', { style: { marginTop: '6px' } }, btn(`Продати всіх за ${total} зол.`, () => { pl.gold += total; st.party.prisoners = []; render(); }, 'primary')));
      } else parts.push(h('p', { class: 'muted' }, '«Приведи мені полонених — і я заплачу добрим сріблом.»'));
      // drinks
      const cost = 10 + totalCount(st.party.troops) * 2;
      parts.push(h('div', { class: 'section-title' }, 'Корчма'));
      parts.push(btn(`Пригостити загін (${cost} зол., +мораль)`, () => {
        pl.gold -= cost;
        st.party.moraleBoost += 8;
        world.message('Загін гучно святкує. Бойовий дух зростає!', 'good');
        render();
      }, '', { disabled: pl.gold < cost }));
      const body = h('div', null, h('p', null, 'Золото: ', h('b', { class: 'gold' }, pl.gold)), ...parts);
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: `Таверна — ${s.name}`, body, onClose: parentRefresh, footer: [btn('Вийти', () => this.windows.close(win), 'primary')] });
    };
    render();
  },

  // ---- villages ---------------------------------------------------------------------------

  openRecruit(s, parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    const t = TROOPS[RECRUITS[s.culture] || 'velmar_recruit'];
    const price = 10;
    let win;
    const render = () => {
      const rel = FACTIONS[s.faction] ? st.factions[s.faction].relation : 0;
      const space = world.partyLimit() - totalCount(st.party.troops);
      const n = Math.max(0, Math.min(s.volunteers, space, Math.floor(pl.gold / price)));
      const lines = [];
      if (rel < -5 && s.owner !== 'player') lines.push(h('p', { class: 'bad' }, 'Селяни не довіряють вам і відмовляються йти до загону.'));
      else {
        lines.push(h('p', null, `${s.volunteers} ${plural(s.volunteers, 'селянин готовий', 'селяни готові', 'селян готові')} стати під ваш прапор як «${t.name}». Спорядження коштує ${price} золота на кожного.`));
        lines.push(h('p', { class: 'muted' }, `Місце в загоні: ${Math.max(0, space)}. Новобранці з часом стають досвідченими воїнами ${FACTIONS[s.culture]?.name || ''}.`));
        lines.push(btn(`Набрати ${n} (${n * price} зол.)`, () => {
          pl.gold -= n * price;
          addTroops(st.party.troops, t.id, n);
          s.volunteers -= n;
          world.message(`До загону приєдналися ${n} новобранців.`, 'good');
          render();
        }, 'primary', { disabled: n <= 0 }));
      }
      const body = h('div', null, ...lines);
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: `Добровольці — ${s.name}`, body, cls: 'narrow', onClose: parentRefresh, footer: [btn('Готово', () => this.windows.close(win))] });
    };
    render();
  },

  // ---- quests ---------------------------------------------------------------------------------

  openQuestBoard(s, parentRefresh) {
    const world = this.game.world;
    let win;
    const render = () => {
      const offered = questsOffered(world, s.id);
      const body = h('div', null);
      if (!offered.length) body.append(h('p', { class: 'muted' }, '«Для вас роботи поки немає. Заходьте згодом.»'));
      for (const q of offered) {
        body.append(h('div', { class: 'slot', style: { marginBottom: '8px' } },
          h('div', { class: 'item-name' }, q.title),
          h('p', null, q.desc),
          h('div', null, `Нагорода: `, h('b', { class: 'gold' }, `${q.reward} золота`), ` · Термін: ${q.days} днів `, btn('Взятися', () => {
            const err = acceptQuest(world, q);
            if (err) this.toast(err);
            render();
          }, 'small primary')),
        ));
      }
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: `Цеховий майстер — ${s.name}`, body, cls: 'narrow', onClose: parentRefresh, footer: [btn('Готово', () => this.windows.close(win))] });
    };
    render();
  },

  // ---- lord's hall ----------------------------------------------------------------------------

  openHall(s, parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    const pl = st.player;
    const fid = s.faction;
    const f = factionInfo(fid);
    let win;
    const render = () => {
      const body = h('div', null);
      if (fid === 'player') {
        body.append(h('p', null, `Це ваша власна зала. Слуги схиляються, коли ви входите.`));
      } else {
        const info = FACTIONS[fid];
        const rel = Math.round(st.factions[fid].relation);
        const owner = s.owner === 'player' ? 'ви' : world.lById.get(s.owner)?.name || info.king;
        body.append(h('p', null, factionDot(info.color), h('b', null, info.name), ` — ${info.desc}`));
        body.append(h('p', null, `Господар зали: ${owner}. Правитель: ${info.king}. Ваші стосунки: `, h('b', { class: rel >= 0 ? 'good' : 'bad' }, rel), '.'));
        const enemies = Object.keys(FACTIONS).filter((o) => o !== fid && world.atWar(fid, o)).map((o) => FACTIONS[o].name);
        body.append(h('p', null, `Воює з: ${enemies.length ? enemies.join(', ') : 'ні з ким'}.`));
        const c = st.contract;
        if (!c) {
          const pay = world.contractPay();
          body.append(h('div', { class: 'section-title' }, 'Служба'));
          body.append(h('p', null, `«Нам завжди потрібні мечі. ${info.king} платитиме ${pay} золота щотижня за вашу службу впродовж 30 днів.» Ви воюватимете з ворогами ${info.short}.`));
          body.append(btn('Укласти найманський контракт', () => {
            st.contract = { faction: fid, until: world.day + 30, vassal: false };
            world.message(`Ви стали найманцем ${info.name}.`, 'good');
            world.changeRelation(fid, 3);
            render();
          }, 'primary', { disabled: rel < -5 }));
        } else if (c.faction === fid) {
          body.append(h('div', { class: 'section-title' }, 'Служба'));
          if (c.vassal) body.append(h('p', null, `Ви — васал ${info.name}. Захоплені вами замки та міста стають вашими ленами.`));
          else {
            body.append(h('p', null, `Ваш контракт діє до дня ${c.until}.`));
            body.append(btn('Продовжити контракт на 30 днів', () => { c.until = Math.max(c.until, world.day) + 30; render(); }));
            const canVassal = pl.renown >= 100 && rel >= 5;
            body.append(' ');
            body.append(btn('Присягнути на вірність (стати васалом)', () => {
              c.vassal = true;
              const village = st.settlements.find((v) => v.kind === 'village' && v.faction === fid && v.owner !== 'player');
              if (village) {
                village.owner = 'player';
                world.message(`${info.king} приймає вашу присягу і дарує вам село ${village.name}!`, 'good');
              }
              world.changeRelation(fid, 10);
              render();
            }, 'primary', { disabled: !canVassal, title: canVassal ? '' : 'Потрібно: слава 100 і стосунки 5' }));
            if (!canVassal) body.append(h('p', { class: 'muted' }, `Щоб стати васалом, потрібна слава 100 (у вас ${pl.renown}) і стосунки 5.`));
          }
        } else {
          body.append(h('p', { class: 'muted' }, `Ви служите ${FACTIONS[c.faction].name}. Тут вам нічого запропонувати.`));
        }
      }
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: `Тронна зала — ${s.name}`, body, onClose: parentRefresh, footer: [btn('Вийти', () => this.windows.close(win))] });
    };
    render();
    void f;
  },

  // ---- garrison ----------------------------------------------------------------------------------

  openGarrison(s, parentRefresh) {
    const world = this.game.world;
    const st = world.state;
    let win;
    const render = () => {
      const mk = (title, from, to, dir) => {
        const t = h('table', { class: 'list' }, h('tr', null, h('th', null, title), h('th', { class: 'num' }, 'К-сть'), h('th', null, '')));
        for (const stck of from) {
          const healthy = stck.count - stck.wounded;
          t.append(h('tr', null, h('td', null, TROOPS[stck.id].name), h('td', { class: 'num' }, stck.count, stck.wounded ? ` (${stck.wounded} пор.)` : ''),
            h('td', { class: 'num' },
              btn(dir, () => { move(from, to, stck.id, 1); }, 'small', { disabled: healthy <= 0 || (to === st.party.troops && world.isPlayerFull()) }),
              ' ',
              btn(`${dir}${dir}`, () => { move(from, to, stck.id, healthy); }, 'small', { disabled: healthy <= 0 || (to === st.party.troops && world.isPlayerFull()) }),
            )));
        }
        if (!from.length) t.append(h('tr', null, h('td', { colSpan: 3, class: 'muted' }, 'порожньо')));
        return t;
      };
      const move = (from, to, id, n) => {
        if (to === st.party.troops) n = Math.min(n, world.partyLimit() - totalCount(st.party.troops));
        const moved = removeTroops(from, id, n, false);
        addTroops(to, id, moved);
        render();
      };
      const body = h('div', null,
        h('p', { class: 'muted' }, 'Гарнізон захищає володіння під час облоги. Платня гарнізону — половина звичайної.'),
        h('div', { class: 'cols' }, h('div', null, mk('Ваш загін', st.party.troops, s.garrison, '→')), h('div', null, mk('Гарнізон', s.garrison, st.party.troops, '←'))),
      );
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: `Гарнізон — ${s.name}`, body, cls: 'wide', onClose: parentRefresh, footer: [btn('Готово', () => this.windows.close(win), 'primary')] });
    };
    render();
  },

  // ---- player siege camp -----------------------------------------------------------------------

  openSiegeCamp(s) {
    const game = this.game;
    const world = game.world;
    const st = world.state;
    let win;
    const leave = () => this.windows.close(win);
    const render = () => {
      if (!s.siege || !s.siege.player) {
        leave();
        return;
      }
      const prep = Math.min(SIEGE_HOURS * 0.66, st.time - s.siege.start);
      const need = SIEGE_HOURS * 0.66;
      const ready = prep >= need - 1e-6;
      const defenders = siegeDefenders(world, s);
      const gar = healthyCount(s.garrison) + defenders.reduce((a, p) => a + healthyCount(p.troops), 0);
      const text = [
        `Ви облягаєте ${s.name} (${factionInfo(s.faction).name}).`,
        `Захисників: близько ${gar}. ${defenders.length ? `У стінах: ${defenders.map((p) => p.name).join(', ')}.` : ''}`,
        `Ваших воїнів, здатних до бою: ${healthyCount(st.party.troops)}.`,
        ready ? '\nДрабини та облогова рампа готові. Можна штурмувати!' : `\nПідготовка до штурму: ${Math.floor(prep)} / ${Math.ceil(need)} годин.`,
        '\nОбережно: вороже військо може прийти на допомогу обложеним.',
      ].join('\n');
      const opts = [
        { label: '⚔ Штурмувати стіни!', cls: 'primary', disabled: !ready, onClick: () => { leave(); startSiegeAssault(game, s); } },
        { label: '⚑ Доручити штурм загону', disabled: !ready || healthyCount(st.party.troops) === 0, onClick: () => { leave(); this.autoAssault(s); } },
        { label: '⏳ Чекати підготовки', disabled: ready, onClick: async () => {
          const ev = await game.waitHours(Math.max(0.5, need - prep), { stopOnEvent: true });
          if (ev) {
            leave();
            game.handleWorldEvent(ev);
          } else render();
        } },
        { label: '✕ Зняти облогу', onClick: () => { s.siege = null; world.message(`Ви зняли облогу ${s.name}.`, 'info'); leave(); } },
        { label: '← Відійти від стін (облога триває)', onClick: leave },
      ];
      const body = gameMenu({ text, scene: scene('camp', factionInfo(s.faction).color, st.time % 24), options: opts });
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: `Облога: ${s.name}`, body, cls: 'wide', onClose: () => game.onMenuClosed() });
    };
    win = null;
    render();
  },

  autoAssault(s) {
    const game = this.game;
    const world = game.world;
    const st = world.state;
    const defenders = siegeDefenders(world, s);
    const res = autoResolve([
      { stacks: st.party.troops.map((t) => ({ key: 'player', troopId: t.id, count: t.count - t.wounded })), bonus: 1 + st.player.skills.tactics * 0.04, woundChance: 0.25 + st.player.skills.surgery * 0.05 },
      {
        stacks: [
          ...s.garrison.map((t) => ({ key: 'garrison', troopId: t.id, count: t.count - t.wounded })),
          ...defenders.flatMap((p) => p.troops.map((t) => ({ key: p.id, troopId: t.id, count: t.count - t.wounded }))),
        ],
        bonus: 1.4,
        woundChance: 0.3,
      },
    ]);
    const result = { outcome: res.winner === 0 ? 'victory' : 'autoDefeat', losses: res.losses, playerKills: [], auto: true };
    const summary = applySiegeResult(game, s, defenders, result);
    this.showBattleResult(summary);
  },
};

export { describeStacks };
