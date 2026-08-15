# MCP setup (Model Context Protocol)

MCP connects Cursor's agent to **live external tools**. This coding config ships with the **[Agent Patterns Catalog](https://www.agentpatternscatalog.org/)** MCP enabled by default — 421+ agentic patterns, recipes, anti-patterns, and glossary terms for architecture decisions.

## Default configuration

File: [`.cursor/mcp.json`](../.cursor/mcp.json)

```json
{
  "mcpServers": {
    "agent-patterns": {
      "url": "https://mcp.agentpatternscatalog.org/mcp"
    }
  }
}
```

When you **link** this config into a code project (`link-to-project.ps1`), `.cursor/mcp.json` is included automatically.

Minimal-code discipline uses **`ponytail.mdc` + the `ponytail` skill** — there is no Ponytail MCP in this config.

## Verify connection

1. Save `mcp.json` and **reload Cursor** (Command Palette → "Developer: Reload Window")
2. Open **Settings → Tools & MCP** — `agent-patterns` should show connected (green)
3. In Agent chat, ask: *"Find me memory patterns using the agent-patterns MCP."*
4. Expected tool call: `find_pattern(query="memory", limit=5)`

Troubleshooting: **Output panel → MCP Logs** for connection errors.

## When the agent should use MCP

| Task | MCP tool / prompt |
|------|-------------------|
| Design new agent/LLM feature | `recommend_recipe`, then expand composed patterns |
| Validate architecture | Compare design to catalog patterns + anti-patterns |
| Agent loops / hallucinated tools | `pattern_for_symptom` |
| ReAct vs plan-and-execute, etc. | `find_pattern` + compare related edges |
| Team vocabulary / ADRs | Cite stable **catalog pattern ids** |
| Learn agentic design | `glossary_term`, walk recipes from a seed pattern |

Rule: [`.cursor/rules/mcp-architecture.mdc`](../.cursor/rules/mcp-architecture.mdc)  
Skill: `agentic-system-design` (MCP section)

**Prefer MCP catalog data over guessing** when designing or reviewing agentic systems.

## Example prompts

### Scaffold an agent

```text
Use the agent-patterns MCP: recommend a recipe for a support-ticket triage agent.
Expand each composed pattern and explain why it fits. Cite pattern ids.
```

### De-risk a design

```text
Here is our agent architecture [paste]. Via agent-patterns MCP:
which patterns do we implement, which are missing, and which anti-patterns apply?
```

### Symptom diagnosis

```text
Our agent keeps looping on the same step. Use pattern_for_symptom via MCP
and give concrete fixes.
```

## Optional MCP servers

See [mcp-catalog.json](./mcp-catalog.json) and [`.cursor/mcp.json.example`](../.cursor/mcp.json.example).

| Server | Purpose | Auth |
|--------|---------|------|
| **agent-patterns** (default) | Agentic architecture patterns | None |
| **context7** | Live framework/library docs | `CONTEXT7_API_KEY` |
| **github** | Issues, PRs, repo search | `GITHUB_PERSONAL_ACCESS_TOKEN` |

Add optional servers to `.cursor/mcp.json` — merge with existing `mcpServers` object.

```json
{
  "mcpServers": {
    "agent-patterns": {
      "url": "https://mcp.agentpatternscatalog.org/mcp"
    },
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

Use `${env:VAR}` — never commit secrets. Set env vars in your shell or system.

## Global vs project MCP

| Location | Scope |
|----------|-------|
| `.cursor/mcp.json` in this repo (or linked project) | Project — **recommended** (version-controlled) |
| `~/.cursor/mcp.json` | Global — all workspaces |

Project config wins when both define the same server name.

## Cloud agents

Cloud agents can use MCP servers configured for the environment. Commit `.cursor/mcp.json` in the app repo so cloud runs inherit **agent-patterns** when the remote endpoint is reachable.

Hosted HTTP MCP (like Agent Patterns Catalog) works without local install. Stdio servers (e.g. GitHub CLI) require runtime setup on the cloud VM.

## Security

- Only add MCP servers from **trusted sources**
- Use env vars for tokens (`${env:...}`)
- Review tool approvals before running sensitive MCP calls
- Audit shared repos — `.cursor/mcp.json` is executed by Cursor on load

## References

- [Agent Patterns Catalog — Use from your agent](https://www.agentpatternscatalog.org/use/)
- [MCP pattern in catalog](https://www.agentpatternscatalog.org/patterns/mcp/)
- [Cursor MCP docs](https://cursor.com/docs/context/mcp)
