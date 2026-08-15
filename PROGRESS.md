# Progress

## Current phase

OMP overlay **P2 Phase 0 complete** (contract adopted, D11/D12 recorded). Stop for the Phase 0 human checkpoint before Phase A (root `validate.sh` CI).

## Latest

| Item | Status |
|------|--------|
| P2 nawab contract in `IMPLEMENTATION_PLAN.md` | done |
| D11 P2 vs P3 split | done |
| D12 search stages, never promotes | done |
| Root GitHub Actions `overlay.yml` | not started (Phase A) |
| Skip-gated live-smoke CI job | not started (Phase B) |
| Archive-driven search | not started (Phase C) |
| Local Harbor runner | not started (Phase D) |

## Completed phases

### Docs / proposals pass

| Phase | Objective | Status |
|-------|-----------|--------|
| Research + proposals + in-tree OMP | done | done |

### Overlay P0

| Phase | Objective | Status |
|-------|-----------|--------|
| 0–D + N | Surfaces through manifests + validate | done |

### Overlay P1

| Phase | Objective | Status |
|-------|-----------|--------|
| A | 20 fixtures | done |
| B | Live smoke skip-gate | done |
| C | ModelRole debugger/evolver | done |
| D | TB adapter | done |
| E | Archive primitive | done |
| N | validate.sh + docs | done |

### Overlay P2

| Phase | Objective | Status |
|-------|-----------|--------|
| 0 | Adopt P2 contract + D11/D12 | done (this commit) |
| A | Root validate.sh CI | pending |
| B | Optional live-smoke job | pending |
| C | Bounded archive search | pending |
| D | Local Harbor runner | pending |
| N | validate.sh greps + docs | pending |

## Remaining phases

**P2 next:** Phase A — `.github/workflows/overlay.yml` runs `harness/omp/scripts/validate.sh` with Bun 1.3.14. Do not start until the Phase 0 checkpoint is cleared.

**P3 (parked):** public TB2 / Harbor campaign; required live-smoke; Spec Kit; catalog ids; search that writes canonical overlay.

Cutover is N/A.

## Active blockers

Phase 0 human checkpoint (P2 vs P3 split freeze). No other blockers.

## Gate evidence

```text
Phase 0
# IMPLEMENTATION_PLAN.md is the P2 contract
# DECISIONS.md has D11 and D12
# §1 non-goals include no public TB2 and no auto-promote
```
