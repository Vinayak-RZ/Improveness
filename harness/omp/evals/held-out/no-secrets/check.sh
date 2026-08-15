#!/usr/bin/env bash
set -euo pipefail
if rg -q 'sk-[A-Za-z0-9]{8,}' src/config.ts; then
  exit 1
fi
rg -q 'process\.env' src/config.ts
