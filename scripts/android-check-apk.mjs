import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import JSZip from 'jszip';

const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
if (!sdk) throw new Error('SDK Android non disponibile.');
const apk = resolve(process.argv[2] || 'android/app/build/outputs/apk/release/app-release-unsigned.apk');
const aapt = join(sdk, 'build-tools/35.0.0', process.platform === 'win32' ? 'aapt.exe' : 'aapt');
const permissions = execFileSync(aapt, ['dump', 'permissions', apk], { encoding: 'utf8' });
assert.deepEqual([...permissions.matchAll(/uses-permission: name='([^']+)'/g)].map(match => match[1]).sort(), ['android.permission.INTERNET', 'android.permission.REQUEST_INSTALL_PACKAGES'], 'solo aggiornamenti e installazione confermata');
const info = execFileSync(aapt, ['dump', 'badging', apk], { encoding: 'utf8' });
assert.match(info, /package: name='it\.cosmonet\.cosmoffice'/); assert.match(info, /versionName='0\.2\.3'/);
assert.match(info, /versionCode='3'/, 'build Android con aggiornamenti');
assert.match(info, /sdkVersion:'29'/); assert.doesNotMatch(info, /application-debuggable/);
const zip = await JSZip.loadAsync(await readFile(apk));
for (const file of ['LICENSE', 'THIRD_PARTY_NOTICES.txt']) assert.equal(await zip.file(`assets/www/legal/${file}`).async('string'), await readFile(file, 'utf8'));
assert.ok(zip.file('assets/www/dictionaries/it_IT.words')); assert.ok(Object.keys(zip.files).some(name => /pdf\.worker.*\.mjs$/.test(name)));
assert.ok(Object.keys(zip.files).some(name => name.endsWith('.wasm')));
for (const pattern of [/assets\/www\/assets\/pdf-engine-[^/]+\.js$/, /assets\/www\/assets\/pdf\.worker[^/]+\.mjs$/]) {
  const entry = Object.keys(zip.files).find(name => pattern.test(name));
  assert.ok(entry, 'API e worker PDF incorporati');
  assert.match(await zip.file(entry).async('string'), /3\.51\.0/, 'API e worker includono core-js della distribuzione legacy');
  assert.match((await zip.file(entry).async('string')).slice(0, 2048), /Object\.defineProperty\(Promise,\s*["'`]withResolvers["'`]/, 'compatibilità Promise prima del motore, anche dopo minificazione');
}
assert.doesNotMatch(Object.keys(zip.files).join('\n'), /\.(?:jks|keystore|p12|pem)$/i);
const html = await zip.file('assets/www/index.html').async('string'); assert.doesNotMatch(html, /ws:\/\/127/);
await mkdir('test-results/android', { recursive: true });
const result = { result: 'PASS', version: '0.2.3', androidVersionCode: 3, minAndroid: 10, permissions: ['INTERNET', 'REQUEST_INSTALL_PACKAGES'], legalFilesIdentical: true, localDictionary: true, localPdfWorker: true, compatiblePdfApiAndWorker: true, promiseCompatibilityInPageAndWorker: true, privateKeyInApk: false, signed: false, installable: false };
await writeFile('test-results/android/apk-check.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
