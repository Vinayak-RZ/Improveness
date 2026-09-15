---
name: speckit
description: >
  Spec-Driven Development via GitHub Spec Kit. Use for greenfield features,
  new products, or when the user asks for constitution, specs, plan, or tasks
  before coding. Say "use speckit". Requires .specify/ in the target app
  (scripts/install-spec-kit.ps1). Do not use for one-line fixes.
argument-hint: "[constitution|specify|clarify|plan|checklist|tasks|analyze|implement|converge]"
---

# Spec Kit

One skill for the Spec Kit job. CLI pin **v1.0.6**. Full command text is not
vendored here; follow `.specify/` in the **code app**, not this config repo.

Guide: [docs/SPEC_KIT.md](../../../docs/SPEC_KIT.md)

## When to use

Greenfield work, net-new features, or multi-phase builds where requirements
should become artifacts before code.

Skip for trivial one-line fixes, typo edits, or when the user said skip plan /
just do it.

## Prerequisites

The target app must have `.specify/` (templates + PowerShell scripts). If missing:

```powershell
# from cursor-config-coding
.\scripts\install-spec-kit.ps1 -Target "D:\path\to\code-repo"
```

Do not run `specify init --force` into a junctioned `.cursor`.

## Phase order

Run in order. Name the phase; do not look for `/speckit-specify` skills.

| Step | Phase | Purpose |
|------|-------|---------|
| 1 | constitution | Project principles |
| 2 | specify | What and why — requirements / user stories |
| 3 | clarify | Optional — de-risk ambiguities |
| 4 | plan | Tech stack + implementation plan |
| 5 | checklist | Optional — quality checklist |
| 6 | tasks | Actionable task breakdown |
| 7 | analyze | Optional — cross-artifact consistency |
| 8 | implement | Execute tasks (ponytail on every code change) |
| 9 | converge | Assess codebase vs artifacts |

Tasks → GitHub issues: use `gh` from the tasks artifact if the user asks.
That is not a separate skill in this lab.

For each phase: read `.specify/templates/` and run
`.specify/scripts/powershell/` for that step. Honor `.specify/extensions.yml`
hooks if present. Ponytail still gates every code change.

## Precedence

1. **ponytail** — minimal correct diff on code.
2. **speckit** — spec → plan → tasks → implement artifacts.
3. **nawab-plans** — Plan mode lite default; wait for approval unless the user
   said skip plan.
4. Architecture skills apply inside plan / implement.

Extra upstream command skills: `find-skills` + catalog, not preinstalled.
