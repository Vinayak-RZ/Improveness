# Private ModelTaste fit-suite

Keyless structural fixtures for validate-then-repair. **Not** public Terminal-Bench.

## Run

```bash
bun test evals/fit-suite/fit-suite.test.ts
# optional live (requires keys; skipped in CI):
IMPROVENESS_FIT_LIVE=1 bun evals/fit-suite/run-live.ts
```

Results for live runs land in `evals/fit-suite/results/` and may be cited only via `docs/CLAIM_LEDGER.md`.
