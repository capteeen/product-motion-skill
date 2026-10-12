// motion.js — one tokens file, imported everywhere, no inline motion numbers.
// Every function is pure in t, so any frame can render on its own.

export const EASE = {
  enter: 'cubic-bezier(0.16, 1, 0.3, 1)',    // ease-out-expo: text and logo reveals
  premium: 'cubic-bezier(0.22, 1, 0.36, 1)', // ease-out-quint: premium entrances
  move:  'cubic-bezier(0.76, 0, 0.24, 1)',   // ease-in-out-quart: moves, camera
  exit:  'cubic-bezier(0.7, 0, 0.84, 0)',    // ease-in-expo: fast exits
  pop:   'cubic-bezier(0.34, 1.56, 0.64, 1)' // ease-out-back: playful overshoot
};
export const MS = { feedback: 150, move: 400, hero: 750, exit: 240 };
export const STAGGER = { letterFrames: 1, word: 90, item: 60 };

// Cubic-bezier as a JS function of progress u in [0,1] (for canvas / WebGL).
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (u) => {
    if (u <= 0) return 0; if (u >= 1) return 1;
    let t = u;
    for (let i = 0; i < 8; i++) { const e = sx(t) - u; const d = dx(t); if (Math.abs(e) < 1e-6 || !d) break; t -= e / d; }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
export const ease = {
  enter: bezier(0.16, 1, 0.3, 1),
  premium: bezier(0.22, 1, 0.36, 1),
  move: bezier(0.76, 0, 0.24, 1),
  exit: bezier(0.7, 0, 0.84, 0),
  pop: bezier(0.34, 1.56, 0.64, 1),
  inOutSine: (u) => -(Math.cos(Math.PI * Math.min(1, Math.max(0, u))) - 1) / 2,
  linear: (u) => Math.min(1, Math.max(0, u))
};

// Progress of a segment: 0 before t0, 1 after t0 + dur.
export const seg = (t, t0, dur) => Math.min(1, Math.max(0, (t - t0) / dur));

// Damping ratio from any library's numbers: 1 = no bounce.
export const dampingRatio = (k, d, m = 1) => d / (2 * Math.sqrt(k * m));

// A spring as a pure function of time, 0 -> 1.
// zeta: damping ratio (1 none, 0.7 premium, 0.5 playful). f: speed in Hz.
export function spring(t, zeta = 0.7, f = 2) {
  if (t <= 0) return 0;
  const w = 2 * Math.PI * f;
  if (zeta >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t));
}

// Beat grid: frame of beat n, rounded per beat (never accumulate rounding).
export const beatFrame = (n, bpm, fps) => Math.round((n * 60 / bpm) * fps);

// Loop helpers: phase in [0,1), whole cycles only.
export const phase = (t, loopSecs) => ((t % loopSecs) + loopSecs) % loopSecs / loopSecs;

// Seeded random (mulberry32). Seed by frame index for grain.
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Periodic 1D noise for loops: sample a smooth function on a circle.
export function loopNoise(p, seed = 1, octaves = 3) {
  const a = 2 * Math.PI * p; let v = 0, amp = 1, norm = 0;
  const r = rng(seed);
  for (let o = 1; o <= octaves; o++) {
    const ph1 = r() * 6.283, ph2 = r() * 6.283;
    v += amp * (Math.sin(a * o + ph1) * 0.6 + Math.cos(a * (o + 1) + ph2) * 0.4);
    norm += amp; amp *= 0.5;
  }
  return v / norm;
}

// Text hold rule: seconds a text state must stay still.
export const holdFor = (words) => 0.3 * words + 0.5;
