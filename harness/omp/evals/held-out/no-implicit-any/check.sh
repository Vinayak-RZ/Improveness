#!/usr/bin/env bash
set -euo pipefail
rg -q '"noImplicitAny": true' tsconfig.json
