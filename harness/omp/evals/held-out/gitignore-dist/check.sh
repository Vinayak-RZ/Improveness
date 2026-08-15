#!/usr/bin/env bash
set -euo pipefail
rg -q '^dist$' .gitignore
