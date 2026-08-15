# Decisions

## D1 — Plan format is nawab §0–§18

- **Context:** The coding-config repo requires `nawab-plans` in Plan mode.
- **Alternatives:** Thin Cursor plan; Spec Kit `.specify/` first.
- **Selected:** Nawab master plan; Spec Kit collapsed (no runtime feature).
- **Rationale:** Compulsory skill; this pass is docs/proposals, not a software feature with contracts.

## D2 — Delivery is proposals only

- **Context:** User forbade OMP code changes and asked for generic + OMP change proposals.
- **Alternatives:** Implement an overlay; fork OMP.
- **Selected:** Specs only in this repo.
- **Rationale:** Matches user scope and [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907) (candidates are evidence, not auto-applied authority).

## D3 — OMP is the concrete example

- **Context:** Need one real harness to instantiate the generic spec.
- **Alternatives:** OpenCode; Codex; Claude Code.
- **Selected:** OMP (Oh My Pi); OpenCode stays as comparison.
- **Rationale:** SDK, file-level AHE surfaces, memory/`learn`/TTSR already exist. AHE already scored OpenCode as a weaker baseline.

## D4 — Vendor the full coding-config repo

- **Context:** User asked to copy `cursor-config-coding` into this workspace.
- **Alternatives:** Read skills from GitHub only; replace this git root.
- **Selected:** Clone into `vendor/cursor-config-coding/` and copy `.cursor/skills` + `.cursor/rules` into the project.
- **Rationale:** Later agents load `nawab-plans` locally without replacing Improveness.

## D5 — Optimizer target is AHE surfaces, adoption starts at ACE

- **Context:** Prompt-only ACE can regress on a strong seed (AHE: −2.3 pp for system prompt alone).
- **Alternatives:** ACE-only; full DGM/AlphaEvolve in v1.
- **Selected:** Specify all seven AHE components; cheapest-first adoption ACE → traces → Self-Harness gate → manifests.
- **Rationale:** Published coding-agent gains live in tools, middleware, and memory.

## D6 — Evolver model can be mid/small

- **Context:** Model budget allocation.
- **Alternatives:** Frontier evolver; same model as task agent.
- **Selected:** Spend capability on the task agent; evolver may be cheaper.
- **Rationale:** Lin et al. 2026 — harness-updating is flat across Qwen3.5-9B → Opus 4.6.

## D7 — Auto-apply is forbidden

- **Context:** Reward hacking if the loop can edit the evaluator or built-ins.
- **Alternatives:** Closed auto-merge; maintainer review queue.
- **Selected:** Held-out gate plus human promote; no writes to canonical OMP built-ins.
- **Rationale:** Weng reward-hacking bottleneck; OMP maintainer stance.
