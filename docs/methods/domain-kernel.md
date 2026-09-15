# Domain kernel (ARC vocabulary)

**ARC** (Agent Runtime Composability — working name in this repo) treats every
agentic system as a **domain kernel** plus **editable harness surfaces**.

| Term | Meaning in Improveness / ARC |
|------|------------------------------|
| **Domain kernel** | Frozen trust boundary: verifier, permissions, model routes, improver QA, host loader. See [KERNEL.md](../../harness/omp/KERNEL.md). |
| **Harness / surfaces** | Everything the evolver may rewrite after a gate: tools, memory, planning, skills, generated plugins. See [SURFACES.md](../../harness/omp/SURFACES.md). |
| **Domain kernel port** | Typed adapter (`DomainKernelPort`) between the Bun improver loop and **any** host — coding agents, research runners, simulators, or custom JSONL services. |
| **HostPort** | Legacy alias for the same adapter ([host-port.md](host-port.md)). |

## Why generalize beyond coding harnesses?

The same loop applies wherever you have:

1. A **task agent** running inside a host.
2. **Traces** on disk (session log → evidence plane).
3. A **frozen grader** (Self-Harness held-in / held-out).
4. **Mutable siblings** the host can mount, unload, or HMR.

Coding (DeepSeek Harness, Oh My Pi) is the reference implementation. Non-coding
kernels plug in by implementing `DomainKernelPort` or registering a factory in
`harness/omp/host-port/registry.ts`.

## Improver layer

`createDomainKernelImprover(port)` ([`improver.ts`](../../harness/omp/host-port/improver.ts))
is host-agnostic: export evidence, read frozen ids, JIT mount, gated
`applyDurable`. Scoring, `decideAccept`, and improve RPCs stay in
`harness/omp/drivers/dsh-core-runner.ts` (JSONL); the port only mutates the host.

Built-in adapters: `registerDefaultDomainKernelAdapters(repoRoot)` → `dsh`, `omp`.
Custom hosts: `registerDomainKernelAdapter(id, factory)` or
`createGenericDomainKernelStub` for scaffolding.

## Related reading

- [Research summary](../research/domain-kernels-and-improver.md)
- [Node ↔ Bun protocol](node-bun-protocol.md)
- [Two-speed JIT / AOT](two-speed.md)
