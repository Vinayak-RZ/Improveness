/** Improveness-owned dialect hints (inspired by OMP toolconv; not a fork). */

export interface DialectHint {
  id: string;
  toolCallStyle: string;
  notes: string[];
}

export const deepseekDialect: DialectHint = {
  id: "deepseek",
  toolCallStyle: "provider-native or deepseek in-band markers",
  notes: [
    "Prefer native tool_calls when the endpoint supports them.",
    "Repair layer still runs validate-then-repair on args after parse.",
  ],
};

export const qwen3Dialect: DialectHint = {
  id: "qwen3",
  toolCallStyle: "Hermes XML tool_call blocks inside ChatML",
  notes: [
    "Advertise tools in system <tools> block.",
    "arguments is a nested object (not a string).",
    "Pair with vLLM hermes tool-call parser when serving.",
  ],
};
