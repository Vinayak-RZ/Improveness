import { mkdirSync, rmSync, writeFileSync, existsSync, readFileSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { createJitRuntime } from "./jit.js";
import { DSH_FROZEN_IDS } from "./frozen-ids.js";
import { emptySlots } from "./slots.js";
import { callCore } from "./core-client.js";

export function generatedRootFromEnv(repoRoot) {
  if (process.env.DSH_HOME) {
    return join(process.env.DSH_HOME, "profiles/improveness/improveness-generated");
  }
  if (process.env.IMPROVENESS_GENERATED) return process.env.IMPROVENESS_GENERATED;
  return join(repoRoot, "harness/omp/generated");
}

export function createDshHostPort(options = {}) {
  const repoRoot = options.repoRoot ?? process.cwd();
  const generatedRoot = options.generatedRoot ?? generatedRootFromEnv(repoRoot);
  const jit = options.jit ?? createJitRuntime({ ctx: options.ctx, drainMs: options.drainMs });
  let lastReload = { id: null, needsRestart: false };

  return {
    jit,
    generatedRoot,
    exportTrace(jsonlPath, tracesRoot) {
      return callCore("exportTrace", { jsonlPath, tracesRoot });
    },
    listCapabilities() {
      return [
        "inspect",
        "catalog",
        "define",
        "run",
        "stop",
        "synthesize",
        "promote",
        "improveShort",
        "improveLong",
        "emit",
        "playbook-search",
      ];
    },
    frozenIds() {
      return [...DSH_FROZEN_IDS];
    },
    slots() {
      return jit.occupancy();
    },
    mountEphemeral(sessionId, pkg, slot) {
      return jit.define(sessionId, { ...pkg, slot: slot ?? pkg.slot });
    },
    async unmount(sessionId, id) {
      await jit.stop(sessionId, id);
    },
    applyDurable(manifest) {
      if (typeof options.applyFn === "function") return options.applyFn(manifest);
      return callCore("applyDurable", { ...manifest, repoRoot, generatedRoot });
    },
    hotReload(id) {
      const occupancy = jit.occupancy();
      const mounted = occupancy.capability.includes(id) || occupancy.memory === id || occupancy.planning === id || occupancy.action === id;
      if (!mounted) {
        lastReload = { id, needsRestart: true, reloaded: false, drained: true };
        return lastReload;
      }
      lastReload = { id, needsRestart: false, reloaded: true, drained: jit.inflight("hmr", id) === 0 };
      if (!lastReload.drained) {
        throw new Error(`hmr fail-closed: in-flight ${id}`);
      }
      return lastReload;
    },
    needsRestart(id) {
      return lastReload.id === id && lastReload.needsRestart;
    },
    emptySlots,
  };
}

export function writeGeneratedFiles(dir, files) {
  mkdirSync(dir, { recursive: true });
  for (const [rel, body] of Object.entries(files)) {
    const abs = join(dir, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, body.endsWith("\n") ? body : `${body}\n`);
  }
}

export { existsSync, readFileSync, renameSync, rmSync, writeFileSync };
