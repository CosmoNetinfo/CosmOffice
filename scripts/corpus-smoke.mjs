import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { openWorkbook } from '../src/workbooks.mjs';
import { invariantFormula } from '../src/formulas.mjs';

const manifest = JSON.parse(await readFile('tests/fixtures/manifest.json', 'utf8'));
const requested = process.argv.slice(2), selected = requested.length ? manifest.files.filter(file => requested.includes(file.name)) : manifest.files;
assert.ok(selected.length && (!requested.length || selected.length === requested.length), 'nomi dei campioni richiesti validi');
const folder = 'test-results/corpus'; await mkdir(folder, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 5173, strictPort: true } }); await server.listen();
const channel = process.env.COSMO_BROWSER || 'chrome';
let browser; const results = [], errors = [], external = [], diagnostics = [];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function inspectPdf(page, bytes) {
  return page.evaluate(async data => {
    const { createPdfTask } = await import('/src/pdf-engine.mjs'); const task = createPdfTask(new Uint8Array(data)); const pdf = await task.promise;
    try {
      const texts = [], rotations = [];
      for (let i = 1; i <= pdf.numPages; i++) { const page = await pdf.getPage(i); texts.push((await page.getTextContent()).items.map(item => item.str || '').join(' ')); rotations.push(page.rotate); }
      return { pages: pdf.numPages, texts, rotations };
    } finally { await task.destroy(); }
  }, Array.from(bytes));
}
async function verifyDoc(bytes, file) {
  const zip = await JSZip.loadAsync(bytes);
  const text = (await mammoth.extractRawText({ buffer: Buffer.from(bytes) })).value;
  for (const expected of [...file.text, 'Modifica corpus conservata.']) assert.ok(text.includes(expected), `${file.name}: testo ${expected}`);
  const body = await zip.file('word/document.xml').async('string');
  assert.equal(body.match(/<w:tbl>/g)?.length || 0, file.tables, 'tabelle');
  if (file.lists) assert.ok((body.match(/<w:numPr>/g)?.length || 0) >= 5, 'elenchi numerati e puntati');
  const parts = Object.values(zip.files).filter(entry => !entry.dir);
  assert.ok(parts.filter(entry => /\/media\//.test(entry.name)).length >= file.images, 'immagini incorporate');
  if (file.header) {
    const headers = await Promise.all(parts.filter(entry => /\/header\d*\.xml$/.test(entry.name)).map(entry => entry.async('string')));
    const footers = await Promise.all(parts.filter(entry => /\/footer\d*\.xml$/.test(entry.name)).map(entry => entry.async('string')));
    assert.ok(headers.some(xml => xml.includes(file.header)), 'intestazione conservata');
    assert.ok(footers.some(xml => xml.includes(file.footer) && xml.includes('PAGE')), 'piè di pagina e campo pagina conservati');
    assert.match(body, /w:headerReference/, 'riferimento intestazione');
    assert.match(body, /w:footerReference/, 'riferimento piè di pagina');
  }
}
async function verifyGrid(original, bytes) {
  const actual = await openWorkbook(bytes);
  assert.equal(actual.worksheets.length, original.worksheets.length);
  for (const source of original.worksheets) {
    const target = actual.getWorksheet(source.name); assert.ok(target, source.name);
    assert.deepEqual(target.model.merges, source.model.merges, 'celle unite');
    assert.deepEqual(target.autoFilter, source.autoFilter, 'filtri');
    assert.equal(target.getImages().length, source.getImages().length, 'immagini');
    source.eachRow(row => row.eachCell(cell => {
      if (cell.type === 1) return; // I valori delle celle unite sono verificati sul master.
      const other = target.getCell(cell.address);
      if (cell.formula) { assert.equal(invariantFormula(other.formula), invariantFormula(cell.formula), `formula ${cell.address}`); assert.deepEqual(other.result, cell.result, `risultato ${cell.address}`); }
      else assert.deepEqual(other.value, cell.value, `valore ${cell.address}`);
      assert.equal(other.numFmt, cell.numFmt, `formato ${cell.address}`);
      assert.deepEqual(other.font, cell.font, `font ${cell.address}`);
    }));
  }
  assert.equal(actual.worksheets[0].getCell('J10').value, 'Modifica corpus conservata.');
}
try {
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  for (const file of selected) {
    const original = await readFile(`tests/fixtures/${file.name}`); assert.equal(hash(original), file.sha256);
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => {
      window.testFiles = []; window.testSaved = [];
      window.failDraftWrites = false;
      const put = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function(...args) { if (window.failDraftWrites) throw new DOMException('Spazio esaurito durante il test PDF', 'QuotaExceededError'); return put.apply(this, args); };
      window.cosmoffice = { openFile: async () => { const file = window.testFiles.shift(); return file ? { name: file.name, bytes: new Uint8Array(file.bytes) } : null; }, saveFile: async (name, bytes) => { window.testSaved.push({ name, bytes: Array.from(bytes) }); return { name }; }, updateStatus: async () => ({ phase: 'disabled', message: 'Test offline' }), onUpdate: () => () => {} };
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${file.name}: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error') diagnostics.push(`${file.name}: ${message.text()}`); });
    page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:5173/')) external.push(request.url()); });
    async function open(bytes) {
      await page.evaluate(data => window.testFiles.push(data), { name: file.name, bytes: Array.from(bytes) });
      await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
    }
    async function exportFile(label) {
      await page.evaluate(() => { window.testSaved = []; });
      await page.getByRole('button', { name: label, exact: true }).click();
      await page.waitForFunction(() => window.testSaved.length === 1);
      return new Uint8Array(await page.evaluate(() => window.testSaved[0].bytes));
    }
    try {
      await page.goto('http://127.0.0.1:5173'); await open(original);
      let output;
      if (file.kind === 'write') {
        const editor = page.locator('.document-page'); await editor.waitFor();
        for (const text of file.text) assert.ok((await editor.innerText()).includes(text));
        await editor.click(); await page.keyboard.press('ControlOrMeta+End'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await page.keyboard.type('Modifica corpus conservata.');
        await page.getByRole('button', { name: 'Torna alle bozze' }).click(); await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor(); await page.reload();
        await page.getByRole('button', { name: new RegExp(`${file.name.slice(0, -5)} CosmoWrite`) }).click();
        if (file.header) {
          const sourceRetained = await page.evaluate(async () => {
            const { listDrafts } = await import('/src/storage.mjs'); const { exportBackup, importBackup } = await import('/src/backups.mjs');
            const records = await listDrafts(), restored = await importBackup(await exportBackup(records));
            return records.length === 1 && restored.length === 1 && JSON.stringify(Array.from(records[0].sourceDocx)) === JSON.stringify(Array.from(restored[0].sourceDocx));
          });
          assert.equal(sourceRetained, true, 'sorgente DOCX conservata nel backup');
        }
        output = await exportFile('Esporta DOCX'); await verifyDoc(output, file);
        if (file.header) {
          const complex = await JSZip.loadAsync(original);
          const document = await complex.file('word/document.xml').async('string');
          complex.file('word/document.xml', document.replace('<w:body>', '<w:body><w:p><w:pPr><w:sectPr/></w:pPr></w:p>'));
          const blocked = await page.evaluate(async data => {
            const { preserveDocxParts } = await import('/src/docx-preservation.mjs');
            try { await preserveDocxParts(new Uint8Array(data.output), new Uint8Array(data.input)); return false; } catch (error) { return error.message.includes('più sezioni'); }
          }, { output: Array.from(output), input: Array.from(await complex.generateAsync({ type: 'uint8array' })) });
          assert.equal(blocked, true, 'sezioni multiple bloccate senza produrre file incompleti');
          const comments = await JSZip.loadAsync(original);
          comments.file('word/comments.xml', '<w:comments xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:comment w:id="1"><w:p><w:r><w:t>Nota da conservare</w:t></w:r></w:p></w:comment></w:comments>');
          const commentsBlocked = await page.evaluate(async data => {
            const { preserveDocxParts } = await import('/src/docx-preservation.mjs');
            try { await preserveDocxParts(new Uint8Array(data.output), new Uint8Array(data.input)); return false; } catch (error) { return error.message.includes('bloccata') && error.message.includes('Commenti'); }
          }, { output: Array.from(output), input: Array.from(await comments.generateAsync({ type: 'uint8array' })) });
          assert.equal(commentsBlocked, true, 'commenti non eliminati silenziosamente');
        }
        await page.getByRole('button', { name: 'Torna alle bozze' }).click(); await open(output);
        assert.ok((await editor.innerText()).includes('Modifica corpus conservata.'));
        await verifyDoc(await exportFile('Esporta DOCX'), file);
        if (file.header) {
          await page.getByRole('button', { name: 'Torna alle bozze' }).click();
          await page.evaluate(async () => { const { listDrafts, storeDraft } = await import('/src/storage.mjs'); for (const record of await listDrafts()) { delete record.sourceDocx; await storeDraft(record); } });
          await page.reload(); await page.getByRole('button', { name: new RegExp(`${file.name.slice(0, -5)} CosmoWrite`) }).first().click();
          await page.evaluate(() => { window.testSaved = []; });
          await page.getByRole('button', { name: 'Esporta DOCX', exact: true }).click();
          await page.getByRole('status').filter({ hasText: 'Reimporta il DOCX originale' }).waitFor();
          assert.equal(await page.evaluate(() => window.testSaved.length), 0, 'vecchie bozze senza sorgente non esportate con perdita');
        }
      } else if (file.kind === 'grid') {
        const book = await openWorkbook(original);
        const cell = page.getByRole('textbox', { name: 'Cella J10', exact: true }); await cell.waitFor(); await cell.fill('Modifica corpus conservata.'); await cell.press('Enter');
        output = await exportFile('Esporta XLSX'); await verifyGrid(book, output);
        await page.getByRole('button', { name: 'Torna alle bozze' }).click(); await open(output);
        await cell.waitFor(); assert.equal(await cell.inputValue(), 'Modifica corpus conservata.');
        await verifyGrid(book, await exportFile('Esporta XLSX'));
      } else {
        await page.waitForFunction(() => document.querySelector('.pdf-paper canvas')?.width > 0 && !document.querySelector('.pdf-loading'));
        const metadata = await inspectPdf(page, original);
        assert.equal(metadata.pages, file.pages);
        if (file.scanned) assert.ok(metadata.texts.every(text => !text.trim())); else assert.ok(metadata.texts[0].includes(file.text));
        if (file.pages > 1) {
          await page.getByRole('textbox', { name: 'Numero pagina PDF' }).fill(String(file.pages)); await page.getByRole('textbox', { name: 'Numero pagina PDF' }).press('Enter');
          await page.waitForFunction(() => !document.querySelector('.pdf-loading') && document.querySelector('.textLayer')?.textContent.includes('Marcatore pagina 20'));
        }
        assert.equal(hash(await exportFile('Salva copia PDF')), file.sha256, 'senza modifiche la copia PDF resta identica');
        if (file.name === '01-testo.pdf') await page.evaluate(() => { window.failDraftWrites = true; });
        await page.getByRole('button', { name: 'Ruota pagina PDF', exact: true }).click();
        if (file.name === '01-testo.pdf') {
          await page.getByRole('button', { name: 'Torna alle bozze' }).click();
          await page.getByRole('status').filter({ hasText: 'Il documento rimane aperto' }).waitFor();
          assert.equal(await page.locator('.pdf-editor').count(), 1);
          const rescued = await inspectPdf(page, await exportFile('Salva copia PDF'));
          assert.equal(rescued.rotations[0], (metadata.rotations[0] + 90) % 360, 'PDF esportabile anche con quota esaurita');
          await page.evaluate(() => { window.failDraftWrites = false; });
        }
        // Navigation immediately after the click must await editing and draft persistence.
        await page.getByRole('button', { name: 'Torna alle bozze' }).click(); await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor(); await page.reload();
        await page.getByRole('button', { name: new RegExp(`${file.name.slice(0, -4)} CosmoView`) }).click();
        await page.waitForFunction(() => document.querySelector('.pdf-paper canvas')?.width > 0 && !document.querySelector('.pdf-loading'));
        output = await exportFile('Salva copia PDF');
        const saved = await inspectPdf(page, output);
        assert.equal(saved.pages, metadata.pages); assert.deepEqual(saved.texts, metadata.texts, 'testi di tutte le pagine conservati');
        assert.deepEqual(saved.rotations, metadata.rotations.map((rotation, i) => (rotation + (i === file.pages - 1 ? 90 : 0)) % 360), 'ruota solo la pagina selezionata');
        await page.getByRole('button', { name: 'Torna alle bozze' }).click(); await open(output);
        await page.waitForFunction(() => document.querySelector('.pdf-paper canvas')?.width > 0 && !document.querySelector('.pdf-loading'));
        const reopened = await inspectPdf(page, await exportFile('Salva copia PDF')); assert.deepEqual(reopened, saved);
      }
      await writeFile(`${folder}/${file.name}`, output);
      await page.screenshot({ path: `${folder}/${file.name}.png` });
      assert.equal(hash(await readFile(`tests/fixtures/${file.name}`)), file.sha256, 'originale immutato');
      results.push({ file: file.name, status: 'PASS', modification: file.kind === 'pdf' ? 'Rotazione persistente della pagina selezionata' : 'Persistente' });
      console.log(`PASS ${file.name}`);
    } catch (error) {
      await page.screenshot({ path: `${folder}/${file.name}-errore.png` }).catch(() => {});
      results.push({ file: file.name, status: 'FAIL', error: error.message }); console.error(`FAIL ${file.name}: ${error.message}`);
    } finally { await context.close(); }
  }
  await writeFile(`${folder}/report.json`, JSON.stringify({ results, errors, external, diagnostics }, null, 2));
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  assert.equal(results.filter(result => result.status === 'PASS').length, selected.length, `tutti i ${selected.length} file selezionati del corpus; diagnostica: ${diagnostics.join('\n')}`);
} finally { await browser?.close(); await server.close(); }
