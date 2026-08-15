# Darwin Gödel Machine (DGM)

**Paper:** Zhang et al., 2025. [arXiv:2505.22954](https://arxiv.org/abs/2505.22954)  
**Code:** [jennyzzt/dgm](https://github.com/jennyzzt/dgm)  
**Parent:** [../07-evolutionary-search.md](../07-evolutionary-search.md)

## What it optimizes

The coding agent’s **own harness repository**, empirically (not via Gödel proofs). Follow-up: Hyperagents (2026) add a meta-agent that controls how task agents are modified.

## Mechanism

1. Start with one coding agent in a pool.
2. Sample a parent with probability ↑ performance, ↓ number of children.
3. Parent reads its benchmark log; proposes harness edits (bash + editor).
4. Evaluate the child; add if performance is high enough.
5. Repeat until a stop criterion.

Open-ended archive = tree of diverse agents (stepping stones), not a single lineage.

## Evidence

Claude 3.5 Sonnet, simple initial harness: SWE-bench Verified 20%→50%, Polyglot 14.2%→30.7%. Beats no-self-improve and no-open-ended-archive controls. Experiments used sandboxing and human oversight.

## Failure modes

- Slow/fuzzy eval domains.
- Diversity collapse without inverse-child sampling / archive.
- Unsandboxed self-modification.

## Spec notes

- **Out of v1.** Optional Phase 5 archive of **project harness snapshots**, not OMP core.
- Keep DGM’s parent-sampling idea if an archive is added later.
