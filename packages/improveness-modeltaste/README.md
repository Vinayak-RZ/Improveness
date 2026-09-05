# @improveness/modeltaste

Host-agnostic **ModelTaste** library ([D17](../../DECISIONS.md) / [D18](../../DECISIONS.md)).

- Zero imports from `plugins/*` or `oh-my-pi/packages/*`
- Validate → repair on failure → teach-back
- Strap via HostPort only; disable with `IMPROVENESS_TASTE=0`

```ts
import { loadProfile, detectFailures, applyRepairs, evaluateFit } from "@improveness/modeltaste";
```
