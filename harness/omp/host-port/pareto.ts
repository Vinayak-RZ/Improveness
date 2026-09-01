export type ParetoNode = {
  id: string;
  quality: number;
  cost: number;
};

/** Keep non-dominated archive members (higher quality, lower cost). */
export function paretoFront(nodes: ParetoNode[]): ParetoNode[] {
  return nodes.filter(
    (node) =>
      !nodes.some(
        (other) => other.id !== node.id && other.quality >= node.quality && other.cost <= node.cost && (other.quality > node.quality || other.cost < node.cost),
      ),
  );
}

export function archiveWithPareto<T extends { id: string; fitness: number; cost?: number }>(nodes: T[]): ParetoNode[] {
  return paretoFront(nodes.map((node) => ({ id: node.id, quality: node.fitness, cost: node.cost ?? 1 })));
}
