#!/usr/bin/env bash
# contact-sheet.sh [frames_dir] [every_n] [cols] [rows]
# Makes out/contact.png: every Nth frame tiled, a storyboard Claude can read in one image.
set -euo pipefail
DIR="${1:-out/frames}"
EVERY="${2:-30}"
COLS="${3:-4}"
ROWS="${4:-3}"
mkdir -p out
ffmpeg -y -loglevel error -i "$DIR/%04d.png" \
  -vf "select='not(mod(n\,$EVERY))',scale=400:-1,drawtext=text='f%{eif\:n*$EVERY\:d}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile=${COLS}x${ROWS}" \
  -frames:v 1 out/contact.png 2>/dev/null || \
ffmpeg -y -loglevel error -i "$DIR/%04d.png" \
  -vf "select='not(mod(n\,$EVERY))',scale=400:-1,tile=${COLS}x${ROWS}" \
  -frames:v 1 out/contact.png
echo "out/contact.png (every ${EVERY}th frame, labeled with frame numbers)"
