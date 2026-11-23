const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

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

const canHover = window.matchMedia('(hover: hover)').matches;

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

document.addEventListener('click', (e) => {
  const card = e.target.closest('.sticker__card');
  if (!card || e.target.closest('a')) return;
  if (canHover && e.pointerType !== 'touch') return;   // mouse uses the hover logic above
  card.classList.toggle('is-flipped');
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
const narrow = window.matchMedia('(max-width: 700px)');   // same breakpoint as the CSS

const WIGGLE_MS = 1300;
const POP_MS = 450;
const OPEN_MS = 1500;      // start tossing items when the lid is nearly open
const TOSS_GAP_MS = 170;   // between items popping out

// Landing spots (item centers, as fractions of the stage). The tin sits in the middle on wide
// screens, so spots ring it left and right; on phones the tin is at the top and items land below.
const SPOTS = {
  left:  [[0.08, 0.17], [0.24, 0.13], [0.12, 0.47], [0.27, 0.43], [0.09, 0.81], [0.25, 0.83]],
  right: [[0.92, 0.18], [0.76, 0.12], [0.88, 0.49], [0.73, 0.45], [0.91, 0.82], [0.75, 0.80]],
  narrow: [[0.2, 0.4], [0.5, 0.42], [0.8, 0.4], [0.18, 0.64], [0.5, 0.66], [0.82, 0.64], [0.2, 0.88], [0.5, 0.9], [0.8, 0.88]],
};
const CALM_TILTS = [-8, 6, -5, 9, -6, 7, -4];   // used when motion is reduced (no randomness)

const rand = (a, b) => a + Math.random() * (b - a);
const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// pick 7 spots: balanced (3–4 per side) on wide screens, a few random gaps on phones
function newLayout(random = !reduceMotion) {
  let spots;
  if (narrow.matches) {
    spots = random ? shuffle(SPOTS.narrow).slice(0, tosses.length) : SPOTS.narrow.slice(0, tosses.length);
  } else {
    const nLeft = random ? (Math.random() < 0.5 ? 4 : 3) : 4;
    const L = random ? shuffle(SPOTS.left) : SPOTS.left;
    const R = random ? shuffle(SPOTS.right) : SPOTS.right;
    spots = [...L.slice(0, nLeft), ...R.slice(0, tosses.length - nLeft)];
    if (random) spots = shuffle(spots);
  }
  const jitter = narrow.matches ? 0.5 : 1;   // phones are tighter: less wobble so notes have room
  return spots.map(([x, y], i) => ({
    x: x + (random ? rand(-0.018, 0.018) * jitter : 0),
    y: y + (random ? rand(-0.022, 0.022) * jitter : 0),
    r: random ? rand(-12, 12) : CALM_TILTS[i],
  }));
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
function placeNote(el) {
  const note = el.querySelector('.toss__note');
  const s = stage.getBoundingClientRect();
  const box = { left: Math.max(s.left, 0), right: Math.min(s.right, window.innerWidth), top: s.top, bottom: s.bottom };
  const others = tosses.filter((o) => o !== el && o.classList.contains('is-out'))
    .map((o) => o.querySelector('.toss__art').getBoundingClientRect());
  const tinBox = tray.getBoundingClientRect();
  let best = null;
  note.style.transition = 'none';   // measure without the slide-in animation getting in the way
  NOTE_SPOTS.forEach(([v, h], i) => {
    el.dataset.v = v;
    el.dataset.h = h;
    SLIDES[v].forEach(([nx, ny], j) => {
      note.style.setProperty('--nx', `${nx}px`);
      note.style.setProperty('--ny', `${ny}px`);
      const n = note.getBoundingClientRect();
      const outside = n.width * n.height - overlap(n, box);
      const onItems = others.reduce((sum, o) => sum + overlap(n, o), 0);
      // prefer earlier spots and smaller slides when it's a tie
      const score = outside * 100 + onItems * 10 + overlap(n, tinBox) + i * 4 + j;
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

// tap (touch screens): show one note at a time; tap elsewhere to hide it
document.addEventListener('click', (e) => {
  const el = e.target.closest('.toss');
  if (canHover) return;
  if (!el) { clearNotes(); return; }
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
