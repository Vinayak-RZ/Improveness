# Product README — templates

First-screen contract, then teaching, then install. Delete any block you cannot
make true. No numbered Vision sections.

## Logo + badges + nav

```markdown
<p align="center">
  <img src="assets/{product}-logo.svg" width="420" alt="{product} — {tagline}">
</p>

<p align="center">
  <a href="docs/EXTENSIVE.md"><img src="https://img.shields.io/badge/docs-extensive-1f6feb" alt="Extensive internals"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2ea043" alt="License"></a>
</p>

<p align="center">
  <a href="docs/EXTENSIVE.md"><b>Internals</b></a> ·
  <a href="LICENSE"><b>License</b></a>
</p>
```

Omit a badge or nav link when the URL does not exist. Logo is optional.

## Extensive banner

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

## Pitch + positioning (required)

```markdown
**{What it does.}** {One or two sentences. The bet that makes it possible.}

> **{Product} is {category} you can run today.** It is not {nearby-wrong-thing}.
> Primary interface: `{command or route}`.
> Invariant: **{the rule you will not break}**.
```

## Proof (required)

Fenced `text`, real CLI — or a recorded demo with a teaching caption.

Example shape (do not nest fences in the README you write):

- Language: `text`
- First line: `$ {actual-command}`
- Following lines: actual or faithfully reconstructed output

That command is the product check. Say what it proves (tests, health, a named
fixture). If you cannot run it, mark the block illustrative.

## Why it exists

A few paragraphs of **era context** only if true. Named papers/posts the code
cites. Nearby-wrong products get one sentence, not a roast.

## Core techniques

```markdown
## Core techniques

- **{Named idea}.** {Mechanism.} Limit: {when it loses}. [{Source}]({verified-url})
- **{Named idea}.** …
```

## Optional field guide

Vocabulary a reader can steal without installing. Short subsections, not
school-essay blocks. Cap ~5. Skip on a tiny SDK.

## Honest claims

```markdown
## What it achieves (honest)

Only numbers this tree can reproduce. See [{ledger}]({path}) or omit the section.
```

## Get started (after teaching)

```markdown
## Get started

You need {N} things: **{the program}** and **{the model / account / env}**.

### 1. Install

    {one pasteable command}

### 2. Run

    {the proof command or the smallest live command}
```

## Go deeper

A table of real docs. Catalogs, env inventories, and file maps stay in `docs/`
or `extensive-readme`.
