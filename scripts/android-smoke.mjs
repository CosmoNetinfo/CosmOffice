import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import { openWorkbook } from '../src/workbooks.mjs';

const adb = process.env.ADB || 'adb';
const run = (...args) => execFileSync(adb, args, { encoding: 'utf8', timeout: 90000, windowsHide: true });
const serial = run('get-serialno').trim();
assert.match(serial, /^emulator-\d+$/, 'test consentito solo su emulatore, mai su telefoni personali');
assert.equal(run('shell', 'getprop', 'ro.kernel.qemu').trim(), '1');
await mkdir('test-results/android/emulator', { recursive: true });
run('shell', 'settings', 'put', 'global', 'airplane_mode_on', '1');
run('shell', 'svc', 'wifi', 'disable'); run('shell', 'svc', 'data', 'disable');
run('shell', 'mkdir', '-p', '/sdcard/Download');
// adbd's sync service and an Android shell have different storage contexts.
// Stage outside shared storage, then copy as shell; do not grant the app storage permissions.
run('shell', 'mkdir', '-p', '/data/local/tmp/cosmoffice-smoke');
const samples = [['01-testo-stili.docx', 'android-write.docx'], ['01-formule.xlsx', 'android-grid.xlsx'], ['01-testo.pdf', 'android-view.pdf']];
for (const [name, target] of samples) {
  const staging = `/data/local/tmp/cosmoffice-smoke/${target}`, destination = `/sdcard/Download/${target}`;
  run('push', `tests/fixtures/${name}`, staging);
  try { run('shell', 'cp', staging, destination); }
  catch (error) {
    const details = ['id', 'ls -ld /sdcard /storage/emulated/0 /sdcard/Download', 'cmd user is-user-unlocked 0']
      .map(command => spawnSync(adb, ['shell', command], { encoding: 'utf8', windowsHide: true }));
    await writeFile('test-results/android/storage-failure.log', details.map(result => (result.stdout || '') + (result.stderr || '')).join('\n'));
    throw error;
  }
  const expected = createHash('sha256').update(await readFile(`tests/fixtures/${name}`)).digest('hex');
  assert.equal(run('shell', 'sha256sum', destination).trim().split(/\s+/)[0], expected, 'campione non preparato correttamente nel filesystem reale');
}
run('install', '-r', 'android/app/build/outputs/apk/debug/app-debug.apk');
run('install', '-r', 'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk');
const test = spawnSync(adb, ['shell', 'am', 'instrument', '-w', '-r', 'it.cosmonet.cosmoffice.test/it.cosmonet.cosmoffice.SmokeInstrumentation'], { encoding: 'utf8', timeout: 12 * 60 * 1000, maxBuffer: 5 * 1024 * 1024, windowsHide: true });
const output = (test.stdout || '') + (test.stderr || '');
await writeFile('test-results/android/instrumentation.log', output); console.log(output);
for (const name of ['home', 'write', 'grid', 'view', 'informazioni', 'impostazioni-scure', 'segnala-problema', 'errore']) {
  const image = spawnSync(adb, ['exec-out', 'run-as', 'it.cosmonet.cosmoffice', 'cat', `/sdcard/Android/data/it.cosmonet.cosmoffice/files/smoke/${name}.png`], { windowsHide: true, maxBuffer: 10 * 1024 * 1024 });
  if (image.status === 0 && image.stdout.length > 8 && image.stdout.subarray(1, 4).toString() === 'PNG') await writeFile(`test-results/android/emulator/${name}.png`, image.stdout);
}
assert.equal(test.status, 0, 'comando instrumentation non riuscito');
assert.match(output, /INSTRUMENTATION_RESULT: cosmoffice=PASS/); assert.doesNotMatch(output, /INSTRUMENTATION_STATUS_CODE: -2|INSTRUMENTATION_FAILED|cosmoffice=FAIL/);
for (const name of ['android-write-salvato.docx', 'android-grid-salvato.xlsx', 'android-view-salvato.pdf', 'android-note-salvate.md']) run('pull', `/sdcard/Download/${name}`, `test-results/android/emulator/${name}`);
const docx = await readFile('test-results/android/emulator/android-write-salvato.docx');
assert.match((await mammoth.extractRawText({ buffer: docx })).value, /Android verificato\./);
const workbook = await openWorkbook(new Uint8Array(await readFile('test-results/android/emulator/android-grid-salvato.xlsx')));
assert.equal(workbook.worksheets[0].getCell('B2').value, 701);
const pdf = await PDFDocument.load(await readFile('test-results/android/emulator/android-view-salvato.pdf'));
assert.equal(pdf.getPages()[0].getRotation().angle, 90);
const independent = execFileSync('pdfinfo', ['-f', '1', '-l', '1', 'test-results/android/emulator/android-view-salvato.pdf'], { encoding: 'utf8' });
assert.match(independent, /Page(?:\s+1)?\s+rot:\s+90/);
assert.equal(await readFile('test-results/android/emulator/android-note-salvate.md', 'utf8'), '# Android verificato\n\nTesto **originale** per le prove.\n');
for (const [name, target] of samples) {
  run('pull', `/sdcard/Download/${target}`, `test-results/android/emulator/originale-${target}`);
  const hash = data => createHash('sha256').update(data).digest('hex');
  assert.equal(hash(await readFile(`tests/fixtures/${name}`)), hash(await readFile(`test-results/android/emulator/originale-${target}`)), 'originale riscritto');
}
const result = { result: 'PASS', emulator: true, physicalDevice: false, tests: 8, realAndroidPicker: true, realClipboard: true, exportedFilesCheckedIndependently: true, originalFilesUnchanged: true, guestNetworkDisabled: true };
await writeFile('test-results/android/emulator-report.json', JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
