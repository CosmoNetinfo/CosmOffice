import React, { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { safeHtml } from './files.mjs';
import { encodeMarkdown } from './markdown.mjs';

export default function MarkdownEditor({ record, onEdit, api }) {
  const [source, setSource] = useState(record.payload);
  const current = useRef(source);
  // Parsing is local. Keep large files editable/exportable without an expensive preview.
  const preview = useMemo(() => {
    if (source.length > 200000) return { message: 'Anteprima sospesa oltre 200.000 caratteri. Puoi modificare e salvare tutto il testo.' };
    try { return { html: safeHtml(DOMPurify.sanitize(marked.parse(source, { async: false, gfm: true }), { FORBID_ATTR: ['src', 'srcset', 'href', 'style', 'poster', 'background'], FORBID_TAGS: ['img', 'link'] })) }; }
    catch { return { message: 'Anteprima non disponibile. Il testo originale resta modificabile e salvabile.' }; }
  }, [source]);
  useEffect(() => {
    const editor = { snapshot: () => current.current, export: async () => encodeMarkdown(current.current) };
    api.current = editor;
    return () => { if (api.current === editor) api.current = null; };
  }, [api]);
  return <section className="markdown-editor" aria-label="Editor Markdown">
    <p className="markdown-help">Markdown · Scrivi il testo a sinistra e controlla l’anteprima. Il file .md conserva la sintassi originale. Link e immagini esterne non vengono aperti né scaricati.</p>
    <div className="markdown-panes">
      <label className="markdown-source">Testo Markdown<textarea aria-label="Testo Markdown" spellCheck={false} value={source} onChange={event => { const value = event.target.value; current.current = value; setSource(value); onEdit(value); }}/></label>
      <section className="markdown-preview" aria-label="Anteprima Markdown"><strong>Anteprima</strong>{preview.message ? <p role="status">{preview.message}</p> : <div dangerouslySetInnerHTML={{ __html: preview.html }}/>}</section>
    </div>
  </section>;
}
