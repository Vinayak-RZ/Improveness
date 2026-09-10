# Spec Kit (Spec-Driven Development)

This coding config vendors **[GitHub Spec Kit](https://github.com/github/spec-kit)** Cursor skills (`speckit-*`) so agents can run Spec-Driven Development when linked into a code project.

Pinned CLI version: **v1.0.6**.

`speckit-taskstoissues` is still vendored (legacy). Prefer converting tasks to GitHub issues from the tasks artifact if upstream drops that skill from core.

## What lives where

| Location | Role |
|----------|------|
| `cursor-config-coding/.cursor/skills/speckit-*/` | Agent skills (pre-installed in this config) |
| `cursor-config-coding/.cursor/rules/speckit.mdc` | When to use Spec Kit vs trivial edits |
| **Code project** `.specify/` | Templates + PowerShell scripts the skills call |

Skills alone are not enough — the **target app repo** needs `.specify/`.

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

| Order | Skill / command | Purpose |
|------:|-----------------|---------|
| 1 | `/speckit-constitution` | Governing principles |
| 2 | `/speckit-specify` | Requirements (what / why) |
| 3 | `/speckit-clarify` | Optional — resolve ambiguities |
| 4 | `/speckit-plan` | Tech stack + design plan |
| 5 | `/speckit-checklist` | Optional — requirements quality checklist |
| 6 | `/speckit-tasks` | Task breakdown |
| 7 | `/speckit-analyze` | Optional — artifact consistency |
| 8 | `/speckit-implement` | Build from tasks |
| 9 | `/speckit-converge` | Gap assessment vs codebase |
| — | `/speckit-taskstoissues` | Tasks → GitHub issues (legacy) |

## Precedence with this config

1. **`ponytail`** — every code change still uses the minimal-diff ladder.
2. **Spec Kit** — owns the spec → plan → tasks → implement chain for features / greenfield.
3. **`nawab-plans`** — Plan mode lite default; approval before non-trivial coding unless you override.
4. Architecture skills apply inside plan/implement as usual.

Do **not** force Spec Kit for one-line fixes.

## Upgrade

Regenerate vendored skills in a **temp app dir**, copy `speckit-*` only into this config. Then:

```powershell
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
.\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp" -Tag "vX.Y.Z"
```

## Upstream

- Repo: https://github.com/github/spec-kit
- Docs: https://github.github.io/spec-kit/
