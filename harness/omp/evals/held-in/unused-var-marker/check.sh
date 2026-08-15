#!/usr/bin/env bash
set -euo pipefail
rg -q 'const _leftover' src/unused.ts
