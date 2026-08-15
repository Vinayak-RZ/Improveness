# Learning log

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
