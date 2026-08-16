import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { HELD_IN_ID_TO_FAMILY, RECIPE_FAMILY_TO_FIXTURES, scorePlaybook } from "./playbook-solver.ts";
import { proposeNextRecipe } from "./propose.ts";
import { runSearch } from "./search.ts";

export type ArchitectureId =
  | "ace-only"
  | "self-harness-gated"
  | "ahe-surfaces"
  | "held-out-leak"
  | "kernel-write"
  | "unbounded-search"
  | "auto-promote";

export type SimulationResult = {
  id: ArchitectureId;
  title: string;
  sellingPoint: string;
  expected: "stagnate" | "improve" | "throw" | "no-promote";
  outcome: "pass" | "fail";
  detail: string;
  heldIn?: string;
  heldOut?: string;
};

function seedPlaybook(sourceRoot: string): string {
  return readFileSync(join(sourceRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8");
}

function evalsRoot(sourceRoot: string): string {
  return join(sourceRoot, "harness/omp/evals");
}

function searchWorktree(sourceRoot: string): string {
  const work = mkdtempSync(join(tmpdir(), "arch-sim-"));
  mkdirSync(join(work, "harness/omp/overlay/.omp/playbook"), { recursive: true });
  mkdirSync(join(work, "harness/omp/archive"), { recursive: true });
  mkdirSync(join(work, "harness/omp/staging"), { recursive: true });
  mkdirSync(join(work, "harness/omp/reports/search"), { recursive: true });
  cpSync(join(sourceRoot, "harness/omp/evals"), join(work, "harness/omp/evals"), { recursive: true });
  writeFileSync(join(work, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), seedPlaybook(sourceRoot));
  writeFileSync(
    join(work, "harness/omp/REVIEW_QUEUE.md"),
    "# Maintainer review queue\n\nCandidates are **evidence**.\n\n| id | surface | files | parentHash | held-in | held-out | rollback | apply to project .omp? |\n|----|---------|-------|------------|---------|----------|----------|------------------------|\n",
  );
  return work;
}

function threw(run: () => void, pattern: RegExp): boolean {
  try {
    run();
    return false;
  } catch (error) {
    return pattern.test(error instanceof Error ? error.message : String(error));
  }
}

function simAceOnly(sourceRoot: string): SimulationResult {
  const playbook = seedPlaybook(sourceRoot);
  const heldIn = scorePlaybook(evalsRoot(sourceRoot), "held-in", playbook);
  const heldOut = scorePlaybook(evalsRoot(sourceRoot), "held-out", playbook);
  const ok = heldIn.passed === 0 && heldOut.passed === 0;
  return {
    id: "ace-only",
    title: "ACE-only slogans (no recipe families)",
    sellingPoint: "Shows AHE’s warning: playbook slogans without tools/memory unlocks do not move the suite.",
    expected: "stagnate",
    outcome: ok ? "pass" : "fail",
    detail: ok ? "seed playbook unlocks 0 fixtures" : "seed playbook unexpectedly scored",
    heldIn: `${heldIn.passed}/${heldIn.total}`,
    heldOut: `${heldOut.passed}/${heldOut.total}`,
  };
}

function simSelfHarness(sourceRoot: string): SimulationResult {
  const work = searchWorktree(sourceRoot);
  const result = runSearch({ repoRoot: work, stepCap: 5 });
  const last = result.rounds[result.rounds.length - 1];
  const ok = Boolean(last && last.heldInAfter.passed >= 7 && last.heldOutAfter.passed >= 3 && last.decision === "accept");
  return {
    id: "self-harness-gated",
    title: "Self-Harness gated search (5 steps)",
    sellingPoint: "Bounded evolver + held-out gate improves both splits without a live model.",
    expected: "improve",
    outcome: ok ? "pass" : "fail",
    detail: `${result.rounds.filter((round) => round.decision === "accept").length} accepts`,
    heldIn: last ? `${last.heldInAfter.passed}/${last.heldInAfter.total}` : "n/a",
    heldOut: last ? `${last.heldOutAfter.passed}/${last.heldOutAfter.total}` : "n/a",
  };
}

function simAheSurfaces(sourceRoot: string): SimulationResult {
  const families = [...new Set(Object.values(HELD_IN_ID_TO_FAMILY))];
  const playbook = families.map((family) => `- [s] (helpful=1 harmful=0) ${family} — ahe sim\n`).join("");
  const heldIn = scorePlaybook(evalsRoot(sourceRoot), "held-in", playbook);
  const heldOut = scorePlaybook(evalsRoot(sourceRoot), "held-out", playbook);
  const secretFamily = RECIPE_FAMILY_TO_FIXTURES["recipe:no-secrets"];
  const secretsStillFail = secretFamily.every((id) => heldOut.byId[id] === false);
  const ok = heldIn.passed === heldIn.total && heldOut.passed === 6 && secretsStillFail;
  return {
    id: "ahe-surfaces",
    title: "AHE surfaces (all held-in families unlocked)",
    sellingPoint: "Tools/memory-style unlocks beat ACE-only; held-out-only secrets stay locked.",
    expected: "improve",
    outcome: ok ? "pass" : "fail",
    detail: ok ? "12/12 in, 6/8 out, secrets locked" : "unexpected unlock set",
    heldIn: `${heldIn.passed}/${heldIn.total}`,
    heldOut: `${heldOut.passed}/${heldOut.total}`,
  };
}

function simHeldOutLeak(sourceRoot: string): SimulationResult {
  const ok = threw(
    () =>
      proposeNextRecipe({
        playbook: seedPlaybook(sourceRoot),
        failingHeldInIds: ["no-secrets"],
        heldInOnly: true,
        repoRoot: sourceRoot,
      }),
    /held-out/,
  );
  return {
    id: "held-out-leak",
    title: "Leaked held-out proposer",
    sellingPoint: "An architecture that lets the evolver see D_out is rejected by Control.",
    expected: "throw",
    outcome: ok ? "pass" : "fail",
    detail: ok ? "proposer threw on held-out id" : "leak was not caught",
  };
}

function simKernelWrite(sourceRoot: string): SimulationResult {
  const work = searchWorktree(sourceRoot);
  const ok = threw(
    () =>
      runSearch({
        repoRoot: work,
        stepCap: 1,
        proposer: () => ({
          family: null,
          files: [{ relPath: "harness/omp/evals/checker/check.ts", content: "export {}\n" }],
        }),
      }),
    /kernel path/,
  );
  return {
    id: "kernel-write",
    title: "Reward-hacking evolver (writes checker)",
    sellingPoint: "A topology that can silence the verifier is refused before Delivery.",
    expected: "throw",
    outcome: ok ? "pass" : "fail",
    detail: ok ? "search refused checker write" : "kernel write was allowed",
  };
}

function simUnbounded(sourceRoot: string): SimulationResult {
  const work = searchWorktree(sourceRoot);
  const ok = threw(() => runSearch({ repoRoot: work, stepCap: 9 }), /stepCap/);
  return {
    id: "unbounded-search",
    title: "Unbounded agent loop",
    sellingPoint: "Hard MAX_STEP_CAP stops open-ended mutate loops (agentic-system-design).",
    expected: "throw",
    outcome: ok ? "pass" : "fail",
    detail: ok ? "stepCap 9 threw" : "unbounded cap was accepted",
  };
}

function simAutoPromote(sourceRoot: string): SimulationResult {
  const work = searchWorktree(sourceRoot);
  const before = readFileSync(join(work, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8");
  runSearch({ repoRoot: work, stepCap: 2 });
  const after = readFileSync(join(work, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8");
  const ok = before === after;
  return {
    id: "auto-promote",
    title: "Closed auto-apply onto canonical overlay",
    sellingPoint: "Delivery stages evidence; it does not promote (D12).",
    expected: "no-promote",
    outcome: ok ? "pass" : "fail",
    detail: ok ? "overlay playbook unchanged after search" : "search wrote overlay/.omp",
  };
}

export const ARCHITECTURE_SIMULATIONS: ArchitectureId[] = [
  "ace-only",
  "self-harness-gated",
  "ahe-surfaces",
  "held-out-leak",
  "kernel-write",
  "unbounded-search",
  "auto-promote",
];

export function runArchitectureSimulations(sourceRoot: string): SimulationResult[] {
  const root = resolve(sourceRoot);
  return [
    simAceOnly(root),
    simSelfHarness(root),
    simAheSurfaces(root),
    simHeldOutLeak(root),
    simKernelWrite(root),
    simUnbounded(root),
    simAutoPromote(root),
  ];
}

export function renderSimulationSummary(results: SimulationResult[]): string {
  const lines = [
    "# Agentic architecture simulations",
    "",
    "Keyless replays of named harness wirings. **Not a public Terminal-Bench 2 campaign.**",
    "",
    "| Id | Architecture | Expected | Outcome | Held-in | Held-out |",
    "|----|--------------|----------|---------|---------|----------|",
  ];
  for (const row of results) {
    lines.push(
      `| ${row.id} | ${row.title} | ${row.expected} | ${row.outcome} | ${row.heldIn ?? "—"} | ${row.heldOut ?? "—"} |`,
    );
  }
  lines.push("", "## Why this is the selling point", "");
  for (const row of results) {
    lines.push(`- **${row.id}:** ${row.sellingPoint}`);
  }
  lines.push("");
  return lines.join("\n");
}

export function writeSimulationReport(sourceRoot: string, outDir?: string): SimulationResult[] {
  const results = runArchitectureSimulations(sourceRoot);
  const dest = outDir ?? join(sourceRoot, "harness/omp/evals/simulations/latest");
  mkdirSync(dest, { recursive: true });
  writeFileSync(join(dest, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
  writeFileSync(join(dest, "summary.md"), renderSimulationSummary(results));
  return results;
}

if (import.meta.main) {
  const results = writeSimulationReport(process.cwd(), process.argv[2]);
  console.log(renderSimulationSummary(results));
  if (results.some((row) => row.outcome === "fail")) process.exit(1);
}
