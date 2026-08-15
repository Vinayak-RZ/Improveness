# Subagent orchestration — nawab plans

Reference for **§6 Agent orchestration** in nawab plans. The lead agent writes
this section into the plan; this file defines the patterns.

---

## Roles

| Role | Owns |
|------|------|
| **Lead agent** | Plan execution, git commits, branch, PR, todos, gate runs, integrating subagent output, PROGRESS/DECISIONS |
| **Subagent** | Bounded task: research, parallel implementation slice, review — returns artifacts, not unilateral merges |

Subagents do **not** replace the commit matrix. They feed the lead agent unless
the plan explicitly delegates a workstream branch with merge-back at a named gate.

---

## When to spawn

| Spawn | Do not spawn |
|-------|----------------|
| Broad codebase exploration (unfamiliar area) | Single known file edit |
| Parallel workstreams with no file overlap | Sequential commits on same files |
| Specialized review (security, bugbot) | Work the lead can finish in one turn |
| Long research across many directories | After plan already maps exact paths |

**Parallel limit:** state in plan (default 2–4 concurrent). Beyond that, queue.

---

## subagent_type selection

| Task | Type | readonly | Notes |
|------|------|----------|-------|
| Map codebase, find patterns | `explore` | `true` | Set thoroughness: quick / medium / very thorough |
| Implement scoped WS slice | `generalPurpose` | `false` | Prompt must list allowed write paths |
| PR / diff review | `bugbot` | `true` | User asks or validation phase |
| Security review | `security-review` | `true` | Auth, secrets, boundaries |
| Cursor product docs | `cursor-guide` | `true` | Rare in execution plans |

Launch multiple subagents in **one message** when tasks are independent.

---

## Prompt contract (required in spawn map)

Every subagent invocation in the plan must specify:

```markdown
### Spawn: [ID] — [short name]
- **Type:** explore | generalPurpose | …
- **readonly:** true | false
- **Trigger:** [phase / commit row / gate]
- **Paths (read):** [globs]
- **Paths (write):** [globs] or none
- **Prompt:**
  Full Repository Path: [absolute]
  Workstream: [WS-ID]
  Task: [specific deliverable]
  Authority docs: [read-only links from §3]
  Return format: [bulleted findings | file list | patch summary]
  Do NOT: [commit, change files outside write paths, expand scope]
- **Sync point:** lead integrates at [commit # / phase gate]
- **Gate before merge:** [test command]
```

---

## Handoff — what subagent returns

| Task type | Expected return |
|-----------|-----------------|
| explore | File paths, flow summary, risks — no code changes |
| generalPurpose | Summary of changes, files touched, tests run, failures |
| bugbot / security-review | Ranked findings with paths — no fixes unless asked |

Lead agent:

1. Verifies return against spawn contract
2. Runs gate command
3. Commits under lead identity — **one matrix row per commit**; split subagent
   deliverables across multiple rows if needed
4. Marks todo complete

---

## Sync points

Define in §6 when parallel work merges:

| Pattern | Sync at | Example |
|---------|---------|---------|
| Research → implement | Phase gate before first feat commit | explore WS-B UI routes before scaffold |
| Parallel implement | Named commit row | WS-A commit 11 done → spawn WS-B console |
| Review → fix | Hardening sub-phase | security-review → fix commits → re-review |

**Never** merge subagent output without running the row's gate.

---

## File ownership rules

During overlapping phases:

1. One writer per file per commit window
2. If WS-A and WS-B touch same package, **sequence** commits — do not parallelize
3. `packages/shared/*` owned by lead agent only unless plan assigns

---

## Todo conventions for subagents

```yaml
- id: subagent-explore-ws-b
  content: "Spawn explore: map console routes and data dependencies"
  status: in_progress
```

Lead marks complete after integration. Subagents do not use TodoWrite unless
plan delegates a long-running WS branch.

---

## Example spawn table (project mode)

| ID | Phase | Type | Task | Sync |
|----|-------|------|------|------|
| S1 | 0 | explore | Map `external/handoff/*` vs repo | Before §9 commit 1 |
| S2 | B | generalPurpose | Scaffold `packages/console` shell | Commit 16 |
| S3 | N | security-review | Full branch diff | Before cutover |
| S4 | N | explore | Repo walkthrough for untested paths | Hardening commits |

---

## Anti-patterns

- Subagent commits directly to main without lead gate
- Lead squashes multiple matrix rows into one commit
- Spawn without path boundaries
- Parallel generalPurpose agents on same package
- Ignoring readonly flag for "quick fix" inside explore agent
- No sync point — orphaned work never integrated
