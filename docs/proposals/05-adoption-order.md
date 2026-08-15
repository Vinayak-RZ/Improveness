# Adoption order

Same sequence for a generic harness and for OMP. Cheapest first. Each step is a **spec milestone**, not a commit in this repo.

```mermaid
flowchart LR
  S0[0_surfaces] --> S1[1_ACE_playbook]
  S1 --> S2[2_traces_debugger]
  S2 --> S3[3_SelfHarness_gate]
  S3 --> S4[4_AHE_manifests]
  S4 --> S5[5_optional_archive]
```

| Step | Name | Depends on | Done when (spec) |
|------|------|------------|------------------|
| 0 | Declare editable vs read-only surfaces | — | Seven components have paths; kernel paths listed as forbidden |
| 1 | ACE playbook | 0 | Delta curator + deterministic merge + inject path documented |
| 2 | Traces + debugger | 0 | Per-rollout directory schema + report/overview templates |
| 3 | Self-Harness gate | 1, 2 | Held-in/held-out split rule + accept/reject predicate |
| 4 | AHE manifests | 3 | Manifest schema + next-round attribute/rollback rule |
| 5 | Optional archive | 4 + cheap objective fitness | Parent sampling + novelty rule; still cannot write the kernel |

## Dependencies that block a step

- **No step 3** without a verifier the evolver cannot edit.
- **No step 5** if fitness is a judge model the child can see, or if eval takes hours per candidate with no cheaper proxy.
- **Do not skip to prompt-only “ACE forever.”** AHE’s ablation says tools/middleware/memory carry the gain.

## OMP-specific notes

- Step 0 is mostly **documentation of existing `.omp/` paths** (see [02-omp-gap-analysis.md](02-omp-gap-analysis.md)).
- Step 1 may promote stable bullets through `learn` → managed-skills.
- Step 3’s driver should be specified against `createAgentSession`, not the TUI.
- Step 5 snapshots **project** `.omp/` only, never `oh-my-pi` source.

## P0 vs P1 vs P2

| Wave | Scope |
|------|--------|
| P0 (done) | Steps 0–4 |
| P1 (done) | Step 5 archive primitive; ≥20-case suite; TB adapter (not public TB2) |
| P2 (draft) | Improveness CI; bounded archive search; local Harbor runner — [p2-omp-overlay.md](../plans/p2-omp-overlay.md) |
| P3 (parked) | Public TB2 campaign; Spec Kit constitution; Agent Patterns Catalog ids |
