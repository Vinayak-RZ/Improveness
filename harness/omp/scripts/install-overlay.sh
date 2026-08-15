#!/usr/bin/env bash
# Merge Improveness overlay files into the in-tree OMP project .omp/ directory.
# Does not replace oh-my-pi/.omp (upstream already ships commands/skills there).
set -euo pipefail
root="$(cd "$(dirname "$0")/../../.." && pwd)"
src="$root/harness/omp/overlay/.omp"
dest="${OMP_OVERLAY_DEST:-$root/oh-my-pi/.omp}"
if [[ ! -d "$src" ]]; then
  echo "missing overlay: $src" >&2
  exit 1
fi
mkdir -p "$dest"
# Copy only Improveness-owned trees. Never delete upstream commands/ or skills/.
cp -a "$src/AGENTS.md" "$dest/AGENTS.md"
cp -a "$src/README.md" "$dest/IMPROVENESS-OVERLAY.md"
mkdir -p "$dest/playbook" "$dest/hooks" "$dest/agents" "$dest/manifests"
cp -a "$src/playbook/." "$dest/playbook/"
if [[ -d "$src/hooks" ]]; then
  cp -a "$src/hooks/." "$dest/hooks/"
fi
if [[ -d "$src/agents" ]]; then
  cp -a "$src/agents/." "$dest/agents/"
fi
echo "merged overlay into $dest (upstream commands/skills preserved)"
