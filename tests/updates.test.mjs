import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile, readdir, chmod, stat, rename } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
const require = createRequire(import.meta.url);
const policy = require('../electron/update-policy.cjs');
const { createUpdater, replaceAppImage, launchInstaller } = require('../electron/updater.cjs');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const image = text => { const bytes = Buffer.alloc(64); bytes.set([0x7f, 0x45, 0x4c, 0x46]); bytes.set([0x41, 0x49, 2], 8); bytes.write(text, 16); return bytes; };
async function root() { const dir = resolve(`test-results/update-unit-${randomUUID()}`); await mkdir(dir, { recursive: true }); return dir; }
function mockApp(dir, version = '0.2.1') { return { isPackaged: true, getVersion: () => version, getPath: name => name === 'exe' ? join(dir, 'CosmOffice.exe') : dir }; }

test('Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi', () => {
  assert.ok(policy.githubURL(policy.SUMS, 'SHA256SUMS.txt'));
  const name = 'CosmOffice-0.2.2-win-x64-Setup.exe';
  assert.ok(policy.githubURL(`${policy.ROOT}/download/v0.2.2/${name}`, name));
  for (const url of ['http://github.com/CosmoNetinfo/CosmOffice/releases/latest/download/SHA256SUMS.txt', 'https://github.com/altro/progetto/releases/latest/download/SHA256SUMS.txt', 'https://github.com@altro.example/a', 'https://utente:segreto@github.com/CosmoNetinfo/CosmOffice/releases/latest/download/SHA256SUMS.txt', `${policy.SUMS}?dati=segreti`, 'https://api.github.com/repos/CosmoNetinfo/CosmOffice/releases']) assert.equal(policy.githubURL(url, 'SHA256SUMS.txt'), false, url);
  assert.equal(policy.githubURL('https://release-assets.githubusercontent.com/a', name), false, 'CDN mai come richiesta iniziale');
  assert.ok(policy.cdnURL('https://release-assets.githubusercontent.com/github-production-release-asset/1466711071/11111111-1111-1111-1111-111111111111?firma=temporanea'));
  assert.equal(policy.cdnURL('https://release-assets.githubusercontent.com/github-production-release-asset/999/11111111-1111-1111-1111-111111111111'), false);
  assert.equal(policy.cdnURL('https://release-assets.githubusercontent.com.altro.example/a'), false);
});
test('Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni', () => {
  const line = `${'a'.repeat(64)}  CosmOffice-0.2.2-win-x64-Setup.exe`;
  assert.equal(policy.parseChecksums(line).version, '0.2.2');
  for (const text of ['', `${line}\n${line}`, `${line}\n${line.replace('0.2.2', '0.2.3')}`, line.replace('CosmOffice-', '../CosmOffice-'), line.replace('a'.repeat(64), 'hash')]) assert.throws(() => policy.parseChecksums(text));
  assert.ok(policy.newer('0.10.0', '0.9.9')); assert.equal(policy.newer('0.2.2', '0.2.2'), false); assert.equal(policy.newer('0.2.1', '0.2.2'), false);
  assert.throws(() => policy.newer('0.2.3;comando', '0.2.2'));
});
test('Mac: notifica senza download del DMG; preferenza disattivata senza richieste', async () => {
  const dir = await root(), calls = [];
  const transport = { setEnabled() {}, get: async url => { calls.push(url); return { bytes: Buffer.from(`${'a'.repeat(64)}  CosmOffice-0.2.2-mac-arm64.dmg\n`) }; } };
  const updater = createUpdater({ app: mockApp(dir), transport, platform: 'darwin', arch: 'arm64' });
  try {
    assert.deepEqual(calls, []); assert.equal(updater.status().enabled, false);
    updater.setPreference(true); await new Promise(resolve => setImmediate(resolve)); await updater.check();
    assert.equal(updater.status().phase, 'available'); assert.ok(calls.every(url => url === policy.SUMS));
    assert.equal(await updater.applyPending(), false);
    updater.setPreference(false); const count = calls.length; await new Promise(resolve => setImmediate(resolve)); assert.equal(calls.length, count); await updater.check(); assert.equal(calls.length, count + 1);
    assert.equal(JSON.parse(await readFile(join(dir, 'updates.json'), 'utf8')).enabled, false);
  } finally { updater.stop(); }
});
test('Windows: download verificato, installer alterato respinto prima dell’esecuzione', async () => {
  const dir = await root(), bytes = Buffer.from('MZ-INSTALLER-DI-PROVA'), calls = []; let launched = 0;
  await writeFile(join(dir, 'Uninstall CosmOffice.exe'), 'segnaposto del test');
  const name = policy.assetName('0.2.2', 'win32', 'x64');
  const transport = { setEnabled() {}, get: async (url, options) => {
    calls.push(url);
    if (url === policy.SUMS) return { bytes: Buffer.from(`${digest(bytes)}  ${name}\n`) };
    await writeFile(options.destination, bytes); return { sha256: digest(bytes), size: bytes.length };
  } };
  const updater = createUpdater({ app: mockApp(dir), transport, platform: 'win32', arch: 'x64', launch: async () => { launched++; } });
  try {
    updater.setPreference(true); await new Promise(resolve => setImmediate(resolve)); await updater.check();
    assert.equal(updater.status().phase, 'ready'); assert.ok(calls.some(url => url.endsWith(name)));
    assert.equal(await updater.applyPending(), false, 'chiusura senza consenso: nessuna installazione');
    assert.equal(await updater.applyPending('0.2.3'), false, 'consenso per un’altra versione non valido');
    const cached = join(dir, 'aggiornamenti', name); await writeFile(cached, 'FILE ALTERATO');
    await assert.rejects(updater.applyPending('0.2.2'), /Integrità/); assert.equal(launched, 0);
    await writeFile(cached, bytes);
    const interrupted = updater.applyPending('0.2.2'); updater.setPreference(false);
    assert.equal(await interrupted, false, 'disattivazione durante SHA-256: consenso revocato'); assert.equal(launched, 0);
    updater.setPreference(true); await new Promise(resolve => setImmediate(resolve)); await updater.check();
    assert.equal(await updater.applyPending('0.2.2'), true); assert.equal(launched, 1);
  } finally { updater.stop(); }
});
test('SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione', async () => {
  const dir = await root(); await writeFile(join(dir, 'Uninstall CosmOffice.exe'), 'test');
  const name = policy.assetName('0.2.2', 'win32', 'x64'); let launched = false;
  const updater = createUpdater({ app: mockApp(dir), platform: 'win32', arch: 'x64', launch: async () => { launched = true; }, transport: { setEnabled() {}, get: async (url, options) => {
    if (url === policy.SUMS) return { bytes: Buffer.from(`${'a'.repeat(64)}  ${name}`) };
    await writeFile(options.destination, 'CORROTTO'); return { sha256: digest('CORROTTO') };
  } } });
  try {
    updater.setPreference(true); await new Promise(resolve => setImmediate(resolve)); await updater.check();
    assert.equal(updater.status().phase, 'error'); assert.equal(await updater.applyPending(), false); assert.equal(launched, false);
    assert.deepEqual(await readdir(join(dir, 'aggiornamenti')), []);
  } finally { updater.stop(); }
});
test('Disattivazione durante il controllo: risposta tardiva ignorata, nessun download', async () => {
  const dir = await root(); let complete, calls = 0;
  const updater = createUpdater({ app: mockApp(dir), transport: { setEnabled() {}, get: () => { calls++; return new Promise(resolve => { complete = resolve; }); } } });
  try {
    updater.setPreference(true); const checking = updater.check(); await new Promise(resolve => setImmediate(resolve));
    updater.setPreference(false); complete({ bytes: Buffer.from(`${'a'.repeat(64)}  CosmOffice-0.2.2-win-x64-Setup.exe`) });
    await checking; await new Promise(resolve => setImmediate(resolve));
    assert.equal(updater.status().phase, 'disabled'); assert.equal(calls, 1);
  } finally { updater.stop(); }
});
test('AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto', async () => {
  const dir = await root(), old = image('VERSIONE VECCHIA'), next = image('VERSIONE NUOVA');
  const source = join(dir, 'nuova.AppImage'), target = join(dir, 'installata.AppImage');
  await writeFile(source, next); await writeFile(target, old); await chmod(target, 0o755);
  await replaceAppImage(source, target, digest(next)); assert.deepEqual(await readFile(target), next);
  if (process.platform !== 'win32') assert.equal((await stat(target)).mode & 0o777, 0o755);
  await writeFile(target, 'DOCUMENTO DA CONSERVARE');
  await assert.rejects(replaceAppImage(source, target, digest(next)), /non riconosciuta/);
  assert.equal(await readFile(target, 'utf8'), 'DOCUMENTO DA CONSERVARE');
  assert.equal((await readdir(dir)).some(name => name.endsWith('.cosmo-update')), false);
});
test('Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa', async () => {
  let actual;
  await launchInstaller('installer.exe', (file, args, options) => {
    actual = { file, args, options }; const child = new EventEmitter(); child.unref = () => {};
    queueMicrotask(() => child.emit('spawn')); return child;
  });
  assert.equal(actual.file, 'installer.exe'); assert.deepEqual(actual.args, []);
  assert.equal(actual.options.windowsHide, false); assert.notEqual(actual.options.shell, true);
});

test('AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma', async () => {
  const dir=await root(),mount=join(dir,'montata'),old=image('VECCHIA'),next=image('NUOVA');await mkdir(mount);await writeFile(join(mount,'cosmoffice'),'eseguibile simulato');const target=join(dir,'CosmOffice.AppImage');await writeFile(target,old);
  const name=policy.assetName('0.2.2','linux','x64');let downloads=0;
  const transport={setEnabled(){},get:async(url,options)=>{if(url===policy.SUMS)return {bytes:Buffer.from(`${digest(next)}  ${name}\n`)};downloads++;await writeFile(options.destination,next);return {sha256:digest(next)};}};
  const app={isPackaged:true,getVersion:()=> '0.2.1',getPath:key=>key==='exe'?join(mount,'cosmoffice'):dir};
  await writeFile(join(dir,'cosmoffice'),'eseguibile fuori dalla APPDIR');
  const outside=createUpdater({app:{...app,getPath:key=>key==='exe'?join(dir,'cosmoffice'):dir},transport,platform:'linux',arch:'x64',appImage:target,appDir:mount});
  try{outside.setPreference(true);await new Promise(resolve=>setImmediate(resolve));await outside.check();assert.equal(outside.status().phase,'available');assert.equal(downloads,0);assert.deepEqual(await readFile(target),old);}finally{outside.stop();}
  const updater=createUpdater({app,transport,platform:'linux',arch:'x64',appImage:target,appDir:mount});
  try{updater.setPreference(true);await new Promise(resolve=>setImmediate(resolve));await updater.check();assert.equal(updater.status().phase,'ready');assert.equal(await updater.applyPending(),false);assert.equal(await updater.applyPending('0.2.2'),true);assert.deepEqual(await readFile(target),next);}finally{updater.stop();}
});
test('Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio', async () => {
  const dir = await root(); let network = false;
  const updater = createUpdater({ app: mockApp(dir), platform: 'darwin', arch: 'arm64', transport: {
    setEnabled: value => { network = value; }, get: async () => ({ bytes: Buffer.from(`${'a'.repeat(64)}  CosmOffice-0.2.2-mac-arm64.dmg`) }),
  } });
  try {
    updater.setPreference(true); await new Promise(resolve => setImmediate(resolve)); await updater.check(); assert.equal(network, false);
    await rename(join(dir, 'updates.json'), join(dir, 'updates-prima.json')); await mkdir(join(dir, 'updates.json'));
    const state = updater.setPreference(false);
    assert.equal(network, false); assert.equal(state.enabled, false); assert.match(state.message, /Preferenza non salvata/);
  } finally { updater.stop(); }
});
