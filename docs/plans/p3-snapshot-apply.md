# P3 snapshot apply — approved snapshot

> Approved snapshot (2026-08-17). Live execution contract is [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md). Edit that file when the contract changes.

P2 overlay (stage-only search) remains at [p2-omp-overlay.md](p2-omp-overlay.md).

## North star

Running Improveness on a **working snapshot** of Oh My Pi (or any agent tree) **changes that harness’s code** after held-in/held-out accept: tools, skills, orchestration, core loop. Not a forever review queue. Not an upstream PR to `can1357/oh-my-pi`.

Kernel stays frozen: checker, `system-prompt.md`, `approval.ts`, Improveness QA, secrets. No public Terminal-Bench as fitness.

Runtime research: [spatiotemporal composability](../methods/spatiotemporal-composability.md) — prefer revertible plugins so self-mod does not kill the process.

Product spec: [06-snapshot-apply.md](../proposals/06-snapshot-apply.md). ADR: D14.
