# Junction a code project's .cursor to this coding config (one-time per project)
# Usage: .\link-to-project.ps1 -Target "D:\Startups\YourApp"

param(
    [Parameter(Mandatory = $true)]
    [string]$Target
)

$ErrorActionPreference = "Stop"
$configRoot = Split-Path $PSScriptRoot -Parent
$cursorSource = Join-Path $configRoot ".cursor"
$cursorTarget = Join-Path $Target ".cursor"
$agentsTarget = Join-Path $Target "AGENTS.md"
$overlay = Join-Path $configRoot "templates\AGENTS.overlay.md"

if (-not (Test-Path $Target)) {
    Write-Error "Target path does not exist: $Target"
}

if (Test-Path $cursorTarget) {
    $backup = "$cursorTarget.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "Backing up existing .cursor to $backup"
    Rename-Item $cursorTarget $backup
}

cmd /c mklink /J "$cursorTarget" "$cursorSource"
if ($LASTEXITCODE -ne 0) {
    Write-Error "mklink failed. Run PowerShell as Administrator or enable Developer Mode."
}

Write-Host "Linked $cursorTarget -> $cursorSource"

if (-not (Test-Path $overlay)) {
    Write-Host "No templates/AGENTS.overlay.md — skip AGENTS.md seed."
    return
}

if (-not (Test-Path $agentsTarget)) {
    Copy-Item $overlay $agentsTarget
    Write-Host "Seeded $agentsTarget from templates/AGENTS.overlay.md — fill in this-repo notes."
    return
}

$existing = Get-Content $agentsTarget -Raw
Write-Host "Left existing AGENTS.md in place (never overwrite)."
