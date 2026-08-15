---
name: frontend-architecture
description: Guides frontend architecture decisions for React, Next.js, and modern SPAs — component boundaries, state, data fetching, rendering strategy, and design-system structure. Use when designing or refactoring UI architecture, choosing state management, planning folder structure, or evaluating SSR/CSR/ISR trade-offs.
---

# Frontend Architecture

Apply this skill before large UI refactors, new feature modules, or greenfield frontend work.

## Decision checklist

Before coding, answer:

1. **Rendering model** — SSR, SSG, ISR, CSR, or hybrid? (Next.js App Router defaults vs client islands)
2. **State ownership** — server state vs UI state vs URL state vs form state
3. **Component layers** — primitives → compounds → features → pages
4. **Data boundary** — where fetching, caching, and mutations live
5. **Styling system** — tokens, variants, responsive/motion strategy
6. **Error/loading/empty** — per-route and per-component contracts

## Core patterns (default recommendations)

| Concern | Default | When to deviate |
|---------|---------|-----------------|
| Next.js data | Server Components + fetch in RSC; client only for interactivity | Heavy realtime → client + WebSocket |
| Client state | `useState` / `useReducer` locally; Context for rare shared UI | Cross-cutting client state → Zustand/Jotai |
| Server state | React Query / SWR for client-fetched data | RSC-only app → skip client cache libs |
| Forms | React Hook Form + Zod | Simple forms → native + server actions |
| Styling | Design tokens + Tailwind/CSS modules | Large design system → component library layer |
| Animation | GSAP for scroll/timelines; CSS for micro-interactions | Component transitions → Framer Motion (install from catalog) |

## Layer boundaries

```text
app/ or pages/          → routing, layouts, metadata, thin composition
features/<name>/        → feature UI + hooks + feature-specific types
components/ui/          → dumb primitives (no business logic)
components/             → shared composites
lib/                    → pure utilities, API clients, validators
server/ or actions/     → server actions, data access (Next.js)
```

**Rules:**
- UI components do not import DB or env secrets
- Data fetching in one place per feature (not scattered in leaves)
- No prop-drilling beyond 2 levels — lift to context or composition

## Trade-offs to surface explicitly

Always present options when choosing:

| Decision | Option A | Option B | Default |
|----------|----------|----------|---------|
| Rendering | SSR (fresh, SEO) | CSR (interactive, simpler deploy) | SSR/SSG for marketing; CSR islands for dashboards |
| State | Global store | Colocated state | Colocated until proven shared |
| Styling | Utility-first | CSS modules | Utility + tokens for speed |
| Bundle size | Lazy routes/components | Eager load | Lazy for heavy routes |
| Forms | Server Actions | Client API | Server Actions when on Next.js |

Use the `<TRADEOFF>` block format from `trade-offs.mdc` for non-obvious choices.

## Anti-patterns to reject

- Business logic in presentational components
- Fetching in `useEffect` when RSC or server action suffices (Next.js)
- God components >300 lines without extraction plan
- Inline styles for design-system values that should be tokens
- Animation on layout properties (width/height/top) — use transforms

## Output when architecting

Produce a short **Frontend Architecture Note** (`docs/frontend-architecture.md` or in plan):

1. Rendering and routing approach
2. Folder/module layout
3. State and data-fetch strategy
4. Key trade-offs chosen and rejected
5. Migration phases (if refactor)

## Additional reference

See [references/patterns.md](references/patterns.md) for pattern catalog and Next.js-specific notes.
