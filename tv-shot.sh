#!/usr/bin/env bash
# Save one PNG of the TV screen (works on every Android version, incl. 4.x Lite TVs).
#   ./tv-shot.sh                     -> tv-shot.png from $TV or the only device
#   ./tv-shot.sh before.png 192.168.50.33
set -euo pipefail

out="${1:-tv-shot.png}"
serial="${2:-${TV:-}}"

adb="${ADB:-}"
if [ -z "$adb" ]; then
  if command -v adb >/dev/null 2>&1; then adb=adb; else adb="${LOCALAPPDATA:-$HOME/AppData/Local}/Android/Sdk/platform-tools/adb.exe"; fi
fi
if [ -z "$serial" ]; then
  serial="$("$adb" devices | awk 'NR>1 && $2=="device"{print $1; exit}')"
fi
[ -n "$serial" ] || { echo "No TV found." >&2; exit 1; }
case "$serial" in *:*) "$adb" connect "$serial" >/dev/null 2>&1 || true ;; esac

"$adb" -s "$serial" exec-out screencap -p > "$out"
echo "$out"
