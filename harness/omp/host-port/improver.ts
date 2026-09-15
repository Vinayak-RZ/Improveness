import type { DomainKernelPort, DurableManifest } from "./types.ts";

/**
 * Host-agnostic improver facade: evidence export, frozen surface, JIT, and gated durable apply.
 * Bun core RPC (decideAccept, improveShort/Long) stays in dsh-core-runner; this wraps any port.
 */
export function createDomainKernelImprover(port: DomainKernelPort) {
  return {
    adapterId: port.adapterId,
    capabilities: () => port.listCapabilities(),
    frozenIds: () => port.frozenIds(),
    occupancy: () => port.slots(),
    exportEvidence(jsonlPath: string, tracesRoot: string) {
      return port.exportTrace(jsonlPath, tracesRoot);
    },
    mountSessionPlugin(
      sessionId: string,
      pkg: { id: string; slot?: "memory" | "planning" | "action" | "capability"; [key: string]: unknown },
    ) {
      return port.mountEphemeral(sessionId, pkg);
    },
    unmountSessionPlugin(sessionId: string, id: string) {
      return port.unmount(sessionId, id);
    },
    applyAfterGate(manifest: DurableManifest) {
      return port.applyDurable(manifest);
    },
    ratchet(id?: string) {
      return port.hotReload(id);
    },
    requiresProcessRestart(id?: string) {
      return port.needsRestart(id);
    },
  };
}
