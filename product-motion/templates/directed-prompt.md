# Directed motion prompt template

Fill every line. A line left empty is a decision handed back to the model's default look.

```
GOAL: <what the viewer should feel or do, one sentence>
OUTPUT: <one self-contained HTML file | Remotion composition | HyperFrames>, <W>x<H>, <libraries pinned to versions>
TIME: <seconds> s x <fps> fps = <frames> frames. Loop: <yes/no>. <BPM> BPM (1 beat = fps*60/BPM frames). Hits land on beats.
MODEL (3D only): <units>, every part with sizes, bevels, radii, splits. What must never change (proportions guardrail).
LOOK: palette in hex, one accent and where it is allowed; materials (roughness, metalness, clearcoat); typeface + weight + size + tracking; backdrop; lights (color, strength, position); reflections; tone mapping, vignette %, grain % seeded per frame.
MOTION: easing as cubic-bezier, springs as damping ratio + Hz, durations in frames, stagger in frames.
SHOTS:
  <t0> to <t1> s: <one hero move>. Handoff: <cut on beat | match cut | mask wipe>.
  ...
CAMERA (3D or parallax): fov, distance, orbit range and easing, push-ins (time, curve, duration), elevation. Never parked.
BANNED: <ban list, by name>
QA: renderAt(t) draws exactly time t, seeded noise only. Stills around every hit and every transition; contact sheet; frame N-1 flows into frame 0. Fix, then full render.
```

Then paste `render-contract.md` under it.

## Order of writing

1. GOAL first. If it cannot be said in one sentence, no easing curve will save the piece.
2. TIME next. Every other number hangs off the frame count.
3. SHOTS: frame range, one hero move, how it hands off. Default to the hard cut. A transition must be a decision.
4. BANNED last, and keep extending it after each render.

## Adjective → number translations

| Adjective | Becomes |
|---|---|
| premium | named materials (e.g. satin ceramic roughness 0.38 + clearcoat 0.35, chrome roughness 0.05), accent only in one place, springs at damping 0.7 to 0.85 |
| cool | a studio: key, fill, rim with exact colors and strengths, reflections from an environment built in code, soft contact shadows, no glow |
| modern | a camera: 30 degree fov, never parked, slow orbit, one push-in on ease-out-expo at a named time |
| animation | beats and springs: BPM, anticipation frames before the hero move, damping ratios per part |

## Filled example: 3D product shot (wireless earbuds, 6 s loop)

```
GOAL: a studio product film: case opens, buds rise to the viewer, everything clicks shut.
OUTPUT: one self-contained HTML file, three.js 0.160.0 from jsdelivr (importmap), 1080x1080.
TIME: 6 s loop, 60 fps = 360 frames, 120 BPM (1 beat = 30 frames). Hits land on beats.
MODEL (1 unit = 1 cm, primitives with bevels): case 6.0 x 4.6 x 2.2, edge radius 1.0, split at 3.3, back-hinged lid, 0.06 split bevel, thin chrome trim on the seam. Inside: accent-colored deck, two dark wells. Buds: ellipsoid head, short nozzle with flattened silicone cap, stem on the outer side with chrome end cap, grille as a slim slot on the stem. Seated heads sit flush with the deck.
LOOK: satin white F4F1EC (roughness 0.38, clearcoat 0.35), chrome (metalness 1, roughness 0.05), accent D97757 on the deck only (roughness 0.7), ink 1C1B1A. Backdrop F0EDE8 center to DEDAD3 corners, dithered. Key FFF4E8 3.0 upper front left, soft shadows; fill E8EEF5 0.6 low right; rim FFFFFF 4.0 upper back right. Reflections from a studio environment built in code (dim dome, overhead and key softboxes, a glint strip in reflections only). Contact shadows 0.55. Neutral tone mapping, 8% vignette, 2% grain seeded per frame.
SHOTS:
  0.0 to 0.5 s: a 2.4-wide reflection strip sweeps left to right across the closed lid.
  0.72 to 0.95 s: anticipation: lid presses 1.5 degrees shut, case squashes 2%, hold 3 frames.
  1.0 s: lid springs to 100 degrees (damping 0.6, ~10% overshoot, settled by 1.4 s).
  1.5 s: buds rise 4.0 out of the wells, right first, left 4 frames later (damping 0.7). From rise frame 8 they tilt 14 degrees outward and turn 35 degrees to camera on a looser spring (damping 0.5).
  2.0 s: camera push-in.
  2.4 to 4.0 s: hold, buds float 0.05 on a 1 s sine, left 4 frames behind right. 3.0 s: second glint on the curved heads only.
  4.0 s: buds straighten (0.2 s) and descend (ease-in-out-cubic, 0.45 s), seat with a 0.05 magnetic dip.
  4.75 s: lid falls (ease-in-cubic), shuts exactly at 5.0 s, bounces 3 degrees, settles by 5.3 s; case recoils 1.5%.
  5.5 s: next glint starts (flows into frame 0).
CAMERA: fov 30, never parked. Azimuth 34 to 10 degrees and back (ease-in-out-sine / cubic). Distance creeps 21 to 20.2, pushes to 16 at 2.0 s (ease-out-expo, 0.8 s), dolly creep 0.4 during the hold, returns by 5.6 s. Elevation 12 to 19 degrees as buds rise.
BANNED: purple or blue gradients, glow orbs, bloom, neon, lens flares, particles, spinning turntables, dark backgrounds, text.
QA: renderAt(t) draws exactly time t, seeded noise only. Stills around every hit; frame 359 flows into frame 0.
```

## Filled example: 2D logo / title reveal (plain HTML, 6 s loop)

```
GOAL: the viewer reads "<PRODUCT>" and its one-line promise and remembers the accent color.
OUTPUT: one self-contained HTML file, CSS + Canvas 2D, Google Font <Font> 700, 1080x1080.
TIME: 6 s loop, 60 fps = 360 frames, 120 BPM (30 frames per beat).
LOOK: background F4F2EE paper, ink 141414, accent <HEX> on the period and underline only. Wordmark 160 px, tracking -0.03 em; promise 40 px, 400 weight.
MOTION: tokens from motion.js only. Letters 1 frame apart. Enter ease-out-expo, exit ease-in-expo at half the duration.
SHOTS:
  0 to 30: accent dot drops from above on an arc, squash 1.25x0.7 on landing at frame 30 (beat 1).
  30 to 60: dot stretches into the underline (ease-in-out-quart, 18 frames).
  60 to 90: wordmark letters rise 24 px left to right, 1 frame apart, spring damping 0.8.
  90 to 270: hold with a 2% push. Promise fades in at 120 (hold rule: 0.3 s/word + 0.5 s).
  270 to 330: everything exits up (ease-in-expo, 12 frames per element, 3 frames stagger), underline shrinks back to the dot.
  330 to 359: dot rises out of frame, frame 0 resumes the drop.
BANNED: (see ban-list.md) + glow, fade-and-slide-up on every element.
QA: stills at 0, 30, 60, 90, 120, 270, 330, 359; contact sheet; seam check.
```
