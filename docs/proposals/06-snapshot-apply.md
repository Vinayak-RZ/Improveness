# Snapshot apply (product)

Running Improveness on DeepSeek Harness (D15) writes **generated sibling plugins**. On Oh My Pi — or any agent snapshot you point at — the P1 adapter still **changes that snapshot’s code** after the Self-Harness gate. Overlay-only review queues were a misread of the vision (corrected as [D14](../../DECISIONS.md); host default corrected as [D15](../../DECISIONS.md)).

This is not a PR factory for [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi). It is a **working-copy mutator**.

## Apply target

| Target | After held-in/held-out accept |
|--------|-------------------------------|
| In-tree [`oh-my-pi/`](../../oh-my-pi/) | Yes — tools, skills, orchestration, core agentic loop (except kernel files) |
| User-supplied agent snapshot | Yes — same contract, different root |
| Project overlay `harness/omp/overlay/.omp/` | Yes — playbook / extra skills / extra tools |
| Upstream `can1357/oh-my-pi` | **Never** unless a human separately asks |
| Frozen checker `harness/omp/evals/checker/` | **Never** |
| `system-prompt.md` / `system-prompt.ts` | **Never** as an improvement surface (AHE prompt-only −2.3 pp) |
| `approval.ts` / permission widening | **Human checkpoint** |
| Improveness QA / CACD / CI | **Never** |

## What may change on the snapshot

Anything the agent uses to do work, including:

- Tool implementations and schemas
- Skills
- Orchestration / worker wiring
- The core agentic loop (ReAct step machine, tool executor, middleware)
- Playbook / memory files that are not the system prompt

AHE still says: do not “improve” by rewriting the system prompt. Gain lives in tools, middleware, and memory.

## Gate vs apply

```text
propose → frozen checker on held-in + held-out → decideAccept
  → accept: apply to working snapshot (D14)
  → reject: log; snapshot unchanged
  → permission/network/destructive widening: stop for a human
```

P2 `search.ts` still **stages** only (D12 describes current code). P3 ships `apply-snapshot` so accept is not “evidence forever.”

The `auto-promote` simulation stays a test that search cannot write the kernel or skip the gate. It is not a ban on gated snapshot apply.

## Spatiotemporal composability

Killing the OMP process on every self-mod dumps session state. Prefer Cordis-style **revertible plugins** so a bad tool or loop patch can unload without a host restart. See [spatiotemporal-composability.md](../methods/spatiotemporal-composability.md).

Restart remains allowed when the edit is not revertible. It is the fallback, not the architecture.

## Safety that does not move

- Evaluator outside the evolver
- Held-out ids never reach `propose.ts`
- Hard step cap
- Secrets in env
- No public Terminal-Bench as fitness
- Human checkpoint for permission / network / destructive widening
