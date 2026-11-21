import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ImageRun } from 'docx';

const headings = [null, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
const alignments = { left: AlignmentType.LEFT, center: AlignmentType.CENTER, right: AlignmentType.RIGHT, justify: AlignmentType.JUSTIFIED };
function hexColor(value) {
  if (/^#[a-f\d]{6}$/i.test(value || '')) return value.slice(1);
  if (/^#[a-f\d]{3}$/i.test(value || '')) return [...value.slice(1)].map(c => c + c).join('');
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,[^)]+)?\)$/.exec(value || '');
  return rgb ? rgb.slice(1, 4).map(n => Math.min(255, Number(n)).toString(16).padStart(2, '0')).join('') : undefined;
}
function inline(node) {
  if (node.type === 'hardBreak') return new TextRun({ break: 1 });
  const marks = new Set(node.marks?.map(mark => mark.type));
  const attrs = node.marks?.find(mark => mark.type === 'textStyle')?.attrs || {};
  const color = hexColor(attrs.color);
  const highlight = hexColor(node.marks?.find(mark => mark.type === 'highlight')?.attrs?.color);
  const px = parseFloat(attrs.fontSize);
  return new TextRun({ text: node.text || '', bold: marks.has('bold'), italics: marks.has('italic'), underline: marks.has('underline') ? {} : undefined, strike: marks.has('strike'), font: attrs.fontFamily || (marks.has('code') ? 'Consolas' : undefined), size: Number.isFinite(px) ? Math.round(px * (attrs.fontSize.endsWith('pt') ? 2 : 1.5)) : undefined, color, shading: highlight ? { fill: highlight, type: 'clear' } : undefined });
}
function blocks(nodes = [], context = {}) {
  return nodes.flatMap(node => {
    if (node.type === 'table') return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: node.content.map(row => new TableRow({ children: row.content.map(cell => new TableCell({ children: blocks(cell.content, context), columnSpan: cell.attrs?.colspan || 1, rowSpan: cell.attrs?.rowspan || 1 })) })) })];
    if (node.type === 'bulletList' || node.type === 'orderedList') {
      return node.content.flatMap(item => blocks(item.content, { ...context, list: node.type, level: (context.level ?? -1) + 1 }));
    }
    if (node.type === 'blockquote') return blocks(node.content, { ...context, quote: true });
    if (node.type === 'image') {
      const match = /^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/.exec(node.attrs.src);
      if (!match) throw new Error('Immagine non supportata: usa PNG, JPEG o GIF oppure converti WebP prima dell’esportazione.');
      const data = Uint8Array.from(atob(match[2]), c => c.charCodeAt(0));
      const width = Number(node.attrs.exportWidth) || 440, height = Number(node.attrs.exportHeight) || 280;
      return [new Paragraph({ children: [new ImageRun({ data, type: match[1] === 'jpg' ? 'jpg' : match[1] === 'jpeg' ? 'jpg' : match[1], transformation: { width, height } })] })];
    }
    const options = {
      children: node.content?.map(inline) || [],
      heading: node.type === 'heading' ? headings[node.attrs?.level || 1] : undefined,
      alignment: alignments[node.attrs?.textAlign],
      spacing: { after: 160, line: Math.round((context.lineHeight || 1.65) * 240) },
      indent: context.quote ? { left: 480 } : undefined,
      bullet: context.list === 'bulletList' ? { level: Math.min(context.level, 8) } : undefined,
      numbering: context.list === 'orderedList' ? { reference: 'cosmo-numbered', level: Math.min(context.level, 8) } : undefined,
    };
    if (node.type === 'horizontalRule') options.border = { bottom: { color: 'CBD5E1', size: 6, style: 'single' } };
    return [new Paragraph(options)];
  });
}
export async function exportDocument(json, title = 'Documento', options = {}) {
  json = structuredClone(json);
  async function prepare(nodes = []) {
    for (const node of nodes) {
      if (node.type === 'image' && typeof window !== 'undefined') {
        const image = new window.Image(); image.src = node.attrs.src;
        await image.decode();
        const ratio = Math.min(1, 600 / image.naturalWidth);
        node.attrs.exportWidth = Math.round(image.naturalWidth * ratio); node.attrs.exportHeight = Math.round(image.naturalHeight * ratio);
        if (node.attrs.src.startsWith('data:image/webp')) { const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight; canvas.getContext('2d').drawImage(image, 0, 0); node.attrs.src = canvas.toDataURL('image/png'); }
      }
      if (node.content) await prepare(node.content);
    }
  }
  await prepare(json.content);
  const margin = Math.round((options.writerMargin || 20) * 56.6929);
  let size = options.writerPaper === 'Letter' ? { width: 12240, height: 15840 } : { width: 11906, height: 16838 };
  if (options.writerOrientation === 'landscape') size = { width: size.height, height: size.width, orientation: 'landscape' };
  const doc = new Document({
    creator: 'Cosmonet', title,
    styles: { default: { document: { run: { font: options.writerFont || 'Calibri', size: (options.writerFontSize || 12) * 2 } } } },
    numbering: { config: [{ reference: 'cosmo-numbered', levels: Array.from({ length: 9 }, (_, level) => ({ level, format: 'decimal', text: `%${level + 1}.`, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720 * (level + 1), hanging: 260 } } } })) }] },
    sections: [{ properties: { page: { size, margin: { top: margin, right: margin, bottom: margin, left: margin } } }, children: blocks(json.content, { lineHeight: options.lineHeight }) }],
  });
  return new Uint8Array(await Packer.toArrayBuffer(doc));
}
