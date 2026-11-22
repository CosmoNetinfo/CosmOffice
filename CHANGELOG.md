# Changelog

Le modifiche rilevanti sono documentate in italiano secondo [Keep a Changelog](https://keepachangelog.com/it-IT/1.1.0/). Le release seguono il [versionamento semantico](https://semver.org/lang/it/): `0.x` durante l'anteprima. Una versione nel pacchetto non dimostra che una Release GitHub sia stata pubblicata.

## [Non rilasciato]

### Aggiunto

- Studio di LibreOffice, ONLYOFFICE, Collabora, Calligra, AbiWord, Gnumeric, Apache OpenOffice e CryptPad con fonti, limiti della ricerca e confronto con CosmOffice 0.2.2.
- Opportunità ordinate per valore e difficoltà, alternative del motore DOCX/XLSX senza scelta automatica e registro delle consultazioni.
- Roadmap con stati e priorità espliciti e documento delle decisioni già adottate e ancora aperte.

### Modificato

- Documentazione di validazione e bug aggiornata distinguendo funzionalità provate, difetti di formato e lavoro locale non pubblicato.
- Collegamenti di lettura della ricerca nel README; nessuna modifica al codice dell'app, ai test, alle dipendenze o ai workflow in questo passo.

### Corretto

- Nessuna correzione applicativa in questo passo di studio. I difetti di conformità rilevati sono segnalati, non dichiarati risolti sul main.

### Rimosso

- Nulla rimosso dal prodotto.

### Limiti noti

- Fedeltà Word/Excel completa non dimostrata; alcune funzionalità restano in sola lettura o con export bloccato.
- Difetti FMT-001/002/003 nell'export del main di riferimento; il prototipo di correzione e validazione è separato e non distribuito.
- Nessun confronto completo delle suite installate sugli stessi documenti, nessun benchmark comparativo, Microsoft Office reale e installazioni pulite non collaudati.
- Nessun nuovo motore scelto e nessuna proposta dello studio implementata.

## Nota sulla cronologia precedente

La versione applicativa attuale è **0.2.2, anteprima**. I cambiamenti precedenti e i loro esiti sono nei [report](docs/report/) e nella cronologia Git. Questo primo CHANGELOG non inventa date di pubblicazione e non attribuisce a questo passo una pubblicazione della Release 0.2.2. Le note delle future Release dovranno derivare dalle voci effettive di questo file e includere novità, correzioni, limiti, prove mancanti e prossimi passi.
