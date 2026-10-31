# 参与贡献

## 先看文档

- 安装和用法：[README.md](README.md)
- 常见问题：[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- 实现细节：[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## 报告问题

请附上：

- 电视型号、Android 版本（`adb shell getprop ro.build.version.release`）
- Windows 版本、缩放比例
- scrcpy 版本（`scrcpy --version`）、Electron 版本（应用「设置 → 关于」）
- `adb devices -l` 的输出
- 复现步骤、界面状态（未连接 / 连接中 / 已连接 / 画面单独打开 / 连接失败）
- 终端里 `npm start` 的相关输出

不要在 issue 里贴真实内网 IP、序列号或调试密钥；需要时打码。

## 提交改动

- 先开 issue 或讨论，确认方向和范围，避免大改后才发现不合适。
- 保持现有结构：纯 JavaScript、无框架、无打包器；渲染进程不接触 Node。
- 新增 UI 文案必须同时补 `i18n.js` 的 `zh` 和 `en`。
- 新增设置项必须同步 `main.js` 的 `set-setting` 白名单。
- 涉及 Windows 窗口行为的改动，在真实电视上验证连接、嵌入、满窗口、全屏。
- 涉及打包配置的改动，至少跑一次 `npm run pack`，并确认 `dist/win-unpacked/resources/` 里有 `app.asar.unpacked/embed-scrcpy.ps1`、`THIRD_PARTY_NOTICES.md` 和 `LICENSE.txt`。
- 不接受伪造的“已验证”描述；没测过的平台或设备就写没测过。

## 代码风格

- 跟随现有文件的格式和命名（英文标识符，中文注释只在必要时出现）。
- 不引入新依赖，除非它能明显解决问题；引入前先说明理由。
- 提交信息用祈使句，说明“为什么”而不是逐行罗列“改了什么”。

## 打包

```bash
cd app
npm install
npm run check
npm run pack           # 快速验证 dist/win-unpacked/
npm run dist           # 安装版 + 便携版
```

`dist/` 不提交。改动 `electron-builder.yml`、`main.js` 的路径查找或 `embed-scrcpy.ps1` 相关逻辑时，必须重新跑 `npm run pack` 并启动一次 `dist/win-unpacked/TV Viewer.exe`。安装包不包含 scrcpy / adb，测试前请先在本机安装 scrcpy。

## 范围

- GUI 目前只支持 Windows；macOS / Linux 的窗口嵌入欢迎讨论，但不要假设 Win32 方案能直接移植。
- 电视端不安装 App、不引入第三方中转服务，这是项目的硬约束。
- Android 4.x 只保证截图（`cli/tv-shot`），不保证画面功能。
