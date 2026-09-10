---
name: graphify
description: >-
  Turn a folder into a knowledge graph (HTML, JSON, GRAPH_REPORT.md).
  Use only when the user says /graphify or explicitly asks to graphify a
  corpus. Not graph-engineering (execution graphs / nawab §19).
disable-model-invocation: true
---

# /graphify

Knowledge graph of a folder: communities, HTML viz, GraphRAG JSON, `GRAPH_REPORT.md`.

**Not** `graph-engineering` (nawab §19 execution graphs). **Not** a substitute for a nawab plan.

## When invoked

1. Path defaults to `.` — do not ask.
2. Read and **execute** [references/cli.md](references/cli.md) (Windows/PowerShell pipeline).
3. Outputs land under `graphify-out/` (`graph.json`, HTML, `GRAPH_REPORT.md`).

## Install (if needed)

```powershell
python -c "import graphify"
if ($LASTEXITCODE -ne 0) { pip install graphifyy -q }
```

## Common flags

See [references/cli.md](references/cli.md) for the full list.

- `--mode deep` — richer inferred edges
- `--update` — incremental
- `query "<question>"` — traverse the saved graph

## Must not

- Auto-run because the user said “graph this plan” (that is graph-engineering)
- Invent edges without EXTRACTED / INFERRED / AMBIGUOUS tags
