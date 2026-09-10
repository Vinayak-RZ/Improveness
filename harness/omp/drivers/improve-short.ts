import { curatePlaybook } from "./curate-playbook.ts";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { applyEdits, emptyGraph, parseGraph, parseProcedureSteps } from "../../../plugins/dsh-improveness/src/procedure-graph.js";

export type ImproveShortInput = {
  repoRoot: string;
  playbookPath?: string;
  trajectoryPath?: string;
  lesson?: string;
  passed?: boolean;
};

export type ImproveShortResult = {
  kind: "short-term";
  action: "candidate" | "skipped";
  curate?: ReturnType<typeof curatePlaybook>;
  graphEdits?: number;
  reason?: string;
};

/**
 * Post-trajectory short-term improve: ACE bullets plus optional procedure-graph deltas.
 * Does not write durable plugins.
 */
export function improveShort(input: ImproveShortInput): ImproveShortResult {
  const playbookPath =
    input.playbookPath ?? join(input.repoRoot, "harness/omp/overlay/.omp/playbook/PLAYBOOK.md");
  if (!existsSync(playbookPath)) {
    return { kind: "short-term", action: "skipped", reason: "no playbook" };
  }

  let lesson = input.lesson;
  let trajBody = "";
  if (input.trajectoryPath && existsSync(input.trajectoryPath)) {
    trajBody = readFileSync(input.trajectoryPath, "utf8");
    if (!lesson) {
      const match = trajBody.match(/^LESSON:\s*(.+)$/m);
      if (match) lesson = match[1].trim();
    }
  }

  const graphEdits = maybeEditGraph({
    playbookPath,
    trajBody,
    passed: input.passed ?? true,
    lesson,
  });

  if (!lesson) {
    if (graphEdits > 0) return { kind: "short-term", action: "candidate", graphEdits };
    return { kind: "short-term", action: "skipped", reason: "no lesson" };
  }

  const curate = curatePlaybook({
    playbookPath,
    outcome: {
      passed: input.passed ?? true,
      lesson,
      section: "Strategies",
    },
  });
  return { kind: "short-term", action: "candidate", curate, graphEdits };
}

function maybeEditGraph(input: {
  playbookPath: string;
  trajBody: string;
  passed: boolean;
  lesson?: string;
}): number {
  if (input.passed) return 0;
  const steps = parseProcedureSteps(input.trajBody);
  if (steps.length < 2) return 0;
  const graphPath = join(dirname(input.playbookPath), "PROCEDURE_GRAPH.json");
  const current = existsSync(graphPath) ? parseGraph(readFileSync(graphPath, "utf8")) : emptyGraph();
  const from = steps[steps.length - 2];
  const to = steps[steps.length - 1];
  const { graph, rejected } = applyEdits(current, [
    { op: "add-node", node: { id: from, kind: "procedure" } },
    { op: "add-node", node: { id: to, kind: "procedure" } },
    {
      op: "update-edge",
      edge: {
        from,
        rel: "leads_to",
        to,
        condition: "after failed trajectory",
        guidance: input.lesson ?? "follow the recorded order",
        pitfalls: input.lesson ?? "do not skip this transition",
      },
    },
  ]);
  if (rejected.length > 0 && graph.edges.length === current.edges.length) return 0;
  writeFileSync(graphPath, `${JSON.stringify(graph, null, 2)}\n`);
  return 1;
}
