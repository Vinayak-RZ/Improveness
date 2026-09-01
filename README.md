<div align="center">
  <h1>
    <img src="assets/improveness-logo.svg" width="48" height="48" align="absmiddle" alt="">
    Improveness
  </h1>
  <p>
    <a href="https://github.com/Vinayak-RZ/Improveness/actions/workflows/overlay.yml"><img src="https://github.com/Vinayak-RZ/Improveness/actions/workflows/overlay.yml/badge.svg" alt="Overlay QA"></a>
    <a href="docs/EXTENSIVE.md"><img src="https://img.shields.io/badge/docs-extensive-1f6feb" alt="Extensive internals"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2ea043" alt="MIT license"></a>
  </p>
  <p>
    <a href="docs/EXTENSIVE.md"><b>Internals</b></a> ·
    <a href="docs/CLAIM_LEDGER.md"><b>Claim ledger</b></a> ·
    <a href="docs/00-index.md"><b>Paper map</b></a> ·
    <a href="LICENSE"><b>License</b></a>
  </p>
</div>

> Full internals (every package, file map, how the repo runs): [Extensive README](docs/EXTENSIVE.md)

**The interesting part of an agent is no longer the weights.** It is the *harness*: tools, memory, permissions, tests, and the loop that decides what to do next. Improveness is a plugin you add to [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/en/develop/framework/) so that harness can **rewrite its own non-kernel parts while it is still running**.

> **Improveness is an installable self-improving environment.** It is not a new model, not a public [Terminal-Bench](https://www.tbench.ai/) campaign, and not a second operating system stuffed inside the host.
> Primary interface: `dsh plugin --profile improveness add ./plugins/dsh-improveness`.
> Invariant: the **grader never writes itself**.

```text
$ bash harness/omp/scripts/qa.sh
== overlay validate.sh ==
== bun test harness/omp/tests ==
== CACD / repo QA ==
== agentic architecture simulations ==
qa.sh ok
```

That command is the product check: 24 test files, a frozen 12/8 fixture split, seven keyless architecture simulations, and a catalog that fails CI if a kernel sentence disappears.

## Why this exists

2026 is the year people stopped arguing about “will agents self-improve?” and started arguing about **where**. Weights are expensive and slow to change. The wrapper around the model — the *harness* — is cheap, inspectable, and, if you are careless, easy to cheat.

Lilian Weng’s survey, [Harness Engineering for Self-Improvement](https://lilianweng.github.io/posts/2026-07-04-harness/), is the map. This repo is one concrete answer: **put the improver in the host as a plugin**, freeze the physics that would let it lie, and prefer live unload over killing the process.

Oh My Pi already showed the stakes at the product grain: change the *edit format*, leave the model alone, and Grok Code Fast 1 jumped from 6.7% to 68.3% pass@1 with **zero** training compute ([“Only the Harness Changed.”](https://blog.can.ac/2026/02/12/the-harness-problem/)). Improveness is the next question: if the harness is the thing that matters, **who is allowed to change it, and how do you know the change is real?**

An agent that **grades its own homework** will always look brilliant. Most of the 2026 harness papers are that cheat in different clothes — and this repo is those papers turned into files you can `grep`:

- **Self-Harness** — hide tomorrow’s exam *names* from the improver (held-in vs held-out).
- **HSI** — freeze the judge; if the evolver can rewrite the checker, the score is fan fiction.
- **Evo-Bench** — a public leaderboard is a *report*, not a loss function. We refuse public [Terminal-Bench](https://www.tbench.ai/) as fitness.
- **AHE** — rewriting the slogan (system prompt) is not the same as adding a tool. Our `ace-only` sim is a **passing test of a zero**.
- **Cordis / spatiotemporal composability** — if every self-mod kills the process, you dump the session that would recover a bad edit. Unload must invert.

You do not need to install Improveness to steal the vocabulary. The rest of this page is the tour.

## Core techniques

These are the bets this codebase actually implements. Each one is a named idea from the current research wave, not a marketing feature list.

- **Two-Speed Harness Evolution.** A session can *define a tool now* (JIT, ephemeral, gone when the session ends). A change that survives practice *and* hidden tests becomes a durable sibling plugin (AOT) and hot-reloads. We copy the split from [JIT-Agent](https://arxiv.org/abs/2608.25593); we do **not** train their 27B controller. Limit: live-model skill gains are not a README number until measured here.
- **Live Ratchet.** Keep if better; unload if not. That is [Karpathy AutoResearch](https://github.com/karpathy/autoResearch) translated into Cordis: `prepare.py` is frozen physics, `train.py` is a sibling plugin, `git reset` is Fiber dispose. Limit: if a disposer is not invertible, we fail closed or ask for a restart — we do not pretend VS Code `deactivate` is unload.
- **Frozen Physics.** Checker, permissions, model routes, Cordis loader, Improveness QA, and this plugin’s own bundle are kernel. [HSI](https://arxiv.org/html/2608.08466) calls this the frozen outer anchor. Stable ids are **package namespaces and paths**, not Cordis Fiber instance ids (`fiber-9f3` is a runtime handle, not a law). Limit: a human still has to widen network or destructive permissions.
- **Harness Slots.** Four seats from HarnessFactory: `memory`, `planning`, `action`, `capability`. One occupant for the first three; capability is an ordered set. Two plugins claiming `memory` **fail before mount**. Limit: slots are a policy, not a type system inside DSH itself.
- **Filesystem Evidence Plane.** Every candidate is a directory you can `grep`: source, scores, traces, rollback. That is [Meta-Harness](https://arxiv.org/abs/2603.28052) shape — coding-agent proposer, history on disk — **without** running their Terminal-Bench-2 search as our fitness. Limit: playbook-class accepts still *stage*; only plugin-class accepts with load/dispose/policy checks write the generated dir.

## A field guide to ideas this repo is built on

If you only remember five words from this README, remember these. They are the vocabulary of harness engineering right now.

### Harness, not weights

**Recursive self-improvement**, in the Good / Yudkowsky sense, sounded like a model rewriting its own parameters. Near-term RSI is almost never that. It is the *agent stack* rewriting tools, memory, and the loop. The model is the engine; the harness is the car. We freeze the engine during a comparable trial so you can tell whether the *car* got better.

### Practice vs exam (Self-Harness)

If the improver can see tomorrow’s test, the score is fan fiction. [Self-Harness](https://arxiv.org/abs/2606.09498) splits work into **held-in** (practice: the evolver may see failing ids) and **held-out** (exam: names never reach the proposer). Accept only if practice rose and hidden did not drop. This repo’s split is 12 / 8 synthetic Harbor-shaped tasks. Two hidden “no secrets” tasks have **no** practice twin on purpose — a leak brake, not a bug.

This is the same idea as a train / validation / test split, applied to *agent scaffolding* instead of gradient steps.

### Playbooks, not slogans (ACE + AHE)

[ACE](https://arxiv.org/abs/2510.04618) stores lessons as an append-only playbook. [AHE](https://arxiv.org/abs/2604.25850) showed that evolving the *system prompt* missed the gain (−2.3 pp on their ablation) while tools and memory moved the needle. Our `ace-only` simulation is a **passing test of a zero score**: slogans without recipe families unlock 0/20. That is the lesson, encoded as CI.

### Spatiotemporal composability (why “restart the agent” is the wrong grain)

[Shi, Zhang, Cui et al.](https://github.com/cordiverse/paper) name the bottleneck: if every self-mod **kills the process**, you dump caches, TCP sessions, and the very context that would recover a bad edit. **Temporal** composability: every effect has an inverse; unload runs inverses in reverse order. **Spatial** composability: plugins declare what they need; when a service vanishes, dependents unload too. DeepSeek Harness already has this (Cordis Fibers, `ctx.effect`). Improveness is the improver *as one of those plugins*.

### HostPort, not a second OS (HELIX)

[HELIX](https://arxiv.org/abs/2608.13951) is useful here for one sentence: wrap a host with a **thin adapter**, do not reinvent process supervision, permissions, and model routing. `exportTrace`, `frozenIds`, `slots`, `mountEphemeral`, `applyDurable`, `hotReload`. P0 is DSH. P1 is Oh My Pi (parked `oh-my-pi/`, `needsRestart` because OMP still cannot unload extensions invertibly).

### Node talks to Bun with JSONL

DeepSeek plugins load under **Node**. This repo’s checker and search run under **Bun**. They are two processes on purpose. A JSONL RPC (`ping`, `decideAccept`, `applyDurable`, …) is the boring bridge. That is an engineering choice, not a paper: hop latency now, a shared `improveness-core` package later if a third host appears.

### Pareto of harnesses, not a single champion

Meta-Harness keeps a **frontier** (quality vs cost), not one blob. P1 `host-port/pareto.ts` does the same on the archive. [Evo-Harness](https://arxiv.org/abs/2608.15071) then *compiles* a working procedure into a skill. [Evo-Bench](https://arxiv.org/html/2608.09096) is the methodology reminder: held-out must be harness-sensitive — which is why we still refuse public Terminal-Bench as *fitness*, even though we cite it as a *report* others run.

## How it works

```text
session log → traces
       → debugger (read-only, small model)
       → evolver (allowlisted files, mid/small model)
       → frozen checker (held-in + held-out)
       → decideAccept
            ├─ reject: unload / log
            ├─ JIT: mountEphemeral(sessionId, package, slot)
            └─ AOT: immutable candidate → load/dispose/policy
                    → atomic replace in profile-owned generated dir
                    → HMR (drain in-flight or fail-closed)
```

Durable siblings never land in `node_modules` or inside `plugins/dsh-improveness/`. Uninstalling Improveness does not delete accepted siblings. Permission-widening still stops for a human.

The loop you can run **without an API key** is the playbook solver plus `qa.sh`. The DSH plugin is the live host. Both share `decideAccept`.

## What it achieves (honest)

From [docs/CLAIM_LEDGER.md](docs/CLAIM_LEDGER.md) — only numbers this tree can reproduce:

| What | Number | What it is *not* |
|------|--------|------------------|
| Fixtures | 12 practice + 8 hidden | Not Terminal-Bench |
| Playbook search sim | **0/12 → 7/12**, **0/8 → 3/8** | Not a live coding agent |
| Architecture sims | 7, no API key | Not a model bake-off |
| Step cap | `MAX_STEP_CAP = 8` | Not “unbounded RSI” |

Forbidden on this landing page: “first”, “SOTA”, live-model TB/SWE-bench gains, fake stars.

## Get started

You need **Bun** (overlay QA; CI pins 1.3.14) and, for a live host, **DeepSeek Harness**.

### 1. Add the plugin

```text
dsh plugin --profile improveness add ./plugins/dsh-improveness
```

Profile `improveness` = `dsh-base` + `dsh-web-app` + `dsh-improveness`.

### 2. Prove the gate

```text
bash harness/omp/scripts/qa.sh
```

Generated plugins in checkout tests: `harness/omp/generated/<id>/`. Live: `$DSH_HOME/profiles/improveness/improveness-generated/<id>/`.

## Repo layout

| Path | What it is |
|------|------------|
| `plugins/dsh-improveness/` | The installable `dsh.bundle` |
| `harness/omp/` | Frozen checker, search, HostPort, QA |
| `oh-my-pi/` | Parked P1 snapshot (own license) |
| `docs/methods/` | One page per cited system |
| `docs/EXTENSIVE.md` | Package-by-package map |

## Go deeper

| If you want… | Read |
|--------------|------|
| Why a claim is allowed | [Claim ledger](docs/CLAIM_LEDGER.md) |
| Kernel vs surfaces | [KERNEL.md](harness/omp/KERNEL.md), [SURFACES.md](harness/omp/SURFACES.md) |
| Weng survey, taught | [docs/00-index.md](docs/00-index.md) |
| HostPort / two-speed / JSONL | [methods/](docs/methods/README.md) |
| Every file that matters | [Extensive README](docs/EXTENSIVE.md) |
| Execution contract | [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) |

## Acknowledgements

Systems this repo **uses or cites**, not a vanity wall:

- [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/en/develop/framework/) — Fiber load/unload, Creator-mode, HMR
- [Cordis](https://github.com/cordiverse) — spatiotemporal composability
- [Weng, Harness Engineering](https://lilianweng.github.io/posts/2026-07-04-harness/) — the survey the `docs/` corpus teaches
- [Self-Harness](https://arxiv.org/abs/2606.09498) — held-in / held-out accept
- [ACE](https://arxiv.org/abs/2510.04618) / [AHE](https://arxiv.org/abs/2604.25850) — playbook vs prompt-only
- [Meta-Harness](https://arxiv.org/abs/2603.28052) — filesystem candidates
- [JIT-Agent](https://arxiv.org/abs/2608.25593), [HELIX](https://arxiv.org/abs/2608.13951), [HSI](https://arxiv.org/html/2608.08466), [Evo-Harness](https://arxiv.org/abs/2608.15071), [Evo-Bench](https://arxiv.org/html/2608.09096)
- [Karpathy AutoResearch](https://github.com/karpathy/autoResearch) — frozen prepare vs sibling train
- [Oh My Pi](https://github.com/can1357/oh-my-pi) — parked adapter; that tree keeps its own license

## License

[MIT](LICENSE) for Improveness. Vendored `oh-my-pi/` is **not** re-licensed by the root MIT file.
