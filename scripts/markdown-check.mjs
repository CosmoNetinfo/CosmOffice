import assert from 'node:assert/strict';
export const sampleMarkdown = '# Appunti originali\n\nUna **prova** con città e caffè.\n\n| Voce | Valore |\n| --- | --- |\n| Libri | 12 |\n\n- Primo\n- Secondo\n\n```js\nconst totale = 12;\n```\n\n$$formula_non_interpretata$$\n';
export async function checkMarkdown(page, save) {
  await page.getByRole('button', { name: 'Nuovo Markdown' }).click();
  const source = page.getByRole('textbox', { name: 'Testo Markdown', exact: true });
  await source.fill(sampleMarkdown);
  const preview = page.getByRole('region', { name: 'Anteprima Markdown' });
  await preview.getByRole('heading', { name: 'Appunti originali' }).waitFor();
  assert.equal(await preview.locator('strong').filter({ hasText: /^prova$/ }).count(), 1);
  assert.equal(await preview.locator('table td').first().innerText(), 'Libri');
  assert.match(await preview.locator('pre code').innerText(), /totale = 12/);
  await save(sampleMarkdown);
  await page.getByRole('textbox', { name: 'Nome del file', exact: true }).fill('Appunti di esempio');
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  await page.getByRole('button', { name: 'Appunti di esempio CosmoWrite · Markdown', exact: true }).click();
  assert.equal(await source.inputValue(), sampleMarkdown);
  // Empty documents remain empty even after renaming and reopening.
  await source.fill('');
  await page.getByRole('textbox', { name: 'Nome del file', exact: true }).fill('Appunti vuoti');
  await save('');
  await page.getByRole('button', { name: 'Torna alle bozze' }).click();
  await page.getByRole('button', { name: 'Appunti vuoti CosmoWrite · Markdown', exact: true }).click();
  assert.equal(await source.inputValue(), '');
  const attack = '<script>window.markdownAttack=true</script><img src="https://example.invalid/privato" onerror="window.markdownAttack=true"><iframe src="https://example.invalid"></iframe><p style="background:url(https://example.invalid)">Test sicuro</p>\n\n[link](https://example.invalid)\n\n![immagine](https://example.invalid/image.png)';
  await source.fill(attack);
  await preview.getByText('Test sicuro', { exact: true }).waitFor();
  assert.equal(await preview.locator('script,img,iframe,a,[src],[style]').count(), 0);
  assert.equal(await page.evaluate(() => window.markdownAttack), undefined);
  await save(attack); // Sanitization affects the preview, never the saved source.
  await source.fill('x'.repeat(200001));
  await preview.getByText(/Anteprima sospesa/).waitFor();
  await save('x'.repeat(200001));
  await source.fill(sampleMarkdown);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}
