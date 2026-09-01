import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { assertEvolverWrite } from "./allowlist.ts";
import type { CandidateManifest, ManifestSurface } from "./manifest.ts";

export function hashContents(parts: string[]): string {
  const hash = createHash("sha256");
  for (const part of parts) hash.update(part);
  return hash.digest("hex");
}

export function applyCandidate(input: {
  id: string;
  surface: ManifestSurface;
  repoRoot: string;
  files: Array<{ relPath: string; content: string }>;
  scores: CandidateManifest["scores"];
  evidenceId?: string;
  rootCause?: string;
}): CandidateManifest {
  const root = resolve(input.repoRoot);
  const snap = join(root, "harness/omp/staging/snapshots", input.id);
  mkdirSync(join(snap, "parent"), { recursive: true });
  mkdirSync(join(snap, "applied"), { recursive: true });

  const parentParts: string[] = [];
  const destRels: string[] = [];
  for (const file of input.files) {
    const destRel = (
      file.relPath.startsWith("harness/omp/staging/")
        ? file.relPath
        : join("harness/omp/staging", file.relPath.replace(/^harness\/omp\/overlay\/\.omp\//, ""))
    )
      .split("\\")
      .join("/");
    const destAbs = resolve(root, destRel);
    assertEvolverWrite(destAbs, root);
    const parentCopy = join(snap, "parent", destRel.replaceAll("/", "__"));
    if (existsSync(destAbs)) {
      copyFileSync(destAbs, parentCopy);
      parentParts.push(readFileSync(destAbs, "utf8"));
    } else {
      writeFileSync(parentCopy, "");
      parentParts.push("");
    }
    mkdirSync(dirname(destAbs), { recursive: true });
    writeFileSync(destAbs, file.content.endsWith("\n") ? file.content : `${file.content}\n`);
    writeFileSync(join(snap, "applied", destRel.replaceAll("/", "__")), file.content);
    destRels.push(destRel);
  }

  const manifest: CandidateManifest = {
    id: input.id,
    surface: input.surface,
    files: destRels,
    parentHash: hashContents(parentParts),
    scores: input.scores,
    rollback: `bun harness/omp/drivers/rollback-candidate.ts --id ${input.id}`,
    evidenceId: input.evidenceId,
    rootCause: input.rootCause,
  };
  const manifestPath = join(root, "harness/omp/overlay/.omp/manifests", `${input.id}.json`);
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

if (import.meta.main) {
  throw new Error("apply-candidate is a library entry; call applyCandidate() from tests or self-harness");
}
