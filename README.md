# Improveness — teach a coding agent new habits, without rewriting the model

> **What it is:** Extra files and scripts that sit on top of [Oh My Pi](https://github.com/can1357/oh-my-pi) (a coding agent). They let the *instructions and tools around the model* get better over time, while a human still has to approve anything that goes into the real project.
> **What it is not:** A new AI model. A bot that silently edits the official project. A copy of Oh My Pi that we push back upstream. A public leaderboard run.
> **How you use it:** Scripts you run with [Bun](https://bun.sh). The one command that checks the whole repo is `bash harness/omp/scripts/qa.sh`.

You do not need an API key to clone this repo and run the checks. There is no website and no Docker image. Everything lives on disk.

---

**In one sitting**

- A **coding agent** is a program that uses a language model to edit a codebase. The model is the brain. The **harness** is everything around it: instructions, tools, memory, and tests.
- This project does **not** retrain the brain. It improves the harness — a playbook of lessons, extra tools, extra skills — and leaves the main system prompt alone.
- We score that playbook on **20 tiny coding tasks**. Twelve are the practice set (the improver may look at them). Eight are the hidden set (the improver must not see their names). That split is how we catch “it only works on the homework.”
- A recorded run taught five lessons and the score went from **0/12 and 0/8** to **7/12 and 3/8**. The hidden-set gains are tasks that *look like* the practice ones, not copies of them.
- Suggested changes land in a **waiting room** (`staging/`), a **history folder** (`archive/`), and a **human review list** (`REVIEW_QUEUE.md`). A person copies them into the official extra files. The scripts never do that themselves.
- We also replay **seven different ways of wiring the system** — some safe, some deliberately broken — without calling a live model. Slogans-only stays at 0/20. The gated loop improves. Cheating setups are rejected.
- The locked files (the score scripts, the permission list, Oh My Pi’s own source) are written down in [`harness/omp/KERNEL.md`](harness/omp/KERNEL.md). The files the improver *may* touch are in [`harness/omp/SURFACES.md`](harness/omp/SURFACES.md).
- [`oh-my-pi/`](oh-my-pi/) is a snapshot of Oh My Pi inside this repo (its own `.git` was removed). We do not push to the upstream project.
- The research this follows is [Lilian Weng, “Harness Engineering for Self-Improvement” (July 2026)](https://lilianweng.github.io/posts/2026-07-04-harness/). One paper she cites found that rewriting only the system prompt made a public coding benchmark **worse by 2.3 points**. That is why we freeze that file.

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Ideas from papers, files in this repo](#2-ideas-from-papers-files-in-this-repo)
3. [How it works](#3-how-it-works)
4. [The four-layer checklist](#4-the-four-layer-checklist)
5. [Comparing setups without a live model](#5-comparing-setups-without-a-live-model)
6. [Quickstart](#6-quickstart)
7. [Configuration](#7-configuration)
8. [What’s in the repo](#8-whats-in-the-repo)
9. [Scripts you can run](#9-scripts-you-can-run)
10. [What we store on disk](#10-what-we-store-on-disk)
11. [The 20 coding tasks](#11-the-20-coding-tasks)
12. [How we test](#12-how-we-test)
13. [What the improver is not allowed to touch](#13-what-the-improver-is-not-allowed-to-touch)
14. [Where this runs](#14-where-this-runs)
15. [Common commands](#15-common-commands)
16. [Recorded scores](#16-recorded-scores)
17. [How to add something](#17-how-to-add-something)
18. [What’s done and what’s next](#18-whats-done-and-whats-next)
19. [Questions and a word list](#19-questions-and-a-word-list)
20. [Full command list](#20-full-command-list)

## 1. What this project is

### 1.1 The problem in plain words

You already have a strong coding agent (here: Oh My Pi). After a week of real work, people want it to *remember* what worked: “prefer named exports,” “put secrets in the environment,” “ignore `dist/`.”

The tempting fixes are bad:

- **Retrain the model.** Expensive, and not what this repo does.
- **Rewrite the system prompt over and over.** A published experiment (AHE — see §2) found that made a public coding benchmark worse.
- **Let the agent edit its own official files.** Then it can “improve” by deleting the tests that catch it.

Improveness is the boring alternative: keep a **playbook** of lessons, score it with **scripts that never change**, and make a **human** install anything that looks good.

### 1.2 Four parts in one repo

1. **Notes and papers** — [`docs/`](docs/00-index.md) walks through Weng’s article and the systems she cites.
2. **A checklist we actually open** — [`harness/omp/CACD.md`](harness/omp/CACD.md). The name is just “Contract, Architecture, Control, Delivery.” Think: rules, design, safety, how a change ships.
3. **A simulator** — seven named setups, replayed with no API key, in [`harness/omp/drivers/simulate-architectures.ts`](harness/omp/drivers/simulate-architectures.ts).
4. **The extra files on Oh My Pi** — playbook, agents, and scripts under [`harness/omp/`](harness/omp/SURFACES.md).

### 1.3 What this is not

- Not a live fork of [oh-my-pi](https://github.com/can1357/oh-my-pi). We copied the tree in and removed the nested git remote.
- Not a project that updates model weights (Darwin-Gödel Machine, AlphaEvolve, and similar stay on the shelf).
- Not “just write nicer slogans in a playbook.” The `ace-only` replay exists to *prove* slogans do not move the score.
- Not a closed loop that overwrites the official extra files or `oh-my-pi/packages/`.
- Not a run of the public [Terminal-Bench 2](https://www.tbench.ai/) or SWE-bench leaderboards. We refuse to grade the improver on a public set it could memorize.

### 1.4 Who should read this

People who build coding-agent platforms and want to **compare designs before they spend money on tokens**. Maintainers who treat a suggested change as evidence, not as something that installs itself ([oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907)). Anyone who has never read the papers — start here, then open the files we link.

### 1.5 How we know it is working

`bash harness/omp/scripts/qa.sh` exits 0. All seven setup replays pass. A reviewer can answer “what may the improver edit?” from [`KERNEL.md`](harness/omp/KERNEL.md) and [`SURFACES.md`](harness/omp/SURFACES.md) without reading the paper.

## 2. Ideas from papers, files in this repo

You do not need the papers to use the repo. This table is only so the short names in the code make sense.

| Short name you will see | Plain meaning | File here |
|-------------------------|---------------|-----------|
| Weng 2026 | Survey: improve the harness, not the model weights | [`docs/00-index.md`](docs/00-index.md) |
| ACE | A playbook of lessons that a script can add to, without collapsing into mush | [`overlay/.omp/playbook/`](harness/omp/overlay/.omp/playbook/) |
| AHE | Improve tools, memory, and middleware — not the system prompt | [`SURFACES.md`](harness/omp/SURFACES.md) |
| Self-Harness | Accept a change only if practice tasks get better *and* hidden tasks do not get worse | [`self-harness.ts`](harness/omp/drivers/self-harness.ts) |
| Debugger agent | A read-only helper that writes a diagnosis file | [`agents/debugger.md`](harness/omp/overlay/.omp/agents/debugger.md) |
| Evolver / improver | The role that may write extra files, never locked files | [`evolver.md`](harness/omp/overlay/.omp/agents/evolver.md) |
| Archive | Snapshots of accepted playbooks, with a parent and a score | [`archive.ts`](harness/omp/drivers/archive.ts) |
| Four-layer checklist (CACD) | Rules, design, safety, shipping — opened by QA every run | [`CACD.md`](harness/omp/CACD.md) |
| Setup replay | Run a named (sometimes unsafe) wiring and assert what must happen | [`simulate-architectures.ts`](harness/omp/drivers/simulate-architectures.ts) |

Two results we take as given:

- Spend the expensive model on the agent that **does the user’s coding task**. The improver can be a cheaper model (Lin et al., 2026; we recorded this as decision D6 in [`DECISIONS.md`](DECISIONS.md)).
- Rewriting only the system prompt **hurt** a public coding benchmark by 2.3 points. So `system-prompt.md` is locked.

## 3. How it works

### 3.1 The loop

```mermaid
flowchart TD
  playbook[Playbook of lessons] --> solver[Score as if the agent followed the lessons]
  solver --> checker[Pass or fail scripts]
  practice[12 practice tasks] --> checker
  hidden[8 hidden tasks] --> checker
  checker --> improver[Improver sees only practice failures]
  improver --> decide[Keep or drop the lesson]
  decide -->|keep| waiting[Waiting room]
  waiting --> history[History folder]
  waiting --> queue[Human review list]
  person[A person] --> queue
  person -->|install| official[Official extra files]
```

### 3.2 One improvement step

```mermaid
sequenceDiagram
  participant Search as Search script
  participant History as History folder
  participant Lessons as Next lesson
  participant Score as Score both sets
  participant Queue as Review list
  Search->>History: pick a past playbook
  Search->>Score: score practice and hidden
  Search->>Lessons: only from failing practice tasks
  Lessons-->>Search: a playbook edit, or stop
  Search->>Score: score again
  alt the practice score went up and hidden did not drop
    Search->>Queue: add a row, do not install
  else no real gain
    Search->>Search: write a reject log
  end
```

### 3.3 Safety checks, in order

```mermaid
flowchart TD
  write[A suggested file write] --> locked{Is this a locked path?}
  locked -->|yes| deny[Refuse]
  locked -->|no| allow{Is this an allowed extra file?}
  allow -->|no| deny
  allow -->|yes| peek{Does it name a hidden task?}
  peek -->|yes| deny
  peek -->|no| cap{Fewer than 9 steps?}
  cap -->|no| deny
  cap -->|yes| gate{Practice up, hidden not down?}
  gate -->|no| reject[Log and drop]
  gate -->|yes| stage[Waiting room plus history plus review list]
  stage --> human{Person installs it?}
  human -->|no| stay[Official files unchanged]
  human -->|yes| official[Official extra files]
```

### 3.4 The important folders

| Path | What it is |
|------|------------|
| [`harness/omp/CACD.md`](harness/omp/CACD.md) | The four-layer checklist in prose |
| [`harness/omp/cacd/catalog.ts`](harness/omp/cacd/catalog.ts) | The same checklist as 12 machine-checked rows |
| [`harness/omp/KERNEL.md`](harness/omp/KERNEL.md) | Files the improver must not write |
| [`harness/omp/SURFACES.md`](harness/omp/SURFACES.md) | Files the improver may write |
| [`harness/omp/drivers/`](harness/omp/drivers/) | 19 Bun scripts |
| [`harness/omp/evals/`](harness/omp/evals/) | The score script, 20 tasks, recorded runs |
| [`oh-my-pi/`](oh-my-pi/) | Snapshot of Oh My Pi; treat as read-only unless a note says otherwise |

## 4. The four-layer checklist

We call this **CACD** in the code because the four words are Contract, Architecture, Control, and Delivery. In English:

| Layer | Question it answers |
|-------|---------------------|
| **Contract** | Which files are locked, and which may change? |
| **Architecture** | How are the playbook, roles, and scorer wired? |
| **Control** | What must the scripts refuse? |
| **Delivery** | How does a good idea become *evidence*, not an automatic install? |

This is not a second plan document. QA opens every path in [`harness/omp/cacd/catalog.ts`](harness/omp/cacd/catalog.ts) on every run. If you add a locked path or a new setup replay, add a catalog row in the same commit.

| Id | Layer | Title | Path |
|----|-------|-------|------|
| `c-kernel` | contract | Locked files | `harness/omp/KERNEL.md` |
| `c-surfaces` | contract | Editable files | `harness/omp/SURFACES.md` |
| `c-plan` | contract | What we are building now | `IMPLEMENTATION_PLAN.md` |
| `c-decisions` | contract | Written decisions | `DECISIONS.md` |
| `a-cacd` | architecture | The checklist itself | `harness/omp/CACD.md` |
| `a-agents` | architecture | Playbook is context, not a prompt rewrite | `harness/omp/overlay/.omp/AGENTS.md` |
| `k-allowlist` | control | Path policy for the improver | `harness/omp/drivers/allowlist.ts` |
| `k-search-cap` | control | Hard cap on search steps | `harness/omp/drivers/search.ts` |
| `k-propose` | control | Next lesson comes from practice tasks only | `harness/omp/drivers/propose.ts` |
| `d-queue` | delivery | Human review list | `harness/omp/REVIEW_QUEUE.md` |
| `d-ci` | delivery | GitHub Actions | `.github/workflows/overlay.yml` |
| `d-qa` | delivery | The repo check script | `harness/omp/scripts/qa.sh` |

4 + 2 + 3 + 3 = **12**.

## 5. Comparing setups without a live model

The useful trick: **compare how the pieces are wired without paying for a frontier model.**

Script: [`harness/omp/drivers/simulate-architectures.ts`](harness/omp/drivers/simulate-architectures.ts). Saved report: [`harness/omp/evals/simulations/latest/summary.md`](harness/omp/evals/simulations/latest/summary.md).

| Id | What we wired | What must happen | Result | Practice | Hidden |
|----|---------------|------------------|--------|----------|--------|
| `ace-only` | Playbook slogans, no concrete lessons | Score stays at zero | pass | 0/12 | 0/8 |
| `self-harness-gated` | Five bounded steps, hidden set as a brake | Score goes up | pass | 7/12 | 3/8 |
| `ahe-surfaces` | Every practice lesson unlocked | Score goes up; secret tasks stay locked | pass | 12/12 | 6/8 |
| `held-out-leak` | Improver is shown a hidden-task name | Script must refuse | pass | — | — |
| `kernel-write` | Improver tries to edit the score script | Script must refuse | pass | — | — |
| `unbounded-search` | Ask for 9 steps (cap is 8) | Script must refuse | pass | — | — |
| `auto-promote` | Search tries to write the official extra files | Must not install | pass | — | — |

| Id | Why we keep this replay |
|----|-------------------------|
| `ace-only` | “Just write nicer advice” is a *passing test of failure*. We do not want a later change to “fix” a 0/20 by treating slogans as the product. |
| `self-harness-gated` | The real loop: both sets move; official files do not. |
| `ahe-surfaces` | Concrete lessons beat slogans. The two “don’t hardcode secrets” hidden tasks stay failed on purpose. |
| `held-out-leak` | If the improver can see the exam, the exam is worthless. |
| `kernel-write` | If it can silence the grader, nothing else matters. |
| `unbounded-search` | Search stops at 8 steps (we usually run 3). |
| `auto-promote` | Search files evidence. A person installs. |

```text
bun harness/omp/drivers/simulate-architectures.ts
```

## 6. Quickstart

### 6.1 What you need

- [Bun 1.3.14](https://bun.sh) (same version Oh My Pi pins)
- [`rg`](https://github.com/BurntSushi/ripgrep) (ripgrep) — every task’s `check.sh` calls it
- Git
- Language-model API keys: **optional**. The checks and the seven replays do not call a model.

### 6.2 Clone and prove the repo works

```text
git clone https://github.com/Vinayak-RZ/Improveness.git
cd Improveness
bash harness/omp/scripts/qa.sh
```

You should see `qa.sh ok`. Unit tests print 55 pass across 19 files. All seven setup replays pass.

### 6.3 Faster check (skips the second replay pass)

```text
bash harness/omp/scripts/validate.sh
```

### 6.4 Copy the playbook into the Oh My Pi snapshot

```text
bash harness/omp/scripts/install-overlay.sh
```

This **merges** into the existing `oh-my-pi/.omp/` folder. Do not delete that folder first — Oh My Pi already ships its own commands and skills.

### 6.5 Run an improvement cycle in a throwaway copy

```text
bun harness/omp/drivers/run-benchmark.ts 5 /tmp/improv-bench
```

Uses a copy of the tasks. Does not edit the official playbook in this checkout.

## 7. Configuration

`qa.sh` needs no environment variables. Secrets stay in the environment, never in the playbook (the curator rejects lines that look like keys).

| Variable | Required | Default | What it is for |
|----------|----------|---------|----------------|
| `OMP_GOOGLE_ANTIGRAVITY_CLIENT_ID` | no | unset | Oh My Pi OAuth placeholder |
| `OMP_GOOGLE_ANTIGRAVITY_CLIENT_SECRET` | no | unset | Oh My Pi OAuth placeholder |
| `OMP_GOOGLE_GEMINI_CLI_CLIENT_ID` | no | unset | Oh My Pi OAuth placeholder |
| `OMP_GOOGLE_GEMINI_CLI_CLIENT_SECRET` | no | unset | Oh My Pi OAuth placeholder |
| `OMP_ANTHROPIC_OAUTH_CLIENT_ID` | no | unset | Oh My Pi OAuth placeholder |
| `ANTHROPIC_API_KEY` | no | unset | Needed only for an optional live ping |
| `OPENAI_API_KEY` | no | unset | Same |
| `OPENROUTER_API_KEY` | no | unset | Same |
| `OMP_LIVE_SMOKE` | no | unset | Set to `1` to try a real agent session ping |
| `OMP_LIVE_SEARCH` | no | unset | Reserved. CI uses the no-key search. |

See [`.env.example`](.env.example). Do not paste real OAuth client secrets into git — GitHub will block the push.

**Cost:** default checks spend zero tokens. The optional live ping is a second GitHub Actions job that stays green when keys are missing. A public Terminal-Bench 2 run is future work and must never become the improver’s score.

## 8. What’s in the repo

```text
.
├── README.md
├── IMPLEMENTATION_PLAN.md       # what we are building right now
├── DECISIONS.md                 # written decisions D1–D13
├── PROGRESS.md
├── LEARNING.md
├── PROJECT_OVERVIEW.md
├── .env.example
├── .github/workflows/overlay.yml
├── docs/                        # paper notes, method pages, proposals
├── harness/omp/                 # Improveness itself
│   ├── CACD.md
│   ├── cacd/catalog.ts
│   ├── KERNEL.md
│   ├── SURFACES.md
│   ├── REVIEW_QUEUE.md
│   ├── drivers/                 # 19 TypeScript scripts
│   ├── evals/
│   │   ├── checker/check.ts
│   │   ├── held-in/             # 12 practice tasks
│   │   ├── held-out/            # 8 hidden tasks
│   │   ├── tb-adapter/          # local tasks in a Harbor-like layout
│   │   ├── benchmarks/local-20/
│   │   └── simulations/latest/
│   ├── overlay/.omp/            # playbook, agents, manifests
│   ├── archive/                 # snapshot bodies are gitignored
│   ├── staging/                 # waiting-room bodies are gitignored
│   ├── scripts/validate.sh
│   ├── scripts/qa.sh
│   └── tests/                   # 19 test files
├── oh-my-pi/                    # Oh My Pi snapshot, no nested .git
└── vendor/cursor-config-coding/ # editor skills used to write this repo
```

## 9. Scripts you can run

There are **19** scripts under [`harness/omp/drivers/`](harness/omp/drivers/). Writes from the improver go through `assertEvolverWrite` in [`allowlist.ts`](harness/omp/drivers/allowlist.ts).

### 9.1 Memory and traces (4)

| Script | Who may write | What it does |
|--------|---------------|--------------|
| `curate-playbook.ts` | `playbook/` only | Adds a lesson. Rejects secrets and “edit SYSTEM.md” advice. |
| `export-session.ts` | traces folder | Turns an Oh My Pi session log into a folder of turns and tool I/O |
| `write-diagnosis.ts` | `diagnosis.md` only | Debugger write under `traces/` or `reports/` |
| `playbook-solver.ts` | read-only | Scores tasks as if the coding agent followed the playbook lessons |

### 9.2 Gate and review (5)

| Script | Who may write | What it does |
|--------|---------------|--------------|
| `run-eval.ts` | nothing | Scores a set of tasks on the starter tree or the gold tree |
| `self-harness.ts` | waiting room only | Keep the change only if practice improved and hidden did not drop |
| `manifest.ts` | n/a | Shape of a candidate record (JSON) |
| `apply-candidate.ts` | waiting room | Snapshot + record. Not a “install into official files” command. |
| `rollback-candidate.ts` | waiting-room snapshots | Restore files by candidate id |

### 9.3 Search and runners (5)

| Script | Who may write | What it does |
|--------|---------------|--------------|
| `archive.ts` | history folder | Save / list / pick a past playbook. Refuses locked paths. |
| `propose.ts` | waiting-room playbook | Picks the next practice lesson. Errors if you pass a hidden-task name. |
| `search.ts` | waiting room, history, review list | Bounded loop. Never writes official extra files. |
| `tb-export.ts` | an output folder | Writes a Harbor-like `instruction.md` + `tests/test.sh` |
| `run-tb-local.ts` | nothing | Runs those local tasks against a starter or gold tree |

### 9.4 Checks (5)

| Script | Who may write | What it does |
|--------|---------------|--------------|
| `allowlist.ts` | n/a | Which tools and paths each role may use |
| `live-session-smoke.ts` | skip without keys | Optional “say pong” ping to a real agent session |
| `run-benchmark.ts` | a temp folder | Five-step recorded-style run |
| `qa-repo.ts` | nothing | Opens the 12 checklist rows and checks relative links |
| `simulate-architectures.ts` | a temp folder | The seven setup replays |

4 + 5 + 5 + 5 = **19**.

Two project agents ship as markdown: [`debugger.md`](harness/omp/overlay/.omp/agents/debugger.md) (read, grep, glob, find only) and [`evolver.md`](harness/omp/overlay/.omp/agents/evolver.md) (no shell; no locked paths). Oh My Pi also has hidden role names `@debugger` and `@evolver` so those agents can pin a model slot.

## 10. What we store on disk

There is no database. Everything is files.

### 10.1 A coding task

`harness/omp/evals/{held-in,held-out}/<id>/`

| File | Meaning |
|------|---------|
| `fixture.json` | Name, which set it belongs to, the prompt, which script grades it |
| `check.sh` | The grader. Exit 0 means pass. This file is locked. |
| `repo/` | The broken starter. Must fail the grader. |
| `expected/` | The gold answer. Must pass the grader. |

### 10.2 A candidate record

[`manifest.ts`](harness/omp/drivers/manifest.ts) stores: id, which kind of extra file it is (tool, hook, memory, skill, or playbook), the file list, a parent hash, practice and hidden scores, a rollback command, and optional evidence fields.

### 10.3 A history snapshot

[`archive.ts`](harness/omp/drivers/archive.ts) stores: id, parent id, score (hidden-set pass rate), file hashes, created time. File bodies live under `harness/omp/archive/<id>/` and are gitignored. When picking a parent we prefer a high score and few children.

### 10.4 A checklist row

[`cacd/catalog.ts`](harness/omp/cacd/catalog.ts): id, layer, title, path, and strings that file must contain.

### 10.5 A setup-replay result

id, title, what we are proving, what must happen (`stagnate`, `improve`, `throw`, or `no-promote`), pass or fail, a detail string, optional scores.

## 11. The 20 coding tasks

### 11.1 Two sets on purpose

| Set | Count | Role |
|-----|-------|------|
| Practice (`held-in`) | 12 | The improver may see failures and add matching lessons |
| Hidden (`held-out`) | 8 | A brake. The improver must not be given these names. |

Each task is a prompt, a grader, a failing starter, and a passing gold tree.

### 11.2 Practice task names

`default-export`, `gitignore-rule`, `greet-export`, `index-reexport`, `license-header`, `named-type-export`, `package-script`, `readme-section`, `readme-title`, `sum-fn`, `tsconfig-strict`, `unused-var-marker`.

### 11.3 Hidden task names

`barrel-no-secrets`, `gitignore-dist`, `greet-types`, `no-implicit-any`, `no-secrets`, `package-test-script`, `readme-usage`, `typed-default-export`.

### 11.4 Lesson families

A playbook line that contains `recipe:gitignore` counts as knowing *every* task in that family. That is how a hidden task can pass **without** us showing it to the improver: it is the same *kind* of work as a practice task.

| Lesson tag | Practice tasks it unlocks | Hidden tasks it also unlocks |
|------------|---------------------------|------------------------------|
| `recipe:default-export` | default-export | typed-default-export |
| `recipe:gitignore` | gitignore-rule | gitignore-dist |
| `recipe:named-export` | greet-export, sum-fn, named-type-export | greet-types |
| `recipe:index-reexport` | index-reexport | — |
| `recipe:license-header` | license-header | — |
| `recipe:package-script` | package-script | package-test-script |
| `recipe:readme-h2` | readme-section | readme-usage |
| `recipe:readme-h1` | readme-title | — |
| `recipe:tsconfig` | tsconfig-strict | no-implicit-any |
| `recipe:unused-prefix` | unused-var-marker | — |
| `recipe:no-secrets` | — | no-secrets, barrel-no-secrets |

`recipe:no-secrets` has **no practice member**. The automatic lesson picker never unlocks it. Those two hidden tasks staying failed is the point: we did not leak the exam.

## 12. How we test

```text
bun test harness/omp/tests/
bash harness/omp/scripts/validate.sh
bash harness/omp/scripts/qa.sh
```

| How heavy | What it covers | Command |
|-----------|----------------|---------|
| Fast | 19 test files, 55 cases | `bun test harness/omp/tests/` |
| Overlay | Locked-path greps, at least 20 tasks, no public-benchmark download URLs | `validate.sh` |
| Whole repo | 12 checklist rows, relative links, then the seven replays | `qa.sh` |
| Slow | A real agent session | only if `OMP_LIVE_SMOKE=1` and a key are set |
| Not our gate | Oh My Pi’s own heavy test suite | do not run that as the Improveness check |

`qa.sh` is `validate.sh`, then `qa-repo.ts`, then the setup replays. GitHub Actions ([`.github/workflows/overlay.yml`](.github/workflows/overlay.yml)) installs ripgrep, then runs `qa.sh` (Bun 1.3.14). Without `rg`, every gold tree fails. The live-ping job is optional and must stay green on a pull request that has no secrets.

## 13. What the improver is not allowed to touch

[`harness/omp/KERNEL.md`](harness/omp/KERNEL.md) · longer write-up: [`docs/proposals/04-safety.md`](docs/proposals/04-safety.md)

| Rule | How it is enforced |
|------|--------------------|
| No writes to the grader, KERNEL, SURFACES, the checklist, `qa.sh`, the system prompt, or `oh-my-pi/packages/` | Path checks in the allowlist |
| The lesson picker cannot see hidden-task names | `propose.ts` throws |
| Search cannot run forever | Hard cap of 8 steps |
| A language model does not grade the tasks | The `check.sh` scripts do |
| A person installs | Review list; search writes “do not apply” |
| Rejects are kept | `harness/omp/reports/search/` |
| Unsafe wirings | Replays must refuse or refuse to install |
| No tuning on a public leaderboard | Local tasks only |

The debugger may `read`, `grep`, `find`, and `glob`. It may not `edit`, `write`, or run a shell. The improver may `edit` / `write` only under the extra playbook / skills / tools folders, or the waiting room.

## 14. Where this runs

There is no production server and no container image.

| Place | What happens |
|-------|----------------|
| Your machine | `qa.sh`, `validate.sh`, and the Bun scripts |
| GitHub Actions | [`.github/workflows/overlay.yml`](.github/workflows/overlay.yml) on matching paths, or a manual run |
| Overlay install | `install-overlay.sh` merges into `oh-my-pi/.omp/` |
| Undo a candidate | `rollback-candidate.ts --id <id>` |
| npm, Harbor cloud, public Terminal-Bench | not shipped |

Turning CI on for everyone else is merging this branch to `main`. Turning search off is “don’t run `search.ts`.”

## 15. Common commands

**Check the whole repo (start here)**

```text
bash harness/omp/scripts/qa.sh
```

**Replay every named setup**

```text
bun harness/omp/drivers/simulate-architectures.ts
```

**Score starter trees vs gold trees**

```text
bun harness/omp/drivers/run-eval.ts harness/omp/evals held-in repo
bun harness/omp/drivers/run-eval.ts harness/omp/evals held-out expected
```

**Bounded search in this checkout** (writes the waiting room, history, and review list — prefer `run-benchmark.ts` if you do not want to dirty this tree)

```text
bun harness/omp/drivers/search.ts 3
```

**Local tasks in a Harbor-like layout**

```text
bun harness/omp/drivers/tb-export.ts harness/omp/evals/held-out/no-secrets /tmp/tb
bun harness/omp/drivers/run-tb-local.ts harness/omp/evals repo
```

**Add a playbook lesson by hand**

```text
bun harness/omp/drivers/curate-playbook.ts --playbook harness/omp/overlay/.omp/playbook/PLAYBOOK.md --lesson "Prefer named exports" --passed
```

**Turn an Oh My Pi session log into a trace folder**

```text
bun harness/omp/drivers/export-session.ts --jsonl path/to/session.jsonl --out harness/omp/traces
```

**Optional live ping (skips without a flag)**

```text
bun harness/omp/drivers/live-session-smoke.ts
# {"skipped":true,"reason":"OMP_LIVE_SMOKE is not 1"}
```

## 16. Recorded scores

### 16.1 Five steps on the 20 local tasks

Full write-up: [`harness/omp/evals/benchmarks/local-20/summary.md`](harness/omp/evals/benchmarks/local-20/summary.md)

| Set | Before | After 5 steps | Change |
|-----|--------|---------------|--------|
| Practice | 0/12 | 7/12 | +7 |
| Hidden | 0/8 | 3/8 | +3 |

| Step | Lesson added | Decision | Practice | Hidden |
|------|--------------|----------|----------|--------|
| 1 | `recipe:default-export` | keep | 1/12 | 1/8 |
| 2 | `recipe:gitignore` | keep | 2/12 | 2/8 |
| 3 | `recipe:named-export` | keep | 5/12 | 3/8 |
| 4 | `recipe:index-reexport` | keep | 6/12 | 3/8 |
| 5 | `recipe:license-header` | keep | 7/12 | 3/8 |

The hidden +3 is transfer (`typed-default-export`, `gitignore-dist`, `greet-types`). The two “don’t hardcode secrets” tasks stay at 0 because the picker never saw them.

This scores **whether the playbook contains the right lessons**, not whether a live model can code. It is the honest no-key proof that the gate, the history folder, and the hidden-set brake work.

### 16.2 The contrast that matters

From §5: slogans-only stays 0/20. Unlocking every practice lesson reaches 12/12 and 6/8. That gap is the product.

## 17. How to add something

| You want to | Do this |
|-------------|---------|
| Add a coding task | New folder under `held-in/` or `held-out/` with `fixture.json`, `check.sh`, `repo/`, `expected/`. If a lesson should unlock it, map that in `playbook-solver.ts`. Never put a hidden-task name in the practice-only map. |
| Add a setup replay | New id plus a runner in `simulate-architectures.ts`, plus a row in the saved report. |
| Add a checklist row | Append to `CACD_ITEMS` with a path and required strings. QA fails until the file matches. |
| Lock a new path | Update `KERNEL.md` and `KERNEL_PATH_MARKERS` in `allowlist.ts` in the same commit. |
| Install a candidate | A person edits via `REVIEW_QUEUE.md`. Do not add an auto-install script. |

## 18. What’s done and what’s next

### 18.1 Already shipped

| Phase | What landed | Status |
|-------|-------------|--------|
| Research | Paper notes, method pages, proposals 00–05 | done |
| First overlay | Extra files, playbook, traces, accept/reject, candidate records | done |
| Twenty tasks | Practice/hidden split, optional live ping, debugger/improver roles, local Harbor layout, history folder | done |
| Search + CI | GitHub Actions, bounded search, local runner, recorded 20-task run | done |
| Checklist + replays | Four-layer checklist, repo QA, seven setup replays | done |

### 18.2 Possible later work

- A public Terminal-Bench 2 run (**never** as the improver’s score)
- Making the live ping required (needs secrets on every pull request)
- A live improver session behind `OMP_LIVE_SEARCH=1`
- Spec Kit and an agent-pattern catalog
- A person installing a waiting-room playbook onto the official extra files

### 18.3 Changelog

| Date | Change |
|------|--------|
| 2026-08-16 | README rewritten in plain language (same facts, fewer unexplained short names) |
| 2026-08-16 | README first written as a 20-section manual |
| 2026-08-15 | Four-layer checklist, repo QA, seven setup replays |
| 2026-08-15 | CI, bounded search, recorded 0/12→7/12 and 0/8→3/8 |
| 2026-08-15 | 20 tasks, debugger/improver roles, local Harbor layout, history folder |
| 2026-08-15 | First overlay; Oh My Pi snapshot; paper notes |

## 19. Questions and a word list

**Why replay setups instead of running a live agent on a public benchmark?**
If the improver can practice on the public set you later score it on, the score is contaminated. Replays compare *who may write, who may see the hidden set, and whether install is automatic* — at the speed of CI, with no tokens.

**What does the four-layer checklist add over `DECISIONS.md`?**
`DECISIONS.md` is history (“we decided X”). The checklist is what QA opens *today*. If a required sentence disappears from a file, the check fails.

**Why can the improver be a smaller model?**
Updating extra files is a flatter skill than doing the user’s coding task. Spend the expensive model on the task agent.

**Why is “slogans only, score 0/20” a *passing* replay?**
Because we *want* that setup to fail at scoring. The test passes when the score stays at zero. That stops someone from “helping” by treating empty advice as a win.

**Where should I read next?**
This file. Then [`harness/omp/CACD.md`](harness/omp/CACD.md), [`harness/omp/evals/simulations/latest/summary.md`](harness/omp/evals/simulations/latest/summary.md), [`docs/00-index.md`](docs/00-index.md), [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md).

| Word in the code | Plain meaning |
|------------------|---------------|
| **Harness** | Instructions, tools, tests, and permissions around a model you are not retraining |
| **Playbook** | A markdown file of lessons the agent should follow |
| **Practice set / held-in** | Tasks the improver may look at |
| **Hidden set / held-out** | Tasks used only as a brake |
| **Improver / evolver** | The role that suggests extra-file edits |
| **Locked files / kernel** | Paths that role must not write |
| **Waiting room / staging** | Where a kept suggestion sits |
| **Install / promote** | A person copies a suggestion into the official extra files |
| **Checklist / CACD** | Contract, Architecture, Control, Delivery |
| **Setup replay / simulation** | A no-key run of a named wiring |
| **ACE** | Playbook memory with a picky curator script |
| **AHE** | Improve tools and memory, not the system prompt |
| **Self-Harness** | Keep a change only if practice rose and hidden did not fall |
| **Oh My Pi / OMP** | The coding agent we layer extra files on |
| **Harbor / Terminal-Bench** | A public coding-agent benchmark we do **not** use as the improver’s score |

Longer notes: [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) · [`PROGRESS.md`](PROGRESS.md) · [`DECISIONS.md`](DECISIONS.md) · [`LEARNING.md`](LEARNING.md) · [`harness/omp/CACD.md`](harness/omp/CACD.md)

## 20. Full command list

Run scripts with `bun harness/omp/drivers/<file>.ts`. Some files are libraries and have no useful command line.

| Command | Arguments | What exit means |
|---------|-----------|-----------------|
| `qa-repo.ts` | none | 1 if any checklist or link check fails |
| `simulate-architectures.ts` | optional output folder (default `harness/omp/evals/simulations/latest`) | 1 if any replay fails |
| `run-benchmark.ts` | optional step count (default 3) and output folder | 0; prints a summary |
| `search.ts` | optional step count (default 3) | Errors on a bad cap or a locked-path write |
| `run-eval.ts` | evals folder, `held-in` or `held-out`, `repo` or `expected` | Prints JSON scores |
| `run-tb-local.ts` | evals folder, `repo` or `expected` | Prints per-task JSON |
| `tb-export.ts` | a task folder, optional output folder | Prints export paths |
| `curate-playbook.ts` | `--playbook PATH` and either `--session PATH` or `--lesson TEXT` plus `--passed` or `--failed` | Prints the playbook edit |
| `export-session.ts` | `--jsonl PATH` and optional `--out` folder | Prints the session id |
| `rollback-candidate.ts` | `--id <id>` | Prints the restore |
| `live-session-smoke.ts` | none (reads the environment) | 0 if skipped; 1 if you asked for a live ping with no session factory |
| `apply-candidate.ts` | none | Always errors on the command line (library only) |

Shell scripts: `bash harness/omp/scripts/qa.sh`, `validate.sh`, `install-overlay.sh`.
