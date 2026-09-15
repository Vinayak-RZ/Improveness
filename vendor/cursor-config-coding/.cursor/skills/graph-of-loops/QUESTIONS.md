# Gate 0 — ask everything first

Lead only. **Do not compile** `LOOP_GRAPH.md`, loop plans, or product/arch
files on guessed intent.

Research the repo (or state greenfield) in **5–10 lines**. Then ask. Waiting
is expected. Two batches only if must-answer items exceed 12.

Never invent UX copy, tenancy, payments, or schema the user has not chosen.

---

## How to ask

One numbered list. Tag each item:

| Kind | Rule |
|------|------|
| **Must-answer** | Blocks compile |
| **Trade-off** | Two valid options — emit the block, ask PRIORITY |
| **Optional** | State the default; user may skip |

```markdown
## Trade-off: [title]
**Option A:** … — Pros / cons
**Option B:** … — Pros / cons
**Default if you skip:** [x] because …
**Override:** PRIORITY = COST | SPEED | QUALITY | SIMPLICITY | CONSISTENCY | AVAILABILITY | SAFETY
```

Record answers in `docs/planning/GATE_0.md` (or nawab Open questions → answered).
Resume compiles from that file — do not re-ask.

---

## Must-answer — product

Skip a line only if the repo already locks it in an accepted PID/PRD **and
you cite the path**.

1. Who is the primary user (one role, not "everyone")?
2. What job do they hire this software to do (one sentence)?
3. What exists when this run is done (demoable artifact)?
4. What is **out** of scope (non-goals)?
5. P0 vs later — what must work in this run vs the next graph?
6. How will we know it worked (user-visible check, not "tests exist")?

---

## Must-answer — technical

7. Greenfield or extend this repo? If extend: which paths are off-limits?
8. Stack: inherit the repo, or name the change?
9. Data: where does truth live (files, DB, API)? What must not be lost?
10. Auth / tenancy: none, local user, multi-user? Secrets: env only?
11. Is there a user-facing UI? If yes, which surfaces (CLI / web / both)?
12. Run target: local only this graph, or deploy?
13. Commit budget **or** time budget (this skill expects **1–2+ hours** of
    execution after approval — say if the cap is smaller)?

---

## Trade-off (ask when both options are valid)

Use `system-design-tradeoffs`. Typical: monolith vs split, sync vs async,
SSR vs CSR, cache vs none, human checkpoint vs autonomy, smallest model vs
judge model. Do not silently pick.

---

## Optional (defaults if skipped)

| Topic | Default |
|-------|---------|
| Hosting | local this graph |
| Analytics / telemetry | none |
| i18n | one language |
| Extra packs / nice-to-haves | P1, not this graph |
| Cloud subagents / worktrees | off unless the user asked |

---

## After answers

1. Write `docs/planning/GATE_0.md` (questions + answers + open spikes).
2. Fill nawab **standard or project** (not lite) §0–§18 from those answers.
3. Compile the loop graph per [CYCLE.md](CYCLE.md).
4. Approval footer: long-run execute starts immediately on approve.

Do not start makers before that approval.
