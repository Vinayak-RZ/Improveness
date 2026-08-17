# Coding — Agent Mode

Engineering workflow: **ponytail → nawab-plans (Plan mode) → (spec-kit for features) → research → plan → approve → implement → validate → commit → learn**.

## Ponytail — mandatory gate for all coding

**Before writing or modifying any code**, read and apply the `ponytail` skill (`.cursor/skills/ponytail/SKILL.md`). Always-on rule: `ponytail.mdc`.

From [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — lazy senior dev ladder for minimal, production-grade diffs. **Skills + MDC only** (no Ponytail MCP).

| Layer | What | When |
|-------|------|------|
| Rule | `ponytail.mdc` | Always on — requires reading the `ponytail` skill before code |
| Skill | `ponytail` | **Read first** on every coding task (write, fix, refactor, add deps) |
| Review | `ponytail-review`, `ponytail-audit` | After implementation or on request — hunt over-engineering |

Climb the ladder after you understand the problem: YAGNI → reuse codebase → stdlib → native → installed dep → one line → minimum that works. Never cut validation, security, accessibility, or error handling that prevents data loss.

Intensity: `full` (default). User can say `/ponytail ultra` for stricter YAGNI or `stop ponytail` to disable.

## Nawab Plans — mandatory in Plan mode

**Whenever in Plan mode or drafting an implementation plan**, read and apply `nawab-plans` (`.cursor/skills/nawab-plans/SKILL.md`). Enforced by `planning.mdc`.

| Asset | Role |
|-------|------|
| `nawab-plans` skill | Master execution plan structure (18 sections) |
| `PLAN.template.md` | Copy into `IMPLEMENTATION_PLAN.md` |
| `SUBAGENT_ORCHESTRATION.md` | Spawn map / lead vs subagent roles |

Do not invent a thinner plan format. Collapse unused sections as `N/A` — do not skip the skill.

## Spec Kit — Spec-Driven Development (features / greenfield)

From [github/spec-kit](https://github.com/github/spec-kit). Pre-installed skills: `speckit-*`. Rule: `speckit.mdc`. Guide: [docs/SPEC_KIT.md](docs/SPEC_KIT.md).

Use for **new features / greenfield**, not one-line fixes. Target repo needs `.specify/`:

```powershell
.\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp"
```

Order: `constitution` → `specify` → (`clarify`) → `plan` → (`checklist`) → `tasks` → (`analyze`) → `implement` → (`converge`).

During implement, still apply **ponytail** on every code change.

## Before any task

1. Read this file and all `.cursor/rules/` (start with `rule-awareness`, `ponytail`, `planning`, `core-engineering`, `learn-and-research`).
2. **Coding tasks:** read `ponytail` skill and climb the ladder before proposing or writing code.
3. **Plan mode / any implementation plan:** read `nawab-plans` skill **compulsorily** and follow `PLAN.template.md`.
4. **Feature / greenfield:** follow `speckit.mdc` and Spec Kit skills when the user wants specs-first or the change is multi-phase; structure delivery with `nawab-plans`.
5. Follow `planning.mdc` — analyze, plan, **get user approval** before non-trivial coding.
6. Follow `communication.mdc` — surface risks and tradeoffs explicitly.
7. Unfamiliar tech → research brief for the user before architectural choices.

## Architecture (when designing or refactoring)

| Domain | Skill | Rule |
|--------|-------|------|
| Frontend / UI / Next.js | `frontend-architecture` | `frontend-architecture.mdc` |
| Backend / API / data | `backend-architecture` | `backend-architecture.mdc` |
| AI agents / LLM / tools | `agentic-system-design` | `agentic-systems.mdc` |
| Any major trade-off | `system-design-tradeoffs` | `trade-offs.mdc` |

Before large refactors, consider `graphify` on the affected directory.

## Learning & documentation

| Need | Skill / doc |
|------|-------------|
| Learn while building | `learn-while-building` |
| Make a README (choose type) | `readme` |
| Readable / general README.md | `readable-readme` |
| Extensive internals companion | `extensive-readme` |
| Product / OSS landing README | `product-readme` |
| Workflow guide | [docs/LEARNING_AND_RESEARCH.md](docs/LEARNING_AND_RESEARCH.md) |

End each phase with a short **What you learned** summary. Optional: maintain `LEARNING.md` in the project.

## Git commits and pushes

After each validated phase or meaningful feature:

- **Conventional commit** per `git-commit-discipline.mdc`
- **Push check** after every commit — auto-push when **≥ 10 unpushed** commits, or when user asks

Global rule: `~/.cursor/rules/git-commit-push-global.mdc`

## MCP (live architecture patterns)

Default server: **agent-patterns** → [Agent Patterns Catalog](https://www.agentpatternscatalog.org/)  
Config: `.cursor/mcp.json` | Guide: [docs/MCP_SETUP.md](docs/MCP_SETUP.md)

For agentic design, **query MCP first** (`find_pattern`, `recommend_recipe`, `pattern_for_symptom`) then apply `agentic-system-design` + `system-design-tradeoffs`.

Minimal-code discipline is **not** via MCP — use `ponytail.mdc` + the `ponytail` skill.

Reload Cursor after changing `mcp.json`.

## During implementation

7. Apply `execution.mdc` — phase-based work only; minimal scope; **read `ponytail` skill** on every edit.
8. Stack-specific optional skills: [docs/TECH_STACK_SKILLS.md](docs/TECH_STACK_SKILLS.md).
9. UI polish: `impeccable`. Animation: `gsap-*` skills.
10. Before marking done on non-trivial changes: consider `ponytail-review` on the diff.

## Before completion

11. Apply `quality-gates.mdc` — validate, report, update progress docs, **commit**.

## Pre-installed skills (39)

See [skills-manifest.json](skills-manifest.json) for the full list.

## Linking to a code project

```powershell
.\scripts\link-to-project.ps1 -Target "D:\Startups\Stamped_Energy\Main_Website"
.\scripts\install-spec-kit.ps1 -Target "D:\Startups\Stamped_Energy\Main_Website"  # optional: Spec-Driven Development
```

## Companion repos

- [cursor-config-buisness](https://github.com/Vinayak-RZ/cursor-config-buisness) — PM/GTM/research
- [cursor-config-design](https://github.com/Vinayak-RZ/cursor-config-design) — decks, video, visual
