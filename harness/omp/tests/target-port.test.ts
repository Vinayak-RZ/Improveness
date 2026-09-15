import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { assertTargetWrite } from "../drivers/allowlist.ts";
import { decideAccept } from "../drivers/self-harness.ts";
import {
  TARGET_KINDS,
  improveTarget,
  loadTarget,
  parseTargetKind,
} from "../target-port/index.ts";

const repoRoot = join(import.meta.dir, "../../..");

function tempRoot(): string {
  return mkdtempSync(join(tmpdir(), "target-port-"));
}

function writeMiniKernel(root: string): void {
  const evalRoot = "harness/omp/targets/mini/eval";
  mkdirSync(join(root, evalRoot, "held-in/a"), { recursive: true });
  mkdirSync(join(root, evalRoot, "held-out/z"), { recursive: true });
  mkdirSync(join(root, "harness/omp/targets/mini/surfaces"), { recursive: true });
  writeFileSync(join(root, evalRoot, "held-in/a/fixture.json"), JSON.stringify({ id: "a", family: "recipe:alpha" }));
  writeFileSync(join(root, evalRoot, "held-out/z/fixture.json"), JSON.stringify({ id: "z", family: "recipe:alpha" }));
  writeFileSync(
    join(root, "harness/omp/targets/mini/manifest.json"),
    JSON.stringify({
      id: "mini",
      kind: "domain-kernel",
      title: "mini",
      frozenIds: ["mini.gold"],
      frozenPrefixes: [`${evalRoot}/`],
      editablePrefixes: ["harness/omp/targets/mini/surfaces/"],
      stagingPrefix: "harness/omp/targets/mini/staging/",
      heldOutIds: ["z"],
      eval: { kind: "family-playbook", root: evalRoot },
    }),
  );
}

describe("TargetPort kinds", () => {
  test("parses domain-kernel, agentic-harness, and agentic-system", () => {
    expect(TARGET_KINDS).toEqual(["domain-kernel", "agentic-harness", "agentic-system"]);
    expect(parseTargetKind("agentic-system")).toBe("agentic-system");
    expect(() => parseTargetKind("coding-only")).toThrow(/unknown target kind/);
  });
});

describe("ARC domain-kernel fixture", () => {
  test("empty playbook is 0; recipes unlock held-in and held-out", () => {
    const port = loadTarget(repoRoot, "arc");
    expect(port.kind).toBe("domain-kernel");
    expect(port.frozenIds()).toContain("arc.eval.score");
    const empty = port.score("held-in", "");
    expect(empty.passed).toBe(0);
    expect(empty.total).toBe(3);
    const full = [
      "recipe:solve-circuit",
      "recipe:cite-chapter",
      "recipe:label-unverified",
    ].join("\n");
    expect(port.score("held-in", full).passed).toBe(3);
    expect(port.score("held-out", full).passed).toBe(3);
    expect(port.manifest.heldOutIds).toContain("unverified-novel-01");
  });

  test("frozen eval and KERNEL.md refuse writes", () => {
    const port = loadTarget(repoRoot, "arc");
    expect(() =>
      assertTargetWrite(join(repoRoot, "harness/omp/targets/arc/eval/score.md"), repoRoot, port.manifest),
    ).toThrow(/frozen physics/);
    expect(() =>
      assertTargetWrite(join(repoRoot, "harness/omp/targets/arc/KERNEL.md"), repoRoot, port.manifest),
    ).toThrow(/frozen physics/);
    expect(() =>
      assertTargetWrite(join(repoRoot, "plugins/dsh-improveness/package.json"), repoRoot, port.manifest),
    ).toThrow(/improveness kernel/);
  });
});

describe("generic agentic-system fixture", () => {
  test("is not a coding harness and still uses decideAccept", () => {
    const port = loadTarget(repoRoot, "generic-agentic");
    expect(port.kind).toBe("agentic-system");
    const after = "recipe:confirm-before-send\nrecipe:strict-tool-schema\nrecipe:refuse-exfil";
    const beforeIn = port.score("held-in", "");
    const afterIn = port.score("held-in", after);
    const beforeOut = port.score("held-out", "");
    const afterOut = port.score("held-out", after);
    expect(decideAccept(beforeIn, afterIn, beforeOut, afterOut)).toBe("accept");
  });
});

describe("agentic-harness kind", () => {
  test("harness-stub loads as agentic-harness", () => {
    const port = loadTarget(repoRoot, "harness-stub");
    expect(port.kind).toBe("agentic-harness");
    expect(port.score("held-in", "recipe:memory-slot").passed).toBe(1);
  });
});

describe("improveTarget", () => {
  test("accepts a gain and stages under the target prefix", () => {
    const root = tempRoot();
    writeMiniKernel(root);
    const port = loadTarget(root, "mini");
    const before = port.score("held-in", "");
    const after = port.score("held-in", "recipe:alpha");
    const outBefore = port.score("held-out", "");
    const outAfter = port.score("held-out", "recipe:alpha");
    const result = improveTarget({
      target: port,
      heldInBefore: before,
      heldInAfter: after,
      heldOutBefore: outBefore,
      heldOutAfter: outAfter,
      files: [{ relPath: "PLAYBOOK.md", content: "- recipe:alpha\n" }],
      repoRoot: root,
    });
    expect(result.decision).toBe("accept");
    expect(result.staged.some((p) => p.includes("staging/"))).toBe(true);
    expect(readFileSync(join(root, result.staged[0]), "utf8")).toContain("recipe:alpha");
    rmSync(root, { recursive: true, force: true });
  });

  test("held-out regression does not stage", () => {
    const root = tempRoot();
    writeMiniKernel(root);
    const port = loadTarget(root, "mini");
    const hi = port.score("held-in", "recipe:alpha");
    const hoBefore = port.score("held-out", "recipe:alpha");
    const hoAfter = port.score("held-out", "");
    const result = improveTarget({
      target: port,
      heldInBefore: port.score("held-in", ""),
      heldInAfter: hi,
      heldOutBefore: hoBefore,
      heldOutAfter: hoAfter,
      files: [{ relPath: "PLAYBOOK.md", content: "bad" }],
      repoRoot: root,
    });
    expect(result.decision).toBe("reject-held-out");
    expect(result.staged).toEqual([]);
    rmSync(root, { recursive: true, force: true });
  });

  test("proposer held-in-only list never contains held-out ids", () => {
    const port = loadTarget(repoRoot, "arc");
    const failing = Object.entries(port.score("held-in", "").byId)
      .filter(([, pass]) => !pass)
      .map(([id]) => id);
    for (const hidden of port.manifest.heldOutIds) {
      expect(failing).not.toContain(hidden);
    }
  });
});
