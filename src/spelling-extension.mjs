import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
export const spellingKey = new PluginKey('cosmoItalianSpelling');
export function italianSpelling(current) {
  const decorate = doc => {
    const marks = [];
    doc.descendants((node, position) => {
      if (!node.isTextblock) return;
      // I cambi di grassetto/colore non spezzano una parola. Gli oggetti inline
      // occupano le stesse posizioni del documento, ma separano le parole.
      let text = '';
      node.forEach(child => { text += child.isText ? child.text : ' '.repeat(child.nodeSize); });
      for (const error of current.current.errors(text)) marks.push(Decoration.inline(position + 1 + error.from, position + 1 + error.to, { class: 'spelling-error', 'data-spelling-word': error.word, title: `Parola non presente nel dizionario italiano: ${error.word}` }));
      return false;
    });
    return DecorationSet.create(doc, marks);
  };
  return new Plugin({ key: spellingKey, state: { init: (_, state) => decorate(state.doc), apply: (transaction, previous) => transaction.docChanged || transaction.getMeta(spellingKey) ? decorate(transaction.doc) : previous.map(transaction.mapping, transaction.doc) }, props: { decorations: state => spellingKey.getState(state) } });
}
