import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { assertEvolverWrite } from "./allowlist.ts";
import type { SplitScore } from "./run-eval.ts";

export type Decision = "accept" | "reject-held-in" | "reject-held-out" | "reject-no-gain";

export type CandidateFile = {
  /** Path relative to repo root. Must be overlay or staging. */
  relPath: string;
  content: string;
};

function regress(before: SplitScore, after: SplitScore): boolean {
  for (const [id, wasPass] of Object.entries(before.byId)) {
    if (wasPass && after.byId[id] === false) return true;
  }
  return false;
}

export function decideAccept(heldInBefore: SplitScore, heldInAfter: SplitScore, heldOutBefore: SplitScore, heldOutAfter: SplitScore): Decision {
  if (regress(heldInBefore, heldInAfter) || heldInAfter.passed < heldInBefore.passed) {
    return "reject-held-in";
  }
  if (regress(heldOutBefore, heldOutAfter) || heldOutAfter.passed < heldOutBefore.passed) {
    return "reject-held-out";
  }
  const improved = heldInAfter.passed > heldInBefore.passed || heldOutAfter.passed > heldOutBefore.passed;
  return improved ? "accept" : "reject-no-gain";
}

export function stageCandidate(files: CandidateFile[], repoRoot: string, stagingRoot = "harness/omp/staging"): string[] {
  const written: string[] = [];
  const root = resolve(repoRoot);
  const stagingAbs = resolve(root, stagingRoot);
  for (const file of files) {
    const destRel = file.relPath.startsWith("harness/omp/staging/")
      ? file.relPath
      : join(stagingRoot, relative(join("harness/omp/overlay/.omp"), file.relPath)).split(sep).join("/");
    const destAbs = resolve(root, destRel);
    assertEvolverWrite(destAbs, root);
    if (!destAbs.startsWith(stagingAbs + sep) && destAbs !== stagingAbs) {
      throw new Error(`self-harness refuses to write outside staging: ${destRel}`);
    }
    if (destAbs.includes(`${sep}oh-my-pi${sep}packages${sep}`)) {
      throw new Error("self-harness refuses to write oh-my-pi/packages");
    }
    mkdirSync(dirname(destAbs), { recursive: true });
    writeFileSync(destAbs, file.content.endsWith("\n") ? file.content : `${file.content}\n`);
    written.push(destRel);
  }
  return written;
}

export function runSelfHarness(input: {
  heldInBefore: SplitScore;
  heldInAfter: SplitScore;
  heldOutBefore: SplitScore;
  heldOutAfter: SplitScore;
  files: CandidateFile[];
  repoRoot: string;
}): { decision: Decision; staged: string[] } {
  const decision = decideAccept(input.heldInBefore, input.heldInAfter, input.heldOutBefore, input.heldOutAfter);
  if (decision !== "accept") return { decision, staged: [] };
  return { decision, staged: stageCandidate(input.files, input.repoRoot) };
}
