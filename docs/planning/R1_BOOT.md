# R1 boot — TargetPort

Date: 2026-09-15

## Command

```text
bun harness/omp/drivers/improve-target.ts --help
bun harness/omp/drivers/improve-target.ts --target arc
```

## Result

`--help` printed usage (kinds: domain-kernel | agentic-harness | agentic-system). Exit 0.

`--target arc` printed JSON: `kind=domain-kernel`, held-in 0→3, held-out 0→3, `decision=accept`, staged `harness/omp/targets/arc/staging/PLAYBOOK.md`. Frozen-physics probe threw as required. Exit 0.

No UI. Closest substitute to a browser: this CLI.
