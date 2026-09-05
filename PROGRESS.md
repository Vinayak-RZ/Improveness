# Progress

## Current phase

**ModelTaste + Hardening + Strong Release** — package, straps, fit-suite, and keyless hardening gates are green. Live DeepSeek-class measured row and live DSH smoke remain open (need API keys).

## Latest

| Item | Status |
|------|--------|
| D17–D19 ADRs + STRONG_RELEASE / PROJECT_HARDENING | done |
| OMP snapshot refresh + SNAPSHOT.md | done |
| `packages/improveness-modeltaste` (profiles, repairs, dialects, import fence) | done |
| DSH `IMPROVENESS_TASTE` thin strap + agent RPC + unstrap / dispose tests | done |
| OMP HostPort attach/detach + Qwen3 strap test | done |
| Private fit-suite keyless + demo.sh | done |
| Packaged runner + `private: false` | done |
| Claim-honesty + taste-secrets qa findings | done |
| Skip-gated `DSH_LIVE_SMOKE` driver + CI step + `.env.example` | done |
| Live DSH smoke green once | **open** (env keys) |
| Live fit ledger row (`IMPROVENESS_FIT_LIVE=1`) | **open** (env keys) |
| STRONG_RELEASE P0 | **RED** until live row |

## Remaining for strong release

1. `DSH_LIVE_SMOKE=1` green once with real credentials
2. `IMPROVENESS_FIT_LIVE=1` before/after → CLAIM_LEDGER live row with delta > 0
3. Human sign-off on STRONG_RELEASE.md
4. Marketing only after P0 green

## Blockers

- Live API credentials for DeepSeek-class fit campaign (and optional DSH smoke)
