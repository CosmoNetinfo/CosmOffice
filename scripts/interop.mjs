import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, join, basename, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import mammoth from 'mammoth';
import { exportDocument } from '../src/documents.mjs';
import { newWorkbook, setCellInput, exportWorkbook, openWorkbook, calculatorFor } from '../src/workbooks.mjs';

const executable = process.env.COSMO_OFFICE_ENGINE || (process.platform === 'win32' ? 'C:/Program Files/LibreOffice/program/soffice.com' : 'libreoffice');
if (process.platform === 'win32') await access(executable);
const root = resolve(`test-results/interop-${Date.now()}`), input = join(root, 'input'), intermediate = join(root, 'intermediate'), output = join(root, 'output');
for (const dir of [input, intermediate, output]) await mkdir(dir, { recursive: true });
const profile = pathToFileURL(join(root, 'profile')).href;
async function convert(source, format, destination) {
  await new Promise((resolveRun, reject) => {
    const args = [`-env:UserInstallation=${profile}`, '--headless', '--nologo', '--nodefault', '--norestore', '--convert-to', format, '--outdir', destination, source];
    const child = spawn(executable, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let logs = '', timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill(); }, 60000);
    child.stdout.on('data', data => { logs += data.toString(); }); child.stderr.on('data', data => { logs += data.toString(); });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', async code => {
      clearTimeout(timer);
      if (code !== 0 || timedOut) { reject(new Error(`Conversione ${format} non riuscita: ${logs || code}`)); return; }
      const expected = join(destination, `${basename(source, extname(source))}.${format.split(':')[0]}`);
      try { await access(expected); resolveRun(); }
      catch { reject(new Error(`File convertito mancante (${expected}): ${logs}`)); }
    });
  });
}

const document = await exportDocument({ type: 'doc', content: [
  { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Verifica indipendente Cosmonet' }] },
  { type: 'paragraph', content: [{ type: 'text', text: 'Testo italiano: à è é ì ò ù — preservato.', marks: [{ type: 'bold' }, { type: 'textStyle', attrs: { fontFamily: 'Georgia', fontSize: '18pt', color: '#2865d8' } }] }] },
  { type: 'table', content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cella conservata' }] }] }, { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Seconda colonna' }] }] }] }] },
] }, 'Verifica interoperabilità');
await writeFile(join(input, 'documento.docx'), document);
const book = newWorkbook('budget'), sheet = book.addWorksheet('Compatibilità');
setCellInput(sheet.getCell('A1'), '001234'); setCellInput(sheet.getCell('A2'), '12345678901234567890');
sheet.getCell('B1').value = '#N/A'; sheet.getCell('B2').value = { error: '#N/A' };
setCellInput(sheet.getCell('C1'), '=SOMMA(1,5;2,5)'); setCellInput(sheet.getCell('C2'), '=IFERROR(B1;"errato")');
setCellInput(sheet.getCell('D1'), '=IFERROR(B2;"recuperato")'); setCellInput(sheet.getCell('D2'), "='Budget'!B5-'Budget'!C5");
sheet.getCell('E1').value = new Date('2026-11-21T00:00:00Z'); sheet.getCell('E1').numFmt = 'dd/mm/yyyy';
sheet.mergeCells('F1:G1'); sheet.getCell('F1').value = 'Celle unite';
await writeFile(join(input, 'cartella.xlsx'), await exportWorkbook(book));
await convert(join(input, 'documento.docx'), 'odt', intermediate);
await convert(join(intermediate, 'documento.odt'), 'docx', output);
await convert(join(input, 'cartella.xlsx'), 'ods', intermediate);
await convert(join(intermediate, 'cartella.ods'), 'xlsx', output);
await convert(join(input, 'documento.docx'), 'pdf', output);
const docx = new Uint8Array(await readFile(join(output, 'documento.docx')));
const text = (await mammoth.extractRawText({ buffer: Buffer.from(docx) })).value;
assert.match(text, /Verifica indipendente Cosmonet/); assert.match(text, /à è é ì ò ù/); assert.match(text, /Cella conservata/); assert.match(text, /Seconda colonna/);
const restored = await openWorkbook(new Uint8Array(await readFile(join(output, 'cartella.xlsx')))), result = restored.getWorksheet('Compatibilità');
assert.equal(result.getCell('A1').value, '001234'); assert.equal(result.getCell('A2').value, '12345678901234567890');
assert.equal(result.getCell('B1').value, '#N/A');
// LibreOffice may rewrite a constant error as an error-valued formula; its meaning must stay an error.
assert.deepEqual(calculatorFor(result).result('B2'), { value: '#N/D', error: true });
assert.equal(result.getCell('C1').result, 4); assert.equal(result.getCell('C2').result, '#N/A');
assert.equal(result.getCell('D1').result, 'recuperato'); assert.equal(result.getCell('D2').result, 470);
assert.equal(result.getCell('E1').value.toISOString(), '2026-11-21T00:00:00.000Z');
assert.equal(result.getCell('G1').value, 'Celle unite');
const server = await createServer(); await server.listen();
let browser;
try {
  const channel = process.env.COSMO_BROWSER || 'chrome';
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const page = await browser.newPage(); await page.goto('http://127.0.0.1:5173');
  const imported = await page.evaluate(async bytes => (await import('/src/import-docx.mjs')).importDocx(new Uint8Array(bytes)), Array.from(docx));
  assert.match(imported, /Cella conservata/); assert.match(imported, /Georgia/);
  const pdf = new Uint8Array(await readFile(join(output, 'documento.pdf')));
  await page.evaluate(async bytes => (await import('/src/pdf-engine.mjs')).validatePdf(new Uint8Array(bytes)), Array.from(pdf));
  const report = { result: 'PASS', engine: 'LibreOffice, profilo isolato e conversioni headless', scenarios: ['DOCX → ODT → DOCX: testo italiano, tabella e carattere riletti', 'XLSX → ODS → XLSX: codici, formule, testo e veri errori distinti', 'XLSX: date, riferimenti tra fogli e celle unite conservati', 'PDF prodotto da LibreOffice aperto da CosmoView'], limitations: 'Controllo su un corpus ristretto. Non è un collaudo di Microsoft Word/Excel né una prova di compatibilità totale.' };
  await writeFile('test-results/interop-report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} finally { await browser?.close(); await server.close(); }
