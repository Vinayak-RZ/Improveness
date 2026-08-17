# Readable README — templates

Human main `README.md`. Skip empty sections. Keep numbering sequential.

## Skeleton

```markdown
# {Project} — {one-line what + for whom}

> Full internals: [Extensive README](docs/EXTENSIVE.md)

> {What it is}. {What it is not}. Primary interface: {CLI / API / UI}.

---

## TL;DR

- {Differentiator 1}
- …

## Table of contents

- [1. Vision](#1-vision)
- [2. Ideas worth understanding](#2-ideas-worth-understanding)
- [3. How it works](#3-how-it-works)
- [4. Quickstart](#4-quickstart)
- [5. Configuration](#5-configuration)
- [6. Further reading](#6-further-reading)
- [7. Future advancements](#7-future-advancements)

## 1. Vision

### What it is
### What it is not

## 2. Ideas worth understanding

{2–5 teaching blocks. See below.}

## 3. How it works

One mermaid diagram (≤15 nodes). A few paragraphs. No file-by-file dump.

## 4. Quickstart

## 5. Configuration

Only variables a newcomer must set. Full inventory belongs in extensive or `docs/`.

## 6. Further reading

## 7. Future advancements

{Mandatory. At least 3, prefer 4.}
```

Omit the extensive banner if `docs/EXTENSIVE.md` was not requested and does not exist.

## Teaching block

```markdown
### N.M {Plain-language name}

**The problem.** {What would go wrong without this.}

**How it works.** {Short sentences. Cite `{path}`. If hard: one paragraph + verified blog or wiki.}

**Like.** {One analogy.}

**Limits.** {When it wins / loses.}

**Read next.** [{Title}]({verified-url})
```

## Future advancements

```markdown
## N. Future advancements

### N.1 {Named next bet}
**Why now.** {Gap in `{path}`.}
**What would land.** {Modules / docs.}
**Done when.** {Observable outcome.}
```

Repeat for N.2–N.4.
