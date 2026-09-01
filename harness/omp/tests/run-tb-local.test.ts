import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { listCheckedInAdapterTasks, runTbLocal } from "../drivers/run-tb-local.ts";

const evalsRoot = join(import.meta.dir, "../evals");

describe("local Harbor runner", () => {
  test("checked-in adapter is not a public TB2 campaign", () => {
    const ids = listCheckedInAdapterTasks(join(evalsRoot, "tb-adapter"));
    expect(ids).toContain("no-secrets");
  });

  test("known-fail no-secrets repo fails and expected workspace passes", () => {
    const adapterRoot = mkdtempSync(join(tmpdir(), "tb-run-"));
    const fail = runTbLocal({
      evalsRoot,
      splits: ["held-out"],
      workspace: "repo",
      adapterRoot,
    }).find((row) => row.id === "no-secrets");
    const pass = runTbLocal({
      evalsRoot,
      splits: ["held-out"],
      workspace: "expected",
      adapterRoot,
    }).find((row) => row.id === "no-secrets");
    expect(fail?.passed).toBe(false);
    expect(pass?.passed).toBe(true);
  }, 120_000);
});
