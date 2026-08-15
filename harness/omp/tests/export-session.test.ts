import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { exportSession } from "../drivers/export-session.ts";

const FIXTURE = join(import.meta.dir, "../evals/fixtures/omp-session.jsonl");

describe("exportSession", () => {
  test("golden jsonl becomes a stable trace tree", () => {
    const tracesRoot = mkdtempSync(join(tmpdir(), "traces-"));
    const result = exportSession(FIXTURE, tracesRoot);

    expect(result.sessionId).toBe("sess-omp-golden");
    expect(result.outDir).toBe(join(tracesRoot, "sess-omp-golden"));
    expect(result.turns.map((t) => t.role)).toEqual(["user", "assistant", "assistant"]);
    expect(result.toolCalls).toEqual([
      {
        id: "call-1",
        name: "read",
        input: { path: "src/greet.ts" },
        output: [{ type: "text", text: "export function greet() {}" }],
        timestamp: 3,
      },
    ]);
    expect(result.outcome).toEqual({ passed: true, exitCode: 0, reason: "explicit" });

    const meta = JSON.parse(readFileSync(join(result.outDir, "meta.json"), "utf8"));
    expect(meta.id).toBe("sess-omp-golden");
    expect(meta.model).toBe("test-smol");
    expect(JSON.parse(readFileSync(join(result.outDir, "outcome.json"), "utf8"))).toEqual(result.outcome);
    expect(readFileSync(join(result.outDir, "tool_calls.jsonl"), "utf8")).toContain("\"name\":\"read\"");
    expect(JSON.parse(readFileSync(join(result.outDir, "turns", "000.json"), "utf8")).text).toContain("named export");
  });

  test("infers outcome from assistant stopReason when verifier field is missing", () => {
    const tracesRoot = mkdtempSync(join(tmpdir(), "traces-"));
    const { writeFileSync } = require("node:fs") as typeof import("node:fs");
    const jsonl = join(tracesRoot, "no-outcome.jsonl");
    writeFileSync(
      jsonl,
      `${JSON.stringify({ role: "assistant", stopReason: "error", content: [{ type: "text", text: "boom" }] })}\n`,
    );
    const result = exportSession(jsonl, tracesRoot);
    expect(result.outcome).toEqual({ reason: "inferred", stopReason: "error" });
  });
});
