# Project hardening gate

Continuous baseline for Improveness. **STRONG_RELEASE** may not go green until this file’s **P0** section is complete.

Authority: [DECISIONS.md](../DECISIONS.md) D15–D19 · [harness/omp/KERNEL.md](../harness/omp/KERNEL.md)

## P0 — must before strong release

### Snapshot currency (D19)

- [x] `oh-my-pi/SNAPSHOT.md` present with upstream URL, SHA, date
- [x] Overlay re-merged after refresh (`harness/omp/scripts/install-overlay.sh`)
- [x] HostPort / qa green on refreshed tree
- [x] No Improveness Taste patches under `oh-my-pi/packages/`

### CI / QA inventory

- [x] `harness/omp/scripts/qa.sh` covers fixtures, sims, inventory, discrepancy
- [x] Claim-ledger ↔ README discrepancy check fails CI on drift (`claim-honesty.ts` in `qa-repo`)
- [x] Import-graph: `packages/improveness-modeltaste` forbids host deps

### Live smoke + packaged runner

- [x] `DSH_LIVE_SMOKE=1` path documented (`.env.example`) and skip-gated in default CI (`dsh-live-smoke.ts` + overlay workflow)
- [x] Bun runner copy packaged into `plugins/dsh-improveness` bundle

### Section-disable / uninstall matrix

- [x] `IMPROVENESS_JIT=0` leaves Improve (+ Taste if on) functional
- [x] `IMPROVENESS_IMPROVE=0` leaves JIT (+ Taste if on) functional
- [x] `IMPROVENESS_TASTE=0` registers zero Taste hooks
- [x] Uninstall / dispose: no Cordis Taste residue in host kernel (disposer clears taste tools)

### Claim honesty

- [x] Automated forbidden-phrase / ledger check in qa
- [x] Live-model gains only appear after ledger row exists (claim-honesty refuses premature README claims)

### Security fence

- [x] KERNEL paths immutable from evolver / Taste repairs
- [x] No secrets in profiles, fixtures, or demo artifacts (`taste-secrets` qa finding)

### Agent-operable surfaces

- [x] Taste + core improve RPCs usable without TUI
- [x] Structured errors on deny / fence (`TasteError` with `code` + `toJSON`)

### Surface minimalism (ponytail)

- [x] Single repair implementation in `packages/improveness-modeltaste` (no Node/Bun fork)
- [x] Dead code / duplicate adapters removed (thin DSH/OMP straps only)

## P1 — defer ok

- [ ] Mid-session section toggles
- [ ] Second live host measured campaign
- [ ] Preference / taste-file learning layer

## Sign-off

| Role | Date | Notes |
|------|------|-------|
| Lead agent | 2026-09-05 | Keyless P0 green; live smoke/fit still blocked on API keys |
| Human | | |

P0 status: **GREEN (keyless)**. Live evidence for STRONG_RELEASE remains **RED** until `DSH_LIVE_SMOKE` + `IMPROVENESS_FIT_LIVE` fill a CLAIM_LEDGER row.
