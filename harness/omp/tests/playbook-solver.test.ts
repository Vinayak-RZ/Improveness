import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { scorePlaybook } from "../drivers/playbook-solver.ts";

const evalsRoot = join(import.meta.dir, "../evals");

describe("playbook solver", () => {
  test("seed playbook unlocks nothing", () => {
    const heldIn = scorePlaybook(evalsRoot, "held-in", "# ACE playbook\n");
    const heldOut = scorePlaybook(evalsRoot, "held-out", "# ACE playbook\n");
    expect(heldIn.passed).toBe(0);
    expect(heldOut.passed).toBe(0);
  }, 120_000);

  test("recipe:gitignore generalizes to held-out gitignore-dist", () => {
    const playbook = "- [s-010] (helpful=1 harmful=0) recipe:gitignore — ignore requested paths\n";
    const heldIn = scorePlaybook(evalsRoot, "held-in", playbook);
    const heldOut = scorePlaybook(evalsRoot, "held-out", playbook);
    expect(heldIn.byId["gitignore-rule"]).toBe(true);
    expect(heldOut.byId["gitignore-dist"]).toBe(true);
    expect(heldOut.byId["no-secrets"]).toBe(false);
  }, 120_000);
});
