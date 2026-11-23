import React, { useEffect, useState } from 'react';

export default function About({ version }) {
  const [name, setName] = useState('LICENSE'), [text, setText] = useState(''), [error, setError] = useState(false);
  useEffect(() => {
    let current = true; setText(''); setError(false);
    const load = window.cosmoffice?.legalText ? window.cosmoffice.legalText(name) : fetch(`./legal/${name}`).then(response => { if (!response.ok) throw new Error(); return response.text(); });
    load.then(value => { if (current) setText(value); }).catch(() => { if (current) setError(true); });
    return () => { current = false; };
  }, [name]);
  return <section className="settings-group">
    <div className="settings-group-title"><h2>Informazioni su CosmOffice</h2><p>Versione {version} · Anteprima desktop</p></div>
    <div className="settings-panel about-legal">
      <p><strong>Titolare:</strong> Daniele Spalletti · danielespalletti@cosmonet.info</p>
      <p>Licenza d’uso A: uso gratuito, codice e marchio riservati. Testi letti da file locali, senza Internet.</p>
      <nav aria-label="Testi legali"><button className="button secondary" aria-pressed={name === 'LICENSE'} onClick={() => setName('LICENSE')}>Licenza d’uso</button> <button className="button secondary" aria-pressed={name === 'THIRD_PARTY_NOTICES.txt'} onClick={() => setName('THIRD_PARTY_NOTICES.txt')}>Attribuzioni di terzi</button></nav>
      <p>Il testo definitivo deve essere rivisto da un professionista; questa stesura non è consulenza legale.</p>
      {error ? <p role="alert">Non riesco a leggere il testo locale. Riapri l’app o verifica il pacchetto.</p> : <textarea readOnly aria-label={name === 'LICENSE' ? 'Testo della licenza A' : 'Testo delle attribuzioni di terzi'} value={text || 'Lettura del file locale…'} rows={14} spellCheck={false}/>}
    </div>
  </section>;
}
