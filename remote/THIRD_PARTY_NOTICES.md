# Third-party notices

The packaged Windows build redistributes the official scrcpy Windows release next to the app. TV Viewer itself remains MIT (see `LICENSE.txt`).

## scrcpy 5.0.1

- License: Apache License 2.0
- Source: https://github.com/Genymobile/scrcpy/tree/v5.0.1
- License text: `third_party/scrcpy-LICENSE.txt` and `scrcpy/LICENSE.txt`

The official scrcpy Windows build also ships FFmpeg, SDL3 and libusb DLLs. Their terms are available upstream:

- FFmpeg: https://ffmpeg.org/legal.html
- SDL3: https://github.com/libsdl-org/SDL/blob/main/LICENSE.txt (zlib)
- libusb: https://github.com/libusb/libusb/blob/master/COPYING (LGPL-2.1)

## Android SDK Platform-Tools (adb)

- License: Apache License 2.0
- Source: https://android.googlesource.com/platform/packages/modules/adb
- NOTICE: `third_party/adb-NOTICE.txt`

The `adb.exe` bundled in the installer is the one shipped in the official scrcpy Windows release, which comes from Android SDK Platform-Tools.

## Electron

- License: MIT
- Source: https://github.com/electron/electron

Electron's own license files are included by electron-builder in the installed app.
