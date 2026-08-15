# Learning log

### In-tree OMP base — 2026-08-15

- **Concept:** Stripping nested `.git` makes a third-party tree a normal directory in *this* repo’s history (no submodule, no accidental pushes to upstream).
- **Pattern:** Clone `--depth 1`, `rm -rf .git`, commit under `oh-my-pi/`.
- **Trade-off:** ~123MB in-tree vs submodule. Chosen because the user asked to own the tree as the upgrade base.

## Session / phase entries

## Session / phase entries

### Phase A commit 1 — Vendor config — 2026-08-15

- **Concept:** A Cursor *skill* is an on-demand workflow (`SKILL.md`); a *rule* is always-on invariant (`.mdc`).
- **Pattern:** Vendor the full config repo, then install project `.cursor/skills` and `.cursor/rules` so cloud agents load `nawab-plans` without replacing the git root.
- **Trade-off:** Duplicating skills under `.cursor/` and `vendor/` costs ~1.7MB; chosen so the project works even if `vendor/` is ignored later.
- **Files to study:** `.cursor/skills/nawab-plans/SKILL.md`, `vendor/cursor-config-coding/AGENTS.md`

### Phase A commit 2 — Authority artifacts — 2026-08-15

- **Concept:** `documentation.mdc` requires PROJECT_OVERVIEW, IMPLEMENTATION_PLAN, DECISIONS, and PROGRESS as living authority, not optional extras.
- **Pattern:** Copy the approved nawab plan into `IMPLEMENTATION_PLAN.md`; keep ADRs in `DECISIONS.md`.
- **Trade-off:** Duplicating the plan into the repo (vs linking only the Cursor plan file) so the contract survives outside the agent UI.

### Phase B — Research corpus — 2026-08-15

- **Concept:** A *harness* is the runtime around a frozen model (tools, context, eval, permissions), not the weights.
- **Pattern:** One segment file per Weng heading, plus a method page when a system is an implementation target.
- **Trade-off:** Prompt-only ACE is cheapest but AHE shows it can regress on a strong coding seed; we specified full AHE surfaces anyway.

### Phase C — Proposals — 2026-08-15

- **Concept:** Held-out validation is the regression brake that makes same-model self-edit safe enough to specify.
- **Pattern:** Generic capabilities (C1–C8) instantiated as OMP P1–P7 without writing patches.
- **Trade-off:** Maintainer review (#7907) is slower than auto-apply; chosen to block reward hacking.

### Phase N — Validate — 2026-08-15

- **Concept:** Relative-link checking is the “test suite” for a docs-only repo.
- **Pattern:** README points at overview, index, architecture, generic spec, OMP list, safety.
- **Trade-off:** No CI workflow invented; validation is a local file/link gate.

### Overlay Phase A — ACE playbook — 2026-08-15

- **Concept:** ACE merge must be deterministic; an LLM curator can collapse the playbook into slogans.
- **Pattern:** Non-LLM delta (append / increment helpful|harmful) plus reject rules for secrets and `SYSTEM.md` edits. Inject via `AGENTS.md`, not `system-prompt.md`.
- **Trade-off:** Merge-install into existing `oh-my-pi/.omp/` instead of replacing that directory (OMP already ships commands/skills).
- **Files to study:** `harness/omp/drivers/curate-playbook.ts`, `oh-my-pi/packages/coding-agent/src/prompts/system/project-prompt.md`

### Overlay Phase B — S1 jsonl fields — 2026-08-15

- **Concept:** OMP sessions persist `user` / `assistant` / `toolResult` messages in one jsonl. Assistant `content[]` includes `toolCall` blocks; `toolResult` has `toolCallId`, `toolName`, and `content`.
- **Gap vs miner traces:** No first-class verifier field. Exporter writes `outcome.json` from an explicit `{type:"outcome"}` line or infers `stopReason`. Tool I/O is present — not lossy enough for a WS-B persistence patch (no D10).
- **Pattern:** Post-hoc `export-session` to `traces/<id>/{meta.json,turns/,tool_calls.jsonl,outcome.json}`.
- **Files to study:** `oh-my-pi/packages/coding-agent/src/session/turn-persistence.ts`, `session-persistence.ts`

### Overlay Phase 0 — Surfaces — 2026-08-15

- **Concept:** AHE needs a file-level editable surface *and* a frozen kernel; without both, an evolver will “improve” `SYSTEM.md`.
- **Pattern:** Declare surfaces and kernel in `harness/omp/` before any driver code. Map every P-item to overlay vs “core later.”
- **Trade-off:** Overlay-first (D9) is slower to change OMP built-ins; chosen so candidates stay evidence (#7907) and we do not fork core.
- **Files to study:** `harness/omp/KERNEL.md`, `harness/omp/SURFACES.md`
