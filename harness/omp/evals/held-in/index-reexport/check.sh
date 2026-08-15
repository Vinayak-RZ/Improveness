#!/usr/bin/env bash
set -euo pipefail
rg -q "export \{ greet \} from './greet'" src/index.ts
