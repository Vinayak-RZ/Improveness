# End-to-end lifecycle

Default node catalog for **entire projects and major features**. The graph
must cover every stage or mark it `N/A — [reason]`. Skipping run, trials, or
docs-out because "we will do that later" is an incomplete graph.

Companion skills are **loaded inside that node**, not instead of a node plan.

---

## Gate 0 — Research, then questions (blocking)

Lead only. No product fan-out yet. **Do not compile §19 or write node plans
until this gate passes.**

1. **Research** — Read the repo (or state greenfield). Note stack, existing
   docs, constraints, users. Load domain skills as needed
   (`frontend-architecture`, `backend-architecture`, `agentic-system-design`,
   `system-design-tradeoffs`). Cite what you found in 5–10 lines.
2. **Questions** — Ask. Do not guess. Do not skip because it might slow the
   user. Asking is expected.

Split the list:

| Kind | Rule |
|------|------|
| **Must-answer** | Blocks the graph. Product, users, non-goals, must-have vs later, auth, data stores, "does this already exist?" |
| **Trade-off** | Two or more valid options, neither obviously better. Emit the trade-off block (below) and **ask which PRIORITY wins**. Do not silently pick. |
| **Optional** | Defaults allowed if the user skips. State the default in the question. |

Ask in **one numbered list** (or two short batches if >12 must-answer items).
Wait for answers before compiling.

```markdown
## Trade-off: [title]
**Option A:** … — Pros / cons
**Option B:** … — Pros / cons
**Default if you skip:** [x] because …
**Override:** PRIORITY = COST | SPEED | QUALITY | SIMPLICITY | CONSISTENCY | AVAILABILITY | SAFETY
```

Never invent UX copy, tenancy, payment behavior, or schema when the user
has not said.

---

## Stages (include or N/A)

Typical waves — **cut fake edges**; UI and API fan out once contracts exist.

| ID | Stage | Job | Usually consumes | Companion |
|----|-------|-----|------------------|-----------|
| R0 | Research + questions | Gate 0 (lead) | — | domain skills |
| D0 | Docs-in | Existing docs accurate enough to build on; gaps listed | repo | `extensive-readme` / existing docs |
| A1 | Architecture | Boundaries, data flow, ADRs for remaining trade-offs | R0 answers | `*-architecture` + `system-design-tradeoffs` |
| U1 | Design / UI UX | Information architecture, states, a11y; visual system | product intent, contracts | `impeccable`, `frontend-architecture` |
| B* | Build | Implement slices (fan-out by package/surface) | A1 contracts | `ponytail` on every write |
| M1 | Integrate | Merge slices, shared types, wiring | all B* outputs | lead |
| E1 | Evaluate | Tests, gates, evals if LLM | M1 | repo test commands |
| R1 | Run | **Actually boot it** — dev server, smoke, critical path | E1 or M1 | — |
| T1 | Trials | **Multiple** runs: happy path, empty, error, auth fail, one regression | R1 | — |
| D1 | Docs-out | README + needed companions **after it works** | T1 evidence | `readme` router |

**D0 vs D1:** D0 is "can we plan from what is written." D1 is "the shipped
product is documented." Do not collapse them into one node on a full
one-shot.

**R1 is not optional** when the deliverable is software. A green test file
is not "it runs." Boot it (or the closest substitute: CLI, worker, preview).

**T1** means more than one trial, not one happy-path screenshot.

If the task has no UI, U1 = `N/A — no user-facing surface`. If there is UI,
U1 is required.

---

## Suggested topology (greenfield / major feature)

```text
R0 (lead, blocking)
  → D0 + A1          (docs-in and architecture: parallel if no edge)
  → U1 + B*          (design // build slices after contracts — fan-out)
  → M1               (barrier)
  → E1
  → R1
  → T1
  → D1
```

B* nodes split by **real package or surface**, not by "frontend then backend
because that is the order we type." If the API schema is the only edge, UI
and API are the same wave after A1.
