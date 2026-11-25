import { decodeMarkdown } from './markdown.mjs';
import JSZip from 'jszip';
import { safeHtml } from './files.mjs';
import { openWorkbook } from './workbooks.mjs';
import { inspectOfficeFile } from './office-inspection.mjs';

const LIMIT = 48 * 1024 * 1024;
export async function exportBackup(records) {
  const zip = new JSZip(), manifest = { format: 'cosmoffice-backup', version: 1, created: new Date().toISOString(), files: [] };
  let total = 0;
  for (const record of records) {
    const ext = record.kind === 'write' ? (record.fileType === 'MD' ? 'md' : 'html') : record.kind === 'grid' ? 'xlsx' : 'pdf';
    const path = `files/${crypto.randomUUID()}.${ext}`;
    const payload = typeof record.payload === 'string' ? new TextEncoder().encode(record.payload) : new Uint8Array(record.payload);
    total += payload.byteLength; if (total > LIMIT) throw new Error('Il backup supera 48 MB. Esporta separatamente i file più grandi.');
    zip.file(path, payload);
    let sourcePath;
    if (record.kind === 'write' && record.sourceDocx && record.fileType !== 'MD') {
      const source = new Uint8Array(record.sourceDocx); total += source.byteLength;
      if (total > LIMIT) throw new Error('Il backup supera 48 MB. Esporta separatamente i file più grandi.');
      sourcePath = `files/${crypto.randomUUID()}.docx`; zip.file(sourcePath, source);
    }
    manifest.files.push({ ...(ext === 'md' ? { fileType: 'MD' } : {}), path, sourcePath, name: record.name, kind: record.kind, updated: record.updated, imported: record.imported === true, compatibilityWarnings: record.compatibilityWarnings || [] });
  }
  zip.file('manifest.json', JSON.stringify(manifest));
  return new Uint8Array(await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 4 } }));
}
export async function importBackup(bytes) {
  if (bytes.byteLength > 50 * 1024 * 1024) throw new Error('Il backup supera 50 MB.');
  const zip = await JSZip.loadAsync(bytes);
  const entries = Object.values(zip.files);
  if (entries.length > 2001) throw new Error('Il backup contiene troppi elementi.');
  const expanded = entries.reduce((n, entry) => n + (entry._data?.uncompressedSize || 0), 0);
  if (expanded > LIMIT) throw new Error('Il contenuto decompresso supera 48 MB.');
  const manifestEntry = zip.file('manifest.json');
  if (!manifestEntry || manifestEntry._data?.uncompressedSize > 1024 * 1024) throw new Error('Indice del backup non valido.');
  const manifest = JSON.parse(await manifestEntry.async('string'));
  if (manifest.format !== 'cosmoffice-backup' || manifest.version !== 1 || !Array.isArray(manifest.files) || manifest.files.length > 500) throw new Error('Formato di backup non riconosciuto.');
  const restored = [];
  for (const item of manifest.files) {
    if (!['write', 'grid', 'pdf'].includes(item.kind) || typeof item.name !== 'string' || item.name.length > 200 || !/^files\/[a-f0-9-]+\.(html|xlsx|pdf|md)$/.test(item.path)) throw new Error('Il backup contiene una voce non valida.');
    const markdown = item.fileType === 'MD';
    if (item.path.endsWith('.md') !== markdown || (markdown && item.kind !== 'write')) throw new Error('Voce Markdown del backup non valida.');
    const file = zip.file(item.path); if (!file || file._data?.uncompressedSize > 50 * 1024 * 1024) throw new Error('File mancante o troppo grande nel backup.');
    const data = await file.async('uint8array'); let payload = data;
    if (item.kind === 'write') payload = markdown ? decodeMarkdown(data) : safeHtml(new TextDecoder().decode(data));
    else if (item.kind === 'grid') { await inspectOfficeFile(data, 'grid'); await openWorkbook(data); }
    else { const { validatePdf } = await import('./pdf-engine.mjs'); await validatePdf(data); }
    let sourceDocx;
    if (item.sourcePath !== undefined) {
      if (markdown || item.kind !== 'write' || !/^files\/[a-f0-9-]+\.docx$/.test(item.sourcePath) || !zip.file(item.sourcePath)) throw new Error('Sorgente DOCX del backup non valida.');
      sourceDocx = await zip.file(item.sourcePath).async('uint8array'); await inspectOfficeFile(sourceDocx, 'write');
    }
    const compatibilityWarnings = Array.isArray(item.compatibilityWarnings) ? item.compatibilityWarnings.filter(value => typeof value === 'string' && value.length <= 1000).slice(0, 20) : [];
    restored.push({ ...(markdown ? { fileType: 'MD' } : {}), id: crypto.randomUUID(), kind: item.kind, name: item.name, updated: Number.isFinite(item.updated) ? item.updated : Date.now(), imported: item.imported === true, compatibilityWarnings, payload, ...(sourceDocx ? { sourceDocx } : {}) });
  }
  return restored;
}
