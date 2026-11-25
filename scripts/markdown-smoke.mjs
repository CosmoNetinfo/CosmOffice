import { chromium } from 'playwright';
import { createServer } from 'vite';
import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { checkMarkdown, sampleMarkdown } from './markdown-check.mjs';
const server = await createServer(); await server.listen(); let browser;
try {
  const channel = process.env.COSMO_BROWSER || 'chrome';
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const page = await browser.newPage(), outside = [], errors = [];
  const origin = server.resolvedUrls.local[0];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (/^https?:/.test(url) && new URL(url).origin !== new URL(origin).origin) { outside.push(url); return route.abort(); }
    return route.continue();
  });
  await page.goto(origin);
  async function save(expected) {
    await page.getByRole('region', { name: 'Anteprima Markdown' }).waitFor();
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Esporta MD', exact: true }).click();
    const file = await download; assert.match(file.suggestedFilename(), /\.md$/);
    assert.equal(await readFile(await file.path(), 'utf8'), expected);
  }
  await checkMarkdown(page, save);
  await save(sampleMarkdown);
  await page.screenshot({ path: 'test-results/markdown-390.png', fullPage: true });
  await page.setViewportSize({ width: 1400, height: 1000 });
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  const bytes = Buffer.from('\uFEFF' + sampleMarkdown.replaceAll('\n', '\r\n'));
  async function open(buffer, name = 'esempio-originale.md') {
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
    await (await chooser).setFiles({ name, mimeType: 'text/markdown', buffer });
  }
  await open(bytes); await page.getByRole('region', { name: 'Anteprima Markdown' }).waitFor();
  await save(bytes.toString('utf8'));
  // Exercise actual backup archive paths and source, not HTML reconstruction.
  const backup = await page.evaluate(async source => {
    const { exportBackup, importBackup } = await import('/src/backups.mjs');
    const restored = await importBackup(await exportBackup([{ kind: 'write', fileType: 'MD', name: 'Campione', payload: source, updated: 1 }]));
    return { type: restored[0].fileType, source: restored[0].payload };
  }, bytes.toString('utf8'));
  assert.deepEqual(backup, { type: 'MD', source: bytes.toString('utf8') });
  await page.reload();
  await page.getByRole('button', { name: 'esempio-originale CosmoWrite · Markdown', exact: true }).click();
  await save(bytes.toString('utf8'));
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  await open(Buffer.from([0xc3, 0x28]), 'invalido.md');
  await page.getByRole('status').filter({ hasText: 'UTF-8 valido' }).waitFor();
  assert.equal(await page.getByRole('button', { name: /invalido CosmoWrite/ }).count(), 0);
  assert.deepEqual(outside, []); assert.deepEqual(errors, []);
  await mkdir('test-results', { recursive: true });
  console.log('PASS Markdown browser: creazione, apertura UTF-8/BOM/CRLF, modifica, export identico, riapertura dopo ricarica, backup, vuoto, HTML ostile, file grande, 390px, nessuna rete esterna.');
} finally { await browser?.close(); await server.close(); }
