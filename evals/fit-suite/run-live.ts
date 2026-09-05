#!/usr/bin/env bun
/**
 * Skip-gated live ModelTaste fit run.
 * Default CI must not set IMPROVENESS_FIT_LIVE — this exits 0 when unset.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

if (process.env.IMPROVENESS_FIT_LIVE !== "1") {
  console.log("IMPROVENESS_FIT_LIVE not set — skipping live fit run");
  process.exit(0);
}

// ponytail: live path records a placeholder ledger-shaped JSON until wired to a real host session.
const outDir = join(import.meta.dir, "results");
mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const row = {
  kind: "modeltaste-fit-live",
  at: new Date().toISOString(),
  host: "dsh",
  model: process.env.IMPROVENESS_FIT_MODEL ?? "deepseek-chat",
  note: "Live runner scaffold — populate after DSH_LIVE_SMOKE session; do not claim without CLAIM_LEDGER row.",
  tasteOff: null,
  tasteOn: null,
};
writeFileSync(join(outDir, `live-${stamp}.json`), JSON.stringify(row, null, 2) + "\n");
console.log("wrote", join(outDir, `live-${stamp}.json`));
