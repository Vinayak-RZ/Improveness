# Frozen kernel

The evolver, curator, debugger, Self-Harness driver, and generated plugins **must not write** these paths or **unload** these ids. Maintainers may edit them; the loop may not.

See [docs/proposals/04-safety.md](../../docs/proposals/04-safety.md), [D14](../../DECISIONS.md), [D15](../../DECISIONS.md).

Stable kernel ids are **row ids / package namespaces / routes / owned paths**, not Cordis Fiber instance ids.

## Always frozen (reward-hacking / AHE / permissions)

| Path | Why |
|------|-----|
| `oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md` | AHE: prompt-only evolution missed the gain (−2.3 pp). Not an improvement surface. |
| `oh-my-pi/packages/coding-agent/src/system-prompt.ts` | Assembles the system prompt; rewriting it is a kernel change |
| `oh-my-pi/packages/coding-agent/src/tools/approval.ts` | Permission kernel. Widening needs a human |
| `oh-my-pi/packages/coding-agent/src/config/model-roles.ts` | Model-role union and defaults (cannot swap to a stronger model mid-loop). OMP 18+ has no built-in `debugger`/`evolver` roles — Improveness agents live under `harness/omp/overlay/.omp/agents/` |
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
| `plugins/dsh-improveness/` | The Improveness plugin **is** the kernel for DSH; siblings go in generated dirs |

## Runtime / config the evolver cannot change

- `modelRoles` in any `config.yml` / settings (task agent stays `default`; evolver/debugger may *use* `smol` / `advisor`, not redefine the map)
- Token / reasoning budget
- Session tracer and run logs (`~/.omp/agent/sessions/`, DSH session-log, `harness/omp/traces/` as evidence — append-only from exporters, not evolver edits)
- OAuth / API secrets (`OMP_*` / `DSH_*` env vars). Curator must reject secret-shaped strings
- DSH Cordis loader, approval/permissions routes, default model routes
- Frozen ids: `dsh-improveness`, `improveness.checker`, `improveness.qa`, `dsh.approval`, `dsh.permissions`, `dsh.model-routes`, `dsh.cordis-loader`

## Open after the gate (D15)

Durable apply target is **profile-owned generated plugins**, never `node_modules` and never this bundle:

- Live: `$DSH_HOME/profiles/improveness/improveness-generated/<id>/`
- Checkout tests: `harness/omp/generated/<id>/`

Plus overlay playbook / extra tools / extra skills under `harness/omp/overlay/.omp/` (still staged for playbook-class candidates).

P1 OMP HostPort may mutate a **working snapshot** (`oh-my-pi/` or a user-supplied tree) except the frozen rows above. Upstream `can1357/oh-my-pi` is never the apply target unless a human separately asks.

Prefer **revertible plugins** so a live session does not have to die on every self-mod ([spatiotemporal composability](../../docs/methods/spatiotemporal-composability.md)). Restart is the fallback when an edit is not unloadable.

## Current driver behavior

Playbook-class accepts still land in **staging**, `archive/<id>/`, and a [REVIEW_QUEUE.md](REVIEW_QUEUE.md) row. Plugin-class accepts that pass isolated load/dispose/policy checks write the generated dir and can HMR. That split is intentional: playbook files are not Cordis packages.
