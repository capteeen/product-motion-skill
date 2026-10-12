#!/usr/bin/env bash
# setup.sh — one-time lab setup in the current project folder (macOS / Linux).
# Windows PowerShell: winget install OpenJS.NodeJS.LTS; winget install Gyan.FFmpeg; then run the npm lines (use npx.cmd if npx is blocked).
set -euo pipefail
if ! command -v node >/dev/null; then
  if command -v brew >/dev/null; then brew install node; else echo "Install Node.js LTS first"; exit 1; fi
fi
if ! command -v ffmpeg >/dev/null; then
  if command -v brew >/dev/null; then brew install ffmpeg
  elif command -v apt-get >/dev/null; then sudo apt-get install -y ffmpeg
  else echo "Install ffmpeg first"; exit 1; fi
fi
[ -f package.json ] || npm init -y >/dev/null
npm i -D playwright sharp
npx playwright install chromium
echo "Lab ready. Render with: node <skill>/scripts/render.mjs anim.html 6 60 1080 1080"
