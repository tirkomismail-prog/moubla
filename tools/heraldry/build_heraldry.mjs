// Coats of arms of the knights of Velmar, for the game (stage 4.4 of the
// soldiers' plan): generated with Armoria (Azgaar, https://github.com/Azgaar/
// armoria-api, code MIT), downloaded here at a pinned commit, with only
// Azgaar's own CC0 charges, in the cloth's natural dyes (src/data/dyes.js),
// flat (no gradient, no outlines, no shield shape: the game cuts the coat to
// the garment or the shield), and written as images next to the model with
// heraldry.json (packed by tools/pack-assets.mjs).
//
//   (cd tools/heraldry && npm ci)
//   node tools/heraldry/build_heraldry.mjs [--cache ~/.cache/moubla-heraldry] [--out assets/characters/textures]
//   node tools/heraldry/build_heraldry.mjs --pick [--out SCRATCH_DIR]
//
// --pick chooses the coats again by the rules below (from the seeds
// velmar-0, velmar-1, ...) and prints their seeds, to be pinned in SEEDS;
// with --out it also writes them there, to be checked by eye first (never
// over the game's own: --pick without --out writes nothing).
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const HTMLParser = require('node-html-parser');
const { Resvg } = require('@resvg/resvg-js');

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const CACHE = path.resolve(arg('--cache', path.join(os.homedir(), '.cache', 'moubla-heraldry')));
const PICK = process.argv.includes('--pick');
const OUT = arg('--out', PICK ? null : path.join(here, '../../assets/characters/textures'));

// the coats: 0-5 the arms of the king and the lords of Velmar, 6-15 those
// the knights in battle draw from (src/battle/agent.js); each a seed of
// Armoria's generator, picked by --pick and checked by eye
const SEEDS = [
  'velmar-1', 'velmar-0', 'velmar-37', 'velmar-211', 'velmar-77', 'velmar-5', 'velmar-109', 'velmar-898',
  'velmar-166', 'velmar-11', 'velmar-905', 'velmar-4323', 'velmar-942', 'velmar-21', 'velmar-976', 'velmar-6687',
];
const COUNT = 16;
// pixels per coat: about one texel per pixel on a chest at the player's camera
const SIZE = 128;

// Armoria's code (MIT) and its charges, at fixed commits
const API = 'https://raw.githubusercontent.com/Azgaar/armoria-api/f4c9b191e3540104c780145e42b431cfa636345d/';
const API_FILES = {
  LICENSE: 'ca6c26c8111feeb53fd931f08c050492c8f9772d6ae6d239307d2578a7016390',
  'app/generator.js': '99d87f261ef617353a58a103368bbc60be333bbc5f0dc09b584de3c08d57651f',
  'app/renderer.js': 'b9c2e8dea6833dd588de2e9bdd216e23099e03caf208252db8af953e42e38b79',
  'app/dataModel.js': '22c34f11c3c99cf8e01909332210ae1b4fe2191783002c72ff7ccf361b72fb0c',
  'app/templates.js': 'dfd02640ebc2a85ef3ba3c111fd6f10e3c154fe5b006bc9ac0d6375b2e6ce622',
  'app/alea.js': 'cf2a2272eaa5deebc8d77398af367d58d79a0611e532712ab5e3222f20fac603',
};
const CHARGES_AT = 'https://raw.githubusercontent.com/Azgaar/Armoria/3904829c81a3d1af684fee063122a0fb83cbf438/public/charges/';
// Azgaar's own shapes, CC0 (each file says so: checked below), of the kinds
// in the rolls of arms of 1298-1418 (J. Foster, Some Feudal Coats of Arms),
// weighted by how often they are there (x10). Not taken: the other charges
// (most are non-commercial, some ShareAlike, some state or military
// emblems), crosses of later times or with a modern meaning, card suits,
// the goutte (alone, a flame).
const CHARGES = {
  // conventional
  mullet: [30, '314dd8840421507847484a7f5081e25622a73c458237a2637df8b17507622a85'],
  mulletPierced: [10, 'af14dcf36a94077daa7bb39a375b5304cd41973a18acb036ab3f18eb3dd8f0eb'],
  mullet6: [10, 'e55c7e610fb58f75c6db7ab69e8128b20044272e60612f80f0cb47c2d0364c33'],
  mullet6Pierced: [5, 'fb7a63298cb6db0704c7e9380c0050cfce56e4b3821bc321c530a12bb9c3faf7'],
  lozenge: [15, 'ea59c68c952cc65ac0e48a272efa9e39d6640ad6731b9e28a9d23bf3adecd2f9'],
  mascle: [10, 'f44de38ae7a7d9dd77c4f38f90198df25b02ee963c756be25d3ba5ca48c2c0f0'],
  fusil: [6, 'cb49732794f1fc871d4e8751858907c395dcb0b4381506e80f69a799b0df37a7'],
  crescent: [22, 'e0f3f1239e1c9ba5b821cabcf25762b8713b8d8e36a929b2f465f1e23ba0ae92'],
  roundel: [19, 'eae8f6f89656cbde8c4767d9a3cc772af0ad3f04551a91a65fdffbe6b253d18a'],
  fleurDeLis: [14, '5b583747db04407dd126c77ffb174ff7a2b2c3bc47a987c106fe1aadcbaef4fe'],
  billet: [11, '989c86bb0defbbdfa69faf63635db8ceaee0cc9afb24702f50feee34641208cc'],
  annulet: [10, 'd19b56833dd697f91904ccbfe36815f893adf963d55d4b4927cac655ad64a8a2'],
  rustre: [1, 'dbc3007e2f4fdb21908fd9ea53beb10dbf6a16be9daeccd57db3d61e521de857'],
  // crosses
  crosslet: [25, '457ab69351bee1e436fe7944f1072b1fcf96c74481559be45d6ac590af7bf392'],
  crossFitchy: [5, 'b478825812a1a7c20613b5b77808587f39b27e6229f3ac387ee24c313af83e1e'],
  crossPatonce: [5, 'efd507ec9480ebb06719d437baaea3edd27c65132160436282e5f8a5d0390c2f'],
  crossMoline: [5, '9883b3e2f954deb66b3af02df5809da1ba33ee7247ff232dec34bfe9911a185f'],
  crossFleury: [5, '9f578209fcc44147b6382d99b95121663fe2de99c1c24eef656242462e2ae6d9'],
  crossPattee: [3, 'e26e4ac0ef433262413a00c0e294d136c6763e7063a3de4a0c757529fe756682'],
  crossFormee: [2, '8a671a8412ceee4a88a70f05353234aecb86e709e5f14aa2eb25d9950635da45'],
  crossHummetty: [5, '535c3df4b50d16b9c8354fed58565f4c367758c9f7267eec64a6656ed7873af6'],
  crossCercelee: [3, '13782312fd02ba0253fecc954e61e9c966797ffdf62f10ba81b80975af2c7edf'],
  crossBottony: [2, 'fe17136c6bfcb544e1c69ba756d47e001516b820a275c418256758c915a037d4'],
  crossPotent: [2, '0a174b762260371a71ef3fe79b7db81cf68fd9e8043ad6f7e77f584838083754'],
  crossClechy: [2, 'c8c2e5790349ea8e126aef09fbe5c722c6decb79e596dd9ab6b98c50f35ea372'],
  crossVoided: [2, '9dc866176713b8e595196bc7444331c7230658431aa2b8c64a689343a1953915'],
  crossSaltire: [3, 'de03dd4c92e2f8c2b890024cbbc0b5c8998c54cebf1cab060900092722bf1656'],
};
const CROSSES = Object.keys(CHARGES).filter((n) => n.startsWith('cross'));

// The tinctures in the cloth's dyes (src/data/dyes.js: the colour of the
// dyed cloth / 0.75; sable is an estimate, iron and oak galls). Velmar is a
// dark side (the side colour, plan 2.1): fields of a colour only, charges
// and ordinaries of a metal (the rule of tincture keeps them apart).
export const TINCTURES = {
  argent: '#fff2d1',
  or: '#edb600',
  gules: '#8d3433',
  azure: '#34556d',
  vert: '#5f794f',
  sable: '#403c3a',
};
const METALS = new Set(['argent', 'or']);
// arms too light for a dark side: the mean lightness of the cloth (L*)
const MAX_L = 55;
// arms like the flags of today's states, or like the sides' own signs
// (src/data/dyes.js SIGNS: the player's against the Kaganate is a white
// cross on woad): [field, ordinary or lone charge, its tincture], a lone
// cross of any kind as a cross (crossSaltire as a saltire), a star of any
// points as a mullet
const LOOKALIKES = [
  ['gules', 'cross', 'argent'],
  ['gules', 'fess', 'argent'],
  ['gules', 'cross', 'or'],
  ['azure', 'cross', 'or'],
  ['azure', 'cross', 'argent'],
  ['azure', 'saltire', 'argent'],
  ['azure', 'saltire', 'or'],
  ['vert', 'bend', 'argent'],
  ['azure', 'fleurDeLis', 'or'],
];
// nor a star or a crescent alone, of any tinctures (the flags with them)
const LONE_BANNED = ['mullet', 'crescent'];
// of the 16: ordinaries or divisions alone (about half the arms of the
// rolls), an ordinary with charges, charges alone
const QUOTA = { ordinary: 8, both: 4, charges: 4 };

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

// (the text that was checked is the text used; written beside and renamed,
// so a link in its place is replaced, not followed)
async function fetchPinned(url, file, sha) {
  if (fs.existsSync(file)) {
    const buf = fs.readFileSync(file);
    if (sha256(buf) === sha) return buf.toString('utf8');
  }
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (sha256(buf) !== sha) throw new Error(`${url}: not the pinned file (sha256 ${sha256(buf)})`);
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, buf, { flag: 'wx' });
  fs.renameSync(tmp, file);
  return buf.toString('utf8');
}

// Armoria's CommonJS modules, run from their downloaded text; the renderer
// reads the charges from `charges` instead of a directory
function armoria(sources, charges) {
  const loaded = {};
  const fakeFs = {
    readFileSync(p) {
      const m = /^public\/charges\/(.+)\.svg$/.exec(p);
      if (!m || !(m[1] in charges)) throw new Error(`not an allowed charge: ${p}`);
      return charges[m[1]];
    },
  };
  const load = (name) => {
    if (loaded[name]) return loaded[name].exports;
    const module = { exports: {} };
    loaded[name] = module;
    const req = (id) => {
      if (id === 'fs') return fakeFs;
      if (id === 'node-html-parser') return HTMLParser;
      if (id.startsWith('./')) return load(`app/${id.slice(2)}.js`);
      throw new Error(`armoria wants ${id}`);
    };
    new Function('require', 'module', 'exports', sources[name])(req, module, module.exports);
    return module.exports;
  };
  return { dm: load('app/dataModel.js'), generate: load('app/generator.js'), draw: load('app/renderer.js') };
}

// A charge's SVG without its black line work and shading (the outline is
// smaller than a pixel in the game; Velmar's charges are of one tincture)
function cleanCharge(svg) {
  const root = HTMLParser.parse(svg);
  for (const n of root.querySelectorAll('.pseudostroke')) n.parentNode.removeChild(n);
  for (const tag of ['g', 'path', 'polygon', 'polyline', 'circle', 'ellipse', 'rect']) {
    for (const n of root.querySelectorAll(tag)) {
      if (!n.parentNode) continue;
      const f = n.getAttribute('fill');
      if (n.getAttribute('fill-opacity') || (f && /^(#000|#000000|black)$/i.test(f))) n.parentNode.removeChild(n);
      else if (f && /^#(fff|ffffff|f6f6f6)$/i.test(f)) n.removeAttribute('fill');
    }
  }
  return root.toString();
}

// Velmar's arms in Armoria's data model
function configure(dm) {
  dm.tinctures.field = { metals: 0, colours: 1, stains: 0, patterns: 0 };
  dm.tinctures.division = { metals: 1, colours: 0, stains: 0, patterns: 0 };
  dm.tinctures.charge = { metals: 1, colours: 0, stains: 0, patterns: 0 };
  // (as often as in the rolls: gules, azure, sable, vert; argent, or)
  dm.tinctures.metals = { argent: 6, or: 4 };
  dm.tinctures.colours = { gules: 52, azure: 27, sable: 18, vert: 3 };
  dm.tinctures.stains = {};
  // (new objects throughout: Armoria caches its weighted lists on them)
  for (const c of Object.keys(dm.charges.types)) if (c !== 'inescutcheon') dm.charges[c] = {};
  const weights = (names) => Object.fromEntries(names.map((n) => [n, CHARGES[n][0]]));
  dm.charges.conventional = weights(Object.keys(CHARGES).filter((n) => !n.startsWith('cross')));
  dm.charges.crosses = weights(CROSSES);
  dm.charges.types = { conventional: 17, crosses: 7 };
  dm.charges.single = { conventional: 17, crosses: 7 };
  dm.charges.semy = { conventional: 1 };
  dm.ordinaries.lined = { fess: 127, chief: 102, bend: 99, bendSinister: 5, bar: 53, cross: 73, saltire: 23, pale: 18 };
  dm.ordinaries.straight = { chevron: 98, canton: 10, quarter: 9, pile: 4 };
  const conventional = { ...dm.positions.conventional };
  delete conventional.ABCDEFGHIJKL;
  dm.positions.conventional = conventional;
  for (const d of Object.keys(dm.positions.divisions)) {
    const p = { ...dm.positions.divisions[d] };
    delete p.ABCDEFGHIJKL;
    dm.positions.divisions[d] = p;
  }
  const lines = { straight: 920, engrailed: 45, indented: 15, dancetty: 15, wavy: 4 };
  for (const k of Object.keys(dm.lines)) delete dm.lines[k];
  Object.assign(dm.lines, lines);
  delete dm.lines.array;
  for (const d of Object.keys(dm.divisions)) if (d !== 'variants') dm.divisions[d] = { ...lines };
  dm.divisions.variants = { perPale: 10, perFess: 6, perCross: 29, perBend: 3 };
}

// A coat from a seed, made to the rules, or null. (Armoria replaces
// Math.random with its own: put back.)
function coatOf(A, seed) {
  const random = Math.random;
  let coa;
  try {
    coa = A.generate(seed);
  } finally {
    Math.random = random;
  }
  coa.shield = 'heater';
  for (const c of coa.charges || []) {
    delete c.t2;
    delete c.t3;
    c.stroke = 'none';
  }
  // on a divided field a charge or an ordinary would lie on a metal half
  // and a colour half alike: only the plain division
  if (coa.division) {
    if (coa.ordinaries) return null;
    delete coa.charges;
  }
  // charges large enough to be made out (no more than four, none small,
  // none in a canton or on a bar); beside an ordinary, not across it (in
  // the middle) nor of a metal on it
  for (const c of coa.charges || []) if (c.size < 0.5 || c.p.length > 4) return null;
  const ord = coa.ordinaries && coa.ordinaries[0];
  if (ord && coa.charges) {
    if (['canton', 'quarter', 'bar'].includes(ord.ordinary)) return null;
    const on = Object.keys((A.dm.ordinaries.data[ord.ordinary] || {}).positionsOn || {});
    for (const c of coa.charges) if (c.p.includes('e') || (on.includes(c.p) && METALS.has(c.t))) return null;
  }
  for (const t of [coa.division && coa.division.t, ord && ord.t, ...(coa.charges || []).map((c) => c.t)]) {
    if (t && !METALS.has(t)) return null;
  }
  const lone = coa.charges && coa.charges.length === 1 && coa.charges[0].p === 'e' ? coa.charges[0] : null;
  const shape = (c) => (c === 'crossSaltire' ? 'saltire' : CROSSES.includes(c) ? 'cross' : c.startsWith('mullet') ? 'mullet' : c);
  if (lone && !ord && LONE_BANNED.includes(shape(lone.charge))) return null;
  // (an ordinary as such: the charges beside it do not hide it)
  const key = ord ? [coa.t1, ord.ordinary, ord.t] : lone ? [coa.t1, shape(lone.charge), lone.t] : null;
  if (key && LOOKALIKES.some((b) => b.every((v, i) => v === key[i]))) return null;
  return coa;
}

const kindOf = (coa) => (coa.charges ? (coa.ordinaries ? 'both' : 'charges') : 'ordinary');

// the SVG of a coat as a flat rectangle: the heater's field (Armoria's box
// 25..175 x 25..200, 6:7) stretched to a square, no shield clip, no
// gradient overlay, no styles (charges of one tincture)
async function flatSvg(A, coa, id, size) {
  const raw = await A.draw(id, coa, size, TINCTURES);
  return raw
    .replace(/<svg id="[^"]*" width="\d+" height="\d+" viewBox="[^"]*"/, `<svg width="${size}" height="${size}" viewBox="25 25 150 175" preserveAspectRatio="none"`)
    .replace(/<radialGradient id="backlight"[\s\S]*?<\/radialGradient>/, '')
    .replace(/<path d="[^"]*" fill="url\(#backlight\)" stroke="#333"\/>/, '')
    .replace(new RegExp(`<g clip-path="url\\(#heater_${id}\\)">`), '<g>')
    .replace(/<style>[\s\S]*?<\/style>/g, '')
    .replace(/<rect x="0" y="0" width="200" height="200"/g, '<rect x="-60" y="-60" width="320" height="320"');
}

const render = (svg) => new Resvg(svg, { font: { loadSystemFonts: false } }).render();

// Whether a coat's edges carry on to the garment's seams: the game repeats
// its outer rows and columns over the rest of the garment (ClampToEdge), as
// right for a fess, a pale, a chief or a division along them as it is wrong
// for what crosses an edge aslant (a bend, a chevron: it turns into a pale)
// or a charge cut by it. Each stretch of a tincture other than the field's
// along an edge must be there, as wide (but for the drawing's antialiasing),
// an eighth of the coat in.
function carriesOn(pixels, size, field) {
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

// a tincture as sRGB bytes
const rgb = (t) => [1, 3, 5].map((k) => parseInt(TINCTURES[t].slice(k, k + 2), 16));

// mean lightness (L*) of the cloth as seen (the dyes' colours x 0.75 in
// linear light, plan 2.1)
function meanL(pixels) {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  let y = 0;
  for (let k = 0; k < pixels.length; k += 4) {
    y += 0.75 * (0.2126 * lin(pixels[k] / 255) + 0.7152 * lin(pixels[k + 1] / 255) + 0.0722 * lin(pixels[k + 2] / 255));
  }
  y /= pixels.length / 4;
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
}

// a short blazon (for the game's texts and for checking)
function blazon(coa) {
  const parts = [coa.division ? `${coa.division.division} ${coa.t1} and ${coa.division.t}` : coa.t1];
  for (const o of coa.ordinaries || []) parts.push(`a ${o.ordinary}${o.line && o.line !== 'straight' ? ' ' + o.line : ''} ${o.t}`);
  for (const c of coa.charges || []) parts.push(`${c.p.length} ${c.charge} ${c.t}`);
  return parts.join(', ');
}

async function main() {
  const sources = {};
  for (const [file, sha] of Object.entries(API_FILES)) sources[file] = await fetchPinned(API + file, path.join(CACHE, 'armoria-api', file), sha);
  const charges = {};
  for (const [name, [, sha]] of Object.entries(CHARGES)) {
    const svg = await fetchPinned(`${CHARGES_AT}${name}.svg`, path.join(CACHE, 'charges', name + '.svg'), sha);
    const meta = (svg.match(/<metadata[^>]*>/) || [''])[0];
    if (!meta.includes('license="https://creativecommons.org/publicdomain/zero/1.0"') || !meta.includes('author="Azgaar"')) {
      throw new Error(`${name}: not Azgaar's CC0 charge`);
    }
    charges[name] = cleanCharge(svg);
  }
  const A = armoria(sources, charges);
  configure(A.dm);
  // (the renderer reports every coat)
  const log = console.log;
  console.log = () => {};

  let seeds = SEEDS;
  if (!PICK && seeds.length !== COUNT) throw new Error(`SEEDS: ${seeds.length} of ${COUNT} (pick them with --pick)`);
  if (PICK) {
    const taken = { ordinary: [], both: [], charges: [] };
    const seen = new Set();
    const divisions = {};
    for (let i = 0; Object.entries(QUOTA).some(([k, n]) => taken[k].length < n) && i < 20000; i++) {
      const seed = `velmar-${i}`;
      const coa = coatOf(A, seed);
      if (!coa) continue;
      const kind = kindOf(coa);
      if (taken[kind].length >= QUOTA[kind]) continue;
      const ord = coa.ordinaries && coa.ordinaries[0];
      // (alike: of the same tinctures and the same division or ordinary, the
      // charges in the same places, whatever they are; not told apart at a
      // distance)
      const c = coa.charges && coa.charges[0];
      const like = JSON.stringify([coa.t1, coa.division && [coa.division.division, coa.division.t], ord && [ord.ordinary, ord.t], c && [c.p, c.t]]);
      if (seen.has(like)) continue;
      // (no more than two of a division or of an ordinary)
      const div = (coa.division && coa.division.division) || (ord && ord.ordinary);
      if (div && (divisions[div] || 0) >= 2) continue;
      const { pixels } = render(await flatSvg(A, coa, 'pick', SIZE));
      if (meanL(pixels) > MAX_L || !carriesOn(pixels, SIZE, rgb(coa.t1))) continue;
      seen.add(like);
      if (div) divisions[div] = (divisions[div] || 0) + 1;
      taken[kind].push(seed);
    }
    // (interleaved, so that the knights' range 6-15 gets every kind)
    seeds = [];
    for (let i = 0; i < QUOTA.both; i++) seeds.push(taken.ordinary[2 * i], taken.charges[i], taken.ordinary[2 * i + 1], taken.both[i]);
    if (seeds.some((s) => !s)) throw new Error(`the rules leave too few coats: ${JSON.stringify(taken)}`);
    log('seeds:', JSON.stringify(seeds));
    if (!OUT) return;
  }

  const out = path.resolve(OUT);
  fs.mkdirSync(out, { recursive: true });
  const coats = [];
  const meta = [];
  for (const [i, seed] of seeds.entries()) {
    const coa = coatOf(A, seed);
    if (!coa) throw new Error(`${seed}: no longer a coat by the rules`);
    const id = `c${i}`;
    const svg = await flatSvg(A, coa, id, SIZE);
    const image = render(svg);
    if (!carriesOn(image.pixels, SIZE, rgb(coa.t1))) throw new Error(`${seed}: its edges do not carry on`);
    const file = `heraldry_${String(i).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(out, file), image.asPng());
    coats.push(file);
    meta.push({ seed, field: coa.t1, blazon: blazon(coa), L: Math.round(meanL(image.pixels) * 10) / 10 });
    log(`${file}  ${blazon(coa)}`);
  }
  const charges_used = [...new Set(seeds.flatMap((s) => (coatOf(A, s).charges || []).map((c) => c.charge)))].sort();
  fs.writeFileSync(
    path.join(out, 'heraldry.json'),
    JSON.stringify({ size: SIZE, coats, meta, tinctures: TINCTURES, charges: charges_used }, null, 1) + '\n',
  );
  log(`wrote ${coats.length} coats to ${out}`);
}

await main();
