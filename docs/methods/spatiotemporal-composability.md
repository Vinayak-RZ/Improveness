# Spatiotemporal composability (Cordis)

**Paper:** Shi, Zhang, Cui, et al. “A Programming Paradigm for Spatiotemporal Composability.” Draft of 13 August 2026. [github.com/cordiverse/paper](https://github.com/cordiverse/paper) ([PDF](https://github.com/cordiverse/paper/blob/main/paper.pdf))  
**Runtime:** [Cordis](https://github.com/cordiverse) (Koishi lineage). Used by [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/en/develop/framework/) as “everything is a plugin.”  
**Parent:** [../06-self-improving-harness.md](../06-self-improving-harness.md) · product: [../proposals/06-snapshot-apply.md](../proposals/06-snapshot-apply.md)

## What it optimizes

Dynamic composition: load, unload, and reconfigure components **while the process keeps running**, without discarding process-local state.

Static composition (imports, inheritance) is well studied. Plugin hosts and self-evolving agent harnesses need the dynamic case. Today most systems fake it at OS/container granularity: restart the process, or orchestrate a service. That is the wrong grain for an agent that wants to change its own tools, skills, orchestration, or core loop mid-session.

## Two dimensions

| Dimension | Static analogue | Dynamic requirement |
|-----------|-----------------|---------------------|
| **Temporal** | RAII / lexical `try/finally` | When a component is removed, every resource, listener, and mutation it made is reversed. Scope is not lexical: effects live for hours. |
| **Spatial** | Module import graph | Components declare, discover, and resolve dependencies on each other. Dependencies appear, disappear, or change identity at runtime. |

The paper lifts **effects** (what you do to the world) and **coeffects** (what you require from the world) to runtime:

- **Revertible effects** — every context transform carries an inverse the runtime tracks. Unload = run inverses in reverse registration order.
- **Reactive coeffects** — a change in the context is checked against each component’s declared needs. If a required service vanishes, dependents unload; when it returns, they load again.

A **component** unifies both. The metatheory claims spatiotemporal composability lifts from one component to a system of interleaved components.

## Why self-evolving harnesses care

A future harness generates and deploys modifications to its own parts while still serving requests. Each modification is dynamic composition.

Without temporal composability, every self-mod **kills the runtime**. Caches, connections, in-flight tasks, and session memory die. At high frequency that unavailability is the product. Worse: a bad self-mod can disable the process that would recover it.

Without spatial composability, each module must notice that its neighbors changed by ad hoc means. Naive file replacement silently breaks dependents or introduces cycles that only appear at reload.

The coarse workaround (process restart, container orchestration) operates at process/container boundaries. Agent harnesses compose *inside* one address space: tools, model adapters, session logs, sandboxes, the agent loop, the UI. That is the DeepSeek Harness stance: **everything is a plugin**.

## Cordis / DeepSeek Harness (what to copy)

Fiber states: `PENDING → LOADING → ACTIVE` (or `FAILED`); `ACTIVE → UNLOADING → DISPOSED`.

- `inject = ['tools', 'llm']` — do not `apply` until those services exist.
- If a required service disappears (provider swap), the plugin unloads (`ACTIVE → DISPOSED`) and reloads when the service returns.
- `ctx.on`, `ctx.tools.register`, `ctx.llm.registerAdapter`, `ctx.effect(() => disposer)` are all reversed on unload.
- Nested `ctx.plugin(child)` inherits context but has its own Fiber; parent dispose unloads children.
- HMR: unload old plugin (run disposers) → load new code → `apply` again. No leftover registrations.

## OMP today (the gap)

Oh My Pi extensions are factories that `registerTool` / `on` / `registerCommand` at load ([`oh-my-pi/docs/extensions.md`](../../oh-my-pi/docs/extensions.md)). There is an activate path. There is **no** first-class per-extension unload that guarantees every registration is reversed. That matches the paper’s VS Code diagnosis: `deactivate` is a shutdown callback, not live removal, and it splits effect creation from disposal.

Improveness consequence (D14): mutating the working snapshot is the product, but a **full process restart** after every accepted edit is the bottleneck the paper names. Prefer plugin-shaped, revertible edits for tools / skills / orchestration / loop pieces. Restart remains the fallback when an edit is not revertible (native bindings, frozen kernel files).

## Spec notes for Improveness

- Do **not** vendor a full DeepSeek Harness tree. Ship `plugins/dsh-improveness` as a `dsh.bundle` (D15).
- Apply target is **profile-owned generated plugins** (P0) or a P1 **working snapshot**, never upstream `can1357/oh-my-pi`.
- Frozen kernel (checker, `system-prompt.md`, `approval.ts`, Cordis loader, Improveness QA, the Improveness bundle itself) is not a plugin the evolver may unload.
- Stable ids are package namespaces / routes / owned paths, not Fiber instance ids.
- Permission-widening stays a human checkpoint even if the rest of the loop hot-swaps.
- `apply-snapshot` prefers: (1) generated sibling plugins with disposers, (2) HMR, (3) restart only when (1)+(2) cannot restore a consistent Fiber.

## Failure modes

- Claiming “plugin” without invertibility (VS Code `deactivate`).
- Spatial graph that is untyped `any` exports (VS Code `extensions.getExtension(...).exports`).
- Unload that races in-flight tool calls; need a drain or a session fence.
- Treating container restart as temporal composability. It is not, at component grain.
