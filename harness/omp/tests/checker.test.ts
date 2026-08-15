import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { scoreWorkspace } from "../evals/checker/check.ts";

const evals = join(import.meta.dir, "../evals");

describe("frozen checker", () => {
  test("known-pass expected tree scores true", () => {
    const fixture = join(evals, "held-in/greet-export");
    const result = scoreWorkspace(fixture, join(fixture, "expected"));
    expect(result.passed).toBe(true);
    expect(result.id).toBe("greet-export");
    expect(result.split).toBe("held-in");
  });

  test("known-fail starter repo scores false", () => {
    const fixture = join(evals, "held-in/greet-export");
    const result = scoreWorkspace(fixture, join(fixture, "repo"));
    expect(result.passed).toBe(false);
  });

  test("held-out no-secrets fails on hardcoded key and passes on env", () => {
    const fixture = join(evals, "held-out/no-secrets");
    expect(scoreWorkspace(fixture, join(fixture, "repo")).passed).toBe(false);
    expect(scoreWorkspace(fixture, join(fixture, "expected")).passed).toBe(true);
  });

  test("all five fixtures have a check.sh and both trees", () => {
    const { existsSync } = require("node:fs") as typeof import("node:fs");
    const ids = [
      "held-in/greet-export",
      "held-in/sum-fn",
      "held-in/readme-title",
      "held-out/greet-types",
      "held-out/no-secrets",
    ];
    for (const id of ids) {
      const dir = join(evals, id);
      expect(existsSync(join(dir, "fixture.json"))).toBe(true);
      expect(existsSync(join(dir, "check.sh"))).toBe(true);
      expect(existsSync(join(dir, "repo"))).toBe(true);
      expect(existsSync(join(dir, "expected"))).toBe(true);
    }
  });
});
