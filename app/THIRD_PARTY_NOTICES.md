# Third-party notices

TV Viewer does not bundle scrcpy or adb. They are installed separately by the user and are not distributed with this app.

## scrcpy

- License: Apache License 2.0
- Source: https://github.com/Genymobile/scrcpy

The app calls a locally installed `scrcpy.exe`. Any bundled FFmpeg, SDL3 or libusb DLLs come from that local scrcpy installation, not from TV Viewer.

## Android SDK Platform-Tools (adb)

- License: Apache License 2.0
- Source: https://android.googlesource.com/platform/packages/modules/adb

The app calls a locally installed `adb.exe`.

## Electron

- License: MIT
- Source: https://github.com/electron/electron

Electron's license files are included by electron-builder in the installed app.
