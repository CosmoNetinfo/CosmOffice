import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { newWorkbook, openWorkbook, exportWorkbook, snapshotWorkbook, snapshotWorksheet, setCellInput, importDelimited, calculatorFor } from '../src/workbooks.mjs';
import { exportDocument } from '../src/documents.mjs';
import { inspectOfficeFile } from '../src/office-inspection.mjs';

test('Excel exports do not mutate the open workbook, even when exported concurrently', async () => {
  const book = newWorkbook('budget');
  book.worksheets[0].getCell('F1').value = { formula: 'UNSUPPORTED(1)', result: 999 };
  const before = structuredClone(book.model);
  const outputs = await Promise.all([exportWorkbook(book), exportWorkbook(book)]);
  assert.deepEqual(structuredClone(book.model), before);
  for (const bytes of outputs) {
    const restored = await openWorkbook(bytes);
    assert.equal(restored.worksheets[0].getCell('D5').result, 470);
    assert.equal(restored.worksheets[0].getCell('F1').result, undefined);
  }
});
test('shared formulas, dates, merges, links and embedded images survive the Excel working copy', async () => {
  const book = newWorkbook(), sheet = book.worksheets[0];
  sheet.getCell('A1').value = 3; sheet.getCell('A2').value = 4;
  sheet.getCell('B1').value = { formula: 'A1*2', shareType: 'shared', ref: 'B1:B2' };
  sheet.getCell('B2').value = { sharedFormula: 'B1' };
  sheet.getCell('D1').value = new Date('2026-11-21T00:00:00Z');
  sheet.getCell('E1').value = { text: 'Cosmonet', hyperlink: 'https://example.com/' };
  sheet.mergeCells('F1:G1'); sheet.getCell('F1').value = 'Celle unite';
  const image = book.addImage({ buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRosAAAAASUVORK5CYII=', 'base64'), extension: 'png' });
  sheet.addImage(image, { tl: { col: 7, row: 0 }, ext: { width: 20, height: 20 } });
  const duplicate = book.addWorksheet('Copia'), id = duplicate.id;
  duplicate.model = { ...snapshotWorksheet(sheet), id, name: 'Copia' };
  assert.equal(duplicate.getCell('G1').value, 'Celle unite');
  const restoredModel = newWorkbook(); restoredModel.model = snapshotWorkbook(book);
  assert.equal(restoredModel.worksheets[0].getCell('G1').value, 'Celle unite');
  const restored = await openWorkbook(await exportWorkbook(book)), target = restored.worksheets[0];
  assert.equal(target.getCell('B2').result, 8);
  assert.equal(target.getCell('D1').value.toISOString(), '2026-11-21T00:00:00.000Z');
  assert.equal(target.getCell('E1').value.hyperlink, 'https://example.com/');
  assert.equal(target.getCell('G1').value, 'Celle unite');
  assert.equal(target.getImages().length, 1);
});
test('damaged files and mismatched Office extensions are rejected before import', async () => {
  await assert.rejects(inspectOfficeFile(new TextEncoder().encode('not an office archive'), 'write'), /non valido/);
  const bytes = await newWorkbook().xlsx.writeBuffer();
  await assert.rejects(inspectOfficeFile(bytes, 'write'), /Word DOCX valido/);
  assert.deepEqual(await inspectOfficeFile(bytes, 'grid'), []);
});
test('unsupported parts produce specific warnings without changing the original file', async () => {
  const docx = await exportDocument({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contenuto' }] }] });
  assert.equal((await inspectOfficeFile(docx, 'write')).some(text => text.includes('Commenti')), false);
  const zip = await JSZip.loadAsync(docx);
  zip.file('word/comments.xml', '<comments><comment id="0">Nota</comment></comments>'); zip.file('word/header1.xml', '<header/>'); zip.file('word/charts/chart1.xml', '<chart/>');
  const bytes = await zip.generateAsync({ type: 'uint8array' }), before = bytes.slice();
  const warnings = await inspectOfficeFile(bytes, 'write');
  assert.ok(warnings.some(text => text.includes('Intestazioni')));
  assert.ok(warnings.some(text => text.includes('Commenti')));
  assert.ok(warnings.some(text => text.includes('grafici')));
  assert.deepEqual(bytes, before);
});
test('identifiers retain leading zeroes and all digits through typing, paste and XLSX export', async () => {
  const book = newWorkbook(), sheet = book.worksheets[0];
  for (const [address, text] of [['A1', '00123'], ['A2', '12345678901234567890'], ['A3', '-00123'], ['A4', '1e-400'], ['A5', '1e-320']]) setCellInput(sheet.getCell(address), text);
  setCellInput(sheet.getCell('B1'), '12,50'); setCellInput(sheet.getCell('B2'), '1,25e3'); setCellInput(sheet.getCell('B3'), 'VERO');
  sheet.getCell('C1').numFmt = '@'; setCellInput(sheet.getCell('C1'), '1234');
  sheet.getCell('C2').numFmt = '@'; setCellInput(sheet.getCell('C2'), '=1+1');
  const restored = (await openWorkbook(await exportWorkbook(book))).worksheets[0];
  assert.equal(restored.getCell('A1').value, '00123'); assert.equal(restored.getCell('A2').value, '12345678901234567890');
  assert.equal(restored.getCell('A3').value, '-00123'); assert.equal(restored.getCell('A4').value, '1e-400'); assert.equal(restored.getCell('A5').value, '1e-320');
  assert.equal(restored.getCell('B1').value, 12.5); assert.equal(restored.getCell('B2').value, 1250);
  assert.equal(restored.getCell('B3').value, true); assert.equal(restored.getCell('C1').value, '1234');
  assert.equal(restored.getCell('C2').value, '=1+1');
  const csv = importDelimited(new TextEncoder().encode('Codice;Lungo;Numero;Formula;Vuoto\n00123;12345678901234567890;1,25e3;=1+1;')).worksheets[0];
  assert.equal(csv.getCell('A2').value, '00123'); assert.equal(csv.getCell('B2').value, '12345678901234567890');
  assert.equal(csv.getCell('C2').value, 1250); assert.equal(calculatorFor(csv)('D2'), '=1+1');
  assert.equal(csv.getCell('E2').value, null);
});
test('XLSX caches keep literal error-like strings separate from actual error cells', async () => {
  const book = newWorkbook(), sheet = book.worksheets[0];
  sheet.getCell('A1').value = '#N/A'; sheet.getCell('A2').value = { error: '#N/A' };
  setCellInput(sheet.getCell('B1'), '=IFERROR(A1;"non deve comparire")');
  setCellInput(sheet.getCell('B2'), '=IFERROR(A2;"recuperato")');
  const restored = (await openWorkbook(await exportWorkbook(book))).worksheets[0];
  assert.equal(restored.getCell('B1').result, '#N/A'); assert.equal(restored.getCell('B2').result, 'recuperato');
  assert.deepEqual(restored.getCell('A2').value, { error: '#N/A' });
});
