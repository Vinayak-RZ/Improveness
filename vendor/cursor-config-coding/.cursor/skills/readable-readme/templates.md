# Readable README — templates

Internal platform-layer `README.md`. Skip empty sections. Keep numbering
sequential. **Do not use this skeleton for installable products.**

## Skeleton

```markdown
# {Project} — {one-line what + for whom}

> Full internals: [Extensive README](docs/EXTENSIVE.md)

> {What it is}. {What it is not}. Primary interface: {CLI / API / config}.

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

{At most 5 teaching blocks.}

## 3. How it works

One mermaid diagram (≤15 nodes). A few paragraphs. No file-by-file dump.

## 4. Quickstart

## 5. Configuration

Only variables a newcomer must set.

## 6. Further reading

## 7. Future advancements

{3 short items. Do not copy into EXTENSIVE.}
```

Omit the extensive banner if `docs/EXTENSIVE.md` was not requested and does not exist.

## Teaching block

```markdown
### N.M {Plain-language name}

**How it works.** {Short sentences. Cite `{path}`.}

**Limits.** {When it wins / loses.}

**Read next.** [{Title}]({verified-url})   <!-- omit if no URL -->
```

Analogy (`**Like.**`) is optional. Skip The-problem headers when the how/limits
pair is enough.
