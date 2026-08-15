# Agentic system pattern catalog

## Orchestration patterns

| Pattern | Use when |
|---------|----------|
| Single-shot | Classification, extraction, one-off generation |
| Pipeline | Retrieve → reason → format (fixed stages) |
| ReAct loop | Dynamic tool choice with step cap |
| Supervisor + workers | Fan-out subtasks with merge |
| Human-in-the-loop | Approvals for irreversible actions |

## Tool design

- One tool = one capability; strict JSON schema
- Idempotent tools where retries happen
- Read-only tools default; write tools need explicit policy
- Return errors the model can act on

## RAG patterns

| Pattern | Use when |
|---------|----------|
| Semantic chunking | Docs, prose |
| Code-aware chunking | Repositories |
| Hybrid retrieval | Keyword + vector for production |
| Relevance gate | Min score; else "insufficient context" |

## Memory patterns

| Type | Use when |
|------|----------|
| Session summary | Long chats; compress older turns |
| User profile store | Preferences across sessions |
| Episodic log | Audit and debugging |

## Eval patterns

- Golden set before first integration
- CI eval on prompt/skill changes
- Red team: injection, jailbreak, out-of-scope
- Track cost per successful task

## Cursor-specific

- Project skills in `.cursor/skills/` for cloud agents
- Rules for invariants; skills for workflows
- Hooks for deterministic enforcement (format, block dangerous shell)
