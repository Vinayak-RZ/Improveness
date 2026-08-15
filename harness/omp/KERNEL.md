# Frozen kernel

The evolver, curator, debugger, and Self-Harness driver **must not write** these paths. Maintainers may edit them; the loop may not.

See [docs/proposals/04-safety.md](../../docs/proposals/04-safety.md) and [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907).

## OMP core (always frozen)

| Path | Why |
|------|-----|
| `oh-my-pi/packages/coding-agent/src/prompts/system/system.md` | AHE: prompt-only evolution missed the gain (−2.3 pp). Not an improvement surface |
| `oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.ts` | Assembles the system prompt; rewriting it is a kernel change |
| `oh-my-pi/packages/coding-agent/src/tools/approval.ts` | Permission kernel |
| `oh-my-pi/packages/coding-agent/src/config/model-roles.ts` | Model-role union and defaults |
| `oh-my-pi/packages/coding-agent/src/session/role-models.ts` | Role → model resolution |
| `oh-my-pi/packages/coding-agent/src/config/settings-schema.ts` | Settings schema including `modelRoles` |
| `oh-my-pi/packages/coding-agent/src/tools/*.ts` | Canonical built-in tools |
| `oh-my-pi/packages/**` | Entire package tree unless a documented WS-B core patch is opened |

## Improveness kernel (always frozen)

| Path | Why |
|------|-----|
| `harness/omp/evals/checker/` | Verifier. Reward-hacking if the evolver can silence it |
| `harness/omp/SURFACES.md` | Declares the contract; not a playbook |
| `harness/omp/KERNEL.md` | This file |
| `harness/omp/scripts/validate.sh` | Hardening orchestrator |
| `IMPLEMENTATION_PLAN.md` | Execution contract |
| `DECISIONS.md` | ADRs |

## Runtime / config the evolver cannot change

- `modelRoles` in any `config.yml` / settings (task agent stays `default`; evolver/debugger may *use* `smol` / `advisor`, not redefine the map)
- Token / reasoning budget
- Session tracer and run logs (`~/.omp/agent/sessions/`, `harness/omp/traces/` as evidence — append-only from exporters, not evolver edits)
- OAuth / API secrets (`OMP_*` env vars). Curator must reject secret-shaped strings

## Allowed after Phase C (project overlay only)

- `harness/omp/overlay/.omp/playbook/**`
- `harness/omp/overlay/.omp/skills/**`
- `harness/omp/overlay/.omp/tools/**`
- Staging copies under `harness/omp/staging/` of those same trees

Accept lands in **staging**. Promote to the overlay (or any OMP package file) is a **human** action via [REVIEW_QUEUE.md](REVIEW_QUEUE.md).
