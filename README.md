# product-motion — a Claude skill for product videos made in code

Give Claude your product, get a directed, frame-exact motion video: launch films, 3D product shots, logo reveals, promo loops for X and TikTok. Picture and sound are both code, so every frame is reproducible and every edit is one number.

Built from the "Opus 5.5 Motion Lab" method: replace adjectives with numbers, render stills, fix by frame number, score sound against frames, export to platform limits.

## Install

**Claude Code** (personal, all projects):
```bash
git clone https://github.com/capteeen/product-motion-skill.git
mkdir -p ~/.claude/skills
cp -r product-motion-skill/product-motion ~/.claude/skills/
```
Per project instead: copy `product-motion/` into `.claude/skills/` in that repo.

**Claude app**: zip the `product-motion` folder and upload it in Settings → Capabilities → Skills.

**Lab tools** (once per machine, for rendering):
```bash
bash ~/.claude/skills/product-motion/scripts/setup.sh   # Node, ffmpeg, Playwright, sharp
```
Windows: `winget install OpenJS.NodeJS.LTS`, `winget install Gyan.FFmpeg`, then `npm i -D playwright sharp` and `npx playwright install chromium` (use `npx.cmd` if PowerShell blocks `npx`).

## Use

Just ask:
> Make a 6 second launch loop for my product Work Proxy, 1080x1080 for X. Brand color 1F7A5C.

Claude runs the intake, writes a directed prompt, builds the HTML, renders, reviews its own frames, fixes by frame number, adds synthesized sound, and exports MP4 + GIF with the prompt and every follow-up as receipts.

## What's inside

```
product-motion/
  SKILL.md                      workflow + hard rules
  templates/
    directed-prompt.md          GOAL/OUTPUT/TIME/LOOK/MOTION/SHOTS/BANNED/QA, with filled 3D and 2D examples
    render-contract.md          pasted under every prompt
    ban-list.md                 the default AI look, banned by name
    review-prompts.md           follow-ups that work, feeling → number table
  references/
    motion-numbers.md           easing, springs, durations, stagger, beat grid, holds, camera
    animation-principles.md     anticipation, squash/stretch, overlap, follow-through, arcs as frames
    engines.md                  three.js, Remotion, HyperFrames, GSAP, Motion, plain HTML
    lab-loop.md                 render → look → fix, pixel diffs, numeric audits
    sound.md                    Web Audio scoring prompt + measured fixes
    export.md                   MP4, GIF, X limits, GIF timing trap
    fixes.md                    symptom → fix, three.js and audio traps
  scripts/
    render.mjs                  frame-exact renderer (local server, --gpu, --blur N, --from/--to)
    motion.js                   motion tokens, pure spring(), seeded rng, loop noise
    freeze-snippet.html         open anim.html?t=2.5 to see that exact frame
    contact-sheet.sh            12-frame storyboard with frame labels
    export.sh                   MP4 + GIF + loop check (+ audio mux)
    gif_retime.py               exact GIF timing at 24 fps
    setup.sh                    one-time lab install
  examples/
    logo-loop.html              working 2D starter (6 s, 60 fps, 120 BPM)
```

## Quick test

```bash
cd ~/.claude/skills/product-motion
node scripts/render.mjs examples/logo-loop.html 6 60 1080 1080
bash scripts/contact-sheet.sh out/frames 30
bash scripts/export.sh 60
```
If Playwright can't download Chromium, point it at an installed Chrome: `CHROME_PATH=/path/to/chrome node scripts/render.mjs ...`

## Credits

Method distilled from Florence (@flxrnc), "Opus 5.5 Motion Lab", Sep 30 2026. Numbers from the Easings reference (Andrey Sitnik), Material 3, Nielsen Norman Group and WCAG. Principles from Thomas and Johnston, *The Illusion of Life* (1981).
