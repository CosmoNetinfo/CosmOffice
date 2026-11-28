// Frontend regression with a simulated native port; actual Android is tested separately.
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server = await createServer(); await server.listen(); let browser;
try {
  const channel = process.env.COSMO_BROWSER || 'chrome';
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const context = await browser.newContext({ userAgent: 'CosmOfficeAndroid/1', viewport: { width: 390, height: 844 } });
  const page = await context.newPage(), outside = [], origin = server.resolvedUrls.local[0];
  await page.route('**/*', route => {
    const url = route.request().url();
    if (/^https?:/.test(url) && new URL(url).origin !== new URL(origin).origin) { outside.push(url); return route.abort(); }
    return route.continue();
  });
  await page.addInitScript(() => {
    window.androidSaved = []; window.androidCalls = [];
    window.androidUpdateStatus = { phase: 'idle', message: 'Nessuna connessione all’avvio.', automatic: false, networkActive: false, versionCode: 3 };
    window.addEventListener('load', () => {
      window.androidPortStarted = true;
      const { port1, port2 } = new MessageChannel();
      port1.onmessage = ({ data }) => {
        const call = JSON.parse(data); window.androidCalls.push(call.operation); let value;
        if (call.operation === 'info') value = { os: '15', architecture: 'x86_64', webview: '131.0.0.0', dark: true };
        else if (call.operation === 'open') value = window.androidFile;
        else if (call.operation === 'save') { window.androidSaved.push(call); value = { name: call.name }; }
        else if (call.operation === 'clipboard') { window.androidCopied = call.text; value = true; }
        else if (call.operation === 'finish') { window.androidFinished = true; value = true; }
        else if (call.operation === 'updates') {
          if (call.action === 'automatic') window.androidUpdateStatus.automatic = call.enabled;
          if (call.action === 'check') window.androidUpdateStatus.message = 'La versione Android installata è aggiornata.';
          value = { ...window.androidUpdateStatus };
        }
        port1.postMessage(JSON.stringify({ id: call.id, ok: true, value }));
      };
      window.dispatchEvent(new MessageEvent('message', { data: 'cosmoffice:native-port:v1', origin: 'null', source: null, ports: [port2] }));
    });
  });
  await page.goto(origin);
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await page.getByRole('button', { name: 'Nuovo Markdown' }).click();
  await page.getByRole('textbox', { name: 'Testo Markdown', exact: true }).fill('# Android frontend\n\nTesto originale.\n');
  await page.getByRole('button', { name: 'Esporta MD', exact: true }).click();
  await page.waitForFunction(() => window.androidSaved.length === 1);
  const saved = await page.evaluate(() => window.androidSaved[0]);
  assert.equal(Buffer.from(saved.base64, 'base64').toString(), '# Android frontend\n\nTesto originale.\n');
  await page.evaluate(() => dispatchEvent(new Event('cosmoffice:android-back')));
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  const bytes = await readFile('tests/fixtures/01-testo-stili.docx');
  await page.evaluate(base64 => { window.androidFile = { name: 'NOME_PRIVATO_ANDROID.docx', base64 }; }, bytes.toString('base64'));
  await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
  await page.locator('.document-page').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Esporta PDF', exact: true }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Stampa disponibile sul desktop', exact: true }).isDisabled(), true);
  await page.evaluate(() => { dispatchEvent(new ErrorEvent('error', { error: new TypeError('CONTENUTO_PRIVATO_ANDROID') })); });
  await page.evaluate(() => dispatchEvent(new Event('cosmoffice:android-back')));
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByRole('button', { name: 'Aggiornamenti', exact: true }).click();
  await page.getByRole('heading', { name: 'Aggiornamenti Android da GitHub' }).waitFor();
  assert.equal(await page.getByRole('checkbox', { name: 'Aggiornamenti automatici Android' }).isChecked(), false);
  await page.getByRole('button', { name: 'Controlla aggiornamenti ora' }).click();
  await page.getByText('La versione Android installata è aggiornata.', { exact: true }).waitFor();
  await page.getByRole('checkbox', { name: 'Aggiornamenti automatici Android' }).check();
  await page.getByRole('checkbox', { name: 'Aggiornamenti automatici Android' }).uncheck();
  await page.waitForFunction(() => window.androidUpdateStatus.automatic === false);
  assert.equal(await page.evaluate(() => window.androidUpdateStatus.automatic), false);
  await page.getByRole('button', { name: 'Segnala un problema', exact: true }).click();
  await page.getByRole('button', { name: 'Copia rapporto', exact: true }).click();
  await page.waitForFunction(() => window.androidCopied);
  const report = await page.evaluate(() => window.androidCopied);
  assert.match(report, /Android 15/); assert.match(report, /TypeError/);
  assert.doesNotMatch(report, /NOME_PRIVATO|CONTENUTO_PRIVATO|\/storage\/|V:\\/);
  await page.evaluate(() => dispatchEvent(new Event('cosmoffice:android-back')));
  assert.equal(await page.getByRole('dialog', { name: 'Segnala un problema' }).count(), 0);
  await page.reload();
  const preserved = await page.evaluate(async () => (await import('/src/debug.mjs')).readDebug());
  assert.match(preserved, /TypeError/); assert.doesNotMatch(preserved, /NOME_PRIVATO|CONTENUTO_PRIVATO/);
  assert.deepEqual(outside, []);
  console.log('PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.');
} finally { await browser?.close(); await server.close(); }
