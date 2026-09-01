import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function pluginRoot() {
  return join(dirname(fileURLToPath(import.meta.url)), "..");
}

function resolveRunner() {
  if (process.env.IMPROVENESS_CORE_RUNNER) return process.env.IMPROVENESS_CORE_RUNNER;
  const bundled = join(pluginRoot(), "runtime/dsh-core-runner.ts");
  if (existsSync(bundled)) return bundled;
  const checkout = join(pluginRoot(), "../../harness/omp/drivers/dsh-core-runner.ts");
  if (existsSync(checkout)) return checkout;
  throw new Error("Improveness core runner not found");
}

/**
 * JSONL one-shot RPC to the Bun loop.
 * ponytail: subprocess instead of a shared package until P1 needs both hosts to import one module.
 * Ceiling: hop latency. Upgrade: packages/improveness-core.
 */
export function callCore(method, params = {}) {
  const runner = resolveRunner();
  const bun = process.env.BUN_PATH ?? (typeof process.versions?.bun === "string" ? process.execPath : "bun");
  const payload = `${JSON.stringify({ id: 1, method, params })}\n`;
  const result = spawnSync(bun, [runner], {
    input: payload,
    encoding: "utf8",
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `core runner exit ${result.status}`);
  }
  const line = (result.stdout || "")
    .split(/\r?\n/)
    .map((row) => row.trim())
    .find((row) => row.startsWith("{"));
  if (!line) throw new Error("core runner returned no JSON");
  const parsed = JSON.parse(line);
  if (!parsed.ok) throw new Error(parsed.error || "core runner error");
  return parsed.result;
}
