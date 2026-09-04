import { MODULE_BUILDERS } from "./modules/templates.js";

/**
 * Assemble a task-specialized harness from M/P/A/C templates + optional priors.
 * Mounts are transactional: any failure rolls back prior mounts in this synthesize call.
 */

/**
 * @param {{
 *   jit: ReturnType<import("./jit.js").createJitRuntime>,
 *   ctx?: object,
 * }} options
 */
export function createSynthesizer(options) {
  const jit = options.jit;
  const ctx = options.ctx ?? {};

  /**
   * @param {string} sessionId
   * @param {{
   *   taskId: string,
   *   slots?: Array<"memory"|"planning"|"action"|"capability">,
   *   params?: Partial<Record<"memory"|"planning"|"action"|"capability", Record<string, unknown>>>,
   *   priors?: { playbookExcerpts?: string[], archiveParentIds?: string[] },
   * }} spec
   */
  async function synthesize(sessionId, spec) {
    const taskId = sanitizeId(spec.taskId);
    const slots = spec.slots ?? ["memory", "planning", "action", "capability"];
    const params = spec.params ?? {};
    const priors = spec.priors ?? {};
    /** @type {string[]} */
    const mounted = [];

    try {
      for (const slot of slots) {
        const builder = MODULE_BUILDERS[slot];
        if (!builder) throw new Error(`unknown slot: ${slot}`);
        const slotParams = {
          ...(params[slot] ?? {}),
          priors: slot === "memory" ? priors : undefined,
          playbookExcerpts: slot === "planning" ? priors.playbookExcerpts : undefined,
        };
        const pkg = builder(taskId, slotParams);
        jit.define(sessionId, pkg);
        mounted.push(pkg.id);
      }
      return {
        taskId,
        ephemeral: true,
        mounted,
        slots: jit.occupancy(),
        priors: {
          playbookExcerpts: priors.playbookExcerpts?.length ?? 0,
          archiveParentIds: priors.archiveParentIds?.length ?? 0,
        },
      };
    } catch (error) {
      for (const id of [...mounted].reverse()) {
        try {
          await jit.stop(sessionId, id);
        } catch {
          // best-effort rollback
        }
      }
      throw error;
    }
  }

  return { synthesize };
}

function sanitizeId(raw) {
  const id = String(raw ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!id) throw new Error("taskId required");
  return id.slice(0, 64);
}
