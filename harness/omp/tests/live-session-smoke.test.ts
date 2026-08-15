import { describe, expect, test } from "bun:test";
import {
  buildSmokeOptions,
  runLiveSessionSmoke,
  shouldSkipLiveSmoke,
} from "../drivers/live-session-smoke.ts";

describe("live session smoke", () => {
  test("builds restricted createAgentSession options", () => {
    const options = buildSmokeOptions("/tmp/fixture");
    expect(options.restrictToolNames).toBe(true);
    expect(options.enableMCP).toBe(false);
    expect(options.modelPattern).toBe("@smol");
    expect(options.toolNames).toContain("read");
    expect(options.cwd).toBe("/tmp/fixture");
  });

  test("skips when OMP_LIVE_SMOKE is unset or credentials are missing", async () => {
    expect(shouldSkipLiveSmoke({}).skip).toBe(true);
    expect(shouldSkipLiveSmoke({ OMP_LIVE_SMOKE: "1" }).reason).toMatch(/no LLM credentials/);
    const skipped = await runLiveSessionSmoke({
      env: {},
      createSession: async () => {
        throw new Error("must not create a session when skipped");
      },
    });
    expect(skipped.skipped).toBe(true);
  });

  test("runs through an injected fake session when forced on", async () => {
    const result = await runLiveSessionSmoke({
      env: { OMP_LIVE_SMOKE: "1", ANTHROPIC_API_KEY: "test-not-real" },
      createSession: async (options) => {
        expect(options.restrictToolNames).toBe(true);
        return { prompt: async () => ({ text: "pong" }) };
      },
    });
    expect(result.skipped).toBe(false);
    expect(result.passed).toBe(true);
  });
});
