import JSZip from 'jszip';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
const S = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const XDR = 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing';
// Ordine dei figli CT_Font, verificato dal validatore Microsoft.
const fontOrder = ['b', 'i', 'strike', 'condense', 'extend', 'outline', 'shadow', 'u', 'vertAlign', 'sz', 'color', 'name', 'family', 'charset', 'scheme'];
export async function normalizeXlsxSchema(bytes) {
  const zip = await JSZip.loadAsync(bytes), parser = new DOMParser(), serializer = new XMLSerializer();
  const styles = zip.file('xl/styles.xml');
  if (styles) {
    const doc = parser.parseFromString(await styles.async('string'), 'application/xml');
    for (const font of Array.from(doc.getElementsByTagNameNS(S, 'font'))) {
      const children = Array.from(font.childNodes).filter(node => node.nodeType === 1);
      children.sort((a, b) => {
        const left = fontOrder.indexOf(a.localName), right = fontOrder.indexOf(b.localName);
        return (left < 0 ? 999 : left) - (right < 0 ? 999 : right);
      });
      for (const child of children) font.appendChild(child);
    }
    zip.file('xl/styles.xml', serializer.serializeToString(doc));
  }
  for (const name of Object.keys(zip.files).filter(name => /^xl\/drawings\/[^/]+\.xml$/.test(name))) {
    const doc = parser.parseFromString(await zip.file(name).async('string'), 'application/xml');
    for (const anchor of Array.from(doc.getElementsByTagNameNS(XDR, 'oneCellAnchor'))) anchor.removeAttribute('editAs');
    zip.file(name, serializer.serializeToString(doc));
  }
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}
