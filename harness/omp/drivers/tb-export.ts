import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { loadFixture } from "../evals/checker/check.ts";

export type TbExportResult = {
  id: string;
  outDir: string;
  instructionPath: string;
  testPath: string;
};

function toGitBashPath(abs: string): string {
  const posix = abs.split(sep).join("/");
  const drive = /^([A-Za-z]):\/(.*)$/.exec(posix);
  if (drive) return `/${drive[1].toLowerCase()}/${drive[2]}`;
  return posix;
}

export function exportHarborTask(fixtureDir: string, adapterRoot: string): TbExportResult {
  const spec = loadFixture(fixtureDir);
  const outDir = join(adapterRoot, spec.id);
  mkdirSync(join(outDir, "tests"), { recursive: true });
  const instructionPath = join(outDir, "instruction.md");
  const testPath = join(outDir, "tests/test.sh");
  const checkAbs = toGitBashPath(resolve(fixtureDir, spec.check));

  writeFileSync(
    instructionPath,
    `# ${spec.id}\n\n${spec.prompt}\n\nThis is a Harbor-shaped local task. It is not a public Terminal-Bench 2 item.\n`,
  );
  writeFileSync(
    testPath,
    `#!/usr/bin/env bash
set -euo pipefail
# Runs the frozen Improveness checker for this fixture against the current workspace.
bash ${JSON.stringify(checkAbs)}
`,
  );
  chmodSync(testPath, 0o755);
  return { id: spec.id, outDir, instructionPath, testPath };
}

if (import.meta.main) {
  const fixtureDir = process.argv[2];
  const adapterRoot = process.argv[3] ?? "harness/omp/evals/tb-adapter";
  if (!fixtureDir) throw new Error("usage: tb-export <fixtureDir> [adapterRoot]");
  console.log(JSON.stringify(exportHarborTask(fixtureDir, adapterRoot)));
}
