# Product README — templates

Delete any block you cannot make true. Prose must pass
[../readme/anti-slop.md](../readme/anti-slop.md). Fill braces from this tree.
Do not paste a customer product name from memory.

## Named host-run product (default for studio / harness / lab / kernel)

```markdown
<p align="center">
  <img src="assets/{product}-logo.svg" width="168" alt="{product} helper">
</p>

<h1 align="center">
  <img src="assets/{product}-wordmark.svg" width="380" alt="{Product name}">
</h1>

<p align="center">
  <strong>The first {narrow category}.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2ea043" alt="License"></a>
</p>

<p align="center">
  <a href="#quick-start"><b>Quick start</b></a> ·
  <a href="#try-these-prompts"><b>Try these prompts</b></a> ·
  <a href="docs/EXTENSIVE.md"><b>Internals</b></a> ·
  <a href="LICENSE"><b>License</b></a>
</p>
```

Omit a badge or nav link when the URL does not exist.

### Extensive banner

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

### Conversion + counts (required)

GitHub About (repo settings, not a second heading): `World's first {narrow category}. {N} {things}, {M} {things}. Turn your {host} into a {job}.`

README body, after the category line:

```markdown
Turn your {tool they already run} into a {complete job}. {N} {countable things},
{M} {countable things}.

Describe {input} in plain language. {Product} handles {stage1}, {stage2}, and
{stage3 that exist in this tree}.
```

If "world's first" would be a commodity lie, drop it from About too. Do not
restack the category sentence in the body.

### Positioning (required, after conversion)

```markdown
> **{Product} is {category} you can run today.** It is not {one nearby-wrong}.
> Primary interface: {the prompt, or `{command}`}.
> Invariant: **{the rule you will not break}**.
```

One neighbor. No "just". No vibe-upgrade.

### Proof (required)

Demos / screenshots with a teaching caption, and/or a fenced real CLI.

- Language: `text`
- First line: `$ {actual-command}`
- Following lines: actual or faithfully reconstructed output

Say what the command proves. If you cannot run it, mark the block illustrative.
`--help` is not the product check.

### Coined class name (optional, before prompts)

Only if the tree uses a class the public does not already say. One sentence, then instantiate. Not the category line.

```markdown
## {Term}

A **{term}** is what enables a general {harness} to have expertise in a specific domain.
{Product} is the {term} for {this field}.
```

### Try these prompts

```markdown
## Try these prompts

Open this repo in {named hosts this tree supports} and paste:

    {smallest real job in this domain}

    {second real job}
```

### Quick start (after proof / workspace)

```markdown
## Quick start

You need {N} things: **{the program}** and **{the host or model}**.

    {one pasteable install}

Then tell the host the prompt above. Optional CLI proof:

    {the proof command}
```

## Library / SDK (short)

```markdown
**{What it does.}** {One or two sentences.}

> **{Product} is {category} you can run today.** It is not {nearby-wrong}.
> Primary interface: `{command or import}`.
> Invariant: **{rule}**.
```

Then the proof command, 1–3 techniques, install.

## Core techniques

```markdown
## How it works

- **{Named idea}.** {Mechanism.} Limit: {when it loses}. [{Source}]({verified-url})
```

## Honest claims

```markdown
## What it achieves (honest)

Only numbers this tree can reproduce. See [{ledger}]({path}) or omit the section.
```

## Go deeper

A table of real docs. Catalogs, env inventories, and file maps stay in `docs/`
or `extensive-readme`.
