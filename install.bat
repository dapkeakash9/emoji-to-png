@echo off
:: =============================================
:: Emoji to PNG - System-wide Installer
:: =============================================

:: Check for Administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting Administrative Privileges to install to Program Files...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

echo ============================================
echo   Installing Emoji to PNG Extension
echo ============================================
echo.

set "TARGET=C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.dapkeakash9.emojitopng"

:: Remove old version if it exists
if exist "%TARGET%" (
    echo Removing existing installation...
    rmdir /s /q "%TARGET%"
)

:: Create target directory
mkdir "%TARGET%"

:: Copy files
echo Copying files to %TARGET%...
xcopy "%~dp0CSXS" "%TARGET%\CSXS\" /E /I /Q /Y >nul
xcopy "%~dp0host" "%TARGET%\host\" /E /I /Q /Y >nul
copy "%~dp0index.html" "%TARGET%\" /Y >nul
copy "%~dp0style.css" "%TARGET%\" /Y >nul
copy "%~dp0app.js" "%TARGET%\" /Y >nul
copy "%~dp0emoji-data.js" "%TARGET%\" /Y >nul
copy "%~dp0CSInterface.js" "%TARGET%\" /Y >nul

echo.
echo ============================================
echo   SUCCESS! 
echo   Extension installed system-wide at:
echo   %TARGET%
echo ============================================
echo.
pause
