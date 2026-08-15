# 6. Self-improving harness

## Weng’s claim

Context engineering and workflow design are each only part of a harness. The full design space is context-management logic, workflow, permissions, and other components **together**. Code is the universal language for that system. If an LLM can optimize the code that executes agents, it searches a larger space than hand-written prompts.

### STOP (Zelikman et al. 2023)

Improve the **improver**, not only the solution. Seed improver \(I_0\) takes utility \(u\), solution \(s\), model \(M\), returns \(s'\). Meta-utility is average downstream utility of \(I\). Recursion: \(I_t = I_{t-1}(\hat{u}, I_{t-1}; M)\).

Discovered strategies: genetic algorithms, decompose-and-improve, prompt bandits, simulated annealing, temperature variation, beam/tree search.

**Caution:** improved with GPT-4; **degraded** with GPT-3.5 and Mixtral. Recursive structure is not enough; the base model must be capable enough to improve the mechanism.

### Updating ≠ Benefit (Lin et al. 2026)

Two axes:

1. **Harness-updating** — producing useful harness edits. Flat from Qwen3.5-9B to Claude Opus 4.6; a 9B evolver can write a skill procedurally isomorphic to Opus.
2. **Harness-benefit** — using the updated harness. Non-monotonic: mid-tier models gain most; weak models fail to invoke or follow skills; strong models sit near a ceiling.

**Spend model budget on the task agent, not the evolver.** Target skill invocation and long-horizon instruction following in training.

### Self-Harness (Zhang et al. 2026)

Same model, no teacher. Loop:

1. **Weakness mining** — cluster failures into verifier-grounded patterns. Two timeouts can have different causal mechanisms; records need terminal cause + causal agent behavior + abstract mechanism.
2. **Harness proposal** — bounded, diverse, narrow edits from: editable surfaces, failure patterns, passing behaviors to preserve, prior attempts. Prefer recurrent, addressable errors (not task-specific hardness).
3. **Proposal validation** — held-in \(D_{in}\) (did the weakness die?) and held-out \(D_{out}\) (no new damage). Accept only if no regression on either split. Rejects are logged.

Terminal-Bench-2 held-out: MiniMax M2.5 40.5→61.9, Qwen3.5-35B 23.8→38.1, GLM-5 42.9→57.1. Learns **model-specific** harness instructions.

Weng’s concern: if a program can edit the OS, abstraction boundaries break. Editable surface, permission, and security must live **outside** this loop. Reward hacking remains.

### AHE — Agentic Harness Engineering (Lin et al. 2026)

Bottleneck is **observability**. Three pillars:

1. **Component** — seven file-level parts: system prompt, tool description, tool implementation, middleware, skill, sub-agent config, long-term memory. Each failure maps to one component. Git-tracked, revertible. Seed was bash-only (NexAU0).
2. **Experience** — \(k\) traces/task; Agent Debugger writes per-task root-cause reports; aggregate overview; raw traces on disk (progressive disclosure).
3. **Decision** — every edit is a falsifiable manifest (evidence, root cause, fix, predicted fixes + at-risk regressions). Next round attributes and rolls back. Evolver writes only the harness workspace; runs/, tracer, verifier, LLM config are read-only.

Result: Terminal-Bench 2 69.7→77.0 over 10 iterations; beats Codex 71.9 and OpenCode 47.2. Frozen harness transfers to SWE-bench-verified and other model families. **Gain lives in tools, middleware, memory — not the system prompt** (prompt-only −2.3 pp). Components interact non-additively (stacked closure-checks waste Hard-tier budget).

Code: [agentic-harness-engineering](https://github.com/china-qijizhifeng/agentic-harness-engineering).

## What works / fails

- **Works:** propose → held-out gate → accept; file-level components; manifests with next-round falsification; cheap evolver + strong task agent.
- **Fails:** STOP on weak models; prompt-only ACE on a strong coding seed; unbounded self-edit of verifier/model/budget; stacking redundant verification middleware.

## Generic harness implication

This segment **is** the v1 spec: AHE surfaces + Self-Harness gate + manifests. See [proposals/01-generic-harness.md](proposals/01-generic-harness.md) and [methods/ahe.md](methods/ahe.md), [methods/self-harness.md](methods/self-harness.md).

## OMP implication

Reuse `learn` / managed-skills / memory as **write targets**, not as the optimizer. Add traces, debugger, allowlisted evolver, held-out driver, maintainer queue. Do not let the evolver stack extra closure-checks on top of TTSR + advisor.
