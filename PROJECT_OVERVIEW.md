# Project overview

## Purpose

Improveness is a maintainer-readable corpus that:

1. Explains Lilian Weng’s [“Harness Engineering for Self-Improvement”](https://lilianweng.github.io/posts/2026-07-04-harness/) by natural segment.
2. Specifies what **any** coding harness must add to become self-improving.
3. Specifies what **OMP (Oh My Pi)** would need — without changing OMP or shipping harness code.

## System overview

This repository is documentation only. There is no agent runtime, eval runner, or overlay.

| Layer | What lives here |
|-------|-----------------|
| Research | [`docs/`](docs/00-index.md) segments and [`docs/methods/`](docs/methods/) |
| Proposals | [`docs/proposals/`](docs/proposals/00-architecture.md) — generic + OMP |
| Skills authority | [`vendor/cursor-config-coding/`](vendor/cursor-config-coding/) and project [`.cursor/`](.cursor/skills/nawab-plans/SKILL.md) |

## High-level architecture (specified, not implemented)

A seed harness (OMP or generic) runs tasks. Traces land on disk. A debugger role distills them. An evolver proposes bounded edits to a declared file surface. A held-in / held-out verifier plus a human promote step accept or reject. The evaluator, model config, and permission kernel stay read-only.

See [docs/proposals/00-architecture.md](docs/proposals/00-architecture.md).

## Constraints

- No OMP source changes, fork, or PR to `oh-my-pi`.
- No overlay, plugin, SDK wrapper, or generic-harness implementation in this repo.
- No Terminal-Bench / SWE-bench reproduction.
- No secrets or live agent credentials.
- Spec Kit `.specify/` is out of scope for this pass.
