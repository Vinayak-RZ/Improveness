# Install an optional catalog skill into the current project's .cursor/skills/
# Usage:
#   .\install-catalog-skill.ps1 -Package "vercel-labs/agent-skills@vercel-react-best-practices"
#   .\install-catalog-skill.ps1 -Package "flutter/skills@flutter-apply-architecture-best-practices" -ProjectRoot "D:\Startups\MyApp"

param(
    [Parameter(Mandatory = $true)]
    [string]$Package,
    [string]$ProjectRoot = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$skillsDir = Join-Path $ProjectRoot ".cursor\skills"
if (-not (Test-Path $skillsDir)) {
    New-Item -ItemType Directory -Path $skillsDir -Force | Out-Null
}

$tmpdir = Join-Path $env:TEMP "skill-install-$(Get-Random)"
New-Item -ItemType Directory -Path $tmpdir -Force | Out-Null
Set-Location $tmpdir

Write-Host "Installing $Package into $skillsDir ..."
npx skills add $Package -y --copy 2>&1

# skills CLI may install to .agents/skills — copy skill folder to project
$skillName = ($Package -split '@')[-1]
$agentsPath = Join-Path $env:USERPROFILE ".agents\skills\$skillName"
if (Test-Path $agentsPath) {
    $target = Join-Path $skillsDir $skillName
    if (Test-Path $target) { Remove-Item $target -Recurse -Force }
    Copy-Item $agentsPath $target -Recurse -Force
    Write-Host "Copied to $target"
} else {
    Write-Host "Check $skillsDir — skill may already be in project from npx skills."
}

Remove-Item $tmpdir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Done."
