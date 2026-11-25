import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeMarkdown, encodeMarkdown } from '../src/markdown.mjs';

test('Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata', () => {
  const bytes = Buffer.from('\uFEFF# Città\r\n\r\n$$x^2$$\r\n<!-- originale -->\r\n');
  assert.deepEqual(Buffer.from(encodeMarkdown(decodeMarkdown(bytes))), bytes);
  assert.deepEqual(encodeMarkdown(''), new Uint8Array());
});
test('Markdown rifiuta UTF-8 invalido senza sostituire caratteri', () => {
  assert.throws(() => decodeMarkdown(Uint8Array.of(0xc3, 0x28)), /UTF-8 valido/);
});
