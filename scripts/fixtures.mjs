/** Local, generated documents for interoperability tests. No downloaded business documents. */
import { exportDocument } from '../src/documents.mjs';
import { newWorkbook } from '../src/workbooks.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
export async function fixtures(browser) {
  await mkdir('test-results', { recursive: true });
  const word = await exportDocument({ type: 'doc', content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Documento di verifica Cosmonet' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Contenuto Word importato correttamente.', marks: [{ type: 'bold' }] }] },
    { type: 'table', content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cella di prova' }] }] }] }] },
  ] }, 'Verifica');
  await writeFile('test-results/verifica.docx', word);
  await writeFile('test-results/verifica.xlsx', new Uint8Array(await newWorkbook('budget').xlsx.writeBuffer()));
  const page = await browser.newPage();
  await page.setContent(`<html><head><meta charset="utf-8"><style>@page{size:A4;margin:0}body{margin:0;font-family:Arial,sans-serif;color:#25344a}.page{height:1122px;padding:85px 72px;page-break-after:always;box-sizing:border-box}.page:last-child{page-break-after:auto}.eyebrow{font-size:11px;letter-spacing:3px;color:#a37744;margin:0 0 75px}h1{font-size:43px;line-height:1.15;letter-spacing:-1.6px;margin:0 0 27px;font-weight:600}p{font-size:14px;line-height:1.9;color:#7d8b9f}.line{width:50px;height:4px;background:#df9749;margin:25px 0 38px}h2{font-size:22px;margin:44px 0 14px}ul{padding-left:20px;color:#7d8b9f;font-size:14px;line-height:2.1}.foot{margin-top:85px;border-top:1px solid #e1e6ee;padding-top:20px;font-size:10px;color:#a5adba;display:flex;justify-content:space-between}.box{padding:24px;background:#fff8ed;border-left:3px solid #df9749;margin:35px 0}.box p{margin:0;font-size:13px}</style></head><body><div class="page"><div class="eyebrow">COSMONET / COSMOVIEW</div><h1>Il lavoro, nello<br>stesso universo.</h1><div class="line"></div><p>Una suite per dare forma alle idee, organizzare i numeri<br>e leggere i documenti. Tutto sul tuo dispositivo.</p><h2>Uno spazio per ogni contenuto.</h2><ul><li>CosmoWrite, per documenti e parole.</li><li>CosmoGrid, per fogli di calcolo e numeri.</li><li>CosmoView, per leggere i PDF.</li></ul><div class="box"><p>Questo documento è un esempio creato per verificare<br>la lettura, la ricerca e la navigazione nei PDF.</p></div><div class="foot"><span>COSMOFFICE · DOCUMENTO DI ESEMPIO</span><span>01 / 02</span></div></div><div class="page"><div class="eyebrow">COSMONET / COSMOVIEW</div><h1>Le tue pagine.<br>Al tuo ritmo.</h1><div class="line"></div><p>Questa seconda pagina permette di provare la navigazione.<br>Puoi cercare la parola «progetto» per trovarla.</p><h2>Appunti di progetto</h2><p>Una buona idea comincia da una pagina.<br>Il resto prende forma, un passo alla volta.</p><div class="foot"><span>COSMOFFICE · DOCUMENTO DI ESEMPIO</span><span>02 / 02</span></div></div></body></html>`);
  const pdf = await page.pdf({ path: 'test-results/esempio-cosmonet.pdf', printBackground: true, preferCSSPageSize: true });
  await page.close();
  return { word, sheet: new Uint8Array(await (newWorkbook('budget')).xlsx.writeBuffer()), pdf: new Uint8Array(pdf) };
}
