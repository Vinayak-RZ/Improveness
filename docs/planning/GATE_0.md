# Gate 0 — TargetPort for domain kernels and any agentic system

Recorded **2026-09-15**. User instructed: default answers for every nawab-plans / graph-of-loops question; plan then execute; do not wait.

## Research (5–10 lines)

Improveness is a DeepSeek Harness plugin plus a Bun overlay loop (`decideAccept`, frozen checker, HostPort). HostPort today is coding-host shaped (DSH P0, OMP P1). ARC (github.com/Vinayak-RZ/ARC, renamed from Electrical-Engineer) is a **domain kernel**, not a harness: hosts own the loop; the kernel owns capabilities, recipes, `unchecked`, gold eval. ARC already cites Improveness for frozen physics / held-out / grader≠improver but does not mount DSH. Papers that matter here: Weng harness survey (improve the wrapper, not weights); ACE playbooks; Self-Harness held-in/out; AHE (tools/memory beat slogans); HELIX thin adapter; GEPA/DSPy as *prompt* optimizers we will not port. Domain kernels are made by: capability registry, frozen grader, host-owned loop, evidence on disk, honest labels. Improveness’s addition is the **gated improve loop** over those files.

## XOR

User named **graph-of-loops** as the skill to use, and also allowed loading graph-engineering if that was the only match. Both exist after the coding-config pin. **Default: graph-of-loops wins.** Graph-engineering is not loaded (XOR).

## Must-answer — product

1. **User:** Domain-kernel / agentic-system author (one role).
2. **Job:** Plug their kernel or agentic system into Improveness so proposed edits pass Self-Harness before they land.
3. **Done looks like:** `bun harness/omp/drivers/improve-target.ts --target arc` (keyless) prints accept/reject; kernel writes throw; a second `--target generic-agentic` proves non-coding systems work.
4. **Out:** Vendoring ARC; DSH/Cordis as Arc runtime; public Terminal-Bench as fitness; live SPICE/MATLAB; rewriting `decideAccept`; weight training; a ninth frozen architecture sim.
5. **P0 vs later:** P0 = TargetPort + JSON manifest + ARC fixture adapter + generic agentic fixture + tests. Later = live `ARC_ROOT` gold eval, more kernels, kernel JIT.
6. **Know it worked:** Fixture playbook gain is accepted; held-out regression is rejected; frozen scorer path throws.

## Must-answer — technical

7. **Extend this repo.** Off-limits: `harness/omp/evals/checker/`, `plugins/dsh-improveness/`, `oh-my-pi/packages/`, frozen 12/8 Harbor inventory.
8. **Stack:** inherit Bun/TypeScript overlay.
9. **Truth:** filesystem (manifest, fixtures, staging). No DB.
10. **Auth:** none. Secrets stay env-only; none required for P0.
11. **UI:** none this graph (CLI only).
12. **Run:** local CLI.
13. **Commit budget:** 8.

## Trade-offs (defaults applied)

### Trade-off: HostPort stretch vs new TargetPort
**Option A:** Stretch HostPort — one interface, DSH methods (`mountEphemeral`) leak into kernels.  
**Option B:** Sibling TargetPort — HELIX-thin; HostPort stays coding hosts.  
**Default if you skip:** B because SIMPLICITY + CONSISTENCY (D15 HostPort remains; kernels are not Fiber hosts).  
**Override:** PRIORITY = SIMPLICITY

### Trade-off: Vendor ARC vs fixture adapter
**Option A:** Vendor the Apache-2.0 ARC tree.  
**Option B:** In-tree ARC-shaped fixture + optional `ARC_ROOT`.  
**Default if you skip:** B because COST + license boundary.  
**Override:** PRIORITY = COST

### Trade-off: New npm package vs overlay folder
**Option A:** `packages/improveness-target`.  
**Option B:** `harness/omp/target-port/` next to HostPort.  
**Default if you skip:** B because YAGNI (ModelTaste was a package because it had to unstrap from hosts; this *is* the overlay).  
**Override:** PRIORITY = SIMPLICITY

## Optional (defaults)

| Topic | Default |
|-------|---------|
| Hosting | local |
| Telemetry | none |
| Extra kernels | P1 |
| Cloud subagents | off — lead executes loops (this worker cannot spawn nested Tasks) |

## Open spikes

- Live ARC `eval --pack circuits` is P1 until `ARC_ROOT` is present in CI.
