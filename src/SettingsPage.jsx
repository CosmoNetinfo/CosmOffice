import { isAndroid, androidCall } from './android.mjs';
import React, { useEffect, useRef, useState } from 'react';
import { Palette, FileText, Grid2X2, BookOpen, HardDrive, RefreshCw, Download, Upload, Trash2, Check, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { usePreferences, DEFAULTS } from './preferences.jsx';
import { PersonalDictionary } from './Spelling.jsx';
import { exportBackup, importBackup } from './backups.mjs';
import { clearDrafts, storeDrafts } from './storage.mjs';
import { saveFile } from './files.mjs';
import About from './About.jsx';

const tabs = [['appearance', 'Aspetto', Palette], ['write', 'Documenti', FileText], ['grid', 'Fogli di calcolo', Grid2X2], ['pdf', 'PDF', BookOpen], ['data', 'Dati e backup', HardDrive], ['updates', 'Aggiornamenti', RefreshCw], ['about', 'Informazioni', BookOpen]];
const bytesLabel = bytes => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
function Row({ title, description, children }) { return <div className="setting-row"><div><strong>{title}</strong><p>{description}</p></div><div className="setting-control">{children}</div></div>; }
function Group({ title, description, children }) { return <section className="settings-group"><div className="settings-group-title"><h2>{title}</h2>{description && <p>{description}</p>}</div><div className="settings-panel">{children}</div></section>; }
function AndroidUpdates({ onInstallUpdate, onError }) {
  const [changing, setChanging] = useState(false);
  const [state, setState] = useState({ phase: 'idle', message: 'Controlli spenti di default. Nessuna connessione all’avvio.', automatic: false, networkActive: false, versionCode: 3 });
  useEffect(() => {
    let alive = true;
    const event = value => { if (alive) setState(value.detail); };
    window.addEventListener('cosmoffice:android-update', event);
    androidCall('updates', { action: 'status' }).then(value => { if (alive) setState(value); }).catch(() => onError('Stato aggiornamenti non disponibile.'));
    return () => { alive = false; window.removeEventListener('cosmoffice:android-update', event); };
  }, []);
  const action = async (name, extra = {}) => { try { setState(await androidCall('updates', { action: name, ...extra })); } catch { onError('Operazione aggiornamenti non disponibile. Puoi continuare offline.'); } };
  const toggleAutomatic = async enabled => {
    const previous = state.automatic; setChanging(true); setState(value => ({ ...value, automatic: enabled }));
    try { setState(await androidCall('updates', { action: 'automatic', enabled })); }
    catch { setState(value => ({ ...value, automatic: previous, phase: 'error', message: 'Cambio del consenso non confermato. Riapri le impostazioni per verificarlo.' })); onError('Consenso aggiornamenti non confermato.'); }
    finally { setChanging(false); }
  };
  return <Group title="Aggiornamenti Android da GitHub">
    <Row title={`Anteprima Android · build ${state.versionCode}`} description={state.automatic ? 'Hai attivato anche i controlli ogni sei ore mentre l’app è aperta. Nessun controllo all’avvio.' : 'CosmOffice contatta GitHub soltanto quando premi il pulsante. Altrimenti non contatta nessuno.'}><button className="button secondary" disabled={state.networkActive} onClick={() => action('check')}>Controlla aggiornamenti ora</button></Row>
    <Row title="Stato aggiornamenti" description={state.message}>{state.networkActive && <button className="button secondary" onClick={() => action('cancel')}>Annulla controllo</button>}</Row>
    <Row title="Controlli periodici facoltativi" description="Spenti di default. Se li attivi, l’app controlla e scarica dalle Release del progetto ogni sei ore mentre resta in primo piano. Nessun documento o dato personale viene inviato."><label className="switch"><input type="checkbox" aria-label="Aggiornamenti automatici Android" disabled={changing} checked={state.automatic} onChange={event => toggleAutomatic(event.target.checked)}/><span/></label></Row>
    {state.phase === 'ready' && <Row title="Aggiornamento verificato" description="SHA-256, identificativo e certificato verificati. L’installazione richiede la tua conferma e quella di Android."><button className="button primary" onClick={() => Promise.resolve(onInstallUpdate()).catch(() => onError('Installazione non avviata. Puoi continuare a lavorare.'))}>Installa aggiornamento Android</button></Row>}
    <Row title="Documenti sempre offline" description="Solo il controllo aggiornamenti usa HTTPS verso GitHub e i suoi asset. Il WebView non può collegarsi alla rete. File fino a 10 MB; stampa e Word→PDF restano desktop."/>
  </Group>;
}
export default function SettingsPage({ documents, refresh, onBack, onReport, onGuided, update, onError, onInstallUpdate, version }) {
  const { settings, setSetting, reset, importSettings, storageError } = usePreferences();
  const [tab, setTab] = useState('appearance'), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [confirmClear, setConfirmClear] = useState(false);
  const backupInput = useRef(null), preferencesInput = useRef(null);
  const toggle = (key, label) => <label className="switch"><input type="checkbox" aria-label={label} checked={settings[key]} onChange={e => setSetting(key, e.target.checked)}/><span/></label>;
  const select = (key, label, options) => <select aria-label={label} value={settings[key]} onChange={e => setSetting(key, typeof DEFAULTS[key] === 'number' ? Number(e.target.value) : e.target.value)}>{(!options.some(item => (Array.isArray(item) ? item[0] : item) === settings[key]) ? [[settings[key], `${settings[key]} (personalizzato)`], ...options] : options).map(item => { const [value, text] = Array.isArray(item) ? item : [item, item]; return <option key={value} value={value}>{text}</option>; })}</select>;
  async function run(action) { setBusy(true); setMessage(''); try { await action(); } catch (error) { onError(error.message); } finally { setBusy(false); } }
  async function backup() { await run(async () => { const bytes = await exportBackup(documents); const result = await saveFile(`CosmOffice-backup-${new Date().toISOString().slice(0, 10)}.cosmoffice`, bytes, 'application/zip'); if (result) setMessage(`Backup esportato: ${documents.length} file.`); }); }
  async function restore(event) {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return;
    await run(async () => { const restored = await importBackup(new Uint8Array(await file.arrayBuffer())); await storeDrafts(restored); await refresh(); setMessage(`${restored.length} file ripristinati come nuove copie. I file già presenti sono stati conservati.`); });
  }
  async function importPreferences(event) {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return;
    await run(async () => { if (file.size > 100000) throw new Error('File di impostazioni troppo grande.'); const data = JSON.parse(await file.text()); if (data.format !== 'cosmoffice-preferences' || data.version !== 1 || !data.settings || typeof data.settings !== 'object') throw new Error('File di impostazioni non riconosciuto.'); importSettings(data.settings); setMessage('Impostazioni importate. Il consenso ai controlli periodici resta invariato: puoi cambiarlo in Aggiornamenti.'); });
  }
  const total = documents.reduce((sum, doc) => sum + (typeof doc.payload === 'string' ? new TextEncoder().encode(doc.payload).byteLength : doc.payload?.byteLength || 0), 0);
  return <div className="settings-page">
    <header className="topbar"><div className="breadcrumb">Spazio personale <span>/</span><strong>Impostazioni</strong></div><span className="offline-pill"><Check size={14}/> {storageError ? 'Salvataggio non disponibile' : 'Preferenze salvate localmente'}</span></header>
    <div className="settings-content"><div className="settings-heading"><div><div className="eyebrow">COSMOFFICE / A MODO TUO</div><h1>Il tuo spazio. Le tue regole.</h1><p>Regola l’ambiente di lavoro. Le modifiche si applicano subito.</p></div><button className="button secondary" onClick={onBack}><ArrowLeft size={16}/> Torna al lavoro</button></div>
    <div className="settings-layout"><nav className="settings-nav" aria-label="Categorie impostazioni">{tabs.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setMessage(''); }}><Icon size={17}/>{label}</button>)}<div className="settings-local"><HardDrive size={16}/><p>Le tue preferenze restano<br/>su questo dispositivo.</p></div></nav><div className="settings-sections" aria-busy={busy}>
    {message && <div className="settings-message" role="status"><Check size={16}/>{message}</div>}
    {storageError && <div className="import-notice" role="alert">Non riesco a salvare le preferenze sul dispositivo. Puoi esportarle dal pannello Dati e backup.</div>}
    {tab === 'appearance' && <>
      <Group title="Un ambiente che ti somiglia" description="Scegli luce, colore e spazio. Il contenuto dei documenti mantiene i suoi colori.">
        <Row title="Tema dell’interfaccia" description="Segui il sistema oppure scegli un aspetto fisso.">{select('theme', 'Tema interfaccia', [['system', 'Segui il sistema'], ['light', 'Chiaro'], ['dark', 'Scuro']])}</Row>
        <Row title="Colore principale" description="Pulsanti, selezioni e controlli seguono il tuo colore."><div className="color-options">{[['blue', 'Blu Cosmonet'], ['teal', 'Verde orbita'], ['orange', 'Ambra'], ['rose', 'Rosa']].map(([value, label]) => <button key={value} className={`color-option ${settings.accent === value ? 'active' : ''}`} data-color={value} title={label} aria-label={label} aria-pressed={settings.accent === value} onClick={() => setSetting('accent', value)}>{settings.accent === value && <Check size={15}/>}</button>)}</div></Row>
        <Row title="Colore personalizzato" description="Scegli liberamente un colore, anche tramite il suo codice HEX."><label className="custom-color"><input type="color" aria-label="Colore principale personalizzato" value={settings.customAccent} onChange={e => { setSetting('customAccent', e.target.value); setSetting('accent', 'custom'); }}/><code>{settings.customAccent}</code></label></Row>
        <Row title="Dimensione dell’interfaccia" description="Ingrandisci o riduci menu e comandi senza cambiare il file.">{select('uiScale', 'Dimensione interfaccia', [[90, '90%'], [100, '100%'], [110, '110%'], [125, '125%']])}</Row>
        <Row title="Regolazione precisa della scala" description="Tutti gli ingrandimenti dall’80% al 150%, un punto alla volta."><label className="scale-range"><input type="range" min="80" max="150" step="1" aria-label="Scala precisa interfaccia" value={settings.uiScale} onChange={e => setSetting('uiScale', Number(e.target.value))}/><output>{settings.uiScale}%</output></label></Row>
        <Row title="Densità dei comandi" description="Più respiro oppure più contenuto nello stesso spazio.">{select('density', 'Densità interfaccia', [['comfortable', 'Comoda'], ['compact', 'Compatta']])}</Row>
        <Row title="Barra laterale compatta" description="Mostra solo le icone per lasciare più spazio al lavoro.">{toggle('compactSidebar', 'Barra laterale compatta')}</Row>
      </Group>
      <div className="settings-preview"><span className="preview-dot"/><strong>CosmOffice, a modo tuo.</strong><span className="preview-tag">ANTEPRIMA IN TEMPO REALE</span><p>I pulsanti, le superfici e i controlli mostrano già le tue preferenze.</p><span className="settings-accent-sample">Colore applicato ai comandi</span></div>
    </>}
    {tab === 'write' && <Group title="CosmoWrite" description="Valori predefiniti di visualizzazione ed esportazione. Il testo con uno stile esplicito conserva il suo stile.">
      <Row title="Carattere predefinito" description="Per il testo senza un carattere già impostato.">{select('writerFont', 'Carattere predefinito', ['Calibri', 'Arial', 'Georgia', 'Times New Roman', 'Verdana'])}</Row>
      <Row title="Dimensione del testo" description="Dimensione base in punti tipografici.">{select('writerFontSize', 'Dimensione testo predefinita', [10, 11, 12, 14, 16, 18].map(n => [n, `${n} pt`]))}</Row>
      <Row title="Zoom iniziale" description="Ingrandimento della pagina quando apri l’editor.">{select('writerZoom', 'Zoom iniziale documenti', [75, 90, 100, 110, 125, 150].map(n => [n, `${n}%`]))}</Row>
      <Row title="Formato pagina" description="Usato nella visualizzazione, nel DOCX esportato e nella stampa PDF.">{select('writerPaper', 'Formato pagina', [['A4', 'A4 · 210 × 297 mm'], ['Letter', 'Letter · 216 × 279 mm']])}</Row>
      <Row title="Orientamento pagina" description="Usato anche nell’esportazione DOCX e PDF.">{select('writerOrientation', 'Orientamento pagina', [['portrait', 'Verticale'], ['landscape', 'Orizzontale']])}</Row>
      <Row title="Margini della pagina" description="Margine uniforme sui quattro lati.">{select('writerMargin', 'Margini pagina', [10, 15, 20, 25, 30].map(n => [n, `${n} mm`]))}</Row>
      <Row title="Interlinea" description="Distanza tra le righe del testo e nei DOCX esportati.">{select('lineHeight', 'Interlinea predefinita', [[1, 'Singola'], [1.15, '1,15'], [1.5, '1,5'], [1.65, '1,65'], [2, 'Doppia']])}</Row>
      <Row title="Controllo ortografico italiano" description="Controlla le parole in CosmoWrite e CosmoGrid con il dizionario incluso, senza rete.">{toggle('spellcheck', 'Controllo ortografico')}</Row>
      <Row title="Dizionario personale" description="Aggiungi nomi e termini che usi. Le parole restano solo su questo dispositivo e valgono in entrambi gli editor."><PersonalDictionary/></Row>
    </Group>}
    {tab === 'grid' && <Group title="CosmoGrid" description="Personalizza numeri, griglia e scambio di dati.">
      <Row title="Formato dei numeri" description="Separatore decimale e delle migliaia nella griglia.">{select('gridLocale', 'Formato numeri', [['it-IT', 'Italiano · 1.234,56'], ['en-US', 'Inglese · 1,234.56'], ['de-DE', 'Tedesco · 1.234,56']])}</Row>
      <Row title="Cifre decimali" description="Per il comando formato decimale; i valori delle celle restano precisi.">{select('decimalPlaces', 'Cifre decimali', [0, 1, 2, 3, 4, 6, 8])}</Row>
      <Row title="Righe iniziali visibili" description="I dati fuori dall’area visibile rimangono nel file.">{select('gridRows', 'Righe iniziali', [20, 40, 60, 100])}</Row>
      <Row title="Colonne iniziali visibili" description="Puoi estendere l’area anche dall’editor.">{select('gridCols', 'Colonne iniziali', [8, 12, 20, 26])}</Row>
      <Row title="Linee della griglia" description="Mostra o nascondi le linee tra le celle.">{toggle('gridLines', 'Linee della griglia')}</Row>
      <Row title="Separatore CSV" description="Separatore usato quando esporti un foglio come testo.">{select('csvDelimiter', 'Separatore CSV', [[';', 'Punto e virgola ;'], [',', 'Virgola ,'], ['\t', 'Tabulazione']])}</Row>
    </Group>}
    {tab === 'pdf' && <Group title="CosmoView" description="Leggi i PDF con l’ingrandimento che preferisci.">
      <Row title="Zoom iniziale PDF" description="L’ingrandimento si può cambiare anche nella barra del lettore.">{select('pdfZoom', 'Zoom iniziale PDF', [50, 75, 100, 110, 125, 150, 200].map(n => [n, `${n}%`]))}</Row>
      <Row title="Ricorda l’ultima pagina" description="Riapri ogni PDF dalla pagina in cui eri rimasto.">{toggle('rememberPdfPage', 'Ricorda ultima pagina PDF')}</Row>
    </Group>}
    {tab === 'data' && <>
      <div className="archive-summary"><HardDrive size={25}/><div><strong>{documents.length} file nel tuo archivio</strong><p>{bytesLabel(total)} di contenuti locali · Bozze e PDF</p></div><span>SUL TUO DISPOSITIVO</span></div>
      <Group title="Porta il tuo lavoro con te" description="Il backup contiene le bozze e i PDF dell’archivio. Puoi ripristinarlo in un’altra installazione di CosmOffice.">
        <Row title="Esporta un backup" description="Crea un file .cosmoffice da conservare su disco o su una chiavetta."><button className="button secondary" disabled={busy || !documents.length} onClick={backup}><Download size={16}/> Esporta backup</button></Row>
        <Row title="Ripristina un backup" description="Aggiunge nuove copie: i file presenti nell’archivio vengono conservati."><button className="button secondary" disabled={busy} onClick={() => backupInput.current.click()}><Upload size={16}/> Importa backup</button><input hidden ref={backupInput} type="file" accept=".cosmoffice" onChange={restore}/></Row>
      </Group>
      <Group title="Le tue preferenze, anche altrove">
        <Row title="Esporta impostazioni" description="Salva un file JSON con le tue regolazioni, senza documenti."><button className="button secondary" disabled={busy} onClick={() => run(async () => { const bytes = new TextEncoder().encode(JSON.stringify({ format: 'cosmoffice-preferences', version: 1, settings }, null, 2)); const result = await saveFile('CosmOffice-impostazioni.json', bytes, 'application/json'); if (result) setMessage('Impostazioni esportate.'); })}><Download size={16}/> Esporta</button></Row>
        <Row title="Importa impostazioni" description="Applica le preferenze salvate da CosmOffice."><button className="button secondary" disabled={busy} onClick={() => preferencesInput.current.click()}><Upload size={16}/> Importa</button><input hidden type="file" ref={preferencesInput} accept=".json" onChange={importPreferences}/></Row>
        <Row title="Ripristina valori predefiniti" description="Ripristina l’aspetto e le preferenze. I documenti rimangono nell’archivio."><button className="button secondary" onClick={() => run(async () => { await reset(); setMessage('Preferenze riportate ai valori predefiniti.'); })}>Ripristina preferenze</button></Row>
      </Group>
      <Group title="Gestisci l’archivio locale"><Row title="Svuota l’archivio" description="Elimina le copie e le bozze salvate dentro CosmOffice. Esporta prima un backup. I file sul disco rimangono intatti."><button className="button danger-outline" disabled={busy || !documents.length} onClick={() => setConfirmClear(true)}><Trash2 size={16}/> Svuota archivio</button></Row></Group>
    </>}
    {tab === 'updates' && isAndroid && <AndroidUpdates onInstallUpdate={onInstallUpdate} onError={onError}/>}
    {tab === 'updates' && !isAndroid && <>
      <div className="settings-about"><img src="./brand/suite.svg" alt=""/><div><h2>CosmOffice</h2><p>Versione {version} · Anteprima desktop</p></div></div>
      <Group title="Aggiornamenti da GitHub Releases">
        <Row title="Controllo su richiesta" description={settings.automaticUpdates ? 'Hai attivato anche i controlli periodici: GitHub viene contattato ogni sei ore, oltre che quando premi il pulsante. Nessun controllo all’avvio.' : 'L’app contatta GitHub solo quando premi questo pulsante. Altrimenti non contatta nessuno. Finito il controllo, la rete si spegne da sola.'}><button className="button secondary" disabled={!window.cosmoffice?.checkUpdates || busy || update.networkActive} onClick={() => run(async () => { const result = await window.cosmoffice.checkUpdates(); setMessage(result.message); })}>Controlla aggiornamenti ora</button></Row>
        <Row title="Stato aggiornamenti" description={update.message}>{update.networkActive && <button className="button secondary" onClick={() => window.cosmoffice.cancelUpdate().catch(() => onError('Impossibile annullare il controllo.'))}>Annulla controllo</button>}</Row>
        <Row title="Controlli periodici facoltativi" description="Spenti di default. Se li attivi, l’app controlla e scarica le nuove versioni ogni sei ore; non all’avvio. Nessun documento o dato personale viene inviato.">{toggle('automaticUpdates', 'Aggiornamenti automatici')}</Row>
        {['ready', 'available'].includes(update.phase) && <Row title="Nuova versione" description="Windows e AppImage: installazione soltanto dopo conferma esplicita e salvataggio. Mac non firmato: soltanto avviso e download manuale."><button className="button primary" disabled={busy || update.networkActive} onClick={() => run(onInstallUpdate)}>{update.phase === 'ready' ? 'Installa e chiudi' : 'Apri pagina download'}</button></Row>}
      </Group><div className="settings-explanation"><SlidersHorizontal size={18}/><p>Questa è l’unica rete consentita: le Release GitHub del progetto e i loro file. Nessun account o telemetria. L’app continua a funzionare senza Internet.</p></div>
    </>}
    {tab === 'about' && <About version={version}/>}
    <Group title="Assistenza per l’anteprima"><Row title="Prova guidata" description="Otto prove con esiti locali, senza campi liberi o invio automatico."><button className="button secondary" onClick={onGuided}>Prova guidata</button></Row><Row title="Segnala un problema" description="Leggi e copia un rapporto locale senza contenuti o nomi dei documenti. Nessun invio automatico."><button className="button secondary" onClick={onReport}>Segnala un problema</button></Row></Group>
    <footer className="settings-footer"><span><Check size={13}/> {busy ? 'Operazione in corso…' : 'Le modifiche si applicano subito'}</span><span>Cosmonet · CosmOffice {version}</span></footer>
    </div></div></div>
    {confirmClear && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-label="Conferma svuotamento archivio"><h2>Svuotare l’archivio?</h2><p>Verranno eliminate {documents.length} copie locali. Questa operazione non può essere annullata. I file esportati sul disco rimangono intatti.</p><div className="modal-actions"><button className="button secondary" autoFocus onClick={() => setConfirmClear(false)}>Conserva i file</button><button className="button danger" onClick={() => run(async () => { await clearDrafts(); await refresh(); setConfirmClear(false); setMessage('Archivio locale svuotato.'); })}>Elimina tutte le copie locali</button></div></section></div>}
  </div>;
}
