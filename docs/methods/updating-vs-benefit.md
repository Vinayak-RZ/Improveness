# Harness updating is not harness benefit

**Paper:** Lin et al., 2026. [arXiv:2605.30621](https://arxiv.org/abs/2605.30621)  
**Code:** [A-EVO-Lab/a-evolve](https://github.com/A-EVO-Lab/a-evolve/tree/release/harness-evolution)  
**Parent:** [../06-self-improving-harness.md](../06-self-improving-harness.md)

## What it measures

Two capabilities, disentangled:

| Axis | Meaning |
|------|---------|
| Harness-updating | Produce useful persistent edits from execution evidence |
| Harness-benefit | Actually improve task solving when using those edits |

## Evidence

- **Updating is flat** across Qwen3.5-9B → Claude Opus 4.6. A 9B evolver can write a skill procedurally isomorphic to Opus. Evolver gaps ≤ ~3.1 pp.
- **Benefit is non-monotonic.** Mid-tier (e.g. GPT-OSS-120B) gains most. Strong models near a ceiling. Weak models gain least.

Weak-tier failure modes:

1. **Activation failure** — never load the skill (e.g. ~25% load rate for Qwen3-32B vs ~96% for strong models).
2. **Adherence failure** — load the skill but do not follow it over a long horizon.

## Spec notes

- Allocate capability budget to the **task agent**.
- Bake skill/tool invocation into the seed (OMP already lists skills in the `skill` tool; still specify activation checks in evals).
- Do not require a frontier model for the evolver role.
