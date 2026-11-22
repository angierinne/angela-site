const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* =============================================================
   HERO ENTRANCE
   Split the name into letters (each rises in, see [data-split] in style.css),
   then the lines marked [data-rise] fade up one after another. ~1.4s total.
   ============================================================= */
const name = document.querySelector('[data-split]');
if (!reduceMotion) {
  const text = name.textContent;
  name.setAttribute('aria-label', text);
  name.textContent = '';
  [...text].forEach((char, i) => {
    if (char === ' ') return name.append(' ');
    const span = document.createElement('span');
    span.className = 'ch';
    span.setAttribute('aria-hidden', 'true');
    span.style.setProperty('--i', i);
    span.textContent = char;
    name.append(span);
  });
}
// stagger the supporting lines after the name
document.querySelectorAll('[data-rise]').forEach((el, i) => {
  el.style.setProperty('--d', `${0.5 + i * 0.16}s`);
});
// start once the script font is ready, so letters don't animate in the fallback font
const start = () => document.querySelector('.hero').classList.add('is-ready');
Promise.race([
  document.fonts.load('1em Roycella'),
  new Promise((r) => setTimeout(r, 1200)),
]).then(start, start);

/* =============================================================
   SCROLL REVEALS + "PRINTING" IMAGES
   [data-reveal] gets .is-in when it scrolls into view (once).
   For work entries, the photo prints out of its slot; when done it starts floating.
   ============================================================= */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    target.classList.add('is-in');
    revealer.unobserve(target);
    const shot = target.querySelector('.shot');
    if (shot) setTimeout(() => shot.classList.add('is-printed'), reduceMotion ? 0 : 1400);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => revealer.observe(el));

/* =============================================================
   THE TIN
   closed → wiggle (1.3s) → pop (0.45s) → open (lid swings up 1.6s, charms fade in)
   The look of each step lives in style.css under [data-state="..."].
   ============================================================= */
const tin = document.querySelector('.tin');
const lid = tin.querySelector('.tin__lid');
const charms = [...tin.querySelectorAll('.charm')];
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
  charms.forEach((c) => c.classList.remove('is-active'));
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

/* Charm notes: desktop shows them on hover (CSS).
   On touch screens there's no hover, so a tap toggles the note instead. */
charms.forEach((charm) => {
  charm.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasActive = charm.classList.contains('is-active');
    charms.forEach((c) => c.classList.remove('is-active'));
    if (!wasActive) charm.classList.add('is-active');
  });
});
document.addEventListener('click', () => charms.forEach((c) => c.classList.remove('is-active')));
