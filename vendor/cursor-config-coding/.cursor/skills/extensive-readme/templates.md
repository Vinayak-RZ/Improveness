# Extensive README — Section templates

Copy and adapt. Skip sections that do not apply. Keep numbering sequential in the
final file. Teaching blocks are not optional when the project has non-obvious ideas.

## Skeleton (section order)

```markdown
# {Project} — {one-line what + for whom}

> {What it is}. {What it is not}. Primary interface: {CLI / API / UI}.

Runtime: {language / deploy target}.

---

## TL;DR

- {Differentiator 1}
- {Differentiator 2}
- …

## Table of contents

- [1. Vision](#1-vision)
- [2. Ideas worth understanding](#2-ideas-worth-understanding)
- [3. Architecture](#3-architecture)
- [4. Quickstart](#4-quickstart)
- [5. Configuration](#5-configuration)
- [6. Directory tree](#6-directory-tree)
- [7. Interfaces](#7-interfaces)
- [8. Data model](#8-data-model)
- [9. Testing](#9-testing)
- [10. Further reading](#10-further-reading)
- [11. Roadmap and changelog](#11-roadmap-and-changelog)
- [12. Future advancements](#12-future-advancements)
- [13. FAQ](#13-faq)
- [14. Glossary](#14-glossary)

## 1. Vision

### What it is
### What it is not

## 2. Ideas worth understanding

{See teaching block template below. 3–8 ideas.}

## 3. Architecture

Use a mermaid `flowchart TD` or `flowchart LR` here (≤15 nodes).

### 3.1 Concept to implementation map

| Concept | Where it lives | Notes |
|---------|----------------|-------|
| {idea} | `{path}` | {one line} |

## 4. Quickstart

## 5. Configuration

| Variable | Required | Default | What it does |
|----------|----------|---------|--------------|
| `{NAME}` | yes/no | `{value}` | {one line} |

## 6. Directory tree

## 7. Interfaces

## 8. Data model

## 9. Testing

## 10. Further reading

## 11. Roadmap and changelog

## 12. Future advancements

{Mandatory. At least 3, prefer 4. See template below.}

## 13. FAQ

## 14. Glossary
```

Renumber if you skip sections. TOC anchors must match headings.

## Teaching block (one idea)

Use this shape for every item in **Ideas worth understanding**:

```markdown
### N.M {Memorable name}

**Constraint.** {What would go wrong, or what the system cannot afford.}

**How it works.** {Short sentences a non-specialist can follow. Cite `{path}`. If this is hard, one simple paragraph plus a verified blog or wiki — do not paste the paper.}

**Analogy.** {One comparison a newcomer can hold — e.g. "a JIT, but for weights".}

**Limits.** {When it wins, when it loses, what is unproven. Do not oversell.}

**Read next.** [{Title}]({verified-url}) — {why this source}. Blog, wiki, or paper. Optional second link.
```

Good names are ideas, not features: "one hierarchy, not one memory requirement",
not "supports CUDA".

## Further reading section

```markdown
## N. Further reading

Start here if you want the ideas, not the file tree.

| Idea | Canonical source | What you will learn |
|------------------------|---------------------|
| {name} | [{title}]({url}) | {one line} |

Related systems (verified):

- [{project}]({url}) — {what it shares with this repo}
```

Rules for every URL: [further-reading.md](further-reading.md).

## Future advancements (mandatory, near the end)

At least **3**, prefer **4**. Each one must cite a gap in *this* repo.

```markdown
## N. Future advancements

What can still be built in this repository.

### N.1 {Named next bet}

**Why now.** {What is missing or weak today. Cite `{path}`, a TODO, or a missing test.}

**What would land.** {Files, APIs, or docs that would change.}

**Done when.** {How a later reader would know this shipped.}

### N.2 {Named next bet}

**Why now.** …
**What would land.** …
**Done when.** …

### N.3 {Named next bet}

**Why now.** …
**What would land.** …
**Done when.** …

### N.4 {Named next bet}

**Why now.** …
**What would land.** …
**Done when.** …
```

Do not substitute a bullet wishlist. Do not invent work that contradicts **What it is not**.

## Catalog table (tools / APIs / CLI)

```markdown
### N.M {Category} ({count})

| Name | Auth / gate | What it does |
|------|-------------|--------------|
| `{id}` | {none / role / approval} | {outcome-focused one line} |
```

Show category counts and a verified total.

## Concept → implementation map

```markdown
| Concept | Code | Config | Test |
|---------|------|--------|------|
| {idea name} | `{path}` | `{VAR}` | `{test path}` |
```

## Glossary row

Teach, do not only define:

```markdown
| Term | Meaning in this repo | Why it matters |
|------|----------------------|----------------|
| {term} | {definition tied to this codebase} | {what a reader will misread without this} |
```

## Opening blockquote

```markdown
> **{Project} is {category}.** It is not {nearby-wrong-thing}. The primary
> interface is `{command or URL}`. Optional pieces degrade to {fallback}.
```
