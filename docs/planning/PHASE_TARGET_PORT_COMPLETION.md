# Phase completion — TargetPort (D21)

## Completed work

TargetPort plug-in for domain kernels, agentic harnesses, and any agentic system. ARC fixture is the motivating domain kernel. `qa.sh` green.

## Files modified

- `harness/omp/target-port/`, `harness/omp/targets/`, `harness/omp/drivers/improve-target.ts`, `allowlist.ts` (`assertTargetWrite`)
- D21, methods, KERNEL/SURFACES/CACD, README, claim ledger
- cursor-config-coding pin `45a585d`

## Architectural changes

Sibling TargetPort; HostPort unchanged. Same `decideAccept`. No GEPA port. ARC not vendored.

## Validation performed

- `bun test harness/omp/tests/target-port.test.ts` — 8 pass
- CLI `--target arc|generic-agentic|harness-stub` — accept; empty playbook — reject-no-gain
- `bash harness/omp/scripts/qa.sh` — ok (126 overlay tests, eight sims, catalog including `c-target-port`)

No UI — no browser verification.

## Known issues

- Live `ARC_ROOT` / `electrical-engineer eval` is P1
- ManagePullRequest tool missing; `gh pr create` returned “Resource not accessible by integration”
- Parallel PR #14 exists on another branch with empty body

## Next phase objectives

Live ARC_ROOT eval; optional apply onto an external ARC working tree after a human flag.

## What you learned

- Domain kernels (ARC) keep the host loop and freeze gold; Improveness’s fit is the **gate**, not a second agent runtime
- Stretching HostPort would leak Fiber/JIT into kernels; a sibling manifest port is the HELIX-thin move
- GEPA/DSPy optimize prompts; this repo already has traces + `decideAccept` — do not add a second optimizer
- graph-of-loops XOR graph-engineering: when both names appear, the skill the user said to **use** wins if defaults are allowed
