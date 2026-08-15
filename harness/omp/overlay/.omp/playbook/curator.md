# Curator rules (deterministic)

The curator is a **non-LLM** merge. It reads a session export (or jsonl) plus a task outcome and appends or increments playbook bullets.

## Must

- Write only under `overlay/.omp/playbook/` (or the playbook path passed in).
- Keep stable ids (`s-NNN`, `f-NNN`, `c-NNN`).
- Apply deltas: append a new bullet or increment `helpful` / `harmful`.
- Reject any candidate text that looks like a secret (API keys, `sk-`, `OMP_*` assignments, PEM blocks, Google client secrets).
- Reject any delta that mentions editing `SYSTEM.md`, `system.md`, or `system-prompt.ts` as an action to take.

## Must not

- Edit `SYSTEM.md` / `system.md` / `system-prompt.ts`.
- Rewrite the whole playbook into slogans.
- Call an LLM for v1 merge.
- Write outside `playbook/`.
- Promote a bullet into OMP `learn` / managed-skills automatically (optional later, human-gated).
