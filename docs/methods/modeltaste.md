# ModelTaste

Third Improveness section ([D17](../../DECISIONS.md)): **model×harness fit** without changing weights.

## Problem

Open hosts run many backbones. Models fail tool contracts in repeatable ways (string where array expected, markdown autolink in paths, null vs omit, relational args, unreadable Zod dumps). Fixing the **harness contract** (validate → repair → teach-back) often beats blaming the model — the Taste lesson from Command Code / Ahmad Awais (harness-contract half only; preference product is P1).

## Placement

| Layer | Path | Role |
|-------|------|------|
| Pure library | `packages/improveness-modeltaste` | Profiles, detectors, repairs, dialects, fit metrics |
| HostPort | `harness/omp/host-port/` | `attachModelProfile` / `detachModelProfile` |
| DSH strap | `plugins/dsh-improveness` | `IMPROVENESS_TASTE` + agent RPC |
| OMP strap | `createOmpHostPort` | Catalog + attach; **no** `oh-my-pi/packages` edits |

## Policy

1. **Validate first** — never preprocess valid tool args.
2. **Repair only on failure** — path-targeted, allowlisted repairs.
3. **Teach-back** — surface what was repaired in model-facing error/result text.
4. **Promote** — durable changes still pass `decideAccept` + frozen checker.

## Disable

`IMPROVENESS_TASTE=0` — no hooks registered (unstrap proof).

## Related

- [composability.md](composability.md) — strap/unstrap contract (D18)
- [sections.md](sections.md) — JIT / Improve / Taste flags
- [host-port.md](host-port.md) — thin adapter
- [CLAIM_LEDGER.md](../CLAIM_LEDGER.md) — measured claims only
