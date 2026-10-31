@echo off
rem Save one PNG of the TV screen. Works on every Android version.
rem   tv-shot                     -> tv-shot.png from %TV% or the only device
rem   tv-shot before.png 192.168.50.33
setlocal

set "OUT=%~1"
if not defined OUT set "OUT=tv-shot.png"
set "SERIAL=%~2"
if not defined SERIAL set "SERIAL=%TV%"

set "ADB_EXE=adb"
where adb >nul 2>nul
if errorlevel 1 set "ADB_EXE=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"

if not defined SERIAL (
  for /f "skip=1 tokens=1" %%d in ('"%ADB_EXE%" devices') do (
    if not defined SERIAL set "SERIAL=%%d"
  )
)
if not defined SERIAL (
  echo No TV found.
  exit /b 1
)

echo %SERIAL% | find ":" >nul
if not errorlevel 1 "%ADB_EXE%" connect %SERIAL% >nul 2>nul

"%ADB_EXE%" -s %SERIAL% exec-out screencap -p > "%OUT%"
echo %OUT%
