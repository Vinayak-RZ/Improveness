#!/usr/bin/env bash
set -euo pipefail
rg -q "export \{ apiKey \} from './config'" src/index.ts
if rg -q 'sk-[A-Za-z0-9]{8,}' src; then exit 1; fi
