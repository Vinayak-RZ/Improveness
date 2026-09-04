/**
 * Session event bus for TTSR-inspired tool inject (D16).
 * Events: need_tool | tool_fail | plan_step
 */

/**
 * @typedef {"need_tool" | "tool_fail" | "plan_step"} EventKind
 * @typedef {{ kind: EventKind, toolId?: string, detail?: string, planStep?: string }} SessionEvent
 * @typedef {{ type: "reminder" | "mount", toolId: string, content: string, mounted?: boolean }} InjectResult
 */

export function createEventBus(options = {}) {
  const catalog = options.catalog;
  const sections = options.sections;
  /** @type {Set<string>} */
  const injectedOnce = new Set();
  /** @type {InjectResult[]} */
  const log = [];
  const mountFn = options.mountCapability;

  /**
   * @param {SessionEvent} event
   * @returns {InjectResult[]}
   */
  function emit(event) {
    if (!sections?.eventInject) return [];
    /** @type {InjectResult[]} */
    const out = [];
    const toolId = resolveToolId(event, catalog);
    if (!toolId) return out;
    if (injectedOnce.has(toolId)) return out;
    injectedOnce.add(toolId);

    const found = catalog?.find?.(toolId);
    const desc = found?.tool?.description ?? toolId;
    const content = [
      "<improveness-tool-reminder>",
      `tool: ${toolId}`,
      `reason: ${event.kind}`,
      desc,
      event.detail ? `detail: ${event.detail}` : null,
      "</improveness-tool-reminder>",
    ]
      .filter(Boolean)
      .join("\n");

    const reminder = { type: "reminder", toolId, content };
    out.push(reminder);
    log.push(reminder);

    // ponytail: auto-mount only when JIT on + mount hook provided; upgrade = policy ACL
    if (sections.jit && typeof mountFn === "function" && event.kind === "need_tool") {
      try {
        mountFn(toolId, found);
        const m = { type: "mount", toolId, content: `mounted capability hint for ${toolId}`, mounted: true };
        out.push(m);
        log.push(m);
      } catch {
        // mount is best-effort; reminder already delivered
      }
    }
    return out;
  }

  return {
    emit,
    injections: () => [...log],
    clearInjections: () => {
      injectedOnce.clear();
      log.length = 0;
    },
  };
}

/**
 * @param {SessionEvent} event
 * @param {{ find?: (id: string) => unknown }} catalog
 */
function resolveToolId(event, catalog) {
  if (event.toolId) return event.toolId;
  if (event.kind === "plan_step" && event.planStep && catalog?.find) {
    const hit = catalog.find(event.planStep);
    return hit?.tool?.id ?? null;
  }
  return null;
}
