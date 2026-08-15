# Tech Stack Skills Catalog

Use this document when working in a **specific stack**. Skills listed here are **not pre-installed** by default (except Next.js). Install on demand into `.cursor/skills/` for the current project, or ask the user to run the install script.

**Pre-installed in this config:** `nextjs-app-router-patterns` only (stack-specific). Core skills (`graphify`, `impeccable`, `gsap-*`, `find-skills`) are always available.

## How the agent should use this

1. Detect the project's stack from `package.json`, `pubspec.yaml`, `build.gradle.kts`, etc.
2. Read the matching section below.
3. If a recommended skill is missing from `.cursor/skills/`, run the install command or tell the user to run `scripts/install-catalog-skill.ps1 -Name <skill-name>`.
4. Do **not** install every skill in a row — pick the 1–2 most relevant for the current task.

---

## Next.js (pre-installed + optional)

| Priority | Skill | Installs | Status | Install |
|----------|-------|----------|--------|---------|
| **Primary** | `nextjs-app-router-patterns` | 20.7K | **Pre-installed** | — |
| Recommended | `vercel-react-best-practices` | 467K | Optional | `npx skills add vercel-labs/agent-skills@vercel-react-best-practices -y --copy` |
| Recommended | `clerk-nextjs-patterns` | 16.6K | Optional | `npx skills add clerk/skills@clerk-nextjs-patterns -y --copy` |
| Optional | `nextjs-best-practices` | 5.9K | Optional | `npx skills add sickn33/antigravity-awesome-skills@nextjs-best-practices -y --copy` |
| Optional | `nextjs-react-typescript` | 3.6K | Optional | `npx skills add mindrally/skills@nextjs-react-typescript -y --copy` |
| Optional | `seo-aeo-best-practices` | — | Optional | Copy from `~/.agents/skills/seo-aeo-best-practices` or install via catalog |

**Also use (pre-installed):** `impeccable` (UI polish), `gsap-framer-scroll-animation` (scroll/motion), `graphify` (map codebase before large refactors).

---

## React (without Next.js)

| Priority | Skill | Installs | Install |
|----------|-------|----------|---------|
| **Primary** | `vercel-react-best-practices` | 467K | `npx skills add vercel-labs/agent-skills@vercel-react-best-practices -y --copy` |
| Recommended | `vercel-react-view-transitions` | 54.8K | `npx skills add vercel-labs/agent-skills@vercel-react-view-transitions -y --copy` |
| Recommended | `react-nextjs-patterns` | 284 | `npx skills add duyet/claude-plugins@react-nextjs-patterns -y --copy` |
| Optional | `nextjs-framer-motion-animations` | — | Copy from `~/.agents/skills/nextjs-framer-motion-animations` |

**Also use (pre-installed):** `impeccable`, `gsap-react`, `gsap-core`, `graphify`.

---

## Flutter

| Priority | Skill | Installs | Install |
|----------|-------|----------|---------|
| **Primary** | `flutter-apply-architecture-best-practices` | 16.3K | `npx skills add flutter/skills@flutter-apply-architecture-best-practices -y --copy` |
| Recommended | `flutter-build-responsive-layout` | 15.9K | `npx skills add flutter/skills@flutter-build-responsive-layout -y --copy` |
| Recommended | `flutter-fix-layout-issues` | 15.4K | `npx skills add flutter/skills@flutter-fix-layout-issues -y --copy` |

**Also use (pre-installed):** `graphify` (docs/architecture mapping). No GSAP — use Flutter-native animation patterns.

---

## Kotlin

| Priority | Skill | Installs | Install |
|----------|-------|----------|---------|
| **Primary** | `kotlin-springboot` | 9.1K | `npx skills add github/awesome-copilot@kotlin-springboot -y --copy` |
| Recommended | `create-spring-boot-kotlin-project` | 8.5K | `npx skills add github/awesome-copilot@create-spring-boot-kotlin-project -y --copy` |
| Optional | `kotlin-mcp-server-generator` | 8.5K | `npx skills add github/awesome-copilot@kotlin-mcp-server-generator -y --copy` |

**Also use (pre-installed):** `graphify` for codebase exploration.

---

## Django

| Priority | Skill | Installs | Install |
|----------|-------|----------|---------|
| **Primary** | `django-patterns` | 6.2K | `npx skills add affaan-m/everything-claude-code@django-patterns -y --copy` |
| Recommended | `django-security` | 5.8K | `npx skills add affaan-m/everything-claude-code@django-security -y --copy` |
| Recommended | `django-tdd` | 5.3K | `npx skills add affaan-m/everything-claude-code@django-tdd -y --copy` |

**Also use (pre-installed):** `graphify`.

---

## Express / Node.js

| Priority | Skill | Installs | Install |
|----------|-------|----------|---------|
| **Primary** | `node` | 3.8K | `npx skills add mcollina/skills@node -y --copy` |
| Recommended | `express` | 73 | `npx skills add teachingai/full-stack-skills@express -y --copy` |
| Optional | `senior-architect` | 836 | `npx skills add davila7/claude-code-templates@senior-architect -y --copy` |

**Also use (pre-installed):** `graphify`.

---

## Install helper

From a project linked to this coding config:

```powershell
.\scripts\install-catalog-skill.ps1 -Package "vercel-labs/agent-skills@vercel-react-best-practices"
```

Installs into the **current project's** `.cursor/skills/` (not global).
