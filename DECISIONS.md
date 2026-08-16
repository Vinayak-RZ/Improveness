# Decisions

## D1 — Plan format is nawab §0–§18

- **Context:** The coding-config repo requires `nawab-plans` in Plan mode.
- **Alternatives:** Thin Cursor plan; Spec Kit `.specify/` first.
- **Selected:** Nawab master plan; Spec Kit collapsed (no runtime feature).
- **Rationale:** Compulsory skill; this pass is docs/proposals, not a software feature with contracts.

## D2 — Delivery started as proposals only

- **Context:** First pass forbade OMP code changes.
- **Alternatives:** Implement an overlay; fork OMP with remotes.
- **Selected (superseded by D8):** Specs only in the first pass.
- **Rationale:** Matched the original scope and [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907).

## D8 — In-tree OMP is the upgrade base

- **Context:** User asked to clone https://github.com/can1357/oh-my-pi.git into this workspace, remove its `.git`, and use it as the base for updates.
- **Alternatives:** Keep proposals-only; git submodule; fork with remotes.
- **Selected:** Full tree at `oh-my-pi/` with nested git removed so Improveness owns history.
- **Rationale:** Explicit user instruction. Upstream history is not needed for local upgrades.

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

## D9 — Overlay-first; core patches only when a gate fails

- **Context:** D8 put Oh My Pi in-tree. The question is where self-improvement code lives.
- **Alternatives:** Patch `oh-my-pi/packages/coding-agent/` first; git submodule + upstream PRs; Improveness `harness/omp/` overlay + SDK drivers.
- **Selected:** Overlay-first at `harness/omp/`. Touch OMP core only if a phase exit gate cannot be met from `.omp/` + `createAgentSession` + existing session jsonl.
- **Rationale:** AHE surfaces are file-level. OMP already loads project agents, hooks, and custom tools. D7 forbids auto-apply to built-ins. [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907) treats candidates as evidence.
- **Core-patch triggers (not pre-scheduled):** unknown `modelRoles.debugger` rejected by schema; evolver path allowlist too coarse; jsonl missing tool I/O. Still never edit `system.md` as an improvement surface.

## D10 — First core patch is hidden debugger/evolver roles

- **Context:** P1 asked for first-class `@debugger` and `@evolver`. Custom roles already work via `getKnownRoleIds`, but the `ModelRole` union did not name them.
- **Alternatives:** Config-only custom roles; add visible selector entries; skip the core edit.
- **Selected:** Add `debugger` and `evolver` to `ModelRole` / `MODEL_ROLES` / `MODEL_ROLE_IDS` with `hidden: true`.
- **Rationale:** Overlay agents can pin `model: "@debugger"` / `"@evolver"`. Hidden keeps the TUI selector unchanged. No `system-prompt.md` edit.

## D11 — P2 ships CI + bounded search + local Harbor runner

- **Context:** P1 deferred live-smoke-in-CI, archive-driven search, and a public Terminal-Bench 2 / Harbor campaign.
- **Alternatives:** Make live smoke a required CI job; run a public TB2/Harbor campaign in this wave; park search until a public bench exists.
- **Selected:** Required CI job is `validate.sh` only. Live smoke is skip-gated. Archive search is in scope. Public TB2, required smoke, Spec Kit, and catalog ids stay P3.
- **Rationale:** Keyless PRs must stay green. Proposal P5 forbids tuning on the public set the proposer already saw. The 20-fixture frozen checker is enough fitness to start a bounded search.

## D12 — Archive search stages and queues; it does not promote

- **Context:** Wiring `sampleParent` to a propose → check loop could silently become auto-apply onto `overlay/.omp/` or OMP packages.
- **Alternatives:** Closed loop that writes the canonical overlay; search that only logs without staging; human-only proposals with no driver.
- **Selected:** `runSearch` may write `staging/`, `archive/<id>/`, manifests, and a `REVIEW_QUEUE.md` row. It must not copy into `overlay/.omp/` or `oh-my-pi/packages/`. Human promote remains the only path onto the project overlay (extends D7).
- **Rationale:** [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907) treats candidates as evidence. Weng reward-hacking bottleneck. Safety rule 6.

## D13 — CACD is Contract · Architecture · Control · Delivery

- **Context:** The overlay had a nawab plan and ADRs but no single machine-checkable operating model. The user asked for a proper CACD, repo-wide QA, and simulations of agentic architectures.
- **Alternatives:** Treat CACD as CI/CD only; skip a named model and keep docs informal; require live-LLM architecture evals.
- **Selected:** CACD means Contract, Architecture, Control, Delivery. QA verifies the catalog. Simulations replay named agentic wirings against the frozen suite without a live model.
- **Rationale:** The selling point is comparing harness topologies (ACE-only vs gated Self-Harness vs leaked/held-out vs kernel-writing) before spending tokens. Keyless CI must stay green (D11).
