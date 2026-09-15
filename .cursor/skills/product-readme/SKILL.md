---
name: product-readme
description: >-
  Authors public product README.md files: named host-run products (studio,
  harness, lab, domain kernel, agent system) get a category landing (mascot,
  category line, turn-host-into-job, counts, prompt); libraries get a short
  promise plus proof command. Then named techniques with limits. Use for OSS,
  CLIs, engines, and agent products. Do not use for internal platform-layer
  overviews (readable-readme) or package maps (extensive-readme). Unspecified
  "make a README" goes to the readme skill.
---

# Product README Authoring

Write a **product landing a stranger can steal in two seconds**. For a named
product people clone and run with an AI host, that landing is a **category
claim**, a **host conversion**, and **counts from this tree**. For a library,
it is still what it is, what it is not, and a proof command.

Write for **any** installable product. Steal **structure** from public
agent-studio landings (centered mascot, category one-liner, nav, conversion
paragraph, prompt-first quick start). Do not copy their product names, slogans,
or invented inventory. Do not invent a fourth README type.

**Portable:** never name a customer, private repo, or local disk path inside
this skill. Describe the job. Fill every blank from the repo in front of you.

## When to apply

- Installable product, OSS library, CLI, engine, or agent harness
- User asks for a product README, OSS landing page, or installable-library README
- Router default for installable / OSS / agent

**Not this skill:** internal platform layer / monorepo service → `readable-readme`.
Package maps → `extensive-readme`. Unknown type → `readme` (asks first).

If an extensive companion was requested, write `README.md` here, then load
`extensive-readme`. Banner (after nav, before the conversion paragraph):

```markdown
> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)
```

## Workflow

### Phase 1 — Discover

Do not invent features, numbers, or URLs.

1. **Kind:** named host-run product (studio / harness / lab / kernel / agent system) vs library / SDK
2. **Narrow category** a rival cannot paste; or skip "the first" if the category is crowded
3. **Host conversion:** the tool they already run → the complete job
4. **Inventory counts** you can point at in the tree (stop at two if a third would be padding)
5. The **prompt** a stranger pastes, and/or the **one command** that proves it
6. **Primary interface**, **one invariant**, **one nearby-wrong**
7. 1–5 **named techniques**, each with an honest limit
8. Existing logo / mascot; real docs / license the tree cites

### Phase 2 — Length

| Shape | Length |
|-------|--------|
| Small SDK | Short: promise + 1–3 techniques + install |
| Named host-run product | Category landing: first screen + demos/proof + prompt-first quick start + techniques |
| Default | First-screen contract, skip empty sections |

### Phase 3 — Write

Read [../copywriting/SKILL.md](../copywriting/SKILL.md) and
[../readme/anti-slop.md](../readme/anti-slop.md) first. Follow
[templates.md](templates.md). No `## 1. Vision` numbering. Copywriting writes
the sentences. This skill owns section order. First-screen **is / is not** is
one factual nearby-wrong, after the conversion. Empty upgrade is banned.
Category claims with tree-true counts are allowed.

### Phase 4 — Validate

Run [checklist.md](checklist.md), the copywriting
[scorecard](../copywriting/scorecard.md), and the anti-slop **Pass**.

Then **critique the first screen as a stranger's screenshot**:

1. Can they steal the category sentence?
2. Is there a "turn {host} into {job}" line?
3. Are counts tree-true (no padded third)?
4. Is the next action a prompt or a proof command, not a lecture?
5. Did internals (ticket ids, harness letters) leak above the fold?

If any fail, rewrite the README. If the failure is a missing **general** rule,
patch this skill (still no customer names), then rewrite again.

## First screen (required)

**Named host-run product**, before the fold:

1. Centered **character mark** (see Logo)
2. Centered product name (H1). Do not duplicate it inside the mascot.
3. Centered **category line** (`The first {narrow category}.` in words a stranger already has; coined class names stay out of this line)
4. Real badges / nav only
5. Extensive banner if a companion exists
6. **Conversion paragraph:** turn {host} into {job}; plain-language input; named stages
7. **Count line** from the tree (body; GitHub About may add "world's first")
8. Blockquote: nearby-wrong, primary interface, invariant
9. Proof: recorded demos / screenshots with teaching captions, and/or a fenced real command that **does the job** (`--help` is not the product check)

**Library / SDK**, before the fold:

1. Logo if one exists (flat mark, not a mascot-by-default)
2. Pitch: what it does in 1–2 paragraphs
3. Blockquote: is / is not, primary interface, invariant
4. Proof command

Get started / quick start for host-run products sits **after proof and the
workspace**, still **before** a long technique catalog. Libraries may keep
install after teaching. The proof command is never replaced by "see Get started".

## Logo

Search `assets/`, `docs/`, `docs/media/`, `public/`, `static/`, `brand/`.

**If a real logo exists:** reuse it unless the user asked for a new mark.

**If none, or the user asked for a mascot:**

| Kind | Mark |
|------|------|
| Named host-run product | Character mark: small helper / companion, original vector, 2–3 colors. Domain cue as an attribute (bolt, lens, tool), not a pasted trademark. No photorealism. Transparent background. |
| Library / SDK | Flat geometric or short wordmark, 1–2 colors, no gradients / 3D / emoji |

Write `assets/{product}-logo.svg` (and a raster twin if the mark is a soft character). Mascot width in the README ~160–220. **Lockup:** character in the center, **wordmark under it** as a separate image in a real typeface (`assets/{product}-wordmark.svg` or `.png`). Do not use a default GitHub H1 as the name, and do not bake a long name into the mascot. Do not invent favicons. Do not copy a trademarked mascot.

## Teaching

Each named technique:

- Memorable name
- Mechanism in plain language
- Honest **limit** (when it wins / loses)
- 1 verified link or omit

Optional **field guide**: vocabulary the reader can reuse. Cap at ~5 ideas.

**Honest claims:** only numbers this tree can reproduce. Point at a ledger or
omit. Never invent tok/s, “trusted by”, or public-bench scores as fitness.

## Section order

**Named host-run product**

1. Mascot / name / category line / badges / nav
2. Extensive banner if companion exists
3. Conversion + count line
4. Positioning blockquote (nearby-wrong / interface / invariant)
5. Proof (demos, screenshots, or command)
6. Try-these-prompts (pasteable, from this tree)
7. Workspace / primary UI if any
8. Quick start (prereqs, install, the prompt)
9. How it works (short diagram) + named techniques with limits
10. Optional field guide
11. What it achieves (honest / omit)
12. Go deeper
13. License / contributing

**Library / SDK:** logo → pitch → blockquote → proof → why (if true) →
techniques → get started → go deeper → license.

## Anti-patterns

- Numbered Vision / Ideas skeleton on a product repo
- Generic Features with no idea
- Teaching essay before the category line on a host-run product
- Proof missing; install dumped before the reader knows what they installed
- Invented URLs, fake benchmarks, padded inventory counts
- File maps in `README.md`
- Internal codes on the first screen
- LLM default voice: [../readme/anti-slop.md](../readme/anti-slop.md)

## Additional resources

- [templates.md](templates.md)
- [examples.md](examples.md)
- [checklist.md](checklist.md)
- [../readme/anti-slop.md](../readme/anti-slop.md)
- [../copywriting/SKILL.md](../copywriting/SKILL.md)
