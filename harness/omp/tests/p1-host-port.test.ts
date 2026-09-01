import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { createOmpHostPort } from "../host-port/omp-port.ts";
import { paretoFront } from "../host-port/pareto.ts";
import { compileSkill } from "../host-port/skill-compile.ts";
import { retrievePriorHarnesses } from "../host-port/retrieve-prior.ts";
import { snapshotOverlay } from "../drivers/archive.ts";
import { pluginApplySource } from "../drivers/apply-snapshot.ts";

function repo(): string {
  const dir = mkdtempSync(join(tmpdir(), "omp-port-"));
  mkdirSync(join(dir, "harness/omp/overlay/.omp/playbook"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/overlay/.omp/skills"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/archive"), { recursive: true });
  mkdirSync(join(dir, "harness/omp/generated"), { recursive: true });
  writeFileSync(join(dir, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "- [s-001] named exports\n");
  return dir;
}

describe("P1 OMP HostPort and related", () => {
  test("Pareto keeps non-dominated nodes", () => {
    const front = paretoFront([
      { id: "a", quality: 0.9, cost: 2 },
      { id: "b", quality: 0.5, cost: 1 },
      { id: "c", quality: 0.4, cost: 3 },
    ]);
    expect(front.map((n) => n.id).sort()).toEqual(["a", "b"]);
  });

  test("skill compile writes allowlisted SKILL.md", () => {
    const root = repo();
    const rel = compileSkill({ repoRoot: root, family: "recipe:default-export", lesson: "Prefer named exports." });
    expect(rel).toContain("skills/");
    expect(readFileSync(join(root, rel), "utf8")).toContain("named exports");
  });

  test("retrieve-prior returns archived playbooks", () => {
    const root = repo();
    snapshotOverlay({ id: "snap-1", repoRoot: root, fitness: 0.8 });
    const prior = retrievePriorHarnesses(root, 2);
    expect(prior[0]?.id).toBe("snap-1");
    expect(prior[0]?.playbook).toContain("named exports");
  });

  test("OMP adapter applies a generated sibling and reports restart for overlay", async () => {
    const root = repo();
    const port = createOmpHostPort({ repoRoot: root });
    const applied = port.applyDurable({
      id: "omp-cap",
      files: { "apply.js": pluginApplySource("omp.echo") },
    });
    expect(applied.id).toBe("omp-cap");
    expect(readFileSync(join(root, "harness/omp/generated/omp-cap/apply.js"), "utf8")).toContain("omp.echo");
    const overlay = port.applyDurable({
      id: "play",
      files: { "harness/omp/overlay/.omp/playbook/PLAYBOOK.md": "- [s-002] extra\n" },
    });
    expect(overlay.needsRestart).toBe(true);
    expect(port.needsRestart()).toBe(true);
    const mount = port.mountEphemeral("s", { id: "tmp", slot: "capability", apply: () => () => {} });
    expect(mount.ephemeral).toBe(true);
    await port.unmount("s", "tmp");
  });
});
