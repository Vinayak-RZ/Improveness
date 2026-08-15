import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import {
  assertDebuggerTool,
  assertDiagnosisPath,
  DEBUGGER_ALLOWED_TOOLS,
  isDebuggerToolAllowed,
} from "../drivers/allowlist.ts";
import { writeDiagnosis } from "../drivers/write-diagnosis.ts";

const repoRoot = join(import.meta.dir, "../../..");
const debuggerMd = join(repoRoot, "harness/omp/overlay/.omp/agents/debugger.md");

describe("debugger allowlist", () => {
  test("agent markdown pins read-only tools and smol", () => {
    const body = readFileSync(debuggerMd, "utf8");
    expect(body).toMatch(/^---[\s\S]*tools:\s*read,\s*grep,\s*glob/m);
    expect(body).toContain("model: \"@debugger\"");
    expect(body).toMatch(/Denied:.*\b(edit|write|bash)/);
  });

  test("allows read/grep/find and denies write/edit/bash", () => {
    for (const tool of DEBUGGER_ALLOWED_TOOLS) {
      expect(isDebuggerToolAllowed(tool)).toBe(true);
      expect(() => assertDebuggerTool(tool)).not.toThrow();
    }
    for (const tool of ["write", "edit", "bash"]) {
      expect(isDebuggerToolAllowed(tool)).toBe(false);
      expect(() => assertDebuggerTool(tool)).toThrow(/denied/);
    }
  });

  test("cannot write PLAYBOOK.md or OMP source", () => {
    expect(() =>
      assertDiagnosisPath(join(repoRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), repoRoot),
    ).toThrow(/diagnosis\.md/);
    expect(() =>
      assertDiagnosisPath(join(repoRoot, "oh-my-pi/packages/coding-agent/src/system-prompt.ts"), repoRoot),
    ).toThrow(/diagnosis\.md/);
  });

  test("harness writeDiagnosis only accepts traces or reports diagnosis.md", () => {
    const path = join(repoRoot, "harness/omp/traces/sess-omp-golden/diagnosis.md");
    const resolved = assertDiagnosisPath(path, repoRoot);
    expect(resolved.endsWith("diagnosis.md")).toBe(true);
    const written = writeDiagnosis(path, "# Diagnosis\n\nRead tool call-1 succeeded.\n", repoRoot);
    expect(readFileSync(written, "utf8")).toContain("call-1");
  });

  test("refuses diagnosis.md outside traces/reports even in a temp repo", () => {
    const tmp = mkdtempSync(join(tmpdir(), "dbg-"));
    expect(() => assertDiagnosisPath(join(tmp, "diagnosis.md"), tmp)).toThrow(/traces\/ or reports/);
  });
});
