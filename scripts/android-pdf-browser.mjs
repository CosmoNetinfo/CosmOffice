// Production Android assets, simulated native port and one missing WebView API.
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
  await page.route('**/*', route => {
    const url = route.request().url();
    if (/^https?:/.test(url) && new URL(url).origin !== origin) { outside.push(url); return route.abort(); }
    return route.continue();
  });
  await page.addInitScript(() => {
    delete URL.parse;
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
  await page.evaluate(base64 => { window.pdfSample = { name: 'esempio-originale.pdf', base64 }; }, (await readFile('tests/fixtures/01-testo.pdf')).toString('base64'));
  const rendered = () => page.waitForFunction(() => document.querySelector('.pdf-paper canvas')?.width > 0 && !document.querySelector('.pdf-loading'));
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
  assert.deepEqual(outside, []);
  console.log('PASS asset Android di produzione senza URL.parse nativo: PDF renderizzato, ruotato, esportato e riaperto; rotazione 90 verificata con pdf-lib, zero richieste esterne. Porta nativa simulata: non è il test APK.');
} finally { await browser?.close(); await new Promise(resolve => server.httpServer.close(resolve)); }
