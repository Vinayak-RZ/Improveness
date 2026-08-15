---
name: backend-architecture
description: Guides backend and API architecture — service layers, REST/GraphQL design, databases, caching, async jobs, and scalability trade-offs. Use when designing APIs, microservices vs monolith boundaries, data models, authentication flows, or infrastructure-facing code.
---

# Backend Architecture

Apply before new services, API surfaces, database schemas, or auth/payment flows.

## Decision checklist

1. **Topology** — monolith module vs separate service vs serverless functions
2. **API style** — REST, GraphQL, RPC, events
3. **Data store** — relational, document, cache, queue
4. **Consistency** — strong vs eventual; saga/outbox needs
5. **Auth model** — session, JWT, OAuth, API keys; where authZ runs
6. **Failure model** — timeouts, retries, idempotency, circuit breakers

## Layer boundaries (non-negotiable default)

```text
HTTP / transport     → routes, controllers, handlers (thin)
Service layer        → business rules, orchestration, authZ checks
Domain / models      → entities, invariants, domain errors
Data access          → repositories, queries (parameterized only)
Infrastructure       → email, queues, third-party clients
```

**Rules:**
- Handlers validate input shape; services enforce business rules
- No SQL/ORM in route handlers
- AuthZ in service layer, not only at route edge
- External calls have timeouts and structured errors

## API design defaults

| Concern | Default |
|---------|---------|
| Errors | `{ success, error: { code, message, details? } }` + correct HTTP status |
| Lists | Cursor or offset pagination; never unbounded |
| Versioning | `/v1/` prefix or header when public API |
| Idempotency | `Idempotency-Key` for payments/writes |
| Validation | Schema at boundary (Zod, Pydantic, etc.) |

## Trade-offs to surface

| Decision | Options | Default for greenfield |
|----------|---------|------------------------|
| Architecture | Modular monolith vs microservices | Modular monolith until team/scale forces split |
| DB | PostgreSQL vs MongoDB | PostgreSQL unless document model is dominant |
| Cache | None vs in-process vs Redis | None first; Redis when measured need |
| Async | Sync handler vs job queue | Queue when work >500ms or retries needed |
| Consistency | Strong vs eventual | Strong for money/auth; eventual for analytics |

Document chosen trade-offs in ADR or plan using `trade-offs.mdc`.

## Scalability checklist

- [ ] Stateless app tier where possible
- [ ] Connection pooling for DB
- [ ] Indexes on hot query paths
- [ ] No N+1 queries
- [ ] Rate limits on auth and public endpoints
- [ ] Secrets from environment only

## Anti-patterns to reject

- Anemic domain — all logic in controllers
- God service class
- String-interpolated SQL
- Swallowed exceptions
- Distributed monolith (microservices sharing one DB with tight coupling)

## Output when architecting

Produce **Backend Architecture Note**:

1. Topology and module boundaries
2. API contract sketch (resources, auth)
3. Data model overview
4. Async/cache/retry strategy
5. Security and observability hooks
6. Phased rollout plan

## Additional reference

See [references/patterns.md](references/patterns.md).
