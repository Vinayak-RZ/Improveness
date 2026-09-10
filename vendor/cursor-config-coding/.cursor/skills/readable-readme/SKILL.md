---
name: readable-readme
description: >-
  Authors a long, human-readable README.md for internal platform layers: concept
  brief first, then a 7-section overview (vision, ≤5 ideas, how it works,
  quickstart, config, further reading, short futures). Use for monorepo services
  and platform packages. Do not use for installable OSS/agent landings
  (product-readme) or package maps (extensive-readme). Unspecified "make a README"
  goes to the readme skill.
---

# Readable README Authoring

Write `README.md` as something a **platform engineer finishes in one sitting**.
This skill is for **internal services** in a multi-package platform (ingest,
storage, shared libraries) — not for installable public products.

**Portable:** name the layer’s job, not a named company or sibling product
unless that sibling lives in *this* tree.

## When to apply

- Internal platform layer / sibling service in a multi-repo platform
- User asks for a readable / general / human README **and** the repo is not an
  installable OSS/agent product
- The `readme` skill routed here

**Not this skill**

| Want | Use |
|------|------|
| Installable OSS, CLI, library, agent landing | `product-readme` |
| Every package, file map, domain concepts + how it runs | `extensive-readme` |
| "Make a README" with no type | `readme` (ask, naming both shapes) |

Do **not** force the 7-section numbered skeleton onto a product repo. If the user
wants a hybrid (logo then readable TOC), they must say so.

## Output

- **File:** `README.md` at repo root (unless the user named another path)
- **If an extensive companion was requested or already exists:** banner at the top:

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

Do not write `docs/EXTENSIVE.md` from this skill. Do not copy Future advancements
into the extensive file.

## Workflow

### Phase 0 — Concept brief (required)

Before listing files, write (for yourself, then fold into §1 / §2):

- Audience (who operates this layer)
- 3–5 **nouns** the reader must hold (what this layer is *about*)
- One sentence of what it is not (sibling repos)

Do not start the README with a package dump.

### Phase 1 — Discover

Do not invent features.

1. What the layer is, who it is for, how you run it
2. Architecture at **module** grain
3. **At most 5** ideas worth understanding
4. Config a newcomer must set
5. 3 short, grounded futures (no slogans)

### Phase 2 — Draft

Follow [templates.md](templates.md). Skip empty sections. Cap ideas at **5**.
Analogy is **optional** — omit when it adds fluff.

### Phase 3 — Write

**Length.** One sitting (~10–15 minutes). Tables for catalogs.

**Jargon.** Ordinary words; one plain sentence on first use.

**Hard mechanism.** Short paragraph + **verified** blog/wiki, or omit the link.

**Futures.** Short. Name, why, done-when. Do not duplicate into EXTENSIVE.

### Phase 4 — Validate

Run [checklist.md](checklist.md).

## Anti-patterns

- Using this skeleton on an installable product (that is `product-readme`)
- File-by-file internals
- More than 5 teaching ideas
- Required analogy on every idea
- Invented URLs; slogan futures ("add AI")

## Additional resources

- [templates.md](templates.md)
- [checklist.md](checklist.md)
