import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { applyCandidate, hashContents } from "../drivers/apply-candidate.ts";
import { rollbackCandidate } from "../drivers/rollback-candidate.ts";

function miniRepo(): string {
  const { mkdirSync } = require("node:fs") as typeof import("node:fs");
  const dir = mkdtempSync(join(tmpdir(), "manifest-"));
  mkdirSync(join(dir, "harness/omp/overlay/.omp/playbook"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/overlay/.omp/manifests"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/staging"), { recursive: true });
  writeFileSync(join(dir, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "parent line\n");
  return dir;
}

describe("manifest apply/rollback", () => {
  test("apply then rollback restores parent hash", () => {
    const repo = miniRepo();
    const parent = readFileSync(join(repo, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8");
    const manifest = applyCandidate({
      id: "cand-001",
      surface: "playbook",
      repoRoot: repo,
      files: [
        {
          relPath: "harness/omp/overlay/.omp/playbook/PLAYBOOK.md",
          content: "child line\n",
        },
      ],
      scores: { heldIn: { passed: 2, total: 3 }, heldOut: { passed: 2, total: 2 } },
      evidenceId: "sess-omp-golden",
      rootCause: "missing export",
    });

    expect(manifest.parentHash).toBe(hashContents([""]));
    expect(manifest.files[0]).toBe("harness/omp/staging/playbook/PLAYBOOK.md");
    expect(readFileSync(join(repo, "harness/omp/staging/playbook/PLAYBOOK.md"), "utf8")).toBe("child line\n");
    expect(readFileSync(join(repo, "harness/omp/overlay/.omp/manifests/cand-001.json"), "utf8")).toContain("cand-001");

    writeFileSync(join(repo, "harness/omp/staging/playbook/PLAYBOOK.md"), parent);
    const first = applyCandidate({
      id: "cand-002",
      surface: "playbook",
      repoRoot: repo,
      files: [{ relPath: "harness/omp/staging/playbook/PLAYBOOK.md", content: "child line\n" }],
      scores: { heldIn: { passed: 2, total: 3 }, heldOut: { passed: 2, total: 2 } },
    });
    expect(first.parentHash).toBe(hashContents([parent]));
    expect(readFileSync(join(repo, "harness/omp/staging/playbook/PLAYBOOK.md"), "utf8")).toBe("child line\n");

    const rolled = rollbackCandidate("cand-002", repo);
    expect(rolled.parentHash).toBe(first.parentHash);
    expect(readFileSync(join(repo, "harness/omp/staging/playbook/PLAYBOOK.md"), "utf8")).toBe(parent);
  });
});
