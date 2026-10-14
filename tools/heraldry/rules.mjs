// The rules a coat of the knights of Velmar keeps, beyond Armoria's own
// (build_heraldry.mjs coatOf), shared with the tests (tests/heraldry.test.js).

// Arms like the flags of today's states, or like the sides' own signs
// (src/data/dyes.js SIGNS: the player's against the Kaganate is a white
// cross on woad; a light sign on mail, leather or lamellar is on a patch of
// black): [field, ordinary or lone charge (shapeOf), its tincture].
export const LOOKALIKES = [
  ['gules', 'cross', 'argent'],
  ['gules', 'fess', 'argent'],
  ['gules', 'cross', 'or'],
  ['azure', 'cross', 'or'],
  ['azure', 'cross', 'argent'],
  ['azure', 'saltire', 'argent'],
  ['azure', 'saltire', 'or'],
  ['gules', 'saltire', 'argent'],
  ['vert', 'saltire', 'argent'],
  ['sable', 'saltire', 'argent'],
  ['sable', 'cross', 'or'],
  ['sable', 'cross', 'argent'],
  ['vert', 'bend', 'argent'],
  ['azure', 'fleurDeLis', 'or'],
];
// nor a star or a crescent alone, of any tinctures (the flags with them)
export const LONE_BANNED = ['mullet', 'crescent'];

// What a charge is taken for: a cross of any kind as a cross (crossSaltire
// as a saltire), a star of any points as a mullet.
export const shapeOf = (charge) =>
  charge === 'crossSaltire' ? 'saltire' : charge.startsWith('cross') ? 'cross' : charge.startsWith('mullet') ? 'mullet' : charge;

export const isLookalike = (key) => LOOKALIKES.some((b) => b.every((v, i) => v === key[i]));

// A colour '#rrggbb' as sRGB bytes
export const rgbOf = (hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));

// Whether a coat's edges carry on to the garment's seams: the game repeats
// its outer rows and columns over the rest of the garment (ClampToEdge), as
// right for a fess, a pale, a chief or a division along them as it is wrong
// for what crosses an edge aslant (a bend, a chevron: it turns into a pale)
// or a charge cut by it. Each stretch of a tincture other than the field's
// along an edge must be there, as wide (but for the drawing's antialiasing),
// an eighth of the coat in. (`pixels`: RGBA bytes of a square image;
// `field`: the field's sRGB bytes.)
export function carriesOn(pixels, size, field) {
  const depth = Math.round(size / 8);
  const near = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2])) <= 40;
  const edges = [
    (i, k) => [i, k],
    (i, k) => [i, size - 1 - k],
    (i, k) => [k, i],
    (i, k) => [size - 1 - k, i],
  ];
  for (const edge of edges) {
    const line = (k) => Array.from({ length: size }, (_, i) => {
      const [x, y] = edge(i, k);
      return [0, 1, 2].map((c) => pixels[4 * (y * size + x) + c]);
    });
    const outer = line(0);
    const inner = line(depth);
    for (let a = 0, b; a < size; a = b + 1) {
      b = a;
      while (b + 1 < size && near(outer[b + 1], outer[a])) b++;
      if (b - a < 2 || near(outer[a], field)) continue;
      const m = (a + b) >> 1;
      if (!near(inner[m], outer[m])) return false;
      let a2 = m;
      let b2 = m;
      while (a2 > 0 && near(inner[a2 - 1], outer[m])) a2--;
      while (b2 + 1 < size && near(inner[b2 + 1], outer[m])) b2++;
      if (Math.abs(a2 - a) > 2 || Math.abs(b2 - b) > 2) return false;
    }
  }
  return true;
}
