// Procedural models for battles: people, horses, weapons, shields.
// Every model is built from primitive shapes merged into vertex-coloured
// geometries so that a single shared material can be used.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Two shared materials: a cheap Lambert one for the low preset and a PBR one
// that reads a per-vertex `metal` attribute, so that steel parts shine and
// reflect the sky while cloth and skin stay matte.
const LAMBERT = new THREE.MeshLambertMaterial({ vertexColors: true });
const STANDARD = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0 });
STANDARD.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nattribute float metal;\nvarying float vMetal;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMetal = metal;');
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying float vMetal;')
    .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = mix( roughness, 0.3, vMetal );')
    .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = mix( metalness, 0.92, vMetal );');
};
STANDARD.customProgramCacheKey = () => 'metalAttr';

let current = LAMBERT;

export function setMaterialQuality(standard) {
  current = standard ? STANDARD : LAMBERT;
}

export function material() {
  return current;
}

// ---------------------------------------------------------------------------
// Colours
// ---------------------------------------------------------------------------

const STEEL = '#9aa3ab';
const DARK_STEEL = '#5d646b';
const BRIGHT_STEEL = '#c8d0d8';
const BRASS = '#b08a3a';
const WOOD = '#7a5230';
const DARK_WOOD = '#4a3020';
const LEATHER = '#6b4526';
const DARK_LEATHER = '#3a2616';
const SKIN_TONES = ['#e0b590', '#d4a57f', '#c68c62', '#e8c3a0', '#b77a50'];
const HAIR = ['#2b1d12', '#5a3a1e', '#8a6a3a', '#1a1a1a', '#b08a50'];

// How metallic each colour is (0 = cloth/skin/wood, 1 = polished steel).
const METAL = {
  [STEEL]: 1,
  [DARK_STEEL]: 0.9,
  [BRIGHT_STEEL]: 1,
  [BRASS]: 0.85,
  '#8a9096': 0.9,
  '#8d949b': 0.6, // mail
  '#6d6f72': 0.55, // mail chausses
  '#7f8487': 0.7, // lamellar
  '#b4bcc4': 1, // plate
};

// The textured look of the colours (src/battle/character.js itemMaterial): a
// tileable material and the tint it is multiplied by. Other colours stay plain.
const SURFACE = {
  [STEEL]: ['plate', '#ffffff'],
  [DARK_STEEL]: ['plate', '#9aa0a8'],
  [BRIGHT_STEEL]: ['plate', '#ffffff'],
  [BRASS]: ['plate', '#ffc668'],
  '#8a9096': ['plate', '#d8dce0'],
  [WOOD]: ['wood', '#ffffff'],
  [DARK_WOOD]: ['wood', '#9a8070'],
  '#a07a4a': ['wood', '#ffe8cc'],
  '#8a6a3a': ['wood', '#f0d8b8'],
  '#6b3a1a': ['wood', '#c8a080'],
  [LEATHER]: ['leather', '#ffffff'],
  [DARK_LEATHER]: ['leather', '#9a8a80'],
};

// Layer of each tileable material in the texture array (set when the
// textures are loaded; without them everything stays plain).
let tileIndex = {};

export function setTileIndex(index) {
  tileIndex = index;
  cache.clear();
}

// Box-projected UVs in metres: along an item (Z) the texture runs lengthwise
// (the grain of a shaft), on faces towards Z (shield boards) upwards.
function boxUV(x, y, z, nx, ny, nz, out) {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  const az = Math.abs(nz);
  if (az >= ax && az >= ay) {
    out[0] = y;
    out[1] = x;
  } else {
    out[0] = z;
    out[1] = ax >= ay ? y : x;
  }
  return out;
}
const _uv = [0, 0];

export function pickSkin(rand) {
  return SKIN_TONES[Math.floor(rand() * SKIN_TONES.length)];
}

export function pickHair(rand) {
  return HAIR[Math.floor(rand() * HAIR.length)];
}

function shade(color, k) {
  const c = new THREE.Color(color).multiplyScalar(k);
  return `#${c.getHexString()}`;
}

// ---------------------------------------------------------------------------
// Geometry builder
// ---------------------------------------------------------------------------

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpV = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

export class GeoBuilder {
  constructor() {
    this.pos = [];
    this.nrm = [];
    this.col = [];
    this.met = [];
    this.uv = [];
    this.tile = [];
    this.tint = [];
  }

  // `r` is an Euler triple or a quaternion. `surface`: [tileable material,
  // tint] for the textured look instead of the one of `color` (SURFACE).
  add(geo, color, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], surface = null) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    if (r.isQuaternion) tmpQ.copy(r);
    else tmpQ.setFromEuler(tmpE.set(r[0], r[1], r[2]));
    tmpM.compose(tmpV.set(p[0], p[1], p[2]), tmpQ, tmpS.set(s[0], s[1], s[2]));
    g.applyMatrix4(tmpM);
    const c = new THREE.Color(color);
    const metal = METAL[color] || 0;
    const surf = surface || SURFACE[color];
    const tile = surf && surf[0] in tileIndex ? tileIndex[surf[0]] : -1;
    const tint = tile >= 0 ? new THREE.Color(surf[1]) : c;
    const pa = g.attributes.position.array;
    const na = g.attributes.normal.array;
    for (let i = 0; i < pa.length; i += 3) {
      this.pos.push(pa[i], pa[i + 1], pa[i + 2]);
      this.nrm.push(na[i], na[i + 1], na[i + 2]);
      this.col.push(c.r, c.g, c.b);
      this.met.push(metal);
      boxUV(pa[i], pa[i + 1], pa[i + 2], na[i], na[i + 1], na[i + 2], _uv);
      this.uv.push(_uv[0], _uv[1]);
      this.tile.push(tile);
      this.tint.push(tint.r, tint.g, tint.b);
    }
    return this;
  }

  box(w, h, d, color, p, r, s, surface) {
    return this.add(new THREE.BoxGeometry(w, h, d), color, p, r, s, surface);
  }

  cyl(rt, rb, h, seg, color, p, r, s, surface) {
    return this.add(new THREE.CylinderGeometry(rt, rb, h, seg), color, p, r, s, surface);
  }

  sphere(rad, color, p, ws = 8, hs = 6, s, r) {
    return this.add(new THREE.SphereGeometry(rad, ws, hs), color, p, r || [0, 0, 0], s);
  }

  cone(rad, h, seg, color, p, r, s) {
    return this.add(new THREE.ConeGeometry(rad, h, seg), color, p, r, s);
  }

  // A tapered round segment from point a (radius ra) to point b (radius rb);
  // `s` squashes the cross-section ([x, z] scale).
  limb(a, b, ra, rb, seg, color, s = [1, 1]) {
    _a.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const len = _a.length();
    tmpQ.setFromUnitVectors(UP, _a.normalize());
    _b.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
    return this.add(new THREE.CylinderGeometry(rb, ra, len, seg, 1), color, [_b.x, _b.y, _b.z], tmpQ.clone(), [s[0], 1, s[1]]);
  }

  // Part of an open cylinder around an axis along Z (for cloth wrapped over a
  // body): `arc` radians centred on the top (+Y).
  wrapZ(r, len, arc, seg, color, p, s = [1, 1, 1], r2 = r) {
    const g = new THREE.CylinderGeometry(r2, r, len, seg, 1, true, Math.PI - arc / 2, arc);
    return this.add(g, color, p, [Math.PI / 2, 0, 0], s);
  }

  // Part of an open cylinder around a vertical axis (tabards, skirts):
  // `arc` radians centred on +Z (front) or on -Z when `back`.
  wrapY(rt, rb, h, arc, seg, color, p, s = [1, 1, 1], back = false) {
    const g = new THREE.CylinderGeometry(rt, rb, h, seg, 1, true, (back ? Math.PI : 0) - arc / 2, arc);
    return this.add(g, color, p, [0, 0, 0], s);
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('metal', new THREE.Float32BufferAttribute(this.met, 1));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('_tile', new THREE.Float32BufferAttribute(this.tile, 1));
    g.setAttribute('tint', new THREE.Float32BufferAttribute(this.tint, 3));
    g.computeBoundingSphere();
    return g;
  }
}

const cache = new Map();
function cached(key, fn) {
  let g = cache.get(key);
  if (!g) {
    g = fn();
    cache.set(key, g);
  }
  return g;
}

// The rigid parts of a rig drawn as one skinned mesh: the vertices of each
// part follow the group it hangs from (weight 1), so the animation code still
// moves the groups but the whole model costs one draw call. `parts` are
// [group, geometry] pairs; `key` names the combination for the cache;
// `sphere` holds the model in any pose (for culling), in the root's space.
function rigidSkin(root, parts, key, sphere) {
  root.updateMatrixWorld(true);
  const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const rest = parts.map(([group]) => new THREE.Matrix4().multiplyMatrices(toRoot, group.matrixWorld));
  const geo = cached(`rigid:${key}`, () =>
    mergeGeometries(
      parts.map(([, g], i) => {
        const c = g.clone().applyMatrix4(rest[i]);
        const n = c.attributes.position.count;
        const index = new Uint16Array(n * 4);
        const weight = new Float32Array(n * 4);
        for (let k = 0; k < n; k++) {
          index[k * 4] = i;
          weight[k * 4] = 1;
        }
        c.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(index, 4));
        c.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weight, 4));
        return c;
      }),
    ),
  );
  const m = new THREE.SkinnedMesh(geo, current);
  m.castShadow = true;
  m.receiveShadow = true;
  m.boundingSphere = sphere;
  root.add(m);
  m.bind(new THREE.Skeleton(parts.map(([group]) => group), rest.map((r) => r.clone().invert())), new THREE.Matrix4());
  return m;
}

// ---------------------------------------------------------------------------
// Human
// ---------------------------------------------------------------------------

const ARMOR_COLORS = {
  cloth: null, // team colour
  padded: '#cdbf9a',
  leather: '#7a5534',
  mail: '#8d949b',
  lamellar: '#7f8487',
  plate: '#b4bcc4',
};

// Body cross-sections are ellipses: depth = radius * DEPTH.
const DEPTH = 0.62;

function torsoGeo(look, team, team2) {
  return cached(`torso:${look}:${team}:${team2}`, () => {
    const b = new GeoBuilder();
    const base = ARMOR_COLORS[look] || team;
    const sz = [1, 1, DEPTH];
    // chest (wider at the shoulders) and belly
    b.cyl(0.215, 0.18, 0.34, 14, base, [0, 0.43, 0], [0, 0, 0], sz);
    b.cyl(0.18, 0.185, 0.26, 14, base, [0, 0.15, 0], [0, 0, 0], sz);
    // shoulders: rounded top of the chest
    b.sphere(0.215, base, [0, 0.58, 0], 14, 6, [1, 0.32, DEPTH]);
    // belt with a buckle
    b.cyl(0.192, 0.192, 0.06, 14, LEATHER, [0, 0.03, 0], [0, 0, 0], [1, 1, DEPTH + 0.03]);
    b.box(0.06, 0.05, 0.02, BRASS, [0, 0.03, 0.125]);
    // flared skirt of the tunic / mail / tassets
    const skirt = look === 'plate' ? DARK_STEEL : look === 'cloth' ? team : look === 'leather' ? '#6a4a2e' : base;
    b.cyl(0.19, 0.235, 0.3, 14, skirt, [0, -0.12, 0], [0, 0, 0], [1, 1, 0.7]);
    if (look === 'mail' || look === 'plate' || look === 'lamellar' || look === 'padded') {
      // surcoat panels in faction colours, front and back
      b.wrapY(0.222, 0.19, 0.54, 1.5, 8, team, [0, 0.33, 0], sz);
      b.wrapY(0.222, 0.19, 0.54, 1.5, 8, team, [0, 0.33, 0], sz, true);
      b.wrapY(0.19, 0.245, 0.29, 1.4, 8, team, [0, -0.135, 0], [1, 1, 0.72]);
      b.wrapY(0.19, 0.245, 0.29, 1.4, 8, team, [0, -0.135, 0], [1, 1, 0.72], true);
      b.box(0.07, 0.3, 0.02, team2, [0, 0.38, 0.14]);
      b.box(0.2, 0.06, 0.02, team2, [0, 0.44, 0.137]);
    } else if (look === 'leather') {
      b.wrapY(0.222, 0.19, 0.34, 0.5, 4, team, [0, 0.4, 0], sz);
      b.box(0.06, 0.08, 0.02, BRASS, [0.08, 0.3, 0.12]);
    } else {
      // a coloured collar and hem on a plain tunic
      b.cyl(0.13, 0.19, 0.05, 14, team2, [0, 0.61, 0], [0, 0, 0], sz);
      b.cyl(0.236, 0.24, 0.04, 14, team2, [0, -0.26, 0], [0, 0, 0], [1, 1, 0.7]);
    }
    if (look === 'plate' || look === 'lamellar') {
      // pauldrons
      for (const x of [0.25, -0.25]) b.sphere(0.12, STEEL, [x, 0.56, 0], 10, 6, [1, 0.62, 1.05]);
      b.cyl(0.12, 0.2, 0.06, 12, STEEL, [0, 0.62, 0], [0, 0, 0], sz); // gorget
    } else if (look === 'mail') {
      b.cyl(0.1, 0.19, 0.08, 12, '#8d949b', [0, 0.63, 0], [0, 0, 0], sz); // coif collar
    }
    return b.build();
  });
}

function headGeo(skin, hair, beard) {
  return cached(`head:${skin}:${hair}:${beard}`, () => {
    const b = new GeoBuilder();
    b.cyl(0.056, 0.06, 0.12, 8, skin, [0, 0.04, 0.0]); // neck
    b.sphere(0.118, skin, [0, 0.185, 0], 12, 8, [0.92, 1.08, 1]); // skull
    b.sphere(0.09, skin, [0, 0.125, 0.03], 10, 6, [0.95, 0.85, 1]); // jaw
    b.limb([0, 0.2, 0.103], [0, 0.158, 0.122], 0.011, 0.016, 6, skin, [1, 1.2]); // nose bridge
    b.sphere(0.017, skin, [0, 0.157, 0.12], 6, 4, [1.15, 0.9, 1]); // nose tip
    for (const x of [0.042, -0.042]) {
      b.sphere(0.015, '#e9e2d4', [x, 0.194, 0.1], 6, 4, [1.15, 0.62, 0.6]); // eye whites
      b.sphere(0.0075, '#24160c', [x, 0.194, 0.108], 5, 3, [1, 1, 0.6]); // pupils
      b.box(0.045, 0.012, 0.02, hair, [x, 0.222, 0.103], [0.1, 0, x > 0 ? -0.12 : 0.12]); // brows
      b.sphere(0.028, skin, [x * 2.7, 0.18, -0.005], 5, 4, [0.5, 1, 0.8]); // ears
    }
    b.box(0.05, 0.01, 0.01, '#8a4a3a', [0, 0.105, 0.117]); // mouth
    // hair: a cap tilted back so it covers the crown and the back of the head
    b.add(new THREE.SphereGeometry(0.127, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.58), hair, [0, 0.19, -0.008], [-0.7, 0, 0], [0.95, 1.06, 1.02]);
    if (beard) {
      b.sphere(0.093, hair, [0, 0.115, 0.035], 8, 5, [0.97, 0.9, 1.0]);
      b.box(0.07, 0.016, 0.02, hair, [0, 0.13, 0.128]); // moustache
      b.box(0.045, 0.01, 0.01, '#8a4a3a', [0, 0.112, 0.13]); // mouth
    }
    return b.build();
  });
}

export function helmetGeo(look, team) {
  if (!look) return null;
  return cached(`helm:${look}:${team}`, () => {
    const b = new GeoBuilder();
    const cap = (r, color, p, arc, s, tilt = 0) =>
      b.add(new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, 0, Math.PI * arc), color, p, [tilt, 0, 0], s);
    switch (look) {
      case 'hood':
        cap(0.142, team, [0, 0.19, -0.01], 0.62, [1, 1.08, 1.08], -0.55);
        b.cyl(0.11, 0.24, 0.14, 14, team, [0, 0.0, -0.01], [0, 0, 0], [1, 1, 0.78]);
        break;
      case 'fur':
        b.cyl(0.14, 0.145, 0.12, 14, '#6b4a2e', [0, 0.3, 0]);
        cap(0.135, '#8a6a4a', [0, 0.34, 0], 0.5, [1, 0.7, 1]);
        break;
      case 'cap':
        cap(0.135, LEATHER, [0, 0.2, 0], 0.5, [1, 1.05, 1.05]);
        b.cyl(0.137, 0.137, 0.025, 14, DARK_LEATHER, [0, 0.21, 0]);
        break;
      case 'nasal':
        b.cone(0.136, 0.2, 14, STEEL, [0, 0.36, 0]);
        b.cyl(0.136, 0.136, 0.08, 14, STEEL, [0, 0.23, 0]);
        b.box(0.025, 0.12, 0.02, STEEL, [0, 0.17, 0.132]);
        break;
      case 'spangen':
        cap(0.138, STEEL, [0, 0.21, 0], 0.5, [1, 1.12, 1.05]);
        // brass bands arching over the dome
        b.add(new THREE.TorusGeometry(0.139, 0.009, 4, 18, Math.PI), BRASS, [0, 0.21, 0], [0, 0, 0], [1, 1.12, 1]);
        b.add(new THREE.TorusGeometry(0.139, 0.009, 4, 18, Math.PI), BRASS, [0, 0.21, 0], [0, Math.PI / 2, 0], [1, 1.12, 1]);
        b.cyl(0.14, 0.14, 0.04, 14, BRASS, [0, 0.21, 0]);
        b.box(0.24, 0.07, 0.03, STEEL, [0, 0.18, 0.12]); // spectacle guard
        break;
      case 'kettle':
        cap(0.135, STEEL, [0, 0.22, 0], 0.5, [1, 0.95, 1]);
        b.cyl(0.215, 0.225, 0.018, 20, STEEL, [0, 0.22, 0]);
        b.cyl(0.02, 0.02, 0.02, 6, STEEL, [0, 0.35, 0]);
        break;
      case 'spiked':
        b.cone(0.137, 0.32, 14, STEEL, [0, 0.4, 0]);
        b.cyl(0.14, 0.14, 0.07, 14, '#8a6a3a', [0, 0.22, 0]);
        b.cyl(0.02, 0.005, 0.1, 6, team, [0, 0.6, 0]);
        b.box(0.22, 0.14, 0.02, '#6d6f72', [0, 0.1, -0.1]); // mail aventail
        break;
      case 'great':
        b.cyl(0.142, 0.15, 0.33, 16, STEEL, [0, 0.19, 0]);
        cap(0.142, STEEL, [0, 0.35, 0], 0.5, [1, 0.45, 1]);
        b.box(0.19, 0.018, 0.02, '#111111', [0, 0.2, 0.146]);
        b.box(0.018, 0.13, 0.02, BRASS, [0, 0.13, 0.148]);
        for (let i = 0; i < 3; i++) b.box(0.012, 0.012, 0.02, '#111111', [0.04 + i * 0.02, 0.1, 0.143]);
        break;
      default:
        return null;
    }
    return b.build();
  });
}

function legGeo(pants, boots) {
  return cached(`leg:${pants}:${boots}`, () => {
    const b = new GeoBuilder();
    b.sphere(0.092, pants, [0, -0.02, 0], 8, 5, [1, 1, 1.05]); // hip
    b.limb([0, -0.02, 0], [0, -0.45, 0.01], 0.09, 0.066, 8, pants, [1, 1.1]); // thigh
    b.sphere(0.066, pants, [0, -0.46, 0.012], 6, 4); // knee
    b.limb([0, -0.46, 0.01], [0, -0.8, -0.01], 0.064, 0.05, 8, pants); // shin
    b.limb([0, -0.56, -0.005], [0, -0.87, -0.005], 0.07, 0.066, 8, boots); // boot shaft
    b.cyl(0.075, 0.075, 0.03, 8, boots, [0, -0.56, -0.005]); // boot cuff
    b.sphere(0.07, boots, [0, -0.875, 0.06], 8, 5, [0.95, 0.65, 1.9]); // foot
    b.box(0.13, 0.025, 0.27, '#241810', [0, -0.908, 0.05]); // sole
    return b.build();
  });
}

function armGeo(sleeve, skin, glove) {
  return cached(`arm:${sleeve}:${skin}:${glove}`, () => {
    const b = new GeoBuilder();
    const cuff = glove ? DARK_STEEL : sleeve;
    const hand = glove ? '#4a3a2a' : skin;
    b.sphere(0.078, sleeve, [0, -0.02, 0], 8, 5); // shoulder
    b.limb([0, -0.02, 0], [0, -0.34, 0], 0.072, 0.058, 8, sleeve); // upper arm
    b.sphere(0.057, sleeve, [0, -0.34, 0], 6, 4); // elbow
    b.limb([0, -0.34, 0], [0, -0.55, 0], 0.056, 0.044, 8, glove ? sleeve : skin); // forearm
    if (glove) b.limb([0, -0.47, 0], [0, -0.56, 0], 0.06, 0.056, 8, cuff); // gauntlet cuff
    else b.cyl(0.058, 0.058, 0.04, 8, sleeve, [0, -0.36, 0]); // sleeve end
    b.sphere(0.048, hand, [0, -0.6, 0.008], 8, 5, [0.8, 1.15, 1.05]); // hand around the grip
    b.sphere(0.02, hand, [0.03, -0.585, 0.035], 6, 4, [1, 1.5, 1]); // thumb
    return b.build();
  });
}

// The pose rig of a soldier: a hierarchy of groups that the animation code
// moves. With `spec.driverOnly` it has no meshes of its own (a skinned
// character follows it instead).
const HUMAN_SPHERE = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 1.3);

export function buildHuman(spec) {
  // (the simple body has no brigandine: plates)
  if (spec.look === 'brigandine') spec = { ...spec, look: 'plate' };
  const show = !spec.driverOnly;
  const parts = [];
  const key = [];
  const mesh = (geo, group, name) => {
    if (show) {
      parts.push([group, geo]);
      key.push(name);
    }
  };
  const root = new THREE.Group();
  const hips = new THREE.Group();
  hips.position.y = 0.92;
  root.add(hips);
  const pants = spec.look === 'plate' ? DARK_STEEL : spec.look === 'mail' ? '#6d6f72' : spec.pants;
  const boots = spec.look === 'plate' ? STEEL : DARK_LEATHER;
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  legL.position.set(0.1, 0, 0);
  legR.position.set(-0.1, 0, 0);
  mesh(legGeo(pants, boots), legL, `leg:${pants}:${boots}`);
  mesh(legGeo(pants, boots), legR, '');
  hips.add(legL, legR);
  const torso = new THREE.Group();
  hips.add(torso);
  mesh(torsoGeo(spec.look, spec.team, spec.team2), torso, `torso:${spec.look}:${spec.team}:${spec.team2}`);
  const neck = new THREE.Group();
  neck.position.y = 0.6;
  torso.add(neck);
  mesh(headGeo(spec.skin, spec.hair, !!spec.beard), neck, `head:${spec.skin}:${spec.hair}:${!!spec.beard}`);
  const hg = show ? helmetGeo(spec.helmet, spec.team) : null;
  if (hg) mesh(hg, neck, `helmet:${spec.helmet}:${spec.team}`);
  const sleeve = ARMOR_COLORS[spec.look] || spec.team;
  const glove = spec.look === 'mail' || spec.look === 'plate' || spec.look === 'lamellar';
  const armR = new THREE.Group();
  armR.position.set(-0.28, 0.53, 0);
  mesh(armGeo(sleeve, spec.skin, glove), armR, `arm:${sleeve}:${spec.skin}:${glove}`);
  const handR = new THREE.Group();
  handR.position.y = -0.6;
  armR.add(handR);
  const wristR = new THREE.Group();
  handR.add(wristR);
  const armL = new THREE.Group();
  armL.position.set(0.28, 0.53, 0);
  mesh(armGeo(sleeve, spec.skin, glove), armL, '');
  const handL = new THREE.Group();
  handL.position.y = -0.6;
  armL.add(handL);
  torso.add(armR, armL);
  const shieldMount = new THREE.Group();
  torso.add(shieldMount);
  const backMount = new THREE.Group();
  backMount.position.set(0, 0.35, -0.16);
  torso.add(backMount);
  if (show) rigidSkin(root, parts, `human:${key.join('|')}`, HUMAN_SPHERE);
  return { root, hips, torso, neck, legL, legR, armR, armL, handR, wristR, handL, shieldMount, backMount };
}

// ---------------------------------------------------------------------------
// Weapons (built along +Z from the grip at the origin)
// ---------------------------------------------------------------------------

const TIP = [Math.PI / 2, 0, 0];

// A flat profile (points in the plane of the head: u outwards along +Y, v
// along the item, +Z) extruded to `depth` across it (X), bevelled.
const PROFILE_Q = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0)),
);
function profile(b, points, depth, color, z, bevel = 0.003) {
  const sh = new THREE.Shape(points.map(([u, v]) => new THREE.Vector2(u, v)));
  const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 1, curveSegments: 8 });
  b.add(geo, color, [-depth / 2, 0, z], PROFILE_Q);
}

// A bearded axe head at height z of the haft (scale k).
function axeHead(b, z, k, color = STEEL) {
  const pts = [[0.012, 0.035], [0.07, 0.028], [0.15, 0.075], [0.165, 0.03], [0.162, -0.02], [0.148, -0.07], [0.118, -0.11],
    [0.095, -0.075], [0.06, -0.04], [0.012, -0.035]].map(([u, v]) => [u * k, v * k]);
  profile(b, pts, 0.01 * k, color, z);
  b.cyl(0.03 * k, 0.03 * k, 0.075 * k, 10, DARK_STEEL, [0, 0, z], TIP); // socket round the haft
}

// A flat double-edged blade of length `len` starting at z0, with a point.
function blade(b, z0, len, w, color = STEEL) {
  const body = len - w * 1.4;
  const flat = [1, 1, 0.3];
  b.cyl(w * 0.42, w / 2, body, 4, color, [0, 0, z0 + body / 2], TIP, flat);
  b.box(w * 0.22, 0.016, body * 0.9, BRIGHT_STEEL, [0, 0, z0 + body * 0.47]); // fuller
  b.cone(w * 0.42, w * 1.4, 4, color, [0, 0, z0 + body + w * 0.7], TIP, flat);
}

export function weaponGeo(model) {
  return cached(`w:${model}`, () => {
    const b = new GeoBuilder();
    switch (model) {
      case 'sword':
      case 'sword_long':
      case 'greatsword': {
        const len = model === 'sword' ? 0.72 : model === 'sword_long' ? 0.85 : 1.1;
        const grip = model === 'greatsword' ? 0.26 : 0.14;
        const guard = model === 'greatsword' ? 0.14 : 0.095;
        // leather grip with brass bands, a wheel pommel, a tapering guard
        b.cyl(0.016, 0.018, grip, 10, DARK_LEATHER, [0, 0, -grip / 2 + 0.04], TIP);
        for (const z of [0.035, -grip + 0.045]) b.cyl(0.019, 0.019, 0.008, 10, BRASS, [0, 0, z], TIP);
        b.cyl(0.032, 0.032, 0.022, 16, STEEL, [0, 0, -grip + 0.02]);
        b.cyl(0.018, 0.018, 0.026, 10, BRASS, [0, 0, -grip + 0.02]);
        for (const x of [guard, -guard]) b.limb([0, 0, 0.058], [x, 0, 0.066], 0.013, 0.008, 6, STEEL, [1, 0.8]);
        b.box(0.03, 0.022, 0.03, STEEL, [0, 0, 0.06]);
        blade(b, 0.075, len, model === 'greatsword' ? 0.055 : 0.048);
        break;
      }
      case 'sabre':
        b.cyl(0.018, 0.02, 0.14, 8, DARK_LEATHER, [0, 0, -0.03], TIP);
        b.box(0.12, 0.028, 0.028, BRASS, [0, 0, 0.05]);
        b.box(0.04, 0.012, 0.45, STEEL, [0, 0, 0.3]);
        b.box(0.04, 0.012, 0.36, STEEL, [0, 0.04, 0.7], [-0.22, 0, 0]);
        b.cone(0.02, 0.08, 4, STEEL, [0, 0.088, 0.915], [Math.PI / 2 - 0.22, 0, 0], [1, 1, 0.3]);
        break;
      case 'cleaver':
        b.cyl(0.018, 0.02, 0.14, 8, DARK_WOOD, [0, 0, -0.03], TIP);
        b.box(0.08, 0.015, 0.4, '#8a9096', [0, 0.02, 0.26]);
        break;
      case 'club':
        b.cyl(0.028, 0.03, 0.3, 8, DARK_WOOD, [0, 0, 0.05], TIP);
        b.cyl(0.065, 0.035, 0.4, 9, WOOD, [0, 0, 0.4], TIP);
        b.sphere(0.065, WOOD, [0, 0, 0.6], 9, 5, [1, 1, 0.6]);
        break;
      case 'mace':
        b.cyl(0.022, 0.024, 0.55, 8, DARK_WOOD, [0, 0, 0.2], TIP);
        b.sphere(0.065, DARK_STEEL, [0, 0, 0.52], 10, 8);
        for (const a of [0, 1, 2, 3]) b.box(0.018, 0.15, 0.08, DARK_STEEL, [0, 0, 0.52], [0, 0, (a * Math.PI) / 4]);
        break;
      case 'axe':
      case 'axe_war':
      case 'throwaxe': {
        const L = model === 'axe_war' ? 0.75 : model === 'throwaxe' ? 0.45 : 0.62;
        b.cyl(0.02, 0.024, L, 8, WOOD, [0, 0, L / 2 - 0.08], TIP);
        axeHead(b, L - 0.13, model === 'axe_war' ? 1.25 : model === 'throwaxe' ? 0.8 : 1.05);
        break;
      }
      case 'greataxe':
        b.cyl(0.024, 0.028, 1.25, 8, WOOD, [0, 0, 0.45], TIP);
        axeHead(b, 0.98, 1.9);
        break;
      case 'spear':
      case 'pitchfork':
      case 'javelin': {
        const L = model === 'javelin' ? 1.2 : model === 'pitchfork' ? 1.6 : 1.95;
        const back = model === 'javelin' ? 0.4 : 0.55;
        b.cyl(0.02, 0.022, L, 8, WOOD, [0, 0, L / 2 - back], TIP);
        if (model === 'pitchfork') {
          for (const x of [-0.06, 0, 0.06]) b.cyl(0.006, 0.01, 0.22, 5, DARK_STEEL, [x, 0, L - back + 0.1], TIP);
          b.box(0.14, 0.02, 0.02, DARK_STEEL, [0, 0, L - back]);
        } else {
          b.cyl(0.022, 0.026, 0.08, 8, DARK_STEEL, [0, 0, L - back - 0.02], TIP); // socket
          b.cone(0.04, 0.26, 4, STEEL, [0, 0, L - back + 0.14], TIP, [1, 1, 0.35]);
        }
        break;
      }
      case 'lance':
        b.cyl(0.028, 0.04, 2.9, 10, '#a07a4a', [0, 0, 0.55], TIP);
        b.cyl(0.075, 0.03, 0.16, 10, '#8a6a3a', [0, 0, 0.02], TIP); // vamplate
        b.cone(0.035, 0.24, 6, STEEL, [0, 0, 2.1], TIP);
        break;
      case 'bow':
      case 'bow_short':
      case 'bow_long': {
        const L = model === 'bow_long' ? 0.8 : model === 'bow_short' ? 0.5 : 0.62;
        const col = model === 'bow_short' ? '#6b3a1a' : WOOD;
        b.cyl(0.02, 0.02, 0.16, 8, DARK_LEATHER, [0, 0, 0], TIP);
        for (const k of [1, -1]) {
          b.limb([0, 0, 0.06 * k], [0, -0.035, (L * 0.55 + 0.06) * k], 0.02, 0.016, 6, col);
          b.limb([0, -0.035, (L * 0.55 + 0.06) * k], [0, -0.13, (L + 0.06) * k], 0.016, 0.01, 6, col);
        }
        b.box(0.004, 0.004, L * 2 + 0.12, '#dddddd', [0, -0.13, 0]);
        break;
      }
      case 'crossbow':
        // a shaped stock (deeper at the butt), steel prod, stirrup, nut
        profile(b, [[-0.03, -0.18], [0.035, -0.18], [0.03, 0.2], [0.03, 0.53], [-0.02, 0.53], [-0.03, 0.2], [-0.06, 0.02], [-0.07, -0.16]], 0.05, WOOD, 0, 0.005);
        b.limb([0, 0.02, 0.5], [0.32, 0.02, 0.44], 0.02, 0.011, 6, DARK_STEEL, [1, 0.6]);
        b.limb([0, 0.02, 0.5], [-0.32, 0.02, 0.44], 0.02, 0.011, 6, DARK_STEEL, [1, 0.6]);
        b.add(new THREE.TorusGeometry(0.06, 0.007, 4, 10, Math.PI), DARK_STEEL, [0, 0.02, 0.535], [Math.PI / 2, 0, 0]);
        b.box(0.64, 0.004, 0.004, '#dddddd', [0, 0.02, 0.44]);
        b.cyl(0.012, 0.012, 0.03, 8, BRASS, [0, 0.035, 0.18], [0, 0, Math.PI / 2]); // nut
        b.box(0.012, 0.012, 0.35, '#8a6a3a', [0, 0.042, 0.34]); // bolt
        break;
      default:
        b.box(0.04, 0.04, 0.8, STEEL, [0, 0, 0.4]);
    }
    return b.build();
  });
}

// Arrows and bolts pointing along +Z (the tip a little ahead of the origin).
export function arrowGeo(kind) {
  return cached(`arrow:${kind}`, () => {
    const b = new GeoBuilder();
    const L = kind === 'bolt' ? 0.42 : 0.78;
    const r = kind === 'bolt' ? 0.007 : 0.0055;
    b.cyl(r, r, L, 6, '#8a6a3a', [0, 0, 0.05 - L / 2], TIP);
    b.cyl(r * 1.3, r * 1.1, 0.03, 6, DARK_STEEL, [0, 0, 0.055], TIP); // socket
    b.cone(r * 2.2, 0.06, 4, DARK_STEEL, [0, 0, 0.1], TIP, [1, 1, 0.8]); // bodkin
    for (let k = 0; k < 3; k++) {
      const a = (k * 2 * Math.PI) / 3;
      b.box(0.0015, 0.016, kind === 'bolt' ? 0.07 : 0.12, '#e6e0cc', [Math.sin(a) * (r + 0.008), Math.cos(a) * (r + 0.008), 0.1 - L], [0, 0, -a]);
    }
    return b.build();
  });
}

// Shield outlines (x, y in metres, front towards +Z).
function outline(fn) {
  const sh = new THREE.Shape();
  fn(sh);
  return sh;
}
const HEATER = outline((s) => {
  s.moveTo(-0.25, 0.31);
  s.lineTo(0.25, 0.31);
  s.lineTo(0.25, 0.06);
  s.quadraticCurveTo(0.23, -0.24, 0, -0.4);
  s.quadraticCurveTo(-0.23, -0.24, -0.25, 0.06);
  s.closePath();
});
const KITE = outline((s) => {
  s.moveTo(0, 0.49);
  s.quadraticCurveTo(0.23, 0.48, 0.23, 0.28);
  s.lineTo(0.22, 0.05);
  s.quadraticCurveTo(0.17, -0.36, 0, -0.62);
  s.quadraticCurveTo(-0.17, -0.36, -0.22, 0.05);
  s.lineTo(-0.23, 0.28);
  s.quadraticCurveTo(-0.23, 0.48, 0, 0.49);
});
const PAVISE = outline((s) => {
  const w = 0.29;
  const r = 0.05;
  s.moveTo(-w + r, 0.43);
  s.lineTo(w - r, 0.43);
  s.quadraticCurveTo(w, 0.43, w, 0.43 - r);
  s.lineTo(w * 0.94, -0.63);
  s.lineTo(-w * 0.94, -0.63);
  s.lineTo(-w, 0.43 - r);
  s.quadraticCurveTo(-w, 0.43, -w + r, 0.43);
});

// Shields are wooden boards (planks) painted in the team colours with a
// simple charge in the second team colour, edged with rawhide and fitted
// with iron (boss, rivets). Front towards +Z.
const PLANKS = ['planks', '#e8d8c0'];
const paint = (color) => ['paint', color];
const FACE = 0.016; // front of a board of depth 0.02 with its bevel

// A flat board of `shape` with bevelled edges, painted `color` in front,
// and a rawhide rim.
function board(b, shape, wood, color, depth = 0.02) {
  const opts = { depth, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.01, bevelSegments: 1, curveSegments: 12 };
  b.add(new THREE.ExtrudeGeometry(shape, opts), wood, [0, 0, -depth / 2], [0, 0, 0], [1, 1, 1], PLANKS);
  if (color) b.add(new THREE.ShapeGeometry(shape, 12), color, [0, 0, depth / 2 + 0.0068], [0, 0, 0], [1, 1, 1], paint(color));
  b.add(new THREE.ExtrudeGeometry(shape, { ...opts, depth: depth * 0.6 }), DARK_LEATHER, [0, 0, -depth / 2 - 0.004], [0, 0, 0], [1.035, 1.03, 1]);
}

// A painted charge (a flat polygon) on the front of a board.
function charge(b, points, color, z = FACE + 0.002) {
  const sh = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  b.add(new THREE.ShapeGeometry(sh), color, [0, 0, z], [0, 0, 0], [1, 1, 1], paint(color));
}

// Iron rivets round the edge of a shape.
function rivets(b, shape, count, inset = 0.93, z = FACE) {
  for (const p of shape.getSpacedPoints(count).slice(0, count)) {
    b.sphere(0.009, DARK_STEEL, [p.x * inset, p.y * inset, z], 6, 4, [1, 1, 0.6]);
  }
}

// An iron boss: a dome on a flange.
function boss(b, r, z = FACE) {
  b.cyl(r * 1.35, r * 1.35, 0.006, 16, DARK_STEEL, [0, 0, z + 0.003], [Math.PI / 2, 0, 0]);
  b.add(new THREE.SphereGeometry(r, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2), STEEL, [0, 0, z + 0.004], [Math.PI / 2, 0, 0], [1, 0.8, 1]);
}

export function shieldGeo(model, color, team, team2 = '#dddddd') {
  return cached(`sh:${model}:${color}:${team}:${team2}`, () => {
    const b = new GeoBuilder();
    const S = [Math.PI / 2, 0, 0];
    switch (model) {
      case 'round': {
        // planks, painted in quarters (or half, on plain wooden shields)
        const r = 0.32;
        b.add(new THREE.CylinderGeometry(r, r, 0.02, 32), color, [0, 0, 0], S, [1, 1, 1], PLANKS);
        const plain = color === '#8b5a2b';
        for (let k = 0; k < 4; k++) {
          if (plain && k % 2) continue;
          const c = plain ? team : k % 2 ? team2 : team;
          b.add(new THREE.CircleGeometry(r * 0.97, 12, (k * Math.PI) / 2, Math.PI / 2), c, [0, 0, 0.0105], [0, 0, 0], [1, 1, 1], paint(c));
        }
        b.add(new THREE.TorusGeometry(r - 0.002, 0.012, 5, 36), DARK_LEATHER, [0, 0, 0]); // rawhide rim
        boss(b, 0.065, 0.01);
        b.box(0.03, 0.34, 0.025, DARK_WOOD, [0, 0, -0.022]); // grip bar
        break;
      }
      case 'kite': {
        board(b, KITE, WOOD, team);
        charge(b, [[-0.025, 0.42], [0.025, 0.42], [0.025, -0.5], [-0.025, -0.5]], team2); // a cross
        charge(b, [[-0.19, 0.225], [0.19, 0.225], [0.19, 0.175], [-0.19, 0.175]], team2);
        boss(b, 0.04);
        rivets(b, KITE, 16);
        break;
      }
      case 'heater': {
        board(b, HEATER, WOOD, team);
        // a chevron
        charge(b, [[0, 0.16], [0.235, -0.07], [0.235, 0.0], [0, 0.23], [-0.235, 0.0], [-0.235, -0.07]], team2);
        rivets(b, HEATER, 14);
        break;
      }
      case 'pavise': {
        board(b, PAVISE, WOOD, color, 0.035);
        // a central ridge painted in the team colour, with a stripe
        b.box(0.2, 1.0, 0.03, team, [0, -0.1, 0.02], [0, 0, 0], [1, 1, 1], paint(team));
        b.box(0.06, 1.0, 0.032, team2, [0, -0.1, 0.022], [0, 0, 0], [1, 1, 1], paint(team2));
        rivets(b, PAVISE, 18, 0.95, 0.026);
        break;
      }
      default:
        b.box(0.5, 0.6, 0.04, color, [0, 0, 0], [0, 0, 0], [1, 1, 1], PLANKS);
    }
    return b.build();
  });
}

// ---------------------------------------------------------------------------
// Horse
// ---------------------------------------------------------------------------

// Neck and head placement (shared by the body and the barding).
const NECK_A = [0, 1.42, 0.68];
const NECK_B = [0, 2.02, 1.12];
const HEAD_A = [0, 2.07, 1.16];
const HEAD_B = [0, 1.9, 1.58];

function horseBodyGeo(coat, team, barding) {
  return cached(`horse:${coat}:${team}:${barding}`, () => {
    const b = new GeoBuilder();
    const mane = shade(coat, 0.35);
    const muzzle = shade(coat, 0.55);
    // barrel, chest and hindquarters
    b.add(new THREE.CapsuleGeometry(0.3, 0.95, 6, 14), coat, [0, 1.3, -0.02], [Math.PI / 2, 0, 0], [0.95, 1, 1]);
    b.sphere(0.31, coat, [0, 1.32, 0.6], 14, 10, [0.95, 1.05, 0.9]);
    b.sphere(0.33, coat, [0, 1.38, -0.56], 14, 10, [1, 0.98, 1]);
    b.sphere(0.2, coat, [0, 1.5, 0.5], 12, 8, [0.9, 0.7, 1.2]); // withers
    // neck and mane
    b.limb(NECK_A, NECK_B, 0.26, 0.14, 12, coat, [0.72, 1.05]);
    b.limb([0, 1.62, 0.52], [0, 2.17, 1.02], 0.05, 0.035, 6, mane, [0.9, 1.6]);
    b.sphere(0.05, mane, [0, 2.17, 1.1], 6, 4, [0.8, 1.2, 1.4]); // forelock
    // head
    b.sphere(0.13, coat, [0, 2.06, 1.16], 12, 8, [0.72, 1, 1.05]); // jowl / poll
    b.limb(HEAD_A, HEAD_B, 0.12, 0.08, 12, coat, [0.7, 1]);
    b.sphere(0.085, muzzle, [0, 1.895, 1.585], 10, 8, [0.78, 0.95, 1.05]);
    for (const x of [0.055, -0.055]) {
      b.cone(0.03, 0.12, 6, coat, [x, 2.2, 1.11], [-0.2, 0, x > 0 ? -0.25 : 0.25]); // ears
      b.sphere(0.022, '#120d0a', [x * 1.45, 2.06, 1.25], 6, 4); // eyes
      b.sphere(0.018, '#120d0a', [x * 0.6, 1.87, 1.66], 5, 4); // nostrils
    }
    // tail
    b.limb([0, 1.48, -0.84], [0, 1.3, -0.96], 0.06, 0.05, 6, mane);
    b.limb([0, 1.32, -0.95], [0, 0.72, -1.02], 0.07, 0.1, 8, mane, [0.8, 1]);
    // bridle and reins
    b.limb([0.075, 1.99, 1.4], [0.13, 1.72, 0.32], 0.008, 0.008, 4, DARK_LEATHER);
    b.limb([-0.075, 1.99, 1.4], [-0.13, 1.72, 0.32], 0.008, 0.008, 4, DARK_LEATHER);
    b.limb([0, 1.975, 1.39], [0, 1.96, 1.43], 0.1, 0.1, 12, DARK_LEATHER, [0.74, 1.02]); // noseband
    // saddle cloth, seat, pommel and cantle, stirrups
    const seat = barding ? 0.39 : 0.335;
    if (!barding) b.wrapZ(0.325, 0.62, 3.6, 16, team, [0, 1.3, 0.04], [0.97, 1, 1]);
    b.wrapZ(seat, 0.46, 1.5, 10, LEATHER, [0, 1.3, 0.02], [0.97, 1, 1]);
    b.sphere(0.1, LEATHER, [0, 1.33 + seat, 0.28], 10, 6, [1.35, 0.9, 0.6]);
    b.sphere(0.12, LEATHER, [0, 1.33 + seat, -0.2], 10, 6, [1.35, 0.9, 0.5]);
    for (const x of [0.31, -0.31]) {
      b.limb([x * 0.98, 1.55, 0.06], [x * 1.05, 1.05, 0.06], 0.01, 0.01, 4, DARK_LEATHER);
      b.box(0.1, 0.025, 0.06, DARK_STEEL, [x * 1.05, 1.03, 0.06]);
    }
    if (barding) {
      // caparison: a cloth over back and flanks, neck cover and chanfron
      b.wrapZ(0.36, 1.72, 3.2, 20, team, [0, 1.3, -0.02], [1, 1.05, 1]);
      b.wrapY(0.36, 0.41, 0.58, Math.PI * 2, 28, team, [0, 1.02, -0.02], [1, 1, 2.45]); // skirt hanging around the body
      b.wrapY(0.412, 0.412, 0.05, Math.PI * 2, 28, shade(team, 0.55), [0, 0.76, -0.02], [1, 1, 2.45]); // hem
      b.limb(NECK_A, NECK_B, 0.285, 0.165, 12, team, [0.76, 1.08]);
      b.limb([0, 2.12, 1.12], [0, 1.95, 1.52], 0.075, 0.06, 8, STEEL, [1.25, 0.65]); // chanfron
    }
    return b.build();
  });
}

function horseLegGeo(coat, hind) {
  return cached(`hleg:${coat}:${hind}`, () => {
    const b = new GeoBuilder();
    const hoof = '#1f1812';
    if (hind) {
      b.sphere(0.15, coat, [0, 0.0, -0.02], 10, 8, [0.8, 1.6, 1.15]); // gaskin muscle
      b.limb([0, 0.05, -0.02], [0, -0.48, -0.1], 0.12, 0.07, 10, coat, [0.8, 1.1]);
      b.sphere(0.066, coat, [0, -0.48, -0.1], 8, 6, [0.8, 1, 1.1]); // hock
      b.limb([0, -0.48, -0.1], [0, -0.9, -0.05], 0.05, 0.045, 8, coat, [0.85, 1.1]);
    } else {
      b.sphere(0.12, coat, [0, -0.05, 0.03], 10, 8, [0.8, 1.7, 1.1]); // forearm muscle
      b.limb([0, 0.05, 0.02], [0, -0.5, 0.0], 0.1, 0.06, 10, coat, [0.8, 1.1]);
      b.sphere(0.06, coat, [0, -0.5, 0.0], 8, 6, [0.8, 1, 1.05]); // knee
      b.limb([0, -0.5, 0.0], [0, -0.9, -0.01], 0.047, 0.044, 8, coat, [0.85, 1.1]);
    }
    const z = hind ? -0.05 : -0.01;
    b.sphere(0.055, coat, [0, -0.91, z], 8, 6, [0.9, 1, 1.1]); // fetlock
    b.limb([0, -0.91, z], [0, -1.0, z + 0.04], 0.045, 0.048, 8, coat); // pastern
    b.cyl(0.055, 0.068, 0.08, 10, hoof, [0, -1.045, z + 0.05]);
    return b.build();
  });
}

const HORSE_SPHERE = new THREE.Sphere(new THREE.Vector3(0, 1.1, 0.1), 1.9);

export function buildHorse(coat, team, barding) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const parts = [[body, horseBodyGeo(coat, team, barding)]];
  const legs = [];
  for (const [x, z] of [[0.18, 0.6], [-0.18, 0.6], [0.18, -0.58], [-0.18, -0.58]]) {
    const l = new THREE.Group();
    l.position.set(x, 1.1, z);
    parts.push([l, horseLegGeo(coat, z < 0)]);
    body.add(l);
    legs.push(l);
  }
  rigidSkin(root, parts, `horse:${coat}:${team}:${barding}`, HORSE_SPHERE);
  return { root, body, legs };
}

// ---------------------------------------------------------------------------
// Pose helpers
// ---------------------------------------------------------------------------

const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();
const _m = new THREE.Matrix4();

// Quaternion for an arm group so that the arm (local -Y) points along `dir`
// and the held item (local +Z) points as close to `hint` as possible.
export function armQuat(dir, hint, out = new THREE.Quaternion()) {
  _y.set(-dir[0], -dir[1], -dir[2]).normalize();
  _z.set(hint[0], hint[1], hint[2]);
  _z.addScaledVector(_y, -_z.dot(_y));
  if (_z.lengthSq() < 1e-4) _z.set(0, 0, 1).addScaledVector(_y, -_y.z);
  _z.normalize();
  _x.crossVectors(_y, _z);
  _m.makeBasis(_x, _y, _z);
  return out.setFromRotationMatrix(_m);
}
