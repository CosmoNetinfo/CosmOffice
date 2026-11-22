import { chromium } from 'playwright';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
const server = await createServer(); await server.listen();
const browser = await chromium.launch({ ...(process.env.COSMO_BROWSER === 'chromium' ? {} : { channel: 'chrome' }), headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto('http://127.0.0.1:5173');
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByRole('button', { name: 'Prova guidata', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Prova guidata', exact: true });
  await dialog.waitFor();
  assert.equal(await dialog.getByRole('radio').count(), 24);
  await dialog.getByRole('group', { name: 'Word', exact: true }).getByRole('radio', { name: 'Problema', exact: true }).check();
  await dialog.locator('summary').click();
  await page.waitForFunction(() => document.querySelector('textarea[aria-label="Rapporto della prova guidata"]')?.value.includes('Word: Problema'));
  assert.equal((await dialog.getByRole('textbox').inputValue()).split('\n')[1], 'Word: Problema');
  await dialog.evaluate(element => { element.scrollTop = 0; });
  await page.screenshot({ path: 'test-results/prova-guidata.png', animations: 'disabled' });
  console.log('PASS prova guidata nel browser: 24 radio, rapporto aggiornato e schermata acquisita.');
} finally { await browser.close(); await server.close(); }
