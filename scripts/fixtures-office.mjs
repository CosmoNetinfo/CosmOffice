// Lettura indipendente dei file originali e delle copie esportate dall'app.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import sharp from 'sharp';

const manifest = JSON.parse(await readFile('tests/fixtures/manifest.json', 'utf8'));
const engine = process.env.COSMO_OFFICE_ENGINE || (process.platform === 'win32' ? 'C:/Program Files/LibreOffice/program/soffice.com' : 'libreoffice');
const root = resolve(`test-results/corpus-office-${Date.now()}`); await mkdir(root, { recursive: true });
const profile = pathToFileURL(join(root, 'profile')).href;
const results = [];
async function convert(file, destination) {
  await mkdir(destination, { recursive: true });
  await new Promise((done, reject) => {
    const child = spawn(engine, [`-env:UserInstallation=${profile}`, '--headless', '--nologo', '--nodefault', '--norestore', '--convert-to', 'pdf', '--outdir', destination, resolve(file)], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let logs = '', expired = false;
    const timer = setTimeout(() => { expired = true; child.kill(); }, 60000);
    child.stdout.on('data', chunk => { logs += chunk; }); child.stderr.on('data', chunk => { logs += chunk; });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => { clearTimeout(timer); if (code || expired) reject(new Error(logs || `LibreOffice: ${code}`)); else done(); });
  });
  const output = join(destination, basename(file).replace(/\.(docx|xlsx)$/, '.pdf')); await access(output); return output;
}
const server = await createServer({ server: { host: '127.0.0.1', port: 5173, strictPort: true } }); await server.listen();
let browser;
try {
  const channel = process.env.COSMO_BROWSER || 'chrome'; browser = await chromium.launch({ ...(channel === 'chromium' ? {} : { channel }), headless: true });
  const page = await browser.newPage(); await page.goto('http://127.0.0.1:5173');
  for (const file of manifest.files) {
    for (const variant of file.kind === 'pdf' ? ['originale'] : ['originale', 'esportato']) {
      const input = `${variant === 'originale' ? 'tests/fixtures' : 'test-results/corpus'}/${file.name}`;
      const folder = join(root, `${variant}-${file.name}`); await mkdir(folder, { recursive: true });
      const pdfPath = file.kind === 'pdf' ? input : await convert(input, folder);
      const rendered = await page.evaluate(async data => {
        const { createPdfTask } = await import('/src/pdf-engine.mjs');
        const task = createPdfTask(new Uint8Array(data)), pdf = await task.promise, images = [], texts = [];
        try {
          if (pdf.numPages > 200) throw new Error('Più di 200 pagine nel campione di verifica.');
          for (let i = 1; i <= pdf.numPages; i++) {
            const pdfPage = await pdf.getPage(i), viewport = pdfPage.getViewport({ scale: .45 });
            const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
            await pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
            images.push(canvas.toDataURL('image/png').split(',')[1]);
            texts.push((await pdfPage.getTextContent()).items.map(item => item.str || '').join(' '));
          }
          return { pages: pdf.numPages, texts, images };
        } finally { await task.destroy(); }
      }, Array.from(await readFile(pdfPath)));
      const allText = rendered.texts.join(' ').replace(/\s+/g, '');
      const expected = file.kind === 'write' ? [...file.text, ...(file.header ? [file.header, file.footer] : []), ...(variant === 'esportato' ? ['Modifica corpus conservata.'] : [])] : file.kind === 'grid' ? [`Campione Excel ${file.name[1]}`] : [file.text];
      for (const text of expected) assert.ok(allText.includes(text.replace(/\s+/g, '')), `${variant} ${file.name}: ${text}`);
      if (file.kind === 'pdf') { assert.equal(rendered.pages, file.pages); if (file.scanned) assert.equal(allText, ''); }
      const tiles = [];
      for (let i = 0; i < rendered.images.length; i++) {
        const image = Buffer.from(rendered.images[i], 'base64'); await writeFile(join(folder, `pagina-${i + 1}.png`), image);
        tiles.push({ input: await sharp(image).resize(240, 340, { fit: 'contain', background: '#dce3ec' }).png().toBuffer(), left: (i % 4) * 250, top: Math.floor(i / 4) * 350 });
      }
      await sharp({ create: { width: Math.min(4, tiles.length) * 250, height: Math.ceil(tiles.length / 4) * 350, channels: 3, background: '#dce3ec' } }).composite(tiles).png().toFile(join(folder, 'contatto.png'));
      const result = { file: file.name, variant, pages: rendered.pages, result: 'PASS' }; results.push(result); console.log(JSON.stringify(result));
    }
  }
  await writeFile('test-results/corpus-office-report.json', JSON.stringify({ engine: 'LibreOffice → PDF → PDF.js', results, folder: root }, null, 2));
} finally { await browser?.close(); await server.close(); }
