---
name: extensive-readme
description: >-
  Authors a separate extensive internals document covering every package, how the
  repo actually runs, high-level source workflow, and why each important file
  exists. Default output docs/EXTENSIVE.md, linked from the main README. Use when
  the user asks for an extensive README, internals dump, package-by-package map,
  or a companion to a readable or product README. Do not use for the human main
  README.md (readable-readme) or a product landing page (product-readme).
---

# Extensive README Authoring

Write the **deep companion**, not the main GitHub landing page. A reader who opens
this file should be able to understand **the whole repository**: how a request or
build actually flows, what every package is for, and why the important files exist.

Default output: **`docs/EXTENSIVE.md`**. Do **not** overwrite `README.md` unless the
user explicitly said the main file should be this dump.

## When to apply

- User asks for an extensive README, internals, or package-by-package documentation
- The `readme` skill asked for an extensive companion
- Someone needs to understand source layout without opening every file

**Not this skill:** human main `README.md` → `readable-readme`. Product landing →
`product-readme`. Unspecified "make a README" → `readme`.

## Output

| File | Role |
|------|------|
| `docs/EXTENSIVE.md` | This document (create `docs/` if needed) |
| `README.md` | Unchanged unless the user said otherwise |

If the main README is being written in the same turn (`readable-readme` or
`product-readme`), that skill puts a **top banner** linking here. If you only write
the extensive file, add or keep that banner on the existing `README.md` (one short
blockquote; do not rewrite the rest).

Banner:

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

## Workflow

### Phase 1 — Discover (walk the tree)

Do not invent packages or files. List what exists.

1. **Repo kind** — app, library, monorepo, config, mixed
2. **Packages / top-level modules** — workspaces, `src/*`, `packages/*`, apps, services, `cmd/`, crates
3. **Entry points** — `main`, CLI, server, scripts in package.json / Makefile / pyproject
4. **Runtime path** — what happens from "user runs X" to "result comes back"
5. **Config, persistence, tests, CI, deploy**
6. **Per package:** purpose, public API, important files (skip generated noise: `dist/`, `.next/`, `__pycache__`, lockfile internals)

Capture a **package inventory** (every first-party package) and a **file map** of
files that matter (entry, config, core logic, tests). Generated and vendor trees:
one line each, not a file list.

### Phase 2 — Draft

Follow [templates.md](templates.md). **Every first-party package gets its own
section.** Tiny repos: treat top-level folders (`src/`, `lib/`, `app/`) as packages.

### Phase 3 — Write

**Coverage (mandatory)**

- **How the repository runs** — end-to-end workflow (mermaid sequence or flowchart)
- **Package catalog** — one subsection per package:
  - What it is for
  - How it is invoked / who depends on it
  - High-level how it works
  - **File map:** each important file — path, what it does, **why it is there**
- **Cross-package edges** — imports, APIs, events, shared types
- **Config, tests, CI** in enough detail to operate, not a paste of every flag

**Teaching.** Still explain non-obvious bets (simple paragraph + verified blog/wiki
when hard). Citation rules: [further-reading.md](further-reading.md).

**Future advancements.** At least 3, prefer 4, grounded in this repo.

**Length.** This file is **allowed to be long**. Skip noise (generated dirs, copy-paste
lockfiles). Prefer tables for file maps. Do not skip a first-party package because
the file is getting large.

**Accuracy.** Every path in the doc must exist. Counts must match the tree.

### Phase 4 — Validate

Run [checklist.md](checklist.md).

## Anti-patterns

- Writing this content into `README.md` as the main landing page
- Skipping packages or saying "and other utils"
- File lists with no "why this file exists"
- Invented files, packages, or URLs
- Dumping `node_modules` or build output

## Additional resources

- [templates.md](templates.md)
- [checklist.md](checklist.md)
- [further-reading.md](further-reading.md)
