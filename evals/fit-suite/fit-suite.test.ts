import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { deepseekProfile, evaluateFit, applyRepairs } from "../../packages/improveness-modeltaste/src/index.ts";

const fixtures = JSON.parse(
  readFileSync(join(import.meta.dir, "fixtures/golden.json"), "utf8"),
) as Array<{
  id: string;
  rawValid: boolean;
  trace: { tool: string; args: Record<string, unknown>; schema?: Record<string, unknown>; validationError?: string };
}>;

describe("fit-suite (keyless)", () => {
  test("golden fixtures improve under deepseek profile", () => {
    const report = evaluateFit(
      fixtures.map((f) => ({ rawValid: f.rawValid, trace: f.trace })),
      deepseekProfile,
    );
    expect(report.n).toBe(fixtures.length);
    expect(report.repairedAccept).toBeGreaterThan(report.rawAccept);
    expect(report.delta).toBeGreaterThan(0);
  });

  test("each invalid fixture gets a repair or teachback", () => {
    for (const f of fixtures.filter((x) => !x.rawValid)) {
      const r = applyRepairs(f.trace, deepseekProfile);
      expect(r.repaired || r.teachback.length > 0).toBe(true);
    }
  });
});
