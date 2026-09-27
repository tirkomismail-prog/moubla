// Battle HUD: health, weapons, crosshair with attack/block direction, minimap,
// army counts, orders and messages.
import { h } from '../ui/dom.js';
import { ITEMS } from '../data/items.js';

const GROUP_NAMES = { inf: 'Піхота', arch: 'Стрільці', cav: 'Кіннота' };
const ORDER_NAMES = { hold: 'тримати позицію', follow: 'за мною', charge: 'в атаку' };

export class BattleHud {
  constructor(battle, root) {
    this.battle = battle;
    this.root = h('div', { class: 'bhud' });
    root.append(this.root);
    const dir = (cls) => h('div', { class: `dir ${cls}` });
    this.dirs = { left: dir('left'), right: dir('right'), up: dir('up'), down: dir('down') };
    this.inc = { left: dir('left'), right: dir('right'), up: dir('up'), down: dir('down') };
    this.ring = h('div', { class: 'ring' });
    this.cross = h('div', { class: 'crosshair' }, h('div', { class: 'dot' }), this.ring, ...Object.values(this.dirs), h('div', { class: 'incoming' }, ...Object.values(this.inc)));
    this.hpFill = h('div');
    this.horseFill = h('div');
    this.hpLabel = h('div', { class: 'label' });
    this.horseBar = h('div', { class: 'hbar horse' }, this.horseFill);
    this.horseLabel = h('div', { class: 'label' });
    this.bars = h('div', { class: 'bars' }, this.hpLabel, h('div', { class: 'hbar' }, this.hpFill), this.horseLabel, this.horseBar);
    this.weapons = h('div', { class: 'weapons' });
    this.counts = h('div', { class: 'counts' });
    this.mini = h('canvas', { class: 'minimap', width: 160, height: 160 });
    this.mctx = this.mini.getContext('2d');
    this.log = h('div', { class: 'blog' });
    this.orders = h('div', { class: 'orders' });
    this.center = h('div', { class: 'center-msg' });
    this.hint = h('div', { class: 'hint', style: { display: 'none' } });
    this.flash = h('div', { class: 'dmg-flash' });
    this.root.append(this.flash, this.cross, this.bars, this.weapons, this.counts, this.mini, this.log, this.orders, this.center, this.hint);
    this.msgs = [];
    this.cache = {};
    this.centerUntil = 0;
  }

  set(el, key, html) {
    if (this.cache[key] !== html) {
      this.cache[key] = html;
      el.innerHTML = html;
    }
  }

  message(text, color = '#f5ecd6') {
    const el = h('div', { style: { color } }, text);
    this.log.append(el);
    this.msgs.push({ el, t: performance.now() });
    while (this.msgs.length > 7) this.msgs.shift().el.remove();
  }

  centerMsg(text, secs = 2.5) {
    this.center.textContent = text;
    this.centerUntil = performance.now() + secs * 1000;
  }

  showHint(text) {
    if (!text) {
      this.hint.style.display = 'none';
      return;
    }
    this.hint.style.display = '';
    this.set(this.hint, 'hint', text);
  }

  damageFlash() {
    this.flash.style.boxShadow = 'inset 0 0 140px rgba(200,0,0,0.55)';
    clearTimeout(this.flashT);
    this.flashT = setTimeout(() => {
      this.flash.style.boxShadow = 'inset 0 0 120px rgba(200,0,0,0)';
    }, 120);
  }

  update() {
    const b = this.battle;
    const p = b.player;
    const now = performance.now();
    for (const m of this.msgs) m.el.style.opacity = now - m.t > 7000 ? '0' : '1';
    if (now > this.centerUntil) this.center.textContent = '';

    if (p && p.alive) {
      this.cross.style.display = '';
      this.hpFill.style.width = `${Math.max(0, (p.hp / p.maxHp) * 100)}%`;
      this.set(this.hpLabel, 'hp', `Здоров'я ${Math.max(0, Math.round(p.hp))} / ${p.maxHp}`);
      if (p.horse) {
        this.horseBar.style.display = '';
        this.horseLabel.style.display = '';
        this.horseFill.style.width = `${Math.max(0, (p.horse.hp / p.horse.maxHp) * 100)}%`;
        this.set(this.horseLabel, 'horse', `${p.horse.item.name} ${Math.round(p.horse.hp)} / ${p.horse.maxHp}${p.couched ? ' · <b style="color:#ffd66e">СПИС ОПУЩЕНО</b>' : ''}`);
      } else {
        this.horseBar.style.display = 'none';
        this.horseLabel.style.display = 'none';
      }
      // weapons
      const ws = p.weapons.map((id, i) => {
        const it = ITEMS[id];
        const ammo = it.slot === 'ranged' ? ` (${p.ammo[id] ?? 0})` : '';
        const warn = !p.canUseWeapon(it) ? ' ⛔' : '';
        return `<div class="w ${i === p.wi ? 'active' : ''}">${i + 1}. ${it.name}${ammo}${warn}</div>`;
      });
      if (p.shield) ws.push(`<div class="w ${p.activeShield() ? 'active' : ''}">⛨ ${ITEMS[p.shield].name}</div>`);
      this.set(this.weapons, 'w', ws.join(''));
      // direction indicators
      const ranged = p.isRanged();
      const selDir = b.input.attackDir;
      const map = { left: 'left', right: 'right', overhead: 'up', thrust: 'down' };
      const showDir = ranged ? null : p.action.s === 'block' ? p.action.blockDir : map[p.action.dir && (p.action.s === 'windup' || p.action.s === 'hold' || p.action.s === 'swing') ? p.action.dir : selDir];
      for (const [k, el] of Object.entries(this.dirs)) el.classList.toggle('on', k === showDir);
      for (const el of Object.values(this.dirs)) el.style.display = ranged ? 'none' : '';
      const inc = b.incoming;
      for (const [k, el] of Object.entries(this.inc)) el.classList.toggle('on', k === inc);
      // ranged spread ring
      if (ranged) {
        const px = Math.max(6, Math.min(80, p.spread() * 900));
        this.ring.style.display = '';
        this.ring.style.width = `${px * 2}px`;
        this.ring.style.height = `${px * 2}px`;
        this.ring.style.left = `${-px - 2}px`;
        this.ring.style.top = `${-px - 2}px`;
      } else this.ring.style.display = 'none';
    } else {
      this.cross.style.display = 'none';
      this.horseBar.style.display = 'none';
      this.horseLabel.style.display = 'none';
      this.hpFill.style.width = '0%';
      this.set(this.hpLabel, 'hp', 'Ви без тями');
    }

    // army counts
    if (b.config.kind === 'arena') {
      const alive = b.agents.filter((a) => a.alive).length;
      this.set(this.counts, 'c', `<div>На ногах: <b>${alive}</b></div><div>Повалено вами: <b>${b.playerKills.length}</b></div>`);
    } else {
      const c = b.teamCounts();
      this.set(this.counts, 'c', `<div class="ally">${b.sideName(0)}: <b>${c[0].alive}</b>${c[0].reserve ? ` (+${c[0].reserve})` : ''}</div><div class="enemy">${b.sideName(1)}: <b>${c[1].alive}</b>${c[1].reserve ? ` (+${c[1].reserve})` : ''}</div>`);
    }
    // orders
    if (b.config.kind !== 'arena') {
      const sel = b.input.selected;
      const g = b.teams[0].groups;
      const parts = ['inf', 'arch', 'cav'].map((k, i) => `<span class="grp ${sel.has(k) ? 'sel' : ''}">${i + 1} ${GROUP_NAMES[k]}: ${ORDER_NAMES[g[k].order]}${k === 'arch' && !g[k].fire ? ' (не стріляти)' : ''}</span>`);
      this.set(this.orders, 'o', `${parts.join('')}<br><span style="opacity:.75">Z — тримати · X — за мною · C — атака · V — стрільба · Tab — відступ · Esc — пауза</span>`);
    } else {
      this.set(this.orders, 'o', '<span style="opacity:.75">Арена: б\'ються всі проти всіх. Tab — вийти з арени · Esc — пауза</span>');
    }
    this.drawMinimap();
  }

  drawMinimap() {
    const b = this.battle;
    const ctx = this.mctx;
    const W = 160;
    ctx.clearRect(0, 0, W, W);
    const p = b.player && b.player.alive ? b.player : b.camTarget;
    const range = b.config.kind === 'arena' ? 35 : 120;
    const cx = p ? p.pos.x : 0;
    const cz = p ? p.pos.z : 0;
    const yaw = b.camYaw;
    const s = W / 2 / range;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const toMap = (x, z) => {
      const dx = x - cx;
      const dz = z - cz;
      // rotate so that the camera direction points up
      const rx = dx * cy - dz * sy;
      const rz = dx * sy + dz * cy;
      return [W / 2 - rx * s, W / 2 - rz * s];
    };
    if (b.terrain.fort) {
      const f = b.terrain.fort;
      ctx.strokeStyle = 'rgba(200,200,200,0.6)';
      ctx.beginPath();
      const pts = [[f.x0, f.z0], [f.x1, f.z0], [f.x1, f.z1], [f.x0, f.z1]].map(([x, z]) => toMap(x, z));
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.stroke();
    }
    for (const a of b.agents) {
      if (!a.alive) continue;
      const [x, y] = toMap(a.pos.x, a.pos.z);
      if (x < 0 || y < 0 || x > W || y > W) continue;
      ctx.fillStyle = a.isPlayer ? '#fff' : b.config.kind === 'arena' ? '#ffb070' : a.team === 0 ? '#6fb8ff' : '#ff6a5a';
      const r = a.isPlayer ? 3.2 : a.horse ? 2.4 : 1.8;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }
}
