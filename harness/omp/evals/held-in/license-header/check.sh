#!/usr/bin/env bash
set -euo pipefail
head -n 1 src/lib.ts | rg -q 'License'
