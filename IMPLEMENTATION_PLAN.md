# Implementation plan — Improveness as a DeepSeek Harness plugin

Approved product contract (D15). Cursor plan files are not edited from here.

## Goal / north star

Ship **`dsh-improveness`**: a DeepSeek Harness **bundle plugin** you add to a live profile so the host can improve itself at runtime without a full process kill on every self-mod.

```text
dsh plugin --profile improveness add ./plugins/dsh-improveness
```

Custom live profile **`improveness`** = `dsh-base` + `dsh-web-app` + `dsh-improveness`.

After a Self-Harness gate, accepted siblings are **durable generated plugins** in a profile-owned directory, patched into the live profile, then HMR’d. Fast path is session-owned JIT (Creator-mode define/run/stop).

## Scope boundary

**In:** HostPort (DSH adapter in P0; OMP adapter in P1), four HarnessFactory slots, frozen-id fence, JSONL Node↔Bun bridge, apply + HMR + rollback for supported candidate classes, product README with a claim ledger, MIT license.

**Out:** Vendoring a full DeepSeek Harness tree. Public Terminal-Bench / SWE-bench as evolver fitness. `auto-apply.ts` onto checker or upstream. Training JIT-Agent 27B. Meta-Harness Terminal-Bench-2 campaign. Deleting `oh-my-pi/` (parked).

## Non-goals

- Silent kernel authority (checker, approval, model routes, Cordis loader, Improveness QA).
- Writing durable plugins into `node_modules` or the installed `dsh-improveness` bundle.
- Claiming live-model bench gains, “first/SOTA”, or multi-host proof before the OMP adapter exists.
- Treating Fiber instance ids as stable kernel ids.

## Understanding

Improveness already has a Bun overlay loop (`harness/omp/`: playbook solver, frozen checker, `decideAccept`, archive, search). That loop **stages** playbook accepts (D12). D14 said the apply target is a **working snapshot**. D15 says the default host is **DeepSeek Harness**: apply means a generated sibling plugin + patch + HMR, not a PR to `can1357/oh-my-pi`.

Node (DSH plugin) and Bun (loop) stay two processes. Default bridge: **JSONL subprocess**. The plugin packages a Bun runner; no sibling-checkout imports.

## Prerequisites & blockers

- Bun for overlay tests / packaged runner.
- Optional live DSH for profile-session smoke (`DSH_LIVE_SMOKE`); CI stays green without it.
- No DSH vendor pin in this repo.

## Dependencies / authority map

| Authority | Owns |
|-----------|------|
| `DECISIONS.md` D15 | Product shape |
| `harness/omp/KERNEL.md` | Frozen paths and ids |
| `harness/omp/SURFACES.md` | Editable surfaces + generated-plugin target |
| `plugins/dsh-improveness/` | Installable `dsh.bundle` |
| `harness/omp/host-port/` | HostPort + slots (shared with P1 OMP adapter) |
| `LICENSE` | MIT for Improveness; OMP tree keeps its own license |

## Risks

| Risk | Mitigation |
|------|------------|
| Disposer not invertible | Fake-ctx tests: register then dispose; assert invertibility |
| Slot collisions | Fail before mount |
| HMR vs in-flight tools | Drain or fail-closed |
| Windows dir replace | Same-volume rename + `.bak` rollback |
| Live DSH missing in CI | Skip-gated smoke |
| README overclaim | Claim ledger; playbook sim numbers only until live-model measured |

## Deliverables

- MIT `LICENSE`
- `plugins/dsh-improveness` (`dsh.bundle`, `cordis.patch.yml`, Node `apply`)
- Profile recipe `improveness`
- HostPort + four slots + frozen ids
- JSONL core runner
- JIT mount/unmount + durable apply + HMR + rollback
- Search applies **plugin** candidates (playbook still stages)
- Product README + SVG wordmark + claim ledger
- P1: OMP HostPort, Pareto archive, Evo-Harness skill compile, JIT retrieve-prior, Evo-Bench held-out notes

## Workstreams / phases

| Phase | What |
|-------|------|
| 0 | D15, KERNEL/SURFACES remap, method notes, HostPort contracts, claim ledger, license |
| A | Scaffold bundle + profile; no full DSH vendor |
| B | DSH HostPort: session-log traces, frozen ids, generated apply target, allowlist |
| C | JIT fast path + kernel fence + unload drain |
| D | `decideAccept` → immutable candidate → validate → atomic patch + HMR |
| N | Product README, docs sync, `qa.sh` |
| P1 | OMP adapter + Pareto + skills + retrieve-prior + Evo-Bench construction |

## Commit matrix & test gates

Implement the work; **do not commit unless asked**.

Must-have tests (keyless unless skip-gated):

- Disposer invertibility (fake `ctx`)
- Profile session smoke (`DSH_LIVE_SMOKE`)
- Stable-id fence (row ids / namespaces / paths — not Fiber ids)
- Slot collisions fail before mount
- Kernel deny (checker, approval, plugin bundle, QA)
- Atomic install / restart / rollback
- HMR drain / fail-closed
- Uninstall Improveness does **not** delete accepted siblings
- Playbook search still stages; plugin search applies

`bash harness/omp/scripts/qa.sh` remains the product check.

## Agent orchestration

N/A — single implementation pass on the overlay + plugin tree.

## Frozen physics (kernel)

- Checker (`harness/omp/evals/checker/`)
- Approval / permissions
- Model routes
- Cordis loader
- Improveness QA (`validate.sh`, `qa.sh`, CACD, overlay CI)
- The `dsh-improveness` bundle itself (`plugins/dsh-improveness/`)

## Generated-plugin apply target

Profile-owned, never the bundle:

- Live DSH: `$DSH_HOME/profiles/improveness/improveness-generated/<id>/`
- Tests / checkout: `harness/omp/generated/<id>/`

Immutable candidates under `.candidates/`; atomic replace onto `<id>/`; previous copy at `<id>.bak` for rollback.

## Two-speed

| Speed | Mechanism |
|-------|-----------|
| JIT | Session-owned ephemeral plugins via `mountEphemeral(sessionId, package, slot)` / Creator tools `inspect/define/run/stop` |
| AOT | After `decideAccept`, durable plugin + patch + `hotReload` |

## Node / Bun protocol

JSONL on stdin/stdout. Node HostPort spawns the packaged Bun runner (`harness/omp/drivers/dsh-core-runner.ts`, copied into the bundle `runtime/` on prepare). Methods: `ping`, `decideAccept`, `scorePlaybook`, `applyDurable`, `exportTrace`, `frozenIds`, `slots`.

ponytail: JSONL subprocess instead of extracting `packages/improveness-core` until the P1 OMP adapter needs a shared import. Ceiling: extra hop latency. Upgrade: one TS package both processes import.

## Eval policy

No public Terminal-Bench as fitness. Local 20-fixture Harbor-shaped suite stays the keyless gate. Live-model gains are not README claims until measured.

## Working snapshot (P1 OMP adapter)

D14 still applies when the host is Oh My Pi: the **working snapshot** is the apply target for that adapter. Default P0 host is DSH generated plugins.

## Named techniques (README)

Two-Speed · Live Ratchet · Frozen Physics · Harness Slots · Filesystem Evidence Plane


## D16 — Two-section split (approved)

See [DECISIONS.md](DECISIONS.md) D16 and [docs/methods/sections.md](docs/methods/sections.md). Feature branch `cursor/two-section-jit-improve-35d0`.

**In:** Load-time section flags; hierarchical ToolCatalog; event-driven tool inject; JIT M/P/A/C template synthesizer; short-term + long-term improve drivers; README/EXTENSIVE sync; CI green.

**Out:** JIT-Agent 27B training; free-form JIT `apply()` codegen; OMP TTSR rewrite; runtime section toggle (P1).
