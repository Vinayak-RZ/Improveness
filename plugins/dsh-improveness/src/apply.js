import { createDshHostPort } from "./host-port-dsh.js";
import { createJitRuntime } from "./jit.js";
import { DSH_FROZEN_IDS } from "./frozen-ids.js";

/**
 * Cordis apply for dsh-improveness.
 * Works with a real DSH ctx or a fake test ctx: { tools, effect, session }.
 */
export function apply(ctx = {}) {
  const sessionId = ctx.session?.id ?? ctx.sessionId ?? "default";
  const jit = createJitRuntime({ ctx, drainMs: 50 });
  const port = createDshHostPort({ ctx, jit, repoRoot: ctx.repoRoot });
  const tools = new Map();

  function register(name, fn) {
    tools.set(name, fn);
    ctx.tools?.register?.(name, fn);
  }

  register("improveness.inspect", () => ({
    capabilities: port.listCapabilities(),
    frozenIds: port.frozenIds(),
    slots: port.slots(),
  }));
  register("improveness.define", (pkg) => port.mountEphemeral(sessionId, pkg, pkg.slot));
  register("improveness.run", (id, fn) => jit.run(sessionId, id, fn));
  register("improveness.stop", (id) => port.unmount(sessionId, id));
  register("improveness.promote", (manifest) => port.applyDurable(manifest));

  const dispose = () => {
    jit.disposeAll(sessionId);
    for (const name of tools.keys()) ctx.tools?.unregister?.(name);
    tools.clear();
  };

  ctx.effect?.(() => dispose);
  ctx.plugin?.collect?.("dsh-improveness", () => ({ frozenIds: DSH_FROZEN_IDS }));

  return dispose;
}

export { createDshHostPort, createJitRuntime };
