import { safeEvent, safeContext, compactEvent } from '../electron/debug-policy.mjs';
let context = safeContext(), events = [];
export function recordError(kind, error) {
  try {
    const event = safeEvent({ kind, app: context.app, name: error?.name, stack: error?.stack });
    if (window.cosmoffice?.debugRecord) {
      // Solo nome dalla lista e traccia già anonimizzata. Non attraversano l’IPC messaggi liberi.
      window.cosmoffice.debugRecord({ kind: event.kind, name: event.name, trace: event.trace }).catch(() => {});
    } else events = [...events, event].slice(-50);
  } catch { /* Non provocare ricorsione durante un errore di diagnostica. */ }
}
export function installDebug() {
  window.addEventListener('error', event => recordError('renderer', event.error));
  window.addEventListener('unhandledrejection', event => recordError('rejection', event.reason));
}
export function updateDebugContext(value) {
  context = safeContext(value);
  window.cosmoffice?.debugContext?.(value).catch(() => {});
}
export async function readDebug() {
  if (window.cosmoffice?.debugReport) return window.cosmoffice.debugReport();
  return ['Rapporto di debug CosmOffice — anteprima browser', 'Versione: 0.2.2',
    'Sistema, architettura, Electron e Chromium: non disponibili nel browser.', 'Lingua: it',
    `App in uso: ${context.app}`, `Tipo file: ${context.type}`, `Dimensione approssimativa: ${context.size ?? 'non disponibile'} KB`,
    `Ortografia: ${context.spelling}`, `Aggiornamenti: assenti`, `Tema: ${context.theme}`, `Scala: ${context.scale}%`,
    `Bozza: ${context.draft}`, `Dizionario: ${context.dictionary}`, 'Registro: solo memoria; il file locale è disponibile nell’app desktop.',
    `Ultimi errori (${events.length}/50):`, ...events.map(compactEvent),
    'Nessun documento, nome file, percorso personale o identificativo incluso.'].join('\n');
}
export async function clearDebug() { events = []; await window.cosmoffice?.debugClear?.(); }
export async function copyDebug(text) {
  if (window.cosmoffice?.debugCopy) return window.cosmoffice.debugCopy();
  await navigator.clipboard.writeText(text);
}
