# Loop plan — `B_PORT` — TargetPort

> Parent: [LOOP_GRAPH.md](../LOOP_GRAPH.md)

| Field | Value |
|-------|-------|
| **Node id** | `B_PORT` |
| **Job** | Implement TargetPort types, manifest loader, improve driver, target write fence. |
| **Wave** | 2 |
| **Depends on (data)** | previous wave artifacts |
| **Write paths** | `harness/omp/target-port/**, harness/omp/drivers/improve-target.ts, harness/omp/drivers/self-harness.ts, harness/omp/drivers/allowlist.ts` |
| **Read paths** | `docs/plans/p5-target-port.md`, `docs/planning/GATE_0.md` |
| **Maker type** | lead |
| **Maker model** | inherit |
| **Checker type** | lead Stop command (no nested Task in this worker) |
| **Checker model** | inherit |
| **Max rounds** | 3 |
| **State** | [`B_PORT.state.json`](B_PORT.state.json) |
| **Isolation** | path-ownership |
| **Companion skills** | ponytail |

---

## Stop (required)

```text
test -f harness/omp/target-port/types.ts && test -f harness/omp/target-port/manifest.ts && test -f harness/omp/drivers/improve-target.ts
```

Exit 0 = pass.

---

## Objective

Implement TargetPort types, manifest loader, improve driver, target write fence.

## Non-goals

- Extra features not in PRODUCT P0
- Nested graph spawn

---

## Contract

**Input:**

```json
{ "node_id": "B_PORT", "findings": [] }
```

**Maker output:**

```json
{ "files_touched": [], "notes": "" }
```

**Checker output:**

```json
{ "pass": false, "command": "test -f harness/omp/target-port/types.ts && test -f harness/omp/target-port/manifest.ts && test -f harness/omp/drivers/improve-target.ts", "exit_code": 1, "findings": [] }
```



---

## Escalate

After 3 failures, stop dependents.

---

## Commits (this node only)

| # | Commit | Contents | Gate |
|---|--------|----------|------|
| | `feat(target-port): gate improve for any agentic target` | this node | Stop command |

---

## Do not

- Commit from a nested Task
- Write outside write paths
- Use Cursor `/loop` timers

---

## Return to graph

Maker: files. Checker: pass/exit. Lead updates `B_PORT.state.json`.
