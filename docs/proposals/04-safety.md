# Safety kernel

Evaluator and permissions live **outside** the loop that evolves the harness. This page is binding for both generic and OMP proposals.

## Rules

1. **Evolver write allowlist only.** Cannot edit verifier, model-role config, permission kernel, tracer, run logs, or (for OMP) `oh-my-pi` source.
2. **Held-out split the proposer never sees.** Leakage invalidates the gate.
3. **Human checkpoint** before promoting changes that widen permissions, network, DAP attach, `computer`, browser, or destructive bash.
4. **Failures are first-class artifacts.** Do not delete failed runs to “clean” the archive (Weng negative-result bias).
5. **Fitness is not only “task passed.”** Include regression on held-out and a maintainability signal (diff size, extra hooks that re-check the same closure, token blow-up).
6. **No auto-write into canonical built-ins.** Overlay or project files only. Matches [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907).
7. **Hard max steps** on task, debugger, and evolver loops (`agentic-system-design`).
8. **Treat traces as untrusted.** Prompt-injection in tool output must not become a playbook bullet without curator/human review.
9. **Log** model id, tokens, latency, tool calls, and accept/reject for every evolution round.
10. **Rollback is mandatory** when a manifest’s predicted fixes miss or an at-risk task actually regresses.

## Reward-hacking catalog (refuse these “gains”)

| Hack | Block |
|------|--------|
| Disable or weaken the verifier | Kernel read-only |
| Swap to a stronger model mid-loop | Model id read-only |
| Raise reasoning budget / timeout | Budget read-only |
| Overfit public bench items in \(D_{in}\) | Held-out \(D_{out}\) |
| Widen bash/network to skip failures | Human promote |
| Prompt-only slogans that hide tool bugs | Prefer tools/hooks/memory; AHE prompt-only −2.3 pp |

## Human touch points

| When | Who | Decision |
|------|-----|----------|
| First allowlist definition | Maintainer | Which `.omp/` paths are writable |
| Permission / network / destructive edits | Maintainer | Promote or reject |
| Promoting a harness that changes default model roles | Maintainer | Reject by default |
| After N rejected candidates with the same fingerprint | Maintainer | Inspect traces; maybe change the seed, not the kernel |

## What this repo will not do

This repository stores the spec. It does not run an evolver, attach a debugger to production, or grant bash. Any future implementer must keep this kernel **outside** their loop.
