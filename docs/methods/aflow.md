# AFlow

**Paper:** Zhang et al., ICLR 2025.  
**Parent:** [../05-workflow-design.md](../05-workflow-design.md)

## What it optimizes

A workflow **graph**: nodes are LLM-invoking actions; edges are logical operations in code.

## Mechanism (MCTS)

1. Start from template \(W_0\).
2. Select a node with a soft mix of score and uniform exploration.
3. LLM expands a modified workflow conditioned on eval performance.
4. Execute and evaluate.
5. Keep if improved within \(N\) rounds.
6. Stop when top-\(k\) average plateaus or budget hits.

## Evidence

Improved over manual workflows and ADAS on QA, code, and math.

## Failure modes

- Needs a cheap, objective score per candidate.
- Graph search is expensive if each eval is a long coding rollout.

## Spec notes

- Optional after a coding harness has a cheap fitness (unit tests, Terminal-Bench-style tasks).
- Not part of OMP v1 proposals.
