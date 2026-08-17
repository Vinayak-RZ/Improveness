# Index

Reading order for the research corpus. The working overlay lives at [`harness/omp/`](../harness/omp/SURFACES.md); this folder is the paper map and proposals.

## How to read

1. Start with [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) for scope and constraints.
2. Human overview: [README.md](../README.md). Internals: [EXTENSIVE.md](EXTENSIVE.md).
3. Read segments 01–09 in order (Weng’s natural structure).
4. Use [methods/](methods/) when you need one system in enough detail to specify from.
5. Use [proposals/](proposals/00-architecture.md) when you want the “what would we add” answer:
   - generic harness: [01-generic-harness.md](proposals/01-generic-harness.md)
   - OMP: [02-omp-gap-analysis.md](proposals/02-omp-gap-analysis.md) then [03-omp-proposed-changes.md](proposals/03-omp-proposed-changes.md)
   - safety: [04-safety.md](proposals/04-safety.md)
   - order: [05-adoption-order.md](proposals/05-adoption-order.md)
   - snapshot apply: [06-snapshot-apply.md](proposals/06-snapshot-apply.md)
6. Overlay execution: live P3 contract in [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md); P2 snapshot in [plans/p2-omp-overlay.md](plans/p2-omp-overlay.md); P3 snapshot in [plans/p3-snapshot-apply.md](plans/p3-snapshot-apply.md).
7. Sources: [references.md](references.md)

## Paper map

| Segment | File | Weng topic |
|---------|------|------------|
| 1 | [01-rsi-and-harness.md](01-rsi-and-harness.md) | RSI and why harnesses matter |
| 2 | [02-design-patterns.md](02-design-patterns.md) | Workflow, filesystem memory, sub-agents |
| 3 | [03-coding-agent-anatomy.md](03-coding-agent-anatomy.md) | Stabilized coding-agent tool surface |
| 4 | [04-context-engineering.md](04-context-engineering.md) | ACE → MCE → Meta-Harness |
| 5 | [05-workflow-design.md](05-workflow-design.md) | Handcrafted and searched workflows |
| 6 | [06-self-improving-harness.md](06-self-improving-harness.md) | STOP, Self-Harness, AHE, spatiotemporal composability |
| 7 | [07-evolutionary-search.md](07-evolutionary-search.md) | AlphaEvolve, DGM, prompt evolution |
| 8 | [08-joint-optimization.md](08-joint-optimization.md) | Harness + weight updates (out of v1) |
| 9 | [09-challenges-and-evals.md](09-challenges-and-evals.md) | Failure modes, bottlenecks, benches |

## Default recommendation

Specify **AHE-style observability + Self-Harness validation**, starting with ACE-style memory, for any harness. Instantiate against OMP’s existing `learn` / `retain` / TTSR / SDK. After the gate, **apply to the working snapshot** (D14). Do not auto-apply to the checker, the system prompt, or upstream `can1357/oh-my-pi`. Prefer revertible plugins over killing the runtime ([spatiotemporal composability](methods/spatiotemporal-composability.md)).
