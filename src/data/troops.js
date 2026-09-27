// Troop trees. Each troop lists possible equipment per slot (one is picked
// at random when a soldier is spawned), skill levels (ms melee, rs ranged,
// rd riding: 1..10) and upgrade targets.
//
// type: inf (infantry), arch (foot ranged), cav (melee cavalry), harch (horse archer)

const T = (o) => ({ eq: {}, up: [], ms: 3, rs: 1, rd: 1, ...o });

export const TROOPS = {
  // ======================= ВЕЛЬМАР =======================
  velmar_recruit: T({ name: 'Новобранець Вельмару', faction: 'velmar', tier: 1, type: 'inf', hp: 45, ms: 2,
    eq: { melee: ['pitchfork', 'club', 'cleaver'], armor: ['tunic'], helmet: [null, 'hood'] },
    up: ['velmar_militia', 'velmar_squire'] }),
  velmar_militia: T({ name: 'Ополченець Вельмару', faction: 'velmar', tier: 2, type: 'inf', hp: 55, ms: 4,
    eq: { melee: ['spear', 'axe_hand', 'sword_short'], shield: ['shield_wood'], armor: ['padded'], helmet: ['leather_cap', 'hood'] },
    up: ['velmar_footman', 'velmar_crossbow'] }),
  velmar_footman: T({ name: 'Піхотинець Вельмару', faction: 'velmar', tier: 3, type: 'inf', hp: 65, ms: 6,
    eq: { melee: ['sword_arming', 'spear_war'], shield: ['shield_kite'], armor: ['gambeson', 'mail_shirt'], helmet: ['nasal', 'kettle'] },
    up: ['velmar_sergeant'] }),
  velmar_sergeant: T({ name: 'Сержант Вельмару', faction: 'velmar', tier: 4, type: 'inf', hp: 75, ms: 8,
    eq: { melee: ['sword_arming', 'mace_iron', 'axe_war'], shield: ['shield_heater'], armor: ['hauberk'], helmet: ['kettle', 'great_helm'] } }),
  velmar_crossbow: T({ name: 'Арбалетник Вельмару', faction: 'velmar', tier: 3, type: 'arch', hp: 60, ms: 4, rs: 6,
    eq: { melee: ['sword_short'], ranged: ['crossbow_light'], armor: ['gambeson'], helmet: ['kettle', 'leather_cap'] },
    up: ['velmar_sharpshooter'] }),
  velmar_sharpshooter: T({ name: 'Влучний арбалетник', faction: 'velmar', tier: 4, type: 'arch', hp: 66, ms: 5, rs: 8,
    eq: { melee: ['sword_arming'], ranged: ['crossbow'], shield: [null], armor: ['mail_shirt'], helmet: ['kettle'] } }),
  velmar_squire: T({ name: 'Зброєносець', faction: 'velmar', tier: 2, type: 'cav', hp: 55, ms: 4, rd: 4,
    eq: { melee: ['sword_short', 'spear'], shield: ['shield_wood'], armor: ['padded'], helmet: ['leather_cap'], horse: ['sumpter'] },
    up: ['velmar_manatarms'] }),
  velmar_manatarms: T({ name: 'Латник', faction: 'velmar', tier: 3, type: 'cav', hp: 65, ms: 6, rd: 6,
    eq: { melee: ['sword_arming', 'lance'], shield: ['shield_kite'], armor: ['mail_shirt'], helmet: ['nasal'], horse: ['hunter', 'courser'] },
    up: ['velmar_knight'] }),
  velmar_knight: T({ name: 'Лицар Вельмару', faction: 'velmar', tier: 5, type: 'cav', hp: 85, ms: 9, rd: 9,
    eq: { melee: ['lance', 'sword_fine', 'flail'], shield: ['shield_heater'], armor: ['brigandine', 'plate'], helmet: ['great_helm'], horse: ['destrier', 'charger'] } }),

  // ======================= НОРДГЕЙМ =======================
  nord_recruit: T({ name: 'Новобранець Нордгейму', faction: 'nordheim', tier: 1, type: 'inf', hp: 48, ms: 3,
    eq: { melee: ['axe_hand', 'club', 'spear'], shield: [null, 'shield_wood'], armor: ['tunic'], helmet: ['fur_hat', null] },
    up: ['nord_footman', 'nord_hunter'] }),
  nord_footman: T({ name: 'Нордгеймський воїн', faction: 'nordheim', tier: 2, type: 'inf', hp: 58, ms: 5,
    eq: { melee: ['axe_hand', 'spear'], ranged: [null, 'javelins'], shield: ['shield_round'], armor: ['leather', 'padded'], helmet: ['fur_hat', 'leather_cap'] },
    up: ['nord_trained'] }),
  nord_trained: T({ name: 'Досвідчений воїн', faction: 'nordheim', tier: 3, type: 'inf', hp: 68, ms: 6,
    eq: { melee: ['axe_war', 'sword_short'], ranged: ['throwing_axes', null], shield: ['shield_round'], armor: ['mail_shirt'], helmet: ['spangen'] },
    up: ['nord_veteran'] }),
  nord_veteran: T({ name: 'Нордгеймський ветеран', faction: 'nordheim', tier: 4, type: 'inf', hp: 76, ms: 8,
    eq: { melee: ['axe_war', 'greataxe', 'sword_arming'], ranged: ['throwing_axes'], shield: ['shield_round'], armor: ['hauberk'], helmet: ['spangen'] },
    up: ['nord_huscarl'] }),
  nord_huscarl: T({ name: 'Хускарл', faction: 'nordheim', tier: 5, type: 'inf', hp: 90, ms: 10,
    eq: { melee: ['greataxe', 'sword_fine', 'axe_war'], ranged: ['throwing_axes'], shield: ['shield_round'], armor: ['brigandine'], helmet: ['spangen'] } }),
  nord_hunter: T({ name: 'Мисливець Нордгейму', faction: 'nordheim', tier: 2, type: 'arch', hp: 52, ms: 3, rs: 4,
    eq: { melee: ['axe_hand'], ranged: ['bow_hunting'], armor: ['leather'], helmet: ['fur_hat'] },
    up: ['nord_archer'] }),
  nord_archer: T({ name: 'Лучник Нордгейму', faction: 'nordheim', tier: 3, type: 'arch', hp: 60, ms: 4, rs: 6,
    eq: { melee: ['axe_hand', 'sword_short'], ranged: ['bow_long'], armor: ['leather', 'gambeson'], helmet: ['leather_cap', 'nasal'] },
    up: ['nord_veteran_archer'] }),
  nord_veteran_archer: T({ name: 'Ветеран-лучник', faction: 'nordheim', tier: 4, type: 'arch', hp: 68, ms: 5, rs: 8,
    eq: { melee: ['sword_arming'], ranged: ['bow_long'], armor: ['mail_shirt'], helmet: ['nasal'] } }),

  // ======================= КАГАНАТ =======================
  kag_tribesman: T({ name: 'Степовик', faction: 'kaganate', tier: 1, type: 'harch', hp: 44, ms: 2, rs: 3, rd: 4,
    eq: { melee: ['cleaver', 'club'], ranged: ['bow_hunting'], armor: ['tunic'], helmet: ['fur_hat'], horse: ['steppe_horse'] },
    up: ['kag_skirmisher', 'kag_horseman'] }),
  kag_skirmisher: T({ name: 'Кінний стрілець', faction: 'kaganate', tier: 2, type: 'harch', hp: 52, ms: 3, rs: 5, rd: 5,
    eq: { melee: ['sabre', 'axe_hand'], ranged: ['bow_short'], shield: [null], armor: ['padded', 'leather'], helmet: ['fur_hat', 'leather_cap'], horse: ['steppe_horse'] },
    up: ['kag_horse_archer'] }),
  kag_horse_archer: T({ name: 'Кінний лучник', faction: 'kaganate', tier: 3, type: 'harch', hp: 60, ms: 4, rs: 7, rd: 7,
    eq: { melee: ['sabre'], ranged: ['bow_short', 'bow_composite'], shield: ['shield_steppe'], armor: ['leather', 'lamellar'], helmet: ['steppe_helm'], horse: ['steppe_horse'] },
    up: ['kag_veteran_archer'] }),
  kag_veteran_archer: T({ name: 'Ветеран кінний лучник', faction: 'kaganate', tier: 4, type: 'harch', hp: 68, ms: 5, rs: 9, rd: 9,
    eq: { melee: ['sabre'], ranged: ['bow_composite'], shield: ['shield_steppe'], armor: ['lamellar'], helmet: ['steppe_helm'], horse: ['courser', 'steppe_horse'] } }),
  kag_horseman: T({ name: 'Вершник Каганату', faction: 'kaganate', tier: 2, type: 'cav', hp: 54, ms: 4, rd: 5,
    eq: { melee: ['sabre', 'spear'], ranged: [null, 'javelins'], shield: ['shield_steppe'], armor: ['leather'], helmet: ['leather_cap', 'steppe_helm'], horse: ['steppe_horse'] },
    up: ['kag_lancer'] }),
  kag_lancer: T({ name: 'Уланин Каганату', faction: 'kaganate', tier: 3, type: 'cav', hp: 64, ms: 6, rd: 7,
    eq: { melee: ['lance', 'sabre'], shield: ['shield_steppe'], armor: ['lamellar'], helmet: ['steppe_helm'], horse: ['courser', 'hunter'] },
    up: ['kag_bahadur'] }),
  kag_bahadur: T({ name: 'Багатур', faction: 'kaganate', tier: 5, type: 'cav', hp: 82, ms: 9, rs: 6, rd: 10,
    eq: { melee: ['lance', 'sabre', 'mace_iron'], ranged: ['bow_composite'], shield: ['shield_steppe'], armor: ['lamellar', 'brigandine'], helmet: ['steppe_helm'], horse: ['destrier', 'courser'] } }),

  // ======================= РОДАНЬ =======================
  rodan_recruit: T({ name: 'Новобранець Родані', faction: 'rodan', tier: 1, type: 'inf', hp: 45, ms: 2,
    eq: { melee: ['pitchfork', 'spear', 'club'], armor: ['tunic'], helmet: [null, 'hood'] },
    up: ['rodan_spearman', 'rodan_crossbowman'] }),
  rodan_spearman: T({ name: 'Роданський списоносець', faction: 'rodan', tier: 2, type: 'inf', hp: 56, ms: 4,
    eq: { melee: ['spear'], shield: ['shield_wood', 'pavise'], armor: ['padded'], helmet: ['leather_cap'] },
    up: ['rodan_trained_spearman'] }),
  rodan_trained_spearman: T({ name: 'Досвідчений списоносець', faction: 'rodan', tier: 3, type: 'inf', hp: 65, ms: 6,
    eq: { melee: ['spear_war'], shield: ['pavise'], armor: ['gambeson'], helmet: ['kettle'] },
    up: ['rodan_veteran_spearman', 'rodan_horseman'] }),
  rodan_veteran_spearman: T({ name: 'Ветеран-списоносець', faction: 'rodan', tier: 4, type: 'inf', hp: 74, ms: 8,
    eq: { melee: ['spear_war', 'sword_arming'], shield: ['pavise'], armor: ['mail_shirt'], helmet: ['kettle'] },
    up: ['rodan_sotnyk'] }),
  rodan_sotnyk: T({ name: 'Роданський сотник', faction: 'rodan', tier: 5, type: 'inf', hp: 86, ms: 9,
    eq: { melee: ['spear_war', 'sword_fine', 'flail'], shield: ['pavise'], armor: ['hauberk', 'brigandine'], helmet: ['kettle', 'great_helm'] } }),
  rodan_crossbowman: T({ name: 'Роданський арбалетник', faction: 'rodan', tier: 2, type: 'arch', hp: 52, ms: 3, rs: 5,
    eq: { melee: ['club', 'cleaver'], ranged: ['crossbow_light'], armor: ['padded'], helmet: ['leather_cap'] },
    up: ['rodan_trained_crossbow'] }),
  rodan_trained_crossbow: T({ name: 'Досвідчений арбалетник', faction: 'rodan', tier: 3, type: 'arch', hp: 60, ms: 4, rs: 7,
    eq: { melee: ['sword_short'], ranged: ['crossbow_light', 'crossbow'], shield: ['pavise'], armor: ['gambeson'], helmet: ['kettle'] },
    up: ['rodan_sharpshooter'] }),
  rodan_sharpshooter: T({ name: 'Роданський снайпер', faction: 'rodan', tier: 4, type: 'arch', hp: 68, ms: 5, rs: 9,
    eq: { melee: ['sword_arming'], ranged: ['crossbow'], shield: ['pavise'], armor: ['mail_shirt'], helmet: ['kettle'] } }),
  rodan_horseman: T({ name: 'Роданський вершник', faction: 'rodan', tier: 4, type: 'cav', hp: 70, ms: 7, rd: 7,
    eq: { melee: ['lance', 'sword_arming'], shield: ['shield_heater'], armor: ['mail_shirt'], helmet: ['nasal'], horse: ['hunter'] } }),

  // ======================= РОЗБІЙНИКИ =======================
  looter: T({ name: 'Мародер', faction: 'bandits', tier: 1, type: 'inf', hp: 40, ms: 2,
    eq: { melee: ['club', 'cleaver', 'pitchfork'], armor: ['tunic'], helmet: [null, 'hood'] } }),
  forest_bandit: T({ name: 'Лісовий розбійник', faction: 'bandits', tier: 2, type: 'arch', hp: 50, ms: 3, rs: 5,
    eq: { melee: ['axe_hand', 'club'], ranged: ['bow_hunting'], armor: ['leather', 'tunic'], helmet: ['hood'] } }),
  steppe_bandit: T({ name: 'Степовий грабіжник', faction: 'bandits', tier: 2, type: 'harch', hp: 50, ms: 3, rs: 4, rd: 5,
    eq: { melee: ['sabre', 'cleaver'], ranged: ['bow_short'], armor: ['leather'], helmet: ['fur_hat'], horse: ['steppe_horse'] } }),
  mountain_bandit: T({ name: 'Гірський розбійник', faction: 'bandits', tier: 2, type: 'inf', hp: 55, ms: 4,
    eq: { melee: ['spear', 'axe_hand'], ranged: ['javelins'], shield: ['shield_wood'], armor: ['padded'], helmet: ['leather_cap'] } }),
  sea_raider: T({ name: 'Морський рейдер', faction: 'bandits', tier: 3, type: 'inf', hp: 64, ms: 6,
    eq: { melee: ['axe_war', 'sword_short'], ranged: ['throwing_axes'], shield: ['shield_round'], armor: ['mail_shirt', 'leather'], helmet: ['nasal'] } }),
  deserter: T({ name: 'Дезертир', faction: 'bandits', tier: 3, type: 'inf', hp: 60, ms: 5, rs: 4,
    eq: { melee: ['sword_short', 'spear'], ranged: [null, 'crossbow_light'], shield: ['shield_kite', null], armor: ['gambeson'], helmet: ['kettle', 'leather_cap'] } }),

  // ======================= НАЙМАНЦІ =======================
  merc_footman: T({ name: 'Найманий піхотинець', faction: 'mercs', tier: 3, type: 'inf', hp: 66, ms: 6,
    eq: { melee: ['sword_arming', 'axe_war', 'mace_iron'], shield: ['shield_heater', 'shield_kite'], armor: ['mail_shirt'], helmet: ['nasal', 'kettle'] },
    up: ['merc_sword_sister'] }),
  merc_sword_sister: T({ name: 'Найманий мечник', faction: 'mercs', tier: 4, type: 'inf', hp: 76, ms: 8,
    eq: { melee: ['greatsword', 'sword_fine'], shield: [null], armor: ['hauberk'], helmet: ['great_helm'] } }),
  merc_crossbow: T({ name: 'Найманий арбалетник', faction: 'mercs', tier: 3, type: 'arch', hp: 60, ms: 4, rs: 7,
    eq: { melee: ['sword_short'], ranged: ['crossbow_light'], armor: ['gambeson'], helmet: ['kettle'] } }),
  merc_cavalry: T({ name: 'Найманий вершник', faction: 'mercs', tier: 4, type: 'cav', hp: 72, ms: 7, rd: 7,
    eq: { melee: ['sword_arming', 'lance'], shield: ['shield_heater'], armor: ['hauberk'], helmet: ['nasal'], horse: ['hunter', 'courser'] } }),
  caravan_guard: T({ name: 'Охоронець каравану', faction: 'mercs', tier: 3, type: 'cav', hp: 62, ms: 5, rd: 5,
    eq: { melee: ['sword_short', 'spear'], shield: ['shield_kite'], armor: ['leather', 'mail_shirt'], helmet: ['leather_cap', 'nasal'], horse: ['sumpter', 'hunter'] },
    up: ['merc_cavalry'] }),
  watchman: T({ name: 'Міський вартовий', faction: 'mercs', tier: 2, type: 'inf', hp: 56, ms: 4, rs: 3,
    eq: { melee: ['spear', 'club'], ranged: [null, 'crossbow_light'], shield: ['shield_wood'], armor: ['padded'], helmet: ['kettle'] },
    up: ['merc_footman', 'merc_crossbow'] }),
};

for (const [id, t] of Object.entries(TROOPS)) {
  t.id = id;
  const mounted = t.type === 'cav' || t.type === 'harch';
  t.mounted = mounted;
  t.wage = Math.round([0, 3, 6, 11, 20, 32][t.tier] * (mounted ? 1.5 : 1));
  t.upgradeXp = [0, 40, 110, 240, 420, 9999][t.tier];
  t.upgradeCost = [0, 10, 30, 70, 150, 0][t.tier];
  // rough combat strength used for AI decisions and auto-resolve
  t.power = (4 + t.tier * 4 + t.hp / 12) * (mounted ? 1.3 : 1);
}

export const RECRUITS = {
  velmar: 'velmar_recruit',
  nordheim: 'nord_recruit',
  kaganate: 'kag_tribesman',
  rodan: 'rodan_recruit',
};

export const FACTION_TREES = {
  velmar: ['velmar_recruit', 'velmar_militia', 'velmar_footman', 'velmar_sergeant', 'velmar_crossbow', 'velmar_sharpshooter', 'velmar_squire', 'velmar_manatarms', 'velmar_knight'],
  nordheim: ['nord_recruit', 'nord_footman', 'nord_trained', 'nord_veteran', 'nord_huscarl', 'nord_hunter', 'nord_archer', 'nord_veteran_archer'],
  kaganate: ['kag_tribesman', 'kag_skirmisher', 'kag_horse_archer', 'kag_veteran_archer', 'kag_horseman', 'kag_lancer', 'kag_bahadur'],
  rodan: ['rodan_recruit', 'rodan_spearman', 'rodan_trained_spearman', 'rodan_veteran_spearman', 'rodan_sotnyk', 'rodan_crossbowman', 'rodan_trained_crossbow', 'rodan_sharpshooter', 'rodan_horseman'],
};

export const MERCENARY_POOL = ['merc_footman', 'merc_crossbow', 'merc_cavalry', 'caravan_guard', 'watchman'];

export const TYPE_NAMES = { inf: 'Піхота', arch: 'Стрільці', cav: 'Кіннота', harch: 'Кінні стрільці' };

export function troop(id) {
  return TROOPS[id];
}

// Pick a random troop of the given faction with tier <= maxTier, weighted to lower tiers.
export function randomFactionTroop(rng, faction, maxTier = 5, minTier = 1) {
  const pool = FACTION_TREES[faction].filter((id) => TROOPS[id].tier <= maxTier && TROOPS[id].tier >= minTier);
  return rng.weighted(pool.map((id) => [id, 6 - TROOPS[id].tier]));
}
