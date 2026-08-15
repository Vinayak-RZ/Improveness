import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { isManifest } from "../drivers/manifest.ts";

const harness = join(import.meta.dir, "..");

describe("review queue", () => {
  test("REVIEW_QUEUE.md exists and is not an auto-apply script", () => {
    const body = readFileSync(join(harness, "REVIEW_QUEUE.md"), "utf8");
    expect(body).toContain("parentHash");
    expect(body).toContain("rollback");
    expect(body).toContain("cand-example-playbook");
    expect(body).toMatch(/no auto-apply/i);
    expect(existsSync(join(harness, "drivers/auto-apply.ts"))).toBe(false);
    const drivers = readdirSync(join(harness, "drivers"));
    expect(drivers.some((name) => /auto-apply|autoapply/i.test(name))).toBe(false);
  });

  test("example manifest has required schema fields", () => {
    const manifest = JSON.parse(
      readFileSync(join(harness, "overlay/.omp/manifests/cand-example-playbook.json"), "utf8"),
    );
    expect(isManifest(manifest)).toBe(true);
    expect(manifest.surface).toBe("playbook");
    expect(manifest.files.length).toBeGreaterThan(0);
    expect(manifest.parentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(manifest.rollback).toContain("rollback-candidate");
    expect(manifest.scores.heldIn.total).toBeGreaterThan(0);
    expect(manifest.scores.heldOut.total).toBeGreaterThan(0);
  });
});
