import { createRequire } from "node:module";
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { assertEvolverWrite, isKernelRel } from "./allowlist.ts";
import { DSH_FROZEN_IDS, isFrozenId } from "../../../plugins/dsh-improveness/src/frozen-ids.js";

export type DurablePluginManifest = {
  id: string;
  slot: "memory" | "planning" | "action" | "capability";
  files: Record<string, string>;
  repoRoot: string;
  generatedRoot?: string;
};

export type ApplyDurableResult = {
  id: string;
  dir: string;
  previousDir: string | null;
};

export function isGeneratedPluginPath(rel: string): boolean {
  const posix = rel.split(sep).join("/");
  return posix.startsWith("harness/omp/generated/") || posix.includes("improveness-generated/");
}

export function defaultGeneratedRoot(repoRoot: string): string {
  if (process.env.IMPROVENESS_GENERATED) return process.env.IMPROVENESS_GENERATED;
  if (process.env.DSH_HOME) {
    return join(process.env.DSH_HOME, "profiles/improveness/improveness-generated");
  }
  return join(resolve(repoRoot), "harness/omp/generated");
}

function writeTree(dir: string, files: Record<string, string>): void {
  mkdirSync(dir, { recursive: true });
  for (const [rel, body] of Object.entries(files)) {
    const posix = rel.split(sep).join("/");
    if (posix.includes("..")) throw new Error(`path escape: ${rel}`);
    const abs = join(dir, posix);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, body.endsWith("\n") ? body : `${body}\n`);
  }
}

function loadApply(applyPath: string): (ctx: FakeValidateCtx) => () => void {
  const require = createRequire(applyPath);
  const mod = require(applyPath) as { apply?: (ctx: FakeValidateCtx) => () => void; default?: (ctx: FakeValidateCtx) => () => void };
  const apply = mod.apply ?? mod.default;
  if (typeof apply !== "function") throw new Error(`generated plugin has no apply()`);
  return apply;
}

type FakeValidateCtx = {
  tools: { register: (name: string, fn?: unknown) => void; unregister: (name: string) => void };
};

export function validateGeneratedPlugin(dir: string, id: string): void {
  if (isFrozenId(id)) throw new Error(`frozen id denied: ${id}`);
  const applyPath = ["apply.js", "src/apply.js", "index.js"].map((name) => join(dir, name)).find((path) => existsSync(path));
  if (!applyPath) throw new Error(`generated plugin ${id} missing apply.js`);
  const apply = loadApply(applyPath);
  const registrations: string[] = [];
  const ctx: FakeValidateCtx = {
    tools: {
      register(name: string) {
        registrations.push(name);
      },
      unregister(name: string) {
        const i = registrations.indexOf(name);
        if (i >= 0) registrations.splice(i, 1);
      },
    },
  };
  const dispose = apply(ctx);
  if (typeof dispose !== "function") throw new Error(`generated plugin ${id} apply() must return a disposer`);
  dispose();
  if (registrations.length > 0) {
    throw new Error(`generated plugin ${id} disposer is not invertible (${registrations.join(", ")} still registered)`);
  }
}

export function applyDurablePlugin(manifest: DurablePluginManifest): ApplyDurableResult {
  if (isFrozenId(manifest.id)) throw new Error(`frozen id denied: ${manifest.id}`);
  const root = resolve(manifest.repoRoot);
  const generatedRoot = manifest.generatedRoot ?? defaultGeneratedRoot(root);
  mkdirSync(generatedRoot, { recursive: true });

  for (const rel of Object.keys(manifest.files)) {
    const posix = rel.split(sep).join("/");
    if (isKernelRel(posix) || posix.includes("plugins/dsh-improveness")) {
      throw new Error(`apply refuses kernel path: ${rel}`);
    }
  }

  const dest = join(generatedRoot, manifest.id);
  const relDest = dest.startsWith(root) ? dest.slice(root.length + 1).split(sep).join("/") : dest;
  if (relDest.startsWith("harness/omp/generated/")) {
    assertEvolverWrite(join(dest, "apply.js"), root);
  }

  const candidateDir = join(generatedRoot, ".candidates", manifest.id);
  rmSync(candidateDir, { recursive: true, force: true });
  writeTree(candidateDir, manifest.files);
  writeFileSync(
    join(candidateDir, "manifest.json"),
    `${JSON.stringify({ id: manifest.id, slot: manifest.slot, frozenIds: DSH_FROZEN_IDS }, null, 2)}\n`,
  );
  validateGeneratedPlugin(candidateDir, manifest.id);

  let previousDir: string | null = null;
  if (existsSync(dest)) {
    previousDir = `${dest}.bak`;
    rmSync(previousDir, { recursive: true, force: true });
    renameSync(dest, previousDir);
  }
  mkdirSync(dirname(dest), { recursive: true });
  renameSync(candidateDir, dest);

  return { id: manifest.id, dir: dest, previousDir };
}

export function rollbackDurablePlugin(id: string, repoRoot: string, generatedRoot?: string): string {
  const root = generatedRoot ?? defaultGeneratedRoot(repoRoot);
  const dest = join(root, id);
  const bak = `${dest}.bak`;
  if (!existsSync(bak)) throw new Error(`no rollback copy for ${id}`);
  rmSync(dest, { recursive: true, force: true });
  renameSync(bak, dest);
  return dest;
}

export function listGeneratedPlugins(repoRoot: string, generatedRoot?: string): string[] {
  const root = generatedRoot ?? defaultGeneratedRoot(repoRoot);
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);
}

/** Uninstalling the bundle must not delete accepted siblings. */
export function uninstallImprovenessBundle(bundleDir: string, generatedRoot: string): void {
  rmSync(bundleDir, { recursive: true, force: true });
  void generatedRoot;
}

export function copyGeneratedTo(src: string, dest: string): void {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

export function pluginApplySource(toolName = "cap.echo"): string {
  return `function apply(ctx) {
  ctx.tools.register(${JSON.stringify(toolName)}, function () { return "ok"; });
  return function () { ctx.tools.unregister(${JSON.stringify(toolName)}); };
}
module.exports = { apply };
`;
}
