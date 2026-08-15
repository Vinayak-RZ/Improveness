# Project overview

## Purpose

Improveness is a maintainer-readable corpus, a **CACD** operating model (Contract · Architecture · Control · Delivery), a **keyless simulator of agentic architectures**, and an overlay that adds a gated self-improvement loop on in-tree Oh My Pi:

1. Explains Lilian Weng’s [“Harness Engineering for Self-Improvement”](https://lilianweng.github.io/posts/2026-07-04-harness/) by natural segment.
2. Specifies what **any** coding harness must add to become self-improving.
3. Implements those additions as [`harness/omp/`](harness/omp/SURFACES.md) (playbook, traces, debugger, Self-Harness, manifests) without rewriting `system-prompt.md` or auto-applying to OMP built-ins.

## System overview

Research docs and proposals live at the repo root. The in-tree OMP source is [`oh-my-pi/`](oh-my-pi/) (upstream git history stripped) and is the base for upgrades. Do not treat this as a live fork with remotes; changes are committed here.

| Layer | What lives here |
|-------|-----------------|
| Research | [`docs/`](docs/00-index.md) segments and [`docs/methods/`](docs/methods/) |
| Proposals | [`docs/proposals/`](docs/proposals/00-architecture.md) — generic + OMP |
| Overlay | [`harness/omp/`](harness/omp/SURFACES.md) — drivers, evals, staging, review queue |
| Seed harness | [`oh-my-pi/`](oh-my-pi/) — read-only unless a documented core patch is opened |
| Skills authority | [`vendor/cursor-config-coding/`](vendor/cursor-config-coding/) and project [`.cursor/`](.cursor/skills/nawab-plans/SKILL.md) |

## High-level architecture

A seed harness (OMP or generic) runs tasks. Traces land on disk. A debugger role distills them. An evolver proposes bounded edits to a declared file surface. A held-in / held-out verifier plus a human promote step accept or reject. The evaluator, model config, and permission kernel stay read-only.

See [docs/proposals/00-architecture.md](docs/proposals/00-architecture.md).

## Constraints

- Upstream `oh-my-pi` git history is not preserved; we do not push back to `can1357/oh-my-pi` from this repo unless explicitly asked.
- Upgrades land under [`harness/omp/`](harness/omp/), guided by [`docs/proposals/`](docs/proposals/). Core OMP patches only if a phase gate fails (D9).
- No public Terminal-Bench 2 / SWE-bench campaign. Local 20-fixture Harbor-shaped tasks and `evals/benchmarks/local-20/` are in-repo only.
- Secrets stay in env. Live smoke/search are optional and skip-gated.
- Spec Kit `.specify/` is out of scope (P3).
