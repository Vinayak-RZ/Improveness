# Hooks

Playbook injection is **not** done by rewriting the Oh My Pi system prompt.

Primary path: [../AGENTS.md](../AGENTS.md) lists `playbook/PLAYBOOK.md` as project context (see `project-prompt.md` in OMP).

Optional later: a `pre` hook may prepend a playbook excerpt. Do not add a hook that writes `system.md` or `system-prompt.ts`.
