import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { assertEvolverWrite } from "./allowlist.ts";
import { HELD_IN_ID_TO_FAMILY, RECIPE_BLURBS, unlockedFamilies } from "./playbook-solver.ts";
import type { CandidateFile } from "./self-harness.ts";
import { applyEdits, emptyGraph, parseGraph } from "../../../plugins/dsh-improveness/src/procedure-graph.js";

export const GRAPH_REL = "harness/omp/overlay/.omp/playbook/PROCEDURE_GRAPH.json";

export type ProposeInput = {
  playbook: string;
  failingHeldInIds: string[];
  heldInOnly: true;
  repoRoot: string;
};

export function assertHeldInOnly(input: { heldInOnly: boolean; failingHeldInIds: string[] }): void {
  if (!input.heldInOnly) {
    throw new Error("proposer must run with heldInOnly: true");
  }
  for (const id of input.failingHeldInIds) {
    if (!(id in HELD_IN_ID_TO_FAMILY)) {
      throw new Error(`proposer must not read held-out fixtures: ${id}`);
    }
  }
}

export function nextHeldInFamily(playbook: string, failingHeldInIds: string[]): string | null {
  const unlocked = unlockedFamilies(playbook);
  for (const id of failingHeldInIds) {
    const family = HELD_IN_ID_TO_FAMILY[id];
    if (family && !unlocked.has(family)) return family;
  }
  return null;
}

export function appendRecipe(playbook: string, family: string): string {
  const blurb = RECIPE_BLURBS[family] ?? family;
  const nextId = `s-${String(playbook.match(/\[s-\d+/g)?.length ?? 0).padStart(3, "0")}`;
  const line = `- [${nextId}] (helpful=1 harmful=0) ${family} — ${blurb}`;
  return playbook.endsWith("\n") ? `${playbook}${line}\n` : `${playbook}\n${line}\n`;
}

export function loadProcedureGraph(repoRoot: string) {
  const abs = join(repoRoot, GRAPH_REL);
  if (!existsSync(abs)) return emptyGraph();
  return parseGraph(readFileSync(abs, "utf8"));
}

export function proposeNextRecipe(input: ProposeInput): { family: string | null; files: CandidateFile[] } {
  assertHeldInOnly(input);
  const family = nextHeldInFamily(input.playbook, input.failingHeldInIds);
  const relPath = "harness/omp/overlay/.omp/playbook/PLAYBOOK.md";
  const dest = resolve(input.repoRoot, "harness/omp/staging/playbook/PLAYBOOK.md");
  assertEvolverWrite(dest, input.repoRoot);
  const graphDest = resolve(input.repoRoot, "harness/omp/staging/playbook/PROCEDURE_GRAPH.json");
  assertEvolverWrite(graphDest, input.repoRoot);
  const graph = loadProcedureGraph(input.repoRoot);
  const graphFile = (g: ReturnType<typeof emptyGraph>): CandidateFile => ({
    relPath: GRAPH_REL,
    content: `${JSON.stringify(g, null, 2)}\n`,
  });
  if (!family) {
    return { family: null, files: [{ relPath, content: input.playbook }, graphFile(graph)] };
  }
  const { graph: nextGraph } = applyEdits(graph, [{ op: "add-node", node: { id: family, kind: "procedure" } }]);
  return {
    family,
    files: [
      { relPath, content: appendRecipe(input.playbook, family) },
      graphFile(nextGraph),
    ],
  };
}
