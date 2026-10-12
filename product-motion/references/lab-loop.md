# The lab loop: render, look, fix

The first render is a draft. Two to four review rounds is normal. Real pieces take 4 to 15 creative follow-ups.

## Round structure

1. **Render** all frames: `node scripts/render.mjs anim.html 6 60 1080 1080`
   - Fast drafts: 24 fps, software render.
   - Finals: `--gpu` and `--blur 4` (motion blur from subframes over half a frame, 180-degree shutter, blended in linear light).
2. **Look**:
   - `bash scripts/contact-sheet.sh out/frames 60` → `out/contact.png` (every 60th frame at 60 fps, adjust to give 12 tiles).
   - Open stills around every hit and every transition with Read.
   - For a single frame: open `anim.html?t=2.5`.
3. **Describe** each still in one sentence as a viewer would. Compare with SHOTS.
4. **Note**: symptom + frame number + measured amount + exact change.
5. **Fix** only what the notes name. Re-render only the affected range if possible.

## What to check every round

- Each transition frame by frame (pops, early vanishes, inflation, things leaving frame).
- Loop seam: render frames N-2, N-1, 0, 1 side by side.
- Hierarchy: frames where two things move at once.
- Materials read as intended (chrome reads as chrome, white reads white not gray, accent reads right).
- Text: contrast, hold time, no motion while readable.

## Measure, don't guess

- Pixel diffs: count pixels that change with an effect on vs off. A "glint" that changes 180K pixels is a flood light.
- Onion skin: stack frames at 25% opacity. Even spacing = robotic. Spacing that tightens near keys = easing works.
- Speed graph: plot position per frame. Straight lines = linear. Sharp corners = dead starts/stops.
- Numeric audit: read the live scene state on every frame (positions, scales, which label is lit) and compare against the prompt's numbers. List pass/fail per check. Fix every fail before the final render.

## Freezing a frame

Paste `scripts/freeze-snippet.html` before `</body>`. Then `anim.html?t=2.5` shows exactly t = 2.5 s.

## Receipts

Log every creative follow-up (changes how it looks or moves) and every technical fix separately. Deliver both with the video.
