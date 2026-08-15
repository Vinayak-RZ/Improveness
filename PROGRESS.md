# Progress

## Current phase

OMP overlay **P2 complete** (root CI, bounded search, local Harbor runner, local-20 benchmark, extensive README). P3 remains parked.

## Latest

| Item | Status |
|------|--------|
| `.github/workflows/overlay.yml` | done |
| Skip-gated live-smoke CI job | done |
| `runSearch` + deterministic proposer | done |
| Local Harbor runner | done |
| Local-20 benchmark (0/12→7/12, 0/8→3/8) | done |
| Extensive README | done |
| `validate.sh` P2 greps | done |

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
| A–N | 20 fixtures, smoke, roles, TB adapter, archive | done |

### Overlay P2

| Phase | Objective | Status |
|-------|-----------|--------|
| 0 | Adopt P2 contract + D11/D12 | done |
| A | Root validate.sh CI | done |
| B | Optional live-smoke job | done |
| C | Bounded archive search | done |
| D | Local Harbor runner | done |
| N | validate.sh greps + docs + local-20 | done |

## Remaining phases

**P3 (parked):** public TB2 / Harbor campaign; required live-smoke; Spec Kit; catalog ids; search that writes canonical overlay.

Cutover is N/A.

## Active blockers

None.

## Gate evidence

```text
harness/omp/scripts/validate.sh
# bun test harness/omp/tests/
# overlay.yml calls validate.sh
# search.ts has MAX_STEP_CAP + kernel guard
# local-20: held-in 0/12 → 7/12, held-out 0/8 → 3/8 after 5 steps
```
