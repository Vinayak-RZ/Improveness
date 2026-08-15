# 2. Design patterns

## Weng’s claim

Compared with early “LLM + memory + tools + planning” frameworks, harness engineering also includes workflow design (loop engineering), evaluation, permission controls, and persistent state. It is closer to **runtime and OS design** than to prompt templates: encapsulate complexity, keep the interface simple, let configs and tool protocols standardize.

Three recurring patterns:

1. **Workflow automation** — a goal-oriented loop: plan → execute → observe/test → improve. Karpathy’s [autoresearch](https://github.com/karpathy/autoresearch) is a clean example. Codex’s agent loop: tool calls change the next generation. The graph should include the model analyzing its own trajectories, not only a static prompt.
2. **Filesystem as persistent memory** — do not carry the whole workflow and all logs in context. Experiment logs, diffs, traces, and summaries live as files. Models are already trained to `bash` / `read` / `edit`.
3. **Sub-agents and backend jobs** — spawn workers, monitor jobs, merge results. Parallelism must be **explicit and inspectable**. If subagent output lives only in transient chat, it dies. If it is files + status records, the parent can recover after interrupts.

## Cited systems

| Source | Role |
|--------|------|
| Karpathy autoresearch | Minimal plan/execute/observe loop |
| OpenAI Codex agent loop | Tool responses condition the next generation |

## What works / fails

- **Works:** durable files beat stuffing rollouts into the context window; inspectable job status beats hidden parallelism.
- **Fails:** keeping “memory” only as a growing chat; subagents that return untyped prose the parent cannot merge.

## Generic harness implication

A self-improving overlay must **keep** these three patterns. The evolver writes files; the debugger reads files; workers yield typed or file-backed results. See [proposals/01-generic-harness.md](proposals/01-generic-harness.md).

## OMP implication

OMP already has filesystem-shaped tools (`read`/`edit`/`grep`), typed `task` subagent yields, isolated worktrees, and memory tools (`retain`/`recall`/`learn`). Do not re-propose those primitives. Propose making traces and harness edits equally file-first and inspectable.
