import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bold, Italic, Euro, Percent, Plus, Check, Undo2, Redo2, Download, Copy, Trash2, Pencil, LoaderCircle } from 'lucide-react';
import Papa from 'papaparse';
import { usePreferences } from './preferences.jsx';
import { openWorkbook, exportWorkbook, rawValue, setCellInput, calculatorFor, exportDelimited, pasteRange, snapshotWorkbook, snapshotWorksheet } from './workbooks.mjs';
import { columnName, parseAddress, SUPPORTED_FUNCTIONS } from './formulas.mjs';
import { saveFile, downloadName } from './files.mjs';

function bounds(start, end) {
  const a = parseAddress(start), b = parseAddress(end);
  return { r0: Math.min(a.row, b.row), r1: Math.max(a.row, b.row), c0: Math.min(a.col, b.col), c1: Math.max(a.col, b.col) };
}
function Tool({ label, onClick, active, disabled, children }) {
  return <button className={`tool ${active ? 'selected' : ''}`} type="button" aria-label={label} title={label} disabled={disabled} onMouseDown={e => e.preventDefault()} onClick={onClick}>{children}</button>;
}
function rewriteSheet(formula, oldName, newName) {
  return formula.replace(/"(?:[^"]|"")*"|'(?:[^']|'')*'!|[A-Za-z_À-ÿ][A-Za-z0-9_.À-ÿ]*!/g, token => {
    if (token.startsWith('"')) return token;
    const name = token.startsWith("'") ? token.slice(1, -2).replaceAll("''", "'") : token.slice(0, -1);
    return name.toLocaleLowerCase() === oldName.toLocaleLowerCase() ? `'${newName.replaceAll("'", "''")}'!` : token;
  });
}
export default function GridEditor({ record, onEdit, api, onError }) {
  const { settings } = usePreferences();
  const [book, setBook] = useState(null), [sheetId, setSheetId] = useState(null);
  const [revision, setRevision] = useState(0), [selected, setSelected] = useState('A1'), [rangeEnd, setRangeEnd] = useState('A1');
  const [formula, setFormula] = useState(''), [rows, setRows] = useState(settings.gridRows), [cols, setCols] = useState(settings.gridCols);
  const [sheetDialog, setSheetDialog] = useState(null), [sheetName, setSheetName] = useState('');
  const history = useRef({ undo: [], redo: [] });
  useEffect(() => {
    let cancelled = false;
    openWorkbook(record.payload).then(value => { if (!cancelled) { setBook(value); activate(value.worksheets[0]); } }).catch(error => onError(`Foglio non leggibile: ${error.message}`));
    return () => { cancelled = true; };
  }, []);
  const sheet = book?.getWorksheet(sheetId);
  const calc = useMemo(() => sheet ? calculatorFor(sheet) : () => '', [sheet, revision]);
  const area = bounds(selected, rangeEnd);
  useEffect(() => { if (sheet) setFormula(String(rawValue(sheet.getCell(selected)))); }, [sheet, selected, revision]);
  useEffect(() => { if (book) api.current = { export: () => exportWorkbook(book), snapshot: async () => new Uint8Array(await book.xlsx.writeBuffer()) }; }, [book, api]);
  function activate(target) {
    setSheetId(target.id); setSelected('A1'); setRangeEnd('A1');
    setRows(Math.max(settings.gridRows, Math.min(target.rowCount + 5, 500))); setCols(Math.max(settings.gridCols, Math.min(target.columnCount + 2, 40)));
  }
  function checkpoint() {
    const model = snapshotWorkbook(book);
    if (JSON.stringify(model).length > 8 * 1024 * 1024) { history.current = { undo: [], redo: [] }; onError('Annulla non disponibile per questa cartella grande. Esporta una copia prima di modifiche importanti.'); return; }
    history.current.undo.push({ model, sheetId });
    if (history.current.undo.length > 15) history.current.undo.shift();
    history.current.redo = [];
  }
  function changed() { setRevision(n => n + 1); onEdit(async () => new Uint8Array(await book.xlsx.writeBuffer())); }
  function restore(direction) {
    const stack = history.current[direction]; if (!stack.length) return;
    const entry = stack.pop(); history.current[direction === 'undo' ? 'redo' : 'undo'].push({ model: snapshotWorkbook(book), sheetId });
    book.model = structuredClone(entry.model); activate(book.getWorksheet(entry.sheetId) || book.worksheets[0]); changed();
  }
  function forSelection(fn) {
    if ((area.r1 - area.r0 + 1) * (area.c1 - area.c0 + 1) > 10000) throw new Error('Seleziona al massimo 10.000 celle.');
    for (let r = area.r0; r <= area.r1; r++) for (let c = area.c0; c <= area.c1; c++) fn(sheet.getCell(r, c));
  }
  function commit(address, value) {
    if (!sheet || String(rawValue(sheet.getCell(address))) === value) return;
    checkpoint(); setCellInput(sheet.getCell(address), value); changed();
  }
  function format(type) {
    checkpoint(); const current = sheet.getCell(selected); const enabled = !current.font?.[type]; const decimals = settings.decimalPlaces ? '.' + '0'.repeat(settings.decimalPlaces) : '';
    forSelection(cell => {
      if (type === 'bold' || type === 'italic') cell.font = { ...cell.font, [type]: enabled };
      else cell.numFmt = type === 'euro' ? `#,##0${decimals} \"€\"` : type === 'percent' ? `0${decimals}%` : type === 'decimal' ? `#,##0${decimals}` : 'General';
    }); changed();
  }
  function paste(event) {
    const text = event.clipboardData.getData('text/plain'); if (!/[\t\r\n]/.test(text)) return;
    event.preventDefault(); event.target.blur();
    try {
      checkpoint(); const size = pasteRange(sheet, selected, text), origin = parseAddress(selected);
      const endRow = origin.row + size.rows - 1, endCol = origin.col + size.cols - 1;
      setRows(n => Math.max(n, Math.min(endRow + 3, 1000))); setCols(n => Math.max(n, Math.min(endCol + 2, 60)));
      setRangeEnd(`${columnName(endCol)}${endRow}`); changed();
    } catch (error) { onError(error.message); }
  }
  function copy(event) {
    if (selected === rangeEnd) return;
    event.preventDefault(); const data = [];
    for (let r = area.r0; r <= area.r1; r++) { const line = []; for (let c = area.c0; c <= area.c1; c++) line.push(rawValue(sheet.getCell(r, c))); data.push(line); }
    event.clipboardData.setData('text/plain', Papa.unparse(data, { delimiter: '\t' }));
  }
  function onKey(event) {
    if ((event.ctrlKey || event.metaKey) && ['z', 'y'].includes(event.key.toLowerCase())) { event.preventDefault(); event.target.blur(); restore(event.key.toLowerCase() === 'y' || event.shiftKey ? 'redo' : 'undo'); }
    if (event.key === 'Delete' && selected !== rangeEnd) { event.preventDefault(); event.target.blur(); checkpoint(); forSelection(cell => { cell.value = null; }); changed(); }
  }
  async function exportCsv() {
    try { await saveFile(downloadName(`${record.name}-${sheet.name}`, settings.csvDelimiter === '\t' ? 'tsv' : 'csv'), exportDelimited(sheet, settings.csvDelimiter), 'text/csv;charset=utf-8'); }
    catch (error) { onError(`Esportazione CSV non riuscita: ${error.message}`); }
  }
  function rename() {
    try {
      const name = sheetName.trim();
      if (!name || name.length > 31 || /[\/*?:[\]\\]/.test(name) || name.startsWith("'") || name.endsWith("'")) throw new Error('Usa un nome da 1 a 31 caratteri senza / \\ * ? : [ ].');
      if (book.worksheets.some(s => s.id !== sheet.id && s.name.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error('Questo nome è già usato.');
      checkpoint(); const oldName = sheet.name; sheet.name = name;
      for (const item of book.worksheets) item.eachRow(row => row.eachCell(cell => { if (cell.formula) { const formula = rewriteSheet(cell.formula, oldName, name); if (formula !== cell.formula) cell.value = { formula }; } }));
      setSheetDialog(null); changed();
    } catch (error) { onError(error.message); }
  }
  function duplicate() {
    if (sheet.getTables().length) { onError('La duplicazione di fogli con tabelle Excel strutturate non è ancora supportata. Esporta una copia della cartella per conservarne la struttura.'); return; }
    checkpoint(); let n = 2, name = `${sheet.name.slice(0, 25)} (${n})`; while (book.getWorksheet(name)) name = `${sheet.name.slice(0, 25)} (${++n})`;
    const model = snapshotWorksheet(sheet);
    const copy = book.addWorksheet(name), id = copy.id; copy.model = { ...model, id, name }; activate(copy); changed();
  }
  if (!book || !sheet) return <div className="loading-editor"><LoaderCircle className="spin"/> Apertura del foglio…</div>;
  const current = sheet.getCell(selected), values = [];
  for (let r = area.r0; r <= Math.min(area.r1, area.r0 + 999); r++) for (let c = area.c0; c <= area.c1; c++) { const v = calc(`${columnName(c)}${r}`); if (typeof v === 'number') values.push(v); }
  return <div className={`editor-body grid-editor ${settings.gridLines ? '' : 'no-gridlines'}`} onPaste={paste} onCopy={copy} onKeyDown={onKey}>
    <div className="toolbar" role="toolbar" aria-label="Strumenti foglio di calcolo">
      <div className="tool-group"><Tool label="Annulla modifica foglio" disabled={!history.current.undo.length} onClick={() => restore('undo')}><Undo2 size={17}/></Tool><Tool label="Ripristina modifica foglio" disabled={!history.current.redo.length} onClick={() => restore('redo')}><Redo2 size={17}/></Tool></div>
      <div className="tool-group"><Tool label="Grassetto cella" active={!!current.font?.bold} onClick={() => format('bold')}><Bold size={17}/></Tool><Tool label="Corsivo cella" active={!!current.font?.italic} onClick={() => format('italic')}><Italic size={17}/></Tool></div>
      <div className="tool-group"><Tool label="Formato euro" onClick={() => format('euro')}><Euro size={17}/></Tool><Tool label="Formato percentuale" onClick={() => format('percent')}><Percent size={17}/></Tool><button className="text-tool" onClick={() => format('decimal')}>0,00</button><button className="text-tool" onClick={() => format('general')}>Generale</button></div>
      <div className="tool-group"><button className="text-tool" onClick={() => setRows(r => Math.min(r + 20, 1000))}><Plus size={15}/> 20 righe</button><button className="text-tool" onClick={() => setCols(c => Math.min(c + 4, 60))}><Plus size={15}/> 4 colonne</button></div>
      <button className="text-tool" onClick={exportCsv}><Download size={16}/> Esporta CSV</button><span className="grid-scope">{SUPPORTED_FUNCTIONS.length} funzioni · Riferimenti tra fogli</span>
    </div>
    <div className="formula-bar"><span className="cell-address">{selected === rangeEnd ? selected : `${selected}:${rangeEnd}`}</span><span className="fx">ƒx</span><input aria-label="Formula o valore della cella selezionata" value={formula} onChange={e => setFormula(e.target.value)} onBlur={() => commit(selected, formula)} onKeyDown={e => { if (e.key === 'Enter') { commit(selected, formula); e.currentTarget.blur(); } if (e.key === 'Escape') setFormula(String(rawValue(current))); }}/><button className="icon-button" aria-label="Applica valore" onClick={() => commit(selected, formula)}><Check size={17}/></button></div>
    <div className="spreadsheet-scroll"><table className="spreadsheet" aria-label={`Foglio ${sheet.name}`}><colgroup><col style={{ width: 48 }}/>{Array.from({ length: cols }, (_, c) => <col key={c} style={{ width: Math.max(110, Math.min(300, (sheet.getColumn(c + 1).width || 16) * 8)) }}/>)}</colgroup><thead><tr><th aria-label="Angolo del foglio"/>{Array.from({ length: cols }, (_, c) => <th key={c}>{columnName(c + 1)}</th>)}</tr></thead><tbody>{Array.from({ length: rows }, (_, r) => <tr key={`${sheet.id}-${r}`}><th scope="row">{r + 1}</th>{Array.from({ length: cols }, (_, c) => {
      const address = `${columnName(c + 1)}${r + 1}`, cell = sheet.getCell(address), value = calc(address); let display = value;
      const digits = /0\.(0+)/.exec(cell.numFmt || '')?.[1].length;
      if (cell.value instanceof Date) display = cell.value.toLocaleDateString(settings.gridLocale);
      else if (typeof value === 'number') display = cell.numFmt?.includes('%') ? `${(value * 100).toLocaleString(settings.gridLocale, { maximumFractionDigits: 2 })}%` : cell.numFmt?.includes('€') ? value.toLocaleString(settings.gridLocale, { style: 'currency', currency: 'EUR' }) : value.toLocaleString(settings.gridLocale, { minimumFractionDigits: digits ?? 0, maximumFractionDigits: digits ?? 8 });
      if (typeof value === 'boolean') display = value ? 'VERO' : 'FALSO';
      const bg = cell.fill?.fgColor?.argb, fg = cell.font?.color?.argb, within = r + 1 >= area.r0 && r + 1 <= area.r1 && c + 1 >= area.c0 && c + 1 <= area.c1;
      return <GridCell key={`${sheet.id}-${address}`} address={address} raw={String(rawValue(cell))} display={String(display)} selected={selected === address} within={within && selected !== rangeEnd} numeric={typeof value === 'number'} error={String(value).startsWith('#')} style={{ fontWeight: cell.font?.bold ? 700 : undefined, fontStyle: cell.font?.italic ? 'italic' : undefined, backgroundColor: bg?.length === 8 ? `#${bg.slice(2)}` : undefined, color: fg?.length === 8 ? `#${fg.slice(2)}` : undefined }} onSelect={() => { setSelected(address); setRangeEnd(address); }} onExtend={() => setRangeEnd(address)} onCommit={value => commit(address, value)}/>;
    })}</tr>)}</tbody></table></div>
    <div className="sheet-tabs"><button className="icon-button" aria-label="Aggiungi foglio" onClick={() => { checkpoint(); let n = book.worksheets.length + 1; while (book.getWorksheet(`Foglio ${n}`)) n++; activate(book.addWorksheet(`Foglio ${n}`)); changed(); }}><Plus size={18}/></button>{book.worksheets.map(s => <button key={s.id} className={s.id === sheetId ? 'sheet-tab active' : 'sheet-tab'} onClick={() => activate(s)} onDoubleClick={() => { setSheetName(s.name); setSheetDialog('rename'); }}>{s.name}</button>)}<div className="sheet-actions"><Tool label="Rinomina foglio" onClick={() => { setSheetName(sheet.name); setSheetDialog('rename'); }}><Pencil size={14}/></Tool><Tool label="Duplica foglio" onClick={duplicate}><Copy size={15}/></Tool><Tool label="Elimina foglio" disabled={book.worksheets.length < 2} onClick={() => setSheetDialog('delete')}><Trash2 size={15}/></Tool></div></div>
    <div className="editor-status"><span>{book.worksheets.length} {book.worksheets.length === 1 ? 'foglio' : 'fogli'}<i/>{selected === rangeEnd ? `Cella ${selected}` : `${selected}:${rangeEnd} · Somma: ${values.reduce((a, b) => a + b, 0).toLocaleString(settings.gridLocale)} · Numeri: ${values.length}`}</span><span>Shift + clic per selezionare · Incolla intervalli con Ctrl+V</span></div>
    {sheetDialog && <div className="modal-backdrop"><form className="modal" role="dialog" aria-modal="true" aria-label={sheetDialog === 'delete' ? 'Elimina foglio' : 'Rinomina foglio'} onSubmit={event => { event.preventDefault(); if (sheetDialog === 'rename') rename(); else { checkpoint(); book.removeWorksheet(sheet.id); activate(book.worksheets[0]); setSheetDialog(null); changed(); } }}><h2>{sheetDialog === 'delete' ? 'Eliminare questo foglio?' : 'Rinomina il foglio'}</h2>{sheetDialog === 'delete' ? <p>Il foglio «{sheet.name}» verrà rimosso dalla bozza. I riferimenti al foglio eliminato mostreranno un errore. Puoi annullare l’operazione.</p> : <input className="dialog-input" autoFocus aria-label="Nuovo nome foglio" maxLength={31} value={sheetName} onChange={e => setSheetName(e.target.value)}/>}<div className="modal-actions"><button type="button" className="button secondary" onClick={() => setSheetDialog(null)}>Annulla</button><button className={`button ${sheetDialog === 'delete' ? 'danger' : 'primary'}`}>{sheetDialog === 'delete' ? 'Elimina foglio' : 'Salva nome'}</button></div></form></div>}
  </div>;
}
function GridCell({ address, raw, display, selected, within, numeric, error, style, onSelect, onExtend, onCommit }) {
  const [editing, setEditing] = useState(false), [value, setValue] = useState(raw); const cancel = useRef(false);
  useEffect(() => { if (!editing) setValue(raw); }, [raw, editing]);
  return <td className={`${selected ? 'selected-cell' : ''} ${within ? 'range-cell' : ''} ${error ? 'error-cell' : ''}`} style={style}><input data-address={address} aria-label={`Cella ${address}`} title={error ? `${raw} → ${display}` : undefined} style={{ textAlign: numeric && !editing ? 'right' : undefined }} value={editing ? value : display} onMouseDown={e => { if (e.shiftKey) { e.preventDefault(); onExtend(); } }} onFocus={() => { cancel.current = false; setEditing(true); setValue(raw); onSelect(); }} onChange={e => setValue(e.target.value)} onBlur={() => { if (editing && !cancel.current) onCommit(value); setEditing(false); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onCommit(value); setEditing(false); e.currentTarget.blur(); const p = parseAddress(address); document.querySelector(`[data-address="${columnName(p.col)}${p.row + 1}"]`)?.focus(); } if (e.key === 'Escape') { cancel.current = true; setValue(raw); setEditing(false); e.currentTarget.blur(); } }}/></td>;
}
