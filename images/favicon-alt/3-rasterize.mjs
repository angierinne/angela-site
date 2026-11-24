// Rasterize SVG files to exact-size PNGs in Chrome. Usage: node rast.mjs size in.svg out.png [in.svg out.png ...]
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync } from 'fs';
const [size, ...pairs] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage(); await p.goto('about:blank');
for (let i = 0; i < pairs.length; i += 2) {
  const svg = readFileSync(pairs[i], 'utf8');
  const data = await p.evaluate(async (svg, n) => {
    const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
    const c = document.createElement('canvas'); c.width = c.height = n; c.getContext('2d').drawImage(img, 0, 0, n, n);
    return c.toDataURL('image/png').split(',')[1];
  }, svg, +size);
  writeFileSync(pairs[i + 1], Buffer.from(data, 'base64'));
}
await b.close();
