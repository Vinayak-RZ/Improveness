import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { CACD_ITEMS } from "../cacd/catalog.ts";

export type QaFinding = {
  id: string;
  ok: boolean;
  detail: string;
};

const LINK_RE = /\[[^\]]+\]\(([^)]+)\)/g;

export function listMarkdownFiles(root: string, relDirs: string[]): string[] {
  const out: string[] = [];
  for (const rel of relDirs) {
    const dir = join(root, rel);
    if (!existsSync(dir)) continue;
    walkMd(dir, root, out);
  }
  return out.sort();
}

function walkMd(dir: string, root: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "oh-my-pi" || entry.name === "vendor") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkMd(path, root, out);
    else if (entry.name.endsWith(".md")) out.push(path);
  }
}

export function checkCacdCatalog(repoRoot: string): QaFinding[] {
  return CACD_ITEMS.map((item) => {
    const abs = resolve(repoRoot, item.path);
    if (!existsSync(abs)) {
      return { id: item.id, ok: false, detail: `missing ${item.path}` };
    }
    const body = readFileSync(abs, "utf8");
    const missing = item.mustContain.filter((needle) => !body.includes(needle));
    if (missing.length > 0) {
      return { id: item.id, ok: false, detail: `${item.path} missing ${missing.join(", ")}` };
    }
    return { id: item.id, ok: true, detail: item.title };
  });
}

export function checkRelativeLinks(repoRoot: string, files: string[]): QaFinding[] {
  const findings: QaFinding[] = [];
  for (const file of files) {
    const body = readFileSync(file, "utf8");
    const dir = dirname(file);
    let match: RegExpExecArray | null;
    const re = new RegExp(LINK_RE.source, "g");
    while ((match = re.exec(body))) {
      const href = match[1].split("#")[0].split(" ")[0];
      if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) continue;
      const target = resolve(dir, href);
      if (!existsSync(target)) {
        findings.push({
          id: `link:${file.replace(repoRoot + "/", "")}`,
          ok: false,
          detail: `broken ${href}`,
        });
      }
    }
  }
  if (findings.length === 0) {
    findings.push({ id: "links", ok: true, detail: `${files.length} markdown files` });
  }
  return findings;
}

export function checkFixtureInventory(repoRoot: string): QaFinding {
  const heldIn = countFixtures(join(repoRoot, "harness/omp/evals/held-in"));
  const heldOut = countFixtures(join(repoRoot, "harness/omp/evals/held-out"));
  const ok = heldIn >= 12 && heldOut >= 8;
  return {
    id: "fixtures",
    ok,
    detail: `held-in=${heldIn} held-out=${heldOut}`,
  };
}

function countFixtures(dir: string): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir, { withFileTypes: true }).filter((entry) => {
    if (!entry.isDirectory()) return false;
    return existsSync(join(dir, entry.name, "fixture.json"));
  }).length;
}

export function runRepoQa(repoRoot: string): { ok: boolean; findings: QaFinding[] } {
  const root = resolve(repoRoot);
  const md = [
    ...["README.md", "IMPLEMENTATION_PLAN.md", "DECISIONS.md", "PROGRESS.md", "LEARNING.md", "PROJECT_OVERVIEW.md"]
      .map((name) => join(root, name))
      .filter((path) => existsSync(path)),
    ...listMarkdownFiles(root, ["docs", "harness/omp"]),
  ].filter((path) => {
    try {
      return statSync(path).isFile();
    } catch {
      return false;
    }
  });
  const findings = [
    ...checkCacdCatalog(root),
    ...checkRelativeLinks(root, md),
    checkFixtureInventory(root),
  ];
  return { ok: findings.every((item) => item.ok), findings };
}

if (import.meta.main) {
  const result = runRepoQa(process.cwd());
  for (const finding of result.findings) {
    console.log(`${finding.ok ? "ok" : "FAIL"}  ${finding.id}  ${finding.detail}`);
  }
  if (!result.ok) process.exit(1);
}
