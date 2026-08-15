# MCE — Meta Context Engineering

**Paper:** Ye et al., 2026. [arXiv:2601.21557](https://arxiv.org/abs/2601.21557)  
**Code:** [metaevo-ai/meta-context-engineering](https://github.com/metaevo-ai/meta-context-engineering)  
**Parent:** [../04-context-engineering.md](../04-context-engineering.md)

## What it optimizes

Bi-level: **skills** (how to manage context) and **context artifacts** (what is in context).

## Mechanism

Skill \(s\) defines \(c_s = (\rho_s, F_s)\):

- \(\rho_s\) — static: prompts, KBs, code libraries
- \(F_s\) — dynamic: search, select, filter, format

Inner: \(c_s^* = \arg\max J_{train}(c_s; s)\)  
Outer: \(s^* = \arg\max_{s \in \mathcal{S}} J_{val}(c_s^*)\)

History \(\mathcal{H}\) stores \((s_i, c_i, J_i^{train}, J_i^{val})\). Meta-agent does **agentic crossover** to propose \(s_k\). Base agent executes the skill and updates context files from rollout feedback.

Tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite. Context = directory of files (`skill.md` + rollouts).

## Evidence

5.6–53.8% relative improvement over SOTA agentic CE (mean 16.9%) across five domains; better transfer and context efficiency.

## Failure modes

- Two-level search is expensive.
- Free-form skills can hide un-auditable logic unless files stay small and versioned.

## Spec notes

- v1 can keep ACE’s curator and treat MCE as “evolve the curator skill later.”
- On OMP, a skill is already `.omp/skills/*/SKILL.md` — MCE maps cleanly if eval metrics are logged beside it.
