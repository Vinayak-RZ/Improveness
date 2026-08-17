# OMP proposed changes

Maintainer-facing list. **Describe files/APIs, not diffs.** This repo will not open a PR against `oh-my-pi`.

Aligned with D14: Improveness mutates **your** working snapshot after the gate. [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907) remains the stance for *upstream* OMP maintainers — this repo does not auto-PR `can1357/oh-my-pi`.

## P1 — Structured session export

**Propose:** A stable on-disk export per SDK/TUI session, e.g. `runs/<id>/` with one file per turn, tool I/O, and a `verifier.json` (or equivalent) field: pass/fail, timeout, missing artifact, exit code.

**Why:** Weakness mining needs mechanism-rich records, not only a TUI transcript ([self-harness.md](../methods/self-harness.md)).

**Not:** Replacing the TUI; dumping base64 blobs without a `clean` step (AHE drops those).

## P2 — Agent Debugger role

**Propose:** A bundled or documented role (can reuse `smol`) that reads `runs/<id>/` and writes `reports/<task>.md` plus `reports/overview.md`. Overview is the default evolver entry; raw traces remain.

**Why:** AHE experience pillar; token-efficient progressive disclosure.

**Not:** A second frontier model; stuffing raw traces into the advisor prompt.

## P3 — ACE playbook store

**Propose:** A project file (e.g. `.omp/playbook.jsonl` or `.omp/playbook/*.md`) of `(id, text, helpful, harmful)`. A **non-LLM** merge function applies curator deltas. Inject via context files or an extension hook. Optional: promote stable high-helpful bullets through existing `learn` → managed-skills.

**Why:** Collapse-resistant memory; complements `retain` rather than replacing it.

**Not:** Rewriting `SYSTEM.md` each session; making ACE the only evolved surface.

## P4 — Allowlisted evolver

**Propose:** An evolver session (SDK) whose write set is an explicit allowlist, e.g. project `.omp/skills`, `.omp/hooks`, playbook, memory bank — and **cannot** write: `modelRoles`, permission kernel, OMP package source, `runs/`, verifier config.

**Why:** AHE controllability; blocks reward hacking.

**Not:** Giving the evolver the same permissions as `build`.

## P5 — Held-in / held-out driver

**Propose:** A documented `createAgentSession` recipe: split tasks into \(D_{in}\) / \(D_{out}\); proposer sees only \(D_{in}\) traces; accept iff no regression on either split (and at least one improves, or the Self-Harness rule you adopt).

**Why:** Self-Harness generalization; Lin et al. say the evolver can be cheap.

**Not:** Tuning on the full public Terminal-Bench set the proposer already saw.

## P6 — Change-manifest schema

**Propose:** A versioned manifest (JSON/YAML) per candidate: evidence id, component, root cause, diff paths, predicted-fix task ids, at-risk task ids. Next export run attributes and **rolls back** failed predictions at file granularity.

**Why:** Decision observability ([ahe.md](../methods/ahe.md)).

**Not:** Commit messages as the only record.

## P7 — Maintainer review queue

**Propose:** `improvement_candidate` records distinct from user `report_issue` grievances: fingerprint, recurrence count, linked traces, suggested component, **not applied**. UI or file queue for humans.

**Why:** #7907 “distributed observation, centralized judgment.”

**Not:** Auto-writing into canonical built-in prompts/tools.

## Do not propose

- Forking or rewriting OMP’s Rust/TypeScript core
- Auto-editing canonical built-in prompts, hashline, LSP, or DAP
- Stacking extra “closure-check” middleware on top of TTSR + advisor (AHE non-additive interference)
- Unbounded evolutionary search (DGM/AlphaEvolve) that writes the kernel or skips the held-out gate (P2 search is bounded, stages only, and uses the frozen checker)
- Weight updates, teacher distillation, or SIA-style Feedback-Agent training
- Changing Windows-native / in-process tool implementations as a “self-improve” lever

## Suggested ownership

| Item | Likely owner |
|------|----------------|
| P1–P2, P5 | SDK / session persistence |
| P3, P6–P7 | Extensions + project `.omp/` conventions (can start outside core) |
| P4 | Permission + SDK session flags |
