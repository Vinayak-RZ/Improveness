# ARC / Improveness — Agent Mode

**ARC** (Agent Runtime Composability) is the product direction for this repo:
an **improver** that attaches to any **domain kernel** (frozen verifier +
permissions + routes) and improves **harness surfaces** (tools, memory, plugins)
after a Self-Harness gate.

The installable artifact today is still **`dsh-improveness`** on DeepSeek Harness;
Oh My Pi is a parked HostPort adapter. Vocabulary: [docs/methods/domain-kernel.md](docs/methods/domain-kernel.md).

## Always on

Read `.cursor/skills/ponytail/SKILL.md` before any code edit. Plan mode: load
`nawab-plans` at **lite** unless the work is multi-package. Load
`graph-of-loops` or `graph-engineering` only when the user names them (XOR).

## Skills

| Need | Skill |
|------|--------|
| Plan | `nawab-plans` |
| Graph of loops | `graph-of-loops` |
| Execution graph | `graph-engineering` |
| Agents | `agentic-system-design` |
| Trade-offs | `system-design-tradeoffs` |
| Review | `ponytail-review`, `ponytail-audit` |

Authority copy for coding workflows: [vendor/cursor-config-coding/AGENTS.md](vendor/cursor-config-coding/AGENTS.md).

## Repo map

| Path | Role |
|------|------|
| `plugins/dsh-improveness/` | DSH bundle plugin (P0 host) |
| `harness/omp/` | Bun improver loop, checker, HostPort |
| `harness/omp/host-port/` | `DomainKernelPort`, registry, improver facade |
| `oh-my-pi/` | Parked OMP snapshot (P1) |
| `vendor/cursor-config-coding/` | Cursor skills/rules source → `.cursor/` |

## Git

Conventional commits after milestones. Live plan: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
Feature plan for domain-kernel generalization: [docs/plans/p5-arc-domain-kernel-improver.md](docs/plans/p5-arc-domain-kernel-improver.md).
