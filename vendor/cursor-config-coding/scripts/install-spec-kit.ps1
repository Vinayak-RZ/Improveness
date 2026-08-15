# Install GitHub Spec Kit (.specify) into a code project
# Skills are already in this coding config (.cursor/skills/speckit-*).
# This script scaffolds .specify/ (templates + scripts) in the TARGET repo.
#
# Usage:
#   .\scripts\install-spec-kit.ps1 -Target "D:\Startups\MyApp"
#   .\scripts\install-spec-kit.ps1 -Target "D:\Startups\MyApp" -Tag "v0.12.11"
#
# Requires: uv (https://docs.astral.sh/uv/) — installed automatically if missing.

param(
    [Parameter(Mandatory = $true)]
    [string]$Target,

    [string]$Tag = "v0.12.11"
)

$ErrorActionPreference = "Stop"

function Ensure-UvOnPath {
    $candidates = @(
        (Join-Path $env:USERPROFILE ".local\bin"),
        (Join-Path $env:USERPROFILE ".cargo\bin")
    )
    foreach ($p in $candidates) {
        if (Test-Path (Join-Path $p "uv.exe")) {
            $env:Path = "$p;$env:Path"
        }
    }
}

Ensure-UvOnPath

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "Installing uv..."
    irm https://astral.sh/uv/install.ps1 | iex
    Ensure-UvOnPath
}

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Error "uv not found after install. Restart the shell and retry."
}

if (-not (Test-Path $Target)) {
    Write-Error "Target path does not exist: $Target"
}

$specifyCmd = Get-Command specify -ErrorAction SilentlyContinue
if (-not $specifyCmd) {
    Write-Host "Installing specify-cli@$Tag ..."
    uv tool install specify-cli --from "git+https://github.com/github/spec-kit.git@$Tag"
    Ensure-UvOnPath
}

if (-not (Get-Command specify -ErrorAction SilentlyContinue)) {
    Write-Error "specify CLI not on PATH. Ensure uv tool bin dir is on PATH, then retry."
}

$specifyDir = Join-Path $Target ".specify"
$cursorLink = Join-Path $Target ".cursor"

Write-Host "Target: $Target"
Write-Host "Pinned Spec Kit: $Tag"

Push-Location $Target
try {
    # --force: allow init when directory already has files / linked .cursor
    # Skills land under .cursor/skills — if .cursor is a junction to coding config,
    # that refreshes shared skills (desired). .specify is created in the target repo.
    specify init . --here --force --integration cursor-agent --script ps --ignore-agent-tools
}
finally {
    Pop-Location
}

if (-not (Test-Path $specifyDir)) {
    Write-Error "install finished but .specify was not created under $Target"
}

Write-Host ""
Write-Host "Spec Kit ready."
Write-Host "  .specify/  -> $specifyDir"
if (Test-Path $cursorLink) {
    Write-Host "  .cursor/   -> $cursorLink (skills: speckit-*)"
}
Write-Host ""
Write-Host "In Cursor Agent, start with: /speckit-constitution  then  /speckit-specify"
Write-Host "Guide: docs/SPEC_KIT.md in cursor-config-coding"
