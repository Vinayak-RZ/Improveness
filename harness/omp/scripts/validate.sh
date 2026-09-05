#!/usr/bin/env bash
# Fast-tier overlay gate. KERNEL: evolver cannot write this file.
set -euo pipefail
root="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$root"
export PATH="${HOME}/.bun/bin:${PATH}"

if ! command -v bun >/dev/null; then
  echo "bun is required" >&2
  exit 1
fi
if ! command -v rg >/dev/null; then
  echo "rg (ripgrep) is required; fixture check.sh and this gate call it" >&2
  exit 1
fi

echo "== bun test harness/omp/tests =="
bun test harness/omp/tests/

echo "== no system-prompt writes in drivers =="
if rg -n 'writeFileSync\([^)]*system-prompt\.(md|ts)|writeFileSync\([^)]*SYSTEM\.md' harness/omp/drivers; then
  echo "drivers must not write the system prompt" >&2
  exit 1
fi

echo "== KERNEL lists checker, approval, system-prompt =="
for needle in "evals/checker" "approval.ts" "system-prompt.md" "system-prompt.ts" "model-roles.ts"; do
  if ! rg -q "$needle" harness/omp/KERNEL.md; then
    echo "KERNEL.md missing: $needle" >&2
    exit 1
  fi
done

echo "== playbook has no secret-shaped lines =="
if rg -n 'sk-[A-Za-z0-9]{10,}|-----BEGIN [A-Z ]+PRIVATE KEY-----|OMP_[A-Z0-9_]+=\S+' harness/omp/overlay/.omp/playbook; then
  echo "playbook contains secret-shaped text" >&2
  exit 1
fi

echo "== git diff --check =="
git diff --check -- harness/omp plugins/dsh-improveness IMPLEMENTATION_PLAN.md DECISIONS.md PROGRESS.md LEARNING.md README.md LICENSE

echo "== system-prompt files must stay Improveness-free =="
# D19: OMP snapshot refresh rewrites oh-my-pi/ wholesale, so empty `git diff` is the
# wrong fence mid-refresh. Kernel rule: Improveness must never author these files.
for rel in \
  oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md \
  oh-my-pi/packages/coding-agent/src/system-prompt.ts
do
  if [[ ! -f "$rel" ]]; then
    echo "missing kernel file: $rel" >&2
    exit 1
  fi
  if rg -qi 'improveness' "$rel"; then
    echo "Improveness must not edit system prompt: $rel" >&2
    exit 1
  fi
done
# On a clean tree (CI after commit), still require no local drift vs HEAD.
if [[ -z "$(git status --porcelain -- oh-my-pi/SNAPSHOT.md)" ]]; then
  if [[ -n "$(git diff -- oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md oh-my-pi/packages/coding-agent/src/system-prompt.ts)" ]]; then
    echo "system prompt files are dirty without a SNAPSHOT.md refresh in progress" >&2
    exit 1
  fi
fi

echo "== at least 20 eval fixtures =="
fixture_count="$(find harness/omp/evals/held-in harness/omp/evals/held-out -name fixture.json | wc -l | tr -d ' ')"
if [[ "$fixture_count" -lt 20 ]]; then
  echo "expected >=20 fixtures, found $fixture_count" >&2
  exit 1
fi

echo "== TB adapter README present =="
if [[ ! -f harness/omp/evals/tb-adapter/README.md ]]; then
  echo "missing harness/omp/evals/tb-adapter/README.md" >&2
  exit 1
fi

echo "== archive driver refuses kernel writes =="
if ! rg -q 'isKernelRel' harness/omp/drivers/archive.ts; then
  echo "archive.ts must call isKernelRel" >&2
  exit 1
fi
if rg -n 'writeFileSync\([^)]*evals/checker' harness/omp/drivers/archive.ts; then
  echo "archive must not write the checker" >&2
  exit 1
fi

echo "== overlay CI workflow calls validate.sh =="
if [[ ! -f .github/workflows/overlay.yml ]]; then
  echo "missing .github/workflows/overlay.yml" >&2
  exit 1
fi
if ! rg -q 'validate.sh' .github/workflows/overlay.yml; then
  echo "overlay.yml must run validate.sh" >&2
  exit 1
fi
if ! rg -q 'ripgrep' .github/workflows/overlay.yml; then
  echo "overlay.yml must install ripgrep (every fixture check.sh uses rg)" >&2
  exit 1
fi
if rg -n 'working-directory: oh-my-pi|coding-agent-heavy' .github/workflows/overlay.yml; then
  echo "overlay CI must not adopt OMP heavy jobs" >&2
  exit 1
fi

echo "== search driver has step cap and kernel guard =="
if ! rg -q 'MAX_STEP_CAP' harness/omp/drivers/search.ts; then
  echo "search.ts must define MAX_STEP_CAP" >&2
  exit 1
fi
if ! rg -q 'isKernelRel|assertEvolverWrite' harness/omp/drivers/search.ts; then
  echo "search.ts must guard kernel paths" >&2
  exit 1
fi
if rg -n 'writeFileSync\([^)]*evals/checker' harness/omp/drivers/search.ts; then
  echo "search must not write the checker" >&2
  exit 1
fi

echo "== local Harbor runner is not a public TB2 download =="
if rg -n 'https?://[^[:space:]]*terminal-bench|huggingface.co/.+terminal-bench' harness/omp/drivers/run-tb-local.ts harness/omp/drivers/tb-export.ts harness/omp/drivers/run-benchmark.ts; then
  echo "local runners must not download public TB2" >&2
  exit 1
fi

echo "== QA orchestrator present =="
if [[ ! -f harness/omp/scripts/qa.sh ]]; then
  echo "missing harness/omp/scripts/qa.sh" >&2
  exit 1
fi
if ! rg -q 'simulate-architectures' harness/omp/scripts/qa.sh; then
  echo "qa.sh must run architecture simulations" >&2
  exit 1
fi

echo "validate.sh ok"
