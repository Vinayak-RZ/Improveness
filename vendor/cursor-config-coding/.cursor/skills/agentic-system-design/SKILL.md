---
name: agentic-system-design
description: Guides architecture for AI agent systems — tool use, memory, RAG, orchestration, guardrails, evals, and cost/latency trade-offs. Use when building Cursor automations, LLM features, multi-step agents, MCP integrations, or SDK-based agent pipelines.
---

# Agentic System Design

Apply when designing features where an LLM plans, calls tools, or runs multi-step workflows.

## Decision checklist

1. **Autonomy level** — single call vs chained vs autonomous loop
2. **Tool surface** — strict schemas, idempotency, human checkpoints
3. **Context** — what goes in prompt vs retrieved vs persisted memory
4. **Model tier** — small/fast vs large/capable per step
5. **Failure** — retries, fallbacks, "I don't know" vs hallucination
6. **Safety** — irreversible actions, PII, injection resistance
7. **Quality** — eval dataset, regression gates, cost caps

## Reference architecture

```text
User / trigger
    → Orchestrator (workflow state, step limit)
        → Policy / guardrails (rules, hooks, allowlists)
        → Context builder (RAG, memory, tool results)
        → Model call (bounded tokens, structured output)
        → Tool executor (timeout, audit log, idempotent tools)
        → Response / artifact
```

## Layer responsibilities

| Layer | Owns |
|-------|------|
| Orchestrator | Step budget, branching, human-in-the-loop gates |
| Tools | Narrow contracts; no business logic in tool definitions |
| Memory | Session vs persistent; namespace by user/tenant |
| RAG | Chunking, retrieval threshold, citations |
| Evals | Golden tasks, adversarial prompts, cost/latency metrics |

## Trade-offs to surface

| Decision | Options | Default |
|----------|---------|---------|
| Autonomy | Human-in-loop vs full auto | Human-in-loop for irreversible/money/shared state |
| Chaining | Single prompt vs multi-step | Multi-step when phases have different model needs |
| Memory | In-context only vs external store | External for long sessions; summarize into context |
| RAG vs fine-tune | Dynamic knowledge vs baked-in style | RAG for facts; fine-tune rarely for format/tone only |
| Runtime | API-hosted vs self-hosted | API for most products until cost/privacy forces self-host |

## MCP: Agent Patterns Catalog (use when connected)

This config includes `.cursor/mcp.json` → [Agent Patterns Catalog](https://www.agentpatternscatalog.org/) (`https://mcp.agentpatternscatalog.org/mcp`).

**Before finalizing agent architecture**, query MCP when available:

| Goal | Tool |
|------|------|
| Pick a structure | `recommend_recipe` |
| Lookup patterns | `find_pattern` |
| Debug misbehavior | `pattern_for_symptom` |
| Shared vocabulary | `glossary_term` |

Cite **catalog pattern ids** in design docs and ADRs. See [docs/MCP_SETUP.md](../../../docs/MCP_SETUP.md).

Example: *"Recommend a recipe for a code-review agent, expand patterns, list anti-patterns."*

## Guardrails (required)

- Hard **max steps** per agent loop
- **Explicit schemas** for every tool input/output
- **No unbounded** generation tokens
- Log: model, tokens, latency, tool calls, outcome
- **Checkpoint** before: delete, pay, send email, deploy
- Treat user content as untrusted (prompt injection)

## Anti-patterns to reject

- Unbounded agent loops
- Tools that can run shell without approval
- Sending PII to external models without policy
- No eval suite before shipping
- Business logic duplicated inside prompts instead of code
- Silent tool failure / fabricated tool results

## Output when architecting

Produce **Agentic System Design Note**:

1. Autonomy diagram (human vs agent steps)
2. Tool list with contracts and idempotency
3. Context/memory/RAG strategy
4. Model selection per step
5. Eval plan (≥20 cases: happy, edge, adversarial)
6. Cost and latency budgets

## Additional reference

See [references/patterns.md](references/patterns.md).
