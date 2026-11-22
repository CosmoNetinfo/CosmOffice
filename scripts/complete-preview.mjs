import { createReadStream } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { prepareArtifacts, installerNames, releaseNotes } from './publish-preview.mjs';

// Completa solo la Release ordinaria corrente: mai sostituire un installer già pubblico.
export async function completePreview({ directory, version, token, changelog, packageResult = 'success', allowEmpty = false, fetchImpl = fetch }) {
  const repo = 'CosmoNetinfo/CosmOffice', api = `https://api.github.com/repos/${repo}`;
  if (!token) throw new Error('Autorizzazione GitHub mancante.');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  async function request(url, options = {}) {
    const response = await fetchImpl(url, { ...options, headers: { ...headers, ...options.headers } });
    if (!response.ok) throw new Error(`Completamento Release: HTTP ${response.status}.`);
    return response.status === 204 ? null : response.json();
  }
  const release = await request(`${api}/releases/tags/v${version}`);
  if (release.draft || release.prerelease || release.tag_name !== `v${version}`) throw new Error('Non è la Release ordinaria attesa.');
  if (allowEmpty) await mkdir(directory, { recursive: true });
  const files = await prepareArtifacts(directory, version, { allowEmpty }), expected = new Set(Object.values(installerNames(version)));
  const hashes = new Map();
  for (const asset of release.assets) if (expected.has(asset.name)) {
    if (!/^sha256:[a-f0-9]{64}$/.test(asset.digest || '')) throw new Error('Checksum GitHub dell’asset esistente non disponibile.');
    hashes.set(asset.name, asset.digest.slice(7));
  }
  for (const file of files.filter(f => f.sha256)) {
    if (hashes.has(file.name)) throw new Error(`Installer già pubblico: ${file.name}. Non verrà sostituito.`);
    hashes.set(file.name, file.sha256);
  }
  for (const file of files.filter(f => f.name !== 'SHA256SUMS.txt')) {
    if (release.assets.some(a => a.name === file.name)) throw new Error(`Asset già pubblico: ${file.name}.`);
    const uploaded = await request(`https://uploads.github.com/repos/${repo}/releases/${release.id}/assets?name=${encodeURIComponent(file.name)}`, { method: 'POST', headers: { 'Content-Type':'application/octet-stream', 'Content-Length':String(file.size) }, body:createReadStream(file.path), duplex:'half' });
    if (uploaded.size !== file.size || file.sha256 && uploaded.digest && uploaded.digest !== `sha256:${file.sha256}`) throw new Error('Verifica dell’asset caricato non riuscita.');
  }
  // Solo il riepilogo checksum viene sostituito, dopo gli upload dei nuovi file. Nessun installer viene cancellato.
  if (files.some(f => f.sha256)) {
    const sumsPath = resolve(directory, 'SHA256SUMS.txt');
    await writeFile(sumsPath, [...hashes].sort(([a],[b])=>a.localeCompare(b)).map(([name,hash])=>`${hash}  ${name}\n`).join(''));
    const old = release.assets.find(a => a.name === 'SHA256SUMS.txt');
    if (old) await request(`${api}/releases/assets/${old.id}`, { method:'DELETE' });
    await request(`https://uploads.github.com/repos/${repo}/releases/${release.id}/assets?name=SHA256SUMS.txt`, { method:'POST', headers:{'Content-Type':'application/octet-stream','Content-Length':String((await stat(sumsPath)).size)},body:createReadStream(sumsPath),duplex:'half' });
  }
  await request(`${api}/releases/${release.id}`, { method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({ body:releaseNotes(changelog,version,[...hashes.keys()],packageResult), make_latest:'true', prerelease:false }) });
  return { url:release.html_url, checksums:Object.fromEntries(hashes) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { version } = JSON.parse(await readFile('package.json','utf8'));
  if (process.env.GITHUB_REPOSITORY !== 'CosmoNetinfo/CosmOffice') throw new Error('Repository non autorizzato.');
  console.log(JSON.stringify(await completePreview({directory:resolve(process.env.COSMO_RELEASE_DIR||'release-public'),version,token:process.env.GH_TOKEN,changelog:await readFile('CHANGELOG.md','utf8'),packageResult:process.env.COSMO_PACKAGE_RESULT||'success',allowEmpty:process.env.COSMO_ALLOW_EMPTY==='1'&&process.env.COSMO_PACKAGE_RESULT!=='success'}),null,2));
}
