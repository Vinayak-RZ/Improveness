# Local Improveness benchmark

> **Not a public Terminal-Bench 2 campaign.** Fitness is the frozen 20-fixture checker.

| Split | Baseline | After 5 search steps | Δ |
|-------|----------|--------------------------------|------|
| Held-in | 0/12 | 7/12 | +7 |
| Held-out | 0/8 | 3/8 | +3 |

## Rounds

| Step | Family | Decision | Held-in | Held-out |
|------|--------|----------|---------|----------|
| 1 | recipe:default-export | accept | 1/12 | 1/8 |
| 2 | recipe:gitignore | accept | 2/12 | 2/8 |
| 3 | recipe:named-export | accept | 5/12 | 3/8 |
| 4 | recipe:index-reexport | accept | 6/12 | 3/8 |
| 5 | recipe:license-header | accept | 7/12 | 3/8 |

## How to read this

- The proposer sees **held-in failures only** and unlocks one `recipe:*` family per accepted step.
- Shared families generalize to held-out (gitignore, named-export, …).
- Held-out-only `recipe:no-secrets` is never proposed, so those two tasks stay failed.
- Accepts land in staging + archive + REVIEW_QUEUE. Canonical `overlay/.omp` is unchanged (D12).
