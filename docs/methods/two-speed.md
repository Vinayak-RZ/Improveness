# Two-speed self-mod

JIT-Agent ([arXiv:2608.25593](https://arxiv.org/abs/2608.25593)) split, without training a 27B controller.

| Speed | When | What |
|-------|------|------|
| **JIT** | This session needs a tool/skill now | Ephemeral plugin, session-owned, unmounted on stop/dispose |
| **AOT** | Held-in/held-out accept | Durable generated plugin + patch + HMR |

Improveness does **not** train JIT-Agent weights. The “controller” is HostPort + frozen checker.

Creator-mode analogues on DSH: inspect / define / run / stop. Kernel Fibers cannot be defined away.

## Sections (D16)

Two independently disableable product sections sit on top of this split:

| Section | Maps to |
|---------|---------|
| **JIT** | Ephemeral synthesize / define / run / stop |
| **Improvement** | Short-term post-trajectory candidates + long-term archive cadence → still AOT via `decideAccept` |

See [sections.md](sections.md).
