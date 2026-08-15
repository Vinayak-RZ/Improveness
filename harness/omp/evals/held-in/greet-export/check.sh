#!/usr/bin/env bash
set -euo pipefail
rg -q 'export function greet' src/greet.ts
