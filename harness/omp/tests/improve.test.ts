import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { improveShort } from "../drivers/improve-short.ts";
import { improveLong } from "../drivers/improve-long.ts";

const sourceRoot = join(import.meta.dir, "../../..");

function tmpRepo() {
  const dir = mkdtempSync(join(tmpdir(), "improve-"));
  mkdirSync(join(dir, "harness/omp/overlay/.omp/playbook"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/archive"), { recursive: true });
  cpSync(
    join(sourceRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"),
    join(dir, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"),
  );
  return dir;
}

describe("improve short-term", () => {
  test("skips without lesson", () => {
    const repo = tmpRepo();
    const out = improveShort({ repoRoot: repo });
    expect(out.action).toBe("skipped");
  });

  test("appends candidate lesson to playbook", () => {
    const repo = tmpRepo();
    const out = improveShort({
      repoRoot: repo,
      lesson: "Prefer bounded search stepCap for long-term improve",
      passed: true,
    });
    expect(out.action).toBe("candidate");
    expect(out.curate?.action).toMatch(/appended|incremented/);
  });

  test("reads LESSON from trajectory file", () => {
    const repo = tmpRepo();
    const traj = join(repo, "traj.jsonl");
    writeFileSync(traj, "LESSON: Use invertible disposers for JIT mounts\n");
    const out = improveShort({ repoRoot: repo, trajectoryPath: traj });
    expect(out.action).toBe("candidate");
  });

  test("failed PROCEDURE steps add a graph edge", () => {
    const repo = tmpRepo();
    writeFileSync(
      join(repo, "harness/omp/overlay/.omp/playbook/PROCEDURE_GRAPH.json"),
      `${JSON.stringify({ version: 1, nodes: [{ id: "Start", kind: "state" }], edges: [] }, null, 2)}\n`,
    );
    const traj = join(repo, "traj.jsonl");
    writeFileSync(
      traj,
      "PROCEDURE: search\nPROCEDURE: edit\nLESSON: read before edit\n",
    );
    const out = improveShort({ repoRoot: repo, trajectoryPath: traj, passed: false });
    expect(out.action).toBe("candidate");
    expect(out.graphEdits).toBe(1);
    const g = JSON.parse(
      readFileSync(join(repo, "harness/omp/overlay/.omp/playbook/PROCEDURE_GRAPH.json"), "utf8"),
    );
    expect(g.edges.some((e: { from: string; to: string }) => e.from === "search" && e.to === "edit")).toBe(true);
  });
});

describe("improve long-term", () => {
  test("skips when archive empty and minParents high", () => {
    const repo = tmpRepo();
    const out = improveLong({ repoRoot: repo, minParents: 99, dryRun: true });
    expect(out.action).toBe("skipped");
  });

  test("dryRun skips search even with parents", () => {
    const repo = tmpRepo();
    mkdirSync(join(repo, "harness/omp/archive/parent-a"), { recursive: true });
    const out = improveLong({ repoRoot: repo, minParents: 1, dryRun: true });
    expect(out.action).toBe("skipped");
    expect(out.reason).toBe("dryRun");
    expect(out.parentCount).toBe(1);
  });
});
