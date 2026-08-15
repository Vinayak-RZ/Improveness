import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { hashContents } from "./apply-candidate.ts";
import type { CandidateManifest } from "./manifest.ts";

export function rollbackCandidate(id: string, repoRoot: string): { parentHash: string; restored: string[] } {
  const root = resolve(repoRoot);
  const manifestPath = join(root, "harness/omp/overlay/.omp/manifests", `${id}.json`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as CandidateManifest;
  const snap = join(root, "harness/omp/staging/snapshots", id, "parent");
  const restored: string[] = [];
  const parentParts: string[] = [];
  for (const rel of manifest.files) {
    const parentCopy = join(snap, rel.replaceAll("/", "__"));
    if (!existsSync(parentCopy)) {
      throw new Error(`missing parent snapshot for ${rel}`);
    }
    const body = readFileSync(parentCopy, "utf8");
    parentParts.push(body);
    writeFileSync(resolve(root, rel), body);
    restored.push(rel);
  }
  const parentHash = hashContents(parentParts);
  if (parentHash !== manifest.parentHash) {
    throw new Error(`rollback hash mismatch: ${parentHash} !== ${manifest.parentHash}`);
  }
  return { parentHash, restored };
}

if (import.meta.main) {
  const id = process.argv.includes("--id") ? process.argv[process.argv.indexOf("--id") + 1] : "";
  if (!id) throw new Error("usage: rollback-candidate --id <id>");
  console.log(JSON.stringify(rollbackCandidate(id, process.cwd())));
}
