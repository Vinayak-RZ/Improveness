# TargetPort

Thin adapter between Improveness (`decideAccept`, staging, frozen physics) and **any** agentic artifact: a domain kernel, an agentic harness, or an agentic system that is not a harness.

Inspired by HELIX ([arXiv:2608.13951](https://arxiv.org/abs/2608.13951)): do not wrap the target in a second operating system. HostPort remains the DSH/OMP coding-host adapter (JIT, slots, HMR). TargetPort does not mount Fibers.

## Kinds

| Kind | Meaning | In-tree example |
|------|---------|-----------------|
| `domain-kernel` | Expertise a general assistant loads; host owns the loop | `targets/arc` (ARC / A R C fixture) |
| `agentic-harness` | Tools + memory + loop around a model | `targets/harness-stub`; live DSH stays HostPort |
| `agentic-system` | Any agentic system, not coding-only | `targets/generic-agentic` |

## Surface

| Method | Job |
|--------|-----|
| `frozenIds` | Stable kernel ids |
| `listSurfaces` | Frozen prefixes vs editable prefixes |
| `score(split, playbook)` | Held-in / held-out family-playbook eval |
| `stage` after `decideAccept` | Evidence plane under `stagingPrefix` |

Manifest JSON lives at `harness/omp/targets/<id>/manifest.json`. Paths are validated to stay under the repo root.

## Frozen physics

The evolver cannot write `frozenPrefixes` (gold / grader) or Improveness kernel markers (`evals/checker/`, `plugins/dsh-improveness/`, …). Same Self-Harness rule as coding hosts: accept only if practice rose and hidden did not drop. Held-out ids never reach the proposer.

## ARC

Live repo: [Vinayak-RZ/ARC](https://github.com/Vinayak-RZ/ARC) (renamed from Electrical-Engineer). Arc is a domain kernel, not a harness. We do **not** vendor it and do **not** mount DeepSeek Harness as Arc’s loop. The in-tree fixture encodes the contract (frozen gold, recipe playbook, exact token `unchecked`). `ARC_ROOT` live eval is P1.

## Boot

```text
bun harness/omp/drivers/improve-target.ts --target arc
bun harness/omp/drivers/improve-target.ts --target generic-agentic
```
