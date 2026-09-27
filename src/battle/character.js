// Realistic soldiers: a skinned MakeHuman body with motion-captured walking,
// running and idling (CMU mocap), whose arms, torso and head follow the
// procedural pose rig of an Agent (weapons, blocks, aiming). Built by
// tools/characters/build_soldier.py and packed into dist/characters.js.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { helmetGeo, mesh as vcMesh } from './models.js';
import { clamp, wrapAngle, smoothstep } from '../core/util.js';

const state = { status: 'idle', promise: null, t: null };

export function loadCharacters() {
  if (state.promise) return state.promise;
  const b64 = typeof window !== 'undefined' && window.__CHARACTER_ASSETS && window.__CHARACTER_ASSETS.soldier;
  if (!b64) {
    state.status = 'missing';
    state.promise = Promise.resolve(false);
    return state.promise;
  }
  state.status = 'loading';
  state.promise = new Promise((resolve) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    new GLTFLoader().parse(
      bytes.buffer,
      '',
      (gltf) => {
        try {
          state.t = prepare(gltf);
          state.status = 'ready';
          resolve(true);
        } catch (e) {
          console.warn('Character model unusable:', e);
          state.status = 'failed';
          resolve(false);
        }
      },
      (err) => {
        console.warn('Character model failed to load:', err);
        state.status = 'failed';
        resolve(false);
      },
    );
  });
  return state.promise;
}

export function charactersReady() {
  return state.status === 'ready';
}

// ---------------------------------------------------------------------------
// Template: things measured once on the loaded model in its rest pose
// ---------------------------------------------------------------------------


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
    clips[name] = { clip, speed: Number(speed) || 0, dur: clip.duration, offset: 0 };
  }
  const t = { scene, clips, fit, hands: {}, limbs: {} };
  const wpos = (b) => b.getWorldPosition(new THREE.Vector3());
  for (const s of ['l', 'r']) {
    const hand = bones[`hand_${s}`];
    // hand frame in the hand bone's local space: length (wrist -> knuckles),
    // knuckle line (little finger -> index finger), palm normal
    const len = bones[`middle_01_${s}`].position.clone().normalize();
    const knuck = bones[`index_01_${s}`].position.clone().sub(bones[`pinky_01_${s}`].position);
    knuck.addScaledVector(len, -knuck.dot(len)).normalize();
    const palm = s === 'r' ? new THREE.Vector3().crossVectors(knuck, len) : new THREE.Vector3().crossVectors(len, knuck);
    const basis = new THREE.Matrix4().makeBasis(len, knuck, palm);
    const knuckDist = bones[`middle_01_${s}`].position.length();
    const grip = len.clone().multiplyScalar(knuckDist * 0.9).addScaledVector(palm, 0.028);
    // weapon frame in hand space: +Z along the knuckle line, +Y back to the wrist
    const wy = len.clone().negate();
    const wx = new THREE.Vector3().crossVectors(wy, knuck);
    const gripQ = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(wx, wy, knuck));
    t.hands[s] = { len, knuck, palm, basisQ: new THREE.Quaternion().setFromRotationMatrix(basis), grip, gripQ };
    t.limbs[`arm_${s}`] = limbInfo(bones[`upperarm_${s}`], bones[`lowerarm_${s}`], hand, new THREE.Vector3(1, 0, 0));
    t.limbs[`leg_${s}`] = limbInfo(bones[`thigh_${s}`], bones[`calf_${s}`], bones[`foot_${s}`], new THREE.Vector3(1, 0, 0));
    t.hands[s].fist = fingerPose(bones, s, t.hands[s], 1);
    t.hands[s].relaxed = fingerPose(bones, s, t.hands[s], 0.35);
  }
  t.shoulder = { l: wpos(bones.upperarm_l), r: wpos(bones.upperarm_r) };
  t.reach = t.limbs.arm_r.a + t.limbs.arm_r.b + bones.middle_01_r.position.length() * 0.9;
  t.pelvisY = wpos(bones.pelvis).y;
  t.headRestQ = bones.head.getWorldQuaternion(new THREE.Quaternion());
  t.headRestInv = new THREE.Matrix4().copy(bones.head.matrixWorld).invert();
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

// local rotations of the finger bones for a hand curled by `amount` (1 = fist)
function fingerPose(bones, s, hand, amount) {
  const out = {};
  const sign = s === 'r' ? 1 : -1;
  const handQ = bones[`hand_${s}`].getWorldQuaternion(new THREE.Quaternion());
  const knuckW = hand.knuck.clone().applyQuaternion(handQ);
  const lenW = hand.len.clone().applyQuaternion(handQ);
  const curls = { index: [1.1, 1.3, 0.9], middle: [1.2, 1.35, 0.9], ring: [1.25, 1.35, 0.9], pinky: [1.3, 1.3, 0.9] };
  for (const [f, angles] of Object.entries(curls)) {
    for (let j = 0; j < 3; j++) {
      const b = bones[`${f}_0${j + 1}_${s}`];
      const bw = b.getWorldQuaternion(new THREE.Quaternion());
      const axis = knuckW.clone().applyQuaternion(bw.clone().invert());
      const rot = new THREE.Quaternion().setFromAxisAngle(axis, sign * angles[j] * amount);
      out[b.name] = b.quaternion.clone().multiply(rot);
    }
  }
  // thumb: fold across the palm and bend
  for (let j = 0; j < 3; j++) {
    const b = bones[`thumb_0${j + 1}_${s}`];
    const bw = b.getWorldQuaternion(new THREE.Quaternion());
    const axis = (j === 0 ? lenW : knuckW).clone().applyQuaternion(bw.clone().invert());
    const rot = new THREE.Quaternion().setFromAxisAngle(axis, sign * [0.5, 0.6, 0.5][j] * amount);
    out[b.name] = b.quaternion.clone().multiply(rot);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Materials (shared between soldiers with the same colours)
// ---------------------------------------------------------------------------

const materials = new Map();

function material(key, make) {
  let m = materials.get(key);
  if (!m) {
    m = make();
    materials.set(key, m);
  }
  return m;
}

const METALS = {
  mail: { color: '#7d848c', roughness: 0.5, metalness: 0.85 },
  lamellar: { color: '#6f757a', roughness: 0.42, metalness: 0.85 },
  plate: { color: '#aab2ba', roughness: 0.28, metalness: 0.95 },
};
const CLOTH = { padded: '#cdbf9a', leather: '#6f4c2e' };

function clothMat(color, roughness = 0.9) {
  return material(`cloth:${color}:${roughness}`, () => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 }));
}

function metalMat(kind) {
  const p = METALS[kind];
  return material(`metal:${kind}`, () => new THREE.MeshStandardMaterial({ color: p.color, roughness: p.roughness, metalness: p.metalness }));
}

function skinMat(color) {
  return material(`skin:${color}`, () => new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness: 0, vertexColors: true }));
}

// Hair and beards: vertex alpha says how far from the edge of the shell a
// point is; the shader frays the outline with noise and adds strand shading.
function hairMat(color) {
  return material(`hair:${color}`, () => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, vertexColors: true });
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vHairPos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHairPos = position;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vHairPos;
          float hairHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          float hn = hairHash(floor(vHairPos * 420.0));
          if (vColor.a < hn * 0.95 + 0.03) discard;
          float strand = hairHash(floor(vHairPos * vec3(900.0, 260.0, 900.0)));
          diffuseColor.rgb *= 0.78 + 0.4 * strand;
          diffuseColor.a = 1.0;`);
    };
    m.customProgramCacheKey = () => 'hair';
    return m;
  });
}

const EYE_MAT = () => material('eye', () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.12, metalness: 0, vertexColors: true }));

function partMaterial(part, spec) {
  const look = spec.look || 'cloth';
  switch (part) {
    case 'Body':
      return skinMat(spec.skin);
    case 'Hair':
    case 'Beard':
      return hairMat(spec.hair);
    case 'EyeL':
    case 'EyeR':
      return EYE_MAT();
    case 'Shirt':
      if (METALS[look]) return metalMat(look);
      return clothMat(CLOTH[look] || spec.team, look === 'leather' ? 0.7 : 0.92);
    case 'Skirt':
      if (look === 'padded') return clothMat(CLOTH.padded);
      return clothMat(spec.team);
    case 'Hose':
      return look === 'plate' ? metalMat('plate') : look === 'mail' ? metalMat('mail') : clothMat(spec.pants);
    case 'Boots':
      return look === 'plate' ? metalMat('plate') : clothMat('#3b2819', 0.65);
    case 'Belt':
      return clothMat('#4a2f1b', 0.55);
    default:
      return clothMat('#888888');
  }
}

// ---------------------------------------------------------------------------
// One soldier
// ---------------------------------------------------------------------------

const LOCO = ['idle', 'walk', 'run', 'walk_back'];
const LOD_DIST = 17;

export class SkinnedHuman {
  constructor(spec) {
    const t = state.t;
    this.t = t;
    this.spec = spec;
    this.object = cloneSkinned(t.scene);
    this.bones = {};
    this.lod = [[], []];
    this.object.traverse((o) => {
      if (o.isBone) this.bones[o.name] = o;
      if (o.isSkinnedMesh) {
        const far = o.name.endsWith('_LOD1');
        const part = o.name.replace(/_LOD1$/, '');
        o.material = partMaterial(part, spec);
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = false;
        if (part === 'Beard' && !spec.beard) o.visible = false;
        o.userData.part = part;
        if (!o.visible) return;
        // eyes and the belt are not worth a far model
        const hasFar = part !== 'Belt';
        this.lod[far ? 1 : 0].push(o);
        if (!hasFar) this.lod[1].push(o);
      }
    });
    this.lodLevel = -1;
    this.setLod(0);
    this.mixer = new THREE.AnimationMixer(this.object);
    this.actions = {};
    for (const k of LOCO) {
      const c = t.clips[k];
      if (!c) continue;
      const a = this.mixer.clipAction(c.clip);
      a.play();
      a.setEffectiveWeight(k === 'idle' ? 1 : 0);
      this.actions[k] = { action: a, clip: c, weight: k === 'idle' ? 1 : 0 };
    }
    this.phase = Math.random();
    this.idleTime = Math.random() * (t.clips.idle ? t.clips.idle.dur : 1);
    this.hipYaw = 0;
    // grips: where a held item sits in each hand
    this.grip = {};
    for (const s of ['l', 'r']) {
      const g = new THREE.Object3D();
      g.position.copy(t.hands[s].grip);
      g.quaternion.copy(t.hands[s].gripQ);
      this.bones[`hand_${s}`].add(g);
      this.grip[s] = g;
    }
    this.handPose = { l: 'relaxed', r: 'relaxed' };
    this.addHelmet(spec);
  }

  setLod(level) {
    if (level === this.lodLevel) return;
    this.lodLevel = level;
    for (const o of this.lod[0]) o.visible = false;
    for (const o of this.lod[1]) o.visible = false;
    for (const o of this.lod[level]) o.visible = true;
  }

  addHelmet(spec) {
    const geo = helmetGeo(spec.helmet, spec.team);
    if (!geo) return;
    const fit = this.t.fit;
    const m = vcMesh(geo);
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
    this.helmet = m;
    // hoods and closed helmets hide the hair
    if (spec.helmet) {
      this.object.traverse((o) => {
        if (o.isSkinnedMesh && o.userData.part === 'Hair') o.visible = false;
      });
      this.lod = this.lod.map((l) => l.filter((o) => o.userData.part !== 'Hair'));
    }
  }

  // Move the pose rig's shoulders and hands to where this body's are, so that
  // the targets it produces are within reach.
  fitDriver(rig) {
    const t = this.t;
    const hipY = rig.hips.position.y;
    rig.armR.position.set(t.shoulder.r.x, t.shoulder.r.y - hipY, t.shoulder.r.z);
    rig.armL.position.set(t.shoulder.l.x, t.shoulder.l.y - hipY, t.shoulder.l.z);
    rig.handR.position.y = -t.reach * 0.96;
    rig.handL.position.y = -t.reach * 0.96;
  }

  attach(obj, side) {
    this.grip[side].add(obj);
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, 0, 0);
  }

  // ---- per frame ----------------------------------------------------------------------

  update(agent, dt) {
    const r = agent.rig;
    const b = this.bones;
    const cam = agent.battle.camera;
    this.setLod(cam.position.distanceToSquared(agent.pos) < LOD_DIST * LOD_DIST ? 0 : 1);
    this.locomotion(agent, dt);
    r.root.updateMatrixWorld(true);
    const rootQ = r.root.getWorldQuaternion(U.rootQ);

    if (agent.horse && agent.alive) this.ride(rootQ);

    // hips turn towards the walking direction; the torso follows the aim
    if (Math.abs(this.hipYaw) > 1e-3) rotateWorld(b.pelvis, worldRot(rootQ, U.a.setFromAxisAngle(Y, this.hipYaw), U.inc));
    if (agent.alive) {
      const torsoQ = U.a.copy(r.torso.quaternion).premultiply(U.b.setFromAxisAngle(Y, -this.hipYaw));
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
      this.arms(agent, rootQ);
    }
    this.fingers();
  }

  locomotion(agent, dt) {
    const acts = this.actions;
    const t = this.t;
    let sp = 0;
    let rel = 0;
    if (agent.alive && !agent.horse) {
      sp = Math.hypot(agent.vel.x, agent.vel.z);
      rel = wrapAngle(Math.atan2(agent.vel.x, agent.vel.z) - agent.yaw);
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
    this.idleTime += dt;
    for (const [name, a] of Object.entries(acts)) {
      a.weight += (target[name] - a.weight) * k;
      a.action.setEffectiveWeight(a.weight);
      const c = a.clip;
      a.action.time = name === 'idle' ? this.idleTime % c.dur : ((this.phase + c.offset) % 1) * c.dur;
    }
    this.mixer.update(0);
  }

  ride(rootQ) {
    const b = this.bones;
    for (const s of ['l', 'r']) {
      const side = s === 'l' ? 1 : -1;
      const hip = b[`thigh_${s}`].getWorldPosition(U.v1);
      const foot = U.v2.set(side * 0.3, -0.78, 0.18).applyQuaternion(rootQ).add(hip);
      const pole = U.v3.set(side * 0.3, 0, 1).applyQuaternion(rootQ).add(hip);
      solveLimb(b[`thigh_${s}`], b[`calf_${s}`], b[`foot_${s}`], this.t.limbs[`leg_${s}`], foot, pole);
    }
  }

  arms(agent, rootQ) {
    const r = agent.rig;
    const w = agent.weapon;
    // right hand: the weapon grip of the pose rig
    const wristQ = r.wristR.getWorldQuaternion(A.wristQ);
    const wristP = r.wristR.getWorldPosition(A.wristP);
    this.placeHand('r', wristP, wristQ, rootQ);
    this.handPose.r = 'fist';
    // left hand
    const sh = agent.activeShield();
    if (w.cls === 'bow') {
      this.placeHand('l', r.handL.getWorldPosition(A.pos), r.handL.getWorldQuaternion(A.q), rootQ);
      this.handPose.l = 'fist';
    } else if (sh && agent.shieldMesh) {
      const grip = agent.shieldMesh.localToWorld(A.pos.set(0, 0, -0.05));
      // hold the shield's handle: knuckles along the shield's up axis
      const q = agent.shieldMesh.getWorldQuaternion(A.q).multiply(A.q2.setFromAxisAngle(X, -Math.PI / 2));
      this.placeHand('l', grip, q, rootQ);
      this.handPose.l = 'fist';
    } else if (w.lance && agent.horse) {
      // reins in the left hand
      this.placeHand('l', r.handL.getWorldPosition(A.pos), r.handL.getWorldQuaternion(A.q), rootQ);
      this.handPose.l = 'fist';
    } else if (w.twoHanded || w.cls === 'spear' || w.cls === 'crossbow') {
      const dir = A.dir.set(0, 0, 1).applyQuaternion(wristQ);
      const along = w.cls === 'spear' ? 0.42 : w.cls === 'crossbow' ? 0.34 : -0.13;
      this.placeHand('l', A.pos.copy(wristP).addScaledVector(dir, along), wristQ, rootQ);
      this.handPose.l = 'fist';
    } else {
      // a free hand hangs by the side when standing and swings with the
      // captured walk when moving
      const idleW = this.actions.idle ? this.actions.idle.weight : 0;
      if (idleW > 0.02) {
        const b = this.bones;
        const wrist = b.hand_l.getWorldPosition(A.pos);
        const shoulder = b.upperarm_l.getWorldPosition(A.dir);
        wrist.lerp(A.hang.set(0.08, -0.55, 0.035).applyQuaternion(rootQ).add(shoulder), idleW);
        const hangQ = this.handWorld('l', rootQ, A.q2);
        const q = worldQuat(b.hand_l, A.q).slerp(hangQ, idleW);
        this.placeWrist('l', wrist, q, rootQ);
      }
      this.handPose.l = 'relaxed';
    }
  }

  // World orientation of hand `s` holding an item whose frame is `q` (item
  // along +Z, the arm along -Y).
  handWorld(s, q, out) {
    const hand = this.t.hands[s];
    const len = H.len.set(0, -1, 0).applyQuaternion(q);
    const knuck = H.knuck.set(0, 0, 1).applyQuaternion(q);
    const palm = s === 'r' ? H.palm.crossVectors(knuck, len) : H.palm.crossVectors(len, knuck);
    H.m.makeBasis(len, knuck, palm);
    return out.setFromRotationMatrix(H.m).multiply(H.inv.copy(hand.basisQ).invert());
  }

  placeWrist(s, wrist, handWorldQ, rootQ) {
    const b = this.bones;
    const side = s === 'l' ? 1 : -1;
    const shoulder = b[`upperarm_${s}`].getWorldPosition(H.shoulder);
    const pole = H.pole.set(side * 0.55, -0.55, -0.45).applyQuaternion(rootQ).add(shoulder);
    solveLimb(b[`upperarm_${s}`], b[`lowerarm_${s}`], b[`hand_${s}`], this.t.limbs[`arm_${s}`], wrist, pole);
    setWorldQuat(b[`hand_${s}`], handWorldQ);
  }

  // Put hand `s` so that its grip sits at `pos` with the held item oriented
  // like the pose rig's `q` (item along +Z, the arm along -Y).
  placeHand(s, pos, q, rootQ) {
    const handWorld = this.handWorld(s, q, H.q);
    // wrist position = grip minus the grip offset
    const wrist = H.wrist.copy(this.t.hands[s].grip).applyQuaternion(handWorld);
    wrist.subVectors(pos, wrist);
    this.placeWrist(s, wrist, handWorld, rootQ);
  }

  fingers() {
    const b = this.bones;
    for (const s of ['l', 'r']) {
      const pose = this.t.hands[s][this.handPose[s]];
      for (const name in pose) b[name].quaternion.copy(pose[name]);
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
const U = scratch(['v1', 'v2', 'v3'], ['rootQ', 'a', 'b', 'c', 'd', 'inc']);
const A = scratch(['wristP', 'pos', 'dir', 'hang'], ['wristQ', 'q', 'q2']);
const H = scratch(['len', 'knuck', 'palm', 'wrist', 'shoulder', 'pole'], ['q', 'inv'], { m: new THREE.Matrix4() });
const WR = scratch([], ['inv']);
const WQ = scratch(['p', 's'], []);
const RW = scratch([], ['p', 'inv']);
const SQ = scratch([], ['p']);
const AI = scratch(['from', 'pos', 'to'], ['q', 'r']);
const SL = scratch(['S', 'dir', 'p', 'E', 'T', 'n', 'h', 'axis', 'tmp'], ['q', 'r']);

// a rotation given in the frame `frameQ` (e.g. the soldier's root) as a world rotation
function worldRot(frameQ, local, out) {
  return out.copy(frameQ).multiply(local).multiply(WR.inv.copy(frameQ).invert());
}

function worldQuat(o, out) {
  o.matrixWorld.decompose(WQ.p, out, WQ.s);
  return out;
}

// rotate a bone by the world rotation R about its own pivot
function rotateWorld(bone, R) {
  worldQuat(bone.parent, RW.p);
  // local' = P^-1 * R * P * local
  RW.inv.copy(RW.p).invert();
  bone.quaternion.premultiply(RW.p).premultiply(R).premultiply(RW.inv);
  bone.updateMatrixWorld(true);
}

function setWorldQuat(bone, q) {
  worldQuat(bone.parent, SQ.p);
  bone.quaternion.copy(SQ.p.invert()).multiply(q);
  bone.updateMatrixWorld(true);
}

// rotate `bone` (minimally) so that its local direction `localDir` points at `target`
function aim(bone, localDir, target) {
  const q = worldQuat(bone, AI.q);
  const from = AI.from.copy(localDir).applyQuaternion(q).normalize();
  const pos = bone.getWorldPosition(AI.pos);
  const to = AI.to.subVectors(target, pos).normalize();
  rotateWorld(bone, AI.r.setFromUnitVectors(from, to));
}

// Two-bone IK: put the end of the limb at `target`, bending in the plane that
// contains `pole` and keeping the middle joint a hinge.
function solveLimb(upper, lower, end, info, target, pole) {
  const S = upper.getWorldPosition(SL.S);
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
