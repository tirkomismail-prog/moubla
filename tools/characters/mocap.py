"""Motion capture clips for the soldier.

CMU Graphics Lab motion capture database (mocap.cs.cmu.edu, free for research
and commercial use), in the MotionBuilder-friendly BVH conversion by Bruce
Hahne. Each clip is retargeted onto the MakeHuman game_engine rig by copying
world-space bone rotations (relative to each skeleton's rest pose), then
trimmed to a seamless cycle and made to play in place: the game moves the
character itself and scales the playback speed to the walking speed.
"""
import math
import os

import bpy
from mathutils import Matrix, Quaternion, Vector

# game_engine bone -> CMU bone
MAP = {
    'pelvis': 'Hips', 'spine_01': 'LowerBack', 'spine_02': 'Spine', 'spine_03': 'Spine1',
    'neck_01': 'Neck', 'head': 'Head',
    'clavicle_l': 'LeftShoulder', 'upperarm_l': 'LeftArm', 'lowerarm_l': 'LeftForeArm', 'hand_l': 'LeftHand',
    'clavicle_r': 'RightShoulder', 'upperarm_r': 'RightArm', 'lowerarm_r': 'RightForeArm', 'hand_r': 'RightHand',
    'thigh_l': 'LeftUpLeg', 'calf_l': 'LeftLeg', 'foot_l': 'LeftFoot', 'ball_l': 'LeftToeBase',
    'thigh_r': 'RightUpLeg', 'calf_r': 'RightLeg', 'foot_r': 'RightFoot', 'ball_r': 'RightToeBase',
}
LOOP_BONES = ['pelvis', 'thigh_l', 'calf_l', 'foot_l', 'thigh_r', 'calf_r', 'foot_r', 'upperarm_l', 'upperarm_r']

# name, file, travel direction in the character's frame (None: standing),
# cycle length range in seconds (None: fixed segment start/length)
CLIPS = [
    ('idle', '111/111_28.bvh', None, (1.0, 5.0)),
    ('walk', '007/07_01.bvh', 'fwd', (0.8, 1.5)),
    ('run', '009/09_01.bvh', 'fwd', (0.45, 0.95)),
    ('walk_back', '111/111_01.bvh', 'back', (0.8, 1.7)),
]
FPS = 30


def import_bvh(path):
    before = set(bpy.data.objects)
    bpy.ops.import_anim.bvh(filepath=path, global_scale=1.0, frame_start=1, use_fps_scale=False,
                            update_scene_fps=False, update_scene_duration=False, rotate_mode='NATIVE',
                            axis_forward='-Z', axis_up='Y')
    src = next(o for o in bpy.data.objects if o not in before and o.type == 'ARMATURE')
    act = src.animation_data.action
    start, end = [int(x) for x in act.frame_range]
    return src, start, end


# bones whose tail does not point where the limb goes: aim at this child instead
AIM_CHILD = {'LeftHand': 'LeftFingerBase', 'RightHand': 'RightFingerBase',
             'hand_l': 'middle_01_l', 'hand_r': 'middle_01_r'}


def rest_dir(arm, name):
    b = arm.data.bones[name]
    child = AIM_CHILD.get(name)
    tip = arm.data.bones[child].head_local if child and child in arm.data.bones else b.tail_local
    return (arm.matrix_world.to_3x3() @ (tip - b.head_local)).normalized()


def world_rest_q(arm, name):
    return (arm.matrix_world @ arm.data.bones[name].matrix_local).to_quaternion()


def horizontal(v):
    return Vector((v.x, v.y, 0.0)).normalized()


def yaw_quat(angle):
    return Quaternion((0.0, 0.0, 1.0), angle)


def leg_length(arm, thigh, calf):
    b = arm.data.bones
    return b[thigh].length + b[calf].length


def sample_source(src, start, end, step):
    """World rotations and hips positions of the source skeleton per sample."""
    scene = bpy.context.scene
    frames = []
    for f in range(start + 1, end + 1, step):  # frame `start` is the T-pose
        scene.frame_set(f)
        rots = {}
        for name in set(MAP.values()):
            pb = src.pose.bones[name]
            rots[name] = (src.matrix_world @ pb.matrix).to_quaternion()
        hips = (src.matrix_world @ src.pose.bones['Hips'].matrix).translation.copy()
        frames.append((rots, hips))
    return frames


def retarget(rig, src, start, end):
    step = max(1, round(120 / FPS))
    frames = sample_source(src, start, end, step)
    # face the source the same way as the target (both +Z up after import)
    fwd_src = horizontal(src.data.bones['LeftToeBase'].head_local - src.data.bones['LeftFoot'].head_local)
    fwd_src = horizontal(src.matrix_world.to_3x3() @ fwd_src)
    fwd_tgt = horizontal(rig.data.bones['ball_l'].head_local - rig.data.bones['foot_l'].head_local)
    g = yaw_quat(math.atan2(fwd_tgt.y, fwd_tgt.x) - math.atan2(fwd_src.y, fwd_src.x))
    scale = leg_length(rig, 'thigh_l', 'calf_l') / (src.data.bones['LeftUpLeg'].length + src.data.bones['LeftLeg'].length)
    s_rest = {n: world_rest_q(src, n) for n in set(MAP.values())}
    t_rest = {n: world_rest_q(rig, n) for n in MAP}
    align = {}
    for t, s in MAP.items():
        if t == 'pelvis':
            align[t] = Quaternion()
        else:
            align[t] = rest_dir(rig, t).rotation_difference(g @ rest_dir(src, s))
    # the hips' height in the T-pose of the first frame is the standing height
    bpy.context.scene.frame_set(start)
    hips_rest = (src.matrix_world @ src.pose.bones['Hips'].matrix).translation.copy()
    pelvis_rest = (rig.matrix_world @ rig.data.bones['pelvis'].matrix_local).translation
    out = []
    for rots, hips in frames:
        world = {}
        for t, s in MAP.items():
            d = g @ rots[s] @ s_rest[s].inverted() @ g.inverted()
            world[t] = d @ align[t] @ t_rest[t]
        pos = pelvis_rest + (g @ (hips - hips_rest)) * scale
        out.append((world, pos))
    return out


def pose_error(a, b):
    err = 0.0
    for n in LOOP_BONES:
        err += 1.0 - abs(a[0][n].dot(b[0][n]))
    return err + abs(a[1].z - b[1].z) * 2


def find_cycle(frames, lo, hi):
    best = None
    n = len(frames)
    lo_f, hi_f = int(lo * FPS), int(hi * FPS)
    for a in range(int(0.25 * n), n):
        for b in range(a + lo_f, min(n, a + hi_f + 1)):
            e = pose_error(frames[a], frames[b])
            if best is None or e < best[0]:
                best = (e, a, b)
    return best


def make_cycle(frames, a, b, travel, rest, pelvis_rest_q):
    """Frames a..b as a seamless in-place loop; returns (frames, speed)."""
    seg = [(dict(w), p.copy()) for w, p in frames[a:b + 1]]
    d = seg[-1][1] - seg[0][1]
    dist = math.hypot(d.x, d.y)
    dur = (b - a) / FPS
    if travel:
        want = {'fwd': Vector((0, -1, 0)), 'back': Vector((0, 1, 0)), 'left': Vector((1, 0, 0)), 'right': Vector((-1, 0, 0))}[travel]
        # turn the whole clip so that it travels exactly along `want`
        rot = yaw_quat(math.atan2(want.y, want.x) - math.atan2(d.y, d.x))
    else:
        # standing: face forward (the pelvis' average heading)
        fwd = Vector()
        for w, _ in seg:
            f = (w['pelvis'] @ pelvis_rest_q.inverted()) @ Vector((0, -1, 0))
            fwd += Vector((f.x, f.y, 0))
        rot = yaw_quat(math.atan2(-1, 0) - math.atan2(fwd.y, fwd.x))
    p0 = seg[0][1].copy()
    res = []
    for i, (w, p) in enumerate(seg):
        t = i / (len(seg) - 1)
        lin = p0 + d * t
        rel = p - lin
        rel = rot @ Vector((rel.x, rel.y, 0.0))
        pos = Vector((rest.x, rest.y, p.z)) + rel
        w = dict(w)
        for n in w:
            w[n] = rot @ w[n]
        res.append((w, pos))
    # spread the small mismatch between the last and the first frame over the
    # end of the clip so that the loop is seamless
    m = len(res) - 1
    nb = max(2, m // 4)
    fix = {n: res[0][0][n] @ res[m][0][n].inverted() for n in res[0][0]}
    fixp = res[0][1] - res[m][1]
    for k in range(nb + 1):
        i = m - k
        wgt = 1 - k / nb
        w, p = res[i]
        for n in w:
            w[n] = Quaternion().slerp(fix[n], wgt) @ w[n]
        res[i] = (w, p + fixp * wgt)
    return res, (dist / dur if travel else 0.0)


def key_clip(rig, name, frames):
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    rig.animation_data_create()
    rig.animation_data.action = act
    bones = rig.data.bones
    for pb in rig.pose.bones:
        pb.rotation_mode = 'QUATERNION'
    order = [n for n in MAP]  # parents come before children in MAP
    prev = {}
    for i, (world, pos) in enumerate(frames):
        mats = {'Root': bones['Root'].matrix_local.copy()}
        for n in order:
            b = bones[n]
            parent = b.parent.name
            pm = mats[parent] if parent in mats else rig.pose.bones[parent].matrix.copy()
            rel = b.parent.matrix_local.inverted() @ b.matrix_local
            base = pm @ rel
            q = base.to_quaternion().inverted() @ world[n]
            q.normalize()
            if n in prev and prev[n].dot(q) < 0:
                q.negate()
            prev[n] = q
            pb = rig.pose.bones[n]
            pb.rotation_quaternion = q
            pb.keyframe_insert('rotation_quaternion', frame=i + 1, group=n)
            loc = Vector()
            if n == 'pelvis':
                loc = base.inverted() @ pos
                pb.location = loc
                pb.keyframe_insert('location', frame=i + 1, group=n)
            mats[n] = base @ Matrix.Translation(loc) @ q.to_matrix().to_4x4()
    for pb in rig.pose.bones:
        pb.rotation_quaternion = Quaternion()
        pb.location = Vector()
    rig.animation_data.action = None
    return act


def add_clips(rig, bvh_dir):
    bpy.context.scene.render.fps = FPS
    for name, rel, travel, rng in CLIPS:
        path = os.path.join(bvh_dir, rel)
        if not os.path.exists(path):
            print('mocap: missing', path)
            continue
        src, start, end = import_bvh(path)
        frames = retarget(rig, src, start, end)
        err, a, b = find_cycle(frames, *rng)
        rest = rig.data.bones['pelvis'].head_local
        cyc, speed = make_cycle(frames, a, b, travel, rest, world_rest_q(rig, 'pelvis'))
        act = key_clip(rig, f'{name}|{speed:.3f}', cyc)
        print(f'mocap: {name:10s} frames {a}-{b} ({(b - a) / FPS:.2f}s) err {err:.3f} speed {speed:.2f} m/s -> {act.name}')
        src_action = src.animation_data.action
        bpy.data.objects.remove(src)
        bpy.data.actions.remove(src_action)
