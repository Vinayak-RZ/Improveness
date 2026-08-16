import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { scorePlaybook } from "./playbook-solver.ts";
import { DEFAULT_STEP_CAP, runSearch, type SearchResult } from "./search.ts";

export type BenchmarkReport = {
  name: string;
  note: string;
  stepCap: number;
  baseline: {
    heldIn: { passed: number; total: number };
    heldOut: { passed: number; total: number };
  };
  final: {
    heldIn: { passed: number; total: number };
    heldOut: { passed: number; total: number };
  };
  delta: { heldIn: number; heldOut: number };
  rounds: SearchResult["rounds"];
};

export function renderSummary(report: BenchmarkReport): string {
  const lines = [
    "# Local Improveness benchmark",
    "",
    "> **Not a public Terminal-Bench 2 campaign.** Fitness is the frozen 20-fixture checker.",
    "",
    `| Split | Baseline | After ${report.stepCap} search steps | Δ |`,
    `|-------|----------|--------------------------------|------|`,
    `| Held-in | ${report.baseline.heldIn.passed}/${report.baseline.heldIn.total} | ${report.final.heldIn.passed}/${report.final.heldIn.total} | +${report.delta.heldIn} |`,
    `| Held-out | ${report.baseline.heldOut.passed}/${report.baseline.heldOut.total} | ${report.final.heldOut.passed}/${report.final.heldOut.total} | +${report.delta.heldOut} |`,
    "",
    "## Rounds",
    "",
    "| Step | Family | Decision | Held-in | Held-out |",
    "|------|--------|----------|---------|----------|",
  ];
  for (const round of report.rounds) {
    lines.push(
      `| ${round.step} | ${round.family ?? "—"} | ${round.decision} | ${round.heldInAfter.passed}/${round.heldInAfter.total} | ${round.heldOutAfter.passed}/${round.heldOutAfter.total} |`,
    );
  }
  lines.push(
    "",
    "## How to read this",
    "",
    "- The proposer sees **held-in failures only** and unlocks one `recipe:*` family per accepted step.",
    "- Shared families generalize to held-out (gitignore, named-export, …).",
    "- Held-out-only `recipe:no-secrets` is never proposed, so those two tasks stay failed.",
    "- Accepts land in staging + archive + REVIEW_QUEUE. Canonical `overlay/.omp` is unchanged (D12).",
    "",
  );
  return lines.join("\n");
}

export function runBenchmark(input: {
  sourceRoot: string;
  stepCap?: number;
  outDir?: string;
}): BenchmarkReport {
  const sourceRoot = resolve(input.sourceRoot);
  const stepCap = input.stepCap ?? 5;
  const work = mkdtempSync(join(tmpdir(), "improv-bench-"));
  mkdirSync(join(work, "harness/omp/overlay/.omp/playbook"), { recursive: true });
  mkdirSync(join(work, "harness/omp/archive"), { recursive: true });
  mkdirSync(join(work, "harness/omp/staging"), { recursive: true });
  mkdirSync(join(work, "harness/omp/reports/search"), { recursive: true });
  cpSync(join(sourceRoot, "harness/omp/evals"), join(work, "harness/omp/evals"), { recursive: true });
  cpSync(
    join(sourceRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"),
    join(work, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"),
  );
  writeFileSync(
    join(work, "harness/omp/REVIEW_QUEUE.md"),
    "# Maintainer review queue\n\nCandidates are **evidence**.\n\n| id | surface | files | parentHash | held-in | held-out | rollback | apply to project .omp? |\n|----|---------|-------|------------|---------|----------|----------|------------------------|\n",
  );

  const evalsRoot = join(work, "harness/omp/evals");
  const seedPlaybook = readFileSync(join(work, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8");
  const baselineIn = scorePlaybook(evalsRoot, "held-in", seedPlaybook);
  const baselineOut = scorePlaybook(evalsRoot, "held-out", seedPlaybook);
  const search = runSearch({ repoRoot: work, evalsRoot, stepCap });
  const last = search.rounds[search.rounds.length - 1];
  const finalIn = last?.heldInAfter ?? { passed: baselineIn.passed, total: baselineIn.total, byId: baselineIn.byId };
  const finalOut = last?.heldOutAfter ?? { passed: baselineOut.passed, total: baselineOut.total, byId: baselineOut.byId };

  const report: BenchmarkReport = {
    name: "local-20",
    note: "Local 20-fixture Self-Harness suite. Not public Terminal-Bench 2.",
    stepCap,
    baseline: {
      heldIn: { passed: baselineIn.passed, total: baselineIn.total },
      heldOut: { passed: baselineOut.passed, total: baselineOut.total },
    },
    final: {
      heldIn: { passed: finalIn.passed, total: finalIn.total },
      heldOut: { passed: finalOut.passed, total: finalOut.total },
    },
    delta: {
      heldIn: finalIn.passed - baselineIn.passed,
      heldOut: finalOut.passed - baselineOut.passed,
    },
    rounds: search.rounds,
  };

  if (input.outDir) {
    const outDir = resolve(input.outDir);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "scores.json"), `${JSON.stringify(report, null, 2)}\n`);
    writeFileSync(join(outDir, "search-log.jsonl"), `${search.rounds.map((round) => JSON.stringify(round)).join("\n")}\n`);
    writeFileSync(join(outDir, "summary.md"), renderSummary(report));
  }
  return report;
}

if (import.meta.main) {
  const stepCap = Number(process.argv[2] ?? DEFAULT_STEP_CAP);
  const outDir = process.argv[3] ?? "harness/omp/evals/benchmarks/local-20";
  const report = runBenchmark({ sourceRoot: process.cwd(), stepCap, outDir });
  console.log(renderSummary(report));
}
