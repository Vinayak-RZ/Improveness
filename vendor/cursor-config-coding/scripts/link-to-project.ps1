# Junction a code project's .cursor to this coding config (one-time per project)
# Usage: .\link-to-project.ps1 -Target "D:\Startups\Stamped_Energy\Main_Website"

param(
    [Parameter(Mandatory = $true)]
    [string]$Target
)

$ErrorActionPreference = "Stop"
$configRoot = Split-Path $PSScriptRoot -Parent
$cursorSource = Join-Path $configRoot ".cursor"
$cursorTarget = Join-Path $Target ".cursor"

if (-not (Test-Path $Target)) {
    Write-Error "Target path does not exist: $Target"
}

if (Test-Path $cursorTarget) {
    $backup = "$cursorTarget.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "Backing up existing .cursor to $backup"
    Rename-Item $cursorTarget $backup
}

cmd /c mklink /J "$cursorTarget" "$cursorSource"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Linked $cursorTarget -> $cursorSource"
    Write-Host "Keep project-specific notes in $Target\AGENTS.md (thin override)."
} else {
    Write-Error "mklink failed. Run PowerShell as Administrator or enable Developer Mode."
}
