#!/usr/bin/env bun
/**
 * Keyless improve loop for a TargetPort (domain kernel, harness, or any agentic system).
 *
 *   bun harness/omp/drivers/improve-target.ts --target arc
 *   bun harness/omp/drivers/improve-target.ts --target generic-agentic
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { improveTarget, loadTarget } from "../target-port/index.ts";
import { assertTargetWrite } from "./allowlist.ts";

function repoRoot(): string {
  return join(import.meta.dir, "../../..");
}

function arg(flag: string, fallback: string): string {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

function help(): string {
  return `Usage: bun harness/omp/drivers/improve-target.ts --target <id> [--playbook <path>]

Targets live under harness/omp/targets/<id>/manifest.json.
Kinds: domain-kernel | agentic-harness | agentic-system.

Optional ARC_ROOT is P1 (live electrical-engineer eval). This CLI is keyless.
`;
}

function demoPlaybook(kind: string): string {
  if (kind === "domain-kernel") {
    return [
      "- [s-arc-001] recipe:solve-circuit — run the named lab recipe; ohms come from a check.",
      "- [s-arc-002] recipe:cite-chapter — retrieve then explain; do not mint ohms.",
      "- [s-arc-003] recipe:label-unverified — if no check ran, use the exact token unchecked.",
    ].join("\n");
  }
  if (kind === "agentic-harness") {
    return "- [s-harness-001] recipe:memory-slot — one memory occupant; collisions fail before mount.\n";
  }
  return [
    "- [s-sys-001] recipe:confirm-before-send — never send without a confirm artifact.",
    "- [s-sys-002] recipe:strict-tool-schema — reject extra keys on tool args.",
    "- [s-sys-003] recipe:refuse-exfil — do not paste secrets into briefs.",
  ].join("\n");
}

function run(): number {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    process.stdout.write(help());
    return 0;
  }
  const root = repoRoot();
  const id = arg("--target", "arc");
  const target = loadTarget(root, id);
  const playbookPath = arg("--playbook", "");
  const before = playbookPath ? readFileSync(join(root, playbookPath), "utf8") : "";
  const after = playbookPath ? readFileSync(join(root, playbookPath), "utf8") : demoPlaybook(target.kind);

  const heldInBefore = target.score("held-in", before);
  const heldOutBefore = target.score("held-out", before);
  const heldInAfter = target.score("held-in", after);
  const heldOutAfter = target.score("held-out", after);

  const files = [
    {
      relPath: `${target.manifest.stagingPrefix}PLAYBOOK.md`,
      content: after,
    },
  ];

  // Proposer may only see held-in failing ids (Self-Harness).
  const heldInOnly = Object.entries(heldInBefore.byId)
    .filter(([, pass]) => !pass)
    .map(([fid]) => fid);
  for (const hidden of target.manifest.heldOutIds) {
    if (heldInOnly.includes(hidden)) throw new Error(`held-out id leaked to proposer: ${hidden}`);
  }

  const result = improveTarget({
    target,
    heldInBefore,
    heldOutBefore,
    heldInAfter,
    heldOutAfter,
    files,
    repoRoot: root,
  });

  const report = {
    target: target.id,
    kind: target.kind,
    frozenIds: target.frozenIds(),
    heldInOnly,
    heldIn: { before: heldInBefore.passed, after: heldInAfter.passed, total: heldInAfter.total },
    heldOut: { before: heldOutBefore.passed, after: heldOutAfter.passed, total: heldOutAfter.total },
    decision: result.decision,
    staged: result.staged,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  const frozenRel = target.manifest.frozenPrefixes[0];
  const probePath = frozenRel.endsWith("/")
    ? join(root, frozenRel, "probe.txt")
    : join(root, frozenRel);
  try {
    assertTargetWrite(probePath, root, target.manifest);
    process.stderr.write("frozen physics failed: write was allowed\n");
    return 2;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!/frozen physics|improveness kernel/.test(msg)) {
      process.stderr.write(`unexpected fence: ${msg}\n`);
      return 2;
    }
  }
  return result.decision === "accept" ? 0 : 1;
}

if (import.meta.main) {
  process.exit(run());
}
