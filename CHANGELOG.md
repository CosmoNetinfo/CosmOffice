# Changelog

Le modifiche rilevanti sono documentate in italiano secondo [Keep a Changelog](https://keepachangelog.com/it-IT/1.1.0/). Le release seguono il [versionamento semantico](https://semver.org/lang/it/): `0.x` durante l'anteprima. Una versione nel pacchetto non dimostra che una Release GitHub sia stata pubblicata.

## [Non rilasciato]

### Aggiunto

- Prima implementazione APK Android offline (Android 10+), Activity Java e WebView con asset incorporati; selettore di sistema per apertura e salvataggio di copie DOCX/XLSX/PDF/Markdown, limite 10 MB.
- Compilazione APK, controllo permessi/licenze e prove native su emulatore nella CI Android separata; firma privata locale, checksum e verifica del certificato. Nessuna chiave in Git o nella CI.

### Modificato

- Documentati gli esiti della Release pubblica desktop 0.2.3 e del completamento DMG; nessuna sostituzione dei pacchetti pubblici.

- Adattamenti della piattaforma Android: tasto Indietro, appunti del rapporto sicuro, tema sistema, Informazioni e aggiornamenti manuali dell’APK. Desktop invariato nella politica di rete.

### Corretto

- Driver Android per celle/Markdown: attesa della finestra pronta, immissione tramite tastiera e conferma; controllo di B2/B3 prima e dopo il salvataggio. Raccolta degli output parziali senza mascherare errori. DOCX round trip passato nella sesta run, resto del collaudo aperto.

- Catture Android: attesa del disegno WebView prima degli screenshot dell’app, dopo aver rilevato una Home fotografata troppo presto. Collaudo completo ancora in corso.

- Driver Android: selettore reale tramite azioni di accessibilità, conferma del nome e attesa dell’export/riapertura; il solo ritorno del click non determina successo. Corretto il tentativo a coordinate che non selezionava il file nel runner.

- Test Android al cold boot: attesa limitata a 90 secondi per scrittura/rilettura reali nella Download, copia dei soli byte e verifica SHA-256. La precedente preparazione è tornata a fallire: bug riaperto, nessuna dichiarazione di collaudo completo.

- Test nativo Android: attesa della finestra DocumentsUI prima del campo nome; screenshot da file privati e raccolta obbligatoria. Seconda CI con avvio PASS e DOCX incompleto; nessun successo complessivo dichiarato.

- Preparazione campioni del test Android: passaggio tramite cartella temporanea e copia nella Download come shell, con SHA-256 verificato prima dell’avvio; nessun permesso aggiunto all’app. Prima CI interrotta su adb push, prova nativa non ancora riuscita.

- Controllo risorse DMG: verifica dell’architettura del job singolo, mantenendo la richiesta di entrambi i DMG nel controllo predefinito.

- Gestione Indietro compatibile con il target Android recente e conferma del salvataggio solo dopo chiusura dello stream del provider.

### Rimosso

- Nessuna funzione desktop rimossa. Stampa/esportazione DOCX→PDF non disponibili nell’APK.

### Limiti noti

- Prima anteprima Android ancora da collaudare completamente; non equivalenza alle suite Office. Nessuna pubblicazione Android nelle Release desktop e nessun aggiornamento automatico Android. Limite 10 MB per trasferimento, inclusi backup.

### Prove mancanti

- Telefono/tablet fisico, tastiera virtuale e gesti, selettori di fornitori cloud, prestazioni su dispositivi con poca memoria. Esiti osservati dell’emulatore nel report corrente.

### Prossimi passi

- Completare e leggere le prove native, poi installare l’APK firmato su Android reale; conservare chiave e password fuori Git con backup riservato.

## [0.2.3] - 2026-11-25

### Aggiunto

- Lettura, creazione e modifica di file Markdown UTF-8 in CosmoWrite, anteprima locale protetta, esportazione .md senza conversione e conservazione nei backup. Parser `marked` 18.3.0 MIT incluso offline e attribuito. Test browser, Electron e pacchetto Windows aggiunti alla CI.
- Pulsante «Controlla aggiornamenti ora»: una sola operazione su richiesta, HTTPS verificato, due host GitHub autorizzati, SHA-256 e conferma prima di installare. Rete spenta al termine o dopo annullamento.
- Impostazioni → Informazioni: versione, titolare Daniele Spalletti, licenza A e attribuzioni lette dai file locali, senza rete.
- LICENSE e THIRD_PARTY_NOTICES.txt nelle risorse dei pacchetti; controllo dei byte negli archivi Windows, AppImage e DMG in CI. Licenza propria anche nell’ASAR.
- Lavoro Windows separato in CI: installazione NSIS reale non interattiva nel runner, avvio visibile dell’app installata, Home, apertura DOCX/XLSX/PDF, controllo delle licenze e disinstallazione. Selettore file automatizzato; lettura e rendering reali.

### Modificato

- Aggiornamenti spenti di default e nessun controllo all’avvio. Vecchie preferenze «attivo» prive del nuovo consenso ignorate. Controlli periodici facoltativi ogni sei ore solo dopo attivazione esplicita; nessuna richiesta nemmeno al loro avvio.
- Nome e recapito della licenza A compilati con i dati del titolare; condizioni invariate. Metadati dei nuovi pacchetti allineati alla licenza proprietaria e al titolare.
- Screenshot reali rigenerabili, comprese le nuove pagine Aggiornamenti e Informazioni; didascalie di sviluppo 0.2.3.

### Corretto

- Nota di costruzione Mac: i primi job del tag 0.2.3 hanno costruito i DMG ma sono falliti perché il controllo risorse cercava anche l’altra architettura. Il completamento Mac verifica i file singolarmente sugli stessi sorgenti del tag e conserva gli installer Windows/Linux già pubblicati. Nessun collaudo su Mac fisico.
- LIC-001: distribuzione della licenza propria nei nuovi pacchetti con verifica reale dei file, non soltanto della configurazione. La 0.2.2 pubblica resta invariata e mantiene il precedente assetto.
- Consenso d’installazione distinto dal permesso temporaneo di rete: il file verificato resta installabile solo dopo conferma anche quando il trasporto si è spento.

### Rimosso

- Controllo di rete implicito all’avvio e abilitazione predefinita degli aggiornamenti. Nessuna rimozione dell’interruttore periodico: rimane una scelta effettiva dell’utente.

### Limiti noti

- Markdown: solo UTF-8, anteprima senza immagini o link attivi, matematica, ortografia e conversione Office/PDF. Oltre 200.000 caratteri anteprima sospesa; dopo editing terminatori LF. Sorgente originale conservato nel file .md.
- Anteprima con compatibilità DOCX/XLSX/PDF parziale; nessun nuovo motore o intervento sui motori in questa versione.
- Pacchetti non firmati; Mac solo avviso/download manuale. Rete autorizzata esclusivamente a github.com e release-assets.githubusercontent.com per le Release CosmoNetinfo/CosmOffice.
- La licenza deve essere rivista da un professionista. SHA-256 da GitHub HTTPS non equivale a firma indipendente.

### Prove mancanti

- PC Windows fisico pulito, SmartScreen, UAC con antivirus e utente normale. Il runner non sostituisce queste prove; il test CI non collauda il dialogo nativo di selezione file.
- AppImage realmente in uso e hardware Mac; primo avvio/Gatekeeper reali. Nessuna installazione manuale dell’updater con elevazione certificata.

### Prossimi passi

- Pubblicazione autorizzata dal titolare il 25 novembre 2026. Raccogliere prove su PC Windows pulito, SmartScreen/UAC/antivirus, AppImage in uso e Mac fisico; correggere prima i problemi di affidabilità segnalati.
- Chi ha la 0.2.2 aggiorna a mano una volta alla 0.2.3, poi usa il pulsante «Controlla aggiornamenti ora» per le future versioni superiori. Chi ha una build di prova già chiamata 0.2.3 deve installare manualmente questa Release: lo stesso numero non viene proposto come aggiornamento.

### Cosa ti aspetti da CosmOffice?

Rispondi nei commenti del post Facebook di CosmOffice:

1. Che documenti apri più spesso?
2. Cosa ti aspetti da CosmOffice?
3. Quale funzione ti manca?
4. Che cosa ti ha bloccato durante la prova?

Puoi incollare il rapporto da Impostazioni → Segnala un problema e gli esiti della Prova guidata. Non pubblicare documenti o dati personali. L’app non invia nulla da sola.

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
