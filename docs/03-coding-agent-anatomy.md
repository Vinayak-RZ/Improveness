# 3. Coding-agent anatomy

## Weng’s claim

The core interface of mainstream coding agents has stabilized across Claude Code, Codex, OpenCode, and Cursor-style agents. With a shared tool loop, the agent develops and debugs in a repository the way a human uses an IDE.

This table is the **seed harness**. Self-improvement is extra loops *around* it, not a rewrite of it.

| Group | Typical tools |
|-------|----------------|
| Filesystem | `glob`, `grep`, `ls`, `read`, `write`, `edit`, `apply_patch` |
| Shell | `bash` / PowerShell |
| IO | LSP, `git_status`, `git_diff`, `git_commit` |
| External | MCP, Skills |
| Web | `web_search`, `web_fetch`, browser |
| Artifacts | docs, images, HTML |
| Backend | cron create/list/delete |
| Delegation | spawn / resume / wait / list / close / interrupt agent |

## Cited systems

Weng lists the tool groups as a demonstration, not a complete inventory. OpenCode, Codex, Claude Code, and OMP all instantiate most of this surface.

## What works / fails

- **Works:** a small, stable tool vocabulary that models already know from pretraining (`bash`, `read`, exact-match or structured edit).
- **Fails:** inventing a large unique tool API the model has never seen; hiding permissions inside prompts instead of a kernel.

## Generic harness implication

Map Weng’s groups onto AHE’s seven **editable file components** (prompt, tool description, tool impl, middleware, skill, sub-agent, memory). The seed tools stay; the evolver may add or narrow *declared* files only. See [proposals/00-architecture.md](proposals/00-architecture.md).

## OMP implication (docs as of 2026-08-15)

OMP is a superset of the seed: hashline `edit`, `ast_edit`, in-process `grep`/`glob`/`bash`, 14 LSP ops, 28 DAP ops, `eval` kernels, `task`/`hub`, `browser`/`computer`, `retain`/`learn`, TTSR, advisor. AHE’s seven components already have file homes under `.omp/`. See [proposals/02-omp-gap-analysis.md](proposals/02-omp-gap-analysis.md).
