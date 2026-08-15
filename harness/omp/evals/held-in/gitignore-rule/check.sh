#!/usr/bin/env bash
set -euo pipefail
rg -q '^node_modules$' .gitignore
