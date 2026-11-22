// Unico trasporto HTTPS: isolate Node senza API di rete Chromium o credenziali d'ambiente.
const { isMainThread, parentPort, workerData } = require('node:worker_threads');
const https = require('node:https');
const dns = require('node:dns');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
const { githubURL, cdnURL } = require('./update-policy.cjs');
const HOSTS = new Set(['github.com', 'release-assets.githubusercontent.com']);
const headers = Object.freeze({ 'User-Agent': 'CosmOffice', 'Accept-Encoding': 'identity' });
async function download(job, { request = https.request, emit = () => {} } = {}) {
  let fd, created = false, current = job.url, count = 0;
  const chunks = [], hash = createHash('sha256');
  function audit(phase, value) { let host = ''; try { host = new URL(value).hostname; } catch {} emit({ phase, host }); }
  if (!githubURL(current, job.name)) { audit('blocked', current); throw new Error('Destinazione non consentita.'); }
  if (!Number.isInteger(job.limit) || job.limit < 1 || job.limit > 1024 ** 3) throw new Error('Limite non valido.');
  try {
    if (job.destination) { fd = fs.openSync(job.destination, job.reserved ? 'r+' : 'wx', 0o600); created = !job.reserved; }
    for (let hops = 0; hops <= 4; hops++) {
      audit('request', current);
      const result = await new Promise((resolve, reject) => {
        let req, settled = false;
        const finish = (error, value) => { if (settled) return; settled = true; clearTimeout(timer); if (error) { req?.destroy(); reject(error); } else resolve(value); };
        const timer = setTimeout(() => finish(new Error('Tempo scaduto.')), job.destination ? 300000 : 20000);
        try {
          req = request(current, {
            method: 'GET', headers, agent: false, rejectUnauthorized: true, minVersion: 'TLSv1.2',
            lookup(host, options, callback) {
              emit({ phase: 'lookup', host });
              if (!HOSTS.has(host)) return callback(new Error('Host non consentito.'));
              dns.lookup(host, options, callback);
            },
          }, response => {
            if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
              const next = response.headers.location;
              response.resume();
              let target;
              try { target = new URL(next, current).href; } catch { return finish(new Error('Reindirizzamento non valido.')); }
              if (!(githubURL(target, job.name) || githubURL(current, job.name) && cdnURL(target))) {
                audit('blocked', target); return finish(new Error('Reindirizzamento non consentito.'));
              }
              audit('redirect', target); finish(null, { redirect: target }); return;
            }
            if (response.statusCode !== 200 || Number(response.headers['content-length'] || 0) > job.limit) { response.resume(); return finish(new Error('Risposta non disponibile.')); }
            response.on('data', chunk => {
              if (settled) return;
              try {
                count += chunk.length;
                if (count > job.limit) throw new Error('Download troppo grande.');
                hash.update(chunk);
                if (fd !== undefined) {
                  let offset = 0;
                  while (offset < chunk.length) { const written = fs.writeSync(fd, chunk, offset, chunk.length - offset); if (!written) throw new Error('Scrittura incompleta.'); offset += written; }
                } else chunks.push(chunk);
              } catch (error) { finish(error); }
            });
            response.on('end', () => finish(null, { complete: true }));
            response.on('aborted', () => finish(new Error('Download interrotto.')));
            response.on('error', error => finish(error));
          });
          req.on('error', error => finish(error));
          req.setTimeout?.(30000, () => finish(new Error('Connessione interrotta.')));
          req.end();
        } catch (error) { finish(error); }
      });
      if (result.complete) {
        if (fd !== undefined) fs.fsyncSync(fd);
        return { bytes: job.destination ? undefined : Buffer.concat(chunks), sha256: hash.digest('hex'), size: count };
      }
      current = result.redirect;
    }
    throw new Error('Troppi reindirizzamenti.');
  } catch (error) {
    if (created) { try { fs.closeSync(fd); } catch {} fd = undefined; try { fs.unlinkSync(job.destination); } catch {} }
    throw error;
  } finally { if (fd !== undefined) fs.closeSync(fd); }
}
if (!isMainThread) {
  download(workerData, { emit: event => parentPort.postMessage({ type: 'audit', event }) }).then(
    result => parentPort.postMessage({ type: 'result', result }),
    () => parentPort.postMessage({ type: 'error' }),
  ).finally(() => parentPort.close());
}
module.exports = { download, headers };
