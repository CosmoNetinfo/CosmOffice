import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createItalianChecker, validatePersonalWord } from '../src/spelling.mjs';
const source = await readFile('public/dictionaries/it_IT.words', 'utf8');
test('Italiano incluso: forme flesse, accenti, elisioni ed errori distinti', () => {
  const checker = createItalianChecker(source);
  for (const word of ['casa', 'italiano', 'ragazzi', 'andavano', 'perché', 'città', 'è', "l'amico", 'CosmOffice']) assert.equal(checker.correct(word), true, word);
  for (const word of ['zzqerrore', 'scrivvere', 'italgiano']) assert.equal(checker.correct(word), false, word);
  assert.deepEqual(checker.errors('città zzqerrore perché').map(x => [x.word, x.from, x.to]), [['zzqerrore', 6, 15]]);
  assert.deepEqual(checker.errors('https://esempio.invalid/zzqerrore persona@esempio.invalid ID1234'), []);
});
test('Dizionario personale separato, validato e rimuovibile senza alterare il lessico', () => {
  const personal = createItalianChecker(source, [validatePersonalWord('  ZZQERRORE  ')]);
  assert.equal(personal.correct('zzqerrore'), true);
  assert.equal(createItalianChecker(source).correct('zzqerrore'), false);
  assert.equal(createItalianChecker(source, ['casa']).correct('casa'), true);
  assert.equal(createItalianChecker(source).correct('casa'), true);
  for (const word of ['', 'due parole', '<script>', 'a'.repeat(81)]) assert.throws(() => validatePersonalWord(word));
});
