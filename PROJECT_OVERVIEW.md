# Project overview

## Purpose

Improveness is a **DeepSeek Harness bundle plugin** (`dsh-improveness`) that improves the host at runtime: JIT session plugins plus durable generated siblings after a Self-Harness gate. The same loop is a **CACD** operating model and a **keyless simulator of agentic architectures**.

You add the plugin to a live `improveness` profile (`dsh-base` + `dsh-web-app` + `dsh-improveness`). After held-in/held-out accept, **generated plugins** land in a profile-owned directory and HMR. The Oh My Pi tree is a **parked P1 HostPort**, not the default install path ([D15](DECISIONS.md)).

1. Explains Lilian Weng’s [“Harness Engineering for Self-Improvement”](https://lilianweng.github.io/posts/2026-07-04-harness/) by natural segment.
2. Specifies what **any** coding harness must add to become self-improving (HostPort).
3. Implements those additions as [`plugins/dsh-improveness`](plugins/dsh-improveness) plus [`harness/omp/`](harness/omp/SURFACES.md) — without rewriting the checker or the Improveness bundle itself.

## System overview

| Layer | What lives here |
|-------|-----------------|
| Product landing | [`README.md`](README.md) — plugin pitch; internals in [`docs/EXTENSIVE.md`](docs/EXTENSIVE.md) |
| Claim ledger | [`docs/CLAIM_LEDGER.md`](docs/CLAIM_LEDGER.md) |
| Research | [`docs/`](docs/00-index.md) segments and [`docs/methods/`](docs/methods/) |
| DSH bundle | [`plugins/dsh-improveness`](plugins/dsh-improveness) (`dsh.bundle`) |
| Overlay / loop | [`harness/omp/`](harness/omp/SURFACES.md) — Bun checker, search, apply |
| Parked snapshot | [`oh-my-pi/`](oh-my-pi/) — P1 OMP adapter target (D14 working snapshot) |
| Skills authority | [`vendor/cursor-config-coding/`](vendor/cursor-config-coding/) |

## High-level architecture

A seed harness runs tasks. Traces land on disk. A debugger distills them. An evolver proposes bounded edits. A held-in / held-out verifier accepts or rejects. **JIT** mounts last for this session. **AOT** writes an immutable candidate, validates load/dispose/policy, atomically replaces the generated dir, then HMR. Permission-widening still stops for a human.

See [docs/methods/host-port.md](docs/methods/host-port.md).

## Constraints

- MIT at repo root; `oh-my-pi/` keeps its own license.
- Frozen: checker, approval, model routes, Cordis loader, Improveness QA/CI, `plugins/dsh-improveness/` bundle.
- Durable plugins never land in `node_modules` or the installed bundle.
- No public Terminal-Bench 2 / SWE-bench campaign as evolver fitness.
- Secrets stay in env. Live DSH smoke is skip-gated (`DSH_LIVE_SMOKE`).
- Node plugin ↔ Bun loop via JSONL subprocess (no sibling-checkout imports).
