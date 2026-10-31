# TV Viewer

[中文](README.md) · English

Mirror an Android TV into a single desktop window and operate it with your keyboard or an on-screen remote. Nothing is installed on the TV, and no third-party server is involved.

Windows desktop app (Electron) plus two small CLI wrappers around scrcpy and adb. The UI is bilingual (Chinese / English); code identifiers are English.

## Features

- The Windows installer bundles scrcpy 5.0.1 and adb, so there is nothing else to install.
- Enter the TV IP, run `adb connect`, and embed the scrcpy picture into the app window instead of a floating window.
- On-screen remote: D-pad (hold to repeat), OK, Back, Home, Menu, Recents, volume ±, mute, play/pause, power.
- Frameless window with traffic lights, draggable top bar, always-on-top, fill-window and fullscreen modes.
- Keyboard: arrows, Enter and Backspace go straight to the TV. When the picture has focus, scrcpy shortcuts apply.
- Settings: language, connect on launch, reconnect after drop, D-pad repeat speed, keep on top, show remote.
- Power always asks for confirmation before sending the key.
- CLI: `tv-view` to mirror, `tv-shot` to save a screenshot (works on Android 4.x Lite TVs).

## Quick start

### Download the installer (recommended)

Download the latest build from [GitHub Releases](https://github.com/Chendongquan/tv-view/releases):

- `tv-viewer-setup-<version>-x64.exe`: per-user installer with Start menu and desktop shortcuts; no administrator rights required.
- `tv-viewer-portable-<version>-x64.exe`: portable build; the first launch extracts to a temporary directory and is a little slower.

The installer already contains scrcpy 5.0.1 and adb. Node.js and a separate scrcpy install are not required. The binaries are not code-signed, so Windows SmartScreen may warn about an unknown publisher; only run files downloaded from this repository's Releases page.

### Let an agent set it up from source

Paste this into Claude Code or any coding agent that can run commands, and replace `<TV-IP>` with your TV address:

```text
Set up TV Viewer on this Windows PC and connect it to my Android TV.

1. Check for Node.js >= 22, scrcpy and adb; install anything missing with winget (package: Genymobile.scrcpy).
2. Clone https://github.com/Chendongquan/tv-view into a sensible directory, then run npm install in remote/.
3. The TV is at <TV-IP> (for example 192.168.50.33, port 5555 by default).
   Confirm ADB debugging is enabled on the TV and that it is on the same LAN as this PC.
4. Run npm start, enter the IP, and click the connect button. If it fails, check adb connect, the firewall, and port 5555.
5. When it works, tell me the connected device, the available shortcuts, and how to enable "Connect on launch" in settings.

Do not install anything on the TV and do not introduce any third-party relay service.
If winget or npm is unavailable, tell me what is missing and give manual install steps first.
```

### Run from source

Requirements: Windows 10/11, Node.js 22+, scrcpy (which bundles adb).

```bash
winget install Genymobile.scrcpy
cd remote
npm install
npm start
```

ADB debugging must be enabled on the TV, and both devices must be on the same LAN. After the first install you can also double-click `remote/tv-viewer.cmd`.

### CLI (optional)

```bash
./tv-view.sh 192.168.50.33
./tv-shot.sh before.png 192.168.50.33
```

Use `.cmd` instead of `.sh` in cmd / PowerShell. The first non-flag argument is treated as the TV address; other arguments are passed to scrcpy.

## Shortcuts

| Action | Shortcut |
| --- | --- |
| Show / hide remote | `Ctrl+Alt+H` |
| Fill window | `Ctrl+Alt+W` |
| Fullscreen | `Ctrl+Alt+F` or `Ctrl+Alt+Enter` |
| Exit fill / fullscreen | `Esc`, or the same shortcut again |
| Back | `Esc` when connected; `Alt+B` or right-click when the picture has focus |
| Home / recents | `Alt+H` / `Alt+S` when the picture has focus |

The MOD key is left Alt (or left Windows), not Ctrl. Ctrl combinations are forwarded to the TV app unchanged.

## Verified

- Windows 11, 2560×1440 at 150% scaling.
- Xiaomi MFTR0, Android 11, 1920×1080.
- scrcpy 5.0.1, Electron 45.

macOS, Linux and other TV models are not verified.

## Troubleshooting

Common issues, diagnostics and FAQ: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) (Chinese).

## Limitations

- Windows-only GUI; the CLI scripts work on macOS / Linux without the embedded window.
- No audio forwarding.
- The embedded picture is a native child window, so it covers web UI in fill-window / fullscreen; exit with shortcuts.
- One TV per window; one scrcpy instance per TV.
- Do not use `--max-size=1600` on the verified Xiaomi TV; it corrupts the picture. Use `1280` or native.
- scrcpy requires Android 5.0+; Android 4.x is limited to screenshots via `tv-shot`.
- The installer is not code-signed, so SmartScreen may warn; download only from this repository's Releases.
- The installer pins scrcpy 5.0.1. To use another version, run from source and point `SCRCPY` at it.

## Development

```bash
cd remote
npm install
npm start       # run in development
npm run check   # node --check
```

Package the installer and portable build:

```bash
cd remote
npm run fetch-vendor   # download scrcpy 5.0.1 into vendor/, or pass -FromPath
npm run dist           # artifacts in dist/
```

`vendor/` and `dist/` are not committed. See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) (Chinese).

## Docs

- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Development](docs/DEVELOPMENT.md)
- [App details](remote/README.md)
- [Third-party notices](remote/THIRD_PARTY_NOTICES.md)
- [Design system](remote/DESIGN.md)
- [Product notes](remote/PRODUCT.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)
