import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { exportHarborTask } from "./tb-export.ts";
import { listFixtures, type Split } from "./run-eval.ts";
import { loadFixture } from "../evals/checker/check.ts";

export type HarborLocalResult = {
  id: string;
  split: Split;
  workspace: "repo" | "expected";
  passed: boolean;
  exitCode: number;
};

export function runHarborTask(testSh: string, workspaceDir: string): { passed: boolean; exitCode: number } {
  const result = spawnSync("bash", [testSh], {
    cwd: resolve(workspaceDir),
    encoding: "utf8",
    timeout: 15_000,
  });
  const exitCode = result.status ?? 1;
  return { passed: exitCode === 0, exitCode };
}

export function runTbLocal(input: {
  evalsRoot: string;
  splits?: Split[];
  workspace?: "repo" | "expected";
  adapterRoot?: string;
}): HarborLocalResult[] {
  const evalsRoot = resolve(input.evalsRoot);
  const splits = input.splits ?? ["held-in", "held-out"];
  const workspace = input.workspace ?? "repo";
  const adapterRoot = input.adapterRoot ?? mkdtempSync(join(tmpdir(), "tb-local-"));
  const results: HarborLocalResult[] = [];

  for (const split of splits) {
    for (const fixtureDir of listFixtures(evalsRoot, split)) {
      const spec = loadFixture(fixtureDir);
      const exported = exportHarborTask(fixtureDir, adapterRoot);
      const { passed, exitCode } = runHarborTask(exported.testPath, join(fixtureDir, workspace));
      results.push({ id: spec.id, split: spec.split, workspace, passed, exitCode });
    }
  }
  return results;
}

export function listCheckedInAdapterTasks(adapterRoot: string): string[] {
  if (!existsSync(adapterRoot)) return [];
  return readdirSync(adapterRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(adapterRoot, entry.name, "tests/test.sh")))
    .map((entry) => entry.name)
    .sort();
}

if (import.meta.main) {
  const evalsRoot = process.argv[2] ?? "harness/omp/evals";
  const workspace = process.argv[3] === "expected" ? "expected" : "repo";
  console.log(JSON.stringify(runTbLocal({ evalsRoot, workspace }), null, 2));
}
