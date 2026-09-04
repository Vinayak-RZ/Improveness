# README claim ledger

Every public claim must sit in one row. Forbidden claims stay forbidden even if a demo looks good.

## Proven now (this repo, keyless)

| Claim | Evidence |
|-------|----------|
| Frozen 12 held-in / 8 held-out fixtures | `harness/omp/evals/held-in`, `held-out`; `qa-repo` inventory |
| Playbook search sim 0/12 → 7/12 held-in, 0/8 → 3/8 held-out | `harness/omp/evals/benchmarks/local-20/` |
| Seven named architecture simulations pass without an API key | `simulate-architectures.ts`; `qa.sh` |
| Search step cap is 8 | `MAX_STEP_CAP = 8` in `search.ts` |
| Playbook accepts still **stage** (do not silently rewrite overlay) | `search.test.ts` |
| Plugin accepts apply to generated dir with rollback | `apply-snapshot` tests |

## After gates (code exists; live DSH optional)

| Claim | Gate |
|-------|------|
| Installable `dsh.bundle` plugin | `plugins/dsh-improveness/package.json` contains `dsh.bundle` |
| JIT session mount/unmount with disposer invertibility | fake-`ctx` tests |
| Atomic durable install + HMR drain/fail-closed | HostPort tests |
| Uninstall Improveness does not delete accepted siblings | generated dir is outside the bundle |
| Two independently disableable sections (JIT / Improvement) | `sections.js` + `dsh-plugin.test.ts` flag matrix |
| Hierarchical catalog + event inject | `catalog.js`, `events.js` tests |
| JIT M/P/A/C template synthesize (no free-form codegen) | `synthesize.js` tests |
| Short-term / long-term improve drivers (still gated for durable) | `improve.test.ts` |

## Forbidden (do not put in README)

- “First”, “SOTA”, “state of the art”
- Multi-host proven (OMP adapter is P1; not a second measured campaign)
- Live-model Terminal-Bench / SWE-bench gains
- Public Terminal-Bench as fitness (policy: **No public Terminal-Bench**)
- Fake GitHub stars, “trusted by”, invented latency numbers
