# Self-Harness

**Paper:** Zhang et al., 2026. [arXiv:2606.09498](https://arxiv.org/abs/2606.09498)  
**Parent:** [../06-self-improving-harness.md](../06-self-improving-harness.md)

## What it optimizes

The operating harness around a **fixed** model. No teacher model. No weight updates.

## Mechanism

1. **Weakness mining** — run \(h_t\) on tasks; cluster verifier-grounded failure patterns. Record: terminal verifier cause, causal agent behavior, abstract mechanism (two “timeouts” are not the same).
2. **Harness proposal** — same model under \(h_t\). Context: editable surfaces, failure patterns, passing behaviors to preserve, prior attempts. Edits: narrow, recurrent, addressable, diverse.
3. **Proposal validation** — held-in \(D_{in}\) and held-out \(D_{out}\). Accept only if no regression on either; typically require at least one split improves. Rejects logged; active harness unchanged.

## Evidence (Terminal-Bench-2.0, DeepAgent-minimal seed)

| Model | Held-out initial | Held-out after |
|-------|------------------|----------------|
| MiniMax M2.5 | 40.5% | 61.9% |
| Qwen3.5-35B-A3B | 23.8% | 38.1% |
| GLM-5 | 42.9% | 57.1% |

Edits were model-specific, not generic slogans.

## Failure modes

- Overfitting if there is no held-out split.
- Reward hacking if the proposer can edit the verifier.
- Task-specific patches that do not generalize.

## Spec notes

- This is the **gate** in [../proposals/01-generic-harness.md](../proposals/01-generic-harness.md).
- On OMP, drive both splits with `createAgentSession`; never let the proposer see \(D_{out}\) traces.
