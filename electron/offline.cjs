// Difesa locale: nessuna API di rete Node/Electron può aprire connessioni.
const attempts = [];
let installed = false;
const configured = new WeakSet();
function record(api) { attempts.push({ api }); if (attempts.length > 200) attempts.shift(); }
function deny(api) { return function() { record(api); throw Object.assign(new Error('CosmOffice è offline: connessione di rete bloccata.'), { code: 'ERR_COSMO_OFFLINE' }); }; }
function replace(object, names, label) { for (const name of names) if (typeof object?.[name] === 'function') object[name] = deny(`${label}.${name}`); }
function configureSession(session) {
  if (configured.has(session)) return;
  configured.add(session);
  // Hunspell può scaricare dizionari dal CDN anche senza azioni dell'utente.
  session.setSpellCheckerEnabled(false);
  session.setPermissionRequestHandler((_, __, callback) => callback(false));
  session.setPermissionCheckHandler(() => false);
  replace(session, ['fetch', 'resolveHost', 'preconnect', 'downloadURL'], 'electron.session');
  session.webRequest.onBeforeRequest((details, callback) => {
    let allowed = false;
    try { allowed = ['file:', 'data:', 'blob:', 'devtools:', 'about:'].includes(new URL(details.url).protocol); } catch {}
    if (!allowed) record('electron.session.webRequest');
    callback({ cancel: !allowed });
  });
}
function installOffline(electron) {
  if (installed) return;
  installed = true;
  for (const name of ['http', 'https']) replace(require(`node:${name}`), ['request', 'get'], `node.${name}`);
  replace(require('node:http2'), ['connect'], 'node.http2');
  const net = require('node:net'); replace(net, ['connect', 'createConnection'], 'node.net'); replace(net.Socket.prototype, ['connect'], 'node.net.Socket');
  replace(require('node:tls'), ['connect'], 'node.tls');
  replace(require('node:dgram'), ['createSocket'], 'node.dgram');
  const dns = require('node:dns');
  for (const [object, label] of [[dns, 'node.dns'], [dns.promises, 'node.dns.promises'], [dns.Resolver.prototype, 'node.dns.Resolver'], [dns.promises.Resolver.prototype, 'node.dns.promises.Resolver']]) replace(object, Object.getOwnPropertyNames(object).filter(name => /^(lookup|resolve|reverse)/.test(name)), label);
  if (globalThis.fetch) globalThis.fetch = deny('global.fetch');
  if (globalThis.WebSocket) globalThis.WebSocket = class { constructor() { deny('global.WebSocket')(); } };
  require('node:module').syncBuiltinESMExports();
  replace(electron.net, ['request', 'fetch', 'resolveHost'], 'electron.net');
  for (const flag of ['disable-background-networking', 'disable-component-update', 'disable-domain-reliability', 'disable-quic', 'no-pings', 'no-proxy-server']) electron.app.commandLine.appendSwitch(flag);
  electron.app.commandLine.appendSwitch('host-resolver-rules', 'MAP * ~NOTFOUND');
  electron.app.commandLine.appendSwitch('disable-features', 'OptimizationHints,MediaRouter,NetworkTimeServiceQuerying,SpellcheckService');
  electron.app.on('session-created', configureSession);
}
module.exports = { installOffline, configureSession, getNetworkAttempts: () => attempts.map(item => ({ ...item })), isInstalled: () => installed };
