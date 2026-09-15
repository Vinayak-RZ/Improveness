# Skills Catalog (not pre-installed)

This folder documents **optional** skills for specific tech stacks. Nothing here is loaded by Cursor automatically.

- **Full reference:** [docs/TECH_STACK_SKILLS.md](../../docs/TECH_STACK_SKILLS.md)
- **Machine-readable index:** [stacks.json](./stacks.json)
- **Install script:** [scripts/install-catalog-skill.ps1](../../scripts/install-catalog-skill.ps1)

## Pre-installed skills (in `../skills/`)

| Skill | Purpose |
|-------|---------|
| `nextjs-app-router-patterns` | Next.js App Router |
| `vercel-react-best-practices` | React / Next performance |
| `graphify` | Knowledge graphs from code/docs |
| `impeccable` | Frontend UI polish |
| `frontend-design` | Blank-canvas distinctive UI |
| `web-design-guidelines` | A11y / UX audit |
| `gsap-framer-scroll-animation` | Scroll and timeline animation (extra GSAP slices: `find-skills`) |
| `computer-use` | Codex-style interface ladder (no full-desktop CUA in Cursor) |
| `agent-browser` | Chrome / CDP / a11y-tree CLI |
| `speckit` | Spec-Driven Development router |
| `find-skills` | Discover more skills |

## Architecture supplements (optional)

| Skill | Install |
|-------|---------|
| `senior-architect` | `npx skills add sickn33/antigravity-awesome-skills@senior-architect -y --copy` |
| `agent-arch-system-design` | `npx skills add ruvnet/ruflo@agent-arch-system-design -y --copy` |
| `security-reviewer` | Prefer Cursor `/review-security`. Optional: `npx skills add jeffallan/claude-skills@security-reviewer -y --copy` |
| `backend-design` | `npx skills add dauquangthanh/hanoi-rainbow@backend-design -y --copy` |

Pre-installed architecture skills in `../skills/`: `frontend-architecture`, `backend-architecture`, `agentic-system-design`, `system-design-tradeoffs`.

## Intentionally not pre-installed

- Extra `gsap-*` slices (core, react, plugins, …) — `find-skills` or upstream GSAP packs
- Full upstream Spec Kit `/speckit-*` commands — this lab keeps one `speckit` router
- `nextjs-framer-motion-animations` — use catalog when needed; prefer `gsap-framer-scroll-animation` for scroll work
- `remotion-best-practices`, `emil-design-eng` — install per project from catalog or `~/.agents/skills/`
