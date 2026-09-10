# Extensive README — templates

Default file: `docs/EXTENSIVE.md`. Number sections sequentially.

**Order rule:** domain concepts and how-it-runs **before** the package map.
Do not open with a package table.

## Skeleton

```markdown
# {Project} — extensive internals

Companion to the main [README](../README.md). Concepts first, then how the repo
runs, then every package. Do not invent paths.

## Table of contents

- [1. Domain concepts](#1-domain-concepts)
- [2. How this repository runs](#2-how-this-repository-runs)
- [3. Package map](#3-package-map)
- [4. Packages](#4-packages)
- [5. Configuration](#5-configuration)
- [6. Tests and CI](#6-tests-and-ci)
- [7. Further reading](#7-further-reading)
- [8. Future advancements](#8-future-advancements)

## 1. Domain concepts

{3–8 ideas this tree actually implements. Invariants, seams, protocols.
Cite paths. Honest limits. Not a marketing recap of the landing README.}

## 2. How this repository runs

{Mermaid: user/action → entry → packages → result. Then a short walkthrough.}

## 3. Package map

| Package | Path | Role | Entry |
|---------|------|------|-------|
| `{name}` | `{dir}` | {one line} | `{file or command}` |

## 4. Packages

### 4.1 `{package name}`

**What it is for.** {Plain sentence.}

**How it is used.** {Who imports it, which CLI, which URL.}

**How it works.** {High-level flow. Cite entry `{path}`.}

#### File map

| File | Why it is here | What it does |
|------|----------------|--------------|
| `{path}` | {reason this file exists} | {one line} |

{Repeat 4.2, 4.3, … for every first-party package.}

## 5. Configuration

## 6. Tests and CI

## 7. Further reading

## 8. Future advancements
```

Tiny repos: treat top-level folders (`src/`, `lib/`, `app/`) as packages.
Domain-heavy internals may insert extra concept sections **before** §3.

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
