/**
 * Domain kernel = frozen trust boundary + editable harness surfaces around a task agent.
 * HostPort is the legacy name for the adapter that connects Improveness to any host.
 */

export type HarnessSlot = "memory" | "planning" | "action" | "capability";

export type SlotOccupancy = {
  memory: string | null;
  planning: string | null;
  action: string | null;
  capability: string[];
};

export type DurableManifest = {
  id: string;
  files: Record<string, string>;
  slot?: HarnessSlot;
};

export type HotReloadResult = {
  reloaded?: boolean;
  needsRestart?: boolean;
  drained?: boolean;
  id?: string | null;
};

/** Minimal contract any agentic harness / host must expose for the improver loop. */
export type DomainKernelPort = {
  /** Stable adapter id, e.g. `dsh`, `omp`, `custom-jsonl`. */
  adapterId: string;
  exportTrace(jsonlPath: string, tracesRoot: string): unknown;
  listCapabilities(): string[];
  frozenIds(): string[];
  slots(): SlotOccupancy;
  mountEphemeral(
    sessionId: string,
    pkg: { id: string; slot?: HarnessSlot; apply?: (ctx: unknown) => () => void; [key: string]: unknown },
  ): unknown;
  unmount(sessionId: string, id: string): void | Promise<void>;
  applyDurable(manifest: DurableManifest): unknown;
  hotReload(id?: string): HotReloadResult;
  needsRestart(id?: string): boolean;
  emptySlots(): SlotOccupancy;
};

/** @deprecated Use DomainKernelPort — kept for docs and gradual renames. */
export type HostPort = DomainKernelPort;

export function asDomainKernelPort(
  adapterId: string,
  port: Omit<DomainKernelPort, "adapterId">,
): DomainKernelPort {
  return { adapterId, ...port };
}
