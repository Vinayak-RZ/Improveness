# Sync README + copywriting skills from this config into:
#   1. ~/.cursor/skills  (global)
#   2. local git repos that already contain those skill folders
#
# Usage:
#   .\scripts\sync-coding-skills.ps1
#   .\scripts\sync-coding-skills.ps1 -Roots "D:\Startups","D:\Tech"
#   .\scripts\sync-coding-skills.ps1 -WhatIf

param(
    [string[]]$Roots = @("D:\Startups", "D:\Tech"),
    [int]$Depth = 4,
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"
$configRoot = Split-Path $PSScriptRoot -Parent
$sourceSkills = Join-Path $configRoot ".cursor\skills"
$skillNames = @(
    "copywriting",
    "readme",
    "product-readme",
    "readable-readme",
    "extensive-readme"
)
$skipDirNames = @("node_modules", "external", ".git", "dist", ".next", "__pycache__")

function Test-IsJunction([string]$Path) {
    if (-not (Test-Path $Path)) { return $false }
    $item = Get-Item -LiteralPath $Path -Force
    return [bool]($item.Attributes -band [IO.FileAttributes]::ReparsePoint)
}

function Get-JunctionTarget([string]$Path) {
    $item = Get-Item -LiteralPath $Path -Force
    if ($item.Target) { return ($item.Target | Select-Object -First 1) }
    return $null
}

function Test-IsSourceClone([string]$Repo) {
    $name = Split-Path $Repo -Leaf
    return $name -eq "cursor-config-coding"
}

function Sync-SkillFolder([string]$Name, [string]$DestSkills) {
    $src = Join-Path $sourceSkills $Name
    $dst = Join-Path $DestSkills $Name
    if (-not (Test-Path $src)) {
        throw "Missing source skill: $src"
    }
    if ($WhatIf) {
        Write-Host "  whatif copy $Name -> $dst"
        return
    }
    if (Test-Path $dst) {
        Remove-Item -LiteralPath $dst -Recurse -Force
    }
    New-Item -ItemType Directory -Path (Split-Path $dst -Parent) -Force | Out-Null
    Copy-Item -LiteralPath $src -Destination $dst -Recurse -Force
}

function Find-GitRepos([string]$Root, [int]$Left) {
    Get-ChildItem -LiteralPath $Root -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
        if ($skipDirNames -contains $_.Name) { return }
        if (Test-Path -LiteralPath (Join-Path $_.FullName ".git")) {
            $_.FullName
        }
        if ($Left -gt 0) {
            Find-GitRepos $_.FullName ($Left - 1)
        }
    }
}

function Repo-HasOurSkills([string]$Repo) {
    $skills = Join-Path $Repo ".cursor\skills"
    foreach ($n in $skillNames) {
        if (Test-Path -LiteralPath (Join-Path $skills $n)) { return $true }
    }
    return $false
}

$copied = New-Object System.Collections.Generic.List[string]
$linked = New-Object System.Collections.Generic.List[string]
$skipped = New-Object System.Collections.Generic.List[string]

Write-Host "Source: $sourceSkills"

$globalSkills = Join-Path $env:USERPROFILE ".cursor\skills"
Write-Host "Global: $globalSkills"
if (-not (Test-Path $globalSkills) -and -not $WhatIf) {
    New-Item -ItemType Directory -Path $globalSkills -Force | Out-Null
}
foreach ($n in $skillNames) {
    Sync-SkillFolder $n $globalSkills
}
$copied.Add("global:$globalSkills")
Write-Host "Updated global skills."

$repos = @()
foreach ($root in $Roots) {
    if (-not (Test-Path $root)) {
        Write-Host "Skip missing root $root"
        continue
    }
    $repos += Find-GitRepos $root $Depth
}
$repos = $repos | Sort-Object -Unique

foreach ($repo in $repos) {
    if ([string]::Equals($repo, $configRoot, [StringComparison]::OrdinalIgnoreCase)) {
        $skipped.Add("source:$repo")
        continue
    }
    if (Test-IsSourceClone $repo) {
        $skipped.Add("other-clone-of-this-config:$repo")
        continue
    }
    if (-not (Repo-HasOurSkills $repo)) {
        continue
    }

    $cursor = Join-Path $repo ".cursor"
    if (Test-IsJunction $cursor) {
        $target = Get-JunctionTarget $cursor
        $linked.Add("$repo -> $target")
        continue
    }

    $destSkills = Join-Path $repo ".cursor\skills"
    foreach ($n in $skillNames) {
        Sync-SkillFolder $n $destSkills
    }
    $copied.Add($repo)
    Write-Host "Updated $repo"
}

Write-Host ""
Write-Host "Copied ($($copied.Count)):"
$copied | ForEach-Object { Write-Host "  $_" }
Write-Host "Already junctioned ($($linked.Count)):"
$linked | ForEach-Object { Write-Host "  $_" }
Write-Host "Skipped ($($skipped.Count)):"
$skipped | ForEach-Object { Write-Host "  $_" }
