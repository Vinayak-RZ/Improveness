# Node / Bun protocol

DeepSeek Harness plugins load under **Node**. The Improveness loop and checker run under **Bun**. They do not share an isolate.

## Decision (D15)

Default: **JSONL subprocess**. The Node plugin spawns a packaged Bun runner.

```text
Node apply (dsh-improveness)
  └─ spawn bun runtime/runner → dsh-core-runner.ts
       stdin  {"id", "method", "params"}
       stdout {"id", "ok", "result" | "error"}
```

## Methods

`ping` · `decideAccept` · `scorePlaybook` · `applyDurable` · `exportTrace` · `frozenIds` · `slots`

## Why not a shared package yet

ponytail: keep the loop in `harness/omp/` and talk JSONL until the P1 OMP adapter needs the same import from two hosts. Ceiling: hop latency and a second process. Upgrade: `packages/improveness-core` imported by Node and Bun.

No sibling-checkout `import` from a developer’s other clone.
