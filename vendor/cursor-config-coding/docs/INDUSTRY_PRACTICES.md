# Industry practices for Cursor coding configs (2025–2026)

This repo follows patterns from Cursor docs, community configs, and production dotfiles.

## Three-layer governance

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| **Rules** | `.cursor/rules/*.mdc` | Persistent conventions, invariants |
| **Skills** | `.cursor/skills/*/SKILL.md` | Deep workflows (architecture, stack, review) |
| **Hooks** | `.cursor/hooks.json` (optional) | Deterministic format/guard rails |

Rules are hints; hooks are enforcement. This repo uses rules + skills; add hooks per project if needed.

## What professional configs include

1. **Thin always-on rules** — core stance, boundaries, anti-patterns (<50 lines each)
2. **Scoped rules** — globs for frontend, backend, tests, security paths
3. **Agent-requested rules** — trade-offs, migrations, arch reviews
4. **Architecture skills** — frontend, backend, agentic (pre-installed here)
5. **Stack catalog** — optional skills per tech ([TECH_STACK_SKILLS.md](TECH_STACK_SKILLS.md))
6. **AGENTS.md** — orchestration entry for the agent
7. **Phased workflow** — planning → execution → quality gates (from Stamped Energy)

## References

| Resource | What to borrow |
|----------|----------------|
| [Cursor Rules docs](https://cursor.com/docs/rules) | `.mdc` format, activation modes |
| [Cursor agent best practices](https://cursor.com/blog/agent-best-practices) | Evolve rules from repeated mistakes |
| [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | Stack templates |
| [skills.sh](https://skills.sh/) | Optional skill discovery |
| [sbstjn/skills](https://codeberg.org/sbstjn/skills) | Rules ↔ skills pairing |

## Evolving this config

When the agent makes the same mistake twice → add or tighten a rule. When a workflow is multi-step and reusable → add a skill. Keep always-on rules minimal to save context tokens.
