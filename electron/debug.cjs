const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { safeEvent, safeContext, compactEvent } = require('./debug-policy.mjs');
const { validateGuided, guidedLines } = require('./guided-policy.mjs');
let events = [], filename, writable = true, context = safeContext();
let guided = validateGuided(null);
let updateState = { enabled: false, phase: 'disabled' };
function persist() {
  if (!filename) return;
  try { fs.writeFileSync(filename, JSON.stringify(events), { mode: 0o600 }); writable = true; }
  catch { writable = false; } // Non si registra un errore del registro nel registro stesso.
}
function record(kind, error = {}, app = context.app) {
  let name, stack, trace;
  try { name = error?.name; stack = error?.stack; trace = error?.trace; } catch { /* Getter non affidabile. */ }
  const event = safeEvent({ kind, app, name, stack, trace });
  events.push(event);
  if (events.length > 50) events.splice(0, events.length - 50);
  persist();
}
function initialize(app) {
  filename = path.join(app.getPath('userData'), 'registro-errori.json');
  try { fs.mkdirSync(path.dirname(filename), { recursive: true }); } catch { writable = false; }
  try {
    if (fs.statSync(filename).size < 100000) {
      const old = JSON.parse(fs.readFileSync(filename, 'utf8'));
      // I vecchi record sono ricostruiti dalla lista consentita: niente messaggi/tracce dal disco.
      if (Array.isArray(old)) events = [...old.slice(-50).map(item => {
        const clean = safeEvent(item);
        if (typeof item.date === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(item.date)) clean.date = item.date;
        return clean;
      }), ...events].slice(-50);
    }
  } catch { /* Prima apertura o registro non leggibile: resta quello in memoria. */ }
  persist();
}
function report(app, networkAttempts) {
  const yes = value => value ? 'attivo' : 'disattivo';
  const state = value => ({ saved: 'salvata', saving: 'salvataggio in corso', error: 'errore', unknown: 'non disponibile', ready: 'pronto', loading: 'caricamento' }[value]);
  return [
    ...guidedLines(guided), '', 'Esiti dichiarati dal tester, non verifiche automatiche.', '',
    'Rapporto di debug CosmOffice', `Versione: ${app.getVersion().slice(0, 64)}`,
    `Sistema: ${os.type().slice(0, 32)} ${os.release().slice(0, 80)}`, `Architettura: ${process.arch}`,
    `Electron: ${process.versions.electron}`, `Chromium: ${process.versions.chrome}`,
    `Lingua: ${app.getLocale().slice(0, 16)}`, `App in uso: ${context.app}`, `Tipo file: ${context.type}`,
    `Dimensione approssimativa: ${context.size === null ? 'non disponibile' : `${context.size} KB`}`,
    `Ortografia: ${yes(context.spelling)}`, `Aggiornamenti: ${yes(updateState.enabled)}; stato: ${updateState.phase}`,
    `Tema: ${{ system: 'sistema', light: 'chiaro', dark: 'scuro' }[context.theme]}`, `Scala: ${context.scale}%`, '', 'Controlli interni disponibili:',
    `Bozza: ${state(context.draft)}`, `Dizionario: ${state(context.dictionary)}`,
    `Preferenze locali: ${context.preferences ? 'errore di salvataggio' : 'nessun errore rilevato'}`,
    `Registro locale: ${writable ? 'scrittura riuscita' : 'scrittura non disponibile; eventi solo in memoria'}`,
    `Guardiano offline: attivo; tentativi bloccati in questa sessione: ${networkAttempts}`,
    'Integrità documenti e fedeltà Office: non verificate da questo rapporto.', '',
    `Ultimi errori (${events.length}/50):`,
    ...(events.length ? events.map(compactEvent) : ['Nessun evento registrato.']),
    ...(events.at(-1)?.trace.length ? ['Ultima traccia anonimizzata:', ...events.at(-1).trace] : []),
    '', 'Nessun documento, nome file, percorso personale o identificativo incluso.',
  ].join('\n');
}
module.exports = { initialize, record, report,
  setUpdateState: value => { updateState = { enabled: value.enabled === true, phase: ['disabled', 'idle', 'checking', 'downloading', 'ready', 'available', 'error', 'unsupported'].includes(value.phase) ? value.phase : 'error' }; },
  setGuided: value => { guided = validateGuided(value); }, setContext: value => { context = safeContext(value); }, clear: () => { events = []; persist(); return writable; } };
