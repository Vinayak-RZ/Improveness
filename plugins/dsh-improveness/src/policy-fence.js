import { assertNotFrozen, isFrozenId } from "./frozen-ids.js";

const KERNEL_MARKERS = [
  "evals/checker",
  "approval.ts",
  "system-prompt.md",
  "system-prompt.ts",
  "plugins/dsh-improveness",
  "validate.sh",
  "qa.sh",
];

/**
 * @param {string} id
 * @param {string} [relPath]
 */
export function assertMountAllowed(id, relPath) {
  assertNotFrozen(id);
  if (relPath && KERNEL_MARKERS.some((marker) => relPath.includes(marker))) {
    throw new Error(`kernel path denied: ${relPath}`);
  }
}

export function fenceFrozen(id) {
  if (isFrozenId(id)) throw new Error(`kernel Fiber fence: ${id}`);
}
