import { detectFailures, type ToolCallTrace } from "./detect.ts";
import { applyRepairs } from "./apply-repairs.ts";
import type { ModelProfile } from "./profile.ts";

export interface FitSample {
  trace: ToolCallTrace;
  /** true if host would accept args as-is */
  rawValid: boolean;
}

export interface FitReport {
  n: number;
  rawAccept: number;
  repairedAccept: number;
  delta: number;
  teachbacks: string[];
}

/** Keyless fit metric: share of traces accepted after Taste repairs vs raw. */
export function evaluateFit(samples: FitSample[], profile: ModelProfile): FitReport {
  let rawAccept = 0;
  let repairedAccept = 0;
  const teachbacks: string[] = [];

  for (const s of samples) {
    if (s.rawValid) rawAccept++;
    const failures = detectFailures(s.trace);
    if (failures.length === 0) {
      repairedAccept++;
      continue;
    }
    const result = applyRepairs(s.trace, profile);
    const after = detectFailures({ ...s.trace, args: result.args, validationError: undefined });
    // After repair, structural modes should be gone; teachback-only counts as accept if args fixed
    const structural = after.filter((f) => f.mode !== "unreadable-validator-dump");
    if (structural.length === 0) {
      repairedAccept++;
      teachbacks.push(...result.teachback);
    }
  }

  const n = samples.length;
  return {
    n,
    rawAccept,
    repairedAccept,
    delta: n === 0 ? 0 : repairedAccept / n - rawAccept / n,
    teachbacks,
  };
}
