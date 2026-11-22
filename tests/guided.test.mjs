import test from 'node:test';
import assert from 'node:assert/strict';
import { validateGuided, guidedLines } from '../electron/guided-policy.mjs';
test('Prova guidata: otto sole scelte controllate, nessun campo o valore libero', () => {
  const marker = 'RISERVATO-C:/Users/Mario/contratto.docx';
  const clean = validateGuided({ install: 'Ok', word: 'Problema', excel: marker, filename: marker, content: marker });
  assert.deepEqual(Object.keys(clean), ['install', 'word', 'excel', 'charts', 'pdf', 'offline', 'spelling', 'report']);
  assert.equal(clean.install, 'Ok'); assert.equal(clean.word, 'Problema'); assert.equal(clean.excel, 'Non provato');
  assert.doesNotMatch(JSON.stringify(clean), /RISERVATO|Mario|contratto/);
  assert.deepEqual(guidedLines(clean), ['Installazione: Ok', 'Word: Problema', 'Excel: Non provato', 'Grafici: Non provato', 'PDF: Non provato', 'Offline: Non provato', 'Ortografia: Non provato', 'Segnalazione: Non provato']);
  assert.equal(guidedLines(null).length, 8);
});
