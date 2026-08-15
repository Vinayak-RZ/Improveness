import { readdirSync } from "node:fs";
import { join } from "node:path";
import { type CheckResult, scoreWorkspace } from "../evals/checker/check.ts";

export type Split = "held-in" | "held-out";

export type SplitScore = {
  split: Split;
  passed: number;
  total: number;
  byId: Record<string, boolean>;
  results: CheckResult[];
};

export function listFixtures(evalsRoot: string, split: Split): string[] {
  const dir = join(evalsRoot, split);
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name))
    .sort();
}

export function scoreSplit(
  evalsRoot: string,
  split: Split,
  workspaceFor: (fixtureDir: string) => string,
): SplitScore {
  const results = listFixtures(evalsRoot, split).map((fixtureDir) =>
    scoreWorkspace(fixtureDir, workspaceFor(fixtureDir)),
  );
  const byId: Record<string, boolean> = {};
  let passed = 0;
  for (const result of results) {
    byId[result.id] = result.passed;
    if (result.passed) passed++;
  }
  return { split, passed, total: results.length, byId, results };
}

if (import.meta.main) {
  const evalsRoot = process.argv[2] ?? "harness/omp/evals";
  const split = (process.argv[3] ?? "held-in") as Split;
  const which = process.argv[4] === "expected" ? "expected" : "repo";
  const score = scoreSplit(evalsRoot, split, (fixtureDir) => join(fixtureDir, which));
  console.log(JSON.stringify({ split: score.split, passed: score.passed, total: score.total, byId: score.byId }));
}
