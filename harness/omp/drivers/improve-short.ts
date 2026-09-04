import { curatePlaybook } from "./curate-playbook.ts";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type ImproveShortInput = {
  repoRoot: string;
  playbookPath?: string;
  trajectoryPath?: string;
  lesson?: string;
  passed?: boolean;
};

export type ImproveShortResult = {
  kind: "short-term";
  action: "candidate" | "skipped";
  curate?: ReturnType<typeof curatePlaybook>;
  reason?: string;
};

/**
 * Post-trajectory short-term improve: append/increment playbook candidates only.
 * Does not write durable plugins.
 */
export function improveShort(input: ImproveShortInput): ImproveShortResult {
  const playbookPath =
    input.playbookPath ?? join(input.repoRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md");
  if (!existsSync(playbookPath)) {
    return { kind: "short-term", action: "skipped", reason: "no playbook" };
  }

  let lesson = input.lesson;
  if (!lesson && input.trajectoryPath && existsSync(input.trajectoryPath)) {
    const body = readFileSync(input.trajectoryPath, "utf8");
    const match = body.match(/^LESSON:\s*(.+)$/m);
    if (match) lesson = match[1].trim();
  }
  if (!lesson) {
    return { kind: "short-term", action: "skipped", reason: "no lesson" };
  }

  const curate = curatePlaybook({
    playbookPath,
    outcome: {
      passed: input.passed ?? true,
      lesson,
      section: "Strategies",
    },
  });
  return { kind: "short-term", action: "candidate", curate };
}
