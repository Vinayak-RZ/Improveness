#!/usr/bin/env bash
set -euo pipefail
rg -q 'export default function App' src/app.ts
