# cursor-config-coding: extensive internals

Companion to the main [README](../README.md). Concepts first, then how the repo
runs, then every package. Paths below exist in this tree.

## Table of contents

- [1. Domain concepts](#1-domain-concepts)
- [2. How this repository runs](#2-how-this-repository-runs)
- [3. Package map](#3-package-map)
- [4. Packages](#4-packages)
- [4.10 Cross-package edges](#410-cross-package-edges)
- [5. Configuration](#5-configuration)
- [6. Tests and CI](#6-tests-and-ci)
- [7. Further reading](#7-further-reading)
- [8. Future advancements](#8-future-advancements)

## 1. Domain concepts

This repo is a **Cursor config distro**. There is no app runtime and no
`package.json`. The product is rules, skills, MCP config, and scripts that
junction into another repo's `.cursor`.

### Portable skills

A skill here names a **job** (plan, README, architecture). It must not name a
customer, a private gold README, or a local disk path as if that were the
product. `validate-config.ps1` fails the tree if skill bodies contain a small
banned list of those strings. Limit: portability is a writing rule, not a
compiler. A new skill can still leak a path if nobody runs the script.

### Always-on budget

Cursor injects `alwaysApply: true` rules into every chat. This tree keeps
**three** of them: `rule-awareness`, `ponytail`, `ai-anti-patterns`. Together
they are **51 lines**, under a **120-line** budget in the validator. The other
18 `.mdc` files stay on disk with `alwaysApply: false` (description, globs, or
manual `@`). Limit: the agent can still skip a requested rule. Hooks are not
shipped; add `.cursor/hooks.json` in the **app** if you need enforcement.

See [ADR-001](../DECISIONS.md).

### Nawab profiles

`nawab-plans` is the execution contract. Cursor Plan mode defaults to **lite**
(§0 §1 §9 §16 §18). **standard** and **project** add sections. Do not pad lite
to 18 headings. A one-file hotfix skips nawab and uses ponytail only. Limit:
lite will under-specify a multi-package platform. Ask for project then.

See [ADR-002](../DECISIONS.md).

### Spec Kit pin and junction safety

`speckit` is one router skill. CLI pin is **v1.0.6** from [github/spec-kit](https://github.com/github/spec-kit).
Skills live in this config. `.specify/` must live in the **app**.
`install-spec-kit.ps1` inits Spec Kit in a temp directory and copies `.specify/`
only, because `specify init --force` into a junctioned `.cursor` would write
into this repo. Extra `/speckit-*` commands are catalog / `find-skills`, not
preinstalled. Limit: the skill does nothing useful until `.specify/` exists in the target app.

See [ADR-004](../DECISIONS.md) and [SPEC_KIT.md](SPEC_KIT.md).

### XOR graphs vs graphify

`graph-engineering` (one-shot nodes with linked plans) and `graph-of-loops`
(maker + checker until a stop command) are opt-in. Never both. Never auto-chain.
Neither is `graphify` (a knowledge-graph CLI on a folder). Both graph skills set
`disable-model-invocation: true`; the user must name them. Limit: naming both
is a stop-and-ask, not a merge.

### Ponytail ladder

Before any code edit, the agent reads `.cursor/skills/ponytail/SKILL.md` and
climbs YAGNI → reuse this repo → stdlib → native → installed dep → one line →
minimum that works. Default intensity is **full**. There is **no Ponytail MCP**
in this config. Limit: ponytail must not delete trust-boundary validation,
data-loss handling, security, accessibility, or anything the user asked for.

### Architecture quartet and catalog stacks

Four pre-installed skills cover UI, API/data, agents, and trade-offs. Matching
rules attach by glob or description. Pre-installed **stack** skills:
`nextjs-app-router-patterns` and `vercel-react-best-practices`. Flutter, Django,
Kotlin, Express, extra GSAP slices, and similar live in `.cursor/skills-catalog/`
and [TECH_STACK_SKILLS.md](TECH_STACK_SKILLS.md). Limit: the catalog is documentation.
Cursor does not load `skills-catalog/` as skills.

### README family

`readme` is a router. `product-readme` writes a category landing for an
installable product. `readable-readme` writes a one-sitting internal-service
overview. `extensive-readme` writes this file. Writers load `copywriting` and
`readme/anti-slop.md`. Limit: the router asks when kind is unknown. Do not
dump a package map into `README.md`.

See [ADR-003](../DECISIONS.md).

## 2. How this repository runs

There is no server. The runtime is: clone this lab → junction it into an app →
open that app in Cursor → the agent reads `AGENTS.md` and the always-on stubs.

```mermaid
sequenceDiagram
  actor You
  participant Link as link-to-project.ps1
  participant App as App repo
  participant Cursor
  participant Agent

  You->>Link: -Target app path
  Link->>App: mklink /J .cursor to this clone
  Link->>App: seed AGENTS.md if missing
  You->>Cursor: open the app
  Cursor->>Agent: always-on stubs plus AGENTS.md
  You->>Agent: describe the job
  Agent->>Agent: read ponytail before edits
  alt Plan mode
    Agent->>Agent: nawab-plans at lite
  else Greenfield and .specify exists
    Agent->>Agent: speckit workflow
  end
  Agent->>App: implement, validate, conventional commit
```

**Walkthrough**

1. Clone `cursor-config-coding`. Keep it as the source of `.cursor`.
2. Run `scripts/link-to-project.ps1`. Windows creates a junction
   `app/.cursor` → `cursor-config-coding/.cursor`. An existing `.cursor` is
   renamed to `.cursor.backup.<timestamp>`. `AGENTS.md` is copied from
   `templates/AGENTS.overlay.md` only when the app has none.
3. Cursor loads `.cursor/mcp.json` (Agent Patterns Catalog, no API key).
4. Always-on: `rule-awareness` points at `AGENTS.md` and the skill table.
   `ponytail` requires the ponytail skill before edits. `ai-anti-patterns`
   blocks copy-paste logic, swallowed exceptions, speculative abstractions.
5. Plan mode loads `nawab-plans` via `planning.mdc`. Greenfield loads
   `speckit` via `speckit.mdc` once `.specify/` exists.
6. Frontend/backend/agent globs pull architecture skills. Trade-offs are
   agent-requested. Stack extras install through `install-catalog-skill.ps1`.
7. After a milestone, `git-commit-discipline.mdc` wants a conventional commit.
   Auto-push at 10 unpushed commits, or when you ask.
8. `scripts/validate-config.ps1` is the distro gate: 30 skills, three always-on
   names, line budget, Spec Kit pin, lite template, portable skill bodies.

**Cloud path.** A junction is local. Cloud agents need `.cursor/skills/` in the
app repo history. Copy or vendor the skills, then push.

**Maintenance path.** Open this repo in Cursor to change the lab itself. Sync
the five README/copywriting skills to `~/.cursor/skills` with
`sync-coding-skills.ps1` (junctioned app trees are left alone).

## 3. Package map

This is not an npm workspace. Top-level folders are the packages.

| Package | Path | Role | Entry |
|---------|------|------|-------|
| Root contract | `.` | What the agent and the validator treat as source of truth | `AGENTS.md`, `skills-manifest.json` |
| Rules | `.cursor/rules` | 21 `.mdc` invariants (3 always-on) | `rule-awareness.mdc` |
| Skills | `.cursor/skills` | 30 pre-installed jobs | each `SKILL.md` |
| Skills catalog | `.cursor/skills-catalog` | Optional stacks, not loaded by Cursor | `stacks.json` |
| MCP | `.cursor/mcp.json` | Default Agent Patterns Catalog | `mcp.json` |
| Scripts | `scripts/` | Junction, Spec Kit, sync, catalog, validate | `link-to-project.ps1` |
| Docs | `docs/` | Operator guides | `SPEC_KIT.md`, this file |
| Templates | `templates/` | App `AGENTS.md` seed | `AGENTS.overlay.md` |

## 4. Packages

### 4.1 Root contract (`.`)

**What it is for.** Orchestration and inventory for the distro itself.

**How it is used.** Cursor reads `AGENTS.md` in this repo and in every linked
app that got the overlay. `validate-config.ps1` reads `skills-manifest.json`
and `README.md`.

**How it works.** `AGENTS.md` is the short always-on map: ponytail → nawab
lite in Plan mode → Spec Kit for greenfield → implement → validate → commit.
`skills-manifest.json` version 8 lists the 30 skills, MCP default, Spec Kit
pin, and optional catalog rows. `DECISIONS.md` holds ADRs 001-004.
`IMPLEMENTATION_PLAN.md` and `PROGRESS.md` are the 2026 audit ledger for
**this** config, not for linked apps.

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `AGENTS.md` | Agent entry for this lab | Routes to skills; link/install commands |
| `skills-manifest.json` | Machine inventory | Expected skill count, MCP, Spec Kit pin, catalog |
| `README.md` | Public landing | Category, conversion, proof, prompts |
| `DECISIONS.md` | ADRs for this distro | Always-on slim, nawab profiles, README family, Spec Kit pin |
| `IMPLEMENTATION_PLAN.md` | Audit execution contract | 2026 modernization plan (complete) |
| `PROGRESS.md` | Audit status | Phase list and validate-config gate |
| `.gitignore` | Keep cache out of git | Ignores `.cursor/skills-catalog/.cache/` |

### 4.2 Rules (`.cursor/rules`)

**What it is for.** Short, scoped instructions Cursor can inject.

**How it is used.** Always-on stubs load every chat. Others attach by glob,
description, Plan mode, or `@mention`.

**How it works.** Frontmatter `alwaysApply` / `globs` / `description`. Stubs
point at skills instead of duplicating workflows. See
[Cursor Rules](https://cursor.com/docs/rules).

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `rule-awareness.mdc` | Always-on index | Read `AGENTS.md`; ponytail before code; nawab in Plan mode |
| `ponytail.mdc` | Always-on gate | Require `ponytail` skill before edits |
| `ai-anti-patterns.mdc` | Always-on smell list | Reject duplicate logic, `any`, swallowed errors, god files |
| `planning.mdc` | Plan mode | Load `nawab-plans` at lite / standard / project |
| `speckit.mdc` | Greenfield | When Spec Kit applies (not one-line fixes) |
| `execution.mdc` | Implementing | Phase-sized work; ponytail gate |
| `quality-gates.mdc` | Completing | Validate, report, commit |
| `communication.mdc` | Substantial tasks | Risks, limits, phase reports |
| `documentation.mdc` | App repos | `IMPLEMENTATION_PLAN` / `DECISIONS` / `PROGRESS`; this distro uses `README.md` |
| `learn-and-research.mdc` | Unfamiliar tech | Research brief, teach-while-building |
| `git-commit-discipline.mdc` | After milestones | Conventional commits; push at 10 unpushed |
| `core-engineering.mdc` | Coding | Minimal diff, read-before-write |
| `architecture-boundaries.mdc` | Layers | Presentation → domain → data |
| `trade-offs.mdc` | Architecture choice | Explicit Option A / B |
| `frontend-architecture.mdc` | UI globs | Load frontend skill |
| `backend-architecture.mdc` | API globs | Load backend skill |
| `agentic-systems.mdc` | Agent globs | Load agentic skill + MCP |
| `security-baseline.mdc` | Auth/API globs | Boundary checks, no secrets in git |
| `testing-discipline.mdc` | Test globs | Tests that match risk |
| `tech-stack-skills.mdc` | Stack manifest files | Point at the catalog, do not install everything |
| `mcp-architecture.mdc` | Agent design | Prefer Agent Patterns Catalog over guessing |

### 4.3 Skills (`.cursor/skills`)

**What it is for.** Deep workflows the always-on stubs refuse to inline.

**How it is used.** The agent reads `SKILL.md` when a rule, `AGENTS.md`, or the
user names the skill. Graph skills wait until the user names them.

**How it works.** Each folder with a `SKILL.md` is one pre-installed skill.
`validate-config.ps1` counts those folders and expects **30**.

#### Pre-installed skills

| Skill | Why it is here | What it does |
|-------|----------------|--------------|
| `nawab-plans` | Default plan | Lite / standard / project execution contracts |
| `graph-engineering` | Opt-in one-shot | Graph of linked node plans; not graphify |
| `graph-of-loops` | Opt-in long run | Maker + checker loops until a stop command |
| `ponytail` | Every code edit | Lazy-senior ladder, intensity levels |
| `ponytail-review` | Diff review | Over-engineering on the current diff |
| `ponytail-audit` | Whole-repo | Bloat audit |
| `ponytail-debt` | Shortcuts | Harvest `ponytail:` comments |
| `ponytail-gain` | Scoreboard | Informational benchmark notes |
| `ponytail-help` | Reference | Ponytail command list |
| `speckit` | Spec Kit | Router: when to use, phase order, needs `.specify/` |
| `frontend-architecture` | UI work | Rendering, state, boundaries |
| `backend-architecture` | API / data | Layers, authZ, persistence |
| `agentic-system-design` | Agents | Tools, step limits, evals, MCP |
| `system-design-tradeoffs` | Hard choices | Option A / B with a named priority |
| `nextjs-app-router-patterns` | Next.js | App Router patterns |
| `vercel-react-best-practices` | React / Next | Waterfalls, bundle, RSC perf |
| `readme` | Unknown README | Ask product vs readable vs extensive |
| `product-readme` | OSS / host-run landing | Category, conversion, counts, proof |
| `readable-readme` | Internal service | One-sitting overview |
| `extensive-readme` | Internals companion | This document's skill |
| `copywriting` | Public sentences | Scorecard + anti-slop; never invent proof |
| `learn-while-building` | Teaching | Research briefs, phase learning |
| `impeccable` | UI polish | Craft, type, motion, critique |
| `frontend-design` | Blank-canvas UI | Distinctive visual identity |
| `web-design-guidelines` | UI audit | A11y / UX / forms / focus |
| `computer-use` | GUI policy | Codex ladder mapped to Cursor (no desktop CUA) |
| `agent-browser` | GUI tool | Chrome / CDP / a11y-tree `@eN` refs |
| `graphify` | Codebase map | Knowledge graph CLI on a folder |
| `find-skills` | Discovery | Find more skills |
| `gsap-framer-scroll-animation` | Animation | Scroll work; extra GSAP slices via `find-skills` |

#### Extra files (not every `SKILL.md`)

| File | Why it is here | What it does |
|------|----------------|--------------|
| `speckit-SOURCE.txt` | Pin note | Records v1.0.6 generation; validator greps it |
| `nawab-plans/PLAN.template.lite.md` | Lite plan | Required sections only |
| `nawab-plans/PLAN.template.md` | Full plan | §0-§18 |
| `nawab-plans/SUBAGENT_ORCHESTRATION.md` | Project profile | Parallel workstream rules |
| `graph-engineering/GRAPH.template.md` | Graph master | Shape of the one-shot graph |
| `graph-engineering/NODE.template.md` | Node plan | Per-slice plan file |
| `graph-engineering/TOPOLOGIES.md` | Layouts | What can run in parallel |
| `graph-engineering/LIFECYCLE.md` | Stages | docs-in through docs-out |
| `graph-of-loops/LOOP_GRAPH.template.md` | Loop master | Graph whose nodes are loops |
| `graph-of-loops/LOOP.template.md` | One loop | Maker / checker / stop |
| `graph-of-loops/QUESTIONS.md` | Intake | Questions before guesses |
| `graph-of-loops/PRODUCT.md` | Lock | Users, P0, non-goals |
| `graph-of-loops/DECISIONS.md` | ADRs | Architecture lock for that run |
| `graph-of-loops/QUALITY.md` | Stop commands | What "done" means for a loop |
| `graph-of-loops/EXECUTE.md` | Runbook | How to execute the graph |
| `graph-of-loops/CYCLE.md` | Cycle | Boot, trials, docs-out |
| `readme/anti-slop.md` | Voice gate | Wikipedia-derived LLM cadence bans |
| `copywriting/scorecard.md` | Copy gate | One idea, Dry tests, counts |
| `product-readme/templates.md` | Landing skeleton | Host-run vs library |
| `product-readme/checklist.md` | Pre-ship | First-screen critique |
| `product-readme/examples.md` | Density notes | Steal structure, not slogans |
| `readable-readme/templates.md` | Internal skeleton | Seven-section overview |
| `readable-readme/checklist.md` | Pre-ship | Readable checks |
| `extensive-readme/templates.md` | Internals skeleton | Concepts before packages |
| `extensive-readme/checklist.md` | Pre-ship | Path accuracy |
| `extensive-readme/further-reading.md` | Citations | Never invent URLs |
| `frontend-architecture/references/patterns.md` | Pattern list | UI patterns for that skill |
| `backend-architecture/references/patterns.md` | Pattern list | API / data patterns |
| `agentic-system-design/references/patterns.md` | Pattern list | Agent patterns |
| `nextjs-app-router-patterns/references/details.md` | Next details | App Router notes |
| `gsap-framer-scroll-animation/references/gsap.md` | GSAP notes | Scroll animation reference |
| `graphify/references/cli.md` | CLI | graphify usage |
| `graphify/.graphify_version` | Pin | graphify version stamp |

`impeccable/reference/` and `impeccable/scripts/` are a large vendored UI
craft kit (dozens of reference notes and live-preview scripts). Use
`impeccable/SKILL.md` as the entry. Do not treat those files as this distro's
public API.

### 4.4 Skills catalog (`.cursor/skills-catalog`)

**What it is for.** Document optional stack skills without loading them.

**How it is used.** Humans and `tech-stack-skills.mdc` read it. Cursor does not
auto-load this folder as skills.

**How it works.** `stacks.json` maps detect files (`package.json`,
`pubspec.yaml`, `build.gradle.kts`, `manage.py`) to primary and recommended
install strings. `install-catalog-skill.ps1` runs `npx skills add`.

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `README.md` | Human index | What is pre-installed vs optional |
| `stacks.json` | Machine index | Next.js, React, Flutter, Kotlin, Django, Express |

### 4.5 MCP (`.cursor`)

**What it is for.** Live tools for agent architecture.

**How it is used.** Linked into every junctioned app. Reload Cursor after edits.

**How it works.** Default server `agent-patterns` at
`https://mcp.agentpatternscatalog.org/mcp` (no API key). Homepage of the
catalog (fetched 2026-09-13) lists **562** patterns and **252** compositions.
`docs/MCP_SETUP.md` still says "421+" in places; treat the live site as current.
There is no Ponytail MCP. Optional GitHub and Context7 servers live in
`mcp.json.example` (tokens required).

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `.cursor/mcp.json` | Default | Agent Patterns Catalog only |
| `.cursor/mcp.json.example` | Optional servers | GitHub + Context7 plus the default |

### 4.6 Scripts (`scripts/`)

**What it is for.** Operate the distro on a machine.

**How it is used.** PowerShell from this clone. `sync-coding-skills.sh` is the
Git Bash twin of the README-skill sync.

**How it works.** Scripts resolve `$PSScriptRoot` to the config root. Link uses
`cmd /c mklink /J`. Spec Kit install uses `uv` + `specify` in `%TEMP%`.

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `link-to-project.ps1` | Primary install | Junction app `.cursor`; seed `AGENTS.md` if missing |
| `install-spec-kit.ps1` | Greenfield | Install specify-cli@v1.0.6; copy `.specify/` into the app |
| `sync-coding-skills.ps1` | README family sync | Copy five skills to `~/.cursor/skills` and non-junction local copies |
| `sync-coding-skills.sh` | Same on Git Bash | Twin of the `.ps1` |
| `install-catalog-skill.ps1` | Optional stacks | `npx skills add` into an app's `.cursor/skills` |
| `validate-config.ps1` | Distro gate | Skill count, always-on names/lines, Spec Kit pin, portability |

`sync-coding-skills.ps1` defaults `-Roots` to two local workspace folders. That
is operator config for the maintainer machine, not a product claim. Pass
`-Roots` to point it at your own trees. Junctioned `.cursor` directories are
skipped because they already point here.

### 4.7 Docs (`docs/`)

**What it is for.** Operator manuals the landing README must not swallow.

**How it is used.** Linked from the README "Go deeper" table and from
`AGENTS.md` / `skills-manifest.json`.

**How it works.** Each file is a topic. This extensive file is the package map.

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `EXTENSIVE.md` | Internals companion | This document |
| `SPEC_KIT.md` | Spec Kit ops | Pin, install, skill order, junction warning |
| `MCP_SETUP.md` | MCP ops | Verify connection, prompts, security |
| `mcp-catalog.json` | Machine MCP list | Default + optional servers |
| `TECH_STACK_SKILLS.md` | Stack catalog (human) | Install commands per stack |
| `INDUSTRY_PRACTICES.md` | Why three layers | Rules vs skills vs hooks; evolution rule |
| `LEARNING_AND_RESEARCH.md` | Teaching loop | Research brief → approve → learn bullets |

### 4.8 Templates (`templates/`)

**What it is for.** Per-app overlay that must not duplicate the shared SDLC.

**How it is used.** `link-to-project.ps1` copies it when the target has no
`AGENTS.md`. Never overwrites an existing file.

**How it works.** Short bullets: ponytail, nawab lite, Spec Kit, README router.
A "This repo" section is left as blanks for the app's own invariants.

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `AGENTS.overlay.md` | Seed only | App-local `AGENTS.md` starter |

### 4.9 Brand (`assets/`)

**What it is for.** Landing mark. No favicon in this tree.

**How it is used.** `README.md` centers the character, then the wordmark.

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `assets/cursor-config-coding-logo.svg` | Character mark | Lab gecko (goggles, wrench, caret on the chest) |
| `assets/cursor-config-coding-wordmark.svg` | Name lockup | `cursor-config` over `coding` |

### 4.10 Cross-package edges

```text
rule-awareness.mdc → AGENTS.md → skills-manifest.json
ponytail.mdc → ponytail/SKILL.md
planning.mdc → nawab-plans (lite default)
speckit.mdc → speckit + install-spec-kit.ps1 + docs/SPEC_KIT.md
tech-stack-skills.mdc → skills-catalog/stacks.json + docs/TECH_STACK_SKILLS.md
mcp-architecture.mdc → mcp.json + agentic-system-design + docs/MCP_SETUP.md
link-to-project.ps1 → templates/AGENTS.overlay.md + .cursor/
validate-config.ps1 → skills-manifest.json + rules + README.md + speckit pin files
sync-coding-skills.ps1 → copywriting, readme, product-readme, readable-readme, extensive-readme
product-readme → copywriting + readme/anti-slop.md
```

## 5. Configuration

| Item | Where | Notes |
|------|--------|--------|
| Default MCP | `.cursor/mcp.json` | `agent-patterns`, no key |
| Optional MCP | `.cursor/mcp.json.example` | GitHub token, Context7 key |
| Skill inventory | `skills-manifest.json` | `preinstalled.count` must stay 30 |
| Spec Kit pin | manifest, `SPEC_KIT.md`, `speckit-SOURCE.txt`, `install-spec-kit.ps1` | `v1.0.6` |
| Stack detect | `skills-catalog/stacks.json` | Not auto-installed |
| Always-on line budget | `validate-config.ps1` | 120 lines |
| App overlay | `templates/AGENTS.overlay.md` | Copied once |
| Hooks | none | Add per app if you need format/lint enforcement |
| License file | none | No `LICENSE` in this tree today |
| Env files | none | No `.env`; do not put secrets in `mcp.json` |

After editing `mcp.json`, reload the Cursor window. Troubleshooting: Output →
MCP Logs.

## 6. Tests and CI

There is no unit test runner and no `.github/workflows` directory.

The distro test is `scripts/validate-config.ps1`. It checks:

- Directory count of `.cursor/skills/*/SKILL.md` equals `preinstalled.count` (30)
- `alwaysApply: true` names are exactly `ai-anti-patterns`, `ponytail`,
  `rule-awareness`
- Combined always-on line count ≤ 120 (currently 51)
- `v1.0.6` appears in the four pin files; old `v0.12.11` is banned except as
  history in `SPEC_KIT.md`
- `nawab-plans/PLAN.template.lite.md` exists
- `README.md` does not still say `19 .mdc`
- Skill bodies do not contain the banned gold-repo strings

Run it after any skill add/remove, always-on edit, or Spec Kit bump. Exit 0 is
the gate recorded in `PROGRESS.md`.

## 7. Further reading

| Idea | Link | What you will learn |
|------|------|---------------------|
| Cursor project rules | [Rules docs](https://cursor.com/docs/rules) | `.mdc` frontmatter, always vs glob vs description |
| Ponytail | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | The ladder this config vendors as a skill |
| Spec-Driven Development | [github/spec-kit](https://github.com/github/spec-kit) | constitution → specify → plan → tasks → implement |
| Agentic pattern language | [Agent Patterns Catalog](https://www.agentpatternscatalog.org/) | Live pattern counts, compositions, MCP tools |
| Skill format | [skills.sh](https://skills.sh/) | How Agent Skills are published and installed |
| Community rules corpus | [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | Stack templates this distro does not vendor wholesale |
| Three-layer split | [INDUSTRY_PRACTICES.md](INDUSTRY_PRACTICES.md) | Rules vs skills vs hooks as used here |

Nawab profiles, the README family, and the XOR graph skills are local to this
tree. No external write-up yet; [DECISIONS.md](../DECISIONS.md) is the source.

## 8. Future advancements

1. **License file.** There is no `LICENSE` in the tree. Add one so clones know
   the terms. Done when a license file exists and the landing can badge it.
2. **CI on `validate-config.ps1`.** The gate is local-only. A GitHub Action
   that runs the script on PRs would catch skill-count drift. Done when a
   workflow exists and fails on a missing `SKILL.md`.
3. **Non-Windows link.** `link-to-project.ps1` uses `mklink /J`. macOS/Linux
   need a documented symlink or copy path. Done when a POSIX script (or a
   branch in the existing script) links `.cursor` without Administrator.
4. **MCP_SETUP count drift.** `docs/MCP_SETUP.md` still says "421+". The
   catalog homepage listed 562 patterns on 2026-09-13. Done when that doc
   cites the live page or drops the frozen number.
