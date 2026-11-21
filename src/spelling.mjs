export const personalDictionaryKey = 'cosmoffice.italian-personal.v1';
export const normalizeWord = word => word.normalize('NFC').replaceAll('’', "'").toLocaleLowerCase('it-IT');
export function validatePersonalWord(value) {
  const word = normalizeWord(String(value).trim());
  if (word.length > 80 || !/^[\p{L}\p{M}]+(?:'[\p{L}\p{M}]+)*$/u.test(word)) throw new Error('Inserisci una sola parola, composta da lettere ed eventuali apostrofi (massimo 80 caratteri).');
  return word;
}
export function createItalianChecker(text, personal = []) {
  const words = new Set(text.split(/\r?\n/).filter(Boolean).map(normalizeWord));
  const known = new Set(['cosmonet', 'cosmoffice', 'cosmowrite', 'cosmogrid', 'cosmoview', ...personal].map(normalizeWord));
  const correct = value => {
    const word = normalizeWord(value);
    if (words.has(word) || known.has(word)) return true;
    const match = /^(?:l|un|d|all|dall|dell|nell|sull|coll|quest|quell|sant)'(.+)$/u.exec(word);
    return !!match && (words.has(match[1]) || known.has(match[1]));
  };
  return { correct, errors(value) {
    // URL, indirizzi e identificativi alfanumerici non sono prosa italiana.
    const omitted = [...value.matchAll(/(?:https?:\/\/|www\.)\S+|[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}]+|[\p{L}\p{N}_]*\d[\p{L}\p{N}_]*/gu)].map(m => [m.index, m.index + m[0].length]);
    return [...value.matchAll(/[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu)].filter(m => !omitted.some(([a, b]) => m.index >= a && m.index < b) && !correct(m[0])).map(m => ({ from: m.index, to: m.index + m[0].length, word: m[0] }));
  } };
}
