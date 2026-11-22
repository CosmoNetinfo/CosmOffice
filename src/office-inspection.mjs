import JSZip from 'jszip';

const MAX_EXPANDED = 100 * 1024 * 1024;
/** Inspect the archive before the document parser allocates its complete content. */
export async function inspectOfficeFile(bytes, kind) {
  let zip;
  try { zip = await JSZip.loadAsync(bytes); }
  catch { throw new Error('File Office non valido, danneggiato o cifrato. Apri una copia DOCX/XLSX non protetta da password.'); }
  const parts = Object.values(zip.files), names = parts.filter(part => !part.dir).map(part => part.name);
  if (parts.length > 10000 || parts.reduce((total, part) => total + (part._data?.uncompressedSize || 0), 0) > MAX_EXPANDED) throw new Error('Il contenuto Office supera i limiti di questa versione (100 MB decompressi o 10.000 elementi).');
  const main = kind === 'write' ? 'word/document.xml' : 'xl/workbook.xml';
  if (!zip.file('[Content_Types].xml') || !zip.file('_rels/.rels') || !zip.file(main)) throw new Error(`Il file non contiene un documento ${kind === 'write' ? 'Word DOCX' : 'Excel XLSX'} valido.`);
  if (zip.file(main)._data?.uncompressedSize > 32 * 1024 * 1024) throw new Error('La struttura del documento è troppo grande per questa versione.');
  const warnings = [];
  if (names.some(name => /vbaProject\.bin$/i.test(name))) warnings.push('Contiene macro: non vengono eseguite e potrebbero non essere conservate nella copia esportata.');
  if (kind === 'write') {
    if (names.some(name => /^word\/.*(?:header|footer)\d*\.xml$/.test(name))) warnings.push('Intestazioni e piè di pagina vengono conservati nella copia DOCX, ma non sono mostrati nell’editor. Sezioni multiple o numerazioni complesse nelle intestazioni bloccano l’esportazione per evitare perdite.');
    let hasNotes = false;
    for (const name of names.filter(name => /^word\/(comments|footnotes|endnotes)\d*\.xml$/.test(name))) {
      const xml = await zip.file(name).async('string');
      if (/<(?:\w+:)?comment\b[^>]*>/.test(xml) || [...xml.matchAll(/<(?:\w+:)?(?:footnote|endnote)\b[^>]*>/g)].some(match => /(?:\w+:)?id=["'][1-9]\d*["']/.test(match[0]))) hasNotes = true;
    }
    if (hasNotes) warnings.push('Commenti e note potrebbero non essere conservati nella copia esportata.');
    const body = await zip.file(main).async('string');
    if (/<(?:\w+:)?(?:ins|del)(?:\s|>)/.test(body)) warnings.push('Contiene revisioni: la conversione non conserva la cronologia delle modifiche.');
  } else {
    if (names.some(name => /^xl\/pivot(?:Tables|Cache)\//.test(name))) warnings.push('Contiene tabelle pivot: non sono modificabili e potrebbero non essere conservate nella copia esportata.');
    if (names.some(name => /^xl\/externalLinks\//.test(name))) warnings.push('Contiene collegamenti a cartelle esterne: i relativi valori non vengono aggiornati.');
  }
  if (names.some(name => /^(?:word|xl)\/charts\//.test(name))) warnings.push('Contiene grafici: quelli XLSX creati da CosmOffice sono supportati; i grafici esterni non riconosciuti bloccano l’esportazione per conservarne l’originale. Nei DOCX i grafici non sono supportati.');
  if (names.some(name => /^(?:word|xl)\/embeddings\//.test(name))) warnings.push('Contiene oggetti incorporati: potrebbero non essere conservati nella copia esportata.');
  return warnings;
}
