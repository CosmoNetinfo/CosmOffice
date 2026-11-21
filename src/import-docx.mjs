import JSZip from 'jszip';
import mammoth from 'mammoth/mammoth.browser';
import { safeHtml } from './files.mjs';

const NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const child = (node, name) => [...(node?.children || [])].find(element => element.namespaceURI === NS && element.localName === name);
const attr = (node, key = 'val') => node?.getAttributeNS(NS, key);
const normalize = text => text.replace(/\s+/g, ' ').trim();
function readRun(properties) {
  const result = {};
  if (!properties) return result;
  for (const [xml, key] of [['b', 'bold'], ['i', 'italic'], ['strike', 'strike'], ['u', 'underline']]) { const element = child(properties, xml); if (element) result[key] = !['0', 'false', 'off', 'none'].includes(attr(element)); }
  const color = attr(child(properties, 'color')); if (/^[a-f\d]{6}$/i.test(color || '')) result.color = `#${color}`;
  const size = Number(attr(child(properties, 'sz'))); if (size >= 12 && size <= 400) result.size = size / 2;
  const font = attr(child(properties, 'rFonts'), 'ascii'); if (font) result.font = font;
  const highlight = attr(child(properties, 'highlight'));
  const colors = { yellow: '#ffff00', green: '#00ff00', cyan: '#00ffff', magenta: '#ff00ff', blue: '#0000ff', red: '#ff0000', darkYellow: '#808000', lightGray: '#d3d3d3' };
  if (colors[highlight]) result.highlight = colors[highlight];
  const fill = attr(child(properties, 'shd'), 'fill'); if (/^[a-f\d]{6}$/i.test(fill || '')) result.highlight = `#${fill}`;
  return result;
}
/** Retain Mammoth's structural conversion, then recover common OOXML run styles and paragraph alignment. */
export async function importDocx(bytes) {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const html = new DOMParser().parseFromString(safeHtml(result.value), 'text/html');
  const zip = await JSZip.loadAsync(bytes);
  const xml = new DOMParser().parseFromString(await zip.file('word/document.xml').async('string'), 'application/xml');
  const stylesFile = zip.file('word/styles.xml');
  const styles = stylesFile ? new DOMParser().parseFromString(await stylesFile.async('string'), 'application/xml') : null;
  const styleMap = new Map([...(styles?.getElementsByTagNameNS(NS, 'style') || [])].map(element => [attr(element, 'styleId'), element]));
  const defaults = styles?.getElementsByTagNameNS(NS, 'rPrDefault')[0];
  const base = readRun(child(defaults, 'rPr'));
  function inherited(id, depth = 0) {
    const style = styleMap.get(id); if (!style || depth > 10) return {};
    return { ...inherited(attr(child(style, 'basedOn')), depth + 1), ...readRun(child(style, 'rPr')) };
  }
  const paragraphs = [...xml.getElementsByTagNameNS(NS, 'p')];
  let cursor = 0;
  for (const target of html.body.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li')) {
    if (target.tagName === 'LI' && target.querySelector('p,li')) continue;
    const text = normalize(target.textContent); if (!text) continue;
    const index = paragraphs.findIndex((source, n) => n >= cursor && normalize([...source.getElementsByTagNameNS(NS, 't')].map(node => node.textContent).join('')) === text);
    if (index < 0) continue;
    cursor = index + 1; const source = paragraphs[index]; const pPr = child(source, 'pPr');
    const styleId = attr(child(pPr, 'pStyle'));
    const alignment = attr(child(pPr, 'jc')) || attr(child(child(styleMap.get(styleId), 'pPr'), 'jc'));
    if (['left', 'right', 'center', 'both'].includes(alignment)) target.style.textAlign = alignment === 'both' ? 'justify' : alignment;
    if (source.getElementsByTagNameNS(NS, 'drawing').length || source.getElementsByTagNameNS(NS, 'object').length || source.getElementsByTagNameNS(NS, 'fldChar').length) continue;
    const fragment = document.createDocumentFragment();
    for (const run of source.getElementsByTagNameNS(NS, 'r')) {
      const properties = child(run, 'rPr');
      const format = { ...base, ...inherited(styleId), ...inherited(attr(child(properties, 'rStyle'))), ...readRun(properties) };
      const span = document.createElement('span');
      if (format.color) span.style.color = format.color;
      if (format.font) span.style.fontFamily = format.font;
      if (format.size) span.style.fontSize = `${format.size}pt`;
      let holder = span;
      for (const [key, tag] of [['bold', 'strong'], ['italic', 'em'], ['underline', 'u'], ['strike', 's']]) if (format[key]) { const node = document.createElement(tag); holder.append(node); holder = node; }
      if (format.highlight) { const mark = document.createElement('mark'); mark.setAttribute('data-color', format.highlight); mark.style.backgroundColor = format.highlight; holder.append(mark); holder = mark; }
      for (const part of run.children) {
        if (part.namespaceURI !== NS) continue;
        if (part.localName === 't') holder.append(document.createTextNode(part.textContent));
        else if (part.localName === 'br' || part.localName === 'cr') holder.append(document.createElement('br'));
        else if (part.localName === 'tab') holder.append(document.createTextNode('\t'));
      }
      fragment.append(span);
    }
    // Do not replace a conversion when fields or uncommon inline content changed the plain text.
    if (normalize(fragment.textContent) === text) target.replaceChildren(fragment);
  }
  return safeHtml(html.body.innerHTML);
}
