import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { checkItalianSpelling } from './spelling-check.mjs';
await mkdir('test-results', { recursive: true });
const server = await createServer(); await server.listen();
let browser;
try {
  const channel = process.env.COSMO_BROWSER || 'chrome';
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:5173/')) external.push(request.url()); });
  await page.goto('http://127.0.0.1:5173');
  await checkItalianSpelling(page);
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log('PASS ortografia italiana: Write, Grid, impostazioni, parole personali, riavvio pagina e nessuna richiesta esterna.');
} finally { await browser?.close(); await server.close(); }
