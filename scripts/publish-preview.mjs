import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { lstat, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const repository = 'CosmoNetinfo/CosmOffice';
export function installerNames(version) {
  if (!/^0\.\d+\.\d+$/.test(version)) throw new Error('Versione di anteprima non valida.');
  return { Windows: `CosmOffice-${version}-win-x64-Setup.exe`, Linux: `CosmOffice-${version}-linux-x86_64.AppImage` };
}
export function releaseNotes(changelog, version, names, packageResult = 'success') {
  const section = changelog.split(`## [${version}]`)[1]?.split(/^## /m)[0];
  if (!section) throw new Error('Manca la sezione della versione nel CHANGELOG.');
  const body = section.replace(/^[^\n]*\n/, '').trim();
  for (const heading of ['Aggiunto', 'Corretto', 'Limiti noti', 'Prove mancanti', 'Prossimi passi', 'Cosa ti aspetti da CosmOffice?']) {
    if (!body.includes(`### ${heading}`)) throw new Error(`Note incomplete: ${heading}.`);
  }
  const available = new Set(names);
  const states = Object.entries(installerNames(version)).map(([platform, name]) => `- ${platform} x64: ${available.has(name) ? `disponibile (${name})` : 'NON DISPONIBILE: la build non ha prodotto un installer pubblicabile.'}`);
  return `# CosmOffice ${version} (anteprima)\n\nSuite gratuita, offline e in italiano. Release ordinaria per rendere disponibile /releases/latest; il prodotto rimane un’anteprima.\n\n${body}\n\n## Pacchetti pubblicati\n\n${states.join('\n')}\n- macOS: DMG in preparazione separata; non incluso in questa prima pubblicazione.\n\nEsito complessivo dei lavori pacchetti: ${packageResult}. I pacchetti riusciti vengono pubblicati anche se un’altra piattaforma fallisce. Nessun installer è firmato.\n\n## Aprire l’anteprima\n\nWindows: avvia l’installer .exe. Se SmartScreen avvisa che l’autore non è riconosciuto, controlla origine e checksum; se l’opzione è disponibile, scegli “Ulteriori informazioni” e “Esegui comunque”. Su computer gestiti il criterio aziendale può impedirlo. Non disattivare la protezione del sistema.\n\nLinux: rendi eseguibile l’AppImage e avviala. Le dipendenze del sistema, incluso il supporto AppImage/FUSE, non sono state collaudate su ogni distribuzione.\n\nVerifica il file con il relativo .sha256 o SHA256SUMS.txt prima di avviarlo. Su Windows: Get-FileHash -Algorithm SHA256; su Linux: sha256sum -c SHA256SUMS.txt.\n`;
}

export async function prepareArtifacts(directory, version) {
  const expected = new Set(Object.values(installerNames(version)));
  const files = [];
  for (const name of (await readdir(directory)).sort()) {
    if (name.endsWith('.AppImage') && !expected.has(name)) throw new Error(`AppImage inattesa: ${name}. Non verrà ignorata in silenzio.`);
    if (!expected.has(name)) continue;
    const path = resolve(directory, name);
    const info = await lstat(path);
    if (!info.isFile() || info.size === 0) throw new Error(`Pacchetto non valido: ${name}.`);
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(path)) hash.update(chunk);
    files.push({ name, path, size: info.size, sha256: hash.digest('hex') });
  }
  if (!files.length) throw new Error('Nessun installer disponibile: la Release non verrà pubblicata.');
  for (const file of [...files]) {
    const name = `${file.name}.sha256`;
    await writeFile(resolve(directory, name), `${file.sha256}  ${file.name}\n`);
    files.push({ name, path: resolve(directory, name), size: (await lstat(resolve(directory, name))).size });
  }
  const sums = 'SHA256SUMS.txt';
  await writeFile(resolve(directory, sums), files.filter(f => f.sha256).map(f => `${f.sha256}  ${f.name}\n`).join(''));
  files.push({ name: sums, path: resolve(directory, sums), size: (await lstat(resolve(directory, sums))).size });
  return files;
}

export async function publishPreview({ directory, version, tag, changelog, token, packageResult, fetchImpl = fetch }) {
  if (tag !== `v${version}` || !token) throw new Error('Tag/versione o autorizzazione GitHub non validi.');
  const files = await prepareArtifacts(directory, version);
  const body = releaseNotes(changelog, version, files.map(f => f.name), packageResult);
  const api = `https://api.github.com/repos/${repository}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  async function request(url, options = {}) {
    const response = await fetchImpl(url, { ...options, headers: { ...headers, ...options.headers } });
    if (response.status === 404 && options.method === undefined) return null;
    if (!response.ok) throw new Error(`GitHub: HTTP ${response.status} durante la pubblicazione.`);
    return response.json();
  }
  let release = await request(`${api}/releases/tags/${tag}`);
  if (!release) release = await request(`${api}/releases`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tag_name: tag, name: `CosmOffice ${version} (anteprima)`, body, draft: true, prerelease: false }) });
  if (!release.draft) throw new Error('La Release è già pubblica: nessun file esistente verrà sostituito automaticamente.');
  for (const file of files) {
    if (release.assets?.some(a => a.name === file.name)) throw new Error(`Asset già presente nella bozza: ${file.name}. Controllare prima di riprovare.`);
    const url = `https://uploads.github.com/repos/${repository}/releases/${release.id}/assets?name=${encodeURIComponent(basename(file.name))}`;
    const asset = await request(url, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(file.size) }, body: createReadStream(file.path), duplex: 'half' });
    if (asset.size !== file.size || (file.sha256 && asset.digest && asset.digest !== `sha256:${file.sha256}`)) throw new Error(`Verifica asset fallita: ${file.name}. La bozza resta privata.`);
  }
  const published = await request(`${api}/releases/${release.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `CosmOffice ${version} (anteprima)`, body, draft: false, prerelease: false, make_latest: 'true' }) });
  return published;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { version } = JSON.parse(await readFile('package.json', 'utf8'));
  if (process.env.GITHUB_REPOSITORY !== repository) throw new Error('Repository non autorizzato alla pubblicazione.');
  const release = await publishPreview({ directory: resolve(process.env.COSMO_RELEASE_DIR || 'release-public'), version, tag: process.env.GITHUB_REF_NAME, changelog: await readFile('CHANGELOG.md', 'utf8'), token: process.env.GH_TOKEN, packageResult: process.env.COSMO_PACKAGE_RESULT || 'unknown' });
  console.log(`Release pubblicata: ${release.html_url}`);
}
