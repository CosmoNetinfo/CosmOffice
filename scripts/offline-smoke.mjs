import { _electron as electron } from 'playwright';
import executablePath from 'electron';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { checkItalianSpelling } from './spelling-check.mjs';

await mkdir('test-results', { recursive: true });
const log = resolve(`test-results/offline-net-${Date.now()}.json`);
const application = await electron.launch({ executablePath, args: ['.', '--no-sandbox', `--log-net-log=${log}`, '--net-log-capture-mode=everything'], env: { ...process.env, COSMO_TEST: '1', COSMO_TEST_PROFILE: resolve(`test-results/offline-profile-${Date.now()}`) } });
let closed = false;
const errors = [];
try {
  const page = await application.firstWindow(); page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  assert.match(page.url(), /^file:/);
  async function attempts() {
    return application.evaluate(({ app }) => process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(), 'electron/main.cjs'))('./offline.cjs').getNetworkAttempts());
  }
  assert.deepEqual(await attempts(), [], 'nessun tentativo di rete all’avvio');
  assert.equal((await page.evaluate(() => window.cosmoffice.checkUpdates())).phase, 'disabled');
  assert.equal((await page.evaluate(() => window.cosmoffice.setUpdatePreferences(true))).phase, 'disabled');
  assert.equal((await page.evaluate(() => window.cosmoffice.installUpdate())).phase, 'disabled');
  for (const file of ['05-intestazioni.docx', '03-formati.xlsx', '03-venti-pagine.pdf', 'grafici-ui.xlsx']) {
    const source = file === 'grafici-ui.xlsx' ? `test-results/${file}` : `tests/fixtures/${file}`;
    await application.evaluate(({ dialog }, filename) => { dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [filename] }); }, resolve(source));
    await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
    if (file.endsWith('.docx')) await page.locator('.document-page').waitFor();
    else if (file.endsWith('.xlsx')) {
      await page.getByRole('textbox', { name: 'Cella A1', exact: true }).waitFor();
      if (file.includes('grafici-ui')) {
        assert.equal(await page.locator('.grid-chart canvas').count(), 3);
        await page.getByRole('textbox', { name: 'Cella B2', exact: true }).fill('73');
        await page.getByRole('textbox', { name: 'Cella B3', exact: true }).focus();
      }
    }
    else await page.waitForFunction(() => document.querySelector('.pdf-paper canvas')?.width > 0 && !document.querySelector('.pdf-loading'));
    await page.getByRole('button', { name: 'Torna alle bozze' }).click(); await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  }
  await checkItalianSpelling(page);
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByRole('button', { name: 'Aggiornamenti', exact: true }).click();
  await page.getByText('Nessun controllo online', { exact: true }).waitFor();
  assert.deepEqual(await attempts(), [], 'il processo principale ha provato ad aprire una connessione');
  assert.deepEqual(errors, []);
  const canary = await application.evaluate(({ net, app }) => {
    const policy = process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(), 'electron/main.cjs'))('./offline.cjs');
    if (!policy.isInstalled()) throw new Error('Protezione offline non installata');
    try { net.request('https://203.0.113.1/'); return false; } catch (error) { return error.code === 'ERR_COSMO_OFFLINE'; }
  });
  assert.equal(canary, true, 'il test deve rilevare e bloccare un tentativo intenzionale dal main');
  assert.deepEqual(await attempts(), [{ api: 'electron.net.request' }], 'solo il tentativo intenzionale del test è ammesso');
  await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.emit('render-process-gone', {}, { reason: 'crashed', exitCode: 1 }));
  await application.close(); closed = true;
  const netLog = JSON.parse(await readFile(log, 'utf8'));
  const forbidden = new Set(Object.entries(netLog.constants.logEventTypes).filter(([name]) => /^(TCP_CONNECT|TCP_CONNECT_ATTEMPT|UDP_CONNECT|QUIC_SESSION|DNS_TRANSACTION)$/.test(name)).map(([, type]) => type));
  const connections = netLog.events.filter(event => forbidden.has(event.type));
  assert.deepEqual(connections, [], 'NetLog Chromium contiene connessioni di rete');
  const externalRequests = netLog.events.filter(event => /^(?:https?|wss?|ftp):/i.test(event.params?.url || ''));
  assert.deepEqual(externalRequests, [], 'NetLog Chromium contiene tentativi di richiesta a server');
  const report = { result: 'PASS', checks: ['Avvio Electron da file locale', 'Nessun tentativo spontaneo di rete dal processo principale', 'IPC aggiornamenti disabilitati anche con vecchie preferenze abilitate', 'DOCX, XLSX e PDF aperti senza connessioni', 'Richiesta intenzionale dal main rilevata e bloccata prima della connessione', 'NetLog Chromium: nessuna connessione TCP, UDP, QUIC o transazione DNS'], errors };
  await writeFile('test-results/offline-report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} finally {
  if (!closed) {
    await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.webContents.emit('render-process-gone', {}, { reason: 'crashed', exitCode: 1 })).catch(() => {});
    await application.close();
  }
}
