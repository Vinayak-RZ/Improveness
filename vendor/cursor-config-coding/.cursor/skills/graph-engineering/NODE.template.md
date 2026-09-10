# Node plan — `<id>` — `<short name>`

> Collapsed feature-mode plan for **one graph node**. Not a second 18-section
> nawab. Parent: [EXECUTION_GRAPH.md](../../EXECUTION_GRAPH.md) (adjust relative path).

| Field | Value |
|-------|-------|
| **Node id** | `N1` |
| **Job** | One sentence |
| **Wave** | 0 / 1 / … |
| **Depends on (data)** | `none` or node ids + artifact names |
| **Write paths** | globs this node may change |
| **Read paths** | globs |
| **subagent_type** | explore / generalPurpose / lead |
| **Model** | cheap (`composer-2.5-fast`) / inherit |
| **Isolation** | path-ownership |

---

## Objective

[What exists when this node is done — one paragraph max.]

## Non-goals

- [Out of scope for **this** node, even if the parent project needs it later]

---

## Contract

**Input** (passed explicitly by the lead — do not assume a shared window):

```json
{ }
```

**Output** (return this shape; `additionalProperties: false` in spirit):

```json
{ }
```

---

## Commits (this node only)

Slice of parent §9. Lead commits these rows after the node returns.

| # | Commit | Contents | Gate |
|---|--------|----------|------|
| | `feat(…): …` | … | `[repo command]` |

---

## Do not

- Commit, push, or open a PR
- Write outside **Write paths**
- Expand into another graph unless the user named `graph-engineering` for this slice
- Load sibling node plans (the lead passes what you need)

---

## Return to graph

When done, return: files touched, tests run, output JSON matching the contract, failures (null if you could not finish).
