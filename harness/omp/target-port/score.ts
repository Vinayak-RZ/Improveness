import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Split, SplitScore } from "../drivers/run-eval.ts";

export type FamilyFixture = {
  id: string;
  family: string;
};

export function loadFamilyFixture(dir: string): FamilyFixture {
  const path = join(dir, "fixture.json");
  if (!existsSync(path)) throw new Error(`missing fixture.json in ${dir}`);
  const spec = JSON.parse(readFileSync(path, "utf8")) as FamilyFixture;
  if (!spec.id || !spec.family) throw new Error(`fixture.json needs id and family: ${path}`);
  return spec;
}

/** Score a split: pass iff the playbook names the fixture's recipe family. */
export function scoreFamilyPlaybook(evalsRoot: string, split: Split, playbook: string): SplitScore {
  const dir = join(evalsRoot, split);
  if (!existsSync(dir)) {
    return { split, passed: 0, total: 0, byId: {}, results: [] };
  }
  const fixtures = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name))
    .sort();
  const byId: Record<string, boolean> = {};
  let passed = 0;
  for (const fixtureDir of fixtures) {
    const spec = loadFamilyFixture(fixtureDir);
    const ok = playbook.includes(spec.family);
    byId[spec.id] = ok;
    if (ok) passed++;
  }
  return { split, passed, total: fixtures.length, byId, results: [] };
}
