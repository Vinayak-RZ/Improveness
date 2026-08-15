# Frontend architecture pattern catalog

## Component patterns

| Pattern | Use when |
|---------|----------|
| Container/Presentational | Separating data from UI in complex features |
| Compound components | Tabs, accordions, selects with shared context |
| Render props / slots | Flexible layout composition (Next.js `children`, named slots) |
| Headless + styled | Reusable behavior (Radix) + your design system |

## Next.js App Router

| Pattern | Use when |
|---------|----------|
| Server Component default | Data display, SEO, zero-JS pages |
| Client Component boundary | Hooks, browser APIs, animation, forms with instant feedback |
| Parallel routes | Dashboard sections loading independently |
| Intercepting routes | Modals over list/detail |
| Route groups `(group)` | Organize without affecting URL |
| `loading.tsx` / `error.tsx` | Route-level suspense and recovery |

## State patterns

| Pattern | Use when |
|---------|----------|
| URL as state | Filters, pagination, shareable views |
| Server cache (RSC) | Read-heavy, low mutation |
| Optimistic updates | Like/follow/cart — with rollback |
| Form state machine | Multi-step wizards |

## Performance

- Prefer `next/image`, font optimization, dynamic `import()`
- Virtualize long lists
- Defer non-critical JS; respect `prefers-reduced-motion`
- Measure LCP/CLS before animation work
