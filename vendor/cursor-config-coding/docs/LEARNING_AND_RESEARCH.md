# Learning and research workflow

How this coding config keeps you **in the loop** and **learning** while the agent ships.

## Design basis

| Practice | Source | How we apply it |
|----------|--------|-----------------|
| Plan before code | [Cursor Learn — customizing agents](https://cursor.com/learn/customizing-agents) | `planning.mdc` + approval gate |
| Rules vs skills | Cursor docs | Light always-on rules; deep teaching in `learn-while-building` skill |
| Feynman technique | Cognitive science / [Feynman Tutor pattern](https://github.com/sbkriz/feynman-tutor) | Optional explain-back after phases |
| Zone of proximal development | Pedagogy research | Teach one concept beyond what you already used in the codebase |
| Teach-first mentors | [Chiron-style](https://github.com/xDido/chiron) | `/explain` and research briefs before big choices |

## Default flow

```text
Requirement → research brief (if unfamiliar)
           → implementation plan → YOUR APPROVAL
           → phase execution (inline "why" on decisions)
           → validate → phase report + "what you learned"
           → conventional commit → next phase
```

## Skills

| Skill | Role |
|-------|------|
| `learn-while-building` | Research, explain, learning summaries, LEARNING.md |
| `readme` | "Make a README" — asks product vs readable, and whether extensive is also needed |
| `readable-readme` | Human main README.md (finishable in one sitting) |
| `product-readme` | Public product landing README (logo, tagline, tiny quickstart) |
| `extensive-readme` | Internals companion (`docs/EXTENSIVE.md`) — every package and file map |

## Rules

| Rule | Role |
|------|------|
| `learn-and-research.mdc` | Always explain, research, keep you informed |
| `git-commit-discipline.mdc` | Agent commits after milestones (you control push) |
| `planning.mdc` | Plan + approval before non-trivial implementation |

## Optional project files

| File | Purpose |
|------|---------|
| `LEARNING.md` | Running log of concepts from each phase |
| `IMPLEMENTATION_PLAN.md` | Approved plan |
| `DECISIONS.md` | ADR-style choices |
| `PHASE_N_COMPLETION.md` | Per-phase report + learning bullets |

## Example prompts

**Learn while building:**
```text
Help me learn as we go. Research options for job queues, recommend one, then implement
after I approve the plan. Add learning notes to LEARNING.md each phase.
```

**Research only:**
```text
Research Supabase vs PlanetScale for this project — pros, cons, recommendation.
No code yet.
```

**Explain:**
```text
Explain why we used server actions here instead of a REST route. Use an analogy.
```

**README:**
```text
Use the readme skill. Ask which type (product / readable) and whether extensive is also needed.
```
