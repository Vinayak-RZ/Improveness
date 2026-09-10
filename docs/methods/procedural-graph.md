# Procedural Graph (ingrained)

**Paper:** Lu, Chen, Wu, Arık. [arXiv:2609.09153](https://arxiv.org/abs/2609.09153)  
**Parent:** Improveness playbook + planning + improve loop (not a D16 section)

## What it optimizes

**Order and conditions** for the next procedure: typed `(procedure, relation, procedure)` edges with condition / guidance / pitfalls. Not weights. Not a second evolution engine.

## What Improveness copies

- Sibling `PROCEDURE_GRAPH.json` next to ACE `PLAYBOOK.md`
- Localize active node + 2-hop render into `plan_step` inject (soft bias)
- Offline Add/Delete/Update via `improveShort` / `proposeNextRecipe`
- Same `decideAccept` gate (stricter than the paper’s val-score ≥ previous)

## What we do not copy

- Guidance LLM on every step (P0 is deterministic render)
- Matching last Cordis tool name (`bash`) as a node
- A fourth section flag (`IMPROVENESS_PG`)
- Paper benches (BFCL, EnterpriseArena, ALFWorld)

## Spec notes

- Empty graph = today’s behavior
- `IMPROVENESS_EVENT_INJECT=0` suppresses procedure inject
- Frozen 12/8 playbook scores stay; order is scored in `evals/procedure/`
