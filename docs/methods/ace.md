# ACE — Agentic Context Engineering

**Paper:** Zhang et al., ICLR 2026. [arXiv:2510.04618](https://arxiv.org/abs/2510.04618)  
**Code:** [ace-agent/ace](https://github.com/ace-agent/ace)  
**Parent:** [../04-context-engineering.md](../04-context-engineering.md)

## What it optimizes

The **context playbook**, not weights. Offline (system prompt) and online (test-time memory).

## Mechanism

- **Generator** — runs the task; surfaces strategies and pitfalls.
- **Reflector** — critiques traces; extracts lessons (optionally multi-iteration).
- **Curator** — emits typed delta items (add/update/remove) with helpful/harmful counters.
- **Merge** — deterministic, non-LLM; grow-and-refine with periodic dedup (often embedding cosine).

Bullets are `(id, description)` (plus counters). The curator must **not** rewrite the full prompt.

## Why it exists

Prior adaptive-memory methods suffer **brevity bias** (summaries drop domain detail) and **context collapse** (iterative LLM rewrites erase knowledge).

## Evidence

+10.6% on agent benchmarks, +8.6% on finance vs strong baselines; lower adaptation latency. Can use execution feedback without labels. AppWorld: matched a top production agent on average with a smaller open model.

## Failure modes

- Handcrafted roles and merge rules — not a full self-improving harness.
- On a strong coding seed, AHE found ACE-alone **regressed** (68.9% vs 69.7% NexAU0) because playbooks do not edit tools/middleware/memory.

## Spec notes

- Store playbook as files, not a single system-prompt string.
- Inject via context hook; never blob-rewrite `SYSTEM.md`.
- Pair with AHE surfaces in v1; do not ship ACE as the only loop.
