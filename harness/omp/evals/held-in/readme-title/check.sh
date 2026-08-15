#!/usr/bin/env bash
set -euo pipefail
head -n 1 README.md | rg -q '^# '
