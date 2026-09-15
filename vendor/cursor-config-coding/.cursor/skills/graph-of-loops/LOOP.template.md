# Loop plan — `<id>` — `<short name>`

> Collapsed plan for **one loop node**. Not a second 18-section nawab.
> Parent: [LOOP_GRAPH.md](../../LOOP_GRAPH.md) (adjust relative path).

| Field | Value |
|-------|-------|
| **Node id** | `N1` |
| **Job** | One sentence |
| **Wave** | 0 / 1 / … |
| **Depends on (data)** | `none` or node ids + artifact names |
| **Write paths** | globs the **maker** may change |
| **Read paths** | globs |
| **Maker type** | generalPurpose / lead |
| **Maker model** | inherit (or `composer-2.5-fast` on extract) |
| **Checker type** | explore / generalPurpose (readonly) |
| **Checker model** | `composer-2.5-fast` unless the stop needs a judge |
| **Max rounds** | 3 |
| **State** | [plans/loops/N1.state.json](N1.state.json) |
| **Isolation** | path-ownership; checker writes **nothing** in product trees |
| **Companion skills** | none / `ponytail` / `impeccable` / `readme` / `*-architecture` |

---

## Stop (required)

Must be a **command** or **file predicate**. Prose-only ("looks good") is
illegal — do not compile this node.

**Command** (preferred):

```text
[exact shell command; exit 0 = pass]
```

**File predicate** (optional extra): path exists / contains token.

---

## Objective

[What exists when this loop **passed** — one paragraph max.]

## Non-goals

- [Out of scope for **this** loop]

---

## Contract

**Input** (passed explicitly by the lead):

```json
{ }
```

**Maker output:**

```json
{ "files_touched": [], "notes": "" }
```

**Checker output:**

```json
{ "pass": false, "command": "", "exit_code": 1, "findings": [] }
```

---

## Escalate

After `max_rounds` failures, or if the checker cannot run the stop: **stop
the loop**, set status `escalated`, wait for the human. Do not start the
next dependent node.

---

## Commits (this node only)

Slice of parent §9. Lead commits these rows after the loop **passed**.

| # | Commit | Contents | Gate |
|---|--------|----------|------|
| | `feat(…): …` | … | `[same as Stop command when possible]` |

---

## Do not

- Commit, push, or open a PR
- Write outside **Write paths** (maker)
- Checker: write product files, or be the same Task as the maker
- Expand into another graph unless the user named `graph-of-loops` for this slice
- Load sibling loop plans (the lead passes what you need)
- Use Cursor `/loop` timers

---

## Return to graph

Maker: files touched, notes. Checker: `pass`, command, exit code, findings.
Lead updates `N1.state.json` (`round`, `status`).
