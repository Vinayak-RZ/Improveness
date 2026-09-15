import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { assertTargetWrite } from "../drivers/allowlist.ts";
import { decideAccept, type CandidateFile } from "../drivers/self-harness.ts";
import type { ImproveTargetInput, ImproveTargetResult, TargetManifest } from "./types.ts";

function posixRel(from: string, to: string): string {
  return relative(from, to).split(sep).join("/");
}

/** Stage accepted files under the target's staging prefix. Never writes frozen prefixes. */
export function stageTargetCandidate(files: CandidateFile[], repoRoot: string, target: TargetManifest): string[] {
  const written: string[] = [];
  const root = resolve(repoRoot);
  const stagingAbs = resolve(root, target.stagingPrefix);
  for (const file of files) {
    const destRel = file.relPath.startsWith(target.stagingPrefix)
      ? file.relPath
      : `${target.stagingPrefix.replace(/\/$/, "")}/${file.relPath.replace(/^.*\//, "")}`;
    const destAbs = resolve(root, destRel);
    assertTargetWrite(destAbs, root, target);
    if (!destAbs.startsWith(stagingAbs + sep) && destAbs !== stagingAbs) {
      throw new Error(`target refuses to write outside staging: ${destRel}`);
    }
    mkdirSync(dirname(destAbs), { recursive: true });
    writeFileSync(destAbs, file.content.endsWith("\n") ? file.content : `${file.content}\n`);
    written.push(posixRel(root, destAbs));
  }
  return written;
}

/** Same Self-Harness gate as coding hosts; apply target is this target's staging dir. */
export function improveTarget(input: ImproveTargetInput): ImproveTargetResult {
  const decision = decideAccept(input.heldInBefore, input.heldInAfter, input.heldOutBefore, input.heldOutAfter);
  if (decision !== "accept") return { decision, staged: [] };
  return { decision, staged: input.target.stage(input.files, input.repoRoot) };
}
