# Decisions — cursor-config-coding

## ADR-001 — Thin always-on rules

**Context:** Always-on Cursor rules are injected into every chat. Nine workflow files (~570 lines) duplicated ponytail, planning, and communication.

**Alternatives:** Keep full always-on SDLC; slim stubs; one giant AGENTS.md.

**Choice:** Three always-on stubs: `rule-awareness`, `ponytail`, `ai-anti-patterns`. Other `.mdc` files stay on disk with `alwaysApply: false` or globs.

**Rationale:** Token-first. Skills remain the source of truth for workflows.

## ADR-002 — Nawab profiles

**Context:** Full 18-section nawab on every Cursor plan produced padded docs and skipped headings.

**Alternatives:** Always 18 sections; drop nawab; profiles.

**Choice:** **lite** (Cursor Plan default: §0 §1 §9 §16 §18), **standard**, **project** (full §0–§18 with `N/A — reason`). User commit budget overrides work-class defaults.

**Rationale:** Match plan size to work. Portable — no named-platform scale in the skill.

## ADR-003 — README skills by repo kind

**Context:** One numbered overview skeleton does not fit installable libraries.

**Alternatives:** One README skill; force product landing everywhere; split by job.

**Choice:** `product-readme` for installable/OSS/agent; `readable-readme` for internal platform services; `extensive-readme` concepts-before-package-map. Router asks when kind is unknown.

**Rationale:** Skills stay **general**. Gold landings taught the shape; they are not named in the skill bodies.

## ADR-004 — Spec Kit v1.0.6

**Context:** Vendored skills were generated from v0.12.11; upstream is v1.0.6.

**Alternatives:** Stay on 0.12.11; bump and `specify init --force` on junctioned `.cursor`.

**Choice:** Pin **v1.0.6**. `install-spec-kit.ps1` copies `.specify` only so a junctioned `.cursor` is never overwritten. This config later collapsed ten `speckit-*` command skills into one `speckit` router (ADR-005).

**Rationale:** Skills match the CLI. Junction safety for linked app repos.

## ADR-005 — One skill per GSAP and Spec Kit family; computer-use harness

**Context:** Nine GSAP skills and ten Spec Kit command skills were 45% of the folder. Cursor has an IDE browser and no full-desktop Computer Use.

**Alternatives:** Keep the vendor slices; dump GSAP into `skills-catalog/`; one mega GSAP skill; Python browser-use / desktop CUA MCP.

**Choice:** Keep `gsap-framer-scroll-animation` and one `speckit` router. Preinstall `computer-use` (Codex ladder mapped to Cursor) plus `agent-browser`. Do not vendor unofficial desktop-CUA MCPs. Extra GSAP slices and full `/speckit-*` commands stay `find-skills` / catalog.

**Rationale:** Jobs, not slice packs. Agents pick the narrowest interface. Inventory is 30 skills.
