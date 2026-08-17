---
name: readable-readme
description: >-
  Authors a long, human-readable README.md: plain language, one-sitting depth,
  simple explanations with blog/wiki links for hard ideas, and 3–4 future
  advancements. Use when the user asks for a readable README, general README,
  human overview, or a simpler long-form README.md. Do not use for a product
  landing page (product-readme) or a package-by-package internals dump
  (extensive-readme). Unspecified "make a README" goes to the readme skill.
---

# Readable README Authoring

Write `README.md` as something a **curious human finishes**. Long enough to understand
the repo in depth; short enough they are not discouraged. This is the usual **main
README.md**.

It is a simpler sibling of the old "one giant manual" style: teach the ideas, show
how to run it, skip the file-by-file dump. That dump is `extensive-readme`.

## When to apply

- User asks for a readable / general / human README
- Main `README.md` should be an overview people actually read
- The `readme` skill routed here

**Not this skill**

| Want | Use |
|------|-----|
| Logo, tagline, tiny install, OSS landing | `product-readme` |
| Every package, every important file, full workflow internals | `extensive-readme` → `docs/EXTENSIVE.md` |
| "Make a README" with no type | `readme` (ask, then route) |

## Output

- **File:** `README.md` at repo root (unless the user named another path)
- **If an extensive companion was requested or already exists:** put this banner
  **at the top**, under the title:

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

Do not write `docs/EXTENSIVE.md` from this skill. Load `extensive-readme` for that.

## Workflow

### Phase 1 — Discover

Do not invent features.

1. What the project is, who it is for, how you run it
2. Architecture at **module** grain (not every file)
3. 2–5 ideas worth understanding
4. Config that a newcomer must set
5. Gaps for **Future advancements** (at least 3–4)

### Phase 2 — Draft

Follow [templates.md](templates.md). Skip empty sections. **Never skip** Future
advancements (3–4 items).

### Phase 3 — Write

**Length.** Narrative (vision, ideas, how it works, future) finishable in **one
sitting (~10–20 minutes)**. Tables for catalogs. No novel.

**Jargon.** Ordinary words. Required term: one plain sentence on first use.

**Simple first.** Smart-friend explanation. Hard mechanism: short paragraph +
**verified** blog or wiki (Wikipedia is fine for background). Never invent URLs.
Citation rules: [further-reading.md](../extensive-readme/further-reading.md).

**Teach.** 2–5 ideas (not 8). Each: name, simple how, analogy, constraint, limits,
1–3 verified links.

**Future advancements.** At least 3, prefer 4. Grounded in this repo. Name, why,
what would land, done-when.

### Phase 4 — Validate

Run [checklist.md](checklist.md).

## Anti-patterns

- File-by-file internals (that is `extensive-readme`)
- Product landing (logo/badges-first) — that is `product-readme`
- Jargon wall; novel-length dump; slogan future ("add AI")
- Invented URLs

## Additional resources

- [templates.md](templates.md)
- [checklist.md](checklist.md)
