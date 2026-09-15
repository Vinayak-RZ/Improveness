---
name: graph-of-loops
description: >
  Full product one-shot as a graph of loops: ask every product and technical
  question first, lock users/P0/non-goals, architecture ADRs, then execute
  build slices with maker + independent checker until a stop command holds,
  boot it, run a queued trial log, document after evidence. For long
  (1–2h+) runs when the user names /graph-of-loops. XOR graph-engineering.
  Not graphify. Not Cursor /loop.
disable-model-invocation: true
trigger: /graph-of-loops
argument-hint: "[plan path or leave blank to use the current nawab plan]"
license: MIT
---

# Graph of Loops

This packet **builds the product**. Triggering it means a long run: questions
→ product lock → architecture → parallel build loops → integrate → tests →
**boot** → **queued trials** → docs. Wall clock of **one to two hours or
more** after approval is expected. Stopping at "code written" is failure.

Each **node** is a loop: maker implements, a **different** checker runs a
machine-checkable stop, retry until pass or budget, then escalate.

Nawab §0–§18 is still the scope contract. Use **standard or project**
profile (not lite). The **loop graph** is what you execute.

**XOR with `graph-engineering`.** Both named → stop and ask. Never auto-chain.

**Not Cursor `/loop`.** That is an interval wake. Do not arm timers.

**Not graphify.**

Packet:

| File | Job |
|------|-----|
| [QUESTIONS.md](QUESTIONS.md) | Gate 0 — ask everything; wait |
| [PRODUCT.md](PRODUCT.md) | P0 product lock |
| [DECISIONS.md](DECISIONS.md) | A1 ADRs |
| [CYCLE.md](CYCLE.md) | Stage catalog (R0→D1) |
| [QUALITY.md](QUALITY.md) | Tests, boot, trials, docs-out |
| [EXECUTE.md](EXECUTE.md) | Maker/checker + long-run stamina |
| [LOOP_GRAPH.template.md](LOOP_GRAPH.template.md) | Graph you approve |
| [LOOP.template.md](LOOP.template.md) | One node |
| Topologies | [../graph-engineering/TOPOLOGIES.md](../graph-engineering/TOPOLOGIES.md) |

## Persistence

Stay on this graph for the **whole run** — every wave and inner round,
including resume after a dead session. Ponytail on every product-code write.

Off only: "stop graph of loops" / "run it linearly" / revert to §18.

---

## When to load

**Only** when named: `/graph-of-loops`, `@graph-of-loops`, "graph of loops",
"loop graph", "run this as a graph of loops", or "one-shot this product as
loops".

**Do not load** because Plan mode is on, or because the task is a 1–3 step
hotfix (use ponytail + linear nawab).

Pick **graph-engineering** when slices are known one-shots with no inner
retry. Pick **this** when the run should stay up until gates hold and a
separate checker agrees — typical for **entire products / major features**.

---

## Hierarchy (depth 2)

```text
LOOP_GRAPH.md
  plans/loops/<id>.md
  plans/loops/<id>.state.json
docs/PRODUCT.md              ← P0
DECISIONS.md                 ← A1
docs/planning/GATE_0.md      ← R0 answers
docs/planning/R1_BOOT.md
docs/planning/T1_TRIALS.md
PROGRESS.md
```

Loop plans do **not** spawn another graph unless the user names this skill
again for that slice.

---

## Cursor primitives

Do not emit JS orchestration or `.claude/workflows/`. Do not use `/loop`
timers.

| Idea | Cursor |
|------|--------|
| Maker | `Task` that implements **one** loop plan (writes allowed) |
| Checker | **Different** `Task`, readonly, runs the stop only |
| Stop | Command or file predicate — "looks good" refuses compile |
| Round | Maker → checker; fail + budget → maker gets **findings only** |
| Budget | `max_rounds` default 3, cap 5 unless user asked |
| State | `plans/loops/<id>.state.json` — resume the node, not wave 0 |
| Fan-out | Independent makers in **one** message (2–4 writers) |
| Model | Maker `inherit` (cheap on extract). Checker `composer-2.5-fast` unless judge |
| Isolation | Disjoint write paths |

Unknown `model` slug → `inherit`. Never guess.

---

## Drafting vs execute

### A. Named, not yet approved

1. Research 5–10 lines. Follow [QUESTIONS.md](QUESTIONS.md). **Stop. Wait.**
2. From answers: nawab **standard/project** §0–§18 + `docs/planning/GATE_0.md`.
3. Compile per [CYCLE.md](CYCLE.md) + checklist below. Write **every** loop
   plan before approval (links must work). Every plan has a stop command.
4. §19 + disk: `LOOP_GRAPH.md`.
5. Footer: *Approving starts the long run immediately. Product, architecture,
   build, boot, queued trials, and docs-out are on the graph.*
6. Wait **only** for that approval.

### B. Approved, or named on an already-approved plan

If the graph or a loop plan is missing, compile first. Then **run**
[EXECUTE.md](EXECUTE.md) without a second wait per node.

---

## Compile checklist

Gate 0 answers exist. Read [CYCLE.md](CYCLE.md) and topologies.

1. Every cycle stage is a loop (or `N/A — reason`). **P0, A1, E1, R1, T1, D1
   are not optional** for software.
2. Cut fake edges. Independent work is the same wave.
3. Fill [LOOP.template.md](LOOP.template.md) per node. Prose-only stop →
   refuse that node.
4. Checker ≠ maker. Default checker `composer-2.5-fast`.
5. `max_rounds` default 3. Escalate rule named.
6. Waves + barrier only when the next node needs the **whole** set.
7. Fill [LOOP_GRAPH.template.md](LOOP_GRAPH.template.md). Loop-plans table
   required. T1 plan lists the **trial queue** ([QUALITY.md](QUALITY.md)).
8. Tiny real chains stay a chain. Do not pad.

Show in chat: mermaid, loop-plan links, lifecycle, waves, per-loop stop +
max rounds, edges cut.

---

## Pairing with nawab-plans

| | Default nawab | This skill |
|--|----------------|------------|
| Profile | lite in Plan mode | **standard or project** |
| What you read | §0–§18 | **LOOP_GRAPH.md** + loop plans |
| §19 | `N/A` | Required loop graph + links |
| Approval | then §18 | Approve → **run the long cycle** |
| Extra wait | — | Gate 0, escalate, prod/freeze only |

If §19 already has `EXECUTION_GRAPH.md`, ask which skill wins.

---

## Anti-patterns

- Loading because Plan mode is on, or with graph-engineering
- Using Cursor `/loop` as the inner loop
- Compiling before Gate 0 answers; guessing users or UX
- Lite nawab for this skill
- Stop that is not a command or file predicate
- Maker checking its own stop
- Graph that ends at code written (no R1/T1/D1)
- Docs-out before trials
- Restarting wave 0 after a dead session
- Parallel writers on the same files
- Re-asking Gate 0 on resume
- Confusing with `graphify` or `graph-engineering`
