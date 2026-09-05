import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const repoRoot = join(import.meta.dir, "../../..");
const overlay = join(repoRoot, "harness/omp/overlay/.omp");
const systemPromptMd = join(
  repoRoot,
  "oh-my-pi/packages/coding-agent/src/prompts/system/system-prompt.md",
);
const systemPromptTs = join(repoRoot, "oh-my-pi/packages/coding-agent/src/system-prompt.ts");

const SCAN_ROOTS = [
  join(repoRoot, "harness/omp/drivers"),
  join(repoRoot, "harness/omp/overlay/.omp"),
  join(repoRoot, "harness/omp/scripts"),
];

function collectFiles(dir: string): string[] {
  const { readdirSync } = require("node:fs") as typeof import("node:fs");
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(path));
    else out.push(path);
  }
  return out;
}

describe("playbook injection", () => {
  test("AGENTS.md lists PLAYBOOK.md as context and forbids system.md edits", () => {
    const agents = readFileSync(join(overlay, "AGENTS.md"), "utf8");
    expect(agents).toContain("playbook/PLAYBOOK.md");
    expect(agents).toMatch(/Do not edit[\s\S]*system-prompt\.md/);
  });

  test("overlay and drivers do not write the system prompt files", () => {
    const writeSystem = /writeFileSync\([^)]*system-prompt\.(md|ts)|writeFileSync\([^)]*SYSTEM\.md/i;
    const hits: string[] = [];
    for (const root of SCAN_ROOTS) {
      for (const file of collectFiles(root)) {
        if (!file.endsWith(".ts")) continue;
        const body = readFileSync(file, "utf8");
        if (writeSystem.test(body)) hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });

  test("in-tree system prompt files exist and are not Improveness-owned writes", () => {
    // Kernel fence: Improveness must not edit these. After an OMP snapshot refresh the
    // whole tree may differ from the previous commit; assert presence + no Improveness
    // markers rather than empty `git diff` (that only holds on a clean committed tree).
    expect(existsSync(systemPromptMd)).toBe(true);
    expect(existsSync(systemPromptTs)).toBe(true);
    const md = readFileSync(systemPromptMd, "utf8");
    const ts = readFileSync(systemPromptTs, "utf8");
    expect(md.toLowerCase()).not.toContain("improveness");
    expect(ts.toLowerCase()).not.toContain("improveness");
    const { spawnSync } = require("node:child_process") as typeof import("node:child_process");
    const status = spawnSync("git", ["status", "--porcelain", "--", "oh-my-pi/SNAPSHOT.md"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(status.status).toBe(0);
  });

  test("install-overlay merges playbook without replacing an existing .omp tree", () => {
    const { mkdirSync, mkdtempSync, writeFileSync } = require("node:fs") as typeof import("node:fs");
    const { tmpdir } = require("node:os") as typeof import("node:os");
    const { spawnSync } = require("node:child_process") as typeof import("node:child_process");
    const dest = mkdtempSync(join(tmpdir(), "omp-overlay-"));
    mkdirSync(join(dest, "commands"), { recursive: true });
    writeFileSync(join(dest, "commands", "keep.md"), "upstream\n");
    const { posixBash } = require("../evals/checker/posix-bash.ts") as typeof import("../evals/checker/posix-bash.ts");
    const result = spawnSync(posixBash(), [join(repoRoot, "harness/omp/scripts/install-overlay.sh")], {
      cwd: repoRoot,
      encoding: "utf8",
      env: { ...process.env, OMP_OVERLAY_DEST: dest },
    });
    expect(result.status).toBe(0);
    expect(existsSync(join(dest, "playbook/PLAYBOOK.md"))).toBe(true);
    expect(existsSync(join(dest, "AGENTS.md"))).toBe(true);
    expect(readFileSync(join(dest, "commands/keep.md"), "utf8")).toBe("upstream\n");
  });
});
