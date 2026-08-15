# 1. RSI and why harnesses matter

## Weng’s claim

Recursive self-improvement (RSI) is an old idea: I. J. Good (1965) defined an ultraintelligent machine that designs better machines; Yudkowsky (2008) named the feedback loop where an AI improves the cognitive machinery that produces its intelligence.

In modern systems that loop is rarely “the model rewrites its weights.” It is more often: the model improves the **training pipeline and the deployment system**, which then yields a better successor on economically valuable tasks.

Weng’s near-term claim: the layer between the raw model and real-world context is as important as post-pretrain evals. That layer is the **harness** — the system that orchestrates how the model thinks, calls tools, manages context, stores artifacts, and evaluates results. Successful coding products (Claude Code, Codex, and peers) are harnesses around a base model.

The object being optimized moves outward as models get stronger:

`instruction prompts → structured context → workflow → harness code → optimizer code`

## Cited systems (this segment)

| Source | Role |
|--------|------|
| Good 1965 | Ultraintelligent machine |
| Yudkowsky 2008 | Phrase “recursive self-improvement” |
| Yuan / Chen / Zhao / Choi | Self-play, synthetic data, TTT, continual learning — **out of scope** for this post and this repo |

## What works / fails

- **Works as a framing:** treating the harness as an optimization target explains why the same model scores very differently under Codex vs OpenCode vs a bash-only seed (later AHE numbers).
- **Fails as a weight-rewrite story:** near-term RSI is not a model editing its own parameters. Joint weight+harness work exists (see [08](08-joint-optimization.md)) and evidence is still provisional.

## Generic harness implication

Any seed harness is already doing RSI-adjacent work if it can change *how* the model acts (tools, memory, workflow) without a fine-tune. The missing piece is making that change **evidence-driven, gated, and reversible**.

## OMP implication

OMP already argues the “harness problem”: hashline raised Grok Code Fast 1 edit success from 6.7% to 68.3% with weights fixed. OMP is a strong seed. Proposals should add a closed improvement loop around it, not rebuild the IDE-in-process core. See [proposals/02-omp-gap-analysis.md](proposals/02-omp-gap-analysis.md).
