# ADAS — Automated Design of Agentic Systems

**Paper:** Hu, Lu, and Clune, ICLR 2025.  
**Parent:** [../05-workflow-design.md](../05-workflow-design.md)

## What it optimizes

Agentic **workflow programs** in an archive, via a meta-agent that writes code.

## Mechanism

1. Initialize archive (CoT, self-refine, …).
2. Meta-agent writes a high-level description, then implements it in code.
3. Two Self-Refine novelty checks (Madaan et al. 2023).
4. Evaluate; add successes; repeat to a max iteration.

## Evidence

Showed that agent design can be an optimization problem. Later **AFlow** reported better QA/code/math numbers than ADAS and manual workflows.

## Failure modes

- Novelty checks are still the same model talking to itself.
- Archive can fill with near-duplicates without a diversity rule.

## Spec notes

- v1 does not run ADAS.
- Do adopt: workflows as code in an archive; evaluate before keep.
