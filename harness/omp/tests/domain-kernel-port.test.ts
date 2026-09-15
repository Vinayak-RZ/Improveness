import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createDomainKernelImprover } from "../host-port/improver.ts";
import { createGenericDomainKernelStub } from "../host-port/generic-stub.ts";
import {
  clearDomainKernelAdapters,
  getDomainKernelAdapter,
  listDomainKernelAdapterIds,
  registerDomainKernelAdapter,
} from "../host-port/registry.ts";
import { registerDefaultDomainKernelAdapters } from "../host-port/register-defaults.ts";

describe("domain kernel port", () => {
  afterEach(() => clearDomainKernelAdapters());

  test("generic stub + improver facade", () => {
    const stub = createGenericDomainKernelStub({ adapterId: "lab-agent" });
    const improver = createDomainKernelImprover(stub);
    expect(improver.adapterId).toBe("lab-agent");
    expect(improver.frozenIds()).toContain("lab-agent.kernel");
    improver.applyAfterGate({ id: "c1", files: { "SKILL.md": "# x\n" } });
    expect(stub.lastApply()?.id).toBe("c1");
  });

  test("registry lists built-in adapters", () => {
    const root = mkdtempSync(join(tmpdir(), "dk-"));
    registerDefaultDomainKernelAdapters(root);
    const ids = listDomainKernelAdapterIds();
    expect(ids).toEqual(["dsh", "omp"]);
    const dsh = getDomainKernelAdapter("dsh");
    expect(dsh.adapterId).toBe("dsh");
    expect(dsh.listCapabilities().length).toBeGreaterThan(0);
  });

  test("custom adapter registration", () => {
    registerDomainKernelAdapter("custom", () => createGenericDomainKernelStub({ adapterId: "custom" }));
    expect(getDomainKernelAdapter("custom").adapterId).toBe("custom");
  });
});
