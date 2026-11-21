import DOMPurify from 'dompurify';

async function nativeFileOperation(operation) {
  try { return await operation(); }
  catch (error) {
    const message = String(error?.message || 'Operazione sul file non riuscita.').replace(/^Error invoking remote method '[^']+':\s*/, '').replace(/^Error:\s*/, '');
    if (/\b(EBUSY|EPERM|EACCES)\b/.test(message)) throw new Error('Il file è occupato o non hai i permessi necessari. Scegli un’altra destinazione.');
    if (/\bENOSPC\b/.test(message)) throw new Error('Spazio su disco insufficiente. Scegli un’altra destinazione.');
    if (/\bENOENT\b/.test(message)) throw new Error('File o cartella non trovati. Controlla il percorso e riprova.');
    throw new Error(message);
  }
}

export function safeHtml(html) {
  const clean = DOMPurify.sanitize(html, { FORBID_TAGS: ['style', 'iframe', 'video', 'audio', 'form', 'input', 'object', 'embed', 'svg', 'math'], FORBID_ATTR: ['srcset', 'target'] });
  const parsed = new DOMParser().parseFromString(clean, 'text/html');
  for (const img of parsed.querySelectorAll('img')) if (!/^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(img.getAttribute('src') || '')) img.remove();
  for (const link of parsed.querySelectorAll('a')) link.replaceWith(...link.childNodes);
  for (const element of parsed.querySelectorAll('[style]')) {
    const old = element.style, allowed = [];
    for (const prop of ['color', 'background-color']) { const value = old.getPropertyValue(prop); if (/^(#[\da-f]{3,8}|rgba?\([\d.,%\s]+\)|[a-z]{1,20})$/i.test(value)) allowed.push(`${prop}:${value}`); }
    if (/^(Calibri|Arial|Georgia|Times New Roman|Verdana|Consolas|serif|sans-serif)(,\s*(serif|sans-serif))?$/i.test(old.fontFamily.replaceAll('"', '').replaceAll("'", ''))) allowed.push(`font-family:${old.fontFamily}`);
    if (/^\d{1,3}(\.\d+)?(pt|px)$/.test(old.fontSize) && parseFloat(old.fontSize) <= 200) allowed.push(`font-size:${old.fontSize}`);
    if (['left', 'right', 'center', 'justify'].includes(old.textAlign)) allowed.push(`text-align:${old.textAlign}`);
    element.removeAttribute('style'); if (allowed.length) element.setAttribute('style', allowed.join(';'));
  }
  return parsed.body.innerHTML;
}
export async function chooseFile() {
  if (window.cosmoffice) return nativeFileOperation(() => window.cosmoffice.openFile());
  return new Promise(resolve => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.docx,.xlsx,.csv,.tsv,.pdf,.txt,.html';
    input.onchange = async () => { const file = input.files[0]; resolve(file ? { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) } : null); };
    input.oncancel = () => resolve(null); input.click();
  });
}
export async function saveFile(name, bytes, type) {
  if (window.cosmoffice) return nativeFileOperation(() => window.cosmoffice.saveFile(name, bytes));
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return { name };
}
export function fileTitle(name) { return name.replace(/\.(docx|xlsx|csv|tsv|pdf|html|txt)$/i, ''); }
export function downloadName(title, ext) { return `${title.replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').trim().slice(0, 120) || 'Senza titolo'}.${ext}`; }
