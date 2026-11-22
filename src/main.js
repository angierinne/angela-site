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
   the work stickers pop in one by one, scripts write in, the sign-off signs itself.
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
   THE TIN
   closed → wiggle (1.3s) → pop (0.45s) → open (lid swings up 1.6s, charms fade in; they're visual only)
   The look of each step lives in style.css under [data-state="..."].
   ============================================================= */
const tin = document.querySelector('.tin');
const lid = tin.querySelector('.tin__lid');
const replay = document.querySelector('.tin-replay');

const WIGGLE_MS = 1300;
const POP_MS = 450;
let timers = [];

function setState(state) { tin.dataset.state = state; }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }
function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

function openTin() {
  clearTimers();
  if (reduceMotion) return setState('open');
  setState('wiggle');
  later(() => setState('pop'), WIGGLE_MS);
  later(() => setState('open'), WIGGLE_MS + POP_MS);
}

function closeTin() {
  clearTimers();
  setState('closed');
}

// Open the first time the tin scrolls into view
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) { openTin(); obs.disconnect(); }
}, { threshold: 0.5 }).observe(tin);

// Click the lid or the replay link to close and re-open
function replayTin() {
  if (tin.dataset.state === 'closed') return openTin();
  closeTin();
  later(openTin, reduceMotion ? 0 : 1700); // wait for the lid to swing shut
}
lid.addEventListener('click', replayTin);
replay.addEventListener('click', replayTin);

/* =============================================================
   SKILLS TICKER: set its speed from its width (CSS does the drift)
   ============================================================= */
const SKILLS_SPEED = 34; // px per second
const skillsTrack = document.querySelector('.skills__track');
if (skillsTrack) skillsTrack.style.animationDuration = `${skillsTrack.scrollWidth / 2 / SKILLS_SPEED}s`;

/* =============================================================
   WORK CAROUSEL
   The row is a native horizontal scroller, so touch swipe and trackpad scroll work for free.
   For a seamless loop the 6 stickers are cloned on both sides: [copy][originals][copy].
   We slowly move scrollLeft and, whenever it drifts out of the middle set, jump by exactly
   one set width. The jump lands on identical-looking stickers, so it's invisible.
   Pauses: hover, dragging, a flipped sticker, keyboard focus inside, or for RESUME_MS after a drag/scroll/swipe.
   Reduced motion: no clones, no auto-slide, just a scrollable (and draggable) row.
   ============================================================= */
const CAROUSEL_SPEED = 16;  // px per second (slower than the skills ticker on purpose)
const RESUME_MS = 3000;     // resume sliding this long after the user lets go

const carousel = document.querySelector('[data-carousel]');
const row = carousel.querySelector('.stickers');
const originals = [...row.children];
const loops = !reduceMotion;

function makeCopy(li) {
  const copy = li.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');                       // screen readers get the originals only
  copy.querySelectorAll('button').forEach((b) => { b.tabIndex = -1; });
  return copy;
}
if (loops) {
  originals.forEach((li) => row.append(makeCopy(li)));                       // copy after
  [...originals].reverse().forEach((li) => row.prepend(makeCopy(li)));       // copy before
}

let setWidth = 0;
let pos = 0;
const measure = () => {
  setWidth = loops ? originals[0].offsetLeft - row.children[0].offsetLeft : 0;
};
// keep pos inside the middle set (originals), shifting by one set width when needed
const wrap = (p) => {
  if (!loops || !setWidth) return p;
  if (p >= setWidth * 2) return p - setWidth;
  if (p < setWidth) return p + setWidth;
  return p;
};

measure();
pos = setWidth;
carousel.scrollLeft = pos;

let hovering = false;
let dragging = false;
let touching = false;
let focusInside = false;
let visible = false;
let resumeAt = 0;
// pause for at least `ms` (never shortens a longer pause that's already running)
const holdFor = (ms) => { resumeAt = Math.max(resumeAt, performance.now() + ms); };

carousel.addEventListener('mouseenter', () => { hovering = true; });
carousel.addEventListener('mouseleave', () => { hovering = false; holdFor(1000); });
carousel.addEventListener('wheel', () => holdFor(RESUME_MS), { passive: true });
carousel.addEventListener('touchstart', () => { touching = true; }, { passive: true });
carousel.addEventListener('touchend', () => { touching = false; holdFor(RESUME_MS); }, { passive: true });
// only keyboard focus pauses (a mouse click also focuses the button, which shouldn't freeze the row)
carousel.addEventListener('focusin', (e) => { focusInside = e.target.matches(':focus-visible'); });
carousel.addEventListener('focusout', () => { focusInside = false; holdFor(RESUME_MS); });
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(carousel);

// mouse drag (touch uses native scrolling)
let startX = 0;
let startScroll = 0;
let dragged = false;
carousel.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  dragging = true; dragged = false;
  startX = e.clientX; startScroll = carousel.scrollLeft;
  carousel.setPointerCapture(e.pointerId);
});
carousel.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 4) { dragged = true; carousel.classList.add('is-dragging'); }
  const raw = startScroll - dx;
  const wrapped = wrap(raw);
  startScroll += wrapped - raw;     // keep dragging smoothly across a wrap
  pos = wrapped;
  carousel.scrollLeft = pos;
});
const endDrag = () => {
  if (!dragging) return;
  dragging = false;
  carousel.classList.remove('is-dragging');
  holdFor(RESUME_MS);
};
carousel.addEventListener('pointerup', endDrag);
carousel.addEventListener('pointercancel', endDrag);

// the slide loop
let last = performance.now();
function tick(now) {
  const dt = Math.min(now - last, 64) / 1000;
  last = now;
  if (loops) {
    const paused = hovering || dragging || touching || focusInside || !visible
      || now < resumeAt || row.querySelector('.is-flipped');
    if (paused) {
      // follow wherever the user scrolled, wrapping when they leave the middle set
      const current = carousel.scrollLeft;
      const wrapped = wrap(current);
      if (wrapped !== current && !touching) carousel.scrollLeft = wrapped;
      pos = wrapped;
    } else {
      pos = wrap(pos + CAROUSEL_SPEED * dt);
      carousel.scrollLeft = pos;
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

window.addEventListener('resize', () => {
  const offset = setWidth ? (pos - setWidth) / setWidth : 0;   // where we were inside the set (0..1)
  measure();
  pos = setWidth + offset * setWidth;
  carousel.scrollLeft = pos;
});

/* =============================================================
   WORK STICKERS: flip on tap
   Desktop flips on hover (CSS). Touch screens have no hover, so a tap flips the
   sticker and a second tap flips it back. (Delegated, so the carousel copies work too.)
   ============================================================= */
const canHover = window.matchMedia('(hover: hover)').matches;
row.addEventListener('click', (e) => {
  const card = e.target.closest('.sticker__card');
  if (!card || canHover || dragged) return;
  card.classList.toggle('is-flipped');
});
