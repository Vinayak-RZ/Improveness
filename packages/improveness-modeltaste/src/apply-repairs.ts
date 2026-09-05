import type { ModelProfile, RepairId } from "./profile.ts";
import { detectFailures, type ToolCallTrace } from "./detect.ts";
import { REPAIR_REGISTRY, type RepairResult } from "./repair/index.ts";

/** Validate first; only then run allowlisted repairs from the profile. */
export function applyRepairs(trace: ToolCallTrace, profile: ModelProfile): RepairResult {
  const failures = detectFailures(trace);
  if (failures.length === 0) {
    return { repaired: false, args: { ...trace.args }, repairsApplied: [], teachback: [] };
  }

  let args = { ...trace.args };
  const repairsApplied: RepairId[] = [];
  const teachback: string[] = [];
  let working: ToolCallTrace = { ...trace, args };

  for (const id of profile.repairIds) {
    const fn = REPAIR_REGISTRY[id];
    if (!fn) continue;
    const still = detectFailures(working);
    if (still.length === 0) break;
    const result = fn(working, still);
    if (result.repaired) {
      args = result.args;
      working = { ...working, args };
      repairsApplied.push(...result.repairsApplied);
      teachback.push(...result.teachback);
    }
  }

  return {
    repaired: repairsApplied.length > 0,
    args,
    repairsApplied,
    teachback,
  };
}
