# Generic harness — required capabilities

What **any** coding harness (OMP, OpenCode, Codex, Claude Code, a custom loop) must expose or add to become self-improving. Product APIs are examples, not requirements.

Each capability: why, what to add, what not to add, acceptance criteria, failure modes.

---

## C1 — Editable component contract

**Why:** AHE: joint evolution only works when every failure maps to one file-level component. Prompt-only missed the gain (system prompt −2.3 pp).

**Add:** Versioned files for all seven:

| Component | Generic requirement |
|-----------|---------------------|
| System prompt | File, not an inline blob |
| Tool description | Separate from implementation |
| Tool implementation | Revertible source |
| Middleware / hooks | Pre/post interceptors as files |
| Skill | On-demand `SKILL.md` (or equivalent) |
| Sub-agent config | Explicit isolated workers |
| Long-term memory | Durable, project-scoped store |

**Do not add:** A single mega-prompt that “is” the harness.

**Accept:** An evolver can name the component for a failure; `git checkout -- <file>` undoes one edit.

**Fail:** Edits scatter across unstructured prose; rollback is “restore last chat.”

---

## C2 — Read-only safety kernel

**Why:** Weng reward hacking; AHE blocks disable-verifier / swap-model / raise-budget.

**Add:** Evaluator, model id, reasoning budget, permission policy, tracer, and run logs are **not writable** by the evolver. Allowlist of write paths.

**Do not add:** Evolver access to “whatever the task agent can write.”

**Accept:** A proposed edit to the verifier path is rejected before apply.

**Fail:** Pass rate rises after the judge is silenced.

---

## C3 — Trace store

**Why:** Filesystem-as-memory (Weng pattern 2); AHE experience pillar.

**Add:** Each rollout is a directory: messages, tool I/O, timestamps, verifier outcome, model id. Not a single chat blob.

**Do not add:** Traces only in a TUI buffer.

**Accept:** A debugger can `grep` a failure without loading the full transcript into one prompt.

**Fail:** After compaction, the failure is gone.

---

## C4 — Experience / debugger layer

**Why:** Multi-million-token traces are not evolver-consumable (AHE).

**Add:** A debugger role writes (1) per-task root-cause report and (2) corpus overview. Raw traces stay for drill-down (progressive disclosure). \(k \ge 2\) rollouts/task when measuring pass@1.

**Do not add:** Dumping raw traces into the evolver prompt.

**Accept:** Overview cites report paths; reports cite trace paths; claims are checkable.

**Fail:** Debugger invents causes that the trace contradicts.

---

## C5 — ACE playbook

**Why:** Cheapest self-managed memory; prevents collapse if merge is deterministic ([ace.md](../methods/ace.md)).

**Add:** Itemized `(id, text, helpful, harmful)` bullets. Reflector writes lessons. Curator emits **deltas**. Merge is non-LLM. Inject via context builder, not full-prompt rewrite.

**Do not add:** “Summarize the playbook into a shorter system prompt” as the update rule.

**Accept:** Two parallel deltas merge without an LLM; ids are stable; harmful counters can retire a bullet.

**Fail:** Playbook shrinks to slogans; or ACE is the *only* evolved surface.

---

## C6 — Self-Harness gate

**Why:** Same-model improvement with a regression brake ([self-harness.md](../methods/self-harness.md)).

**Add:** Weakness mining (verifier-grounded, mechanism-rich) → bounded diverse proposals → held-in / held-out. Accept only if neither split regresses and at least one improves (or the paper’s stated rule). Log rejects.

**Do not add:** Auto-merge because the evolver “is confident.”

**Accept:** Proposer never sees held-out traces; a candidate that breaks \(D_{out}\) is rejected.

**Fail:** Task-specific patches; hidden held-out leakage.

---

## C7 — AHE manifests

**Why:** Decision observability; next-round falsification.

**Add:** Each edit records evidence, component, root cause, predicted fixes, at-risk regressions. Next eval attributes and rolls back misses.

**Do not add:** Rationale-only commit messages.

**Accept:** A missed prediction produces an automatic file-level revert.

**Fail:** “Regression blindness” with no rollback (AHE still under-predicts regressions — rollback is the mitigation).

---

## C8 — Human promote

**Why:** Weng: humans move up the stack. Irreversible / shared-state actions need a checkpoint (`agentic-system-design`).

**Add:** Permission, network, DAP/debugger-attach, desktop/computer, browser, and destructive bash changes never auto-merge.

**Do not add:** Silent promotion of those classes.

**Accept:** Queue item is evidence for a human; applying it is a separate action.

**Fail:** The loop ships a wider bash allowlist to raise pass rate.

---

## Out of generic v1

- DGM / AlphaEvolve archives ([07](../07-evolutionary-search.md))
- Weight updates / SIA ([08](../08-joint-optimization.md))
- Auto-research paper pipelines ([05](../05-workflow-design.md))

Adoption order: [05-adoption-order.md](05-adoption-order.md).
