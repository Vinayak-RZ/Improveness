# 4. Context engineering

## Weng’s claim

Appending every tool response and generation into context does not scale with horizon. Context management must build a **structured, concise** context and keep persistent state elsewhere. Long-context research continues, but today long-context intelligence and context engineering intertwine.

Three stacked methods, cheapest first:

### ACE — Agentic Context Engineering (Zhang et al., ICLR 2026)

Treat context as an evolving **playbook** of itemized bullets `(identifier, description)`, not a lengthening prompt blob.

1. **Generator** produces task trajectories, referring to bullets.
2. **Reflector** distills insights from successes and failures.
3. **Curator** emits incremental itemized deltas. Merge is **deterministic** (non-LLM). Periodic refine/dedup.

This avoids *brevity bias* (rewrites drop detail) and *context collapse* (iterative rewrites erase knowledge). ACE can adapt from execution feedback without labels. Reported: +10.6% on agents, +8.6% on finance vs strong baselines. Code: [ace-agent/ace](https://github.com/ace-agent/ace).

ACE still has **handcrafted** update rules and workflow. That is the next jump.

### MCE — Meta Context Engineering (Ye et al. 2026)

Separates **mechanism** (how to manage context) from **artifact** (what is in context).

- A skill \(s\) defines a context function \(c_s = (\rho_s, F_s)\): static prompts/KBs/libs plus dynamic operators (search, filter, format).
- **Inner loop:** best context given skill on train data.
- **Outer loop:** best skill on validation, via agentic crossover over a skill history \(\mathcal{H}\).
- Implementation: context as files in a directory (`skill.md` + rollouts). Tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite.

Mean +16.9% relative over agentic CE methods across five domains. Code: [metaevo-ai/meta-context-engineering](https://github.com/metaevo-ai/meta-context-engineering).

### Meta-Harness (Lee et al. 2026)

The optimized object is the **code that decides** what to store, retrieve, and present. The proposer is itself a coding agent. History lives on the filesystem (`grep`/`cat`, not one mega-prompt). Candidates are directories (source, scores, trajectories). Keep a Pareto frontier. TerminalBench-2 search initialized from Terminus-KIRA and Terminus-2.

Lesson: once harness design is an executable search space, a strong coding agent can use the same design space human engineers use.

## What works / fails

- **Works:** itemized deltas + deterministic merge (ACE); files as the context function (MCE); code-as-harness search (Meta-Harness).
- **Fails:** full-prompt rewrite each iteration; ACE-alone on a strong coding seed can **regress** (AHE: ACE 68.9% vs NexAU0 69.7% on Terminal-Bench 2) because playbooks miss tools/middleware/memory.

## Generic harness implication

v1 should specify an ACE playbook (delta curator) **and** leave room to evolve skills/hooks/tools. Do not stop at prompt bullets. Details: [methods/ace.md](methods/ace.md), [methods/mce.md](methods/mce.md), [methods/meta-harness.md](methods/meta-harness.md).

## OMP implication

Inject a playbook via context files or a hook. Do **not** rewrite `SYSTEM.md` as a blob. Optionally promote stable bullets through existing `learn` → managed-skills. TTSR already injects rules mid-stream — complementary, not a substitute for a curated playbook.
