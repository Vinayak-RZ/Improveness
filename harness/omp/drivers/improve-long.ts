import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { runSearch } from "./search.ts";

export type ImproveLongInput = {
  repoRoot: string;
  archiveRoot?: string;
  minParents?: number;
  stepCap?: number;
  dryRun?: boolean;
};

export type ImproveLongResult = {
  kind: "long-term";
  action: "search" | "skipped";
  parentCount: number;
  search?: ReturnType<typeof runSearch>;
  reason?: string;
};

/**
 * Long-term archive cadence: if enough archive parents exist, run bounded search.
 * Durable apply still requires decideAccept elsewhere (search stages / plugin-class apply).
 */
export function improveLong(input: ImproveLongInput): ImproveLongResult {
  const archiveRoot = input.archiveRoot ?? join(input.repoRoot, "harness/omp/archive");
  const minParents = input.minParents ?? 1;
  if (!existsSync(archiveRoot)) {
    return { kind: "long-term", action: "skipped", parentCount: 0, reason: "no archive" };
  }
  const parents = readdirSync(archiveRoot, { withFileTypes: true }).filter((d) => d.isDirectory());
  const parentCount = parents.length;
  if (parentCount < minParents) {
    return {
      kind: "long-term",
      action: "skipped",
      parentCount,
      reason: `need >=${minParents} archive parents`,
    };
  }
  if (input.dryRun) {
    return { kind: "long-term", action: "skipped", parentCount, reason: "dryRun" };
  }
  const search = runSearch({
    repoRoot: input.repoRoot,
    stepCap: input.stepCap ?? 1,
  });
  return { kind: "long-term", action: "search", parentCount, search };
}
