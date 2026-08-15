import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import {
  assertPlaybookPath,
  curatePlaybook,
  extractLessonFromJsonl,
} from "../drivers/curate-playbook.ts";

const FIXTURE = join(import.meta.dir, "../evals/fixtures/failed-then-fixed.jsonl");

const STARTER = `# ACE playbook

## Strategies

- [s-001] (helpful=1 harmful=0) Prefer overlay files under \`harness/omp/\` over edits to Oh My Pi core.

## Failure modes

- [f-001] (helpful=1 harmful=0) Rewriting \`SYSTEM.md\` is not an improvement; AHE measured prompt-only regression.

## Repo conventions

- [c-001] (helpful=1 harmful=0) Secrets stay in environment variables. Never copy \`OMP_*\` values into this playbook.
`;

function tempPlaybook(): string {
  const dir = mkdtempSync(join(tmpdir(), "playbook-"));
  const playbookDir = join(dir, "playbook");
  mkdirSync(playbookDir, { recursive: true });
  const path = join(playbookDir, "PLAYBOOK.md");
  writeFileSync(path, STARTER);
  return path;
}

describe("curatePlaybook", () => {
  test("fixture session appends one curator-approved bullet", () => {
    const playbookPath = tempPlaybook();
    const lesson = extractLessonFromJsonl(readFileSync(FIXTURE, "utf8"));
    expect(lesson).toContain("missing export");

    const result = curatePlaybook({
      playbookPath,
      sessionJsonlPath: FIXTURE,
      outcome: { passed: true },
    });

    expect(result.action).toBe("appended");
    expect(result.section).toBe("Failure modes");
    const body = readFileSync(playbookPath, "utf8");
    expect(body).toContain(`- [${result.id}] (helpful=1 harmful=0) ${lesson}`);
    expect(body).toContain("## Failure modes");
  });

  test("increments helpful when the same lesson appears again", () => {
    const playbookPath = tempPlaybook();
    const lesson = "When a TypeScript compile fails on a missing export, add the export before retrying.";
    curatePlaybook({ playbookPath, outcome: { passed: true, lesson } });
    const again = curatePlaybook({ playbookPath, outcome: { passed: true, lesson } });
    expect(again.action).toBe("incremented");
    expect(readFileSync(playbookPath, "utf8")).toContain("(helpful=2 harmful=0)");
  });

  test("rejects writes outside playbook/", () => {
    expect(() => assertPlaybookPath(join(tmpdir(), "KERNEL.md"))).toThrow(/outside playbook/);
    expect(() =>
      curatePlaybook({
        playbookPath: join(tmpdir(), "not-here.md"),
        outcome: { passed: true, lesson: "something useful" },
      }),
    ).toThrow(/outside playbook/);
  });

  test("rejects secret-shaped lessons", () => {
    const playbookPath = tempPlaybook();
    expect(() =>
      curatePlaybook({
        playbookPath,
        outcome: { passed: true, lesson: "Store OMP_GOOGLE_ANTIGRAVITY_CLIENT_SECRET=supersecret" },
      }),
    ).toThrow(/secret-shaped/);
  });

  test("rejects SYSTEM.md edit lessons", () => {
    const playbookPath = tempPlaybook();
    expect(() =>
      curatePlaybook({
        playbookPath,
        outcome: { passed: true, lesson: "Fix the agent by rewriting SYSTEM.md" },
      }),
    ).toThrow(/SYSTEM\.md/);
  });
});
