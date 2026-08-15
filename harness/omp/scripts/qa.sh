#!/usr/bin/env bash
# Repository QA: overlay gate + CACD catalog + agentic architecture simulations.
set -euo pipefail
root="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$root"
export PATH="${HOME}/.bun/bin:${PATH}"

echo "== overlay validate.sh =="
bash harness/omp/scripts/validate.sh

echo "== CACD / repo QA =="
bun harness/omp/drivers/qa-repo.ts

echo "== agentic architecture simulations =="
bun harness/omp/drivers/simulate-architectures.ts harness/omp/evals/simulations/latest

echo "qa.sh ok"
