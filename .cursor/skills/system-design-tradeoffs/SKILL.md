---
name: system-design-tradeoffs
description: Forces explicit trade-off analysis before architectural decisions — CAP, consistency, caching, monolith vs services, sync vs async, and cost/quality/speed priorities. Use when comparing design options, writing ADRs, scaling discussions, or whenever multiple valid architectures exist.
---

# System Design Trade-offs

Use **before committing** to a non-obvious architecture. Pair with `frontend-architecture`, `backend-architecture`, or `agentic-system-design` as needed.

## Required output format

For every meaningful decision, emit:

```markdown
## Trade-off: [short title]

**Decision:** What is being chosen

**Option A:** [name] — Pros: … Cons: …
**Option B:** [name] — Pros: … Cons: …

**Default:** [recommendation] because [1-2 sentences]

**Override:** Set PRIORITY = COST | SPEED | QUALITY | SIMPLICITY | CONSISTENCY | AVAILABILITY
```

Do not silently pick one side.

## Common decision matrix

| Area | Tension | Default bias |
|------|---------|--------------|
| Data | Strong vs eventual consistency | Strong for money/auth; eventual for analytics |
| Topology | Monolith vs microservices | Monolith until proven split boundary |
| API | Sync vs async/event-driven | Sync for CRUD; async for I/O >200ms or fan-out |
| Frontend | SSR vs CSR | SSR/SSG for SEO; CSR islands for heavy interactivity |
| Cache | None vs distributed | Measure first; add cache with TTL + invalidation plan |
| Agents | Autonomy vs human-in-loop | Human checkpoint for irreversible actions |
| AI cost | Small vs large model | Smallest model that passes eval threshold |

## Questions to answer

1. What breaks if this component is down?
2. What is the blast radius of a bad deploy?
3. What is the cost at 10× traffic?
4. What is the migration/rollback path?
5. What would we measure to know this was wrong?

## When to escalate to user

- Conflicting priorities (speed vs security)
- Irreversible schema or public API contracts
- Multi-tenant or compliance boundaries unclear
