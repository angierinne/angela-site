const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* =============================================================
   HERO ENTRANCE (~1.5s total)
   1. ANGELA's letters rise in (each letter is wrapped in a span here)
   2. the pink "Hi, I'm" writes in (CSS mask wipe, starts at 0.45s)
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
   WORK STICKERS: flip on tap
   Desktop flips on hover (CSS). Touch screens have no hover, so a tap flips the
   sticker and a second tap flips it back.
   ============================================================= */
const canHover = window.matchMedia('(hover: hover)').matches;
document.querySelectorAll('.sticker__card').forEach((card) => {
  card.addEventListener('click', () => {
    if (canHover) return;
    card.classList.toggle('is-flipped');
  });
});
