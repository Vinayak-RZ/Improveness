# Loop graph — ARC domain-kernel improver

> Graph-of-loops execution companion to [p5-arc-domain-kernel-improver.md](p5-arc-domain-kernel-improver.md).
> Approving this graph started execution on branch `cursor/arc-domain-kernel-improver-3670`.

---

## Metadata

| Field | Value |
|-------|-------|
| **Scope plan** | [p5-arc-domain-kernel-improver.md](p5-arc-domain-kernel-improver.md) |
| **Objective** | Generalize improver to any domain kernel via `DomainKernelPort` |
| **Topology mix** | chain → parallel docs/code → barrier QA |
| **Graph-of-loops** | named |
| **Graph-engineering** | not loaded (XOR) |

---

## Loop plans

| ID | Name | Plan | Stop | Max rounds | Status |
|----|------|------|------|------------|--------|
| R1 | research lock | [loops/R1.md](loops/R1.md) | research doc exists | 1 | passed |
| B1 | port + registry | [loops/B1.md](loops/B1.md) | domain-kernel-port tests green | 3 | passed |
| V1 | vendor sync | [loops/V1.md](loops/V1.md) | vendor SHA matches upstream | 2 | passed |
| Q1 | qa barrier | [loops/Q1.md](loops/Q1.md) | `qa.sh` exit 0 | 2 | passed |

---

## Lifecycle

| Stage | Node | N/A |
|-------|------|-----|
| Research | R1 | |
| Docs-in | R1 | |
| Architecture | B1 | |
| Design / UI UX | — | N/A — no user-facing UI |
| Build | B1, V1 | |
| Integrate | Q1 | |
| Evaluate | Q1 | |
| Run | Q1 | |
| Trials | — | N/A — keyless sims unchanged |
| Docs-out | R1 | |
