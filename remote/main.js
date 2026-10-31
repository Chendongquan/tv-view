const { app, BrowserWindow, ipcMain, screen, Menu, globalShortcut } = require('electron');
const { spawn, execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCREEN_TITLE = 'TvViewerVideo';
const APP_ROOT = app.isPackaged
  ? path.join(process.resourcesPath, 'app.asar.unpacked')
  : __dirname;
const EMBED_SCRIPT = path.join(APP_ROOT, 'embed-scrcpy.ps1');

let mainWindow = null;
let scrcpyProc = null;
let adbPath = 'adb';
let scrcpyPath = 'scrcpy';
let serial = '';
let lastRect = null;
let embedded = false;
let embedding = false;
let childHwnd = 0;
let moveTimer = null;
let showRemote = true;
let fullscreen = false;
let windowFill = false;
let reconnectTimer = null;
let reconnectAttempts = 0;
let autoConnectPending = true;

function configPath() {
  return path.join(app.getPath('userData'), 'config.json');
}

function migrateConfig() {
  const target = configPath();
  if (fs.existsSync(target)) return;
  const appData = app.getPath('appData');
  for (const name of ['tv-viewer', 'tv-remote']) {
    const legacy = path.join(appData, name, 'config.json');
    try {
      if (fs.existsSync(legacy)) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(legacy, target);
        return;
      }
    } catch {
      // try the next legacy location
    }
  }
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath(), 'utf8'));
  } catch {
    return {};
  }
}

function saveConfig(data) {
  try {
    fs.writeFileSync(configPath(), JSON.stringify({ ...loadConfig(), ...data }));
  } catch {
    // best effort
  }
}

function defaultLanguage() {
  return (app.getLocale() || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function settings() {
  const config = loadConfig();
  return {
    language:
      config.language === 'zh' || config.language === 'en'
        ? config.language
        : defaultLanguage(),
    autoConnect: config.autoConnect === true,
    autoReconnect: config.autoReconnect !== false,
    repeatFast: config.repeatFast === true,
    alwaysOnTop: config.alwaysOnTop === true,
    showRemote: config.showRemote !== false,
  };
}

function broadcastSettings() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('settings', settings());
  }
}

function findAdb() {
  if (process.env.ADB) return process.env.ADB;
  if (app.isPackaged) {
    const bundled = path.join(process.resourcesPath, 'scrcpy', 'adb.exe');
    if (fs.existsSync(bundled)) return bundled;
  }
  const local = path.join(
    process.env.LOCALAPPDATA || '',
    'Android', 'Sdk', 'platform-tools', 'adb.exe'
  );
  return fs.existsSync(local) ? local : 'adb';
}

function findScrcpy() {
  if (process.env.SCRCPY) return process.env.SCRCPY;
  if (app.isPackaged) {
    const bundled = path.join(process.resourcesPath, 'scrcpy', 'scrcpy.exe');
    if (fs.existsSync(bundled)) return bundled;
  }
  const base = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  try {
    for (const name of fs.readdirSync(base)) {
      if (!name.toLowerCase().startsWith('genymobile.scrcpy')) continue;
      const stack = [path.join(base, name)];
      while (stack.length) {
        const dir = stack.pop();
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) stack.push(full);
          else if (entry.name.toLowerCase() === 'scrcpy.exe') return full;
        }
      }
    }
  } catch {
    // fall through
  }
  return 'scrcpy';
}

function run(file, args, timeout = 10000) {
  return new Promise((resolve, reject) => {
    execFile(
      file,
      args,
      { windowsHide: true, timeout, encoding: 'utf8' },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error((stderr || stdout || error.message).trim()));
          return;
        }
        resolve({ stdout, stderr });
      }
    );
  });
}

function sendState(state, extra = {}) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('state', { state, ...extra });
  }
}

function setRemote(value) {
  showRemote = Boolean(value);
  saveConfig({ showRemote });
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('remote-visibility', showRemote);
  }
  broadcastSettings();
  return showRemote;
}

function setWindowFill(value) {
  windowFill = Boolean(value);
  if (windowFill && fullscreen) {
    fullscreen = false;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setFullScreen(false);
      mainWindow.webContents.send('fullscreen', false);
    }
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('window-fill', windowFill);
  }
  return windowFill;
}

function setFullscreen(value) {
  fullscreen = Boolean(value);
  if (fullscreen && windowFill) {
    windowFill = false;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-fill', false);
    }
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setFullScreen(fullscreen);
    mainWindow.webContents.send('fullscreen', fullscreen);
  }
  return fullscreen;
}

function stopMirror(quiet = false) {
  const proc = scrcpyProc;
  scrcpyProc = null;
  embedded = false;
  embedding = false;
  childHwnd = 0;
  if (proc && !proc.killed) {
    try {
      proc.kill();
    } catch {
      // already gone
    }
  }
  if (!quiet) {
    clearTimeout(reconnectTimer);
    reconnectAttempts = 0;
    sendState('idle');
  }
}

function scheduleReconnect() {
  if (reconnectAttempts >= 3) {
    sendState('error', { code: 'reconnect-failed' });
    return;
  }
  reconnectAttempts += 1;
  sendState('connecting', { reconnecting: true });
  clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(async () => {
    try {
      await connect(serial);
    } catch {
      scheduleReconnect();
    }
  }, 2000);
}

function startScrcpy(target) {
  const env = { ...process.env, ADB: adbPath };
  const proc = spawn(
    scrcpyPath,
    [
      '--serial', target,
      '--no-audio',
      '--window-title', SCREEN_TITLE,
      '--window-borderless',
      '--window-x', '-30000',
      '--window-y', '-30000',
    ],
    { env, stdio: 'ignore', windowsHide: true }
  );
  scrcpyProc = proc;
  proc.on('exit', (code) => {
    if (scrcpyProc !== proc) return;
    scrcpyProc = null;
    embedded = false;
    embedding = false;
    childHwnd = 0;
    if (code === 0) {
      sendState('idle');
    } else if (settings().autoReconnect && serial) {
      scheduleReconnect();
    } else {
      sendState('error', { code: 'scrcpy-exited', detail: String(code) });
    }
  });
  proc.on('error', () => {
    sendState('error', { code: 'scrcpy-start' });
  });
  sendState('connecting');
}

function callEmbed(mode, rect) {
  return new Promise((resolve) => {
    if (!scrcpyProc || !rect) {
      resolve(null);
      return;
    }
    const args = [
      '-NoProfile', '-ExecutionPolicy', 'Bypass',
      '-File', EMBED_SCRIPT,
      '-ParentPid', String(process.pid),
      '-ChildPid', String(scrcpyProc.pid),
      '-X', String(rect.x),
      '-Y', String(rect.y),
      '-W', String(rect.width),
      '-H', String(rect.height),
      '-ChildHwnd', String(childHwnd),
      '-Mode', mode,
    ];
    execFile(
      'powershell.exe',
      args,
      { windowsHide: true, timeout: 30000, encoding: 'utf8' },
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        const lines = String(stdout).trim().split(/\r?\n/);
        try {
          const result = JSON.parse(lines[lines.length - 1]);
          if (result.child) childHwnd = result.child;
          resolve(result);
        } catch {
          resolve(null);
        }
      }
    );
  });
}

async function embedOrMove(rect) {
  lastRect = rect;
  if (!scrcpyProc) return;
  if (!embedded) {
    if (embedding) return;
    embedding = true;
    const result = await callEmbed('embed', rect);
    embedding = false;
    if (result && result.mode === 'embed') {
      embedded = true;
      reconnectAttempts = 0;
      clearTimeout(reconnectTimer);
      sendState('connected', { serial });
      const refit = () => {
        if (embedded && lastRect) callEmbed('move', lastRect);
      };
      setTimeout(refit, 900);
      setTimeout(refit, 2200);
      setTimeout(refit, 4000);
      if (lastRect && (lastRect.x !== rect.x || lastRect.y !== rect.y ||
          lastRect.width !== rect.width || lastRect.height !== rect.height)) {
        await callEmbed('move', lastRect);
      }
    } else {
      sendState('warning');
    }
    return;
  }
  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => {
    callEmbed('move', lastRect);
  }, 120);
}

async function setVideoVisible(visible) {
  if (scrcpyProc && lastRect) {
    await callEmbed(visible ? 'show' : 'hide', lastRect);
  }
}

async function connect(input) {
  sendState('connecting');
  const raw = String(input || '').trim();
  if (!raw) {
    throw Object.assign(new Error('empty-ip'), { code: 'empty-ip' });
  }
  const target = raw.includes(':') ? raw : `${raw}:5555`;

  adbPath = findAdb();
  scrcpyPath = findScrcpy();

  await run(adbPath, ['connect', target], 15000);
  const state = await run(adbPath, ['-s', target, 'get-state'], 15000)
    .then(({ stdout }) => stdout.trim())
    .catch(() => '');
  if (state !== 'device') {
    throw Object.assign(new Error('adb-failed'), {
      code: 'adb-failed',
      detail: state || '',
    });
  }

  serial = target;
  saveConfig({ serial: target });
  stopMirror(true);
  startScrcpy(target);
  if (lastRect) embedOrMove(lastRect);
  return { ok: true, serial: target };
}

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const scale = display.scaleFactor || 1;
  // On Windows the screen API may report physical pixels while BrowserWindow uses DIP.
  const area = {
    x: display.workArea.x / scale,
    y: display.workArea.y / scale,
    width: display.workArea.width / scale,
    height: display.workArea.height / scale,
  };
  const width = Math.min(1380, Math.floor(area.width - 60));
  const height = Math.min(860, Math.floor(area.height - 60));
  const x = Math.round(area.x + (area.width - width) / 2);
  const y = Math.round(area.y + (area.height - height) / 2);
  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#1c1c1e',
    title: 'TV Viewer',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.setAlwaysOnTop(loadConfig().alwaysOnTop === true);
  mainWindow.webContents.on('did-finish-load', () => {
    if (!autoConnectPending) return;
    autoConnectPending = false;
    const config = loadConfig();
    if (config.autoConnect === true && config.serial && !serial) {
      setTimeout(() => {
        if (serial) return;
        connect(config.serial).catch((error) => {
          sendState('error', {
            code: error.code || 'unknown',
            detail: error.detail || '',
          });
        });
      }, 1200);
    }
  });
  mainWindow.on('enter-full-screen', () => {
    fullscreen = true;
    mainWindow.webContents.send('fullscreen', true);
  });
  mainWindow.on('leave-full-screen', () => {
    fullscreen = false;
    mainWindow.webContents.send('fullscreen', false);
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  app.setAccessibilitySupportEnabled(true);
  migrateConfig();

  const saved = loadConfig();
  showRemote = saved.showRemote !== false;

  ipcMain.handle('defaults', () => {
    const current = settings();
    return {
      serial: process.env.TV || loadConfig().serial || '',
      alwaysOnTop: current.alwaysOnTop,
      showRemote: current.showRemote,
      windowFill,
      fullscreen,
      settings: current,
      version: app.getVersion(),
    };
  });

  ipcMain.handle('set-setting', (_event, key, value) => {
    const allowed = [
      'language',
      'autoConnect',
      'autoReconnect',
      'repeatFast',
      'alwaysOnTop',
      'showRemote',
    ];
    if (!allowed.includes(key)) return settings();

    if (key === 'language') {
      if (value !== 'zh' && value !== 'en') return settings();
      saveConfig({ language: value });
    } else {
      const enabled = Boolean(value);
      saveConfig({ [key]: enabled });
      if (key === 'alwaysOnTop' && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setAlwaysOnTop(enabled);
      }
      if (key === 'showRemote') {
        showRemote = enabled;
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('remote-visibility', showRemote);
        }
      }
    }
    broadcastSettings();
    return settings();
  });

  ipcMain.handle('set-settings-open', async (_event, open) => {
    await setVideoVisible(!open);
    return true;
  });

  ipcMain.handle('set-always-on-top', (_event, enabled) => {
    const value = Boolean(enabled);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(value);
    }
    saveConfig({ alwaysOnTop: value });
    broadcastSettings();
    return value;
  });

  ipcMain.handle('set-remote', (_event, visible) => setRemote(visible));
  ipcMain.handle('set-window-fill', (_event, enabled) => setWindowFill(enabled));
  ipcMain.handle('set-fullscreen', (_event, enabled) => setFullscreen(enabled));

  ipcMain.handle('window-control', (_event, action) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    if (action === 'minimize') mainWindow.minimize();
    else if (action === 'close') mainWindow.close();
    else if (action === 'zoom') setFullscreen(!fullscreen);
    return true;
  });

  ipcMain.handle('connect', async (_event, input) => {
    clearTimeout(reconnectTimer);
    reconnectAttempts = 0;
    try {
      return await connect(input);
    } catch (error) {
      const code = error.code || 'unknown';
      sendState('error', { code, detail: error.detail || '' });
      return { ok: false, error: code, detail: error.detail || '' };
    }
  });

  ipcMain.handle('send-key', async (_event, code) => {
    if (!serial) throw new Error('not connected');
    await run(adbPath, ['-s', serial, 'shell', 'input', 'keyevent', code], 8000);
    return true;
  });

  ipcMain.handle('stop', () => {
    stopMirror(false);
    return true;
  });

  ipcMain.on('move-window-by', (_event, dx, dy) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    const [x, y] = mainWindow.getPosition();
    mainWindow.setPosition(x + Math.round(dx || 0), y + Math.round(dy || 0));
  });

  ipcMain.on('video-rect', (_event, rect) => {
    if (!rect || !rect.width || !rect.height) return;
    const ratio = rect.dpr || 1;
    embedOrMove({
      x: Math.round(rect.x * ratio),
      y: Math.round(rect.y * ratio),
      width: Math.round(rect.width * ratio),
      height: Math.round(rect.height * ratio),
    });
  });

  createWindow();

  const shortcuts = [
    ['CommandOrControl+Alt+H', () => setRemote(!showRemote)],
    ['CommandOrControl+Alt+W', () => setWindowFill(!windowFill)],
    ['CommandOrControl+Alt+F', () => setFullscreen(!fullscreen)],
    ['CommandOrControl+Alt+Enter', () => setFullscreen(!fullscreen)],
  ];
  for (const [accelerator, handler] of shortcuts) {
    const registered = globalShortcut.register(accelerator, handler);
    console.log(`shortcut ${accelerator}: ${registered ? 'ok' : 'FAILED'}`);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('before-quit', () => {
  clearTimeout(reconnectTimer);
  stopMirror(true);
});
app.on('window-all-closed', () => {
  stopMirror(true);
  if (process.platform !== 'darwin') app.quit();
});
