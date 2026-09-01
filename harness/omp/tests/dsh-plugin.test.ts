import { describe, expect, test } from "bun:test";
import { apply } from "../../../plugins/dsh-improveness/src/apply.js";
import { createJitRuntime } from "../../../plugins/dsh-improveness/src/jit.js";
import { isFrozenId, looksLikeFiberInstanceId } from "../../../plugins/dsh-improveness/src/frozen-ids.js";
import { claimSlot, emptySlots } from "../../../plugins/dsh-improveness/src/slots.js";

function fakeCtx() {
  /** @type {Map<string, unknown>} */
  const tools = new Map();
  const effects = [];
  return {
    tools: {
      register(name, fn) {
        tools.set(name, fn);
      },
      unregister(name) {
        tools.delete(name);
      },
      get: (name) => tools.get(name),
      names: () => [...tools.keys()],
    },
    effect(factory) {
      effects.push(factory);
      return factory();
    },
    session: { id: "sess-1" },
    _tools: tools,
  };
}

describe("dsh-improveness plugin", () => {
  test("apply registers tools and disposer inverts them", () => {
    const ctx = fakeCtx();
    const dispose = apply(ctx);
    expect(ctx.tools.names()).toContain("improveness.inspect");
    expect(ctx.tools.names()).toContain("improveness.define");
    dispose();
    expect(ctx.tools.names()).toEqual([]);
  });

  test("frozen ids are namespaces not Fiber instance ids", () => {
    expect(isFrozenId("dsh.approval")).toBe(true);
    expect(isFrozenId("dsh-improveness")).toBe(true);
    expect(isFrozenId("fiber-9f3a")).toBe(false);
    expect(looksLikeFiberInstanceId("fiber-9f3a")).toBe(true);
    expect(looksLikeFiberInstanceId("dsh.approval")).toBe(false);
  });

  test("slot collisions fail before mount", () => {
    const occupied = claimSlot(emptySlots(), "memory", "ace-playbook");
    expect(() => claimSlot(occupied, "memory", "other-memory")).toThrow(/slot collision/);
    const cap = claimSlot(emptySlots(), "capability", "a");
    expect(claimSlot(cap, "capability", "b").capability).toEqual(["a", "b"]);
  });

  test("JIT define refuses kernel ids and unmounts with disposer", async () => {
    const jit = createJitRuntime();
    expect(() => jit.define("s", { id: "dsh.approval", slot: "capability" })).toThrow(/frozen/);
    let live = false;
    jit.define("s", {
      id: "cap.note",
      slot: "capability",
      apply() {
        live = true;
        return () => {
          live = false;
        };
      },
    });
    expect(live).toBe(true);
    await jit.stop("s", "cap.note");
    expect(live).toBe(false);
    expect(jit.isMounted("s", "cap.note")).toBe(false);
  });

  test("unmount fail-closed while in-flight", async () => {
    const jit = createJitRuntime({ drainMs: 20 });
    jit.define("s", { id: "busy", slot: "capability", apply: () => () => {} });
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const running = jit.run("s", "busy", () => gate);
    expect(jit.inflight("s", "busy")).toBe(1);
    await expect(jit.stop("s", "busy")).rejects.toThrow(/fail-closed/);
    release();
    await running;
    await jit.stop("s", "busy");
    expect(jit.isMounted("s", "busy")).toBe(false);
  });
});
