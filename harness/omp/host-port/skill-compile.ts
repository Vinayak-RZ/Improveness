import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assertEvolverWrite } from "../drivers/allowlist.ts";

/** Evo-Harness-style compile: accepted playbook family → SKILL.md (P1). */
export function compileSkill(input: {
  repoRoot: string;
  family: string;
  lesson: string;
  skillId?: string;
}): string {
  const id = input.skillId ?? input.family.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  const rel = `harness/omp/overlay/.omp/skills/${id}/SKILL.md`;
  const abs = join(input.repoRoot, rel);
  assertEvolverWrite(abs, input.repoRoot);
  mkdirSync(join(input.repoRoot, `harness/omp/overlay/.omp/skills/${id}`), { recursive: true });
  const body = `---
name: ${id}
description: Compiled from playbook family ${input.family}
---

# ${id}

${input.lesson.trim()}
`;
  writeFileSync(abs, body.endsWith("\n") ? body : `${body}\n`);
  return rel;
}
