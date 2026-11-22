# Changelog

Le modifiche rilevanti sono documentate in italiano secondo [Keep a Changelog](https://keepachangelog.com/it-IT/1.1.0/). Le release seguono il [versionamento semantico](https://semver.org/lang/it/): `0.x` durante l'anteprima. Una versione nel pacchetto non dimostra che una Release GitHub sia stata pubblicata.

## [Non rilasciato]

### Aggiunto

- Licenza d’uso A adottata in LICENSE: uso gratuito, codice originale e grafica riservati, nessuna redistribuzione degli installer; consentito condividere il link ufficiale. Titolare e recapito forniti dall’utente: Daniele Spalletti, danielespalletti@cosmonet.info; revisione professionale necessaria. B non adottata; pacchetti 0.2.2 e impostazione aggiornamenti invariati. Audit dei metadati rileva l’assenza del file della licenza propria negli installer pubblici; allineamento futuro non eseguito.
- Due bozze non operative della licenza utenti in docs/LICENZA-BOZZE.md: uso gratuito con codice e marchio riservati, oppure apertura del codice con confronto MIT/Apache-2.0. Nessuna licenza selezionata e LICENSE invariato.
- Updater nel main per una successiva versione: TLS Node con certificato verificato, soli host GitHub del progetto, SHA-256 e conferma esplicita prima di installare. Windows NSIS e AppImage, Mac solo notifica. Interruttore per disattivarlo; audit Node e NetLog Chromium nei test. Non incluso retroattivamente negli installer 0.2.2.
- DMG Mac Intel/Apple Silicon in CI, senza firma o notarizzazione, con verifica del contenitore e dell’architettura; guida “Aprire CosmOffice su Mac”. Nessun collaudo su hardware fisico dichiarato.
- Nove screenshot reali e ottimizzati dell’interfaccia nella sezione “Com’è fatto” del README; generazione ripetibile con scripts/screenshots.mjs, esempi originali, profilo isolato e controlli su dati privati, dimensioni e risorse esterne. Nessuna modifica all’app.

### Modificato

- Nome e recapito nella licenza A e nei testi correnti completati con i dati forniti dall’utente; condizioni d’uso e report storici invariati.

### Corretto

- Distribuzione Linux: riconosciuto il nome AppImage reale linux-x86_64 prodotto da electron-builder. Le AppImage inattese ora causano errore, invece di essere ignorate. Completamento della Release pubblica con preservazione dell’installer Windows e riepilogo checksum aggiornato.

## [0.2.2] - 2026-11-22

### Aggiunto

- Pacchetti DMG Mac senza firma per Intel e Apple Silicon e guida al primo avvio; disponibilità reale indicata nell’elenco dei pacchetti, hardware fisico non collaudato.
- Pubblicazione ordinaria dell’anteprima tramite tag v*: installer Windows x64 e AppImage Linux x64 senza certificati, checksum SHA-256 individuali e riepilogo. Le piattaforme mancanti vengono dichiarate nelle note.
- Apertura e modifica essenziale DOCX/XLSX e lettura PDF offline; grafici a barre, linee e torta, ortografia italiana locale e impostazioni personalizzabili.
- Studio statico ArtCraft con 80 file tracciati a commit immutabili: licenze ed esclusioni, conservazione DOCX/XLSX, limiti di --strict, aggiornamenti e privacy dei log. Idee ordinate per valore, senza integrazioni o scelta del motore.
- Documentazione dell’autorizzazione al futuro trasporto TLS Node per gli aggiornamenti, con conferma prima dell’installazione e verifiche di rete richieste; nessun trasporto implementato in questo passo.

- Prova guidata con otto prove e soli esiti Ok/Problema/Non provato, salvati localmente e inclusi nelle prime otto righe del rapporto copiato. Nessun campo libero o invio automatico.

- Rapporto tester locale da Impostazioni e menu: ultimi 50 eventi, descrizioni sicure, anteprima, copia negli appunti e svuotamento. Nessun invio automatico.

- Studio di LibreOffice, ONLYOFFICE, Collabora, Calligra, AbiWord, Gnumeric, Apache OpenOffice e CryptPad con fonti, limiti della ricerca e confronto con CosmOffice 0.2.2.
- Opportunità ordinate per valore e difficoltà, alternative del motore DOCX/XLSX senza scelta automatica e registro delle consultazioni.
- Roadmap con stati e priorità espliciti e documento delle decisioni già adottate e ancora aperte.
- Validatore Microsoft Open XML SDK 3.5.1 bloccante nella CI: 13 nuovi esportati, controlli negativi DOCX/XLSX e audit separato della copia storica.

### Modificato

- Rapporto tester compatto per i commenti Facebook: una riga per evento, fino a 50, dimensione verificata entro 6 KB; invio sempre manuale.

- Documentazione di validazione e bug aggiornata distinguendo funzionalità provate, difetti di formato e lavoro locale non pubblicato.
- Collegamenti di lettura della ricerca nel README; recupero successivo del validatore sospeso, senza implementare le altre proposte dello studio.

### Corretto

- FMT-001: tipo MIME dei disegni dei nuovi grafici XLSX.
- FMT-002: ordine dei figli font XLSX e rimozione di editAs dagli ancoraggi oneCellAnchor.
- FMT-003: conservazione di evenAndOddHeaders DOCX senza duplicazioni.

### Rimosso

- Nulla rimosso dal prodotto.

### Limiti noti

- Pacchetti senza firma: Windows può mostrare SmartScreen, Mac può bloccare il primo avvio. Aggiornamenti online ancora assenti; si scarica e installa una nuova versione manualmente. DMG Mac non collaudato su computer fisici.
- La gratuità non equivale a compatibilità completa con Microsoft Office. PDF senza OCR, annotazioni o modifica del testo; grafici esterni e altri contenuti complessi restano bloccati quando rilevati.
- Fedeltà Word/Excel completa non dimostrata; alcune funzionalità restano in sola lettura o con export bloccato.
- Il vecchio XLSX v1 resta una copia identica con il difetto MIME originale, come eccezione storica esplicita; Excel reale non collaudato.
- Nessun confronto completo delle suite installate sugli stessi documenti, nessun benchmark comparativo, Microsoft Office reale e installazioni pulite non collaudati.
- Nessun nuovo motore scelto e nessuna proposta dello studio implementata.

### Prove mancanti

- Installazione su computer puliti; utilizzo reale su hardware macOS e Linux; documenti Office complessi e Microsoft Word/Excel reali. I test coprono un corpus ristretto, non una certificazione Office.
- Firma, notarizzazione e aggiornamenti automatici non collaudati né inclusi in questa versione pubblicata.

### Prossimi passi

- Collaudo dei pacchetti e del primo avvio Mac; poi aggiornamenti con trasporto TLS Node, SHA-256, conferma prima dell’installazione e soli host autorizzati.
- Raccogliere prove dei tester e riprodurre i problemi con documenti autorizzati, dando priorità a integrità e compatibilità.

### Cosa ti aspetti da CosmOffice?

Rispondi nei commenti del post Facebook di CosmOffice:

1. Che documenti apri di solito?
2. Cosa ti aspetti da CosmOffice?
3. Quale funzione ti manca?
4. Cosa ti ha bloccato durante la prova?

Puoi copiare il rapporto da “Segnala un problema” dopo averlo letto. L’app non invia niente automaticamente. Non pubblicare documenti o dati personali nei commenti.

## Nota sulla cronologia precedente

La versione applicativa attuale è **0.2.2, anteprima**. I cambiamenti precedenti e i loro esiti sono nei [report](docs/report/) e nella cronologia Git. Questo primo CHANGELOG non inventa date di pubblicazione e non attribuisce a questo passo una pubblicazione della Release 0.2.2. Le note delle future Release dovranno derivare dalle voci effettive di questo file e includere novità, correzioni, limiti, prove mancanti e prossimi passi.
