import type { DomainKernelPort } from "./types.ts";

const factories = new Map<string, () => DomainKernelPort>();

export function registerDomainKernelAdapter(id: string, factory: () => DomainKernelPort): void {
  if (!id.trim()) throw new Error("adapter id required");
  factories.set(id, factory);
}

export function getDomainKernelAdapter(id: string): DomainKernelPort {
  const factory = factories.get(id);
  if (!factory) {
    throw new Error(`unknown domain kernel adapter: ${id} (registered: ${listDomainKernelAdapterIds().join(", ") || "none"})`);
  }
  return factory();
}

export function listDomainKernelAdapterIds(): string[] {
  return [...factories.keys()].sort();
}

export function clearDomainKernelAdapters(): void {
  factories.clear();
}
