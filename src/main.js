// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* =============================================================
   THE TIN
   closed → wiggle (1.4s) → pop (0.35s) → open (lid flips up, charms appear)
   The look of each step lives in style.css under [data-state="..."].
   ============================================================= */
const tin = document.querySelector('.tin');
const lid = tin.querySelector('.tin__lid');
const charms = [...tin.querySelectorAll('.charm')];
const replay = document.querySelector('.tin-replay');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WIGGLE_MS = 1400;
const POP_MS = 350;
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
  later(openTin, 1600); // wait for the lid to swing shut
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
