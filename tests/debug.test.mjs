import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { safeEvent, safeContext } from '../electron/debug-policy.mjs';

const secret = 'NOME-RICONOSCIBILE-CONTENUTO-RISERVATO';
test('Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi', () => {
  const error = safeEvent({ app: secret, kind: secret, name: 'TypeError', message: secret,
    stack: `TypeError: ${secret}\n at ${secret} (C:\\Users\\${secret}\\assets\\${secret}.js:42:8)\n at file:///home/${secret}/documento.docx:3:7` });
  assert.doesNotMatch(JSON.stringify(error), new RegExp(secret));
  assert.equal(error.name, 'TypeError');
  assert.deepEqual(error.trace, ['  in <cartella>/<modulo>:42:8']);
  assert.deepEqual(safeEvent({ trace: [secret, '  in <cartella>/<modulo>:42:8'] }).trace, ['  in <cartella>/<modulo>:42:8']);
});
test('Diagnostica: il contesto ammette solo valori controllati, nessun campo libero', () => {
  const context = safeContext({ kind: 'grid', type: 'XLSX', size: 2049, theme: secret, scale: secret, filename: secret, content: secret, user: secret });
  assert.equal(context.app, 'CosmoGrid'); assert.equal(context.size, 3);
  assert.doesNotMatch(JSON.stringify(context), new RegExp(secret));
  assert.doesNotThrow(() => safeContext(null)); assert.doesNotThrow(() => safeEvent(null));
});
test('Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento', async () => {
  const root = resolve(`test-results/debug-unit-${Date.now()}`); await mkdir(root, { recursive: true });
  const app = { getPath: () => root, getVersion: () => '0.2.2', getLocale: () => 'it' };
  const debug = createRequire(import.meta.url)('../electron/debug.cjs');
  debug.initialize(app); debug.clear(); debug.setContext({ kind: 'write', type: 'DOCX', size: 4096 });
  for (let n = 0; n < 55; n++) debug.record('rejection', { name: 'QuotaExceededError', message: secret,
    stack: `Error: ${secret}\n at C:/Users/${secret}/assets/prova.js:999999:999999\n at C:/Users/${secret}/assets/prova.js:999999:999999\n at C:/Users/${secret}/assets/prova.js:999999:999999` });
  const bytes = await readFile(resolve(root, 'registro-errori.json'), 'utf8');
  assert.equal(JSON.parse(bytes).length, 50); assert.doesNotMatch(bytes, new RegExp(secret));
  let report = debug.report(app, 0); assert.match(report, /50\/50/); assert.doesNotMatch(report, new RegExp(secret));
  assert.ok(Buffer.byteLength(report, 'utf8') <= 6144, '50 eventi stanno in pochi KB');
  console.log(`Rapporto con 50 eventi e ultima traccia: ${Buffer.byteLength(report, 'utf8')} byte UTF-8 (limite 6144).`);
  debug.initialize(app); report = debug.report(app, 0); assert.match(report, /50\/50/);
  debug.clear(); assert.deepEqual(JSON.parse(await readFile(resolve(root, 'registro-errori.json'), 'utf8')), []);
  assert.match(debug.report(app, 0), /Nessun evento registrato/);
});
test('Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito', async () => {
  const root = resolve(`test-results/debug-non-scrivibile-${Date.now()}`);
  // Una directory al posto del file provoca lo stesso errore su Windows e Linux.
  await mkdir(resolve(root, 'registro-errori.json'), { recursive: true });
  const app = { getPath: () => root, getVersion: () => '0.2.2', getLocale: () => 'it' };
  const debug = createRequire(import.meta.url)('../electron/debug.cjs'); debug.initialize(app);
  debug.record('main', new Error(secret));
  assert.match(debug.report(app, 0), /scrittura non disponibile; eventi solo in memoria/);
  assert.equal(debug.clear(), false);
  assert.match(debug.report(app, 0), /Nessun evento registrato/);
});
