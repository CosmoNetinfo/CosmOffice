import DOMPurify from 'dompurify';

export function safeHtml(html) {
  const clean = DOMPurify.sanitize(html, { FORBID_TAGS: ['style', 'iframe', 'video', 'audio', 'form', 'input', 'object', 'embed', 'svg', 'math'], FORBID_ATTR: ['style', 'srcset', 'target'] });
  const parsed = new DOMParser().parseFromString(clean, 'text/html');
  for (const img of parsed.querySelectorAll('img')) if (!/^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(img.getAttribute('src') || '')) img.remove();
  for (const link of parsed.querySelectorAll('a')) link.replaceWith(...link.childNodes);
  return parsed.body.innerHTML;
}
export async function chooseFile() {
  if (window.cosmoffice) return window.cosmoffice.openFile();
  return new Promise(resolve => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.docx,.xlsx,.pdf,.txt,.html';
    input.onchange = async () => { const file = input.files[0]; resolve(file ? { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) } : null); };
    input.oncancel = () => resolve(null); input.click();
  });
}
export async function saveFile(name, bytes, type) {
  if (window.cosmoffice) return window.cosmoffice.saveFile(name, bytes);
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return { name };
}
export function fileTitle(name) { return name.replace(/\.(docx|xlsx|pdf|html|txt)$/i, ''); }
export function downloadName(title, ext) { return `${title.replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').trim().slice(0, 120) || 'Senza titolo'}.${ext}`; }
