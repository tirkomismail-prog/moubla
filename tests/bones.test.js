// The soldiers' and horses' bones turn without three.js working out their
// Euler angles anew at each turn (partmat.js ownSpaceSkeleton): the angles
// never feed back into the quaternions, so the bones' matrices are the
// same, bit for bit. A small skinned chain posed twice alike, with the
// angles kept in step and without.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { mulberry32 } from '../src/core/rng.js';
import { ownSpaceSkeleton } from '../src/battle/partmat.js';

// a chain of five bones under a model's root, skinning a mesh of a few
// vertices; with `sync`, the bones' angles follow their quaternions again
// (three.js's own Object3D callback)
function chain(sync) {
  const bones = [];
  for (let i = 0; i < 5; i++) {
    const b = new THREE.Bone();
    b.name = `b${i}`;
    b.position.set(0.1 * i, i ? 0.3 : 1, 0.02 * i);
    if (i) bones[i - 1].add(b);
    bones.push(b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0, 0, 2, 0], 3));
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute([0, 1, 0, 0, 2, 3, 0, 0, 4, 3, 0, 0], 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute([0.5, 0.5, 0, 0, 0.7, 0.3, 0, 0, 0.6, 0.4, 0, 0], 4));
  const mesh = new THREE.SkinnedMesh(geo, new THREE.MeshBasicMaterial());
  const object = new THREE.Group();
  object.position.set(3, 0, -2);
  object.add(mesh);
  mesh.add(bones[0]);
  mesh.bind(new THREE.Skeleton(bones));
  const space = ownSpaceSkeleton(object, [mesh]);
  if (sync) for (const b of bones) b.quaternion._onChange(() => b.rotation.setFromQuaternion(b.quaternion, undefined, false));
  return { bones, space, skeleton: mesh.skeleton };
}

// a clip that turns every bone and moves the first (the mixer sets the
// quaternions through its property bindings, as the soldiers' clips do)
function clip(random) {
  const times = [0, 0.4, 0.9, 1.5];
  const q = new THREE.Quaternion();
  const tracks = [];
  for (let i = 0; i < 5; i++) {
    const values = [];
    for (const t of times) values.push(...q.setFromEuler(new THREE.Euler(random() - 0.5, random() * 2 - 1, t * random())).toArray());
    tracks.push(new THREE.QuaternionKeyframeTrack(`b${i}.quaternion`, times, values));
  }
  tracks.push(new THREE.VectorKeyframeTrack('b0.position', times, times.flatMap((t) => [0.1 * t, 1 - 0.2 * t, random() * 0.1])));
  return new THREE.AnimationClip('walk', -1, tracks);
}

// a frame: the clip, then turns on top as the pose and the falls make them
// (slerp, multiply, premultiply, copy, from unit vectors, axis and angle)
function pose(c, mixer, random, dt) {
  mixer.update(dt);
  const [b0, b1, b2, b3, b4] = c.bones;
  const t = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(random(), random(), random()).normalize(), random() * 3);
  b1.quaternion.slerp(t, random());
  b2.quaternion.multiply(t);
  b3.quaternion.premultiply(t.clone().invert());
  b4.quaternion.copy(b2.quaternion);
  b0.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(random() - 0.5, 1, random() - 0.5).normalize());
  b2.rotateOnAxis(new THREE.Vector3(1, 0, 0), random() - 0.5);
  c.space.updateMatrixWorld(true);
  c.skeleton.posed = true;
  c.skeleton.update();
}

test('bones turn without their Euler angles: the same matrices, bit for bit', () => {
  const kept = chain(true);
  const off = chain(false);
  const ra = mulberry32(7);
  const rb = mulberry32(7);
  const mixers = [new THREE.AnimationMixer(kept.space), new THREE.AnimationMixer(off.space)];
  mixers[0].clipAction(clip(ra)).play();
  mixers[1].clipAction(clip(rb)).play();
  const e = new THREE.Euler();
  let stale = 0;
  for (let f = 0; f < 120; f++) {
    pose(kept, mixers[0], ra, 1 / 30);
    pose(off, mixers[1], rb, 1 / 30);
    for (let i = 0; i < 5; i++) {
      const [a, b] = [kept.bones[i], off.bones[i]];
      assert.deepEqual(b.quaternion.toArray(), a.quaternion.toArray());
      assert.deepEqual(Array.from(b.matrixWorld.elements), Array.from(a.matrixWorld.elements));
      // the angles kept in step with the sync, not without it
      e.setFromQuaternion(a.quaternion, a.rotation.order, false);
      assert.ok(e.equals(a.rotation));
      e.setFromQuaternion(b.quaternion, b.rotation.order, false);
      if (!e.equals(b.rotation)) stale++;
    }
    assert.deepEqual(Array.from(off.skeleton.boneMatrices), Array.from(kept.skeleton.boneMatrices));
  }
  // (the switch was on: the angles of the bones without it went stale)
  assert.ok(stale > 500, `stale ${stale}`);
});
