// Preserve the source, including BOM and line endings; the preview is never exported.
export function decodeMarkdown(bytes) {
  try { return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { throw new Error('Il file Markdown non è UTF-8 valido. Convertine una copia in UTF-8 prima di aprirlo.'); }
}
export function encodeMarkdown(source) { return new TextEncoder().encode(source); }
