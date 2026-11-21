// Corpus sintetico riproducibile nel contenuto; nessun dato o documento di terzi.
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, Header, Footer, PageNumber } from 'docx';
import ExcelJS from 'exceljs';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const dir = 'tests/fixtures';
await mkdir(dir, { recursive: true });
const manifest = { version: 1, provenance: 'Dati fittizi creati con docx, ExcelJS, sharp e Chromium. Non prodotti da Microsoft Office.', files: [] };
async function save(name, bytes, expected) {
  await writeFile(`${dir}/${name}`, bytes);
  manifest.files.push({ name, sha256: createHash('sha256').update(bytes).digest('hex'), ...expected });
}
const logo = await sharp(Buffer.from('<svg width="240" height="80" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="80" rx="12" fill="#214e91"/><circle cx="42" cy="40" r="22" fill="#ffffff"/><circle cx="49" cy="34" r="19" fill="#214e91"/><text x="79" y="49" fill="white" font-size="23" font-family="sans-serif">Cosmonet</text></svg>')).png().toBuffer();
const p = text => new Paragraph(text);
const image = () => new ImageRun({ data: logo, type: 'png', transformation: { width: 240, height: 80 } });
const cases = [
  { name: '01-testo-stili.docx', title: 'Accenti e stili', children: [p('Accenti e stili'), new Paragraph({ children: [new TextRun({ text: 'Perché città e qualità: à è é ì ò ù.', bold: true, font: 'Georgia', color: '214E91', size: 28 })] }), p('Secondo paragrafo conservato.')], text: ['Accenti e stili', 'Perché città e qualità', 'Secondo paragrafo conservato.'] },
  { name: '02-tabella.docx', title: 'Preventivo di prova', children: [p('Preventivo di prova'), new Table({ rows: [['Prodotto', 'Importo'], ['Servizio Alfa', '125,50 €'], ['Servizio Beta', '80,00 €']].map(row => new TableRow({ children: row.map(text => new TableCell({ children: [p(text)] })) })) }), p('Totale concordato: 205,50 €.')], text: ['Preventivo di prova', 'Servizio Alfa', 'Servizio Beta', 'Totale concordato'], tables: 1 },
  { name: '03-immagine.docx', title: 'Identità Cosmonet', children: [p('Identità Cosmonet'), new Paragraph({ children: [image()] }), p('Logo incorporato, senza risorse remote.')], text: ['Identità Cosmonet', 'Logo incorporato'], images: 1 },
  { name: '04-elenchi.docx', title: 'Attività di progetto', children: [p('Attività di progetto'), ...['Analisi iniziale', 'Verifica documenti', 'Consegna finale'].map(text => new Paragraph({ text, bullet: { level: 0 } })), ...['Primo passo', 'Secondo passo'].map(text => new Paragraph({ text, numbering: { reference: 'passi', level: 0 } }))], text: ['Attività di progetto', 'Analisi iniziale', 'Verifica documenti', 'Consegna finale', 'Primo passo', 'Secondo passo'], lists: 2 },
  { name: '05-intestazioni.docx', title: 'Relazione con intestazione', children: [p('Relazione con intestazione'), p('Il corpo resta modificabile mantenendo intestazione e piè di pagina.')], headers: { default: new Header({ children: [new Paragraph({ children: [image()] }), p('COSMONET — INTESTAZIONE DA CONSERVARE')] }) }, footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun('RISERVATO — Pagina '), new TextRun({ children: [PageNumber.CURRENT] })] })] }) }, text: ['Relazione con intestazione', 'Il corpo resta modificabile'], header: 'INTESTAZIONE DA CONSERVARE', footer: 'RISERVATO', images: 1 },
];
for (const item of cases) {
  const doc = new Document({ creator: 'Cosmonet', title: item.title, numbering: { config: [{ reference: 'passi', levels: [{ level: 0, format: 'decimal', text: '%1.', style: { paragraph: { indent: { left: 720, hanging: 260 } } } }] }] }, sections: [{ children: item.children, headers: item.headers, footers: item.footers }] });
  await save(item.name, await Packer.toBuffer(doc), { kind: 'write', text: item.text, tables: item.tables || 0, images: item.images || 0, lists: item.lists || 0, ...(item.header ? { header: item.header, footer: item.footer } : {}) });
}
for (let i = 1; i <= 5; i++) {
  const book = new ExcelJS.Workbook(); book.creator = 'Cosmonet';
  const sheet = book.addWorksheet('Dati');
  sheet.getCell('A1').value = `Campione Excel ${i}`;
  if (i === 1) { sheet.getCell('B2').value = 125.5; sheet.getCell('B3').value = 80; sheet.getCell('B4').value = { formula: 'SUM(B2:B3)', result: 205.5 }; }
  if (i === 2) { const other = book.addWorksheet('Costi annui'); other.getCell('B2').value = 1200; sheet.getCell('B2').value = { formula: "'Costi annui'!$B$2/12", result: 100 }; other.getCell('A1').value = 'Secondo foglio conservato'; }
  if (i === 3) { sheet.getCell('B2').value = 1250.5; sheet.getCell('B2').numFmt = '#,##0.00 "€"'; sheet.getCell('B3').value = 0.22; sheet.getCell('B3').numFmt = '0.00%'; sheet.getCell('B4').value = new Date('2026-11-21T00:00:00Z'); sheet.getCell('B4').numFmt = 'dd/mm/yyyy'; sheet.getCell('C2').value = '001234'; sheet.getCell('C3').value = '12345678901234567890'; sheet.getCell('C4').value = '#N/A'; sheet.getCell('C5').value = true; }
  if (i === 4) { sheet.mergeCells('A3:C3'); sheet.getCell('A3').value = 'Titolo unito'; sheet.getCell('B5').value = 12; sheet.getCell('C5').value = { formula: 'B5*2', result: 24 }; sheet.getCell('B6').value = 18; sheet.getCell('C6').value = { sharedFormula: 'C5', result: 36 }; sheet.addImage(book.addImage({ buffer: logo, extension: 'png' }), { tl: { col: 5, row: 2 }, ext: { width: 240, height: 80 } }); }
  if (i === 5) { sheet.addRows([['Articolo', 'Quantità', 'Prezzo'], ['Alfa', 3, 10.5], ['Beta', 2, 25]]); sheet.autoFilter = 'A2:C4'; sheet.getCell('Z100').value = 'Dato oltre area visibile'; sheet.getCell('D3').value = { formula: 'B3*C3', result: 31.5 }; sheet.getCell('D4').value = { formula: 'B4*C4', result: 50 }; sheet.views = [{ state: 'frozen', ySplit: 2 }]; }
  sheet.columns.forEach(col => { col.width = 22; });
  sheet.getCell('A1').font = { bold: true, color: { argb: 'FF214E91' }, size: 16 };
  await save(`0${i}-${['formule', 'piu-fogli', 'formati', 'unioni-immagine', 'dati-filtro'][i - 1]}.xlsx`, Buffer.from(await book.xlsx.writeBuffer()), { kind: 'grid', sheets: book.worksheets.length });
}
const channel = process.env.COSMO_BROWSER || 'chrome';
const browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const style = '<style>@page{size:A4;margin:0}body{margin:0;font-family:Arial;color:#214e91}.page{box-sizing:border-box;width:794px;height:1122px;padding:80px;break-after:page}.page:last-child{break-after:auto}h1{font-size:32px}p{font-size:18px;line-height:1.7}</style>';
  await page.setContent(`${style}<div class="page"><h1>Documento PDF testuale</h1><p>Cosmonet: qualità, città, perché.</p><p>Contenuto selezionabile e ricercabile.</p></div>`);
  await save('01-testo.pdf', await page.pdf({ preferCSSPageSize: true, printBackground: true }), { kind: 'pdf', pages: 1, text: 'Documento PDF testuale', scanned: false });
  await page.setContent(`${style}<div class="page"><h1>SCANSIONE DI PROVA</h1><p>Archivio cartaceo Cosmonet</p><p>Documento fittizio numero 2026-001</p><p>Firma: Mario Esempio</p></div>`);
  const scan = await page.screenshot({ type: 'png' });
  await page.setContent(`${style}<img style="display:block;width:794px;height:1122px" src="data:image/png;base64,${scan.toString('base64')}">`);
  await save('02-scansione.pdf', await page.pdf({ preferCSSPageSize: true, printBackground: true }), { kind: 'pdf', pages: 1, text: '', scanned: true });
  await page.setContent(`${style}${Array.from({ length: 20 }, (_, i) => `<div class="page"><h1>Relazione multipagina — ${i + 1}</h1><p>Marcatore pagina ${String(i + 1).padStart(2, '0')}</p><p>Prova di lettura, navigazione e conservazione del contenuto.</p></div>`).join('')}`);
  await save('03-venti-pagine.pdf', await page.pdf({ preferCSSPageSize: true, printBackground: true }), { kind: 'pdf', pages: 20, text: 'Relazione multipagina', scanned: false });
} finally { await browser.close(); }
await writeFile(`${dir}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Creati 5 DOCX, 5 XLSX, 3 PDF e manifest SHA-256.');
