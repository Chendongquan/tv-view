# TV Viewer

[中文](README.md) · [English](README.en.md)

把 Android TV 的画面投到电脑上，用键盘和屏幕遥控器直接操作。电视端不用装 App，不经过任何第三方服务器。

Windows 桌面应用（Electron）+ 两个命令行小工具（scrcpy / adb 封装）。界面中英双语，代码标识符英文。

> English: mirror an Android TV into a single desktop window over ADB + scrcpy, with an on-screen remote and keyboard shortcuts. No TV-side app, no account, no relay server. Windows is implemented today.

## 功能

- Windows 安装包内置 scrcpy 5.0.1 和 adb，下载即用，不需要另外安装 Node.js 或 scrcpy。
- 输入电视 IP → `adb connect` → scrcpy 画面嵌入应用窗口，而不是漂浮的独立窗口。
- 右侧圆形点按板遥控器：方向 / OK / 返回 / 主页 / 菜单 / 最近 / 音量 ± / 静音 / 播放暂停 / 电源。方向键支持按住连发。
- 电源键始终二次确认，避免误触把电视关机。
- 无边框窗口：交通灯、拖动顶栏、置顶、铺满窗口、全屏。
- 键盘：方向键、回车、退格直接发到电视；画面有焦点时沿用 scrcpy 键位（`Alt+B` 返回等）。
- 设置：中 / 英文切换、启动自动连接、掉线自动重连、方向键连发速度、窗口置顶、显示遥控器。
- 掉线自动重连；窗口嵌入失败时退化为独立 scrcpy 窗口，遥控器仍可用。
- 命令行：`tv-view` 一键投屏；`tv-shot` 截图，兼容 Android 4.x 的 Lite 电视。

## 快速开始

### 下载安装包（推荐）

从 [GitHub Releases](https://github.com/Chendongquan/tv-view/releases) 下载最新版本：

- `tv-viewer-setup-<版本>-x64.exe`：安装版，创建开始菜单和桌面快捷方式，按用户安装，不需要管理员权限。
- `tv-viewer-portable-<版本>-x64.exe`：便携版，双击运行；首次启动会解压到临时目录，稍慢一点。

安装包已经内置 scrcpy 5.0.1 和 adb，不需要 Node.js，也不需要单独安装 scrcpy。安装包没有代码签名，Windows SmartScreen 可能提示“未知发布者”；确认文件来自本仓库 Releases 后再运行。

### 用 Agent 从源码配置

把下面这段贴给 Claude Code 或任何能执行命令的编码 Agent，它会检查依赖、拉代码、安装并连上电视。只需把 `<电视IP>` 换成你的电视地址。

```text
帮我在这台 Windows 电脑上装好 TV Viewer 并连上我的 Android 电视。

1. 检查 Node.js ≥ 22、scrcpy 和 adb；缺的用 winget 安装（scrcpy 包名 Genymobile.scrcpy）。
2. 把 https://github.com/Chendongquan/tv-view 克隆到一个合适目录，进入 remote，执行 npm install。
3. 电视 IP 是 <电视IP>（例如 192.168.50.33，端口默认 5555）。
   确认电视已开启 ADB 调试、和电脑在同一局域网。
4. 执行 npm start，在应用里填入 IP 点「连接并投屏」；如连不上，依次检查 adb connect、防火墙和 5555 端口。
5. 成功后告诉我：已连接的设备、可用的快捷键，以及怎么在设置里打开「启动时自动连接」。

不要往电视上安装任何 App，也不要引入第三方中转服务。
如果 winget 或 npm 不可用，先告诉我缺什么，再给出手动安装步骤。
```

<details>
<summary>English prompt</summary>

```text
Set up TV Viewer from source on this Windows PC and connect it to my Android TV.

1. Check for Node.js >= 22, scrcpy and adb; install anything missing with winget (package: Genymobile.scrcpy).
2. Clone https://github.com/Chendongquan/tv-view into a sensible directory, then run npm install in remote/.
3. The TV is at <TV-IP> (for example 192.168.50.33, port 5555 by default).
   Confirm ADB debugging is enabled on the TV and that it is on the same LAN as this PC.
4. Run npm start, enter the IP, and click the connect button. If it fails, check adb connect, the firewall, and port 5555.
5. When it works, tell me the connected device, the available shortcuts, and how to enable "Connect on launch" in settings.

Do not install anything on the TV and do not introduce any third-party relay service.
If winget or npm is unavailable, tell me what is missing and give manual install steps first.
```

</details>

### 从源码运行（需要 Node.js 和 scrcpy）

- Windows 10 / 11
- Node.js 22+
- scrcpy（自带 adb）

```bash
winget install Genymobile.scrcpy
```

电视需要开启 ADB 调试，电脑和电视在同一局域网。

### 桌面应用

```bash
cd remote
npm install
npm start
```

装好依赖后也可以双击 `remote/tv-viewer.cmd`，不弹控制台。

### 命令行（可选）

```bash
./tv-view.sh 192.168.50.33
./tv-shot.sh before.png 192.168.50.33
```

Git Bash 用 `.sh`，cmd / PowerShell 用 `.cmd`。`tv-view` 的参数里，不以 `-` 开头的第一个值当作电视地址，其余原样传给 scrcpy：

```bash
./tv-view.sh 192.168.50.33 --max-size=1280 --video-bit-rate=4M
```

## 快捷键

| 操作 | 快捷键 |
| --- | --- |
| 显示 / 隐藏遥控器 | `Ctrl+Alt+H` |
| 铺满窗口 | `Ctrl+Alt+W` |
| 全屏 | `Ctrl+Alt+F` 或 `Ctrl+Alt+Enter` |
| 退出满窗口 / 全屏 | `Esc`，或再按一次对应快捷键 |
| 返回电视 | 连接后按 `Esc`；画面有焦点时 `Alt+B` 或鼠标右键 |
| Home / 最近任务 | 画面有焦点时 `Alt+H` / `Alt+S` |

快捷键里的 MOD 是左 Alt（左 Windows 键也可以），不是 Ctrl。Ctrl 组合会原样转发给电视上的 App。

`Esc` 的优先级：关闭设置 → 取消电源确认 → 退出全屏 → 退出满窗口 → 发送返回键。

## 已验证环境

- Windows 11，2560×1440，150% 缩放。
- 小米 MFTR0，Android 11，1920×1080。
- scrcpy 5.0.1，Electron 45。

macOS、Linux 和其他电视型号尚未验证。

## 常见问题

- **电视端要装 App 吗？** 不要。只用系统自带的 ADB 和 scrcpy 临时推送的 server。
- **需要开 ADB 调试吗？** 需要。投屏、按键、截图都走 ADB。
- **需要 root 吗？** 不需要。
- **有声音吗？** 没有，声音仍从电视出。
- **支持 macOS / Linux 吗？** 命令行可以；带遥控器和窗口嵌入的 GUI 目前仅 Windows。
- **支持 Android 4.x 吗？** 投屏要求 5.0+；4.x 只能用 `tv-shot` 截图。
- **能同时连两台电视吗？** 一个窗口一台，多实例的全局快捷键会冲突。

更多问题和排查步骤见 [故障排查](docs/TROUBLESHOOTING.md)。

## 已知问题与限制

- 小米 MFTR0 上不要用 `--max-size=1600`：编码会变成 1600×896，出现彩色横条和文字彩边。要降负载请用 `--max-size=1280`。
- 同一台电视同时只建议开一个投屏实例。
- 满窗口 / 全屏时，画面是原生子窗口，会盖住网页里的按钮；退出请用快捷键。
- GUI 按原生分辨率投屏，没有码率设置；网络差时用命令行降码率。
- 电视端硬件编码会占用 GPU / 编码器，测帧率、动效前先点断开。
- 如果窗口嵌入失败，scrcpy 会退化为独立窗口，遥控器仍然可用。
- 安装包没有代码签名，Windows SmartScreen 会提示“未知发布者”；只从本仓库 Releases 下载。
- 安装包内置固定 scrcpy 5.0.1；需要换版本时从源码运行，并设置 `SCRCPY` 指向目标版本。

## 安全与隐私

- ADB 的 5555 端口对局域网开放，只靠 RSA 授权保护。不要在不可信网络开启，也不要把端口转发到公网。
- 应用没有遥测、账号或云端；配置只存在本机 `%APPDATA%\TV Viewer\config.json`。
- scrcpy server 只在投屏期间临时运行，退出即结束，不常驻电视。
- 所有操作只发往你在输入框里填的电视地址。
- 安装包未做代码签名；下载时请确认来源是本仓库 Releases，并用发布页附带的 SHA256 校验文件。

威胁模型和加固建议见 [安全说明](SECURITY.md)。

## 文档

| 文档 | 内容 |
| --- | --- |
| [故障排查](docs/TROUBLESHOOTING.md) | 连不上、授权、无线调试、嵌入失败、按键、重连、FAQ |
| [开发与构建](docs/DEVELOPMENT.md) | 目录、IPC、窗口嵌入原理、配置字段、i18n、打包和发布 |
| [应用细节](remote/README.md) | 界面、显示模式、遥控器、设置、已验证项 |
| [设计系统](remote/DESIGN.md) | 颜色、字体、布局、组件和设计约束 |
| [产品说明](remote/PRODUCT.md) | 目标用户、定位、能力边界 |
| [贡献指南](CONTRIBUTING.md) | 报 bug、提 PR、代码约定 |
| [第三方许可](remote/THIRD_PARTY_NOTICES.md) | 内置 scrcpy、adb、Electron 的许可说明 |
| [安全说明](SECURITY.md) | 威胁模型、ADB 端口风险、加固建议 |
| [更新日志](CHANGELOG.md) | 版本变更 |

## 仓库结构

```
remote/                  Electron 桌面应用
  main.js                adb / scrcpy / 窗口嵌入 / IPC / 全局快捷键
  preload.js             contextBridge 暴露的最小 API
  renderer.js            界面状态、遥控按键、窗口拖动、画面区域上报
  embed-scrcpy.ps1       Win32 SetParent / MoveWindow，DPI 感知
  index.html style.css   无边框界面
  i18n.js                中英文文案
tv-view.sh / .cmd        命令行投屏
tv-shot.sh / .cmd        命令行截图
docs/                    故障排查、开发与构建
```

原理：主进程启动 scrcpy，渲染进程把画面区域的 CSS 矩形通过 IPC 报给主进程，PowerShell 用 `SetParent` 把 scrcpy 窗口嵌进 Electron 窗口并定位；按键走 `adb shell input keyevent`，不依赖 scrcpy 窗口焦点。

## 开发

```bash
cd remote
npm install
npm start       # 开发运行
npm run check   # node --check 语法检查
```

打包 Windows 安装版和便携版：

```bash
cd remote
npm run fetch-vendor   # 下载 scrcpy 5.0.1 到 vendor/，或用 -FromPath 指定本地目录
npm run dist           # 产物在 dist/
```

`vendor/` 和 `dist/` 不提交到仓库。细节见 [开发与构建](docs/DEVELOPMENT.md)。

## 参与贡献

欢迎报告问题和提交 PR，先看 [CONTRIBUTING.md](CONTRIBUTING.md)。电视端不装 App、不引入第三方中转服务是项目的硬约束。

## License

[MIT](LICENSE)
