import test from 'node:test';
import assert from 'node:assert/strict';
import mammoth from 'mammoth';
import { exportDocument } from '../src/documents.mjs';
import { newWorkbook, openWorkbook, exportWorkbook, setCellInput, calculatorFor } from '../src/workbooks.mjs';

test('DOCX exports real text, bold marks and tables readable by another parser', async () => {
  const bytes = await exportDocument({ type: 'doc', content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Titolo Cosmonet' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Testo italiano: è già pronto.', marks: [{ type: 'bold' }] }] },
    { type: 'table', content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Dentro la tabella' }] }] }] }] },
  ] });
  const result = await mammoth.convertToHtml({ buffer: Buffer.from(bytes) });
  assert.match(result.value, /<h1>Titolo Cosmonet<\/h1>/);
  assert.match(result.value, /<strong>Testo italiano: è già pronto\.<\/strong>/);
  assert.match(result.value, /<table>/); assert.match(result.value, /Dentro la tabella/);
});
test('XLSX round trip retains sheets, styles, references and cells outside the UI viewport', async () => {
  const book = newWorkbook('budget'); const sheet = book.worksheets[0];
  setCellInput(sheet.getCell('B2'), '1400'); sheet.getCell('ZZ9000').value = 'Fuori area';
  book.addWorksheet('Secondo foglio').getCell('A1').value = 'Conservato';
  assert.equal(calculatorFor(sheet)('D5'), 670);
  const restored = await openWorkbook(await exportWorkbook(book));
  assert.equal(restored.worksheets.length, 2); assert.equal(restored.worksheets[0].getCell('B2').value, 1400);
  assert.equal(restored.worksheets[0].getCell('ZZ9000').value, 'Fuori area');
  assert.equal(restored.worksheets[0].getCell('B5').formula, 'SUM(B2:B4)');
  assert.equal(restored.worksheets[0].getCell('D5').result, 670);
  assert.equal(restored.worksheets[0].getCell('A1').font.bold, true);
  assert.equal(restored.worksheets[1].getCell('A1').value, 'Conservato');
});
test('unknown formulas retain their source without exporting a misleading cached number', async () => {
  const book = newWorkbook(); book.worksheets[0].getCell('A1').value = { formula: 'UNSUPPORTED(1)', result: 999 };
  const restored = await openWorkbook(await exportWorkbook(book));
  assert.equal(restored.worksheets[0].getCell('A1').formula, 'UNSUPPORTED(1)');
  assert.equal(restored.worksheets[0].getCell('A1').result, undefined);
});
