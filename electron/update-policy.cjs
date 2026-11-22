const ROOT = 'https://github.com/CosmoNetinfo/CosmOffice/releases';
const SUMS = `${ROOT}/latest/download/SHA256SUMS.txt`;
const VERSION = '(?:0|[1-9]\\d{0,5})\\.(?:0|[1-9]\\d{0,5})\\.(?:0|[1-9]\\d{0,5})';
const assetPattern = new RegExp(`^CosmOffice-(${VERSION})-(win-x64-Setup\\.exe|linux-x86_64\\.AppImage|mac-(?:x64|arm64)\\.dmg)$`);
function assetName(version, platform, arch) {
  if (!new RegExp(`^${VERSION}$`).test(version)) throw new Error('Versione non valida.');
  if (platform === 'win32' && arch === 'x64') return `CosmOffice-${version}-win-x64-Setup.exe`;
  if (platform === 'linux' && arch === 'x64') return `CosmOffice-${version}-linux-x86_64.AppImage`;
  if (platform === 'darwin' && ['x64', 'arm64'].includes(arch)) return `CosmOffice-${version}-mac-${arch}.dmg`;
  return null;
}
function newer(candidate, current) {
  if (![candidate, current].every(value => typeof value === 'string' && new RegExp(`^${VERSION}$`).test(value))) throw new Error('Versione non valida.');
  const a = candidate.split('.').map(Number), b = current.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return false;
}
function parseChecksums(text) {
  if (typeof text !== 'string' || Buffer.byteLength(text) > 16384) throw new Error('Elenco di integrità non valido.');
  const files = new Map(); let version;
  for (const line of text.trim().split(/\r?\n/)) {
    const row = /^([a-f0-9]{64}) {2}([^\s/\\]+)$/.exec(line), name = row?.[2];
    const match = name && assetPattern.exec(name);
    if (!match || files.has(name) || version && version !== match[1]) throw new Error('Elenco di integrità non valido.');
    version = match[1]; files.set(name, row[1]);
  }
  if (!files.size || files.size > 4) throw new Error('Elenco di integrità non valido.');
  return { version, files };
}
function githubURL(value, name) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password || url.hash || url.search) return false;
    if (name === 'SHA256SUMS.txt' && url.href === SUMS) return true;
    const match = new RegExp(`^/CosmoNetinfo/CosmOffice/releases/download/v(${VERSION})/([^/]+)$`).exec(url.pathname);
    if (!match || match[2] !== name) return false;
    return name === 'SHA256SUMS.txt' || assetPattern.exec(name)?.[1] === match[1];
  } catch { return false; }
}
function cdnURL(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'release-assets.githubusercontent.com' && /^\/github-production-release-asset\/1466711071\/[a-f0-9-]{36}$/.test(url.pathname) && !url.port && !url.username && !url.password && !url.hash; }
  catch { return false; }
}
module.exports = { ROOT, SUMS, assetName, newer, parseChecksums, githubURL, cdnURL };
