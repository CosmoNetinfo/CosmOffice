import React, { useEffect, useRef, useState } from 'react';
import { TextLayer } from 'pdfjs-dist';
import { usePreferences } from './preferences.jsx';
import { createPdfTask } from './pdf-engine.mjs';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Search, LoaderCircle, FileLock2, Printer } from 'lucide-react';


export default function PdfViewer({ record, api, onError, onEdit }) {
  const { settings } = usePreferences();
  const [pdf, setPdf] = useState(null);
  const [page, setPage] = useState(() => { if (!settings.rememberPdfPage) return 1; try { return Math.max(1, Number(JSON.parse(localStorage.getItem('cosmoffice.pdf-positions.v1') || '{}')[record.id]) || 1); } catch { return 1; } });
  const [pageInput, setPageInput] = useState('1');
  const [scale, setScale] = useState(settings.pdfZoom / 100);
  const [bytes, setBytes] = useState(record.payload);
  const bytesRef = useRef(record.payload);
  const editOperation = useRef(Promise.resolve(record.payload));
  const [editing, setEditing] = useState(false);
  const mounted = useRef(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordPrompt, setPasswordPrompt] = useState('');
  const passwordCallback = useRef(null);
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [matchIndex, setMatchIndex] = useState(-1);
  const [searchState, setSearchState] = useState('');
  const searchRevision = useRef(0);
  const canvas = useRef(null);
  const layer = useRef(null);
  const renderTask = useRef(null);
  const pageText = useRef(new Map());
  const [pageSize, setPageSize] = useState({ width: 655, height: 926 });
  const [printing, setPrinting] = useState(false);
  const printPages = useRef(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  useEffect(() => {
    // PDF.js transfers the buffer to its worker: copy it so the original can still be saved.
    setPdf(null); setLoading(true); setError('');
    const task = createPdfTask(bytes);
    let cancelled = false;
    task.onPassword = (callback, reason) => {
      if (cancelled) return;
      passwordCallback.current = callback;
      setPasswordPrompt(reason === 2 ? 'Password non corretta. Riprova.' : 'Questo PDF richiede una password.');
      setLoading(false);
    };
    task.promise.then(document => { if (!cancelled) { setPdf(document); setPage(n => Math.min(n, document.numPages)); setPasswordPrompt(''); } }).catch(reason => {
      if (!cancelled) { setError(`Impossibile leggere il PDF: ${reason.message}`); setLoading(false); }
    });
    api.current = { export: async () => new Uint8Array(await editOperation.current).slice(), snapshot: () => editOperation.current };
    return () => { cancelled = true; task.destroy(); };
  }, [record.id, bytes]);

  useEffect(() => { setPageInput(String(page)); if (pdf && settings.rememberPdfPage) { try { const entries = JSON.parse(localStorage.getItem('cosmoffice.pdf-positions.v1') || '{}'); delete entries[record.id]; entries[record.id] = page; const recent = Object.fromEntries(Object.entries(entries).slice(-500)); localStorage.setItem('cosmoffice.pdf-positions.v1', JSON.stringify(recent)); } catch {} } }, [page, pdf, settings.rememberPdfPage, record.id]);
  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    let textLayer;
    let task;
    setLoading(true);
    (async () => {
      // Cancel and await the previous render before using the same canvas again.
      if (renderTask.current) { renderTask.current.cancel(); await renderTask.current.promise.catch(() => {}); }
      const pdfPage = await pdf.getPage(page);
      if (cancelled) return;
      const viewport = pdfPage.getViewport({ scale });
      setPageSize({ width: viewport.width, height: viewport.height });
      const outputScale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.current.width = Math.floor(viewport.width * outputScale);
      canvas.current.height = Math.floor(viewport.height * outputScale);
      canvas.current.style.width = `${viewport.width}px`;
      canvas.current.style.height = `${viewport.height}px`;
      task = pdfPage.render({ canvasContext: canvas.current.getContext('2d'), viewport, transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0] });
      renderTask.current = task;
      await task.promise;
      if (cancelled) return;
      const text = await pdfPage.getTextContent();
      pageText.current.set(page, text.items.map(item => item.str || '').join(' '));
      layer.current.replaceChildren();
      layer.current.style.setProperty('--scale-factor', viewport.scale);
      layer.current.style.setProperty('--total-scale-factor', viewport.scale);
      textLayer = new TextLayer({ textContentSource: text, container: layer.current, viewport });
      await textLayer.render();
      if (!cancelled) {
        setLoading(false);
        if (query.trim()) highlight(query);
      }
    })().catch(reason => {
      if (!cancelled && reason.name !== 'RenderingCancelledException' && reason.name !== 'AbortException') { setError(`Pagina non leggibile: ${reason.message}`); setLoading(false); }
    });
    return () => { cancelled = true; task?.cancel(); textLayer?.cancel(); };
  }, [pdf, page, scale]);

  function rotateCurrentPage() {
    if (!pdf || editing || loading || printing) return;
    setEditing(true);
    const original = bytesRef.current;
    const operation = import('./pdf-editing.mjs').then(({ rotatePdfPage }) => rotatePdfPage(original, page)).then(result => {
      bytesRef.current = result;
      if (mounted.current) setBytes(result);
      return result;
    }).catch(reason => {
      console.error('Rotazione PDF non riuscita:', reason);
      if (mounted.current) onError(reason.message);
      return original;
    }).finally(() => { if (mounted.current) setEditing(false); });
    editOperation.current = operation;
    // Register the asynchronous write immediately: navigation and native close await it.
    onEdit(() => operation);
  }

  function highlight(text) {
    const term = text.trim().toLocaleLowerCase('it');
    for (const span of layer.current?.querySelectorAll('span') || []) span.classList.toggle('pdf-match', !!term && span.textContent.toLocaleLowerCase('it').includes(term));
  }
  async function find(event) {
    event?.preventDefault();
    if (!pdf) return;
    const rev = ++searchRevision.current;
    const term = query.trim().toLocaleLowerCase('it');
    if (!term) { setMatches([]); setMatchIndex(-1); setSearchState(''); highlight(''); return; }
    setSearchState('Ricerca…');
    const found = [];
    try {
      for (let n = 1; n <= pdf.numPages; n++) {
        if (rev !== searchRevision.current) return;
        if (!pageText.current.has(n)) {
          const pdfPage = await pdf.getPage(n); const text = await pdfPage.getTextContent();
          pageText.current.set(n, text.items.map(item => item.str || '').join(' '));
        }
        if (pageText.current.get(n).toLocaleLowerCase('it').includes(term)) found.push(n);
        // Yield to input between pages; scanning remains local.
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      if (rev !== searchRevision.current) return;
      setMatches(found); setMatchIndex(found.length ? 0 : -1);
      setSearchState(found.length ? `${found.length} ${found.length === 1 ? 'pagina trovata' : 'pagine trovate'}` : 'Nessun risultato nel testo');
      if (found.length) setPage(found[0]); highlight(term);
    } catch (reason) { onError(`Ricerca interrotta: ${reason.message}`); setSearchState('Ricerca interrotta'); }
  }
  function moveMatch(delta) {
    if (!matches.length) return;
    const index = (matchIndex + delta + matches.length) % matches.length;
    setMatchIndex(index); setPage(matches[index]);
  }
  function goToPage() {
    const number = Number(pageInput);
    if (Number.isInteger(number) && number >= 1 && number <= (pdf?.numPages || 1)) setPage(number);
    else setPageInput(String(page));
  }
  async function printPdf() {
    if (!pdf || printing) return;
    setPrinting(true);
    try {
      if (pdf.numPages > 100) throw new Error('La stampa integrata dell’anteprima gestisce fino a 100 pagine. Salva una copia per stampare documenti più grandi.');
      printPages.current.replaceChildren();
      for (let n = 1; n <= pdf.numPages; n++) {
        const pdfPage = await pdf.getPage(n), base = pdfPage.getViewport({ scale: 1 });
        const viewport = pdfPage.getViewport({ scale: Math.min(1.7, 1800 / Math.max(base.width, base.height)) });
        const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        await pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        const image = new window.Image(); image.src = canvas.toDataURL('image/jpeg', .94); image.alt = `Pagina ${n}`;
        await image.decode(); printPages.current.append(image); canvas.width = 0; canvas.height = 0;
      }
      if (window.cosmoffice) await window.cosmoffice.print(); else window.print();
    } catch (reason) { onError(`Stampa PDF non riuscita: ${reason.message}`); }
    finally { printPages.current?.replaceChildren(); setPrinting(false); }
  }

  return <div className="editor-body pdf-editor">
    <div className="toolbar pdf-toolbar" role="toolbar" aria-label="Strumenti PDF">
      <div className="tool-group pdf-pages"><button className="tool" aria-label="Pagina precedente" disabled={!pdf || page === 1} onClick={() => setPage(n => n - 1)}><ChevronLeft size={18}/></button><input aria-label="Numero pagina PDF" inputMode="numeric" value={pageInput} onChange={e => setPageInput(e.target.value)} onBlur={goToPage} onKeyDown={e => e.key === 'Enter' && goToPage()}/><span>/ {pdf?.numPages || '—'}</span><button className="tool" aria-label="Pagina successiva" disabled={!pdf || page === pdf.numPages} onClick={() => setPage(n => n + 1)}><ChevronRight size={18}/></button></div>
      <div className="tool-group"><button className="tool" aria-label="Riduci zoom PDF" disabled={scale <= .4} onClick={() => setScale(n => Math.max(.4, Math.round((n - .1) * 10) / 10))}><ZoomOut size={18}/></button><button className="text-tool pdf-zoom" aria-label="Ripristina zoom PDF al 100%" onClick={() => setScale(1)}>{Math.round(scale * 100)}%</button><button className="tool" aria-label="Aumenta zoom PDF" disabled={scale >= 3} onClick={() => setScale(n => Math.min(3, Math.round((n + .1) * 10) / 10))}><ZoomIn size={18}/></button><button className="tool" aria-label="Ruota pagina PDF" title="Ruota questa pagina di 90° e salva la modifica nella bozza" disabled={!pdf || editing || loading || printing} onClick={rotateCurrentPage}><RotateCw size={17}/></button></div>
      <button className="text-tool" disabled={!pdf || printing} onClick={printPdf}><Printer size={16}/>{printing ? 'Preparazione stampa…' : 'Stampa PDF'}</button>
      <form className="pdf-search" onSubmit={find}><Search size={16}/><input aria-label="Cerca nel PDF" placeholder="Cerca nel documento" value={query} onChange={e => { searchRevision.current++; setQuery(e.target.value); setMatches([]); setSearchState(''); highlight(e.target.value); }}/><button type="submit">Cerca</button><button type="button" className="tool" aria-label="Risultato precedente" disabled={!matches.length} onClick={() => moveMatch(-1)}><ChevronLeft size={16}/></button><button type="button" className="tool" aria-label="Risultato successivo" disabled={!matches.length} onClick={() => moveMatch(1)}><ChevronRight size={16}/></button></form>
    </div>
    {searchState && <div className="pdf-search-status" role="status">{searchState}{matches.length > 0 && ` · ${matchIndex + 1} di ${matches.length}`}</div>}
    <div className="pdf-workspace">
      {passwordPrompt ? <form className="pdf-password" onSubmit={event => { event.preventDefault(); passwordCallback.current?.(password); setPassword(''); setPasswordPrompt(''); setLoading(true); }}><FileLock2 size={30}/><h2>PDF protetto</h2><p>{passwordPrompt}</p><input autoFocus type="password" aria-label="Password PDF" value={password} onChange={e => setPassword(e.target.value)} required/><button className="button primary">Apri PDF</button><small>La password viene usata solo sul tuo dispositivo.</small></form> : error ? <div className="pdf-error" role="alert"><h2>Il PDF non si apre</h2><p>{error}</p><p>Puoi tornare alle bozze e scegliere un altro file.</p></div> : <div className="pdf-paper" style={{ width: pageSize.width, height: pageSize.height }}><canvas ref={canvas} aria-label={`Pagina ${page} del PDF`}/><div className="textLayer" ref={layer}/>{loading && <div className="pdf-loading" role="status"><LoaderCircle className="spin" size={22}/> Lettura pagina…</div>}</div>}
    </div>
    <div className="editor-status"><span>CosmoView<i/>{editing ? 'Rotazione e salvataggio…' : 'PDF · Lettura e rotazione pagina'}</span><span>{pdf ? `Pagina ${page} di ${pdf.numPages}` : 'Lettura locale'}<i/>Nessun file caricato online</span></div>
    <div className="pdf-print-pages" ref={printPages}/>
    <style>{'@media print { .pdf-editor .pdf-workspace { display: none !important; } .pdf-print-pages { display: block !important; } .pdf-print-pages > img { display: block; max-width: 170mm; max-height: 257mm; width: auto; height: auto; margin: 0 auto; break-after: page; } .pdf-print-pages > img:last-child { break-after: auto; } }'}</style>
  </div>;
}
