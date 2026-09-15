# cursor-config-coding pin

- **Upstream:** https://github.com/Vinayak-RZ/cursor-config-coding
- **Branch:** main
- **SHA:** `45a585d4a6f81afa43d5176030627e3d6f4dd1b6`
- **Date:** 2026-09-14T17:23:28+05:30
- **Tip subject:** chore: sweep leftover 42 / speckit-* / gsap-* claims

Refresh:

```text
git clone --depth 1 https://github.com/Vinayak-RZ/cursor-config-coding.git /tmp/cursor-config-coding
rm -rf vendor/cursor-config-coding
mkdir -p vendor/cursor-config-coding
tar -C /tmp/cursor-config-coding --exclude .git -cf - . | tar -C vendor/cursor-config-coding -xf -
# copy .cursor/skills and .cursor/rules into the project; keep project mcp.json
```

Previous Improveness vendor overlay was the 2026 audit commit `221fda0`. This pin is upstream `45a585d`.
