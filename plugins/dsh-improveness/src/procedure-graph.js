/**
 * Procedural graph: order and conditions for the existing harness loop.
 * Nodes are procedure ids, never raw Cordis tool names as the only key.
 */

const RELS = new Set(["leads_to", "requires", "enables", "extracts"]);
const KINDS = new Set(["procedure", "reason", "state"]);
const SECRET_RE =
  /(sk-[A-Za-z0-9]{10,}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN [A-Z ]+PRIVATE KEY-----|OMP_[A-Z0-9_]+=\S+|client_secret\s*[:=]\s*\S+)/i;

export function emptyGraph() {
  return { version: 1, nodes: [], edges: [] };
}

export function parseGraph(raw) {
  if (raw == null || raw === "") return emptyGraph();
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return emptyGraph();
    }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return emptyGraph();
  const nodes = Array.isArray(data.nodes) ? data.nodes.filter(validNode) : [];
  const idSet = new Set(nodes.map((n) => n.id));
  const edges = Array.isArray(data.edges) ? data.edges.filter((e) => validEdge(e, idSet)) : [];
  return { version: 1, nodes, edges };
}

function validNode(n) {
  return Boolean(n && typeof n.id === "string" && n.id.length > 0 && KINDS.has(n.kind));
}

function validEdge(e, idSet) {
  if (!e || !RELS.has(e.rel)) return false;
  if (typeof e.from !== "string" || typeof e.to !== "string") return false;
  if (!idSet.has(e.from) || !idSet.has(e.to)) return false;
  for (const key of ["condition", "guidance", "pitfalls"]) {
    const v = e[key] ?? "";
    if (typeof v !== "string") return false;
    if (SECRET_RE.test(v)) return false;
  }
  return true;
}

function cloneGraph(graph) {
  return {
    version: 1,
    nodes: (graph?.nodes ?? []).map((n) => ({ ...n })),
    edges: (graph?.edges ?? []).map((e) => ({ ...e })),
  };
}

/**
 * Outgoing neighborhood up to `hops`. Unknown id → Start if present, else empty.
 * Never dumps the full graph.
 */
export function localize(graph, activeId, hops = 2) {
  const g = graph ?? emptyGraph();
  const ids = new Set(g.nodes.map((n) => n.id));
  let start = activeId && ids.has(activeId) ? activeId : null;
  if (!start && ids.has("Start")) start = "Start";
  if (!start) return { active: null, nodes: [], edges: [] };

  const depth = new Map([[start, 0]]);
  const keptEdges = [];
  const queue = [start];
  while (queue.length > 0) {
    const u = queue.shift();
    const d = depth.get(u);
    if (d >= hops) continue;
    for (const e of g.edges) {
      if (e.from !== u) continue;
      keptEdges.push(e);
      if (!depth.has(e.to)) {
        depth.set(e.to, d + 1);
        queue.push(e.to);
      }
    }
  }
  const reached = new Set(depth.keys());
  return {
    active: start,
    nodes: g.nodes.filter((n) => reached.has(n.id)),
    edges: keptEdges.filter((e, i, arr) => arr.findIndex((x) => x.from === e.from && x.rel === e.rel && x.to === e.to) === i),
  };
}

export function renderGuidance(neighborhood) {
  const active = neighborhood?.active;
  const edges = neighborhood?.edges ?? [];
  if (!active) return "";
  const lines = [`active: ${active}`];
  for (const e of edges) {
    if (e.from !== active && !edges.some((x) => x.from === active && x.to === e.from)) {
      // still list outgoing from active first; include 2-hop as next:
    }
    const cond = e.condition ? ` — condition: ${e.condition}` : "";
    lines.push(`next: ${e.to} (${e.rel})${cond}`);
    if (e.guidance) lines.push(`guidance: ${e.guidance}`);
    if (e.pitfalls) lines.push(`pitfalls: ${e.pitfalls}`);
  }
  return lines.join("\n");
}

export function applyEdits(graph, edits) {
  const next = cloneGraph(graph ?? emptyGraph());
  const rejected = [];
  for (const edit of edits ?? []) {
    if (!edit || typeof edit.op !== "string") continue;
    if (edit.op === "add-node") {
      if (!validNode(edit.node)) {
        rejected.push(edit);
        continue;
      }
      if (!next.nodes.some((n) => n.id === edit.node.id)) next.nodes.push({ ...edit.node });
      continue;
    }
    if (edit.op === "delete-node") {
      next.nodes = next.nodes.filter((n) => n.id !== edit.id);
      next.edges = next.edges.filter((e) => e.from !== edit.id && e.to !== edit.id);
      continue;
    }
    if (edit.op === "add-edge" || edit.op === "update-edge") {
      const idSet = new Set(next.nodes.map((n) => n.id));
      if (!validEdge(edit.edge, idSet)) {
        rejected.push(edit);
        continue;
      }
      next.edges = next.edges.filter(
        (e) => !(e.from === edit.edge.from && e.rel === edit.edge.rel && e.to === edit.edge.to),
      );
      next.edges.push({
        from: edit.edge.from,
        rel: edit.edge.rel,
        to: edit.edge.to,
        condition: edit.edge.condition ?? "",
        guidance: edit.edge.guidance ?? "",
        pitfalls: edit.edge.pitfalls ?? "",
      });
      continue;
    }
    if (edit.op === "delete-edge") {
      next.edges = next.edges.filter((e) => !(e.from === edit.from && e.rel === edit.rel && e.to === edit.to));
    }
  }
  return { graph: next, rejected };
}

/** Fraction of consecutive steps that match an edge. Empty graph or no steps → 0. */
export function scoreTrajectory(graph, steps) {
  const seq = Array.isArray(steps) ? steps.filter(Boolean) : [];
  if (seq.length < 2) return 0;
  const edges = graph?.edges ?? [];
  let ok = 0;
  let total = 0;
  for (let i = 0; i < seq.length - 1; i++) {
    total += 1;
    const from = seq[i];
    const to = seq[i + 1];
    if (edges.some((e) => e.from === from && e.to === to)) ok += 1;
  }
  return total === 0 ? 0 : ok / total;
}

export function parseProcedureSteps(text) {
  if (!text) return [];
  const steps = [];
  const re = /^PROCEDURE:\s*(\S+)/gm;
  let m;
  while ((m = re.exec(text))) steps.push(m[1]);
  return steps;
}
