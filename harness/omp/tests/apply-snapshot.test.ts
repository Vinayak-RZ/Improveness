import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import {
  applyDurablePlugin,
  listGeneratedPlugins,
  pluginApplySource,
  rollbackDurablePlugin,
  uninstallImprovenessBundle,
  validateGeneratedPlugin,
} from "../drivers/apply-snapshot.ts";

function repo(): string {
  const dir = mkdtempSync(join(tmpdir(), "gen-"));
  mkdirSync(join(dir, "harness/omp/generated"), { recursive: true });
  mkdirSync(join(dir, "plugins/dsh-improveness"), { recursive: true });
  writeFileSync(join(dir, "plugins/dsh-improveness/package.json"), "{}\n");
  return dir;
}

describe("durable generated plugins", () => {
  test("validates load/dispose invertibility", () => {
    const dir = mkdtempSync(join(tmpdir(), "plug-"));
    writeFileSync(join(dir, "apply.js"), pluginApplySource());
    validateGeneratedPlugin(dir, "cap-echo");
  });

  test("rejects a disposer that does not unregister", () => {
    const dir = mkdtempSync(join(tmpdir(), "bad-"));
    writeFileSync(
      join(dir, "apply.js"),
      `function apply(ctx) { ctx.tools.register("x"); return function () {}; }
module.exports = { apply };
`,
    );
    expect(() => validateGeneratedPlugin(dir, "bad")).toThrow(/invertible/);
  });

  test("atomic install then rollback restores previous", () => {
    const root = repo();
    applyDurablePlugin({
      id: "cap-echo",
      slot: "capability",
      files: { "apply.js": pluginApplySource("cap.v1") },
      repoRoot: root,
    });
    applyDurablePlugin({
      id: "cap-echo",
      slot: "capability",
      files: { "apply.js": pluginApplySource("cap.v2") },
      repoRoot: root,
    });
    expect(readFileSync(join(root, "harness/omp/generated/cap-echo/apply.js"), "utf8")).toContain("cap.v2");
    rollbackDurablePlugin("cap-echo", root);
    expect(readFileSync(join(root, "harness/omp/generated/cap-echo/apply.js"), "utf8")).toContain("cap.v1");
  });

  test("refuses frozen ids and kernel paths", () => {
    const root = repo();
    expect(() =>
      applyDurablePlugin({
        id: "dsh-improveness",
        slot: "capability",
        files: { "apply.js": pluginApplySource() },
        repoRoot: root,
      }),
    ).toThrow(/frozen id/);
    expect(() =>
      applyDurablePlugin({
        id: "cap-echo",
        slot: "capability",
        files: { "plugins/dsh-improveness/hack.js": pluginApplySource() },
        repoRoot: root,
      }),
    ).toThrow(/kernel path/);
  });

  test("uninstalling the bundle does not delete siblings", () => {
    const root = repo();
    applyDurablePlugin({
      id: "sibling",
      slot: "capability",
      files: { "apply.js": pluginApplySource() },
      repoRoot: root,
    });
    uninstallImprovenessBundle(join(root, "plugins/dsh-improveness"), join(root, "harness/omp/generated"));
    expect(existsSync(join(root, "plugins/dsh-improveness"))).toBe(false);
    expect(listGeneratedPlugins(root)).toContain("sibling");
    expect(existsSync(join(root, "harness/omp/generated/sibling/apply.js"))).toBe(true);
  });
});
