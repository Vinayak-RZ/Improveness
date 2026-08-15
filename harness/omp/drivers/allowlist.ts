import { basename, relative, resolve, sep } from "node:path";

export const DEBUGGER_ALLOWED_TOOLS = ["read", "grep", "find", "glob"] as const;
export const DEBUGGER_DENIED_TOOLS = ["edit", "write", "bash"] as const;

export type DebuggerTool = (typeof DEBUGGER_ALLOWED_TOOLS)[number];

function posixRel(from: string, to: string): string {
  return relative(from, to).split(sep).join("/");
}

export function isDebuggerToolAllowed(toolName: string): boolean {
  const name = toolName.toLowerCase();
  if ((DEBUGGER_DENIED_TOOLS as readonly string[]).includes(name)) return false;
  return (DEBUGGER_ALLOWED_TOOLS as readonly string[]).includes(name);
}

export function assertDebuggerTool(toolName: string): void {
  if (!isDebuggerToolAllowed(toolName)) {
    throw new Error(`debugger tool denied: ${toolName}`);
  }
}

/** Harness-only write: diagnosis.md under traces/ or reports/. Never playbook or source. */
export function assertDiagnosisPath(targetPath: string, repoRoot: string): string {
  const resolved = resolve(targetPath);
  const rel = posixRel(resolve(repoRoot), resolved);
  if (rel.startsWith("..") || rel.includes("..")) {
    throw new Error(`debugger diagnosis path escapes repo: ${rel}`);
  }
  if (basename(resolved) !== "diagnosis.md") {
    throw new Error(`debugger may only write diagnosis.md, not ${basename(resolved)}`);
  }
  if (!rel.startsWith("harness/omp/traces/") && !rel.startsWith("harness/omp/reports/")) {
    throw new Error(`debugger diagnosis.md must live under traces/ or reports/: ${rel}`);
  }
  if (rel.includes("playbook/") || rel.startsWith("oh-my-pi/packages/")) {
    throw new Error(`debugger cannot write playbook or OMP source: ${rel}`);
  }
  return resolved;
}
