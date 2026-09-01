import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { posixBash } from "./posix-bash.ts";

export type FixtureSpec = {
  id: string;
  split: "held-in" | "held-out";
  prompt: string;
  check: string;
};

export type CheckResult = {
  id: string;
  split: FixtureSpec["split"];
  passed: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};

export function loadFixture(fixtureDir: string): FixtureSpec {
  const specPath = join(fixtureDir, "fixture.json");
  const spec = JSON.parse(readFileSync(specPath, "utf8")) as FixtureSpec;
  if (!spec.id || !spec.split || !spec.check) {
    throw new Error(`invalid fixture spec: ${specPath}`);
  }
  return spec;
}

export function scoreWorkspace(fixtureDir: string, workspaceDir: string): CheckResult {
  const spec = loadFixture(fixtureDir);
  const checkPath = resolve(fixtureDir, spec.check);
  if (!existsSync(checkPath)) {
    throw new Error(`missing checker script: ${checkPath}`);
  }
  const result = spawnSync(posixBash(), [checkPath], {
    cwd: resolve(workspaceDir),
    encoding: "utf8",
    timeout: 15_000,
  });
  const exitCode = result.status ?? 1;
  return {
    id: spec.id,
    split: spec.split,
    passed: exitCode === 0,
    exitCode,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

if (import.meta.main) {
  const fixtureDir = process.argv[2];
  const workspaceDir = process.argv[3] ?? fixtureDir;
  if (!fixtureDir) {
    throw new Error("usage: check.ts <fixtureDir> [workspaceDir]");
  }
  console.log(JSON.stringify(scoreWorkspace(fixtureDir, workspaceDir)));
}
