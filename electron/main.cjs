const electron = require('electron');
const { installOffline, configureSession } = require('./offline.cjs');
installOffline(electron);
const { app, BrowserWindow, dialog, ipcMain, Menu } = electron;
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

app.setName('CosmOffice');
if (process.env.COSMO_TEST_PROFILE) app.setPath('userData', process.env.COSMO_TEST_PROFILE);
const debug = require('./debug.cjs');
debug.initialize(app);
process.on('uncaughtExceptionMonitor', error => debug.record('main', error));
process.on('unhandledRejection', error => debug.record('main', error));
let debugSnapshot = '';
let window;
let closeAllowed = false;
let updater;
let applyingUpdate = false;
let updateConsent;
let quittingSafely = false;
const MAX_FILE = 50 * 1024 * 1024;
const supported = new Set(['.docx', '.xlsx', '.csv', '.tsv', '.pdf', '.txt', '.html', '.cosmoffice', '.json']);

function trusted(event) {
  if (!window || event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame) throw new Error('Richiesta non autorizzata.');
}
ipcMain.handle('office:italian-dictionary', async event => {
  trusted(event);
  return fs.readFile(path.join(__dirname, '../dist/dictionaries/it_IT.words'), 'utf8');
});
function createWindow() {
  closeAllowed = false;
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'CosmOffice', submenu: [{ label: 'Segnala un problema', click: () => window?.webContents.send('office:show-debug') }, { label: 'Prova guidata', click: () => window?.webContents.send('office:show-guided') }, { type: 'separator' }, { role: 'quit', label: 'Esci' }] },
    { label: 'Modifica', submenu: [{ role: 'undo', label: 'Annulla' }, { role: 'redo', label: 'Ripristina' }, { type: 'separator' }, { role: 'cut', label: 'Taglia' }, { role: 'copy', label: 'Copia' }, { role: 'paste', label: 'Incolla' }, { role: 'selectAll', label: 'Seleziona tutto' }] },
  ]));
  window = new BrowserWindow({
    width: 1440, height: 940, minWidth: 800, minHeight: 620,
    title: 'CosmOffice', backgroundColor: '#f5f7fa',
    show: process.env.COSMO_TEST !== '1',
    icon: path.join(__dirname, '../public/brand/suite.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event) => event.preventDefault());
  window.webContents.on('render-process-gone', () => { debug.record('crash'); closeAllowed = true; });
  window.on('unresponsive', () => debug.record('hang'));
  configureSession(window.webContents.session);
  window.loadFile(path.join(__dirname, '../dist/index.html'));
  window.on('close', event => {
    if (closeAllowed) return;
    event.preventDefault();
    window.webContents.send('office:before-close');
  });
}
ipcMain.handle('office:debug-record', (event, value) => {
  trusted(event);
  if (!value || !['renderer', 'rejection', 'react'].includes(value.kind)) return;
  debug.record(value.kind, { name: value.name, trace: value.trace });
});
ipcMain.handle('office:debug-context', (event, value) => { trusted(event); debug.setContext(value); });
ipcMain.handle('office:debug-guided', (event, value) => { trusted(event); debug.setGuided(value); });
ipcMain.handle('office:debug-report', event => {
  trusted(event);
  debugSnapshot = debug.report(app, require('./offline.cjs').getNetworkAttempts().length);
  return debugSnapshot;
});
ipcMain.handle('office:debug-copy', event => {
  trusted(event);
  if (!debugSnapshot) throw new Error('Apri il rapporto prima di copiarlo.');
  electron.clipboard.writeText(debugSnapshot); return true;
});
ipcMain.handle('office:debug-clear', event => {
  trusted(event); debugSnapshot = '';
  if (!debug.clear()) throw new Error('Registro in memoria svuotato, ma il file locale non è scrivibile.');
});
app.whenReady().then(() => {
  const transport = require('./offline.cjs').createUpdateTransport();
  updater = require('./updater.cjs').createUpdater({ app, transport, notify: state => {
    if (!state.enabled || state.phase !== 'ready') updateConsent = undefined;
    debug.setUpdateState(state);
    try { if (window && !window.isDestroyed()) window.webContents.send('office:update', state); } catch {}
  } });
  debug.setUpdateState(updater.status());
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
ipcMain.handle('office:update-status', event => { trusted(event); return updater.status(); });
ipcMain.handle('office:update-preferences', (event, enabled) => {
  trusted(event); return updater.setPreference(enabled);
});
ipcMain.handle('office:check-updates', async event => {
  trusted(event); return updater.check();
});
ipcMain.handle('office:export-pdf', async event => {
  trusted(event);
  return new Uint8Array(await window.webContents.printToPDF({ printBackground: true, preferCSSPageSize: true }));
});
ipcMain.handle('office:close-ready', async (event, saved) => {
  trusted(event);
  if (!saved) {
    if (updateConsent) { updateConsent = undefined; await dialog.showMessageBox(window, { type: 'warning', message: 'Aggiornamento rinviato: la bozza non è salvata.', detail: 'Il lavoro resta aperto. Salva o esporta il documento prima di riprovare.', buttons: ['Torna al lavoro'] }); return; }
    const choice = await dialog.showMessageBox(window, { type: 'warning', message: 'L’ultima bozza non è stata salvata.', detail: 'Puoi tornare al lavoro per esportare il file.', buttons: ['Torna al lavoro', 'Esci comunque'], defaultId: 0, cancelId: 0 });
    if (choice.response !== 1) { updateConsent = undefined; return; }
  }
  closeAllowed = true;
  window.close();
});
ipcMain.handle('office:install-update', async event => {
  trusted(event);
  const state = updater.status();
  if (state.enabled && state.phase === 'ready') {
    updateConsent = undefined;
    const choice = await dialog.showMessageBox(window, { type: 'question', title: 'Conferma aggiornamento', message: `Installare CosmOffice ${state.version}?`, detail: 'Il file è stato verificato con SHA-256. L’app salverà le bozze prima di chiudersi. L’installer Windows si aprirà con i suoi comandi; su Linux verrà sostituita l’AppImage. Nessuna installazione senza questa conferma.', buttons: ['Annulla', 'Salva, chiudi e installa'], defaultId: 0, cancelId: 0 });
    const current = updater.status();
    if (choice.response === 1 && current.enabled && current.phase === 'ready' && current.version === state.version) { updateConsent = state.version; window.close(); }
  }
  else if (state.enabled && state.phase === 'available') return electron.shell.openExternal(updater.downloadPage()).then(() => updater.status());
  return updater.status();
});
app.on('will-quit', event => {
  const state = updater?.status();
  if (!applyingUpdate && updateConsent && state?.enabled && state.phase === 'ready' && state.version === updateConsent) {
    event.preventDefault(); applyingUpdate = true;
    updater.applyPending(updateConsent).then(applied => { if (applied) { updater.stop(); app.exit(0); } else { applyingUpdate = false; updateConsent = undefined; createWindow(); } }).catch(error => { debug.record('main', error); applyingUpdate = false; updateConsent = undefined; createWindow(); dialog.showErrorBox('Aggiornamento non riuscito', 'Installazione non riuscita. Puoi continuare a lavorare e riprovare.'); });
  } else if (!quittingSafely) { event.preventDefault(); quittingSafely = true; Promise.resolve(updater?.stop()).finally(() => app.exit(0)); }
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (window && !window.isDestroyed()) window.show(); else createWindow(); });
