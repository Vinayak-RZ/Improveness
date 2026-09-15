# Spec Kit (Spec-Driven Development)

This coding config ships **one** [GitHub Spec Kit](https://github.com/github/spec-kit) skill: `speckit`. Agents say **use speckit** and follow `.specify/` in the **code app**. The ten `/speckit-*` command skills are not preinstalled.

Pinned CLI version: **v1.0.6**.

Extra upstream command skills: `find-skills` plus the catalog, not this folder.

## What lives where

| Location | Role |
|----------|------|
| `cursor-config-coding/.cursor/skills/speckit/` | Router skill (when to use, phase order) |
| `cursor-config-coding/.cursor/rules/speckit.mdc` | When to use Spec Kit vs trivial edits |
| **Code project** `.specify/` | Templates + PowerShell scripts the phases call |

The skill alone is not enough. The **target app repo** needs `.specify/`.

## One-time machine setup

1. Install [uv](https://docs.astral.sh/uv/) (or let the install script do it).
2. Link this coding config into your app:

```powershell
cd D:\Startups\Cursor\cursor-config-coding
.\scripts\link-to-project.ps1 -Target "D:\Startups\YourApp"
```

3. Scaffold Spec Kit into the **app** repo:

```powershell
.\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp"
```

That installs `specify-cli@v1.0.6` if needed, then inits in a **temp directory** and copies **`.specify/` only**. It will not `specify init --force` into a junctioned `.cursor` (that would write into this config repo).

## Workflow

Say **use speckit**. Run phases in order:

| Order | Phase | Purpose |
|------:|-------|---------|
| 1 | constitution | Governing principles |
| 2 | specify | Requirements (what / why) |
| 3 | clarify | Optional: resolve ambiguities |
| 4 | plan | Tech stack + design plan |
| 5 | checklist | Optional: requirements quality checklist |
| 6 | tasks | Task breakdown |
| 7 | analyze | Optional: artifact consistency |
| 8 | implement | Build from tasks (ponytail on code) |
| 9 | converge | Gap assessment vs codebase |

Tasks to GitHub issues: use `gh` from the tasks artifact if you ask. That is not a separate skill here.

For each phase, read `.specify/templates/` and run `.specify/scripts/powershell/` for that step.

## Precedence with this config

1. **`ponytail`** — every code change still uses the minimal-diff ladder.
2. **Spec Kit** — owns the spec → plan → tasks → implement chain for features / greenfield.
3. **`nawab-plans`** — Plan mode lite default; approval before non-trivial coding unless you override.
4. Architecture skills apply inside plan/implement as usual.

Do **not** force Spec Kit for one-line fixes.

## Upgrade

Keep the `speckit` router in this config. Bump the CLI pin, then:

```powershell
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
.\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp" -Tag "vX.Y.Z"
```

Update `v1.0.6` in `skills-manifest.json`, `scripts/install-spec-kit.ps1`, `.cursor/skills/speckit-SOURCE.txt`, and this file.

## Upstream

- Repo: https://github.com/github/spec-kit
- Docs: https://github.github.io/spec-kit/
