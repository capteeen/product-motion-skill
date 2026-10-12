# Review prompts

Every follow-up points at frames and numbers, not feelings. Use one or two per round. Pasting all at once turns a fix into a rewrite.

## Follow-ups that work

```
Render stills at frames 0, 24, 48, 72 and 96. Describe each in one sentence as a viewer would. Does that match the shot list? Fix what does not.
```
```
Make a contact sheet of every 12th frame. Mark every frame where two things move at once, then fix the hierarchy.
```
```
Onion-skin frames 24 to 47 at 25% opacity. Spacing should tighten near the keys. Adjust the easing until it does.
```
```
Plot the hero's x position and scale per frame as a PNG chart. Show where the motion is linear or stops dead, then fix it with our tokens.
```
```
Review this like a senior motion designer: 10 notes ordered by impact, each with a frame number and the exact code change. Apply the top 5.
```
```
It is too busy. Remove 30% of the motion and keep only the moves that guide the eye.
```
```
The ending is abrupt. Add a 36-frame hold with a 2% push, then settle on a spring at damping ratio 0.8.
```
```
The fix at frame <F> did not hold. Render frames <F-1> and <F+1> side by side and list every difference. Find the line that causes it, fix only that line, render both again.
```
```
Check every transition frame by frame (<list frame ranges>). For each, note anything that pops, vanishes early, inflates or leaves the frame, with the frame number.
```
```
Measure, don't eyeball: how many pixels change when <effect> is on vs off? If it lights the whole face, it is a flood, not a glint. Keep it in reflections only.
```

## Feeling → number

| The note you got | What to send |
|---|---|
| "Make it pop" | scale 1.0 → 1.08 → 1.0 over 6 frames, peak on the beat |
| "Make it feel premium" | ease-out-quint entrances, springs at damping 0.8, no overshoot on text |
| "It drags" | shorten each hold by one beat (e.g. 12 frames at 120 BPM / 24 fps) so cuts stay on the grid |
| "It feels busy" | one hero move at a time; others start 150 ms later at 60% of its travel |
| "It looks like AI" | list the defaults it used by name, ban each, render again |
| "It reads as plastic" | darken the studio, give reflective faces something to reflect (a white cyc, a thin horizon strip), check fresnel/roughness |
| "Looks flat" | add a rim from behind, separate key and fill values, let unlit sides fall off |

## Example of a good note (real-world shape)

> The outer droplets leave the frame by 8 px around frame 112. Start them at 40% of their target position, ease the flight with u^2.4 so the 7% overshoot lands at 1.97 s, and dolly from 1.2 to 2.5 s.

Symptom, frame, measured amount, exact change.
