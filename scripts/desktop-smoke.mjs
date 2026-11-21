import { _electron as electron } from 'playwright';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

await mkdir('test-results', { recursive: true });
const errors = [];
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
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  await openFile('test-results/verifica.xlsx');
  await page.getByRole('textbox', { name: 'Cella A1', exact: true }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Cella A1', exact: true }).inputValue(), 'Voce');
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
  await page.screenshot({ path: 'test-results/desktop-pdf.png' });
  assert.deepEqual(errors, []);
  const report = { result: 'PASS', package: 'Windows x64', checks: ['Avvio pacchetto locale', 'Preload isolato e nessun require nel renderer', 'Apertura DOCX/XLSX/PDF via IPC e filesystem', 'Worker PDF da file locale', 'Esportazione PDF identica su disco'], errors };
  await writeFile('test-results/desktop-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await application.close(); }
