// Nessun messaggio libero, nome di funzione o percorso entra nel registro.
const messages = Object.freeze({
  renderer: 'Errore non gestito nell’interfaccia',
  rejection: 'Promise rifiutata senza gestione',
  react: 'Errore durante l’apertura di una schermata',
  main: 'Eccezione non gestita nel processo principale',
  hang: 'La finestra non risponde',
  crash: 'Il processo della finestra si è arrestato',
});
const names = new Set(['Error', 'TypeError', 'RangeError', 'SyntaxError', 'ReferenceError', 'URIError', 'EvalError', 'QuotaExceededError', 'AbortError']);
export function safeEvent(value = {}) {
  if (!value || typeof value !== 'object') value = {};
  const kind = Object.hasOwn(messages, value.kind) ? value.kind : 'renderer';
  const app = ['CosmoWrite', 'CosmoGrid', 'CosmoView'].includes(value.app) ? value.app : 'CosmOffice';
  const name = names.has(value.name) ? value.name : 'Error';
  // Anche un Error.message apparentemente innocuo può contenere una cella o un paragrafo.
  // Non lo conserviamo. Della traccia restano soltanto tre posizioni numeriche
  // dei moduli applicativi, senza nomi utente, cartelle o nomi dei file.
  let trace = typeof value.stack === 'string' ? value.stack.slice(0, 16000).split('\n').slice(1, 8)
    .filter(line => /(?:[/\\]assets[/\\][\w-]+\.js|[/\\]electron[/\\][\w-]+\.(?:cjs|mjs)):\d+:\d+\)?$/.test(line))
    .slice(0, 3).map(line => {
      const [, row, col] = line.match(/:(\d+):(\d+)\)?$/);
      return `  in <cartella>/<modulo>:${Math.min(Number(row), 1000000)}:${Math.min(Number(col), 1000000)}`;
    }) : [];
  if (Array.isArray(value.trace)) trace = value.trace.filter(line => typeof line === 'string' && /^  in <cartella>\/<modulo>:\d{1,7}:\d{1,7}$/.test(line)).slice(0, 3);
  return { date: new Date().toISOString(), app, kind, name, message: `${messages[kind]} (${name}). Dettagli liberi omessi per privacy.`, trace };
}
export function safeContext(value = {}) {
  if (!value || typeof value !== 'object') value = {};
  const kind = ['write', 'grid', 'pdf'].includes(value.kind) ? value.kind : '';
  return {
    app: kind === 'write' ? 'CosmoWrite' : kind === 'grid' ? 'CosmoGrid' : kind === 'pdf' ? 'CosmoView' : 'CosmOffice',
    type: ['DOCX', 'XLSX', 'PDF', 'TXT', 'HTML', 'CSV', 'TSV'].includes(value.type) ? value.type : 'Nessun file',
    size: Number.isFinite(value.size) && value.size >= 0 ? Math.min(100000, Math.ceil(value.size / 1024)) : null,
    spelling: typeof value.spelling === 'boolean' ? value.spelling : false,
    updates: typeof value.updates === 'boolean' ? value.updates : false,
    theme: ['system', 'light', 'dark'].includes(value.theme) ? value.theme : 'system',
    scale: Number.isInteger(value.scale) && value.scale >= 80 && value.scale <= 150 ? value.scale : 100,
    draft: ['saved', 'saving', 'error'].includes(value.draft) ? value.draft : 'unknown',
    dictionary: ['ready', 'loading', 'error'].includes(value.dictionary) ? value.dictionary : 'loading',
    preferences: typeof value.preferences === 'boolean' ? value.preferences : false,
  };
}
