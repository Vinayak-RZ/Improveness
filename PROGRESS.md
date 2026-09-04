# Progress

## Current phase

D16 **two-section split** — **complete** (local qa + CI green).

## Latest

| Item | Status |
|------|--------|
| D16 ADR + sections method | done |
| Section flags + ToolCatalog + apply wiring | done |
| Event inject | done |
| JIT M/P/A/C synthesizer | done |
| Short/long improve drivers + RPC | done |
| Method docs + claim ledger + SURFACES | done |
| README + EXTENSIVE | done |
| `qa.sh` | green (94 tests) |
| CI `overlay.yml` | green — [push run](https://github.com/Vinayak-RZ/Improveness/actions/runs/33897801595) · [PR run](https://github.com/Vinayak-RZ/Improveness/actions/runs/33897819029) |
| Draft PR | [#9](https://github.com/Vinayak-RZ/Improveness/pull/9) |

Earlier mid-branch push failed on broken link to `tool-catalog.md` before that file landed; fixed by docs commit.

## Completed phases

### D15 plugin

| Phase | Objective | Status |
|-------|-----------|--------|
| 0–N + P1 | DSH plugin + OMP HostPort | done |

### D16 two-section

| Phase | Objective | Status |
|-------|-----------|--------|
| 0 | D16 ADR, sections.md | done |
| A | Flags + hierarchical catalog + inspect | done |
| B | SessionEventBus + tool inject | done |
| C | JitTaskSynthesizer M/P/A/C | done |
| D | Short + long improve drivers | done |
| V | README, EXTENSIVE, qa.sh, CI | done |

## Remaining

- Live DSH smoke (`DSH_LIVE_SMOKE=1`)
- Packaged Bun runner copy into bundle
- Measured live-model gains (not claimed)
- D16 P1: runtime section toggle, OMP catalog parity

## Blockers

None.
