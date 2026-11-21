import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ImageRun } from 'docx';

const headings = [null, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
const alignments = { left: AlignmentType.LEFT, center: AlignmentType.CENTER, right: AlignmentType.RIGHT, justify: AlignmentType.JUSTIFIED };
function inline(node) {
  if (node.type === 'hardBreak') return new TextRun({ break: 1 });
  const marks = new Set(node.marks?.map(mark => mark.type));
  return new TextRun({ text: node.text || '', bold: marks.has('bold'), italics: marks.has('italic'), underline: marks.has('underline') ? {} : undefined, strike: marks.has('strike'), font: marks.has('code') ? 'Consolas' : undefined });
}
function blocks(nodes = [], context = {}) {
  return nodes.flatMap(node => {
    if (node.type === 'table') return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: node.content.map(row => new TableRow({ children: row.content.map(cell => new TableCell({ children: blocks(cell.content), columnSpan: cell.attrs?.colspan || 1, rowSpan: cell.attrs?.rowspan || 1 })) })) })];
    if (node.type === 'bulletList' || node.type === 'orderedList') {
      return node.content.flatMap(item => blocks(item.content, { ...context, list: node.type, level: (context.level ?? -1) + 1 }));
    }
    if (node.type === 'blockquote') return blocks(node.content, { ...context, quote: true });
    if (node.type === 'image') {
      const match = /^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/.exec(node.attrs.src);
      if (!match) return [new Paragraph({ children: [new TextRun('[Immagine non esportabile]')] })];
      const data = Uint8Array.from(atob(match[2]), c => c.charCodeAt(0));
      return [new Paragraph({ children: [new ImageRun({ data, type: match[1] === 'jpg' ? 'jpg' : match[1] === 'jpeg' ? 'jpg' : match[1], transformation: { width: 440, height: 280 } })] })];
    }
    const options = {
      children: node.content?.map(inline) || [],
      heading: node.type === 'heading' ? headings[node.attrs?.level || 1] : undefined,
      alignment: alignments[node.attrs?.textAlign],
      spacing: { after: 160, line: 300 },
      indent: context.quote ? { left: 480 } : undefined,
      bullet: context.list === 'bulletList' ? { level: Math.min(context.level, 8) } : undefined,
      numbering: context.list === 'orderedList' ? { reference: 'cosmo-numbered', level: Math.min(context.level, 8) } : undefined,
    };
    if (node.type === 'horizontalRule') options.border = { bottom: { color: 'CBD5E1', size: 6, style: 'single' } };
    return [new Paragraph(options)];
  });
}
export async function exportDocument(json, title = 'Documento') {
  const doc = new Document({
    creator: 'Cosmonet', title,
    styles: { default: { document: { run: { font: 'Calibri', size: 24 } } } },
    numbering: { config: [{ reference: 'cosmo-numbered', levels: Array.from({ length: 9 }, (_, level) => ({ level, format: 'decimal', text: `%${level + 1}.`, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720 * (level + 1), hanging: 260 } } } })) }] },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } }, children: blocks(json.content) }],
  });
  return new Uint8Array(await Packer.toArrayBuffer(doc));
}
