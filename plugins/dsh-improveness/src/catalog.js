/**
 * Hierarchical tool catalog: namespace → group → tool.
 * Flat Cordis tools stay registered separately; this is discovery for the agent.
 */

/**
 * @typedef {{ id: string, name: string, description: string, section?: string }} CatalogTool
 * @typedef {{ id: string, name: string, tools: CatalogTool[] }} CatalogGroup
 * @typedef {{ id: string, name: string, groups: CatalogGroup[] }} CatalogNamespace
 */

/**
 * @returns {CatalogNamespace[]}
 */
export function defaultCatalogTree() {
  return [
    {
      id: "improveness",
      name: "Improveness",
      groups: [
        {
          id: "inspect",
          name: "Inspect",
          tools: [
            {
              id: "improveness.inspect",
              name: "inspect",
              description: "Sections, frozen ids, slots, catalog root",
              section: "core",
            },
            {
              id: "improveness.catalog",
              name: "catalog",
              description: "Expand hierarchical tool catalog",
              section: "core",
            },
          ],
        },
        {
          id: "jit",
          name: "JIT harness",
          tools: [
            {
              id: "improveness.define",
              name: "define",
              description: "Mount ephemeral session plugin",
              section: "jit",
            },
            {
              id: "improveness.run",
              name: "run",
              description: "Run under a mounted JIT plugin",
              section: "jit",
            },
            {
              id: "improveness.stop",
              name: "stop",
              description: "Unmount JIT plugin",
              section: "jit",
            },
            {
              id: "improveness.synthesize",
              name: "synthesize",
              description: "Assemble M/P/A/C task harness from templates",
              section: "jit",
            },
          ],
        },
        {
          id: "improve",
          name: "Improvement",
          tools: [
            {
              id: "improveness.promote",
              name: "promote",
              description: "Apply durable plugin after accept",
              section: "improvement",
            },
            {
              id: "improveness.improveShort",
              name: "improveShort",
              description: "Post-trajectory short-term candidates",
              section: "improvement.shortTerm",
            },
            {
              id: "improveness.improveLong",
              name: "improveLong",
              description: "Archive cadence long-term candidacy",
              section: "improvement.longTerm",
            },
          ],
        },
        {
          id: "events",
          name: "Events",
          tools: [
            {
              id: "improveness.emit",
              name: "emit",
              description: "Emit session event (need_tool / tool_fail / plan_step)",
              section: "eventInject",
            },
          ],
        },
      ],
    },
  ];
}

/**
 * @param {CatalogNamespace[]} tree
 * @param {ReturnType<import("./sections.js").parseSections>} sections
 */
export function filterCatalog(tree, sections) {
  return tree
    .map((ns) => ({
      ...ns,
      groups: ns.groups
        .map((g) => ({
          ...g,
          tools: g.tools.filter((t) => toolAllowed(t, sections)),
        }))
        .filter((g) => g.tools.length > 0),
    }))
    .filter((ns) => ns.groups.length > 0);
}

/**
 * @param {CatalogTool} tool
 * @param {ReturnType<import("./sections.js").parseSections>} sections
 */
function toolAllowed(tool, sections) {
  const s = tool.section ?? "core";
  if (s === "core") return true;
  if (s === "jit") return sections.jit;
  if (s === "improvement") return sections.improvement.enabled;
  if (s === "improvement.shortTerm") return sections.improvement.shortTerm;
  if (s === "improvement.longTerm") return sections.improvement.longTerm;
  if (s === "eventInject") return sections.eventInject;
  return true;
}

/**
 * @param {CatalogNamespace[]} tree
 * @param {{ namespace?: string, group?: string }} [path]
 */
export function expandCatalog(tree, path = {}) {
  if (!path.namespace) {
    return {
      level: "root",
      children: tree.map((ns) => ({ id: ns.id, name: ns.name, kind: "namespace" })),
    };
  }
  const ns = tree.find((n) => n.id === path.namespace);
  if (!ns) throw new Error(`unknown namespace: ${path.namespace}`);
  if (!path.group) {
    return {
      level: "namespace",
      id: ns.id,
      children: ns.groups.map((g) => ({ id: g.id, name: g.name, kind: "group" })),
    };
  }
  const group = ns.groups.find((g) => g.id === path.group);
  if (!group) throw new Error(`unknown group: ${path.group}`);
  return {
    level: "group",
    id: group.id,
    children: group.tools.map((t) => ({
      id: t.id,
      name: t.name,
      kind: "tool",
      description: t.description,
    })),
  };
}

/**
 * @param {CatalogNamespace[]} tree
 * @param {string} toolId
 */
export function findTool(tree, toolId) {
  for (const ns of tree) {
    for (const g of ns.groups) {
      const hit = g.tools.find((t) => t.id === toolId || t.name === toolId);
      if (hit) return { namespace: ns.id, group: g.id, tool: hit };
    }
  }
  return null;
}

export function createCatalog(sections, tree = defaultCatalogTree()) {
  const filtered = filterCatalog(tree, sections);
  return {
    root: () => expandCatalog(filtered),
    expand: (path) => expandCatalog(filtered, path),
    find: (toolId) => findTool(filtered, toolId),
    tree: () => filtered,
  };
}
