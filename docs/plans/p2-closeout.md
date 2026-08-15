# P2 closeout + local improvement evidence

> Execution addendum to the approved [P2 contract](../../IMPLEMENTATION_PLAN.md). User asked to inventory leftovers, write an extensive README, run real improvement cycles, and show benchmark evidence — then implement.

## Leftovers (from repo audit)

| Bucket | Status |
|--------|--------|
| P0 + P1 overlay, 20 fixtures, archive primitive, TB adapter, D10 roles | done |
| P2 Phase 0 contract + D11/D12 | done |
| P2 A root CI | missing |
| P2 B skip-gated live-smoke job | missing |
| P2 C `runSearch` / proposer / `listArchive` | missing |
| P2 D local Harbor runner | missing |
| P2 N validate.sh greps | missing |
| Any improvement cycle actually run | **none** — archive empty, queue is a hand example |
| Extensive README | missing (thin pointer README) |
| Stale “docs-only / nothing implements a harness” claims | still present |

## What “benchmarks” means here (D11)

**Local 20-fixture Self-Harness suite**, not public Terminal-Bench 2.

A playbook-conditioned solver treats unlocked `recipe:*` families as harness memory. Baseline playbook has zero recipes → 0/12 held-in, 0/8 held-out. Each accepted search step adds one family discovered from **failing held-in ids only**. Shared families generalize to held-out (e.g. `recipe:gitignore` unlocks `gitignore-rule` and `gitignore-dist`). Held-out-only `recipe:no-secrets` is never proposed — those two tasks stay failed, which is the leakage brake.

## Deliverables

1. `.github/workflows/overlay.yml` — required `validate` + skip-gated `live-smoke`
2. `listArchive`, `playbook-solver`, `propose`, `search`, `run-tb-local`, `run-benchmark`
3. Tests for cap/kernel/held-out leak/accept/reject/Harbor
4. Committed report at `harness/omp/evals/benchmarks/local-20/`
5. Extensive root README (skill `extensive-readme`)
6. Stale-doc fixes; `validate.sh` P2 greps

## Non-goals (unchanged)

Public TB2, auto-promote, Spec Kit, required live-smoke, OMP upstream PR, system-prompt evolution.
