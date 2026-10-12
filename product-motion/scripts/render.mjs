// render.mjs — frame-exact renderer for product-motion
// usage: node render.mjs <file.html> <seconds> <fps> [width] [height] [--gpu] [--blur N] [--from F] [--to F] [--out dir]
//   --gpu       use the real GPU (headed-capable flags) instead of software GL
//   --blur N    motion blur: average N subframes over half a frame (180-degree shutter), linear light
//   --from/--to render only a frame range (inclusive from, exclusive to) for quick re-checks
//   --root dir  folder served over http (default: current folder). The HTML must be inside it.
//               Served over http, not file://, so ES module imports and fonts load.
// Freezes the page at t = i / fps via window.renderAt(t) and the Web Animations API, saves PNGs.
// Loops: frames 0 to N-1 only. Frame N would duplicate frame 0.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, extname, join, sep } from 'node:path';

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const bool = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return false;
  args.splice(i, 1);
  return true;
};

const GPU = bool('--gpu');
const BLUR = Number(flag('--blur', '1')) || 1;
const OUT = flag('--out', 'out/frames');
const FROM = flag('--from', null);
const TO = flag('--to', null);
const ROOT = resolve(flag('--root', '.'));
const [file = 'anim.html', secs = '6', fps = '60', w = '1080', h = '1080'] = args;

const FPS = Number(fps);
const N = Math.round(Number(secs) * FPS);
const W = Number(w), H = Number(h);
const start = FROM === null ? 0 : Number(FROM);
const end = TO === null ? N : Math.min(N, Number(TO));
mkdirSync(OUT, { recursive: true });

const launchArgs = GPU
  ? ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=default', '--enable-unsafe-webgpu']
  : ['--use-gl=angle', '--use-angle=swiftshader'];

// CHROME_PATH lets you use an installed Chrome/Chromium instead of Playwright's download
const browser = await chromium.launch({ args: launchArgs, executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });

// Static server so module imports work
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.hdr': 'application/octet-stream', '.wav': 'audio/wav' };
const server = createServer((req, res) => {
  const p = resolve(ROOT, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!(p === ROOT || p.startsWith(ROOT + sep)) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[extname(p).toLowerCase()] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const rel = relative(ROOT, resolve(file));
if (rel.startsWith('..')) { console.error(`${file} is outside --root ${ROOT}`); process.exit(1); }

// ?t=0 tells the page not to start requestAnimationFrame
const url = `http://127.0.0.1:${server.address().port}/${rel.split(sep).join('/')}?t=0`;
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(async () => { await document.fonts.ready; });
// Wait for window.__ready if the page uses it (fonts, textures, bakes)
await page.waitForFunction(() => window.__ready === undefined || window.__ready === true, null, { timeout: 120000 });

const freeze = (t) => page.evaluate((t) => {
  if (typeof window.renderAt === 'function') window.renderAt(t);
  document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * 1000; });
}, t);

let sharp = null;
if (BLUR > 1) {
  try { sharp = (await import('sharp')).default; }
  catch { console.error('--blur needs sharp: npm i -D sharp. Rendering without blur.'); }
}

const toLinear = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const toSRGB = (c) => { const v = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(v * 255))); };
const LUT = new Float32Array(256).map((_, i) => toLinear(i));

for (let i = start; i < end; i++) {
  const path = `${OUT}/${String(i).padStart(4, '0')}.png`;
  if (!sharp) {
    await freeze(i / FPS);
    await page.screenshot({ path });
  } else {
    // Subframes centered on the frame, spread over half a frame (180-degree shutter)
    let acc = null, info = null;
    for (let s = 0; s < BLUR; s++) {
      const off = ((s + 0.5) / BLUR - 0.5) * 0.5 / FPS;
      await freeze(i / FPS + off);
      const buf = await page.screenshot();
      const { data, info: inf } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      info = inf;
      if (!acc) acc = new Float32Array(data.length);
      for (let k = 0; k < data.length; k++) acc[k] += LUT[data[k]];
    }
    const outBuf = Buffer.alloc(acc.length);
    for (let k = 0; k < acc.length; k++) outBuf[k] = toSRGB(acc[k] / BLUR);
    await sharp(outBuf, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toFile(path);
  }
  if (i % 30 === 0) console.log(`frame ${i}/${N}`);
}

writeFileSync(`${OUT}/render.json`, JSON.stringify({ file, secs: Number(secs), fps: FPS, frames: N, width: W, height: H, gpu: GPU, blur: BLUR, range: [start, end] }, null, 2));
await browser.close();
server.close();
console.log(`done: ${end - start} frames in ${OUT}`);
console.log(`next: ffmpeg -framerate ${FPS} -i ${OUT}/%04d.png -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -movflags +faststart out/anim.mp4`);
