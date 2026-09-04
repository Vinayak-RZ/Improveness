import { createInterface } from "node:readline";
import { applyDurablePlugin, defaultGeneratedRoot } from "./apply-snapshot.ts";
import { exportSession } from "./export-session.ts";
import { decideAccept } from "./self-harness.ts";
import { scorePlaybook } from "./playbook-solver.ts";
import { improveShort } from "./improve-short.ts";
import { improveLong } from "./improve-long.ts";
import { DSH_FROZEN_IDS } from "../../../plugins/dsh-improveness/src/frozen-ids.js";
import { emptySlots } from "../../../plugins/dsh-improveness/src/slots.js";

type Rpc = { id: number; method: string; params?: Record<string, unknown> };

async function handle(rpc: Rpc): Promise<unknown> {
  const p = rpc.params ?? {};
  switch (rpc.method) {
    case "ping":
      return { pong: true };
    case "frozenIds":
      return [...DSH_FROZEN_IDS];
    case "slots":
      return emptySlots();
    case "decideAccept":
      return decideAccept(p.heldInBefore as never, p.heldInAfter as never, p.heldOutBefore as never, p.heldOutAfter as never);
    case "scorePlaybook":
      return scorePlaybook(String(p.evalsRoot), p.split as "held-in" | "held-out", String(p.playbook));
    case "exportTrace":
      return exportSession(String(p.jsonlPath), String(p.tracesRoot));
    case "applyDurable": {
      const repoRoot = String(p.repoRoot ?? process.cwd());
      return applyDurablePlugin({
        id: String(p.id),
        slot: (p.slot as "capability") ?? "capability",
        files: (p.files as Record<string, string>) ?? {},
        repoRoot,
        generatedRoot: typeof p.generatedRoot === "string" ? p.generatedRoot : defaultGeneratedRoot(repoRoot),
      });
    }
    case "improveShort":
      return improveShort({
        repoRoot: String(p.repoRoot ?? process.cwd()),
        playbookPath: typeof p.playbookPath === "string" ? p.playbookPath : undefined,
        trajectoryPath: typeof p.trajectoryPath === "string" ? p.trajectoryPath : undefined,
        lesson: typeof p.lesson === "string" ? p.lesson : undefined,
        passed: typeof p.passed === "boolean" ? p.passed : undefined,
      });
    case "improveLong":
      return improveLong({
        repoRoot: String(p.repoRoot ?? process.cwd()),
        archiveRoot: typeof p.archiveRoot === "string" ? p.archiveRoot : undefined,
        minParents: typeof p.minParents === "number" ? p.minParents : undefined,
        stepCap: typeof p.stepCap === "number" ? p.stepCap : undefined,
        dryRun: p.dryRun === true,
      });
    default:
      throw new Error(`unknown method: ${rpc.method}`);
  }
}

export async function serveStdin(): Promise<void> {
  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    let rpc: Rpc;
    try {
      rpc = JSON.parse(line) as Rpc;
    } catch {
      console.log(JSON.stringify({ id: 0, ok: false, error: "invalid json" }));
      continue;
    }
    try {
      const result = await handle(rpc);
      console.log(JSON.stringify({ id: rpc.id, ok: true, result }));
    } catch (error) {
      console.log(JSON.stringify({ id: rpc.id, ok: false, error: error instanceof Error ? error.message : String(error) }));
    }
  }
}

if (import.meta.main) {
  await serveStdin();
}
