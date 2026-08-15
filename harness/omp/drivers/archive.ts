import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { isKernelRel } from "./allowlist.ts";

export type ArchiveMeta = {
  id: string;
  parentId: string | null;
  fitness: number;
  fileHashes: Record<string, string>;
  createdAt: string;
};

export type ArchiveNode = {
  id: string;
  fitness: number;
  childCount: number;
};

const ALLOWED_SOURCES = [
  "harness/omp/overlay/.omp/playbook",
  "harness/omp/overlay/.omp/skills",
  "harness/omp/overlay/.omp/tools",
  "harness/omp/staging",
];

function walkFiles(dir: string): string[] {
  if (!statExists(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(path));
    else out.push(path);
  }
  return out;
}

function statExists(path: string): boolean {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

function sha256(body: string): string {
  return createHash("sha256").update(body).digest("hex");
}

export function sampleParent(nodes: ArchiveNode[]): string {
  if (nodes.length === 0) throw new Error("archive is empty");
  const weights = nodes.map((node) => Math.max(node.fitness, 0) / (1 + node.childCount));
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total === 0) return nodes[0].id;
  let best = 0;
  for (let i = 1; i < nodes.length; i++) {
    if (weights[i] > weights[best]) best = i;
  }
  return nodes[best].id;
}

export function snapshotOverlay(input: {
  id: string;
  repoRoot: string;
  parentId?: string | null;
  fitness: number;
  sources?: string[];
}): ArchiveMeta {
  const root = resolve(input.repoRoot);
  const sources = input.sources ?? ALLOWED_SOURCES;
  const destRoot = join(root, "harness/omp/archive", input.id);
  mkdirSync(join(destRoot, "files"), { recursive: true });

  const fileHashes: Record<string, string> = {};
  for (const sourceRel of sources) {
    if (isKernelRel(sourceRel)) {
      throw new Error(`archive refuses kernel path: ${sourceRel}`);
    }
    const sourceAbs = resolve(root, sourceRel);
    if (!statExists(sourceAbs)) continue;
    for (const file of walkFiles(sourceAbs)) {
      const rel = relative(root, file).split(sep).join("/");
      if (isKernelRel(rel)) {
        throw new Error(`archive refuses kernel path: ${rel}`);
      }
      const body = readFileSync(file, "utf8");
      fileHashes[rel] = sha256(body);
      const dest = join(destRoot, "files", rel.replaceAll("/", "__"));
      cpSync(file, dest);
    }
  }

  const meta: ArchiveMeta = {
    id: input.id,
    parentId: input.parentId ?? null,
    fitness: input.fitness,
    fileHashes,
    createdAt: new Date().toISOString(),
  };
  writeFileSync(join(destRoot, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  return meta;
}
