# Editable surfaces (AHE × OMP)

A reviewer should be able to answer **what the evolver may touch** from this file and [KERNEL.md](KERNEL.md) without reading the Weng survey.

**Apply target (D14):** the **working snapshot** — in-tree `oh-my-pi/` or a user-supplied agent tree — plus Improveness-owned overlay files. Running Improveness is supposed to change that harness’s actual code (tools, skills, orchestration, core loop), not leave candidates in a review queue forever.

Improveness still owns drivers and the overlay at `harness/omp/overlay/.omp/`. Local runs may symlink that tree to `oh-my-pi/.omp/`. Drivers treat `harness/omp/` as source of truth for the *loop*; the snapshot is source of truth for the *agent being improved*.

## AHE component → OMP path

| AHE component | Generic (C1) | OMP today | Improveness overlay | Evolver after gate? |
|---------------|--------------|-----------|---------------------|---------------------|
| System prompt | Versioned file | `system-prompt.md`, `AGENTS.md`, `.omp/prompts/` | Do **not** evolve `system-prompt.md`. Inject ACE via overlay `AGENTS.md` + `playbook/` | No (`system-prompt.md`). Overlay `AGENTS.md` is context, not the kernel prompt |
| Tool description | Separate from impl | `.omp/tools/*.{md,json}`; extension schemas | `overlay/.omp/tools/` **and** snapshot tool docs | Yes — snapshot + project tools. Never `approval.ts` |
| Tool implementation | Revertible source | `.omp/tools/*.{ts,js,sh,py}`, `.omp/extensions/`, `packages/coding-agent/src/tools/` | `overlay/.omp/tools/` **and** snapshot tools except `approval.ts` | Yes — prefer plugins with disposers |
| Middleware / hooks | Pre/post files | `.omp/hooks/{pre,post}`; TTSR; `ExtensionAPI`; loop/middleware in packages | `overlay/.omp/hooks/` **and** snapshot middleware/loop | Yes — do not stack closure-check on TTSR |
| Skill | On-demand `SKILL.md` | `.omp/skills/*/SKILL.md`; managed-skills via `learn` | `overlay/.omp/skills/` **and** snapshot skills | Yes — reuse `learn`; do not rebuild it |
| Sub-agent config | Isolated workers | `.omp/agents/*.md`; roles include hidden `debugger` / `evolver` (D10) | `overlay/.omp/agents/debugger.md`, `evolver.md` | Agent markdown yes. Role **map** still kernel |
| Long-term memory | Durable store | `retain` / `recall` / `reflect`; ACE playbook is **new** | `overlay/.omp/playbook/` | Playbook yes. Memory backends and `learn` stay OMP primitives |
| Orchestration / core loop | Step machine | `packages/coding-agent` agent loop, tool executor, extension runner | Not overlay-only | Yes after gate, except frozen kernel files |

## Proposal map (P1–P7 + D14)

| Item | Intent | Surface in this repo | Core / snapshot later? |
|------|--------|----------------------|------------------------|
| P1 Structured session export | Miner-ready per-session directory | `harness/omp/drivers/export-session.ts` → `harness/omp/traces/` | Only if jsonl lacks tool I/O |
| P2 Debugger role | Read-only diagnosis | `overlay/.omp/agents/debugger.md` + hidden `ModelRole` | Done (D10 enum only) |
| P5b TB adapter | Harbor-shaped local tasks | `evals/tb-adapter/` | No — not a public TB2 run |
| P3 ACE playbook | Deterministic curator + context inject | `overlay/.omp/playbook/` + `drivers/curate-playbook.ts` | No |
| P4 Allowlisted evolver | Write allowlist | `overlay/.omp/agents/evolver.md` + path helper | Snapshot paths open in P3 apply driver; kernel stays denied |
| P5 Held-in / held-out | Self-Harness gate | `harness/omp/evals/` + `drivers/self-harness.ts` | No |
| P6 Change manifests | Falsifiable candidate + rollback | `overlay/.omp/manifests/` + apply/rollback drivers | Snapshot apply must keep rollback |
| P7 Review queue | Human checkpoint for *widening* | `harness/omp/REVIEW_QUEUE.md` | Not a forever park for ordinary accepts (D14) |
| Archive | DGM-lite snapshots | `harness/omp/archive/` + `drivers/archive.ts` | Never archives checker or system-prompt |
| Search | Bounded archive-driven propose loop | `drivers/search.ts` + `drivers/propose.ts` | P2 stages (D12). P3 apply writes the working snapshot |
| Snapshot apply | Mutate the agent you are using | `docs/proposals/06-snapshot-apply.md` | Yes — D14 product |
| Local Harbor | Execute Harbor-shaped fixture tasks | `drivers/run-tb-local.ts` | No — not a public TB2 run |
| Local benchmark | Improvement-cycle report | `evals/benchmarks/local-20/` | No — frozen 20-fixture suite only |
| CACD | Contract · Architecture · Control · Delivery | `CACD.md` + `cacd/catalog.ts` | No — operating model, not a playbook |
| QA | Repository-wide assurance | `drivers/qa-repo.ts` + `scripts/qa.sh` | No |
| Simulations | Named agentic-architecture replays | `drivers/simulate-architectures.ts` | No — keyless; not public TB2 |
| Spatiotemporal composability | Live unload/reload without killing OMP | [method note](../../docs/methods/spatiotemporal-composability.md) | Research in P3; not a Cordis rewrite this wave |

## What already exists — do not re-propose

OMP already has `learn`, `memory-retain` / `recall` / `reflect`, autolearn, skills, hooks, custom tools, `createAgentSession`, TTSR, and an extension loader **without** guaranteed per-extension unload. ACE is a **new artifact** (playbook), not a second `learn` tool. Live plugin disposal is the missing runtime piece, not another playbook format.

## Install

```text
bash harness/omp/scripts/install-overlay.sh
```

That merges Improveness files into the existing `oh-my-pi/.omp/` (do not replace that directory; OMP already ships commands and skills).

Drivers stay under `harness/omp/drivers/`. They may *read* a session jsonl the caller points at; they do not treat `~/.omp/agent/` as source of truth.
