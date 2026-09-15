# Coding — Agent Mode

**ponytail → nawab-plans (lite default in Plan mode) → spec-kit for greenfield → implement → validate → commit.**

Skills in this config describe **jobs** (plan, README, architecture), not a named product. Fill them from the repo in front of you.

## Always on

Read `.cursor/skills/ponytail/SKILL.md` before any code edit. Plan mode: load `nawab-plans` at **lite / standard / project** (lite unless the user asks full nawab or the work is multi-package). graph-engineering **or** graph-of-loops only if named (never both) — not graphify.

## Skills

| Need | Skill |
|------|--------|
| Plan | `nawab-plans` (+ opt-in `graph-engineering` XOR `graph-of-loops`) |
| Specs-first | `speckit` + [docs/SPEC_KIT.md](docs/SPEC_KIT.md) |
| UI / Next | `frontend-architecture`, `nextjs-app-router-patterns`, `vercel-react-best-practices`, `impeccable` |
| Computer | `computer-use` then `agent-browser` (IDE browser first; no desktop CUA) |
| API / data | `backend-architecture` |
| Agents | `agentic-system-design` + agent-patterns MCP |
| Trade-off | `system-design-tradeoffs` |
| README | `readme` router — product vs readable; writers load `copywriting` + `anti-slop.md` |
| Copy | `copywriting` — public sentences (READMEs, landings, CTAs); category + conversion for host-run products; anti-slop pass required |
| Review | `ponytail-review`, `ponytail-audit` |

Inventory: [skills-manifest.json](skills-manifest.json)

## Git

Conventional commits after milestones (`git-commit-discipline.mdc`). Auto-push at **≥ 10** unpushed, or when asked.

## MCP

Default: [Agent Patterns Catalog](https://www.agentpatternscatalog.org/) — [docs/MCP_SETUP.md](docs/MCP_SETUP.md)

## Link into an app

```powershell
.\scripts\link-to-project.ps1 -Target "D:\Startups\YourApp"
.\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp"
.\scripts\sync-coding-skills.ps1
```

Companion: [cursor-config-buisness](https://github.com/Vinayak-RZ/cursor-config-buisness) · [cursor-config-design](https://github.com/Vinayak-RZ/cursor-config-design)
