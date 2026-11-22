import React, { useEffect, useState } from 'react';
import { readDebug, clearDebug, copyDebug } from './debug.mjs';
export default function DebugReport({ onClose }) {
  const [text, setText] = useState('Caricamento del rapporto locale…'), [message, setMessage] = useState(''), [ready, setReady] = useState(false);
  async function refresh() {
    setReady(false);
    try { setText(await readDebug()); setReady(true); }
    catch { setMessage('Rapporto non disponibile. Riprova.'); }
  }
  useEffect(() => { refresh(); }, []);
  return <div className="modal-backdrop"><section className="modal debug-report" role="dialog" aria-modal="true" aria-labelledby="debug-title">
    <h2 id="debug-title">Segnala un problema</h2>
    <p>Per inviare il rapporto, usa i commenti del post Facebook di CosmOffice.</p>
    <p>Descrivi nel tuo messaggio cosa stavi facendo, senza incollare dati riservati.</p>
    <p><strong>Questo rapporto non contiene i tuoi documenti</strong>. Nessun invio automatico. I dettagli liberi degli errori vengono omessi per privacy.</p>
    <textarea aria-label="Rapporto di debug" readOnly value={text}/>
    <p role="status">{message}</p><div className="modal-actions">
      <button className="button secondary" onClick={onClose} autoFocus>Chiudi rapporto</button>
      <button className="button secondary" disabled={!ready} onClick={async () => { try { await clearDebug(); await refresh(); setMessage('Registro svuotato.'); } catch { setMessage('Impossibile svuotare il registro.'); } }}>Svuota registro</button>
      <button className="button primary" disabled={!ready} onClick={async () => { try { await copyDebug(text); setMessage('Rapporto copiato negli appunti.'); } catch { setMessage('Copia non riuscita. Puoi selezionare il testo del rapporto.'); } }}>Copia rapporto</button>
    </div>
  </section></div>;
}
