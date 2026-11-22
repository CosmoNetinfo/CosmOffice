import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';
import { PDFDocument } from 'pdf-lib';
import { openWorkbook } from '../src/workbooks.mjs';
import { chartModels, chartData } from '../src/charts.mjs';
const C = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
const A = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const root = resolve(`test-results/charts-interop-${Date.now()}`), intermediate = join(root, 'ods'), output = join(root, 'xlsx');
await mkdir(intermediate, { recursive: true }); await mkdir(output, { recursive: true });
const executable = process.env.COSMO_OFFICE_ENGINE || (process.platform === 'win32' ? 'C:/Program Files/LibreOffice/program/soffice.com' : 'libreoffice');
async function convert(source, format, destination) {
  const logs = await new Promise((resolveRun, reject) => {
    const child = spawn(executable, [`-env:UserInstallation=${pathToFileURL(join(root, 'profile')).href}`, '--headless', '--nologo', '--nodefault', '--norestore', '--convert-to', format, '--outdir', destination, source], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let logs = '', timedOut = false; const timer = setTimeout(() => { timedOut = true; child.kill(); }, 60000);
    child.stdout.on('data', data => { logs += data; }); child.stderr.on('data', data => { logs += data; });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => { clearTimeout(timer); if (code || timedOut) reject(new Error(`LibreOffice ${format}: ${logs || code}`)); else resolveRun(logs); });
  }); console.log(logs.trim());
}
const input = resolve('test-results/grafici-ui.xlsx');
const original = await openWorkbook(new Uint8Array(await readFile(input)));
const sourceZip = await JSZip.loadAsync(await readFile(input));
assert.doesNotMatch(await sourceZip.file('xl/workbook.xml').async('string'), /state="(?:hidden|veryHidden)"|_CosmoGrafici/, 'nuovo XLSX senza fogli nascosti');
assert.equal(chartModels(original).length, 3, 'occorre il file realmente creato dal test UI');
await convert(input, 'ods', intermediate);
await convert(join(intermediate, 'grafici-ui.ods'), 'xlsx', output);
await convert(input, 'pdf', output);
const printed = await PDFDocument.load(await readFile(join(output, 'grafici-ui.pdf')));
assert.equal(printed.getPageCount(), 1, 'CHART-002: tutti i grafici devono stare su una sola pagina');
const printedPage = printed.getPage(0);
assert.ok(printedPage.getWidth() > printedPage.getHeight(), 'pagina di stampa orizzontale');
const roundtrip = new Uint8Array(await readFile(join(output, 'grafici-ui.xlsx')));
const zip = await JSZip.loadAsync(roundtrip);
assert.doesNotMatch(await zip.file('xl/workbook.xml').async('string'), /state="(?:hidden|veryHidden)"|_CosmoGrafici/, 'nessun foglio nascosto dopo LibreOffice');
const parts = [];
for (const name of Object.keys(zip.files).filter(name => /^xl\/charts\/.*\.xml$/.test(name))) {
  const doc = new DOMParser().parseFromString(await zip.file(name).async('string'), 'application/xml');
  if (doc.documentElement.namespaceURI === C && doc.documentElement.localName === 'chartSpace') parts.push(name);
}
assert.equal(parts.length, 3, 'LibreOffice deve aver conservato tre grafici nativi');
const list = (node, namespace, tag) => Array.from(node.getElementsByTagNameNS(namespace, tag));
const seen = [];
for (const part of parts) {
  const doc = new DOMParser().parseFromString(await zip.file(part).async('string'), 'application/xml');
  const type = ['bar', 'line', 'pie'].find(type => list(doc, C, `${type === 'bar' ? 'bar' : type === 'line' ? 'line' : 'pie'}Chart`).length);
  assert.ok(type, `Tipo grafico sconosciuto: ${part}`);
  const model = chartModels(original).find(model => model.type === type), expected = chartData(original, model);
  const series = list(doc, C, 'ser'); assert.equal(series.length, expected.series.length);
  for (const [index, serie] of series.entries()) {
    const val = list(serie, C, 'val')[0], cat = list(serie, C, 'cat')[0];
    assert.deepEqual(list(val, C, 'v').map(node => Number(node.textContent)), expected.series[index].values, `${type}: valori identici dopo LibreOffice`);
    assert.deepEqual(list(cat, C, 'v').map(node => node.textContent), expected.labels, `${type}: categorie identiche dopo LibreOffice`);
    const tx = list(serie, C, 'tx')[0]; assert.equal(list(tx, C, 'v')[0]?.textContent, expected.series[index].name);
  }
  const title = list(doc, C, 'title')[0]; assert.equal(list(title, A, 't').map(node => node.textContent).join(''), model.title);
  const legend = list(doc, C, 'legend')[0];
  if (model.legend === 'none') assert.equal(legend, undefined);
  else assert.equal(list(legend, C, 'legendPos')[0]?.getAttribute('val'), model.legend === 'bottom' ? 'b' : 'r');
  if (type !== 'pie') for (const [tag, expected] of [['catAx', model.axisX], ['valAx', model.axisY]]) {
    const axisTitle = list(list(doc, C, tag)[0], C, 'title')[0];
    assert.equal(axisTitle ? list(axisTitle, A, 't').map(node => node.textContent).join('') : '', expected);
  }
  seen.push({ type, values: expected.series.map(series => series.values), labels: expected.labels, result: 'PASS' });
}
assert.deepEqual(seen.map(item => item.type).sort(), ['bar', 'line', 'pie']);
const external = await openWorkbook(roundtrip);
assert.equal(external.cosmoUnsupportedCharts, true, 'i grafici riscritti da LibreOffice devono attivare la protezione');
const report = { result: 'PASS', engine: 'LibreOffice: XLSX → ODS → XLSX e PDF', charts: seen, print: { pages: printed.getPageCount(), landscape: printedPage.getWidth() > printedPage.getHeight() }, output: root, limits: 'Microsoft Excel non eseguito. I file riscritti da LibreOffice vengono aperti in sola lettura da CosmOffice per conservarne i grafici. Adattamento a una pagina anche in altezza: i fogli grandi si riducono in stampa.' };
await writeFile('test-results/charts-interop-report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
