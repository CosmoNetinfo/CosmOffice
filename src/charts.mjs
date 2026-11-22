import JSZip from 'jszip';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { parseAddress, columnName } from './formulas.mjs';
import { calculatorFor } from './workbooks.mjs';

const C = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
const A = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const P = 'http://schemas.openxmlformats.org/package/2006/relationships';
const XDR = 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing';
const S = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const CT = 'http://schemas.openxmlformats.org/package/2006/content-types';
export const unsupportedChartMessage = 'Questa cartella contiene grafici importati non modificabili da CosmOffice. Per conservare i grafici la cartella è in sola lettura e l’esportazione XLSX è bloccata. Apri l’originale in Excel o LibreOffice.';
export const chartModels = book => book.properties.cosmoCharts || [];
const escape = value => String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const xml = content => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${content}`;
function parse(text) {
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new Error('Dichiarazioni XML non consentite.');
  return new DOMParser({ onError: level => { if (level !== 'warning') throw new Error('XML del grafico non valido.'); } }).parseFromString(text, 'application/xml');
}
const serialize = doc => new XMLSerializer().serializeToString(doc);
const list = (doc, ns, tag) => Array.from(doc.getElementsByTagNameNS(ns, tag));
function append(doc, content) { doc.documentElement.appendChild(doc.importNode(parse(content).documentElement, true)); }
function addRelation(doc, type, target) {
  let n = 1; const ids = new Set(list(doc, P, 'Relationship').map(node => node.getAttribute('Id')));
  while (ids.has(`cosmo${n}`)) n++;
  const id = `cosmo${n}`;
  append(doc, `<Relationship xmlns="${P}" Id="${id}" Type="${R}/${type}" Target="${escape(target)}"/>`);
  return id;
}
const relationships = () => parse(xml(`<Relationships xmlns="${P}"/>`));
function normalizePath(base, target) {
  const parts = target.startsWith('/') ? [] : base.split('/').slice(0, -1);
  for (const part of target.split('/')) { if (part === '..') parts.pop(); else if (part && part !== '.') parts.push(part); }
  return parts.join('/');
}
function validate(model) {
  if (!model || !/^[a-zA-Z0-9-]{1,60}$/.test(model.id) || !['bar', 'line', 'pie'].includes(model.type) || !Number.isInteger(model.sheetId) || typeof model.headers !== 'boolean' || !['right', 'bottom', 'none'].includes(model.legend)) throw new Error('Impostazioni grafico non valide.');
  const a = parseAddress(model.start), b = parseAddress(model.end);
  if (a.row > b.row || a.col >= b.col || b.row - a.row < (model.headers ? 1 : 0) || (b.row - a.row + 1) * (b.col - a.col + 1) > 10000 || b.col - a.col > 20) throw new Error('Seleziona un intervallo con categorie nella prima colonna e valori nelle successive, massimo 10.000 celle e 20 serie. Con intestazioni serve almeno una riga di dati.');
  for (const key of ['title', 'axisX', 'axisY']) if (typeof model[key] !== 'string' || model[key].length > 200) throw new Error('Titoli del grafico troppo lunghi.');
  for (const key of ['labels', 'seriesNames']) if (!Array.isArray(model[key]) || model[key].length > 10000 || model[key].some(value => typeof value !== 'string' || value.length > 200)) throw new Error('Etichette del grafico non valide.');
  return { a, b };
}
export function chartData(book, model) {
  const { a, b } = validate(model), sheet = book.getWorksheet(model.sheetId);
  if (!sheet) throw new Error('Il foglio del grafico non esiste.');
  const calc = calculatorFor(sheet), first = a.row + (model.headers ? 1 : 0);
  const labels = [], series = [];
  for (let row = first; row <= b.row; row++) labels.push(model.labels[row - first] || String(calc(`${columnName(a.col)}${row}`) ?? ''));
  for (let col = a.col + 1; col <= (model.type === 'pie' ? a.col + 1 : b.col); col++) {
    const values = [];
    for (let row = first; row <= b.row; row++) {
      const result = calc.result(`${columnName(col)}${row}`);
      values.push(!result.error && typeof result.value === 'number' && Number.isFinite(result.value) ? result.value : null);
    }
    series.push({ name: model.seriesNames[col - a.col - 1] || (model.headers ? String(calc(`${columnName(col)}${a.row}`) ?? '') : `Serie ${col - a.col}`), values, col });
  }
  return { sheet, first, last: b.row, categoryCol: a.col, labels, series };
}
export function newChart(book, sheetId, start, end, type) {
  if (chartModels(book).length >= 100) throw new Error('Sono supportati al massimo 100 grafici per cartella.');
  const model = { id: crypto.randomUUID(), sheetId, start, end, type, title: 'Nuovo grafico', headers: true, legend: 'right', axisX: '', axisY: '', labels: [], seriesNames: [] };
  chartData(book, model); return model;
}
// Le etichette personalizzate usano celle reali in un foglio tecnico nascosto:
// LibreOffice perde le categorie espresse solo come c:strLit durante il risalvataggio.
export function prepareCharts(book) {
  const models = chartModels(book).filter(model => book.getWorksheet(model.sheetId));
  book.properties.cosmoCharts = models;
  delete book.properties.cosmoChartDataSheetName;
  if (!models.some(model => model.labels.some(Boolean))) return;
  let name = '_CosmoGrafici', index = 1;
  while (book.worksheets.some(sheet => sheet.name.toLowerCase() === name.toLowerCase())) name = `_CosmoGrafici${index++}`;
  const sheet = book.addWorksheet(name, { state: 'veryHidden' });
  book.properties.cosmoChartDataSheetName = name;
  models.forEach((model, col) => {
    if (model.labels.some(Boolean)) chartData(book, model).labels.forEach((label, row) => { sheet.getCell(row + 1, col + 1).value = label; });
  });
}
const richTitle = title => `<c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="it-IT"/><a:t>${escape(title)}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title>`;
const strCache = values => `<c:ptCount val="${values.length}"/>${values.map((value, index) => `<c:pt idx="${index}"><c:v>${escape(value)}</c:v></c:pt>`).join('')}`;
export function chartXml(book, model) {
  const data = chartData(book, model);
  const ref = col => `'${data.sheet.name.replaceAll("'", "''")}'!$${columnName(col)}$${data.first}:$${columnName(col)}$${data.last}`;
  const labelsRef = model.labels.some(Boolean) ? `'${book.properties.cosmoChartDataSheetName.replaceAll("'", "''")}'!$${columnName(chartModels(book).findIndex(item => item.id === model.id) + 1)}$1:$${columnName(chartModels(book).findIndex(item => item.id === model.id) + 1)}$${data.labels.length}` : ref(data.categoryCol);
  const cats = `<c:strRef><c:f>${escape(labelsRef)}</c:f><c:strCache>${strCache(data.labels)}</c:strCache></c:strRef>`;
  const series = data.series.map((serie, index) => `<c:ser><c:idx val="${index}"/><c:order val="${index}"/><c:tx><c:v>${escape(serie.name)}</c:v></c:tx>${model.type === 'line' ? '<c:marker><c:symbol val="circle"/><c:size val="5"/></c:marker>' : ''}<c:cat>${cats}</c:cat><c:val><c:numRef><c:f>${escape(ref(serie.col))}</c:f><c:numCache><c:formatCode>General</c:formatCode><c:ptCount val="${serie.values.length}"/>${serie.values.map((value, i) => value === null ? '' : `<c:pt idx="${i}"><c:v>${value}</c:v></c:pt>`).join('')}</c:numCache></c:numRef></c:val>${model.type === 'line' ? '<c:smooth val="0"/>' : ''}</c:ser>`).join('');
  const type = model.type === 'bar' ? 'barChart' : model.type === 'line' ? 'lineChart' : 'pieChart';
  const options = model.type === 'bar' ? '<c:barDir val="col"/><c:grouping val="clustered"/>' : model.type === 'line' ? '<c:grouping val="standard"/>' : '';
  const axisIds = model.type === 'pie' ? '' : '<c:axId val="100"/><c:axId val="200"/>';
  const axes = model.type === 'pie' ? '' : `<c:catAx><c:axId val="100"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/>${model.axisX ? richTitle(model.axisX) : ''}<c:crossAx val="200"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/></c:catAx><c:valAx><c:axId val="200"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:majorGridlines/>${model.axisY ? richTitle(model.axisY) : ''}<c:numFmt formatCode="General" sourceLinked="1"/><c:crossAx val="100"/><c:crosses val="autoZero"/><c:crossBetween val="between"/></c:valAx>`;
  return xml(`<c:chartSpace xmlns:c="${C}" xmlns:a="${A}" xmlns:r="${R}"><c:lang val="it-IT"/><c:chart>${model.title ? richTitle(model.title) : ''}<c:plotArea><c:layout/><c:${type}>${options}<c:varyColors val="${model.type === 'pie' ? 1 : 0}"/>${series}${model.type === 'bar' ? '<c:gapWidth val="150"/>' : ''}${axisIds}</c:${type}>${axes}</c:plotArea>${model.legend === 'none' ? '' : `<c:legend><c:legendPos val="${model.legend === 'bottom' ? 'b' : 'r'}"/><c:overlay val="0"/></c:legend>`}<c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart></c:chartSpace>`);
}

export async function readCharts(book, bytes) {
  const zip = await JSZip.loadAsync(bytes);
  const parts = Object.keys(zip.files).filter(name => /^xl\/charts\/.*\.xml$/i.test(name));
  if (!parts.length) return;
  try {
    const file = zip.file('customXml/cosmoCharts.xml');
    if (!file || file._data.uncompressedSize > 2000000) throw new Error('Grafici di origine esterna.');
    const metadata = JSON.parse(parse(await file.async('string')).documentElement.textContent);
    if (metadata.version !== 1 || !Array.isArray(metadata.charts) || metadata.charts.length !== parts.length || parts.length > 100) throw new Error('Metadati grafici non riconosciuti.');
    const seen = new Set();
    book.properties.cosmoCharts = metadata.charts;
    book.properties.cosmoChartDataSheetName = metadata.dataSheet;
    const dataSheet = metadata.dataSheet && book.getWorksheet(metadata.dataSheet);
    if (dataSheet && metadata.charts.some(model => model.sheetId === dataSheet.id)) throw new Error('Foglio etichette non separato dai dati.');
    if (metadata.charts.some(model => model.labels?.some(Boolean)) && (!dataSheet || dataSheet.state !== 'veryHidden')) throw new Error('Foglio etichette non valido.');
    for (const model of metadata.charts) {
      validate(model);
      const part = `xl/charts/cosmoChart-${model.id}.xml`;
      if (seen.has(part) || !parts.includes(part) || zip.file(part)._data.uncompressedSize > 2000000 || await zip.file(part).async('string') !== chartXml(book, model)) throw new Error('Il grafico è stato modificato da un altro programma.');
      seen.add(part);
      if (model.labels.some(Boolean)) chartData(book, model).labels.forEach((label, row) => {
        if (dataSheet.getCell(row + 1, metadata.charts.indexOf(model) + 1).value !== label) throw new Error('Etichette modificate da un altro programma.');
      });
    }
    if (dataSheet) book.removeWorksheet(dataSheet.id);
  } catch {
    delete book.properties.cosmoCharts;
    delete book.properties.cosmoChartDataSheetName;
    book.cosmoUnsupportedCharts = true;
    book.cosmoOriginalBytes = new Uint8Array(bytes).slice();
  }
}
export async function writeCharts(book, bytes) {
  if (book.cosmoUnsupportedCharts) throw new Error(unsupportedChartMessage);
  const models = chartModels(book).filter(model => book.getWorksheet(model.sheetId));
  if (!models.length) return bytes;
  if (models.length > 100) throw new Error('Sono supportati al massimo 100 grafici per cartella.');
  const zip = await JSZip.loadAsync(bytes), types = parse(await zip.file('[Content_Types].xml').async('string'));
  const override = (name, contentType) => {
    if (!list(types, CT, 'Override').some(node => node.getAttribute('PartName') === `/${name}`)) append(types, `<Override xmlns="${CT}" PartName="/${escape(name)}" ContentType="${contentType}"/>`);
  };
  for (const sheet of book.worksheets) {
    const charts = models.filter(model => model.sheetId === sheet.id); if (!charts.length) continue;
    const sheetPath = `xl/worksheets/sheet${sheet.id}.xml`, relPath = `xl/worksheets/_rels/sheet${sheet.id}.xml.rels`;
    const doc = parse(await zip.file(sheetPath).async('string'));
    const rels = zip.file(relPath) ? parse(await zip.file(relPath).async('string')) : relationships();
    let drawingNode = list(doc, S, 'drawing')[0], drawingPath;
    if (drawingNode) {
      const id = drawingNode.getAttributeNS(R, 'id');
      const relation = list(rels, P, 'Relationship').find(node => node.getAttribute('Id') === id);
      if (!relation) throw new Error('Relazione disegni del foglio non valida.');
      drawingPath = normalizePath(sheetPath, relation.getAttribute('Target'));
    } else {
      drawingPath = `xl/drawings/cosmoDrawing${sheet.id}.xml`;
      const id = addRelation(rels, 'drawing', `../drawings/cosmoDrawing${sheet.id}.xml`);
      const drawingElement = doc.importNode(parse(`<drawing xmlns="${S}" xmlns:r="${R}" r:id="${id}"/>`).documentElement, true);
      const later = Array.from(doc.documentElement.childNodes).find(node => node.namespaceURI === S && ['legacyDrawing', 'legacyDrawingHF', 'picture', 'oleObjects', 'controls', 'webPublishItems', 'tableParts', 'extLst'].includes(node.localName));
      doc.documentElement.insertBefore(drawingElement, later || null);
    }
    const drawing = zip.file(drawingPath) ? parse(await zip.file(drawingPath).async('string')) : parse(xml(`<xdr:wsDr xmlns:xdr="${XDR}" xmlns:a="${A}"/>`));
    const drawingRelPath = drawingPath.replace(/([^/]+)$/, '_rels/$1.rels');
    const drawingRels = zip.file(drawingRelPath) ? parse(await zip.file(drawingRelPath).async('string')) : relationships();
    let shapeId = Math.max(0, ...list(drawing, XDR, 'cNvPr').map(node => Number(node.getAttribute('id')) || 0));
    for (const [index, model] of charts.entries()) {
      const name = `cosmoChart-${model.id}.xml`, chartPath = `xl/charts/${name}`;
      zip.file(chartPath, chartXml(book, model)); override(chartPath, 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml');
      const id = addRelation(drawingRels, 'chart', `../charts/${name}`);
      const row = Math.min(1048559, parseAddress(model.end).row + 2 + index * 18);
      const marker = (col, row) => `<xdr:col>${col}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${row}</xdr:row><xdr:rowOff>0</xdr:rowOff>`;
      append(drawing, `<xdr:twoCellAnchor xmlns:xdr="${XDR}" xmlns:a="${A}" xmlns:r="${R}"><xdr:from>${marker(0, row)}</xdr:from><xdr:to>${marker(9, row + 16)}</xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${++shapeId}" name="${escape(model.title || 'Grafico')}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="${C}"><c:chart xmlns:c="${C}" r:id="${id}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`);
    }
    zip.file(drawingPath, serialize(drawing)); zip.file(drawingRelPath, serialize(drawingRels));
    override(drawingPath, 'application/vnd.openxmlformats-officedocument.drawingml.drawing+xml');
    zip.file(sheetPath, serialize(doc)); zip.file(relPath, serialize(rels));
  }
  const metadataPath = 'customXml/cosmoCharts.xml';
  zip.file(metadataPath, xml(`<cosmoCharts xmlns="urn:cosmonet:charts:1">${escape(JSON.stringify({ version: 1, charts: models, dataSheet: book.properties.cosmoChartDataSheetName }))}</cosmoCharts>`));
  override(metadataPath, 'application/xml');
  const bookRelsPath = 'xl/_rels/workbook.xml.rels', bookRels = parse(await zip.file(bookRelsPath).async('string'));
  addRelation(bookRels, 'customXml', '../customXml/cosmoCharts.xml');
  zip.file(bookRelsPath, serialize(bookRels)); zip.file('[Content_Types].xml', serialize(types));
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}
