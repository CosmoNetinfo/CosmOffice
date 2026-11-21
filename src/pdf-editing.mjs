import { PDFDocument, PDFDict, PDFName, EncryptedPDFError, degrees } from 'pdf-lib';

/** A real page rotation. Never decrypt, flatten, rasterize or rewrite signed documents. */
export async function rotatePdfPage(bytes, pageNumber) {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength > 50 * 1024 * 1024) throw new Error('PDF non valido o superiore a 50 MB.');
  let document;
  try { document = await PDFDocument.load(bytes.slice(), { updateMetadata: false }); }
  catch (error) {
    if (error instanceof EncryptedPDFError) throw new Error('Rotazione non disponibile per PDF cifrati o protetti. Puoi leggere e salvare la copia originale.');
    throw new Error('Il PDF non può essere modificato in sicurezza. Il contenuto originale resta invariato.');
  }
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > document.getPageCount()) throw new Error('Numero pagina PDF non valido.');
  const signature = PDFName.of('Sig');
  if (document.catalog.has(PDFName.of('Perms')) || document.context.enumerateIndirectObjects().some(([, object]) => object instanceof PDFDict && (object.get(PDFName.of('Type')) === signature || object.get(PDFName.of('FT')) === signature || object.has(PDFName.of('ByteRange'))))) throw new Error('PDF con firma o campi firma rilevati: rotazione bloccata per non invalidarli. Puoi salvare la copia originale.');
  const page = document.getPage(pageNumber - 1);
  page.setRotation(degrees((page.getRotation().angle + 90) % 360));
  const output = await document.save({ useObjectStreams: false, updateFieldAppearances: false, addDefaultPage: false });
  if (output.byteLength > 50 * 1024 * 1024) throw new Error('Il PDF modificato supera 50 MB. Il contenuto originale resta invariato.');
  return output;
}
