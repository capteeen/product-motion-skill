# Animation principles as numbers

From Thomas and Johnston's 12 principles (The Illusion of Life, 1981). Five do most of the work in a short product loop. Write each as frames and sizes.

| Principle | What it does | Write it as |
|---|---|---|
| Anticipation | winds up before the move | "11-frame crouch, scale 1.2x0.75" / "lid presses 1.5 degrees shut, case squashes 2%, hold 3 frames" |
| Squash and stretch | weight and speed | "stretch 0.85x1.28 at takeoff, squash 1.25x0.7 on landing" (keep volume roughly constant) |
| Overlapping action | parts start later than the body | "arms lag 4 frames, legs 6" / "left bud 4 frames after right" |
| Follow-through | parts keep moving after the body stops | "arms settle at 2.2 Hz, damping 0.22" / "stems swing through on a looser spring (damping 0.5)" |
| Arcs | natural paths | "flies along an arc 0.2 up, overshoots 7%" / "flip along a dotted arc 3.5 high" |
| Slow in / slow out | accelerate and settle | "spring back at damping 0.55" |
| Timing | frame count sets weight | "25 frames of air per hop", "18-frame deep crouch before the big move" |

Also:
- **Staging** = the one-hero rule.
- **Exaggeration**: push key poses 10 to 30% for phone size.
- **Guardrail line**: state what may never change (exact proportions of a logo, mascot or product). This keeps the brand recognizable in 3D.

## Pin events to frames

Give every key event an exact frame (landings 105, 165, 225, 285...). Then QA can check them numerically: read the live scene on every frame and compare to the prompt. A move that runs late shows up as a failed check. On-screen labels or a playhead pinned to frames make lateness visible while iterating; switch them off for the final render.
