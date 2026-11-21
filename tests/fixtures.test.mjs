import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { openWorkbook } from '../src/workbooks.mjs';

const root = new URL('./fixtures/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
test('Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati', async () => {
  for (const [kind, count] of [['write', 5], ['grid', 5], ['pdf', 3]]) assert.equal(manifest.files.filter(file => file.kind === kind).length, count);
  for (const file of manifest.files) {
    const bytes = await readFile(new URL(file.name, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, file.name);
    if (file.kind === 'write') {
      const text = (await mammoth.extractRawText({ buffer: bytes })).value;
      for (const expected of file.text) assert.ok(text.includes(expected), `${file.name}: ${expected}`);
      const zip = await JSZip.loadAsync(bytes);
      assert.equal((await zip.file('word/document.xml').async('string')).match(/<w:tbl>/g)?.length || 0, file.tables);
      if (file.header) assert.ok((await zip.file('word/header1.xml').async('string')).includes(file.header));
    } else if (file.kind === 'grid') assert.equal((await openWorkbook(bytes)).worksheets.length, file.sheets);
    else assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
  }
});
