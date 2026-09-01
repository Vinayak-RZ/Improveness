/** @typedef {"memory" | "planning" | "action" | "capability"} HarnessSlot */

/**
 * @typedef {{ memory: string | null, planning: string | null, action: string | null, capability: string[] }} SlotOccupancy
 */

export function emptySlots() {
  return { memory: null, planning: null, action: null, capability: [] };
}

/**
 * One occupant for memory/planning/action. Capability is an ordered set.
 * Collisions fail before mount.
 * @param {SlotOccupancy} state
 * @param {HarnessSlot} slot
 * @param {string} id
 */
export function claimSlot(state, slot, id) {
  if (slot === "capability") {
    if (state.capability.includes(id)) return state;
    return { ...state, capability: [...state.capability, id] };
  }
  const current = state[slot];
  if (current && current !== id) {
    throw new Error(`slot collision: ${slot} occupied by ${current}, refused ${id}`);
  }
  return { ...state, [slot]: id };
}

/**
 * @param {SlotOccupancy} state
 * @param {HarnessSlot} slot
 * @param {string} id
 */
export function releaseSlot(state, slot, id) {
  if (slot === "capability") {
    return { ...state, capability: state.capability.filter((item) => item !== id) };
  }
  if (state[slot] === id) return { ...state, [slot]: null };
  return state;
}
