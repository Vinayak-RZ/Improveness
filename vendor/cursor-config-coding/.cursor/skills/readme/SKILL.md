---
name: readme
description: >-
  Routes README work among product-readme, readable-readme, and extensive-readme.
  Use when the user asks to make, write, create, or update a README without naming
  a type, or says "use the readme skill". Infers by repo kind when obvious; otherwise
  asks once whether the main README.md is a product landing or a readable overview,
  and whether an extensive companion is needed. Do not write a README until that
  choice is known.
---

# README router

Three README skills exist. This skill **chooses**; it does not author the prose.

**Portable:** pick by *kind of repo*, not by a named product. Skills stay reusable
on any stack.

| Skill | What it writes | Typical file |
|-------|----------------|--------------|
| `product-readme` | Public landing that teaches: is/isn’t, interface, invariant, proof, named techniques | `README.md` |
| `readable-readme` | One-sitting overview for an internal service in a platform | `README.md` |
| `extensive-readme` | Concepts + how it runs + package maps | `docs/EXTENSIVE.md` |

**`README.md` is never the extensive dump** unless the user explicitly overrides.

## When to apply

- "Make a README", "write a README", "update the README", "document this repo"
- User did **not** already name product / readable / extensive / landing page

If they already named a type, skip the question and load that skill (and extensive
only if they also asked for internals).

## Default by repo kind (no question)

| The tree looks like… | Load |
|----------------------|------|
| Installable library, CLI, OSS engine, agent people `pip`/`npm`/clone-and-run | `product-readme` |
| Internal service in a multi-repo or multi-package platform (ingest, storage, shared lib consumed by siblings) | `readable-readme` |

## When kind is unknown

Do **not** start writing. Ask **once**, then wait.

Prefer AskQuestion:

1. **Main README.md:** Product landing (installable / OSS — first screen: what it is/isn’t, proof command), or readable overview (internal platform service — 7 sections)?
2. **Also extensive companion** at `docs/EXTENSIVE.md`? Yes / No

If AskQuestion is not available, one chat line:

> Main README.md: **product** (installable/OSS landing) or **readable** (internal service overview)? Also write an **extensive** companion (`docs/EXTENSIVE.md`)? (yes/no)

Do not default silently. Hybrid (logo then readable TOC) only if the user asks.

**Extensive-only:** if they already like README.md and only want internals, load
`extensive-readme` and add the banner link.

## After they answer

| Answer | Load |
|--------|------|
| product, no extensive | `product-readme` |
| readable, no extensive | `readable-readme` |
| product + extensive | `product-readme` then `extensive-readme` |
| readable + extensive | `readable-readme` then `extensive-readme` |
| extensive only | `extensive-readme` (+ banner on existing README.md) |

Order: `README.md` first, then `docs/EXTENSIVE.md`.

## Do not

- Invent a fourth README genre
- Write all three unsolicited
- Put the extensive dump into `README.md`
- Name a customer or private gold README inside the routed skills
