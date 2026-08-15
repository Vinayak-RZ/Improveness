# 9. Challenges and evaluations

## Weng’s claim

Expert harnesses can coordinate auto-research (AI Scientist), but a plausible manuscript is not discovery. Trehan & Chopra (2026) ran idea→paper with minimal tools (`read_file`, `write_file`, `llm_search`, `list_files`) across world models, multi-agent RL, and AI safety. Six recurring failure modes:

1. **Bias toward training-data defaults** — stale libraries, commands, formats, ungrounded assumptions.
2. **Implementation drift** — under pressure, the model swaps the proposed method for a simpler common one.
3. **Memory and context degradation** — long projects lose details unless logs are persistent artifacts.
4. **Over-optimism** — declare success on noisy or failed experiments (“p-hacking and eureka-ing”; Bubeck et al. 2025 “numerical duct tape”).
5. **Insufficient domain intelligence** — missing tacit craft (complexity, plausibility, which baselines matter).
6. **Weak scientific taste** — experiments run but do not answer the right question.

### Seven bottlenecks toward RSI

1. **Weak and fuzzy evaluators** — self-improvement works when metrics are objective (like RL). Taste, novelty, and long-term value are hard.
2. **Context and memory lifecycle** — memory must grow with autonomy; context engineering should become part of intelligence, not only software.
3. **Negative results** — literature and training data bias toward success. Harnesses should **preserve failures** to trim search.
4. **Diversity collapse** — evolution and RL exploit known high-reward patterns. Open-ended research needs mechanisms that keep initially-worse paths alive.
5. **Reward hacking** — the loop optimizes the given signal (unit tests, judge model, benchmark artifacts). Evaluator and permissions should sit **outside** the evolving harness, with held-out tests, trace audits, and human review.
6. **Long-term success** — coding agents raise daily productivity but optimize short-term task completion, not repo health (maintainability, ownership, migrations, compatibility, future debug cost). Sandbox RLVR rarely captures that.
7. **Role of humans** — humans move **up** the stack: oversight at the right time and abstraction. Touch points are a design requirement.

### Appendix benchmarks (cite, do not run here)

| Bench | What it tests |
|-------|----------------|
| PaperBench | Replicate 20 ICML 2024 papers; 8,316 rubrics |
| CORE-Bench | Computational reproducibility of 90 papers |
| ScienceAgentBench | 102 data-driven science tasks |
| RE-Bench | ML research-engineering vs human experts |
| MLE-bench | 75 Kaggle-style ML engineering comps |
| KernelBench | Correct + fast GPU kernels |
| Terminal-Bench 2 | Used by AHE / Self-Harness |
| SWE-bench Verified | Used by AHE transfer / DGM |

## What works / fails

- **Works:** objective, fast verifiers; held-out splits; failure archives; human checkpoints on irreversible edits.
- **Fails:** judge-only rewards; optimizing a public bench the evolver can see; declaring victory on noise.

## Generic harness implication

Safety and eval design are not optional appendix items. They are [proposals/04-safety.md](proposals/04-safety.md). Fitness must include regression and a maintainability signal, not only “task passed.”

## OMP implication

Align with [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907): mine traces for candidates, route to maintainers, never auto-write canonical prompts/tools. Preserve failed sessions as first-class files.
