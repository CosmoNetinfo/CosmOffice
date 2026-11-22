const { Worker } = require('node:worker_threads');
const path = require('node:path');
const fs = require('node:fs');
const { githubURL } = require('./update-policy.cjs');
function createTransport({ workerFactory = job => new Worker(path.join(__dirname, 'update-worker.cjs'), { workerData: job, env: {}, execArgv: [] }) } = {}) {
  let enabled = false;
  const active = new Set(), audit = [];
  function record(event) {
    if (!['request', 'lookup', 'redirect', 'blocked'].includes(event?.phase)) return;
    const host = /^[a-z0-9.-]{1,253}$/.test(event.host || '') ? event.host : '<destinazione>';
    audit.push({ phase: event.phase, host }); if (audit.length > 200) audit.shift();
  }
  function setEnabled(value) {
    if (typeof value !== 'boolean') throw new Error('Preferenza non valida.');
    enabled = value;
    return !enabled ? Promise.all([...active].map(stop => stop(new Error('Aggiornamento annullato.')))) : Promise.resolve();
  }
  function get(url, { name, destination, limit = 16384 } = {}) {
    if (!enabled) return Promise.reject(new Error('Controllo aggiornamenti disattivato.'));
    if (!githubURL(url, name)) { let host=''; try { host=new URL(url).hostname; } catch {} record({phase:'blocked',host}); return Promise.reject(new Error('Destinazione non consentita.')); }
    if (!Number.isInteger(limit) || limit < 1 || limit > 1024 ** 3) return Promise.reject(new Error('Limite non valido.'));
    let owned = false;
    try { if (destination) { const fd=fs.openSync(destination,'wx',0o600);fs.closeSync(fd);owned=true; } }
    catch { return Promise.reject(new Error('File di aggiornamento non disponibile.')); }
    return new Promise((resolve, reject) => {
      let worker, settled = false;
      async function finish(error, result) {
        if (settled) return; settled=true;clearTimeout(timer);active.delete(finish);
        if (worker) await worker.terminate().catch(()=>{});
        if (error) { if (owned) { try { fs.unlinkSync(destination); } catch {} } reject(new Error('Aggiornamento non disponibile. Puoi continuare a lavorare.')); }
        else resolve({ ...result, bytes: result.bytes ? Buffer.from(result.bytes) : undefined });
      }
      const timer=setTimeout(()=>finish(new Error('Tempo scaduto.')),destination?330000:25000);
      active.add(finish);
      try {
        worker=workerFactory({url,name,destination,limit,reserved:owned});
        worker.on('message', message=>{ if(message?.type==='audit')record(message.event);else if(message?.type==='result')finish(null,message.result);else if(message?.type==='error')finish(new Error('Richiesta non riuscita.')); });
        worker.on('error',()=>finish(new Error('Trasporto non disponibile.')));
        worker.on('exit',()=>finish(new Error('Trasporto interrotto.')));
      } catch { finish(new Error('Trasporto non disponibile.')); }
    });
  }
  return Object.freeze({ setEnabled, get, getAudit:()=>audit.map(event=>({...event})), activeRequests:()=>active.size });
}
module.exports={createTransport};
