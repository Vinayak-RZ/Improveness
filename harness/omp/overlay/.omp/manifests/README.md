# Candidate manifests

One JSON file per candidate. Schema: `id`, `surface` (`tool` | `hook` | `memory` | `skill` | `playbook`), `files`, `parentHash`, `scores`, `rollback`.

Apply writes to `harness/omp/staging/` only. Rollback restores the parent snapshot. Maintainers promote; the loop does not.
