import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import JSZip from 'jszip';
import { fixtures } from './fixtures.mjs';

await mkdir('test-results', { recursive: true });
const server = await createServer(); await server.listen();
let browser;
const errors = [];
try {
  const channel = process.env.COSMO_BROWSER || 'chrome';
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const samples = await fixtures(browser);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.failDraftWrites = false; window.openCalls = 0; window.filesToOpen = [];
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function(...args) { if (window.failDraftWrites) throw new DOMException('Spazio esaurito durante il test', 'QuotaExceededError'); return put.apply(this, args); };
    window.cosmoffice = { updateStatus: async () => ({ phase: 'disabled', message: 'Anteprima' }), onUpdate: () => () => {}, openFile: async () => { window.openCalls++; const file = window.filesToOpen.shift(); return file ? { name: file.name, bytes: new Uint8Array(file.bytes) } : null; }, saveFile: async name => ({ name }) };
  });
  await page.goto('http://127.0.0.1:5173');
  await page.getByRole('button', { name: /Lettera professionale/ }).click();
  await page.getByText('Bozza salvata sul dispositivo', { exact: false }).waitFor();
  await page.evaluate(() => { window.failDraftWrites = true; });
  await page.locator('.document-page').click(); await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.type(' Testo da recuperare dopo errore.');
  await page.getByRole('alert').filter({ hasText: 'La bozza non è salvata' }).waitFor();
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  assert.equal(await page.locator('.settings-page').count(), 0);
  assert.match(await page.locator('.document-page').innerText(), /Testo da recuperare dopo errore/);
  await page.getByRole('button', { name: 'Apri dal dispositivo', exact: true }).click();
  assert.equal(await page.evaluate(() => window.openCalls), 0);
  await page.evaluate(() => { window.failDraftWrites = false; });
  await page.getByRole('button', { name: 'Riprova salvataggio', exact: true }).click();
  await page.getByText('Bozza salvata sul dispositivo', { exact: false }).waitFor();
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Proposta di collaborazione CosmoWrite', exact: true }).click();
  assert.match(await page.locator('.document-page').innerText(), /Testo da recuperare dopo errore/);

  async function open(name, bytes) {
    await page.evaluate(file => window.filesToOpen.push(file), { name, bytes: Array.from(bytes) });
    await page.getByRole('button', { name: 'Apri dal dispositivo', exact: true }).click();
  }
  await open('Danneggiato.docx', new TextEncoder().encode('File non valido'));
  await page.getByRole('status').filter({ hasText: 'File Office non valido' }).waitFor();
  assert.match(await page.locator('.document-page').innerText(), /Testo da recuperare dopo errore/);
  await open('Estensione-errata.docx', samples.sheet);
  await page.getByRole('status').filter({ hasText: 'Word DOCX valido' }).waitFor();
  await open('Danneggiato.pdf', new TextEncoder().encode('%PDF-1.7\nContenuto danneggiato\n%%EOF'));
  await page.getByRole('status').filter({ hasText: 'PDF è danneggiato' }).waitFor();
  assert.match(await page.locator('.document-page').innerText(), /Testo da recuperare dopo errore/);
  const count = await page.evaluate(async () => (await (await import('/src/storage.mjs')).listDrafts()).length);
  assert.equal(count, 1);
  const zip = await JSZip.loadAsync(samples.word);
  zip.file('word/comments.xml', '<w:comments xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:comment w:id="1" w:author="Cosmonet"><w:p><w:r><w:t>Nota di verifica</w:t></w:r></w:p></w:comment></w:comments>');
  await open('Documento-con-commenti.docx', await zip.generateAsync({ type: 'uint8array' }));
  await page.locator('.compatibility-details summary').click();
  assert.match(await page.locator('.compatibility-details').innerText(), /Commenti e note/);
  const atomic = await page.evaluate(async () => {
    const { storeDrafts, listDrafts } = await import('/src/storage.mjs');
    const before = (await listDrafts()).length;
    let rejected = false;
    try { await storeDrafts([{ id: 'atomic-probe', name: 'Non deve comparire', kind: 'write', payload: '<p>Prova</p>', updated: Date.now() }, { id: 'invalid-probe', payload: () => {} }]); }
    catch { rejected = true; }
    const after = await listDrafts();
    return { rejected, before, after: after.length, partialWrite: after.some(record => record.id === 'atomic-probe') };
  });
  assert.deepEqual(atomic, { rejected: true, before: 2, after: 2, partialWrite: false });
  await page.screenshot({ path: 'test-results/compatibility-warning.png' });
  assert.deepEqual(errors, []);
  const report = { result: 'PASS', scenarios: ['Errore quota: documento conservato e navigazione bloccata', 'Riprova salvataggio e recupero dopo riavvio', 'DOCX/PDF danneggiati e estensioni errate respinti senza creare bozze', 'Avviso specifico per commenti Word', 'Ripristino archivio atomico anche in caso di dati non scrivibili'], errors };
  await writeFile('test-results/reliability-report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} catch (error) { console.error(error); process.exitCode = 1; }
finally { await browser?.close(); await server.close(); }
