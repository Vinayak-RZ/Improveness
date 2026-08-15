# cursor-config-coding

A version-controlled **Cursor AI configuration** for engineering work: phased implementation, architecture patterns, system-design trade-offs, security baselines, and stack-aware skill routing.

This repository is a **portable engineering workspace** — link it into any code project so the agent plans before coding, surfaces trade-offs, and applies frontend/backend/agentic architecture guidance automatically.

**GitHub:** [github.com/Vinayak-RZ/cursor-config-coding](https://github.com/Vinayak-RZ/cursor-config-coding)

**Companion repo (business):** [cursor-config-buisness](https://github.com/Vinayak-RZ/cursor-config-buisness) — PM, GTM, and research (separate workspace).

---

## Table of contents

1. [What this is](#what-this-is)
2. [What this is not](#what-this-is-not)
3. [Industry practices](#industry-practices)
4. [Repository specifications](#repository-specifications)
5. [Architecture system (new)](#architecture-system)
6. [Skills inventory](#skills-inventory)
7. [Rules inventory](#rules-inventory)
8. [Directory structure](#directory-structure)
9. [How to use — all methods](#how-to-use-this--all-methods)
10. [Tech stack catalog](#tech-stack-catalog)
11. [Example prompts](#example-prompts)
12. [Linking to code projects](#linking-to-code-projects)
13. [Cloud agents](#cloud-agents)
14. [Setup on a new machine](#setup-on-a-new-machine)
15. [Troubleshooting](#troubleshooting)
16. [Evolving this config](#evolving-this-config)
17. [MCP integration](#mcp-integration)
18. [Quick reference](#quick-reference)

---

## What this is

| Aspect | Description |
|--------|-------------|
| **Type** | Cursor configuration repository (rules + skills + docs) |
| **Mode** | Engineering — plan, architect, implement, validate |
| **Pre-installed skills** | **36** (nawab-plans + 10 Spec Kit + 6 ponytail + 4 architecture + Next.js + docs + learning + GSAP + UI + utilities) |
| **Project rules** | **21** `.mdc` files (ponytail + Spec Kit + workflow + architecture + security + MCP + commits + learning) |
| **MCP (default)** | [Agent Patterns Catalog](https://www.agentpatternscatalog.org/) — 421+ agentic patterns |
| **Stack skills** | **Catalog only** — install per project (Flutter, Django, etc.) |
| **Orchestration** | `AGENTS.md` at repo root |
| **Manifest** | `skills-manifest.json` |

When linked into a code project, the agent:

- Requires planning and **user approval** before large implementations
- **Ponytail-first** — always-on `ponytail.mdc` requires reading the `ponytail` skill before any code change (minimal diff, production-grade)
- **Nawab plans** — Plan mode **must** use `nawab-plans` for master execution plans (`planning.mdc`)
- **Spec Kit** — Spec-Driven Development skills for greenfield / multi-phase features ([docs/SPEC_KIT.md](docs/SPEC_KIT.md))
- **Researches and explains** unfamiliar tech before architectural choices
- **Teaches while building** — phase learning summaries, optional `LEARNING.md`
- **Commits proactively** with conventional commits after validated milestones
- **Auto-pushes** when 10 unpushed commits accumulate, or when you say push
- Applies **frontend**, **backend**, and **agentic** architecture skills when relevant
- Forces explicit **trade-off analysis** for non-obvious decisions
- Routes optional skills by tech stack ([TECH_STACK_SKILLS.md](docs/TECH_STACK_SKILLS.md))
- Blocks common **AI code anti-patterns**

---

## What this is not

- **Not a business/PM config** — use `cursor-config-buisness` for strategy and research
- **Not a monolithic `.cursorrules` file** — modular `.mdc` rules with scoped activation
- **Not a bundle of every stack skill** — only Next.js is pre-installed; others are catalogued
- **Not hooks-enforced by default** — add `.cursor/hooks.json` per project for format/lint guards

---

## Industry practices

This config follows the **three-layer model** used in professional Cursor setups (2025–2026):

| Layer | This repo |
|-------|-----------|
| **Rules** | Short invariants + scoped conventions (`.cursor/rules/`) |
| **Skills** | Deep architecture and stack workflows (`.cursor/skills/`) |
| **Hooks** | Optional per project (not included — add when you need deterministic enforcement) |

Detailed rationale: [docs/INDUSTRY_PRACTICES.md](docs/INDUSTRY_PRACTICES.md)

Inspired by: [Cursor Rules docs](https://cursor.com/docs/rules), [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules), [skills.sh](https://skills.sh/), rules↔skills pairing patterns from community configs.

---

## Repository specifications

| Spec | Value |
|------|-------|
| Pre-installed skills | 36 |
| Planning | `nawab-plans` — **mandatory in Plan mode** (`planning.mdc`) |
| Spec Kit (SDD) | 10 `speckit-*` skills + `speckit.mdc` + `install-spec-kit.ps1` |
| Ponytail (minimal code) | 6 skills + `ponytail.mdc` always-on rule |
| Architecture skills | 4 (`frontend-architecture`, `backend-architecture`, `agentic-system-design`, `system-design-tradeoffs`) |
| Documentation skill | `extensive-readme` |
| Learning skill | `learn-while-building` |
| Stack pre-install | `nextjs-app-router-patterns` only |
| Animation skills | 9 GSAP skills |
| UI skill | `impeccable` |
| Exploration | `graphify` |
| Rules (total) | 21 |
| Always-on rules | 9 (+ `ponytail`, `learn-and-research`) |
| Commit rule | `git-commit-discipline` — conventional commits + push at 10 unpushed |
| Learning guide | [docs/LEARNING_AND_RESEARCH.md](docs/LEARNING_AND_RESEARCH.md) |
| Optional catalog skills | 6+ (see `skills-manifest.json`) |
| Workflow origin | Stamped Energy Main_Website phased rules |

---

## Nawab Plans — master execution plans (pre-installed, **mandatory in Plan mode**)

Skill: `nawab-plans` · Template: `PLAN.template.md` · Subagents: `SUBAGENT_ORCHESTRATION.md`

Enforced by always-on `planning.mdc`: any Plan mode session or implementation plan **must** load this skill. Collapse unused sections as `N/A` — do not invent a thinner format.

## Ponytail — minimal code (pre-installed)

From [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail). **Mandatory gate** before any coding task. Skills + MDC only — **no Ponytail MCP**.

| Asset | Role |
|-------|------|
| `ponytail.mdc` | Always-on rule — requires reading the `ponytail` skill before code |
| `ponytail` skill | Full ladder, intensity levels (`lite` / `full` / `ultra`) |
| `ponytail-review` | Diff review for over-engineering |
| `ponytail-audit` | Whole-repo bloat audit |
| `ponytail-debt` | Ledger of `ponytail:` shortcut comments |
| `ponytail-gain` / `ponytail-help` | Scoreboard + command reference |

## Spec Kit — Spec-Driven Development (pre-installed)

From [github/spec-kit](https://github.com/github/spec-kit) (pinned **v0.12.11**). For greenfield / multi-phase features.

| Asset | Role |
|-------|------|
| `speckit-*` skills (10) | constitution → specify → plan → tasks → implement (+ clarify/analyze/checklist/converge/taskstoissues) |
| `speckit.mdc` | When to use Spec Kit (not for one-line fixes) |
| `scripts/install-spec-kit.ps1` | Scaffold `.specify/` in the **code** project |
| [docs/SPEC_KIT.md](docs/SPEC_KIT.md) | Full setup + workflow |

## Architecture system

Four pre-installed skills work together with matching rules:

### Frontend architecture

**Skill:** `frontend-architecture`  
**Rule:** `frontend-architecture.mdc` (globs: `**/*.{tsx,jsx,vue,svelte}`)

Covers: rendering strategy (SSR/CSR/ISR), component layers, state ownership, data-fetch boundaries, styling/motion defaults, anti-patterns.

### Backend architecture

**Skill:** `backend-architecture`  
**Rule:** `backend-architecture.mdc` (globs: `api/`, `services/`, `server/`, etc.)

Covers: service layers, API design, authZ placement, persistence, caching, async jobs, scalability checklist.

### Agentic system design

**Skill:** `agentic-system-design`  
**Rule:** `agentic-systems.mdc` (globs: `agent/`, `mcp`, `llm`, `.cursor/`)

Covers: tool schemas, step limits, human-in-the-loop, RAG/memory, evals, cost/latency, prompt-injection awareness.

### System design trade-offs

**Skill:** `system-design-tradeoffs`  
**Rule:** `trade-offs.mdc` (agent-requested)

Forces explicit Option A / Option B analysis with `PRIORITY = COST | SPEED | QUALITY | SIMPLICITY | CONSISTENCY | AVAILABILITY`.

```text
                    system-design-tradeoffs
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
 frontend-architecture  backend-architecture  agentic-system-design
```

Each skill includes a `references/patterns.md` pattern catalog.

---

## Skills inventory

### Spec-driven (10) — pre-installed

| Skill | When to use |
|-------|-------------|
| `speckit-constitution` | Project principles |
| `speckit-specify` | Requirements / user stories |
| `speckit-plan` | Tech plan |
| `speckit-tasks` / `speckit-implement` | Break down and build |
| `speckit-clarify` / `analyze` / `checklist` / `converge` / `taskstoissues` | Optional quality / tracking |

Guide: [docs/SPEC_KIT.md](docs/SPEC_KIT.md) · Install `.specify/`: `.\scripts\install-spec-kit.ps1 -Target "..."`

### Minimal code (6) — pre-installed, **read first**

| Skill | When to use |
|-------|-------------|
| `ponytail` | **Every coding task** — before writing or editing code |
| `ponytail-review` | Review diff for over-engineering |
| `ponytail-audit` | Whole-repo bloat audit |
| `ponytail-debt` | Harvest `ponytail:` deferred shortcuts |
| `ponytail-gain` | Benchmark scoreboard (informational) |
| `ponytail-help` | Command reference |

### Architecture (4) — pre-installed

| Skill | When to use |
|-------|-------------|
| `frontend-architecture` | UI structure, Next.js/React patterns, state, rendering |
| `backend-architecture` | APIs, services, databases, scaling |
| `agentic-system-design` | LLM features, agents, tools, MCP, RAG |
| `system-design-tradeoffs` | Any non-obvious architectural decision |

### Next.js (1) — pre-installed

| Skill | Installs (skills.sh) |
|-------|----------------------|
| `nextjs-app-router-patterns` | 20.7K |

### Animation (9) — pre-installed

`gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-plugins`, `gsap-performance`, `gsap-frameworks`, `gsap-utils`, `gsap-framer-scroll-animation`

**Not default:** `nextjs-framer-motion-animations` — install from catalog if needed.

### Documentation & learning (2) — pre-installed

| Skill | When to use |
|-------|-------------|
| `extensive-readme` | Exhaustive README / onboarding reference manual |
| `learn-while-building` | Research briefs, explain decisions, phase learning summaries |

Guide: [docs/LEARNING_AND_RESEARCH.md](docs/LEARNING_AND_RESEARCH.md)

### UI & utilities (3) — pre-installed

`impeccable`, `graphify`, `find-skills`

Full manifest: [skills-manifest.json](skills-manifest.json)

---

## Rules inventory

### Workflow (from Stamped Energy)

| Rule | Always | Purpose |
|------|--------|---------|
| `rule-awareness` | Yes | Load all rules + AGENTS.md |
| `planning` | Yes | Plans via **nawab-plans** (mandatory) + approval gate |
| `ponytail` | Yes | Minimal code — lazy senior dev ladder (always before coding) |
| `speckit` | Context | Spec-Driven Development for features / greenfield |
| `planning` | Yes | Plan before implement |
| `communication` | Yes | Risks, tradeoffs, structured updates |
| `documentation` | Yes | Keep project docs in sync |
| `learn-and-research` | Yes | Research, explain, learning summaries, keep user in loop |
| `execution` | Context | Phase-based implementation |
| `quality-gates` | Context | Validate before done |
| `git-commit-discipline` | Context | Conventional commits after milestones |

### Engineering (new)

| Rule | Always | Purpose |
|------|--------|---------|
| `core-engineering` | Yes | Minimal diff, read-before-write, trade-offs |
| `architecture-boundaries` | Yes | Layer separation |
| `ai-anti-patterns` | Yes | Block AI code smells |
| `trade-offs` | Context | Explicit decision framework |
| `frontend-architecture` | Globs | UI files |
| `backend-architecture` | Globs | Server/API files |
| `agentic-systems` | Globs | Agent/LLM code |
| `security-baseline` | Globs | Auth/API paths |
| `testing-discipline` | Globs | Test files |
| `tech-stack-skills` | Context | Points to stack catalog |
| `mcp-architecture` | Context | Agent Patterns Catalog MCP usage |

---

## Directory structure

```text
cursor-config-coding/
├── README.md
├── AGENTS.md
├── skills-manifest.json
├── .cursor/
│   ├── rules/                    # 19 .mdc files
│   ├── skills/                   # 19 pre-installed skills
│   │   ├── frontend-architecture/
│   │   ├── backend-architecture/
│   │   ├── agentic-system-design/
│   │   ├── system-design-tradeoffs/
│   │   ├── extensive-readme/
│   │   ├── learn-while-building/
│   │   ├── nextjs-app-router-patterns/
│   │   ├── gsap-*/
│   │   ├── impeccable/
│   │   └── graphify/
│   ├── skills-catalog/           # Optional stack skills (not loaded)
│   ├── mcp.json                  # Default MCP: agent-patterns
│   └── mcp.json.example          # Optional MCP servers
├── docs/
│   ├── TECH_STACK_SKILLS.md
│   ├── LEARNING_AND_RESEARCH.md
│   ├── INDUSTRY_PRACTICES.md
│   ├── MCP_SETUP.md
│   └── mcp-catalog.json
└── scripts/
    ├── link-to-project.ps1
    └── install-catalog-skill.ps1
```

---

## How to use this — all methods

### Method 1: Link into a code project (recommended)

One-time junction per project:

```powershell
cd D:\Startups\cursor-config-coding
.\scripts\link-to-project.ps1 -Target "D:\Startups\Stamped_Energy\Main_Website"
```

Creates: `Main_Website\.cursor` → this repo's `.cursor`

Keep project-specific notes in the target repo's `AGENTS.md`.

---

### Method 2: Open this repo directly

For config maintenance or testing rules/skills:

```powershell
git clone https://github.com/Vinayak-RZ/cursor-config-coding.git
cursor .
```

---

### Method 3: Clone on a new machine

```powershell
git clone https://github.com/Vinayak-RZ/cursor-config-coding.git
cd cursor-config-coding
.\scripts\link-to-project.ps1 -Target "C:\path\to\your\app"
```

---

### Method 4: Install optional catalog skills

Into a **project's** `.cursor/skills/` (not global):

```powershell
.\scripts\install-catalog-skill.ps1 `
  -Package "vercel-labs/agent-skills@vercel-react-best-practices" `
  -ProjectRoot "D:\Startups\Stamped_Energy\Main_Website"
```

---

### Method 5: Two-window workflow

| Window | Repo |
|--------|------|
| Engineering | Code project with linked `.cursor` |
| Business | [cursor-config-buisness](https://github.com/Vinayak-RZ/cursor-config-buisness) |

---

## Tech stack catalog

Pre-installed stack skill: **Next.js only** (`nextjs-app-router-patterns`).

Other stacks — documented, not pre-installed:

| Stack | Primary catalog skill | Doc |
|-------|----------------------|-----|
| Next.js | + optional Vercel/Clerk skills | [TECH_STACK_SKILLS.md](docs/TECH_STACK_SKILLS.md) |
| React | `vercel-react-best-practices` | same |
| Flutter | `flutter-apply-architecture-best-practices` | same |
| Kotlin | `kotlin-springboot` | same |
| Django | `django-patterns` | same |
| Express | `mcollina/skills@node` | same |

Machine-readable: [.cursor/skills-catalog/stacks.json](.cursor/skills-catalog/stacks.json)

---

## Example prompts

### Frontend architecture

```text
We're adding a dashboard to our Next.js App Router app.
Propose a frontend architecture: folder structure, RSC vs client boundaries, and state approach.
Surface trade-offs before coding.
```

### Backend architecture

```text
Design a REST API for user subscriptions with Stripe webhooks.
Use backend-architecture skill — service layers, idempotency, error shape.
```

### Agentic feature

```text
We need an internal agent that reads our docs and opens GitHub issues.
Use agentic-system-design — tool contracts, step limits, eval plan.
```

### Trade-offs only

```text
Should we add Redis for session cache or stick with DB sessions?
Use system-design-tradeoffs — compare options explicitly.
```

### Learn while building

```text
Help me learn as we build the auth module. Research session storage options,
present a plan for approval, then implement phase 1. End with what I should
understand and commit with a conventional message.
```

### Exhaustive README

```text
Use extensive-readme skill to rewrite this repo's README as a reference manual.
Verify counts and env vars from the codebase.
```

### Implementation (existing workflow)

```text
Implement Phase 2 of the approved plan: hero section animation with GSAP scroll trigger.
Follow execution, quality-gates, and git-commit-discipline rules.
Commit as feat(ui): add hero scroll animation when phase validates.
```

### Agent patterns via MCP

```text
Use agent-patterns MCP: recommend a recipe for a long-horizon coding agent.
Compare ReAct vs plan-and-execute via catalog edges. Cite pattern ids in the plan.
```

---


## Linking to code projects

```powershell
.\scripts\link-to-project.ps1 -Target "<absolute-path-to-code-repo>"
```

**Requirements:** Windows junction support (Developer Mode or Administrator).

**Backup:** Existing `.cursor` is renamed to `.cursor.backup.<timestamp>`.

**First project:** `D:\Startups\Stamped_Energy\Main_Website`

---

## Cloud agents

Cloud agents load skills from the **cloned repository's** `.cursor/skills/`.

1. Link this config into your app repo (or copy `.cursor/` into the app repo and commit)
2. Push to GitHub
3. Run cloud agent on that branch

Architecture skills committed here will be available once `.cursor` is part of the app repo history.

---

## Setup on a new machine

```powershell
git clone https://github.com/Vinayak-RZ/cursor-config-coding.git
cd cursor-config-coding
.\scripts\link-to-project.ps1 -Target "C:\path\to\your\app"
```

**Requirements:** Cursor, Git, PowerShell. Node.js only for `install-catalog-skill.ps1`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Rules not loading | Reload Cursor window; verify junction: `dir .cursor` in project |
| Wrong skill invoked | Name skill explicitly: "use frontend-architecture" |
| `mklink` fails | Enable Developer Mode or run PowerShell as Admin |
| Stack skill missing | Run `install-catalog-skill.ps1` — not pre-installed by design |
| Trade-offs skipped | Say "use system-design-tradeoffs before deciding" |
| Cloud missing skills | Commit `.cursor/skills/` in the app repo, not just locally |

---

## Evolving this config

1. **Agent repeats a mistake** → add/tighten a rule (keep <200 lines per file)
2. **Reusable multi-step workflow** → add a skill
3. **New stack you use often** → add row to `stacks.json` + TECH_STACK_SKILLS.md
4. **Optional skill proves valuable** → install in a project, then vendor into repo if universal

```text
one agent mistake = one rule PR
```

---

## MCP integration

This config ships with **[Agent Patterns Catalog](https://www.agentpatternscatalog.org/)** MCP — live tools over 421 patterns, 161 compositions, anti-patterns, and glossary terms.

| File | Purpose |
|------|---------|
| [`.cursor/mcp.json`](.cursor/mcp.json) | Default MCP config (agent-patterns) |
| [`.cursor/mcp.json.example`](.cursor/mcp.json.example) | Optional servers (Context7, GitHub) |
| [docs/MCP_SETUP.md](docs/MCP_SETUP.md) | Setup, verify, prompts, security |
| [docs/mcp-catalog.json](docs/mcp-catalog.json) | Machine-readable MCP catalog |
| [`.cursor/rules/mcp-architecture.mdc`](.cursor/rules/mcp-architecture.mdc) | When agent should call MCP |

**Endpoint:** `https://mcp.agentpatternscatalog.org/mcp` (no API key required)

**Key tools:** `find_pattern`, `recommend_recipe`, `pattern_for_symptom`, `glossary_term`

```text
Design agent feature → MCP recommend_recipe → agentic-system-design skill → implement
Debug agent loop     → MCP pattern_for_symptom → fix with catalog anti-patterns
```

After editing `mcp.json`, reload Cursor. Full guide: [MCP_SETUP.md](docs/MCP_SETUP.md).

---

## Quick reference

| I want to… | Do this |
|------------|---------|
| Wire into a code repo | `.\scripts\link-to-project.ps1 -Target "..."` |
| Draft / Plan mode plan | `nawab-plans` skill (mandatory) + `PLAN.template.md` |
| Spec-Driven feature | `speckit-*` skills + [SPEC_KIT.md](docs/SPEC_KIT.md) |
| Minimal production-grade code | `ponytail` skill + `ponytail.mdc` (automatic) |
| Frontend architecture | "Use frontend-architecture skill" |
| Backend / API design | "Use backend-architecture skill" |
| Build an AI agent | "Use agentic-system-design skill" |
| Compare options | "Use system-design-tradeoffs" |
| React perf patterns | `install-catalog-skill.ps1` + vercel-react-best-practices |
| Learn while building | `learn-while-building` skill + [LEARNING_AND_RESEARCH.md](docs/LEARNING_AND_RESEARCH.md) |
| Exhaustive README | `extensive-readme` skill |
| Auto conventional commits + push | `git-commit-discipline` + `~/.cursor/rules/git-commit-push-global.mdc` |
| PM / GTM work | Open [cursor-config-buisness](https://github.com/Vinayak-RZ/cursor-config-buisness) |
| Decks / video | Open [cursor-config-design](https://github.com/Vinayak-RZ/cursor-config-design) |
| Map a codebase | `graphify` on target folder |
| Polish UI | `impeccable` |
| Scroll animation | `gsap-framer-scroll-animation` |
| Agent architecture patterns | Agent-patterns MCP + `agentic-system-design` |
| Debug agent loops | MCP `pattern_for_symptom` |
| MCP not connecting | Reload window; check Output → MCP Logs |
