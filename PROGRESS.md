# Progress

## Current phase

OMP overlay **P1 complete**. **P2 plan drafted** at [docs/plans/p2-omp-overlay.md](docs/plans/p2-omp-overlay.md) — awaiting approval. Do not start P2 Phase 0 until approved.

## Latest

| Item | Status |
|------|--------|
| 12 held-in + 8 held-out fixtures | done |
| Live `createAgentSession` smoke (skip without keys) | done |
| Hidden `@debugger` / `@evolver` roles (D10) | done |
| Harbor-shaped TB adapter | done (not public TB2) |
| Overlay archive + parent sampling | done |
| `validate.sh` | done (41 tests) |

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
| N | validate.sh + docs | done (this commit) |

## Remaining phases

**P2 (draft, not started):** root `validate.sh` CI; skip-gated live-smoke job; bounded archive search (stage + queue); local Harbor runner.

**P3 (parked):** public TB2 / Harbor campaign; required live-smoke; Spec Kit; catalog ids; search that writes canonical overlay.

Cutover is N/A.

## Active blockers

None.

## Gate evidence

```text
harness/omp/scripts/validate.sh
# bun test harness/omp/tests/  →  41 pass
# fixture.json count >= 20
# tb-adapter/README.md present
# archive.ts calls isKernelRel
```
