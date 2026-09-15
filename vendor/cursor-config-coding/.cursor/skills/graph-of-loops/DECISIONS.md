# Decisions (A1)

Architecture is a few written decisions, not a slide. Remaining trade-offs
from Gate 0 land here. Use `system-design-tradeoffs` (and
`frontend-architecture` / `backend-architecture` / `agentic-system-design`
when that layer exists).

Write `DECISIONS.md` (or `docs/DECISIONS.md` if the repo already uses that
path). Do not reopen PID P0 locks.

---

## Required for a software graph

At least:

1. **Layout** — packages/surfaces and who owns which paths
2. **Trust** — auth, tenancy, secrets (env), what the client must not decide
3. **Data** — source of truth, migrations if any
4. **Run** — how R1 boots (command)
5. **Fail closed** — what happens when a dependency is missing

Each decision:

```markdown
## ADR-NNNN — [title]
**Status:** accepted (this graph)
**Context:** [why it was a real choice]
**Decision:** [what we do]
**Consequences:** [follow-on]
**Alternatives:** [what we rejected]
```

**Stop (example):** `DECISIONS.md` contains `ADR-` and a `## Trust` or
"trust" section; layout paths exist on disk or in the ADR. Grep, not vibe.

---

## Do not

- Silently pick when Gate 0 left a trade-off unanswered — escalate
- Add a framework the repo does not already use unless P0 requires it
  (ponytail ladder)
- Put UX copy or visual tokens here (U1)
