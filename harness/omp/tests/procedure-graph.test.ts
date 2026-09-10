import { describe, expect, test } from "bun:test";
import {
  applyEdits,
  emptyGraph,
  localize,
  parseGraph,
  renderGuidance,
  scoreTrajectory,
} from "../../../plugins/dsh-improveness/src/procedure-graph.js";

const SAMPLE = {
  version: 1,
  nodes: [
    { id: "Start", kind: "state" },
    { id: "search", kind: "procedure" },
    { id: "read_evidence", kind: "procedure" },
    { id: "edit", kind: "procedure" },
    { id: "verify", kind: "procedure" },
  ],
  edges: [
    {
      from: "Start",
      rel: "leads_to",
      to: "search",
      condition: "task opened",
      guidance: "search the tree first",
      pitfalls: "do not edit blindly",
    },
    {
      from: "search",
      rel: "leads_to",
      to: "read_evidence",
      condition: "hits exist",
      guidance: "read the hits",
      pitfalls: "do not write before the read lands",
    },
    {
      from: "read_evidence",
      rel: "leads_to",
      to: "edit",
      condition: "evidence in context",
      guidance: "edit the named file",
      pitfalls: "do not skip verify",
    },
    {
      from: "edit",
      rel: "leads_to",
      to: "verify",
      condition: "edit returned",
      guidance: "run the check",
      pitfalls: "do not submit on red",
    },
  ],
};

describe("parseGraph", () => {
  test("empty and invalid JSON become an empty graph", () => {
    expect(parseGraph("")).toEqual(emptyGraph());
    expect(parseGraph("{")).toEqual(emptyGraph());
    expect(parseGraph(null)).toEqual(emptyGraph());
    expect(parseGraph("[]")).toEqual(emptyGraph());
  });

  test("parses a valid graph", () => {
    const g = parseGraph(JSON.stringify(SAMPLE));
    expect(g.nodes.map((n) => n.id)).toContain("search");
    expect(g.edges).toHaveLength(4);
  });
});

describe("localize", () => {
  test("unknown id without Start yields an empty neighborhood", () => {
    const g = parseGraph({ version: 1, nodes: [{ id: "edit", kind: "procedure" }], edges: [] });
    const nb = localize(g, "bash", 2);
    expect(nb.active).toBeNull();
    expect(nb.nodes).toEqual([]);
    expect(nb.edges).toEqual([]);
  });

  test("unknown id falls back to Start when present, not the full graph", () => {
    const g = parseGraph(SAMPLE);
    const nb = localize(g, "bash", 2);
    expect(nb.active).toBe("Start");
    const ids = nb.nodes.map((n) => n.id);
    expect(ids).toContain("Start");
    expect(ids).toContain("search");
    expect(ids).toContain("read_evidence");
    expect(ids).not.toContain("verify");
  });

  test("2-hop from search includes read and edit, not verify", () => {
    const g = parseGraph(SAMPLE);
    const nb = localize(g, "search", 2);
    expect(nb.active).toBe("search");
    const ids = new Set(nb.nodes.map((n) => n.id));
    expect(ids.has("search")).toBe(true);
    expect(ids.has("read_evidence")).toBe(true);
    expect(ids.has("edit")).toBe(true);
    expect(ids.has("verify")).toBe(false);
  });
});

describe("renderGuidance", () => {
  test("renders active plus outgoing condition guidance pitfalls", () => {
    const g = parseGraph(SAMPLE);
    const text = renderGuidance(localize(g, "search", 1));
    expect(text).toContain("active: search");
    expect(text).toContain("read_evidence");
    expect(text).toContain("leads_to");
    expect(text).toContain("do not write before the read lands");
  });

  test("empty neighborhood renders empty string", () => {
    expect(renderGuidance({ active: null, nodes: [], edges: [] })).toBe("");
  });
});

describe("applyEdits", () => {
  test("add and delete nodes and edges", () => {
    let g = emptyGraph();
    g = applyEdits(g, [{ op: "add-node", node: { id: "search", kind: "procedure" } }]).graph;
    g = applyEdits(g, [{ op: "add-node", node: { id: "edit", kind: "procedure" } }]).graph;
    g = applyEdits(g, [
      {
        op: "add-edge",
        edge: {
          from: "search",
          rel: "leads_to",
          to: "edit",
          condition: "hits read",
          guidance: "patch",
          pitfalls: "no skip",
        },
      },
    ]).graph;
    expect(g.edges).toHaveLength(1);
    g = applyEdits(g, [{ op: "delete-edge", from: "search", rel: "leads_to", to: "edit" }]).graph;
    expect(g.edges).toHaveLength(0);
    g = applyEdits(g, [{ op: "delete-node", id: "search" }]).graph;
    expect(g.nodes.map((n) => n.id)).toEqual(["edit"]);
  });

  test("secret-shaped attribute is rejected", () => {
    let g = emptyGraph();
    g = applyEdits(g, [
      { op: "add-node", node: { id: "a", kind: "procedure" } },
      { op: "add-node", node: { id: "b", kind: "procedure" } },
    ]).graph;
    const out = applyEdits(g, [
      {
        op: "add-edge",
        edge: {
          from: "a",
          rel: "leads_to",
          to: "b",
          condition: "",
          guidance: "sk-abcdefghijklmnopqrstuvwxyz",
          pitfalls: "",
        },
      },
    ]);
    expect(out.graph.edges).toHaveLength(0);
    expect(out.rejected.length).toBeGreaterThan(0);
  });
});

describe("scoreTrajectory", () => {
  test("legal path scores 1; skip-verify does not", () => {
    const g = parseGraph(SAMPLE);
    const success = ["Start", "search", "read_evidence", "edit", "verify"];
    const skip = ["Start", "search", "edit"];
    expect(scoreTrajectory(g, success)).toBe(1);
    expect(scoreTrajectory(g, skip)).toBeLessThan(1);
  });

  test("empty graph cannot unlock an ordered path", () => {
    expect(scoreTrajectory(emptyGraph(), ["search", "read_evidence", "edit"])).toBe(0);
  });
});
