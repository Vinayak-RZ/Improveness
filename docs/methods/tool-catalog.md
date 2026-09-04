# Tool catalog and event inject

Hierarchical discovery for Improveness tools on the DeepSeek Harness path ([D16](../../DECISIONS.md)).

## Hierarchy

```text
namespace (improveness)
  └─ group (inspect | jit | improve | events)
       └─ tool (improveness.synthesize, …)
```

- `improveness.catalog` / `improveness.inspect` → expand one level at a time (root → namespace → group → tools).
- Section flags filter which leaves appear ([sections.md](sections.md)).

Flat Cordis `ctx.tools.register` remains the execution surface; the catalog is **discovery**.

## Event-driven inject

Inspired by Oh My Pi TTSR (reminder inject when a rule matches) — **not** a port of the OMP runtime.

| Event | Effect |
|-------|--------|
| `need_tool` | Inject `<improveness-tool-reminder>` once per tool id; optional capability-slot hint mount if JIT is on |
| `tool_fail` | Same reminder path |
| `plan_step` | Resolve tool id from catalog name when possible |

Disable with `IMPROVENESS_EVENT_INJECT=0`. Dedup is once-per-session (P0); after-gap repeat is P1.

## Code

| File | Role |
|------|------|
| [`plugins/dsh-improveness/src/catalog.js`](../../plugins/dsh-improveness/src/catalog.js) | Tree + expand/find |
| [`plugins/dsh-improveness/src/events.js`](../../plugins/dsh-improveness/src/events.js) | SessionEventBus |
| [`plugins/dsh-improveness/src/apply.js`](../../plugins/dsh-improveness/src/apply.js) | Wires inspect/catalog/emit |
