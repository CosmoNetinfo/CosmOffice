// Schermate dell'interfaccia reale, con soli esempi creati qui e profilo browser temporaneo.
import { chromium } from 'playwright';
import { createServer } from 'vite';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir, userInfo } from 'node:os';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { exportDocument } from '../src/documents.mjs';
import { newWorkbook, exportWorkbook } from '../src/workbooks.mjs';
import { newChart } from '../src/charts.mjs';

await mkdir('docs/images', { recursive: true });
await mkdir('test-results/screenshots', { recursive: true });
const { version } = JSON.parse(await readFile('package.json', 'utf8'));
const illustration = await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="440" height="100" viewBox="0 0 440 100"><rect width="440" height="100" rx="10" fill="#edf5fb"/><circle cx="350" cy="35" r="21" fill="#e9aa67"/><path d="M0 86L94 36L175 84L260 43L370 100H0Z" fill="#86b9c4"/><path d="M95 100L220 53L330 100Z" fill="#367e93"/></svg>')).png().toBuffer();
const paragraph = text => ({ type: 'paragraph', content: [{ type: 'text', text }] });
const cell = text => ({ type: 'tableCell', content: [paragraph(text)] });
const docx = await exportDocument({ type: 'doc', content: [
  { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Una biblioteca di quartiere' }] },
  paragraph('Un piccolo spazio per leggere, incontrarsi e condividere idee. Questo documento è un esempio originale creato per le schermate di CosmOffice.'),
  { type: 'image', attrs: { src: `data:image/png;base64,${illustration.toString('base64')}`, exportWidth: 440, exportHeight: 100 } },
  { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Il progetto in tre passi' }] },
  { type: 'table', content: [['Attività', 'Periodo'], ['Raccolta delle idee', 'Prima settimana'], ['Preparazione dello spazio', 'Seconda settimana'], ['Giornata di apertura', 'Terza settimana']].map(row => ({ type: 'tableRow', content: row.map(cell) })) },
  paragraph('Ogni proposta trova posto. Il primo passo è una pagina bianca.'),
] }, 'Biblioteca - esempio originale', { writerFont: 'Arial', writerFontSize: 11, lineHeight: 1.15 });
const book = newWorkbook(), sheet = book.worksheets[0];
sheet.name = 'Attività';
sheet.addRows([['Mese', 'Libri', 'Laboratori', 'Totale'], ['Gennaio', 40, 12, { formula: 'SUM(B2:C2)', result: 52 }], ['Febbraio', 58, 18, { formula: 'SUM(B3:C3)', result: 76 }], ['Marzo', 72, 24, { formula: 'SUM(B4:C4)', result: 96 }], ['Aprile', 85, 30, { formula: 'SUM(B5:C5)', result: 115 }]]);
sheet.columns.forEach(column => { column.width = 18; });
sheet.getRow(1).eachCell(c => { c.font = { bold: true, color: { argb: 'FFFFFFFF' } }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF23846D' } }; });
const chart = newChart(book, sheet.id, 'A1', 'C5', 'bar');
Object.assign(chart, { title: 'La biblioteca prende vita', axisX: 'Mese', axisY: 'Attività', legend: 'bottom' });
book.properties.cosmoCharts = [chart];
const xlsx = await exportWorkbook(book);
const pdf = await PDFDocument.create(), font = await pdf.embedFont(StandardFonts.Helvetica), bold = await pdf.embedFont(StandardFonts.HelveticaBold);
pdf.setTitle('Una biblioteca per tutti - esempio originale'); pdf.setAuthor('Cosmonet');
const pdfPage = pdf.addPage([595, 842]);
pdfPage.drawRectangle({ x: 0, y: 650, width: 595, height: 192, color: rgb(.93,.97,.99) });
pdfPage.drawText('COSMOFFICE / DOCUMENTO DI ESEMPIO', { x: 52, y: 782, size: 10, font, color: rgb(.23,.46,.55) });
pdfPage.drawText('Una biblioteca per tutti.', { x: 52, y: 720, size: 30, font: bold, color: rgb(.13,.22,.32) });
for (const [i, text] of ['Uno spazio vicino, tante storie da incontrare.', 'Leggere insieme. Condividere idee. Dare forma a un progetto.', '', 'Le prossime attività', '1. Scegliere i libri e preparare gli scaffali.', '2. Organizzare un laboratorio di lettura.', '3. Aprire le porte al quartiere.', '', 'Testo e illustrazione originali, creati soltanto per questa anteprima.'].entries()) pdfPage.drawText(text, { x: 52, y: 594 - i * 32, size: i === 3 ? 18 : 12, font: i === 3 ? bold : font, color: rgb(.22,.31,.4) });
pdfPage.drawText('ESEMPIO ORIGINALE / 01', { x: 52, y: 55, size: 10, font, color: rgb(.4,.47,.55) });
const pdfBytes = await pdf.save();
// Conserviamo gli esempi soltanto nell'area QA ignorata da Git, mai prelevati dal computer.
await Promise.all([writeFile('test-results/screenshots/biblioteca.docx', docx), writeFile('test-results/screenshots/attivita.xlsx', xlsx), writeFile('test-results/screenshots/biblioteca.pdf', pdfBytes)]);
const server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
try {
  const channel = process.env.COSMO_BROWSER || 'chrome';
  browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, locale: 'it-IT', timezoneId: 'Europe/Rome', colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await context.newPage(), errors = [], external = [], captured = [];
  page.on('pageerror', error => errors.push(error.name));
  await context.route('**/*', route => { const url = route.request().url(); if (/^https?:/.test(url) && new URL(url).origin !== origin) { external.push(new URL(url).hostname); return route.abort(); } return route.continue(); });
  await page.clock.setFixedTime(new Date('2026-11-22T12:00:00Z'));
  await page.addInitScript(() => localStorage.setItem('cosmoffice.preferences.v1', JSON.stringify({ theme: 'light', writerFont: 'Arial', writerFontSize: 11, lineHeight: 1.15, pdfZoom: 90, automaticUpdates: false })));
  await page.goto(origin);
  await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor();
  const forbidden = [...new Set([userInfo().username, process.env.USERNAME, homedir(), process.cwd()])].filter(s => s && s.length >= 3).map(s => s.toLowerCase());
  async function privacyCheck() {
    const visible = await page.evaluate(() => document.body.innerText + '\n' + [...document.querySelectorAll('input,textarea')].map(e => e.value).join('\n'));
    assert.doesNotMatch(visible, /\b[a-z]:[\\/]|\/Users\/|\/home\/|file:\/\//i, 'Nessun percorso del computer nelle schermate.');
    assert.equal(forbidden.some(value => visible.toLowerCase().includes(value)), false, 'Nessun nome utente o cartella personale visibile.');
  }
  async function capture(name) {
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); document.activeElement?.blur(); });
    await page.mouse.move(10, 10);
    await page.waitForTimeout(300);
    await privacyCheck();
    const buffer = await page.screenshot({ animations: 'disabled', caret: 'hide' });
    const output = await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true, quality: 90, colours: 256 }).toBuffer();
    const metadata = await sharp(output).metadata();
    assert.ok(metadata.width <= 1600 && output.length < 600 * 1024, 'PNG entro 1600 px e 600 KB.');
    assert.equal(metadata.exif, undefined); assert.equal(metadata.xmp, undefined); assert.equal(metadata.icc, undefined);
    await writeFile(`docs/images/${name}.png`, output);
    captured.push({ name, width: metadata.width, height: metadata.height, bytes: output.length });
  }
  async function open(name, bytes) {
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Apri un file', exact: true }).click();
    await (await chooser).setFiles({ name, mimeType: 'application/octet-stream', buffer: Buffer.from(bytes) });
  }
  async function home() { await page.getByRole('button', { name: 'Torna alle bozze', exact: true }).click(); await page.getByRole('heading', { name: 'Il tuo spazio di lavoro.' }).waitFor(); }
  await open('Biblioteca - esempio.docx', docx);
  await page.locator('.document-page table').waitFor();
  await page.locator('.document-page img').waitFor();
  await capture('write');
  await home();
  await open('Attività - esempio.xlsx', xlsx);
  await page.locator('.grid-chart canvas').waitFor();
  await page.getByRole('textbox', { name: 'Cella D2', exact: true }).focus();
  await page.getByRole('textbox', { name: 'Formula o valore della cella selezionata' }).focus();
  assert.match(await page.getByRole('textbox', { name: 'Formula o valore della cella selezionata' }).inputValue(), /SUM|SOMMA/);
  await capture('grid');
  await home();
  await open('Biblioteca - lettura.pdf', pdfBytes);
  await page.waitForFunction(() => document.querySelector('.pdf-paper canvas')?.width > 0 && !document.querySelector('.pdf-loading'));
  await page.locator('.textLayer span').first().waitFor();
  await capture('view');
  await home();
  await page.setViewportSize({ width: 1440, height: 1160 });
  await capture('home');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 390), 'Layout senza overflow orizzontale a 390 px.');
  await capture('layout-stretto');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByRole('combobox', { name: 'Tema interfaccia' }).selectOption('light');
  await capture('impostazioni-chiaro');
  await page.getByRole('combobox', { name: 'Tema interfaccia' }).selectOption('dark');
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await capture('impostazioni-scuro');
  await page.getByRole('combobox', { name: 'Tema interfaccia' }).selectOption('light');
  await page.getByRole('button', { name: 'Aggiornamenti', exact: true }).click();
  await capture('aggiornamenti');
  await page.getByRole('button', { name: 'Informazioni', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('textarea[aria-label="Testo della licenza A"]')?.value.includes('1. Titolare'));
  await capture('informazioni');
  await page.setViewportSize({ width: 1440, height: 1440 });
  await page.getByRole('button', { name: 'Prova guidata', exact: true }).click();
  const guided = page.getByRole('dialog', { name: 'Prova guidata', exact: true });
  await guided.waitFor();
  await guided.getByRole('button', { name: 'Copia rapporto', exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelectorAll('.guided-list input:not(:disabled)').length === 24);
  await capture('prova-guidata');
  await guided.getByRole('button', { name: 'Chiudi prova guidata' }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(async () => { const debug = await import('/src/debug.mjs'); debug.recordError('renderer', { name: 'Error', stack: '' }); });
  await page.getByRole('button', { name: 'Segnala un problema', exact: true }).click();
  const report = page.getByRole('textbox', { name: 'Rapporto di debug', exact: true });
  await page.waitForFunction(() => document.querySelector('textarea[aria-label="Rapporto di debug"]')?.value.includes('Ultimi errori (1/50)'));
  await report.evaluate(element => { element.scrollTop = 130; });
  await capture('segnala-problema');
  assert.deepEqual(errors, [], 'Nessun errore della pagina durante le catture.');
  assert.deepEqual(external, [], 'Nessuna risorsa esterna caricata.');
  assert.equal(captured.length, 11);
  const readme = await readFile('README.md', 'utf8');
  for (const item of captured) assert.ok(readme.includes(`](docs/images/${item.name}.png)`), 'Immagine collegata al README con percorso relativo.');
  await writeFile('test-results/screenshots/esiti.json', JSON.stringify({ result: 'PASS', version, originalExamples: true, privacy: 'Nessun percorso o nome utente visibile; metadati PNG rimossi.', external, captured }, null, 2));
  console.log(JSON.stringify({ result: 'PASS', captured, external }, null, 2));
} finally { await browser?.close(); await server.close(); }
