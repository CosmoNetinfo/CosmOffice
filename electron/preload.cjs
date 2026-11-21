const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cosmoffice', Object.freeze({
  openFile: () => ipcRenderer.invoke('office:open'),
  saveFile: (name, bytes) => ipcRenderer.invoke('office:save', { name, bytes }),
  print: () => ipcRenderer.invoke('office:print'),
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
