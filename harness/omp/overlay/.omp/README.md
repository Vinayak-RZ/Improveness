# Improveness OMP overlay

Project-level `.omp/` artifacts owned by Improveness. This directory is the source of truth. For a local OMP run:

```text
ln -sfn /absolute/path/to/Improveness/harness/omp/overlay/.omp /absolute/path/to/Improveness/oh-my-pi/.omp
```

Do not copy evolved files into `oh-my-pi/packages/`. Do not edit `system.md` from this overlay.

## Layout

```text
.omp/
  README.md          # this file
  AGENTS.md          # Phase A: lists PLAYBOOK.md as context
  playbook/          # Phase A: ACE store + curator rules
  agents/            # Phase B/C: debugger.md, evolver.md
  hooks/             # optional pre-hook excerpt
  skills/            # evolver-writable after Phase C
  tools/             # project tools only
  manifests/         # Phase D: candidate records
```

## Roles

| File | Job | May write |
|------|-----|-----------|
| `playbook/PLAYBOOK.md` | Growing strategies / failure modes / conventions | Deterministic curator; later evolver (allowlisted) |
| `agents/debugger.md` | Read traces, write `diagnosis.md` | diagnosis only (read-only tools) |
| `agents/evolver.md` | Propose overlay deltas | playbook / skills / tools — never kernel |

Existing OMP `learn`, memory, and autolearn stay in the seed harness. This overlay adds ACE + Self-Harness, it does not replace those primitives.
