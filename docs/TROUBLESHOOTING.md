# 故障排查

TV Viewer 只有一条链路：电脑 → ADB → 电视。连不上时先确认这三件事：

- 电视已开启 ADB 调试（开发者选项里的「ADB 调试 / 网络调试」）；
- 电脑和电视在同一局域网，能访问电视的 5555 端口；
- `adb devices -l` 里能看到设备，状态是 `device`。

## 一分钟诊断

```bash
adb devices -l
adb -s <serial> get-state
adb shell getprop ro.product.model
adb shell getprop ro.build.version.release
adb shell wm size
scrcpy --version
node --version
```

把 `<serial>` 换成 `192.168.50.33:5555` 这样的地址。应用里状态图标悬停也能看到当前状态和原因。

## 安装版、便携版和源码运行

- **安装版 / 便携版**：只包含应用本身，scrcpy 和 adb 仍然需要单独安装。便携版第一次启动会先解压到临时目录，慢几秒是正常的。
- **源码运行（`npm start`）**：需要 Node.js 22+、scrcpy 和 adb。
- 两种方式都按 `SCRCPY` / `ADB` 环境变量、Android SDK、PATH、WinGet 安装位置的顺序查找 scrcpy / adb。
- 安装包没有代码签名，SmartScreen 的“未知发布者”提示是预期的。只从本仓库 Releases 下载，并用发布页的 SHA256 校验。
- 两种方式共用同一份配置：`%APPDATA%\TV Viewer\config.json`。

## 连不上电视

### `adb connect` 报 refused / timeout

按顺序检查：

1. 电视的 ADB 调试是否真的打开（有些电视重启后会关掉）。
2. IP 是否正确，电脑和电视是否在同一网段；访客 Wi-Fi 或 AP 隔离会让两台设备互相不可见。
3. 电视端 5555 端口是否被系统防火墙或其他安全软件拦截。
4. 是否有另一台电脑正连着这台电视的 adb（同一时间通常只允许一个调试主机）。

可以在电脑上先单独验证：

```bash
adb connect 192.168.50.33:5555
adb devices -l
```

### 状态是 `unauthorized`

电视上会弹「允许 USB 调试吗」。用电视遥控器点允许，并勾选「一律允许」。
如果没弹窗或误点了拒绝，到电视的开发者选项里「撤销 USB 调试授权」，再重新连接。

### 状态是 `offline`

```bash
adb disconnect 192.168.50.33:5555
adb connect 192.168.50.33:5555
```

还不行就重启 adb 服务：

```bash
adb kill-server
adb start-server
adb connect 192.168.50.33:5555
```

电视重启、休眠、切网后经常需要这一步。

### 应用报「连不上电视」

应用只做 `adb connect` 和 `get-state`。如果终端里 `adb devices -l` 正常，但应用失败，通常是应用找到的 adb 和你终端里的不是同一个。设置 `ADB` 环境变量指向正确的 `adb.exe`，再启动应用：

```bash
set ADB=C:\path\to\adb.exe
cd remote
npm start
```

PowerShell：

```powershell
$env:ADB = "C:\path\to\adb.exe"
```

### Android 11+ 的无线调试

如果电视只有「无线调试」（随机端口 + 配对码），先在终端配对一次：

```bash
adb pair 192.168.50.33:<配对端口>
# 输入电视上显示的 6 位配对码
```

然后把「无线调试」页面显示的**连接端口**填进应用，例如 `192.168.50.33:41235`。应用不会执行 `adb pair`，配对需要手动做一次；重启后端口可能变化。

### 只有 USB，没有网络调试

先用 USB 连一次电脑，打开 TCP 模式，再拔掉 USB：

```bash
adb devices
adb tcpip 5555
adb connect 192.168.50.33:5555
```

之后应用就可以走网络连接。GUI 走网络地址（`IP[:端口]`）；命令行 `tv-view.sh` 可以直接用 USB serial 连接并查看画面。

### 有多台设备

```bash
adb devices -l
```

应用始终使用你在输入框里填的 IP。命令行不传地址时，取 `$TV`，否则取第一台 `device`。多台设备建议显式写地址。

## scrcpy

### 报「没找到或无法启动 scrcpy」

安装包不包含 scrcpy，需要先在本机安装：

```bash
winget install Genymobile.scrcpy
```

安装后重开终端 / 重新启动应用，让 PATH 生效。也可以用 `SCRCPY` 指向一个可用的 `scrcpy.exe`。源码运行时：

```bash
set SCRCPY=C:\path\to\scrcpy.exe
cd remote
npm start
```

安装版可以在启动前把 `SCRCPY` 设为用户环境变量。

安全软件拦截 `scrcpy.exe` 时也会表现为启动失败，检查拦截日志。

### 画面单独打开（状态「画面单独打开」）

说明 scrcpy 起来了，但窗口嵌入失败，退化成独立窗口。此时遥控器仍然可用。

常见原因：

- 安全软件阻止 PowerShell 调用 `SetParent`；
- scrcpy 启动太慢，20 秒内没找到窗口；
- 远程桌面、多显示器或非整数缩放导致窗口句柄不稳定。

可以先确认 scrcpy 窗口存在：

```powershell
Get-Process scrcpy | Select-Object Id, MainWindowTitle, MainWindowHandle
```

标题应该是 `TvViewerVideo`。仍失败时，先从终端运行 `npm start` 观察输出，并在 100% 缩放下再试一次。

### 满窗口 / 全屏里点不到按钮

画面是 Windows 原生子窗口，永远盖在网页层上面。退出用快捷键：

- `Esc`
- `Ctrl+Alt+W`（退出满窗口）
- `Ctrl+Alt+F`（退出全屏）

### 画面花屏、彩色横条

只在命令行手动传 `--max-size=1600` 时出现，那台小米电视会编码成 1600×896。用 `--max-size=1280` 或原生分辨率。GUI 不传 `--max-size`，不受影响。

### 卡顿、延迟高

- 优先 5GHz Wi-Fi，避免电视和电脑跨路由/跨网段；
- GUI 按原生分辨率显示画面。网络差时改用命令行降码率：

```bash
./tv-view.sh 192.168.50.33 --max-size=1280 --video-bit-rate=4M
```

- 同一台电视不要同时开多个 scrcpy；
- 电视端编码会占用 GPU / 编码器。

## 遥控与按键

### 遥控器是灰的

只有「已连接」和「画面单独打开」两种状态会点亮遥控器。先确认连接成功。

### 键盘方向键没反应

应用层键盘只在网页界面有焦点时生效，并且输入框获得焦点时会被忽略。点一下遥控器区域或空白处，再按方向键。

如果焦点在嵌入的 scrcpy 画面上，按键由 scrcpy 处理：方向键、回车、`Alt+B` 返回、`Alt+H` 主页、`Alt+S` 最近任务。此时应用层的全局快捷键（`Ctrl+Alt+H/W/F`）仍然有效。

### `Esc` 为什么变成返回键

优先级从高到低：

1. 关闭设置页；
2. 取消电源确认；
3. 退出全屏；
4. 退出满窗口；
5. 已连接时发送 `KEYCODE_BACK`。

### 电源键

电源键现在**始终二次确认**，不能关闭。这是为了避免误触把电视关机。按 `Esc` 或「取消」退出确认。

### 音量、静音、播放键无效

这些是标准 Android keycode，但部分电视/机顶盒会忽略或重新映射。可以先用 `adb shell input keyevent KEYCODE_VOLUME_UP` 验证电视是否响应。

### 按键失败提示

状态栏闪「按键失败」表示 `adb shell input keyevent` 执行失败。检查连接是否还在、电视是否休眠，必要时重新连接。

## 自动连接与重连

- 「启动时自动连接」需要至少成功连接过一次（保存了 serial），并保持该设置开启。
- 掉线后自动重连最多 3 次，每次间隔 2 秒；仍然失败就进入错误态，点「重新连接」。
- 电视 DHCP 换了 IP 时，旧的 serial 会失效，改填新 IP。
- 电视休眠/重启后 ADB 调试可能关闭，重新打开后再连接。

## 多台电视 / 多开

- 一个应用窗口同一时间只连一台电视；换电视直接填新 IP 重连。
- 全局快捷键是系统级的，开两个应用实例时第二个实例注册会失败（终端里会打印 `FAILED`）。用单实例。
- 同一台电视只开一个 scrcpy。

## 平台与 Android 版本

- GUI 的窗口嵌入只实现了 Windows，依赖 `user32.dll`。
- 命令行脚本在 macOS / Linux 上可以用（需要 scrcpy、adb），但没有窗口嵌入和遥控器界面。
- scrcpy 要求 Android 5.0+；4.x 的 Lite 电视只能用 `tv-shot` 截图。
- Android 手机理论上也能连，但不是这个项目的验证目标。

## 配置与日志

配置保存在：

```
%APPDATA%\TV Viewer\config.json
```

旧版 `%APPDATA%\tv-viewer` 和 `%APPDATA%\tv-remote` 里的配置会自动迁移。

想彻底重置，关闭应用后删除这个文件即可（会丢失已保存的 IP 和设置）。

看日志：

- 从终端运行 `cd remote && npm start`，全局快捷键注册结果会打印在终端；
- scrcpy 的 stdout / stderr 默认被丢弃（`startScrcpy()` 里的 `stdio: 'ignore'`）。调试时临时改成 `'inherit'` 就能看到 scrcpy 的输出。

## FAQ

**电视端需要装 App 吗？**
不需要。只用到系统自带的 ADB 和 scrcpy 临时推送的 server。

**需要 root 吗？**
不需要。

**需要开 ADB 调试吗？**
需要。画面、按键、截图都走 ADB，没有调试授权就连不上。

**有声音吗？**
没有。应用启动 scrcpy 时用了 `--no-audio`，声音仍从电视出。

**会改电视吗？**
不会常驻。scrcpy server 只在连接期间临时运行，退出即结束。

**需要联网吗？**
查看画面只需要局域网。首次安装 Node、scrcpy 等依赖需要联网。

**能截图/录屏吗？**
应用内不能。用 `./tv-shot.sh` 截图。

**支持 macOS / Linux 吗？**
命令行可以；带遥控器的 GUI 尚未实现。

**能同时连两台电视吗？**
一个窗口一台；需要同时看两台就开两个实例，但全局快捷键会冲突，不建议。

**延迟多少？**
同一局域网 Wi-Fi 下通常 50–150 ms，取决于电视编码和网络。
