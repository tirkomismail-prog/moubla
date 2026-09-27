// Player character: attributes, skills, backgrounds and derived stats.

export const ATTRIBUTES = {
  str: { name: 'Сила', desc: '+1 здоров’я за очко; обмежує силові навички.' },
  agi: { name: 'Спритність', desc: 'Швидкість атак і бігу; обмежує навички спритності.' },
  int: { name: 'Інтелект', desc: '+1 очко навичок за кожне очко; обмежує інтелектуальні навички.' },
  cha: { name: 'Харизма', desc: '+1 до розміру загону; обмежує навички харизми.' },
};

export const SKILLS = {
  ironflesh: { name: 'Залізна шкіра', attr: 'str', desc: '+3 здоров’я за рівень.' },
  power_strike: { name: 'Потужний удар', attr: 'str', desc: '+8% шкоди в ближньому бою за рівень.' },
  power_draw: { name: 'Потужний постріл', attr: 'str', desc: '+10% шкоди луком/метальною зброєю за рівень.' },
  athletics: { name: 'Атлетика', attr: 'agi', desc: '+4% швидкості бігу за рівень.' },
  riding: { name: 'Верхова їзда', attr: 'agi', desc: '+4% швидкості та керованості коня за рівень.' },
  looting: { name: 'Мародерство', attr: 'agi', desc: '+10% здобичі після битв за рівень.' },
  trainer: { name: 'Тренер', attr: 'int', desc: 'Щоденний досвід для воїнів загону.' },
  tactics: { name: 'Тактика', attr: 'int', desc: 'Перевага в автобоях та при розстановці сил.' },
  surgery: { name: 'Хірургія', attr: 'int', desc: '+5% шансу, що полеглий воїн лише поранений.' },
  pathfinding: { name: 'Стежопрокладання', attr: 'int', desc: '+3% швидкості загону на мапі за рівень.' },
  leadership: { name: 'Лідерство', attr: 'cha', desc: '+5 до розміру загону, мораль, -5% платні.' },
  trade: { name: 'Торгівля', attr: 'cha', desc: 'Кращі ціни на ринку.' },
  prisoner: { name: 'Тюремник', attr: 'cha', desc: '+5 до кількості полонених за рівень.' },
};

export const BACKGROUNDS = {
  knight: {
    name: 'Збіднілий лицар',
    desc: 'Молодший син збіднілого роду. Добрий кінь, меч і кольчуга — усе, що залишилося від спадку.',
    attrs: { str: 2, agi: 1 },
    skills: { riding: 2, power_strike: 2, leadership: 1, ironflesh: 1 },
    gold: 350,
    equipment: { w1: 'sword_arming', w2: 'lance', w3: null, shield: 'shield_heater', armor: 'mail_shirt', helmet: 'nasal', horse: 'hunter' },
    inventory: [['grain', 1]],
    troops: [],
  },
  hunter: {
    name: 'Мисливець',
    desc: 'Виріс у лісах і полював з батьком. Влучне око та витривалі ноги.',
    attrs: { agi: 2, str: 1 },
    skills: { power_draw: 3, athletics: 2, pathfinding: 1, looting: 1 },
    gold: 300,
    equipment: { w1: 'bow_hunting', w2: 'axe_hand', w3: null, shield: null, armor: 'leather', helmet: 'fur_hat', horse: 'sumpter' },
    inventory: [['meat', 1], ['furs', 2]],
    troops: [],
  },
  merchant: {
    name: 'Купецький син',
    desc: 'Батьківський караван загинув від рук розбійників, але золото та хист до торгівлі лишилися.',
    attrs: { cha: 2, int: 1 },
    skills: { trade: 3, leadership: 2, surgery: 1 },
    gold: 1400,
    equipment: { w1: 'sword_short', w2: null, w3: null, shield: 'shield_wood', armor: 'padded', helmet: 'leather_cap', horse: 'sumpter' },
    inventory: [['bread', 1], ['cloth', 3]],
    troops: [['watchman', 2]],
  },
  mercenary: {
    name: 'Найманець',
    desc: 'Роками продавав свій меч тим, хто більше платив. Знає ціну крові та вірних побратимів.',
    attrs: { str: 1, agi: 1, cha: 1 },
    skills: { ironflesh: 2, power_strike: 1, athletics: 1, leadership: 1, tactics: 1 },
    gold: 450,
    equipment: { w1: 'axe_war', w2: 'javelins', w3: null, shield: 'shield_round', armor: 'gambeson', helmet: 'spangen', horse: null },
    inventory: [['grain', 1]],
    troops: [['watchman', 3], ['merc_crossbow', 1]],
  },
};

export const BASE_ATTRS = { str: 6, agi: 6, int: 5, cha: 5 };

export function xpForNextLevel(level) {
  return Math.round(300 * Math.pow(level, 1.55));
}

export function maxSkillLevel(player, skillId) {
  const attr = SKILLS[skillId].attr;
  return Math.min(10, Math.floor(player.attrs[attr] / 3));
}

export function playerMaxHp(player) {
  return 50 + player.attrs.str + player.skills.ironflesh * 3;
}

export function partyLimit(state) {
  const p = state.player;
  return 10 + p.skills.leadership * 5 + p.attrs.cha + Math.floor(p.renown / 25);
}

export function prisonerLimit(state) {
  return 5 + state.player.skills.prisoner * 5;
}
