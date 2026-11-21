import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PDFDocument, PDFRawStream, PDFName } from 'pdf-lib';
import { rotatePdfPage } from '../src/pdf-editing.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function contentStreams(document) {
  return document.context.enumerateIndirectObjects().map(([, value]) => value).filter(value => value instanceof PDFRawStream && !['/ObjStm', '/XRef'].includes(value.dict.get(PDFName.of('Type'))?.toString())).map(value => hash(value.contents)).sort();
}
for (const name of ['01-testo.pdf', '02-scansione.pdf', '03-venti-pagine.pdf']) test(`Rotazione PDF conserva pagine e flussi originali: ${name}`, async () => {
  const bytes = new Uint8Array(await readFile(new URL(`fixtures/${name}`, import.meta.url))), beforeHash = hash(bytes);
  const source = await PDFDocument.load(bytes), selected = source.getPageCount();
  const saved = await PDFDocument.load(await rotatePdfPage(bytes, selected));
  assert.equal(saved.getPageCount(), source.getPageCount());
  assert.deepEqual(contentStreams(saved), contentStreams(source), 'testo, font, immagini e contenuti binari non riscritti');
  source.getPages().forEach((page, i) => {
    assert.deepEqual(saved.getPage(i).getMediaBox(), page.getMediaBox());
    assert.equal(saved.getPage(i).getRotation().angle, (page.getRotation().angle + (i === selected - 1 ? 90 : 0)) % 360);
  });
  assert.equal(hash(bytes), beforeHash, 'buffer di ingresso immutato');
  let rotated = bytes; for (let i = 0; i < 4; i++) rotated = await rotatePdfPage(rotated, selected);
  assert.equal((await PDFDocument.load(rotated)).getPage(selected - 1).getRotation().angle, source.getPage(selected - 1).getRotation().angle);
});
test('Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente', async () => {
  const document = await PDFDocument.create(); document.addPage();
  await assert.rejects(() => rotatePdfPage(new Uint8Array([1, 2]), 1), /non può essere modificato/);
  const bytes = await document.save(); await assert.rejects(() => rotatePdfPage(bytes, 0), /Numero pagina/); await assert.rejects(() => rotatePdfPage(bytes, 2), /Numero pagina/);
  // Campo firma sintetico: è una prova del blocco, non una firma crittografica valida.
  document.context.register(document.context.obj({ FT: PDFName.of('Sig') }));
  const signed = await document.save(), before = hash(signed);
  await assert.rejects(() => rotatePdfPage(signed, 1), /firma/); assert.equal(hash(signed), before);
});
