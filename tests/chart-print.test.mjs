import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { newWorkbook, exportWorkbook, openWorkbook, snapshotWorkbook } from '../src/workbooks.mjs';
import { newChart } from '../src/charts.mjs';
test('Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale', async () => {
  const book = newWorkbook(), sheet = book.worksheets[0];
  sheet.addRows([['Mese', 'Valore'], ['Gennaio', 10], ['Febbraio', 20]]);
  book.properties.cosmoCharts = [newChart(book, sheet.id, 'A1', 'B3', 'bar')];
  const original = snapshotWorkbook(book), bytes = await exportWorkbook(book);
  assert.deepEqual(snapshotWorkbook(book), original);
  const zip = await JSZip.loadAsync(bytes), xml = await zip.file('xl/worksheets/sheet1.xml').async('string');
  assert.match(xml, /fitToPage="1"/); assert.match(xml, /orientation="landscape"/); assert.match(xml, /fitToWidth="1"/);
  const restored = await openWorkbook(bytes);
  assert.equal(restored.worksheets[0].pageSetup.fitToWidth, 1);
  assert.equal(restored.worksheets[0].pageSetup.fitToHeight, 1);
  assert.equal(restored.worksheets[0].pageSetup.orientation, 'landscape');
});
