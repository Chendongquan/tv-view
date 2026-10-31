# TV Viewer

[中文](README.md) · English

Mirror an Android TV into a single desktop window and operate it with your keyboard or an on-screen remote. Nothing is installed on the TV, and no third-party server is involved.

Windows desktop app (Electron) plus two small CLI wrappers around scrcpy and adb. The UI is bilingual (Chinese / English); code identifiers are English.

## Features

- The Windows installer contains only the app; scrcpy and adb are installed separately.
- Enter the TV IP, run `adb connect`, and embed the scrcpy picture into the app window instead of a floating window.
- On-screen remote: D-pad (hold to repeat), OK, Back, Home, Menu, Recents, volume ±, mute, play/pause, power.
- Frameless window with traffic lights, draggable top bar, always-on-top, fill-window and fullscreen modes.
- Keyboard: arrows, Enter and Backspace go straight to the TV. When the picture has focus, scrcpy shortcuts apply.
- Settings: language, connect on launch, reconnect after drop, D-pad repeat speed, keep on top, show remote.
- Power always asks for confirmation before sending the key.
- CLI: `tv-view` to mirror, `tv-shot` to save a screenshot (works on Android 4.x Lite TVs).

## Quick start

### Installer deployment (recommended, manual)

#### 1. Install scrcpy (one-time)

The installer contains only TV Viewer; scrcpy and adb are installed separately. The Windows scrcpy package bundles adb:

```bash
winget install Genymobile.scrcpy
```

Verify:

```bash
scrcpy --version
adb version
```

#### 2. Download and install TV Viewer

Download from [GitHub Releases](https://github.com/Chendongquan/tv-view/releases):

- `tv-viewer-setup-<version>-x64.exe`: per-user installer with Start menu and desktop shortcuts; no administrator rights required.
- `tv-viewer-portable-<version>-x64.exe`: portable build; the first launch extracts to a temporary directory and is a little slower.

Optional: verify the download with `SHA256SUMS.txt`:

```powershell
Get-FileHash .\tv-viewer-setup-0.1.0-x64.exe -Algorithm SHA256
```

Run the installer and follow the wizard. The binaries are not code-signed, so Windows SmartScreen may warn about an unknown publisher; choose "More info → Run anyway" only if the file came from this repository's Releases.

#### 3. Connect the TV

1. Enable ADB debugging on the TV (Developer options → ADB debugging / network debugging).
2. Put the PC and the TV on the same LAN.
3. Open TV Viewer, enter the TV IP (port 5555 is appended automatically), and click connect.
4. Accept the authorization dialog on the TV with its remote.
5. The picture takes over the stage and the remote lights up.

If it fails, see [Troubleshooting](docs/TROUBLESHOOTING.md).

#### Portable build

To skip installation, run `tv-viewer-portable-<version>-x64.exe`. It also requires scrcpy to be installed.

### Let an agent deploy the installer (default)

Paste this into Claude Code or any coding agent that can run commands, and replace `<TV-IP>` with your TV address. It installs scrcpy, downloads and silently installs TV Viewer, launches it, and connects to the TV.

```text
Install TV Viewer on this Windows PC and connect it to my Android TV.

1. Install scrcpy first (it is not bundled): winget install --id Genymobile.scrcpy --accept-source-agreements --accept-package-agreements, then confirm scrcpy --version and adb version work.
2. Download tv-viewer-setup-<latest version>-x64.exe and SHA256SUMS.txt from https://github.com/Chendongquan/tv-view/releases/latest into a temporary directory.
3. Verify the installer SHA256 against SHA256SUMS.txt; stop and tell me if it does not match.
4. Silent install: Start-Process -Wait -FilePath <installer> -ArgumentList '/S'.
   If SmartScreen or another security prompt blocks it, tell me first; do not force a bypass.
5. Find TV Viewer.exe under %LOCALAPPDATA%\Programs (or the Start menu shortcut) and launch it.
6. The TV is at <TV-IP> (port 5555 by default). Confirm ADB debugging is enabled on the TV and that it is on the same LAN as this PC.
7. Enter the IP in the app and click connect; prompt me to accept the authorization dialog on the TV.
8. When it works, tell me the connected device, the available shortcuts, and how to enable "Connect on launch" in settings.

Do not install anything on the TV and do not introduce any third-party relay service.
If winget or the silent install is unavailable, tell me what is missing and give manual install steps first.
```

### Run from source (development)

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
- The installer does not include scrcpy or adb; install scrcpy first, or point `SCRCPY` / `ADB` at a custom version.

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
npm run dist           # artifacts in dist/
```

`dist/` is not committed. See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) (Chinese).

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
