const electron = require('electron');
const { installOffline, configureSession } = require('./offline.cjs');
installOffline(electron);
const { app, BrowserWindow, dialog, ipcMain, Menu } = electron;
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

app.setName('CosmOffice');
if (process.env.COSMO_TEST_PROFILE) app.setPath('userData', process.env.COSMO_TEST_PROFILE);
let window;
let closeAllowed = false;
const updater = Object.freeze({ phase: 'disabled', message: 'Modalità completamente offline. Per aggiornare installa un nuovo pacchetto locale.' });
const MAX_FILE = 50 * 1024 * 1024;
const supported = new Set(['.docx', '.xlsx', '.csv', '.tsv', '.pdf', '.txt', '.html', '.cosmoffice', '.json']);

function trusted(event) {
  if (!window || event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame) throw new Error('Richiesta non autorizzata.');
}
function createWindow() {
  closeAllowed = false;
  Menu.setApplicationMenu(null);
  window = new BrowserWindow({
    width: 1440, height: 940, minWidth: 800, minHeight: 620,
    title: 'CosmOffice', backgroundColor: '#f5f7fa',
    show: process.env.COSMO_TEST !== '1',
    icon: path.join(__dirname, '../public/brand/suite.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event) => event.preventDefault());
  window.webContents.on('render-process-gone', () => { closeAllowed = true; });
  configureSession(window.webContents.session);
  window.loadFile(path.join(__dirname, '../dist/index.html'));
  window.on('close', event => {
    if (closeAllowed) return;
    event.preventDefault();
    window.webContents.send('office:before-close');
  });
}
app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle('office:open', async event => {
  trusted(event);
  const result = await dialog.showOpenDialog(window, { properties: ['openFile'], filters: [{ name: 'Documenti, fogli e PDF', extensions: ['docx', 'xlsx', 'csv', 'tsv', 'pdf', 'txt', 'html'] }] });
  if (result.canceled) return null;
  const filename = result.filePaths[0];
  if (!supported.has(path.extname(filename).toLowerCase())) throw new Error('Formato non supportato.');
  const info = await fs.stat(filename);
  if (info.size > MAX_FILE) throw new Error('Questa anteprima apre file fino a 50 MB.');
  return { name: path.basename(filename), bytes: new Uint8Array(await fs.readFile(filename)) };
});
ipcMain.handle('office:save', async (event, { name, bytes }) => {
  trusted(event);
  if (typeof name !== 'string' || name !== path.basename(name) || !supported.has(path.extname(name).toLowerCase())) throw new Error('Nome file non valido.');
  const data = Buffer.from(bytes);
  if (data.length > MAX_FILE) throw new Error('File troppo grande.');
  const ext = path.extname(name).slice(1);
  const result = await dialog.showSaveDialog(window, { defaultPath: name, filters: [{ name: `File ${ext.toUpperCase()}`, extensions: [ext] }] });
  if (result.canceled) return null;
  const target = result.filePath;
  const temp = `${target}.${randomUUID()}.tmp`;
  try { await fs.writeFile(temp, data, { flag: 'wx' }); await fs.rename(temp, target); }
  catch (error) { await fs.unlink(temp).catch(() => {}); throw error; }
  return { name: path.basename(target) };
});
ipcMain.handle('office:print', event => {
  trusted(event);
  return new Promise((resolve, reject) => window.webContents.print({ printBackground: true }, (success, reason) => success ? resolve(true) : reject(new Error(reason || 'Stampa annullata.'))));
});
ipcMain.handle('office:update-status', event => { trusted(event); return updater; });
ipcMain.handle('office:update-preferences', (event, enabled) => {
  trusted(event); if (typeof enabled !== 'boolean') throw new Error('Preferenza non valida.');
  return updater; // Compatibilità con preferenze di vecchie versioni: nessuna attività di rete.
});
ipcMain.handle('office:check-updates', async event => {
  trusted(event); return updater;
});
ipcMain.handle('office:export-pdf', async event => {
  trusted(event);
  return new Uint8Array(await window.webContents.printToPDF({ printBackground: true, preferCSSPageSize: true }));
});
ipcMain.handle('office:close-ready', async (event, saved) => {
  trusted(event);
  if (!saved) {
    const choice = await dialog.showMessageBox(window, { type: 'warning', message: 'L’ultima bozza non è stata salvata.', detail: 'Puoi tornare al lavoro per esportare il file.', buttons: ['Torna al lavoro', 'Esci comunque'], defaultId: 0, cancelId: 0 });
    if (choice.response !== 1) return;
  }
  closeAllowed = true;
  window.close();
});
ipcMain.handle('office:install-update', event => {
  trusted(event);
  return updater;
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (window && !window.isDestroyed()) window.show(); else createWindow(); });
