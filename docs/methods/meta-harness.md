# Meta-Harness

**Paper:** Lee et al., 2026. [arXiv:2603.28052](https://arxiv.org/abs/2603.28052)  
**Parent:** [../04-context-engineering.md](../04-context-engineering.md)

## What it optimizes

The **code that decides** what information is stored, retrieved, and presented — a harness for optimizing harnesses.

## Mechanism

- Proposer is a coding agent.
- Execution history is on the filesystem (`grep`/`cat`), not one prompt.
- Each candidate is a directory: source, scores, trajectories, state updates.
- Loop creates new harnesses; only qualified ones stay.
- Output: Pareto frontier of harnesses (quality vs cost/other axes).
- TerminalBench-2 search initialized from Terminus-KIRA and Terminus-2 (strong seeds).

## Evidence

Gains on text classification (few iterations) and TerminalBench-2 from strong initial harnesses. Lesson: executable search space + coding agent ≈ human harness engineering.

## Failure modes

- Search cost; initialization from a strong seed confounds “from scratch” claims.
- Without a read-only kernel, the proposer can hack the scorer.

## Spec notes

- v1 does not run Meta-Harness search.
- Do adopt: candidates as directories; history on disk; keep more than one survivor (Pareto), not a single blob.
