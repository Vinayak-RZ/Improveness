import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { sampleParent, snapshotOverlay } from "../drivers/archive.ts";

function miniRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "archive-"));
  mkdirSync(join(dir, "harness/omp/overlay/.omp/playbook"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/archive"), { recursive: true });
  writeFileSync(join(dir, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "- [s-001] hello\n");
  return dir;
}

describe("overlay archive", () => {
  test("snapshots playbook files with parent and fitness", () => {
    const repo = miniRepo();
    const meta = snapshotOverlay({
      id: "snap-1",
      repoRoot: repo,
      parentId: null,
      fitness: 0.75,
    });
    expect(meta.id).toBe("snap-1");
    expect(meta.parentId).toBeNull();
    expect(meta.fitness).toBe(0.75);
    expect(Object.keys(meta.fileHashes).some((path) => path.endsWith("PLAYBOOK.md"))).toBe(true);
  });

  test("samples the parent with highest fitness over child count", () => {
    const id = sampleParent([
      { id: "low", fitness: 1, childCount: 0 },
      { id: "high", fitness: 4, childCount: 1 },
      { id: "busy", fitness: 5, childCount: 10 },
    ]);
    expect(id).toBe("high");
  });

  test("refuses system-prompt files even if listed as a source", () => {
    const repo = miniRepo();
    mkdirSync(join(repo, "oh-my-pi/packages/coding-agent/src/prompts/system"), { recursive: true });
    writeFileSync(join(repo, "oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md"), "nope\n");
    expect(() =>
      snapshotOverlay({
        id: "sys",
        repoRoot: repo,
        fitness: 1,
        sources: ["oh-my-pi/packages/coding-agent/src/prompts/system"],
      }),
    ).toThrow(/kernel path/);
  });

  test("refuses kernel paths", () => {
    const repo = miniRepo();
    mkdirSync(join(repo, "harness/omp/evals/checker"), { recursive: true });
    writeFileSync(join(repo, "harness/omp/evals/checker/check.ts"), "export {}\n");
    expect(() =>
      snapshotOverlay({
        id: "bad",
        repoRoot: repo,
        fitness: 1,
        sources: ["harness/omp/evals/checker"],
      }),
    ).toThrow(/kernel path/);
  });
});
