---
name: product-motion
description: Make a directed, frame-exact motion video for a product (launch film, product shot, logo reveal, promo loop) with Claude writing code that draws every frame. Use whenever the user wants a product video, launch video, promo loop, logo animation or motion graphics for X, TikTok or a site.
---

# Product Motion

Claude does not generate pixels. It writes a program (usually one HTML file) where every frame is a pure function of time `t`. A headless browser freezes the page at each frame, saves PNGs, and ffmpeg turns them into MP4 or GIF. This makes every frame reproducible, every edit a one-number change, and every frame checkable by Claude itself.

The quality comes from **direction**, not from the model. Adjectives ("premium", "cool", "modern") are where the generic AI look lives. Every adjective replaced with a number is a decision taken back from the model.

## Workflow

Follow these steps in order. Do not skip the intake or the QA loop.

### 1. Intake (ask once, in one message)

Collect what you cannot decide alone. Fill gaps with the defaults in brackets and say which you used.

- **Product**: name, what it is, one-line promise. Logo or screenshots? (ask for files)
- **Goal**: what the viewer should feel or do, in one sentence. If this cannot be written, stop and ask.
- **Where it goes**: X post, X Article GIF, TikTok/Reels, site hero [X post]
- **Canvas**: 1920x1080 (16:9), 1080x1080 (1:1), 1080x1350 (4:5), 1080x1920 (9:16) [1080x1080]
- **Length / loop**: [6 s seamless loop, 60 fps]
- **Brand**: colors in hex, one accent, typeface [ask; else a neutral warm palette with one accent]
- **Style**: 2D type/UI, 3D product shot, character/mascot, data story
- **Words on screen**: exact text, or none
- **Sound**: yes/no [yes, synthesized in code]

### 2. Pick the engine

Read `references/engines.md`. Rule of thumb:
- One idea, under 10 s, type/shapes/UI → plain HTML + CSS/Canvas
- Anything 3D (product shot, object, mascot) → three.js 0.160.0 pinned via jsdelivr importmap
- A series, template, longer film, data-driven → Remotion
- Thinks in web pages + GSAP → HyperFrames

### 3. Write the directed prompt

Fill `templates/directed-prompt.md` completely. Every line removes one decision the model would make by default. Required lines: GOAL, OUTPUT, TIME, LOOK, MOTION, SHOTS, BANNED, QA (plus MODEL and CAMERA for 3D). Use the numbers in `references/motion-numbers.md`. Apply the principles in `references/animation-principles.md`. Always append `templates/render-contract.md`.

Show the user the filled prompt before building if it is their first video with this skill, or if any intake answer was guessed.

### 4. Build

Write the HTML. It must expose `window.renderAt(t)`, honor `?t=` (paste `scripts/freeze-snippet.html` before `</body>`), set `window.__ready = true` after fonts and assets load, and use only the tokens in `scripts/motion.js` for easing, springs, durations and stagger. No inline magic numbers for motion.

For 3D, check `references/fixes.md` for known three.js traps before writing (e.g. r160 TextGeometry reads `height`, not `depth`).

### 5. The lab loop: render, look, fix

Read `references/lab-loop.md`. Summary:
1. `node scripts/render.mjs anim.html <secs> <fps> <W> <H>` renders every frame to `out/frames/`.
2. `bash scripts/contact-sheet.sh` makes a 4x3 storyboard. Open it and stills around every hit.
3. Describe each still in one sentence as a viewer would. Compare with the SHOTS list.
4. Write notes with **frame numbers and numbers**, never feelings ("drop overshoots 8 px out of frame at 112", not "feels off").
5. Fix only what the notes name. Re-render. Repeat 2 to 4 rounds.

Check every transition frame by frame, and check the loop seam (frame N-1 must flow into frame 0). Pick one or two review prompts per round, not all at once.

### 6. Sound

Read `references/sound.md`. One separate prompt scored against frame numbers, every sound synthesized with the Web Audio API (no samples). Each hit peaks 1 frame after its picture. -14 LUFS, -1 dBTP (limit the WAV to about -2.2 dBTP so the AAC encode stays under -1). Verify by measuring the decoded audio, not by listening.

### 7. Export and deliver

Read `references/export.md`. Run `bash scripts/export.sh` for MP4 (H.264 High, yuv420p, faststart), GIF (single palette) and a 3x loop check. Respect X limits (GIF 15 MB, 350 frames, 1280x1080 max).

Deliver: the final MP4/GIF, the HTML source, the exact prompt, and every follow-up in order (the "receipts"). Suggest posting the prompt and follow-ups in the first reply.

## Hard rules

- Every frame is a pure function of `t`. No `Date.now`, no timers, no unseeded `Math.random`, no CSS transitions.
- Loops render frames 0 to N-1, never N. Drive loops from `phase = frame / N` with whole-number cycles.
- One hero move per shot. Secondary moves travel 50 to 70% as far and start 100 to 200 ms later. Ambient motion under 5% of hero travel.
- Enter with ease-out, exit with ease-in (exits 40 to 50% shorter), cross-screen moves with ease-in-out. Linear only for rotation, progress bars, loop phase.
- Position and scale may bounce. Opacity and color never do.
- Text holds at least 0.3 s per word + 0.5 s. Text never moves while being read. 4.5:1 contrast on every frame. Never more than 3 flashes per second.
- Ban list starts with `templates/ban-list.md` and grows: after every first render, name the defaults the model used anyway and add them.
- Picture must work muted. Feeds autoplay silent.
- Never claim "one prompt". Count and print every follow-up.

## Files

- `templates/directed-prompt.md` — the prompt template with a filled product example
- `templates/render-contract.md` — paste under every motion prompt
- `templates/ban-list.md` — starting ban list
- `templates/review-prompts.md` — follow-ups that work, and feeling-to-number translations
- `references/motion-numbers.md` — easing, springs, durations, stagger, beat grid, holds, camera
- `references/animation-principles.md` — the principles written as frames and sizes
- `references/engines.md` — three.js, Remotion, HyperFrames, GSAP, Motion, plain HTML
- `references/lab-loop.md` — render, look, fix in detail; numeric audits
- `references/sound.md` — sound prompt template and measurement-driven fixes
- `references/export.md` — MP4, GIF, X limits, GIF timing trap
- `references/fixes.md` — symptom → fix table, plus three.js and audio traps
- `scripts/render.mjs` — frame-exact renderer (Playwright), optional GPU and motion blur
- `scripts/freeze-snippet.html` — `?t=` frame freeze
- `scripts/motion.js` — motion tokens and pure spring function
- `scripts/contact-sheet.sh`, `scripts/export.sh`, `scripts/setup.sh`
