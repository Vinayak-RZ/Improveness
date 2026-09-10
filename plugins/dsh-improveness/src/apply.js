import { createDshHostPort } from "./host-port-dsh.js";
import { createJitRuntime } from "./jit.js";
import { DSH_FROZEN_IDS } from "./frozen-ids.js";
import { parseSections } from "./sections.js";
import { createCatalog } from "./catalog.js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createEventBus } from "./events.js";
import { parseGraph } from "./procedure-graph.js";
import { createSynthesizer } from "./synthesize.js";
import { callCore } from "./core-client.js";
import { createTasteRuntime, TasteError } from "./taste.js";

/**
 * Cordis apply for dsh-improveness.
 * Works with a real DSH ctx or a fake test ctx: { tools, effect, session }.
 * Section flags (D16) gate which tools register.
 */
export function apply(ctx = {}) {
  const sessionId = ctx.session?.id ?? ctx.sessionId ?? "default";
  const sections = parseSections(ctx.env ?? process.env);
  const jit = createJitRuntime({ ctx, drainMs: 50 });
  const port = createDshHostPort({ ctx, jit, repoRoot: ctx.repoRoot });
  const catalog = createCatalog(sections);
  const synth = createSynthesizer({ jit, ctx });
  const bus = createEventBus({
    catalog,
    sections,
    graph: loadOverlayGraph(ctx.repoRoot),
    mountCapability: sections.jit
      ? (toolId) => {
          // ponytail: hint-only capability mount keyed by tool id; full packages via synthesize
          if (jit.isMounted(sessionId, `hint.${toolId}`)) return;
          jit.define(sessionId, {
            id: `hint.${toolId}`,
            slot: "capability",
            apply: () => () => {},
          });
        }
      : undefined,
  });
  const taste = createTasteRuntime({ enabled: sections.taste });

  const tools = new Map();

  function register(name, fn) {
    tools.set(name, fn);
    ctx.tools?.register?.(name, fn);
  }

  register("improveness.inspect", () => ({
    sections,
    capabilities: port.listCapabilities(),
    frozenIds: port.frozenIds(),
    slots: port.slots(),
    catalog: catalog.root(),
  }));

  register("improveness.catalog", (path = {}) => catalog.expand(path ?? {}));

  if (sections.jit) {
    register("improveness.define", (pkg) => port.mountEphemeral(sessionId, pkg, pkg.slot));
    register("improveness.run", (id, fn) => jit.run(sessionId, id, fn));
    register("improveness.stop", (id) => port.unmount(sessionId, id));
    register("improveness.synthesize", (spec) => synth.synthesize(sessionId, spec));
  }

  if (sections.improvement.shortTerm || sections.improvement.longTerm) {
    register("improveness.promote", (manifest) => port.applyDurable(manifest));
  }

  if (sections.improvement.shortTerm) {
    register("improveness.improveShort", (params = {}) =>
      callCore("improveShort", { ...params, repoRoot: ctx.repoRoot ?? process.cwd() }),
    );
  }

  if (sections.improvement.longTerm) {
    register("improveness.improveLong", (params = {}) =>
      callCore("improveLong", { ...params, repoRoot: ctx.repoRoot ?? process.cwd() }),
    );
  }

  if (sections.eventInject) {
    register("improveness.emit", (event) => bus.emit(event ?? {}));
  }

  if (sections.taste) {
    register("improveness.taste.inspect", () => taste.inspect());
    register("improveness.taste.analyze", (trace) => taste.analyze(trace ?? {}));
    register("improveness.taste.proposeRepair", (trace) => taste.proposeRepair(trace ?? {}));
    register("improveness.taste.applyEphemeral", (trace) => taste.applyEphemeral(trace ?? {}));
    register("improveness.taste.attach", (p = {}) => taste.attach(p.profileId ?? p.id ?? "deepseek"));
    register("improveness.taste.detach", () => taste.detach());
  }

  const dispose = () => {
    taste.detach();
    jit.disposeAll(sessionId);
    for (const name of tools.keys()) ctx.tools?.unregister?.(name);
    tools.clear();
  };

  ctx.effect?.(() => dispose);
  ctx.plugin?.collect?.("dsh-improveness", () => ({ frozenIds: DSH_FROZEN_IDS, sections }));

  return dispose;
}

function loadOverlayGraph(repoRoot) {
  const p = join(repoRoot ?? process.cwd(), "harness/omp/overlay/.omp/playbook/PROCEDURE_GRAPH.json");
  if (!existsSync(p)) return parseGraph("");
  try {
    return parseGraph(readFileSync(p, "utf8"));
  } catch {
    return parseGraph("");
  }
}

export {
  createDshHostPort,
  createJitRuntime,
  parseSections,
  createCatalog,
  createEventBus,
  createSynthesizer,
  createTasteRuntime,
  TasteError,
};
