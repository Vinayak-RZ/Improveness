# Topologies

Read this while compiling the **graph of plans** when the shape is not a
simple diamond. Each node still gets its own `plans/nodes/<id>.md`. Pick the
cheapest shape that matches **real data dependencies**. Default: per-item
pipeline. Barrier only when a stage needs the whole set.

| Need | Section |
|------|---------|
| Is this arrow real? | [Cut fake edges first](#cut-fake-edges-first) |
| Serial work | [Chain](#chain) |
| N independent jobs | [Fan-out](#fan-out-one-message-n-tasks) |
| Should I wait for all of them? | [Pipeline vs barrier](#pipeline-vs-barrier) |
| Breadth then one answer | [Diamond](#diamond-workhorse) |
| Path depends on a finding | [Conditional](#conditional) |
| Confidence in findings | [Verifiers on the edge](#verifiers-on-the-edge) |
| Unknown-size discovery | [Cycle](#cycle-unknown-size) |
| Cost control | [Model tiering](#model-tiering) |
| Parallel writers | [Isolation](#isolation) |
| Quick pick | [Shape cheat sheet](#shape-cheat-sheet) |

---

## Cut fake edges first

A node is one bounded job. An edge exists only when node B **reads** node A's
output. "Summarize the file and then check the weather" has **no edge** —
two independent nodes, fan-out, do not chain.

If you cannot name the variable that crosses, there is no arrow.

---

## Chain

Use when each step truly consumes the last step's output.

Cost: slowest run; one stall kills the rest. This is the degenerate graph
nawab §18 already is. Keep it only for the slices that are actually serial
(migration before handler, contract test before implementation).

---

## Fan-out (one message, N Tasks)

N independent jobs: N files, N routes, N sources. Launch N `Task` calls in
**one message**. Cap around 2–4 concurrent writers; readonly explore can go
higher. Overflow queues — do not serialize independent work in the plan.

Failed/empty Task → null. Drop nulls. Do not abort the wave.

---

## Pipeline vs barrier

**Pipeline (default):** one subagent per item runs **all** of that item's
stages (extract → transform → local check) with no wait on siblings. Fast
items finish while slow ones are still in stage 1.

**Barrier:** lead waits for every item before the next stage. Use only when
the next node needs the **whole** set: cross-set dedupe, rank-all, early
exit on the total, compare one finding against all others.

Smell: fan-out → transform with no cross-item dependency → fan-out again.
That middle wait is waste. Fold the transform into each item's pipeline.

---

## Diamond (workhorse)

Split → many workers in parallel → one merge.

Canonical: fan-out (breadth) → **plumbing reduce** (flatten/dedupe in the
lead) → synthesize (one agent). Same skeleton for a market scan, route
audit, code review, research report. Swap sources and prompts.

The merge is the one place a barrier earns its wall-clock cost.

---

## Conditional

A router node returns validated JSON (`severity: low | high`). Code picks
the edge (`if` / `switch`). Judgment at the node, reliability at the edge —
no emergent "skip the audit today".

Example: small diff → one quick review Task. Large diff → parallel lens
audit, then a judge merge.

---

## Verifiers on the edge

Wrap confidence around findings **before** they reach the answer.

- **Adversarial:** for each finding, spawn N skeptics prompted to refute it.
  Keep only if a majority survive.
- **Lens-diverse:** correctness / security / does-it-repro — not N identical
  checks.
- **Judge panel:** N attempts, parallel scores, synthesize from the winner
  and graft the best pieces of runners-up.

Verifiers are readonly `Task`s. They do not write product files.

---

## Cycle (unknown size)

Discovery, bug sweeps, anything that grows as you look. Loop finders until
**K consecutive dry rounds** (default K = 2).

**Dedupe against `seen`, not only confirmed.** Otherwise rejected findings
return every round and the loop never dries.

```text
seen = {}
confirmed = []
dry = 0
while dry < 2:
  found = fan-out finders → filter nulls
  fresh = found not in seen
  if no fresh: dry += 1; continue
  dry = 0
  add fresh to seen          # before verify
  judged = verify(fresh)     # diverse lenses
  confirmed += survivors
```

Persist `seen` in `EXECUTION_GRAPH.md` or a sidecar JSON so a later wave
does not rediscover dead ends.

---

## Model tiering

Not every node needs the session model.

- Extract, classify, "is this URL a hit?" → `composer-2.5-fast`
- Merge, adjudicate, write the report → `inherit`

Override per `Task`. Do not bill the whole fan-out at the merge tier.

---

## Isolation

Default: nawab file-ownership. One writer per path per commit window.
`packages/shared/*` stays with the lead unless the plan assigns it.

Cloud / worktree `Task`s: only when the user explicitly asked for cloud
subagents **and** nodes write in parallel. Not a default tax.

---

## Shape cheat sheet

| Shape | When | Cost |
|-------|------|------|
| Chain | Next step reads last output | Slowest; one stall kills all |
| Fan-out | N independent jobs; next stage needs them all | Wait for the slowest |
| Pipeline | N items, same stages, no cross-item need | Default — almost nothing extra |
| Diamond | Breadth then one merged answer | One barrier, at the merge |
| Conditional | Path depends on a node's validated output | One classify call before the branch |
| Cycle | You do not know how big the job is | Runaway spend if `seen` is wrong |
