import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";

export type PlaybookSection = "Strategies" | "Failure modes" | "Repo conventions";

export type CuratorOutcome = {
  passed: boolean;
  lesson?: string;
  section?: PlaybookSection;
};

export type CurateInput = {
  playbookPath: string;
  sessionJsonlPath?: string;
  outcome: CuratorOutcome;
};

export type CurateResult = {
  action: "appended" | "incremented";
  id: string;
  section: PlaybookSection;
};

const SECRET_RE =
  /(sk-[A-Za-z0-9]{10,}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN [A-Z ]+PRIVATE KEY-----|OMP_[A-Z0-9_]+=\S+|client_secret\s*[:=]\s*\S+)/i;

const FORBIDDEN_ACTION_RE = /\b(SYSTEM\.md|system\.md|system-prompt\.ts)\b/;

const BULLET_RE =
  /^- \[([a-z]+-\d+)\] \(helpful=(\d+) harmful=(\d+)\) (.+)$/;

export function assertPlaybookPath(playbookPath: string): string {
  const resolved = resolve(playbookPath);
  const parts = resolved.split(sep);
  if (!parts.includes("playbook")) {
    throw new Error(`curator refuses writes outside playbook/: ${resolved}`);
  }
  return resolved;
}

export function looksLikeSecret(text: string): boolean {
  return SECRET_RE.test(text);
}

export function proposesSystemPromptEdit(text: string): boolean {
  return FORBIDDEN_ACTION_RE.test(text);
}

export function extractLessonFromJsonl(jsonl: string): string | undefined {
  for (const line of jsonl.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      const match = line.match(/^LESSON:\s*(.+)$/);
      if (match) return match[1].trim();
      continue;
    }
    if (parsed && typeof parsed === "object") {
      const rec = parsed as Record<string, unknown>;
      if (typeof rec.lesson === "string" && rec.lesson.trim()) return rec.lesson.trim();
      if (typeof rec.text === "string") {
        const match = rec.text.match(/LESSON:\s*(.+)$/m);
        if (match) return match[1].trim();
      }
    }
  }
  return undefined;
}

export function classifySection(lesson: string): PlaybookSection {
  const lower = lesson.toLowerCase();
  if (/(fail|error|regress|bug|wrong)/.test(lower)) return "Failure modes";
  if (/\b(convention|repo|path|secret|env)\b/.test(lower)) return "Repo conventions";
  return "Strategies";
}

function nextId(existing: string[], prefix: string): string {
  let max = 0;
  for (const id of existing) {
    const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function prefixFor(section: PlaybookSection): string {
  if (section === "Strategies") return "s";
  if (section === "Failure modes") return "f";
  return "c";
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function curatePlaybook(input: CurateInput): CurateResult {
  const playbookPath = assertPlaybookPath(input.playbookPath);
  let lesson = input.outcome.lesson?.trim();
  if (!lesson && input.sessionJsonlPath) {
    lesson = extractLessonFromJsonl(readFileSync(input.sessionJsonlPath, "utf8"));
  }
  if (!lesson) {
    throw new Error("curator needs outcome.lesson or a LESSON: field in the session jsonl");
  }
  if (looksLikeSecret(lesson)) {
    throw new Error("curator rejected secret-shaped lesson");
  }
  if (proposesSystemPromptEdit(lesson)) {
    throw new Error("curator rejected SYSTEM.md / system-prompt edit");
  }

  const section = input.outcome.section ?? classifySection(lesson);
  mkdirSync(dirname(playbookPath), { recursive: true });
  const current = readFileSync(playbookPath, "utf8");
  const lines = current.split(/\r?\n/);
  const ids: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(BULLET_RE);
    if (!match) continue;
    const [, id, helpful, harmful, text] = match;
    ids.push(id);
    if (normalize(text) === normalize(lesson)) {
      const nextHelpful = Number(helpful) + (input.outcome.passed ? 1 : 0);
      const nextHarmful = Number(harmful) + (input.outcome.passed ? 0 : 1);
      lines[i] = `- [${id}] (helpful=${nextHelpful} harmful=${nextHarmful}) ${text}`;
      writeFileSync(playbookPath, lines.join("\n"));
      return { action: "incremented", id, section };
    }
  }

  const heading = `## ${section}`;
  let insertAt = lines.findIndex((line) => line.trim() === heading);
  if (insertAt === -1) {
    if (lines.length && lines[lines.length - 1] !== "") lines.push("");
    lines.push(heading, "");
    insertAt = lines.length - 2;
  }
  let end = insertAt + 1;
  while (end < lines.length && !lines[end].startsWith("## ")) end++;
  const id = nextId(ids, prefixFor(section));
  const bullet = `- [${id}] (helpful=${input.outcome.passed ? 1 : 0} harmful=${input.outcome.passed ? 0 : 1}) ${lesson}`;
  let slot = end;
  while (slot > insertAt + 1 && lines[slot - 1].trim() === "") slot--;
  lines.splice(slot, 0, bullet);
  writeFileSync(playbookPath, lines.join("\n"));
  return { action: "appended", id, section };
}

function parseArgs(argv: string[]): CurateInput {
  const out: CurateInput = { playbookPath: "", outcome: { passed: true } };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--playbook") out.playbookPath = argv[++i] ?? "";
    else if (arg === "--session") out.sessionJsonlPath = argv[++i];
    else if (arg === "--lesson") out.outcome.lesson = argv[++i];
    else if (arg === "--failed") out.outcome.passed = false;
    else if (arg === "--passed") out.outcome.passed = true;
  }
  if (!out.playbookPath) throw new Error("usage: curate-playbook --playbook PATH [--session PATH] [--lesson TEXT] [--passed|--failed]");
  return out;
}

if (import.meta.main) {
  const result = curatePlaybook(parseArgs(process.argv.slice(2)));
  console.log(JSON.stringify(result));
}
