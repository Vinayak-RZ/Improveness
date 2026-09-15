# TargetPort

## User

Domain-kernel / agentic-system author.

## Job

Plug a domain kernel or any agentic system into Improveness so Self-Harness gates edits before they land.

## Done looks like

```text
bun harness/omp/drivers/improve-target.ts --target arc
bun harness/omp/drivers/improve-target.ts --target generic-agentic
```

Keyless. Accept when practice rose and hidden did not drop. Throw on frozen-path writes.

## P0 (this graph)

- Manifest TargetPort (`domain-kernel` | `agentic-harness` | `agentic-system`)
- Reuse `decideAccept`
- ARC fixture adapter (motivating kernel; ARC repo is external)
- Generic non-coding agentic-system fixture
- Tests: accept / held-out reject / kernel deny

## Later (not this graph)

- Live `ARC_ROOT` gold eval in CI
- More kernels
- JIT/HMR for kernels that are not Cordis plugins

## Non-goals

- Vendoring ARC
- Mounting DeepSeek Harness as Arc’s loop
- Public Terminal-Bench as fitness
- Changing the frozen 12/8 Harbor suite
- Training weights

## Honest holes

- Without `ARC_ROOT`, ARC is a **contract fixture**, not a live `electrical-engineer eval`
- TargetPort does not unload Cordis Fibers (that stays HostPort)
- Playbook-class staging only in P0 (no auto-apply onto an external ARC checkout)
