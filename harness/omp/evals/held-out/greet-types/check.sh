#!/usr/bin/env bash
set -euo pipefail
rg -q 'export function greet\(name: string\): string' src/greet.ts
