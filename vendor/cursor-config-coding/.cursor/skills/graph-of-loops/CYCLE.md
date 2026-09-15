# Cycle — full product one-shot

This skill is for **shipping software**, not a thin graph. Cover every stage
or mark `N/A — [reason]`. Skipping boot, trials, or docs-out because "later"
is an incomplete run.

Companion skills load **inside** that loop, not instead of a loop plan.
Ponytail on every product-code write.

Shared topologies: [../graph-engineering/TOPOLOGIES.md](../graph-engineering/TOPOLOGIES.md)

---

## Order (do not skip)

```text
R0  research + ALL questions   ← blocking; wait for the user
     ↓
P0  product lock               ← users, job, P0 vs later, non-goals
D0  docs-in                    ← can we plan from what is written?
A1  architecture + ADRs        ← boundaries, data, trust
U1  design / UI UX             ← N/A only if no user-facing surface
     ↓
B*  build slices (fan-out)     ← real packages/surfaces only
M1  integrate                  ← barrier
     ↓
E1  evaluate                   ← tests that can fail
R1  run / boot                 ← actually start it
T1  queued trials              ← more than one; log pass/fail
D1  docs-out                   ← README after evidence, not before
H1  harden                     ← N/A unless security/CI holes remain
```

**R0 is lead-only.** Do not spawn product makers until questions are answered.
**P0 and A1 may fan out** only if they do not share write paths (usually serial:
product file then architecture that reads it).

---

## Stage catalog

| ID | Stage | Job | Stop must prove | Companion |
|----|-------|-----|-----------------|-----------|
| R0 | Research + questions | [QUESTIONS.md](QUESTIONS.md) | Answers recorded; user replied | domain skills |
| P0 | Product lock | [PRODUCT.md](PRODUCT.md) | `docs/PRODUCT.md` (or nawab §1) has users, job, P0, non-goals | — |
| D0 | Docs-in | Existing docs good enough, or gaps listed | gap list or "docs accepted" note | existing docs |
| A1 | Architecture | [DECISIONS.md](DECISIONS.md) + boundaries | ADR file + layout/trust written | `*-architecture`, `system-design-tradeoffs` |
| U1 | Design / UI UX | IA, states, a11y | IA/spec file, or `N/A — no UI` | `impeccable`, `frontend-architecture` |
| B* | Build | Implement slices | **per-slice test or typecheck command** | `ponytail` |
| M1 | Integrate | Wire slices | one command that loads the whole app/module | lead |
| E1 | Evaluate | [QUALITY.md](QUALITY.md) tests | repo test suite (or named subset) green | — |
| R1 | Run | Boot it | process starts; smoke of critical path | — |
| T1 | Trials | Queued scenarios | trial log with ≥ required rows | — |
| D1 | Docs-out | Document what actually ran | README (router: `readme`) **after** T1 | `readme` |
| H1 | Harden | CI/security holes from T1 | validate script or `N/A — none` | — |

A graph that ends at "code written" is **illegal**. R1 + T1 + D1 are required
when the deliverable is software.

---

## Suggested topology (greenfield / major feature)

```text
R0 (lead, blocking)
  → P0
  → D0 + A1     (parallel only if D0 does not write the ADR file)
  → U1 + B*     (after contracts; fan-out by real surface)
  → M1          (barrier)
  → E1 → R1 → T1 → D1
  → H1 if needed
```

B* split by **package or surface**, not "frontend then backend because we
type that way." If one schema is the only edge, UI and API are the same wave
after A1.
