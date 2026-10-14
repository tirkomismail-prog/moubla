// What the armies of Кальдерія wear: wool dyed with the dyes of the time,
// chosen so that the sides differ by lightness (light against dark), not
// only by hue, which is what still tells them apart at 40 m and for
// colour-blind eyes. The colours are of the dyed cloth, from measurements
// of wool dyed with madder, woad, weld, walnut, with alum or iron:
//   Peruzzi et al. 2021, Color Culture and Science Journal (CC BY 4.0),
//     https://jcolore.gruppodelcolore.it/ojs/index.php/CCSJ/article/view/CCSJ.130207
//   Stasińska, EXARC Journal 2021 (CC BY 4.0), https://exarc.net/ark:/88735/10603
//   Bukhari et al. 2017, Fashion and Textiles (CC BY 4.0),
//     https://doi.org/10.1186/s40689-016-0025-2
// (sRGB of the cloth seen under daylight, as it is to look in the game).

// undyed wool: the player's field sign, and what dyed cloth fades towards
export const UNDYED = '#fff2d1';

const WOAD_DARK = '#34556d';
const MADDER_DARK = '#8d3433';
const WELD = '#edb600';
const WOAD_ON_WELD = '#5f794f'; // green

// everything else a side wears (hose, hoods, the under layers): the same
// lightness as its sign, so that a man reads as one side as a whole
const DARK = {
  morit: '#715a49',
  walnut: '#846e5d',
  walnutDark: '#58483f',
  russet: '#8f6e60',
  olive: '#856e4f',
  lichen: '#8f5a34',
};
// (the light sides' hose and hoods: no buff or tan, which reads as bare
// skin; the grey is of undyed wool from grey sheep)
const LIGHT = { cream: '#fbedcf', grey: '#bdb6a8' };

// a faction's field colour (its men's big garment: tunic, surcoat, a dyed
// gambeson) and the pool of the rest
const FACTION_CLOTH = {
  velmar: { sign: MADDER_DARK, pool: Object.values(DARK) },
  nordheim: { sign: WOAD_DARK, pool: Object.values(DARK) },
  kaganate: { sign: WELD, pool: Object.values(LIGHT) },
  rodan: { sign: WOAD_ON_WELD, pool: Object.values(DARK) },
};

// The cloth of a side (`faction`: a faction id, 'player' or 'bandits')
// fighting `enemy`: {sign (null: each man his own), pool}.
export function sideCloth(faction, enemy) {
  if (faction === 'player') {
    // undyed white against the dark sides; against the light Kaganate,
    // dark woad (and the darkest of the pool: russet and olive come too
    // close to weld at a distance)
    if (enemy === 'kaganate') return { sign: WOAD_DARK, pool: [DARK.morit, DARK.walnut, DARK.walnutDark, DARK.lichen] };
    return { sign: UNDYED, pool: Object.values(LIGHT) };
  }
  return FACTION_CLOTH[faction] || { sign: null, pool: Object.values(DARK) };
}

// Leather of a jerkin by the wearer's faction: the steppe's near black,
// tarred; the north's dark brown; else a plain brown (the tile alone looks
// pink).
export const JERKIN = { kaganate: '#5a5650', nordheim: '#8a7a5e', default: '#a9a27b' };

// Black: wool dyed with iron and oak galls (an estimate: darker than the
// dark walnut, never coal black). The tinctures of the knights' arms
// (tools/heraldry) are these dyes.
export const SABLE = '#403c3a';
export const TINCTURES = { argent: UNDYED, or: WELD, gules: MADDER_DARK, azure: WOAD_DARK, vert: WOAD_ON_WELD, sable: SABLE };

// The lightness (L*) of the cloth of a dye as it is seen (the colours here
// are of the cloth / 0.75, in linear light).
export function lightness(hex) {
  const lin = (k) => {
    const v = parseInt(hex.slice(1 + 2 * k, 3 + 2 * k), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const y = 0.75 * (0.2126 * lin(0) + 0.7152 * lin(1) + 0.0722 * lin(2));
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
}

// The sign of an army, worn before and behind (art. XVIII of Richard II's
// ordinances at Durham, 1385: every man of the party, of whatever estate or
// nation, a large sign of St George's arms; the Scots and French the same
// month a white saltire, on a patch of black cloth if the coat is white): a
// shape, and its dye far from the side's field colour in lightness. It tells
// the sides apart close by only (partmat.js fades it out by 32 m; farther
// the big garment of the side's colour does).
const SIGNS = {
  // a cross or on madder: the faction's own colours
  velmar: { shape: 'cross', color: WELD },
  // the Scots' white saltire of 1385
  nordheim: { shape: 'saltire', color: UNDYED },
  // a sash over the right shoulder (of later times, the one shape no other
  // side has)
  rodan: { shape: 'bend', color: UNDYED },
  // bands round the upper arms (the steppe's lamellar and leather chests
  // show no sign)
  kaganate: { shape: 'armbands', color: DARK.walnutDark },
};

// The sign of a side (as sideCloth: a faction id, 'player' or 'bandits');
// null: none (bandits, arena fighters).
export function sideSign(faction, enemy) {
  // St George's: a madder cross on the undyed white; white on the dark woad
  // against the Kaganate
  if (faction === 'player') return { shape: 'cross', color: enemy === 'kaganate' ? UNDYED : MADDER_DARK };
  return SIGNS[faction] || null;
}
