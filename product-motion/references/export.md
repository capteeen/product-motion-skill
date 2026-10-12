# Export

## Pick the canvas first

1920x1080 (16:9), 1080x1080 (1:1), 1080x1350 (4:5), 1080x1920 (9:16). X accepts 1:3 to 3:1. Changing canvas later means re-directing every shot.

## Loops

- Render frames 0 to N-1, never N.
- Drive everything from `phase = frame / N` with whole-number cycles (a square turns exactly 90 degrees per loop; a wave does exactly 2 cycles).
- Organic drift: sample noise along a circle so it returns to its start.
- Make frame 0 a finished composition. It is the thumbnail while a GIF loads.

## Commands (also in scripts/export.sh)

```bash
# MP4 for X / TikTok
ffmpeg -framerate 60 -i out/frames/%04d.png -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -movflags +faststart out/anim.mp4

# GIF for X Articles: one palette, 1200 px wide, 24 fps
ffmpeg -framerate 60 -i out/frames/%04d.png -vf "fps=24,scale=1200:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" -loop 0 out/anim.gif

# Loop check: three loops back to back, watch the seam
ffmpeg -stream_loop 2 -i out/anim.mp4 -c copy out/loop_check.mp4
```

## X limits

| Spec | GIF | Video |
|---|---|---|
| Size | 15 MB | up to 140 s without Premium |
| Frame size | up to 1280x1080 | 1920x1080 for 16:9 |
| Frames / speed | max 350 frames | up to 60 fps |
| Format | one palette, loop forever | H.264 High, yuv420p, AAC |
| Default | 1200 px wide, 24 fps | CRF 18, faststart |

At 24 fps the 350-frame cap = about 14.5 s. A 4 to 6 s loop is 96 to 144 frames.

## GIF timing trap

GIF delays are stored in hundredths of a second. 24 fps (41.7 ms) can't be stored exactly; rounding all to 40 ms runs 4% fast and drifts off the beat. Fix: five frames at 40 ms then one at 50 ms (6 s loop stays at 6.00 s). Easiest: export the GIF at 25 fps (40 ms is exact) or 20 fps (50 ms exact). If it must be 24 fps, run `python3 scripts/gif_retime.py out/anim.gif 24` which rewrites the delays in the 4-4-4-4-4-5 pattern.

## Recording without the renderer

In the Claude app: preview, download, open in Chrome, screen-record (Cmd+Shift+5 on Mac, Snipping Tool video on Windows). Fine for a first post, not frame-exact. Use the renderer for anything that matters.
