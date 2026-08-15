# Improveness

Research and change-proposal corpus for self-improving coding harnesses, based on [Lilian Weng, “Harness Engineering for Self-Improvement”](https://lilianweng.github.io/posts/2026-07-04-harness/).

This repo does **not** modify [OMP (Oh My Pi)](https://omp.sh/) or implement a harness overlay. It specifies what a generic harness and OMP would need.

## Vendored Cursor config

The full [Vinayak-RZ/cursor-config-coding](https://github.com/Vinayak-RZ/cursor-config-coding) tree lives at [`vendor/cursor-config-coding/`](vendor/cursor-config-coding/). Project [`.cursor/skills`](.cursor/skills/) and [`.cursor/rules`](.cursor/rules/) are installed from that clone so later agents can load `nawab-plans` locally.
