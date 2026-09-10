---
name: graph-engineering
description: >
  Builds a graph-of-plans for end-to-end one-shots: research then questions
  (must ask; do not guess), then a master graph covering docs-in, architecture,
  design/UI UX, build, integrate, evaluate, actually run, multiple trials, and
  docs-out. Each node has a linked sub-plan; approving the graph runs it.
  Use for entire products or major features when the user invokes
  /graph-engineering or says "graph this plan", "one-shot this project",
  or "run this as a graph". Do not load unless the user named it. Not
  graphify. Not for 1–3 step real chains.
disable-model-invocation: true
trigger: /graph-engineering
argument-hint: "[plan path or leave blank to use the current nawab plan]"
license: MIT
---

# Graph Engineering

The **graph is the plan you look at**. Nawab §0–§18 still captures scope
(north star, blockers, commit discipline). This skill owns **shape and
scale**: what can run at once, which slice owns which files, and the
per-node plans that execute those slices.

Each **node** is a bounded workstream with **its own plan file**. The master
graph **must list a markdown link to every node plan** so you can open any
slice without hunting.

**Not graphify.** `graphify` maps a codebase. This skill shapes *execution*.

Template: [GRAPH.template.md](GRAPH.template.md)  
Node plan: [NODE.template.md](NODE.template.md)  
Lifecycle: [LIFECYCLE.md](LIFECYCLE.md)  
Topologies: [TOPOLOGIES.md](TOPOLOGIES.md)

## Persistence

Once loaded, stay on the graph for the **whole run** — every wave, including
resume after a dead session. Do not drift back to one sequential agent holding
the entire project. Ponytail on every code write.

Off only: "stop graph" / "run it linearly" / user reverts to §18.

---

## When to load

Load **only** when the user named this skill. Signals:

- `/graph-engineering` or `@graph-engineering`
- "graph this plan" / "graph engineering" / "run this as a graph"
- "one-shot this project" / "one-shot this feature"

**Do not load** because Plan mode is on or nawab-plans loaded.

**Skip the fleet** (one-node or short chain in §19) when the work is a real
1–3 step dependency. Do not invent nodes or nested plans for a hotfix.

This skill is for **entire products and major features** — research through
shipped software, proven by running it, then docs. Long, quality-rich,
parallel work.

---

## Hierarchy (depth 2, no more)

```text
EXECUTION_GRAPH.md          ← what you approve and read
  plans/nodes/<id>.md     ← one collapsed plan per node (linked from the graph)
```

1. **Graph** — topology, contracts, waves, **links to every node plan**.
2. **Node plan** — feature-mode nawab, collapsed: objective, paths, commits,
   gate, return contract. Not a second 18-section master.
3. **Stop.** A node plan does **not** spawn another graph unless the user
   names this skill again for that slice.

---

## Cursor primitives (not Claude Code)

Do not emit JS orchestration scripts or `.claude/workflows/`.

| Idea | Cursor |
|------|--------|
| Node | One `Task` (or lead job) that **executes that node's plan** against a JSON return contract |
| Node plan | `plans/nodes/<id>.md` — the only authority that node agent loads |
| Edge | Named artifact that actually crosses (schema field, file, list) |
| Fake "and then" | No Task, no wait — two node plans, same wave |
| Fan-out | Multiple `Task`s in **one message**, each prompted with **its** node-plan path |
| Plumbing | Lead code (`flatMap`, dedupe) — no extra node, no extra plan |
| Barrier / merge | Lead waits; one merge node whose plan sees the whole set |
| Verifier | Readonly `Task`s that try to kill findings before they flow on |
| Isolation | Disjoint write paths. Cloud worktrees only if the user asked |
| Cycle | `seen` set; dry stop after **2** empty rounds; dedupe vs **seen** |
| Model | `composer-2.5-fast` on extract/classify; `inherit` on merge/judge |
| Concurrency | Readonly: fan out freely. Writers: **2–4**, disjoint paths |

If a `model` slug is not in the session list, use `inherit`. Never guess.

---

## Gate 0 — Research, then questions (blocking)

**Before** nawab §19, node plans, or approval. Asking is expected. Do not
smooth over uncertainty.

1. Research the repo or state greenfield. 5–10 lines of what you found.
2. Ask numbered questions. Split **must-answer** (blocks compile),
   **trade-off** (neither option is obviously better — show both, ask
   PRIORITY), and **optional** (state the default).
3. **Stop. Wait.** Do not compile the graph on guessed architecture, UX,
   tenancy, or "we will figure it out in the node."

Full rules and the trade-off block: [LIFECYCLE.md](LIFECYCLE.md).

---

## End-to-end coverage

A full one-shot graph **includes every lifecycle stage** or marks
`N/A — [reason]`. Catalog: [LIFECYCLE.md](LIFECYCLE.md).

| Stage | Must mean |
|-------|----------|
| Docs-in | Existing docs good enough to plan, or listed gaps |
| Architecture | Boundaries + remaining trade-offs decided with the user |
| Design / UI UX | Required if there is a user-facing surface |
| Build | Fan-out slices with real edges only |
| Integrate | Barrier over the slices |
| Evaluate | Tests / evals that can fail |
| Run | **Boot it** — not only unit tests |
| Trials | **More than one** run (happy, empty, error, one regression) |
| Docs-out | README (and companions) **after** it works — `readme` skill |

A graph that ends at "code written" is incomplete.

---

### A. Drafting (skill named, not yet approved)

1. **Gate 0** — research, then questions. Wait for answers.
2. Draft nawab §0–§18 for **scope**.
3. Compile the **graph of plans** (checklist). Cover the lifecycle. Write
   every node plan **before** approval so the links work.
4. Put the graph in **§19** and on disk as `EXECUTION_GRAPH.md`.
5. Approval footer: *Approving this graph starts execution immediately. Node plans are linked. Lifecycle stages are listed (or N/A).*
6. Stop. Wait only for **that** approval.

### B. On approval, or skill named on an already-approved plan

1. If the graph or any node plan is missing, compile first.
2. **Run immediately.** Each node Task gets: repo path, node-plan path,
   input artifact, output schema, write paths, **Do NOT commit**.
3. Follow [Execute protocol](#execute-protocol).

---

## Compile checklist

Gate 0 must already be done. Read [LIFECYCLE.md](LIFECYCLE.md). Read
[TOPOLOGIES.md](TOPOLOGIES.md) if the shape is not a simple diamond.

1. Start from the lifecycle catalog. Add/split nodes from nawab §5–§9.
   Mark unused stages `N/A — [reason]` on the graph.
2. Cut fake edges: if B does not **read** A's output, they are the same wave.
3. Contract every node (in schema, out schema). Pass inputs explicitly.
4. Mark remaining edges `plumbing` | `agent` | `verify`.
5. Pick topology; emit **waves**. Barrier only when a stage needs the **whole** set.
6. Write `plans/nodes/<id>.md` per node from [NODE.template.md](NODE.template.md).
   Map commits onto the parent §9 matrix; writers must not overlap.
7. Fill [GRAPH.template.md](GRAPH.template.md). **Node plans** table is
   required — every row is a working markdown link. Include **Lifecycle**.
8. Tiny real chains stay a chain. Do not pad.

Save agents for judgment. Not for plumbing.

## Output contract

Show in chat, not only in files:

1. The mermaid graph
2. The **Node plans** table with clickable links
3. Lifecycle table (every stage present or N/A)
4. Wave table (counts, where the barrier is)
5. **Edges cut, and why**
6. Model tiers: which nodes run cheap

During a wave: name wave, node ids, model; after: survivors vs dropped.

---

## Execute protocol

If §19 is filled, §18 defers to these waves.

1. Refresh `EXECUTION_GRAPH.md` from §19 (must still contain the node-plan links).
2. Ponytail on every code write.
3. Per wave: spawn independent `Task`s in **one message**. Each prompt
   includes **only** that node's plan path plus its input artifact — not the
   whole master nawab. Null/empty → drop; fan-in tolerates missing inputs.
4. Lead runs `plumbing`. Spawn merge/verify only when judgment is required.
5. Barrier only when the next node needs every prior result together.
6. Conditionals: schema-bounded classify, then `if`/`switch` in the lead.
7. Cycles: persist `seen` (sidecar JSON or in the graph). Stop after 2 dry rounds.
8. **Checkpoints:** after each wave, update `EXECUTION_GRAPH.md` (wave status)
   and `PROGRESS.md`. A later session **resumes at the next pending wave** —
   do not restart the project in one context.
9. Lead owns git, gates, PROGRESS, PR. Subagents do not commit. One §9 row
   per commit. Human checkpoint only if the node plan marks it (prod / freeze).

---

## Pairing with nawab-plans

| | Default nawab | This skill named |
|--|----------------|------------------|
| What you read | Linear §0–§18 | **The graph** + linked node plans |
| §19 | `N/A` | Required: graph + **links to every node plan** |
| Approval | Then implement per §18 | Approve graph → **run** |
| Extra wait | — | **None** per node |

Never auto-chain from nawab-plans. Nawab §0–§18 stay the scope contract.
The graph is the execution program. Node plans are additive files.

---

## Anti-patterns

- Loading this skill because Plan mode is on
- Compiling the graph before Gate 0 answers (guessing architecture or UX)
- Skipping trade-off questions when two options are both valid
- Graph that ends at "code written" with no run / trials / docs-out
- Graph with no working links to node plans
- 18-section nawab **per node** (collapse; depth 2 only)
- Node plan that spawns another graph unasked
- Treating "and then" as an edge when no data crosses
- Spawning an agent to flatten or dedupe
- One Task prompt that pastes every node plan (kills the point of the graph)
- Restarting from wave 0 after a dead session instead of the checkpoint
- Parallel writers on the same files
- Confusing this skill with `graphify`
- Inventing a fleet for a 1–3 step real chain
- Guessing a `model` slug not in the session list
