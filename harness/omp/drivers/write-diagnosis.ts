import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { assertDiagnosisPath } from "./allowlist.ts";

export function writeDiagnosis(targetPath: string, body: string, repoRoot: string): string {
  const resolved = assertDiagnosisPath(targetPath, repoRoot);
  mkdirSync(dirname(resolved), { recursive: true });
  writeFileSync(resolved, body.endsWith("\n") ? body : `${body}\n`);
  return resolved;
}
