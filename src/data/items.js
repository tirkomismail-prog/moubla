// Item catalogue: weapons, shields, armour, horses, food and trade goods.
//
// Melee weapons: swing = [damage, type] for side/overhead attacks,
// thrust = [damage, type] for stabbing. dirs lists allowed attack directions.
// Ranged weapons: dmg, dtype, ammo, projSpeed (m/s), draw (s), reload (s), acc (0..1).

const W = (o) => ({ type: 'weapon', slot: 'melee', speed: 1, reach: 0.9, ...o });
const R = (o) => ({ type: 'weapon', slot: 'ranged', reload: 0, mounted: true, ...o });

export const ITEMS = {
  // --- melee ---------------------------------------------------------------
  club: W({ name: 'Кийок', cls: 'mace', model: 'club', swing: [16, 'blunt'], reach: 0.8, speed: 1.0, dirs: ['left', 'right', 'overhead'], price: 20 }),
  cleaver: W({ name: 'Тесак', cls: 'sword', model: 'cleaver', swing: [19, 'cut'], reach: 0.7, speed: 1.05, dirs: ['left', 'right', 'overhead'], price: 35 }),
  pitchfork: W({ name: 'Вила', cls: 'spear', model: 'pitchfork', thrust: [18, 'pierce'], swing: [10, 'blunt'], reach: 1.6, speed: 0.95, dirs: ['thrust', 'overhead'], price: 15 }),
  sword_short: W({ name: 'Короткий меч', cls: 'sword', model: 'sword', swing: [22, 'cut'], thrust: [18, 'pierce'], reach: 0.85, speed: 1.1, dirs: ['left', 'right', 'overhead', 'thrust'], price: 120 }),
  sword_arming: W({ name: 'Лицарський меч', cls: 'sword', model: 'sword', swing: [27, 'cut'], thrust: [22, 'pierce'], reach: 0.95, speed: 1.0, dirs: ['left', 'right', 'overhead', 'thrust'], price: 320 }),
  sword_fine: W({ name: 'Меч майстра', cls: 'sword', model: 'sword_long', swing: [31, 'cut'], thrust: [25, 'pierce'], reach: 1.0, speed: 1.03, dirs: ['left', 'right', 'overhead', 'thrust'], price: 750 }),
  sabre: W({ name: 'Шабля', cls: 'sword', model: 'sabre', swing: [29, 'cut'], reach: 0.95, speed: 1.12, dirs: ['left', 'right', 'overhead'], price: 380 }),
  axe_hand: W({ name: 'Сокира', cls: 'axe', model: 'axe', swing: [27, 'cut'], reach: 0.75, speed: 0.98, dirs: ['left', 'right', 'overhead'], price: 110 }),
  axe_war: W({ name: 'Бойова сокира', cls: 'axe', model: 'axe_war', swing: [33, 'cut'], reach: 0.85, speed: 0.95, dirs: ['left', 'right', 'overhead'], price: 360 }),
  mace_iron: W({ name: 'Булава', cls: 'mace', model: 'mace', swing: [25, 'blunt'], reach: 0.8, speed: 0.98, dirs: ['left', 'right', 'overhead'], price: 260 }),
  flail: W({ name: 'Шестопер', cls: 'mace', model: 'mace', swing: [30, 'blunt'], reach: 0.85, speed: 0.96, dirs: ['left', 'right', 'overhead'], price: 520 }),
  spear: W({ name: 'Спис', cls: 'spear', model: 'spear', thrust: [28, 'pierce'], swing: [16, 'blunt'], reach: 1.9, speed: 0.92, dirs: ['thrust', 'overhead'], price: 90 }),
  spear_war: W({ name: 'Рогатина', cls: 'spear', model: 'spear', thrust: [33, 'pierce'], swing: [18, 'blunt'], reach: 1.9, speed: 0.93, dirs: ['thrust', 'overhead'], price: 260 }),
  lance: W({ name: 'Кінний спис', cls: 'lance', model: 'lance', thrust: [30, 'pierce'], reach: 2.6, speed: 0.85, dirs: ['thrust'], price: 300, lance: true }),
  greatsword: W({ name: 'Дворучний меч', cls: 'twohand', model: 'greatsword', swing: [38, 'cut'], thrust: [30, 'pierce'], reach: 1.2, speed: 0.9, twoHanded: true, dirs: ['left', 'right', 'overhead', 'thrust'], price: 950 }),
  greataxe: W({ name: 'Дворучна сокира', cls: 'twohand', model: 'greataxe', swing: [43, 'cut'], reach: 1.05, speed: 0.85, twoHanded: true, dirs: ['left', 'right', 'overhead'], price: 680 }),
  train_sword: W({ name: 'Тренувальний меч', cls: 'sword', model: 'sword', swing: [20, 'blunt'], thrust: [16, 'blunt'], reach: 0.95, speed: 1.05, dirs: ['left', 'right', 'overhead', 'thrust'], price: 30, training: true }),
  train_spear: W({ name: 'Тренувальний спис', cls: 'spear', model: 'spear', thrust: [20, 'blunt'], swing: [12, 'blunt'], reach: 1.8, speed: 0.95, dirs: ['thrust', 'overhead'], price: 30, training: true }),
  train_greatsword: W({ name: 'Тренувальний дворучник', cls: 'twohand', model: 'greatsword', swing: [26, 'blunt'], thrust: [20, 'blunt'], reach: 1.15, speed: 0.92, twoHanded: true, dirs: ['left', 'right', 'overhead', 'thrust'], price: 40, training: true }),

  // --- ranged --------------------------------------------------------------
  bow_hunting: R({ name: 'Мисливський лук', cls: 'bow', model: 'bow', dmg: 20, dtype: 'pierce', ammo: 30, projSpeed: 48, draw: 0.8, acc: 0.82, price: 80 }),
  bow_short: R({ name: 'Короткий лук', cls: 'bow', model: 'bow_short', dmg: 23, dtype: 'pierce', ammo: 30, projSpeed: 52, draw: 0.75, acc: 0.86, price: 180 }),
  bow_long: R({ name: 'Довгий лук', cls: 'bow', model: 'bow_long', dmg: 29, dtype: 'pierce', ammo: 28, projSpeed: 62, draw: 1.0, acc: 0.9, price: 450, mounted: false }),
  bow_composite: R({ name: 'Композитний лук', cls: 'bow', model: 'bow_short', dmg: 27, dtype: 'pierce', ammo: 30, projSpeed: 58, draw: 0.8, acc: 0.9, price: 620 }),
  crossbow_light: R({ name: 'Легкий арбалет', cls: 'crossbow', model: 'crossbow', dmg: 38, dtype: 'pierce', ammo: 22, projSpeed: 64, draw: 0.3, reload: 2.2, acc: 0.93, price: 260 }),
  crossbow: R({ name: 'Важкий арбалет', cls: 'crossbow', model: 'crossbow', dmg: 52, dtype: 'pierce', ammo: 20, projSpeed: 72, draw: 0.3, reload: 3.2, acc: 0.95, price: 540, mounted: false }),
  javelins: R({ name: 'Дротики', cls: 'throw', model: 'javelin', dmg: 34, dtype: 'pierce', ammo: 5, projSpeed: 27, draw: 0.5, acc: 0.85, price: 150 }),
  throwing_axes: R({ name: 'Метальні сокири', cls: 'throw', model: 'throwaxe', dmg: 38, dtype: 'cut', ammo: 4, projSpeed: 22, draw: 0.5, acc: 0.82, price: 210 }),

  // --- shields -------------------------------------------------------------
  shield_wood: { type: 'shield', slot: 'shield', name: 'Дерев’яний щит', model: 'round', size: 0.5, arc: 1.3, price: 40, color: '#8b5a2b' },
  shield_round: { type: 'shield', slot: 'shield', name: 'Круглий щит', model: 'round', size: 0.6, arc: 1.45, price: 130, color: '#9c6b3a' },
  shield_steppe: { type: 'shield', slot: 'shield', name: 'Степовий щит', model: 'round', size: 0.42, arc: 1.2, price: 90, color: '#7a4a24' },
  shield_kite: { type: 'shield', slot: 'shield', name: 'Мигдалевидний щит', model: 'kite', size: 0.62, arc: 1.5, price: 220, color: '#b8b8b8' },
  shield_heater: { type: 'shield', slot: 'shield', name: 'Гербовий щит', model: 'heater', size: 0.55, arc: 1.45, price: 300, color: '#c9c9c9' },
  pavise: { type: 'shield', slot: 'shield', name: 'Павеза', model: 'pavise', size: 0.75, arc: 1.6, price: 360, color: '#6b8e4e' },

  // --- body armour ---------------------------------------------------------
  tunic: { type: 'armor', slot: 'armor', name: 'Полотняна сорочка', armor: 4, look: 'cloth', price: 12 },
  padded: { type: 'armor', slot: 'armor', name: 'Стьобаний каптан', armor: 12, look: 'padded', price: 90 },
  leather: { type: 'armor', slot: 'armor', name: 'Шкіряна куртка', armor: 16, look: 'leather', price: 180 },
  gambeson: { type: 'armor', slot: 'armor', name: 'Гамбезон', armor: 19, look: 'padded', price: 260 },
  mail_shirt: { type: 'armor', slot: 'armor', name: 'Кольчужна сорочка', armor: 26, look: 'mail', price: 620 },
  lamellar: { type: 'armor', slot: 'armor', name: 'Ламелярний обладунок', armor: 30, look: 'lamellar', price: 900 },
  hauberk: { type: 'armor', slot: 'armor', name: 'Кольчужний хауберк', armor: 33, look: 'mail', price: 1150 },
  brigandine: { type: 'armor', slot: 'armor', name: 'Бригантина', armor: 39, look: 'brigandine', price: 1900 },
  plate: { type: 'armor', slot: 'armor', name: 'Латний обладунок', armor: 47, look: 'plate', price: 3600 },

  // --- helmets -------------------------------------------------------------
  hood: { type: 'helmet', slot: 'helmet', name: 'Каптур', armor: 3, look: 'hood', price: 10 },
  fur_hat: { type: 'helmet', slot: 'helmet', name: 'Хутряна шапка', armor: 6, look: 'fur', price: 40 },
  leather_cap: { type: 'helmet', slot: 'helmet', name: 'Шкіряний шолом', armor: 10, look: 'cap', price: 70 },
  nasal: { type: 'helmet', slot: 'helmet', name: 'Шолом з наносником', armor: 18, look: 'nasal', price: 220 },
  spangen: { type: 'helmet', slot: 'helmet', name: 'Спангенгельм', armor: 21, look: 'spangen', price: 320 },
  kettle: { type: 'helmet', slot: 'helmet', name: 'Капелюх-шолом', armor: 22, look: 'kettle', price: 350 },
  steppe_helm: { type: 'helmet', slot: 'helmet', name: 'Степовий шолом', armor: 20, look: 'spiked', price: 300 },
  great_helm: { type: 'helmet', slot: 'helmet', name: 'Великий шолом', armor: 31, look: 'great', price: 850 },

  // --- horses ----------------------------------------------------------------
  sumpter: { type: 'horse', slot: 'horse', name: 'В’ючна конячка', speed: 9, hp: 70, armor: 4, maneuver: 0.85, price: 160, coat: '#7b5a3c' },
  steppe_horse: { type: 'horse', slot: 'horse', name: 'Степовий кінь', speed: 11.5, hp: 85, armor: 6, maneuver: 1.25, price: 360, coat: '#b08850' },
  courser: { type: 'horse', slot: 'horse', name: 'Скакун', speed: 13, hp: 95, armor: 8, maneuver: 1.15, price: 720, coat: '#3a2a20' },
  hunter: { type: 'horse', slot: 'horse', name: 'Мисливський кінь', speed: 11.2, hp: 115, armor: 12, maneuver: 1.05, price: 620, coat: '#5b3b25' },
  destrier: { type: 'horse', slot: 'horse', name: 'Бойовий кінь', speed: 10.6, hp: 150, armor: 26, maneuver: 0.95, price: 1650, coat: '#dcdcdc', barding: true },
  charger: { type: 'horse', slot: 'horse', name: 'Лицарський кінь', speed: 10.2, hp: 185, armor: 40, maneuver: 0.9, price: 2900, coat: '#222222', barding: true },

  // --- food ------------------------------------------------------------------
  grain: { type: 'food', name: 'Зерно', servings: 40, morale: 0, price: 24 },
  bread: { type: 'food', name: 'Хліб', servings: 35, morale: 1, price: 32 },
  fish: { type: 'food', name: 'Сушена риба', servings: 35, morale: 1, price: 38 },
  cheese: { type: 'food', name: 'Сир', servings: 30, morale: 2, price: 48 },
  meat: { type: 'food', name: 'В’ялене м’ясо', servings: 30, morale: 3, price: 58 },
  honey: { type: 'food', name: 'Мед', servings: 20, morale: 3, price: 72 },

  // --- trade goods -------------------------------------------------------------
  salt: { type: 'good', name: 'Сіль', price: 120 },
  iron: { type: 'good', name: 'Залізо', price: 180 },
  wine: { type: 'good', name: 'Вино', price: 230 },
  furs: { type: 'good', name: 'Хутро', price: 300 },
  cloth: { type: 'good', name: 'Тканина', price: 150 },
  spices: { type: 'good', name: 'Прянощі', price: 460 },
  tools: { type: 'good', name: 'Інструменти', price: 250 },
  pottery: { type: 'good', name: 'Кераміка', price: 100 },
  wool: { type: 'good', name: 'Вовна', price: 110 },
  oil: { type: 'good', name: 'Олія', price: 200 },
  cargo: { type: 'quest', name: 'Опечатаний вантаж', price: 0 },
};

for (const [id, it] of Object.entries(ITEMS)) it.id = id;

export const FOOD_IDS = Object.keys(ITEMS).filter((k) => ITEMS[k].type === 'food');
export const GOOD_IDS = Object.keys(ITEMS).filter((k) => ITEMS[k].type === 'good');
export const EQUIP_SLOTS = ['melee', 'ranged', 'shield', 'armor', 'helmet', 'horse'];
export const SLOT_NAMES = {
  melee: 'Зброя ближнього бою',
  ranged: 'Дальня зброя',
  shield: 'Щит',
  armor: 'Обладунок',
  helmet: 'Шолом',
  horse: 'Кінь',
};

export function item(id) {
  return id ? ITEMS[id] : null;
}

export function isEquipment(id) {
  const it = ITEMS[id];
  return !!it && ['weapon', 'shield', 'armor', 'helmet', 'horse'].includes(it.type);
}

export function describeItem(it) {
  if (!it) return '';
  switch (it.type) {
    case 'weapon':
      if (it.slot === 'ranged') {
        return `Шкода ${it.dmg} · Боєзапас ${it.ammo} · Точність ${Math.round(it.acc * 100)}%${it.reload ? ` · Перезарядка ${it.reload}с` : ''}${it.mounted ? '' : ' · Тільки пішим'}`;
      } {
        const parts = [];
        if (it.swing) parts.push(`Удар ${it.swing[0]}`);
        if (it.thrust) parts.push(`Укол ${it.thrust[0]}`);
        parts.push(`Довжина ${it.reach.toFixed(1)}м`);
        if (it.twoHanded) parts.push('Дворучна');
        return parts.join(' · ');
      }
    case 'shield':
      return `Щит · розмір ${Math.round(it.size * 100)}`;
    case 'armor':
    case 'helmet':
      return `Захист ${it.armor}`;
    case 'horse':
      return `Швидкість ${it.speed} · Здоров’я ${it.hp} · Броня ${it.armor}`;
    case 'food':
      return `${it.servings} порцій${it.morale ? ` · +${it.morale} мораль` : ''}`;
    case 'good':
      return 'Товар для торгівлі';
    case 'quest':
      return 'Вантаж для доставки';
    default:
      return '';
  }
}
