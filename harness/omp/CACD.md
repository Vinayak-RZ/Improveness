# CACD — Contract · Architecture · Control · Delivery

Improveness’s operating model for evolving an **agentic harness** while the model and the permission kernel stay frozen.

This is not a second nawab plan. It is the checklist a simulation or QA run can verify.

## Definitions

| Term | Meaning in this repo |
|------|----------------------|
| **CACD** | Four layers that must stay consistent: **C**ontract (what may change), **A**rchitecture (how the loop is wired), **C**ontrol (what the loop is forbidden to do), **D**elivery (how a candidate becomes evidence, not authority). |
| **QA** | Repository-wide assurance: authority files exist, relative links resolve, the kernel list is complete, fixtures are intact, the CACD catalog matches the tree, and every named architecture simulation passes. Broader than `bun test` on one folder. |
| **Simulation** | A deterministic, keyless replay of a *named agentic architecture* against the frozen 20-fixture suite and the CACD controls. No live LLM. Used to compare topologies (ACE-only, Self-Harness-gated, leaked held-out, kernel-writing evolver, unbounded loop, auto-promote). |
| **Agentic architecture** | How roles, memory, tools, evaluators, and promote rights are wired — not the model weights. Improveness’s selling point is that these wirings can be **simulated** before anyone spends tokens. |

## Layers

### Contract

What is editable vs frozen. Reviewers should not need the Weng paper.

- [KERNEL.md](KERNEL.md)
- [SURFACES.md](SURFACES.md)
- [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md)
- [DECISIONS.md](../../DECISIONS.md)

### Architecture

How the loop is supposed to run.

- Task or playbook-solver → traces/scores → debugger → evolver → frozen checker → `decideAccept` → staging / reject
- Evolver is mid/small (D6). Task agent stays `default`.
- Playbook is context (`AGENTS.md`), not `system-prompt.md`.

### Control

What must throw or reject.

- Path allowlist (`assertEvolverWrite`)
- Held-out ids hidden from the proposer
- `MAX_STEP_CAP = 8`
- Frozen checker (not an LLM judge)
- No writes to `oh-my-pi/packages/` or `evals/checker/`

### Delivery

How a gain becomes evidence.

- Accept → `staging/` + `archive/<id>/` + `REVIEW_QUEUE.md` row
- `apply to project .omp? = no` until a human says otherwise (D7, D12)
- CI: [`.github/workflows/overlay.yml`](../../.github/workflows/overlay.yml)

## Machine catalog

[cacd/catalog.ts](cacd/catalog.ts) lists every item QA will open. If you add a kernel path or a simulation id, add it there in the same commit.

## Run

```text
bash harness/omp/scripts/qa.sh
bun harness/omp/drivers/simulate-architectures.ts
```
