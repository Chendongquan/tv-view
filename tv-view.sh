#!/usr/bin/env bash
# Mirror an Android TV's screen to this PC over ADB (Git Bash / WSL / macOS / Linux).
#   ./tv-view.sh                     use $TV or the only connected device
#   ./tv-view.sh 192.168.50.33       connect to and mirror that TV
#   ./tv-view.sh 192.168.50.33 --max-size=1280 --video-bit-rate=4M
# Any argument starting with - is passed to scrcpy.
set -euo pipefail

serial=""
args=()
for a in "$@"; do
  case "$a" in
    -h|--help)
      sed -n '2,7p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    -*) args+=("$a") ;;
    *)  if [ -z "$serial" ]; then serial="$a"; else args+=("$a"); fi ;;
  esac
done

adb="${ADB:-}"
if [ -z "$adb" ]; then
  if command -v adb >/dev/null 2>&1; then
    adb=adb
  else
    adb="${LOCALAPPDATA:-$HOME/AppData/Local}/Android/Sdk/platform-tools/adb.exe"
  fi
fi

[ -n "$serial" ] || serial="${TV:-}"
if [ -z "$serial" ]; then
  serial="$("$adb" devices | awk 'NR>1 && $2=="device"{print $1; exit}')"
fi
[ -n "$serial" ] || { echo "No TV found. Turn on ADB debugging, then: tv-view <TV-IP>" >&2; exit 1; }

case "$serial" in *:*) "$adb" connect "$serial" >/dev/null 2>&1 || true ;; esac

scrcpy="${SCRCPY:-}"
if [ -z "$scrcpy" ]; then
  if command -v scrcpy >/dev/null 2>&1; then
    scrcpy=scrcpy
  else
    for f in "${LOCALAPPDATA:-$HOME/AppData/Local}"/Microsoft/WinGet/Packages/Genymobile.scrcpy_*/scrcpy-win64-*/scrcpy.exe; do
      [ -x "$f" ] && scrcpy="$f" && break
    done
  fi
fi
[ -n "$scrcpy" ] || { echo "scrcpy not found. Install it once: winget install Genymobile.scrcpy" >&2; exit 1; }

ADB="$adb" exec "$scrcpy" --serial "$serial" --no-audio --window-title="TV $serial" "${args[@]}"
