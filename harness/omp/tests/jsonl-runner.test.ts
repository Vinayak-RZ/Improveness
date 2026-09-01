import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { exportSession } from "../drivers/export-session.ts";

const runner = join(import.meta.dir, "../drivers/dsh-core-runner.ts");

function rpc(method: string, params: Record<string, unknown> = {}) {
  const bun = process.env.BUN_PATH ?? process.execPath;
  const result = spawnSync(bun, [runner], {
    input: `${JSON.stringify({ id: 1, method, params })}\n`,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || "runner failed");
  const line = result.stdout.split(/\r?\n/).find((row) => row.startsWith("{"));
  return JSON.parse(line ?? "{}");
}

describe("JSONL core runner", () => {
  test("ping and frozenIds", () => {
    expect(rpc("ping").result.pong).toBe(true);
    expect(rpc("frozenIds").result).toContain("dsh-improveness");
  });

  test("exportTrace maps a DSH-shaped session log", () => {
    const dir = mkdtempSync(join(tmpdir(), "dsh-log-"));
    const jsonl = join(dir, "session.jsonl");
    writeFileSync(
      jsonl,
      [
        JSON.stringify({ sessionId: "dsh-1", type: "message", role: "user", content: "hello" }),
        JSON.stringify({ type: "tool_call", name: "bash", arguments: { cmd: "ls" } }),
        JSON.stringify({ type: "outcome", passed: true, exitCode: 0 }),
      ].join("\n") + "\n",
    );
    const traces = join(dir, "traces");
    mkdirSync(traces);
    const exported = exportSession(jsonl, traces);
    expect(exported.sessionId).toBe("dsh-1");
    expect(exported.toolCalls.some((call) => call.name === "bash")).toBe(true);
    const viaRpc = rpc("exportTrace", { jsonlPath: jsonl, tracesRoot: traces });
    expect(viaRpc.ok).toBe(true);
    expect(viaRpc.result.sessionId).toBe("dsh-1");
  });
});
