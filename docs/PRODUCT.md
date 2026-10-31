# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Android developers and technically inclined users who need to see and operate an Android TV that is not next to their computer. Primary user: a developer at a PC, on the same LAN as the TV, testing TV apps or troubleshooting the TV itself. The product is intended for public release to other developers, not only its author. Household members who watch TV benefit from the TV being set up, but they do not operate this app.

## Product Purpose

TV Viewer mirrors an Android TV screen into a desktop window and provides an on-screen remote, so the user can test and operate the TV from the computer without walking over to it. Success means the TV is visible within seconds of entering its IP, and D-pad, OK, Back and Home reach the TV without the user leaving the app or switching keyboard focus.

## Positioning

One desktop window wraps the existing scrcpy + adb pipeline: nothing is installed on the TV, there is no vendor account, no third-party relay, and no cloud dependency. It is tuned for physical Android TV testing — embedded picture, adb-injected remote keys, TV-oriented shortcuts — rather than phone mirroring or remote support.

## Operating Context

- Ships as an Electron desktop app on Windows. Underlying renderer is web; the platform field records that renderer, while the shell and window behavior are desktop-native.
- Tested on Windows 11 at 2560×1440 with 150% display scaling.
- The TV is reached over the LAN with ADB over TCP; scrcpy and adb are external prerequisites.
- Verified hardware: Xiaomi MFTR0, Android 11, 1920×1080. The author also maintains Aerial and Aerial Lite for other Xiaomi, TCL and Android 4.x TVs, but this app has not been verified on those.
- Connections are transient: adb over TCP can drop when the TV sleeps or reboots, so reconnecting must stay a one-step action.
- Public release and cross-platform direction are confirmed; macOS and Linux are not implemented yet.

## Capabilities and Constraints

- Connect by TV IP (port defaults to 5555), run `adb connect`, launch a borderless scrcpy, and embed its window into the app.
- Mirror at native resolution; scaling to 1600-wide output is known to corrupt video on the verified Xiaomi TV.
- On-screen remote: D-pad with hold-repeat, OK, Back, Home, Menu, Recents, volume up/down, mute, play/pause, power.
- Show/hide the remote panel, 满窗口 (fill the current window) and 满屏幕 (fill the display) modes, always-on-top, borderless window with a draggable top bar.
- Global shortcuts: `Ctrl+Alt+H` remote panel, `Ctrl+Alt+W` fill window, `Ctrl+Alt+F` / `Ctrl+Alt+Enter` fill screen.
- Keyboard inside the mirror follows scrcpy conventions (arrows, Enter, `Alt+B` or right-click for Back).
- No audio forwarding. Android 4.x TVs can only use the screenshot path; scrcpy requires Android 5.0+.
- The embedded video is a native child window, so it covers web-rendered overlays while in 满窗口/满屏幕; exiting relies on keyboard shortcuts.
- One scrcpy instance per TV. TV-side encoding consumes GPU/encoder and can affect performance testing.

## Brand Commitments

- Name: TV Viewer (formerly TV Remote). Plain, technical, unhyped voice; Chinese interface with English identifiers.
- Dark, quiet, tool-like surface with a restrained orange accent.
- No third-party servers, no account, no telemetry, no TV-side app.

## Evidence on Hand

- `README.md`: verified hardware, shortcuts, display modes, limitations.
- `index.html`, `style.css`, `renderer.js`: incumbent UI.
- `main.js`, `preload.js`, `embed-scrcpy.ps1`: implementation.
- Verified on MFTR0: connection and embedding, volume keys, hide-remote, 满窗口/满屏幕, global shortcuts, borderless drag.
- No public users, testimonials, benchmarks or cross-platform evidence yet; future work must not fabricate them.

## Product Principles

1. One window, one glance: picture and controls live together.
2. The TV stays untouched: no app install, no account, no third-party service.
3. Controls do not depend on focus: remote buttons and global shortcuts work even when the mirror holds keyboard focus.
4. State limits honestly: name tested devices, untested keys and native-child overlay constraints.
5. Public tool, personal pace: setup is IP plus connect, and every failure states the next action.

## Accessibility & Inclusion

- Must stay legible at 150% Windows scaling; contrast and hint text are checked.
- Every remote action has a keyboard path: scrcpy shortcuts when the mirror is focused, app-level global shortcuts otherwise.
- This is a developer tool; no formal WCAG certification is claimed.
