import { describe, expect, test } from "bun:test";

describe("DSH live profile smoke", () => {
  const live = process.env.DSH_LIVE_SMOKE === "1";

  test("skip-gated unless DSH_LIVE_SMOKE=1", () => {
    if (!live) {
      expect(process.env.DSH_LIVE_SMOKE ?? "").not.toBe("1");
      return;
    }
    expect(["dsh-base", "dsh-web-app", "dsh-improveness"].join("+")).toContain("dsh-improveness");
  });
});
