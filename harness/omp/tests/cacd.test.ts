import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { CACD_ITEMS, CACD_LAYERS } from "../cacd/catalog.ts";
import { checkCacdCatalog } from "../drivers/qa-repo.ts";

const repoRoot = join(import.meta.dir, "../../..");

describe("CACD catalog", () => {
  test("covers all four layers", () => {
    const layers = new Set(CACD_ITEMS.map((item) => item.layer));
    for (const layer of CACD_LAYERS) expect(layers.has(layer)).toBe(true);
    expect(CACD_ITEMS.length).toBeGreaterThanOrEqual(12);
  });

  test("every catalog path exists and contains its needles", () => {
    const findings = checkCacdCatalog(repoRoot);
    const failed = findings.filter((item) => !item.ok);
    expect(failed).toEqual([]);
  });
});
