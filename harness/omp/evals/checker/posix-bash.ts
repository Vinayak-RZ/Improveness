import { existsSync } from "node:fs";
import { delimiter, join } from "node:path";

/**
 * Fixture `check.sh` scripts need a POSIX bash. On Windows, `bash` on PATH is
 * often `C:\Windows\System32\bash.exe` (WSL launcher), which cannot score this tree.
 *
 * ponytail: Program Files + PATH scan excluding System32. Set IMPROVENESS_BASH if Git lives elsewhere.
 */
export function posixBash(): string {
  if (process.env.IMPROVENESS_BASH) return process.env.IMPROVENESS_BASH;
  if (process.platform !== "win32") return "bash";
  const pinned = [
    "C:\\Program Files\\Git\\bin\\bash.exe",
    "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
  ];
  for (const path of pinned) {
    if (existsSync(path)) return path;
  }
  for (const dir of (process.env.PATH ?? "").split(delimiter)) {
    const path = join(dir, "bash.exe");
    if (!existsSync(path)) continue;
    if (/system32|windowsapps/i.test(path)) continue;
    return path;
  }
  return "bash";
}
