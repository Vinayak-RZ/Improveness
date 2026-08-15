# Improveness

Research and change-proposal corpus for self-improving coding harnesses, based on [Lilian Weng, “Harness Engineering for Self-Improvement”](https://lilianweng.github.io/posts/2026-07-04-harness/).

The in-tree [OMP (Oh My Pi)](https://omp.sh/) source lives at [`oh-my-pi/`](oh-my-pi/) (cloned from [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi), nested `.git` removed). Self-improvement code lives in [`harness/omp/`](harness/omp/SURFACES.md) (overlay, drivers, evals). Do not treat this as a live fork with remotes; we do not push to `can1357/oh-my-pi`.

## Start here

| Doc | Role |
|-----|------|
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Purpose and constraints |
| [docs/00-index.md](docs/00-index.md) | Reading order |
| [docs/proposals/00-architecture.md](docs/proposals/00-architecture.md) | Target loop |
| [docs/proposals/01-generic-harness.md](docs/proposals/01-generic-harness.md) | Any harness |
| [harness/omp/SURFACES.md](harness/omp/SURFACES.md) | Editable vs frozen paths |
| [harness/omp/KERNEL.md](harness/omp/KERNEL.md) | Evolver-forbidden kernel |
| [harness/omp/evals/tb-adapter/README.md](harness/omp/evals/tb-adapter/README.md) | Harbor-shaped tasks (not public TB2) |
| [harness/omp/archive/README.md](harness/omp/archive/README.md) | DGM-lite overlay snapshots |
| [docs/proposals/03-omp-proposed-changes.md](docs/proposals/03-omp-proposed-changes.md) | OMP change list (P1–P7) |
| [docs/proposals/04-safety.md](docs/proposals/04-safety.md) | Evaluator outside the loop |
| [docs/references.md](docs/references.md) | Papers and product docs |

Authority: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) · [PROGRESS.md](PROGRESS.md) · [DECISIONS.md](DECISIONS.md) · [LEARNING.md](LEARNING.md)

P2 draft (not approved): [docs/plans/p2-omp-overlay.md](docs/plans/p2-omp-overlay.md)

## Vendored Cursor config

The full [Vinayak-RZ/cursor-config-coding](https://github.com/Vinayak-RZ/cursor-config-coding) tree lives at [`vendor/cursor-config-coding/`](vendor/cursor-config-coding/). Project [`.cursor/skills`](.cursor/skills/) and [`.cursor/rules`](.cursor/rules/) are installed from that clone so later agents can load `nawab-plans` locally.
