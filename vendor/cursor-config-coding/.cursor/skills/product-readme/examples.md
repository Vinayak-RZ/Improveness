# Product README — patterns to copy

Do not paste these products' copy. Steal **structure and density**.

## Colibri (primary)

What to copy:

- Centered SVG + badges + short nav
- Tagline, then a positioning blockquote with an **invariant** (speed vs semantics)
- Terminal proof immediately
- Screenshots whose captions teach (metrics, what color means)
- "Core techniques" as named bets with honest limits
- "The idea" as one analogy a newcomer can hold (JIT for weights)
- Get started: program + model, then one command
- "Go deeper" table instead of inlining every guide
- Acknowledgements that say *how* related systems are used

What not to copy: length for its own sake. A small SDK should not be 600 lines.

## vLLM

What to copy:

- One-line tagline
- Named technique with a **real** blog/paper link (PagedAttention)
- Capability bullets that are still specific (quant dtypes, parallelism kinds)
- Getting started is one install command
- Citation block when there is a paper

## LangChain / LangGraph

What to copy:

- Logo + one-liner above the fold
- `uv add` / `pip install` within a few lines of the pitch
- "Why use X" as outcome bullets, not architecture
- Ecosystem links (sibling products)
- Docs / academy / contributing at the end — no API catalog in the README

## llama.cpp

What to copy:

- Cover/logo + badges
- Quick start with several install paths, then **one** interesting command
- Short "what it is" then a backends/docs index
- Acknowledgements of actual vendored/single-header deps

## Length heuristic

| If the product is… | Aim for… |
|--------------------|----------|
| `pip install` library | LangChain-short |
| Local engine people run on their machine | Colibri-long, still linking `docs/` |
| Both | Colibri order, LangChain install snippet near the top |
