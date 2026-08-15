# 5. Workflow design

## Weng’s claim

Workflows can be handcrafted by domain experts or treated as a **search problem**. Auto-research is the running example.

### Handcrafted

- **AI Scientist** (Lu et al. 2026) — propose ideas, write code, run experiments, analyze, write a manuscript, peer review. Strong demonstration that an expert harness can coordinate a large auto-research loop. Paper production ≠ scientific discovery.
- **ScientistOne** (Meng et al. 2026) — verifiability is the central constraint. Every claim (citation, number, method, conclusion) must trace to an evidence source and is audited by Chain-of-Evidence checks.
- **Autodata** (Kulikov et al. 2026) — data-scientist agent: challenger proposes problems; weak solver; strong solver; verifier. Aim: “just right” difficulty (strong succeeds, weak fails). Challenger prompt updates from feedback. Limitation: synthesized tasks fine-tune the **weak** solver, not the strong one — closer to distillation than RSI.

### Searched

- **ADAS** (Hu et al., ICLR 2025) — “meta-agent search.” Archive starts with CoT / self-refine. Meta-agent programs new agents in code (description then implementation), two Self-Refine novelty checks (Madaan et al. 2023), evaluate, add successes, repeat.
- **AFlow** (Zhang et al., ICLR 2025) — workflow as a **graph** (nodes = LLM actions, edges = code logic). Optimize with MCTS: select by score/exploration mix, LLM expands a modified workflow, execute, keep if improved, stop on top-k plateau or budget. Beat manual workflows and ADAS on QA, code, and math.

## What works / fails

- **Works:** verifiability constraints (ScientistOne); representing workflows as code or graphs so search can act; MCTS over executable workflows (AFlow).
- **Fails:** pipelines that write plausible papers with fabricated citations or implementation drift (see [09](09-challenges-and-evals.md)); Autodata-style loops that never improve the strong model.

## Generic harness implication

Do **not** adopt AI Scientist as a v1 build. Do adopt the idea that workflow is searchable **code**. For a coding harness, the first searchable objects are skills, hooks, and tool files — not a paper-writing DAG. ADAS/AFlow belong after a cheap objective fitness exists ([07](07-evolutionary-search.md)).

## OMP implication

OMP already has prompt keywords (`ultrathink`, `orchestrate`, `workflowz`) and `task` fan-out. Do not re-propose a research-paper pipeline. If workflow search appears later, represent candidates as `.omp` file trees evaluated by `createAgentSession`, not as a new orchestration product.
