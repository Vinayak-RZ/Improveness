import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import type { QaFinding } from "./qa-repo.ts";

const FORBIDDEN = [
  /\bSOTA\b/i,
  /\bstate of the art\b/i,
  /\bfirst (ever|to|open)\b/i,
  /\btrusted by\b/i,
  /\b\d{2,}k\+?\s*stars\b/i,
];

/** README score claims that must also appear in CLAIM_LEDGER. */
const LEDGER_PAIRS: Array<{ readme: string; ledger: string }> = [
  { readme: "0/12 → 7/12", ledger: "0/12 → 7/12" },
  { readme: "0/8 → 3/8", ledger: "0/8 → 3/8" },
  { readme: "MAX_STEP_CAP = 8", ledger: "MAX_STEP_CAP = 8" },
  { readme: "12 practice + 8 hidden", ledger: "12 held-in / 8 held-out" },
];

export function checkClaimHonesty(repoRoot: string): QaFinding[] {
  const root = resolve(repoRoot);
  const readmePath = join(root, "README.md");
  const ledgerPath = join(root, "docs/CLAIM_LEDGER.md");
  if (!existsSync(readmePath) || !existsSync(ledgerPath)) {
    return [{ id: "claim-honesty", ok: false, detail: "missing README.md or docs/CLAIM_LEDGER.md" }];
  }
  const readme = readFileSync(readmePath, "utf8");
  const ledger = readFileSync(ledgerPath, "utf8");
  const findings: QaFinding[] = [];

  for (const re of FORBIDDEN) {
    if (re.test(readme) && !readme.includes("Forbidden on this landing page") && !readme.includes("Forbidden")) {
      // Allow the README table that *documents* forbidden phrases.
      if (!readme.includes("first") || re.source.includes("SOTA") || re.source.includes("state of the art") || re.source.includes("trusted") || re.source.includes("stars")) {
        if (re.test(readme.split("Forbidden")[0] ?? readme)) {
          findings.push({ id: "claim-forbidden", ok: false, detail: `README matches ${re}` });
        }
      }
    }
  }

  for (const pair of LEDGER_PAIRS) {
    if (readme.includes(pair.readme) && !ledger.includes(pair.ledger)) {
      findings.push({
        id: "claim-discrepancy",
        ok: false,
        detail: `README has "${pair.readme}" but CLAIM_LEDGER lacks "${pair.ledger}"`,
      });
    }
  }

  const liveClaimed =
    /ModelTaste[\s\S]{0,80}(live|before.?after)[\s\S]{0,80}(\d+\/\d+|gain|delta|\+\d)/i.test(readme) ||
    /live DeepSeek[\s\S]{0,40}(Taste|fit)[\s\S]{0,40}(pass|\d+\.\d+)/i.test(readme);
  const liveStillOpen = /not yet filled|not yet|pending ledger/i.test(ledger);
  if (liveClaimed && liveStillOpen) {
    findings.push({
      id: "claim-live-premature",
      ok: false,
      detail: "README claims live ModelTaste gains while CLAIM_LEDGER live row is still open",
    });
  }

  if (findings.length === 0) {
    findings.push({ id: "claim-honesty", ok: true, detail: "README ⊆ ledger; forbidden phrases clean" });
  }
  return findings;
}

export function checkNoSecretsInTasteArtifacts(repoRoot: string): QaFinding {
  const root = resolve(repoRoot);
  const paths = [
    "packages/improveness-modeltaste/src",
    "evals/fit-suite/fixtures",
    "evals/fit-suite/results",
  ];
  const secretRe = /(api[_-]?key\s*[:=]\s*['\"]?[A-Za-z0-9_-]{16,}|Bearer\s+[A-Za-z0-9._-]{20,}|sk-[A-Za-z0-9]{20,})/i;
  for (const rel of paths) {
    const abs = join(root, rel);
    if (!existsSync(abs)) continue;
    const hits = scanDir(abs, secretRe);
    if (hits.length > 0) {
      return { id: "taste-secrets", ok: false, detail: hits.slice(0, 3).join("; ") };
    }
  }
  return { id: "taste-secrets", ok: true, detail: "no secret-shaped lines in taste artifacts" };
}

function scanDir(dir: string, re: RegExp): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) out.push(...scanDir(path, re));
    else if (/\.(ts|js|json|md)$/.test(name)) {
      const body = readFileSync(path, "utf8");
      if (re.test(body)) out.push(path);
    }
  }
  return out;
}
