/** Typed JIT slot module templates — invertible dispose, no free-form codegen. */

/**
 * @param {string} taskId
 * @param {Record<string, unknown>} [params]
 */
export function memoryModule(taskId, params = {}) {
  const id = `jit.memory.${taskId}`;
  return {
    id,
    slot: "memory",
    params,
    apply(ctx = {}) {
      const store = { taskId, notes: [], ...(params.seed ? { seed: params.seed } : {}) };
      ctx.__jitMemory = store;
      return () => {
        delete ctx.__jitMemory;
      };
    },
  };
}

/**
 * @param {string} taskId
 * @param {Record<string, unknown>} [params]
 */
export function planningModule(taskId, params = {}) {
  const id = `jit.planning.${taskId}`;
  return {
    id,
    slot: "planning",
    params,
    apply(ctx = {}) {
      const plan = { taskId, steps: params.steps ?? [], budget: params.budget ?? 8 };
      ctx.__jitPlanning = plan;
      return () => {
        delete ctx.__jitPlanning;
      };
    },
  };
}

/**
 * @param {string} taskId
 * @param {Record<string, unknown>} [params]
 */
export function actionModule(taskId, params = {}) {
  const id = `jit.action.${taskId}`;
  return {
    id,
    slot: "action",
    params,
    apply(ctx = {}) {
      const action = { taskId, tools: params.tools ?? [], policy: params.policy ?? "default" };
      ctx.__jitAction = action;
      return () => {
        delete ctx.__jitAction;
      };
    },
  };
}

/**
 * @param {string} taskId
 * @param {Record<string, unknown>} [params]
 */
export function capabilityModule(taskId, params = {}) {
  const id = `jit.capability.${taskId}`;
  return {
    id,
    slot: "capability",
    params,
    apply(ctx = {}) {
      const caps = ctx.__jitCapabilities ?? [];
      caps.push({ taskId, tags: params.tags ?? [] });
      ctx.__jitCapabilities = caps;
      return () => {
        ctx.__jitCapabilities = (ctx.__jitCapabilities ?? []).filter((c) => c.taskId !== taskId);
      };
    },
  };
}

export const MODULE_BUILDERS = {
  memory: memoryModule,
  planning: planningModule,
  action: actionModule,
  capability: capabilityModule,
};
