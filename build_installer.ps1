# build_installer.ps1
# This script bundles the extension into a single standalone self-extracting .bat installer

$ErrorActionPreference = "Stop"

Write-Host "Packaging Emoji to PNG..."
$items = "index.html","style.css","app.js","emoji-data.js","CSInterface.js","CSXS","host"
$tempZip = "$env:TEMP\emojitopng_build.zip"

if (Test-Path $tempZip) { Remove-Item $tempZip }
Compress-Archive -Path $items -DestinationPath $tempZip -Force

Write-Host "Encoding payload..."
$bytes = [IO.File]::ReadAllBytes($tempZip)
$b64 = [Convert]::ToBase64String($bytes)
Remove-Item $tempZip

Write-Host "Generating EmojiToPNG_Installer.bat..."

$batContent = @"
@echo off
setlocal DisableDelayedExpansion

:: Check for Administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting Administrative Privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ============================================
echo   Installing Emoji to PNG Extension...
echo ============================================
echo.

set "TARGET=C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.dapkeakash9.emojitopng"
if exist "%TARGET%" (
    echo Removing old version...
    rmdir /s /q "%TARGET%"
)
mkdir "%TARGET%"

echo Extracting and Installing...
powershell -noprofile -c "`$f=Get-Content -LiteralPath '%~f0' -Raw; `$p=`$f.Substring(`$f.IndexOf('::PAYLOAD::')+11); `$b=[Convert]::FromBase64String(`$p.Trim()); `$t=[Environment]::GetEnvironmentVariable('TEMP')+'\epng.zip'; [IO.File]::WriteAllBytes(`$t, `$b); Expand-Archive -Path `$t -DestinationPath `$env:TARGET -Force; Remove-Item `$t"

echo.
echo ============================================
echo   SUCCESS! 
echo   Extension installed system-wide.
echo   Please restart Premiere Pro / After Effects.
echo ============================================
echo.
pause
exit /b

::PAYLOAD::
$b64
"@

$outPath = "$(Get-Location)\dist\EmojiToPNG_Installer.bat"
if (-not (Test-Path "$(Get-Location)\dist")) { New-Item -ItemType Directory -Path "$(Get-Location)\dist" | Out-Null }
[IO.File]::WriteAllText($outPath, $batContent)

Write-Host "Done! Installer created at: $outPath"
