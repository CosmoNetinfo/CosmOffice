import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { encodeAndroidBytes, decodeAndroidBytes, ANDROID_FILE_LIMIT } from '../src/android.mjs';

test('Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati', () => {
  const bytes = Uint8Array.from({ length: 65537 }, (_, i) => i % 256);
  assert.deepEqual(decodeAndroidBytes(encodeAndroidBytes(bytes)), bytes);
  assert.deepEqual(decodeAndroidBytes(encodeAndroidBytes(new Uint8Array())), new Uint8Array());
  assert.throws(() => encodeAndroidBytes(new Uint8Array(ANDROID_FILE_LIMIT + 1)), /10 MB/);
  assert.throws(() => decodeAndroidBytes('!invalido!'));
});
test('Android: nessun permesso Internet, storage esteso o installazione pacchetti', async () => {
  const manifest = await readFile('android/app/src/main/AndroidManifest.xml', 'utf8');
  assert.doesNotMatch(manifest, /<uses-permission\b/);
  assert.match(manifest, /allowBackup="false"/);
  assert.match(manifest, /usesCleartextTraffic="false"/);
});
