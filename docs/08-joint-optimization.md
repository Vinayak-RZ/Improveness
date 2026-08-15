# 8. Joint optimization with model weights

## Weng’s claim

Harness evolution is non-parametric. Full RSI could also update weights — via the training pipeline or test-time continual learning. Continual learning is “worthy of its own post.”

### SIA (Hebbar et al. 2026)

Three roles: Meta-Agent proposes the initial harness; Task-Specific Agent executes; Feedback-Agent chooses **harness update vs weight update** from recent trajectories.

Weng’s reading: direction interesting, **evidence provisional**. Confounds include a much weaker task agent than meta/feedback models (`gpt-oss-120b` vs Claude Sonnet 4.6) and weak baselines. Training stability and Goodhart effects remain open.

### Continual Harness (Karten et al. 2026)

Long-horizon gameplay: update the harness and co-learn a policy by distilling a strong teacher’s labels on low-reward trajectories.

## What works / fails

- **Works as a research direction:** deciding *when* to change scaffolding vs parameters.
- **Fails as a v1 proposal:** confounded experiments; needs training infra this repo will not specify.

## Generic harness implication

**Out of v1.** Document only. A future implementer who adds weight updates must still keep the evaluator outside the loop (Goodhart).

## OMP implication

Do not propose fine-tunes, teacher distillation, or Feedback-Agent weight writes in the OMP change list.
