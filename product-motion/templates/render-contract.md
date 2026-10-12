# Render contract

Paste this under every motion prompt. Each line closes one way a render goes wrong.

```
RENDER CONTRACT
- Output one self-contained HTML file. Only the libraries this prompt names, pinned to a version.
- No network requests except fonts and those pinned libraries.
- Every frame is a pure function of time t, in seconds.
- Expose window.renderAt(t) that draws exactly that frame. With ?t= in the URL, never start requestAnimationFrame.
- Set window.__ready = true only after fonts, textures and any baking are done.
- Animate with CSS keyframes, the Web Animations API, SVG, Canvas 2D or WebGL. No CSS transitions.
- No Date.now, no performance.now for motion, no setTimeout or setInterval starts, no unseeded Math.random.
- All noise and motion periodic in the loop length. Grain seeded by frame index.
- Loops: render frames 0 to N-1 only; frame N-1 must flow into frame 0.
- Use only the tokens in motion.js for easing, springs, durations and stagger. No inline motion numbers.
- While iterating: a frame counter in a corner and space bar to pause. Remove both for the final render.
```

Why each line exists:
- A clock or timer makes frame 84 different on every run.
- Unseeded randomness makes shapes jitter between frames.
- Rendering frame N of a loop shows frame 0 twice: the hiccup at the seam.
- Unloaded fonts produce fallback-font frames at the start.

When a fix works in a project, add it here. The contract is the lab's memory.
