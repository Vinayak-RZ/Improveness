import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { exportSession } from "../drivers/export-session.ts";
import { applyDurablePlugin, defaultGeneratedRoot } from "../drivers/apply-snapshot.ts";
import { assertEvolverWrite } from "../drivers/allowlist.ts";
import { createJitRuntime } from "../../../plugins/dsh-improveness/src/jit.js";
import { DSH_FROZEN_IDS } from "../../../plugins/dsh-improveness/src/frozen-ids.js";
import { emptySlots } from "../../../plugins/dsh-improveness/src/slots.js";

/**
 * P1 Oh My Pi HostPort. Parked snapshot at oh-my-pi/; overlay writes stay allowlisted.
 * OMP has no first-class unload — needsRestart is true for snapshot source edits.
 */
export function createOmpHostPort(options: { repoRoot: string; jit?: ReturnType<typeof createJitRuntime> }) {
  const repoRoot = options.repoRoot;
  const jit = options.jit ?? createJitRuntime({ drainMs: 50 });

  return {
    exportTrace(jsonlPath: string, tracesRoot: string) {
      return exportSession(jsonlPath, tracesRoot);
    },
    listCapabilities() {
      return ["playbook", "overlay-tools", "overlay-skills", "snapshot-source"];
    },
    frozenIds() {
      return [...DSH_FROZEN_IDS, "omp.approval", "omp.system-prompt", "omp.model-roles"];
    },
    slots() {
      return jit.occupancy();
    },
    mountEphemeral(sessionId: string, pkg: { id: string; slot: "memory" | "planning" | "action" | "capability"; apply?: (ctx: unknown) => () => void }) {
      return jit.define(sessionId, pkg);
    },
    unmount(sessionId: string, id: string) {
      return jit.stop(sessionId, id);
    },
    applyDurable(manifest: { id: string; files: Record<string, string>; slot?: "capability" }) {
      const overlayFiles = Object.entries(manifest.files).filter(([rel]) => rel.startsWith("harness/omp/overlay/") || rel.startsWith("harness/omp/generated/"));
      for (const [rel] of overlayFiles) {
        if (rel.startsWith("harness/omp/overlay/") || rel.startsWith("harness/omp/generated/")) {
          assertEvolverWrite(join(repoRoot, rel), repoRoot);
        }
      }
      const generated = Object.fromEntries(
        Object.entries(manifest.files).filter(([rel]) => rel.includes("generated/") || rel.endsWith("apply.js")),
      );
      if (Object.keys(generated).length > 0) {
        const files: Record<string, string> = {};
        for (const [rel, body] of Object.entries(generated)) {
          const inner = rel.replace(/^.*generated\/[^/]+\//, "").replace(/^.*\//, "") || "apply.js";
          files[inner.includes(".") ? inner : "apply.js"] = body;
        }
        if (!files["apply.js"] && Object.keys(files).length === 1) {
          const only = Object.values(generated)[0];
          files["apply.js"] = only;
        }
        return applyDurablePlugin({
          id: manifest.id,
          slot: manifest.slot ?? "capability",
          files: files["apply.js"] ? files : { "apply.js": Object.values(generated)[0] },
          repoRoot,
          generatedRoot: defaultGeneratedRoot(repoRoot),
        });
      }
      for (const [rel, body] of overlayFiles) {
        const abs = join(repoRoot, rel);
        mkdirSync(dirname(abs), { recursive: true });
        writeFileSync(abs, body.endsWith("\n") ? body : `${body}\n`);
      }
      return { id: manifest.id, dir: join(repoRoot, "harness/omp/overlay/.omp"), previousDir: null, needsRestart: true };
    },
    hotReload() {
      return { reloaded: false, needsRestart: true, drained: true };
    },
    needsRestart() {
      return true;
    },
    emptySlots,
  };
}
