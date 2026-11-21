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
