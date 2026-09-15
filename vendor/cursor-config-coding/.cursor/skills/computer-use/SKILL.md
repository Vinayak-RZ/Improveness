---
name: computer-use
description: >
  Codex-style computer-use harness for Cursor. Use when the agent must operate
  a GUI or browser: click, type, fill a form, verify in the browser, drive
  Chrome, snapshot a page, reproduce a UI bug, or the user says use the
  computer / computer use / desktop GUI. Pick the narrowest interface. Cursor
  has no full-desktop CUA. Prefer API and files, then the Cursor IDE browser,
  then agent-browser. Never claim OS-wide click/type.
---

# Computer use

Policy skill. Tool skill is **agent-browser**. This skill **wins** when the
Cursor IDE browser is enough — do not prefer agent-browser over the IDE
browser by default.

Codex ladder, mapped to this lab: plugins/API first, then isolated browser,
then signed-in Chrome, then desktop last. Cursor has no `@Computer`.

## Ladder (stop at the first rung that holds)

1. **API, CLI, curl, or repo files.** If the answer is in the tree, a script,
   or an HTTP API, do not open a browser.
2. **Cursor IDE browser.** Localhost and public pages: navigate, snapshot,
   click, type. Verify **behavior**, not one screenshot. This is Codex
   built-in / `@Browser`.
3. **agent-browser.** Real Chrome/CDP, logged-in profile, Electron app, or
   a11y-tree `@eN` refs. Load `.cursor/skills/agent-browser/SKILL.md`, then
   `agent-browser skills get core --full`. CLI if missing:
   `npm i -g agent-browser && agent-browser install`. This is Codex `@Chrome`.
4. **Full-desktop CUA.** **Not available in Cursor.** Stop. Tell the user.
   Do not fake OS click/type. Do not install unofficial desktop-CUA MCPs.

## Always

- Snapshot or screenshot **after each** action. Prefer accessibility refs
  (`@eN`, snapshot refs) over pixel coordinates.
- Hard step limit. If four attempts fail or the page blocks (login, captcha,
  passkey, payment), stop and report. Do not wait-action-wait loops.
- Human checkpoint **before** login, payments, submit, send, or any
  destructive UI. Treat approved clicks as the user's account.
- Iframes and native OS windows are out of scope for the IDE browser.

## Do not

- Vendor or enable macOS/Windows Computer Use MCPs as default.
- Use Python `browser-use` or Playwright as the lab default.
- Claim you can operate Finder, Explorer, or arbitrary desktop apps.
