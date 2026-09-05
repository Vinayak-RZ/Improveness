export {
  type ModelProfile,
  type FailureModeId,
  type RepairId,
  type DialectId,
  validateProfile,
  loadProfile,
} from "./profile.ts";
export { detectFailures, type ToolCallTrace, type DetectedFailure } from "./detect.ts";
export { applyRepairs } from "./apply-repairs.ts";
export { REPAIR_REGISTRY, type RepairResult } from "./repair/index.ts";
export { evaluateFit, type FitSample, type FitReport } from "./evaluate-fit.ts";
export { deepseekProfile } from "./profiles/deepseek.ts";
export { qwen3Profile } from "./profiles/qwen3.ts";
export { deepseekDialect, qwen3Dialect, type DialectHint } from "./dialects/index.ts";

import { deepseekProfile } from "./profiles/deepseek.ts";
import { qwen3Profile } from "./profiles/qwen3.ts";
import type { ModelProfile } from "./profile.ts";

const CATALOG: Record<string, ModelProfile> = {
  "deepseek-family": deepseekProfile,
  deepseek: deepseekProfile,
  "qwen3-family": qwen3Profile,
  qwen3: qwen3Profile,
};

export function getProfile(idOrFamily: string): ModelProfile {
  const p = CATALOG[idOrFamily.toLowerCase()];
  if (!p) throw new Error(`unknown ModelProfile: ${idOrFamily}`);
  return p;
}

export function listProfiles(): ModelProfile[] {
  return [deepseekProfile, qwen3Profile];
}
