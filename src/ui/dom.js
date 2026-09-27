// Minimal DOM helpers and the window/menu system.

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k in el && k !== 'list') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
}

export function btn(label, onClick, cls = '', opts = {}) {
  return h('button', { class: `btn ${cls}`, onclick: onClick, disabled: opts.disabled, title: opts.title }, label);
}

export function factionDot(color) {
  return h('span', { class: 'faction-dot', style: { background: color } });
}

export function bar(frac, cls = '') {
  return h('div', { class: `bar ${cls}` }, h('div', { style: { width: `${Math.max(0, Math.min(1, frac)) * 100}%` } }));
}

// A stack of modal windows living inside #ui-root.
export class WindowManager {
  constructor(root) {
    this.root = root;
    this.stack = [];
  }

  get open() {
    return this.stack.length > 0;
  }

  // opts: { title, body (Node), footer (Node[]), cls, onClose, closable }
  show(opts) {
    const layer = h('div', { class: 'modal-layer' });
    const win = h('div', { class: `window ${opts.cls || ''}` });
    const closable = opts.closable !== false;
    const title = h('div', { class: 'window-title' }, opts.title || '', h('span', { class: 'spacer' }), closable ? h('button', { class: 'window-close', onclick: () => this.close(entry), title: 'Закрити (Esc)' }, '×') : null);
    const body = h('div', { class: 'window-body' });
    win.append(title, body);
    const footer = h('div', { class: 'window-footer' });
    win.append(footer);
    layer.append(win);
    this.root.append(layer);
    const entry = { layer, win, body, footer, title, opts, closable };
    this.stack.push(entry);
    this.fill(entry, opts);
    return entry;
  }

  fill(entry, opts) {
    entry.body.innerHTML = '';
    entry.footer.innerHTML = '';
    if (opts.body) entry.body.append(opts.body);
    if (opts.footer && opts.footer.length) {
      entry.footer.style.display = '';
      entry.footer.append(...opts.footer.filter(Boolean));
    } else entry.footer.style.display = 'none';
  }

  // Re-render window contents in place (keeps scroll position).
  update(entry, opts) {
    const scroll = entry.body.scrollTop;
    Object.assign(entry.opts, opts);
    if (opts.title != null) entry.title.firstChild.textContent = opts.title;
    this.fill(entry, entry.opts);
    entry.body.scrollTop = scroll;
  }

  close(entry) {
    if (!entry) entry = this.stack[this.stack.length - 1];
    if (!entry) return;
    const i = this.stack.indexOf(entry);
    if (i < 0) return;
    this.stack.splice(i, 1);
    entry.layer.remove();
    if (entry.opts.onClose) entry.opts.onClose();
  }

  closeTop() {
    const top = this.stack[this.stack.length - 1];
    if (top && top.closable) {
      this.close(top);
      return true;
    }
    return false;
  }

  closeAll() {
    while (this.stack.length) {
      const e = this.stack.pop();
      e.layer.remove();
    }
  }
}

// Mount & Blade style game menu: text on the left, options on the right.
export function gameMenu({ text, scene, options }) {
  const opts = h('div', { class: 'options' });
  for (const o of options) {
    if (!o) continue;
    const b = h('button', { class: `btn opt ${o.cls || ''}`, disabled: o.disabled, title: o.title || '', onclick: o.onClick }, o.label, o.hint ? h('span', { class: 'hint' }, o.hint) : null);
    opts.append(b);
  }
  const left = h('div', null, scene || null, h('div', { class: 'text' }, text));
  return h('div', { class: 'gmenu' }, left, opts);
}
