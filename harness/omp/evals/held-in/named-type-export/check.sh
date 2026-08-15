#!/usr/bin/env bash
set -euo pipefail
rg -q 'export type User' src/types.ts
