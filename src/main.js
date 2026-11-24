const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Footer year
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* =============================================================
   HERO ENTRANCE (~1.5s total)
   1. ANGELA's letters rise in (each letter is wrapped in a span here)
   2. the dusty rose "Hi, I’m" writes in (CSS mask wipe, starts at 0.45s)
   3. lines marked [data-rise] fade up one after another
   ============================================================= */
const name = document.querySelector('[data-split]');
if (!reduceMotion) {
  const text = name.textContent;
  name.textContent = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.style.setProperty('--i', i);
    span.textContent = char;
    name.append(span);
  });
}
// stagger the supporting pieces after the name + script
document.querySelectorAll('.hero [data-rise]').forEach((el, i) => {
  el.style.setProperty('--d', `${0.55 + i * 0.12}s`);
});
// start once the fonts are ready, so nothing animates in a fallback font
const start = () => document.querySelector('.hero').classList.add('is-ready');
Promise.race([
  Promise.all([document.fonts.load('1em Anton'), document.fonts.load('1em "Mrs Saint Delafield"')]),
  new Promise((r) => setTimeout(r, 1200)),
]).then(start, start);

/* =============================================================
   SCROLL REVEALS
   [data-reveal] gets .is-in once it scrolls into view. CSS decides what that does:
   the work stickers get slapped on, script notes + arrows draw in, the sign-off signs itself.
   ============================================================= */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    target.classList.add('is-in');
    revealer.unobserve(target);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => revealer.observe(el));

/* =============================================================
   SKILLS TICKER: set its speed from its width (CSS does the drift)
   ============================================================= */
const SKILLS_SPEED = 34; // px per second
const skillsTrack = document.querySelector('.skills__track');
if (skillsTrack) skillsTrack.style.animationDuration = `${skillsTrack.scrollWidth / 2 / SKILLS_SPEED}s`;

// Can this device hover? Checked live (not just once at load), and every tap also records its pointer
// type, so touch taps work even on touch laptops or in the browser's device mode.
const hoverMQ = window.matchMedia('(hover: hover)');
let lastPointer = 'mouse';
document.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; }, true);
const isTouchTap = (e) => e.pointerType === 'touch' || (!e.pointerType && lastPointer === 'touch') || !hoverMQ.matches;

/* =============================================================
   WORK STICKERS: when to flip
   Desktop: the cursor has to rest in the MIDDLE of the photo (the center ~70%) for a
   moment before the sticker flips, so sweeping across the row doesn't flip everything.
   Once flipped it stays flipped anywhere on the sticker (so the link on the back is
   reachable) and flips back when the cursor leaves it.
   Touch screens: tap to flip, tap again to flip back. Tapping the link just opens it.
   ============================================================= */
const FLIP_DELAY_MS = 150;
const FLIP_ZONE = 0.7;   // the middle 70% of the photo, edges ignored

document.querySelectorAll('.sticker__card').forEach((card) => {
  let timer = null;
  const cancel = () => { clearTimeout(timer); timer = null; };
  card.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || card.classList.contains('is-flipped')) return;
    const r = card.getBoundingClientRect();
    const edge = (1 - FLIP_ZONE) / 2;
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    const inMiddle = fx > edge && fx < 1 - edge && fy > edge && fy < 1 - edge;
    if (!inMiddle) cancel();
    else if (!timer) timer = setTimeout(() => card.classList.add('is-flipped'), FLIP_DELAY_MS);
  });
  card.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return;
    cancel();
    card.classList.remove('is-flipped');
  });
});

// a swipe on the phone rows must not flip: remember where a touch started and how far the row was scrolled
let press = null;
document.addEventListener('pointerdown', (e) => {
  const row = e.target.closest('.sticker-row');
  press = row ? { row, x: e.clientX, y: e.clientY, scroll: row.scrollLeft } : null;
});
const wasSwipe = (e) => press && (Math.abs(press.row.scrollLeft - press.scroll) > 4 ||
  Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10);

document.addEventListener('click', (e) => {
  const card = e.target.closest('.sticker__card');
  if (!card || e.target.closest('a')) return;
  if (!isTouchTap(e)) return;   // mouse uses the hover logic above
  if (wasSwipe(e)) return;
  card.classList.toggle('is-flipped');
});

/* =============================================================
   PHONE ROWS: dots under each swipeable row (hidden on bigger screens by CSS)
   Dusty rose = the sticker you're on. Tapping a dot scrolls to that sticker. No auto-sliding.
   ============================================================= */
document.querySelectorAll('.sticker-row').forEach((row) => {
  const stickers = [...row.children];
  const dots = document.createElement('div');
  dots.className = 'row-dots';
  stickers.forEach((sticker, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show sticker ${i + 1} of ${stickers.length}`);
    dot.addEventListener('click', () => {
      row.scrollTo({ left: sticker.offsetLeft - stickers[0].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    dots.append(dot);
  });
  row.after(dots);
  const update = () => {
    const step = stickers[1].offsetLeft - stickers[0].offsetLeft;
    const atEnd = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
    const current = atEnd ? stickers.length - 1 : Math.round(row.scrollLeft / step);
    [...dots.children].forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
  };
  row.addEventListener('scroll', update, { passive: true });
  update();
});

/* =============================================================
   THE TIN + ITS ITEMS
   1. scrolls into view: closed → wiggle → pop → open (lid swings up). Look lives in style.css [data-state].
   2. the items pop out of the tray one by one and land around the tin (random, balanced spots).
   3. hover (tap on phones) an item for its note; drag it with a mouse; drop it on the tin to put it back.
   4. "Shake the tin": items fly back in, the tin shakes, they scatter again to new spots.
   Item positions are stored as the item's CENTER in stage fractions (0–1), so they survive resizes.
   ============================================================= */
const stage = document.querySelector('[data-stage]');
const tin = stage.querySelector('.tin');
const tray = tin.querySelector('.tin__base');
const tosses = [...stage.querySelectorAll('.toss')];
const shakeBtn = document.querySelector('.tin-shake');
const narrow = window.matchMedia('(max-width: 768px)');   // same breakpoint as the CSS

const WIGGLE_MS = 1300;
const POP_MS = 450;
const OPEN_MS = 1500;      // start tossing items when the lid is nearly open
const TOSS_GAP_MS = 170;   // between items popping out

// Landing spots (item centers, as fractions of the stage). The tin sits in the middle on wide
// screens, so spots ring it left and right. (Phones use clusterSpots() below instead.)
// SPOTS_WIDE is the original wide scatter; PULL draws every spot sideways toward the tin's edge so the
// items look like they just popped out of it (1 = original). Up/down, the same 20% comes from the desktop
// stage being 20% shorter (style.css .toss-stage), since these are fractions of its height.
const SPOTS_WIDE = {
  left:  [[0.08, 0.17], [0.24, 0.13], [0.12, 0.47], [0.27, 0.43], [0.09, 0.81], [0.25, 0.83]],
  right: [[0.92, 0.18], [0.76, 0.12], [0.88, 0.49], [0.73, 0.45], [0.91, 0.82], [0.75, 0.80]],
};
const PULL = 0.8;                                   // 20% closer
const TIN_EDGE = { left: 0.355, right: 0.645 };     // where the tin's sides sit (fractions of the stage width)
const pullIn = (side) => ([x, y]) => [TIN_EDGE[side] + (x - TIN_EDGE[side]) * PULL, y];
const SPOTS = { left: SPOTS_WIDE.left.map(pullIn('left')), right: SPOTS_WIDE.right.map(pullIn('right')) };
// Phones: a loose "just spilled out" scatter BELOW the open tin (never on the lid or tray):
// 3 rows of 2 / 3 / 2, offset so they interlock, with roomy gaps so each item is easy to tap.
// Worked out in px from the tin's layout box (its bottom = the open tray's bottom) and the item sizes,
// then returned as stage fractions.
const CLUSTER_X = [[0.28, 0.72], [0.14, 0.5, 0.86], [0.28, 0.72]];
const CLUSTER_NUDGE = [[-6, -2], [4, 3], [3, -2], [-5, 3], [2, 2], [7, -3], [-3, 2]];   // small fixed wobble [x, y] px
const CLUSTER_TOP_GAP = 18;   // px between the tray and the first row
const CLUSTER_ROW_GAP = 30;   // px between rows (on top of the item height)
function clusterSpots() {
  const { height: H } = stage.getBoundingClientRect();
  const W = stage.clientWidth;
  const itemH = Math.max(...tosses.map((el) => el.offsetHeight));
  const tinBottom = tin.offsetTop + tin.offsetHeight;   // layout box: not affected by the open/close animation
  const spots = [];
  CLUSTER_X.forEach((xs, r) => {
    const y = tinBottom + CLUSTER_TOP_GAP + itemH / 2 + r * (itemH + CLUSTER_ROW_GAP);
    xs.forEach((x) => spots.push([x * W, y]));
  });
  return spots.map(([x, y], i) => [(x + CLUSTER_NUDGE[i][0]) / W, (y + CLUSTER_NUDGE[i][1]) / H]);
}
const CALM_TILTS = [-8, 6, -5, 9, -6, 7, -4];   // used when motion is reduced (no randomness)

const rand = (a, b) => a + Math.random() * (b - a);
const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// one candidate layout (see newLayout)
function oneLayout(random) {
  let spots;
  if (narrow.matches) {
    spots = clusterSpots();   // which item goes where is shuffled below
    if (random) spots = shuffle(spots);
  } else {
    const nLeft = random ? (Math.random() < 0.5 ? 4 : 3) : 4;
    const L = random ? shuffle(SPOTS.left) : SPOTS.left;
    const R = random ? shuffle(SPOTS.right) : SPOTS.right;
    spots = [...L.slice(0, nLeft), ...R.slice(0, tosses.length - nLeft)];
    if (random) spots = shuffle(spots);
  }
  const jitter = narrow.matches ? 0.15 : 1;   // phones: a tight cluster, just a hint of wobble
  return spots.map(([x, y], i) => ({
    x: x + (random ? rand(-0.018, 0.018) * jitter : 0),
    y: y + (random ? rand(-0.022, 0.022) * jitter : 0),
    r: random ? rand(-12, 12) * (narrow.matches ? 0.7 : 1) : CALM_TILTS[i],
  }));
}
// How much a layout's items would overlap each other, the tin, or the stage edges (px², 0 = clean).
// Uses each item's real size, grown for its tilt, plus a small gap.
function layoutOverlap(layout) {
  const s = stage.getBoundingClientRect();
  const t = tin.getBoundingClientRect();
  const tinBox = { l: t.left - s.left, r: t.right - s.left, t: t.top - s.top, b: t.bottom - s.top };
  const GAP = 8;
  const boxes = layout.map((p, i) => {
    const art = tosses[i].querySelector('.toss__art');
    const a = Math.abs(p.r) * Math.PI / 180, w = art.offsetWidth, h = art.offsetHeight;
    const hw = (w * Math.cos(a) + h * Math.sin(a)) / 2 + GAP / 2, hh = (w * Math.sin(a) + h * Math.cos(a)) / 2 + GAP / 2;
    const cx = p.x * s.width, cy = p.y * s.height;
    return { l: cx - hw, r: cx + hw, t: cy - hh, b: cy + hh };
  });
  const ov = (A, B) => Math.max(0, Math.min(A.r, B.r) - Math.max(A.l, B.l)) * Math.max(0, Math.min(A.b, B.b) - Math.max(A.t, B.t));
  let total = 0;
  boxes.forEach((A, i) => {
    total += ov(A, tinBox);
    boxes.slice(i + 1).forEach((B) => { total += ov(A, B); });
    total += Math.max(0, -A.l) + Math.max(0, A.r - s.width) + Math.max(0, -A.t) + Math.max(0, A.b - s.height);
  });
  return total;
}
// Pick 7 spots: balanced (3–4 per side) on wide screens, the 2 / 3 / 2 scatter on phones.
// On wide screens the random jitter + tilt can make neighbors touch now that they sit close to the tin,
// so we re-roll until nothing touches (keeping the best try as a fallback).
function newLayout(random = !reduceMotion) {
  if (!random || narrow.matches) return oneLayout(random);
  let best = null;
  for (let i = 0; i < 40; i++) {
    const layout = oneLayout(true);
    const score = layoutOverlap(layout);
    if (!best || score < best.score) best = { layout, score };
    if (score === 0) break;
  }
  return best.layout;
}

const where = new Map();   // item -> {x, y, r} while it's out, null while it's inside the tin

function moveTo(el, cx, cy, r, scale) {
  el.style.translate = `${cx - el.offsetWidth / 2}px ${cy - el.offsetHeight / 2}px`;
  el.style.setProperty('--r', `${r}deg`);   // the tilt lives on the art (see .toss__art), so notes stay level
  el.style.scale = String(scale);
}
function trayCenter() {
  const s = stage.getBoundingClientRect();
  const t = tray.getBoundingClientRect();
  return { x: t.left - s.left + t.width / 2, y: t.top - s.top + t.height / 2 };
}
// a quick first guess for where the note opens (placeNote refines it when it's shown)
function aimNote(el, p) {
  el.dataset.v = p.y < 0.35 ? 'below' : 'above';
  el.dataset.h = p.x < 0.2 ? 'start' : p.x > 0.8 ? 'end' : 'center';
}
// Try every side the note could open on (each with a few small slides that keep the arrow on the
// item) and keep the one that stays inside the stage and covers the fewest other items (then the
// least of the tin). Runs right before the note shows.
const NOTE_SPOTS = [
  ['above', 'center'], ['below', 'center'], ['above', 'start'], ['above', 'end'],
  ['below', 'start'], ['below', 'end'], ['right', 'center'], ['left', 'center'],
];
const SLIDES = {   // [nx, ny] in px; above/below slide sideways (or a bit further away), sides slide up/down
  above: [[0, 0], [-24, 0], [24, 0], [-44, 0], [44, 0], [0, -18], [-30, -18], [30, -18]],
  below: [[0, 0], [-24, 0], [24, 0], [-44, 0], [44, 0], [0, 18], [-30, 18], [30, 18]],
  right: [[0, 0], [0, -22], [0, 22], [0, -40], [0, 40], [10, 0]],
  left:  [[0, 0], [0, -22], [0, 22], [0, -40], [0, 40], [-10, 0]],
};
const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
                          Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
const PHONE_SPOTS = (first) => {
  const other = first === 'above' ? 'below' : 'above';
  return [[first, 'center'], [first, 'start'], [first, 'end'], [other, 'center'], [other, 'start'], [other, 'end']];
};
function placeNote(el) {
  const note = el.querySelector('.toss__note');
  const s = stage.getBoundingClientRect();
  let box = { left: Math.max(s.left, 0), right: Math.min(s.right, window.innerWidth), top: s.top, bottom: s.bottom };
  let spots = NOTE_SPOTS;
  let itemWeight = 10;
  // Phones: the cluster is tight, so the note opens just above the item (below only if there's no
  // room on screen), in front of its neighbors, and only has to stay fully on screen.
  if (narrow.matches) {
    spots = PHONE_SPOTS('above');
    box = { left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight };
    itemWeight = 0;
  }
  const others = tosses.filter((o) => o !== el && o.classList.contains('is-out'))
    .map((o) => o.querySelector('.toss__art').getBoundingClientRect());
  const tinBox = tray.getBoundingClientRect();
  let best = null;
  note.style.transition = 'none';   // measure without the slide-in animation getting in the way
  spots.forEach(([v, h], i) => {
    el.dataset.v = v;
    el.dataset.h = h;
    SLIDES[v].forEach(([nx, ny], j) => {
      note.style.setProperty('--nx', `${nx}px`);
      note.style.setProperty('--ny', `${ny}px`);
      const n = note.getBoundingClientRect();
      const outside = n.width * n.height - overlap(n, box);
      const onItems = others.reduce((sum, o) => sum + overlap(n, o), 0);
      // prefer earlier spots and smaller slides when it's a tie
      const score = outside * 100 + onItems * itemWeight + (itemWeight ? overlap(n, tinBox) : 0) + i * 4 + j;
      if (!best || score < best.score) best = { v, h, nx, ny, score };
    });
  });
  el.dataset.v = best.v;
  el.dataset.h = best.h;
  note.style.setProperty('--nx', `${best.nx}px`);
  note.style.setProperty('--ny', `${best.ny}px`);
  void note.offsetWidth;
  note.style.transition = '';
}
function withoutAnimation(el, fn) {
  el.classList.add('no-anim');
  fn();
  void el.offsetWidth;          // apply instantly
  el.classList.remove('no-anim');
}
function putInside(el, animate = true) {
  const c = trayCenter();
  const go = () => {
    moveTo(el, c.x, c.y, 0, 0.25);
    el.classList.remove('is-out', 'is-active');
    el.classList.add('is-inside');
    where.set(el, null);
  };
  animate ? go() : withoutAnimation(el, go);
}
function putOut(el, p, animate = true) {
  const go = () => {
    const { width: W, height: H } = stage.getBoundingClientRect();
    moveTo(el, p.x * W, p.y * H, p.r, 1);
    el.classList.add('is-out');
    el.classList.remove('is-inside');
    aimNote(el, p);
    where.set(el, p);
  };
  animate ? go() : withoutAnimation(el, go);
}
// toss every item out of the tray, one by one
function tossAll(layout, after = 0) {
  tosses.forEach((el, i) => {
    putInside(el, false);       // start at the tray, hidden
    setTimeout(() => putOut(el, layout[i]), after + i * TOSS_GAP_MS);
  });
}
const clearNotes = () => tosses.forEach((el) => el.classList.remove('is-active'));

// start: everything hidden in the tin
tosses.forEach((el) => putInside(el, false));

function openTin() {
  if (reduceMotion) {
    tin.dataset.state = 'open';
    const layout = newLayout(false);
    requestAnimationFrame(() => tosses.forEach((el, i) => putOut(el, layout[i], false)));
    return;
  }
  tin.dataset.state = 'wiggle';
  setTimeout(() => { tin.dataset.state = 'pop'; }, WIGGLE_MS);
  setTimeout(() => { tin.dataset.state = 'open'; }, WIGGLE_MS + POP_MS);
  setTimeout(() => tossAll(newLayout()), WIGGLE_MS + POP_MS + OPEN_MS);
}
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) { openTin(); obs.disconnect(); }
}, { threshold: 0.4 }).observe(stage);

// "Shake the tin": collect → shake → scatter again
let shaking = false;
shakeBtn.addEventListener('click', () => {
  if (shaking || tin.dataset.state !== 'open') return;
  clearNotes();
  const layout = newLayout();
  if (reduceMotion) { tosses.forEach((el, i) => putOut(el, layout[i], false)); return; }
  shaking = true;
  const out = tosses.filter((el) => el.classList.contains('is-out'));
  out.forEach((el, i) => setTimeout(() => putInside(el), i * 60));
  const shakeAt = out.length * 60 + 550;
  setTimeout(() => { tin.classList.remove('is-shaking'); void tin.offsetWidth; tin.classList.add('is-shaking'); }, shakeAt);
  setTimeout(() => {
    tin.classList.remove('is-shaking');
    tossAll(layout);
    setTimeout(() => { shaking = false; }, tosses.length * TOSS_GAP_MS + 600);
  }, shakeAt + 700);
});

/* Drag with a mouse or pen (touch is left for scrolling; a tap shows the note instead).
   Items stay inside the stage. Dropped on the tin, an item goes back inside. */
let drag = null;
function overTin(el) {
  const t = tin.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const inset = t.width * 0.08;
  return cx > t.left + inset && cx < t.right - inset && cy > t.top + inset && cy < t.bottom - inset;
}
tosses.forEach((el) => {
  el.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch' && !drag) placeNote(el); });
  el.addEventListener('focus', () => placeNote(el));
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || !el.classList.contains('is-out')) return;
    e.preventDefault();
    const s = stage.getBoundingClientRect();
    const p = where.get(el);
    drag = { el, x0: e.clientX, y0: e.clientY, dx: e.clientX - (s.left + p.x * s.width), dy: e.clientY - (s.top + p.y * s.height), moved: false };
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!drag || drag.el !== el) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4) return;
    drag.moved = true;
    el.classList.add('is-dragging');
    const s = stage.getBoundingClientRect();
    const hw = el.offsetWidth / 2;
    const hh = el.offsetHeight / 2;
    const cx = Math.min(Math.max(e.clientX - s.left - drag.dx, hw), s.width - hw);
    const cy = Math.min(Math.max(e.clientY - s.top - drag.dy, hh), s.height - hh);
    const p = { ...where.get(el), x: cx / s.width, y: cy / s.height };
    where.set(el, p);
    el.style.translate = `${cx - hw}px ${cy - hh}px`;
  });
  const drop = () => {
    if (!drag || drag.el !== el) return;
    const { moved } = drag;
    drag = null;
    el.classList.remove('is-dragging');
    if (!moved) return;
    if (overTin(el)) putInside(el);
    else placeNote(el);
  };
  el.addEventListener('pointerup', drop);
  el.addEventListener('pointercancel', drop);
});

// tap (touch screens): show one note at a time; tap it again or anywhere else to hide it
document.addEventListener('click', (e) => {
  if (!isTouchTap(e)) return;   // mouse uses hover (CSS)
  const el = e.target.closest('.toss');
  if (!el || !el.classList.contains('is-out')) { clearNotes(); return; }
  const was = el.classList.contains('is-active');
  clearNotes();
  if (!was) { placeNote(el); el.classList.add('is-active'); }
});

// keep items in place on resize; re-scatter if we cross the phone/desktop layout
let wasNarrow = narrow.matches;
window.addEventListener('resize', () => {
  const crossed = narrow.matches !== wasNarrow;
  wasNarrow = narrow.matches;
  const layout = crossed ? newLayout() : null;
  tosses.forEach((el, i) => {
    const p = where.get(el);
    if (p) putOut(el, crossed ? layout[i] : p, false);
    else putInside(el, false);
  });
});
