#!/usr/bin/env bash
set -euo pipefail
rg -q 'export function sum' src/math.ts
