# 7. Evolutionary search

## Weng’s claim

Evolutionary search fits when (1) the space is large or awkwardly shaped and (2) gradients are hard but **evaluation is easy**. Harness search looks like that — when fitness is automatic and objective.

### Prompt-level

- **Promptbreeder** (Fernando et al. 2023) — mutate task prompts; mutation prompts themselves evolve.
- **GEPA** (Agrawal et al. 2025) — reflection over trial-and-error trajectories plus evolutionary search; natural-language reflection proposes prompt updates.

### Program-level

- **AlphaEvolve** (Novikov et al. 2025) — pool of candidate programs; frozen LLMs generate diffs. Prompt includes parents, results, instructions, sometimes meta. Improve regions marked `# EVOLVE-BLOCK-START/END`. Meta-prompt co-evolves. Ablations: evolution procedure, prompt context, meta-prompts, full-file evolution, stronger LLMs all matter.
- **ThetaEvolve** — evolution + RL + in-context learning.
- **DemoEvolve** — add human expert demonstrations to the archive for harness-level diagnosis.
- **ShinkaEvolve** — parent sampling balances rank vs offspring count; embedding novelty rejection; meta-scratchpad of good patterns.

### Harness-repo evolution

- **Darwin Gödel Machine (DGM)** (Zhang et al. 2025) — evolve an editable harness-code repository. Sample parent by performance and inverse child-count. Parent reads its eval log, proposes harness edits (bash + editor). Keep high performers. Claude 3.5 Sonnet: SWE-bench Verified 20%→50%, Polyglot 14.2%→30.7%. Code: [jennyzzt/dgm](https://github.com/jennyzzt/dgm).
- **Hyperagents** (Zhang et al. 2026) — a meta-agent controls how to modify existing task agents.

Works well for matrix multiply, GPU kernels, contests, scheduling. Struggles when evaluation is slow, ambiguous, or heuristic. Compute cost and **diversity collapse** are first-class concerns.

## What works / fails

- **Works:** marked evolve-blocks; archive of diverse parents; novelty rejection; empirical (not proof-based) Gödel-style loops.
- **Fails:** fuzzy scientific taste as fitness; population collapse into near-duplicates; evolving the whole OS without a read-only kernel.

## Generic harness implication

v1 does **not** adopt DGM/AlphaEvolve. Specify them as Phase 5 optional **after** traces, a gate, and a cheap objective fitness exist. See [proposals/05-adoption-order.md](proposals/05-adoption-order.md).

## OMP implication

Do not propose evolving OMP’s Rust/TypeScript core. If an archive appears later, snapshot **project** `.omp/` trees only, scored by a harness-external verifier.
