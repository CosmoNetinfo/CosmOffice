import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { installerNames, releaseNotes, prepareArtifacts, publishPreview } from '../scripts/publish-preview.mjs';
import { completePreview } from '../scripts/complete-preview.mjs';
import { createRequire } from 'node:module';

const changelog = await readFile('CHANGELOG.md', 'utf8');
test('Release corrente: note complete per la versione realmente distribuita', async () => {
  const { version } = JSON.parse(await readFile('package.json', 'utf8'));
  const names = Object.values(installerNames(version));
  const notes = releaseNotes(changelog, version, names);
  assert.ok(notes.startsWith(`# CosmOffice ${version} (anteprima)`));
  assert.doesNotMatch(notes, /NON DISPONIBILE/);
  assert.match(notes, /Cosa ti aspetti da CosmOffice\?/);
  assert.match(notes, /commenti del post Facebook/);
  for (const name of names) assert.ok(notes.includes(name));
});
test('Mac: anteprima senza identità, firma forzata o notarizzazione', () => {
  const config = createRequire(import.meta.url)('../electron-builder.config.cjs');
  assert.equal(config.mac.identity, null);
  assert.equal(config.mac.notarize, false);
  assert.equal(config.forceCodeSigning, false);
  assert.match(installerNames('0.2.2')['Mac Intel'], /mac-x64\.dmg$/);
  assert.match(installerNames('0.2.2')['Mac Apple Silicon'], /mac-arm64\.dmg$/);
});
test('Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cosmo-release-completa-'));
  try {
    const names = installerNames('0.2.2');
    await writeFile(join(directory,names.Linux),'AppImage sintetica, non eseguibile.');
    const calls=[];
    const fakeFetch=async(url,options)=>{
      calls.push({url,method:options.method,json:typeof options.body==='string'?JSON.parse(options.body):null});
      if(!options.method)return {ok:true,json:async()=>({id:42,tag_name:'v0.2.2',draft:false,prerelease:false,assets:[{id:1,name:names.Windows,digest:'sha256:'+ 'a'.repeat(64)},{id:2,name:'SHA256SUMS.txt'}]})};
      if(options.method==='DELETE')return {ok:true,status:204};
      if(url.includes('uploads.github.com')) {const chunks=[];for await(const c of options.body)chunks.push(c);const bytes=Buffer.concat(chunks);return {ok:true,json:async()=>({size:bytes.length,digest:'sha256:'+createHash('sha256').update(bytes).digest('hex')})};}
      return {ok:true,json:async()=>({})};
    };
    const result=await completePreview({directory,version:'0.2.2',token:'test',changelog,fetchImpl:fakeFetch});
    assert.equal(result.checksums[names.Windows],'a'.repeat(64));
    assert.ok(result.checksums[names.Linux]);
    assert.deepEqual(calls.filter(c=>c.method==='DELETE').map(c=>c.url.split('/').at(-1)),['2'],'si sostituisce solo il riepilogo checksum');
    assert.equal(calls.some(c=>c.method==='POST'&&c.url.includes(encodeURIComponent(names.Windows))),false);
    await rm(join(directory,names.Linux));
    await writeFile(join(directory,'CosmOffice-0.2.2-linux-x64.AppImage'),'nome diverso dal prodotto reale');
    await assert.rejects(prepareArtifacts(directory,'0.2.2'),/AppImage inattesa/);
    await rm(join(directory,'CosmOffice-0.2.2-linux-x64.AppImage'));
    const deletedBefore=calls.filter(c=>c.method==='DELETE').length;
    await completePreview({directory,version:'0.2.2',token:'test',changelog,fetchImpl:fakeFetch,allowEmpty:true,packageResult:'failure'});
    assert.equal(calls.filter(c=>c.method==='DELETE').length,deletedBefore,'nessun asset o checksum eliminato se Mac non produce pacchetti');
    assert.match(calls.at(-1).json.body,/Esito complessivo dei lavori pacchetti: failure/);
  } finally {await rm(directory,{recursive:true,force:true});}
});
test('Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease', () => {
  assert.equal(installerNames('0.2.2').Linux, 'CosmOffice-0.2.2-linux-x86_64.AppImage', 'nome prodotto realmente da electron-builder');
  const notes = releaseNotes(changelog, '0.2.2', [installerNames('0.2.2').Windows], 'failure');
  assert.match(notes, /Linux x64: NON DISPONIBILE/);
  assert.match(notes, /Cosa ti aspetti da CosmOffice\?/);
  assert.match(notes, /Prove mancanti/);
  assert.throws(() => releaseNotes('', '0.2.2', []), /CHANGELOG/);
});
test('Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cosmo-release-'));
  try {
    const name = installerNames('0.2.2').Windows;
    await writeFile(join(directory, name), 'Pacchetto sintetico: non è un installer.');
    const hash = createHash('sha256').update(await readFile(join(directory, name))).digest('hex');
    const files = await prepareArtifacts(directory, '0.2.2');
    assert.equal(files.find(f => f.name === name).sha256, hash);
    assert.equal(await readFile(join(directory, `${name}.sha256`), 'utf8'), `${hash}  ${name}\n`);
    const calls = [];
    const fakeFetch = async (url, options) => {
      calls.push({ url, method: options.method, json: typeof options.body === 'string' ? JSON.parse(options.body) : null });
      if (!options.method) return { status: 404 };
      if (url.includes('uploads.github.com')) { const chunks=[]; for await (const c of options.body) chunks.push(c); const bytes=Buffer.concat(chunks); return { ok:true, json:async()=>({size:bytes.length,digest:`sha256:${createHash('sha256').update(bytes).digest('hex')}`}) }; }
      return { ok: true, json: async () => ({ id: 42, draft: true, assets: [], html_url: 'https://github.com/CosmoNetinfo/CosmOffice/releases/tag/v0.2.2' }) };
    };
    await publishPreview({ directory, version: '0.2.2', tag: 'v0.2.2', changelog, token: 'test-non-reale', fetchImpl: fakeFetch });
    assert.equal(calls[1].json.draft, true);
    assert.equal(calls.at(-1).method, 'PATCH');
    assert.equal(calls.at(-1).json.prerelease, false);
    assert.equal(calls.at(-1).json.make_latest, 'true');
    assert.equal(calls.filter(c => c.url.includes('uploads.github.com')).length, 3);
    await assert.rejects(publishPreview({ directory, version:'0.2.2', tag:'v0.2.3', changelog, token:'test' }), /Tag/);
    await rm(join(directory,name));
    await assert.rejects(prepareArtifacts(directory,'0.2.2'), /Nessun installer/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
