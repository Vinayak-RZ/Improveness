import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { decideAccept, runSelfHarness, type CandidateFile } from "../drivers/self-harness.ts";
import type { SplitScore } from "../drivers/run-eval.ts";
import { scoreSplit } from "../drivers/run-eval.ts";

const repoRoot = join(import.meta.dir, "../../..");
const evalsRoot = join(repoRoot, "harness/omp/evals");

function score(split: "held-in" | "held-out", which: "repo" | "expected"): SplitScore {
  return scoreSplit(evalsRoot, split, (fixtureDir) => join(fixtureDir, which));
}

function synthetic(split: "held-in" | "held-out", byId: Record<string, boolean>): SplitScore {
  const passed = Object.values(byId).filter(Boolean).length;
  return {
    split,
    passed,
    total: Object.keys(byId).length,
    byId,
    results: [],
  };
}

describe("self-harness", () => {
  test("starter repos fail and expected trees pass (live checker)", () => {
    const heldInRepo = score("held-in", "repo");
    const heldInExpected = score("held-in", "expected");
    const heldOutRepo = score("held-out", "repo");
    const heldOutExpected = score("held-out", "expected");
    expect(heldInRepo.passed).toBe(0);
    expect(heldInExpected.passed).toBe(heldInExpected.total);
    expect(heldOutRepo.passed).toBe(0);
    expect(heldOutExpected.passed).toBe(heldOutExpected.total);
  });

  test("planted held-out regression is rejected and does not stage", () => {
    const result = runSelfHarness({
      heldInBefore: synthetic("held-in", { a: false, b: true }),
      heldInAfter: synthetic("held-in", { a: true, b: true }),
      heldOutBefore: synthetic("held-out", { x: true, y: true }),
      heldOutAfter: synthetic("held-out", { x: true, y: false }),
      files: [{ relPath: "harness/omp/overlay/.omp/playbook/PLAYBOOK.md", content: "bad" }],
      repoRoot,
    });
    expect(result.decision).toBe("reject-held-out");
    expect(result.staged).toEqual([]);
    expect(decideAccept(
      synthetic("held-in", { a: false }),
      synthetic("held-in", { a: true }),
      synthetic("held-out", { x: true }),
      synthetic("held-out", { x: false }),
    )).toBe("reject-held-out");
  });

  test("held-in win that also passes held-out stages overlay files only", () => {
    const files: CandidateFile[] = [
      {
        relPath: "harness/omp/overlay/.omp/playbook/PLAYBOOK.md",
        content: "- [s-999] (helpful=1 harmful=0) Prefer named exports in fixture modules.\n",
      },
    ];
    const result = runSelfHarness({
      heldInBefore: score("held-in", "repo"),
      heldInAfter: score("held-in", "expected"),
      heldOutBefore: score("held-out", "repo"),
      heldOutAfter: score("held-out", "expected"),
      files,
      repoRoot,
    });
    expect(result.decision).toBe("accept");
    expect(result.staged.some((path) => path.startsWith("harness/omp/staging/"))).toBe(true);
    expect(result.staged.some((path) => path.includes("oh-my-pi/packages"))).toBe(false);
    expect(existsSync(join(repoRoot, "oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md"))).toBe(true);
    const packagesTouched = readdirSync(join(repoRoot, "oh-my-pi/packages/coding-agent/src/tools")).includes("self-harness.ts");
    expect(packagesTouched).toBe(false);
  });
});
