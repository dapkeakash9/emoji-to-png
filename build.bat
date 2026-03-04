@echo off
REM =============================================
REM Emoji to PNG - ZXP Build Script
REM =============================================
REM This script packages the extension into a signed .zxp file.
REM Requirements: ZXPSignCmd.exe and cert.p12 in the tools/ folder.

set TOOL=%~dp0tools\ZXPSignCmd.exe
set CERT=%~dp0tools\cert.p12
set PASSWORD=%CERT_PASSWORD%
set OUTPUT=%~dp0dist\EmojiToPNG_v1.0.0.zxp
set TEMP_BUILD=%~dp0_build

echo.
echo ============================================
echo   Emoji to PNG - ZXP Builder
echo ============================================
echo.

REM Clean previous build
if exist "%TEMP_BUILD%" rmdir /s /q "%TEMP_BUILD%"
if not exist "%~dp0dist" mkdir "%~dp0dist"

REM Copy extension files (exclude tools, dist, build artifacts)
echo [1/3] Preparing extension files...
mkdir "%TEMP_BUILD%"
xcopy "%~dp0CSXS" "%TEMP_BUILD%\CSXS\" /E /Q /Y >nul
xcopy "%~dp0host" "%TEMP_BUILD%\host\" /E /Q /Y >nul
copy "%~dp0index.html" "%TEMP_BUILD%\" >nul
copy "%~dp0style.css" "%TEMP_BUILD%\" >nul
copy "%~dp0app.js" "%TEMP_BUILD%\" >nul
copy "%~dp0emoji-data.js" "%TEMP_BUILD%\" >nul
copy "%~dp0CSInterface.js" "%TEMP_BUILD%\" >nul

REM Sign the extension
echo [2/3] Signing and packaging ZXP...
"%TOOL%" -sign "%TEMP_BUILD%" "%OUTPUT%" "%CERT%" "%PASSWORD%" -tsa http://timestamp.digicert.com

if %ERRORLEVEL% EQU 0 (
    echo [3/3] Verifying ZXP...
    "%TOOL%" -verify "%OUTPUT%"
    echo.
    echo ============================================
    echo   SUCCESS! ZXP created at:
    echo   %OUTPUT%
    echo ============================================
) else (
    echo.
    echo   ERROR: Failed to create ZXP file.
    echo   Check the output above for details.
)

REM Cleanup
rmdir /s /q "%TEMP_BUILD%" 2>nul

echo.
pause
