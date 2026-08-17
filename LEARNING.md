# Learning log

### Readable + extensive README split — 2026-08-17

- **Concept:** The `readme` skill is a router. Main `README.md` is a one-sitting human overview (`readable-readme`). Package/file maps go to `docs/EXTENSIVE.md` (`extensive-readme`). Putting the dump in README.md is now an anti-pattern.
- **Pattern:** Vendor `cursor-config-coding` skills into `vendor/` and copy into `.cursor/skills/` (D4). New skills: `readme`, `readable-readme`, `product-readme`; `extensive-readme` retargeted.
- **Trade-off:** Two files vs one giant README. Chosen so GitHub landing is finishable; internals stay complete.
- **Files to study:** `.cursor/skills/readme/SKILL.md`, `README.md`, `docs/EXTENSIVE.md`

### D14 snapshot apply + spatiotemporal composability — 2026-08-17

- **Concept:** Improveness is a working-copy mutator. Overlay-only / never-touch-packages / forever-review-queue was a misread. #7907 is for *upstream* maintainers. Cordis names the runtime bottleneck: self-mod that requires killing the process dumps session state. Temporal composability = revert every effect on unload. Spatial composability = declare and react to dependencies.
- **Pattern:** Keep D7/D12 text (catalog needles) with product-status banners. Change c-plan needle from `No auto-promote` to `working snapshot` in the same commit as the plan. Name the future driver `apply-snapshot.ts`, never `auto-apply.ts`.
- **Trade-off:** Gated auto-apply onto the snapshot (chosen) vs review-queue-only (mismatches vision) vs Cordis rewrite of OMP now (too large). Restart remains the fallback when an edit is not revertible.
- **Files to study:** `DECISIONS.md` D14, `docs/proposals/06-snapshot-apply.md`, `docs/methods/spatiotemporal-composability.md`

### In-tree OMP base — 2026-08-15

- **Concept:** Stripping nested `.git` makes a third-party tree a normal directory in *this* repo’s history (no submodule, no accidental pushes to upstream).
- **Pattern:** Clone `--depth 1`, `rm -rf .git`, commit under `oh-my-pi/`.
- **Trade-off:** ~123MB in-tree vs submodule. Chosen because the user asked to own the tree as the upgrade base.

## Session / phase entries

### CACD, QA, architecture simulations — 2026-08-15

- **Concept:** CACD is Contract · Architecture · Control · Delivery — a live checklist, not another ADR log. Simulations compare *wirings* (who may write, who may see held-out) without a live model.
- **Pattern:** Catalog needles in `cacd/catalog.ts`; `qa.sh` = validate.sh + qa-repo + simulate-architectures.
- **Trade-off:** ACE-only is a passing simulation of *stagnation*, not a product failure. That is the AHE lesson encoded as a test.
- **Files to study:** `harness/omp/CACD.md`, `harness/omp/evals/simulations/latest/summary.md`

### P2 closeout — CI, search, local-20 — 2026-08-15

- **Concept:** A playbook-conditioned solver turns ACE memory into measurable fixture unlocks; held-out-only families staying locked is the leakage brake, not a bug.
- **Pattern:** `run-benchmark.ts` copies evals into a temp worktree so search can write archive/queue without dirtying the canonical overlay.
- **Trade-off:** This benchmark is harness-memory, not a live LLM agent. Chosen so CI stays keyless and D11 (no public TB2) still holds.
- **Files to study:** `harness/omp/drivers/search.ts`, `harness/omp/evals/benchmarks/local-20/summary.md`

### P2 Phase 0 — Adopt contract — 2026-08-15

- **Concept:** Approval turns the draft nawab file into `IMPLEMENTATION_PLAN.md`; ADRs (D11/D12) freeze the P2 vs P3 split before CI or search code exists.
- **Pattern:** Snapshot stays at `docs/plans/p2-omp-overlay.md`; the root plan is the live contract.
- **Trade-off:** Stop after Phase 0 so the P2/P3 split can be frozen before adding `.github/workflows`.
- **Files to study:** `IMPLEMENTATION_PLAN.md`, `DECISIONS.md` D11/D12

### P2 plan draft — 2026-08-15

- **Concept:** Archive snapshot + `sampleParent` is not yet a search loop; the missing piece is a hard-capped propose → frozen-check → stage cycle that still cannot promote.
- **Pattern:** Deterministic proposer for CI; live evolver stay skip-gated (`OMP_LIVE_SEARCH`), same as P1 smoke.
- **Trade-off:** Public TB2 stays P3. A local Harbor-shaped runner reuses `exportHarborTask` without Docker or the public set (P5 leakage).
- **Files to study:** [docs/plans/p2-omp-overlay.md](docs/plans/p2-omp-overlay.md)

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

### Overlay P1 — Eval20 / smoke / roles / TB / archive — 2026-08-15

- **Concept:** Cheap objective fitness (`check.sh`) is what unblocks a DGM-lite archive; public TB2 is not required to start snapshotting.
- **Pattern:** 12/8 held-in/held-out split; Harbor-shaped export is an adapter, not a score; live SDK is injected and skipped without keys; `@debugger`/`@evolver` are hidden first-class roles (D10).
- **Trade-off:** First core patch (role union only) vs config-only custom roles. Chosen so overlay frontmatter can pin aliases without a TUI change.
- **S2:** New fixtures use fake `sk-` only in held-out *failing* repos. Archive calls `isKernelRel` before copy.
- **Files to study:** `harness/omp/drivers/archive.ts`, `oh-my-pi/packages/coding-agent/src/config/model-roles.ts`

### Overlay Phase A — ACE playbook — 2026-08-15

- **Concept:** ACE merge must be deterministic; an LLM curator can collapse the playbook into slogans.
- **Pattern:** Non-LLM delta (append / increment helpful|harmful) plus reject rules for secrets and `SYSTEM.md` edits. Inject via `AGENTS.md`, not `system-prompt.md`.
- **Trade-off:** Merge-install into existing `oh-my-pi/.omp/` instead of replacing that directory (OMP already ships commands/skills).
- **Files to study:** `harness/omp/drivers/curate-playbook.ts`, `oh-my-pi/packages/coding-agent/src/prompts/system/project-prompt.md`

### Overlay Phase N — Hardening — 2026-08-15

- **Concept:** The overlay gate is a small orchestrator (`validate.sh`), not the full OMP coding-agent-heavy suite.
- **S3 security:** OAuth clients still read `OMP_*` env vars. Playbook has no secret-shaped lines. Held-out `no-secrets/repo` contains an intentional fake `sk-` string as the failing case. Evolver path checks deny `evals/checker` and `packages/coding-agent`.
- **Ponytail:** Path-mapping is duplicated in `self-harness.ts` and `apply-candidate.ts` (one caller each). Left as-is; shrinking would be a later commit, not a new §9 row.
- **Trade-off:** Golden-only P0 (no live `createAgentSession`) keeps CI deterministic.

### Overlay Phase D — Manifests — 2026-08-15

- **Concept:** A candidate without a parent hash cannot be rolled back; commit messages are not enough (C7).
- **Pattern:** Snapshot parent bytes under `staging/snapshots/<id>/`, write a JSON manifest, restore on miss.
- **Trade-off:** Queue is a markdown table, not a UI. Matches #7907 (evidence, not authority).

### Overlay Phase C — Self-Harness — 2026-08-15

- **Concept:** Accept iff held-in does not regress, held-out does not regress, and at least one split improves.
- **Pattern:** Synthetic scores in unit tests; live checker on fixture `repo/` vs `expected/`. Staging only.
- **Trade-off:** No Terminal-Bench in P0.

### Overlay Phase C — S2 SDK allowlist — 2026-08-15

- **Concept:** `createAgentSession({ toolNames, restrictToolNames: true })` drops MCP, extensions, and ambient custom tools. `allowRestrictedCustomTools` is the only extra tool seam.
- **Gap:** There is **no** first-class path allowlist on the SDK. Path policy lives in `assertEvolverWrite` (overlay wrapper). Not enough to open WS-B.
- **Pattern:** Debugger/evolver as project agents (`.omp/agents/*.md`) plus wrapper checks. Task agent stays `default`; evolver `@smol`.
- **Files to study:** `oh-my-pi/packages/coding-agent/src/sdk.ts` (`CreateAgentSessionOptions.toolNames`, `restrictToolNames`)

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
