# Scaffold GitHub Spec Kit (.specify) into a code project.
# speckit-* skills already live in this coding config. Do not run specify init
# --force against a junctioned .cursor — that would write into the config repo.
#
# Usage:
#   .\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp"
#   .\scripts\install-spec-kit.ps1 -Target "D:\Startups\YourApp" -Tag "v1.0.6"
#
# Requires: uv (https://docs.astral.sh/uv/) — installed automatically if missing.

param(
    [Parameter(Mandatory = $true)]
    [string]$Target,

    [string]$Tag = "v1.0.6"
)

$ErrorActionPreference = "Stop"

function Test-IsJunction([string]$Path) {
    if (-not (Test-Path $Path)) { return $false }
    $item = Get-Item $Path -Force
    return [bool]($item.Attributes -band [IO.FileAttributes]::ReparsePoint)
}

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

$cursorLink = Join-Path $Target ".cursor"
$specifyDir = Join-Path $Target ".specify"

if (Test-IsJunction $cursorLink) {
    Write-Host "Note: $cursorLink is a junction. Skills stay in the coding config."
    Write-Host "This script copies .specify only — it will not specify-init into that junction."
}

Write-Host "Target: $Target"
Write-Host "Pinned Spec Kit: $Tag"

$tmp = Join-Path $env:TEMP ("spec-kit-scaffold-" + [guid]::NewGuid().ToString("n"))
New-Item -ItemType Directory -Path $tmp | Out-Null
try {
    Push-Location $tmp
    try {
        git init -q
        specify init . --here --force --non-interactive --integration cursor-agent --script ps --ignore-agent-tools
    }
    finally {
        Pop-Location
    }

    $fromSpecify = Join-Path $tmp ".specify"
    if (-not (Test-Path $fromSpecify)) {
        Write-Error "specify init did not create .specify in the temp scaffold"
    }
    if (-not (Test-Path $specifyDir)) {
        Copy-Item -Path $fromSpecify -Destination $specifyDir -Recurse
    }
    else {
        Write-Host "Merging templates into existing $specifyDir"
        Copy-Item -Path (Join-Path $fromSpecify "*") -Destination $specifyDir -Recurse -Force
    }
}
finally {
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}

if (-not (Test-Path $specifyDir)) {
    Write-Error "install finished but .specify was not created under $Target"
}

Write-Host ""
Write-Host "Spec Kit ready."
Write-Host "  .specify/  -> $specifyDir"
if (Test-Path $cursorLink) {
    Write-Host "  .cursor/   -> $cursorLink (use vendored speckit-* skills; do not overwrite a junction)"
}
Write-Host ""
Write-Host "In Cursor Agent, start with: /speckit-constitution  then  /speckit-specify"
Write-Host "Guide: docs/SPEC_KIT.md in cursor-config-coding"
Write-Host "Legacy: /speckit-taskstoissues is still vendored; prefer GitHub issues from tasks when upstream drops it."
