# Maintainer review queue

Candidates are **evidence**. Applying them to project `.omp/` or any OMP package is a human action. There is no auto-apply script.

| id | surface | files | parentHash | held-in | held-out | rollback | apply to project .omp? |
|----|---------|-------|------------|---------|----------|----------|------------------------|
| cand-example-playbook | playbook | harness/omp/staging/playbook/PLAYBOOK.md | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | 3/3 | 2/2 | `bun harness/omp/drivers/rollback-candidate.ts --id cand-example-playbook` | no — example from Phase C synthetic accept |

Source record: [overlay/.omp/manifests/cand-example-playbook.json](overlay/.omp/manifests/cand-example-playbook.json).
