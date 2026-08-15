import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const modelRoles = readFileSync(
  join(import.meta.dir, "../../../oh-my-pi/packages/coding-agent/src/config/model-roles.ts"),
  "utf8",
);

describe("OMP model roles", () => {
  test("ModelRole union and MODEL_ROLE_IDS include hidden debugger and evolver", () => {
    expect(modelRoles).toMatch(/\|\s*"debugger"/);
    expect(modelRoles).toMatch(/\|\s*"evolver"/);
    expect(modelRoles).toContain('"debugger"');
    expect(modelRoles).toContain('"evolver"');
    expect(modelRoles).toMatch(/debugger:[\s\S]*hidden:\s*true/);
    expect(modelRoles).toMatch(/evolver:[\s\S]*hidden:\s*true/);
  });
});
