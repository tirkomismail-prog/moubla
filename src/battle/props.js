// Items that soldiers carry (weapons, shields, helmets, bows on the back),
// drawn with instancing: one draw call per item model instead of one per
// item. Each item is an invisible holder in its soldier's rig, so it moves
// with the hand, head or back as before; before the frame is rendered the
// holders' world matrices are copied into the instances.
//
// Every model has two instanced meshes: items near the camera cast shadows,
// far ones do not (like the far soldiers' bodies), and far items outside the
// view are skipped.
import * as THREE from 'three';
import { material } from './models.js';

const SHADOW_DIST = 45;
const ITEM_RADIUS = 1.5;

const _frustum = new THREE.Frustum();
const _m = new THREE.Matrix4();
const _sphere = new THREE.Sphere();

export class Props {
  constructor(scene) {
    this.scene = scene;
    this.models = new Map();
  }

  // A holder standing in for a mesh of `geo` (drawn with `mat`, by default
  // the shared vertex-colour material); place it in the rig.
  add(geo, mat = null) {
    let model = this.models.get(geo);
    if (!model) {
      model = { geo, mat, holders: [], near: null, far: null };
      this.models.set(geo, model);
    }
    const holder = new THREE.Object3D();
    holder.userData.prop = model;
    model.holders.push(holder);
    return holder;
  }

  remove(holder) {
    if (holder.parent) holder.parent.remove(holder);
    const model = holder.userData.prop;
    if (!model) return;
    const i = model.holders.indexOf(holder);
    if (i >= 0) {
      model.holders[i] = model.holders[model.holders.length - 1];
      model.holders.pop();
    }
    holder.userData.prop = null;
  }

  mesh(model, shadow) {
    const key = shadow ? 'near' : 'far';
    let m = model[key];
    if (m && m.instanceMatrix.count >= model.holders.length) return m;
    // grow to the next power of two
    let size = 8;
    while (size < model.holders.length) size *= 2;
    if (m) {
      this.scene.remove(m);
      m.dispose();
    }
    m = new THREE.InstancedMesh(model.geo, model.mat || material(), size);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.frustumCulled = false;
    m.castShadow = shadow;
    m.receiveShadow = true;
    m.matrixAutoUpdate = false;
    this.scene.add(m);
    model[key] = m;
    return m;
  }

  // Call after the scene's world matrices are up to date.
  sync(camera) {
    _frustum.setFromProjectionMatrix(_m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    const cam = camera.position;
    const d2 = SHADOW_DIST * SHADOW_DIST;
    for (const model of this.models.values()) {
      const near = this.mesh(model, true);
      const far = this.mesh(model, false);
      let n = 0;
      let f = 0;
      for (const h of model.holders) {
        const e = h.matrixWorld.elements;
        _sphere.center.set(e[12], e[13], e[14]);
        if (_sphere.center.distanceToSquared(cam) < d2) near.instanceMatrix.array.set(e, 16 * n++);
        else {
          _sphere.radius = ITEM_RADIUS;
          if (_frustum.intersectsSphere(_sphere)) far.instanceMatrix.array.set(e, 16 * f++);
        }
      }
      near.count = n;
      far.count = f;
      near.visible = n > 0;
      far.visible = f > 0;
      near.instanceMatrix.needsUpdate = n > 0;
      far.instanceMatrix.needsUpdate = f > 0;
    }
  }

  dispose() {
    for (const model of this.models.values()) {
      for (const m of [model.near, model.far]) if (m) m.dispose();
    }
    this.models.clear();
  }
}
