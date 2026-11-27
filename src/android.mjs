// The native port is delivered only to the bundled main frame, never to a remote page.
export const isAndroid = typeof navigator !== 'undefined' && /CosmOfficeAndroid\/1\b/.test(navigator.userAgent);
export const ANDROID_FILE_LIMIT = 10 * 1024 * 1024;
const waiting = new Map();
let port, resolvePort, dark = false, info;
const ready = isAndroid ? new Promise(resolve => { resolvePort = resolve; }) : Promise.resolve();
if (isAndroid) {
  window.addEventListener('message', event => {
    if (event.source !== null || !['', 'null', 'https://appassets.androidplatform.net'].includes(event.origin)) return;
    if (port || window !== window.top || event.data !== 'cosmoffice:native-port:v1' || event.ports.length !== 1) return;
    port = event.ports[0];
    port.onmessage = ({ data }) => {
      let reply; try { reply = JSON.parse(data); } catch { return; }
      if (reply.event === 'back') { window.dispatchEvent(new Event('cosmoffice:android-back')); return; }
      if (reply.event === 'theme') { dark = reply.dark === true; window.dispatchEvent(new Event('cosmoffice:android-theme')); return; }
      const call = waiting.get(reply.id); if (!call) return;
      waiting.delete(reply.id); clearTimeout(call.timer);
      if (reply.ok) call.resolve(reply.value); else call.reject(new Error(reply.error || 'Operazione Android non riuscita.'));
    };
    resolvePort();
  });
}
export async function androidCall(operation, value = {}) {
  if (!isAndroid) throw new Error('Funzione disponibile soltanto su Android.');
  if (!port) await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Collegamento Android non disponibile. Riapri l’app.')), 15000);
    ready.then(() => { clearTimeout(timer); resolve(); });
  });
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    // No deadline on a system picker: the user may need time to choose a document.
    waiting.set(id, { resolve, reject });
    try { port.postMessage(JSON.stringify({ id, operation, ...value })); }
    catch { waiting.delete(id); reject(new Error('Collegamento Android interrotto. Riapri l’app.')); }
  });
}
export function decodeAndroidBytes(value) {
  if (typeof value !== 'string' || value.length > Math.ceil(ANDROID_FILE_LIMIT / 3) * 4) throw new Error('Android apre file fino a 10 MB.');
  const binary = atob(value), bytes = new Uint8Array(binary.length);
  if (binary.length > ANDROID_FILE_LIMIT) throw new Error('Android apre file fino a 10 MB.');
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
export function encodeAndroidBytes(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (data.byteLength > ANDROID_FILE_LIMIT) throw new Error('Android salva file fino a 10 MB. Esporta separatamente i documenti del backup.');
  let binary = '';
  for (let i = 0; i < data.length; i += 32768) binary += String.fromCharCode(...data.subarray(i, i + 32768));
  return btoa(binary);
}
export async function androidOpen() {
  const result = await androidCall('open');
  return result ? { name: result.name, bytes: decodeAndroidBytes(result.base64) } : null;
}
export async function androidSave(name, bytes, type) { return androidCall('save', { name, type, base64: encodeAndroidBytes(bytes) }); }
export async function androidInfo() {
  return info ||= androidCall('info').then(value => {
    dark = value.dark === true; window.dispatchEvent(new Event('cosmoffice:android-theme'));
    return { os: /^[\d.]{1,20}$/.test(value.os) ? value.os : 'non disponibile',
      architecture: ['arm64-v8a', 'armeabi-v7a', 'x86_64', 'x86'].includes(value.architecture) ? value.architecture : 'non disponibile',
      webview: /^\d+(\.\d+){1,3}$/.test(value.webview) ? value.webview : 'non disponibile' };
  });
}
export const androidDark = () => dark;
if (isAndroid) androidInfo().catch(() => {});
