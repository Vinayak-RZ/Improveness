import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const repoRoot = join(import.meta.dir, "../../..");
const modelRolesPath = join(
  repoRoot,
  "oh-my-pi/packages/coding-agent/src/config/model-roles.ts",
);
const debuggerAgent = join(repoRoot, "harness/omp/overlay/.omp/agents/debugger.md");
const evolverAgent = join(repoRoot, "harness/omp/overlay/.omp/agents/evolver.md");

describe("OMP model roles + Improveness agents", () => {
  test("parked OMP still ships model-roles.ts as a frozen surface", () => {
    expect(existsSync(modelRolesPath)).toBe(true);
    const modelRoles = readFileSync(modelRolesPath, "utf8");
    expect(modelRoles).toContain("export type ModelRole");
    expect(modelRoles).toContain("MODEL_ROLE_IDS");
    // Upstream OMP 18.x dropped built-in debugger/evolver roles; Improveness must not require them.
    expect(modelRoles).not.toMatch(/\|\s*"debugger"/);
    expect(modelRoles).not.toMatch(/\|\s*"evolver"/);
  });

  test("Improveness overlay still defines debugger and evolver agents", () => {
    expect(existsSync(debuggerAgent)).toBe(true);
    expect(existsSync(evolverAgent)).toBe(true);
    const debuggerMd = readFileSync(debuggerAgent, "utf8");
    const evolverMd = readFileSync(evolverAgent, "utf8");
    expect(debuggerMd).toMatch(/name:\s*debugger/);
    expect(evolverMd).toMatch(/name:\s*evolver/);
    expect(debuggerMd).toContain("@debugger");
    expect(evolverMd).toContain("@evolver");
  });
});
