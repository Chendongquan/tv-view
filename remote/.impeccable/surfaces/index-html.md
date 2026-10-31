---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# TV Viewer — 主界面

Scope: 整个单窗口应用；Operate；Windows 11 已实现，macOS/Linux 方向保留。  
Audience: 在局域网里测试或操作 Android TV 的开发者与技术型用户；对外发布。  
Success: 连上、看到、控制；任何时刻状态可读，失败可恢复。

## Direction contract

THESIS: 一台放在桌面上的 Apple TV 控制台，而不是 scrcpy 外壳：深色、安静的单窗口里电视画面是主角，右侧是一块有实体感的圆形点按板遥控器。拒绝当前的“顶栏 + 矩形按键面板”仪表盘，也拒绝任何通用投屏工具的外壳。

OWN-WORLD: tvOS 暗色材质。画面纯黑；窗口地色 #1C1C1E；表面 rgba(44,44,46,.72) 叠 24px 模糊；1px rgba(255,255,255,.10) 发丝线；SF 风格系统无衬线，11/12/13/15/17/22 固定级差；系统橙 #FF9F0A 是唯一强调色，绿/黄/红只保留给连接健康。12/16/22px 连续圆角，长而软的阴影，不做装饰性渐变。

STORY: 未连接时用户看到一张电视身份卡，连接一次后画面接管舞台；遥控器只在 ADB 健康时点亮。失败时身份卡回来，说明具体原因，并把焦点放回输入框。设置页可切换中英文，并控制启动自动连接、掉线重连和连发速度；电源键始终二次确认。

FIRST VIEWPORT: 52px 浮动工具栏：左侧 macOS 红黄绿交通灯，中间 “TV Viewer”，右侧状态图标、断开（激活时红色放大的停止方块）、遥控器/置顶/设置/显示模式控件。下方是圆角深色舞台与右侧 280px 遥控卡；遥控卡内是 184px 圆形点按板、四个方向区、中央 OK，以及带图标和文字的胶囊按键。未连接时舞台中央是一张 460px 玻璃连接卡：图标+标题、IP 输入、全宽橙色“连接并投屏”；说明性文字只留给错误态。主操作在舞台内，不在工具栏。

FORM: 方向由 brief 钉死（Apple/tvOS），不走 roll；position: brief-pinned；seed: none (unavailable)。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
