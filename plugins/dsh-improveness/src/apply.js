import { createDshHostPort } from "./host-port-dsh.js";
import { createJitRuntime } from "./jit.js";
import { DSH_FROZEN_IDS } from "./frozen-ids.js";
import { parseSections } from "./sections.js";
import { createCatalog } from "./catalog.js";
import { createEventBus } from "./events.js";
import { createSynthesizer } from "./synthesize.js";
import { callCore } from "./core-client.js";

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

  const dispose = () => {
    jit.disposeAll(sessionId);
    for (const name of tools.keys()) ctx.tools?.unregister?.(name);
    tools.clear();
  };

  ctx.effect?.(() => dispose);
  ctx.plugin?.collect?.("dsh-improveness", () => ({ frozenIds: DSH_FROZEN_IDS, sections }));

  return dispose;
}

export { createDshHostPort, createJitRuntime, parseSections, createCatalog, createEventBus, createSynthesizer };
