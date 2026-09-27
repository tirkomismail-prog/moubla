// World-map HUD: top status bar, side buttons, time controls, message log, tooltip.
import { h, btn } from './dom.js';
import { formatHour, plural } from '../core/util.js';
import { totalCount, woundedCount, describeStacks } from '../world/party.js';
import { factionInfo } from '../data/factions.js';
import { playerMaxHp } from '../data/character.js';
import { TROOPS } from '../data/troops.js';

export class MapHud {
  constructor(game, root) {
    this.game = game;
    this.root = h('div', { class: 'map-hud' });
    root.append(this.root);
    this.top = h('div', { class: 'hud-top' });
    this.left = h('div', { class: 'hud-left' },
      this.sideBtn('⚔ Загін', 'P', () => game.ui.openParty()),
      this.sideBtn('☺ Персонаж', 'C', () => game.ui.openCharacter()),
      this.sideBtn('⚒ Спорядження', 'I', () => game.ui.openInventory()),
      this.sideBtn('✉ Журнал', 'J', () => game.ui.openJournal()),
      this.sideBtn('⚑ Фракції', 'F', () => game.ui.openFactions()),
      this.sideBtn('☰ Меню', 'Esc', () => game.ui.openGameMenu()),
    );
    this.waitBtn = btn('⏳ Чекати', () => game.toggleWait(), 'small');
    this.speedBtns = [1, 2, 4].map((s) => btn(`×${s}`, () => game.setSpeed(s), 'small'));
    this.status = h('div', { class: 'status' }, '');
    this.time = h('div', { class: 'hud-time' },
      h('div', { class: 'row' }, this.waitBtn, ...this.speedBtns),
      this.status,
      btn('◎ До загону', () => game.map.centerOnPlayer(), 'small'),
    );
    this.log = h('div', { class: 'log' });
    this.tooltip = h('div', { class: 'tooltip', style: { display: 'none' } });
    this.root.append(this.top, this.left, this.time, this.log, this.tooltip);
    this.entries = [];
    this.lastTop = '';
  }

  sideBtn(label, key, fn) {
    return h('button', { class: 'btn', onclick: fn }, label, h('span', { class: 'key' }, key));
  }

  show(v) {
    this.root.style.display = v ? '' : 'none';
  }

  pushLog(text, kind = 'info') {
    const el = h('div', { class: `entry ${kind}` }, text);
    this.log.append(el);
    this.entries.push({ el, t: performance.now() });
    while (this.entries.length > 7) this.entries.shift().el.remove();
  }

  update() {
    const game = this.game;
    const world = game.world;
    if (!world) return;
    const st = world.state;
    const p = st.player;
    const { day, text } = formatHour(st.time);
    const food = world.carryFood();
    const eaters = totalCount(st.party.troops) + 1;
    const days = Math.floor(food / Math.max(1, Math.ceil(eaters / 3)));
    const morale = world.playerMorale();
    const wounded = woundedCount(st.party.troops);
    const html = `
      <div class="stat">День <b>${day}</b> · ${text}${world.isNight() ? ' ☾' : ' ☀'}</div>
      <div class="stat">Золото <b>${p.gold}</b></div>
      <div class="stat">Загін <b>${totalCount(st.party.troops) + 1 + world.companionCount()}</b>/${world.partyLimit() + 1}${wounded ? ` <span style="color:#f99">(${wounded} пор.)</span>` : ''}</div>
      <div class="stat">Провізія <b>${food}</b> (${days} ${plural(days, 'день', 'дні', 'днів')})</div>
      <div class="stat">Мораль <b>${morale}</b></div>
      <div class="stat">Здоров'я <b>${Math.round(p.hp)}</b>/${playerMaxHp(p)}</div>`;
    if (html !== this.lastTop) {
      this.top.innerHTML = html;
      this.lastTop = html;
    }
    const moving = world.playerMoving();
    this.status.textContent = moving ? 'Загін у дорозі…' : game.waiting ? 'Очікування…' : 'Пауза — клацніть по мапі';
    this.waitBtn.classList.toggle('active', game.waiting);
    this.speedBtns.forEach((b, i) => b.classList.toggle('active', game.speed === [1, 2, 4][i]));

    const now = performance.now();
    for (const e of this.entries) {
      const age = now - e.t;
      e.el.style.opacity = age > 9000 ? '0' : '1';
    }
    this.updateTooltip();
  }

  updateTooltip() {
    const game = this.game;
    const hov = game.map.hover;
    const tt = this.tooltip;
    if (!hov || game.ui.windows.open) {
      tt.style.display = 'none';
      return;
    }
    const world = game.world;
    let html = '';
    if (hov.type === 'settlement') {
      const s = hov.e;
      const f = factionInfo(s.faction);
      const kind = { town: 'Місто', castle: 'Замок', village: 'Село' }[s.kind];
      const owner = s.owner === 'player' ? 'ви' : s.owner ? world.lById.get(s.owner)?.name : '—';
      html = `<div class="t-title">${s.name}</div>${kind} · <span style="color:${f.color}">■</span> ${f.name}<br>Власник: ${owner}`;
      if (s.kind !== 'village') html += `<br>Гарнізон: ~${roughly(totalCount(s.garrison))}`;
      if (s.siege) html += '<br><span style="color:#f77">В облозі!</span>';
      if (world.isHostile(s.faction, 'player')) html += '<br><span style="color:#f77">Ворожа територія</span>';
    } else if (hov.type === 'party') {
      const p = hov.e;
      const f = factionInfo(p.faction);
      const n = totalCount(p.troops);
      const rel = world.strength(p) / Math.max(1, world.strength(world.state.party));
      const cmp = rel > 1.6 ? 'значно сильніші за вас' : rel > 1.1 ? 'сильніші за вас' : rel > 0.8 ? 'рівні вам' : rel > 0.5 ? 'слабші за вас' : 'значно слабші';
      const hostile = world.isHostile(p.faction, 'player');
      html = `<div class="t-title">${p.name}</div><span style="color:${f.color}">■</span> ${f.name}<br>Воїнів: ${n} — ${cmp}<br><span class="muted">${describeStacks(p.troops, 3)}</span>`;
      html += `<br>${hostile ? '<span style="color:#f77">Ворожі до вас</span>' : '<span style="color:#9e9">Не ворожі</span>'}`;
      html += `<br><span class="muted">${modeName(p)}</span>`;
    } else if (hov.type === 'battle') {
      const b = hov.e;
      const names = b.sides.map((s) => s.map((id) => world.pById.get(id)?.name).filter(Boolean).join(', '));
      html = `<div class="t-title">Битва</div>${names[0]}<br>проти<br>${names[1]}<br><span class="muted">Клацніть, щоб приєднатися</span>`;
    } else if (hov.type === 'player') {
      html = `<div class="t-title">${world.state.player.name}</div>Ваш загін: ${totalCount(world.state.party.troops) + 1}<br><span class="muted">${describeStacks(world.state.party.troops, 4)}</span>`;
    }
    tt.innerHTML = html;
    tt.style.display = 'block';
    const mx = game.map.mouse.x;
    const my = game.map.mouse.y;
    const w = tt.offsetWidth;
    tt.style.left = `${Math.min(window.innerWidth - w - 8, mx + 16)}px`;
    tt.style.top = `${Math.min(window.innerHeight - tt.offsetHeight - 8, my + 16)}px`;
  }
}

function roughly(n) {
  if (n < 10) return n;
  return Math.round(n / 10) * 10;
}

function modeName(p) {
  switch (p.ai?.mode) {
    case 'hunt':
      return 'Переслідує ворога';
    case 'flee':
      return 'Тікає';
    case 'siege':
      return p.ai.besieging ? 'Тримає облогу' : 'Йде в похід';
    case 'patrol':
      return 'Патрулює';
    case 'return':
      return 'Повертається додому';
    case 'defend':
      return 'Поспішає на допомогу';
    case 'travel':
      return 'Прямує до міста';
    case 'roam':
      return 'Блукає околицями';
    default:
      return 'Відпочиває';
  }
}

export function troopLine(id) {
  const t = TROOPS[id];
  return `${t.name} (рівень ${t.tier})`;
}
