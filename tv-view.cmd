@echo off
rem Mirror an Android TV's screen to this PC over ADB.
rem   tv-view                     use %TV% or the only connected device
rem   tv-view 192.168.50.33       connect to and mirror that TV
rem   tv-view 192.168.50.33 --max-size=1280 --video-bit-rate=4M
rem Any argument that starts with - is passed to scrcpy.
setlocal EnableDelayedExpansion

set "SERIAL="
set "ARGS="
:parse
if "%~1"=="" goto parsed
if "%~1"=="-h" goto usage
if "%~1"=="--help" goto usage
set "A=%~1"
if "!A:~0,1!"=="-" (
  set "ARGS=!ARGS! !A!"
) else if not defined SERIAL (
  set "SERIAL=!A!"
) else (
  set "ARGS=!ARGS! !A!"
)
shift
goto parse
:parsed

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
  echo No TV found. Turn on ADB debugging, then: tv-view ^<TV-IP^>
  exit /b 1
)

echo %SERIAL% | find ":" >nul
if not errorlevel 1 "%ADB_EXE%" connect %SERIAL% >nul 2>nul

set "SCRCPY=scrcpy"
where scrcpy >nul 2>nul
if errorlevel 1 (
  for /f "delims=" %%f in ('dir /b /s "%LOCALAPPDATA%\Microsoft\WinGet\Packages\Genymobile.scrcpy_*\scrcpy.exe" 2^>nul') do set "SCRCPY=%%f"
)
if not exist "%SCRCPY%" (
  echo scrcpy not found. Install it once with: winget install Genymobile.scrcpy
  exit /b 1
)

set "ADB=%ADB_EXE%"
"%SCRCPY%" --serial %SERIAL% --no-audio --window-title="TV %SERIAL%" %ARGS%
exit /b %errorlevel%

:usage
echo Usage: tv-view [TV-IP[:port]] [scrcpy options]
echo   No argument: uses %%TV%% or the only device already connected.
echo   Examples:
echo     tv-view
echo     tv-view 192.168.50.33
echo     tv-view 192.168.50.33 --max-size=1280 --video-bit-rate=4M
echo Click the window first. Arrows = D-pad, Enter = OK, Alt+B or right-click = Back, Alt+H = Home.
exit /b 0
