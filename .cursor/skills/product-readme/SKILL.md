---
name: product-readme
description: >-
  Authors public product README.md files for software people can install and use:
  first screen answers what it is / is not, primary interface, invariant, and a
  proof command or demo; then named techniques with limits. Use for OSS, libraries,
  engines, and agent products. Do not use for internal platform-layer overviews
  (readable-readme) or package maps (extensive-readme). Unspecified "make a README"
  goes to the readme skill.
---

# Product README Authoring

Write a **product landing that teaches**. A stranger on GitHub should, **in the
first screen**, know what this is, what it is not, the primary interface, one
invariant, and how to prove it works. Then they learn the named bets (with limits)
and how to install.

Write for **any** installable product: library, CLI, engine, or agent harness.
Steal density from well-known public OSS (short install, named technique + real
link). Do not invent a fourth README type — teaching lives here.

**Portable:** never name a customer, private repo, or local disk path. Describe
the job (what a stranger on GitHub must learn), not a source README.

## When to apply

- Installable product, OSS library, CLI, engine, or agent harness
- User asks for a product README, OSS landing page, or installable-library README
- Router default for installable / OSS / agent

**Not this skill:** internal platform layer / monorepo service → `readable-readme`.
Package maps → `extensive-readme`. Unknown type → `readme` (asks first).

If an extensive companion was requested, write `README.md` here, then load
`extensive-readme`. Banner (after logo, before the pitch):

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

## Workflow

### Phase 1 — Discover

Do not invent features, numbers, or URLs.

1. What people install; the **one command or recorded demo** that proves it
2. Positioning: is / is not / who it is for
3. **Primary interface** (CLI, HTTP path, plugin add)
4. **One invariant** (a rule the product will not break)
5. 1–5 **named techniques**, each with an honest limit
6. Existing logo / cover; real docs / license / papers the tree cites

### Phase 2 — Length

| Shape | Length |
|-------|--------|
| Small SDK | Short: first screen + 1–3 techniques + install |
| Research / engine / agent | Longer: era context, field guide, honest claims, Go deeper |
| Default | First-screen contract, skip empty sections |

### Phase 3 — Write

Follow [templates.md](templates.md). No `## 1. Vision` numbering. No slogan claims.

### Phase 4 — Validate

Run [checklist.md](checklist.md).

## First screen (required)

Before the fold, in this order (logo/badges optional if none exist):

1. Centered logo if the repo has one (or a new flat SVG — see Logo)
2. Real badges / nav only
3. Pitch: what it does in 1–2 paragraphs
4. Blockquote: **is / is not**, **primary interface**, **invariant**
5. Proof: fenced terminal of a real command, or a screenshot whose caption teaches

Get started comes **after** teaching, not in place of the proof command.

## Logo

Search `assets/`, `docs/`, `docs/media/`, `public/`, `static/`, `brand/`.

**If a real logo exists:** reuse it. **If none:** `assets/{product}-logo.svg` —
flat, 1–2 colors, no gradients/3D/emoji. Width ~220–560. Do not invent favicons.

## Teaching

Each named technique:

- Memorable name
- Mechanism in plain language
- Honest **limit** (when it wins / loses)
- 1 verified link or omit

Optional **field guide**: vocabulary the reader can reuse on other systems. Not a
`### The problem / Like / Limits` numbered school essay. Cap at ~5 ideas.

**Honest claims:** only numbers this tree can reproduce. Point at a ledger or
omit. Never invent tok/s, “trusted by”, or public-bench scores as fitness.

## Section order

1. Logo / badges / nav (skip if nothing true)
2. Extensive banner if companion exists
3. Pitch
4. Positioning blockquote (is / isn’t / interface / invariant)
5. Proof command or demo
6. Why it exists (era context only if true)
7. Core techniques (named + limit + link)
8. Optional field guide
9. How it works (short diagram)
10. What it achieves (honest / omit)
11. Get started
12. Go deeper (docs index)
13. License / contributing

## Anti-patterns

- Numbered Vision / Ideas skeleton on a product repo
- Generic Features with no idea
- Proof missing; install dumped before the reader knows what they installed
- Invented URLs, fake benchmarks, empty placeholders
- File maps in `README.md`

## Additional resources

- [templates.md](templates.md)
- [examples.md](examples.md)
- [checklist.md](checklist.md)
