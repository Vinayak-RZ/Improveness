# Improveness sections (JIT vs Improvement)

Two independently disableable product sections on the DeepSeek Harness path ([D16](../../DECISIONS.md)).

| Section | Job | Disable |
|---------|-----|---------|
| **JIT** | Task-specialized harness: assemble M/P/A/C module templates, mount session-owned plugins | `IMPROVENESS_JIT=0` |
| **Improvement** | Dual-horizon self-mod: short-term post-trajectory candidates; long-term archive/curator cadence | `IMPROVENESS_IMPROVE=0` (both), or `IMPROVENESS_IMPROVE_SHORT=0` / `IMPROVENESS_IMPROVE_LONG=0` |

Event-driven tool inject (hierarchical catalog → reminder / optional capability mount): `IMPROVENESS_EVENT_INJECT=0`.

Defaults: **all on**. Flags are **load-time** (P0); mid-session toggle is P1.

## JIT (task harness)

Inspired by [JIT-Agent](https://arxiv.org/abs/2608.25593) four-module synthesis — **templates + priors**, not trained weights and not free-form `apply()` codegen on the hot path. Durable free-form siblings still go through `decideAccept` + validate (AOT).

See [two-speed.md](two-speed.md), [tool-catalog.md](tool-catalog.md) (when present).

## Improvement (two horizons)

| Horizon | When | Output |
|---------|------|--------|
| Short-term | After a trajectory / episode export | Playbook bullets or JIT param candidates (no silent durable write) |
| Long-term | Archive depth / cadence | Curator + search candidacy → still `decideAccept` before promote |

## Inspect

`improveness.inspect` returns `sections`, `catalog`, frozen ids, and slot occupancy.
