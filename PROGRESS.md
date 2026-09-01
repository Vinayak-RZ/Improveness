# Progress

## Current phase

D15 **P0 complete** (Improveness as a DeepSeek Harness `dsh.bundle` plugin) plus **P1 HostPort** (OMP adapter, Pareto archive, skill compile, JIT retrieve-prior, Evo-Bench construction notes).

## Latest

| Item | Status |
|------|--------|
| MIT `LICENSE` | done |
| D15 ADR + KERNEL/SURFACES remap | done |
| `plugins/dsh-improveness` (`dsh.bundle`) | done |
| HostPort + four slots + frozen ids | done |
| JSONL Node↔Bun runner | done |
| JIT mount/unmount + fail-closed drain | done |
| Durable apply + atomic rollback + HMR fence | done |
| Plugin-class search applies generated dir | done |
| Product README + claim ledger + SVG wordmark | done |
| P1 OMP adapter / Pareto / skill compile / retrieve-prior | done |
| `qa.sh` | overlay tests + catalog; live DSH smoke skip-gated |

## Completed phases

### Docs / proposals pass

| Phase | Objective | Status |
|-------|-----------|--------|
| Research + proposals + in-tree OMP | done | done |

### Overlay P0–P2

| Phase | Objective | Status |
|-------|-----------|--------|
| 0–D + N | Surfaces through manifests + validate | done |
| P2 search / local-20 / CACD | done | done |

### D15 plugin (this wave)

| Phase | Objective | Status |
|-------|-----------|--------|
| 0 | D15, HostPort contracts, method notes, MIT | done |
| A | Bundle scaffold, no DSH vendor | done |
| B | DSH traces, frozen ids, generated apply, allowlist | done |
| C | JIT + kernel fence + drain | done |
| D | decideAccept → durable plugin + HMR | done |
| N | Product README, EXTENSIVE, qa | done |
| P1 | OMP HostPort + Pareto + skills + retrieve-prior + Evo-Bench notes | done |

## Remaining

- Live DSH profile-session smoke when `DSH_LIVE_SMOKE=1` and a DSH install exist
- Packaged tarball `prepare` that copies the Bun runner into the bundle (checkout JSONL path works)
- Measured live-model gains (not claimed)

## Blockers

None for P0/P1 code. Commits only when asked.
