import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { exportHarborTask } from "../drivers/tb-export.ts";

const fixture = join(import.meta.dir, "../evals/held-out/no-secrets");

describe("tb-export", () => {
  test("checked-in Harbor layout exists for held-out no-secrets", () => {
    const golden = join(import.meta.dir, "../evals/tb-adapter/no-secrets");
    expect(existsSync(join(golden, "instruction.md"))).toBe(true);
    expect(existsSync(join(golden, "tests/test.sh"))).toBe(true);
    expect(readFileSync(join(golden, "instruction.md"), "utf8")).toContain("not a public Terminal-Bench 2");
  });

  test("writes Harbor-shaped instruction.md and tests/test.sh", () => {
    const out = mkdtempSync(join(tmpdir(), "tb-"));
    const result = exportHarborTask(fixture, out);
    expect(result.id).toBe("no-secrets");
    const instruction = readFileSync(result.instructionPath, "utf8");
    expect(instruction).toContain("Keep src/config.ts free of hardcoded API keys.");
    expect(instruction).toContain("not a public Terminal-Bench 2");
    const testSh = readFileSync(result.testPath, "utf8");
    expect(testSh.startsWith("#!/usr/bin/env bash")).toBe(true);
    expect(testSh).toContain("check.sh");
  });
});
