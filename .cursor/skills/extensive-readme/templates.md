# Extensive README — templates

Default file: `docs/EXTENSIVE.md`. Number sections sequentially. One subsection
per first-party package — do not skip.

## Skeleton

```markdown
# {Project} — extensive internals

Companion to the main [README](../README.md). How the repo runs, every package,
and why the important files exist. Do not invent paths.

## Table of contents

- [1. How this repository runs](#1-how-this-repository-runs)
- [2. Package map](#2-package-map)
- [3. Packages](#3-packages)
- [4. Configuration](#4-configuration)
- [5. Tests and CI](#5-tests-and-ci)
- [6. Ideas worth understanding](#6-ideas-worth-understanding)
- [7. Further reading](#7-further-reading)
- [8. Future advancements](#8-future-advancements)

## 1. How this repository runs

{Mermaid: user/action → entry → packages → result. Then a short walkthrough.}

## 2. Package map

| Package | Path | Role | Entry |
|---------|------|------|-------|
| `{name}` | `{dir}` | {one line} | `{file or command}` |

## 3. Packages

### 3.1 `{package name}`

**What it is for.** {Plain sentence.}

**How it is used.** {Who imports it, which CLI, which URL.}

**How it works.** {High-level flow. Cite entry `{path}`.}

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `{path}` | {reason this file exists} | {one line} |

{Repeat 3.2, 3.3, … for every first-party package.}

## 4. Configuration

## 5. Tests and CI

## 6. Ideas worth understanding

## 7. Further reading

## 8. Future advancements
```

## Package section (copy per package)

```markdown
### N.M `{name}` (`{dir}`)

**What it is for.** …

**How it is used.** …

**How it works.** …

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `{path}` | {why} | {what} |
```

Include: entry files, public API, core logic, package-local config, that package's
tests. Exclude: generated output, vendored deps.

## Workflow diagram

Use mermaid `sequenceDiagram` or `flowchart TD`, ≤15 nodes per diagram; split if
the runtime has more stages.

## Future advancements

At least 3, prefer 4. Same shape as readable-readme: Why now / What would land /
Done when. Cite `{path}`.
