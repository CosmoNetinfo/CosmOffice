import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

test('Il processo principale non contiene updater o caricamenti da server', async () => {
  const source = await readFile(new URL('../electron/main.cjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /electron-updater|checkForUpdates|loadURL\s*\(|https?:\/\//);
  assert.ok(source.indexOf('installOffline(electron)') < source.indexOf("require('node:fs/promises')"));
});
test('Le API Node ed Electron sono bloccate prima di poter aprire connessioni', () => {
  const child = spawnSync(process.execPath, ['--input-type=commonjs', '-e', `
    const assert = require('node:assert/strict');
    const { EventEmitter } = require('node:events');
    const policy = require('./electron/offline.cjs');
    const app = new EventEmitter(); app.commandLine = { appendSwitch() {} };
    const electron = { app, net: { request() {}, fetch() {}, resolveHost() {} } };
    policy.installOffline(electron);
    const blocked = callback => assert.throws(callback, error => error.code === 'ERR_COSMO_OFFLINE');
    blocked(() => require('node:http').get('http://203.0.113.1'));
    blocked(() => require('node:https').request('https://203.0.113.1'));
    blocked(() => require('node:http2').connect('https://203.0.113.1'));
    blocked(() => require('node:net').connect(443, '203.0.113.1'));
    blocked(() => new (require('node:net').Socket)().connect(443, '203.0.113.1'));
    blocked(() => require('node:tls').connect(443, '203.0.113.1'));
    blocked(() => require('node:dgram').createSocket('udp4'));
    blocked(() => require('node:dns').lookup('example.invalid', () => {}));
    blocked(() => require('node:dns').promises.resolve4('example.invalid'));
    blocked(() => new (require('node:dns').Resolver)().resolve4('example.invalid', () => {}));
    blocked(() => fetch('https://203.0.113.1'));
    blocked(() => new WebSocket('wss://203.0.113.1'));
    blocked(() => electron.net.request('https://203.0.113.1'));
    blocked(() => electron.net.fetch('https://203.0.113.1'));
    blocked(() => electron.net.resolveHost('example.invalid'));
    let beforeRequest;
    const session = { setSpellCheckerEnabled(value) { assert.equal(value, false); }, setPermissionRequestHandler() {}, setPermissionCheckHandler() {}, webRequest: { onBeforeRequest(handler) { beforeRequest = handler; } }, fetch() {}, resolveHost() {}, preconnect() {}, downloadURL() {} };
    policy.configureSession(session);
    blocked(() => session.fetch('https://203.0.113.1'));
    blocked(() => session.preconnect({ url: 'https://203.0.113.1', numSockets: 1 }));
    beforeRequest({ url: 'file:///documento.pdf' }, result => assert.equal(result.cancel, false));
    beforeRequest({ url: 'https://203.0.113.1/' }, result => assert.equal(result.cancel, true));
    assert.equal(policy.getNetworkAttempts().length, 18);
    assert.ok(require('node:fs').readFileSync('package.json').length > 0, 'filesystem locale ancora disponibile');
    console.log('PASS: 18 tentativi rilevati e bloccati, filesystem locale funzionante');
  `], { cwd: new URL('../', import.meta.url), encoding: 'utf8', timeout: 10000, windowsHide: true });
  assert.equal(child.status, 0, child.stdout + child.stderr);
});
