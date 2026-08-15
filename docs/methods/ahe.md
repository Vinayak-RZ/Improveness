# AHE — Agentic Harness Engineering

**Paper:** Lin et al., 2026. [arXiv:2604.25850](https://arxiv.org/abs/2604.25850)  
**Code:** [china-qijizhifeng/agentic-harness-engineering](https://github.com/china-qijizhifeng/agentic-harness-engineering)  
**Parent:** [../06-self-improving-harness.md](../06-self-improving-harness.md)

## What it optimizes

All editable harness components jointly, with the **base model fixed**. Bottleneck framed as observability, not agent IQ.

## Seven components (file-level)

System prompt · tool description · tool implementation · middleware · skill · sub-agent configuration · long-term memory.

Seed \(H_0\) (NexAU0) was bash-only so later gains are attributable.

## Three pillars

1. **Component observability** — each failure maps to one file class; git commit per logical edit; rollback is a file revert.
2. **Experience observability** — \(k \ge 2\) traces/task; Agent Debugger writes per-task reports + benchmark overview; raw traces remain for drill-down.
3. **Decision observability** — change manifest: evidence name, root cause, targeted fix, predicted fixes, at-risk regressions. Next round intersects predictions with task deltas; misses revert.

**Read-only to the evolver:** runs directory, tracer, verifier, LLM configuration. Seed system prompt non-deletable.

## Outer loop (condensed)

Rollout → clean traces → attribute prior manifest and rollback → Agent Debugger → Evolve (edits + new manifest) → git commit → keep best pass@1.

## Evidence (Terminal-Bench 2, GPT-5.4 high, 10 iterations)

| Method | All | Notes |
|--------|-----|-------|
| OpenCode | 47.2% | Human-designed |
| Terminus-2 | 62.9% | Human-designed |
| Codex | 71.9% | Human-designed; better on Hard |
| NexAU0 | 69.7% | Seed |
| ACE | 68.9% | Prompt/playbook only |
| TF-GRPO | 72.3% | Trajectory reinforce |
| AHE | **77.0%** | Full components |

Ablation vs seed: memory +5.6, tools +3.3, middleware +2.2, system prompt **−2.3**. Frozen AHE transfers to SWE-bench-verified (highest aggregate, −12% tokens vs seed) and +5.1 to +10.1 pp on other model families.

Fix-prediction precision 33.7% / recall 51.4% vs random ~6.5% / 10.6%. Regression prediction is weaker (“regression blindness”).

## Failure modes

- Non-additive component stacking (Hard-tier interference).
- Timeout/budget coupled to the evolution model’s reasoning tier.
- Prompt-only evolution misses the gain.

## Spec notes

- This is the **component + manifest** contract in the generic proposal.
- On OMP, map the seven files to `.omp/` (see [../proposals/02-omp-gap-analysis.md](../proposals/02-omp-gap-analysis.md)). Do not start from a bash-only seed; start from OMP and still forbid prompt-only “wins.”
