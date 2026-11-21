import ExcelJS from 'exceljs';
import { createCalculator } from './formulas.mjs';

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
  return createCalculator(address => rawValue(sheet.getCell(address)));
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
