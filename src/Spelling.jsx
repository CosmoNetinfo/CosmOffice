import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePreferences } from './preferences.jsx';
import { createItalianChecker, personalDictionaryKey, validatePersonalWord } from './spelling.mjs';

const Context = createContext(null);
let dictionary;
function loadDictionary() {
  return dictionary ||= window.cosmoffice?.italianDictionary ? window.cosmoffice.italianDictionary() : fetch(new URL('./dictionaries/it_IT.words', document.baseURI)).then(response => {
    if (!response.ok) throw new Error('Dizionario italiano non disponibile.');
    return response.text();
  });
}
export function SpellingProvider({ children }) {
  const { settings } = usePreferences();
  const [text, setText] = useState(''), [error, setError] = useState('');
  const [personal, setPersonal] = useState(() => {
    try { const data = JSON.parse(localStorage.getItem(personalDictionaryKey) || '[]'); return Array.isArray(data) ? [...new Set(data.map(validatePersonalWord))].slice(0, 10000) : []; }
    catch { return []; }
  });
  useEffect(() => { loadDictionary().then(setText).catch(() => setError('Impossibile caricare il dizionario italiano incluso. Il controllo ortografico non è attivo.')); }, []);
  const checker = useMemo(() => createItalianChecker(text, personal), [text, personal]);
  function save(next) {
    if (next.length > 10000) throw new Error('Il dizionario personale può contenere al massimo 10.000 parole.');
    try { localStorage.setItem(personalDictionaryKey, JSON.stringify(next)); }
    catch { throw new Error('Impossibile salvare il dizionario personale sul dispositivo.'); }
    setPersonal(next);
  }
  const value = useMemo(() => ({ ready: !!text, error, personal, enabled: settings.spellcheck && !!text,
    errors: value => settings.spellcheck && text ? checker.errors(value) : [],
    add: value => save([...new Set([...personal, validatePersonalWord(value)])].sort()),
    remove: value => save(personal.filter(word => word !== value)),
  }), [text, error, personal, checker, settings.spellcheck]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSpelling() { return useContext(Context); }
export function PersonalDictionary() {
  const spelling = useSpelling(), [word, setWord] = useState(''), [message, setMessage] = useState('');
  return <div className="personal-dictionary"><p role="status">{spelling.error || (spelling.ready ? 'Italiano · dizionario incluso e pronto. Nessun download.' : 'Caricamento del dizionario locale…')}</p><form onSubmit={event => { event.preventDefault(); try { spelling.add(word); setWord(''); setMessage('Parola salvata sul dispositivo.'); } catch (error) { setMessage(error.message); } }}><input aria-label="Parola del dizionario personale" value={word} onChange={event => setWord(event.target.value)} maxLength={80}/><button className="button secondary">Aggiungi parola</button></form><p role="status">{message}</p><ul aria-label="Dizionario personale">{spelling.personal.map(item => <li key={item}>{item}<button aria-label={`Rimuovi ${item} dal dizionario`} onClick={() => { try { spelling.remove(item); setMessage('Parola rimossa.'); } catch (error) { setMessage(error.message); } }}>Rimuovi</button></li>)}</ul></div>;
}
