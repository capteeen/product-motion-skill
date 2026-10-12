# Motion numbers

Give the model curves and frames, not adjectives.

## Easing (cubic-bezier, standard easings reference)

| Name | cubic-bezier | Use for |
|---|---|---|
| ease-out-expo | 0.16, 1, 0.3, 1 | text and logo reveals |
| ease-out-quint | 0.22, 1, 0.36, 1 | premium entrances |
| ease-in-out-quart | 0.76, 0, 0.24, 1 | moves and camera pushes |
| ease-in-expo | 0.7, 0, 0.84, 0 | fast exits |
| ease-out-back | 0.34, 1.56, 0.64, 1 | playful pop with overshoot |

Rules:
- Enter with ease-out. Exit with ease-in, 40 to 50% shorter (e.g. 400 ms in, 200 ms out).
- Cross-screen moves: ease-in-out.
- Linear only for rotation, progress bars and loop phase. Linear on a move makes a render look like a render.

## Springs (damping ratio)

One number translates between all libraries: `zeta = d / (2 * sqrt(k * m))`.

| zeta | Feel |
|---|---|
| 1.0 | no bounce |
| 0.7 to 0.85 | premium |
| 0.4 to 0.6 | playful |
| < 0.3 | cartoon |

- Remotion default (mass 1, damping 10, stiffness 100) ≈ 0.5. react-spring default (tension 170, friction 26) ≈ 1.0.
- Position and size may bounce. Opacity and color never do.
- Use the closed-form `spring(t, zeta, hz)` in `scripts/motion.js` so any frame renders on its own.

## Durations and stagger

| Thing | Value |
|---|---|
| UI feedback | 100 to 200 ms (100 ms feels instant) |
| UI moves | 200 to 500 ms |
| Hero reveal | 600 to 900 ms |
| Letters | 1 frame apart |
| Words | 60 to 120 ms |
| List items | 40 to 80 ms |
| Overlap | start the next element when the previous is 30 to 50% done |

In frames: at 24 fps one frame ≈ 42 ms (400 ms = 10 frames, 750 ms = 18). At 60 fps one frame ≈ 16.7 ms.

## Beat grid

`frames per beat = fps * 60 / BPM`. 120 BPM at 24 fps = 12; at 60 fps = 30. 128 BPM at 30 fps = 14.06, so compute each beat as `round(n * 60 / BPM * fps)`. Never keep adding a rounded number: after 32 beats you drift 2 frames.

Cut on the beat. Change layout on the bar (every 4 beats). Changing everything every beat exhausts the viewer.

## Hierarchy

- One hero move per shot.
- Secondary: 50 to 70% of the hero's travel, starts 100 to 200 ms after it.
- Ambient: under 5% of hero travel, slow sine, never stops.
- Everything else waits, dims to 40%, or holds.

## Holds

On-screen text: at least 0.3 s per word + 0.5 s (two words = 1.1 s). During a hold, a slow 2% push keeps the frame alive while text stays readable.

## Camera

- Softest curves (ease-in-out-quart, sine) for camera; snappier curves for objects.
- 3D fov starting points: 30 degrees for product hero shots, 35 to 50 for scenes.
- Parallax speeds: foreground 1.0, middle 0.5, background 0.2.
- Never parked: slow orbit or dolly creep during holds.

## Phone-size exaggeration

The feed shrinks everything. Push key poses 10 to 30% further than feels right.

## Accessibility

Text at 4.5:1 contrast on every frame, including over moving backgrounds. Never more than 3 flashes per second (WCAG).
