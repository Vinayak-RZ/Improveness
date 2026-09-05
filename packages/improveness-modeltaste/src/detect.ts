import type { FailureModeId } from "./profile.ts";

export interface ToolCallTrace {
  tool: string;
  args: Record<string, unknown>;
  /** Raw validator issues if the host rejected the call */
  validationError?: string;
  schema?: Record<string, unknown>;
}

export interface DetectedFailure {
  mode: FailureModeId;
  path: string;
  detail: string;
}

const MD_LINK = /^\[([^\]]+)\]\((https?:\/\/)?([^)]+)\)$/;

/** Detect Taste-class contract failures on a tool call (validate-first; no mutate). */
export function detectFailures(trace: ToolCallTrace): DetectedFailure[] {
  const out: DetectedFailure[] = [];
  const args = trace.args ?? {};

  for (const [key, val] of Object.entries(args)) {
    if (typeof val === "string") {
      const schemaProp = (trace.schema?.properties as Record<string, { type?: string }> | undefined)?.[key];
      if (schemaProp?.type === "array") {
        out.push({
          mode: "string-where-array",
          path: key,
          detail: `expected array, got string`,
        });
      }
      const m = val.match(MD_LINK);
      if (m && (key.includes("path") || key.includes("file") || key.includes("Path"))) {
        const inner = m[1];
        const url = m[3];
        if (inner === url || inner === `http://${url}` || inner === `https://${url}`) {
          out.push({
            mode: "markdown-autolink-in-path",
            path: key,
            detail: `markdown autolink leaked into path-like field`,
          });
        }
      }
    }
    if (val === null) {
      out.push({
        mode: "null-vs-omit",
        path: key,
        detail: `null present; prefer omit`,
      });
    }
  }

  const hasOffset = "offset" in args || "start" in args;
  const hasLimit = "limit" in args || "count" in args;
  if ((hasOffset && !hasLimit) || (hasLimit && !hasOffset)) {
    if ("offset" in args || "limit" in args) {
      out.push({
        mode: "relational-arg-defaults",
        path: hasOffset ? "limit" : "offset",
        detail: `offset/limit must travel together`,
      });
    }
  }

  if (trace.validationError) {
    const raw = trace.validationError;
    if (
      /zod/i.test(raw) ||
      /expected\s+/i.test(raw) ||
      raw.includes("\n  ") ||
      raw.length > 200
    ) {
      out.push({
        mode: "unreadable-validator-dump",
        path: "",
        detail: `validator dump is model-hostile`,
      });
    }
  }

  return out;
}
