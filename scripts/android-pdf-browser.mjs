// Production Android assets and simulated native port, with missing page/worker APIs.
// This regression complements, never replaces, the real emulator round trip.
import { preview } from 'vite';
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import assert from 'node:assert/strict';
const server = await preview({ build: { outDir: 'test-results/android/web' }, preview: { host: '127.0.0.1', port: 5181, strictPort: true } });
let browser;
try {
  const channel = process.env.COSMO_BROWSER || 'chrome';
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const context = await browser.newContext({ userAgent: 'CosmOfficeAndroid/1', viewport: { width: 390, height: 844 } });
  const page = await context.newPage(), origin = 'http://127.0.0.1:5181', outside = [];
  const fakeWorkers = [];
  page.on('console', message => { if (/setting up fake worker/i.test(message.text())) fakeWorkers.push(message.text()); });
  let workersWithoutApi = 0;
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (/^https?:/.test(url) && new URL(url).origin !== origin) { outside.push(url); return route.abort(); }
    if (/\/pdf\.worker[^/]+\.mjs$/.test(new URL(url).pathname)) {
      const response = await route.fetch(); workersWithoutApi++;
      return route.fulfill({ response, body: 'delete Promise.withResolvers;\n' + await response.text() });
    }
    return route.continue();
  });
  await page.addInitScript(() => {
    delete URL.parse;
    delete Promise.withResolvers;
    window.addEventListener('load', () => {
      const { port1, port2 } = new MessageChannel();
      port1.onmessage = ({ data }) => {
        const call = JSON.parse(data); let value;
        if (call.operation === 'info') value = { os: '15', architecture: 'x86_64', webview: '124.0.6367.219', dark: false };
        else if (call.operation === 'open') value = window.pdfSample;
        else if (call.operation === 'save') { window.savedPdf = call; value = { name: call.name }; }
        port1.postMessage(JSON.stringify({ id: call.id, ok: true, value }));
      };
      window.dispatchEvent(new MessageEvent('message', { data: 'cosmoffice:native-port:v1', origin: 'null', source: null, ports: [port2] }));
    });
  });
  await page.goto(origin);
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  const rendered = async () => {
    await page.waitForFunction(() => document.querySelector('.pdf-paper canvas')?.width > 0 && !document.querySelector('.pdf-loading') || document.querySelector('.toast')?.textContent.startsWith('Impossibile aprire il file:'));
    assert.ok(!(await page.locator('.toast').allTextContents()).some(text => text.startsWith('Impossibile aprire il file:')), 'PDF rifiutato: ' + (await page.locator('.toast').allTextContents()).join(' '));
    await page.locator('.pdf-paper canvas').waitFor({ state: 'visible' });
  };
  for (const file of ['01-testo.pdf', '02-scansione.pdf', '03-venti-pagine.pdf']) {
  await page.evaluate(base64 => { window.savedPdf = null; window.pdfSample = { name: 'esempio-originale.pdf', base64 }; }, (await readFile('tests/fixtures/' + file)).toString('base64'));
  await page.getByRole('button', { name: 'Apri un file', exact: true }).click(); await rendered();
  await page.getByRole('button', { name: 'Ruota pagina PDF', exact: true }).click();
  await page.getByRole('button', { name: 'Salva copia PDF', exact: true }).click();
  await page.waitForFunction(() => window.savedPdf?.base64);
  const saved = await page.evaluate(() => window.savedPdf);
  const pdf = await PDFDocument.load(Buffer.from(saved.base64, 'base64'));
  assert.equal(pdf.getPage(0).getRotation().angle, 90);
  await page.getByRole('button', { name: 'Torna alle bozze', exact: true }).click();
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  await page.evaluate(value => { window.pdfSample = { name: 'copia-originale.pdf', base64: value }; }, saved.base64);
  await page.getByRole('button', { name: 'Apri un file', exact: true }).click(); await rendered();
  await page.getByRole('button', { name: 'Torna alle bozze', exact: true }).click();
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  console.log('PASS PDF senza Promise.withResolvers in pagina/worker:', file);
  }
  assert.deepEqual(outside, []);
  assert.ok(workersWithoutApi >= 3, 'worker PDF provato senza Promise.withResolvers per i tre campioni');
  assert.deepEqual(fakeWorkers, [], 'nessun ripiego sul worker simulato nella pagina');
  console.log('PASS asset Android di produzione senza URL.parse e Promise.withResolvers; API assente anche nel vero worker PDF, senza fake worker. PDF renderizzato, ruotato, esportato e riaperto; 90 gradi verificati, zero richieste esterne. Porta nativa simulata: non è il test APK.');
} finally { await browser?.close(); await new Promise(resolve => server.httpServer.close(resolve)); }
