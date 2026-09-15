import { existsSync, readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { TARGET_KINDS, type TargetKind, type TargetManifest, type TargetPort } from "./types.ts";
import { scoreFamilyPlaybook } from "./score.ts";
import { stageTargetCandidate } from "./improve.ts";

function posix(rel: string): string {
  return rel.split("\\").join("/");
}

function prefixHit(rel: string, prefix: string): boolean {
  const p = posix(prefix);
  const r = posix(rel);
  return r === p.replace(/\/$/, "") || r.startsWith(p.endsWith("/") ? p : `${p}/`) || r.startsWith(p);
}

export function parseTargetKind(value: string): TargetKind {
  if ((TARGET_KINDS as readonly string[]).includes(value)) return value as TargetKind;
  throw new Error(`unknown target kind: ${value} (want ${TARGET_KINDS.join(" | ")})`);
}

export function loadTargetManifest(absPath: string): TargetManifest {
  if (!existsSync(absPath)) throw new Error(`target manifest missing: ${absPath}`);
  const raw = JSON.parse(readFileSync(absPath, "utf8")) as TargetManifest;
  if (!raw.id || typeof raw.id !== "string") throw new Error("target manifest needs id");
  raw.kind = parseTargetKind(raw.kind);
  if (!Array.isArray(raw.frozenIds) || raw.frozenIds.length === 0) {
    throw new Error(`target ${raw.id}: frozenIds required`);
  }
  if (!Array.isArray(raw.frozenPrefixes) || raw.frozenPrefixes.length === 0) {
    throw new Error(`target ${raw.id}: frozenPrefixes required`);
  }
  if (!Array.isArray(raw.editablePrefixes) || raw.editablePrefixes.length === 0) {
    throw new Error(`target ${raw.id}: editablePrefixes required`);
  }
  if (!raw.stagingPrefix) throw new Error(`target ${raw.id}: stagingPrefix required`);
  if (!raw.eval || raw.eval.kind !== "family-playbook" || !raw.eval.root) {
    throw new Error(`target ${raw.id}: eval.kind must be family-playbook`);
  }
  if (!Array.isArray(raw.heldOutIds)) raw.heldOutIds = [];
  return raw;
}

export function createTargetPort(manifest: TargetManifest, repoRoot: string): TargetPort {
  const evalRoot = resolve(repoRoot, manifest.eval.root);
  return {
    id: manifest.id,
    kind: manifest.kind,
    manifest,
    frozenIds() {
      return [...manifest.frozenIds];
    },
    listSurfaces() {
      return { frozen: [...manifest.frozenPrefixes], editable: [...manifest.editablePrefixes] };
    },
    isFrozenRel(rel: string) {
      return manifest.frozenPrefixes.some((p) => prefixHit(rel, p));
    },
    isEditableRel(rel: string) {
      return manifest.editablePrefixes.some((p) => prefixHit(rel, p)) || prefixHit(rel, manifest.stagingPrefix);
    },
    score(split, playbook) {
      return scoreFamilyPlaybook(evalRoot, split, playbook);
    },
    stage(files, root) {
      return stageTargetCandidate(files, root, manifest);
    },
  };
}

export function loadTarget(repoRoot: string, idOrPath: string): TargetPort {
  const direct = idOrPath.endsWith("manifest.json") || idOrPath.includes("/")
    ? resolve(repoRoot, idOrPath)
    : join(repoRoot, "harness/omp/targets", idOrPath, "manifest.json");
  const abs = existsSync(direct) ? direct : join(repoRoot, idOrPath, "manifest.json");
  const manifest = loadTargetManifest(abs);
  // Trust-boundary: paths in the manifest must stay under repoRoot.
  const root = resolve(repoRoot);
  for (const rel of [...manifest.frozenPrefixes, ...manifest.editablePrefixes, manifest.stagingPrefix, manifest.eval.root]) {
    const resolved = resolve(root, rel);
    if (resolved !== root && !resolved.startsWith(root + sep)) {
      throw new Error(`target path escapes repo: ${rel}`);
    }
  }
  return createTargetPort(manifest, repoRoot);
}
