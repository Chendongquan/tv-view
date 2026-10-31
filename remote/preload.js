const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tv', {
  defaults: () => ipcRenderer.invoke('defaults'),
  connect: (serial) => ipcRenderer.invoke('connect', serial),
  sendKey: (code) => ipcRenderer.invoke('send-key', code),
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke('set-always-on-top', enabled),
  setRemoteVisible: (visible) => ipcRenderer.invoke('set-remote', visible),
  setWindowFill: (enabled) => ipcRenderer.invoke('set-window-fill', enabled),
  setFullscreen: (enabled) => ipcRenderer.invoke('set-fullscreen', enabled),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  setSettingsOpen: (open) => ipcRenderer.invoke('set-settings-open', open),
  windowControl: (action) => ipcRenderer.invoke('window-control', action),
  moveWindowBy: (dx, dy) => ipcRenderer.send('move-window-by', dx, dy),
  stop: () => ipcRenderer.invoke('stop'),
  setVideoRect: (rect) => ipcRenderer.send('video-rect', rect),
  onState: (callback) =>
    ipcRenderer.on('state', (_event, payload) => callback(payload)),
  onRemoteVisibility: (callback) =>
    ipcRenderer.on('remote-visibility', (_event, visible) => callback(visible)),
  onWindowFill: (callback) =>
    ipcRenderer.on('window-fill', (_event, enabled) => callback(enabled)),
  onFullscreen: (callback) =>
    ipcRenderer.on('fullscreen', (_event, enabled) => callback(enabled)),
  onSettings: (callback) => ipcRenderer.on('settings', (_event, settings) => callback(settings)),
});
