import type { RepairId } from "../profile.ts";
import type { DetectedFailure, ToolCallTrace } from "../detect.ts";

export interface RepairResult {
  repaired: boolean;
  args: Record<string, unknown>;
  repairsApplied: RepairId[];
  teachback: string[];
}

type RepairFn = (trace: ToolCallTrace, failures: DetectedFailure[]) => RepairResult;

const MD_LINK = /^\[([^\]]+)\]\((https?:\/\/)?([^)]+)\)$/;

export const coerceStringArray: RepairFn = (trace, failures) => {
  const args = { ...trace.args };
  const teachback: string[] = [];
  const repairsApplied: RepairId[] = [];
  for (const f of failures.filter((x) => x.mode === "string-where-array")) {
    const v = args[f.path];
    if (typeof v === "string") {
      args[f.path] = [v];
      repairsApplied.push("coerce-string-array");
      teachback.push(`Coerced ${f.path} from string to string[]; pass a JSON array next time.`);
    }
  }
  return { repaired: repairsApplied.length > 0, args, repairsApplied, teachback };
};

export const stripNullOmit: RepairFn = (trace, failures) => {
  const args = { ...trace.args };
  const teachback: string[] = [];
  const repairsApplied: RepairId[] = [];
  for (const f of failures.filter((x) => x.mode === "null-vs-omit")) {
    if (args[f.path] === null) {
      delete args[f.path];
      repairsApplied.push("strip-null-omit");
      teachback.push(`Removed null ${f.path}; omit the key instead of sending null.`);
    }
  }
  return { repaired: repairsApplied.length > 0, args, repairsApplied, teachback };
};

export const unwrapMarkdownAutolink: RepairFn = (trace, failures) => {
  const args = { ...trace.args };
  const teachback: string[] = [];
  const repairsApplied: RepairId[] = [];
  for (const f of failures.filter((x) => x.mode === "markdown-autolink-in-path")) {
    const v = args[f.path];
    if (typeof v === "string") {
      const m = v.match(MD_LINK);
      if (m) {
        args[f.path] = m[1];
        repairsApplied.push("unwrap-markdown-autolink");
        teachback.push(`Unwrapped markdown link in ${f.path} to bare path "${m[1]}".`);
      }
    }
  }
  return { repaired: repairsApplied.length > 0, args, repairsApplied, teachback };
};

export const fillRelationalDefaults: RepairFn = (trace, failures) => {
  const args = { ...trace.args };
  const teachback: string[] = [];
  const repairsApplied: RepairId[] = [];
  if (!failures.some((x) => x.mode === "relational-arg-defaults")) {
    return { repaired: false, args, repairsApplied, teachback };
  }
  if ("limit" in args && !("offset" in args)) {
    args.offset = 0;
    repairsApplied.push("fill-relational-defaults");
    teachback.push(`Set offset=0 because limit was provided without offset.`);
  }
  if ("offset" in args && !("limit" in args)) {
    args.limit = 2000;
    repairsApplied.push("fill-relational-defaults");
    teachback.push(`Set limit=2000 because offset was provided without limit.`);
  }
  return { repaired: repairsApplied.length > 0, args, repairsApplied, teachback };
};

export const reshapeValidatorTeachback: RepairFn = (trace, failures) => {
  const args = { ...trace.args };
  const teachback: string[] = [];
  const repairsApplied: RepairId[] = [];
  if (!failures.some((x) => x.mode === "unreadable-validator-dump")) {
    return { repaired: false, args, repairsApplied, teachback };
  }
  const raw = trace.validationError ?? "";
  // ponytail: extract first path+message pair; richer Zod walk if dumps get worse
  const pathMatch = raw.match(/path[:\s]+\[?[\"']?([\w.]+)[\"']?\]?/i);
  const expectMatch = raw.match(/expected\s+(\w+)/i);
  const gotMatch = raw.match(/received\s+(\w+)/i);
  const path = pathMatch?.[1] ?? "(unknown)";
  const expected = expectMatch?.[1] ?? "valid value";
  const got = gotMatch?.[1] ?? "invalid value";
  repairsApplied.push("reshape-validator-teachback");
  teachback.push(
    `Tool args failed validation at "${path}": expected ${expected}, got ${got}. Fix that field and retry.`,
  );
  return { repaired: true, args, repairsApplied, teachback };
};

export const REPAIR_REGISTRY: Record<RepairId, RepairFn> = {
  "coerce-string-array": coerceStringArray,
  "strip-null-omit": stripNullOmit,
  "unwrap-markdown-autolink": unwrapMarkdownAutolink,
  "fill-relational-defaults": fillRelationalDefaults,
  "reshape-validator-teachback": reshapeValidatorTeachback,
};
