# Sound

Feeds autoplay muted, so the picture must work silent first. Sound is a separate prompt written against frame numbers, after the picture is locked.

Claude cannot hear. Every sound is synthesized in code (Web Audio API, rendered offline with OfflineAudioContext), and every check is a measurement of the decoded audio.

## Sound prompt template

```
Score this <secs> s loop (<N> frames at <fps> fps). Synthesize everything in code with the Web Audio API, no samples, no downloads. Each hit lands 1 frame after its visual event, and so does the bed.
Bed: <BPM> BPM, <bars/time signature>, kick on <frames>, shaker <pattern> only where no hit plays, bass and pad on <chords>.
Events:
  <frame or range>: <sound> (e.g. anticipation inhale peaking at 84, whoosh 84 to 112, snap at 60: click + 880 Hz body + 120 Hz thump, pour bloops rising through a pentatonic scale at ..., metallic ting at 200 with partials under 8 kHz, shimmer panned L to R, merge blups, final gloop at 337).
Hits 3 to 6 dB over the bed (K-weighted, first 60 ms). Nothing above 8 kHz on tings. Mono-safe.
48 kHz stereo WAV, about -14 LUFS, true peak limited to -2.2 dBTP (so the AAC MP4 stays under -1). Seamless loop, no click at the seam. Subtract each channel's DC mean. Mux into the MP4 and check every hit in the decoded audio.
```

## Measurement-driven fixes (they will come up)

| Measured problem | Fix |
|---|---|
| Hits peak 3 to 11 ms late | No waveshapers on tonal hits; start every body in cosine phase with a 0.5 to 1 ms attack so the first waveform peak sits exactly on (frame + 1) * samples_per_frame |
| Kick's second lobe louder than first | 3 ms transient (falls to 65% within 3 ms), shorter knock decay (4 ms) |
| 80% of energy under 60 Hz, phones play nothing | play bass an octave up (~100 to 130 Hz), open filter to 900 to 1200 Hz, shorter kick with a ~190 Hz knock, pad up and brighter |
| Hits only 0.5 to 2 dB over bed | measure each hit stem minus bed stem in the 200 Hz to 6 kHz phone band; adjust each to 3 to 6 dB |
| Limiter takes > 1.5 dB off a hit | partials and kick crest on the same sample; lower the kick under it, adjust harmonic phases, keep the peak on its frame |
| AAC lifts true peak above -1 dBTP | limit the WAV to about -2.2 dBTP |
| MP4 audio has ~16 ms codec padding at the seam | keep the seamless WAV as master; for a single-loop MP4 add a 2 ms raised-cosine fade to the first and last 96 samples |
| Gain node starts at full volume | set gain at time 0 explicitly before ramps |
| Compressor adds ~6 ms delay | compensate offsets or skip the compressor on hit buses |

## Mux

```bash
ffmpeg -i out/anim.mp4 -i out/score.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/final.mp4
```

With separate music and sfx:

```bash
ffmpeg -i out/anim.mp4 -i music.wav -i sfx.wav -filter_complex "[1:a][2:a]amix=inputs=2:duration=first,loudnorm=I=-14:TP=-1:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/final.mp4
```

Verify: decode the final MP4 audio, find each hit's peak sample, report offset from frame + 1 in ms. Target 0 to 1.3 ms.
