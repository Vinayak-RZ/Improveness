# Target architecture (any harness)

This is the loop to **specify**, not implement, in this repo. Patterns: Supervisor + workers, ReAct with a step cap, human-in-the-loop promote, episodic traces on disk (`agentic-system-design`).

```mermaid
flowchart TD
  user[User task] --> orch[Orchestrator step budget]
  orch --> policy[Read-only policy kernel]
  orch --> ctx[Context builder playbook plus memory]
  ctx --> model[Task model]
  model --> tools[Tool executor schemas timeouts]
  tools --> seed[Seed harness]
  seed --> traces[Episodic trace store]
  traces --> debugger[Debugger role]
  debugger --> evolver[Evolve agent]
  evolver --> manifest[Change manifest]
  manifest --> gate[Held-in held-out verifier]
  gate -->|accept| surface[Declared editable files]
  gate -->|reject| log[Rejected edit log]
  surface --> seed
  human[Human promote] -.-> gate
```

## Roles

| Role | Job | Model tier |
|------|-----|------------|
| Task agent | Solve user/eval tasks under the current harness | Strongest you can afford |
| Debugger | Distill traces → per-task reports + overview | Mid/small (`smol`) |
| Evolver | Propose bounded file edits + a manifest | Mid/small is enough ([updating ≠ benefit](../methods/updating-vs-benefit.md)) |
| Verifier | Score held-in / held-out; never writable by evolver | Deterministic tests / harness-external judge |
| Human | Promote permission/network/destructive changes | — |

## Layers

| Layer | Owns |
|-------|------|
| Orchestrator | Step budget, which role runs, when to stop |
| Policy kernel | Permissions, model id, token budget, verifier paths — **read-only** |
| Context builder | ACE playbook + memory files + progressive disclosure |
| Tool executor | Timeouts, schemas, audit log |
| Trace store | One directory per rollout; messages + tool I/O + verifier outcome |
| Editable surface | The seven AHE files only |

## What this is not

- Not a fork of OMP, OpenCode, Codex, or Claude Code.
- Not a weight-update loop ([08](../08-joint-optimization.md)).
- Not DGM/AlphaEvolve until fitness is cheap and objective ([05-adoption-order.md](05-adoption-order.md)).

OMP instantiation: [02-omp-gap-analysis.md](02-omp-gap-analysis.md). Generic capability list: [01-generic-harness.md](01-generic-harness.md). Safety: [04-safety.md](04-safety.md).
