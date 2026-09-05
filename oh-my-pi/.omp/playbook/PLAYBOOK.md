# ACE playbook

Itemized lessons for this project. The curator applies **deltas** only. Do not rewrite this file into a shorter system prompt.

Format per bullet: `- [id] (helpful=N harmful=N) text`

## Strategies

- [s-001] (helpful=1 harmful=0) Prefer overlay files under `harness/omp/` over edits to Oh My Pi core.

## Failure modes

- [f-001] (helpful=1 harmful=0) Rewriting `SYSTEM.md` is not an improvement; AHE measured prompt-only regression.

## Repo conventions

- [c-001] (helpful=1 harmful=0) Secrets stay in environment variables. Never copy `OMP_*` values into this playbook.
