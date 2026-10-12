# Engines

Name the engine in the OUTPUT line with its numbers ("a Remotion composition, 1920x1080, 30 fps, 450 frames"), or the model picks for you.

| Engine | Best for | Notes |
|---|---|---|
| Plain HTML + CSS / Canvas 2D / SVG | one idea under 10 s: type, shapes, UI | zero installs; `scripts/render.mjs` turns it into MP4/GIF |
| three.js | anything 3D: product shots, objects, mascots, liquid/chrome | pin 0.160.0 via jsdelivr importmap; drive time from frame number, never the clock |
| Remotion | series, templates, data-driven, long films | video as React; frame-exact; official Agent Skills (`npx remotion skills add`); free for individuals and companies up to 3 people, larger companies need a license |
| HyperFrames (HeyGen) | HTML + CSS + GSAP timelines → MP4 | Apache 2.0; needs Node 22+ and FFmpeg |
| GSAP | timelines on the web | now free incl. SplitText, MorphSVG, DrawSVG, ScrollTrigger; license bars building a competing no-code animation builder |
| Motion (ex Framer Motion) | motion inside a live React product | MIT; no video renderer |

## Setup commands

```bash
# Remotion
npx create-video@latest
cd my-video && npm i
npx remotion skills add
npm run dev
npx remotion render MyComp out/video.mp4

# HyperFrames
npx hyperframes init my-video
cd my-video
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
npx hyperframes preview
npx hyperframes render
```

## three.js importmap (pinned)

```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
}}
</script>
```

Fonts for TextGeometry: `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json`.

## Effort

Start at medium effort. Raise it only when a from-scratch piece misses twice. Use fast mode for iteration sprints when speed matters more than cost.
