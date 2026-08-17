# Project overview

## Purpose

Improveness is a maintainer-readable corpus, a **CACD** operating model (Contract · Architecture · Control · Delivery), a **keyless simulator of agentic architectures**, and a loop that **mutates a working agent snapshot** after a Self-Harness gate.

You use Oh My Pi (in-tree [`oh-my-pi/`](oh-my-pi/), or another snapshot you point at). You run Improveness. After held-in/held-out accept, **that harness’s code changes**: tools, skills, orchestration, even the core agentic loop. Overlay-only review queues were a misread of this vision ([D14](DECISIONS.md)).

1. Explains Lilian Weng’s [“Harness Engineering for Self-Improvement”](https://lilianweng.github.io/posts/2026-07-04-harness/) by natural segment.
2. Specifies what **any** coding harness must add to become self-improving.
3. Implements those additions as [`harness/omp/`](harness/omp/SURFACES.md) (playbook, traces, debugger, Self-Harness, manifests) and, after the gate, applies them to the working snapshot — without rewriting `system-prompt.md` or silencing the checker.

## System overview

Research docs and proposals live at the repo root. The in-tree OMP source is [`oh-my-pi/`](oh-my-pi/) (upstream git history stripped). That directory is the default **working snapshot**, not a read-only museum.

| Layer | What lives here |
|-------|-----------------|
| Research | [`docs/`](docs/00-index.md) segments and [`docs/methods/`](docs/methods/) |
| Proposals | [`docs/proposals/`](docs/proposals/00-architecture.md) — generic + OMP + [snapshot apply](docs/proposals/06-snapshot-apply.md) |
| Overlay / loop | [`harness/omp/`](harness/omp/SURFACES.md) — drivers, evals, staging, apply |
| Working snapshot | [`oh-my-pi/`](oh-my-pi/) — apply target after the gate (D14) |
| Skills authority | [`vendor/cursor-config-coding/`](vendor/cursor-config-coding/) and project [`.cursor/`](.cursor/skills/nawab-plans/SKILL.md) |

## High-level architecture

A seed harness runs tasks. Traces land on disk. A debugger distills them. An evolver proposes bounded edits. A held-in / held-out verifier accepts or rejects. Accepted ordinary edits **apply to the working snapshot**. Permission-widening still stops for a human. The evaluator, model-role map, and permission kernel stay read-only.

Prefer revertible plugins so a live session does not die on every self-mod ([spatiotemporal composability](docs/methods/spatiotemporal-composability.md)). Restart is the fallback.

See [docs/proposals/00-architecture.md](docs/proposals/00-architecture.md).

## Constraints

- We do not push back to `can1357/oh-my-pi` unless explicitly asked. Improving *your* snapshot is the product; upstream PRs are not.
- Frozen: checker, `system-prompt.md`, `approval.ts`, Improveness QA/CI, secrets.
- Open after the gate: snapshot tools (except approval), skills, orchestration, core loop, overlay playbook.
- P2 `search.ts` still stages until `apply-snapshot` ships (driver lag, not the vision).
- No public Terminal-Bench 2 / SWE-bench campaign as evolver fitness. Local 20-fixture Harbor-shaped tasks are in-repo only.
- Secrets stay in env. Live smoke/search are optional and skip-gated.
- Spec Kit `.specify/` is out of scope.
