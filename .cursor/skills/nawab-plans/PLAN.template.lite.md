# [NAME] — Lite execution plan

> Nawab **lite** profile. Cursor Plan default.
> Required: §0 §1 §9 §16 §18. Do not pad to 18 sections.

---

## §0 Plan metadata

| Field | Value |
|-------|-------|
| **Profile** | lite |
| **Mode** | feature |
| **Stack** | [from repo] |
| **Base branch** | `main` |
| **Feature branch** | `cursor/[name]` |
| **User commit budget** | [ask if missing — this overrides defaults] |
| **Delivery** | cursor-plan / repo IMPLEMENTATION_PLAN |
| **Supersedes** | none / [plan name] |
| **Authority docs** | [links] |
| **Lead agent** | Orchestrate, commit, integrate |

---

## §1 North star & scope boundary

### Objective

[One sentence]

### Deliverables

- […]

### Non-goals

- […]

### Priority

| Priority | Items |
|----------|-------|
| **P0** | |
| **P1** | |

---

## §9 Commit matrix

User budget wins. One row = one commit.

| # | Commit | Contents | Gate |
|---|--------|----------|------|
| 1 | `type(scope): …` | | `[cmd]` |

---

## §16 Exit criteria

### P0

- [ ] [Behavior] verified by [command]

### P1

- [ ] […]

---

## §18 Execution protocol

```text
1. Ponytail on every edit
2. Each §9 row: implement → gate → commit
3. Verify §16 P0
```

---

## Open questions

- [Must answer before execution]

## Approval

**Profile:** lite. Approve to begin commit 1.
