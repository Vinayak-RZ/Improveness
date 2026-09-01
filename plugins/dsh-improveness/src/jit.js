import { claimSlot, emptySlots, releaseSlot } from "./slots.js";
import { assertMountAllowed } from "./policy-fence.js";

/**
 * Session-owned JIT plugins. Drain in-flight runs or fail-closed.
 */
export function createJitRuntime(options = {}) {
  const drainMs = options.drainMs ?? 50;
  /** @type {Map<string, { sessionId: string, slot: string, dispose: () => void, inFlight: number }>} */
  const mounted = new Map();
  let slots = emptySlots();

  function key(sessionId, id) {
    return `${sessionId}::${id}`;
  }

  function define(sessionId, pkg) {
    const id = pkg.id;
    assertMountAllowed(id, pkg.relPath);
    slots = claimSlot(slots, pkg.slot, id);
    const k = key(sessionId, id);
    if (mounted.has(k)) throw new Error(`already mounted: ${id}`);
    const dispose =
      typeof pkg.apply === "function"
        ? pkg.apply(options.ctx ?? {})
        : () => {};
    if (typeof dispose !== "function") {
      throw new Error(`plugin ${id} apply() must return a disposer`);
    }
    mounted.set(k, { sessionId, slot: pkg.slot, dispose, inFlight: 0 });
    return { id, slot: pkg.slot, sessionId, ephemeral: true };
  }

  function run(sessionId, id, fn) {
    const entry = mounted.get(key(sessionId, id));
    if (!entry) throw new Error(`not mounted: ${id}`);
    entry.inFlight += 1;
    try {
      const out = typeof fn === "function" ? fn() : undefined;
      if (out && typeof out.then === "function") {
        return out.finally(() => {
          entry.inFlight -= 1;
        });
      }
      entry.inFlight -= 1;
      return out;
    } catch (error) {
      entry.inFlight -= 1;
      throw error;
    }
  }

  async function stop(sessionId, id) {
    const k = key(sessionId, id);
    const entry = mounted.get(k);
    if (!entry) return;
    const deadline = Date.now() + drainMs;
    while (entry.inFlight > 0 && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 5));
    }
    if (entry.inFlight > 0) {
      throw new Error(`hmr fail-closed: in-flight ${id}`);
    }
    entry.dispose();
    slots = releaseSlot(slots, entry.slot, id);
    mounted.delete(k);
  }

  function disposeAll(sessionId) {
    for (const [k, entry] of [...mounted.entries()]) {
      if (sessionId && entry.sessionId !== sessionId) continue;
      if (entry.inFlight > 0) throw new Error(`hmr fail-closed: in-flight ${k}`);
      entry.dispose();
      slots = releaseSlot(slots, entry.slot, k.split("::")[1]);
      mounted.delete(k);
    }
  }

  function occupancy() {
    return slots;
  }

  function isMounted(sessionId, id) {
    return mounted.has(key(sessionId, id));
  }

  function inflight(sessionId, id) {
    return mounted.get(key(sessionId, id))?.inFlight ?? 0;
  }

  return { define, run, stop, disposeAll, occupancy, isMounted, inflight };
}
