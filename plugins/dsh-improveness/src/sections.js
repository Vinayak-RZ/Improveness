/**
 * Load-time Improveness section flags (D16).
 * Env falsy: 0 | false | off | no (case-insensitive).
 */

function envOn(env, key, defaultOn = true) {
  const v = env[key];
  if (v === undefined || v === "") return defaultOn;
  return !["0", "false", "off", "no"].includes(String(v).toLowerCase());
}

/**
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} [env]
 */
export function parseSections(env = process.env) {
  const jit = envOn(env, "IMPROVENESS_JIT", true);
  const parentImprove = envOn(env, "IMPROVENESS_IMPROVE", true);
  const shortTerm = parentImprove && envOn(env, "IMPROVENESS_IMPROVE_SHORT", true);
  const longTerm = parentImprove && envOn(env, "IMPROVENESS_IMPROVE_LONG", true);
  const eventInject = envOn(env, "IMPROVENESS_EVENT_INJECT", true);
  const taste = envOn(env, "IMPROVENESS_TASTE", true);
  return {
    jit,
    improvement: {
      enabled: shortTerm || longTerm,
      shortTerm,
      longTerm,
    },
    eventInject,
    taste,
  };
}

/**
 * Tool names registered when a section is on.
 * @param {ReturnType<typeof parseSections>} sections
 */
export function enabledToolNames(sections) {
  /** @type {string[]} */
  const names = ["improveness.inspect", "improveness.catalog"];
  if (sections.jit) {
    names.push(
      "improveness.define",
      "improveness.run",
      "improveness.stop",
      "improveness.synthesize",
    );
  }
  if (sections.improvement.shortTerm || sections.improvement.longTerm) {
    names.push("improveness.promote");
  }
  if (sections.improvement.shortTerm) {
    names.push("improveness.improveShort");
  }
  if (sections.improvement.longTerm) {
    names.push("improveness.improveLong");
  }
  if (sections.eventInject) {
    names.push("improveness.emit");
  }
  if (sections.taste) {
    names.push(
      "improveness.taste.inspect",
      "improveness.taste.analyze",
      "improveness.taste.proposeRepair",
      "improveness.taste.applyEphemeral",
      "improveness.taste.attach",
      "improveness.taste.detach",
    );
  }
  return names;
}
