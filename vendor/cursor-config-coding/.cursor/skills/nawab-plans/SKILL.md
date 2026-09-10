---
name: nawab-plans
description: >
  Master execution plans. Cursor Plan mode defaults to the lite profile
  (§0 §1 §9 §16 §18). Standard and project profiles add sections. Use when
  drafting IMPLEMENTATION_PLAN.md or a Cursor plan, orchestrating delivery,
  or turning a vague project into a commit matrix. Pair with domain
  architecture skills during research. Not graphify. graph-engineering is
  opt-in §19 only.
argument-hint: "[lite|standard|project] [scope]"
license: MIT
---

# Nawab Plans

One plan is the **execution contract**: what to build, in what order, with what
tests, who does what, when it is done. Portable across stacks — never bake a
named product or customer into the skill; fill §0 from the repo in front of you.

Templates: [PLAN.template.lite.md](PLAN.template.lite.md) · [PLAN.template.md](PLAN.template.md)  
Subagents: [SUBAGENT_ORCHESTRATION.md](SUBAGENT_ORCHESTRATION.md) (project / parallel WS only)

**graph-engineering** is opt-in. Load only if the user named it. graphify is a
knowledge-graph CLI — never a substitute for §19.

---

## Profiles (pick one before writing)

Cursor Plan mode **defaults to lite** unless the user says “full nawab”,
“project mode”, or the work is multi-package / platform.

| Profile | When | Required sections |
|---------|------|-------------------|
| **lite** | Most Cursor plans; UI pass; docs; ≤~10 commits | §0 §1 §9 §16 §18 + Open questions |
| **standard** | One-package feature with real deps/tests | lite + §2 §3 §7 §10 §11 |
| **project** | Greenfield platform, multi-repo, or many packages | full §0–§18 (collapse as `N/A — reason`, do not omit headings) |

Hotfix / one-file: skip nawab — ponytail only.

**N/A rule:** only required inside the **chosen profile**. Do not pad lite to 18
sections. Do not delete headings in project profile — write `N/A — [reason]`.

Docs / README work: concept outline (audience + 3–5 nouns) **before** file paths.

---

## §0 fields (all profiles)

Ask **commit budget** before writing §9 if the user did not give a number.

| Field | Notes |
|-------|--------|
| Profile | lite / standard / project |
| Mode | feature / project (nawab mode, not Cursor `isProject`) |
| User commit budget | number or range — **overrides** 7–8 / 18+ defaults |
| Delivery | `cursor-plan` (`.plan.md`) or `repo IMPLEMENTATION_PLAN.md` |
| Supersedes | prior plan name/path or `none` |
| Stack, branch, authority, lead | as today |

If §9 rows > **2×** the commit budget, coalesce **before** asking approval.
Do not ship a second plan whose only job is shrinking the matrix.

---

## §9 — user count first

1. **User-specified count is a hard requirement.**
2. Then work-class defaults: marketing/UI ≈ 7–8; medium feature ≈ 7–10;
   multi-package ≈ 18–30+.
3. One row = one conventional commit. Tests in the same commit when they exist.

Anti-patterns: 500-line plan for 3 doc commits; first draft at 24 rows then a
follow-up plan to make it 8.

---

## §6 Subagents

Lite/standard lead-only: `§6 N/A — lead executes §9 sequentially`.

Full spawn-prompt contract: [SUBAGENT_ORCHESTRATION.md](SUBAGENT_ORCHESTRATION.md)
appendix — **project profile or parallel workstreams only**.

---

## Research before the plan

Load domain skills while researching. Record choices in §11 (standard/project).
Unresolved P0 questions → ask; do not invent architecture in §4.

---

## Optional §19

Default: `N/A — graph-engineering not requested`. If named: Gate 0 questions,
then the graph is the plan you read. Approving runs it.

---

## Execution after approval

Follow §18 in the plan. Copy to `IMPLEMENTATION_PLAN.md` when Delivery is repo.
Cursor `todos:` frontmatter may replace §8; do not maintain two conflicting lists.

Quality: chosen profile complete; commit budget honored; gates are real commands.
