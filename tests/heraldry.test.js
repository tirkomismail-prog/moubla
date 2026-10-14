// The knights' coats of arms (tools/heraldry) and the armies' signs
// (src/data/dyes.js, partmat.js DECO_FRAGMENT).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import { TINCTURES, lightness, sideCloth, sideSign } from '../src/data/dyes.js';
import { deco, partLook, surface, tiled } from '../src/battle/partmat.js';

const texDir = new URL('../assets/characters/textures/', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('heraldry.json', texDir), 'utf8'));
const builder = fs.readFileSync(new URL('../tools/heraldry/build_heraldry.mjs', import.meta.url), 'utf8');

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
  // (tools/heraldry carriesOn: nothing aslant across the coat's edges)
  for (const m of manifest.meta) assert.ok(!/bend|chevron|saltire|pile/.test(m.blazon), `${m.seed}: ${m.blazon}`);
  // (no star or crescent alone; no cross alone on the sides' own fields)
  for (const m of manifest.meta) {
    assert.ok(!/^\w+, 1 (mullet\w*|crescent)$/.test(m.blazon), `${m.seed}: ${m.blazon}`);
    assert.ok(!/^(gules|azure), 1 cross\w* (argent|or)$/.test(m.blazon), `${m.seed}: ${m.blazon}`);
  }
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
