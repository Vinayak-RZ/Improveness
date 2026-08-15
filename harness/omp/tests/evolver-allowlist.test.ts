import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { assertEvolverWrite, isEvolverToolAllowed } from "../drivers/allowlist.ts";

const repoRoot = join(import.meta.dir, "../../..");

describe("evolver allowlist", () => {
  test("agent markdown lists overlay writes and kernel denials", () => {
    const body = readFileSync(join(repoRoot, "harness/omp/overlay/.omp/agents/evolver.md"), "utf8");
    expect(body).toContain("playbook/**");
    expect(body).toContain("evals/checker");
    expect(body).toContain("restrictToolNames: true");
    expect(body).toContain("model: \"@smol\"");
  });

  test("allows playbook/skills/tools and staging copies", () => {
    expect(
      assertEvolverWrite(join(repoRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), repoRoot),
    ).toContain("PLAYBOOK.md");
    expect(
      assertEvolverWrite(join(repoRoot, "harness/omp/overlay/.omp/skills/example/SKILL.md"), repoRoot),
    ).toContain("skills/");
    expect(
      assertEvolverWrite(join(repoRoot, "harness/omp/overlay/.omp/tools/note.md"), repoRoot),
    ).toContain("tools/");
    expect(
      assertEvolverWrite(join(repoRoot, "harness/omp/staging/playbook/PLAYBOOK.md"), repoRoot),
    ).toContain("staging/");
  });

  test("denies checker, kernel, system prompt, and coding-agent packages", () => {
    const denied = [
      "harness/omp/evals/checker/check.ts",
      "harness/omp/KERNEL.md",
      "oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md",
      "oh-my-pi/packages/coding-agent/src/system-prompt.ts",
      "oh-my-pi/packages/coding-agent/src/tools/approval.ts",
    ];
    for (const rel of denied) {
      expect(() => assertEvolverWrite(join(repoRoot, rel), repoRoot)).toThrow(/denied/);
    }
  });

  test("denies bash; allows edit/write on overlay only via path check", () => {
    expect(isEvolverToolAllowed("bash")).toBe(false);
    expect(isEvolverToolAllowed("edit")).toBe(true);
    expect(isEvolverToolAllowed("write")).toBe(true);
  });
});
