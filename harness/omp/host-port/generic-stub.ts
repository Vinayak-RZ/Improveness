import { emptySlots } from "../../../plugins/dsh-improveness/src/slots.js";
import type { DomainKernelPort, DurableManifest, HarnessSlot } from "./types.ts";

export type GenericStubHandle = DomainKernelPort & { lastApply(): DurableManifest | null };

/**
 * Minimal in-memory adapter for custom agentic systems that speak files + optional slots.
 * Real hosts should implement DomainKernelPort directly; this is for tests and scaffolding.
 */
export function createGenericDomainKernelStub(options: {
  adapterId: string;
  capabilities?: string[];
  frozenIds?: string[];
  onApply?: (manifest: DurableManifest) => unknown;
}): GenericStubHandle {
  const mounted = new Map<string, HarnessSlot>();
  let lastApply: DurableManifest | null = null;

  const port: GenericStubHandle = {
    adapterId: options.adapterId,
    exportTrace(_jsonlPath: string, tracesRoot: string) {
      return { tracesRoot, exported: 0, format: "stub" };
    },
    listCapabilities() {
      return options.capabilities ?? ["trace", "apply-stub"];
    },
    frozenIds() {
      return options.frozenIds ?? [`${options.adapterId}.kernel`];
    },
    slots() {
      const base = emptySlots();
      for (const [id, slot] of mounted) {
        if (slot === "capability") base.capability.push(id);
        else base[slot] = id;
      }
      return base;
    },
    mountEphemeral(sessionId: string, pkg: { id: string; slot?: HarnessSlot }) {
      const slot = pkg.slot ?? "capability";
      mounted.set(`${sessionId}:${pkg.id}`, slot);
      return { sessionId, id: pkg.id, slot };
    },
    unmount(sessionId: string, id: string) {
      mounted.delete(`${sessionId}:${id}`);
    },
    applyDurable(manifest: DurableManifest) {
      lastApply = manifest;
      if (options.onApply) return options.onApply(manifest);
      return { id: manifest.id, stub: true, files: Object.keys(manifest.files) };
    },
    hotReload() {
      return { reloaded: true, needsRestart: false, drained: true };
    },
    needsRestart() {
      return false;
    },
    emptySlots,
    lastApply() {
      return lastApply;
    },
  };

  return port;
}
