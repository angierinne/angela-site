// Favicon generator: "AW" in Soft Sand on an edge-to-edge Dusty Rose rounded square.
// Two styles: 'anton' (active) and 'script' (Mrs Saint Delafield, for comparison).
// The letters are measured by their actual ink bounds (no font padding), then fitted into the square.
// Usage: node make-favicons.mjs <outDir>   (needs the dev server running for the fonts)
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'fs';
const out = process.argv[2];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
await p.evaluate(() => Promise.all([document.fonts.load('400px Anton'), document.fonts.load('400px "Mrs Saint Delafield"')]));
const SIZES = [16, 32, 48, 64, 180];
for (const style of ['anton', 'script']) {
  mkdirSync(`${out}/${style}`, { recursive: true });
  for (const size of SIZES) {
    const data = await p.evaluate((size, style) => {
      const ROSE = '#D9879A', SAND = '#F0E5DB';
      // 1) draw the letters big and find their ink bounds
      const big = document.createElement('canvas'); big.width = 1600; big.height = 1000;
      const g = big.getContext('2d'); g.fillStyle = g.strokeStyle = SAND; g.lineJoin = g.lineCap = 'round';
      if (style === 'anton') { g.font = '600px Anton'; g.fillText('AW', 200, 800); }
      else { g.font = '420px "Mrs Saint Delafield"'; g.lineWidth = size <= 16 ? 56 : size <= 32 ? 40 : 26; g.fillText('AW', 300, 620); g.strokeText('AW', 300, 620); }
      const px = g.getImageData(0, 0, 1600, 1000).data;
      let x0 = 1600, y0 = 1000, x1 = 0, y1 = 0;
      for (let y = 0; y < 1000; y++) for (let x = 0; x < 1600; x++) if (px[(y * 1600 + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      // 2) the square: fills the whole canvas; iOS (180) rounds corners itself, so that one is a plain square
      const c = document.createElement('canvas'); c.width = c.height = size;
      const k = c.getContext('2d'); k.fillStyle = ROSE;
      k.beginPath(); k.roundRect(0, 0, size, size, size === 180 ? 0 : size * 0.2); k.fill();
      // 3) fit the letters: Anton ~78% of the square, the wide script ~88% of its width
      const fill = style === 'anton' ? (size <= 16 ? 0.84 : 0.78) : 0.88;
      const s = Math.min(size * fill / w, size * fill / h), tw = w * s, th = h * s;
      let src = document.createElement('canvas'); src.width = w; src.height = h;
      src.getContext('2d').drawImage(big, x0, y0, w, h, 0, 0, w, h);
      while (src.width / 2 > tw) {   // downscale in halving steps for clean small sizes
        const t = document.createElement('canvas'); t.width = Math.ceil(src.width / 2); t.height = Math.ceil(src.height / 2);
        const tg = t.getContext('2d'); tg.imageSmoothingQuality = 'high'; tg.drawImage(src, 0, 0, t.width, t.height); src = t;
      }
      k.imageSmoothingQuality = 'high';
      let dx = (size - tw) / 2, dy = (size - th) / 2;
      if (style === 'anton' && size <= 32) { dx = Math.round(dx); dy = Math.round(dy); }   // crisper edges on tiny icons
      k.drawImage(src, 0, 0, src.width, src.height, dx, dy, tw, th);
      return c.toDataURL('image/png').split(',')[1];
    }, size, style);
    writeFileSync(`${out}/${style}/icon-${size}.png`, Buffer.from(data, 'base64'));
  }
}
await b.close();
