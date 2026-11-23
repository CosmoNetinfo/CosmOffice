const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const { ROOT, SUMS, assetName, newer, parseChecksums } = require('./update-policy.cjs');
async function fileHash(file) {
  const hash = createHash('sha256');
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}
function launchInstaller(file, launch = require('node:child_process').spawn) {
  return new Promise((resolve, reject) => {
    const child = launch(file, [], { detached: true, windowsHide: false, stdio: 'ignore' });
    child.once('error', reject); child.once('spawn', () => { child.unref(); resolve(); });
  });
}
async function replaceAppImage(source, target, expected) {
  const actual = await fsp.realpath(target), info = await fsp.stat(actual);
  const old = await fsp.open(actual, 'r'); const magic = Buffer.alloc(11);
  try { await old.read(magic, 0, 11, 0); } finally { await old.close(); }
  if (!info.isFile() || magic.subarray(0, 4).toString('hex') !== '7f454c46' || magic.subarray(8, 11).toString('hex') !== '414902') throw new Error('AppImage originale non riconosciuta.');
  const input = await fsp.open(source, 'r'); const nextMagic = Buffer.alloc(11);
  try { await input.read(nextMagic, 0, 11, 0); } finally { await input.close(); }
  if (nextMagic.subarray(0, 4).toString('hex') !== '7f454c46' || nextMagic.subarray(8, 11).toString('hex') !== '414902') throw new Error('AppImage scaricata non riconosciuta.');
  const temp = path.join(path.dirname(actual), `.${path.basename(actual)}.${randomUUID()}.cosmo-update`);
  if (path.dirname(temp) !== path.dirname(actual)) throw new Error('Destinazione non valida.');
  try {
    await fsp.copyFile(source, temp, fs.constants.COPYFILE_EXCL);
    if (await fileHash(temp) !== expected) throw new Error('Integrità non verificata.');
    const handle = await fsp.open(temp, 'r+');
    try { await fsp.chmod(temp, info.mode & 0o777); await handle.sync(); } finally { await handle.close(); }
    await fsp.rename(temp, actual);
  } finally { await fsp.unlink(temp).catch(() => {}); }
}
function ownAppImage(app, appDir) {
  if (!app.isPackaged || !appDir) return false;
  try { const exe = fs.realpathSync(app.getPath('exe')), dir = fs.realpathSync(appDir); return exe.startsWith(`${dir}${path.sep}`) && path.basename(exe) === 'cosmoffice'; } catch { return false; }
}
function createUpdater({ app, transport, notify = () => {}, platform = process.platform, arch = process.arch, appImage = process.env.APPIMAGE, appDir = process.env.APPDIR, launch = launchInstaller, intervalMs = 6 * 60 * 60 * 1000 }) {
  const config = path.join(app.getPath('userData'), 'updates.json'), cache = path.join(app.getPath('userData'), 'aggiornamenti');
  let preference = false, generation = 0, busy = false, stopped = false, operation = Promise.resolve(), pending;
  let state = { phase: 'disabled', message: 'Controllo aggiornamenti disattivato.', version: null };
  try { const value = JSON.parse(fs.readFileSync(config, 'utf8')); preference = value.policy === 2 && value.enabled === true; }
  catch { /* Preferenza assente, vecchia o corrotta: nessun consenso automatico ereditato. */ }
  if (preference) state = { phase: 'idle', message: 'Controlli periodici attivi ogni sei ore. Nessun controllo all’avvio.', version: null };
  function status() { return { ...state, enabled: preference, preference, networkActive: busy }; }
  function set(phase, message, version = null) { state = { phase, message, version }; notify(status()); return status(); }
  function valid(token) { if (stopped || token !== generation) throw new Error('Controllo annullato.'); }
  async function checkNow(token) {
    set('checking', 'Controllo della Release GitHub…');
    try {
      const result = await transport.get(SUMS, { name: 'SHA256SUMS.txt' }); valid(token);
      const manifest = parseChecksums(result.bytes.toString('utf8'));
      if (!newer(manifest.version, app.getVersion())) return set('idle', 'Non ci sono nuove versioni.');
      const name = assetName(manifest.version, platform, arch), sha256 = manifest.files.get(name);
      if (!name || !sha256) return set('unsupported', 'Pacchetto aggiornato non disponibile per questo sistema.', manifest.version);
      if (platform === 'darwin') return set('available', `Nuova versione ${manifest.version}. Su Mac scarica il DMG dalla pagina GitHub.`, manifest.version);
      const installed = platform === 'linux' ? !!appImage && ownAppImage(app, appDir) : app.isPackaged && fs.existsSync(path.join(path.dirname(app.getPath('exe')), 'Uninstall CosmOffice.exe'));
      if (!installed) return set('available', `Nuova versione ${manifest.version}. Questo pacchetto richiede l’installazione manuale.`, manifest.version);
      await fsp.mkdir(cache, { recursive: true, mode: 0o700 });
      const target = path.join(cache, name), temp = path.join(cache, `${name}.${randomUUID()}.part`);
      set('downloading', 'Scaricamento dalla Release GitHub…', manifest.version);
      try {
        if (await fileHash(target).catch(() => '') !== sha256) {
          const downloaded = await transport.get(`${ROOT}/download/v${manifest.version}/${name}`, { name, destination: temp, limit: 1024 * 1024 * 1024 });
          valid(token);
          if (downloaded.sha256 !== sha256 || await fileHash(temp) !== sha256) throw new Error('Integrità non verificata.');
          await fsp.rename(temp, target);
        }
        valid(token); pending = { file: target, sha256, version: manifest.version };
        return set('ready', `Versione ${manifest.version} verificata. Scegli Installa e conferma prima di chiudere il lavoro.`, manifest.version);
      } finally { await fsp.unlink(temp).catch(() => {}); }
    } catch {
      if (!stopped && token === generation) return set('error', 'Aggiornamento non disponibile. Puoi continuare a lavorare.');
      return status();
    }
  }
  function check() {
    if (stopped) return Promise.resolve(status());
    if (busy) return operation;
    busy = true; pending = undefined; const token = ++generation;
    transport.setEnabled(true);
    operation = checkNow(token).finally(async () => {
      await transport.setEnabled(false);
      busy = false; notify(status());
    }).then(() => status()); return operation;
  }
  async function cancel() {
    generation++; pending = undefined;
    set('disabled', 'Controllo annullato. Rete spenta.');
    await transport.setEnabled(false);
    await operation.catch(() => {});
    return status();
  }
  function setPreference(value) {
    if (typeof value !== 'boolean') throw new Error('Preferenza non valida.');
    if (preference === value && value) return status();
    const temp = `${config}.${randomUUID()}.tmp`;
    try { fs.writeFileSync(temp, JSON.stringify({ policy: 2, enabled: value }), { flag: 'wx', mode: 0o600 }); fs.renameSync(temp, config); }
    catch {
      if (!value) {
        generation++; preference = false; pending = undefined; transport.setEnabled(false);
        return set('disabled', 'Controllo disattivato per questa sessione. Preferenza non salvata.');
      }
      throw new Error('Impossibile salvare la preferenza degli aggiornamenti.');
    }
    finally { try { fs.unlinkSync(temp); } catch {} }
    preference = value;
    if (!value) { generation++; pending = undefined; transport.setEnabled(false); }
    set(value ? 'idle' : 'disabled', value ? 'Controlli periodici attivi ogni sei ore. Nessun controllo all’avvio.' : 'Controlli periodici spenti. Usa il pulsante quando vuoi.');
    return status();
  }
  async function applyPending(confirmedVersion) {
    if (stopped || busy || state.phase !== 'ready' || !pending || confirmedVersion !== pending.version) return false;
    const approved = pending, token = generation;
    const actual = await fileHash(approved.file);
    if (stopped || token !== generation || pending !== approved || state.phase !== 'ready') return false;
    if (actual !== approved.sha256) throw new Error('Integrità dell’aggiornamento non verificata.');
    if (platform === 'win32') await launch(approved.file);
    else if (platform === 'linux' && appImage) await replaceAppImage(approved.file, appImage, approved.sha256);
    else throw new Error('Installazione automatica non disponibile.');
    return true;
  }
  const timer = setInterval(() => { if (preference && !busy) check(); }, intervalMs); timer.unref();
  return { status, setPreference, check, cancel, applyPending, downloadPage: () => state.version ? `${ROOT}/tag/v${state.version}` : `${ROOT}/latest`, stop: () => { stopped = true; generation++; pending = undefined; clearInterval(timer); return transport.setEnabled(false); } };
}
module.exports = { createUpdater, replaceAppImage, fileHash, launchInstaller };
