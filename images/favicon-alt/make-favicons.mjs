import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'fs';
const out = process.argv[2];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.load('400px "Mrs Saint Delafield"'));
// [size, stroke added at 400px font size] — smaller icons get thicker strokes so they survive downscaling
const SIZES = [[16, 64], [32, 44], [48, 34], [64, 30], [180, 16]];
for (const variant of ['A', 'B', 'apple']) {
  for (const [size, lw] of SIZES) {
    const data = await p.evaluate((size, lw, variant) => {
      const big = document.createElement('canvas'); big.width = 1400; big.height = 900;
      const g = big.getContext('2d');
      g.font = '400px "Mrs Saint Delafield"'; g.fillStyle = g.strokeStyle = '#D9879A'; g.lineWidth = lw; g.lineJoin = g.lineCap = 'round';
      g.fillText('AW', 260, 560); g.strokeText('AW', 260, 560);
      const px = g.getImageData(0, 0, 1400, 900).data;
      let x0 = 1400, y0 = 900, x1 = 0, y1 = 0;
      for (let y = 0; y < 900; y++) for (let x = 0; x < 1400; x++) if (px[(y * 1400 + x) * 4 + 3] > 10) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      const c = document.createElement('canvas'); c.width = c.height = size;
      const h = c.getContext('2d');
      let fill = 0.92;
      if (variant === 'B') {   // Soft Sand rounded square, AW inside it
        const r = size * 0.22; h.fillStyle = '#F0E5DB';
        h.beginPath(); h.roundRect(0, 0, size, size, r); h.fill();
        fill = 0.86;
      }
      if (variant === 'apple') { h.fillStyle = '#F0E5DB'; h.fillRect(0, 0, size, size); fill = 0.84; }   // iOS rounds the corners itself
      const w = x1 - x0 + 1, hh = y1 - y0 + 1, s = Math.min(size * fill / w, size * fill / hh);
      const tw = w * s, th = hh * s;
      // downscale in halving steps for a cleaner small icon
      let src = document.createElement('canvas'); src.width = w; src.height = hh;
      src.getContext('2d').drawImage(big, x0, y0, w, hh, 0, 0, w, hh);
      while (src.width / 2 > tw) {
        const t = document.createElement('canvas'); t.width = Math.ceil(src.width / 2); t.height = Math.ceil(src.height / 2);
        const tg = t.getContext('2d'); tg.imageSmoothingQuality = 'high'; tg.drawImage(src, 0, 0, t.width, t.height);
        src = t;
      }
      h.imageSmoothingQuality = 'high';
      h.drawImage(src, 0, 0, src.width, src.height, (size - tw) / 2, (size - th) / 2, tw, th);
      return c.toDataURL('image/png').split(',')[1];
    }, size, lw, variant);
    writeFileSync(`${out}/${variant}/icon-${size}.png`, Buffer.from(data, 'base64'));
  }
}
await b.close();
