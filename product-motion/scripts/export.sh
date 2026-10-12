#!/usr/bin/env bash
# export.sh [fps] [frames_dir] [audio.wav]
# Writes out/anim.mp4 (H.264 High, yuv420p, faststart), out/anim.gif (one palette, 1200 wide, 25 fps),
# out/loop_check.mp4 (3 loops), and out/final.mp4 if an audio file is given.
set -euo pipefail
FPS="${1:-60}"
DIR="${2:-out/frames}"
WAV="${3:-}"
mkdir -p out

ffmpeg -y -loglevel error -framerate "$FPS" -i "$DIR/%04d.png" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -movflags +faststart out/anim.mp4

ffmpeg -y -loglevel error -framerate "$FPS" -i "$DIR/%04d.png" \
  -vf "fps=25,scale=1200:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  -loop 0 out/anim.gif

ffmpeg -y -loglevel error -stream_loop 2 -i out/anim.mp4 -c copy out/loop_check.mp4

if [ -n "$WAV" ]; then
  ffmpeg -y -loglevel error -i out/anim.mp4 -i "$WAV" -map 0:v -map 1:a \
    -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/final.mp4
  echo "out/final.mp4 (with audio)"
fi

GIF_BYTES=$(stat -c%s out/anim.gif 2>/dev/null || stat -f%z out/anim.gif)
GIF_FRAMES=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 out/anim.gif || echo "?")
echo "out/anim.mp4"
echo "out/anim.gif: $((GIF_BYTES/1024)) KB, $GIF_FRAMES frames (X limits: 15 MB, 350 frames, 1280x1080)"
echo "out/loop_check.mp4: watch the seam 2 times"
