#!/bin/bash
# The drone loop behind "See you in the water.", in three versions. Run from the handoff folder when the clip changes:
#   tools/encode_video.sh new-clip.mp4          (no sound, 5 to 8 seconds, 640 to 960px wide, loops cleanly)
# Needs ffmpeg (brew install ffmpeg). Writes to site/assets/video/ (or OUT=...):
#   drone-loop.mp4        the video most visitors get          ~0.7MB
#   drone-loop-light.mp4  smaller picture for phones on 3G     ~0.2MB
#   drone-loop.webp       animated image, only when the browser blocks video autoplay (Low Power Mode, embeds)  ~0.7MB
set -e
IN=${1:?usage: tools/encode_video.sh clip.mp4}
OUT=${OUT:-site/assets/video}
FF=${FFMPEG:-ffmpeg}
X264="-an -c:v libx264 -preset slow -pix_fmt yuv420p -profile:v main -movflags +faststart"
"$FF" -v error -y -i "$IN" $X264 -crf 27 -vf "scale='min(960,iw)':-2" "$OUT/drone-loop.mp4"
"$FF" -v error -y -i "$IN" $X264 -crf 30 -vf scale=426:-2 "$OUT/drone-loop-light.mp4"
"$FF" -v error -y -i "$IN" -an -vf "fps=12,scale=480:-2:flags=lanczos" -c:v libwebp -lossless 0 -q:v 60 -compression_level 6 -loop 0 "$OUT/drone-loop.webp"
ls -la "$OUT"
