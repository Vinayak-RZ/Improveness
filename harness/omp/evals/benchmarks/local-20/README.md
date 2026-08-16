# Local 20-fixture benchmark

This directory is a **recorded Improveness improvement cycle** on the in-repo held-in / held-out suite.

**It is not a public Terminal-Bench 2 score.** Do not compare these numbers to AHE or Self-Harness paper tables.

| File | What |
|------|------|
| [summary.md](summary.md) | Human table of baseline → after 5 search steps |
| [scores.json](scores.json) | Machine-readable report |
| [search-log.jsonl](search-log.jsonl) | One JSON object per search step |

Regenerate:

```text
bun harness/omp/drivers/run-benchmark.ts 5 harness/omp/evals/benchmarks/local-20
```
