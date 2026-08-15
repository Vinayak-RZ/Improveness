# Extensive README — pre-ship checklist

Run before delivering or merging README changes.

## Accuracy

- [ ] Every feature mentioned exists in the codebase (no invented capabilities)
- [ ] Env var names match `.env.example` or config module exactly
- [ ] Tool/API/endpoint counts verified from source (registry, routes, OpenAPI)
- [ ] File paths and module names are current
- [ ] Tech stack names match actual dependencies (no stale DB/vector store names)
- [ ] Version constraints match `package.json` / lockfile / `pyproject.toml`

## Structure

- [ ] Major sections numbered sequentially (`## 1.` … `## N.`)
- [ ] Subsections use `### N.M` matching parent
- [ ] Physical section order matches numeric order
- [ ] TOC links resolve to correct heading anchors
- [ ] Skipped sections omitted (no empty "TBD" placeholders)

## Diagrams

- [ ] Mermaid renders (valid syntax, ≤15 nodes per diagram)
- [ ] Diagrams match current architecture (no removed services)
- [ ] Split large diagrams into 2.1, 2.2 subsections if needed

## Usability

- [ ] New contributor can run project from Quickstart alone
- [ ] TL;DR captures differentiators in first screen
- [ ] Vision clarifies what the project is **not**
- [ ] Roadmap distinguishes shipped vs planned

## Maintenance

- [ ] Changelog row added if this update reflects shipped work
- [ ] Completed roadmap items moved to changelog
- [ ] Related code changes in same commit/PR as README update
