// The private key stays outside the repository and is never included in CI artifacts.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const keyDir = process.env.COSMO_ANDROID_KEY_DIR;
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
if (!keyDir || !sdk || !process.env.JAVA_HOME) throw new Error('Imposta COSMO_ANDROID_KEY_DIR (fuori dal repository), ANDROID_HOME e JAVA_HOME.');
const root = resolve('.'), keyRoot = resolve(keyDir);
assert.ok(keyRoot.toLowerCase() !== root.toLowerCase() && !keyRoot.toLowerCase().startsWith(root.toLowerCase() + '\\') && !keyRoot.startsWith(root + '/'), 'La chiave deve stare fuori dal repository.');
const config = JSON.parse(await readFile(join(keyRoot, 'config.json'), 'utf8'));
const password = (await readFile(join(keyRoot, 'password.txt'), 'utf8')).trim();
const input = resolve(process.argv[2] || 'android/app/build/outputs/apk/release/app-release-unsigned.apk');
const sourceHash = createHash('sha256').update(await readFile(input)).digest('hex');
const output = resolve(`release/android/CosmOffice-0.2.3-android-${sourceHash.slice(0, 12)}.apk`);
const tools = join(sdk, 'build-tools/35.0.0');
await mkdir(resolve('release/android'), { recursive: true });
execFileSync(join(tools, process.platform === 'win32' ? 'zipalign.exe' : 'zipalign'), ['-P', '16', '-f', '4', input, output], { windowsHide: true });
const java = join(process.env.JAVA_HOME, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
const signer = ['-jar', join(tools, 'lib/apksigner.jar')];
// Passwords are passed through the child environment, never command arguments or output.
execFileSync(java, [...signer, 'sign', '--ks', join(keyRoot, 'cosmoffice-android.p12'), '--ks-key-alias', 'cosmoffice-android', '--ks-pass', 'env:COSMO_SIGN_PASSWORD', '--key-pass', 'env:COSMO_SIGN_PASSWORD', output], {
  windowsHide: true, stdio: 'pipe', env: { ...process.env, COSMO_SIGN_PASSWORD: password },
});
const verification = execFileSync(java, [...signer, 'verify', '--verbose', '--print-certs', output], { encoding: 'utf8', windowsHide: true });
const certificate = verification.match(/Signer #1 certificate SHA-256 digest: ([a-f0-9]+)/i)?.[1].toLowerCase();
assert.equal(certificate, '32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e', 'Certificato diverso dalla chiave iniziale: non distribuire.');
assert.equal(config.sha256, certificate, 'Configurazione della firma incoerente.');
const sha256 = createHash('sha256').update(await readFile(output)).digest('hex');
await writeFile(output + '.sha256', `${sha256}  ${output.split(/[\\/]/).pop()}\n`);
const result = { result: 'PASS', version: '0.2.3', signed: true, certificateSha256: certificate, apkSha256: sha256, unsignedSha256: sourceHash, privateKeyUploaded: false, physicalDeviceTested: false };
await mkdir('test-results/android', { recursive: true });
await writeFile('test-results/android/signing.json', JSON.stringify(result, null, 2));
await writeFile('test-results/android/signing-verification.log', verification);
console.log(JSON.stringify(result, null, 2));
console.log(`APK firmato: ${output.split(/[\\/]/).pop()}`);
