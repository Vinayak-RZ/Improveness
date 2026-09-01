import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { assertEvolverWrite, isKernelRel } from "./allowlist.ts";
import { listArchive, loadSnapshotPlaybook, sampleParent, snapshotOverlay } from "./archive.ts";
import { applyDurablePlugin, isGeneratedPluginPath } from "./apply-snapshot.ts";
import { hashContents } from "./apply-candidate.ts";
import type { CandidateManifest } from "./manifest.ts";
import { scorePlaybook } from "./playbook-solver.ts";
import { proposeNextRecipe } from "./propose.ts";
import { decideAccept, stageCandidate, type CandidateFile } from "./self-harness.ts";
import type { SplitScore } from "./run-eval.ts";

export const MAX_STEP_CAP = 8;
export const DEFAULT_STEP_CAP = 3;

export type SearchRound = {
  step: number;
  parentId: string;
  family: string | null;
  decision: ReturnType<typeof decideAccept>;
  heldInBefore: Pick<SplitScore, "passed" | "total" | "byId">;
  heldInAfter: Pick<SplitScore, "passed" | "total" | "byId">;
  heldOutBefore: Pick<SplitScore, "passed" | "total" | "byId">;
  heldOutAfter: Pick<SplitScore, "passed" | "total" | "byId">;
  staged: string[];
  snapshotId: string | null;
};

export type SearchResult = {
  seedId: string;
  rounds: SearchRound[];
};

export type Proposer = (input: {
  playbook: string;
  failingHeldInIds: string[];
  heldInOnly: true;
  repoRoot: string;
}) => { family: string | null; files: CandidateFile[] };

export function assertStepCap(stepCap: number): void {
  if (!Number.isInteger(stepCap) || stepCap < 1 || stepCap > MAX_STEP_CAP) {
    throw new Error(`search stepCap must be 1..${MAX_STEP_CAP}, got ${stepCap}`);
  }
}

function compact(score: SplitScore): Pick<SplitScore, "passed" | "total" | "byId"> {
  return { passed: score.passed, total: score.total, byId: score.byId };
}

function readOverlayPlaybook(repoRoot: string): string {
  return readFileSync(join(repoRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md"), "utf8");
}

function ensureSeedArchive(repoRoot: string, evalsRoot: string): string {
  const existing = listArchive(repoRoot);
  if (existing.length > 0) return sampleParent(existing);
  const baseline = scorePlaybook(evalsRoot, "held-out", readOverlayPlaybook(repoRoot));
  snapshotOverlay({
    id: "seed",
    repoRoot,
    parentId: null,
    fitness: baseline.total === 0 ? 0 : baseline.passed / baseline.total,
  });
  return "seed";
}

function writeRejectLog(repoRoot: string, round: SearchRound): void {
  const rel = `harness/omp/reports/search/${round.parentId}-${round.step}.json`;
  if (isKernelRel(rel)) throw new Error(`search refuses kernel path: ${rel}`);
  const abs = resolve(repoRoot, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(round, null, 2)}\n`);
}

function writeStagingManifest(repoRoot: string, manifest: CandidateManifest): void {
  const rel = `harness/omp/staging/manifests/${manifest.id}.json`;
  const abs = resolve(repoRoot, rel);
  assertEvolverWrite(abs, repoRoot);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(manifest, null, 2)}\n`);
}

export function appendReviewRow(
  repoRoot: string,
  manifest: CandidateManifest,
): void {
  const path = join(repoRoot, "harness/omp/REVIEW_QUEUE.md");
  const row = `| ${manifest.id} | ${manifest.surface} | ${manifest.files.join("<br>")} | ${manifest.parentHash} | ${manifest.scores.heldIn.passed}/${manifest.scores.heldIn.total} | ${manifest.scores.heldOut.passed}/${manifest.scores.heldOut.total} | \`${manifest.rollback}\` | no — search evidence (D12) |\n`;
  const body = readFileSync(path, "utf8");
  writeFileSync(path, body.endsWith("\n") ? `${body}${row}` : `${body}\n${row}`);
}

export function runSearch(input: {
  repoRoot: string;
  stepCap?: number;
  proposer?: Proposer;
  evalsRoot?: string;
}): SearchResult {
  const repoRoot = resolve(input.repoRoot);
  const stepCap = input.stepCap ?? DEFAULT_STEP_CAP;
  assertStepCap(stepCap);
  const evalsRoot = input.evalsRoot ?? join(repoRoot, "harness/omp/evals");
  const proposer = input.proposer ?? proposeNextRecipe;

  const seedId = ensureSeedArchive(repoRoot, evalsRoot);
  const rounds: SearchRound[] = [];
  let playbook = loadSnapshotPlaybook(repoRoot, seedId) ?? readOverlayPlaybook(repoRoot);

  for (let step = 1; step <= stepCap; step++) {
    const parentId = sampleParent(listArchive(repoRoot));
    playbook = loadSnapshotPlaybook(repoRoot, parentId) ?? playbook;
    const heldInBefore = scorePlaybook(evalsRoot, "held-in", playbook);
    const heldOutBefore = scorePlaybook(evalsRoot, "held-out", playbook);
    const failingHeldInIds = Object.entries(heldInBefore.byId)
      .filter(([, passed]) => !passed)
      .map(([id]) => id)
      .sort();

    const proposal = proposer({
      playbook,
      failingHeldInIds,
      heldInOnly: true,
      repoRoot,
    });
    for (const file of proposal.files) {
      if (isKernelRel(file.relPath)) {
        throw new Error(`search refuses kernel path: ${file.relPath}`);
      }
    }

    const nextPlaybook = proposal.files.find((file) => file.relPath.endsWith("PLAYBOOK.md"))?.content ?? playbook;
    const heldInAfter = scorePlaybook(evalsRoot, "held-in", nextPlaybook);
    const heldOutAfter = scorePlaybook(evalsRoot, "held-out", nextPlaybook);
    const decision = decideAccept(heldInBefore, heldInAfter, heldOutBefore, heldOutAfter);

    const round: SearchRound = {
      step,
      parentId,
      family: proposal.family,
      decision,
      heldInBefore: compact(heldInBefore),
      heldInAfter: compact(heldInAfter),
      heldOutBefore: compact(heldOutBefore),
      heldOutAfter: compact(heldOutAfter),
      staged: [],
      snapshotId: null,
    };

    if (decision === "accept") {
      const pluginFiles = proposal.files.filter((file) => isGeneratedPluginPath(file.relPath));
      const playbookFiles = proposal.files.filter((file) => !isGeneratedPluginPath(file.relPath));
      const staged = playbookFiles.length > 0 ? stageCandidate(playbookFiles, repoRoot) : [];
      for (const file of pluginFiles) {
        const posix = file.relPath.split("\\").join("/");
        const match = posix.match(/generated\/([^/]+)\//) ?? posix.match(/improveness-generated\/([^/]+)\//);
        const pluginId = match?.[1] ?? `step-${step}`;
        const inner = posix.replace(/^.*generated\/[^/]+\//, "").replace(/^.*improveness-generated\/[^/]+\//, "");
        applyDurablePlugin({
          id: pluginId,
          slot: "capability",
          files: { [inner || "apply.js"]: file.content },
          repoRoot,
        });
        staged.push(file.relPath);
      }
      const snapshotId = `step-${step}`;
      const manifest: CandidateManifest = {
        id: snapshotId,
        surface: pluginFiles.length > 0 ? "plugin" : "playbook",
        files: staged,
        parentHash: hashContents([playbook]),
        scores: {
          heldIn: { passed: heldInAfter.passed, total: heldInAfter.total },
          heldOut: { passed: heldOutAfter.passed, total: heldOutAfter.total },
        },
        rollback: `bun harness/omp/drivers/rollback-candidate.ts --id ${snapshotId}`,
        evidenceId: parentId,
        rootCause: proposal.family ?? "playbook-delta",
      };
      if (playbookFiles.length > 0) writeStagingManifest(repoRoot, manifest);
      appendReviewRow(repoRoot, manifest);
      snapshotOverlay({
        id: snapshotId,
        repoRoot,
        parentId,
        fitness: heldOutAfter.total === 0 ? 0 : heldOutAfter.passed / heldOutAfter.total,
      });
      round.staged = staged;
      round.snapshotId = snapshotId;
      playbook = nextPlaybook;
    } else {
      writeRejectLog(repoRoot, round);
    }
    rounds.push(round);
  }

  return { seedId, rounds };
}

if (import.meta.main) {
  const stepCap = Number(process.argv[2] ?? DEFAULT_STEP_CAP);
  const result = runSearch({ repoRoot: process.cwd(), stepCap });
  console.log(JSON.stringify(result, null, 2));
}
