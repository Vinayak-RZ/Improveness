#!/usr/bin/env bash
set -euo pipefail
rg -q '"strict": true' tsconfig.json
