# Backend architecture pattern catalog

## Structural patterns

| Pattern | Use when |
|---------|----------|
| Modular monolith | Single deploy, clear module boundaries |
| Repository | Swap persistence; keep services testable |
| CQRS (light) | Read models differ heavily from writes |
| Outbox | Reliable event publish after DB commit |
| Saga | Multi-step distributed transactions |

## Integration patterns

| Pattern | Use when |
|---------|----------|
| Sync HTTP | Simple request/response, low fan-out |
| Message queue | Decouple, burst traffic, retries |
| Webhook + signature | Inbound third-party events |
| Polling fallback | When push unavailable |

## Data patterns

| Pattern | Use when |
|---------|----------|
| Soft delete | Audit/recovery requirements |
| Optimistic locking | Concurrent updates |
| Read replicas | Read-heavy, tolerate lag |
| Sharding | Proven scale bottleneck on one DB |

## Security patterns

- Fail closed on auth errors
- Least-privilege DB users per service
- Audit log for privileged operations
- Input validation at every boundary

## Observability

- Structured JSON logs with correlation/trace ID
- Metrics: rate, errors, latency (p50/p95/p99)
- Health: liveness vs readiness endpoints
