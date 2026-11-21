import test from 'node:test';
import assert from 'node:assert/strict';
import { createCalculator, columnName, parseAddress } from '../src/formulas.mjs';

const calc = data => createCalculator(address => data[address]);
test('references, arithmetic, precedence and percentages', () => {
  const c = calc({ A1: 10, A2: 20, B1: '=SUM(A1:A2)*2', B2: '=2^3^2', B3: '=-2^2', B4: '=A1*20%' });
  assert.equal(c('B1'), 60); assert.equal(c('B2'), 512); assert.equal(c('B3'), -4); assert.equal(c('B4'), 2);
});
test('Italian aliases, absolute references, text and lazy IF', () => {
  const c = calc({ A1: 10, A2: 20, B1: '=SOMMA($A$1:A2)', B2: '=SE(A1>0;"ok";1/0)', B3: '=MEDIA(A1:A2)', B4: '=ARROTONDA(-1.25;1)' });
  assert.equal(c('B1'), 30); assert.equal(c('B2'), 'ok'); assert.equal(c('B3'), 15); assert.equal(c('B4'), -1.3);
});
test('cycles, division by zero and unknown functions are visible and propagated', () => {
  const c = calc({ A1: '=B1', B1: '=A1', A2: '=1/0', B2: '=A2+1', C1: '=UNSUPPORTED(A1)', C2: '=SUM(A2:A3)' });
  assert.equal(c('A1'), '#CICLO!'); assert.equal(c('A2'), '#DIV/0!'); assert.equal(c('B2'), '#DIV/0!');
  assert.equal(c('C1'), '#NOME?'); assert.equal(c('C2'), '#DIV/0!');
});
test('untrusted formulas cannot evaluate JavaScript, links or unlimited ranges', () => {
  const c = calc({ A1: '=globalThis.process.exit()', A2: '=SUM(A1:XFD1048576)', A3: '=1;2', A4: '=HYPERLINK("https://example.com")' });
  assert.match(c('A1'), /^#/); assert.equal(c('A2'), '#LIMITE!'); assert.match(c('A3'), /^#/); assert.equal(c('A4'), '#NOME?');
});
test('Excel address limits and column naming', () => {
  assert.equal(columnName(27), 'AA'); assert.equal(columnName(16384), 'XFD');
  assert.deepEqual(parseAddress('$AA$12'), { col: 27, row: 12 });
  assert.throws(() => parseAddress('A0')); assert.throws(() => parseAddress('XFE1'));
});
test('conditional sums, lookups, text, dates and error handling', () => {
  const c = calc({ A1: 'A', A2: 'B', A3: 'A', B1: 10, B2: 20, B3: 30,
    D1: '=SUMIF(A1:A3;"A";B1:B3)', D2: '=COUNTIF(B1:B3;">15")', D3: '=VLOOKUP("B";A1:B3;2;FALSE)',
    D4: '=SE.ERRORE(1/0;"recuperato")', D5: '=SINISTRA("Cosmonet";5)&" Office"', D6: '=IF("a"="A";1;0)', D7: '=YEAR(DATE(2026;11;21))', D8: '=SUMPRODUCT(B1:B3;B1:B3)' });
  assert.equal(c('D1'), 40); assert.equal(c('D2'), 2); assert.equal(c('D3'), 20); assert.equal(c('D4'), 'recuperato');
  assert.equal(c('D5'), 'Cosmo Office'); assert.equal(c('D6'), 1); assert.equal(c('D7'), 2026); assert.equal(c('D8'), 1400);
});
test('quoted sheet names, absolute references and cycles across sheets', () => {
  const data = { Main: { A1: "='Budget 2026'!$B$1+SUM('Budget 2026'!B2:B3)", A2: '=Other!A2' }, 'Budget 2026': { B1: 10, B2: 20, B3: 30 }, Other: { A2: '=Main!A2' } };
  const c = createCalculator((address, sheet) => { if (!data[sheet]) throw new Error('#RIF!'); return data[sheet][address]; }, 'Main');
  assert.equal(c('A1'), 60); assert.equal(c('A2'), '#CICLO!');
});
test('Italian decimal commas and separators coexist with invariant XLSX formula syntax', () => {
  const c = calc({ A1: '=SOMMA(1,5;2,5)', A2: '=ARROTONDA(1,25;1)', A3: '=1,5+2,5', A4: '=SUM(1,5)', A5: '=IF(1=1,"a;b",0)' });
  assert.equal(c('A1'), 4); assert.equal(c('A2'), 1.3); assert.equal(c('A3'), 4); assert.equal(c('A4'), 6); assert.equal(c('A5'), 'a;b');
});
test('literal text resembling errors stays text while actual formula errors propagate', () => {
  const c = calc({ A1: '#N/A', A2: '#TAG', A3: '=1/0', A4: { error: '#N/A' }, B1: '=A1&" conservato"', B2: '=IFERROR("#DIV/0!";"errato")', B3: '=ISERROR(A3)', B4: '=ISERROR(A1)', C1: '=SUM(A1:A3)', C2: '=COUNTIF(A1:A2;"#TAG")', C3: '=A4', C4: '=IFERROR(A4;"recuperato")' });
  assert.equal(c('B1'), '#N/A conservato'); assert.equal(c('B2'), '#DIV/0!');
  assert.equal(c('B3'), true); assert.equal(c('B4'), false); assert.equal(c('C1'), '#DIV/0!');
  assert.equal(c('C2'), 1); assert.equal(c('C3'), '#N/D'); assert.equal(c('C4'), 'recuperato');
  assert.deepEqual(c.result('A1'), { value: '#N/A', error: false });
  assert.deepEqual(c.result('A3'), { value: '#DIV/0!', error: true });
});
test('empty strings, blank cells and boolean predicates retain their separate types', () => {
  const c = calc({ A1: '', A2: null, B1: '=ISTEXT("")', B2: '=ISBLANK("")', B3: '=ISBLANK(A2)', B4: '=ISERROR(#N/A)', C1: '=A2&"ok"', C2: '=ISNUMBER(1/0)' });
  assert.equal(c('B1'), true); assert.equal(c('B2'), false); assert.equal(c('B3'), true);
  assert.equal(c('B4'), true); assert.equal(c('C1'), 'ok'); assert.equal(c('C2'), false);
});
