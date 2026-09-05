# Project hardening gate

Continuous baseline for Improveness. **STRONG_RELEASE** may not go green until this file’s **P0** section is complete.

Authority: [DECISIONS.md](../DECISIONS.md) D15–D19 · [harness/omp/KERNEL.md](../harness/omp/KERNEL.md)

## P0 — must before strong release

### Snapshot currency (D19)

- [ ] `oh-my-pi/SNAPSHOT.md` present with upstream URL, SHA, date
- [ ] Overlay re-merged after refresh (`harness/omp/scripts/install-overlay.sh`)
- [ ] HostPort / qa green on refreshed tree
- [ ] No Improveness Taste patches under `oh-my-pi/packages/`

### CI / QA inventory

- [ ] `harness/omp/scripts/qa.sh` covers fixtures, sims, inventory, discrepancy
- [ ] Claim-ledger ↔ README discrepancy check fails CI on drift
- [ ] Import-graph: `packages/improveness-modeltaste` forbids host deps

### Live smoke + packaged runner

- [ ] `DSH_LIVE_SMOKE=1` path documented and skip-gated in default CI
- [ ] Bun runner copy packaged into `plugins/dsh-improveness` bundle

### Section-disable / uninstall matrix

- [ ] `IMPROVENESS_JIT=0` leaves Improve (+ Taste if on) functional
- [ ] `IMPROVENESS_IMPROVE=0` leaves JIT (+ Taste if on) functional
- [ ] `IMPROVENESS_TASTE=0` registers zero Taste hooks
- [ ] Uninstall plugin: no Cordis Taste residue in host kernel

### Claim honesty

- [ ] Automated forbidden-phrase / ledger check in qa
- [ ] Live-model gains only appear after ledger row exists

### Security fence

- [ ] KERNEL paths immutable from evolver / Taste repairs
- [ ] No secrets in profiles, fixtures, or demo artifacts

### Agent-operable surfaces

- [ ] Taste + core improve RPCs usable without TUI
- [ ] Structured errors on deny / fence

### Surface minimalism (ponytail)

- [ ] Single repair implementation in `packages/improveness-modeltaste` (no Node/Bun fork)
- [ ] Dead code / duplicate adapters removed

## P1 — defer ok

- [ ] Mid-session section toggles
- [ ] Second live host measured campaign
- [ ] Preference / taste-file learning layer

## Sign-off

| Role | Date | Notes |
|------|------|-------|
| Lead agent | | |
| Human | | |

P0 status: **RED** until all P0 boxes are checked.
