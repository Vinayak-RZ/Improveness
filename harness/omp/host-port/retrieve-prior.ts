import { loadSnapshotPlaybook, listArchive, type ArchiveNode } from "../drivers/archive.ts";
import { archiveWithPareto } from "./pareto.ts";

/** JIT retrieve-prior: pull archive parents into the session instead of retraining a controller. */
export function retrievePriorHarnesses(repoRoot: string, limit = 3): { id: string; playbook: string | null }[] {
  const nodes: ArchiveNode[] = listArchive(repoRoot);
  const front = archiveWithPareto(nodes.map((node) => ({ id: node.id, fitness: node.fitness, cost: 1 + node.childCount })));
  return front.slice(0, limit).map((node) => ({
    id: node.id,
    playbook: loadSnapshotPlaybook(repoRoot, node.id),
  }));
}
