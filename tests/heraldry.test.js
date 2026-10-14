// The knights' coats of arms (tools/heraldry) and the armies' signs
// (src/data/dyes.js, partmat.js DECO_FRAGMENT).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import * as THREE from 'three';
import { TINCTURES, lightness, sideCloth, sideSign } from '../src/data/dyes.js';
import { deco, partLook, surface, tiled } from '../src/battle/partmat.js';
import { carriesOn, isLookalike, LONE_BANNED, rgbOf, shapeOf } from '../tools/heraldry/rules.mjs';

const texDir = new URL('../assets/characters/textures/', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('heraldry.json', texDir), 'utf8'));
const builder = fs.readFileSync(new URL('../tools/heraldry/build_heraldry.mjs', import.meta.url), 'utf8');

// An 8-bit RGBA PNG (as the heraldry build writes them): its side and pixels
function readPng(file) {
  const buf = fs.readFileSync(file);
  let pos = 8;
  let width = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('latin1', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      assert.deepEqual([data[8], data[9], data[12]], [8, 6, 0], 'an 8-bit RGBA PNG, not interlaced');
    } else if (type === 'IDAT') idat.push(data);
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = new Uint8Array(stride * width);
  for (let y = 0; y < width; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= 4 ? pixels[y * stride + x - 4] : 0;
      const b = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const c = x >= 4 && y > 0 ? pixels[(y - 1) * stride + x - 4] : 0;
      const p = a + b - c;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - c);
      const paeth = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      pixels[y * stride + x] = (v + [0, a, b, (a + b) >> 1, paeth][filter]) & 255;
    }
  }
  return { size: width, pixels };
}

test('the coats are there, one image each, of the dyes the game knows', () => {
  assert.equal(manifest.coats.length, 16);
  assert.equal(manifest.meta.length, manifest.coats.length);
  for (const f of manifest.coats) assert.ok(fs.existsSync(new URL(f, texDir)), f);
  // the build's tinctures are the game's dyes
  assert.deepEqual(manifest.tinctures, TINCTURES);
});

test("a dark side's arms: fields of a colour, dark as a whole", () => {
  for (const m of manifest.meta) {
    assert.ok(['gules', 'azure', 'sable', 'vert'].includes(m.field), `${m.seed}: field ${m.field}`);
    assert.ok(m.L <= 55, `${m.seed}: mean L* ${m.L}`);
  }
});

test("only Azgaar's CC0 charges, none of a state or an army", () => {
  const allowed = [...builder.matchAll(/^ {2}(\w+): \[\d+, '[0-9a-f]{64}'\],$/gm)].map((m) => m[1]);
  assert.ok(allowed.length >= 20);
  // emblems of states and armies, shapes with a modern meaning, and the
  // Commons charges whose licence is not CC0 after all
  const banned = ['cavalier', 'mace', 'maces', 'flamberge', 'skull2', 'bowWithThreeArrows', 'crossGamma', 'crossCeltic',
    'crossCeltic2', 'bridge2', 'raft', 'centaur', 'scythe2', 'pillar', 'squirrel'];
  for (const c of manifest.charges) assert.ok(allowed.includes(c), `${c} is not allowed`);
  for (const c of allowed) assert.ok(!banned.includes(c), `${c} is banned`);
  assert.match(builder, /author="Azgaar"/);
});

test("each side's sign stands out on its big garment", () => {
  for (const enemy of ['velmar', 'nordheim', 'rodan', 'kaganate', 'bandits']) {
    const sign = sideSign('player', enemy);
    const cloth = sideCloth('player', enemy);
    assert.ok(Math.abs(lightness(sign.color) - lightness(cloth.sign)) >= 35, `player vs ${enemy}`);
  }
  for (const f of ['velmar', 'nordheim', 'rodan']) {
    assert.ok(Math.abs(lightness(sideSign(f, 'player').color) - lightness(sideCloth(f, 'player').sign)) >= 35, f);
  }
  // (the Kaganate's on its yellow sleeves)
  assert.ok(Math.abs(lightness(sideSign('kaganate', 'player').color) - lightness(sideCloth('kaganate', 'player').sign)) >= 35);
  assert.equal(sideSign('bandits', 'player'), null);
});

test('the code of a sign or a coat goes with the second metalness into the palette', () => {
  const parts = ['Body', 'Surcoat', 'Cuirass'];
  const red = new THREE.Color(0.5, 0.1, 0.1);
  const look = {
    palette: {
      Body: surface('#ffffff', 0.5),
      Surcoat: { ...tiled('linen', '#ffffff'), deco: deco('saltire', { color: red, patch: new THREE.Color(0, 0, 0) }) },
      // (a brigandine's rivets: a second material, metalness 0.9)
      Cuirass: { ...tiled('brigandine', '#ffffff', 1, 0, { color: '#d0d0d0', metalness: 0.9 }), deco: deco('coat', { coat: 9 }) },
    },
    layerOf: () => null,
  };
  const tiles = { index: { linen: 0, brigandine: 1 }, repeat: { linen: 5, brigandine: 3 }, maskIndex: { brigandine: 0 } };
  const owner = {};
  const kind = { program: 'test', parts, tiles, deco: true };
  const looked = partLook(owner, kind, look);
  const palette = () => looked.material.userData.palette.value.image.data;
  const texel3 = (part, row = looked.row) => palette()[row * parts.length * 16 + parts.indexOf(part) * 16 + 15];
  const decode = (a) => {
    const code = Math.floor(a / 2);
    return { metal: a - 2 * code, shape: code & 7, woven: (code >> 3) & 1, tint: (code >> 4) & 15, patch: (code >> 8) & 15, coat: (code >> 12) - 1 };
  };
  assert.deepEqual(decode(texel3('Body')), { metal: 0, shape: 0, woven: 0, tint: 0, patch: 0, coat: -1 });
  const s = decode(texel3('Surcoat'));
  assert.deepEqual([s.shape, s.woven, s.coat], [2, 1, -1]);
  assert.ok(s.tint > 0 && s.patch > 0 && s.tint !== s.patch);
  const c = decode(texel3('Cuirass'));
  assert.equal(c.shape, 5);
  assert.equal(c.coat, 9);
  // (a float32 keeps the metalness to within 1/64 next to a large code)
  assert.ok(Math.abs(c.metal - 0.9) < 1 / 64);
  // (the same colour, the same slot of the kind's table)
  const again = partLook(owner, kind, look).row;
  assert.notEqual(again, looked.row);
  assert.equal(texel3('Surcoat', again), texel3('Surcoat'));
});

test("the arms carry on to the garment's seams, and are not a state's or a side's", () => {
  // the images themselves: nothing aslant across a coat's edges, no charge
  // cut by one (tools/heraldry/rules.mjs carriesOn)
  for (const [i, f] of manifest.coats.entries()) {
    const { size, pixels } = readPng(new URL(f, texDir));
    assert.equal(size, manifest.size);
    assert.ok(carriesOn(pixels, size, rgbOf(manifest.tinctures[manifest.meta[i].field])), `${f}: ${manifest.meta[i].blazon}`);
  }
  for (const m of manifest.meta) {
    // the blazon: the field or its division, then an ordinary ('a fess or'),
    // then charges ('3 mullet argent')
    const [field, ...rest] = m.blazon.split(', ');
    const ords = rest.filter((p) => p.startsWith('a '));
    const charges = rest.filter((p) => !p.startsWith('a '));
    for (const p of [field, ...ords]) assert.ok(!/bend|chevron|saltire|pile/i.test(p), `${m.seed}: ${m.blazon}`);
    // (as build_heraldry.mjs coatOf: an ordinary as such; a charge alone)
    for (const o of ords) {
      const [, name, t] = /^a (\w+)(?: \w+)? (argent|or)$/.exec(o);
      assert.ok(!isLookalike([m.field, name, t]), `${m.seed}: ${m.blazon}`);
    }
    if (!ords.length && charges.length === 1 && /^1 /.test(charges[0])) {
      const [, name, t] = /^1 (\w+) (argent|or)$/.exec(charges[0]);
      assert.ok(!LONE_BANNED.includes(shapeOf(name)), `${m.seed}: ${m.blazon}`);
      assert.ok(!isLookalike([m.field, shapeOf(name), t]), `${m.seed}: ${m.blazon}`);
    }
  }
  // (the rules themselves: each side's sign on its cloth, and a star alone)
  assert.ok(isLookalike(['gules', shapeOf('crossPatonce'), 'or']));
  assert.ok(isLookalike(['azure', shapeOf('crossFleury'), 'argent']));
  assert.ok(isLookalike(['sable', shapeOf('crossSaltire'), 'argent']));
  assert.ok(LONE_BANNED.includes(shapeOf('mullet6Pierced')));
});

test("a side's sign is the same on every man of it, faded or not, on the part his outfit has", async () => {
  const { palette } = await import('../src/battle/character.js');
  const man = (faction, enemy, look, kit, fade, shade) => ({
    look, kit, fade, shade, faction,
    sign: sideCloth(faction, enemy).sign, team: '#808080', pants: '#706050',
    skin: '#c09070', hair: '#403020', badge: sideSign(faction, enemy), arms: -1, armsWorn: false,
  });
  // (the parts of the Norse gambeson and of the Norse kyrtle: tools/characters/viking.py)
  const gambeson = new Set(['Gambeson', 'Belt', 'Trousers', 'Boots', 'Wraps', 'Hands']);
  const kyrtle = new Set(['Tunic', 'Vest', 'Oversleeves', 'Undersleeves', 'Belt', 'Trousers', 'Boots', 'Hands']);
  const brigandine = new Set(['Hauberk', 'Cuirass', 'Belt', 'Trousers', 'Boots', 'Wraps', 'Gloves']);
  // Velmar's weld cross on its madder, however faded the madder: never on a patch
  for (const fade of [0, 0.1, 0.18, 0.25]) {
    for (const shade of [0.94, 1.06]) {
      const look = palette(man('velmar', 'player', 'padded', null, fade, shade), new Set(['Gambeson', 'Belt', 'Hose']));
      assert.equal(look.Gambeson.deco.shape, 'cross');
      assert.equal(look.Gambeson.deco.patch, null, `fade ${fade}, shade ${shade}`);
    }
  }
  // the Kaganate's armbands on the sleeves a Norse man of its side has
  assert.equal(palette(man('kaganate', 'player', 'padded', 'norse', 0, 1), gambeson).Gambeson.deco.shape, 'armbands');
  assert.equal(palette(man('kaganate', 'player', 'brigandine', 'norse', 0, 1), brigandine).Hauberk.deco.shape, 'armbands');
  assert.equal(palette(man('kaganate', 'player', 'cloth', 'norse', 0, 1), kyrtle).Oversleeves.deco.shape, 'armbands');
  // and the cross on a Norse kyrtle's vest, on black cloth over a mail one
  // (UNDYED on the player's mail: Nordheim's white saltire on mail)
  assert.equal(palette(man('player', 'nordheim', 'cloth', 'norse', 0, 1), kyrtle).Vest.deco.shape, 'cross');
  const mail = palette(man('nordheim', 'player', 'mail', 'norse', 0, 1), kyrtle).Vest.deco;
  assert.equal(mail.shape, 'saltire');
  assert.ok(mail.patch && !mail.weave);
});
