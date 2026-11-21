import ExcelJS from 'exceljs';
import Papa from 'papaparse';
import { createCalculator, columnName, parseAddress } from './formulas.mjs';

export function rawValue(cell) {
  const value = cell.value;
  if (value == null) return '';
  if (typeof value === 'object') {
    if (value.formula) return `=${value.formula}`;
    if (value.sharedFormula) { try { return `=${cell.formula}`; } catch { return '#NOME?'; } }
    if (value.richText) return value.richText.map(run => run.text).join('');
    if (value.error) return value.error;
    if (value instanceof Date) return value.toLocaleDateString('it-IT');
    if (value.text != null) return value.text;
    return cell.text || '';
  }
  return value;
}
export function setCellInput(cell, input) {
  if (input.startsWith('=')) cell.value = { formula: input.slice(1) };
  else if (input.startsWith("'")) cell.value = input.slice(1);
  else if (input.trim() !== '' && /^[+-]?\d+(?:[.,]\d+)?$/.test(input.trim())) cell.value = Number(input.replace(',', '.'));
  else cell.value = input || null;
}
export function calculatorFor(sheet) {
  return createCalculator((address, name) => {
    const target = sheet.workbook.worksheets.find(item => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());
    if (!target) throw new Error('#RIF!');
    const cell = target.getCell(address);
    if (cell.value instanceof Date) return cell.value.getTime() / 86400000 + (sheet.workbook.properties.date1904 ? 24107 : 25569);
    const value = rawValue(cell);
    return cell.type !== ExcelJS.ValueType.Formula && typeof value === 'string' && value.startsWith('=') ? { literal: value } : value;
  }, sheet.name);
}
export function importDelimited(bytes, name = 'Dati', delimiter) {
  let text = new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '');
  if (text.includes('\uFFFD')) text = new TextDecoder('windows-1252').decode(bytes);
  const result = Papa.parse(text, { delimiter: delimiter || '', skipEmptyLines: 'greedy' });
  if (result.errors.some(error => error.code === 'MissingQuotes')) throw new Error('Il file contiene virgolette non chiuse.');
  if (result.data.length > 100000 || result.data.some(row => row.length > 16384)) throw new Error('Il file supera i limiti di importazione dell’anteprima.');
  const book = newWorkbook(); const sheet = book.worksheets[0];
  sheet.name = name.replace(/[\/*?:[\]\\]/g, '-').slice(0, 31) || 'Dati';
  result.data.forEach((row, r) => row.forEach((text, c) => {
    // Imported text that starts with '=' stays text; formulas are entered explicitly in the editor.
    if (/^[+-]?\d+(?:[.,]\d+)?$/.test(text.trim()) && !/^0\d/.test(text.trim())) setCellInput(sheet.getCell(r + 1, c + 1), text);
    else sheet.getCell(r + 1, c + 1).value = text;
  }));
  return book;
}
export function exportDelimited(sheet, delimiter = ';') {
  const calc = calculatorFor(sheet), data = [];
  for (let r = 1; r <= sheet.rowCount; r++) { const row = []; for (let c = 1; c <= sheet.columnCount; c++) row.push(calc(`${columnName(c)}${r}`)); data.push(row); }
  return new TextEncoder().encode('\uFEFF' + Papa.unparse(data, { delimiter, escapeFormulae: true }));
}
export function pasteRange(sheet, start, text) {
  const origin = parseAddress(start), parsed = Papa.parse(text.replace(/\r\n/g, '\n'), { delimiter: '\t', skipEmptyLines: false });
  const rows = parsed.data;
  if (rows.at(-1)?.length === 1 && rows.at(-1)[0] === '') rows.pop();
  const cells = rows.reduce((n, row) => n + row.length, 0);
  if (cells > 10000 || origin.row + rows.length - 1 > 1048576 || rows.some(row => origin.col + row.length - 1 > 16384)) throw new Error('Intervallo troppo grande: massimo 10.000 celle per incolla.');
  rows.forEach((row, r) => row.forEach((value, c) => setCellInput(sheet.getCell(origin.row + r, origin.col + c), value)));
  return { rows: rows.length, cols: Math.max(1, ...rows.map(row => row.length)) };
}
export async function openWorkbook(bytes) {
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(bytes);
  if (!book.worksheets.length) book.addWorksheet('Foglio 1');
  return book;
}
export function newWorkbook(template = 'blank') {
  const book = new ExcelJS.Workbook();
  book.creator = 'Cosmonet';
  const sheet = book.addWorksheet(template === 'budget' ? 'Budget' : 'Foglio 1');
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
  for (let col = 1; col <= 12; col++) sheet.getColumn(col).width = col === 1 ? 26 : 17;
  if (template === 'budget') {
    sheet.addRows([['Voce', 'Preventivo', 'Spesa', 'Differenza'], ['Materiali', 1200, 950, { formula: 'B2-C2' }], ['Servizi', 800, 680, { formula: 'B3-C3' }], ['Comunicazione', 500, 400, { formula: 'B4-C4' }], ['Totale', { formula: 'SUM(B2:B4)' }, { formula: 'SUM(C2:C4)' }, { formula: 'B5-C5' }]]);
    sheet.getRow(1).eachCell(cell => { cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF167D6A' } }; });
    for (let row = 2; row <= 5; row++) for (let col = 2; col <= 4; col++) sheet.getCell(row, col).numFmt = '#,##0.00 "€"';
    sheet.getRow(5).font = { bold: true };
  }
  return book;
}
export async function exportWorkbook(book) {
  // Excel will recalculate full formulas on open; this app only caches its supported subset.
  book.calcProperties.fullCalcOnLoad = true;
  for (const sheet of book.worksheets) {
    const calc = calculatorFor(sheet);
    sheet.eachRow(row => row.eachCell(cell => {
      if (cell.type === ExcelJS.ValueType.Formula) {
        const result = calc(cell.address);
        const formula = cell.formula;
        cell.value = typeof result === 'string' && result.startsWith('#') ? { formula } : { formula, result };
      }
    }));
  }
  return new Uint8Array(await book.xlsx.writeBuffer());
}
