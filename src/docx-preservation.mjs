import JSZip from 'jszip';
import { inspectOfficeFile } from './office-inspection.mjs';

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const PKG = 'http://schemas.openxmlformats.org/package/2006/relationships';
const PREFIX = 'word/cosmoffice-preserved/';
const parse = xml => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) throw new Error('Struttura XML DOCX non valida.');
  return doc;
};
const xml = doc => new XMLSerializer().serializeToString(doc);
const nodes = (doc, ns, name) => [...doc.getElementsByTagNameNS(ns, name)];
function resolvePart(base, target) {
  const parts = (target.startsWith('/') ? target.slice(1) : `${base.slice(0, base.lastIndexOf('/') + 1)}${target}`).split('/');
  const clean = [];
  for (const part of parts) { if (part === '..') { if (!clean.length) throw new Error('Relazione DOCX non valida.'); clean.pop(); } else if (part && part !== '.') clean.push(part); }
  return clean.join('/');
}
const relPath = name => `${name.slice(0, name.lastIndexOf('/') + 1)}_rels/${name.slice(name.lastIndexOf('/') + 1)}.rels`;

/** Copy only header/footer dependency graphs. Deleted body text is never copied into exports. */
export async function preserveDocxParts(exported, original) {
  if (!original) return exported;
  const unsupported = (await inspectOfficeFile(original, 'write')).filter(message => !message.startsWith('Intestazioni e piè di pagina'));
  if (unsupported.length) throw new Error(`Esportazione DOCX bloccata per evitare la perdita di elementi non supportati. ${unsupported.join(' ')} La bozza resta salvata; conserva il file originale.`);
  const source = await JSZip.loadAsync(original), target = await JSZip.loadAsync(exported);
  const sourceDoc = parse(await source.file('word/document.xml').async('string'));
  const refs = [...nodes(sourceDoc, W, 'headerReference'), ...nodes(sourceDoc, W, 'footerReference')];
  if (!refs.length) return exported;
  if (nodes(sourceDoc, W, 'sectPr').length !== 1) throw new Error('Questo documento contiene più sezioni con intestazioni. Esportazione bloccata per evitare perdite: conserva l’originale.');
  const body = parse(await target.file('word/document.xml').async('string'));
  const relationships = parse(await source.file('word/_rels/document.xml.rels').async('string'));
  const outRels = parse(await target.file('word/_rels/document.xml.rels').async('string'));
  const sourceTypes = parse(await source.file('[Content_Types].xml').async('string'));
  const types = parse(await target.file('[Content_Types].xml').async('string'));
  const copied = new Set();
  const stylePrefix = 'CosmoPreserved_';
  let defaultParagraph = `${stylePrefix}Base`;
  const styleFile = source.file('word/styles.xml');
  if (styleFile) {
    const styles = parse(await styleFile.async('string'));
    const out = parse(await target.file('word/styles.xml').async('string'));
    const originals = nodes(styles, W, 'style');
    const defaultStyle = originals.find(node => node.getAttributeNS(W, 'type') === 'paragraph' && ['1', 'true'].includes(node.getAttributeNS(W, 'default')));
    if (defaultStyle) defaultParagraph = stylePrefix + defaultStyle.getAttributeNS(W, 'styleId');
    const base = out.createElementNS(W, 'w:style'); base.setAttributeNS(W, 'w:type', 'paragraph'); base.setAttributeNS(W, 'w:styleId', `${stylePrefix}Base`);
    for (const name of ['pPrDefault', 'rPrDefault']) {
      const defaults = nodes(styles, W, name)[0]?.firstElementChild;
      if (defaults) base.appendChild(out.importNode(defaults, true));
    }
    out.documentElement.appendChild(base);
    for (const style of originals) {
      const clone = out.importNode(style, true); clone.removeAttributeNS(W, 'default');
      clone.setAttributeNS(W, 'w:styleId', stylePrefix + clone.getAttributeNS(W, 'styleId'));
      for (const name of ['basedOn', 'next', 'link']) for (const node of nodes(clone, W, name)) node.setAttributeNS(W, 'w:val', stylePrefix + node.getAttributeNS(W, 'val'));
      if (clone.getAttributeNS(W, 'type') === 'paragraph' && !nodes(clone, W, 'basedOn').length) { const baseRef = out.createElementNS(W, 'w:basedOn'); baseRef.setAttributeNS(W, 'w:val', `${stylePrefix}Base`); clone.insertBefore(baseRef, [...clone.children].find(node => !['name', 'aliases'].includes(node.localName)) || null); }
      out.documentElement.appendChild(clone);
    }
    target.file('word/styles.xml', xml(out));
  }
  async function copy(name) {
    if (copied.has(name)) return;
    const entry = source.file(name); if (!entry) throw new Error(`Parte DOCX mancante: ${name}`);
    copied.add(name);
    let data = await entry.async('uint8array');
    if (/\.(xml|rels)$/.test(name)) {
      const part = parse(new TextDecoder().decode(data));
      if (nodes(part, W, 'numPr').length) throw new Error('Intestazioni con numerazione complessa non ancora supportate: esportazione bloccata per conservare i dati.');
      for (const tag of ['pStyle', 'rStyle', 'tblStyle']) for (const node of nodes(part, W, tag)) node.setAttributeNS(W, 'w:val', stylePrefix + node.getAttributeNS(W, 'val'));
      for (const paragraph of nodes(part, W, 'p')) if (!nodes(paragraph, W, 'pStyle').length) {
        let props = [...paragraph.children].find(node => node.namespaceURI === W && node.localName === 'pPr');
        if (!props) { props = part.createElementNS(W, 'w:pPr'); paragraph.insertBefore(props, paragraph.firstChild); }
        const style = part.createElementNS(W, 'w:pStyle'); style.setAttributeNS(W, 'w:val', defaultParagraph); props.insertBefore(style, props.firstChild);
      }
      data = new TextEncoder().encode(xml(part));
    }
    target.file(PREFIX + name, data);
    const relName = relPath(name), relFile = source.file(relName);
    if (relFile) {
      const rels = parse(await relFile.async('string'));
      for (const rel of nodes(rels, PKG, 'Relationship')) if (rel.getAttribute('TargetMode') !== 'External') {
        if (!rel.getAttribute('Type').endsWith('/image')) throw new Error('Intestazione con dipendenze non supportate: esportazione bloccata per conservare i dati.');
        const destination = resolvePart(name, rel.getAttribute('Target'));
        await copy(destination);
        // Absolute targets must also point inside the preserved graph.
        if (rel.getAttribute('Target').startsWith('/')) rel.setAttribute('Target', `/${PREFIX}${destination}`);
      }
      target.file(PREFIX + relName, xml(rels)); copied.add(relName);
    }
  }
  const section = nodes(body, W, 'sectPr')[0], anchor = section.firstChild;
  let count = 0;
  for (const ref of refs) {
    const rel = nodes(relationships, PKG, 'Relationship').find(node => node.getAttribute('Id') === ref.getAttributeNS(R, 'id'));
    if (!rel || rel.getAttribute('TargetMode') === 'External') throw new Error('Riferimento intestazione DOCX non valido.');
    const name = resolvePart('word/document.xml', rel.getAttribute('Target')); await copy(name);
    const id = `cosmo-preserved-${++count}`;
    const newRel = outRels.createElementNS(PKG, 'Relationship'); newRel.setAttribute('Id', id); newRel.setAttribute('Type', rel.getAttribute('Type')); newRel.setAttribute('Target', `cosmoffice-preserved/${name}`); outRels.documentElement.appendChild(newRel);
    const newRef = body.importNode(ref, true); newRef.setAttributeNS(R, 'r:id', id); section.insertBefore(newRef, anchor);
  }
  const title = nodes(sourceDoc, W, 'titlePg')[0]; if (title) section.insertBefore(body.importNode(title, true), [...section.children].find(node => ['textDirection', 'bidi', 'rtlGutter', 'docGrid', 'printerSettings', 'sectPrChange'].includes(node.localName)) || null);
  for (const node of [...sourceTypes.documentElement.children]) {
    if (node.localName === 'Override' && copied.has(node.getAttribute('PartName').replace(/^\//, ''))) { const clone = types.importNode(node, true); clone.setAttribute('PartName', `/${PREFIX}${node.getAttribute('PartName').slice(1)}`); types.documentElement.appendChild(clone); }
    if (node.localName === 'Default' && ![...types.documentElement.children].some(other => other.getAttribute('Extension') === node.getAttribute('Extension'))) types.documentElement.appendChild(types.importNode(node, true));
  }
  const settingsFile = source.file('word/settings.xml');
  if (settingsFile && target.file('word/settings.xml')) {
    const settings = parse(await settingsFile.async('string')), out = parse(await target.file('word/settings.xml').async('string'));
    for (const node of nodes(settings, W, 'evenAndOddHeaders')) out.documentElement.appendChild(out.importNode(node, true));
    target.file('word/settings.xml', xml(out));
  }
  target.file('word/document.xml', xml(body)); target.file('word/_rels/document.xml.rels', xml(outRels)); target.file('[Content_Types].xml', xml(types));
  return target.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}
