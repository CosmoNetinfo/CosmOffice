import test from 'node:test';
import assert from 'node:assert/strict';
import mammoth from 'mammoth';
import { exportDocument } from '../src/documents.mjs';
import { newWorkbook, openWorkbook, exportWorkbook, setCellInput, calculatorFor, importDelimited, exportDelimited, pasteRange } from '../src/workbooks.mjs';
import JSZip from 'jszip';

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
test('CSV and TSV preserve quotes, multiline text, identifiers and decimal commas', async () => {
  const csv = 'Codice;Valore;Note\r\n0012;12,50;"Testo; con separatore"\r\n0013;3,25;"Prima riga\nSeconda riga"\r\n0014;=1+1;Normale';
  const book = importDelimited(new TextEncoder().encode(csv)); const sheet = book.worksheets[0];
  assert.equal(sheet.getCell('A2').value, '0012'); assert.equal(sheet.getCell('B2').value, 12.5); assert.equal(sheet.getCell('C2').value, 'Testo; con separatore');
  assert.equal(sheet.getCell('C3').value, 'Prima riga\nSeconda riga'); assert.equal(sheet.getCell('B4').type, 3);
  const output = new TextDecoder().decode(exportDelimited(sheet)); assert.match(output, /'0012|0012/); assert.match(output, /'=1\+1/);
  const size = pasteRange(sheet, 'E2', '10\t20\n30\t=SUM(E2:F2)');
  assert.deepEqual(size, { rows: 2, cols: 2 }); assert.equal(calculatorFor(sheet)('F3'), 30);
});
test('cross-sheet formulas survive XLSX round trips and get calculated results', async () => {
  const book = newWorkbook(); book.worksheets[0].getCell('A1').value = { formula: "'Budget 2026'!B2*2" };
  book.addWorksheet('Budget 2026').getCell('B2').value = 21;
  const restored = await openWorkbook(await exportWorkbook(book));
  assert.equal(restored.worksheets[0].getCell('A1').result, 42);
});
test('DOCX retains fonts, colours, sizes, page format and margins in OOXML', async () => {
  const data = await exportDocument({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Stile conservato', marks: [{ type: 'textStyle', attrs: { fontFamily: 'Georgia', fontSize: '18pt', color: '#2865d8' } }] }] }] }, 'Stili', { writerPaper: 'Letter', writerMargin: 25, writerFont: 'Arial' });
  const zip = await JSZip.loadAsync(data); const xml = await zip.file('word/document.xml').async('string');
  assert.match(xml, /Georgia/); assert.match(xml, /w:sz w:val="36"/); assert.match(xml, /2865d8/); assert.match(xml, /w:w="12240"/); assert.match(xml, /w:top="1417"/);
});
test('landscape DOCX uses a physically wider page with matching orientation', async () => {
  const data = await exportDocument({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Pagina orizzontale' }] }] }, 'Orizzontale', { writerOrientation: 'landscape' });
  const zip = await JSZip.loadAsync(data), xml = await zip.file('word/document.xml').async('string');
  assert.match(xml, /<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/);
});
test('Italian formulas are saved in invariant XLSX syntax without losing absolute references', async () => {
  const book = newWorkbook(), sheet = book.worksheets[0];
  setCellInput(sheet.getCell('A1'), '=SOMMA(1,5;2,5)');
  setCellInput(sheet.getCell('B1'), '=SOMMA($A$1:A1)');
  const restored = await openWorkbook(await exportWorkbook(book));
  assert.equal(restored.worksheets[0].getCell('A1').formula, 'SUM(1.5,2.5)');
  assert.equal(restored.worksheets[0].getCell('A1').result, 4);
  assert.equal(restored.worksheets[0].getCell('B1').formula, 'SUM($A$1:A1)');
  assert.equal(restored.worksheets[0].getCell('B1').result, 4);
});
