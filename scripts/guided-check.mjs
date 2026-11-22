import assert from 'node:assert/strict';
export async function checkGuided(application, page) {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByRole('button', { name: 'Prova guidata', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Prova guidata', exact: true });
  await dialog.waitFor();
  const labels = ['Installazione', 'Word', 'Excel', 'Grafici', 'PDF', 'Offline', 'Ortografia', 'Segnalazione'];
  const values = ['Ok', 'Problema', 'Ok', 'Problema', 'Ok', 'Non provato', 'Ok', 'Ok'];
  assert.equal(await dialog.getByRole('radio').count(), 24);
  assert.equal(await dialog.locator('input:not([type="radio"])').count(), 0);
  assert.equal(await dialog.locator('textarea:not([readonly])').count(), 0);
  for (const [index, label] of labels.entries()) {
    const group = dialog.getByRole('group', { name: label, exact: true });
    assert.equal(await group.getByRole('radio').count(), 3);
    await group.getByRole('radio', { name: values[index], exact: true }).check();
  }
  await dialog.getByRole('button', { name: 'Copia rapporto', exact: true }).click();
  await dialog.getByText('Rapporto copiato negli appunti.', { exact: true }).waitFor();
  const copied = await application.evaluate(({ clipboard }) => clipboard.readText());
  const expected = labels.map((label, index) => `${label}: ${values[index]}`);
  assert.deepEqual(copied.split('\n').slice(0, 8), expected);
  assert.ok(copied.indexOf('Rapporto di debug CosmOffice') > copied.indexOf('Segnalazione: Ok'));
  assert.ok(Buffer.byteLength(copied, 'utf8') <= 6144);
  await dialog.locator('summary').click();
  assert.equal(await dialog.getByRole('textbox', { name: 'Rapporto della prova guidata' }).inputValue(), copied);
  await dialog.getByRole('button', { name: 'Chiudi prova guidata', exact: true }).click();
  await page.reload(); await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  await application.evaluate(({ Menu }) => Menu.getApplicationMenu().items[0].submenu.items.find(item => item.label === 'Prova guidata').click());
  await dialog.waitFor();
  for (const [index, label] of labels.entries()) assert.equal(await dialog.getByRole('group', { name: label, exact: true }).getByRole('radio', { name: values[index], exact: true }).isChecked(), true);
  await dialog.getByRole('button', { name: 'Chiudi prova guidata', exact: true }).click();
  const poisoned = await page.evaluate(async () => {
    const secret = 'RISERVATO-NOME-FILE-UTENTE-CONTENUTO';
    localStorage.setItem('cosmoffice.guided.v1', JSON.stringify({ install: 'Ok', word: secret, filename: secret, text: secret }));
    await window.cosmoffice.debugGuided({ install: 'Ok', word: secret, filename: secret });
    return window.cosmoffice.debugReport();
  });
  assert.equal(poisoned.includes('RISERVATO'), false);
  assert.deepEqual(poisoned.split('\n').slice(0, 3), ['Installazione: Ok', 'Word: Non provato', 'Excel: Non provato']);
  assert.deepEqual(errors, []);
  const attempts = await application.evaluate(({ app }) => process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(), 'electron/main.cjs'))('./offline.cjs').getNetworkAttempts());
  assert.deepEqual(attempts, []);
  console.log('PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.');
}
