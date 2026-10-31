# CLAUDE.md

## Project

TV Viewer is a Windows Electron app that embeds scrcpy in a frameless window and adds an on-screen Android TV remote. Nothing is installed on the TV; the picture, keys and screenshots all go over ADB.

## Commands

```bash
cd remote
npm install
npm start        # run in development
npm run check    # node --check
npm run pack     # dist/win-unpacked/
npm run dist     # NSIS setup + portable in dist/
```

`npm run make-icon` regenerates `remote/build/icon.png`; see `docs/DEVELOPMENT.md` for the ICO step.

## Architecture

- `main.js`: window, config (`%APPDATA%\TV Viewer\config.json`), adb/scrcpy lookup, scrcpy process, PowerShell embedding, IPC, global shortcuts.
- `preload.js`: contextBridge whitelist; the renderer has no Node access.
- `renderer.js`: connection state, remote keys, window drag, stage rectangle reporting.
- `embed-scrcpy.ps1`: Win32 `SetParent` / `MoveWindow`, DPI aware.
- `i18n.js`: Chinese / English strings; add both languages.
- `electron-builder.yml`: Windows packaging; the app contains no scrcpy or adb.

## Constraints

- The GUI is Windows-only; the CLI scripts work on Windows, macOS and Linux.
- Do not bundle scrcpy or adb. Users install scrcpy (which includes adb).
- No TV-side app, telemetry, account, or third-party relay service.
- Keep `contextIsolation: true`, `nodeIntegration: false`, and the CSP in `index.html`.
- Add new settings to the `set-setting` allowlist in `main.js`.
- Keep UI text in both `zh` and `en`; check key parity with the command in `docs/DEVELOPMENT.md`.
- Do not commit `node_modules`, `dist`, `**/.impeccable/review/`, or `**/.impeccable/hook.cache.json`.

## Design workflow

`.claude/agents/` contains the Impeccable design agents used for the UI pass. `remote/.impeccable/design.json` is a generated design-system sidecar; refresh it with `/impeccable document` when `DESIGN.md` changes. `DESIGN.md` and `PRODUCT.md` are the design source of truth.

## Documentation

- `README.md` / `README.en.md`: overview, install and deployment.
- `docs/TROUBLESHOOTING.md`: connection, scrcpy, keys, FAQ.
- `docs/DEVELOPMENT.md`: architecture, IPC, config, i18n, packaging.
- `remote/DESIGN.md`, `remote/PRODUCT.md`: design system and product scope.
- `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`.

## Release

1. Bump `remote/package.json` and `CHANGELOG.md`.
2. `cd remote && npm run check && npm run dist`.
3. `cd dist && sha256sum *.exe > SHA256SUMS.txt`.
4. Commit, tag, push.
5. Create the GitHub release with the two installers and `SHA256SUMS.txt`. Do not move an existing tag after publishing a release.
