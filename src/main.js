// Entry point: game modes (menu / map / battle), main loop, saving.
import { createNewState, World } from './world/world.js';
import { MapView } from './map/mapview.js';
import { UI } from './ui/ui.js';
import { MapHud } from './ui/hud.js';
import { Sfx } from './core/audio.js';
import { Battle } from './battle/battle.js';
import { loadCharacters, charactersReady } from './battle/character.js';
import { setUidCounter } from './core/util.js';
import { FACTIONS } from './data/factions.js';
import * as conflict from './game/conflict.js';
const { playerHero } = conflict;

const SAVE_PREFIX = 'kinklynok-save-';
const SETTINGS_KEY = 'kinklynok-settings';
const SAVE_SLOTS = ['auto', '1', '2', '3'];
const HOURS_PER_SECOND = 1.6;

const DEFAULT_SETTINGS = {
  battleSize: 60,
  sensitivity: 1,
  invertY: false,
  autoBlock: true,
  shadows: true,
  graphics: 'medium',
  quality: 1,
  volume: 0.6,
  mapSpeed: 1,
  playerDamage: 0.75,
};

function safeStorage() {
  try {
    const k = '__kk_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch {
    const mem = new Map();
    return {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
      removeItem: (k) => mem.delete(k),
    };
  }
}

class Game {
  constructor() {
    this.storage = safeStorage();
    this.settings = { ...DEFAULT_SETTINGS };
    try {
      Object.assign(this.settings, JSON.parse(this.storage.getItem(SETTINGS_KEY) || '{}'));
    } catch {
      /* ignore broken settings */
    }
    this.canvas = document.getElementById('map-canvas');
    this.battleRoot = document.getElementById('battle-root');
    this.uiRoot = document.getElementById('ui-root');
    this.sfx = new Sfx(this.settings);
    this.ui = new UI(this, this.uiRoot);
    this.map = new MapView(this.canvas, this);
    this.map.onClickEntity = (hit, x, y) => this.onMapClick(hit, x, y);
    this.hud = null;
    this.world = null;
    this.mode = 'menu';
    this.waiting = false;
    this.speed = 1;
    this.battle = null;
    this.busy = false; // waitHours in progress
    this.lastT = performance.now();
    this.lastAutosaveDay = 0;
    this.bindKeys();
    window.addEventListener('pointerdown', () => this.sfx.resume(), { once: false });
    this.ui.showMainMenu();
    // realistic soldier models (packed in dist/characters.js); parsed once
    this.charactersLoading = loadCharacters();
    requestAnimationFrame((t) => this.loop(t));
  }

  saveSettings() {
    try {
      this.storage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      /* ignore */
    }
  }

  // ---- lifecycle ---------------------------------------------------------------------

  newGame(opts) {
    const done = this.ui.loading('Творення світу…');
    setTimeout(() => {
      try {
        const state = createNewState(opts);
        this.setWorld(new World(state));
        const w = this.world;
        const start = w.sById.get(state.startTown);
        w.message(`Ваша подорож починається біля міста ${start.name}.`, 'good');
        done();
        this.map.centerOnPlayer();
        this.map.cam.zoom = 1.2;
        this.showIntro(start);
      } catch (e) {
        done();
        console.error(e);
        this.ui.toast(`Помилка створення світу: ${e.message}`, 6000);
      }
    }, 30);
  }

  showIntro(start) {
    const f = FACTIONS[start.faction];
    const text = `Ви прибуваєте до міста ${start.name}, що належить ${f.name}. Кальдерія роздерта війнами: чотири держави змагаються за землі, а на дорогах господарюють розбійники.\n\nЗберіть загін, здобудьте славу і багатство — служіть королям або збудуйте власне королівство.\n\nПорада: наберіть добровольців у найближчому селі, купіть провізію на ринку і полюйте на розбійників. Клацайте по мапі, щоб рухатися.`;
    this.ui.windows.show({
      title: 'Початок пригоди',
      body: this.ui.introBody ? this.ui.introBody(text) : document.createTextNode(text),
      cls: 'narrow',
      onClose: () => this.ui.openSettlement(start.id),
      footer: [],
    });
    // simple default body with a button
    const top = this.ui.windows.stack[this.ui.windows.stack.length - 1];
    top.body.style.whiteSpace = 'pre-line';
    const b = document.createElement('button');
    b.className = 'btn primary';
    b.textContent = `Увійти до міста ${start.name}`;
    b.onclick = () => this.ui.windows.close(top);
    top.footer.style.display = '';
    top.footer.append(b);
  }

  setWorld(world) {
    this.world = world;
    setUidCounter(world.state.nextId + 1);
    this.ui.clearScreen();
    this.ui.windows.closeAll();
    this.map.buildTexture(world);
    if (this.hud) this.hud.root.remove();
    this.hud = new MapHud(this, this.uiRoot);
    for (const e of world.state.log.slice(-5)) this.hud.pushLog(e.text, e.kind);
    world.on('message', ({ text, kind }) => this.hud && this.hud.pushLog(text, kind));
    world.on('day', ({ day }) => {
      if (day - this.lastAutosaveDay >= 3) {
        this.lastAutosaveDay = day;
        this.autosave();
      }
    });
    this.mode = 'map';
    this.canvas.style.display = '';
    this.waiting = false;
    this.lastAutosaveDay = world.day;
  }

  quitToMenu() {
    this.autosave();
    this.world = null;
    if (this.hud) this.hud.root.remove();
    this.hud = null;
    this.mode = 'menu';
    this.ui.showMainMenu();
  }

  // ---- saving --------------------------------------------------------------------------

  saveGame(slot) {
    if (!this.world) return false;
    const st = this.world.state;
    const info = { name: st.player.name, level: st.player.level, day: this.world.day, savedAt: Date.now() };
    try {
      this.storage.setItem(SAVE_PREFIX + slot, JSON.stringify({ info, state: st }));
      return true;
    } catch (e) {
      console.error(e);
      this.ui.toast('Не вдалося зберегти гру');
      return false;
    }
  }

  autosave() {
    if (this.world && this.mode === 'map' && !this.world.skipping) this.saveGame('auto');
  }

  listSaves() {
    return SAVE_SLOTS.map((slot) => {
      let info = null;
      try {
        const raw = this.storage.getItem(SAVE_PREFIX + slot);
        if (raw) info = JSON.parse(raw).info;
      } catch {
        info = null;
      }
      return { slot, info };
    });
  }

  deleteSave(slot) {
    this.storage.removeItem(SAVE_PREFIX + slot);
  }

  loadGame(slot) {
    const raw = this.storage.getItem(SAVE_PREFIX + slot);
    if (!raw) return;
    const done = this.ui.loading('Завантаження…');
    setTimeout(() => {
      try {
        const { state } = JSON.parse(raw);
        this.setWorld(new World(state));
        this.map.centerOnPlayer();
        done();
        this.ui.toast('Гру завантажено');
      } catch (e) {
        done();
        console.error(e);
        this.ui.toast(`Збереження пошкоджене: ${e.message}`, 5000);
      }
    }, 30);
  }

  // ---- map interaction -------------------------------------------------------------------

  onMapClick(hit, x, y) {
    if (this.mode !== 'map' || !this.world || this.ui.windows.open || this.busy) return;
    const w = this.world;
    const pp = w.state.party;
    this.waiting = false;
    let ok = true;
    if (!hit) ok = w.orderPlayerMove(x, y);
    else if (hit.type === 'settlement') {
      const s = hit.e;
      if (Math.hypot(s.x - pp.x, s.y - pp.y) < 24) {
        w.stopPlayer();
        this.ui.openSettlement(s.id);
        return;
      }
      ok = w.orderPlayerTarget('settlement', s.id);
    } else if (hit.type === 'party') ok = w.orderPlayerTarget('party', hit.id);
    else if (hit.type === 'battle') ok = w.orderPlayerTarget('battle', hit.id);
    else if (hit.type === 'player') {
      w.stopPlayer();
      return;
    }
    if (!ok) this.ui.toast('Туди неможливо дістатися');
    else this.map.follow = true;
  }

  handleWorldEvent(ev) {
    this.waiting = false;
    if (!ev) return;
    if (ev.type === 'settlement') this.ui.openSettlement(ev.id);
    else if (ev.type === 'encounter') this.ui.openEncounter(ev.id, ev.initiator);
    else if (ev.type === 'battleSite') this.ui.openBattleSite(ev.id);
  }

  onMenuClosed() {
    // nothing to do: the loop resumes time only when the player moves or waits
  }

  toggleWait() {
    if (this.ui.windows.open) return;
    this.waiting = !this.waiting;
    if (this.waiting) this.world.stopPlayer();
  }

  setSpeed(s) {
    this.speed = s;
  }

  // Advance time quickly while a menu is open (resting, sieges). Resolves with
  // a world event if one interrupts and stopOnEvent is set.
  waitHours(hours, opts = {}) {
    const w = this.world;
    this.busy = true;
    w.state.party.resting = !!opts.heal;
    return new Promise((resolve) => {
      let left = hours;
      const step = () => {
        const chunk = Math.min(left, 1);
        left -= chunk;
        const ev = w.advance(chunk);
        if (this.hud) this.hud.update();
        if ((ev && opts.stopOnEvent) || left <= 1e-6) {
          this.busy = false;
          w.state.party.resting = false;
          resolve(ev && opts.stopOnEvent ? ev : null);
          return;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // ---- battles -----------------------------------------------------------------------------

  startBattle(config, onFinish) {
    if (!charactersReady() && this.charactersLoading && !this._waitedCharacters) {
      // the models are still being parsed (a moment after start-up): wait for them
      this._waitedCharacters = true;
      const done = this.ui.loading('Підготовка битви…');
      this.charactersLoading.then(() => {
        done();
        this.startBattle(config, onFinish);
      });
      return;
    }
    this.ui.windows.closeAll();
    this.mode = 'battle';
    this.waiting = false;
    this.canvas.style.display = 'none';
    if (this.hud) this.hud.show(false);
    this.battleRoot.style.display = 'block';
    this.sfx.resume();
    try {
      this.battle = new Battle(this, this.battleRoot, config, (result) => {
        this.battle = null;
        this.battleRoot.style.display = 'none';
        this.battleRoot.innerHTML = '';
        this.canvas.style.display = '';
        if (this.hud) this.hud.show(true);
        this.mode = 'map';
        onFinish(result);
      });
    } catch (e) {
      console.error(e);
      this.battle = null;
      this.battleRoot.style.display = 'none';
      this.battleRoot.innerHTML = '';
      this.canvas.style.display = '';
      if (this.hud) this.hud.show(true);
      this.mode = 'map';
      this.ui.toast(`Не вдалося почати битву: ${e.message}`, 6000);
      // release the parties involved as if the player had withdrawn
      onFinish({ outcome: 'retreat', losses: [new Map(), new Map()], playerKills: [], aborted: true });
    }
  }

  // Debug helper (used by automated tests): start a synthetic battle.
  debugBattle(kind = 'field', opts = {}) {
    if (!this.world) this.setWorld(new World(createNewState({ seed: 7, background: opts.background || 'knight' })));
    const allies = opts.allies || [['velmar_footman', 8], ['velmar_crossbow', 5], ['velmar_knight', 3]];
    const enemies = opts.enemies || [['nord_trained', 8], ['nord_archer', 5], ['kag_horse_archer', 3]];
    const config = {
      kind,
      terrain: opts.terrain || 'plains',
      hour: opts.hour ?? 12,
      sides: [
        { name: 'Ваші сили', units: allies.map(([troopId, count]) => ({ key: 'player', troopId, count })), hero: playerHero(this.world) },
        { name: 'Вороги', units: enemies.map(([troopId, count]) => ({ key: 'enemy', troopId, count })) },
      ],
      factionColors: ['#3f6fb5', '#a8322a'],
      arenaFighters: 7,
      fortName: 'Тестова фортеця',
    };
    this.startBattle(config, (result) => {
      this.lastDebugResult = result;
    });
    return this.battle;
  }

  // ---- input & loop ---------------------------------------------------------------------------

  bindKeys() {
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (this.mode === 'battle') return; // battle handles its own input
      if (this.mode !== 'map') return;
      if (e.code === 'Escape') {
        if (!this.ui.windows.closeTop()) this.ui.openGameMenu();
        e.preventDefault();
        return;
      }
      if (this.ui.windows.open || this.busy) return;
      this.map.keys.add(e.code);
      switch (e.code) {
        case 'Space':
          this.toggleWait();
          e.preventDefault();
          break;
        case 'KeyP':
          this.ui.openParty();
          break;
        case 'KeyC':
          this.ui.openCharacter();
          break;
        case 'KeyI':
          this.ui.openInventory();
          break;
        case 'KeyJ':
        case 'KeyQ':
          this.ui.openJournal();
          break;
        case 'KeyF':
          this.ui.openFactions();
          break;
        case 'Home':
          this.map.centerOnPlayer();
          break;
        default:
      }
    });
    window.addEventListener('keyup', (e) => this.map.keys.delete(e.code));
    window.addEventListener('blur', () => this.map.keys.clear());
  }

  loop(t) {
    const dt = Math.min(0.1, (t - this.lastT) / 1000);
    this.lastT = t;
    try {
      if (this.mode === 'map' && this.world) {
        const w = this.world;
        if (!this.ui.windows.open && !this.busy) {
          if (w.playerMoving() || this.waiting) {
            const hours = dt * HOURS_PER_SECOND * this.speed * (this.settings.mapSpeed || 1);
            const ev = w.advance(hours);
            if (ev) this.handleWorldEvent(ev);
          }
        }
        this.map.update(dt);
        this.map.draw();
        if (this.hud) this.hud.update();
      } else if (this.mode === 'battle' && this.battle) {
        this.battle.frame(dt);
      }
    } catch (e) {
      console.error(e);
      this.ui.toast(`Помилка: ${e.message}`, 5000);
    }
    requestAnimationFrame((tt) => this.loop(tt));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
  window.__conflict = conflict;
});
