import type { ModelProfile } from "../profile.ts";

export const deepseekProfile: ModelProfile = {
  id: "deepseek-family",
  family: "deepseek",
  dialect: "deepseek",
  knownFailureModes: [
    "string-where-array",
    "null-vs-omit",
    "markdown-autolink-in-path",
    "relational-arg-defaults",
    "unreadable-validator-dump",
  ],
  repairIds: [
    "coerce-string-array",
    "strip-null-omit",
    "unwrap-markdown-autolink",
    "fill-relational-defaults",
    "reshape-validator-teachback",
  ],
  systemContractSnippets: [
    "Tool arguments must be strict JSON matching the schema.",
    "Never wrap file paths in markdown links.",
    "Prefer omitting optional keys over sending null.",
    "When using offset or limit, always send both.",
  ],
};
