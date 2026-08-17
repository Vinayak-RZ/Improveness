---
name: extensive-readme
description: >-
  Authors exhaustive, production-grade README.md files that also teach the reader
  in plain language: non-obvious techniques, simple analogies, honest limits, and
  verified blogs/wikis/papers. Readable by a curious human — not a jargon wall,
  not a 10k-word dump. Produces numbered reference manuals with vision, architecture,
  setup, catalogs, glossary, further reading, and future advancements (at least 3–4
  next steps inside this repo). Use when creating or rewriting a comprehensive
  repo overview, onboarding docs, or a reference-style README. Do not use for a
  public product landing page (logo, tagline, tiny quickstart) — use product-readme.
---

# Extensive README Authoring

Create README files that serve as the **single source of truth** for a project — not a
marketing blurb. The reader should understand what the system is, how it works, how to
run it, and how to extend it without opening the codebase first.

The README must also **teach**. After reading it, a newcomer should know the clever
bets in this codebase — why they exist, how they work, what they cost — and have
verified links to go deeper. Catalogs without explanation fail this skill.

Write for a **curious human**, not only for the person who already built it. Depth
is welcome; a wall of jargon or a novel-length dump is not. Someone interested in
this report should *want* to finish it.

## When to apply

- User asks for a README, project docs, or "document this repo"
- User wants exhaustive / reference-style documentation
- Onboarding docs for a new contributor or future-you
- Rewriting a thin README into a proper manual

**Use `product-readme` instead** when the user wants a public product landing page:
logo, tagline, demo, tiny install, "why use this" — the Colibri / LangChain / vLLM
shape. This skill is the reference manual behind that landing page.

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
9. **Ideas worth understanding** — non-obvious bets, not feature bullets (see Teach)
10. **Gaps and next bets** — TODOs, missing tests, thin docs, incomplete interfaces,
    honest follow-ons that could land *in this repo*

Capture: exact tool/API counts, file paths, env var names, ports, version constraints,
a short list of 3–8 ideas the README must teach, and **at least 3–4 future
advancements** grounded in what you found (not a generic wishlist).

### Phase 2 — Draft structure

Use the section order in [templates.md](templates.md). Adapt sections to the project:

| Always include | Include when relevant |
|----------------|----------------------|
| Title + positioning hook | Concept → implementation map |
| TL;DR bullets | Turn/request lifecycle diagram |
| Table of contents | Full API/tool appendix |
| Vision (is / is not) | Agentic-AI or domain concept glossary |
| Ideas worth understanding | Multi-interface (web + CLI + bot) |
| Architecture diagram(s) | Worlds/domains/multi-tenant model |
| Quickstart | Approval gates / safety stack |
| Configuration reference | Self-evolution / eval harness |
| Directory tree | Cost model |
| Testing | Cookbook with example prompts |
| Further reading | |
| Roadmap + changelog | |
| Future advancements (3–4 min) | |

**Skip** sections that don't apply — mark them omitted, don't leave empty placeholders.
**Never skip Future advancements.** It is mandatory and must list at least 3–4
concrete next steps for *this* repository.

### Phase 3 — Write with quality bar

**Opening (first 30 lines)**

- One-line title + subtitle explaining *what* and *for whom*
- Blockquote positioning statement: what it is, what it is not, primary interface
- Deployment target or runtime context if relevant
- Horizontal rule, then **TL;DR** — 8–12 bullets of differentiators

**Write for a curious human (mandatory)**

The reader is anyone who wants to understand this repo in depth — not a paper
reviewer. Keep them reading.

- **Length.** Long enough that an interested person learns the system; short enough
  they are not discouraged. Aim for a **one-sitting narrative**: vision, ideas,
  how it works, future advancements. A motivated reader should finish that in
  about **10–20 minutes**. Catalogs (env vars, APIs, tools) stay as **tables**,
  not essays. If a catalog would dominate the file, keep a short table in the
  README and point to `docs/` or an appendix.
- **Jargon.** Prefer ordinary words. If a term is required, define it in **one
  plain sentence on first use**. Glossary is backup, not the first explanation.
- **Simple first.** Explain the idea the way you would to a smart friend. Then,
  if the full mechanism is genuinely hard, **link out** — verified blog, wiki
  (Wikipedia is fine for background concepts), official docs, or paper. Follow
  [further-reading.md](further-reading.md). Never invent URLs.
- **Do not** pack the README with every algorithm, proof, or env flag. Teach the
  shape; link the depth.

**Teach the reader (mandatory)**

After discovery, pick **3–8 ideas worth understanding**. These are the non-obvious
engineering bets — the "crazy things" in the report — not a feature list.

For each idea, write all of:

1. **Name** — a memorable label in plain words (e.g. "JIT for weights")
2. **Mechanism** — how it actually works, in short sentences a non-specialist
   can follow. Cite `{path}`. If the algorithm is hard, one simple paragraph here
   plus a **verified** blog or wiki link — do not dump the paper into the README
3. **Analogy** — one short comparison a newcomer can hold
4. **Constraint it solves** — what would go wrong without it
5. **Honest limits** — when it wins, when it loses, what is unproven
6. **Sources** — 1–3 **verified** links (blog, wiki, paper, related system). Follow
   [further-reading.md](further-reading.md). Never invent URLs.

Tone for these blocks: a clear technical blog, not a conference talk. The reader
should leave knowing the idea. Place them as **Ideas worth understanding**.
Also add **Further reading**.

**Future advancements (mandatory, near the end)**

After teaching what exists today, close with **Future advancements** — what can
still be built *inside this repo*. Minimum **3**, prefer **4**. Each item must be
specific to gaps you found (TODO, missing test, incomplete API, docs hole,
performance ceiling), not industry buzzwords.

For each advancement, write:

1. **Name** — the next bet, not "make it better"
2. **Why** — what is weak or missing in the tree today (cite `{path}` or a gap)
3. **What would land** — modules, APIs, or docs that would change
4. **Done when** — how a later reader would know it shipped

Place this section **after** Further reading / Roadmap and **before** FAQ and
Glossary (or last if those are omitted). Do not merge it into a one-line bullet
list. Do not invent a product that contradicts What it is not.

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

- Complete sentences, precise, scannable — a human finishes this, they do not
  bounce off it
- No engagement bait, no filler adjectives, no unexplained acronyms
- Present tense for behavior; past tense for changelog only

### Phase 4 — Validate

Run [checklist.md](checklist.md) before delivering. Fix:

- Stale tech (e.g. Chroma when project uses Qdrant)
- Wrong section numbering (must be sequential 1…N)
- TOC links that don't match heading anchors
- Required env vars that don't match `config` / `.env.example`
- Tool/API counts that don't match registry or routes
- Teaching blocks that are feature bullets with no mechanism/analogy/limits
- Citation URLs that were not verified
- Fewer than 3 future advancements, or advancements with no path/gap in this repo
- Jargon with no plain-language gloss; complicated idea with no blog/wiki link
- A README so long the narrative cannot be finished in one sitting

### Phase 5 — Maintain

When updating an existing extensive README:

- Update counts, paths, diagrams, and teaching blocks in the same PR as code changes
- Append changelog row; don't rewrite history
- Move completed roadmap items to changelog; keep future directions realistic
- Re-verify further-reading links if they go stale

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

A catalog is not a teaching block. If a tool encodes a non-obvious idea, name that
idea in **Ideas worth understanding** and point at the catalog row.

## Roadmap section shape

```markdown
## N. Roadmap & build history

### Build phases (completed)
| Phase | Theme | Status |
|-------|-------|--------|
| 0 | … | done |
```

Distinguish **shipped** (changelog) from **planned**. Do not hide future work here —
the next section is **Future advancements**.

## Future advancements section shape

Always include. At least **3**, prefer **4**. Grounded in this repo.

```markdown
## N. Future advancements

What can still be built in this repository — not a generic industry wishlist.

### N.1 {Named next bet}
**Why now.** {Gap in `{path}` or missing capability.}
**What would land.** {Modules / APIs / docs.}
**Done when.** {Observable outcome.}

### N.2 …
### N.3 …
### N.4 …
```

## Anti-patterns

- Generic "Features" bullet list with no file paths
- README shorter than the project's complexity warrants
- Copying package.json description as the whole README
- Stale diagrams showing removed interfaces
- "76 tools" when registry has 81 — always verify
- Mixing Chroma/Qdrant/Postgres without checking `vector_store` or DB config
- Numbered sections out of order in the file body
- Catalogs without teaching the non-obvious bets
- Invented or guessed citation URLs
- Using this skill for a product landing page (that is `product-readme`)
- README with no Future advancements, or fewer than 3 repo-specific next bets
- Future advancements that are slogans ("scale", "AI", "more features") with no path
- Jargon wall (undefined acronyms, paper-speak where a simple sentence would do)
- Novel-length dump that would discourage a curious human from finishing
- Complicated idea explained only in-place, with no verified blog or wiki to go deeper

## Output

Deliver a single `README.md` unless the user asks for split docs (`PRODUCT.md`, `docs/`).

For monorepos: one root README with links to per-package READMEs; each package README
follows the same skill at reduced scope.

## Additional resources

- Section templates and starter text: [templates.md](templates.md)
- Pre-ship validation: [checklist.md](checklist.md)
- How to cite blogs and papers: [further-reading.md](further-reading.md)
