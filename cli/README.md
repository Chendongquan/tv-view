# CLI tools

Two thin wrappers around scrcpy and adb, for when you do not need the GUI. They require `scrcpy` and `adb` on PATH or the default install locations; see the main [README](../README.md).

## tv-view

Show the TV picture with scrcpy. The first non-flag argument is the TV address; the rest is passed to scrcpy.

```bash
./cli/tv-view.sh                     # $TV or the only connected device
./cli/tv-view.sh 192.168.50.33       # connect over ADB, then show the picture
./cli/tv-view.sh 192.168.50.33 --max-size=1280 --video-bit-rate=4M
```

Windows cmd / PowerShell:

```bat
cli\tv-view.cmd 192.168.50.33
```

## tv-shot

Save one PNG of the TV screen. Works on Android 4.x as well (the picture viewer requires Android 5.0+).

```bash
./cli/tv-shot.sh                     # tv-shot.png from $TV or the only device
./cli/tv-shot.sh before.png 192.168.50.33
```

Windows cmd / PowerShell:

```bat
cli\tv-shot.cmd before.png 192.168.50.33
```

## Environment

| Variable | Used by | Meaning |
| --- | --- | --- |
| `TV` | both | Default TV address |
| `ADB` | both | Path to `adb.exe` |
| `SCRCPY` | `tv-view` | Path to `scrcpy.exe` |

The GUI uses the same `TV`, `ADB` and `SCRCPY` variables. See [Troubleshooting](../docs/TROUBLESHOOTING.md) if the CLI cannot find a device or scrcpy.
