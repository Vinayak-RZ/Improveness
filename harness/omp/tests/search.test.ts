import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { listArchive } from "../drivers/archive.ts";
import { proposeNextRecipe } from "../drivers/propose.ts";
import { assertStepCap, MAX_STEP_CAP, runSearch } from "../drivers/search.ts";
import { pluginApplySource } from "../drivers/apply-snapshot.ts";

const sourceRoot = join(import.meta.dir, "../../..");

function searchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "search-"));
  mkdirSync(join(dir, "harness/omp/overlay/.omp/playbook"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/archive"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/staging"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/reports/search"), { recursive: true });
  cpSync(join(sourceRoot, "harness/omp/evals"), join(dir, "harness/omp/evals"), { recursive: true });
  cpSync(
    join(sourceRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"),
    join(dir, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"),
  );
  writeFileSync(
    join(dir, "harness/omp/REVIEW_QUEUE.md"),
    "# Maintainer review queue\n\nCandidates are **evidence**.\n\n| id | surface | files | parentHash | held-in | held-out | rollback | apply to project .omp? |\n|----|---------|-------|------------|---------|----------|----------|------------------------|\n",
  );
  return dir;
}

describe("archive search", () => {
  test("throws on invalid step cap", () => {
    expect(() => assertStepCap(0)).toThrow(/stepCap/);
    expect(() => assertStepCap(MAX_STEP_CAP + 1)).toThrow(/stepCap/);
    expect(() => runSearch({ repoRoot: searchRepo(), stepCap: 9 })).toThrow(/stepCap/);
  });

  test("refuses kernel destination files", () => {
    const repo = searchRepo();
    expect(() =>
      runSearch({
        repoRoot: repo,
        stepCap: 1,
        proposer: () => ({
          family: null,
          files: [{ relPath: "harness/omp/evals/checker/check.ts", content: "export {}\n" }],
        }),
      }),
    ).toThrow(/kernel path/);
  }, 120_000);

  test("proposer rejects held-out fixture ids", () => {
    const repo = searchRepo();
    expect(() =>
      proposeNextRecipe({
        playbook: "- [s-001] hello\n",
        failingHeldInIds: ["no-secrets"],
        heldInOnly: true,
        repoRoot: repo,
      }),
    ).toThrow(/held-out/);
  });

  test("accepts a held-in recipe to staging+archive+queue without promoting overlay", () => {
    const repo = searchRepo();
    const beforeOverlay = readFileSync(join(repo, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8");
    const result = runSearch({ repoRoot: repo, stepCap: 1 });
    expect(result.rounds).toHaveLength(1);
    expect(result.rounds[0].decision).toBe("accept");
    expect(result.rounds[0].family).toBe("recipe:default-export");
    expect(result.rounds[0].heldInAfter.passed).toBeGreaterThan(result.rounds[0].heldInBefore.passed);
    expect(result.rounds[0].staged.some((path) => path.startsWith("harness/omp/staging/"))).toBe(true);
    expect(listArchive(repo).some((node) => node.id === "step-1")).toBe(true);
    expect(readFileSync(join(repo, "harness/omp/REVIEW_QUEUE.md"), "utf8")).toContain("step-1");
    expect(readFileSync(join(repo, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8")).toBe(beforeOverlay);
  }, 120_000);

  test("no-gain proposal is rejected and does not stage", () => {
    const repo = searchRepo();
    const result = runSearch({
      repoRoot: repo,
      stepCap: 1,
      proposer: ({ playbook }) => ({
        family: null,
        files: [{ relPath: "harness/omp/overlay/.omp/playbook/PLAYBOOK.md", content: playbook }],
      }),
    });
    expect(result.rounds[0].decision).toBe("reject-no-gain");
    expect(result.rounds[0].staged).toEqual([]);
    expect(listArchive(repo).some((node) => node.id === "step-1")).toBe(false);
  }, 120_000);

  test("plugin-class accept writes generated dir not only staging", () => {
    const repo = searchRepo();
    const result = runSearch({
      repoRoot: repo,
      stepCap: 1,
      proposer: (input) => {
        const base = proposeNextRecipe(input);
        return {
          ...base,
          files: [
            ...base.files,
            { relPath: "harness/omp/generated/cap-echo/apply.js", content: pluginApplySource() },
          ],
        };
      },
    });
    expect(result.rounds[0].decision).toBe("accept");
    expect(existsSync(join(repo, "harness/omp/generated/cap-echo/apply.js"))).toBe(true);
    expect(result.rounds[0].staged.some((path) => path.includes("generated/"))).toBe(true);
  }, 120_000);
});
