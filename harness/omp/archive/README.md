# Overlay archive (DGM-lite)

Snapshots of **project** playbook/skills/tools, staging, and (after D14) working-snapshot diffs. Parent pointer + fitness. `drivers/search.ts` runs a bounded propose → check → stage loop (`MAX_STEP_CAP = 8`). P2 still stages; P3 `apply-snapshot` writes the working snapshot after accept. Never archive the checker or `system-prompt` files. Human checkpoint remains for permission-widening.
