# Harbor-shaped adapter

Local fixtures exported as `instruction.md` + `tests/test.sh` so a later Harbor run can consume them.

**This is not a public Terminal-Bench 2 campaign.** Do not treat adapter presence as a TB2 score. Do not tune the evolver on the public TB2 set (P5).

Run local tasks (export-then-`test.sh`):

```text
bun harness/omp/drivers/run-tb-local.ts harness/omp/evals repo
```

Regenerate one task:

```text
bun harness/omp/drivers/tb-export.ts harness/omp/evals/held-out/no-secrets harness/omp/evals/tb-adapter
```
