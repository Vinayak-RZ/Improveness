import { createOmpHostPort } from "./omp-port.ts";
import { registerDomainKernelAdapter } from "./registry.ts";
import { asDomainKernelPort } from "./types.ts";
import { createDshHostPort } from "../../../plugins/dsh-improveness/src/host-port-dsh.js";

export function registerDefaultDomainKernelAdapters(repoRoot: string): void {
  registerDomainKernelAdapter("dsh", () => asDomainKernelPort("dsh", createDshHostPort({ repoRoot })));
  registerDomainKernelAdapter("omp", () => asDomainKernelPort("omp", createOmpHostPort({ repoRoot })));
}
