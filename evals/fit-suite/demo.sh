#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
export PATH="${HOME}/.bun/bin:${PATH}"
echo "== ModelTaste keyless demo =="
bun test packages/improveness-modeltaste/test evals/fit-suite/fit-suite.test.ts
bun evals/fit-suite/write-comparison.ts 2>/dev/null || true
cat evals/fit-suite/results/keyless-comparison.md
