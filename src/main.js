
// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* =============================================================
   THE TIN
   closed → wiggle (lid shakes) → open (lid pops off, items rise out)
   ============================================================= */
const wall = document.querySelector('.wall');
const tin = wall.querySelector('.tin');
const base = wall.querySelector('.tin__base');
const lid = wall.querySelector('.tin__lid');
const items = [...wall.querySelectorAll('.tin-item')];
const replay = wall.querySelector('.tin-replay');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Position of an element's center inside .wall, ignoring CSS transforms
function centerIn(el) {
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2;
  while (el && el !== wall) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
  return { x, y };
}

// Tell each item how far it is from the tin, so it can start "inside" it
function aimItemsAtTin() {
  const mouth = centerIn(base);
  items.forEach((item, i) => {
    const c = centerIn(item);
    item.style.setProperty('--dx', `${mouth.x - c.x}px`);
    item.style.setProperty('--dy', `${mouth.y - c.y}px`);
    item.style.setProperty('--i', i);
  });
}

let timer;
function openTin() {
  clearTimeout(timer);
  if (reduceMotion) { tin.dataset.state = 'open'; wall.classList.add('is-open'); return; }
  aimItemsAtTin();
  tin.dataset.state = 'wiggle';
  timer = setTimeout(() => {
    tin.dataset.state = 'open';
    wall.classList.add('is-open');
  }, 700);
}

function closeTin() {
  clearTimeout(timer);
  aimItemsAtTin();
  wall.classList.remove('is-open');
  tin.dataset.state = 'closed';
}

// Open the first time the tin scrolls into view
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) { openTin(); obs.disconnect(); }
}, { threshold: 0.4 }).observe(tin);

// Click the lid or the replay link to close and re-open
function toggle() {
  if (tin.dataset.state === 'closed') return openTin();
  closeTin();
  timer = setTimeout(openTin, 450);
}
lid.addEventListener('click', toggle);
replay.addEventListener('click', toggle);

// Keep item start positions right if the layout changes size
window.addEventListener('resize', aimItemsAtTin);
aimItemsAtTin();
