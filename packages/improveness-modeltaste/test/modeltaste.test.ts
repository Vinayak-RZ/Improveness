import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  loadProfile,
  detectFailures,
  applyRepairs,
  evaluateFit,
  getProfile,
  listProfiles,
  deepseekProfile,
  qwen3Profile,
} from "../src/index.ts";

describe("ModelProfile", () => {
  test("loads deepseek and qwen3 catalogs", () => {
    expect(getProfile("deepseek").family).toBe("deepseek");
    expect(getProfile("qwen3").dialect).toBe("qwen3");
    expect(listProfiles()).toHaveLength(2);
    expect(loadProfile(deepseekProfile).repairIds.length).toBeGreaterThanOrEqual(5);
    expect(qwen3Profile.systemContractSnippets.length).toBeGreaterThan(0);
  });

  test("rejects garbage profiles", () => {
    expect(() => loadProfile({})).toThrow();
  });
});

describe("detect + repair", () => {
  test("string-where-array coerce", () => {
    const trace = {
      tool: "read_many",
      args: { paths: "a.ts" },
      schema: { properties: { paths: { type: "array" } } },
    };
    const fails = detectFailures(trace);
    expect(fails.some((f) => f.mode === "string-where-array")).toBe(true);
    const r = applyRepairs(trace, deepseekProfile);
    expect(r.args.paths).toEqual(["a.ts"]);
    expect(r.teachback.length).toBeGreaterThan(0);
  });

  test("markdown autolink unwrap", () => {
    const trace = {
      tool: "read",
      args: { path: "[src/a.ts](src/a.ts)" },
    };
    const r = applyRepairs(trace, deepseekProfile);
    expect(r.args.path).toBe("src/a.ts");
  });

  test("null omit + relational defaults", () => {
    const trace = {
      tool: "read",
      args: { path: "a.ts", limit: 30, extra: null },
    };
    const r = applyRepairs(trace, deepseekProfile);
    expect(r.args.extra).toBeUndefined();
    expect(r.args.offset).toBe(0);
  });

  test("validator teachback reshape", () => {
    const trace = {
      tool: "write",
      args: { path: "a.ts" },
      validationError: "ZodError: expected string at path [\"content\"], received undefined",
    };
    const r = applyRepairs(trace, deepseekProfile);
    expect(r.teachback.join(" ")).toMatch(/content/i);
  });
});

describe("evaluateFit", () => {
  test("repairs improve accept rate on golden set", () => {
    const samples = [
      {
        rawValid: false,
        trace: {
          tool: "read_many",
          args: { paths: "x.ts" },
          schema: { properties: { paths: { type: "array" } } },
        },
      },
      {
        rawValid: true,
        trace: { tool: "read", args: { path: "ok.ts" } },
      },
      {
        rawValid: false,
        trace: { tool: "read", args: { path: "[y.ts](y.ts)", limit: 10 } },
      },
    ];
    const report = evaluateFit(samples, deepseekProfile);
    expect(report.repairedAccept).toBeGreaterThan(report.rawAccept);
    expect(report.delta).toBeGreaterThan(0);
  });
});

describe("modularity fence", () => {
  test("package sources do not import hosts", () => {
    const root = join(import.meta.dir, "../src");
    const { readdirSync } = require("node:fs") as typeof import("node:fs");
    function walk(dir: string): string[] {
      const out: string[] = [];
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) out.push(...walk(p));
        else if (p.endsWith(".ts")) out.push(p);
      }
      return out;
    }
    const bad = /from\s+["'].*(plugins\/|oh-my-pi\/packages)/;
    for (const file of walk(root)) {
      const body = readFileSync(file, "utf8");
      expect(bad.test(body)).toBe(false);
    }
  });
});
