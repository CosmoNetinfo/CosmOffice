import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { usePreferences } from './preferences.jsx';
import { Home, FileText, Grid2X2, FolderOpen, ArrowUpRight, ArrowLeft, Plus, Search, Settings, HardDrive, Check, Download, X, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Undo2, Redo2, Table2, ImagePlus, Printer, Trash2, ChevronRight, CircleHelp, WifiOff, Euro, Percent, LoaderCircle, BookOpen } from 'lucide-react';
import { chooseFile, saveFile, safeHtml, fileTitle, downloadName } from './files.mjs';
import { exportDocument } from './documents.mjs';
import { newWorkbook, openWorkbook, importDelimited } from './workbooks.mjs';

import { listDrafts, storeDraft, removeDraft } from './storage.mjs';

const GridEditor = lazy(() => import('./GridEditor.jsx'));
const PdfViewer = lazy(() => import('./PdfViewer.jsx'));
const SettingsPage = lazy(() => import('./SettingsPage.jsx'));
const VERSION = '0.2.0';
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
  const { settings } = usePreferences();
  const [settingsOpen, setSettingsOpen] = useState(false);
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
  useEffect(() => { window.cosmoffice?.setUpdatePreferences?.(settings.automaticUpdates); }, [settings.automaticUpdates]);
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
    setSettingsOpen(false);
    const record = { id: crypto.randomUUID(), name: template === 'letter' ? 'Proposta di collaborazione' : template === 'notes' ? 'Appunti di riunione' : template === 'budget' ? 'Budget di progetto' : kind === 'write' ? 'Documento senza titolo' : 'Foglio senza titolo', kind, updated: Date.now(), payload: kind === 'write' ? templates[template] : new Uint8Array(await newWorkbook(template).xlsx.writeBuffer()) };
    await persist(record); await refresh(); setSettingsOpen(false); setActive(record); editorApi.current = null;
  }
  async function open() {
    setBusy(true);
    try {
      const file = await chooseFile(); if (!file) return;
      if (file.bytes.byteLength > 50 * 1024 * 1024) throw new Error('Questa anteprima apre file fino a 50 MB.');
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['docx', 'xlsx', 'pdf', 'txt', 'html', 'csv', 'tsv'].includes(ext)) throw new Error('Formato non supportato. Scegli DOCX, XLSX, CSV, TSV, PDF, TXT o HTML.');
      let payload = file.bytes;
      if (ext === 'docx') {
        const { importDocx } = await import('./import-docx.mjs');
        payload = await importDocx(file.bytes);
      } else if (ext === 'html') payload = safeHtml(new TextDecoder().decode(file.bytes));
      else if (ext === 'txt') {
        const div = document.createElement('div'); div.textContent = new TextDecoder().decode(file.bytes);
        payload = div.innerHTML.split(/\r?\n/).map(line => `<p>${line || '<br>'}</p>`).join('');
      } else if (ext === 'csv' || ext === 'tsv') payload = new Uint8Array(await importDelimited(file.bytes, fileTitle(file.name), ext === 'tsv' ? '\t' : undefined).xlsx.writeBuffer());
      else if (ext === 'xlsx') await openWorkbook(payload); // Validate before adding to the local library.
      else if (ext === 'pdf' && !new TextDecoder().decode(file.bytes.slice(0, 1024)).includes('%PDF-')) throw new Error('Il file non sembra un PDF valido.');
      await pending.current;
      const record = { id: crypto.randomUUID(), name: fileTitle(file.name), kind: ext === 'pdf' ? 'pdf' : ['xlsx', 'csv', 'tsv'].includes(ext) ? 'grid' : 'write', payload, updated: Date.now(), imported: ext === 'docx' || ext === 'xlsx' };
      await persist(record); await refresh(); setSettingsOpen(false); setActive(record); editorApi.current = null;
    } catch (error) { setNotice(`Impossibile aprire il file: ${error.message}`); }
    finally { setBusy(false); }
  }
  async function home(nextFilter = filter) { await pending.current; setSettingsOpen(false); setActive(null); editorApi.current = null; setFilter(nextFilter); await refresh(); }
  async function showSettings() { document.activeElement?.blur(); await pending.current; await refresh(); setActive(null); editorApi.current = null; setSettingsOpen(true); }
  async function exportPdf() {
    if (!active) return;
    if (!window.cosmoffice?.exportPdf) { window.print(); return; }
    setBusy(true);
    try { document.activeElement?.blur(); await pending.current; const bytes = await window.cosmoffice.exportPdf(); const result = await saveFile(downloadName(active.name, 'pdf'), bytes, 'application/pdf'); if (result) setNotice(`PDF esportato: ${result.name}`); }
    catch (error) { setNotice(`Esportazione PDF non riuscita: ${error.message}`); } finally { setBusy(false); }
  }
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
    const onKey = event => { if ((event.ctrlKey || event.metaKey) && event.key === ',') { event.preventDefault(); showSettings(); } if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); exportActive(); } };
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
        <button className={!settingsOpen && !active && filter === 'all' ? 'nav-item active' : 'nav-item'} onClick={() => home('all')} aria-label="Panoramica" title="Panoramica"><Home size={19}/><span>Panoramica</span></button>
        <button className={(!settingsOpen && !active && filter === 'write') || active?.kind === 'write' ? 'nav-item active' : 'nav-item'} onClick={() => home('write')} aria-label="Documenti" title="Documenti"><FileText size={19}/><span>Documenti</span><small>{documents.filter(d => d.kind === 'write').length}</small></button>
        <button className={(!settingsOpen && !active && filter === 'grid') || active?.kind === 'grid' ? 'nav-item active' : 'nav-item'} onClick={() => home('grid')} aria-label="Fogli di calcolo" title="Fogli di calcolo"><Grid2X2 size={19}/><span>Fogli di calcolo</span><small>{documents.filter(d => d.kind === 'grid').length}</small></button>
        <button className={(!settingsOpen && !active && filter === 'pdf') || active?.kind === 'pdf' ? 'nav-item active' : 'nav-item'} onClick={() => home('pdf')} aria-label="Documenti PDF" title="Documenti PDF"><BookOpen size={19}/><span>Documenti PDF</span><small>{documents.filter(d => d.kind === 'pdf').length}</small></button>
      </nav>
      <div className="sidebar-divider"/>
      <button className="nav-item" aria-label="Apri dal dispositivo" title="Apri dal dispositivo" onClick={open} disabled={busy}><FolderOpen size={19}/><span>Apri dal dispositivo</span></button>
      <div className="sidebar-bottom"><div className="local-card"><span className="local-dot"/><strong>Il lavoro resta qui.</strong><p>I tuoi file sul tuo dispositivo.<br/>Anche senza connessione.</p></div><button className={settingsOpen ? 'nav-item active' : 'nav-item'} aria-label="Impostazioni" title="Impostazioni" onClick={showSettings}><Settings size={18}/><span>Impostazioni</span></button><div className="sidebar-version"><span>COSMONET</span><span>v{VERSION} · Anteprima</span></div></div>
    </aside>
    <main className="main">
      {settingsOpen ? <Suspense fallback={<div className="loading-editor">Apertura impostazioni…</div>}><SettingsPage documents={documents} refresh={refresh} onBack={() => home('all')} update={update} onError={setNotice} onInstallUpdate={async () => { await pending.current; if (!saveFailed.current) window.cosmoffice?.installUpdate(); }} version={VERSION}/></Suspense> : !active ? <>
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
        <header className="editor-header"><button className="icon-button" aria-label="Torna alle bozze" title="Torna alle bozze" onClick={() => home()}><ArrowLeft size={20}/></button><img className="editor-logo" src={brand(active.kind)} alt=""/><div className="document-title"><input aria-label="Nome del file" value={active.name} onChange={e => rename(e.target.value)}/><span>{appLabel(active.kind)} <i>·</i> {draftState === 'saved' ? <><Check size={12}/> Bozza salvata sul dispositivo</> : draftState === 'saving' ? 'Salvataggio…' : 'Bozza non salvata: esporta il file'}</span></div><>{active.kind === 'write' && <button className="button secondary pdf-export-button" onClick={exportPdf} disabled={busy}><Printer size={16}/><span>Esporta PDF</span></button>}</><button className="button primary export-button" onClick={exportActive} disabled={busy}><Download size={16}/><span>{active.kind === 'pdf' ? 'Salva copia PDF' : active.kind === 'write' ? 'Esporta DOCX' : 'Esporta XLSX'}</span></button></header>
        {active.imported && <div className="import-notice"><CircleHelp size={15}/><span>Importazione semplificata: {active.kind === 'write' ? 'impaginazione, revisioni e alcuni elementi potrebbero cambiare.' : 'grafici, macro e funzioni avanzate non sono supportati.'} L’originale rimane sul disco. Esporta una copia e controllala.</span></div>}
        {active.kind === 'write' ? <WriteEditor key={active.id} record={active} onEdit={onEdit} api={editorApi} onError={setNotice}/> : active.kind === 'pdf' ? <Suspense fallback={<div className="loading-editor">Apertura PDF…</div>}><PdfViewer key={active.id} record={active} api={editorApi} onError={setNotice}/></Suspense> : <Suspense fallback={<div className="loading-editor">Apertura foglio…</div>}><GridEditor key={active.id} record={active} onEdit={onEdit} api={editorApi} onError={setNotice}/></Suspense>}
      </>}
    </main>
    {busy && <div className="busy" role="status"><LoaderCircle className="spin" size={18}/> Elaborazione del file…</div>}
    {notice && <div className="toast" role="status"><span>{notice}</span><button className="icon-button" aria-label="Chiudi messaggio" onClick={() => setNotice('')}><X size={16}/></button></div>}
    {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={modal.delete ? 'Elimina bozza' : 'Informazioni CosmOffice'} onClick={e => e.stopPropagation()}><button className="modal-close icon-button" autoFocus aria-label="Chiudi finestra" onClick={() => setModal(null)}><X size={20}/></button>
      {modal.delete ? <><h2>Eliminare questa bozza?</h2><p>La bozza «{modal.delete.name}» verrà rimossa da CosmOffice. I file esportati restano sul disco.</p><div className="modal-actions"><button className="button secondary" onClick={() => setModal(null)}>Annulla</button><button className="button danger" onClick={async () => { await removeDraft(modal.delete.id); setModal(null); refresh(); }}>Elimina bozza</button></div></> : modal === 'compatibility' ? <><h2>File Microsoft, con chiarezza.</h2><p>Questa è l’anteprima 0.2 di CosmOffice.</p><ul><li><strong>DOCX:</strong> testo, titoli, elenchi, tabelle e immagini incorporate. L’importazione ricostruisce il contenuto; non mantiene tutta l’impaginazione di Word.</li><li><strong>XLSX:</strong> fogli multipli, 102 funzioni abilitate, riferimenti tra fogli, CSV/TSV, intervalli e formattazione numerica. Il motore non copre tutte le funzioni Excel.</li><li>Formule avanzate mostrano un errore esplicito. Macro, grafici, revisioni, stampa multipagina fedele e formati DOC/XLS non sono ancora supportati.</li><li><strong>PDF:</strong> lettura offline, navigazione, zoom e ricerca nel testo. I PDF scansionati senza testo richiedono OCR, previsto successivamente.</li><li>Android e iOS sono previsti nelle fasi successive. Questa versione è desktop.</li></ul></> : <><img className="about-logo" src="./brand/suite.svg" alt="Logo CosmOffice"/><h2>CosmOffice</h2><p className="about-subtitle">CosmoWrite + CosmoGrid + CosmoView · v{VERSION} · Anteprima</p><p>Un unico spazio per scrivere e lavorare con i numeri. File e bozze restano su questo dispositivo, senza un account e senza servizi cloud.</p><div className="update-state"><HardDrive size={19}/><span>{update.message}</span></div>{update.phase === 'ready' && <button className="button primary" onClick={async () => { await pending.current; if (draftState !== 'error') window.cosmoffice?.installUpdate(); }}>Riavvia e installa aggiornamento</button>}<p className="fine-print">Le bozze locali non sostituiscono un backup: esporta i file importanti. Le licenze dei componenti sono incluse nei materiali del progetto.</p><div className="about-brand"><img src="./brand/cosmonet-original.png" alt="CosmoNet"/><strong>Progettato per Cosmonet.</strong></div></>}
    </section></div>}
  </div>;
}

function WriteEditor({ record, onEdit, api, onError }) {
  const [revision, setRevision] = useState(0);
  const { settings } = usePreferences();
  const [zoom, setZoom] = useState(settings.writerZoom);
  const imageInput = useRef(null);
  const onEditRef = useRef(onEdit); onEditRef.current = onEdit;
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: false, linkOnPaste: false } }), TextAlign.configure({ types: ['heading', 'paragraph'] }), TableKit.configure({ table: { resizable: false } }), Image.configure({ allowBase64: true }), TextStyleKit, Highlight.configure({ multicolor: true })],
    content: record.payload,
    editorProps: { attributes: { class: 'document-page', 'aria-label': 'Contenuto del documento', spellcheck: 'true' }, transformPastedHTML: safeHtml },
    onUpdate: ({ editor }) => { setRevision(n => n + 1); onEditRef.current(editor.getHTML()); },
    onSelectionUpdate: () => setRevision(n => n + 1),
  });
  useEffect(() => {
    if (!editor) return;
    api.current = { export: () => exportDocument(editor.getJSON(), record.name, settings), snapshot: () => editor.getHTML() };
  }, [editor, record.name, api, settings]);
  useEffect(() => { if (editor) editor.view.dom.spellcheck = settings.spellcheck; }, [editor, settings.spellcheck]);
  useEffect(() => { setZoom(settings.writerZoom); }, [settings.writerZoom]);
  const command = callback => { if (editor) callback(editor.chain().focus()).run(); };
  const paperWidth = settings.writerPaper === 'Letter' ? 816 : 794, paperHeight = settings.writerPaper === 'Letter' ? 1056 : 1123;
  const words = editor?.getText().trim().split(/\s+/).filter(Boolean).length || 0;
  async function addImage(event) {
    const file = event.target.files[0]; if (!file || !editor) return;
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { onError('Scegli un’immagine PNG, JPEG, GIF o WebP fino a 5 MB.'); return; }
    const reader = new FileReader(); reader.onload = () => editor.chain().focus().setImage({ src: reader.result, alt: file.name }).run(); reader.readAsDataURL(file); event.target.value = '';
  }
  return <div className="editor-body write-editor" style={{ '--writer-font': settings.writerFont, '--writer-size': `${settings.writerFontSize * 4 / 3}px`, '--writer-line-height': settings.lineHeight, '--paper-width': `${settings.writerOrientation === 'landscape' ? paperHeight : paperWidth}px`, '--paper-height': `${settings.writerOrientation === 'landscape' ? paperWidth : paperHeight}px`, '--paper-margin': `${settings.writerMargin * 96 / 25.4}px` }}>
    <div className="toolbar" role="toolbar" aria-label="Formattazione documento"><div className="tool-group"><Tool label="Annulla" disabled={!editor?.can().undo()} onClick={() => command(c => c.undo())}><Undo2 size={17}/></Tool><Tool label="Ripristina" disabled={!editor?.can().redo()} onClick={() => command(c => c.redo())}><Redo2 size={17}/></Tool></div><div className="tool-group"><select aria-label="Stile paragrafo" value={editor?.isActive('heading', { level: 1 }) ? '1' : editor?.isActive('heading', { level: 2 }) ? '2' : editor?.isActive('heading', { level: 3 }) ? '3' : '0'} onChange={e => command(c => e.target.value === '0' ? c.setParagraph() : c.toggleHeading({ level: Number(e.target.value) }))}><option value="0">Testo normale</option><option value="1">Titolo 1</option><option value="2">Titolo 2</option><option value="3">Titolo 3</option></select></div><div className="tool-group"><Tool label="Grassetto" active={editor?.isActive('bold')} onClick={() => command(c => c.toggleBold())}><Bold size={17}/></Tool><Tool label="Corsivo" active={editor?.isActive('italic')} onClick={() => command(c => c.toggleItalic())}><Italic size={17}/></Tool><Tool label="Sottolineato" active={editor?.isActive('underline')} onClick={() => command(c => c.toggleUnderline())}><Underline size={17}/></Tool><Tool label="Barrato" active={editor?.isActive('strike')} onClick={() => command(c => c.toggleStrike())}><Strikethrough size={17}/></Tool></div><div className="tool-group">{[[AlignLeft, 'left', 'Allinea a sinistra'], [AlignCenter, 'center', 'Centra'], [AlignRight, 'right', 'Allinea a destra'], [AlignJustify, 'justify', 'Giustifica']].map(([Icon, align, label]) => <Tool key={align} label={label} active={editor?.isActive({ textAlign: align })} onClick={() => command(c => c.setTextAlign(align))}><Icon size={17}/></Tool>)}</div><div className="tool-group"><Tool label="Elenco puntato" active={editor?.isActive('bulletList')} onClick={() => command(c => c.toggleBulletList())}><List size={18}/></Tool><Tool label="Elenco numerato" active={editor?.isActive('orderedList')} onClick={() => command(c => c.toggleOrderedList())}><ListOrdered size={18}/></Tool></div><div className="tool-group"><Tool label="Inserisci tabella" onClick={() => command(c => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }))}><Table2 size={17}/></Tool><Tool label="Inserisci immagine" onClick={() => imageInput.current.click()}><ImagePlus size={18}/></Tool><input ref={imageInput} hidden type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={addImage}/></div><div className="tool-group toolbar-end"><Tool label="Stampa documento" onClick={() => window.cosmoffice ? window.cosmoffice.print().catch(error => onError(error.message)) : window.print()}><Printer size={18}/></Tool></div></div>
    <div className="toolbar typography-toolbar" role="toolbar" aria-label="Carattere e ricerca"><div className="tool-group"><select aria-label="Carattere del testo" value={editor?.getAttributes('textStyle').fontFamily || settings.writerFont} onChange={e => command(c => c.setFontFamily(e.target.value))}>{['Calibri','Arial','Georgia','Times New Roman','Verdana'].map(font => <option key={font}>{font}</option>)}</select><select aria-label="Dimensione del testo selezionato" value={editor?.getAttributes('textStyle').fontSize || `${settings.writerFontSize}pt`} onChange={e => command(c => c.setFontSize(e.target.value))}>{[8,9,10,11,12,14,16,18,20,24,28,32,40,48,72].map(n => <option key={n} value={`${n}pt`}>{n} pt</option>)}</select><label className="color-control" title="Colore del testo"><span>A</span><input type="color" aria-label="Colore del testo" value={editor?.getAttributes('textStyle').color || '#293343'} onChange={e => command(c => c.setColor(e.target.value))}/></label><Tool label="Evidenzia testo" active={editor?.isActive('highlight')} onClick={() => command(c => c.toggleHighlight({ color: '#fff3a3' }))}><span className="highlight-tool">ab</span></Tool></div><FindReplace editor={editor} onMessage={onError}/></div>
    <style>{`@page { size: ${settings.writerPaper} ${settings.writerOrientation}; margin: ${settings.writerMargin}mm; }`}</style>
    {editor?.isActive('table') && <div className="table-actions"><button onClick={() => command(c => c.addRowAfter())}>Aggiungi riga</button><button onClick={() => command(c => c.addColumnAfter())}>Aggiungi colonna</button><button onClick={() => command(c => c.deleteRow())}>Elimina riga</button><button onClick={() => command(c => c.deleteColumn())}>Elimina colonna</button><button onClick={() => command(c => c.deleteTable())}>Elimina tabella</button></div>}
    <div className="page-workspace"><div className="paper-wrap" style={{ zoom: `${zoom}%` }}><div className="page-ruler" aria-hidden="true"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>12</span><span>14</span><span>16</span></div><EditorContent editor={editor}/></div></div>
    <div className="editor-status"><span>{words} {words === 1 ? 'parola' : 'parole'}<i/> Italiano · Controllo ortografico del sistema</span><label>Zoom <select aria-label="Zoom documento" value={zoom} onChange={e => setZoom(Number(e.target.value))}>{[75, 90, 100, 110, 125, 150].map(n => <option key={n} value={n}>{n}%</option>)}</select></label></div>
  </div>;
}


function FindReplace({ editor, onMessage }) {
  const [query, setQuery] = useState(''), [replacement, setReplacement] = useState('');
  function matches() {
    const found = []; if (!editor || !query) return found;
    editor.state.doc.descendants((node, pos) => { if (!node.isTextblock) return; const text = node.textBetween(0, node.content.size, '\n', '\n').toLocaleLowerCase(); const needle = query.toLocaleLowerCase(); let index = text.indexOf(needle); while (index >= 0) { found.push({ from: pos + 1 + index, to: pos + 1 + index + query.length }); index = text.indexOf(needle, index + query.length); } return false; });
    return found;
  }
  function find() { const list = matches(); if (!list.length) { onMessage('Nessuna corrispondenza nel documento.'); return; } const next = list.find(match => match.from >= editor.state.selection.to) || list[0]; editor.chain().focus().setTextSelection(next).scrollIntoView().run(); }
  function replaceAll() { const list = matches(); if (!list.length) { onMessage('Nessuna corrispondenza da sostituire.'); return; } const transaction = editor.state.tr; for (const match of list.reverse()) transaction.insertText(replacement, match.from, match.to); editor.view.dispatch(transaction); onMessage(`${list.length} sostituzioni completate.`); }
  return <div className="find-replace"><Search size={15}/><input aria-label="Trova nel documento" placeholder="Trova nel documento" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && find()}/><button onClick={find} disabled={!query}>Trova</button><input aria-label="Sostituisci con" placeholder="Sostituisci con" value={replacement} onChange={e => setReplacement(e.target.value)}/><button onClick={replaceAll} disabled={!query}>Sostituisci tutto</button></div>;
}
