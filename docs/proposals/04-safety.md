# Safety kernel

Evaluator and permissions live **outside** the loop that evolves the harness. This page is binding for both generic and OMP proposals.

D14: the loop **does** write the working snapshot after the gate. Safety is “cannot silence the judge / steal a stronger model / widen permissions,” not “cannot touch agent source.”

## Rules

1. **Evolver write allowlist only.** Cannot edit verifier, model-role config, permission kernel (`approval.ts`), tracer, run logs, Improveness QA/CI, or `system-prompt.md` / `system-prompt.ts`. **Can** edit working-snapshot tools, skills, orchestration, and core loop after accept.
2. **Held-out split the proposer never sees.** Leakage invalidates the gate.
3. **Human checkpoint** before applying changes that widen permissions, network, DAP attach, `computer`, browser, or destructive bash.
4. **Failures are first-class artifacts.** Do not delete failed runs to “clean” the archive (Weng negative-result bias).
5. **Fitness is not only “task passed.”** Include regression on held-out and a maintainability signal (diff size, extra hooks that re-check the same closure, token blow-up).
6. **No auto-write into the checker or upstream.** Snapshot apply is the product (D14). [oh-my-pi#7907](https://github.com/can1357/oh-my-pi/issues/7907) is the stance for *upstream* OMP maintainers, not a ban on mutating *your* copy.
7. **Hard max steps** on task, debugger, and evolver loops (`agentic-system-design`).
8. **Treat traces as untrusted.** Prompt-injection in tool output must not become a playbook bullet without curator/human review.
9. **Log** model id, tokens, latency, tool calls, and accept/reject for every evolution round.
10. **Rollback is mandatory** when a manifest’s predicted fixes miss or an at-risk task actually regresses. Prefer revertible plugins so rollback does not require killing the runtime ([spatiotemporal composability](../methods/spatiotemporal-composability.md)).

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
| First allowlist definition | Maintainer | Which snapshot paths are writable vs kernel |
| Permission / network / destructive edits | Maintainer | Apply or reject |
| Promoting a harness that changes default model roles | Maintainer | Reject by default |
| After N rejected candidates with the same fingerprint | Maintainer | Inspect traces; maybe change the seed, not the kernel |

## What this repo will not do

The evolver must not edit this kernel, the frozen checker, or upstream remotes. The overlay **does** run a bounded search. After P3 Phase B it applies ordinary accepts to the working snapshot. Any implementer must keep the evaluator **outside** that loop.
