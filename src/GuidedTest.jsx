import React, { useEffect, useState } from 'react';
import { guidedTests, guidedChoices } from '../electron/guided-policy.mjs';
import { readGuided, saveGuided } from './guided.mjs';
import { readDebug, copyDebug } from './debug.mjs';
export default function GuidedTest({ onClose }) {
  const [results, setResults] = useState(readGuided), [text, setText] = useState(''), [busy, setBusy] = useState(true), [message, setMessage] = useState('');
  async function refresh() {
    setBusy(true);
    try { setText(await readDebug()); }
    catch { setText(''); setMessage('Rapporto non disponibile. Chiudi e riprova.'); }
    finally { setBusy(false); }
  }
  useEffect(() => { refresh(); }, []);
  async function choose(id, value) {
    setBusy(true); setMessage('');
    try { setResults(saveGuided({ ...results, [id]: value })); await refresh(); }
    catch { setMessage('Esito non salvato sul dispositivo. Riprova.'); setBusy(false); }
  }
  return <div className="modal-backdrop"><section className="modal guided-test" role="dialog" aria-modal="true" aria-labelledby="guided-title">
    <h2 id="guided-title">Prova guidata</h2>
    <p>Esegui le prove sui tuoi file di test e scegli un esito. Nessun campo libero: le scelte restano sul dispositivo e non vengono inviate.</p>
    <p>Puoi chiudere e riaprire questa schermata fra una prova e l’altra.</p>
    <div className="guided-list">{guidedTests.map(test => <fieldset key={test.id} disabled={busy}>
      <legend>{test.label}</legend><p>{test.instruction}</p><div className="guided-choices">{guidedChoices.map(value => <label key={value}>
        <input type="radio" name={`guided-${test.id}`} value={value} checked={results[test.id] === value} onChange={() => choose(test.id, value)}/>{value}
      </label>)}</div>
    </fieldset>)}</div>
    <details className="guided-preview"><summary>Leggi il rapporto prima di copiarlo</summary><textarea aria-label="Rapporto della prova guidata" readOnly value={text}/></details>
    <p>Per condividerlo, usa i commenti del post Facebook di CosmOffice. Questo rapporto non contiene i tuoi documenti.</p>
    <p role="status">{message}</p><div className="modal-actions">
      <button className="button secondary" onClick={onClose} autoFocus>Chiudi prova guidata</button>
      <button className="button primary" disabled={busy || !text} onClick={async () => { try { await copyDebug(text); setMessage('Rapporto copiato negli appunti.'); } catch { setMessage('Copia non riuscita. Chiudi e riprova.'); } }}>Copia rapporto</button>
    </div>
  </section></div>;
}
