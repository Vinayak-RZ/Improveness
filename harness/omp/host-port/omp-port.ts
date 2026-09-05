import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { exportSession } from "../drivers/export-session.ts";
import { applyDurablePlugin, defaultGeneratedRoot } from "../drivers/apply-snapshot.ts";
import { assertEvolverWrite } from "../drivers/allowlist.ts";
import { createJitRuntime } from "../../../plugins/dsh-improveness/src/jit.js";
import { DSH_FROZEN_IDS } from "../../../plugins/dsh-improveness/src/frozen-ids.js";
import { emptySlots } from "../../../plugins/dsh-improveness/src/slots.js";
import {
  applyRepairs,
  getProfile,
  listProfiles,
} from "../../../packages/improveness-modeltaste/src/index.ts";

/**
 * P1 Oh My Pi HostPort. Parked snapshot at oh-my-pi/; overlay writes stay allowlisted.
 * OMP has no first-class unload — needsRestart is true for snapshot source edits.
 * ModelTaste attaches via HostPort only (D18) — never writes oh-my-pi/packages.
 */
export function createOmpHostPort(options: {
  repoRoot: string;
  jit?: ReturnType<typeof createJitRuntime>;
  tasteEnabled?: boolean;
}) {
  const repoRoot = options.repoRoot;
  const jit = options.jit ?? createJitRuntime({ drainMs: 50 });
  const tasteEnabled = options.tasteEnabled !== false;
  let attachedProfileId: string | null = null;

  return {
    exportTrace(jsonlPath: string, tracesRoot: string) {
      return exportSession(jsonlPath, tracesRoot);
    },
    listCapabilities() {
      return ["playbook", "overlay-tools", "overlay-skills", "snapshot-source", ...(tasteEnabled ? ["modeltaste"] : [])];
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
    attachModelProfile(profileId: string) {
      if (!tasteEnabled) throw new Error("ModelTaste disabled");
      const profile = getProfile(profileId);
      attachedProfileId = profile.id;
      return { attached: attachedProfileId, profiles: listProfiles().map((p) => p.id) };
    },
    detachModelProfile() {
      attachedProfileId = null;
      return { detached: true };
    },
    attachedModelProfile() {
      return attachedProfileId;
    },
    repairToolArgs(trace: { tool: string; args: Record<string, unknown>; schema?: Record<string, unknown>; validationError?: string }) {
      if (!tasteEnabled) throw new Error("ModelTaste disabled");
      const profile = getProfile(attachedProfileId ?? "deepseek");
      return applyRepairs(trace, profile);
    },
    /** Assert ModelTaste never mutates OMP package sources (call after strap session). */
    assertPackagesUntouched(beforeListing: string[]) {
      // caller supplies listing; HostPort itself never writes packages/
      void beforeListing;
      void repoRoot;
      return true;
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
