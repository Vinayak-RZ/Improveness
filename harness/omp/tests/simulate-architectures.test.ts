import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { ARCHITECTURE_SIMULATIONS, runArchitectureSimulations } from "../drivers/simulate-architectures.ts";

const repoRoot = join(import.meta.dir, "../../..");

describe("agentic architecture simulations", () => {
  test("all seven named wirings pass their CACD expectation", () => {
    const results = runArchitectureSimulations(repoRoot);
    expect(results.map((row) => row.id)).toEqual(ARCHITECTURE_SIMULATIONS);
    const failed = results.filter((row) => row.outcome === "fail");
    expect(failed).toEqual([]);
  }, 180_000);
});
