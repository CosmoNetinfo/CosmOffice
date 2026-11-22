import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { installerNames, releaseNotes, prepareArtifacts, publishPreview } from '../scripts/publish-preview.mjs';

const changelog = await readFile('CHANGELOG.md', 'utf8');
test('Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease', () => {
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
