# build_exe_installer.ps1
# Packages the extension into a native Windows Executable (EmojiToPNG_Installer.exe) 

$ErrorActionPreference = "Stop"

Write-Host "Packaging Emoji to PNG..."
$items = "index.html", "style.css", "app.js", "emoji-data.js", "CSInterface.js", "CSXS", "host"
$tempZip = "$env:TEMP\emojitopng_build.zip"

if (Test-Path $tempZip) { Remove-Item $tempZip }
Compress-Archive -Path $items -DestinationPath $tempZip -Force

Write-Host "Encoding payload into C# source..."
$bytes = [IO.File]::ReadAllBytes($tempZip)
$b64 = [Convert]::ToBase64String($bytes)
Remove-Item $tempZip

$csCode = Get-Content -Raw "Installer.cs"
$csCode = $csCode -replace 'BASE64_PLACEHOLDER', $b64
Set-Content "Installer_temp.cs" $csCode

if (-not (Test-Path "dist")) { New-Item -ItemType Directory "dist" | Out-Null }

Write-Host "Compiling Executable with csc.exe..."
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
& $csc /nologo /target:winexe /out:dist\EmojiToPNG_Installer.exe /reference:System.IO.Compression.FileSystem.dll /reference:System.Windows.Forms.dll Installer_temp.cs

Remove-Item "Installer_temp.cs"

Write-Host "Done! Executable created at: $(Get-Location)\dist\EmojiToPNG_Installer.exe"
