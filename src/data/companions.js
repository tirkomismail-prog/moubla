// Companions: named heroes who can be hired in taverns. They never die in
// battle (only get knocked out) and lend their skills to the party.

export const COMPANIONS = {
  borys: {
    name: 'Борис Сірий',
    story: 'Колишній сотник роданської варти. Каже, що його вигнали за надто чесний язик.',
    level: 6,
    hp: 72,
    cost: 450,
    skills: { tactics: 3, trainer: 3, ironflesh: 2, power_strike: 2 },
    equipment: { w1: 'spear_war', w2: 'sword_short', w3: null, shield: 'pavise', armor: 'mail_shirt', helmet: 'kettle', horse: null },
  },
  lesia: {
    name: 'Леся Травниця',
    story: 'Знахарка з лісового хутора. Зашиє будь-яку рану — і влучить білці в око з сорока кроків.',
    level: 4,
    hp: 55,
    cost: 300,
    skills: { surgery: 4, power_draw: 2, pathfinding: 2 },
    equipment: { w1: 'bow_hunting', w2: 'cleaver', w3: null, shield: null, armor: 'leather', helmet: 'hood', horse: 'sumpter' },
  },
  torvi: {
    name: 'Торві Ведмежа Лапа',
    story: 'Нордгеймський воїн, що програв у кості свій корабель. Шукає нову битву.',
    level: 7,
    hp: 85,
    cost: 600,
    skills: { ironflesh: 4, power_strike: 4, athletics: 2 },
    equipment: { w1: 'greataxe', w2: 'throwing_axes', w3: null, shield: 'shield_round', armor: 'mail_shirt', helmet: 'spangen', horse: null },
  },
  aibek: {
    name: 'Айбек Вітер',
    story: 'Син степового бека, втікач від кровної помсти. Народився в сідлі.',
    level: 5,
    hp: 62,
    cost: 500,
    skills: { riding: 4, power_draw: 3, pathfinding: 3 },
    equipment: { w1: 'bow_short', w2: 'sabre', w3: null, shield: 'shield_steppe', armor: 'lamellar', helmet: 'steppe_helm', horse: 'steppe_horse' },
  },
  hilda: {
    name: 'Гільда з Ардейну',
    story: 'Донька купця, що втекла від нав’язаного шлюбу. Рахує краще за будь-якого митника.',
    level: 3,
    hp: 50,
    cost: 250,
    skills: { trade: 4, leadership: 2, looting: 2 },
    equipment: { w1: 'sword_short', w2: 'crossbow_light', w3: null, shield: null, armor: 'padded', helmet: 'leather_cap', horse: 'sumpter' },
  },
  ostap: {
    name: 'Остап Шибайголова',
    story: 'Вигнаний зі зброєносців за бійку з лицарем. Лицар досі не оговтався.',
    level: 5,
    hp: 66,
    cost: 400,
    skills: { riding: 3, power_strike: 3, looting: 3 },
    equipment: { w1: 'sword_arming', w2: 'lance', w3: null, shield: 'shield_kite', armor: 'gambeson', helmet: 'nasal', horse: 'hunter' },
  },
};

for (const [id, c] of Object.entries(COMPANIONS)) c.id = id;

// Skills that the whole party uses: the best value among the player and companions counts.
export const PARTY_SKILLS = ['surgery', 'trainer', 'tactics', 'pathfinding', 'trade', 'looting'];
