# Editable surfaces (AHE × hosts)

A reviewer should be able to answer **what the evolver may touch** from this file and [KERNEL.md](KERNEL.md) without reading the Weng survey.

**Apply target (D15):** DeepSeek Harness **generated sibling plugins** in a profile-owned directory, plus overlay playbook files. The installable product is [`plugins/dsh-improveness`](../../plugins/dsh-improveness) (`dsh.bundle`). D14 **working snapshot** still describes the P1 Oh My Pi adapter.

Improveness still owns drivers at `harness/omp/`. The DSH plugin talks to them over JSONL ([node-bun protocol](../../docs/methods/node-bun-protocol.md)).

## HarnessFactory slots

One occupant for `memory`, `planning`, `action`. `capability` is an ordered set. Collisions **fail before mount**.

| Slot | P0 example |
|------|------------|
| memory | ACE playbook / filesystem evidence plane |
| planning | Debugger + bounded search |
| action | Task agent tools (not approval) |
| capability | Generated sibling plugins (ordered) |

## AHE component → path

| AHE component | DSH (P0) | OMP adapter (P1) | Evolver after gate? |
|---------------|----------|------------------|---------------------|
| System prompt | Not an evolver surface | `system-prompt.md` frozen | No |
| Tool description / impl | Generated plugin + JIT define | Overlay tools + snapshot tools except `approval.ts` | Yes — plugins with disposers |
| Middleware / hooks | Sibling plugin + HMR | Snapshot middleware | Yes if unloadable |
| Skill | Generated `SKILL.md` / capability plugins (P1 compile) | `.omp/skills/` | Yes |
| Sub-agent config | Slot occupants, not kernel Fibers | `overlay/.omp/agents/` | Agent markdown yes. Role **map** still kernel |
| Long-term memory | Playbook + archive | Playbook + `retain` | Playbook yes |
| Orchestration / core loop | Durable plugin replacing a **capability** sibling, never Cordis loader | Snapshot loop except kernel files | Yes after gate, except frozen kernel |

## Proposal map

| Item | Surface in this repo |
|------|----------------------|
| HostPort | `harness/omp/host-port/` |
| DSH bundle | `plugins/dsh-improveness/` |
| JSONL runner | `harness/omp/drivers/dsh-core-runner.ts` |
| Durable apply | `harness/omp/drivers/apply-snapshot.ts` → `harness/omp/generated/` |
| JIT | plugin `mountEphemeral` + fake-ctx tests |
| P1 Structured session export | `drivers/export-session.ts` (OMP jsonl **and** DSH session-log) |
| P5 Held-in / held-out | `evals/` + `self-harness.ts` |
| Archive | `archive/` + Pareto (P1) |
| Search | Playbook stages; plugin-class applies |
| CACD / QA / sims | Unchanged product check: `qa.sh` |
| Spatiotemporal composability | [method note](../../docs/methods/spatiotemporal-composability.md) |

## What already exists — do not re-propose

The Bun loop, frozen checker, 12/8 fixtures, and seven keyless sims stay. DSH is a **plugin host**, not a second checker. OMP `learn` / TTSR stay OMP primitives for the P1 adapter.

## Install

```text
dsh plugin --profile improveness add ./plugins/dsh-improveness
bash harness/omp/scripts/qa.sh
```
