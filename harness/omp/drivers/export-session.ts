import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

export type TraceMeta = {
  id: string;
  source: string;
  model?: string;
  eventCount: number;
};

export type TraceTurn = {
  index: number;
  role: string;
  text: string;
  timestamp?: number | string;
};

export type TraceToolCall = {
  id?: string;
  name: string;
  input?: unknown;
  output?: unknown;
  timestamp?: number | string;
};

export type TraceOutcome = {
  passed?: boolean;
  exitCode?: number;
  reason: "explicit" | "inferred" | "unknown";
  stopReason?: string;
};

export type ExportResult = {
  sessionId: string;
  outDir: string;
  meta: TraceMeta;
  turns: TraceTurn[];
  toolCalls: TraceToolCall[];
  outcome: TraceOutcome;
};

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (!isRecord(block)) return "";
        if (typeof block.text === "string") return block.text;
        if (typeof block.thinking === "string") return "";
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

function parseJsonl(raw: string): JsonRecord[] {
  const rows: JsonRecord[] = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (isRecord(parsed)) rows.push(parsed);
    } catch {
      // skip malformed lines; exporter must not throw on a dirty transcript
    }
  }
  return rows;
}

function sessionIdFrom(rows: JsonRecord[], sourcePath: string): string {
  for (const row of rows) {
    if (typeof row.id === "string" && row.id) return row.id;
    if (typeof row.sessionId === "string" && row.sessionId) return row.sessionId;
  }
  const base = basename(sourcePath).replace(/\.jsonl$/i, "");
  return base || "session";
}

function collectToolCalls(rows: JsonRecord[]): TraceToolCall[] {
  const byId = new Map<string, TraceToolCall>();
  const unnamed: TraceToolCall[] = [];

  for (const row of rows) {
    const role = typeof row.role === "string" ? row.role : typeof row.type === "string" ? row.type : "";
    if (role === "assistant" && Array.isArray(row.content)) {
      for (const block of row.content) {
        if (!isRecord(block) || block.type !== "toolCall") continue;
        const id = typeof block.id === "string" ? block.id : typeof block.toolCallId === "string" ? block.toolCallId : undefined;
        const name = typeof block.name === "string" ? block.name : "unknown";
        const call: TraceToolCall = {
          id,
          name,
          input: block.arguments ?? block.input,
          timestamp: typeof row.timestamp === "number" || typeof row.timestamp === "string" ? row.timestamp : undefined,
        };
        if (id) byId.set(id, call);
        else unnamed.push(call);
      }
    }
    if (role === "toolResult" || role === "tool_result") {
      const id = typeof row.toolCallId === "string" ? row.toolCallId : undefined;
      const name = typeof row.toolName === "string" ? row.toolName : "unknown";
      const output = row.content ?? row.output ?? row.text;
      if (id && byId.has(id)) {
        const existing = byId.get(id)!;
        existing.output = output;
        if (typeof row.timestamp === "number" || typeof row.timestamp === "string") {
          existing.timestamp = row.timestamp;
        }
      } else if (id) {
        byId.set(id, { id, name, output, timestamp: row.timestamp as number | string | undefined });
      } else {
        unnamed.push({ name, output, timestamp: row.timestamp as number | string | undefined });
      }
    }
  }
  return [...byId.values(), ...unnamed];
}

function collectTurns(rows: JsonRecord[]): TraceTurn[] {
  const turns: TraceTurn[] = [];
  for (const row of rows) {
    const role =
      typeof row.role === "string" ? row.role : typeof row.type === "string" && row.type === "turn" ? String(row.role ?? "unknown") : "";
    if (!role || role === "session_meta" || role === "outcome") continue;
    if (role === "toolResult" || role === "tool_result") continue;
    const text = typeof row.text === "string" ? row.text : asText(row.content);
    if (!text && role !== "user" && role !== "assistant") continue;
    turns.push({
      index: turns.length,
      role,
      text,
      timestamp: typeof row.timestamp === "number" || typeof row.timestamp === "string" ? row.timestamp : undefined,
    });
  }
  return turns;
}

function collectOutcome(rows: JsonRecord[]): TraceOutcome {
  for (const row of rows) {
    if (row.type === "outcome" || row.role === "outcome") {
      return {
        passed: typeof row.passed === "boolean" ? row.passed : undefined,
        exitCode: typeof row.exitCode === "number" ? row.exitCode : undefined,
        reason: "explicit",
        stopReason: typeof row.stopReason === "string" ? row.stopReason : undefined,
      };
    }
  }
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    if (row.role === "assistant" && typeof row.stopReason === "string") {
      return { reason: "inferred", stopReason: row.stopReason };
    }
  }
  return { reason: "unknown" };
}

function collectModel(rows: JsonRecord[]): string | undefined {
  for (const row of rows) {
    if (typeof row.model === "string") return row.model;
  }
  return undefined;
}

export function exportSession(jsonlPath: string, tracesRoot: string): ExportResult {
  const raw = readFileSync(jsonlPath, "utf8");
  const rows = parseJsonl(raw);
  const sessionId = sessionIdFrom(rows, jsonlPath);
  const outDir = join(tracesRoot, sessionId);
  mkdirSync(join(outDir, "turns"), { recursive: true });

  const turns = collectTurns(rows);
  const toolCalls = collectToolCalls(rows);
  const outcome = collectOutcome(rows);
  const meta: TraceMeta = {
    id: sessionId,
    source: jsonlPath,
    model: collectModel(rows),
    eventCount: rows.length,
  };

  writeFileSync(join(outDir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  writeFileSync(join(outDir, "outcome.json"), `${JSON.stringify(outcome, null, 2)}\n`);
  writeFileSync(
    join(outDir, "tool_calls.jsonl"),
    toolCalls.map((call) => JSON.stringify(call)).join("\n") + (toolCalls.length ? "\n" : ""),
  );
  for (const turn of turns) {
    writeFileSync(join(outDir, "turns", `${String(turn.index).padStart(3, "0")}.json`), `${JSON.stringify(turn, null, 2)}\n`);
  }

  return { sessionId, outDir, meta, turns, toolCalls, outcome };
}

function parseArgs(argv: string[]): { jsonlPath: string; tracesRoot: string } {
  let jsonlPath = "";
  let tracesRoot = "harness/omp/traces";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--jsonl") jsonlPath = argv[++i] ?? "";
    else if (argv[i] === "--out") tracesRoot = argv[++i] ?? tracesRoot;
  }
  if (!jsonlPath) throw new Error("usage: export-session --jsonl PATH [--out tracesRoot]");
  return { jsonlPath, tracesRoot };
}

if (import.meta.main) {
  const args = parseArgs(process.argv.slice(2));
  const result = exportSession(args.jsonlPath, args.tracesRoot);
  console.log(JSON.stringify({ sessionId: result.sessionId, outDir: result.outDir, turns: result.turns.length }));
}
