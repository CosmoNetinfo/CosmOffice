import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;
export function createPdfTask(bytes) {
  const assets = new URL('./pdfjs/', document.baseURI).href;
  return getDocument({ data: new Uint8Array(bytes).slice(), isEvalSupported: false, useSystemFonts: true, enableXfa: false, cMapUrl: `${assets}cmaps/`, cMapPacked: true, standardFontDataUrl: `${assets}standard_fonts/`, wasmUrl: `${assets}wasm/` });
}
export async function validatePdf(bytes) {
  const task = createPdfTask(bytes);
  try {
    const pdf = await task.promise;
    if (!pdf.numPages) throw new Error('Il PDF non contiene pagine leggibili.');
  } catch (error) {
    // Protected PDFs must be unlocked by the existing password UI in the reader.
    if (error.name !== 'PasswordException') throw new Error('Il PDF è danneggiato o non è leggibile. Il file precedente è stato conservato.');
  } finally { await task.destroy(); }
}
