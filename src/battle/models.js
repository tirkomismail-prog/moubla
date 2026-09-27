// Low-poly procedural models for battles: people, horses, weapons, shields.
// Every model is built from primitive shapes merged into vertex-coloured
// geometries so that a single shared material can be used.
import * as THREE from 'three';

export const MATERIAL = new THREE.MeshLambertMaterial({ vertexColors: true });

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpV = new THREE.Vector3();
const tmpS = new THREE.Vector3();

class GeoBuilder {
  constructor() {
    this.pos = [];
    this.nrm = [];
    this.col = [];
  }

  add(geo, color, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    tmpE.set(r[0], r[1], r[2]);
    tmpQ.setFromEuler(tmpE);
    tmpM.compose(tmpV.set(p[0], p[1], p[2]), tmpQ, tmpS.set(s[0], s[1], s[2]));
    g.applyMatrix4(tmpM);
    const c = new THREE.Color(color);
    const pa = g.attributes.position.array;
    const na = g.attributes.normal.array;
    for (let i = 0; i < pa.length; i += 3) {
      this.pos.push(pa[i], pa[i + 1], pa[i + 2]);
      this.nrm.push(na[i], na[i + 1], na[i + 2]);
      this.col.push(c.r, c.g, c.b);
    }
    return this;
  }

  box(w, h, d, color, p, r, s) {
    return this.add(new THREE.BoxGeometry(w, h, d), color, p, r, s);
  }

  cyl(rt, rb, h, seg, color, p, r, s) {
    return this.add(new THREE.CylinderGeometry(rt, rb, h, seg), color, p, r, s);
  }

  sphere(rad, color, p, ws = 8, hs = 6, s) {
    return this.add(new THREE.SphereGeometry(rad, ws, hs), color, p, [0, 0, 0], s);
  }

  cone(rad, h, seg, color, p, r) {
    return this.add(new THREE.ConeGeometry(rad, h, seg), color, p, r);
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
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

export function mesh(geo) {
  const m = new THREE.Mesh(geo, MATERIAL);
  m.castShadow = true;
  m.receiveShadow = false;
  return m;
}

// ---------------------------------------------------------------------------
// Colours
// ---------------------------------------------------------------------------

const STEEL = '#9aa3ab';
const DARK_STEEL = '#5d646b';
const WOOD = '#7a5230';
const DARK_WOOD = '#4a3020';
const LEATHER = '#6b4526';
const SKIN_TONES = ['#e0b590', '#d4a57f', '#c68c62', '#e8c3a0', '#b77a50'];
const HAIR = ['#2b1d12', '#5a3a1e', '#8a6a3a', '#1a1a1a', '#b08a50'];

export function pickSkin(rand) {
  return SKIN_TONES[Math.floor(rand() * SKIN_TONES.length)];
}

export function pickHair(rand) {
  return HAIR[Math.floor(rand() * HAIR.length)];
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

function torsoGeo(look, team, team2) {
  return cached(`torso:${look}:${team}:${team2}`, () => {
    const b = new GeoBuilder();
    const base = ARMOR_COLORS[look] || team;
    b.box(0.44, 0.34, 0.25, base, [0, 0.44, 0]); // chest
    b.box(0.38, 0.3, 0.23, base, [0, 0.15, 0]); // belly
    b.box(0.46, 0.06, 0.27, LEATHER, [0, 0.02, 0]); // belt
    // skirt / tunic lower part
    b.box(0.42, 0.22, 0.25, look === 'plate' ? DARK_STEEL : look === 'cloth' ? team : team, [0, -0.08, 0]);
    if (look === 'mail' || look === 'plate' || look === 'lamellar' || look === 'padded') {
      // tabard with faction colours
      b.box(0.3, 0.52, 0.02, team, [0, 0.27, 0.13]);
      b.box(0.3, 0.52, 0.02, team, [0, 0.27, -0.13]);
      b.box(0.08, 0.3, 0.025, team2, [0, 0.35, 0.14]);
    } else if (look === 'leather') {
      b.box(0.1, 0.5, 0.02, team, [0.12, 0.3, 0.13]);
    } else {
      b.box(0.44, 0.04, 0.26, team2, [0, 0.6, 0]);
    }
    if (look === 'plate' || look === 'lamellar') {
      b.box(0.16, 0.1, 0.2, STEEL, [0.26, 0.56, 0]); // pauldrons
      b.box(0.16, 0.1, 0.2, STEEL, [-0.26, 0.56, 0]);
    }
    return b.build();
  });
}

function headGeo(skin, hair) {
  return cached(`head:${skin}:${hair}`, () => {
    const b = new GeoBuilder();
    b.box(0.12, 0.08, 0.12, skin, [0, 0.03, 0]); // neck
    b.box(0.22, 0.25, 0.23, skin, [0, 0.17, 0]);
    b.box(0.23, 0.08, 0.24, hair, [0, 0.3, -0.01]);
    b.box(0.23, 0.14, 0.05, hair, [0, 0.22, -0.11]);
    b.box(0.04, 0.03, 0.02, '#2a1a10', [0.05, 0.19, 0.12]); // eyes
    b.box(0.04, 0.03, 0.02, '#2a1a10', [-0.05, 0.19, 0.12]);
    b.box(0.04, 0.06, 0.04, skin, [0, 0.14, 0.13]); // nose
    return b.build();
  });
}

function helmetGeo(look, team) {
  if (!look) return null;
  return cached(`helm:${look}:${team}`, () => {
    const b = new GeoBuilder();
    switch (look) {
      case 'hood':
        b.box(0.27, 0.2, 0.27, team, [0, 0.27, -0.01]);
        b.box(0.27, 0.22, 0.08, team, [0, 0.12, -0.12]);
        break;
      case 'fur':
        b.cyl(0.15, 0.15, 0.12, 8, '#6b4a2e', [0, 0.32, 0]);
        b.cyl(0.1, 0.14, 0.06, 8, '#8a6a4a', [0, 0.4, 0]);
        break;
      case 'cap':
        b.sphere(0.145, LEATHER, [0, 0.27, 0], 8, 5, [1, 0.75, 1.05]);
        break;
      case 'nasal':
        b.cone(0.15, 0.2, 8, STEEL, [0, 0.38, 0]);
        b.cyl(0.15, 0.15, 0.07, 8, STEEL, [0, 0.27, 0]);
        b.box(0.03, 0.12, 0.02, STEEL, [0, 0.19, 0.14]);
        break;
      case 'spangen':
        b.sphere(0.15, STEEL, [0, 0.29, 0], 8, 6, [1, 0.95, 1.05]);
        b.box(0.02, 0.12, 0.3, '#b08a3a', [0, 0.36, 0]);
        b.box(0.26, 0.06, 0.02, STEEL, [0, 0.2, 0.13]);
        break;
      case 'kettle':
        b.sphere(0.14, STEEL, [0, 0.3, 0], 8, 5, [1, 0.8, 1]);
        b.cyl(0.24, 0.24, 0.02, 12, STEEL, [0, 0.26, 0]);
        break;
      case 'spiked':
        b.cone(0.15, 0.3, 8, STEEL, [0, 0.42, 0]);
        b.cyl(0.155, 0.155, 0.07, 8, '#8a6a3a', [0, 0.27, 0]);
        b.box(0.02, 0.06, 0.02, team, [0, 0.6, 0]);
        break;
      case 'great':
        b.cyl(0.155, 0.16, 0.33, 10, STEEL, [0, 0.19, 0]);
        b.box(0.2, 0.02, 0.02, '#111', [0, 0.2, 0.16]);
        b.box(0.02, 0.1, 0.02, team, [0, 0.13, 0.16]);
        b.cyl(0.02, 0.155, 0.04, 10, STEEL, [0, 0.37, 0]);
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
    b.box(0.16, 0.62, 0.18, pants, [0, -0.31, 0]);
    b.box(0.15, 0.3, 0.19, boots, [0, -0.76, 0.0]);
    b.box(0.15, 0.08, 0.26, boots, [0, -0.88, 0.04]);
    return b.build();
  });
}

function armGeo(sleeve, skin, glove) {
  return cached(`arm:${sleeve}:${skin}:${glove}`, () => {
    const b = new GeoBuilder();
    b.box(0.13, 0.36, 0.13, sleeve, [0, -0.17, 0]);
    b.box(0.11, 0.24, 0.11, glove ? sleeve : skin, [0, -0.46, 0]);
    b.box(0.1, 0.09, 0.1, glove ? '#4a3a2a' : skin, [0, -0.6, 0]);
    return b.build();
  });
}

export function buildHuman(spec) {
  const root = new THREE.Group();
  const hips = new THREE.Group();
  hips.position.y = 0.92;
  root.add(hips);
  const pants = spec.look === 'plate' ? DARK_STEEL : spec.look === 'mail' ? '#6d6f72' : spec.pants;
  const boots = spec.look === 'plate' ? STEEL : '#3a2616';
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  legL.position.set(0.1, 0, 0);
  legR.position.set(-0.1, 0, 0);
  legL.add(mesh(legGeo(pants, boots)));
  legR.add(mesh(legGeo(pants, boots)));
  hips.add(legL, legR);
  const torso = new THREE.Group();
  hips.add(torso);
  torso.add(mesh(torsoGeo(spec.look, spec.team, spec.team2)));
  const neck = new THREE.Group();
  neck.position.y = 0.6;
  torso.add(neck);
  neck.add(mesh(headGeo(spec.skin, spec.hair)));
  const hg = helmetGeo(spec.helmet, spec.team);
  if (hg) neck.add(mesh(hg));
  const sleeve = ARMOR_COLORS[spec.look] || spec.team;
  const glove = spec.look === 'mail' || spec.look === 'plate' || spec.look === 'lamellar';
  const armR = new THREE.Group();
  armR.position.set(-0.28, 0.53, 0);
  armR.add(mesh(armGeo(sleeve, spec.skin, glove)));
  const handR = new THREE.Group();
  handR.position.y = -0.6;
  armR.add(handR);
  const wristR = new THREE.Group();
  handR.add(wristR);
  const armL = new THREE.Group();
  armL.position.set(0.28, 0.53, 0);
  armL.add(mesh(armGeo(sleeve, spec.skin, glove)));
  const handL = new THREE.Group();
  handL.position.y = -0.6;
  armL.add(handL);
  torso.add(armR, armL);
  const shieldMount = new THREE.Group();
  torso.add(shieldMount);
  const backMount = new THREE.Group();
  backMount.position.set(0, 0.35, -0.16);
  torso.add(backMount);
  return { root, hips, torso, neck, legL, legR, armR, armL, handR, wristR, handL, shieldMount, backMount };
}

// ---------------------------------------------------------------------------
// Weapons (built along +Z from the grip at the origin)
// ---------------------------------------------------------------------------

export function weaponGeo(model) {
  return cached(`w:${model}`, () => {
    const b = new GeoBuilder();
    switch (model) {
      case 'sword':
      case 'sword_long':
      case 'greatsword': {
        const len = model === 'sword' ? 0.72 : model === 'sword_long' ? 0.85 : 1.1;
        const grip = model === 'greatsword' ? 0.26 : 0.14;
        b.box(0.035, 0.035, grip, DARK_WOOD, [0, 0, -grip / 2 + 0.04]);
        b.box(0.05, 0.05, 0.05, '#b08a3a', [0, 0, -grip + 0.02]);
        b.box(model === 'greatsword' ? 0.26 : 0.18, 0.035, 0.035, '#b08a3a', [0, 0, 0.06]);
        b.box(0.05, 0.012, len, STEEL, [0, 0, 0.08 + len / 2]);
        b.box(0.012, 0.02, len * 0.9, '#c8d0d8', [0, 0, 0.08 + len / 2]);
        break;
      }
      case 'sabre':
        b.box(0.035, 0.035, 0.14, DARK_WOOD, [0, 0, -0.03]);
        b.box(0.12, 0.03, 0.03, '#b08a3a', [0, 0, 0.05]);
        b.box(0.04, 0.012, 0.45, STEEL, [0, 0, 0.3]);
        b.box(0.04, 0.012, 0.36, STEEL, [0, 0.04, 0.68], [0.22, 0, 0]);
        break;
      case 'cleaver':
        b.box(0.035, 0.035, 0.14, DARK_WOOD, [0, 0, -0.03]);
        b.box(0.08, 0.015, 0.4, '#8a9096', [0, 0.02, 0.26]);
        break;
      case 'club':
        b.cyl(0.03, 0.03, 0.3, 6, DARK_WOOD, [0, 0, 0.05], [Math.PI / 2, 0, 0]);
        b.cyl(0.065, 0.04, 0.4, 7, WOOD, [0, 0, 0.4], [Math.PI / 2, 0, 0]);
        break;
      case 'mace':
        b.cyl(0.025, 0.025, 0.55, 6, DARK_WOOD, [0, 0, 0.2], [Math.PI / 2, 0, 0]);
        b.sphere(0.07, DARK_STEEL, [0, 0, 0.52], 7, 5);
        for (const a of [0, 1, 2, 3]) b.box(0.02, 0.14, 0.08, DARK_STEEL, [0, 0, 0.52], [0, 0, (a * Math.PI) / 4]);
        break;
      case 'axe':
      case 'axe_war':
      case 'throwaxe': {
        const L = model === 'axe_war' ? 0.75 : model === 'throwaxe' ? 0.45 : 0.62;
        b.cyl(0.024, 0.024, L, 6, WOOD, [0, 0, L / 2 - 0.08], [Math.PI / 2, 0, 0]);
        b.box(0.02, 0.2, 0.12, STEEL, [0, 0.1, L - 0.14]);
        b.box(0.022, 0.24, 0.04, '#c8d0d8', [0, 0.14, L - 0.1]);
        break;
      }
      case 'greataxe':
        b.cyl(0.028, 0.028, 1.25, 6, WOOD, [0, 0, 0.45], [Math.PI / 2, 0, 0]);
        b.box(0.025, 0.34, 0.2, STEEL, [0, 0.14, 0.96]);
        b.box(0.027, 0.4, 0.05, '#c8d0d8', [0, 0.18, 1.04]);
        break;
      case 'spear':
      case 'pitchfork':
      case 'javelin': {
        const L = model === 'javelin' ? 1.2 : model === 'pitchfork' ? 1.6 : 1.95;
        const back = model === 'javelin' ? 0.4 : 0.55;
        b.cyl(0.022, 0.022, L, 6, WOOD, [0, 0, L / 2 - back], [Math.PI / 2, 0, 0]);
        if (model === 'pitchfork') {
          for (const x of [-0.06, 0, 0.06]) b.box(0.015, 0.015, 0.22, DARK_STEEL, [x, 0, L - back + 0.1]);
          b.box(0.14, 0.02, 0.02, DARK_STEEL, [0, 0, L - back]);
        } else {
          b.cone(0.035, 0.24, 4, STEEL, [0, 0, L - back + 0.11], [Math.PI / 2, 0, 0]);
        }
        break;
      }
      case 'lance':
        b.cyl(0.03, 0.04, 2.9, 7, '#a07a4a', [0, 0, 0.55], [Math.PI / 2, 0, 0]);
        b.cyl(0.07, 0.03, 0.14, 8, '#a07a4a', [0, 0, 0.0], [Math.PI / 2, 0, 0]);
        b.cone(0.035, 0.24, 4, STEEL, [0, 0, 2.1], [Math.PI / 2, 0, 0]);
        break;
      case 'bow':
      case 'bow_short':
      case 'bow_long': {
        const L = model === 'bow_long' ? 0.8 : model === 'bow_short' ? 0.5 : 0.62;
        const col = model === 'bow_short' ? '#6b3a1a' : WOOD;
        b.box(0.035, 0.035, 0.16, DARK_WOOD, [0, 0, 0]);
        b.box(0.028, 0.028, L, col, [0, -0.06, L / 2 + 0.05], [-0.25, 0, 0]);
        b.box(0.028, 0.028, L, col, [0, -0.06, -L / 2 - 0.05], [0.25, 0, 0]);
        b.box(0.006, 0.006, L * 2 + 0.05, '#ddd', [0, -0.2, 0]);
        break;
      }
      case 'crossbow':
        b.box(0.06, 0.06, 0.72, WOOD, [0, 0, 0.18]);
        b.box(0.62, 0.035, 0.04, DARK_STEEL, [0, 0.02, 0.5]);
        b.box(0.02, 0.02, 0.35, '#ddd', [0, 0.04, 0.4]);
        break;
      default:
        b.box(0.04, 0.04, 0.8, STEEL, [0, 0, 0.4]);
    }
    return b.build();
  });
}

export function shieldGeo(model, color, team) {
  return cached(`sh:${model}:${color}:${team}`, () => {
    const b = new GeoBuilder();
    switch (model) {
      case 'round': {
        b.cyl(0.32, 0.32, 0.04, 14, color, [0, 0, 0], [Math.PI / 2, 0, 0]);
        b.cyl(0.3, 0.3, 0.045, 14, team, [0, 0, 0.002], [Math.PI / 2, 0, 0], [0.55, 1, 0.55]);
        b.sphere(0.07, STEEL, [0, 0, 0.03], 8, 5, [1, 1, 0.6]);
        break;
      }
      case 'kite':
        b.box(0.46, 0.5, 0.04, team, [0, 0.12, 0]);
        b.box(0.34, 0.3, 0.04, team, [0, -0.25, 0]);
        b.box(0.18, 0.2, 0.04, team, [0, -0.48, 0]);
        b.box(0.06, 0.9, 0.05, color, [0, -0.08, 0.01]);
        break;
      case 'heater':
        b.box(0.5, 0.42, 0.04, team, [0, 0.1, 0]);
        b.box(0.36, 0.18, 0.04, team, [0, -0.2, 0]);
        b.box(0.18, 0.12, 0.04, team, [0, -0.33, 0]);
        b.box(0.5, 0.06, 0.05, color, [0, 0.12, 0.01]);
        break;
      case 'pavise':
        b.box(0.58, 1.05, 0.05, color, [0, -0.1, 0]);
        b.box(0.2, 1.0, 0.06, team, [0, -0.1, 0.01]);
        break;
      default:
        b.box(0.5, 0.6, 0.04, color, [0, 0, 0]);
    }
    return b.build();
  });
}

// ---------------------------------------------------------------------------
// Horse
// ---------------------------------------------------------------------------

function horseBodyGeo(coat, team, barding) {
  return cached(`horse:${coat}:${team}:${barding}`, () => {
    const b = new GeoBuilder();
    const mane = '#2a1d14';
    b.box(0.55, 0.58, 1.55, coat, [0, 1.3, 0]);
    b.box(0.5, 0.5, 0.4, coat, [0, 1.36, 0.7]); // chest
    // neck (angled)
    b.box(0.3, 0.75, 0.38, coat, [0, 1.72, 0.92], [0.55, 0, 0]);
    b.box(0.08, 0.7, 0.12, mane, [0, 1.8, 0.8], [0.55, 0, 0]);
    // head
    b.box(0.26, 0.28, 0.6, coat, [0, 2.02, 1.3], [0.35, 0, 0]);
    b.box(0.06, 0.12, 0.06, coat, [0.08, 2.2, 1.12]);
    b.box(0.06, 0.12, 0.06, coat, [-0.08, 2.2, 1.12]);
    b.box(0.2, 0.18, 0.2, '#1a1410', [0, 1.9, 1.56], [0.35, 0, 0]);
    // tail
    b.box(0.1, 0.6, 0.12, mane, [0, 1.15, -0.86], [-0.35, 0, 0]);
    // saddle
    b.box(0.6, 0.12, 0.55, LEATHER, [0, 1.63, 0.05]);
    b.box(0.5, 0.14, 0.06, LEATHER, [0, 1.7, 0.32]);
    b.box(0.64, 0.4, 0.5, team, [0, 1.35, 0.05]);
    if (barding) {
      b.box(0.62, 0.55, 1.62, team, [0, 1.2, 0], [0, 0, 0], [1, 1, 1]);
      b.box(0.34, 0.55, 0.42, team, [0, 1.75, 0.95], [0.55, 0, 0]);
      b.box(0.28, 0.3, 0.5, STEEL, [0, 2.06, 1.28], [0.35, 0, 0]);
    }
    return b.build();
  });
}

function horseLegGeo(coat) {
  return cached(`hleg:${coat}`, () => {
    const b = new GeoBuilder();
    b.box(0.14, 0.62, 0.17, coat, [0, -0.31, 0]);
    b.box(0.1, 0.42, 0.11, coat, [0, -0.83, 0]);
    b.box(0.12, 0.08, 0.14, '#1a1410', [0, -1.05, 0.01]);
    return b.build();
  });
}

export function buildHorse(coat, team, barding) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  body.add(mesh(horseBodyGeo(coat, team, barding)));
  const legs = [];
  for (const [x, z] of [[0.18, 0.6], [-0.18, 0.6], [0.18, -0.58], [-0.18, -0.58]]) {
    const l = new THREE.Group();
    l.position.set(x, 1.1, z);
    l.add(mesh(horseLegGeo(coat)));
    body.add(l);
    legs.push(l);
  }
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
