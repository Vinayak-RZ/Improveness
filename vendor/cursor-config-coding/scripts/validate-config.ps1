# Validate cursor-config-coding invariants (skills, always-on budget, Spec Kit pin).
# Usage: .\scripts\validate-config.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$failed = 0

function Fail([string]$msg) {
    Write-Host "FAIL: $msg" -ForegroundColor Red
    $script:failed++
}

function Ok([string]$msg) {
    Write-Host "ok  : $msg"
}

$manifestPath = Join-Path $root "skills-manifest.json"
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$expectedSkills = [int]$manifest.preinstalled.count
$skillDirs = Get-ChildItem (Join-Path $root ".cursor\skills") -Directory |
    Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") }
$skillCount = @($skillDirs).Count
if ($skillCount -ne $expectedSkills) {
    Fail "skill count $skillCount != manifest.preinstalled.count $expectedSkills"
}
else {
    Ok "skill count $skillCount"
}

$alwaysOnNames = New-Object System.Collections.Generic.List[string]
$alwaysOnLines = 0
Get-ChildItem (Join-Path $root ".cursor\rules") -Filter "*.mdc" | ForEach-Object {
    $text = Get-Content $_.FullName -Raw
    if ($text -match '(?m)^alwaysApply:\s*true\s*$') {
        $alwaysOnNames.Add($_.BaseName)
        $alwaysOnLines += @($text -split "`n").Count
    }
}
$expectedAlways = @("ai-anti-patterns", "ponytail", "rule-awareness")
$got = $alwaysOnNames | Sort-Object
$want = $expectedAlways | Sort-Object
if (($got -join ",") -ne ($want -join ",")) {
    Fail "alwaysApply true = [$($got -join ', ')] expected [$($want -join ', ')]"
}
else {
    Ok "always-on rules: $($got -join ', ')"
}
$lineBudget = 120
if ($alwaysOnLines -gt $lineBudget) {
    Fail "always-on line count $alwaysOnLines > budget $lineBudget"
}
else {
    Ok "always-on lines $alwaysOnLines (<= $lineBudget)"
}

$pin = "v1.0.6"
$pinFiles = @(
    "skills-manifest.json",
    "docs\SPEC_KIT.md",
    ".cursor\skills\speckit-SOURCE.txt",
    "scripts\install-spec-kit.ps1"
)
foreach ($rel in $pinFiles) {
    $p = Join-Path $root $rel
    $t = Get-Content $p -Raw
    if ($t -notmatch [regex]::Escape($pin)) {
        Fail "$rel missing pin $pin"
    }
    if ($rel -ne "docs\SPEC_KIT.md" -and $t -match "v0\.12\.11") {
        Fail "$rel still mentions v0.12.11"
    }
}
Ok "Spec Kit pin $pin in script/manifest/source"

$lite = Join-Path $root ".cursor\skills\nawab-plans\PLAN.template.lite.md"
if (-not (Test-Path $lite)) {
    Fail "missing nawab lite template"
}
else {
    Ok "nawab PLAN.template.lite.md exists"
}

$readme = Get-Content (Join-Path $root "README.md") -Raw
if ($readme -match "19 \.mdc") {
    Fail "README still says 19 .mdc files"
}
else {
    Ok "README does not say 19 .mdc"
}

$banned = @("Improveness", "Chatbot-api", "Unagent", "Stamped-scale", "D:\Tech")
Get-ChildItem (Join-Path $root ".cursor\skills") -Recurse -Include "SKILL.md", "templates.md", "examples.md" | ForEach-Object {
    $t = Get-Content $_.FullName -Raw
    foreach ($b in $banned) {
        if ($t.Contains($b)) {
            Fail "$($_.FullName.Substring($root.Length+1)) names '$b' (skills must stay portable)"
        }
    }
}
Ok "skills have no named-gold-repo strings"

if ($failed -gt 0) {
    Write-Host "`n$failed check(s) failed." -ForegroundColor Red
    exit 1
}
Write-Host "`nvalidate-config: all checks passed." -ForegroundColor Green
exit 0
