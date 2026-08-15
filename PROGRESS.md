# Progress

## Current phase

OMP overlay **P1 complete** (20 fixtures, live smoke skip-gate, hidden ModelRoles, TB adapter, archive). Public TB2 and archive-driven search remain deferred.

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

Public TB2 / Harbor campaign; live smoke as required CI; archive-driven search. Cutover is N/A.

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
