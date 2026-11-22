import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import JSZip from 'jszip';

const root = resolve('test-results/openxml'); await mkdir(root, { recursive: true });
const corpus = JSON.parse(await readFile('tests/fixtures/manifest.json', 'utf8')).files.filter(file => file.kind === 'write' || file.kind === 'grid').map(file => `test-results/corpus/${file.name}`);
const files = [...corpus, 'test-results/openxml/smoke.docx', 'test-results/openxml/smoke.xlsx', 'test-results/grafici-ui.xlsx'].map(file => resolve(file));
for (const file of files) await access(file).catch(() => { throw new Error(`Esportazione mancante: ${file}. Esegui prima npm run test:browser.`); });
const hashes = await Promise.all(files.map(async file => createHash('sha256').update(await readFile(file)).digest('hex')));
const env = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_NOLOGO: '1', DOTNET_CLI_HOME: resolve('test-results/dotnet-home') };
async function run(args) {
  return new Promise((done, reject) => {
    const child = spawn('dotnet', args, { env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => child.kill(), 180000);
    child.stdout.on('data', data => process.stdout.write(data)); child.stderr.on('data', data => process.stderr.write(data));
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => { clearTimeout(timer); done(code); });
  });
}
assert.equal(await run(['build', 'scripts/openxml-validator/OpenXmlCheck.csproj', '--configuration', 'Release', '-p:RestoreLockedMode=true']), 0, 'compilazione validatore Microsoft');
const binary = resolve('scripts/openxml-validator/bin/Release/net10.0/OpenXmlCheck.dll');
const manifest = resolve(root, 'exports.json'), report = resolve(root, 'report.json');
await writeFile(manifest, JSON.stringify(files));
assert.equal(await run([binary, manifest, report]), 0, `Gli esportati non superano Open XML SDK: ${report}`);
for (const [index, file] of files.entries()) assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'), hashes[index], 'il validatore deve leggere senza modificare');

// Due controlli negativi: il validatore deve fallire, non soltanto avviarsi.
const negative = resolve(root, 'negative'); await mkdir(negative, { recursive: true });
const word = await JSZip.loadAsync(await readFile('test-results/openxml/smoke.docx'));
const document = await word.file('word/document.xml').async('string');
assert.ok(document.includes('</w:body>'));
word.file('word/document.xml', document.replace('</w:body>', '<w:cosmoInvalido/></w:body>'));
const badWord = resolve(negative, 'schema-errato.docx'); await writeFile(badWord, await word.generateAsync({ type: 'uint8array' }));
const excel = await JSZip.loadAsync(await readFile('test-results/grafici-ui.xlsx'));
const sheet = await excel.file('xl/worksheets/sheet1.xml').async('string');
assert.ok(sheet.includes('orientation="landscape"'));
excel.file('xl/worksheets/sheet1.xml', sheet.replace('orientation="landscape"', 'orientation="diagonale"'));
const badExcel = resolve(negative, 'schema-errato.xlsx'); await writeFile(badExcel, await excel.generateAsync({ type: 'uint8array' }));
const negativeManifest = resolve(negative, 'files.json'), negativeReport = resolve(negative, 'report.json');
await writeFile(negativeManifest, JSON.stringify([badWord, badExcel]));
assert.equal(await run([binary, negativeManifest, negativeReport]), 1, 'il validatore deve respingere gli errori di schema');
const rejected = JSON.parse(await readFile(negativeReport, 'utf8'));
assert.ok(rejected.files.length === 2 && rejected.files.every(file => file.errors.length > 0));
console.log(`PASS Open XML SDK: ${files.length} esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.`);

// Eccezione storica autorizzata: questa copia non è rigenerata e deve restare identica.
const legacySource = await readFile('tests/fixtures/legacy/grafici-categorie-v1.xlsx');
const legacyCopyPath = resolve('test-results/openxml/legacy-copy.xlsx');
assert.deepEqual(await readFile(legacyCopyPath), legacySource);
assert.equal(createHash('sha256').update(legacySource).digest('hex'), '32f78da3b5c628b67671d34a7f578ab3366ce585658e85f7a4c6934581fcfc0a');
const legacyManifest = resolve(root, 'legacy-files.json'), legacyReport = resolve(root, 'legacy-report.json');
await writeFile(legacyManifest, JSON.stringify([legacyCopyPath]));
assert.equal(await run([binary, legacyManifest, legacyReport]), 1, 'difetto storico atteso e documentato, non errore dei nuovi esportati');
const legacyErrors = JSON.parse(await readFile(legacyReport, 'utf8')).files[0].errors;
assert.ok(legacyErrors.some(error => error.id === 'AperturaFallita' && error.description.includes('application/vnd.openxmlformats-officedocument.drawingml.drawing+xml')));
console.log('ECCEZIONE STORICA VERIFICATA: copia v1 identica, errore MIME del disegno conservato e segnalato nel report separato. Nessuna eccezione per i nuovi esportati.');
