#!/usr/bin/env bash
# Sync README + copywriting skills into ~/.cursor/skills and local repos
# that already have those folders. On Windows this calls the PowerShell
# script so junctions are detected correctly.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v powershell.exe >/dev/null 2>&1; then
  exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$DIR/sync-coding-skills.ps1" "$@"
fi

ROOT="$(cd "$DIR/.." && pwd)"
SRC="$ROOT/.cursor/skills"
GLOBAL="${HOME}/.cursor/skills"
SKILLS=(copywriting readme product-readme readable-readme extensive-readme)
SEARCH_ROOTS=("${@:-$HOME/Startups}")

sync_into() {
  local dest="$1"
  mkdir -p "$dest"
  for s in "${SKILLS[@]}"; do
    rm -rf "$dest/$s"
    cp -R "$SRC/$s" "$dest/$s"
  done
}

echo "Source: $SRC"
sync_into "$GLOBAL"
echo "Updated global $GLOBAL"

is_source_clone() {
  [[ "$(basename "$1")" == "cursor-config-coding" ]]
}

has_our_skills() {
  local d="$1/.cursor/skills"
  for s in "${SKILLS[@]}"; do
    [[ -d "$d/$s" ]] && return 0
  done
  return 1
}

for search in "${SEARCH_ROOTS[@]}"; do
  [[ -d "$search" ]] || continue
  find "$search" \( -name node_modules -o -name external -o -name .git \) -prune -o -name .git -type d -print 2>/dev/null \
    | while read -r gitdir; do
        repo="$(dirname "$gitdir")"
        [[ "$repo" == "$ROOT" ]] && continue
        is_source_clone "$repo" && continue
        has_our_skills "$repo" || continue
        if [[ -L "$repo/.cursor" ]]; then
          echo "junctioned: $repo"
          continue
        fi
        echo "update: $repo"
        sync_into "$repo/.cursor/skills"
      done
done
