import { isAndroid, androidInfo, androidCall } from './android.mjs';
import { safeEvent, safeContext, compactEvent } from '../electron/debug-policy.mjs';
import { guidedLines } from '../electron/guided-policy.mjs';
import { readGuided } from './guided.mjs';
const androidLogKey = 'cosmoffice.android.errors.v1';
function readAndroidEvents() {
  if (!isAndroid) return [];
  try { return JSON.parse(localStorage.getItem(androidLogKey) || '[]').slice(-50).map(value => {
    const event = safeEvent(value);
    return { ...event, date: typeof value.date === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value.date) ? value.date : event.date };
  }); } catch { return []; }
}
let context = safeContext(), events = readAndroidEvents();
export function recordError(kind, error) {
  try {
    const event = safeEvent({ kind, app: context.app, name: error?.name, stack: error?.stack });
    if (window.cosmoffice?.debugRecord) {
      // Solo nome dalla lista e traccia già anonimizzata. Non attraversano l’IPC messaggi liberi.
      window.cosmoffice.debugRecord({ kind: event.kind, name: event.name, trace: event.trace }).catch(() => {});
    } else {
      events = [...events, event].slice(-50);
      if (isAndroid) try { localStorage.setItem(androidLogKey, JSON.stringify(events)); } catch { /* Report stays readable in memory. */ }
    }
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
  const guided = readGuided();
  if (window.cosmoffice?.debugReport) {
    await window.cosmoffice.debugGuided(guided);
    return window.cosmoffice.debugReport();
  }
  const mobile = isAndroid ? await androidInfo().catch(() => null) : null;
  return [...guidedLines(guided), '', 'Esiti dichiarati dal tester, non verifiche automatiche.', '', isAndroid ? 'Rapporto di debug CosmOffice — Android' : 'Rapporto di debug CosmOffice — anteprima browser', 'Versione: 0.2.3',
    isAndroid ? `Sistema: Android ${mobile?.os || 'non disponibile'}; architettura: ${mobile?.architecture || 'non disponibile'}; WebView: ${mobile?.webview || 'non disponibile'}; Electron: non applicabile.` : 'Sistema, architettura, Electron e Chromium: non disponibili nel browser.', 'Lingua: it',
    `App in uso: ${context.app}`, `Tipo file: ${context.type}`, `Dimensione approssimativa: ${context.size ?? 'non disponibile'} KB`,
    `Ortografia: ${context.spelling}`, `Aggiornamenti: assenti`, `Tema: ${context.theme}`, `Scala: ${context.scale}%`,
    `Bozza: ${context.draft}`, `Dizionario: ${context.dictionary}`, isAndroid ? 'Registro: archivio locale di Android; ultimi 50 eventi, nessun invio.' : 'Registro: solo memoria; il file locale è disponibile nell’app desktop.',
    `Ultimi errori (${events.length}/50):`, ...events.map(compactEvent),
    'Nessun documento, nome file, percorso personale o identificativo incluso.'].join('\n');
}
export async function clearDebug() { events = []; if (isAndroid) localStorage.removeItem(androidLogKey); await window.cosmoffice?.debugClear?.(); }
export async function copyDebug(text) {
  if (isAndroid) return androidCall('clipboard', { text });
  if (window.cosmoffice?.debugCopy) return window.cosmoffice.debugCopy();
  await navigator.clipboard.writeText(text);
}
