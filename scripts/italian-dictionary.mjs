// Trasformazione riproducibile, senza rete. Il sorgente è distribuito con il dizionario.
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
const root = new URL('../public/dictionaries/', import.meta.url);
const source = gunzipSync(await readFile(new URL('morph-it_048_utf8.txt.gz', root))).toString('utf8');
const words = [...new Set(source.split(/\r?\n/).map(line => line.split('\t')[0].normalize('NFC').toLocaleLowerCase('it-IT')).filter(word => /^[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*$/u.test(word)))].sort();
await writeFile(new URL('it_IT.words', root), words.join('\n') + '\n');
console.log(`Dizionario italiano: ${words.length} forme distinte.`);
