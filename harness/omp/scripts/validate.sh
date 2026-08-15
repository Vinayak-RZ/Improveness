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
git diff --check -- harness/omp IMPLEMENTATION_PLAN.md DECISIONS.md PROGRESS.md LEARNING.md README.md

echo "== system-prompt files must be clean =="
if [[ -n "$(git diff -- oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md oh-my-pi/packages/coding-agent/src/system-prompt.ts)" ]]; then
  echo "system prompt files are dirty" >&2
  exit 1
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

echo "validate.sh ok"
