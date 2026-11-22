# Changelog

Le modifiche rilevanti sono documentate in italiano secondo [Keep a Changelog](https://keepachangelog.com/it-IT/1.1.0/). Le release seguono il [versionamento semantico](https://semver.org/lang/it/): `0.x` durante l'anteprima. Una versione nel pacchetto non dimostra che una Release GitHub sia stata pubblicata.

## [Non rilasciato]

### Aggiunto

- Studio di LibreOffice, ONLYOFFICE, Collabora, Calligra, AbiWord, Gnumeric, Apache OpenOffice e CryptPad con fonti, limiti della ricerca e confronto con CosmOffice 0.2.2.
- Opportunità ordinate per valore e difficoltà, alternative del motore DOCX/XLSX senza scelta automatica e registro delle consultazioni.
- Roadmap con stati e priorità espliciti e documento delle decisioni già adottate e ancora aperte.
- Validatore Microsoft Open XML SDK 3.5.1 bloccante nella CI: 13 nuovi esportati, controlli negativi DOCX/XLSX e audit separato della copia storica.

### Modificato

- Documentazione di validazione e bug aggiornata distinguendo funzionalità provate, difetti di formato e lavoro locale non pubblicato.
- Collegamenti di lettura della ricerca nel README; recupero successivo del validatore sospeso, senza implementare le altre proposte dello studio.

### Corretto

- FMT-001: tipo MIME dei disegni dei nuovi grafici XLSX.
- FMT-002: ordine dei figli font XLSX e rimozione di editAs dagli ancoraggi oneCellAnchor.
- FMT-003: conservazione di evenAndOddHeaders DOCX senza duplicazioni.

### Rimosso

- Nulla rimosso dal prodotto.

### Limiti noti

- Fedeltà Word/Excel completa non dimostrata; alcune funzionalità restano in sola lettura o con export bloccato.
- Il vecchio XLSX v1 resta una copia identica con il difetto MIME originale, come eccezione storica esplicita; Excel reale non collaudato.
- Nessun confronto completo delle suite installate sugli stessi documenti, nessun benchmark comparativo, Microsoft Office reale e installazioni pulite non collaudati.
- Nessun nuovo motore scelto e nessuna proposta dello studio implementata.

## Nota sulla cronologia precedente

La versione applicativa attuale è **0.2.2, anteprima**. I cambiamenti precedenti e i loro esiti sono nei [report](docs/report/) e nella cronologia Git. Questo primo CHANGELOG non inventa date di pubblicazione e non attribuisce a questo passo una pubblicazione della Release 0.2.2. Le note delle future Release dovranno derivare dalle voci effettive di questo file e includere novità, correzioni, limiti, prove mancanti e prossimi passi.
