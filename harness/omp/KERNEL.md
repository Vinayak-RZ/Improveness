# Frozen kernel

The evolver, curator, debugger, and Self-Harness driver **must not write** these paths. Maintainers may edit them; the loop may not.

See [docs/proposals/04-safety.md](../../docs/proposals/04-safety.md), [docs/proposals/06-snapshot-apply.md](../../docs/proposals/06-snapshot-apply.md), and [D14](../../DECISIONS.md).

## Always frozen (reward-hacking / AHE / permissions)

| Path | Why |
|------|-----|
| `oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md` | AHE: prompt-only evolution missed the gain (−2.3 pp). Not an improvement surface. |
| `oh-my-pi/packages/coding-agent/src/system-prompt.ts` | Assembles the system prompt; rewriting it is a kernel change |
| `oh-my-pi/packages/coding-agent/src/tools/approval.ts` | Permission kernel. Widening needs a human |
| `oh-my-pi/packages/coding-agent/src/config/model-roles.ts` | Model-role union and defaults (cannot swap to a stronger model mid-loop) |
| `oh-my-pi/packages/coding-agent/src/session/role-models.ts` | Role → model resolution |
| `oh-my-pi/packages/coding-agent/src/config/settings-schema.ts` | Settings schema including `modelRoles` |

## Improveness kernel (always frozen)

| Path | Why |
|------|-----|
| `harness/omp/evals/checker/` | Verifier. Reward-hacking if the evolver can silence it |
| `harness/omp/SURFACES.md` | Declares the contract; not a playbook |
| `harness/omp/KERNEL.md` | This file |
| `harness/omp/scripts/validate.sh` | Hardening orchestrator |
| `harness/omp/CACD.md` | Operating model; not a playbook |
| `harness/omp/scripts/qa.sh` | Repository QA orchestrator |
| `.github/workflows/overlay.yml` | Improveness CI; evolver cannot edit the gate |
| `IMPLEMENTATION_PLAN.md` | Execution contract |
| `DECISIONS.md` | ADRs |

## Runtime / config the evolver cannot change

- `modelRoles` in any `config.yml` / settings (task agent stays `default`; evolver/debugger may *use* `smol` / `advisor`, not redefine the map)
- Token / reasoning budget
- Session tracer and run logs (`~/.omp/agent/sessions/`, `harness/omp/traces/` as evidence — append-only from exporters, not evolver edits)
- OAuth / API secrets (`OMP_*` env vars). Curator must reject secret-shaped strings

## Open on the working snapshot after the gate (D14)

The apply target is **your working copy**: in-tree `oh-my-pi/` or a user-supplied agent snapshot. After held-in/held-out accept, Improveness may change that snapshot’s:

- Tool implementations and schemas (except `approval.ts`)
- Skills
- Orchestration / worker wiring
- Core agentic loop (step machine, tool executor, middleware)
- Project overlay playbook / extra tools / extra skills under `harness/omp/overlay/.omp/`

Upstream `can1357/oh-my-pi` is never the apply target unless a human separately asks.

Prefer **revertible plugins** so a live OMP session does not have to die on every self-mod ([spatiotemporal composability](../../docs/methods/spatiotemporal-composability.md)). Restart is the fallback when an edit is not unloadable.

## Current driver behavior (until `apply-snapshot` ships)

P2 `drivers/search.ts` still lands accepts in **staging**, `archive/<id>/`, and a [REVIEW_QUEUE.md](REVIEW_QUEUE.md) row (D12 as shipped). It does not yet copy into `overlay/.omp/` or `oh-my-pi/packages/`. That is a driver lag, not the product. KERNEL and allowlist stay conservative until Phase B of [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) opens snapshot paths **except** the frozen rows above.
