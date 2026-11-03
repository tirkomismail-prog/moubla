// Realistic soldiers: a skinned MakeHuman body with motion-captured walking
// and running (CMU mocap) and standing (the Open Motion Project by ACCAD,
// CC BY 3.0; see assets/characters/CREDITS.md), whose arms, torso and head
// follow the procedural pose rig of an Agent (weapons, blocks, aiming).
// Built by tools/characters/build_soldier.py and packed into dist/characters.js.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { helmetGeo, setTileIndex, ARROW_REST, BOW_CANT, BOW_LOWER, STRING_NOCK } from './models.js';
import { handOnAxis, secondGrip, secondRanges } from './grips.js';
import { bytesOf, decodeLayers, decodeTiles, deco, DULL_METAL, lodMesh, ownSpaceSkeleton, partLook, poolBones, posed, shadowStandIn, simplified, simplifierReady, surface, tiled, TILE_FRAGMENT } from './partmat.js';
import { JERKIN, SABLE, TINCTURES, UNDYED, lightness } from '../data/dyes.js';
import { horseTextures, loadHorse } from './horse.js';
import { loadTrees } from './trees.js';
import { loadGround } from './ground.js';
import { clamp, wrapAngle, smoothstep } from '../core/util.js';

const state = { status: 'idle', promise: null, t: null };

export function loadCharacters() {
  if (state.promise) return state.promise;
  const assets = typeof window !== 'undefined' && window.__CHARACTER_ASSETS;
  if (!assets || !assets.soldier) {
    state.status = 'missing';
    state.promise = Promise.resolve(false);
    return state.promise;
  }
  state.status = 'loading';
  state.promise = (async () => {
    try {
      const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(bytesOf(assets.soldier).buffer, '', resolve, reject));
      const t = prepare(gltf);
      // (for the farthest level of detail, made here)
      await simplifierReady();
      const tex = assets.textures;
      // (the soldiers' layers, the tiles and the horse's layers together:
      // the workers compressing them stay busy)
      const horseTex = assets.horse ? horseTextures(assets) : null;
      // (and the trees and the ground meanwhile: the main thread is free)
      const trees = assets.trees ? loadTrees(assets) : null;
      const ground = assets.ground ? loadGround(assets) : null;
      for (const job of [horseTex, trees, ground]) if (job) job.catch(() => {});
      [t.layers, t.tiles, t.heraldry] = await Promise.all([
        tex ? decodeLayers(tex.size, tex.layers, THREE.SRGBColorSpace) : null,
        tex && tex.tiles ? decodeTiles(tex.tiles) : null,
        // the knights' coats of arms (tools/heraldry): not repeated (each
        // ends at its edges, carried on to the seams)
        assets.heraldry ? decodeLayers(assets.heraldry.size, assets.heraldry.layers, THREE.SRGBColorSpace) : null,
      ]);
      if (t.heraldry) {
        t.heraldry.texture.wrapS = t.heraldry.texture.wrapT = THREE.ClampToEdgeWrapping;
        t.heraldry.texture.needsUpdate = true;
        t.heraldry.meta = assets.heraldry.meta || [];
      }
      // weapons and shields name their materials by these layers
      if (t.tiles) setTileIndex(t.tiles.index);
      if (t.tiles) ironHelmets(t.helmets, t.tiles.index);
      // the horse (tools/characters/build_horse.py); the soldiers work without it
      if (assets.horse) {
        try {
          await loadHorse(assets, t.tiles, horseTex);
        } catch (e) {
          console.warn('Horse model unusable:', e);
        }
      }
      // the trees (tools/trees/build_trees.py); the procedural ones without them
      if (assets.trees) {
        try {
          await trees;
        } catch (e) {
          console.warn('Tree models unusable:', e);
        }
      }
      // the photographed ground (tools/ground/build_ground.py)
      if (assets.ground) {
        try {
          await ground;
        } catch (e) {
          console.warn('Ground textures unusable:', e);
        }
      }
      state.t = t;
      state.status = 'ready';
      return true;
    } catch (e) {
      console.warn('Character model unusable:', e);
      state.status = 'failed';
      return false;
    }
  })();
  return state.promise;
}

export function charactersReady() {
  return state.status === 'ready';
}

// The coat of arms of a knight (troops.js `arms`) among the coats of
// tools/heraldry: the first LORD_ARMS are the king's and the lords' of
// Velmar, the knights' are the rest, one for each `n` (an agent's id); -1
// without the coats.
const LORD_ARMS = 6;
export function knightArms(n) {
  const h = state.t && state.t.heraldry;
  const count = h ? Object.keys(h.index).length - LORD_ARMS : 0;
  return count > 0 ? LORD_ARMS + ((Math.imul(n, 2654435761) >>> 0) % count) : -1;
}

// ---------------------------------------------------------------------------
// Template: things measured once on the loaded model in its rest pose
// ---------------------------------------------------------------------------


const FINGER = /^(thumb|index|middle|ring|pinky)_0\d_[lr]$/;

function prepare(gltf) {
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);
  const rest = [];
  scene.traverse((o) => {
    if (o.isBone) rest.push([o, o.position.clone(), o.quaternion.clone(), o.scale.clone()]);
  });
  const bones = {};
  let armature = null;
  scene.traverse((o) => {
    if (o.isBone) bones[o.name] = o;
    if (o.userData && o.userData.hair_center) armature = o;
  });
  const fit = armature ? armature.userData : {};
  const clips = {};
  for (const clip of gltf.animations) {
    const [name, speed] = clip.name.split('|');
    // only what moves: the bones' rotations and the pelvis' position (the
    // export keeps every bone's rest position, rotation and scale too; the
    // fingers are posed by fingers()), a third of the work of the mixer
    clip.tracks = clip.tracks.filter((track) => {
      const [bone, prop] = track.name.split('.');
      if (bone === 'Root' || FINGER.test(bone)) return false;
      return prop === 'quaternion' || (prop === 'position' && bone === 'pelvis');
    });
    clips[name] = { clip, speed: Number(speed) || 0, dur: clip.duration, offset: 0 };
  }
  // standing: idle, idle2, ... (the same, done differently: one each soldier)
  const idles = Object.keys(clips).filter((k) => /^idle\d*$/.test(k)).sort();
  const t = { scene, clips, idles, fit, hands: {}, limbs: {} };
  // the parts in the order of their numbers (_part) and their texture layers
  t.parts = fit.parts || ['Body', 'Shirt', 'Skirt', 'Hose', 'Boots', 'Belt', 'Hair', 'Beard', 'Eyes'];
  t.partLayers = fit.part_layers || {};
  const wpos = (b) => b.getWorldPosition(new THREE.Vector3());
  for (const s of ['l', 'r']) {
    const hand = bones[`hand_${s}`];
    // hand frame in the hand bone's local space: length (wrist -> knuckles),
    // knuckle line (little finger -> index finger), palm normal
    const len = bones[`middle_01_${s}`].position.clone().normalize();
    const knuck = bones[`index_01_${s}`].position.clone().sub(bones[`pinky_01_${s}`].position);
    knuck.addScaledVector(len, -knuck.dot(len)).normalize();
    const palm = s === 'r' ? new THREE.Vector3().crossVectors(knuck, len) : new THREE.Vector3().crossVectors(len, knuck);
    const basis = handBasis(len, knuck, new THREE.Matrix4());
    const knuckDist = bones[`middle_01_${s}`].position.length();
    const grip = len.clone().multiplyScalar(knuckDist * 0.9).addScaledVector(palm, 0.028);
    // weapon frame in hand space: +Z along the knuckle line, +Y back to the wrist
    const wy = len.clone().negate();
    const wx = new THREE.Vector3().crossVectors(wy, knuck);
    const gripQ = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(wx, wy, knuck));
    // (the grip point `back` along the hand's length from the wrist and
    // `side` towards its palm: grips.js handOnAxis)
    t.hands[s] = { len, knuck, palm, basisQ: new THREE.Quaternion().setFromRotationMatrix(basis), grip, gripQ, back: grip.dot(len), side: grip.dot(palm) };
    t.limbs[`arm_${s}`] = limbInfo(bones[`upperarm_${s}`], bones[`lowerarm_${s}`], hand, new THREE.Vector3(1, 0, 0));
    t.limbs[`leg_${s}`] = limbInfo(bones[`thigh_${s}`], bones[`calf_${s}`], bones[`foot_${s}`], new THREE.Vector3(1, 0, 0));
    t.hands[s].fist = fingerPose(bones, s, t.hands[s], 1);
    // a hand at rest: the little finger more curled than the index
    t.hands[s].relaxed = fingerPose(bones, s, t.hands[s], RELAXED);
    // round a handle: thin (swords, shield grips) and thicker (axes,
    // spears, maces, bows; the thickest are held as these)
    for (const [name, r] of Object.entries(HANDLES)) t.hands[s][name] = wrapPose(bones, s, t.hands[s], r);
  }
  t.shoulder = { l: wpos(bones.upperarm_l), r: wpos(bones.upperarm_r) };
  t.reach = t.limbs.arm_r.a + t.limbs.arm_r.b + bones.middle_01_r.position.length() * 0.9;
  t.pelvisY = wpos(bones.pelvis).y;
  // the rest pose of the bones a fall moves: a lying pose is built from it
  t.fallRest = FALL_BONES.map((n) => bones[n].quaternion.clone());
  t.pelvisRest = bones.pelvis.position.clone();
  t.headRestQ = bones.head.getWorldQuaternion(new THREE.Quaternion());
  t.headRestInv = new THREE.Matrix4().copy(bones.head.matrixWorld).invert();
  // garments (Piece_<name>_LOD<n>): joined with the head and hands of each
  // level of detail (Soldier_LOD<n>) into one mesh per outfit, see outfitGeometry
  t.common = [];
  t.pieces = {};
  // the vertex colours are masks (partmat.js), and the shades of the
  // outfits (tools/characters/masks.py) are taken out of the geometries
  // (the pieces of an outfit must have the same attributes to be joined):
  // outfitGeometry puts the outfit's into R
  t.masks = !!fit.masks;
  t.ao = new Map();
  const pieces = [];
  scene.traverse((o) => {
    const m = o.isSkinnedMesh && /^(Soldier|Piece_(.+))_LOD(\d)$/.exec(o.name);
    if (!m) return;
    if (m[2]) {
      (t.pieces[m[2]] ||= [])[+m[3]] = o.geometry;
      pieces.push(o);
    } else t.common[+m[3]] = o.geometry;
    const packed = [];
    for (let i = 0; o.geometry.getAttribute(`_ao${i}`); i++) {
      packed.push(o.geometry.getAttribute(`_ao${i}`));
      o.geometry.deleteAttribute(`_ao${i}`);
    }
    const table = fit.ao && fit.ao[m[2] ? `Piece_${m[2]}` : 'Soldier'];
    if (table && packed.length) t.ao.set(o.geometry, { kept: table.kept, use: table.use, packed });
  });
  for (const o of pieces) o.removeFromParent();
  // helmets (tools/characters/helmets.py), moved into the head bone's space;
  // they are drawn as carried items (props.js), not as part of the body
  t.helmets = {};
  const loose = [];
  scene.traverse((o) => {
    if (o.isMesh && !o.isSkinnedMesh && o.name.startsWith('Helmet_')) loose.push(o);
  });
  for (const o of loose) {
    const g = o.geometry.clone().applyMatrix4(o.matrixWorld).applyMatrix4(t.headRestInv);
    // the attributes of itemMaterial: tint (the colour) and metal
    g.setAttribute('tint', g.getAttribute('color'));
    g.setAttribute('metal', g.getAttribute('_metal'));
    g.deleteAttribute('_metal');
    t.helmets[o.name.slice('Helmet_'.length)] = g;
    o.removeFromParent();
  }
  // phase of each walking clip at which the left foot is furthest forward,
  // so that walk and run can be blended in step
  const mixer = new THREE.AnimationMixer(scene);
  for (const k of ['walk', 'run', 'walk_back']) {
    const c = clips[k];
    if (!c) continue;
    const act = mixer.clipAction(c.clip);
    act.play();
    let best = -Infinity;
    for (let i = 0; i < 32; i++) {
      act.time = (i / 32) * c.dur;
      mixer.update(0);
      scene.updateMatrixWorld(true);
      const z = wpos(bones.foot_l).z - wpos(bones.pelvis).z;
      const score = k === 'walk_back' ? -z : z;
      if (score > best) {
        best = score;
        c.offset = i / 32;
      }
    }
    act.stop();
  }
  mixer.stopAllAction();
  mixer.uncacheRoot(scene);
  for (const [o, p, q, sc] of rest) {
    o.position.copy(p);
    o.quaternion.copy(q);
    o.scale.copy(sc);
  }
  scene.updateMatrixWorld(true);
  return t;
}

// lengths and the rest-pose hinge axis (in the upper bone's local space) of a
// two-bone limb
function limbInfo(upper, lower, end, fallback) {
  const a = lower.position.length();
  const b = end.position.length();
  const u = lower.position.clone().normalize();
  const l = end.position.clone().applyQuaternion(lower.quaternion).normalize();
  const hinge = new THREE.Vector3().crossVectors(u, l);
  if (hinge.length() < 0.05) {
    // straight in the rest pose: use the given axis (upper bone world frame)
    const inv = upper.getWorldQuaternion(new THREE.Quaternion()).invert();
    hinge.copy(fallback).applyQuaternion(inv);
  }
  hinge.normalize();
  return { a, b, hinge, lowerDir: u, endDir: end.position.clone().normalize() };
}

// the bend of each finger's joints in a fist (radians)
const FIST = { index: [1.1, 1.3, 0.9], middle: [1.2, 1.35, 0.9], ring: [1.25, 1.35, 0.9], pinky: [1.3, 1.3, 0.9] };
const THUMB = [0.5, 0.6, 0.5];
// weapons held by a sword's hilt (the rest by a haft or a bow's grip)
const HILTS = new Set(['sword', 'sword_long', 'sabre', 'cleaver', 'greatsword']);
// how much of a fist each finger of a hand at rest is
const RELAXED = { index: 0.25, middle: 0.35, ring: 0.45, pinky: 0.55, thumb: 0.3 };
// The archer's anchor: where his drawing hand holds the string at full
// draw, in the head bone's space: a finger's breadth (2.5 cm) out from the
// right side of his jaw (the skin there: JAW_SKIN), halfway from its angle
// to the corner of his mouth. How far from it he draws the string at most
// (to the arrow's rest: the arrow's head just past the bow), and holds the
// bow as he nocks the arrow (his drawing hand reaches the string there; he
// pushes the bow out as he draws); his drawing elbow bends towards a point
// this far behind his shoulder along the arrow and up (m).
export const JAW_SKIN = new THREE.Vector3(-0.06, -0.085, 0.003);
const JAW = JAW_SKIN.clone().add(new THREE.Vector3(-0.025, 0, 0));
const DRAW = 0.74;
const NOCK_REST = 0.4;
const DRAW_POLE = [0.6, 0.3];
// a bow is held turned about its length (its string towards the archer)
const FLIP = new THREE.Quaternion(0, 0, 1, 0);
// an arm reaches this share of its length (the IK straightens it at 0.999)
const REACH = 0.99;
// how fast the second hand takes a two-handed weapon and lets go of it (1/s)
const SECOND_EASE = 12;
// handle radii (m) the hands close round (models.js: sword grips 16-18 mm,
// axes, spears, maces and bows 20-24)
const HANDLES = { hilt: 0.016, haft: 0.02 };
// from a finger's bone to the skin of its inside
const FINGER_DEPTH = 0.008;

// local rotations of the finger bones for a hand curled by `amount` (1 =
// fist; a number, or one per finger and the thumb)
function fingerPose(bones, s, hand, amount) {
  const out = {};
  const sign = s === 'r' ? 1 : -1;
  const of = (f) => (typeof amount === 'number' ? amount : amount[f]);
  const handQ = bones[`hand_${s}`].getWorldQuaternion(new THREE.Quaternion());
  const knuckW = hand.knuck.clone().applyQuaternion(handQ);
  const lenW = hand.len.clone().applyQuaternion(handQ);
  for (const [f, angles] of Object.entries(FIST)) {
    for (let j = 0; j < 3; j++) {
      const b = bones[`${f}_0${j + 1}_${s}`];
      const bw = b.getWorldQuaternion(new THREE.Quaternion());
      const axis = knuckW.clone().applyQuaternion(bw.clone().invert());
      const rot = new THREE.Quaternion().setFromAxisAngle(axis, sign * angles[j] * of(f));
      out[b.name] = b.quaternion.clone().multiply(rot);
    }
  }
  // thumb: fold across the palm and bend
  for (let j = 0; j < 3; j++) {
    const b = bones[`thumb_0${j + 1}_${s}`];
    const bw = b.getWorldQuaternion(new THREE.Quaternion());
    const axis = (j === 0 ? lenW : knuckW).clone().applyQuaternion(bw.clone().invert());
    const rot = new THREE.Quaternion().setFromAxisAngle(axis, sign * THUMB[j] * of('thumb'));
    out[b.name] = b.quaternion.clone().multiply(rot);
  }
  return out;
}

// Local rotations of the finger bones for a hand round a handle of radius r
// held at its grip (hand.grip, along the knuckle line): each joint, from the
// knuckle out, bends until its part of the finger reaches the handle, at most
// as far as in a fist; the thumb as in a fist, but stopped at the handle too.
function wrapPose(bones, s, hand, r) {
  const out = {};
  const sign = s === 'r' ? 1 : -1;
  const handBone = bones[`hand_${s}`];
  handBone.updateWorldMatrix(true, true);
  const handQ = handBone.getWorldQuaternion(new THREE.Quaternion());
  const knuckW = hand.knuck.clone().applyQuaternion(handQ);
  const lenW = hand.len.clone().applyQuaternion(handQ);
  const centre = handBone.localToWorld(hand.grip.clone());
  const reach = r + FINGER_DEPTH;
  const off = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const rot = new THREE.Quaternion();
  // distance of a point from the handle's axis
  const away = (p) => {
    off.subVectors(p, centre);
    return off.addScaledVector(knuckW, -off.dot(knuckW)).length();
  };
  const rest = [];
  const fingers = [...Object.entries(FIST), ['thumb', THUMB]];
  for (const [f, angles] of fingers) {
    const chain = [1, 2, 3].map((j) => bones[`${f}_0${j}_${s}`]);
    // the tip: past the last joint as far as that is from the one before
    const p2 = chain[1].getWorldPosition(new THREE.Vector3());
    const tip = chain[2].worldToLocal(chain[2].getWorldPosition(new THREE.Vector3()).multiplyScalar(1.8).addScaledVector(p2, -0.8));
    for (let j = 0; j < 3; j++) {
      const b = chain[j];
      rest.push([b, b.quaternion.clone()]);
      const q0 = b.quaternion.clone();
      const axis = (f === 'thumb' && j === 0 ? lenW : knuckW).clone().applyQuaternion(b.getWorldQuaternion(new THREE.Quaternion()).invert());
      const start = b.getWorldPosition(new THREE.Vector3());
      const end = new THREE.Vector3();
      const bend = (a) => {
        b.quaternion.copy(q0).multiply(rot.setFromAxisAngle(axis, sign * a));
        b.updateWorldMatrix(false, true);
      };
      const touches = (a) => {
        bend(a);
        if (j < 2) chain[j + 1].getWorldPosition(end);
        else chain[2].localToWorld(end.copy(tip));
        for (let k = 1; k <= 4; k++) if (away(mid.lerpVectors(start, end, k / 4)) < reach) return true;
        return false;
      };
      // the first bend that reaches the handle (in steps, then halved)
      let lo = 0;
      let hi = angles[j];
      if (!touches(0)) {
        const step = angles[j] / 8;
        let a = step;
        while (a <= angles[j] + 1e-6 && !touches(a)) {
          lo = a;
          a += step;
        }
        hi = Math.min(a, angles[j]);
        if (a <= angles[j] + 1e-6) {
          for (let i = 0; i < 8; i++) {
            const m = (lo + hi) / 2;
            if (touches(m)) hi = m;
            else lo = m;
          }
        } else lo = angles[j];
      }
      bend(lo);
      out[b.name] = b.quaternion.clone();
    }
  }
  for (const [b, q] of rest) b.quaternion.copy(q);
  handBone.updateWorldMatrix(false, true);
  return out;
}

// ---------------------------------------------------------------------------
// Material (partmat.js): the whole body is one mesh (one draw call per
// soldier). A palette per soldier type gives each part its colour,
// roughness, metalness and texture, and can hide a part (no beard, hair
// under a helmet). Shared between soldiers who look alike.
// ---------------------------------------------------------------------------

// hair-like textures are grey with a mean of 0.8; skin textures are this light tone
const HAIR_MEAN = 0.8;
// hair is darker than its strands (they shade each other; the shade baked
// into the cards, masks.py, is only that of the head and the clothes)
const HAIR_SHADE = 0.65;
const SKIN_REF = new THREE.Color('#e8c3a0');

// Cloth of a colour (of the dyed cloth seen in daylight, src/data/dyes.js)
// as the tint of a tile whose mean albedo is `mean` (linear, per channel):
// faded by `fade` towards undyed wool, made lighter or darker by `shade`.
// (the wool tile's; every tile dyed so is made to it: WOOL in
// tools/characters/materials.py)
const WOOL_MEAN = [0.77, 0.729, 0.669];
// (the colours in dyes.js are of the cloth / 0.75)
const UNDYED_SRGB = new THREE.Color(UNDYED).convertLinearToSRGB();
function clothColor(hex, fade = 0, shade = 1, mean = WOOL_MEAN) {
  // (faded as the eye sees it, in sRGB: in linear light a little of the
  // undyed white makes a dark cloth much lighter)
  const c = new THREE.Color(hex).convertLinearToSRGB().lerp(UNDYED_SRGB, fade).convertSRGBToLinear();
  return c.setRGB((c.r * shade * 0.75) / mean[0], (c.g * shade * 0.75) / mean[1], (c.b * shade * 0.75) / mean[2]);
}

// Lamellar (one tile, two finishes, for its light grey plates): worn iron,
// darker than the helmets, laced with a brown thong; or the Kaganate's
// leather lacquered dark brown (soaked with pitch, Carpini; not black: the
// light side must stay lighter than the dark at 40 m, its sleeves and hem
// alone do not keep it so), laced in the side's colour. A brigandine's
// rivet heads are tinned iron.
const LAMELLAR_IRON = '#aaaaaa';
const LAMELLAR_LACQUER = '#6e5a48';
const THONG = clothColor('#7d5f47');
const RIVETS = '#d0d0d0';

// A soldier's look of each part, with his side's sign or his arms on the
// part of his outfit (`parts`, outfitParts) that bears it. (Exported for
// the tests.)
export function palette(spec, parts) {
  const look = spec.look || 'cloth';
  const sign = clothColor(spec.sign || spec.team, spec.fade, spec.shade);
  const team = tiled('wool', sign);
  // a shirt and a surcoat of linen
  const linen = tiled('linen', sign);
  // metal without chrome: worn iron and mail as a whole (their roughness and
  // darkness are in the tiles, so that the helmets have the same)
  const mail = tiled('mail', '#ffffff', 1, 0.75);
  const plate = tiled('iron', '#ffffff', 1, 0.9);
  const lamellar = spec.faction === 'kaganate'
    ? tiled('lamellar', LAMELLAR_LACQUER, 0.72, 0, { color: sign, metalness: 0 })
    : tiled('lamellar', LAMELLAR_IRON, 0.9, 0.85, { color: THONG, metalness: 0 });
  // a gambeson (and a knight's jupon: padded cloth over the plates) quilted
  // in channels, dyed the side's colour like its other cloth (a pale one is
  // not told apart at a distance)
  const quilted = tiled('quilted', sign);
  // the wearer's own cloth (a hood, an under-tunic)
  const own = tiled('wool', clothColor(spec.hood || spec.sign || spec.team, spec.fade, spec.shade));
  const armoured = look === 'mail' || look === 'brigandine';
  const leather = tiled('leather', JERKIN[spec.faction] || JERKIN.default);
  const skin = new THREE.Color(spec.skin);
  skin.setRGB(skin.r / SKIN_REF.r, skin.g / SKIN_REF.g, skin.b / SKIN_REF.b);
  const hair = new THREE.Color(spec.hair).multiplyScalar((state.t && state.t.masks ? HAIR_SHADE : 1) / HAIR_MEAN);
  return decorate(spec, parts, {
    Body: surface(skin, 0.55),
    // (the cloth look's shirt; the Norse kyrtle's body is wool)
    Tunic: look === 'cloth' && spec.kit !== 'norse' ? linen : team,
    Gambeson: quilted,
    Hauberk: mail,
    Surcoat: linen,
    Jerkin: leather,
    // a brigandine: plates riveted inside cloth of the side's colour
    Cuirass: look === 'plate' ? plate
      : look === 'brigandine' ? tiled('brigandine', sign, 1, 0, { color: RIVETS, metalness: 0.9 }) : lamellar,
    Plates: plate,
    Jupon: quilted,
    Coif: mail,
    // a hood of the wearer's own cloth
    Hood: own,
    // the Norse kyrtle (tools/characters/viking.py): the chest and the short
    // sleeves are a byrnie on the mail looks, the chest a leather vest on the
    // leather look; the long sleeves the wearer's own on the levy, mail on a
    // hauberk; the shafts of the boots wool leg wraps unless armoured
    Vest: armoured ? mail : look === 'leather' ? leather : team,
    Oversleeves: armoured ? mail : team,
    Undersleeves: look === 'mail' && spec.coif ? mail : look === 'cloth' ? own : team,
    Trousers: tiled('wool', clothColor(spec.pants, spec.fade * 0.5, spec.shade)),
    Wraps: armoured ? tiled('leather', '#b0a090') : tiled('wool', clothColor(spec.hood || spec.pants, spec.fade * 0.5, spec.shade)),
    Hose: look === 'plate' || look === 'mail' || look === 'brigandine' ? mail : tiled('wool', clothColor(spec.pants, spec.fade * 0.5, spec.shade)),
    Boots: tiled('leather', '#b0a090'),
    Shoes: tiled('leather', '#b0a090'),
    Hands: surface(skin, 0.55),
    // mail mittens, a knight's gauntlets, leather gloves
    Gloves: look === 'mail' ? mail : look === 'plate' ? plate : tiled('leather', '#6a5444'),
    Belt: tiled('leather', '#8a7a6a'),
    Hair: surface(hair, 0.7),
    Beard: surface(hair, 0.7),
    Moustache: surface(hair, 0.7),
    Brows: surface(hair, 0.7),
    Lashes: surface('#2a211b', 0.7),
    Eyes: surface('#ffffff', 0.12),
  });
}

// The tiles of the cloth dyed in the sides' colours (made to WOOL_MEAN),
// and the mean albedo of the others (tools/characters/materials.py TILES)
const DYED_TILES = new Set(['wool', 'linen', 'quilted', 'brigandine']);
const TILE_MEAN = { mail: [0.28, 0.28, 0.28], leather: [0.171, 0.082, 0.071], lamellar: [0.55, 0.55, 0.55], iron: [0.42, 0.42, 0.42] };

// The lightness (L*) a part's look is seen with.
function seenLightness(s) {
  const mean = DYED_TILES.has(s.tile) ? WOOL_MEAN : TILE_MEAN[s.tile] || [1, 1, 1];
  const c = new THREE.Color(s.color);
  const y = 0.2126 * c.r * mean[0] + 0.7152 * c.g * mean[1] + 0.0722 * c.b * mean[2];
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
}

// The part that bears the army's sign or a knight's arms: the outer garment
// of the chest, or the sleeves for armbands. Of the parts the soldier's
// outfit has (outfitParts): the Norse kyrtle has its vest and oversleeves,
// the Norse gambeson, hauberk and brigandine are the others'.
const CHEST = { cloth: 'Tunic', padded: 'Gambeson', leather: 'Jerkin', mail: 'Surcoat', lamellar: 'Cuirass', brigandine: 'Cuirass', plate: 'Jupon' };
const SLEEVES = { cloth: 'Tunic', padded: 'Gambeson', leather: 'Tunic', lamellar: 'Tunic' };
function bearer(spec, sleeves, parts) {
  const look = OUTFITS[spec.look] ? spec.look : 'cloth';
  if (parts.has('Vest')) return sleeves ? 'Oversleeves' : 'Vest';
  const part = sleeves ? SLEEVES[look] || 'Hauberk' : CHEST[look];
  return parts.has(part) ? part : null;
}

// A knight's arms over his whole garment (of his field's colour: partmat.js
// DECO_FRAGMENT fades the arms out from 40 to 56 m, the field is seen
// beyond); or the army's sign on the
// part that bears it, on a patch of undyed or black cloth where it would not
// stand out (as the Scots' ordinance of 1385 has it).
function decorate(spec, parts, look) {
  const h = state.t && state.t.heraldry;
  if (spec.arms >= 0 && spec.armsWorn && h) {
    const part = bearer(spec, false, parts);
    const s = part && look[part];
    if (s && DYED_TILES.has(s.tile)) {
      const field = h.meta[spec.arms] && TINCTURES[h.meta[spec.arms].field];
      look[part] = { ...s, color: field ? clothColor(field, spec.fade, spec.shade) : s.color, deco: deco('coat', { coat: spec.arms }) };
      return look;
    }
  }
  const sign = spec.badge;
  const part = sign && bearer(spec, sign.shape === 'armbands', parts);
  const s = part && look[part];
  if (!s) return look;
  const L = lightness(sign.color);
  const boxed = sign.shape === 'cross' || sign.shape === 'saltire';
  // (against the side's cloth as it was dyed, not as this man's has faded:
  // the same sign for the whole side)
  const seen = DYED_TILES.has(s.tile) ? { ...s, color: clothColor(spec.sign || spec.team) } : s;
  const patch = boxed && Math.abs(L - seenLightness(seen)) < 30 ? (L > 50 ? SABLE : UNDYED) : null;
  look[part] = {
    ...s,
    deco: deco(sign.shape, { color: clothColor(sign.color), patch: patch && clothColor(patch), weave: DYED_TILES.has(s.tile) }),
  };
  return look;
}

// The garments of each armour look (see tools/characters/outfits.py); the
// coif, the feet and the hands are added by outfitOf. (DRESS in outfits.py
// repeats them with the feet, and NORSE: the model keeps only the skin they
// show. Change it with them.)
const OUTFITS = {
  cloth: ['Tunic', 'Belt-Tunic', 'Hose'],
  padded: ['Gambeson', 'Belt-Gambeson', 'Hose'],
  leather: ['Tunic', 'Jerkin', 'Belt-Jerkin', 'Hose'],
  mail: ['Hauberk', 'Surcoat', 'Belt-Surcoat', 'Hose'],
  lamellar: ['Tunic', 'Cuirass', 'Belt-Cuirass', 'Hose'],
  brigandine: ['Hauberk', 'Cuirass', 'Belt-Cuirass', 'Hose'],
  // a knight of c. 1330-60: mail, plates on the arms and legs, a jupon over
  // the plates of the chest
  plate: ['Hauberk', 'Plates', 'Jupon', 'Belt-Jupon', 'Hose'],
};
// a mail coif, its mantle over the outer garment (tools/characters/coif.py)
const COIF = { mail: 'Coif-Surcoat', plate: 'Coif-Jupon' };
// helmets with their own mail (an aventail): no coif under them
const AVENTAIL = new Set(['spangen', 'spiked']);
// a cloth hood, its cape over the outer garment (tools/characters/hood.py):
// the gambeson's standing collar has one of its own
const HOOD = { padded: 'Hood-Gambeson' };
// armour worn with gloves (mail mittens, gauntlets, leather), and the
// clothes worn with low shoes (the rest with boots)
const GLOVED = new Set(['mail', 'lamellar', 'brigandine', 'plate']);
const SHOD = new Set(['cloth', 'padded']);

// The Norse kit (the Nords): a kyrtle, trousers and soft boots
// (tools/characters/viking.py), or the gambeson or the hauberk and brigandine
// over the trousers and boots (and in DRESS, tools/characters/outfits.py)
const NORSE = {
  cloth: ['VikingTunic', 'VikingPants'],
  leather: ['VikingTunic', 'VikingPants'],
  mail: ['VikingTunic', 'VikingPants'],
  padded: ['Gambeson', 'Belt-Gambeson', 'VikingPants'],
  brigandine: ['Hauberk', 'Cuirass', 'Belt-Cuirass', 'VikingPants'],
};
let norseFailed = false;

// The outfit of a soldier: the garments of the armour's look, a cloth hood
// (instead of the carried helmet) or a mail coif if the armour has one and
// the helmet leaves room for it, shoes or boots (the riders of the steppe
// keep their boots) and bare or gloved hands. Pieces a model does not have
// are left out (an older model has the hands in the body, no shoes, no
// hood: the hood is then a carried helmet). Each with the name of its
// shade (tools/characters/outfits.py contexts: the look, ':hood' or ':coif').
const outfitList = new Map();
const outfitShade = new Map();
function outfitOf(spec) {
  const has = (n) => !!state.t.pieces[n];
  const look = OUTFITS[spec.look] ? spec.look : 'cloth';
  // (all or nothing: a model without the Norse pieces, or whose pieces do
  // not join, gives the other outfits)
  if (spec.kit === 'norse' && NORSE[look] && [...NORSE[look], 'VikingBoots'].every(has) && !norseFailed) {
    const hood = spec.helmet === 'hood' && HOOD[look] && has(HOOD[look]) ? HOOD[look] : null;
    const hands = look === 'brigandine' && has('Gloves') ? 'Gloves' : 'Hands';
    const key = ['norse', look, hood || '', hands].join(':');
    if (!outfitList.has(key)) {
      outfitList.set(key, [...NORSE[look], ...(hood ? [hood] : []), 'VikingBoots', hands]);
      const kit = look === 'padded' || look === 'brigandine' ? `norse-${look}` : 'norse';
      outfitShade.set(key, kit + (hood ? ':hood' : ''));
    }
    if (outfitGeometry(key, 0)) return { key, coif: false, hood: !!hood };
    console.warn('Norse outfit unusable:', key);
    norseFailed = true;
  }
  const hood = spec.helmet === 'hood' && has(HOOD[look] || 'Hood') ? HOOD[look] || 'Hood' : null;
  const coif = !hood && spec.coif && !AVENTAIL.has(spec.helmet) && COIF[look] && has(COIF[look]) ? COIF[look] : null;
  const feet = SHOD.has(look) && spec.faction !== 'kaganate' && has('Shoes') ? 'Shoes' : 'Boots';
  const hands = GLOVED.has(look) && has('Gloves') ? 'Gloves' : 'Hands';
  const head = hood || coif;
  const key = [look, head || '', feet, hands].join(':');
  if (!outfitList.has(key)) {
    outfitList.set(key, [...OUTFITS[look], ...(head ? [head] : []), feet, hands]);
    outfitShade.set(key, look + (hood ? ':hood' : coif ? ':coif' : ''));
  }
  return { key, coif: !!coif, hood: !!hood };
}

// The head with the pieces of an outfit (outfitOf), for one level of detail;
// the farthest (FAR_LEVEL) is the far one simplified further here.
const outfits = new Map();
const FAR_LEVEL = 3;
// of the far level's triangles; how far its surface may move (of the height)
const FAR_SHARE = 0.2;
const FAR_ERROR = 0.04;

function outfitGeometry(outfit, level) {
  const t = state.t;
  const key = `${outfit}:${level}`;
  let geo = outfits.get(key);
  if (geo !== undefined) return geo;
  if (level === FAR_LEVEL) {
    const far = outfitGeometry(outfit, FAR_LEVEL - 1);
    geo = far && simplified(far, FAR_SHARE, FAR_ERROR);
  } else {
    const names = outfitList.get(outfit).filter((n) => t.pieces[n] && t.pieces[n][level]);
    const parts = [t.common[level], ...names.map((n) => t.pieces[n][level])];
    geo = names.length ? mergeGeometries(parts) : null;
    if (geo) shade(geo, parts, outfitShade.get(outfit));
  }
  outfits.set(key, geo);
  return geo;
}

// The names of the parts an outfit's garments have (their _part numbers)
const partsOfOutfit = new Map();
function outfitParts(outfit) {
  let parts = partsOfOutfit.get(outfit);
  if (!parts) {
    parts = new Set();
    // (a model without garments: the parts of its one mesh)
    const geo = outfitGeometry(outfit, 0) || state.t.common[0];
    const a = geo && geo.getAttribute('_part');
    if (a) for (let i = 0; i < a.count; i++) parts.add(state.t.parts[Math.round(a.getX(i))]);
    partsOfOutfit.set(outfit, parts);
  }
  return parts;
}

// Each part's shade in the outfit `name` (prepare) into R of the joined
// geometry's colours (R stays where the part has none of its own), and into
// A its shade with the hair hidden under a carried helmet ('<name>:helmet',
// the head's; the others' as in R): partmat.js takes A when the hair is
// hidden (a helmet, a hood or a coif).
function shade(geo, parts, name) {
  const color = geo.getAttribute('color');
  if (!state.t.masks || !color || color.itemSize < 4) return;
  const helmet = name.includes(':') ? null : `${name}:helmet`;
  let start = 0;
  for (const g of parts) {
    const s = state.t.ao.get(g);
    const own = (outfit) => {
      const k = s && s.use[outfit] ? s.kept.indexOf(s.use[outfit]) : -1;
      return k >= 0 ? { from: s.packed[k >> 2], c: k & 3 } : null;
    };
    const r = own(name);
    const a = helmet && own(helmet);
    const count = g.getAttribute('position').count;
    for (let i = 0; i < count; i++) {
      const v = r ? r.from.getComponent(i, r.c) : color.getX(start + i);
      color.setX(start + i, v);
      color.setW(start + i, a ? a.from.getComponent(i, a.c) : v);
    }
    start += count;
  }
}

// parts made of see-through cards
const CARDS = new Set(['Hair', 'Beard', 'Moustache', 'Brows', 'Lashes']);

// The soldiers' material in a battle (`owner`) and this soldier's palette row.
function soldierLook(owner, spec, hidden, outfit) {
  const t = state.t;
  const layers = t.layers;
  const stubble = spec.stubble && layers && 'skin_stubble' in layers.index;
  const kind = { program: 'soldier', parts: t.parts, layers, tiles: t.tiles, mud: spec.mud, masks: t.masks, deco: t.masks, heraldry: t.heraldry };
  return partLook(owner, kind, {
    palette: palette(spec, outfitParts(outfit)),
    layerOf: (name) => ((name === 'Body' || name === 'Hands') && stubble ? 'skin_stubble' : t.partLayers[name]),
    cards: CARDS,
    hidden,
  });
}

// ---------------------------------------------------------------------------
// Carried items with tileable materials (helmets, weapons, shields): each
// vertex names its material (_tile, -1: plain colour), the tint of the
// texture and its metalness (metal). Drawn instanced by props.js, so one
// material for all of them. Null until the textures are loaded.
// ---------------------------------------------------------------------------

let itemMat = null;

export function itemMaterial() {
  if (itemMat) return itemMat;
  const tiles = state.t && state.t.tiles;
  if (!tiles) return null;
  const names = tiles ? Object.keys(tiles.index) : [];
  const repeat = new Float32Array(Math.max(1, names.length)).fill(1);
  names.forEach((n, i) => (repeat[i] = tiles.repeat[n]));
  itemMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7, metalness: 0, vertexColors: true });
  itemMat.onBeforeCompile = (shader) => {
    shader.uniforms.tileColor = { value: tiles.color };
    shader.uniforms.tileSurface = { value: tiles.surface };
    shader.uniforms.tileRepeat = { value: repeat };
    shader.uniforms.heraldry = { value: state.t.heraldry ? state.t.heraldry.texture : null };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float _tile;
        attribute float metal;
        attribute vec3 tint;
        varying float vTile;
        varying float vMetal;
        varying vec3 vTint;
        varying vec2 vTileUv;
        varying float vCoat;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vTile = _tile;
        vMetal = metal;
        vTint = tint;
        vTileUv = uv;`)
      // (the instance colour of a knight's shield is his coat of arms, not a colour)
      .replace('#include <color_vertex>', `
        #if defined(USE_COLOR) || defined(USE_COLOR_ALPHA) || defined(USE_INSTANCING_COLOR)
        vColor = vec4(1.0);
        #endif
        #ifdef USE_COLOR_ALPHA
        vColor *= color;
        #elif defined(USE_COLOR)
        vColor.rgb *= color;
        #endif
        #ifdef USE_INSTANCING_COLOR
        vCoat = instanceColor.r;
        #else
        vCoat = -1.0;
        #endif`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${TILE_FRAGMENT}
        uniform float tileRepeat[${repeat.length}];
        uniform highp sampler2DArray heraldry;
        varying float vTile;
        varying float vMetal;
        varying vec3 vTint;
        varying vec2 vTileUv;
        varying float vCoat;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 tileSurf = vec3(0.5, 0.5, -1.0);
        vec2 tileUv = vTileUv;
        vec3 itemTint = vTint;
        // a knight's arms on the face of his heater (metal -1 there; the
        // arms are the instance's, props.js): its field from the top, as
        // wide as the shield (on the face vTileUv is (y, x) in metres,
        // models.js), painted (x 1.25: the paint tile's mean is 0.6, the
        // dyes' colours are of the cloth / 0.75)
        vec2 coatUv = vec2((vTileUv.y + 0.25) * 2.0, (0.31 - vTileUv.x) / 0.583);
        vec2 coatDx = dFdx(coatUv);
        vec2 coatDy = dFdy(coatUv);
        if (vCoat > -0.5 && vMetal < -0.5) itemTint = 1.25 * textureGrad(heraldry, vec3(coatUv, vCoat), coatDx, coatDy).rgb;
        float itemMetal = max(vMetal, 0.0);
        if (vTile > -0.5) {
          tileUv *= tileRepeat[int(vTile + 0.5)];
          vec4 tileCol = texture(tileColor, vec3(tileUv, vTile));
          diffuseColor.rgb = itemTint * tileCol.rgb;
          tileSurf = vec3(texture(tileSurface, vec3(tileUv, vTile)).xy, tileCol.a);
        }
        // worn rims (a helmet's colour alpha is the distance to the nearest
        // rim, tools/characters/masks.py; 1 elsewhere): the metal rubbed
        // bright and smooth there, not drawn far away (smaller than a pixel)
        float rimWear = itemMetal * (1.0 - smoothstep(0.0, 0.6, vColor.a)) * (1.0 - smoothstep(12.0, 18.0, length(vViewPosition)));
        diffuseColor.rgb *= 1.0 + 0.4 * rimWear;`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = (tileSurf.z < 0.0 ? 0.7 : clamp(tileSurf.z, 0.04, 1.0)) * (1.0 - 0.4 * rimWear);')
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = itemMetal;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (tileSurf.z >= 0.0) {
          mat3 frame = tileFrame(-vViewPosition, normal, tileUv);
          normal = normalize(frame * tileNormal(tileSurf.xy));
        }`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>${DULL_METAL}`);
  };
  itemMat.customProgramCacheKey = () => 'tiled-item';
  return itemMat;
}

// Helmets are armour: worn iron, not the weapons' bright steel. (A model
// made before there was an iron tile names plate for their steel; brass,
// tinted yellow, stays plate.)
function ironHelmets(helmets, index) {
  if (!('iron' in index) || !('plate' in index)) return;
  for (const g of Object.values(helmets)) {
    const tile = g.getAttribute('_tile');
    const tint = g.getAttribute('tint');
    if (!tile || !tint) continue;
    for (let i = 0; i < tile.count; i++) {
      if (tile.getX(i) === index.plate && Math.abs(tint.getX(i) - tint.getZ(i)) < 0.1) tile.setX(i, index.iron);
    }
  }
}

// A helmet of `look` with the parts marked _team painted in `team`.
const helmetCache = new Map();

function helmetFor(look, team) {
  const base = state.t.helmets && state.t.helmets[look];
  if (!base) return null;
  const key = `${look}:${team}`;
  let geo = helmetCache.get(key);
  if (geo) return geo;
  geo = base;
  const flags = base.getAttribute('_team');
  const color = base.getAttribute('color');
  if (flags && color && flags.array.some((v) => v > 0.5)) {
    geo = base.clone();
    const col = geo.getAttribute('color');
    const c = new THREE.Color(team);
    for (let i = 0; i < col.count; i++) {
      if (flags.getX(i) > 0.5) col.setXYZ(i, c.r * col.getX(i), c.g * col.getY(i), c.b * col.getZ(i));
    }
    geo.setAttribute('tint', col);
  }
  helmetCache.set(key, geo);
  return geo;
}

// ---------------------------------------------------------------------------
// One soldier
// ---------------------------------------------------------------------------

const LOCO = ['idle', 'walk', 'run', 'walk_back'];
const CULL_SPHERE = new THREE.Sphere(new THREE.Vector3(0, 1.0, 0), 1.6);
// levels of detail by the size on screen (at 900p a soldier is about
// 1400 / distance pixels tall): the full model up close, then 30 % and 10 %
// of the triangles, and 2 % from 32 m on (under 45 pixels); posed every
// frame, every second or every fourth frame
const LOD_DIST = [10, 20, 32];
const POSE_DIST = [17, 45];

// ---------------------------------------------------------------------------
// The fallen. Agent.lieLayout lays the frame of the soldier's own space on
// the ground (his length along it, the side LIE[].rho names to the sky);
// SkinnedHuman.fall bends the body in it to one of these poses, blended from
// the pose he died in while the frame tips over.
// ---------------------------------------------------------------------------

// the bones a fall moves: the trunk, the arms, the legs
const FALL_BONES = ['pelvis', 'spine_01', 'spine_02', 'spine_03', 'neck_01', 'head',
  'clavicle_l', 'upperarm_l', 'lowerarm_l', 'hand_l', 'clavicle_r', 'upperarm_r', 'lowerarm_r', 'hand_r',
  'thigh_l', 'calf_l', 'foot_l', 'ball_l', 'thigh_r', 'calf_r', 'foot_r', 'ball_r'];
const TRUNK = 6;
const LEGS = 14;
// the bones things he drops are laid clear of (the feet and the head first:
// the body's length)
const CLEAR_BONES = ['foot_l', 'foot_r', 'head', 'pelvis', 'spine_02', 'spine_03', 'neck_01', 'upperarm_l', 'upperarm_r', 'lowerarm_l', 'lowerarm_r',
  'hand_l', 'hand_r', 'thigh_l', 'thigh_r', 'calf_l', 'calf_r', 'ball_l', 'ball_r'];
// how far a forearm turns on its length from the rest pose, how far down a
// hand on the ground may point (rad)
const FOREARM_TURN = 1.75;
const HAND_TILT = 0.45;

// The ways of lying, in the soldier's own space (x his left, y up his body,
// z forward), the right and left as given for `mirror` 1 (-1 swaps them):
// - rho: his roll about his length, 0 on the back, PI on the face (a side:
//   one after a fall on the back, one after a fall on the face);
// - reach: how far from his feet his pelvis lands (m);
// - spine, head: bend forward, turn left, lean left (rad), over the three
//   spine bones and over the neck and head;
// - arm_l .. leg_r: where the wrist or ankle goes (`at`; with `ground`, on
//   the ground under it, that high above it), where the elbow or knee
//   points (`pole`, from the shoulder or hip), a hand on the ground with its
//   palm up (1) or down (-1), a foot pointed by `point` (rad) or set flat on
//   its sole.
export const LIE = [
  // on the back, the arms out, the right knee fallen out
  {
    rho: 0, reach: 0.45, spine: [-0.06, 0, 0.06], head: [-0.4, 0.45, 0.1],
    arm_l: { at: [0.62, 1.38, 0], pole: [0.1, -1, -0.4], ground: 0.04, palm: 1 },
    arm_r: { at: [-0.42, 0.98, 0], pole: [-1, 0, -0.4], ground: 0.04, palm: -1 },
    leg_l: { at: [0.26, 0.11, 0], pole: [0.6, 0, 1], ground: 0.075, point: 0.4 },
    leg_r: { at: [-0.25, 0.14, 0], pole: [-1, 0, 0.6], ground: 0.075, point: 0.5 },
  },
  // on the back, the right knee up, the left arm across the chest
  {
    rho: 0, reach: 0.4, spine: [0, 0.1, -0.05], head: [-0.35, -0.5, -0.1],
    arm_l: { at: [-0.19, 1.08, 0.08], pole: [0.6, -0.2, 0.6] },
    arm_r: { at: [-0.6, 1.22, 0], pole: [-0.3, -1, -0.4], ground: 0.04, palm: 1 },
    leg_l: { at: [0.24, 0.08, 0], pole: [0.6, 0, 1], ground: 0.075, point: 0.45 },
    leg_r: { at: [-0.12, 0.4, 0], pole: [0.25, 0.3, 1], ground: 0.085, flat: true },
  },
  // on the face, the head turned, the left knee drawn up to the side
  {
    rho: Math.PI, reach: 0.6, spine: [0, 0, 0.1], head: [0.25, 1.15, 0.2],
    arm_l: { at: [0.3, 1.62, 0], pole: [1, -0.3, 0.5], ground: 0.04, palm: -1 },
    arm_r: { at: [-0.26, 0.98, 0], pole: [-1, 0, -0.5], ground: 0.04, palm: 1 },
    leg_l: { at: [0.2, 0.32, 0], pole: [1, 0.3, 0.3], ground: 0.06, point: 0.6 },
    leg_r: { at: [-0.17, 0.1, 0], pole: [0, 0, 1], ground: 0.06, point: 1.2 },
  },
  // on the right side (rolled a little from the back, or from the face), the
  // knees bent, the lower arm forward by the head, the upper one before the
  // chest
  {
    rho: [1.4, 1.8], reach: 0.4, spine: [0.15, 0, 0], head: [0.15, -0.2, -0.6],
    arm_l: { at: [-0.2, 1.25, 0.28], pole: [0.8, -0.6, 0.2], ground: 0.04, palm: 1 },
    arm_r: { at: [-0.2, 1.62, 0.35], pole: [0.2, -0.4, 1], ground: 0.04, palm: -1 },
    leg_l: { at: [-0.1, 0.45, 0.35], pole: [-0.5, 0, 1], ground: 0.055, point: 0.5 },
    leg_r: { at: [-0.2, 0.2, 0.25], pole: [0, 0, 1], ground: 0.055, point: 0.5 },
  },
];

// A LIE's spine or head turn (bend forward, turn left, lean left) as Euler
// angles in the soldier's own space, mirrored by the sign of k, times |k|.
export function lieTurn(a, k, out = new THREE.Euler()) {
  return out.set(a[0] * Math.abs(k), a[1] * k, -a[2] * k, 'YXZ');
}

// Where the wrist or ankle of `limb` ('arm_l' .. 'leg_r', his own side) goes
// as he lies as `lie`, in his own space (`out`), on the ground under it or
// not as LIE gives it; the LIE spec it comes from.
export function lieTarget(lie, limb, terrain, out) {
  const m = lie.mirror;
  const s = limb.endsWith('_l') ? 'l' : 'r';
  // (mirrored: this side as the other side's given)
  const spec = LIE[lie.variant][limb.slice(0, -1) + (m > 0 ? s : s === 'l' ? 'r' : 'l')];
  out.set(spec.at[0] * m, spec.at[1], spec.at[2]);
  if (spec.ground !== undefined) onGround(out, spec.ground, lie, terrain);
  return spec;
}

// How high the pelvis lies over the ground (m) rolled by rho: its bone is
// nearer the back than the belly, half the hips' width from either side.
export function lieHeight(rho) {
  const c = Math.cos(rho);
  return Math.hypot(0.2 * Math.sin(rho), (c >= 0 ? 0.14 : 0.17) * c);
}

export class SkinnedHuman {
  // `props` draws the helmet (see props.js)
  constructor(spec, props) {
    const t = state.t;
    this.t = t;
    this.spec = spec;
    this.object = cloneSkinned(t.scene);
    this.bones = {};
    this.lod = [];
    this.object.traverse((o) => {
      if (o.isBone) this.bones[o.name] = o;
      const m = o.isSkinnedMesh && /_LOD(\d)$/.exec(o.name);
      if (m) this.lod[+m[1]] = o;
    });
    const outfit = outfitOf(spec);
    // (a cloth hood is a part of the outfit, other helmets are carried)
    if (!outfit.hood) this.addHelmet(spec, props);
    // beards: none, a moustache or a full beard; helmets and hoods hide the
    // hair, a coif the hair and the beard
    const hide = new Set();
    if (spec.beard !== 'full') hide.add('Beard');
    if (!spec.beard) hide.add('Moustache');
    if (this.helmet || outfit.hood) hide.add('Hair');
    if (outfit.coif) hide.add('Hair').add('Beard');
    const { material: mat, row } = soldierLook(props, spec, t.parts.map((name) => (hide.has(name) ? 1 : 0)), outfit.key);
    // the farthest level, made at run time (outfitGeometry)
    const far = outfitGeometry(outfit.key, FAR_LEVEL);
    if (far) this.lod[FAR_LEVEL] = lodMesh(this.lod[FAR_LEVEL - 1], far, mat, `Soldier_LOD${FAR_LEVEL}`);
    // the levels of detail share one skeleton: one bone update and one bone
    // texture per soldier
    const shared = this.lod[0].skeleton;
    this.lod.forEach((o, level) => {
      if (o.skeleton !== shared) o.bind(shared, o.bindMatrix);
      o.geometry = outfitGeometry(outfit.key, level) || o.geometry;
      o.material = mat;
      o.customDepthMaterial = mat.userData.depth;
      // shadows: cast by a lighter level (shadowStandIn, setLod)
      o.castShadow = false;
      o.receiveShadow = true;
      // a sphere that holds the body in any pose (arms up, lying dead), in
      // the mesh's own space: soldiers outside the view are not drawn
      o.boundingSphere = CULL_SPHERE;
    });
    // the bones in the soldier's own space, out of the scene, and in the
    // battle's bone texture
    this.space = ownSpaceSkeleton(this.object, this.lod);
    this.skeleton = shared;
    poolBones(props, shared, this.lod, row, spec.dirt || 0, spec.wear || 0);
    this.shadow = shadowStandIn(this.lod[this.lod.length - 1], mat, CULL_SPHERE);
    this.lodLevel = -1;
    this.setLod(0);
    this.frameNo = Math.floor(Math.random() * 4);
    this.pending = 0;
    this.mixer = new THREE.AnimationMixer(this.space);
    this.actions = {};
    // his own way of standing, a little quicker or slower
    const idle = t.clips[spec.idle] ? spec.idle : t.idles[Math.floor(Math.random() * t.idles.length)];
    this.idleRate = 0.9 + Math.random() * 0.2;
    for (const k of LOCO) {
      const c = t.clips[k === 'idle' ? idle : k];
      if (!c) continue;
      const a = this.mixer.clipAction(c.clip);
      a.play();
      a.setEffectiveWeight(k === 'idle' ? 1 : 0);
      this.actions[k] = { action: a, clip: c, weight: k === 'idle' ? 1 : 0 };
    }
    this.phase = Math.random();
    this.idleTime = Math.random() * (this.actions.idle ? this.actions.idle.clip.dur : 1);
    // the bones pose() turns relatively, each with its value from the clips
    this.turned = [];
    for (const name of ['pelvis', 'spine_01', 'spine_02', 'spine_03', 'neck_01', 'head']) {
      this.turned.push(this.bones[name], this.bones[name].quaternion.clone());
    }
    this.hipYaw = 0;
    // grips: where a held item sits in each hand
    this.grip = {};
    for (const s of ['l', 'r']) {
      const g = new THREE.Object3D();
      g.position.copy(t.hands[s].grip);
      g.quaternion.copy(t.hands[s].gripQ);
      this.bones[`hand_${s}`].add(g);
      g.updateMatrix();
      this.grip[s] = g;
    }
    this.handPose = { l: 'relaxed', r: 'relaxed' };
    // the arms' bones from the spine out (arms() works out their world
    // matrices), and each arm's upper, lower and hand
    this.armChain = ['l', 'r'].flatMap((s) => [`clavicle_${s}`, `upperarm_${s}`, `lowerarm_${s}`, `hand_${s}`].map((n) => this.bones[n]));
    this.armL = this.armChain.slice(1, 4);
    this.armR = this.armChain.slice(5, 8);
    // how far the second hand is on a two-handed weapon (0: hanging), and
    // where along it (secondHand)
    this.second = 0;
    this.secondAt = 0;
  }

  setLod(level) {
    if (level === this.lodLevel) return;
    this.lodLevel = level;
    this.lod.forEach((o, i) => (o.visible = i === level));
    // the shadow: the far level (10 %) up close, the farthest in the middle
    // (the shadow map has some 20 texels per metre); the farthest soldiers
    // cast none (each would be one more draw)
    this.shadow.geometry = this.lod[Math.min(Math.max(level + 1, 2), this.lod.length - 1)].geometry;
    this.shadow.visible = level < this.lod.length - 1;
  }

  addHelmet(spec, props) {
    // (a hood is of the wearer's own cloth)
    const fitted = helmetFor(spec.helmet, spec.helmet === 'hood' && spec.hood ? spec.hood : spec.team);
    if (fitted) {
      const m = props.add(fitted, itemMaterial());
      this.bones.head.add(m);
      m.userData.space = this.object;
      this.helmet = m;
      return;
    }
    const geo = helmetGeo(spec.helmet, spec.team);
    if (!geo) return;
    const fit = this.t.fit;
    const m = props.add(geo);
    // the procedural helmets are sized for a head whose hair is 0.12 m wide
    // (half) around (0, 0.19, 0) above the neck: scale and place them on
    // this head
    const hh = fit.hair_half || [0.08, 0.09, 0.1];
    const s = (Math.max(hh[0], hh[2] * 0.9) + 0.012) / 0.132;
    const c = new THREE.Vector3().fromArray(fit.hair_center || [0, 1.65, 0.04]);
    c.y -= hh[1] * 0.35;
    const local = c.applyMatrix4(this.t.headRestInv);
    const holder = new THREE.Object3D();
    holder.quaternion.copy(this.t.headRestQ).invert();
    holder.position.copy(local);
    m.scale.setScalar(s);
    m.position.set(0, -0.19 * s, 0);
    holder.add(m);
    this.bones.head.add(holder);
    m.userData.space = this.object;
    this.helmet = m;
  }

  // Move the pose rig's shoulders and hands to where this body's are, so that
  // the targets it produces are within reach.
  fitDriver(rig) {
    const t = this.t;
    const hipY = rig.hips.position.y;
    rig.armR.position.set(t.shoulder.r.x, t.shoulder.r.y - hipY, t.shoulder.r.z);
    rig.armL.position.set(t.shoulder.l.x, t.shoulder.l.y - hipY, t.shoulder.l.z);
    rig.armLen = t.reach * 0.96;
    rig.handR.position.y = -rig.armLen;
    rig.handL.position.y = -rig.armLen;
  }

  attach(obj, side) {
    this.grip[side].add(obj);
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, 0, 0);
    // (the hands are in the soldier's space: props.js places it in the world)
    obj.userData.space = this.object;
  }

  // ---- per frame ----------------------------------------------------------------------

  // the level of detail by the camera's distance (of the fallen too, who
  // are no longer posed: Battle.animateAgents); the distance squared
  updateLod(camera, pos) {
    const d2 = camera.position.distanceToSquared(pos);
    let level = 0;
    while (level < this.lod.length - 1 && d2 >= LOD_DIST[level] ** 2) level++;
    this.setLod(level);
    return d2;
  }

  update(agent, dt) {
    const r = agent.rig;
    const d2 = this.updateLod(agent.battle.camera, agent.pos);
    // animation level of detail: distant soldiers are posed less often
    this.pending += dt;
    const every = d2 < POSE_DIST[0] ** 2 ? 1 : d2 < POSE_DIST[1] ** 2 ? 2 : 4;
    // (a fall's first pose and its last, always: the first works out how he
    // will lie, and after the last he is not posed again)
    const must = !agent.alive && (!this.fallen || agent.fallT >= 1);
    if (dt > 0 && !must && this.frameNo++ % every !== 0) return;
    // paused: the pose stays (nothing moves)
    if (dt === 0 && this.posedOnce && !must) return;
    this.posedOnce = true;
    dt = this.pending;
    this.pending = 0;
    // Pose in the soldier's own space, where its bones are (see
    // ownSpaceSkeleton): the pose rig's root stands at the origin meanwhile,
    // so that everything the pose code reads of the rig is in that space too.
    const root = r.root;
    U.p.copy(root.position);
    U.q.copy(root.quaternion);
    U.toLocal.compose(U.p, U.q, U.one).invert();
    root.position.set(0, 0, 0);
    root.quaternion.identity();
    this.pose(agent, dt);
    root.position.copy(U.p);
    root.quaternion.copy(U.q);
    posed(this.space, this.skeleton);
  }

  pose(agent, dt) {
    const r = agent.rig;
    const b = this.bones;
    if (!agent.alive) {
      // (the clips stop where he died)
      this.fall(agent);
      this.fingers();
      return;
    }
    // The bones turned below on top of the clips are put back as the clips
    // left them first: the mixer only sets a bone whose clip value changed,
    // and the turns would otherwise add up.
    const turned = this.turned;
    for (let i = 0; i < turned.length; i += 2) turned[i].quaternion.copy(turned[i + 1]);
    this.locomotion(agent, dt);
    for (let i = 0; i < turned.length; i += 2) turned[i + 1].copy(turned[i].quaternion);
    b.pelvis.updateWorldMatrix(true, false);
    const rootQ = r.root.getWorldQuaternion(U.rootQ);

    // hips turn towards the walking direction (and an archer's in the
    // saddle towards his aim, Agent.seatTurn); the torso follows the aim
    const hipYaw = this.hipYaw + (agent.seatTurn || 0);
    if (Math.abs(hipYaw) > 1e-3) rotateWorld(b.pelvis, worldRot(rootQ, U.a.setFromAxisAngle(Y, hipYaw), U.inc));
    if (agent.horse) this.ride(rootQ, agent.horse.rig, U.toLocal);
    const torsoQ = U.a.copy(r.torso.quaternion).premultiply(U.b.setFromAxisAngle(Y, -hipYaw));
    const step = U.c.identity().slerp(torsoQ, 1 / 3);
    const inc = worldRot(rootQ, step, U.inc);
    rotateWorld(b.spine_01, inc);
    rotateWorld(b.spine_02, inc);
    rotateWorld(b.spine_03, inc);
    // look up and down
    const torsoWorld = U.d.copy(rootQ).multiply(r.torso.quaternion);
    const half = U.c.identity().slerp(r.neck.quaternion, 0.5);
    const neckInc = worldRot(torsoWorld, half, U.inc);
    rotateWorld(b.neck_01, neckInc);
    rotateWorld(b.head, neckInc);
    this.arms(agent, rootQ, dt);
    this.fingers();
  }

  locomotion(agent, dt) {
    const acts = this.actions;
    const t = this.t;
    let sp = 0;
    let rel = 0;
    if (!agent.horse) {
      sp = Math.hypot(agent.vel.x, agent.vel.z);
      rel = wrapAngle(Math.atan2(agent.vel.x, agent.vel.z) - (agent.bodyYaw ?? agent.yaw));
    }
    const moving = smoothstep(0.15, 0.7, sp);
    const backward = Math.abs(rel) > 1.95;
    const wRun = backward ? 0 : smoothstep(2.0, 3.3, sp);
    const target = {
      idle: 1 - moving,
      walk: backward ? 0 : moving * (1 - wRun),
      run: backward ? 0 : moving * wRun,
      walk_back: backward ? moving : 0,
    };
    let hip = 0;
    if (moving > 0.01) hip = clamp(backward ? wrapAngle(rel - Math.PI) : rel, -1.1, 1.1) * moving;
    const k = Math.min(1, dt * 8);
    this.hipYaw += (hip - this.hipYaw) * k;
    // step frequency
    const cyc = (c) => (c ? Math.max(0.3, c.speed * c.dur) : 1);
    let freq;
    if (backward) freq = sp / cyc(t.clips.walk_back);
    else freq = (sp / cyc(t.clips.walk)) * (1 - wRun) + (sp / cyc(t.clips.run)) * wRun;
    freq = clamp(freq, 0.35, 2.4);
    this.phase = (this.phase + dt * freq) % 1;
    this.idleTime += dt * this.idleRate;
    for (const [name, a] of Object.entries(acts)) {
      a.weight += (target[name] - a.weight) * k;
      // (a clip with no weight is not even sampled)
      if (a.weight < 0.002) a.weight = 0;
      a.action.setEffectiveWeight(a.weight);
      const c = a.clip;
      a.action.time = name === 'idle' ? this.idleTime % c.dur : ((this.phase + c.offset) % 1) * c.dur;
    }
    this.mixer.update(0);
  }

  // legs astride the horse, the feet in its stirrups (realistic horses; they
  // are in the world, `toLocal` brings them into the pose's space) or where
  // they would be
  ride(rootQ, horse, toLocal) {
    const b = this.bones;
    for (const s of ['l', 'r']) {
      const side = s === 'l' ? 1 : -1;
      const hip = b[`thigh_${s}`].getWorldPosition(U.v1);
      const foot = horse.stirrup ? horse.stirrup(s, U.v2).applyMatrix4(toLocal).add(U.v3.set(0, 0.07, -0.06).applyQuaternion(rootQ))
        : U.v2.set(side * 0.3, -0.78, 0.18).applyQuaternion(rootQ).add(hip);
      const pole = U.v3.set(side * 0.3, 0, 1).applyQuaternion(rootQ).add(hip);
      solveLimb(b[`thigh_${s}`], b[`calf_${s}`], b[`foot_${s}`], this.t.limbs[`leg_${s}`], foot, pole);
    }
  }

  arms(agent, rootQ, dt) {
    const r = agent.rig;
    const w = agent.weapon;
    // the world matrices of the rig's arms and hands, and of the clips' arms
    // on the turned spine, worked out once for what follows (placeWrist
    // keeps an arm's up to date)
    r.wristR.updateWorldMatrix(true, false);
    r.armL.updateWorldMatrix(false, false);
    r.handL.updateWorldMatrix(false, false);
    for (const bone of this.armChain) refresh(bone);
    if (w.cls === 'bow') {
      this.archer(agent, rootQ);
      return;
    }
    // right hand: the weapon grip of the pose rig (moved with his shoulder
    // as the clips sway his body)
    const wristQ = worldQuat(r.wristR, A.wristQ);
    const wristP = A.wristP.setFromMatrixPosition(r.wristR.matrixWorld).add(this.sway(agent, 'r', A.pos));
    this.placeHand('r', wristP, wristQ, rootQ);
    // (a pole stood on the ground: its butt there from where the hand is)
    const ground = agent.horse ? 0 : agent._pose.ground;
    let slide = 0;
    if (ground) {
      const p = A.pos.copy(this.t.hands.r.grip).applyMatrix4(this.bones.hand_r.matrixWorld);
      const up = A.dir.set(0, 0, 1).applyQuaternion(worldQuat(this.bones.hand_r, A.q).multiply(this.t.hands.r.gripQ)).y;
      slide = ground * agent.slideFor(p.y, up);
    }
    agent.weaponMesh.position.z = -slide;
    // (round the weapon's handle: a sword's hilt or a haft)
    const handle = HILTS.has(w.model) ? 'hilt' : 'haft';
    this.handPose.r = handle;
    // left hand
    const sh = agent.activeShield();
    if (sh && agent.shieldMesh) {
      agent.shieldMesh.updateWorldMatrix(true, false);
      const grip = agent.shieldMesh.localToWorld(A.pos.set(0, 0, -0.05));
      // hold the shield's handle: knuckles along the shield's up axis
      const q = agent.shieldMesh.getWorldQuaternion(A.q).multiply(A.q2.setFromAxisAngle(X, -Math.PI / 2));
      this.placeHand('l', grip, q, rootQ);
      this.handPose.l = 'hilt';
    } else if (w.lance && agent.horse) {
      // reins in the left hand
      this.placeHand('l', A.pos.setFromMatrixPosition(r.handL.matrixWorld).add(this.sway(agent, 'l', A.dir)), worldQuat(r.handL, A.q), rootQ);
      this.handPose.l = 'fist';
    } else if (secondRanges(w)) {
      this.secondHand(agent, rootQ, dt, handle);
    } else {
      this.freeHand('l', rootQ);
    }
  }

  // How far the clips have moved his shoulder `s` from the pose rig's (they
  // sway his body as he stands, the rig stays put): into `out`. (Their world
  // matrices as arms() has worked them out.)
  sway(agent, s, out) {
    const r = agent.rig;
    out.setFromMatrixPosition((s === 'l' ? this.bones.upperarm_l : this.bones.upperarm_r).matrixWorld);
    return out.sub(A.sway.setFromMatrixPosition((s === 'l' ? r.armL : r.armR).matrixWorld));
  }

  // A free hand: by his side standing, swinging with the captured walk when
  // moving.
  freeHand(s, rootQ) {
    if (this.hang(s, rootQ, A.pos, A.q)) this.placeWrist(s, A.pos, A.q, rootQ);
    this.handPose[s] = 'relaxed';
  }

  // Where a free hand is (its wrist into `wrist`, its world rotation into
  // `q`): as the clips put it, drawn towards hanging by his side as much as
  // he stands (the idle clip's weight). False if just as the clips put it.
  hang(s, rootQ, wrist, q) {
    const b = this.bones;
    const hand = s === 'l' ? b.hand_l : b.hand_r;
    wrist.setFromMatrixPosition(hand.matrixWorld);
    worldQuat(hand, q);
    const idleW = this.actions.idle ? this.actions.idle.weight : 0;
    if (idleW <= 0.02) return false;
    const shoulder = A.dir.setFromMatrixPosition((s === 'l' ? b.upperarm_l : b.upperarm_r).matrixWorld);
    wrist.lerp(A.hang.set(s === 'l' ? 0.08 : -0.08, -0.55, 0.035).applyQuaternion(rootQ).add(shoulder), idleW);
    q.slerp(this.handWorld(s, rootQ, A.q2), idleW);
    return true;
  }

  // The second (left) hand on a two-handed weapon (grips.js SECOND): round
  // its handle where it reaches it (secondGrip, on the axis of the weapon as
  // the right hand holds it), else, or while the weapon rests (the pose's
  // `free`), hanging; eased from one to the other.
  secondHand(agent, rootQ, dt, handle) {
    const b = this.bones;
    const t = this.t;
    const hr = t.hands.r;
    const hl = t.hands.l;
    // the weapon's axis: through the right hand's grip, along the held item
    const p = S2.p.copy(hr.grip).applyMatrix4(b.hand_r.matrixWorld);
    const dir = S2.dir.set(0, 0, 1).applyQuaternion(worldQuat(b.hand_r, S2.q).multiply(hr.gripQ));
    const shoulder = S2.sh.setFromMatrixPosition(b.upperarm_l.matrixWorld);
    const arm = t.limbs.arm_l;
    let s = NaN;
    if (agent._pose.free < 0.5) {
      for (const [want, from, to] of secondRanges(agent.weapon)) {
        s = secondGrip(shoulder, p, dir, from, to, want, (arm.a + arm.b) * REACH, hl.back, hl.side);
        if (!Number.isNaN(s)) break;
      }
    }
    const on = !Number.isNaN(s);
    if (on) this.secondAt = s;
    this.second += ((on ? 1 : 0) - this.second) * Math.min(1, dt * SECOND_EASE);
    // (hanging, or on the handle, or between)
    const hanging = this.second < 0.999 && this.hang('l', rootQ, S2.w, S2.q2);
    if (this.second < 0.01) {
      if (hanging) this.placeWrist('l', S2.w, S2.q2, rootQ);
      this.handPose.l = 'relaxed';
      return;
    }
    const h = handOnAxis(shoulder, p, dir, this.secondAt, hl.back, hl.side, S2.h);
    const q = this.handFrame('l', h.len, h.knuck, S2.q3);
    if (this.second < 0.999) this.placeWrist('l', S2.w.lerp(h.wrist, this.second), S2.q2.slerp(q, this.second), rootQ);
    else this.placeWrist('l', h.wrist, q, rootQ);
    this.handPose.l = this.second > 0.5 ? handle : 'relaxed';
  }

  // The archer (Agent.drawPose): his bow arm from hanging to straight at
  // the target, the bow upright (canted), the arrow's rest on its hand on
  // the line from the anchor by his jaw (JAW) to the target, as far out as
  // the arm reaches (DRAW at most); his drawing hand from hanging to the
  // string, drawing it from the bow to the jaw, the elbow up behind; the
  // string and the nocked arrow to where that hand holds it.
  archer(agent, rootQ) {
    const b = this.bones;
    const t = this.t;
    const r = agent.rig;
    const d = agent._draw;
    const hold = d.raise;
    // the bow lowered in his left hand as the rig holds it, the right hand
    // free (at rest)
    const pos = AR.p.setFromMatrixPosition(r.handL.matrixWorld).add(this.sway(agent, 'l', AR.v));
    const q = worldQuat(r.handL, AR.q2).multiply(AR.q.setFromAxisAngle(X, BOW_LOWER));
    this.handPose.l = 'haft';
    if (hold < 0.001) {
      this.placeHand('l', pos, q, rootQ);
      this.freeHand('r', rootQ);
      agent.drawString(null, false);
      return;
    }
    // the way to the target, up (the bow's, canted to his right), in his
    // own space
    const toOwn = AR.q.copy(U.q).invert();
    const T = AR.T.set(Math.sin(agent.aimYaw) * Math.cos(agent.aimPitch), Math.sin(agent.aimPitch), Math.cos(agent.aimYaw) * Math.cos(agent.aimPitch)).applyQuaternion(toOwn);
    const up = AR.up.set(0, 1, 0).applyQuaternion(toOwn);
    up.addScaledVector(T, -up.dot(T)).normalize();
    const right = AR.right.crossVectors(T, up);
    up.multiplyScalar(Math.cos(BOW_CANT)).addScaledVector(right, Math.sin(BOW_CANT));
    // the frame the hands hold the bow and the string in (the item up, the
    // hands' length towards the target), and the bow's
    const aimQ = AR.aimQ.setFromRotationMatrix(AR.m.makeBasis(AR.x.crossVectors(AR.y.copy(T).negate(), up), AR.y, up));
    const bowQ = AR.bowQ.copy(aimQ).multiply(FLIP);
    // the arrow's rest out from the jaw along the way to the target, as far
    // as the bow arm reaches: the bow's grip, and the left wrist, so far back
    const jaw = AR.jaw.copy(JAW).applyMatrix4(b.head.matrixWorld);
    const gripOff = AR.g.copy(t.hands.l.grip).applyQuaternion(this.handWorld('l', aimQ, AR.hq));
    const restOff = AR.ro.copy(ARROW_REST).applyQuaternion(bowQ);
    const arm = t.limbs.arm_l;
    const reach = (arm.a + arm.b) * REACH;
    const v = AR.v.copy(jaw).sub(restOff).sub(gripOff).sub(AR.s.setFromMatrixPosition(b.upperarm_l.matrixWorld));
    const vt = v.dot(T);
    const disc = vt * vt - v.lengthSq() + reach * reach;
    const full = Math.min(DRAW, disc > 0 ? Math.sqrt(disc) - vt : -vt);
    // (nearer as he nocks, NOCK_REST, pushed out as he draws)
    const draw = Math.min(full, NOCK_REST + (full - NOCK_REST) * d.pull);
    const rest = AR.rest.copy(jaw).addScaledVector(T, draw);
    const grip = AR.grip.copy(rest).sub(restOff);
    // the bow hand raised
    this.placeHand('l', pos.lerp(grip, hold), q.slerp(aimQ, hold), rootQ);
    // the drawing hand: from hanging to the string at its nocking point,
    // drawing it to the jaw
    const handR = this.handWorld('r', aimQ, AR.hr);
    const at = AR.at.copy(STRING_NOCK).applyQuaternion(bowQ).add(grip).lerp(jaw, d.pull);
    const wrist = AR.w.copy(t.hands.r.grip).applyQuaternion(handR).negate().add(at);
    const hanging = this.hang('r', rootQ, AR.wh, AR.qh);
    if (hold > 0.001 || hanging) {
      AR.wh.lerp(wrist, hold);
      AR.qh.slerp(handR, hold);
      // (the elbow down by his side hanging, up behind drawing)
      const shoulder = AR.s.setFromMatrixPosition(b.upperarm_r.matrixWorld);
      const pole = AR.pole.set(-0.55, -0.55, -0.45).applyQuaternion(rootQ).add(shoulder);
      pole.lerp(AR.pole2.copy(shoulder).addScaledVector(T, -DRAW_POLE[0]).addScaledVector(up, DRAW_POLE[1]), hold);
      this.placeWrist('r', AR.wh, AR.qh, rootQ, pole);
    }
    this.handPose.r = hold > 0.5 ? 'hilt' : 'relaxed';
    // the string to the hand and the arrow on it, in the bow's own space
    // (while an arrow is on it)
    if (!d.nocked) {
      agent.drawString(null, false);
      return;
    }
    const bowM = AR.bm.multiplyMatrices(b.hand_l.matrixWorld, this.grip.l.matrix).multiply(agent.weaponMesh.matrix).invert();
    const meet = AR.meet.copy(t.hands.r.grip).applyMatrix4(b.hand_r.matrixWorld).applyMatrix4(bowM);
    agent.drawString(meet, true);
  }

  // The world rotation of hand `s` whose length (wrist to knuckles) and
  // knuckle line (little finger to index) are `len` and `knuck` (unit,
  // square to each other).
  handFrame(s, len, knuck, out) {
    return out.setFromRotationMatrix(handBasis(len, knuck, H.m)).multiply(H.inv.copy(this.t.hands[s].basisQ).invert());
  }

  // World orientation of hand `s` holding an item whose frame is `q` (item
  // along +Z, the arm along -Y).
  handWorld(s, q, out) {
    const hand = this.t.hands[s];
    const len = H.len.set(0, -1, 0).applyQuaternion(q);
    const knuck = H.knuck.set(0, 0, 1).applyQuaternion(q);
    return out.setFromRotationMatrix(handBasis(len, knuck, H.m)).multiply(H.inv.copy(hand.basisQ).invert());
  }

  // The arm's elbow bends towards `pole` (a point; by default down, out and
  // back from the shoulder). (The arm's world matrices as arms() has worked
  // them out.)
  placeWrist(s, wrist, handWorldQ, rootQ, pole = null) {
    const b = this.bones;
    const side = s === 'l' ? 1 : -1;
    const [upper, lower, hand] = s === 'l' ? this.armL : this.armR;
    const shoulder = H.shoulder.setFromMatrixPosition(upper.matrixWorld);
    if (!pole) pole = H.pole.set(side * 0.55, -0.55, -0.45).applyQuaternion(rootQ).add(shoulder);
    solveLimb(upper, lower, hand, s === 'l' ? this.t.limbs.arm_l : this.t.limbs.arm_r, wrist, pole, true);
    setWorldQuat(hand, handWorldQ);
  }

  // Put hand `s` so that its grip sits at `pos` with the held item oriented
  // like the pose rig's `q` (item along +Z, the arm along -Y).
  placeHand(s, pos, q, rootQ, pole = null) {
    const handWorld = this.handWorld(s, q, H.q);
    // wrist position = grip minus the grip offset
    const wrist = H.wrist.copy(this.t.hands[s].grip).applyQuaternion(handWorld);
    wrist.subVectors(pos, wrist);
    this.placeWrist(s, wrist, handWorld, rootQ, pole);
  }

  fingers() {
    const b = this.bones;
    for (const s of ['l', 'r']) {
      const pose = this.t.hands[s][this.handPose[s]];
      for (const name in pose) b[name].quaternion.copy(pose[name]);
    }
  }

  // ---- the fall ------------------------------------------------------------------------

  // A fall at agent.fallT (0..1), in the frame Agent.fallRoot tips over: the
  // trunk and the arms turn from the pose he died in to the lying one (the
  // arms a little later); his feet stay where they stood a moment as his
  // knees give, then go where they lie, never under the ground (held there
  // in the world until the frame lies too: the lying legs are solved for its
  // end).
  fall(agent) {
    if (!this.fallen) this.layDown(agent);
    const f = this.fallen;
    const b = this.bones;
    const g = agent.fallT;
    const wt = smoothstep(0, 0.9, g);
    const wa = smoothstep(0.1, 1, g);
    const wl = smoothstep(agent.fallDir > 0 ? 0.4 : 0.3, 0.95, g);
    for (let i = 0; i < LEGS; i++) f.bones[i].quaternion.slerpQuaternions(f.from[i], f.to[i], i < TRUNK ? wt : wa);
    b.pelvis.position.lerpVectors(f.pelvisFrom, this.t.pelvisRest, wt);
    if (g >= 1) {
      for (let i = LEGS; i < FALL_BONES.length; i++) f.bones[i].quaternion.copy(f.to[i]);
    } else {
      const terrain = agent.battle.terrain;
      const toLocalQ = U.c.copy(U.q).invert();
      for (let k = 0; k < 2; k++) {
        const s = k ? 'r' : 'l';
        // the foot as it stood on the ground (in the world), turning to how
        // it lies; the ankle from where it stood to where it lies, as high as
        // keeps it and the toes (as the foot turns) out of the ground
        const footQ = U.d.copy(toLocalQ).multiply(f.feetQFrom[k]).slerp(f.feetQTo[k], wl);
        const toe = U.v4.copy(b[`ball_${s}`].position).applyQuaternion(footQ).applyQuaternion(U.q);
        const foot = U.v1.lerpVectors(f.feetFrom[k], f.feetTo[k], wl);
        foot.y = Math.max(foot.y, terrain.heightAt(foot.x, foot.z) + 0.06, terrain.heightAt(foot.x + toe.x, foot.z + toe.z) + 0.02 - toe.y);
        foot.applyMatrix4(U.toLocal);
        const hip = b[`thigh_${s}`].getWorldPosition(U.v2);
        const pole = U.v3.lerpVectors(f.polesFrom[k], f.polesTo[k], wl).add(hip);
        solveLimb(b[`thigh_${s}`], b[`calf_${s}`], b[`foot_${s}`], this.t.limbs[`leg_${s}`], foot, pole);
        setWorldQuat(b[`foot_${s}`], footQ);
        const i = LEGS + 3 + 4 * k;
        f.bones[i].quaternion.slerpQuaternions(f.from[i], f.to[i], wl);
      }
    }
  }

  // The pose he will lie in, once, as the fall begins: the rest pose bent to
  // agent.lie's (LIE), its wrists and ankles on the ground under them. Kept
  // as the bones' rotations, with those he falls from.
  layDown(agent) {
    const lie = agent.lie;
    const L = LIE[lie.variant];
    const m = lie.mirror;
    const b = this.bones;
    const t = this.t;
    // his hands let go (Agent.dropItems lets fall what they held)
    this.handPose.l = this.handPose.r = 'relaxed';
    const bones = FALL_BONES.map((n) => b[n]);
    const from = bones.map((o) => o.quaternion.clone());
    const pelvisFrom = b.pelvis.position.clone();
    // where his feet stood, and where his knees pointed
    const feetFrom = ['l', 'r'].map((s) => b[`foot_${s}`].getWorldPosition(new THREE.Vector3()).applyQuaternion(lie.q0).add(lie.r0));
    const feetQFrom = ['l', 'r'].map((s) => b[`foot_${s}`].getWorldQuaternion(new THREE.Quaternion()).premultiply(lie.q0));
    const polesFrom = [new THREE.Vector3(0.2, 0, 1), new THREE.Vector3(-0.2, 0, 1)];
    bones.forEach((o, i) => o.quaternion.copy(t.fallRest[i]));
    b.pelvis.position.copy(t.pelvisRest);
    this.space.updateMatrixWorld(true);
    // the trunk: over the spine, then the neck and the head
    const inc = (a, share) => U.a.setFromEuler(lieTurn(a, m * share, U.e));
    for (const n of ['spine_01', 'spine_02', 'spine_03']) rotateWorld(b[n], inc(L.spine, 1 / 3));
    for (const n of ['neck_01', 'head']) rotateWorld(b[n], inc(L.head, 1 / 2));
    const terrain = agent.battle.terrain;
    const feetTo = [];
    const feetQTo = [];
    const polesTo = [];
    for (const s of ['l', 'r']) {
      for (const limb of ['arm', 'leg']) {
        const [upper, lower, end] = limb === 'arm' ? [`upperarm_${s}`, `lowerarm_${s}`, `hand_${s}`] : [`thigh_${s}`, `calf_${s}`, `foot_${s}`];
        const target = new THREE.Vector3();
        const spec = lieTarget(lie, `${limb}_${s}`, terrain, target);
        const root = b[upper].getWorldPosition(new THREE.Vector3());
        const pole = new THREE.Vector3(spec.pole[0] * m, spec.pole[1], spec.pole[2]);
        solveLimb(b[upper], b[lower], b[end], t.limbs[`${limb}_${s}`], target, pole.clone().add(root));
        if (limb === 'arm') {
          if (spec.palm) this.handFlat(s, spec.palm, lie.sky);
          continue;
        }
        feetTo.push(target.clone().applyQuaternion(lie.q1).add(lie.r1));
        polesTo.push(pole);
        const foot = b[end];
        if (spec.flat) {
          // the sole on the ground, the toes away from the head
          aim(foot, b[`ball_${s}`].position, U.v1.copy(target).addScaledVector(Y, -0.13).addScaledVector(lie.sky, -0.06));
        } else {
          // pointed: turned towards the line of the shin
          const ankle = U.v1.setFromMatrixPosition(foot.matrixWorld);
          const shin = U.v2.copy(ankle).sub(U.v3.setFromMatrixPosition(b[lower].matrixWorld));
          const toes = U.v3.setFromMatrixPosition(b[`ball_${s}`].matrixWorld).sub(ankle);
          rotateWorld(foot, U.a.setFromAxisAngle(toes.cross(shin).normalize(), spec.point));
        }
        feetQTo.push(foot.getWorldQuaternion(new THREE.Quaternion()));
      }
    }
    const to = bones.map((o) => o.quaternion.clone());
    // where his bones will lie, in his own space
    this.space.updateMatrixWorld(true);
    const lying = CLEAR_BONES.map((n) => new THREE.Vector3().setFromMatrixPosition(b[n].matrixWorld));
    bones.forEach((o, i) => o.quaternion.copy(from[i]));
    b.pelvis.position.copy(pelvisFrom);
    this.space.updateMatrixWorld(true);
    this.fallen = { bones, from, to, pelvisFrom, feetFrom, feetQFrom, feetTo, feetQTo, polesFrom, polesTo, lying };
  }

  // Where his body will lie on the ground (once layDown has worked it out),
  // `m` the world matrix of his space then: x, z of his feet (between them)
  // and his head, then of the rest of his bones, pushed onto `out`.
  lyingPoints(m, out) {
    const p = this.fallen.lying;
    U.v1.lerpVectors(p[0], p[1], 0.5).applyMatrix4(m);
    out.push(U.v1.x, U.v1.z);
    for (let i = 2; i < p.length; i++) {
      U.v1.copy(p[i]).applyMatrix4(m);
      out.push(U.v1.x, U.v1.z);
    }
    return out;
  }

  // A hand on the ground: along it the way the forearm points, the palm up
  // (1) or down (-1), or the other way if the forearm would have to turn
  // too far for it; `sky` the side of the soldier's space facing up. (The
  // forearm turns, not the wrist: the hand keeps its rest twist on it.)
  handFlat(s, palm, sky) {
    const b = this.bones;
    const hand = b[`hand_${s}`];
    const lower = b[`lowerarm_${s}`];
    const rest = this.t.fallRest;
    const iHand = FALL_BONES.indexOf(`hand_${s}`);
    const lowerQ = H.lower.copy(lower.quaternion);
    for (const p of [palm, -palm]) {
      lower.quaternion.copy(lowerQ);
      refresh(lower);
      // (the hand's own matrix is not brought up to date by the IK)
      const wrist = U.v1.copy(hand.position).applyMatrix4(lower.matrixWorld);
      const axis = U.v2.subVectors(wrist, U.v3.setFromMatrixPosition(lower.matrixWorld)).normalize();
      // (down a little with a forearm coming down to it: the knuckles still
      // clear of the ground)
      const tilt = Math.min(HAND_TILT, Math.max(0, -Math.asin(clamp(axis.dot(sky), -1, 1))));
      const len = U.v3.copy(axis).addScaledVector(sky, -axis.dot(sky)).normalize().multiplyScalar(Math.cos(tilt)).addScaledVector(sky, -Math.sin(tilt));
      // (the palm, len x knuck on the left hand and knuck x len on the right,
      // towards `up`)
      const up = H.palm.copy(sky).multiplyScalar(p);
      const knuck = (s === 'r' ? H.knuck.crossVectors(len, up) : H.knuck.crossVectors(up, len)).normalize();
      const q = H.q.setFromRotationMatrix(handBasis(len, knuck, H.m)).multiply(H.inv.copy(this.t.hands[s].basisQ).invert());
      setWorldQuat(hand, q);
      // its twist on the forearm, given to the forearm
      rotateWorld(lower, U.b.setFromAxisAngle(axis, twistY(U.a.copy(rest[iHand]).invert().multiply(hand.quaternion))));
      setWorldQuat(hand, q);
      // how far the forearm turned from its rest
      if (Math.abs(twistY(U.a.copy(rest[iHand - 1]).invert().multiply(lower.quaternion))) < FOREARM_TURN) return;
    }
  }
}

// ---------------------------------------------------------------------------
// Bone math (world space). Every function has its own scratch objects so
// that callers can pass theirs in safely.
// ---------------------------------------------------------------------------

const Y = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const scratch = (vs, qs, extra = {}) => {
  const o = { ...extra };
  for (const n of vs) o[n] = new THREE.Vector3();
  for (const n of qs) o[n] = new THREE.Quaternion();
  return o;
};
const U = scratch(['v1', 'v2', 'v3', 'v4', 'p'], ['rootQ', 'a', 'b', 'c', 'd', 'inc', 'q'], { toLocal: new THREE.Matrix4(), one: new THREE.Vector3(1, 1, 1), e: new THREE.Euler() });
const A = scratch(['wristP', 'pos', 'dir', 'hang', 'sway'], ['wristQ', 'q', 'q2']);
const S2 = scratch(['p', 'dir', 'sh', 'w'], ['q', 'q2', 'q3'], { h: scratch(['grip', 'wrist', 'len', 'knuck', 'palm'], []) });
const AR = scratch(['T', 'up', 'right', 'x', 'y', 'jaw', 'g', 'ro', 'v', 's', 'rest', 'grip', 'p', 'at', 'w', 'wh', 'pole', 'pole2', 'meet'],
  ['q', 'aimQ', 'bowQ', 'hq', 'hr', 'q2', 'qh'], { m: new THREE.Matrix4(), bm: new THREE.Matrix4() });
const H = scratch(['len', 'knuck', 'palm', 'wrist', 'shoulder', 'pole'], ['q', 'inv', 'lower'], { m: new THREE.Matrix4() });
const WR = scratch([], ['inv']);
const WQ = scratch(['p', 's'], []);
const RW = scratch([], ['p', 'inv']);
const SQ = scratch([], ['p']);
const AI = scratch(['from', 'pos', 'to'], ['q', 'r']);
const SL = scratch(['S', 'dir', 'p', 'E', 'T', 'n', 'h', 'axis', 'tmp'], ['q', 'r']);
const OG = scratch(['w'], []);
const HB = scratch(['v'], []);

// a rotation given in the frame `frameQ` (e.g. the soldier's root) as a world rotation
function worldRot(frameQ, local, out) {
  return out.copy(frameQ).multiply(local).multiply(WR.inv.copy(frameQ).invert());
}

function worldQuat(o, out) {
  o.matrixWorld.decompose(WQ.p, out, WQ.s);
  return out;
}

// Recompute a bone's world matrix from its (up to date) parent's, without
// touching its children: the pose code walks down each chain in order and
// the renderer updates everything once more before drawing.
function refresh(bone) {
  bone.updateMatrix();
  bone.matrixWorld.multiplyMatrices(bone.parent.matrixWorld, bone.matrix);
}

// A hand's frame (its length and knuckle line, unit and square to each
// other) as a rotation: they and len x knuck, the palm's normal on the left
// hand and the back's on the right (the right hand is the left's mirror
// image: a frame with the palm on both would be a reflection, whose
// quaternion is no rotation and scales the hand and what it holds).
function handBasis(len, knuck, out) {
  return out.makeBasis(len, knuck, HB.v.crossVectors(len, knuck));
}

// the turn (rad, -PI..PI) of a rotation about its local y (a bone's length)
function twistY(q) {
  return 2 * Math.atan2(q.w < 0 ? -q.y : q.y, Math.abs(q.w));
}

// rotate a bone by the world rotation R about its own pivot
function rotateWorld(bone, R) {
  worldQuat(bone.parent, RW.p);
  // local' = P^-1 * R * P * local
  RW.inv.copy(RW.p).invert();
  bone.quaternion.premultiply(RW.p).premultiply(R).premultiply(RW.inv);
  refresh(bone);
}

function setWorldQuat(bone, q) {
  worldQuat(bone.parent, SQ.p);
  bone.quaternion.copy(SQ.p.invert()).multiply(q);
  refresh(bone);
}

// rotate `bone` (minimally) so that its local direction `localDir` points at `target`
function aim(bone, localDir, target) {
  refresh(bone);
  const q = worldQuat(bone, AI.q);
  const from = AI.from.copy(localDir).applyQuaternion(q).normalize();
  const pos = AI.pos.setFromMatrixPosition(bone.matrixWorld);
  const to = AI.to.subVectors(target, pos).normalize();
  rotateWorld(bone, AI.r.setFromUnitVectors(from, to));
}

// Two-bone IK: put the end of the limb at `target`, bending in the plane that
// contains `pole` and keeping the middle joint a hinge.
function solveLimb(upper, lower, end, info, target, pole, fresh = false) {
  // (`fresh`: the upper bone's world matrix is up to date)
  if (!fresh) upper.updateWorldMatrix(true, false);
  const S = SL.S.setFromMatrixPosition(upper.matrixWorld);
  const { a, b } = info;
  const dir = SL.dir.subVectors(target, S);
  let d = dir.length();
  if (d < 1e-4) return;
  dir.divideScalar(d);
  d = clamp(d, Math.abs(a - b) + 1e-3, (a + b) * 0.999);
  const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
  const sinA = Math.sqrt(1 - cosA * cosA);
  const p = SL.p.subVectors(pole, S);
  p.addScaledVector(dir, -p.dot(dir));
  if (p.lengthSq() < 1e-8) p.set(0, -1, 0).addScaledVector(dir, -dir.y);
  p.normalize();
  const E = SL.E.copy(S).addScaledVector(dir, a * cosA).addScaledVector(p, a * sinA);
  const T = SL.T.copy(S).addScaledVector(dir, d);
  // upper bone: aim at the elbow, then roll its hinge axis into the bend plane
  aim(upper, info.lowerDir, E);
  const n = SL.n.subVectors(E, S).cross(SL.tmp.subVectors(T, E));
  if (n.lengthSq() > 1e-10) {
    n.normalize();
    const h = SL.h.copy(info.hinge).applyQuaternion(worldQuat(upper, SL.q));
    const axis = SL.axis.subVectors(E, S).normalize();
    h.addScaledVector(axis, -h.dot(axis)).normalize();
    n.addScaledVector(axis, -n.dot(axis)).normalize();
    const ang = Math.atan2(SL.tmp.crossVectors(h, n).dot(axis), h.dot(n));
    rotateWorld(upper, SL.r.setFromAxisAngle(axis, ang));
  }
  aim(lower, info.endDir, T);
}

// Put a point of the soldier's space (lying as `lie`) `clear` m above the
// ground: on the plane he lies on, then by as much as the ground under it is
// above or below that plane (a little).
export function onGround(p, clear, lie, terrain) {
  const sky = lie.sky;
  p.addScaledVector(sky, lie.c + clear - sky.dot(p));
  const w = OG.w.copy(p).applyQuaternion(lie.q1).add(lie.r1);
  const n = lie.n;
  const plane = lie.g.y - (n.x * (w.x - lie.g.x) + n.z * (w.z - lie.g.z)) / n.y;
  const d = clamp(terrain.heightAt(w.x, w.z) - plane, -0.15, 0.25);
  p.addScaledVector(sky, d * n.y);
}
