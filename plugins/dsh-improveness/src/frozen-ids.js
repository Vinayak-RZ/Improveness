/** Stable kernel ids: namespaces / routes / owned paths — not Fiber instance ids. */
export const DSH_FROZEN_IDS = [
  "dsh-improveness",
  "improveness.checker",
  "improveness.qa",
  "dsh.approval",
  "dsh.permissions",
  "dsh.model-routes",
  "dsh.cordis-loader",
];

const FROZEN_PREFIXES = ["improveness.kernel.", "dsh.cordis-loader"];

export function isFrozenId(id) {
  if (typeof id !== "string" || !id) return false;
  if (DSH_FROZEN_IDS.includes(id)) return true;
  return FROZEN_PREFIXES.some((prefix) => id === prefix || id.startsWith(`${prefix}.`) || id.startsWith(prefix));
}

export function assertNotFrozen(id) {
  if (isFrozenId(id)) throw new Error(`frozen id denied: ${id}`);
}

/** Fiber ids look like this and must never be treated as kernel ids. */
export function looksLikeFiberInstanceId(id) {
  return /^fiber[-:]/i.test(id) || /^0x[0-9a-f]+$/i.test(id);
}
