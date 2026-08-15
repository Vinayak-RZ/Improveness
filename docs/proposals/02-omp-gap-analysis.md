# OMP gap analysis

**OMP** = Oh My Pi ([omp.sh](https://omp.sh/), [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)). Docs cited as of **2026-08-15**. APIs move; treat paths as examples.

This page is **already present vs missing**. Change list: [03-omp-proposed-changes.md](03-omp-proposed-changes.md). Do not patch OMP from this repo.

## Surface map (AHE × OMP)

| AHE component | Generic requirement | OMP today |
|---------------|---------------------|-----------|
| System prompt | File-level, versioned | `AGENTS.md`, `SYSTEM.md`, `.omp/prompts/*.md`, `.omp/instructions/*.md` |
| Tool description | Separate from impl | `.omp/tools/*.{md,json}`; extension `tool()` schemas |
| Tool implementation | File-level, revertible | `.omp/tools/*.{ts,js,sh,py}`, `.omp/extensions/` |
| Middleware | Pre/post hooks | `.omp/hooks/{pre,post}`; TTSR; `ExtensionAPI` (superset of legacy hooks) |
| Skill | On-demand skill files | `.omp/skills/*/SKILL.md`; `~/.omp/agent/skills`; managed-skills via `learn` / `manage_skill` |
| Sub-agent config | Explicit, isolated | `task` + role models (`default` / `smol` / `slow` / `plan` / `advisor`) |
| Long-term memory | Durable, project-scoped | `retain` / `recall` / `reflect` / `memory_edit`; `memory.backend` (local / Hindsight / Mnemopi) |

## Already present — do not re-propose

- Hashline `edit` (harness-quality thesis in production)
- LSP (14 ops) and DAP (28 ops)
- In-process ripgrep / glob / bash
- `.omp/{skills,rules,prompts,instructions,hooks,tools,extensions}`
- `retain` / `recall` / `reflect` / `learn` / `manage_skill` and managed-skills (`~/.omp/agent/managed-skills`)
- TTSR (regex stream-abort + rule inject)
- Advisor role (second model, own context)
- `task` subagents with typed yields and isolated worktrees
- SDK: `createAgentSession` from `@oh-my-pi/pi-coding-agent`
- Inherits Cursor / Claude / Codex / OpenCode skills
- Maintainer stance: [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907) — trace-derived candidates for **review**, not auto-apply

## Missing vs the generic spec

| Capability | Gap |
|------------|-----|
| C3 Trace store | Sessions exist, but there is no documented **miner-ready** per-turn export (messages + tool I/O + verifier field) as a stable directory schema |
| C4 Debugger | No first-class Agent Debugger role that writes per-task reports + corpus overview |
| C5 ACE playbook | Memory/`learn` exist; no deterministic itemized curator (helpful/harmful counters, non-LLM merge) |
| C6 Self-Harness gate | No held-in / held-out driver; `learn` can promote without a regression split |
| C7 Manifests | No falsifiable change manifest + next-round rollback |
| C2 Kernel | Permissions and model roles exist, but an **evolver allowlist** (cannot touch model-role config, permissions, OMP source) is not specified as a self-improve API |
| C8 Human promote | #7907 is the policy; no shipped review-queue schema for harness candidates |

## Honest trade-off

OMP is a **strong** seed. Public-bench headroom is smaller than a bash-only NexAU0 (Lin et al.: strong models benefit less). That is acceptable: the goal is a useful spec for a harness people use, not a Terminal-Bench campaign.

OpenCode comparison (AHE TB2): OpenCode 47.2% vs Codex 71.9%. OpenCode is a weaker human baseline and lacks memory/`learn`/TTSR/DAP. Keep it as comparison only ([DECISIONS.md](../../DECISIONS.md) D3).
