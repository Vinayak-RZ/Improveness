# T1 trials — TargetPort

Date: 2026-09-15. Queue from [loops/T1.md](../plans/loops/T1.md).

| # | Trial | Result | Evidence |
|---|-------|--------|----------|
| 1 | Happy P0 path | **pass** | `bun harness/omp/drivers/improve-target.ts --target arc` → accept, 0/3→3/3 both splits |
| 2 | Empty / zero state | **pass** | `--playbook harness/omp/targets/arc/surfaces/playbook.md` → `reject-no-gain`, staged `[]`, exit 1 (honest no-gain) |
| 3 | Bad input / kernel write | **pass** | CLI frozen probe on `targets/arc/eval/`; unit test throws `/frozen physics/` on KERNEL.md and score.md |
| 4 | Regression | **pass** | `bun test harness/omp/tests/target-port.test.ts` 8/8; HostPort tests still in overlay suite |
| 5 | Auth fail | **N/A** | no auth |
| 6 | generic-agentic | **pass** | `--target generic-agentic` kind `agentic-system`, accept 0/2→2/2 held-in, 0/1→1/1 held-out |
| 7 | harness-stub | **pass** | `--target harness-stub` kind `agentic-harness`, accept |

Failures become tests: none this round.
