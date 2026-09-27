// Battle input: pointer lock, mouse-driven attack directions, keys.

export class BattleInput {
  constructor(battle, canvas) {
    this.battle = battle;
    this.canvas = canvas;
    this.keys = new Set();
    this.lmb = false;
    this.rmb = false;
    this.accX = 0;
    this.accY = 0;
    this.attackDir = 'right';
    this.blockDir = 'up';
    this.selected = new Set(['inf', 'arch', 'cav']);
    this.locked = false;
    this.handlers = [];
    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts);
      this.handlers.push([target, ev, fn, opts]);
    };
    on(canvas, 'click', () => this.lock());
    on(document, 'pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      if (!this.locked) {
        this.releaseButtons();
        battle.onUnlock();
      } else battle.onLock();
    });
    on(document, 'mousemove', (e) => {
      if (!this.locked) return;
      const s = battle.settings.sensitivity || 1;
      const dx = e.movementX || 0;
      const dy = e.movementY || 0;
      battle.camYaw -= dx * 0.0024 * s;
      battle.camPitch += (battle.settings.invertY ? dy : -dy) * 0.0024 * s;
      battle.camPitch = Math.max(-1.0, Math.min(1.15, battle.camPitch));
      this.accX += dx;
      this.accY += dy;
      this.updateDir();
    });
    on(document, 'mousedown', (e) => {
      if (!this.locked) return;
      if (e.button === 0) {
        this.lmb = true;
        battle.playerAttackPress();
      } else if (e.button === 2) {
        this.rmb = true;
        battle.playerBlockPress();
      }
    });
    on(document, 'mouseup', (e) => {
      if (e.button === 0 && this.lmb) {
        this.lmb = false;
        battle.playerAttackRelease();
      } else if (e.button === 2 && this.rmb) {
        this.rmb = false;
        battle.playerBlockRelease();
      }
    });
    on(document, 'contextmenu', (e) => e.preventDefault());
    on(window, 'wheel', (e) => {
      if (!this.locked) return;
      battle.playerNextWeapon(e.deltaY > 0 ? 1 : -1);
    }, { passive: true });
    on(window, 'keydown', (e) => {
      if (e.code === 'Tab' || e.code === 'F1' || e.code === 'F2' || e.code === 'F3') e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      battle.onKey(e.code);
    });
    on(window, 'keyup', (e) => this.keys.delete(e.code));
    on(window, 'blur', () => {
      this.keys.clear();
      this.releaseButtons();
    });
  }

  releaseButtons() {
    if (this.lmb) this.battle.playerAttackRelease();
    if (this.rmb) this.battle.playerBlockRelease();
    this.lmb = false;
    this.rmb = false;
  }

  lock() {
    if (this.locked) return;
    try {
      const r = this.canvas.requestPointerLock();
      if (r && r.catch) r.catch(() => {});
    } catch {
      /* ignore */
    }
  }

  unlock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  updateDir() {
    const ax = this.accX;
    const ay = this.accY;
    if (Math.hypot(ax, ay) < 4) return;
    if (Math.abs(ax) > Math.abs(ay)) {
      this.attackDir = ax > 0 ? 'right' : 'left';
      this.blockDir = ax > 0 ? 'right' : 'left';
    } else {
      this.attackDir = ay < 0 ? 'overhead' : 'thrust';
      this.blockDir = ay < 0 ? 'up' : 'down';
    }
  }

  decay(dt) {
    const k = Math.exp(-dt * 12);
    this.accX *= k;
    this.accY *= k;
  }

  down(code) {
    return this.keys.has(code);
  }

  dispose() {
    for (const [t, ev, fn, opts] of this.handlers) t.removeEventListener(ev, fn, opts);
    this.unlock();
  }
}
