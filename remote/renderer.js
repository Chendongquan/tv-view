const statusEl = document.getElementById('status');
const serialEl = document.getElementById('serial');
const placeholder = document.getElementById('placeholder');
const stage = document.getElementById('stage');
const pinEl = document.getElementById('pin');
const remoteToggle = document.getElementById('remote-toggle');
const windowFillToggle = document.getElementById('window-fill-toggle');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const settingsToggle = document.getElementById('settings-toggle');
const connectBtn = document.getElementById('connect');
const stopBtn = document.getElementById('stop');
const phTitle = document.getElementById('ph-title');
const phError = document.getElementById('ph-error');
const phErrorText = document.getElementById('ph-error-text');
const remoteButtons = Array.from(document.querySelectorAll('#remote button[data-key]'));

const settingsEl = document.getElementById('settings');
const sheetPanel = settingsEl.querySelector('.sheet-panel');
const settingsClose = document.getElementById('settings-close');
const settingsBackdrop = settingsEl.querySelector('.sheet-backdrop');
const languageControl = document.getElementById('language-control');
const repeatControl = document.getElementById('repeat-control');
const versionValue = document.getElementById('version-value');
const switchButtons = Array.from(document.querySelectorAll('.switch[data-setting]'));

const powerConfirm = document.getElementById('power-confirm');
const powerCancel = document.getElementById('power-cancel');
const powerOk = document.getElementById('power-ok');

let currentState = 'idle';
let lastStatePayload = { state: 'idle' };
let showRemote = true;
let fullscreen = false;
let windowFill = false;
let statusTimer = null;
let settingsOpen = false;
let language = 'zh';
let settingsState = {
  language: 'zh',
  autoConnect: false,
  autoReconnect: true,
  repeatFast: false,
  alwaysOnTop: false,
  showRemote: true,
};

function t(key, vars) {
  const dict = (window.TV_I18N && window.TV_I18N[language]) || {};
  let text = dict[key] || key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, value == null ? '' : String(value));
    }
  }
  return text;
}

function applyStaticI18n() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
}

function setRemoteEnabled(enabled) {
  remoteButtons.forEach((button) => {
    button.disabled = !enabled;
  });
}

function stateMessage(payload) {
  const state = payload.state || 'idle';
  if (state === 'connected') {
    return t('status.connected', {
      serial: payload.serial || serialEl.value.trim() || '',
    });
  }
  if (state === 'error') {
    return t(`error.${payload.code || 'unknown'}`, {
      detail: payload.detail || '',
    });
  }
  if (state === 'connecting' && payload.reconnecting) {
    return t('status.reconnecting');
  }
  const keys = {
    idle: 'status.idle',
    connecting: 'status.connecting',
    warning: 'status.warning',
  };
  return t(keys[state] || 'status.idle');
}

function applyState(payload) {
  const state = payload && payload.state ? payload.state : 'idle';
  lastStatePayload = payload || { state: 'idle' };
  const active = state === 'connected' || state === 'warning';
  const message = stateMessage(lastStatePayload);

  currentState = state;
  clearTimeout(statusTimer);
  statusTimer = null;
  statusEl.dataset.state = state;
  statusEl.title = message;
  statusEl.setAttribute('aria-label', message);

  connectBtn.disabled = state === 'connecting';
  connectBtn.textContent =
    state === 'connecting'
      ? t('connect.connectingAction')
      : state === 'error' || state === 'warning'
        ? t('connect.retry')
        : t('connect.action');
  stopBtn.disabled = state === 'idle' || state === 'error';
  setRemoteEnabled(active);

  if (state === 'connected') {
    placeholder.classList.add('hidden');
    return;
  }

  placeholder.classList.remove('hidden');
  phError.classList.add('hidden');

  if (state === 'connecting') {
    phTitle.textContent = payload && payload.reconnecting
      ? t('connect.reconnecting')
      : t('connect.connecting');
  } else if (state === 'warning') {
    phTitle.textContent = t('connect.warning');
  } else if (state === 'error') {
    phTitle.textContent = t('connect.failed');
    phError.classList.remove('hidden');
    phErrorText.textContent = message;
    if (!settingsOpen) {
      requestAnimationFrame(() => {
        serialEl.focus();
        serialEl.select();
      });
    }
  } else {
    phTitle.textContent = t('connect.title');
  }
}

function showPin(enabled) {
  pinEl.classList.toggle('active', enabled);
  pinEl.setAttribute('aria-pressed', String(enabled));
}

function applyRemote(value) {
  showRemote = Boolean(value);
  document.body.classList.toggle('no-remote', !showRemote);
  remoteToggle.classList.toggle('active', showRemote);
  remoteToggle.setAttribute('aria-pressed', String(showRemote));
  requestAnimationFrame(reportRect);
}

function applyWindowFill(value) {
  windowFill = Boolean(value);
  document.body.classList.toggle('fill-window', windowFill);
  windowFillToggle.classList.toggle('active', windowFill);
  windowFillToggle.setAttribute('aria-pressed', String(windowFill));
  requestAnimationFrame(reportRect);
}

function applyFullscreen(value) {
  fullscreen = Boolean(value);
  document.body.classList.toggle('fullscreen', fullscreen);
  fullscreenToggle.classList.toggle('active', fullscreen);
  fullscreenToggle.setAttribute('aria-pressed', String(fullscreen));
  requestAnimationFrame(reportRect);
}

function updateSettingsUI() {
  switchButtons.forEach((button) => {
    button.setAttribute(
      'aria-checked',
      String(Boolean(settingsState[button.dataset.setting]))
    );
  });
  languageControl.querySelectorAll('.segment').forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  repeatControl.querySelectorAll('.segment').forEach((button) => {
    const active =
      (button.dataset.repeat === 'fast') === Boolean(settingsState.repeatFast);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function applySettings(next) {
  if (!next) return;
  const previousLanguage = language;
  settingsState = { ...settingsState, ...next };
  language = settingsState.language === 'en' ? 'en' : 'zh';
  showPin(Boolean(settingsState.alwaysOnTop));
  applyRemote(settingsState.showRemote !== false);
  updateSettingsUI();
  applyStaticI18n();
  if (previousLanguage !== language) {
    applyState(lastStatePayload);
  }
}
async function toggleWindowFill(force) {
  const value = await window.tv.setWindowFill(force === undefined ? !windowFill : force);
  applyWindowFill(value);
}

async function toggleFullscreen(force) {
  const value = await window.tv.setFullscreen(force === undefined ? !fullscreen : force);
  applyFullscreen(value);
}

function showPowerConfirm() {
  powerConfirm.classList.remove('hidden');
  powerOk.focus();
}

function hidePowerConfirm() {
  if (powerConfirm.classList.contains('hidden')) return;
  powerConfirm.classList.add('hidden');
  powerCancel.blur();
  powerOk.blur();
}

async function openSettings() {
  if (settingsOpen) return;
  settingsOpen = true;
  hidePowerConfirm();
  await window.tv.setSettingsOpen(true);
  settingsEl.classList.remove('hidden');
  settingsClose.focus();
}

function closeSettings() {
  if (!settingsOpen) return;
  settingsOpen = false;
  settingsEl.classList.add('hidden');
  window.tv.setSettingsOpen(false);
  settingsToggle.focus();
  requestAnimationFrame(reportRect);
}

window.tv.onRemoteVisibility(applyRemote);
window.tv.onWindowFill(applyWindowFill);
window.tv.onFullscreen(applyFullscreen);
window.tv.onState(applyState);
window.tv.onSettings(applySettings);

window.tv.defaults().then(({ serial, alwaysOnTop, showRemote: savedRemote, fullscreen: savedFullscreen, windowFill: savedWindowFill, settings, version }) => {
  if (serial && !serialEl.value) serialEl.value = serial;
  if (version) versionValue.textContent = version;
  if (settings) {
    applySettings(settings);
  } else {
    showPin(Boolean(alwaysOnTop));
    applyRemote(savedRemote !== false);
    applyStaticI18n();
    updateSettingsUI();
  }
  applyWindowFill(savedWindowFill === true);
  applyFullscreen(savedFullscreen === true);
  applyState({ state: 'idle' });
  if (!serialEl.value) serialEl.focus();
});

remoteToggle.addEventListener('click', async () => {
  applyRemote(await window.tv.setRemoteVisible(!showRemote));
});

windowFillToggle.addEventListener('click', () => toggleWindowFill());
fullscreenToggle.addEventListener('click', () => toggleFullscreen());

document.getElementById('win-close').addEventListener('click', () => window.tv.windowControl('close'));
document.getElementById('win-min').addEventListener('click', () => window.tv.windowControl('minimize'));
document.getElementById('win-zoom').addEventListener('click', () => toggleFullscreen());

settingsToggle.addEventListener('click', openSettings);
settingsClose.addEventListener('click', closeSettings);
settingsBackdrop.addEventListener('click', closeSettings);

settingsEl.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeSettings();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = Array.from(
    sheetPanel.querySelectorAll('button:not(:disabled), input:not(:disabled)')
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

switchButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const key = button.dataset.setting;
    const next = button.getAttribute('aria-checked') !== 'true';
    button.setAttribute('aria-checked', String(next));
    applySettings(await window.tv.setSetting(key, next));
  });
});

languageControl.querySelectorAll('.segment').forEach((button) => {
  button.addEventListener('click', async () => {
    applySettings(await window.tv.setSetting('language', button.dataset.lang));
  });
});

repeatControl.querySelectorAll('.segment').forEach((button) => {
  button.addEventListener('click', async () => {
    applySettings(
      await window.tv.setSetting('repeatFast', button.dataset.repeat === 'fast')
    );
  });
});

pinEl.addEventListener('click', async () => {
  showPin(await window.tv.setAlwaysOnTop(!pinEl.classList.contains('active')));
});

const toolbar = document.getElementById('toolbar');
let drag = null;
toolbar.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  if (event.target.closest('button, input')) return;
  drag = { id: event.pointerId, x: event.screenX, y: event.screenY };
  toolbar.setPointerCapture(event.pointerId);
});
toolbar.addEventListener('pointermove', (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.screenX - drag.x;
  const dy = event.screenY - drag.y;
  if (dx || dy) {
    drag.x = event.screenX;
    drag.y = event.screenY;
    window.tv.moveWindowBy(dx, dy);
  }
});
const endDrag = () => {
  drag = null;
};
toolbar.addEventListener('pointerup', endDrag);
toolbar.addEventListener('pointercancel', endDrag);
toolbar.addEventListener('dblclick', (event) => {
  if (event.target.closest('button, input')) return;
  toggleFullscreen();
});

async function connect() {
  const result = await window.tv.connect(serialEl.value);
  if (!result.ok) {
    applyState({
      state: 'error',
      code: result.error || 'unknown',
      detail: result.detail || '',
    });
    return;
  }
  serialEl.value = result.serial;
  reportRect();
  setTimeout(reportRect, 400);
}

connectBtn.addEventListener('click', connect);
serialEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') connect();
});
stopBtn.addEventListener('click', () => window.tv.stop());

async function sendCode(code) {
  if (currentState !== 'connected' && currentState !== 'warning') return;
  try {
    await window.tv.sendKey(code);
  } catch (error) {
    flashStatus(t('status.keyFailed'));
  }
}

function requestKey(code) {
  if (code === 'KEYCODE_POWER') {
    showPowerConfirm();
    return;
  }
  sendCode(code);
}

function flashStatus(text) {
  statusEl.dataset.state = 'warning';
  statusEl.title = text;
  statusEl.setAttribute('aria-label', text);
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    applyState(lastStatePayload);
  }, 3000);
}

powerCancel.addEventListener('click', hidePowerConfirm);
powerOk.addEventListener('click', () => {
  hidePowerConfirm();
  sendCode('KEYCODE_POWER');
});

document.querySelectorAll('#remote button[data-key]').forEach((button) => {
  if (!button.hasAttribute('data-repeat')) {
    button.addEventListener('click', () => requestKey(button.dataset.key));
    return;
  }

  let delay = null;
  let repeat = null;
  const fire = () => requestKey(button.dataset.key);
  const stop = () => {
    clearTimeout(delay);
    clearInterval(repeat);
    delay = null;
    repeat = null;
  };

  button.addEventListener('pointerdown', (event) => {
    if (button.disabled) return;
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    fire();
    const interval = settingsState.repeatFast ? 90 : 130;
    const initialDelay = settingsState.repeatFast ? 340 : 430;
    delay = setTimeout(() => {
      repeat = setInterval(fire, interval);
    }, initialDelay);
  });
  button.addEventListener('pointerup', stop);
  button.addEventListener('pointercancel', stop);
  button.addEventListener('pointerleave', stop);
});

window.addEventListener('keydown', (event) => {
  if (settingsOpen) return;
  if (!powerConfirm.classList.contains('hidden')) {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePowerConfirm();
    }
    return;
  }

  const target = event.target;
  const typing = target && target.closest && target.closest('input, textarea, [contenteditable="true"]');
  if (typing) return;

  if (event.key === 'F11') {
    event.preventDefault();
    toggleFullscreen();
    return;
  }

  if (event.key === 'Escape') {
    if (fullscreen) {
      event.preventDefault();
      toggleFullscreen(false);
    } else if (windowFill) {
      event.preventDefault();
      toggleWindowFill(false);
    } else if (currentState === 'connected' || currentState === 'warning') {
      event.preventDefault();
      sendCode('KEYCODE_BACK');
    }
    return;
  }

  if (currentState !== 'connected' && currentState !== 'warning') return;

  const onButton = target && target.closest && target.closest('button');
  if (onButton && (event.key === 'Enter' || event.key === ' ')) return;

  const map = {
    ArrowUp: 'KEYCODE_DPAD_UP',
    ArrowDown: 'KEYCODE_DPAD_DOWN',
    ArrowLeft: 'KEYCODE_DPAD_LEFT',
    ArrowRight: 'KEYCODE_DPAD_RIGHT',
    Enter: 'KEYCODE_DPAD_CENTER',
    Backspace: 'KEYCODE_BACK',
  };
  if (map[event.key]) {
    event.preventDefault();
    sendCode(map[event.key]);
  }
});

let rectTimer = null;
function reportRect() {
  const rect = stage.getBoundingClientRect();
  window.tv.setVideoRect({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    dpr: window.devicePixelRatio || 1,
  });
}

new ResizeObserver(() => {
  clearTimeout(rectTimer);
  rectTimer = setTimeout(reportRect, 120);
}).observe(stage);
window.addEventListener('resize', reportRect);
requestAnimationFrame(reportRect);
