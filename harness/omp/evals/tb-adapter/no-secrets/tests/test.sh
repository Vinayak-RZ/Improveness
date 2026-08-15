#!/usr/bin/env bash
set -euo pipefail
# Runs the frozen Improveness checker for this fixture against the current workspace.
root="$(cd "$(dirname "$0")/.." && pwd)"
check="$(cd "$(dirname "$0")" && pwd)/../../../held-out/no-secrets/check.sh"
bash "$check"
