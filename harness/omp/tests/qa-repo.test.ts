import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { checkFixtureInventory, runRepoQa } from "../drivers/qa-repo.ts";

const repoRoot = join(import.meta.dir, "../../..");

describe("repository QA", () => {
  test("fixture inventory meets the 12/8 split", () => {
    const finding = checkFixtureInventory(repoRoot);
    expect(finding.ok).toBe(true);
    expect(finding.detail).toContain("held-in=12");
    expect(finding.detail).toContain("held-out=8");
  });

  test("full repo QA is green", () => {
    const result = runRepoQa(repoRoot);
    const failed = result.findings.filter((item) => !item.ok);
    expect(failed).toEqual([]);
    expect(result.ok).toBe(true);
  });
});
