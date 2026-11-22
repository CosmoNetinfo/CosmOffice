import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument, StandardFonts } from 'pdf-lib';
export async function checkDebug(application, page) {
  const marker = 'COSMO-SEGRETO-TESTER-74291', dir = resolve('test-results');
  const pdf = await PDFDocument.create(), font = await pdf.embedFont(StandardFonts.Helvetica);
  pdf.addPage().drawText(marker, { font, x: 30, y: 500 });
  const filename = resolve(dir, `${marker}.pdf`); await writeFile(filename, await pdf.save());
  await application.evaluate(({ dialog }, file) => { dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [file] }); }, filename);
  await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.pdf-loading') && document.querySelector('.pdf-paper canvas')?.width > 0);
  await page.evaluate(async secret => {
    await window.cosmoffice.debugClear();
    // Veri eventi non gestiti, senza interrompere la finestra.
    setTimeout(() => { throw new TypeError(secret); }, 0);
    Promise.reject(new RangeError(secret));
  }, `${marker} C:/Users/${marker}/${marker}.pdf`);
  const mainEvent = await application.evaluate((_, secret) => {
    const mainProcess = process.getBuiltinModule('node:process');
    const error = new SyntaxError(secret);
    return { listeners: mainProcess.listenerCount('uncaughtExceptionMonitor'), emitted: mainProcess.emit('uncaughtExceptionMonitor', error, 'uncaughtException') };
  }, `${marker} /home/${marker}/atto.pdf`);
  assert.ok(mainEvent.listeners > 0 && mainEvent.emitted, 'ascoltatore reale del processo principale installato');
  await page.waitForFunction(async () => {
    const text = await window.cosmoffice.debugReport();
    return ['TypeError', 'RangeError', 'SyntaxError'].every(type => text.includes(type));
  });
  await application.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.emit('unresponsive'); win.webContents.emit('render-process-gone', {}, { reason: 'crashed' });
  });
  assert.match(await page.evaluate(() => window.cosmoffice.debugReport()), /SyntaxError/, 'evento main conservato dopo gli eventi finestra');
  await application.evaluate(({ Menu }) => Menu.getApplicationMenu().items[0].submenu.items[0].click());
  const report = page.getByRole('textbox', { name: 'Rapporto di debug', exact: true });
  await report.waitFor();
  await page.waitForFunction(() => document.querySelector('textarea[aria-label="Rapporto di debug"]')?.value.includes('Ultimi errori'));
  const text = await report.inputValue();
  await writeFile(resolve(dir, 'debug-test-report.txt'), text);
  for (const expected of ['TypeError', 'RangeError', 'SyntaxError', 'Eccezione non gestita', 'La finestra non risponde', 'Il processo della finestra si è arrestato', 'CosmoView', 'Tipo file: PDF', 'Electron:', 'Chromium:', 'Dimensione approssimativa:']) assert.ok(text.includes(expected), expected);
  for (const forbidden of [marker, filename, 'C:/Users/', '/home/', 'atto.pdf']) assert.equal(text.includes(forbidden), false, forbidden);
  await page.getByRole('button', { name: 'Copia rapporto', exact: true }).click();
  await page.getByText('Rapporto copiato negli appunti.', { exact: true }).waitFor();
  assert.equal(await application.evaluate(({ clipboard }) => clipboard.readText()), text);
  const profile = await application.evaluate(({ app }) => app.getPath('userData'));
  const local = await readFile(resolve(profile, 'registro-errori.json'), 'utf8');
  assert.equal(local.includes(marker), false); assert.equal(JSON.parse(local).length, 5);
  await page.screenshot({ path: resolve(dir, 'rapporto-tester.png') });
  await page.getByRole('button', { name: 'Chiudi rapporto', exact: true }).click();
  // Riapertura dopo ricaricamento: il registro principale resta disponibile.
  await page.reload(); await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByRole('button', { name: 'Segnala un problema', exact: true }).click();
  await report.waitFor();
  await page.waitForFunction(() => document.querySelector('textarea[aria-label="Rapporto di debug"]')?.value.includes('SyntaxError'));
  assert.match(await report.inputValue(), /SyntaxError/);
  await page.getByRole('button', { name: 'Svuota registro', exact: true }).click();
  await page.getByText('Registro svuotato.', { exact: true }).waitFor();
  assert.match(await report.inputValue(), /Nessun evento registrato/);
  assert.deepEqual(JSON.parse(await readFile(resolve(profile, 'registro-errori.json'), 'utf8')), []);
  await page.getByRole('button', { name: 'Chiudi rapporto', exact: true }).click();
  console.log('PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.');
}
