const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cosmoffice', Object.freeze({
  spellcheckAvailable: true,
  debugReport: () => ipcRenderer.invoke('office:debug-report'),
  debugGuided: value => ipcRenderer.invoke('office:debug-guided', value),
  onGuided: callback => {
    const handler = () => callback();
    ipcRenderer.on('office:show-guided', handler);
    return () => ipcRenderer.removeListener('office:show-guided', handler);
  },
  debugRecord: value => ipcRenderer.invoke('office:debug-record', value),
  debugContext: value => ipcRenderer.invoke('office:debug-context', value),
  debugClear: () => ipcRenderer.invoke('office:debug-clear'),
  debugCopy: () => ipcRenderer.invoke('office:debug-copy'),
  onDebug: callback => {
    const handler = () => callback();
    ipcRenderer.on('office:show-debug', handler);
    return () => ipcRenderer.removeListener('office:show-debug', handler);
  },
  italianDictionary: () => ipcRenderer.invoke('office:italian-dictionary'),
  openFile: () => ipcRenderer.invoke('office:open'),
  saveFile: (name, bytes) => ipcRenderer.invoke('office:save', { name, bytes }),
  print: () => ipcRenderer.invoke('office:print'),
  exportPdf: () => ipcRenderer.invoke('office:export-pdf'),
  setUpdatePreferences: enabled => ipcRenderer.invoke('office:update-preferences', enabled),
  checkUpdates: () => ipcRenderer.invoke('office:check-updates'),
  updateStatus: () => ipcRenderer.invoke('office:update-status'),
  installUpdate: () => ipcRenderer.invoke('office:install-update'),
  closeReady: saved => ipcRenderer.invoke('office:close-ready', saved),
  onBeforeClose: callback => {
    const handler = () => callback();
    ipcRenderer.on('office:before-close', handler);
    return () => ipcRenderer.removeListener('office:before-close', handler);
  },
  onUpdate: callback => {
    const handler = (_, state) => callback(state);
    ipcRenderer.on('office:update', handler);
    return () => ipcRenderer.removeListener('office:update', handler);
  },
}));
