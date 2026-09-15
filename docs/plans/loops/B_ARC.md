# Loop plan — `B_ARC` — fixtures

> Parent: [LOOP_GRAPH.md](../LOOP_GRAPH.md)

| Field | Value |
|-------|-------|
| **Node id** | `B_ARC` |
| **Job** | ARC domain-kernel fixture and generic agentic-system fixture. |
| **Wave** | 2 |
| **Depends on (data)** | previous wave artifacts |
| **Write paths** | `harness/omp/targets/**` |
| **Read paths** | `docs/plans/p5-target-port.md`, `docs/planning/GATE_0.md` |
| **Maker type** | lead |
| **Maker model** | inherit |
| **Checker type** | lead Stop command (no nested Task in this worker) |
| **Checker model** | inherit |
| **Max rounds** | 3 |
| **State** | [`B_ARC.state.json`](B_ARC.state.json) |
| **Isolation** | path-ownership |
| **Companion skills** | ponytail |

---

## Stop (required)

```text
test -f harness/omp/targets/arc/manifest.json && test -f harness/omp/targets/generic-agentic/manifest.json
```

Exit 0 = pass.

---

## Objective

ARC domain-kernel fixture and generic agentic-system fixture.

## Non-goals

- Extra features not in PRODUCT P0
- Nested graph spawn

---

## Contract

**Input:**

```json
{ "node_id": "B_ARC", "findings": [] }
```

**Maker output:**

```json
{ "files_touched": [], "notes": "" }
```

**Checker output:**

```json
{ "pass": false, "command": "test -f harness/omp/targets/arc/manifest.json && test -f harness/omp/targets/generic-agentic/manifest.json", "exit_code": 1, "findings": [] }
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

Maker: files. Checker: pass/exit. Lead updates `B_ARC.state.json`.
