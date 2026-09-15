# Product lock (P0)

Think like a product engineer, then write it down. A long run that skips
this ships the wrong software efficiently.

Authority after this loop: `docs/PRODUCT.md` (preferred) **or** nawab §1 if
the user forbade extra docs. Checker proves the file has every required
heading.

Load this inside the **P0** loop. Do not invent users or copy.

---

## Required headings (`docs/PRODUCT.md`)

```markdown
# [Name]

## User
[One role.]

## Job
[One sentence — the job they hire this for.]

## Done looks like
[Demoable: command, URL, or artifact a stranger can try.]

## P0 (this graph)
- [Must work]

## Later (not this graph)
- [Explicit]

## Non-goals
- [Will not build, even if easy]

## Honest holes
- [What we will label cannot-do / unchecked / out of scope]
```

**Stop (example):** file exists and contains `## User`, `## Job`, `## P0`,
`## Non-goals` (grep). Not "the product section looks fine."

---

## Reasoning rules

- One primary user. "Also marketers" is Later unless P0 names them.
- P0 must be **demoable in R1/T1**. If it cannot be booted, it is not P0.
- Non-goals protect the long run from gold-plating. If a slice is not in
  P0 or Later, it does not get a B* node.
- Honest holes beat fluent fake. Prefer an exact token (`unchecked`,
  cannot-do row) over a silent lie.
- Do not specify pixels or schema here — that is U1 / A1. This file is
  **who / why / what ships**.

---

## Checker

Readonly. Confirm headings exist and P0 items are testable sentences (verb +
object), not slogans. Fail if P0 is empty or identical to Later.
