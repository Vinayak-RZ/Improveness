import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { ARCHITECTURE_SIMULATIONS, runArchitectureSimulations } from "../drivers/simulate-architectures.ts";

const repoRoot = join(import.meta.dir, "../../..");

describe("agentic architecture simulations", () => {
  test("all eight named wirings pass their CACD expectation", () => {
    const results = runArchitectureSimulations(repoRoot);
    expect(ARCHITECTURE_SIMULATIONS).toHaveLength(8);
    expect(results.map((row) => row.id)).toEqual(ARCHITECTURE_SIMULATIONS);
    const failed = results.filter((row) => row.outcome === "fail");
    expect(failed).toEqual([]);
    const gated = results.find((row) => row.id === "self-harness-gated");
    expect(gated?.heldIn).toBe("7/12");
    expect(gated?.heldOut).toBe("3/8");
    const order = results.find((row) => row.id === "procedural-order");
    expect(order?.outcome).toBe("pass");
  }, 180_000);
});
