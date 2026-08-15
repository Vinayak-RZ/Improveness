# Spec Kit (Spec-Driven Development)

This coding config vendors **[GitHub Spec Kit](https://github.com/github/spec-kit)** Cursor skills (`speckit-*`) so agents can run Spec-Driven Development when linked into a code project.

Pinned CLI version used to generate skills / recommended for project install: **v0.12.11**.

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

That runs:

```text
specify init . --here --force --integration cursor-agent --script ps --ignore-agent-tools
```

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
| — | `/speckit-taskstoissues` | Tasks → GitHub issues |

Example:

```text
/speckit-constitution Focus on code quality, testing, UX consistency, and performance.
/speckit-specify Build a photo album organizer with date-grouped albums and tile previews.
/speckit-plan Vite + vanilla HTML/CSS/JS; local SQLite for metadata; no image uploads.
/speckit-tasks
/speckit-implement
```

## Precedence with this config

1. **`ponytail`** — every code change still uses the minimal-diff ladder.
2. **Spec Kit** — owns the spec → plan → tasks → implement chain for features / greenfield.
3. **`planning.mdc`** — approval before non-trivial coding unless user overrides.
4. Architecture skills apply inside plan/implement as usual.

Do **not** force Spec Kit for one-line fixes.

## Upgrade

```powershell
# Upgrade specify CLI, then refresh project scaffold + skills
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
.\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp" -Tag "vX.Y.Z"
```

After upgrading, re-copy skills into this config if you want the repo to stay pinned (or re-run install so the junctioned `.cursor/skills` refresh).

## Upstream

- Repo: https://github.com/github/spec-kit
- Docs: https://github.github.io/spec-kit/
