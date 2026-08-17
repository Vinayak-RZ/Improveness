# Product README — templates

Colibri-shaped default. Delete any block you cannot make true.

## Logo + badges + nav

```markdown
<p align="center">
  <img src="assets/{product}-logo.svg" width="560" alt="{product} — {tagline}">
</p>

<p align="center">
  <a href="{docs-url}"><img src="https://img.shields.io/badge/docs-{label}-1f6feb" alt="Docs"></a>
  <a href="{releases-url}"><img src="https://img.shields.io/github/v/release/{owner}/{repo}?color=2ea043" alt="Latest release"></a>
</p>

<p align="center">
  <a href="{website}"><b>Website</b></a> ·
  <a href="{discord}"><b>Discord</b></a> ·
  <a href="{docs}"><b>Docs</b></a>
</p>
```

Omit a badge or nav link when the URL does not exist.

## Pitch + positioning

```markdown
**{Tagline.}** {One or two sentences: what it does, on what hardware/runtime, the
bet that makes it possible.}

> **{Product} is {category} you can run today.** It is not {nearby-wrong-thing}.
> Primary interface: `{command}`. {One invariant — e.g. placement changes speed,
> not semantics.}
```

## Terminal proof

Fenced `text` or bare block, real CLI:

    $ {actual-command}
      {actual or faithfully reconstructed output}

## Screenshot with a teaching caption

```markdown
## See it running

<p align="center">
  <img src="docs/media/{file}.png" width="900" alt="{what the image shows}">
</p>
<p align="center"><em>{What to notice: metric, invariant, or UI that teaches the idea.}</em></p>
```

## Core techniques

```markdown
## Core techniques

- **{Named idea}.** {Mechanism.} {Honest limit.} [{Source}]({verified-url})
- **{Named idea}.** …
```

## The idea

One conceptual explanation a newcomer can learn from. Analogy + invariant + where
it lives in the tree. Optional diagram. Not a second feature list.

## Get started

```markdown
## Get started

You need {N} things: **{the program}** and **{the model / account / env}**.

### 1. Install

    {one pasteable command}

### 2. Run

    {one command that does the interesting thing}
```

Link a Quick Start doc for platforms; do not paste every OS matrix here.

## Go deeper

```markdown
## Go deeper

| Topic | Doc |
|-------|-----|
| {topic} | [{path}]({path}) |
```

## Basic SVG wordmark

Write `assets/{product}-logo.svg` when no logo exists. Keep it tiny.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 120" role="img" aria-label="{product}">
  <rect width="560" height="120" fill="none"/>
  <circle cx="48" cy="60" r="28" fill="#1f6feb"/>
  <text x="92" y="72" font-family="ui-sans-serif, system-ui, sans-serif"
        font-size="36" font-weight="700" fill="#1f2328">{Product}</text>
</svg>
```

Swap the circle for a simple geometric mark that fits the name (chevron, bar,
double-dot). Two colors maximum. No gradients.

## Acknowledgements row

```markdown
- [{system}]({verified-url}) — {how this repo uses it: reimplemented, compared, format adopted}
```
