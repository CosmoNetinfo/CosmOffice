import JSZip from 'jszip';
import { safeHtml } from './files.mjs';
import { openWorkbook } from './workbooks.mjs';

const LIMIT = 48 * 1024 * 1024;
export async function exportBackup(records) {
  const zip = new JSZip(), manifest = { format: 'cosmoffice-backup', version: 1, created: new Date().toISOString(), files: [] };
  let total = 0;
  for (const record of records) {
    const ext = record.kind === 'write' ? 'html' : record.kind === 'grid' ? 'xlsx' : 'pdf';
    const path = `files/${crypto.randomUUID()}.${ext}`;
    const payload = typeof record.payload === 'string' ? new TextEncoder().encode(record.payload) : new Uint8Array(record.payload);
    total += payload.byteLength; if (total > LIMIT) throw new Error('Il backup supera 48 MB. Esporta separatamente i file più grandi.');
    zip.file(path, payload);
    manifest.files.push({ path, name: record.name, kind: record.kind, updated: record.updated, imported: record.imported === true });
  }
  zip.file('manifest.json', JSON.stringify(manifest));
  return new Uint8Array(await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 4 } }));
}
export async function importBackup(bytes) {
  if (bytes.byteLength > 50 * 1024 * 1024) throw new Error('Il backup supera 50 MB.');
  const zip = await JSZip.loadAsync(bytes);
  const entries = Object.values(zip.files);
  if (entries.length > 1001) throw new Error('Il backup contiene troppi elementi.');
  const expanded = entries.reduce((n, entry) => n + (entry._data?.uncompressedSize || 0), 0);
  if (expanded > LIMIT) throw new Error('Il contenuto decompresso supera 48 MB.');
  const manifestEntry = zip.file('manifest.json');
  if (!manifestEntry || manifestEntry._data?.uncompressedSize > 1024 * 1024) throw new Error('Indice del backup non valido.');
  const manifest = JSON.parse(await manifestEntry.async('string'));
  if (manifest.format !== 'cosmoffice-backup' || manifest.version !== 1 || !Array.isArray(manifest.files) || manifest.files.length > 500) throw new Error('Formato di backup non riconosciuto.');
  const restored = [];
  for (const item of manifest.files) {
    if (!['write', 'grid', 'pdf'].includes(item.kind) || typeof item.name !== 'string' || item.name.length > 200 || !/^files\/[a-f0-9-]+\.(html|xlsx|pdf)$/.test(item.path)) throw new Error('Il backup contiene una voce non valida.');
    const file = zip.file(item.path); if (!file || file._data?.uncompressedSize > 50 * 1024 * 1024) throw new Error('File mancante o troppo grande nel backup.');
    const data = await file.async('uint8array'); let payload = data;
    if (item.kind === 'write') payload = safeHtml(new TextDecoder().decode(data));
    else if (item.kind === 'grid') await openWorkbook(data);
    else if (!new TextDecoder().decode(data.slice(0, 1024)).includes('%PDF-')) throw new Error('PDF non valido nel backup.');
    restored.push({ id: crypto.randomUUID(), kind: item.kind, name: item.name, updated: Number.isFinite(item.updated) ? item.updated : Date.now(), imported: item.imported === true, payload });
  }
  return restored;
}
