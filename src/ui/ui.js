// UI facade: main menu, character creation, settings, saves and the in-game menu.
// Screen groups live in separate modules and are mixed into this class.
import { h, btn, WindowManager } from './dom.js';
import { BACKGROUNDS, ATTRIBUTES } from '../data/character.js';
import { settlementScreens } from './settlement.js';
import { panelScreens } from './panels.js';
import { encounterScreens } from './encounter.js';

export class UI {
  constructor(game, root) {
    this.game = game;
    this.root = root;
    this.windows = new WindowManager(root);
    this.screen = null;
  }

  clearScreen() {
    if (this.screen) this.screen.remove();
    this.screen = null;
  }

  toast(text, ms = 2200) {
    const el = h('div', { class: 'toast' }, text);
    this.root.append(el);
    setTimeout(() => el.remove(), ms);
  }

  loading(text) {
    const el = h('div', { class: 'loading' }, text);
    this.root.append(el);
    return () => el.remove();
  }

  // ---- main menu ---------------------------------------------------------------

  showMainMenu() {
    this.clearScreen();
    this.windows.closeAll();
    const game = this.game;
    const saves = game.listSaves();
    const latest = saves.filter((s) => s.info).sort((a, b) => b.info.savedAt - a.info.savedAt)[0];
    const scr = h('div', { class: 'screen' },
      h('div', { class: 'title-block' },
        h('h1', null, 'Кінь і Клинок'),
        h('div', { class: 'subtitle' }, 'Хроніки Кальдерії'),
        h('div', { class: 'menu-list' },
          latest ? btn(`Продовжити (${latest.info.name}, день ${latest.info.day})`, () => game.loadGame(latest.slot), 'primary') : null,
          btn('Нова гра', () => this.showCharacterCreation(), latest ? '' : 'primary'),
          btn('Завантажити', () => this.openSaveLoad(false)),
          btn('Налаштування', () => this.openSettings()),
          btn('Як грати', () => this.openHelp()),
        ),
        h('div', { class: 'footer' }, 'Середньовічна пісочниця в дусі Mount & Blade · кінні битви, облоги, торгівля та політика'),
      ),
    );
    this.root.append(scr);
    this.screen = scr;
  }

  showCharacterCreation() {
    let bg = 'knight';
    const name = h('input', { type: 'text', value: 'Ярослав', maxLength: 24 });
    const grid = h('div', { class: 'choice-grid' });
    const details = h('div', { class: 'muted', style: { marginTop: '10px', minHeight: '60px' } });
    const renderChoices = () => {
      grid.innerHTML = '';
      for (const [id, b] of Object.entries(BACKGROUNDS)) {
        grid.append(h('div', { class: `choice ${id === bg ? 'selected' : ''}`, onclick: () => { bg = id; renderChoices(); } },
          h('h4', null, b.name), h('p', null, b.desc)));
      }
      const b = BACKGROUNDS[bg];
      const attrs = Object.entries(b.attrs).map(([k, v]) => `${ATTRIBUTES[k].name} +${v}`).join(', ');
      details.innerHTML = `<b>Бонуси:</b> ${attrs}. <b>Золото:</b> ${b.gold}.`;
    };
    renderChoices();
    const body = h('div', null,
      h('p', null, 'Кальдерію розривають війни чотирьох держав. Королі шукають мечі, купці — охорону, а розбійники — легку здобич. Ким ви були, перш ніж вирушити назустріч долі?'),
      h('div', { class: 'field' }, h('label', null, 'Ім’я'), name),
      h('div', { class: 'field' }, h('label', null, 'Походження'), grid),
      details,
    );
    const win = this.windows.show({
      title: 'Новий герой',
      body,
      cls: 'wide',
      footer: [
        btn('Скасувати', () => this.windows.close(win)),
        btn('Вирушити в дорогу', () => {
          this.windows.close(win);
          this.game.newGame({ name: name.value.trim() || 'Мандрівник', background: bg });
        }, 'primary'),
      ],
    });
  }

  // ---- settings ------------------------------------------------------------------

  openSettings() {
    const game = this.game;
    const s = game.settings;
    const row = (label, input) => h('div', { class: 'settings-row' }, h('span', null, label), input);
    const range = (key, min, max, step, fmt = (v) => v) => {
      const val = h('span', { style: { width: '50px', display: 'inline-block', textAlign: 'right' } }, fmt(s[key]));
      const inp = h('input', { type: 'range', min, max, step, value: s[key], oninput: (e) => { s[key] = Number(e.target.value); val.textContent = fmt(s[key]); game.saveSettings(); } });
      return h('span', null, inp, ' ', val);
    };
    const check = (key) => h('input', { type: 'checkbox', checked: s[key], onchange: (e) => { s[key] = e.target.checked; game.saveSettings(); } });
    const body = h('div', null,
      row('Розмір битви (воїнів на полі)', range('battleSize', 20, 150, 10)),
      row('Чутливість миші', range('sensitivity', 0.3, 2.5, 0.1, (v) => v.toFixed(1))),
      row('Інвертувати вісь Y', check('invertY')),
      row('Автоматичний напрям блоку', check('autoBlock')),
      row('Шкода, яку отримує гравець', range('playerDamage', 0.25, 1, 0.25, (v) => `${Math.round(v * 100)}%`)),
      row('Тіні в битвах', check('shadows')),
      row('Якість графіки (роздільність)', range('quality', 0.5, 1, 0.25, (v) => `${Math.round(v * 100)}%`)),
      row('Гучність', range('volume', 0, 1, 0.05, (v) => `${Math.round(v * 100)}%`)),
      row('Швидкість часу на мапі', range('mapSpeed', 0.5, 3, 0.25, (v) => `×${v}`)),
    );
    const win = this.windows.show({ title: 'Налаштування', body, cls: 'narrow', footer: [btn('Готово', () => this.windows.close(win), 'primary')] });
  }

  openHelp() {
    const k = (keys, text) => h('div', null, ...keys.split(' ').map((x) => h('kbd', null, x)), ' — ', text);
    const body = h('div', null,
      h('div', { class: 'section-title' }, 'Карта світу'),
      h('div', { class: 'keys' },
        k('ЛКМ', 'рух / ціль (місто, загін, битва)'),
        k('Перетягування', 'рух камери'),
        k('Коліщатко', 'масштаб'),
        k('Пробіл', 'чекати (час іде)'),
        k('P', 'загін'),
        k('C', 'персонаж'),
        k('I', 'спорядження'),
        k('J', 'журнал і завдання'),
        k('F', 'фракції'),
        k('Esc', 'меню'),
      ),
      h('div', { class: 'section-title' }, 'Битва'),
      h('div', { class: 'keys' },
        k('W A S D', 'рух (верхи: A/D — поворот)'),
        k('Миша', 'огляд і напрям удару'),
        k('ЛКМ', 'утримати — замах, відпустити — удар'),
        k('ПКМ', 'блок (щит або зброя)'),
        k('Q Коліщатко', 'змінити зброю'),
        k('Shift', 'ходьба / повільний кінь'),
        k('F', 'зіскочити з коня / сісти на коня поруч'),
        k('1 2 3 0', 'вибір: піхота / стрільці / кіннота / усі'),
        k('Z', 'наказ: тримати позицію тут'),
        k('X', 'наказ: за мною'),
        k('C', 'наказ: в атаку!'),
        k('V', 'наказ: стріляти / не стріляти'),
        k('Tab', 'відступити / завершити битву'),
        k('Esc', 'пауза'),
      ),
      h('div', { class: 'section-title' }, 'Напрямковий бій'),
      h('p', null, 'Напрям удару визначає останній рух миші: вліво, вправо, вгору (удар згори) чи вниз (укол). Стрілка біля прицілу показує вибраний напрям. Щоб заблокувати удар без щита, утримуйте ПКМ, рухаючи мишу в бік, звідки летить удар (червона стрілка). Щит блокує всі удари спереду. Утримуйте удар довше — він сильніший. Верхи швидкість коня додає шкоди!'),
      h('div', { class: 'section-title' }, 'Поради'),
      h('ul', null,
        h('li', null, 'Набирайте добровольців у селах і тренуйте їх у боях — досвідчені воїни покращуються у вікні загону.'),
        h('li', null, 'Купуйте товари там, де їх виробляють (ціна зелена), і продавайте там, де на них попит.'),
        h('li', null, 'Слідкуйте за провізією та платнею — голодний і неоплачений загін розбіжиться.'),
        h('li', null, 'Станьте найманцем королівства в тронній залі міста, а з часом — васалом і власником замків.'),
        h('li', null, 'Незалежний шлях: захопіть замок самі — і заснуйте власне королівство.'),
      ),
    );
    const win = this.windows.show({ title: 'Як грати', body, footer: [btn('Зрозуміло', () => this.windows.close(win), 'primary')] });
  }

  // ---- save / load ---------------------------------------------------------------

  openSaveLoad(saving) {
    const game = this.game;
    let win;
    const render = () => {
      const saves = game.listSaves();
      const table = h('table', { class: 'list' }, h('tr', null, h('th', null, 'Слот'), h('th', null, 'Герой'), h('th', null, 'День'), h('th', null, 'Збережено'), h('th', null, '')));
      for (const s of saves) {
        if (!saving && !s.info) continue;
        if (saving && s.slot === 'auto') continue;
        const info = s.info;
        table.append(h('tr', null,
          h('td', null, s.slot === 'auto' ? 'Автозбереження' : `Слот ${s.slot}`),
          h('td', null, info ? `${info.name} (рівень ${info.level})` : h('span', { class: 'muted' }, 'порожньо')),
          h('td', null, info ? info.day : ''),
          h('td', null, info ? new Date(info.savedAt).toLocaleString('uk-UA') : ''),
          h('td', { class: 'num' },
            saving ? btn('Зберегти сюди', () => { game.saveGame(s.slot); this.toast('Гру збережено'); render(); }, 'small') : btn('Завантажити', () => { this.windows.closeAll(); game.loadGame(s.slot); }, 'small primary'),
            info ? btn('✕', () => { if (confirm('Видалити збереження?')) { game.deleteSave(s.slot); render(); } }, 'small danger', { title: 'Видалити' }) : null,
          ),
        ));
      }
      const body = h('div', null, table, !saving && !saves.some((s) => s.info) ? h('p', { class: 'muted' }, 'Збережень поки немає.') : null);
      if (win) this.windows.update(win, { body });
      else win = this.windows.show({ title: saving ? 'Зберегти гру' : 'Завантажити гру', body, footer: [btn('Закрити', () => this.windows.close(win))] });
    };
    render();
  }

  openGameMenu() {
    const game = this.game;
    const win = this.windows.show({
      title: 'Меню',
      cls: 'narrow',
      body: h('div', { class: 'menu-list', style: { width: '100%' } },
        btn('Повернутися до гри', () => this.windows.close(win), 'primary'),
        btn('Зберегти гру', () => this.openSaveLoad(true)),
        btn('Завантажити гру', () => this.openSaveLoad(false)),
        btn('Налаштування', () => this.openSettings()),
        btn('Як грати', () => this.openHelp()),
        btn('Вийти в головне меню', () => {
          if (confirm('Вийти в головне меню? Незбережений прогрес буде втрачено (є автозбереження).')) game.quitToMenu();
        }, 'danger'),
      ),
    });
  }
}

Object.assign(UI.prototype, settlementScreens, panelScreens, encounterScreens);
