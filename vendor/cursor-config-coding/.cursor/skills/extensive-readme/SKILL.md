---
name: extensive-readme
description: >-
  Authors exhaustive, production-grade README.md files for any software project.
  Produces structured docs with vision, architecture diagrams, setup, configuration
  tables, API/tool catalogs, data models, testing, cookbook, roadmap, FAQ, glossary,
  and changelog. Use when creating or rewriting README, project documentation,
  onboarding docs, or when the user wants a comprehensive repo overview like a
  reference manual.
---

# Extensive README Authoring

Create README files that serve as the **single source of truth** for a project — not a
marketing blurb. The reader should understand what the system is, how it works, how to run
it, and how to extend it without opening the codebase first.

## When to apply

- User asks for a README, project docs, or "document this repo"
- User wants exhaustive / reference-style documentation
- Onboarding docs for a new contributor or future-you
- Rewriting a thin README into a proper manual

## Workflow

### Phase 1 — Discover (before writing)

Explore the codebase systematically. Do not invent features.

1. **Entry points** — `main`, CLI, server bootstrap, package.json scripts
2. **Config** — `.env.example`, config modules, required vs optional vars
3. **Architecture** — major packages/modules and how data flows
4. **Interfaces** — APIs, CLI commands, UI routes, events, webhooks
5. **Persistence** — databases, files, external services
6. **Tests** — how to run them, what they cover
7. **Deployment** — Docker, CI, cloud targets if present
8. **Git history** — skim recent commits for changelog and roadmap phases

Capture: exact tool/API counts, file paths, env var names, ports, and version constraints.

### Phase 2 — Draft structure

Use the section order in [templates.md](templates.md). Adapt sections to the project:

| Always include | Include when relevant |
|----------------|----------------------|
| Title + positioning hook | Concept → implementation map |
| TL;DR bullets | Turn/request lifecycle diagram |
| Table of contents | Full API/tool appendix |
| Vision (is / is not) | Agentic-AI or domain concept glossary |
| Architecture diagram(s) | Multi-interface (web + CLI + bot) |
| Quickstart | Worlds/domains/multi-tenant model |
| Configuration reference | Approval gates / safety stack |
| Directory tree | Self-evolution / eval harness |
| Testing | Cost model |
| Roadmap + changelog | Cookbook with example prompts |

**Skip** sections that don't apply — mark them omitted, don't leave empty placeholders.

### Phase 3 — Write with quality bar

**Opening (first 30 lines)**

- One-line title + subtitle explaining *what* and *for whom*
- Blockquote positioning statement: what it is, what it is not, primary interface
- Deployment target or runtime context if relevant
- Horizontal rule, then **TL;DR** — 8–12 bullets of differentiators

**Body principles**

1. **Tables over prose** for catalogs (tools, env vars, tables, endpoints)
2. **Mermaid diagrams** for architecture, data flow, lifecycle, safety stacks
3. **Concrete paths** — `src/foo/bar.py`, not "the foo module"
4. **Accurate counts** — tools, endpoints, tables; verify from code
5. **What it is / is not** — prevents misuse and wrong expectations
6. **Today vs roadmap** — honest about what works now vs planned
7. **Graceful degradation** — note optional deps and fallbacks
8. **Cross-links** — TOC anchors, `see §N` for related sections

**Tone**

- Technical blog quality: complete sentences, precise, scannable
- No engagement bait, no filler adjectives
- Present tense for behavior; past tense for changelog only

### Phase 4 — Validate

Run [checklist.md](checklist.md) before delivering. Fix:

- Stale tech (e.g. Chroma when project uses Qdrant)
- Wrong section numbering (must be sequential 1…N)
- TOC links that don't match heading anchors
- Required env vars that don't match `config` / `.env.example`
- Tool/API counts that don't match registry or routes

### Phase 5 — Maintain

When updating an existing extensive README:

- Update counts, paths, and diagrams in the same PR as code changes
- Append changelog row; don't rewrite history
- Move completed roadmap items to changelog; keep future directions realistic

## Section numbering rules

- Number all major `##` sections sequentially: `## 1.`, `## 2.`, …
- Subsections use `### N.M` matching parent (e.g. `### 5.1`, `### 5.2`)
- TOC must list every major section with working anchor links
- Physical order in file must match numeric order (no `## 31` before `## 22`)

## Mermaid defaults

Use mermaid for:

- **High-level architecture** — `flowchart TD` or `flowchart LR`
- **Request/turn lifecycle** — `sequenceDiagram`
- **Memory or data layers** — `flowchart TD` with labeled edges
- **Safety/control stack** — decision diamonds for gates

Keep diagrams readable: ≤15 nodes per diagram; split into 3.1, 3.2, 3.3 if needed.

## Catalog sections (tools, APIs, CLI)

For each item in a catalog table:

| Column | Content |
|--------|---------|
| Name | Exact identifier |
| Approval / Auth | If gated, say how |
| What it does | One line, outcome-focused |

Group by category. Show category counts and verify total.

Optional **Appendix** with full parameter tables for power users.

## Roadmap section shape

```markdown
## N. Roadmap & build history

### Build phases (completed)
| Phase | Theme | Status |
|-------|-------|--------|
| 0 | … | ✅ |

### Possible future directions
- Bullet list of realistic next steps (not wishlist noise)
```

Distinguish **shipped** (changelog) from **planned** (roadmap).

## Anti-patterns

- ❌ Generic "Features" bullet list with no file paths
- ❌ README shorter than the project's complexity warrants
- ❌ Copying package.json description as the whole README
- ❌ Stale diagrams showing removed interfaces
- ❌ "76 tools" when registry has 81 — always verify
- ❌ Mixing Chroma/Qdrant/Postgres without checking `vector_store` or DB config
- ❌ Numbered sections out of order in the file body

## Output

Deliver a single `README.md` unless the user asks for split docs (`PRODUCT.md`, `docs/`).

For monorepos: one root README with links to per-package READMEs; each package README
follows the same skill at reduced scope.

## Additional resources

- Section templates and starter text: [templates.md](templates.md)
- Pre-ship validation: [checklist.md](checklist.md)
