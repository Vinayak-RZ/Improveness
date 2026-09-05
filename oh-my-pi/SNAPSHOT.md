# Oh My Pi parked snapshot

Improveness-owned working copy of [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) (D8 / D19). Nested `.git` is stripped — Improveness git history owns this tree.

| Field | Value |
|-------|-------|
| **Upstream** | https://github.com/can1357/oh-my-pi |
| **Ref** | `main` |
| **SHA** | `5964a0f7649275bcde818f20073193fd032451f2` |
| **Date** | 2026-09-04T20:37:03+02:00 |
| **Tip subject** | Merge pull request #10838 from H4vC/feat/wait-for-usage-reset |
| **packageManager** | see root `package.json` `packageManager` field |

## Rules

- **Do not** patch `oh-my-pi/packages/*` for ModelTaste (D18). Strap via HostPort only.
- Overlay merge: `bash harness/omp/scripts/install-overlay.sh` (Improveness-owned trees under `.omp/` only).
- Upstream license remains Oh My Pi’s; root MIT does not re-license this tree.
- **OAuth clients are not shipped.** Google Antigravity / Gemini CLI `client-id` / `client-secret` values in `packages/catalog/src/compat/rules/auth/*.kdl` (and compiled `rules.json`) are placeholders (`REDACTED_SET_OMP_GOOGLE_*`). Set `OMP_GOOGLE_*` env vars from a local upstream checkout (see root `.env.example`). Improveness OAuth TypeScript adapters read those env vars and refuse to start without them.

## Refresh

```bash
git clone --depth 1 https://github.com/can1357/oh-my-pi.git /tmp/omp-fresh
SHA=$(git -C /tmp/omp-fresh rev-parse HEAD)
rm -rf /tmp/omp-fresh/.git
# replace oh-my-pi/, keep this SNAPSHOT.md updated with SHA/date
bash harness/omp/scripts/install-overlay.sh
bash harness/omp/scripts/qa.sh
```
