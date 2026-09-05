/** ModelTaste profile schema (D17). Pure data — no host imports. */

export type FailureModeId =
  | "string-where-array"
  | "null-vs-omit"
  | "markdown-autolink-in-path"
  | "relational-arg-defaults"
  | "unreadable-validator-dump";

export type RepairId =
  | "coerce-string-array"
  | "strip-null-omit"
  | "unwrap-markdown-autolink"
  | "fill-relational-defaults"
  | "reshape-validator-teachback";

export type DialectId = "deepseek" | "qwen3" | "generic";

export interface ModelProfile {
  id: string;
  family: string;
  dialect: DialectId;
  knownFailureModes: FailureModeId[];
  repairIds: RepairId[];
  systemContractSnippets: string[];
}

export function validateProfile(p: unknown): ModelProfile {
  if (!p || typeof p !== "object") throw new Error("ModelProfile: not an object");
  const o = p as Record<string, unknown>;
  for (const k of ["id", "family", "dialect"] as const) {
    if (typeof o[k] !== "string" || !(o[k] as string).trim()) {
      throw new Error(`ModelProfile: missing ${k}`);
    }
  }
  if (!Array.isArray(o.knownFailureModes) || !Array.isArray(o.repairIds)) {
    throw new Error("ModelProfile: knownFailureModes/repairIds must be arrays");
  }
  if (!Array.isArray(o.systemContractSnippets)) {
    throw new Error("ModelProfile: systemContractSnippets must be array");
  }
  return o as unknown as ModelProfile;
}

export function loadProfile(p: unknown): ModelProfile {
  return validateProfile(p);
}
