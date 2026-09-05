import type { ModelProfile } from "../profile.ts";

export const qwen3Profile: ModelProfile = {
  id: "qwen3-family",
  family: "qwen3",
  dialect: "qwen3",
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
    "Emit tool calls as Hermes XML: <tool_call>{\"name\":...,\"arguments\":{...}}</tool_call>.",
    "arguments must be a nested JSON object, not a stringified JSON string.",
    "Do not markdown-link paths; use bare workspace-relative paths.",
    "Omit unused optional fields instead of null.",
  ],
};
