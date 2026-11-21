// Poppler è un lettore indipendente sia da PDF.js sia da pdf-lib.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = 'test-results/pdf-poppler'; await mkdir(root, { recursive: true });
const files = JSON.parse(await readFile('tests/fixtures/manifest.json', 'utf8')).files.filter(file => file.kind === 'pdf');
async function run(name, args) {
  return new Promise((done, reject) => {
    const child = spawn(name + (process.platform === 'win32' ? '.exe' : ''), args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', expired = false;
    const timer = setTimeout(() => { expired = true; child.kill(); }, 60000);
    child.stdout.on('data', data => { stdout += data; }); child.stderr.on('data', data => { stderr += data; });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => { clearTimeout(timer); if (code || expired) reject(new Error(`${name}: ${stderr || code}`)); else done(stdout); });
  });
}
const results = [];
for (const file of files) {
  const original = `tests/fixtures/${file.name}`, saved = `test-results/corpus/${file.name}`;
  const before = await run('pdfinfo', ['-f', '1', '-l', String(file.pages), original]);
  const after = await run('pdfinfo', ['-f', '1', '-l', String(file.pages), saved]);
  await writeFile(`${root}/${file.name}.prima.txt`, before); await writeFile(`${root}/${file.name}.dopo.txt`, after);
  assert.equal(Number(/^Pages:\s+(\d+)/m.exec(after)?.[1]), file.pages);
  const rotations = text => [...text.matchAll(/^Page\s+(\d+)\s+rot:\s+(-?\d+)/gm)].map(match => Number(match[2]));
  const sourceRotations = rotations(before), savedRotations = rotations(after);
  assert.equal(sourceRotations.length, file.pages);
  assert.deepEqual(savedRotations, sourceRotations.map((angle, i) => (angle + (i === file.pages - 1 ? 90 : 0)) % 360));
  const prefixes = [`${root}/${file.name}.prima`, `${root}/${file.name}.dopo`];
  for (const [i, path] of [original, saved].entries()) await run('pdftoppm', ['-f', String(file.pages), '-l', String(file.pages), '-singlefile', '-scale-to', '1200', '-png', path, prefixes[i]]);
  const a = await sharp(`${prefixes[0]}.png`).metadata(), b = await sharp(`${prefixes[1]}.png`).metadata();
  assert.ok(Math.abs(a.width - b.height) <= 1 && Math.abs(a.height - b.width) <= 1, 'dimensioni ruotate nel lettore indipendente');
  // La rasterizzazione di glifi ruotati può avere un hinting diverso: media locale
  // di un pixel, senza spostare gli oggetti. Il test dei flussi verifica i byte esatti.
  const expected = await sharp(`${prefixes[0]}.png`).rotate(90).resize(b.width, b.height).blur(1).removeAlpha().raw().toBuffer();
  const actual = await sharp(`${prefixes[1]}.png`).blur(1).removeAlpha().raw().toBuffer();
  assert.equal(actual.length, expected.length);
  const shifts = [-1, 0, 1].flatMap(dy => [-1, 0, 1].map(dx => ({ dx, dy, error: 0 })));
  let ink = 0, actualInk = 0;
  for (let i = 0; i < expected.length; i += 3) {
    if (actual[i] < 225 || actual[i + 1] < 225 || actual[i + 2] < 225) actualInk++;
    if (expected[i] < 225 || expected[i + 1] < 225 || expected[i + 2] < 225) {
      ink++;
      const x = (i / 3) % b.width, y = Math.floor(i / 3 / b.width);
      for (const shift of shifts) {
        const j = (Math.max(0, Math.min(b.height - 1, y + shift.dy)) * b.width + Math.max(0, Math.min(b.width - 1, x + shift.dx))) * 3;
        shift.error += (Math.abs(actual[j] - expected[i]) + Math.abs(actual[j + 1] - expected[i + 1]) + Math.abs(actual[j + 2] - expected[i + 2])) / 3;
      }
    }
  }
  assert.ok(ink > 100, 'pagina con contenuto effettivo');
  assert.ok(actualInk >= ink * .8 && actualInk <= ink * 1.2, 'contenuto visivo mantenuto');
  const best = shifts.sort((a, b) => a.error - b.error)[0];
  assert.ok(best.error / ink < 25, `differenza media sui pixel del contenuto: ${best.error / ink}`);
  const result = { file: file.name, reader: 'Poppler pdfinfo e pdftoppm', pages: file.pages, rotatedPage: file.pages, otherPagesUnchanged: true, contentPixelDifference: Number((best.error / ink).toFixed(3)), pixelAlignment: { dx: best.dx, dy: best.dy }, result: 'PASS' }; results.push(result); console.log(JSON.stringify(result));
}
await writeFile(`${root}/report.json`, JSON.stringify({ result: 'PASS', results }, null, 2));
