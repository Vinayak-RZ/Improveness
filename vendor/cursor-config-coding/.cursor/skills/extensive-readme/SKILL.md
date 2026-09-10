---
name: extensive-readme
description: >-
  Authors a separate internals companion: how the repo runs, domain concepts,
  then every first-party package and why important files exist. Default output
  docs/EXTENSIVE.md, linked from the main README. Use when the user asks for an
  extensive README, internals dump, or package-by-package map. Do not use for
  the human main README.md (readable-readme) or a product landing (product-readme).
---

# Extensive README Authoring

Write the **deep companion**, not the GitHub landing page. A reader should
understand how the system runs, the domain ideas the code encodes, then every
first-party package and why important files exist.

**Portable:** walk *this* tree. Do not assume a named platform, industry, or
sibling org. Domain concepts come from the code and docs in front of you.

Default output: **`docs/EXTENSIVE.md`**. Do **not** overwrite `README.md` unless
the user said the main file should be this dump.

## When to apply

- User asks for an extensive README, internals, or package-by-package documentation
- The `readme` skill asked for an extensive companion

**Not this skill:** human main `README.md` → `readable-readme`. Product landing →
`product-readme`. Unspecified "make a README" → `readme`.

## Output

| File | Role |
|------|------|
| `docs/EXTENSIVE.md` | This document (create `docs/` if needed) |
| `README.md` | Unchanged unless the user said otherwise |

Banner on the main README:

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

## Workflow

### Phase 1 — Discover (walk the tree)

Do not invent packages or files.

1. **Repo kind** — app, library, monorepo, config, mixed
2. **Domain concepts** — 3–8 nouns the code actually implements (protocols, invariants, seams). These go **before** the package map.
3. **Runtime path** — what happens from "user runs X" to "result comes back"
4. **Packages / top-level modules**
5. **Entry points, config, tests, CI**
6. **Per package:** purpose, public API, important files (skip `dist/`, `.next/`, `__pycache__`, lockfile internals)

### Phase 2 — Draft

Follow [templates.md](templates.md). **Concepts and how-it-runs before the package catalog.** Every first-party package still gets its own section.

### Phase 3 — Write

**Coverage (mandatory)**

- **Domain concepts** — the ideas this tree encodes, with limits
- **How the repository runs** — end-to-end (mermaid sequence or flowchart)
- **Package catalog** — one subsection per package: what for, who calls it, how it works, file map (path, why it exists, what it does)
- **Cross-package edges** — imports, APIs, events
- **Config, tests, CI** enough to operate

**Teaching.** Non-obvious bets: short paragraph + verified blog/wiki when hard.
Citation rules: [further-reading.md](further-reading.md).

**Future advancements.** At least 3, grounded in this repo. Do not paste the
readable README’s futures verbatim if both exist — internals futures are
engineering follow-ups.

**Accuracy.** Every path must exist. Counts match the tree.

### Phase 4 — Validate

Run [checklist.md](checklist.md).

## Anti-patterns

- Leading with a package table before the reader knows what the domain *is*
- Writing this into `README.md` as the main landing
- Skipping packages or "and other utils"
- File lists with no "why this file exists"
- Invented files, packages, or URLs
- Dumping `node_modules` or build output
- Baking a named customer or private path

## Additional resources

- [templates.md](templates.md)
- [checklist.md](checklist.md)
- [further-reading.md](further-reading.md)
