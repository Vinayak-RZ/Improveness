import { describe, expect, test } from "bun:test";
import { apply } from "../../../plugins/dsh-improveness/src/apply.js";
import { createJitRuntime } from "../../../plugins/dsh-improveness/src/jit.js";
import { isFrozenId, looksLikeFiberInstanceId } from "../../../plugins/dsh-improveness/src/frozen-ids.js";
import { claimSlot, emptySlots } from "../../../plugins/dsh-improveness/src/slots.js";
import { parseSections, enabledToolNames } from "../../../plugins/dsh-improveness/src/sections.js";
import { createCatalog } from "../../../plugins/dsh-improveness/src/catalog.js";
import { createEventBus } from "../../../plugins/dsh-improveness/src/events.js";
import { createSynthesizer } from "../../../plugins/dsh-improveness/src/synthesize.js";
import { memoryModule, planningModule, actionModule, capabilityModule } from "../../../plugins/dsh-improveness/src/modules/templates.js";

function fakeCtx(env = {}) {
  /** @type {Map<string, unknown>} */
  const tools = new Map();
  const effects = [];
  return {
    env,
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
    expect(ctx.tools.names()).toContain("improveness.catalog");
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

describe("sections flags", () => {
  test("defaults all on", () => {
    const s = parseSections({});
    expect(s.jit).toBe(true);
    expect(s.improvement.shortTerm).toBe(true);
    expect(s.improvement.longTerm).toBe(true);
    expect(s.eventInject).toBe(true);
  });

  test("IMPROVENESS_JIT=0 disables jit tools", () => {
    const s = parseSections({ IMPROVENESS_JIT: "0" });
    expect(s.jit).toBe(false);
    expect(enabledToolNames(s)).not.toContain("improveness.define");
    expect(enabledToolNames(s)).not.toContain("improveness.synthesize");
    expect(enabledToolNames(s)).toContain("improveness.inspect");
  });

  test("parent IMPROVENESS_IMPROVE=0 disables both horizons", () => {
    const s = parseSections({ IMPROVENESS_IMPROVE: "false" });
    expect(s.improvement.shortTerm).toBe(false);
    expect(s.improvement.longTerm).toBe(false);
    expect(enabledToolNames(s)).not.toContain("improveness.promote");
  });

  test("short and long flags are independent", () => {
    const shortOff = parseSections({ IMPROVENESS_IMPROVE_SHORT: "off" });
    expect(shortOff.improvement.shortTerm).toBe(false);
    expect(shortOff.improvement.longTerm).toBe(true);
    const longOff = parseSections({ IMPROVENESS_IMPROVE_LONG: "no" });
    expect(longOff.improvement.shortTerm).toBe(true);
    expect(longOff.improvement.longTerm).toBe(false);
  });

  test("apply with jit=false hides define/synthesize", () => {
    const ctx = fakeCtx({ IMPROVENESS_JIT: "0" });
    apply(ctx);
    const names = ctx.tools.names();
    expect(names).toContain("improveness.inspect");
    expect(names).not.toContain("improveness.define");
    expect(names).not.toContain("improveness.synthesize");
    expect(names).toContain("improveness.promote");
  });

  test("apply with improve flags off hides promote and improve tools", () => {
    const ctx = fakeCtx({ IMPROVENESS_IMPROVE: "0" });
    apply(ctx);
    const names = ctx.tools.names();
    expect(names).not.toContain("improveness.promote");
    expect(names).not.toContain("improveness.improveShort");
    expect(names).not.toContain("improveness.improveLong");
    expect(names).toContain("improveness.define");
  });
});

describe("tool catalog", () => {
  test("expand root then namespace then group", () => {
    const sections = parseSections({});
    const catalog = createCatalog(sections);
    const root = catalog.root();
    expect(root.level).toBe("root");
    expect(root.children.some((c) => c.id === "improveness")).toBe(true);
    const ns = catalog.expand({ namespace: "improveness" });
    expect(ns.children.some((c) => c.kind === "group")).toBe(true);
    const group = catalog.expand({ namespace: "improveness", group: "jit" });
    expect(group.children.some((c) => c.id === "improveness.synthesize")).toBe(true);
  });

  test("filter removes jit tools when jit off", () => {
    const tree = filterOff();
    expect(tree[0].groups.every((g) => g.id !== "jit" || g.tools.length === 0 || g.id !== "jit")).toBe(true);
    const jitGroup = tree[0].groups.find((g) => g.id === "jit");
    expect(jitGroup).toBeUndefined();
  });

  test("inspect returns sections and catalog", () => {
    const ctx = fakeCtx();
    apply(ctx);
    const info = ctx.tools.get("improveness.inspect")();
    expect(info.sections.jit).toBe(true);
    expect(info.catalog.level).toBe("root");
  });
});

function filterOff() {
  return createCatalog(parseSections({ IMPROVENESS_JIT: "0" })).tree();
}

describe("event inject", () => {
  test("need_tool injects reminder once", () => {
    const sections = parseSections({});
    const catalog = createCatalog(sections);
    const bus = createEventBus({ catalog, sections });
    const first = bus.emit({ kind: "need_tool", toolId: "improveness.synthesize" });
    expect(first[0].type).toBe("reminder");
    expect(first[0].content).toContain("improveness.synthesize");
    const second = bus.emit({ kind: "need_tool", toolId: "improveness.synthesize" });
    expect(second).toEqual([]);
  });

  test("eventInject=0 emits nothing", () => {
    const sections = parseSections({ IMPROVENESS_EVENT_INJECT: "0" });
    const catalog = createCatalog(sections);
    const bus = createEventBus({ catalog, sections });
    expect(bus.emit({ kind: "need_tool", toolId: "improveness.define" })).toEqual([]);
  });

  test("apply emit tool mounts hint when jit on", () => {
    const ctx = fakeCtx();
    apply(ctx);
    const out = ctx.tools.get("improveness.emit")({ kind: "need_tool", toolId: "improveness.catalog" });
    expect(out.some((r) => r.type === "reminder")).toBe(true);
  });
});

describe("JIT synthesizer", () => {
  test("module templates invert dispose", () => {
    const ctx = {};
    for (const mod of [
      memoryModule("t1"),
      planningModule("t1"),
      actionModule("t1"),
      capabilityModule("t1"),
    ]) {
      const dispose = mod.apply(ctx);
      dispose();
    }
    expect(ctx.__jitMemory).toBeUndefined();
    expect(ctx.__jitPlanning).toBeUndefined();
    expect(ctx.__jitAction).toBeUndefined();
    expect(ctx.__jitCapabilities ?? []).toEqual([]);
  });

  test("synthesize mounts four slots", async () => {
    const jit = createJitRuntime({ ctx: {} });
    const synth = createSynthesizer({ jit, ctx: {} });
    const result = await synth.synthesize("s", { taskId: "fix-bug" });
    expect(result.mounted).toHaveLength(4);
    expect(result.slots.memory).toContain("fix-bug");
    expect(result.slots.planning).toContain("fix-bug");
    expect(result.slots.action).toContain("fix-bug");
    expect(result.slots.capability.some((id) => id.includes("fix-bug"))).toBe(true);
  });

  test("synthesize rolls back on slot collision", async () => {
    const jit = createJitRuntime({ ctx: {} });
    jit.define("s", { id: "other", slot: "memory", apply: () => () => {} });
    const synth = createSynthesizer({ jit, ctx: {} });
    await expect(synth.synthesize("s", { taskId: "x" })).rejects.toThrow(/slot collision/);
    expect(jit.isMounted("s", "jit.planning.x")).toBe(false);
  });

  test("improveness.synthesize tool works via apply", async () => {
    const ctx = fakeCtx();
    apply(ctx);
    const result = await ctx.tools.get("improveness.synthesize")({ taskId: "via-tool" });
    expect(result.mounted.length).toBe(4);
  });
});
