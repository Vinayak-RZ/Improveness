# Domain kernels, harness improvement, and where ARC fits

Research window: **2024–2026**, with emphasis on harness-level (not weight-level)
self-improvement. GPU “kernel” papers are included only where they illustrate
**specialized domain loops** improvers can wrap — not as the primary definition of
“domain kernel” in this repo.

## How papers define the problem

| Theme | Representative work | What evolves | Frozen anchor |
|-------|---------------------|--------------|---------------|
| Recursive agent code | [Gödel Agent](https://arxiv.org/abs/2410.04444) (2024) | Runtime logic via self-edit | Implicit env feedback |
| Textual optimizers | [STOP](https://arxiv.org/abs/2310.02304) (2024) | Optimizer program | Task loss on held tasks |
| Symbolic harness learning | [Agent Symbolic Learning](https://arxiv.org/abs/2406.18532) (2024) | Prompts, tools, pipeline | Language “gradients” |
| Open-ended coding agents | [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) (2025) | Agent repository | Archive + benchmarks |
| Self-evolving survey | [Gao et al.](https://arxiv.org/abs/2507.21046) (2025) | Models, memory, tools, architecture | Taxonomy + eval hooks |
| Harness self-improvement | [Self-Harness](https://arxiv.org/abs/2606.09498) (2026) | Harness proposals | Held-out task names |
| Meta search on disk | [Meta-Harness](https://arxiv.org/abs/2603.28052) (2026) | Filesystem candidates | External campaign / grader |
| Observability-driven coding harnesses | [Lin et al.](https://arxiv.org/abs/2604.25850) (2026) | Harness from traces | Bench sensitivity |
| Joint harness + weights | [SIA](https://arxiv.org/abs/2605.27276) (2026) | Both | Staged updates |
| Survey map | [Weng — Harness Engineering](https://lilianweng.github.io/posts/2026-07-04-harness/) (2026) | Organizes RSI at harness layer | — |

**Domain kernel** in ARC means: the **non-negotiable** parts of a domain-specific
agent stack (verifier, permissions, routes, loader) — analogous to AutoResearch’s
frozen `prepare.py` or Self-Harness’s hidden exam ids. **Harness surfaces** are
the mutable wrapper (tools, memory, procedures, plugins).

## Specialized “kernel” domains (GPU / systems)

These are different objects (CUDA kernels) but the **improver shape** is the same:
frozen correctness checker + mutable implementation + profile-guided search.

| Work | Year | Loop |
|------|------|------|
| [KernelBench](https://arxiv.org/abs/2502.10517) | 2025 | Generate → compile → benchmark |
| [KernelBlaster](https://people.eecs.berkeley.edu/~chrisdong/KernelBlaster.pdf) | 2025 | Memory-augmented in-context RL on optimization history |
| KernelAgent (PyTorch blog, 2025) | 2025 | Multi-agent orchestration + hardware profiling |

An ARC-style improver adds: **held-out task splits**, **filesystem evidence**,
**unload without process kill**, and **explicit frozen ids** so the proposer cannot
rewrite the grader.

## Where an improver layer adds value

1. **Separates practice from exam** — Self-Harness held-in / held-out; stops
   label leakage into the proposer.
2. **Hosts composability** — JIT session plugins vs durable siblings (two-speed);
   spatial/temporal unload ([spatiotemporal composability](../methods/spatiotemporal-composability.md)).
3. **Host-agnostic port** — `DomainKernelPort` so the same Bun loop attaches to DSH,
   OMP snapshots, or a stub/custom JSONL agent without forking the checker.
4. **Evidence plane** — Traces, archives, Pareto fronts (Meta-Harness shape) for
   audit and rollback.
5. **Model×tool fit** — ModelTaste validate-then-repair without weight changes.

## ARC / Improveness mapping

| Research idea | This repo |
|---------------|-----------|
| Self-Harness gate | `decideAccept`, `harness/omp/evals/` |
| Meta-Harness candidates | `archive/`, generated plugins, staging |
| HELIX thin host | `DomainKernelPort` / HostPort |
| DGM / open-ended edit | Search + plugin-class apply (gated) |
| Procedural order | D20 procedural graph (playbook-class) |

Catalog and sims: `harness/omp/cacd/`, `simulate-architectures.ts`.

## Further reading in-repo

- [docs/references.md](../references.md)
- [docs/methods/domain-kernel.md](../methods/domain-kernel.md)
- [Awesome Harness Self-Improvement](https://github.com/leezythu/Awesome-Harness-Self-Improvement) (curated list)
