---
name: TV Viewer
description: A desktop Apple TV console for mirroring and operating an Android TV.
colors:
  ground: "#1c1c1e"
  surface: "rgba(44, 44, 46, 0.72)"
  surface-strong: "#2c2c2e"
  hairline: "rgba(255, 255, 255, 0.1)"
  label: "#f5f5f7"
  secondary: "#98989d"
  placeholder: "#8e8e93"
  pad-icon: "#d1d1d6"
  accent: "#ff9f0a"
  accent-hover: "#ffb340"
  accent-wash: "rgba(255, 159, 10, 0.16)"
  accent-ring: "rgba(255, 159, 10, 0.22)"
  control-fill: "rgba(255, 255, 255, 0.06)"
  control-fill-hover: "rgba(255, 255, 255, 0.1)"
  control-fill-active: "rgba(255, 255, 255, 0.14)"
  input-fill: "rgba(0, 0, 0, 0.35)"
  picture-black: "#000000"
  green: "#30d158"
  amber: "#ffd60a"
  red: "#ff453a"
  red-soft: "#ffb3b0"
  status-green-text: "#a8e6b8"
  status-amber-text: "#efd18a"
  status-red-text: "#ff9a94"
  danger-wash: "rgba(255, 69, 58, 0.12)"
  danger-hairline: "rgba(255, 69, 58, 0.28)"
  danger-press: "rgba(255, 69, 58, 0.16)"
  traffic-close: "#ff5f57"
  traffic-min: "#febc2e"
  traffic-zoom: "#28c840"
typography:
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Microsoft YaHei UI\", sans-serif"
    fontSize: "22px"
    fontWeight: 590
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Microsoft YaHei UI\", sans-serif"
    fontSize: "13px"
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Microsoft YaHei UI\", sans-serif"
    fontSize: "12px"
  label-medium:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Microsoft YaHei UI\", sans-serif"
    fontSize: "12px"
    fontWeight: 510
  action:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Microsoft YaHei UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 590
  control:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Microsoft YaHei UI\", sans-serif"
    fontSize: "13px"
    fontWeight: 590
  input:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", \"Microsoft YaHei UI\", sans-serif"
    fontSize: "15px"
    fontFeature: "tnum"
rounded:
  s: "8px"
  l: "22px"
  control: "10px"
  stage: "16px"
  capsule: "999px"
  circle: "50%"
spacing:
  inset: "2px"
  tight: "6px"
  base: "8px"
  snug: "10px"
  roomy: "12px"
  gutter: "14px"
  panel: "22px"
  card: "26px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    height: "44px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-primary-disabled:
    backgroundColor: "rgba(255, 159, 10, 0.35)"
    textColor: "rgba(28, 28, 30, 0.55)"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    height: "44px"
    width: "100%"
  text-button:
    backgroundColor: "{colors.control-fill}"
    textColor: "{colors.label}"
    typography: "{typography.label}"
    rounded: "{rounded.s}"
    height: "28px"
    padding: "0 10px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    rounded: "{rounded.s}"
    size: "30px"
  icon-button-active:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
    rounded: "{rounded.s}"
    size: "30px"
  segment:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.label-medium}"
    rounded: "7px"
    height: "24px"
    padding: "0 10px"
  segment-active:
    backgroundColor: "{colors.control-fill-active}"
    textColor: "{colors.label}"
    rounded: "7px"
    height: "24px"
    padding: "0 10px"
  input-ip:
    backgroundColor: "{colors.input-fill}"
    textColor: "{colors.label}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    height: "44px"
    width: "100%"
    padding: "0 12px"
  connect-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.label}"
    rounded: "{rounded.l}"
    width: "min(460px, 100%)"
    padding: "26px 26px 22px"
  remote-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.label}"
    rounded: "{rounded.l}"
    width: "280px"
    padding: "14px"
  pill:
    backgroundColor: "{colors.control-fill}"
    textColor: "{colors.label}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "40px"
  status-indicator:
    backgroundColor: "{colors.control-fill}"
    rounded: "{rounded.control}"
    size: "30px"
  stage:
    backgroundColor: "{colors.picture-black}"
    rounded: "{rounded.stage}"
  clickpad:
    rounded: "{rounded.circle}"
    size: "184px"
---

# Design System: TV Viewer

## Overview

**Creative North Star: "The Quiet Console"**

A desktop Apple TV console, not a scrcpy shell. One dark, quiet window holds the TV picture as the hero and a physical-feeling clickpad remote beside it. The world is built from tvOS dark materials: a near-black ground, translucent charcoal cards, 1px seams, and system orange as the only accent. It deliberately refuses the old top-bar-plus-button-grid dashboard and any generic mirroring-tool chrome.

The composition is one glance: the stage takes every remaining pixel, and the 280px remote is the only permanent control column. The primary action lives inside the stage's connect card, never in the toolbar. Failure returns that same identity card with the exact cause and a focused retry. The remote stays visually neutral until ADB is healthy; connection health is the only place green, amber, and red appear.

Materials are glass without gloss: 24–30px blur at 160% saturation, long soft shadows, and no decorative gradients except the clickpad's physical shading. Motion is short and mechanical: 140ms for state, 80ms for press, a 1.2s status pulse. The macOS traffic lights are a deliberate Apple-world signature, not a Windows chrome default.

**Key Characteristics:**
- Picture-first: a pure-black stage with charcoal glass chrome.
- One accent: system orange; green/amber/red reserved for connection health.
- One family: SF-style system sans at a fixed 12/13/14/15/22 ramp, weights 510/590.
- Physical centerpiece: a 184px circular clickpad with four direction zones and a 64px OK.
- Quiet remote: neutral icon+label pills; power red only while pressed; the active disconnect stop is the one red toolbar action.
- Native-aware: the embedded scrcpy child owns the stage; no required web overlay in immersive modes.
- Calm by default, exact on failure: status icon, error banner, focused retry.

## Colors

A near-black tvOS palette with a single warm orange accent; every other color is either a neutral material or a connection-health signal.

### Primary

- **System Orange** (#ff9f0a): the only accent. It fills the connect button, tints active toolbar toggles, draws the connect-card TV glyph, colors the input caret, and provides the focus outline and text-selection wash.
- **Orange Hover** (#ffb340): primary-button hover only.
- **Orange Wash** (rgba(255, 159, 10, 0.16)): background of active icon toggles.
- **Orange Focus Ring** (rgba(255, 159, 10, 0.22)): the 3px ring around the focused IP field.

### Functional Signals

- **Health Green** (#30d158): connected status icon.
- **Health Amber** (#ffd60a): connecting and warning status icons.
- **Health Red** (#ff453a): error status icon.
- **Enabled Stop** (#ff453a): the stop icon only while a session is active; it grows from 16px to 18px. This is the one sanctioned red action control outside connection health.
- **Soft Red** (#ffb3b0): error-banner copy and the pressed power-pill label/icon.
- **Danger Wash / Hairline / Press** (rgba(255, 69, 58, 0.12 / 0.28 / 0.16)): error-banner fill, error-banner border, and the only red press fill (power).

### Neutral

- **Window Ground** (#1c1c1e): the body field and all unfilled chrome; never pure black.
- **Glass Surface** (rgba(44, 44, 46, 0.72)): connect card and remote card over blur.
- **Pad Charcoal** (#2c2c2e): the clickpad material base and strongest opaque surface value.
- **Hairline** (rgba(255, 255, 255, 0.1)): 1px seams on the stage, cards, and OK key; pills use a softer 0.05 and inputs a 0.12.
- **Label** (#f5f5f7): primary text on dark.
- **Secondary Label** (#98989d): idle status icon and pill icons.
- **Placeholder** (#8e8e93): IP-field placeholder.
- **Pad Icon** (#d1d1d6): directional arrows on the clickpad.
- **Picture Black** (#000000): the stage only.
- **Control Fill** (rgba(255, 255, 255, 0.06)): status icon chip, display track, and pills. Hover rises to 0.10, active to 0.14.
- **Input Fill** (rgba(0, 0, 0, 0.35)): the recessed IP field.

### System Chrome

- **Traffic Close** (#ff5f57), **Traffic Min** (#febc2e), **Traffic Zoom** (#28c840): 12px window-control lights; their glyph strokes appear only on hover.

### Named Rules

**The One Accent Rule.** Orange is the only accent hue. Green, amber, and red are connection-health signals and the power-pill press state, never decoration or secondary branding.

**The Black Stage Rule.** Pure black belongs to the picture stage; the recessed IP field is a black wash at 35%. The window ground is #1c1c1e, and no raised chrome surface is black.

**The Power-Neutral Rule.** The power pill is neutral at rest. Red appears only while it is held (:active), never as a resting color.

**The Calm Remote Rule.** Remote controls stay neutral at rest; only white-alpha fills respond to hover and press. The toolbar may show active orange; the remote may not, except the power press.

## Typography

**Display Font:** SF-style system sans (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI Variable Text", "Microsoft YaHei UI", sans-serif`)

**Body Font:** Same family.

**Label/Mono Font:** Same family; the IP field uses tabular numerals.

**Character:** One family, no display face. Hierarchy comes from weight (590 for titles/actions) and five fixed sizes. On Windows the stack resolves to Segoe UI Variable Text with Microsoft YaHei UI for Chinese; that is the world's native system-sans choice, not a fallback defect.

The direction contract named an 11/12/13/15/17/22 ramp; the build shipped 12/13/14/15/22. The build wins and is the recorded ramp.

### Hierarchy

- **Title** (590, 22px, -0.01em): the connect-card headline only ("连接电视", "没连上", "正在连接…", "画面已单独打开").
- **Action** (590, 14px): the primary connect button.
- **Control** (590, 13px): the toolbar title and the OK key.
- **Input** (400, 15px, tabular numerals): the IP address field.
- **Label** (400, 12px): pill labels and error copy; line-height 1.4–1.5.

### Named Rules

**The Fixed Ramp Rule.** Type sizes come only from 12 / 13 / 14 / 15 / 22px. Create hierarchy with weight (510/590), color (label versus secondary), and spacing, never with a new size.

**The System-Sans Rule.** The system sans is the identity. Do not introduce a display, serif, or mono face; use tabular numerals for addresses.

## Layout

The window is a single flex column. A 52px toolbar spans the top; the body is a two-column row: a flexible black stage and a fixed 280px remote card, separated by 12px inside a 10px/12px/12px inset. The connect card is 460px max and centered in the stage. The default window is 1380×860 (or the work area minus 60px), centered; the supported floor is 900×600.

Toolbar: 14px horizontal padding and an 8px gap; 12px traffic lights, a centered 13px app title on an absolute axis, a 30px status icon, a 30px stop icon button, a 30px pin icon button, a 30px remote icon button, and two 30×24px icon segments in a 10px track. Empty toolbar space is the drag region; double-click toggles fullscreen.

Breakpoints:
- ≤1120px: hide the centered app title; the remote narrows to 252px; connect-card padding drops to 22px.
- ≤980px: icon segments stay 30px.
- Immersive modes (fill-window/fullscreen): hide the toolbar and remote, zero main padding/gap, and remove the stage border and radius.

**The Native-Child Rule.** The picture is a native scrcpy child window reparented with SetParent, not a DOM video element. It paints above every web-rendered pixel and receives the stage's CSS rectangle scaled by devicePixelRatio. The stage must therefore remain a plain rectangle whose only web decoration is a 1px hairline and a 16px radius while the child is inset; fill-window and fullscreen remove both. Never place a required control, tooltip, or status over the stage when the child is embedded; exit relies on Esc (when the app window holds focus), Ctrl+Alt+W, and Ctrl+Alt+F, and the persistent state capsule lives in the toolbar.

Accessibility: body text is 13px and the layout is checked at Windows 150% scaling; the window floor is 900×600. Focus-visible is a 2px orange outline with a 2px offset; the IP field instead uses an orange border plus a 3px orange-alpha ring. Status is `aria-live="polite"`; toggles expose `aria-pressed`; disabled controls are 35% opacity; all motion collapses under `prefers-reduced-motion`.

**The One-Glance Rule.** Picture and controls share one window. The primary action lives in the stage's connect card, never in the toolbar; the toolbar holds only status, mode, and window controls.

## Elevation & Depth

Hybrid: tonal glass plus long, soft shadows. The stage is a recessed black well; the two cards float on translucent charcoal with 24–30px blur at 160% saturation; the clickpad is the only object with sculpted inset highlights. Shadows are long and diffuse, never offset or hard-edged.

### Shadow Vocabulary

- **Card Float** (`box-shadow: 0 24px 60px rgba(0,0,0,0.55)`): the connect card over the stage.
- **Remote Float** (`box-shadow: 0 18px 40px rgba(0,0,0,0.35)`): the remote card against the ground.
- **Clickpad Float** (`box-shadow: 0 12px 28px rgba(0,0,0,0.4)`): the pad's lift off the remote.
- **Clickpad Material** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -8px 18px rgba(0,0,0,0.35)`): top highlight and bottom shading.
- **Input Focus Ring** (`box-shadow: 0 0 0 3px rgba(255,159,10,0.22)`): the IP field's focus halo.

Materials: the toolbar is `rgba(28,28,30,0.78)` with `blur(24px) saturate(160%)`; cards are `rgba(44,44,46,0.72)` with `blur(24–30px) saturate(160%)`. No gloss, bevel, or second shadow layer. The frameless BrowserWindow pre-paints `#0e0e10` before the renderer loads; that is a native pre-paint value, not a surface token.

### Named Rules

**The Long Shadow Rule.** Shadows are large-blur and low-contrast under floating panels and the clickpad. No hard offsets, no neobrutalist edges, no stacked shadow sets.

**The Material-Only Gradient Rule.** The only gradient in the system is the clickpad's radial charcoal shading (`circle at 50% 30%`, #3a3a3c → #2c2c2e → #242426). Never use gradients as decorative background washes.

## Shapes

Rectangular panels use continuous corners: 22px for cards and the settings panel, 16px for the stage, 12px for the confirm popover, 8px for toolbar controls and segment cells, 10px for fields and pills, and 999px for switches. The `:root` scale declares 8/12/22px; the applied 10px and 16px values live as literals. Circles are reserved for physical objects: 12px traffic lights, the 184px clickpad, its 44px direction zones, the 64px OK, and the 22px switch knob. Hairlines are 1px and never heavier than rgba(255,255,255,.12).

**The Circle Rule.** Circles mean an object you press or a status indicator. Panels and fields stay rectangular with continuous corners; do not turn cards into capsules.

## Components

### Buttons

- **Shape:** 10px corners and 44px height for the primary action; 8px corners for toolbar text and icon buttons; 10px for remote pills; 8px for icon segment cells.
- **Primary:** full-width system orange with ground-colored text at 14px/590; hover to Orange Hover; press to `scale(0.99)`; disabled orange at 35% with 55% ground text. Its label shifts 连接并投屏 → 连接中… → 重新连接 and it is disabled while connecting.
- **Hover / Focus:** background and color transition at 140ms ease, transform at 80ms ease; focus-visible is a 2px orange outline with a 2px offset. Disabled controls sit at 35% opacity with no transform.
- **Secondary / Ghost:** icon buttons are 30px, 8px-radius transparent controls that gain white-8% on hover and orange-16% plus an orange glyph when active; the disconnect action uses the same control with a filled stop square and is disabled while idle or failed, turning red at 18px when enabled. The 30px status indicator is a white-6% chip with a link icon. The display control is a 2px-inset white-6% track with two 30×24px icon cells whose active cell is white-14%.

### Status Indicator

A 30px square chip aligned with the toolbar icon buttons, white-6% fill, 8px radius, centered 16px chain-link icon at 1.5 stroke. Idle and error show a diagonal slash across the link; connecting, connected and warning hide the slash. Color carries state: secondary for idle, amber pulse for connecting, green for connected, amber for warning, red for error. The human-readable message lives in the element's title and aria-label (for example "已连接 192.168.50.33:5555"), never in visible copy. Disconnect is a separate 30px icon button with a filled stop square, disabled while idle or failed; when enabled it grows to 18px and turns red.

### Settings Sheet

A 560px glass panel centered over a dimmed, blurred window (48% black over 6px blur), 22px radius, 30px blur, 22px padding, and a 180ms translate/scale entrance. Header: 22px/590 title plus a 30px close icon. Groups are separated by 1px hairlines, with 12px/590 secondary headings and 42px rows: 13px label left, control right. Language and D-pad repeat use a 2px-inset white-6% track with text segments (30px tall, 8px radius, active white-14%). Toggles are 44×26 capsules with a 22px white knob and 18px travel; on is orange. While the sheet is open the native scrcpy child is hidden with `ShowWindow`, so the sheet can cover the stage without being clipped or overpainted; closing restores it. Esc, the backdrop, and the close button dismiss; focus is trapped and returns to the settings gear.

### Switch

A 44×26px capsule on white-14% at rest and system orange when on. The 22px white knob travels 18px with a 180ms exponential ease-out. The switch is a real `button[role="switch"]` with `aria-checked`; its accessible name comes from the adjacent setting label.

### Power Confirmation

Power is never sent directly. Every press of the remote power key opens a 252px confirmation popover fixed at the bottom-right, with Cancel and Power off; only the confirm action sends `KEYCODE_POWER`. This is a product invariant, not a setting — the settings sheet never exposes it. The popover sits outside the remote card in the DOM so it is not a nested card, and it remains above the native child because it is in the toolbar/right-column region rather than over the stage.

### Localization

Every visible string comes from `i18n.js` (zh/en); the renderer applies `data-i18n`, `data-i18n-title`, and `data-i18n-aria` on load and on language change. Connection and error states travel from the main process as codes, not prose, so the status tooltip, error card, and settings sheet all re-render in the selected language without a restart. The language choice persists in the app config.

### Cards / Containers

- **Connect Card:** 460px max, 22px corners, rgba(44,44,46,.72) over blur(30px) saturate(160%), 1px hairline, 26px/26px/22px padding, Card Float shadow, centered. It contains a 26px orange TV glyph and 22px title, an optional red error banner, a 44px input, and a 44px primary button. Disconnected, connecting, warning, and error all use this one card; only the title copy and error visibility change.
- **Remote Card:** 280px (252px at ≤1120px), 22px corners, the same glass, 14px padding, 8px gap, Remote Float shadow. It has no header: the clickpad is the first element, and the status icon's tooltip carries the device address. The card is vertically centered against the stage rather than stretched.
- **Stage:** flex 1, pure black, 16px radius plus a 1px hairline while inset; zero radius and no border in immersive modes. The native child covers it.

### Inputs / Fields

- **Style:** 44px tall, 10px corners, rgba(0,0,0,.35) recessed fill, 1px rgba(255,255,255,.12) border, 15px text with tabular numerals, 12px horizontal padding, #8e8e93 placeholder.
- **Focus:** an orange border plus a 3px rgba(255,159,10,.22) ring, with no outline; the caret is orange.
- **Error:** errors do not redraw the field. A red banner above it states the cause, and the field is focused and selected on failure.

### Navigation

The toolbar is the only navigation: traffic lights (close, minimize, fullscreen), centered title, status, disconnect, pin, remote toggle, and the window/fullscreen icon segments. Toggles use `aria-pressed`; active icon buttons use orange. Empty toolbar space drags the frameless window; double-click toggles fullscreen.

### Signature: The Clickpad

A 184px circle centered in the remote with a 6px top and 10px bottom margin. A radial charcoal ring supplies the material; four 44px transparent circular direction zones sit 8px from the edge (up: top 8/left 70; right: top 70/right 8; down: bottom 8/left 70; left: top 70/left 8). The 64px OK sits at 60/60 with a 1px hairline and white-10% fill. Direction icons are 18px at 1.8 stroke; OK is 13px/590. Hover and press use white 7%/12% on directions and 15%/20% on OK. Direction zones fire immediately, then repeat after 430ms at 130ms intervals; OK and the other keys fire once.

### Signature: Remote Pills and Icon System

Pills are 40px tall, 10px corners, 1px rgba(255,255,255,.05) border, white-6% fill, a 7px icon/label gap, 12px labels, and 15px secondary icons; hover is white-10%, active white-14%. Rows are two pills with an 8px gap. Power is full-width and neutral at rest; only `:active` turns rgba(255,69,58,.16) with #ffb3b0 text and icon.

Icons are inline SVG, never glyphs, emoji, icon fonts, or images: 16px base at 1.5 stroke, round caps and joins, `currentColor`, fill none. Sizes are 12px traffic glyphs, 15px pills, 16px toolbar, 18px clickpad directions at 1.8 stroke, and a 26px card glyph. The set is drawn on a 16px grid (24px for the card TV).

### Motion & State

State transitions use 140ms ease for background and color, and 80ms ease for transform. The connecting dot pulses to 35% opacity every 1.2s. The primary button presses to `scale(0.99)`. Remote buttons are disabled until ADB is connected or in warning (the picture opened externally). Failure returns the card, shows the exact cause in the red banner, focuses and selects the IP field, and changes the action to 重新连接. `prefers-reduced-motion` reduces all animation and transition durations to 0.01ms.

## Do's and Don'ts

### Do:

- **Do** keep the window ground (#1c1c1e) and the picture black (#000000) separate; black is the stage's material, not the chrome's.
- **Do** use system orange (#ff9f0a) as the only accent, and reserve green/amber/red for connection health, the held power pill's red press, and the enabled disconnect stop.
- **Do** build surfaces from rgba(44,44,46,.72) over 24–30px blur with saturate(160%) and a 1px rgba(255,255,255,.10) hairline.
- **Do** keep the connect card at 460px max with a 44px input and a 44px full-width orange action in the stage.
- **Do** let layout and button labels carry the instruction; reserve prose for errors.
- **Do** keep the clickpad 184px with 44px direction zones, a 64px OK, and 8px edge insets.
- **Do** keep remote pills neutral at rest and use only white-alpha hover and press fills.
- **Do** preserve the focus contract: a 2px orange outline with a 2px offset on buttons, and an orange border plus 3px ring on the IP field.
- **Do** honor the native child: no required web control over the stage in fill-window or fullscreen; exits stay on Esc and the global shortcuts. The settings sheet is the exception — it hides the child while open.
- **Do** make power confirmation mandatory: power always opens the confirm popover, and the setting is never offered as a toggle.
- **Do** route every visible string through `i18n.js`; the status icon, remote labels, error copy, and settings must all switch between 中文 and English in place.
- **Do** honor `prefers-reduced-motion` and Windows 150% scaling.

### Don't:

- **Don't** add a second accent hue or tint the remote card orange; orange is a signal, not a wash.
- **Don't** put red on the power pill at rest; red appears only while it is held. Don't show the stop icon red while it is disabled.
- **Don't** use decorative gradients; the clickpad's radial material is the only permitted gradient.
- **Don't** use hard offset shadows, neobrutalist borders, or glossy bevels; shadows are long, soft, and low-contrast.
- **Don't** introduce type sizes outside 12/13/14/15/22 or a non-system display face.
- **Don't** use emoji, glyph characters, icon fonts, or raster icons; draw inline SVG on the 16px grid.
- **Don't** place labels, tooltips, or controls above the embedded picture in immersive modes; the native child will cover them.
- **Don't** turn cards into capsules or squares; panels use 22px, the stage 16px, controls 8–10px, and circles are reserved for physical or indicator objects.
