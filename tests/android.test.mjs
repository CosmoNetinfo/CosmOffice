import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { encodeAndroidBytes, decodeAndroidBytes, ANDROID_FILE_LIMIT } from '../src/android.mjs';
const compatibility = await readFile(new URL('../scripts/android-webview-compat.mjs', import.meta.url), 'utf8');

test('Compatibilità Android: Promise assente, risoluzione/rifiuto e sottoclassi', async () => {
  const context = vm.createContext({});
  vm.runInContext('delete Promise.withResolvers;', context);
  vm.runInContext(compatibility, context);
  const success = vm.runInContext('Promise.withResolvers()', context);
  success.resolve(42); success.reject('ignorato'); assert.equal(await success.promise, 42);
  const failure = vm.runInContext('Promise.withResolvers()', context);
  failure.reject('rifiuto previsto'); await assert.rejects(failure.promise, error => error === 'rifiuto previsto');
  assert.equal(vm.runInContext('class P extends Promise {} ; Promise.withResolvers.call(P).promise instanceof P', context), true);
  assert.equal(vm.runInContext("Object.getOwnPropertyDescriptor(Promise,'withResolvers').enumerable", context), false);
});

test('Compatibilità Android: API esistente preservata, installazione idempotente', () => {
  const context = vm.createContext({});
  vm.runInContext('Promise.withResolvers=function nativeMarker(){};const original=Promise.withResolvers;', context);
  vm.runInContext(compatibility + '\n' + compatibility, context);
  assert.equal(vm.runInContext('Promise.withResolvers===original', context), true);
});

test('Compatibilità Android: costruttori non validi rifiutati', () => {
  const context = vm.createContext({}); vm.runInContext('delete Promise.withResolvers;\n' + compatibility, context);
  for (const target of ['{}', '(()=>{})', '(class Invalid {})', '(class Invalid {constructor(e){e(1,2);}})']) {
    assert.throws(() => vm.runInContext('Promise.withResolvers.call('+target+')', context), { name: 'TypeError' });
  }
});

test('Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati', () => {
  const bytes = Uint8Array.from({ length: 65537 }, (_, i) => i % 256);
  assert.deepEqual(decodeAndroidBytes(encodeAndroidBytes(bytes)), bytes);
  assert.deepEqual(decodeAndroidBytes(encodeAndroidBytes(new Uint8Array())), new Uint8Array());
  assert.throws(() => encodeAndroidBytes(new Uint8Array(ANDROID_FILE_LIMIT + 1)), /10 MB/);
  assert.throws(() => decodeAndroidBytes('!invalido!'));
});
test('Android: soli permessi di rete aggiornamenti e installazione confermata, nessuno storage esteso', async () => {
  const manifest = await readFile('android/app/src/main/AndroidManifest.xml', 'utf8');
  assert.deepEqual([...manifest.matchAll(/<uses-permission android:name="([^"]+)"/g)].map(match => match[1]).sort(), ['android.permission.INTERNET', 'android.permission.REQUEST_INSTALL_PACKAGES']);
  assert.match(manifest, /allowBackup="false"/);
  assert.match(manifest, /usesCleartextTraffic="false"/);
});
