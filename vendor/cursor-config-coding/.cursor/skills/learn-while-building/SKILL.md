---
name: learn-while-building
description: >-
  Keeps the user learning while coding — research unfamiliar topics, explain decisions
  in plain language, surface trade-offs, and end phases with concise "what you learned"
  summaries. Use when the user wants to understand what is being built, learn new
  concepts, get research-backed explanations, or stay in the loop during implementation.
---

# Learn While Building

Pair with implementation — do not block shipping unless the user asks for teach-only mode.

## Modes

| User signal | Mode |
|-------------|------|
| "Build it" / default | **Build + brief learn** — explain key decisions inline |
| "Explain", "why", "help me understand" | **Explain** — deeper teaching, analogies |
| "Research", "what are options", unfamiliar tech | **Research** — search/docs first, then recommend |
| "Teach me", "I want to learn" | **Learn** — Feynman-style, check understanding |

## Research workflow

Before adopting unfamiliar libraries, patterns, or APIs:

1. **Search** — web, official docs, MCP if relevant
2. **Summarize for the user** — 3–5 bullets: what it is, when to use, risks, alternatives
3. **Recommend** — one clear choice with trade-offs (see `trade-offs.mdc`)
4. **Wait for approval** if the choice changes architecture or adds dependencies

Do not silently pick obscure stacks. Surface sources (doc links, not vague "best practice").

## Explain while building

When making non-obvious changes, include a short **Why this way** block:

```markdown
**Why this way:** [one sentence]
**Alternative considered:** [name] — rejected because [reason]
**Concept:** [plain-language definition if new term introduced]
```

Keep explanations proportional — one paragraph, not a lecture, unless user asked to learn.

## Keep user in the loop

- Restate objective at phase start
- Flag decision points **before** irreversible choices (schema, auth model, major deps)
- Report discoveries that change the plan — pause and re-confirm
- End phases with status the user can skim in 30 seconds

## Phase learning summary (required)

At the end of each completed phase (with `quality-gates.mdc`), add:

```markdown
### What you learned (this phase)
- **Concept:** [term] — [one-line plain definition]
- **Pattern:** [what we applied and where in the codebase]
- **Trade-off:** [choice made and why]

### Optional check (if user is learning)
Can you explain [one concept from this phase] in one sentence without jargon?
```

Append the same bullets to `LEARNING.md` at project root if the file exists; create it on first phase if user has asked to learn during this project.

## LEARNING.md shape (optional project file)

```markdown
# Learning log

## Session / phase entries

### Phase N — [title] — [date]
- Concepts: …
- Files to study: `path/to/key/file`
- Further reading: [link]
```

## Feynman technique (when user wants deep learning)

1. User explains the concept in their own words (or agent asks them to after a build)
2. Agent identifies gaps — jargon, skipped steps, hand-waving
3. Agent fills gaps with analogy + pointer to code we just wrote
4. Optional: user re-explains; agent confirms or flags remaining holes

Do not withhold answers indefinitely when the user is blocked — teach, then unblock.

## Anti-patterns

- ❌ Implement first, explain never
- ❌ Wall-of-text tutorials mid-implementation
- ❌ Research without summarizing for the user
- ❌ Assuming expert-level knowledge without checking
- ❌ Sycophantic "great question!" without substance

## Companion rules & skills

- `learn-and-research.mdc` — always-on lightweight behavior
- `communication.mdc` — decision and risk reporting
- `planning.mdc` — approval before non-trivial work
- `extensive-readme` — document what was built for future-you
