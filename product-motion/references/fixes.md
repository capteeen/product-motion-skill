# Fixes

## Symptom → fix

| Symptom | Fix |
|---|---|
| Flicker or jitter | every value a pure function of t; seeded generator instead of Math.random; remove timers and CSS transitions |
| Wrong or fallback font | load font with display=block; await document.fonts.ready before the first frame; set __ready after |
| Hiccup at the loop seam | render 0 to N-1 only; drive from phase = frame / N with whole cycles |
| Audio drifts off beat | each beat = round(n * 60 / BPM * fps); never add a rounded frame count |
| Jank or dropped frames | animate only transform and opacity; no width/height/top/left |
| Banding in the GIF | flat colors, or dither the palette (bayer) |
| Blurry or shimmering text | snap resting text to whole pixels; render at 2x and scale down |
| Text moves before readable | hold 0.3 s per word + 0.5 s before it moves |
| Everything moves at once | one hero; others 150 ms later at 60% travel |
| A fix doesn't hold | render frames either side, list differences, fix the one line, re-render both |

## three.js traps (r160)

- `TextGeometry` reads `height` for extrusion depth. A `depth` param gets overwritten (to 50), so letters come out 50 deep. Pin the version and name `height`.
- White objects melt into a white backdrop: drop the environment dome to about a third, push softboxes so unlit sides fall off and chrome shows dark and bright bands.
- Chrome reads gray or plastic: it needs dark areas to reflect. Dark studio (0.1 gray) with a white cyc behind, black panel on camera side, a thin horizon strip for flat faces to catch.
- A glint strip that lights the whole face is a flood: keep it in reflections only (a second PMREM for the specular lookup, static studio for diffuse). Measure pixels changed on vs off.
- Glint hits flat faces too: raise its elevation so only curved surfaces cross the mirror direction.
- Flat round grilles / dots read as eyes. Use slim slots, move them off faces.
- Bevels fuse letters: space glyphs by measured outlines, not font advance.
- Mesh speckles on bevels: shade with the SDF gradient if mixing raymarched and mesh text, or crease normals at ~35 degrees.
- `mix(sphereSDF, letterSDF)` passes through flat coins. Instead reveal each letter inside a growing sphere (smooth max), shrink the droplet into it, join with smooth-min.
- Bumps popping onto blobs: grow child shapes from negative radius so their smooth-min pull fades in.
- Objects exit frame at overshoot: start closer, ease the flight, time the dolly.
- An anticipation hold one frame too long: a spring starting at rest on the beat makes the beat frame still the pressed pose. Release half a frame early.
- Motion blur: average 4 to 8 subframes over half a frame in linear light; jitter the camera a quarter pixel per subframe for AA.

## Audio traps

See `sound.md`. Most common: hits late from waveshapers or phase-0 sines, sub-bass energy that phones can't play, AAC raising true peak, codec padding at the seam.
