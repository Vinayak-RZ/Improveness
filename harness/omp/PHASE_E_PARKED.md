# Phase E — search loop is unparked

The DGM-lite archive primitive and the bounded search loop both exist:

- [archive/](archive/) + [drivers/archive.ts](drivers/archive.ts) — snapshot, `listArchive`, `sampleParent`
- [drivers/search.ts](drivers/search.ts) — hard-capped propose → frozen checker → stage / reject
- [drivers/propose.ts](drivers/propose.ts) — deterministic held-in-only recipe proposer

Fitness remains the frozen checker. Kernel paths stay out of snapshots. Canonical `overlay/.omp` is not auto-written (D12).
