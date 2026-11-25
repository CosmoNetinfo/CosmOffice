import { _electron as electron } from 'playwright';
import executablePath from 'electron';
import { resolve } from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testProfile } from './test-profile.mjs';
import { checkMarkdown, sampleMarkdown } from './markdown-check.mjs';
const packaged = process.argv.includes('--package');
await mkdir('test-results', { recursive: true });
const target = resolve('test-results/markdown-desktop.md');
const application = await electron.launch({ timeout: 30000, executablePath: packaged ? resolve('release/win-unpacked/CosmOffice.exe') : executablePath, args: packaged ? [] : ['.', '--no-sandbox'], env: { ...process.env, COSMO_TEST: '1', COSMO_TEST_PROFILE: await testProfile('markdown') } });
try {
  const page = await application.firstWindow(); page.setDefaultTimeout(30000);
  const errors = [], outside = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) outside.push(request.url()); });
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  await application.evaluate(({ dialog }, file) => { dialog.showSaveDialog = async () => ({ canceled: false, filePath: file }); }, target);
  console.log('Markdown: Home pronta, inizio prove editor');
  await checkMarkdown(page, async expected => {
    console.log('Markdown: salvo', expected.length, 'caratteri');
    await page.getByRole('button', { name: 'Esporta MD', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Copia esportata' }).waitFor();
    // Wait for completion even if an older toast has the same text.
    await page.getByRole('button', { name: 'Esporta MD', exact: true }).waitFor({ state: 'visible' });
    await page.waitForFunction(() => !document.querySelector('.busy'));
    assert.equal(await readFile(target, 'utf8'), expected);
  });
  await page.setViewportSize({ width: 1400, height: 1000 });
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  const source = '\uFEFF' + sampleMarkdown.replaceAll('\n', '\r\n');
  await writeFile(target, source);
  await application.evaluate(({ dialog }, file) => { dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [file] }); }, target);
  await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
  await page.getByRole('region', { name: 'Anteprima Markdown' }).waitFor();
  await page.getByRole('button', { name: 'Esporta MD', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.busy'));
  assert.equal(await readFile(target, 'utf8'), source);
  assert.deepEqual(errors, []); assert.deepEqual(outside, []);
  assert.deepEqual(await application.evaluate(({ app }) => process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(), 'electron/main.cjs'))('./offline.cjs').getNetworkAttempts()), []);
  assert.deepEqual(await application.evaluate(({ app }) => process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(), 'electron/main.cjs'))('./offline.cjs').getUpdateAudit()), []);
  console.log(`PASS Markdown ${packaged ? 'pacchetto Windows' : 'Electron'}: creazione, modifica, salvataggio nativo, riapertura .md, BOM/CRLF, sorgente ostile conservato senza esecuzione, nessuna richiesta renderer.`);
} catch (error) { console.error(error); throw error; } finally { await application.evaluate(({ BrowserWindow }) => { for (const window of BrowserWindow.getAllWindows()) window.destroy(); }); await application.close(); }
