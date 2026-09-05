# Strong release gate

**No soft / weak public launch.** Marketing, “launch” posts, and star-chasing are blocked until every **P0** box below is checked. If the fit-suite live primary metric delta is ≤ 0, **do not release** — fix or narrow claims.

Authority: [DECISIONS.md](../DECISIONS.md) D17–D19 · [CLAIM_LEDGER.md](CLAIM_LEDGER.md) · [PROJECT_HARDENING.md](PROJECT_HARDENING.md)

## 1. Release philosophy

- [ ] Stars without substance refused
- [ ] README claims ⊆ CLAIM_LEDGER
- [ ] No “first / SOTA / multi-host proven” without ledger rows
- [ ] Soft launch explicitly rejected

## 2. Product completeness

- [ ] Install path documented (`dsh plugin --profile improveness add …`)
- [ ] Uninstall leaves host kernel clean (Taste code gone; siblings only in profile-owned dir)
- [ ] Sections independently disableable: `IMPROVENESS_JIT`, `IMPROVENESS_IMPROVE*`, `IMPROVENESS_TASTE`, `IMPROVENESS_EVENT_INJECT`
- [ ] HostPort DSH strap works
- [ ] HostPort OMP attach/detach works (no writes under `oh-my-pi/packages/`)

## 3. Modularity proof (D18)

- [ ] `packages/improveness-modeltaste` has zero host imports (CI import-graph)
- [ ] `IMPROVENESS_TASTE=0` → zero Taste repair hooks registered (unstrap test)
- [ ] Strap/unstrap session leaves `oh-my-pi/packages` untouched
- [ ] Removing Taste package does not break JIT/Improve when Taste is off

## 4. ModelTaste readiness (D17)

- [ ] ≥5 Taste-class repairs with unit tests
- [ ] DeepSeek + Qwen3 ModelProfiles shipped inside the package
- [ ] Validate-then-repair + teach-back wired
- [ ] Agent RPC: inspect / analyze / proposeRepair / applyEphemeral without TUI

## 5. Evidence

- [ ] Keyless `qa.sh` green on mainline branch
- [ ] Live DSH smoke green once (`DSH_LIVE_SMOKE=1`)
- [ ] Private fit-suite keyless CI green
- [ ] ≥1 live measured before/after row in CLAIM_LEDGER (DeepSeek-class on DSH)
- [ ] OMP snapshot SHA recorded in `oh-my-pi/SNAPSHOT.md`

## 6. Honesty

- [ ] Claim-ledger discrepancy check in `qa.sh` passes
- [ ] Forbidden-phrase scan clean (first/SOTA/fake stars/public TB as fitness)
- [ ] “Inspired by Taste, not a Command Code port” wording where Taste is cited

## 7. Agent UX

- [ ] Agent can complete analyze → propose → ephemeral apply without human clicks
- [ ] RPC schemas strict; structured errors; step caps documented

## 8. Packaging

- [ ] Bun runner packaged into DSH bundle
- [ ] Package `private: false` (or publishable equivalent)
- [ ] License, changelog, semver coherent
- [ ] CI badge green on default branch

## 9. Demo kit

- [ ] 3–5 min recording or scripted demo
- [ ] One-command repro
- [ ] Taste off/on comparison table (ledger-safe numbers only)

## 10. Security

- [ ] Fence tests: repairs cannot touch KERNEL / checker
- [ ] No secrets in profiles or fixtures
- [ ] Repair allowlist only (no free-form host mutation)

## 11. Launch checklist (only after P0 above)

- [ ] README + topics updated
- [ ] Draft → ready PR
- [ ] Awesome-list / HN / Reddit **only after** this file’s P0 sign-off

## 12. Kill criteria

- If live fit-suite primary metric **delta ≤ 0** with Taste on vs off → **do not release**
- If modularity / unstrap tests fail → **do not release**
- If claim ledger and README disagree → **do not release**

## 13. Sign-off

| Role | Name | Date | Initials |
|------|------|------|----------|
| Lead agent | | | |
| Human | | | |

P0 status: **RED** until all sections 1–10 P0 boxes are checked.
