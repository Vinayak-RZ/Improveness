# ARC domain-kernel improver — Lite execution plan

> Nawab **lite** profile. Graph-of-loops: [LOOP_GRAPH.md](LOOP_GRAPH.md) (graph-engineering §19 N/A — XOR).

---

## §0 Plan metadata

| Field | Value |
|-------|-------|
| **Profile** | lite |
| **Mode** | feature |
| **Stack** | Bun overlay, Node DSH plugin, TypeScript ports |
| **Base branch** | `main` |
| **Feature branch** | `cursor/arc-domain-kernel-improver-3670` |
| **User commit budget** | 8 |
| **Delivery** | repo `docs/plans/p5-arc-domain-kernel-improver.md` |
| **Supersedes** | none |
| **Authority docs** | `DECISIONS.md` D15–D16, `KERNEL.md`, `docs/methods/domain-kernel.md` |
| **Lead agent** | Orchestrate, commit, integrate |

---

## §1 North star & scope boundary

### Objective

Name and wire **domain kernels** so Improveness improves **any agentic host** via
`DomainKernelPort`, not only DeepSeek / OMP coding harnesses.

### Deliverables

- Typed port + registry + improver facade + tests
- Research summary (`docs/research/domain-kernels-and-improver.md`)
- Root `AGENTS.md` (ARC vocabulary)
- Sync `vendor/cursor-config-coding` → `.cursor/` (incl. `graph-of-loops` skill)
- `LOOP_GRAPH.md` + minimal loop node plans

### Non-goals

- New public benchmark campaigns
- Vendoring full DSH tree
- Renaming `dsh-improveness` package on npm/registry

### Priority

| Priority | Items |
|----------|-------|
| **P0** | Port types, registry, docs, cursor sync, tests |
| **P1** | Third-host example adapter in docs only |

---

## §9 Commit matrix

| # | Commit | Contents | Gate |
|---|--------|----------|------|
| 1 | `docs(arc): add domain kernel research and AGENTS` | research, domain-kernel.md, AGENTS.md | read |
| 2 | `feat(host-port): add DomainKernelPort registry and improver` | types, registry, improver, stub, tests | `bun test harness/omp/tests/domain-kernel-port.test.ts` |
| 3 | `docs(plan): p5 arc domain kernel improver and loop graph` | this file, LOOP_GRAPH, loop nodes | read |
| 4 | `chore(vendor): sync cursor-config-coding to 45a585d` | vendor + `.cursor` | `diff` clean |
| 5 | `docs(methods): link HostPort to domain kernel` | host-port.md, catalog if needed | `bash harness/omp/scripts/qa.sh` |

---

## §16 Exit criteria

### P0

- [ ] `DomainKernelPort` documented and tested
- [ ] `qa.sh` green
- [ ] Cursor vendor at upstream `main` (45a585d4)

### P1

- [ ] Example third-host registration documented in domain-kernel.md

---

## §18 Execution protocol

```text
1. Ponytail on every edit
2. Each §9 row: implement → gate → commit → push
3. Open PR when P0 complete
```

---

## §19 Graph-engineering

`N/A — graph-of-loops named (XOR). See LOOP_GRAPH.md.`

---

## Open questions

Defaults applied (Gate 0 / graph-of-loops QUESTIONS.md):

- **Product name:** ARC for vocabulary; Improveness remains repo/package name until rename PR.
- **P0 hosts:** DSH + OMP registered; custom hosts via registry.
- **Commit budget:** 8 (coalesced to 5 rows above).
