# Editable surfaces (AHE × OMP)

A reviewer should be able to answer **what the evolver may touch** from this file and [KERNEL.md](KERNEL.md) without reading the Weng survey.

Improveness owns the overlay at `harness/omp/overlay/.omp/`. Local runs may symlink that tree to `oh-my-pi/.omp/`. Drivers always treat `harness/omp/` as source of truth.

## AHE component → OMP path

| AHE component | Generic (C1) | OMP today | Improveness overlay (writable later) | Evolver? |
|---------------|--------------|-----------|--------------------------------------|----------|
| System prompt | Versioned file | `oh-my-pi/packages/coding-agent/src/prompts/system/system.md`, `AGENTS.md`, `.omp/prompts/` | Do **not** evolve `system.md`. Inject ACE via overlay `AGENTS.md` + `playbook/` | No (`system.md`). Overlay `AGENTS.md` is context, not the kernel prompt |
| Tool description | Separate from impl | `.omp/tools/*.{md,json}`; extension schemas | `overlay/.omp/tools/` | Yes — project tools only |
| Tool implementation | Revertible source | `.omp/tools/*.{ts,js,sh,py}`, `.omp/extensions/` | `overlay/.omp/tools/` | Yes — project tools only. Never `oh-my-pi/packages/coding-agent/src/tools/*.ts` |
| Middleware / hooks | Pre/post files | `.omp/hooks/{pre,post}`; TTSR; `ExtensionAPI` | `overlay/.omp/hooks/` | Yes — project hooks only. Do not stack closure-check on TTSR |
| Skill | On-demand `SKILL.md` | `.omp/skills/*/SKILL.md`; managed-skills via `learn` | `overlay/.omp/skills/` | Yes — project skills. Reuse `learn`; do not rebuild it |
| Sub-agent config | Isolated workers | `.omp/agents/*.md`; roles include hidden `debugger` / `evolver` (D10) | `overlay/.omp/agents/debugger.md`, `evolver.md` | Agent markdown yes. Role **map** still kernel |
| Long-term memory | Durable store | `retain` / `recall` / `reflect`; ACE playbook is **new** | `overlay/.omp/playbook/` | Playbook yes. Memory backends and `learn` stay OMP primitives |

## Proposal map (P1–P7)

| Item | Intent | Surface in this repo | Core patch later? |
|------|--------|----------------------|-------------------|
| P1 Structured session export | Miner-ready per-session directory | `harness/omp/drivers/export-session.ts` → `harness/omp/traces/` | Only if jsonl lacks tool I/O |
| P2 Debugger role | Read-only diagnosis | `overlay/.omp/agents/debugger.md` + hidden `ModelRole` | Done (D10 enum only) |
| P5b TB adapter | Harbor-shaped local tasks | `evals/tb-adapter/` | No — not a public TB2 run |
| P3 ACE playbook | Deterministic curator + context inject | `overlay/.omp/playbook/` + `drivers/curate-playbook.ts` | No |
| P4 Allowlisted evolver | Write allowlist | `overlay/.omp/agents/evolver.md` + path helper | Only if SDK cannot restrict paths |
| P5 Held-in / held-out | Self-Harness gate | `harness/omp/evals/` + `drivers/self-harness.ts` | No |
| P6 Change manifests | Falsifiable candidate + rollback | `overlay/.omp/manifests/` + apply/rollback drivers | No |
| P7 Review queue | Human promote | `harness/omp/REVIEW_QUEUE.md` | No |

## What already exists — do not re-propose

OMP already has `learn`, `memory-retain` / `recall` / `reflect`, autolearn, skills, hooks, custom tools, `createAgentSession`, and TTSR. ACE is a **new artifact** (playbook), not a second `learn` tool.

## Install

```text
bash harness/omp/scripts/install-overlay.sh
```

That merges Improveness files into the existing `oh-my-pi/.omp/` (do not replace that directory; OMP already ships commands and skills).

Drivers stay under `harness/omp/drivers/`. They may *read* a session jsonl the caller points at; they do not treat `~/.omp/agent/` as source of truth.
