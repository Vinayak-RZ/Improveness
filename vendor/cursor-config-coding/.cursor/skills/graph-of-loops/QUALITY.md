# Quality — evaluate, boot, trials, docs-out

Good software in this skill means: **tests that can fail**, **it boots**,
**more than one trial is logged**, **docs describe what actually ran**.
Inner loop checkers do not replace this tail.

Full rules for the tail: E1 → R1 → T1 → D1 in [CYCLE.md](CYCLE.md).

---

## E1 — Evaluate

Stop: a **named** test command exits 0 (`pytest`, `npm test`, `go test`,
repo `validate` script). "I ran some tests" is illegal.

If the repo has no test runner yet, the E1 maker **adds the thinnest one**
that fails when P0 breaks, then the checker runs it.

---

## R1 — Run / boot

A green unit file is not boot. Start the product:

- web: dev server + one critical path
- CLI: `--help` plus one P0 command
- worker: process stays up long enough to accept one job

Stop: boot log path (`docs/planning/R1_BOOT.md`) records command, exit,
and one observed result. Checker confirms the file exists and names a
command that was actually run.

---

## T1 — Queued trials

Not one happy screenshot. Write the queue **in the T1 loop plan before
execution**. Default queue (drop a row only with `N/A — reason`):

| # | Trial | Pass means |
|---|-------|------------|
| 1 | Happy P0 path | Done-looks-like from `docs/PRODUCT.md` |
| 2 | Empty / zero state | No crash; honest empty UI or error |
| 3 | Bad input / error | Fail closed; no fake success |
| 4 | One regression | Existing behavior still works (or N/A greenfield) |
| 5 | Auth fail | If auth exists; else N/A |

Add product-specific rows (MCP no-hang, `unchecked` token, etc.) when P0
names them.

Log: `docs/planning/T1_TRIALS.md` — each row pass/fail + evidence path
(command output, screenshot path). Failures become tests or honest-hole
rows — not silence.

**Stop:** trial log has at least the required rows filled. Checker counts
rows; does not "trust the maker."

---

## D1 — Docs-out (after evidence)

Load the `readme` skill **inside D1**, not at the start of the graph.
README and companions describe the software that **booted and was trialled**.

**Stop:** README exists and names the R1 boot command. Do not write the
marketing README in D0.

---

## H1 — Harden

Only if T1/E1 left CI, secret, or bind-to-all-interfaces holes. Otherwise
`N/A — none this graph`.
