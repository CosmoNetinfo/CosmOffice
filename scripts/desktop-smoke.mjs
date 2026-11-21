import { _electron as electron } from 'playwright';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { openWorkbook } from '../src/workbooks.mjs';
import { PDFDocument } from 'pdf-lib';
import { spawnSync } from 'node:child_process';

await mkdir('test-results', { recursive: true });
const errors = [];
let closed = false;
const application = await electron.launch({
  executablePath: resolve('release/win-unpacked/CosmOffice.exe'),
  env: { ...process.env, COSMO_TEST: '1', COSMO_TEST_PROFILE: resolve(`test-results/desktop-profile-${Date.now()}`) },
});
try {
  const page = await application.firstWindow();
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  assert.equal(await page.evaluate(() => typeof window.cosmoffice?.openFile), 'function');
  assert.equal(await page.evaluate(() => typeof window.require), 'undefined');
  async function openFile(path) {
    await application.evaluate(({ dialog }, file) => { dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [file] }); }, resolve(path));
    await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
  }
  await openFile('test-results/verifica.docx');
  await page.locator('.document-page').waitFor();
  assert.match(await page.locator('.document-page').innerText(), /Documento di verifica Cosmonet/);
  const generatedPdf = resolve('test-results/documento-esportato.pdf');
  await application.evaluate(({ dialog }, file) => { dialog.showSaveDialog = async () => ({ canceled: false, filePath: file }); }, generatedPdf);
  await page.getByRole('button', { name: 'Esporta PDF', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'PDF esportato' }).waitFor();
  assert.match((await readFile(generatedPdf)).subarray(0, 10).toString(), /^%PDF-/);
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  await openFile('test-results/verifica.xlsx');
  await page.getByRole('textbox', { name: 'Cella A1', exact: true }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Cella A1', exact: true }).inputValue(), 'Voce');
  for (const [address, value] of [['G1', '00042'], ['G2', '12345678901234567890'], ['G3', '=IFERROR("#N/A";"ripiego")']]) {
    const cell = page.getByRole('textbox', { name: `Cella ${address}`, exact: true });
    await cell.focus(); await cell.fill(value); await cell.press('Enter');
  }
  await page.getByRole('textbox', { name: 'Cella A1', exact: true }).focus();
  assert.equal(await page.getByRole('textbox', { name: 'Cella G2', exact: true }).inputValue(), '12345678901234567890');
  assert.equal(await page.getByRole('textbox', { name: 'Cella G3', exact: true }).evaluate(element => element.parentElement.classList.contains('error-cell')), false);
  const numericTarget = resolve('test-results/codici-conservati-desktop.xlsx');
  await application.evaluate(({ dialog }, file) => { dialog.showSaveDialog = async () => ({ canceled: false, filePath: file }); }, numericTarget);
  await page.getByRole('button', { name: 'Esporta XLSX' }).click();
  await page.getByRole('status').filter({ hasText: 'Copia esportata: codici-conservati-desktop.xlsx' }).waitFor();
  const numericBook = await openWorkbook(new Uint8Array(await readFile(numericTarget)));
  assert.equal(numericBook.worksheets[0].getCell('G1').value, '00042');
  assert.equal(numericBook.worksheets[0].getCell('G2').value, '12345678901234567890');
  assert.equal(numericBook.worksheets[0].getCell('G3').result, '#N/A');
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  await openFile('test-results/esempio-cosmonet.pdf');
  await page.locator('.textLayer span').first().waitFor();
  await page.waitForFunction(() => !document.querySelector('.pdf-loading'));
  await page.getByRole('button', { name: 'Pagina successiva', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.textLayer')?.textContent.includes('progetto'));
  const target = resolve('test-results/pdf-copia-desktop.pdf');
  await application.evaluate(({ dialog }, file) => { dialog.showSaveDialog = async () => ({ canceled: false, filePath: file }); }, target);
  await page.getByRole('button', { name: 'Salva copia PDF' }).click();
  await page.getByRole('status').filter({ hasText: 'Copia esportata' }).waitFor();
  assert.deepEqual(await readFile(target), await readFile('test-results/esempio-cosmonet.pdf'));
  const rotatedTarget = resolve('test-results/pdf-ruotato-desktop.pdf');
  await application.evaluate(({ dialog }, file) => { dialog.showSaveDialog = async () => ({ canceled: false, filePath: file }); }, rotatedTarget);
  await page.getByRole('button', { name: 'Ruota pagina PDF', exact: true }).click();
  await page.getByRole('button', { name: 'Salva copia PDF', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Copia esportata: pdf-ruotato-desktop.pdf' }).waitFor();
  const rotated = await PDFDocument.load(await readFile(rotatedTarget));
  assert.deepEqual(rotated.getPages().map(page => page.getRotation().angle), [0, 90]);
  const independent = spawnSync(process.platform === 'win32' ? 'pdfinfo.exe' : 'pdfinfo', ['-f', '1', '-l', '2', rotatedTarget], { encoding: 'utf8', windowsHide: true });
  assert.equal(independent.status, 0, independent.stderr);
  assert.match(independent.stdout, /Page\s+1\s+rot:\s+0/); assert.match(independent.stdout, /Page\s+2\s+rot:\s+90/);
  await page.getByRole('button', { name: 'Torna alle bozze' }).click(); await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  await openFile(rotatedTarget); await page.locator('.textLayer span').first().waitFor();
  await page.getByRole('button', { name: 'Pagina successiva', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.pdf-loading') && document.querySelector('.pdf-paper canvas')?.width > document.querySelector('.pdf-paper canvas')?.height);
  const blocked = resolve('test-results/originale-da-preservare.pdf');
  const original = new TextEncoder().encode('%PDF-1.7\nORIGINALE DA PRESERVARE\n%%EOF');
  await writeFile(blocked, original);
  await application.evaluate(({ dialog }, file) => {
    dialog.showSaveDialog = async () => ({ canceled: false, filePath: file });
    const fs = process.getBuiltinModule('node:fs/promises');
    globalThis.__cosmoOriginalRename = fs.rename;
    fs.rename = async () => { throw Object.assign(new Error('File occupato durante la verifica'), { code: 'EBUSY' }); };
  }, blocked);
  await page.getByRole('button', { name: 'Salva copia PDF' }).click();
  await page.getByRole('status').filter({ hasText: 'Esportazione non riuscita' }).waitFor();
  assert.doesNotMatch(await page.getByRole('status').filter({ hasText: 'Esportazione non riuscita' }).innerText(), /Error invoking remote method|Error:/);
  assert.deepEqual(new Uint8Array(await readFile(blocked)), original);
  assert.equal((await readdir('test-results')).some(name => name.startsWith('originale-da-preservare.pdf.') && name.endsWith('.tmp')), false);
  await application.evaluate(() => { process.getBuiltinModule('node:fs/promises').rename = globalThis.__cosmoOriginalRename; delete globalThis.__cosmoOriginalRename; });
  await page.screenshot({ path: 'test-results/desktop-pdf.png' });
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByRole('combobox', { name: 'Tema interfaccia' }).selectOption('dark');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.screenshot({ path: 'test-results/desktop-settings.png' });
  assert.deepEqual(errors, []);
  assert.deepEqual(await application.evaluate(({ app }) => process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(), 'electron/main.cjs'))('./offline.cjs').getNetworkAttempts()), [], 'nessun tentativo di rete nel pacchetto installabile');
  // Emit Electron's notification without invoking Windows Error Reporting during a headless test.
  await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.emit('render-process-gone', {}, { reason: 'crashed', exitCode: 1 }));
  await application.close(); closed = true;
  const report = { result: 'PASS', package: 'Windows x64', checks: ['Avvio pacchetto locale', 'Preload isolato e nessun require nel renderer', 'Apertura DOCX/XLSX/PDF via IPC e filesystem', 'Esportazione documento in PDF tramite printToPDF', 'Worker PDF da file locale', 'Esportazione PDF identica su disco', 'Rotazione di pagina 2 salvata su disco e riaperta nel pacchetto', 'Poppler indipendente: prima pagina a 0°, seconda a 90°', 'Nessun tentativo di rete nel main del pacchetto', 'Errore di scrittura: originale preservato e temporanei rimossi', 'Pagina impostazioni e tema scuro nel pacchetto', 'Chiusura dopo notifica simulata di arresto del renderer'], errors };
  await writeFile('test-results/desktop-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} catch (error) { console.error('Verifica desktop non riuscita:', error); throw error; }
finally { if (!closed) await application.close(); }
