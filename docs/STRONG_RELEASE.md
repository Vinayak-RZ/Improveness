# Strong release gate

**No soft / weak public launch.** Marketing, “launch” posts, and star-chasing are blocked until every **P0** box below is checked. If the fit-suite live primary metric delta is ≤ 0, **do not release** — fix or narrow claims.

Authority: [DECISIONS.md](../DECISIONS.md) D17–D19 · [CLAIM_LEDGER.md](CLAIM_LEDGER.md) · [PROJECT_HARDENING.md](PROJECT_HARDENING.md)

## 1. Release philosophy

- [x] Stars without substance refused
- [x] README claims ⊆ CLAIM_LEDGER
- [x] No “first / SOTA / multi-host proven” without ledger rows
- [x] Soft launch explicitly rejected

## 2. Product completeness

- [x] Install path documented (`dsh plugin --profile improveness add …`)
- [x] Uninstall leaves host kernel clean (Taste code gone; siblings only in profile-owned dir)
- [x] Sections independently disableable: `IMPROVENESS_JIT`, `IMPROVENESS_IMPROVE*`, `IMPROVENESS_TASTE`, `IMPROVENESS_EVENT_INJECT`
- [x] HostPort DSH strap works
- [x] HostPort OMP attach/detach works (no writes under `oh-my-pi/packages/`)

## 3. Modularity proof (D18)

- [x] `packages/improveness-modeltaste` has zero host imports (CI import-graph)
- [x] `IMPROVENESS_TASTE=0` → zero Taste repair hooks registered (unstrap test)
- [x] Strap/unstrap session leaves `oh-my-pi/packages` untouched
- [x] Removing Taste package does not break JIT/Improve when Taste is off

## 4. ModelTaste readiness (D17)

- [x] ≥5 Taste-class repairs with unit tests
- [x] DeepSeek + Qwen3 ModelProfiles shipped inside the package
- [x] Validate-then-repair + teach-back wired
- [x] Agent RPC: inspect / analyze / proposeRepair / applyEphemeral without TUI

## 5. Evidence

- [x] Keyless `qa.sh` green on mainline branch
- [ ] Live DSH smoke green once (`DSH_LIVE_SMOKE=1`)
- [x] Private fit-suite keyless CI green
- [ ] ≥1 live measured before/after row in CLAIM_LEDGER (DeepSeek-class on DSH)
- [x] OMP snapshot SHA recorded in `oh-my-pi/SNAPSHOT.md`

## 6. Honesty

- [x] Claim-ledger discrepancy check in `qa.sh` passes
- [x] Forbidden-phrase scan clean (first/SOTA/fake stars/public TB as fitness)
- [x] “Inspired by Taste, not a Command Code port” wording where Taste is cited

## 7. Agent UX

- [x] Agent can complete analyze → propose → ephemeral apply without human clicks
- [x] RPC schemas strict; structured errors; step caps documented

## 8. Packaging

- [x] Bun runner packaged into DSH bundle
- [x] Package `private: false` (or publishable equivalent)
- [x] License, changelog, semver coherent
- [ ] CI badge green on default branch

## 9. Demo kit

- [x] Scripted demo (`bash evals/fit-suite/demo.sh`) — 3–5 min screen recording still optional for launch day
- [x] One-command repro
- [x] Taste off/on comparison table (ledger-safe numbers only)

## 10. Security

- [x] Fence tests: repairs cannot touch KERNEL / checker
- [x] No secrets in profiles or fixtures
- [x] Repair allowlist only (no free-form host mutation)

## 11. Launch checklist (only after P0 above)

- [x] README + topics updated
- [x] Draft PR opened (ready only after live ledger row)
- [ ] Awesome-list / HN / Reddit **only after** this file’s P0 sign-off

## 12. Kill criteria

- If live fit-suite primary metric **delta ≤ 0** with Taste on vs off → **do not release**
- If modularity / unstrap tests fail → **do not release**
- If claim ledger and README disagree → **do not release**

## 13. Sign-off

| Role | Name | Date | Initials |
|------|------|------|----------|
| Lead agent | 2026-09-05 | keyless P0 green; live evidence blocked on API keys | |
| Human | | | |

P0 status: **RED** until all sections 1–10 P0 boxes are checked.
