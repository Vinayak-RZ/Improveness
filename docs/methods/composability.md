# Composability (strap / unstrap)

[D18](../../DECISIONS.md): Improveness capabilities — especially ModelTaste — must be **addable and removable** without editing host kernels.

## Rules

1. **Pure package** — `packages/improveness-modeltaste` imports neither `plugins/*` nor `oh-my-pi/packages/*`.
2. **Thin HostPort only** — hosts call `attachModelProfile` / `detachModelProfile`; no Taste patches in OMP package sources.
3. **Section flags** — `IMPROVENESS_JIT`, `IMPROVENESS_IMPROVE*`, `IMPROVENESS_TASTE` independently disable load-time registration.
4. **Capability slots** — Taste repairs occupy ordered capability hooks; they do not squat memory/planning/action singletons unless HostPort explicitly requests a slot (collision fails closed).
5. **Overlay hygiene** — `install-overlay.sh` copies Improveness-owned trees only; never deletes upstream OMP commands/skills.
6. **Single implementation** — Bun core owns repair logic; Node DSH calls it via JSONL/RPC (no duplicated repair code).

## Unstrap proof (tests must assert)

| Action | Result |
|--------|--------|
| `IMPROVENESS_TASTE=0` | Zero Taste repair hooks on hot path |
| Uninstall `dsh-improveness` | No Cordis Taste residue; generated siblings may remain in profile-owned dir |
| HostPort detach | Middleware removed; session continues |
| Taste session on OMP | `oh-my-pi/packages/**` file tree unchanged |

## Related

- [modeltaste.md](modeltaste.md)
- [spatiotemporal-composability.md](spatiotemporal-composability.md)
- [helix.md](helix.md)
