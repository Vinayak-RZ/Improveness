# Progress

## Current phase

OMP overlay **P2 complete**. **P3 Phase 0 in progress:** D14 snapshot-apply vision, spatiotemporal composability research, catalog needles updated. Apply driver still pending (P2 `search.ts` stages).

## Latest

| Item | Status |
|------|--------|
| `.github/workflows/overlay.yml` | done |
| Skip-gated live-smoke CI job | done |
| `runSearch` + deterministic proposer | done (still stage-only) |
| Local Harbor runner | done |
| Local-20 benchmark (0/12→7/12, 0/8→3/8) | done |
| Extensive README | done; split to `docs/EXTENSIVE.md` |
| Readable README | done (readme-router: readable + extensive) |
| CACD (D13) + `qa.sh` | done |
| 7 architecture simulations | done |
| D14 working-snapshot apply contract | Phase 0 |
| Spatiotemporal composability method note | Phase 0 |
| `apply-snapshot` driver | pending Phase B |

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

### Overlay P3

| Phase | Objective | Status |
|-------|-----------|--------|
| 0 | D14 contract + paper note + README | in progress |
| B | Gated apply onto working snapshot | pending |
| C | OMP extension unload vs Cordis | pending |
| N | qa.sh after driver | pending |

## Remaining phases

**P3 live:** snapshot apply + composability research. **Parked:** public TB2 as report-only; required live-smoke; Spec Kit; catalog ids.

Cutover is N/A.

## Active blockers

Phase B apply driver — P2 search still stages (D12 as shipped). Product is D14.

## Gate evidence

```text
harness/omp/scripts/qa.sh
# bun test harness/omp/tests/
# overlay.yml calls validate.sh
# search.ts has MAX_STEP_CAP + kernel guard
# local-20: held-in 0/12 → 7/12, held-out 0/8 → 3/8 after 5 steps
# IMPLEMENTATION_PLAN contains working snapshot + No public Terminal-Bench
```
