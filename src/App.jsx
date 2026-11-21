import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import { Home, FileText, Grid2X2, FolderOpen, ArrowUpRight, ArrowLeft, Plus, Search, Settings, HardDrive, Check, Download, X, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Undo2, Redo2, Table2, ImagePlus, Printer, Trash2, ChevronRight, CircleHelp, WifiOff, Euro, Percent, LoaderCircle, BookOpen } from 'lucide-react';
import { chooseFile, saveFile, safeHtml, fileTitle, downloadName } from './files.mjs';
import { exportDocument } from './documents.mjs';
import { newWorkbook, openWorkbook, exportWorkbook, rawValue, setCellInput, calculatorFor } from './workbooks.mjs';
import { columnName, parseAddress } from './formulas.mjs';
import { listDrafts, storeDraft, removeDraft } from './storage.mjs';

const PdfViewer = lazy(() => import('./PdfViewer.jsx'));
const VERSION = '0.1.0';
const templates = {
  blank: '<p></p>',
  letter: '<h1>Una nuova collaborazione</h1><p>Alla cortese attenzione di</p><p><strong>Oggetto: proposta di collaborazione</strong></p><p>Gentile destinatario,</p><p>scrivo per presentare una proposta di collaborazione. Qui puoi descrivere la tua idea, gli obiettivi e i prossimi passi.</p><p>Resto a disposizione per un incontro di approfondimento.</p><p>Cordiali saluti,</p><p>Il tuo nome</p>',
  notes: '<h1>Appunti di riunione</h1><p><strong>Data:</strong> </p><p><strong>Partecipanti:</strong> </p><h2>Argomenti</h2><ul><li><p>Primo argomento</p></li></ul><h2>Decisioni</h2><p></p><h2>Prossimi passi</h2><ol><li><p>Attività, responsabile e scadenza</p></li></ol>',
};
const labels = { all: 'Tutti i file', write: 'Documenti', grid: 'Fogli di calcolo', pdf: 'Documenti PDF' };
const brand = kind => `./brand/${kind === 'write' ? 'write' : kind === 'grid' ? 'grid' : kind === 'pdf' ? 'view' : 'suite'}.svg`;
const appLabel = kind => kind === 'write' ? 'CosmoWrite' : kind === 'grid' ? 'CosmoGrid' : 'CosmoView';
const relativeDate = date => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);

function Tool({ label, active, children, onClick, disabled }) {
  return <button type="button" className={`tool ${active ? 'selected' : ''}`} title={label} aria-label={label} aria-pressed={active === undefined ? undefined : active} disabled={disabled} onMouseDown={e => e.preventDefault()} onClick={onClick}>{children}</button>;
}

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [draftState, setDraftState] = useState('saved');
  const [update, setUpdate] = useState({ phase: 'disabled', message: 'Gli aggiornamenti saranno attivati nelle release firmate.' });
  const pending = useRef(Promise.resolve());
  const revisions = useRef(new Map());
  const editorApi = useRef(null);
  const saveFailed = useRef(false);

  const refresh = useCallback(() => listDrafts().then(setDocuments).catch(() => setNotice('Archivio locale non disponibile. Esporta il lavoro per conservarlo.')), []);
  useEffect(() => { refresh(); window.cosmoffice?.updateStatus().then(setUpdate); return window.cosmoffice?.onUpdate(setUpdate); }, [refresh]);
  useEffect(() => window.cosmoffice?.onBeforeClose?.(async () => { document.activeElement?.blur(); await pending.current; window.cosmoffice.closeReady(!saveFailed.current); }), []);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(''), 9000); return () => clearTimeout(timeout);
  }, [notice]);

  const persist = useCallback((record) => {
    setDraftState('saving');
    const rev = (revisions.current.get(record.id) || 0) + 1;
    revisions.current.set(record.id, rev);
    const snapshot = { ...record, updated: Date.now() };
    pending.current = pending.current.catch(() => {}).then(async () => {
      const payload = typeof snapshot.payload === 'function' ? await snapshot.payload() : snapshot.payload;
      await storeDraft({ ...snapshot, payload });
      saveFailed.current = false;
      if (revisions.current.get(record.id) === rev) setDraftState('saved');
    }).catch(error => { saveFailed.current = true; setDraftState('error'); setNotice(`Bozza non salvata: ${error.message}. Esporta il file per conservarlo.`); });
    return pending.current;
  }, []);

  async function create(kind, template = 'blank') {
    await pending.current;
    const record = { id: crypto.randomUUID(), name: template === 'letter' ? 'Proposta di collaborazione' : template === 'notes' ? 'Appunti di riunione' : template === 'budget' ? 'Budget di progetto' : kind === 'write' ? 'Documento senza titolo' : 'Foglio senza titolo', kind, updated: Date.now(), payload: kind === 'write' ? templates[template] : new Uint8Array(await newWorkbook(template).xlsx.writeBuffer()) };
    await persist(record); await refresh(); setActive(record); editorApi.current = null;
  }
  async function open() {
    setBusy(true);
    try {
      const file = await chooseFile(); if (!file) return;
      if (file.bytes.byteLength > 50 * 1024 * 1024) throw new Error('Questa anteprima apre file fino a 50 MB.');
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['docx', 'xlsx', 'pdf', 'txt', 'html'].includes(ext)) throw new Error('Formato non supportato. Scegli DOCX, XLSX, PDF, TXT o HTML.');
      let payload = file.bytes;
      if (ext === 'docx') {
        const { default: mammoth } = await import('mammoth/mammoth.browser');
        const buffer = file.bytes.buffer.slice(file.bytes.byteOffset, file.bytes.byteOffset + file.bytes.byteLength);
        const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
        payload = safeHtml(result.value);
      } else if (ext === 'html') payload = safeHtml(new TextDecoder().decode(file.bytes));
      else if (ext === 'txt') {
        const div = document.createElement('div'); div.textContent = new TextDecoder().decode(file.bytes);
        payload = div.innerHTML.split(/\r?\n/).map(line => `<p>${line || '<br>'}</p>`).join('');
      } else if (ext === 'xlsx') await openWorkbook(payload); // Validate before adding to the local library.
      else if (ext === 'pdf' && !new TextDecoder().decode(file.bytes.slice(0, 1024)).includes('%PDF-')) throw new Error('Il file non sembra un PDF valido.');
      await pending.current;
      const record = { id: crypto.randomUUID(), name: fileTitle(file.name), kind: ext === 'pdf' ? 'pdf' : ext === 'xlsx' ? 'grid' : 'write', payload, updated: Date.now(), imported: ext === 'docx' || ext === 'xlsx' };
      await persist(record); await refresh(); setActive(record); editorApi.current = null;
    } catch (error) { setNotice(`Impossibile aprire il file: ${error.message}`); }
    finally { setBusy(false); }
  }
  async function home(nextFilter = filter) { await pending.current; setActive(null); editorApi.current = null; setFilter(nextFilter); await refresh(); }
  async function exportActive() {
    if (!active || !editorApi.current) return;
    setBusy(true);
    try {
      const bytes = await editorApi.current.export();
      const ext = active.kind === 'write' ? 'docx' : active.kind === 'grid' ? 'xlsx' : 'pdf';
      const result = await saveFile(downloadName(active.name, ext), bytes, active.kind === 'pdf' ? 'application/pdf' : active.kind === 'write' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      if (result) setNotice(`Copia esportata: ${result.name}`);
    } catch (error) { setNotice(`Esportazione non riuscita: ${error.message}`); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    const onKey = event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); exportActive(); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });
  function rename(name) {
    const record = { ...active, name };
    setActive(record);
    const payload = editorApi.current?.snapshot;
    persist({ ...record, payload: payload || record.payload });
  }
  const onEdit = useCallback((payload) => {
    if (active) persist({ ...active, payload });
  }, [active, persist]);

  const visible = documents.filter(doc => (filter === 'all' || doc.kind === filter) && doc.name.toLocaleLowerCase('it').includes(query.toLocaleLowerCase('it')));
  return <div className={`app ${active ? 'editing' : ''}`}>
    <aside className="sidebar" aria-label="Navigazione principale">
      <button className="brand" onClick={() => home('all')} aria-label="CosmOffice, pagina iniziale"><img src={brand()} alt=""/><span>CosmOffice<small>BY COSMONET</small></span></button>
      <div className="workspace-label">IL TUO SPAZIO</div>
      <nav>
        <button className={!active && filter === 'all' ? 'nav-item active' : 'nav-item'} onClick={() => home('all')}><Home size={19}/><span>Panoramica</span></button>
        <button className={(!active && filter === 'write') || active?.kind === 'write' ? 'nav-item active' : 'nav-item'} onClick={() => home('write')}><FileText size={19}/><span>Documenti</span><small>{documents.filter(d => d.kind === 'write').length}</small></button>
        <button className={(!active && filter === 'grid') || active?.kind === 'grid' ? 'nav-item active' : 'nav-item'} onClick={() => home('grid')}><Grid2X2 size={19}/><span>Fogli di calcolo</span><small>{documents.filter(d => d.kind === 'grid').length}</small></button>
        <button className={(!active && filter === 'pdf') || active?.kind === 'pdf' ? 'nav-item active' : 'nav-item'} onClick={() => home('pdf')}><BookOpen size={19}/><span>Documenti PDF</span><small>{documents.filter(d => d.kind === 'pdf').length}</small></button>
      </nav>
      <div className="sidebar-divider"/>
      <button className="nav-item" onClick={open} disabled={busy}><FolderOpen size={19}/><span>Apri dal dispositivo</span></button>
      <div className="sidebar-bottom"><div className="local-card"><span className="local-dot"/><strong>Il lavoro resta qui.</strong><p>I tuoi file sul tuo dispositivo.<br/>Anche senza connessione.</p></div><button className="nav-item" onClick={() => setModal('settings')}><Settings size={18}/><span>Informazioni e aggiornamenti</span></button><div className="sidebar-version"><span>COSMONET</span><span>v{VERSION} · Anteprima</span></div></div>
    </aside>
    <main className="main">
      {!active ? <>
        <header className="topbar"><div className="breadcrumb">Spazio personale <ChevronRight size={14}/><strong>{labels[filter]}</strong></div><span className="offline-pill"><HardDrive size={14}/> Archivio locale</span></header>
        <div className="home-content">
          <div className="home-heading"><div><div className="eyebrow">COSMOFFICE / IL TUO LAVORO, CON TE</div><h1>{filter === 'all' ? 'Il tuo spazio di lavoro.' : labels[filter]}</h1><p>Documenti, numeri e nuove idee. Comincia da qui.</p></div><button className="button secondary" onClick={open} disabled={busy}><FolderOpen size={17}/> Apri un file</button></div>
          <section className="create-grid" aria-label="Crea un nuovo file">
            <button className="create-card write-card" onClick={() => create('write')}><div className="create-card-top"><img src={brand('write')} alt=""/><span className="card-arrow"><ArrowUpRight size={23}/></span></div><span className="app-name">CosmoWrite</span><h2>Le idee prendono parola.</h2><p>Un nuovo documento, una pagina tutta tua.</p><span className="card-cta"><Plus size={16}/> Crea un documento <span>.docx</span></span></button>
            <button className="create-card grid-card" onClick={() => create('grid')}><div className="create-card-top"><img src={brand('grid')} alt=""/><span className="card-arrow"><ArrowUpRight size={23}/></span></div><span className="app-name">CosmoGrid</span><h2>Dai forma ai tuoi numeri.</h2><p>Organizza, calcola e metti a fuoco i dettagli.</p><span className="card-cta"><Plus size={16}/> Crea un foglio <span>.xlsx</span></span></button>
          </section>
          <button className="pdf-launch" onClick={open}><img src={brand('pdf')} alt=""/><span><strong>CosmoView</strong><small>Apri e leggi i tuoi PDF. Anche senza Internet.</small></span><span className="pdf-launch-action">Apri un PDF <ArrowUpRight size={18}/></span></button>
          <section className="templates" aria-labelledby="template-heading"><div className="section-heading"><h2 id="template-heading">Una buona base di partenza</h2><span>MODELLI COSMONET</span></div><div className="template-grid">
            <button className="template" onClick={() => create('write', 'letter')}><span className="template-preview letter-preview" aria-hidden="true"><i/><i/><i/><i/></span><span><strong>Lettera professionale</strong><small>CosmoWrite · Documento</small></span><Plus size={18}/></button>
            <button className="template" onClick={() => create('write', 'notes')}><span className="template-preview notes-preview" aria-hidden="true"><i/><i/><i/><i/></span><span><strong>Appunti di riunione</strong><small>CosmoWrite · Documento</small></span><Plus size={18}/></button>
            <button className="template" onClick={() => create('grid', 'budget')}><span className="template-preview budget-preview" aria-hidden="true"><i/><i/><i/><i/></span><span><strong>Budget di progetto</strong><small>CosmoGrid · Foglio di calcolo</small></span><Plus size={18}/></button>
          </div></section>
          <section className="recent" aria-labelledby="recent-heading"><div className="section-heading"><h2 id="recent-heading">Le tue bozze</h2><label className="search"><Search size={16}/><input aria-label="Cerca nelle bozze locali" placeholder="Cerca nelle bozze locali" value={query} onChange={e => setQuery(e.target.value)}/></label></div><div className="file-table"><div className="file-table-head"><span>Nome</span><span>Ultima modifica</span><span>Posizione</span><span/></div>{!visible.length ? <div className="empty"><div className="empty-icon"><FolderOpen size={25}/></div><h3>{query ? 'Nessuna bozza trovata' : 'Qui ritroverai il tuo lavoro.'}</h3><p>{query ? 'Prova a cercare un altro nome.' : 'Crea un file o aprine uno dal dispositivo. La bozza viene salvata qui.'}</p></div> : visible.map(doc => <div className="file-row" key={doc.id}><button className="file-name" onClick={async () => { await pending.current; setActive(doc); editorApi.current = null; }}><img src={brand(doc.kind)} alt=""/><span><strong>{doc.name || 'Senza titolo'}</strong><small>{appLabel(doc.kind)}</small></span></button><span className="file-date">{relativeDate(doc.updated)}</span><span className="file-location"><HardDrive size={13}/> Questo dispositivo</span><button className="icon-button delete" title="Elimina bozza" aria-label={`Elimina bozza ${doc.name}`} onClick={() => setModal({ delete: doc })}><Trash2 size={16}/></button></div>)}</div></section>
          <footer className="home-footer"><span><WifiOff size={14}/> Nessun account richiesto. Funziona offline.</span><button onClick={() => setModal('compatibility')}><CircleHelp size={14}/> Compatibilità e formati</button></footer>
        </div>
      </> : <>
        <header className="editor-header"><button className="icon-button" aria-label="Torna alle bozze" title="Torna alle bozze" onClick={() => home()}><ArrowLeft size={20}/></button><img className="editor-logo" src={brand(active.kind)} alt=""/><div className="document-title"><input aria-label="Nome del file" value={active.name} onChange={e => rename(e.target.value)}/><span>{appLabel(active.kind)} <i>·</i> {draftState === 'saved' ? <><Check size={12}/> Bozza salvata sul dispositivo</> : draftState === 'saving' ? 'Salvataggio…' : 'Bozza non salvata: esporta il file'}</span></div><button className="button primary export-button" onClick={exportActive} disabled={busy}><Download size={16}/><span>{active.kind === 'pdf' ? 'Salva copia PDF' : active.kind === 'write' ? 'Esporta DOCX' : 'Esporta XLSX'}</span></button></header>
        {active.imported && <div className="import-notice"><CircleHelp size={15}/><span>Importazione semplificata: {active.kind === 'write' ? 'impaginazione, revisioni e alcuni elementi potrebbero cambiare.' : 'grafici, macro e funzioni avanzate non sono supportati.'} L’originale rimane sul disco. Esporta una copia e controllala.</span></div>}
        {active.kind === 'write' ? <WriteEditor key={active.id} record={active} onEdit={onEdit} api={editorApi} onError={setNotice}/> : active.kind === 'pdf' ? <Suspense fallback={<div className="loading-editor">Apertura PDF…</div>}><PdfViewer key={active.id} record={active} api={editorApi} onError={setNotice}/></Suspense> : <GridEditor key={active.id} record={active} onEdit={onEdit} api={editorApi} onError={setNotice}/>}
      </>}
    </main>
    {busy && <div className="busy" role="status"><LoaderCircle className="spin" size={18}/> Elaborazione del file…</div>}
    {notice && <div className="toast" role="status"><span>{notice}</span><button className="icon-button" aria-label="Chiudi messaggio" onClick={() => setNotice('')}><X size={16}/></button></div>}
    {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={modal.delete ? 'Elimina bozza' : 'Informazioni CosmOffice'} onClick={e => e.stopPropagation()}><button className="modal-close icon-button" autoFocus aria-label="Chiudi finestra" onClick={() => setModal(null)}><X size={20}/></button>
      {modal.delete ? <><h2>Eliminare questa bozza?</h2><p>La bozza «{modal.delete.name}» verrà rimossa da CosmOffice. I file esportati restano sul disco.</p><div className="modal-actions"><button className="button secondary" onClick={() => setModal(null)}>Annulla</button><button className="button danger" onClick={async () => { await removeDraft(modal.delete.id); setModal(null); refresh(); }}>Elimina bozza</button></div></> : modal === 'compatibility' ? <><h2>File Microsoft, con chiarezza.</h2><p>Questa è la prima anteprima di CosmOffice.</p><ul><li><strong>DOCX:</strong> testo, titoli, elenchi, tabelle e immagini incorporate. L’importazione ricostruisce il contenuto; non mantiene tutta l’impaginazione di Word.</li><li><strong>XLSX:</strong> fogli multipli, celle, formule di base e formattazione essenziale. SUM/SOMMA, AVERAGE/MEDIA, MIN, MAX, COUNT/CONTA.NUMERI, IF/SE, ROUND/ARROTONDA e ABS/ASS.</li><li>Formule avanzate mostrano un errore esplicito. Macro, grafici, revisioni, stampa multipagina fedele e formati DOC/XLS non sono ancora supportati.</li><li><strong>PDF:</strong> lettura offline, navigazione, zoom e ricerca nel testo. I PDF scansionati senza testo richiedono OCR, previsto successivamente.</li><li>Android e iOS sono previsti nelle fasi successive. Questa versione è desktop.</li></ul></> : <><img className="about-logo" src="./brand/suite.svg" alt="Logo CosmOffice"/><h2>CosmOffice</h2><p className="about-subtitle">CosmoWrite + CosmoGrid + CosmoView · v{VERSION} · Anteprima</p><p>Un unico spazio per scrivere e lavorare con i numeri. File e bozze restano su questo dispositivo, senza un account e senza servizi cloud.</p><div className="update-state"><HardDrive size={19}/><span>{update.message}</span></div>{update.phase === 'ready' && <button className="button primary" onClick={async () => { await pending.current; if (draftState !== 'error') window.cosmoffice?.installUpdate(); }}>Riavvia e installa aggiornamento</button>}<p className="fine-print">Le bozze locali non sostituiscono un backup: esporta i file importanti. Le licenze dei componenti sono incluse nei materiali del progetto.</p><div className="about-brand"><img src="./brand/cosmonet-original.png" alt="CosmoNet"/><strong>Progettato per Cosmonet.</strong></div></>}
    </section></div>}
  </div>;
}

function WriteEditor({ record, onEdit, api, onError }) {
  const [revision, setRevision] = useState(0);
  const [zoom, setZoom] = useState(100);
  const imageInput = useRef(null);
  const onEditRef = useRef(onEdit); onEditRef.current = onEdit;
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: false, linkOnPaste: false } }), TextAlign.configure({ types: ['heading', 'paragraph'] }), TableKit.configure({ table: { resizable: false } }), Image.configure({ allowBase64: true })],
    content: record.payload,
    editorProps: { attributes: { class: 'document-page', 'aria-label': 'Contenuto del documento', spellcheck: 'true' }, transformPastedHTML: safeHtml },
    onUpdate: ({ editor }) => { setRevision(n => n + 1); onEditRef.current(editor.getHTML()); },
    onSelectionUpdate: () => setRevision(n => n + 1),
  });
  useEffect(() => {
    if (!editor) return;
    api.current = { export: () => exportDocument(editor.getJSON(), record.name), snapshot: () => editor.getHTML() };
  }, [editor, record.name, api]);
  const command = callback => { if (editor) callback(editor.chain().focus()).run(); };
  const words = editor?.getText().trim().split(/\s+/).filter(Boolean).length || 0;
  async function addImage(event) {
    const file = event.target.files[0]; if (!file || !editor) return;
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { onError('Scegli un’immagine PNG, JPEG, GIF o WebP fino a 5 MB.'); return; }
    const reader = new FileReader(); reader.onload = () => editor.chain().focus().setImage({ src: reader.result, alt: file.name }).run(); reader.readAsDataURL(file); event.target.value = '';
  }
  return <div className="editor-body write-editor">
    <div className="toolbar" role="toolbar" aria-label="Formattazione documento"><div className="tool-group"><Tool label="Annulla" disabled={!editor?.can().undo()} onClick={() => command(c => c.undo())}><Undo2 size={17}/></Tool><Tool label="Ripristina" disabled={!editor?.can().redo()} onClick={() => command(c => c.redo())}><Redo2 size={17}/></Tool></div><div className="tool-group"><select aria-label="Stile paragrafo" value={editor?.isActive('heading', { level: 1 }) ? '1' : editor?.isActive('heading', { level: 2 }) ? '2' : editor?.isActive('heading', { level: 3 }) ? '3' : '0'} onChange={e => command(c => e.target.value === '0' ? c.setParagraph() : c.toggleHeading({ level: Number(e.target.value) }))}><option value="0">Testo normale</option><option value="1">Titolo 1</option><option value="2">Titolo 2</option><option value="3">Titolo 3</option></select></div><div className="tool-group"><Tool label="Grassetto" active={editor?.isActive('bold')} onClick={() => command(c => c.toggleBold())}><Bold size={17}/></Tool><Tool label="Corsivo" active={editor?.isActive('italic')} onClick={() => command(c => c.toggleItalic())}><Italic size={17}/></Tool><Tool label="Sottolineato" active={editor?.isActive('underline')} onClick={() => command(c => c.toggleUnderline())}><Underline size={17}/></Tool><Tool label="Barrato" active={editor?.isActive('strike')} onClick={() => command(c => c.toggleStrike())}><Strikethrough size={17}/></Tool></div><div className="tool-group">{[[AlignLeft, 'left', 'Allinea a sinistra'], [AlignCenter, 'center', 'Centra'], [AlignRight, 'right', 'Allinea a destra'], [AlignJustify, 'justify', 'Giustifica']].map(([Icon, align, label]) => <Tool key={align} label={label} active={editor?.isActive({ textAlign: align })} onClick={() => command(c => c.setTextAlign(align))}><Icon size={17}/></Tool>)}</div><div className="tool-group"><Tool label="Elenco puntato" active={editor?.isActive('bulletList')} onClick={() => command(c => c.toggleBulletList())}><List size={18}/></Tool><Tool label="Elenco numerato" active={editor?.isActive('orderedList')} onClick={() => command(c => c.toggleOrderedList())}><ListOrdered size={18}/></Tool></div><div className="tool-group"><Tool label="Inserisci tabella" onClick={() => command(c => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }))}><Table2 size={17}/></Tool><Tool label="Inserisci immagine" onClick={() => imageInput.current.click()}><ImagePlus size={18}/></Tool><input ref={imageInput} hidden type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={addImage}/></div><div className="tool-group toolbar-end"><Tool label="Stampa documento" onClick={() => window.cosmoffice ? window.cosmoffice.print().catch(error => onError(error.message)) : window.print()}><Printer size={18}/></Tool></div></div>
    {editor?.isActive('table') && <div className="table-actions"><button onClick={() => command(c => c.addRowAfter())}>Aggiungi riga</button><button onClick={() => command(c => c.addColumnAfter())}>Aggiungi colonna</button><button onClick={() => command(c => c.deleteRow())}>Elimina riga</button><button onClick={() => command(c => c.deleteColumn())}>Elimina colonna</button><button onClick={() => command(c => c.deleteTable())}>Elimina tabella</button></div>}
    <div className="page-workspace"><div className="paper-wrap" style={{ zoom: `${zoom}%` }}><div className="page-ruler" aria-hidden="true"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>12</span><span>14</span><span>16</span></div><EditorContent editor={editor}/></div></div>
    <div className="editor-status"><span>{words} {words === 1 ? 'parola' : 'parole'}<i/> Italiano · Controllo ortografico del sistema</span><label>Zoom <select aria-label="Zoom documento" value={zoom} onChange={e => setZoom(Number(e.target.value))}>{[75, 90, 100, 110, 125, 150].map(n => <option key={n} value={n}>{n}%</option>)}</select></label></div>
  </div>;
}

function GridEditor({ record, onEdit, api, onError }) {
  const [book, setBook] = useState(null);
  const [sheetId, setSheetId] = useState(null);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState('A1');
  const [formula, setFormula] = useState('');
  const [rows, setRows] = useState(40);
  const [cols, setCols] = useState(12);
  useEffect(() => {
    let cancelled = false;
    openWorkbook(record.payload).then(value => { if (!cancelled) { setBook(value); setSheetId(value.worksheets[0].id); setRows(Math.max(40, Math.min(value.worksheets[0].rowCount + 5, 500))); setCols(Math.max(12, Math.min(value.worksheets[0].columnCount + 2, 40))); } }).catch(error => onError(`Foglio non leggibile: ${error.message}`));
    return () => { cancelled = true; };
  }, []);
  const sheet = book?.getWorksheet(sheetId);
  const calc = useMemo(() => sheet ? calculatorFor(sheet) : () => '', [sheet, revision]);
  useEffect(() => { if (sheet) setFormula(String(rawValue(sheet.getCell(selected)))); }, [sheet, selected, revision]);
  useEffect(() => {
    if (book) api.current = { export: () => exportWorkbook(book), snapshot: async () => new Uint8Array(await book.xlsx.writeBuffer()) };
  }, [book, api]);
  function changed() { setRevision(n => n + 1); onEdit(async () => new Uint8Array(await book.xlsx.writeBuffer())); }
  function commit(address, value) {
    if (!sheet || String(rawValue(sheet.getCell(address))) === value) return;
    setCellInput(sheet.getCell(address), value); changed();
  }
  function format(type) {
    if (!sheet) return;
    const cell = sheet.getCell(selected);
    if (type === 'bold') cell.font = { ...cell.font, bold: !cell.font?.bold };
    else cell.numFmt = type === 'euro' ? '#,##0.00 "€"' : type === 'percent' ? '0.00%' : 'General';
    changed();
  }
  if (!book || !sheet) return <div className="loading-editor"><LoaderCircle className="spin"/> Apertura del foglio…</div>;
  const current = sheet.getCell(selected);
  return <div className="editor-body grid-editor">
    <div className="toolbar" role="toolbar" aria-label="Strumenti foglio di calcolo"><div className="tool-group"><Tool label="Grassetto cella" active={!!current.font?.bold} onClick={() => format('bold')}><Bold size={17}/></Tool></div><div className="tool-group"><Tool label="Formato euro" onClick={() => format('euro')}><Euro size={17}/></Tool><Tool label="Formato percentuale" onClick={() => format('percent')}><Percent size={17}/></Tool><button className="text-tool" onClick={() => format('general')}>Generale</button></div><div className="tool-group"><button className="text-tool" onClick={() => { setRows(r => Math.min(r + 20, 1000)); }}><Plus size={15}/> 20 righe</button><button className="text-tool" onClick={() => setCols(c => Math.min(c + 4, 60))}><Plus size={15}/> 4 colonne</button></div><span className="grid-scope">Formule di base · Anteprima</span></div>
    <div className="formula-bar"><span className="cell-address">{selected}</span><span className="fx">ƒx</span><input aria-label="Formula o valore della cella selezionata" value={formula} onChange={e => setFormula(e.target.value)} onBlur={() => commit(selected, formula)} onKeyDown={e => { if (e.key === 'Enter') { commit(selected, formula); e.currentTarget.blur(); } if (e.key === 'Escape') setFormula(String(rawValue(current))); }}/><button className="icon-button" title="Applica valore" aria-label="Applica valore" onClick={() => commit(selected, formula)}><Check size={17}/></button></div>
    <div className="spreadsheet-scroll"><table className="spreadsheet" aria-label={`Foglio ${sheet.name}`}><colgroup><col style={{ width: 48 }}/>{Array.from({ length: cols }, (_, c) => <col key={c} style={{ width: Math.max(110, Math.min(300, (sheet.getColumn(c + 1).width || 16) * 8)) }}/>)}</colgroup><thead><tr><th aria-label="Angolo del foglio"/>{Array.from({ length: cols }, (_, c) => <th key={c}>{columnName(c + 1)}</th>)}</tr></thead><tbody>{Array.from({ length: rows }, (_, r) => <tr key={`${sheet.id}-${r}`}><th scope="row">{r + 1}</th>{Array.from({ length: cols }, (_, c) => {
      const address = `${columnName(c + 1)}${r + 1}`; const cell = sheet.getCell(address); const raw = rawValue(cell); const value = calc(address);
      let display = value;
      if (typeof value === 'number') display = cell.numFmt?.includes('%') ? `${(value * 100).toLocaleString('it-IT', { maximumFractionDigits: 2 })}%` : cell.numFmt?.includes('€') ? value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }) : value.toLocaleString('it-IT', { maximumFractionDigits: 8 });
      if (typeof value === 'boolean') display = value ? 'VERO' : 'FALSO';
      const bg = cell.fill?.fgColor?.argb;
      const fg = cell.font?.color?.argb;
      return <GridCell key={address} address={address} raw={String(raw)} display={String(display)} selected={selected === address} numeric={typeof value === 'number'} error={String(value).startsWith('#')} style={{ fontWeight: cell.font?.bold ? 700 : undefined, fontStyle: cell.font?.italic ? 'italic' : undefined, backgroundColor: bg?.length === 8 ? `#${bg.slice(2)}` : undefined, color: fg?.length === 8 ? `#${fg.slice(2)}` : undefined }} onSelect={() => setSelected(address)} onCommit={value => commit(address, value)}/>;
    })}</tr>)}</tbody></table></div>
    <div className="sheet-tabs"><button className="icon-button" aria-label="Aggiungi foglio" title="Aggiungi foglio" onClick={() => { let n = book.worksheets.length + 1; while (book.getWorksheet(`Foglio ${n}`)) n++; const added = book.addWorksheet(`Foglio ${n}`); setSheetId(added.id); setSelected('A1'); changed(); }}><Plus size={18}/></button>{book.worksheets.map(s => <button key={s.id} className={s.id === sheetId ? 'sheet-tab active' : 'sheet-tab'} onClick={() => { setSheetId(s.id); setSelected('A1'); setRows(Math.max(40, Math.min(s.rowCount + 5, 500))); setCols(Math.max(12, Math.min(s.columnCount + 2, 40))); }}>{s.name}</button>)}</div>
    <div className="editor-status"><span>{book.worksheets.length} {book.worksheets.length === 1 ? 'foglio' : 'fogli'}<i/>Cella {selected}</span><span>Area visibile: {rows} righe × {cols} colonne · I dati fuori area restano nel file</span></div>
  </div>;
}

function GridCell({ address, raw, display, selected, numeric, error, style, onSelect, onCommit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(raw);
  const cancelEdit = useRef(false);
  useEffect(() => { if (!editing) setValue(raw); }, [raw, editing]);
  return <td className={`${selected ? 'selected-cell' : ''} ${error ? 'error-cell' : ''}`} style={style}><input data-address={address} aria-label={`Cella ${address}`} title={error ? `${raw} → ${display}` : undefined} style={{ textAlign: numeric && !editing ? 'right' : undefined }} value={editing ? value : display} onFocus={() => { cancelEdit.current = false; setEditing(true); setValue(raw); onSelect(); }} onChange={e => setValue(e.target.value)} onBlur={() => { if (editing && !cancelEdit.current) onCommit(value); setEditing(false); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onCommit(value); setEditing(false); e.currentTarget.blur(); const pos = parseAddress(address); document.querySelector(`[data-address="${columnName(pos.col)}${pos.row + 1}"]`)?.focus(); } if (e.key === 'Escape') { cancelEdit.current = true; setValue(raw); setEditing(false); e.currentTarget.blur(); } }}/></td>;
}
