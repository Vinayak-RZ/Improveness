# HostPort

Thin adapter between Improveness (decide, score, archive, apply) and a plugin host. Inspired by HELIX ([arXiv:2608.13951](https://arxiv.org/abs/2608.13951)): do not wrap the host in a second operating system.

## Surface

| Method | Job |
|--------|-----|
| `exportTrace` | Session log → filesystem evidence plane |
| `listCapabilities` | What the host can mount |
| `frozenIds` | Stable kernel ids (namespaces / routes / owned paths — **not** Fiber instance ids) |
| `slots` | HarnessFactory occupancy |
| `mountEphemeral(sessionId, package, slot)` | JIT |
| `unmount` | Invert JIT |
| `applyDurable` | AOT after `decideAccept` |
| `hotReload` / `needsRestart` | Live ratchet |
| `runEval` (optional) | Held-in / held-out |
| catalog / emit (D16) | Hierarchical tool discovery + event inject |
| synthesize (D16) | JIT task harness from M/P/A/C templates |
| improveShort / improveLong (D16) | Dual-horizon improve RPC |

## P0 / P1

- P0: DeepSeek Harness adapter (`host-port/dsh-port.ts` + Node `plugins/dsh-improveness`).
- P1: Oh My Pi adapter (`host-port/omp-port.ts`). `oh-my-pi/` stays in-tree as a parked working snapshot, not the default install path.
