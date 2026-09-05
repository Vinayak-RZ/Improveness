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

echo "== ModelTaste package + fit-suite =="
bun test packages/improveness-modeltaste/test evals/fit-suite/fit-suite.test.ts

echo "== ModelTaste import-graph fence =="
if rg -n "from ['\"].*(plugins/|oh-my-pi/packages)" packages/improveness-modeltaste/src; then
  echo "improveness-modeltaste must not import hosts" >&2
  exit 1
fi

echo "== section disable matrix (taste) =="
bun -e '
import { parseSections, enabledToolNames } from "./plugins/dsh-improveness/src/sections.js";
const off = parseSections({ IMPROVENESS_TASTE: "0" });
if (off.taste) throw new Error("taste should be off");
if (enabledToolNames(off).some((n) => n.includes("taste"))) throw new Error("taste tools leaked");
const on = parseSections({});
if (!on.taste) throw new Error("taste should default on");
console.log("section matrix ok");
'

echo "qa.sh ok"
