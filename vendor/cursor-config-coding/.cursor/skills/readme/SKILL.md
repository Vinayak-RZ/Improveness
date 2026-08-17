---
name: readme
description: >-
  Routes README work among product-readme, readable-readme, and extensive-readme.
  Use when the user asks to make, write, create, or update a README without naming
  a type, or says "use the readme skill". Asks in one line whether the main
  README.md is a product landing page or a readable human overview, and whether an
  extensive companion (docs/EXTENSIVE.md) is also needed. Do not write a README
  until that choice is known.
---

# README router

Three README skills exist. This skill **chooses**; it does not author the prose.

| Skill | What it writes | Typical file |
|-------|----------------|--------------|
| `product-readme` | Public product landing (logo, tagline, demo, tiny install) | `README.md` |
| `readable-readme` | Long human overview people actually finish | `README.md` |
| `extensive-readme` | Package-by-package internals, file maps, how the repo runs | `docs/EXTENSIVE.md` |

**`README.md` is never the extensive dump** unless the user explicitly overrides.
The extensive file is a companion. If it is requested, the main README gets a
link at the top.

## When to apply

- "Make a README", "write a README", "update the README", "document this repo"
- User did **not** already say product / readable / extensive / Colibri / landing page

If they already named a type, skip the question and load that skill (and extensive
only if they also asked for internals / "also extensive").

## One-line question (mandatory when type is unknown)

Do **not** start writing. Ask **once**, then wait.

Prefer AskQuestion when available:

1. **Main README.md:** Product landing, or readable human overview?
2. **Also extensive companion** at `docs/EXTENSIVE.md`, linked from the top? Yes / No

If AskQuestion is not available, send **exactly one** chat line:

> Main README.md: **product** or **readable**? Also write an **extensive** companion (`docs/EXTENSIVE.md`) and link it from the top? (yes/no)

Do not add a second clarifying paragraph. Do not default silently.

**Extensive-only:** if they say they already like README.md and only want internals,
skip rewriting `README.md`, load `extensive-readme`, and add the banner link.

## After they answer

Load and follow the matching skill(s) in the same turn:

| Answer | Load |
|--------|------|
| product, no extensive | `product-readme` |
| readable, no extensive | `readable-readme` |
| product + extensive | `product-readme` then `extensive-readme` |
| readable + extensive | `readable-readme` then `extensive-readme` |
| extensive only | `extensive-readme` (+ banner on existing README.md) |

Order: write or update `README.md` first, then `docs/EXTENSIVE.md`, so the banner
target exists.

## Do not

- Invent a fourth README genre
- Write all three unsolicited
- Put the extensive dump into `README.md` because "they asked for a README"
