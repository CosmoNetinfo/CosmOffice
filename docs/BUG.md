# Registro dei bug CosmOffice

Aggiornamento del 22 novembre 2026: scelta A adottata in LICENSE, con uso gratuito e riserva su codice e marchio. Nessun bug applicativo chiuso. Titolare e recapito forniti: Daniele Spalletti (danielespalletti@cosmonet.info). Restano revisione professionale e distribuzione del testo nei futuri pacchetti. La precedente lacuna sulla concessione d’uso nel repository è affrontata dal nuovo testo; non si dichiara risolta la coerenza con la 0.2.2 già pubblicata.

Ordine: P1 (perdita o alterazione dati, crash, file corrotti), P2 (risultati o comportamento errati), P3 (limiti di impaginazione o usabilità). Uno stato risolto richiede una prova; le incompatibilità non ancora riprodotte non vengono dichiarate risolte.

## P1 Perdita o alterazione dei dati

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| FMT-001 | I nuovi disegni dei grafici dichiaravano application/vnd.openxmlformats-officedocument.drawingml.drawing+xml invece del tipo corretto senza drawingml. Microsoft SDK rifiuta il pacchetto. | Corretto per i nuovi esportati; copia storica v1 invariata per esplicita richiesta utente | Validatore SDK Microsoft, report separato per la copia storica |
| NET-001 | Il processo principale poteva contattare GitHub nelle release firmate per verificare/scaricare aggiornamenti. | Rimosso e bloccato dal guardiano offline; esiti nel report | Test Node delle API, Electron reale con nessun tentativo spontaneo e NetLog; richiesta intenzionale dal main rilevata e bloccata |
| NET-002 | Il controllo ortografico Electron può scaricare dizionari Hunspell dal CDN senza un’azione esplicita dell’utente. | Risolto: Hunspell nativo resta disabilitato; controllo italiano applicativo con lessico incorporato e parole personali locali | Sessioni e webPreferences native disabilitate; test ortografia Write/Grid anche dentro offline-smoke con NetLog |
| NET-003 | CI Linux del commit `defa84b`: NetLog registra il tentativo di download `en-us-10-2.bdic` dal CDN Chromium e una sonda UDP verso `[2001:4860:4860::8888]:443`, fuori dalle API JavaScript. Il costruttore Session avvia Hunspell prima dell’evento `session-created`. Windows locale non lo riproduceva. | Risolto e verificato in CI Linux: destinazione dizionari solo locale e lingue svuotate; risolutore/DoH disabilitati. | Il test rifiuta ogni TCP/UDP/QUIC/DNS e qualsiasi URL remoto nel NetLog. Nessuna eccezione per sonde o CDN. [Run fallita](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44953248300), [run riuscita](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44954563150) |
| DAT-008 | `05-intestazioni.docx`: esportare dopo una modifica eliminava intestazione, logo e piè di pagina con campo PAGE. | Corretto, esiti nel report del passo | `scripts/corpus-smoke.mjs`: conservazione parti e relazioni, ricaricamento bozza, backup, doppia esportazione e riapertura |
| DAT-010 | ExcelJS non riscrive i grafici importati e poteva perderli durante export o salvataggio della bozza. | Protezione introdotta: grafici esterni non riconosciuti in sola lettura, export XLSX bloccato, snapshot originale conservato. Grafici CosmOffice scritti come OOXML nativo anche nelle bozze. | tests/charts.test.mjs e charts-smoke: prova negativa senza metadati, nessun file esportato |
| DAT-009 | DOCX con commenti, note, revisioni o oggetti non supportati potevano essere esportati eliminando quelle parti, dopo un semplice avviso. | Rischio contenuto: export bloccato sui contenuti rilevati; supporto completo assente | Prova negativa commenti e sezioni multiple in `scripts/corpus-smoke.mjs`. Il rilevamento non copre tutti i possibili oggetti Office. |
| DAT-001 | Inserire `00123` o un identificativo di oltre 15 cifre poteva togliere gli zeri o arrotondare il valore. | Corretto nella revisione locale 0.2.2 | `tests/reliability.test.mjs`, salvataggio e riapertura XLSX; prova nell'app Windows |
| DAT-002 | Una formula digitata in una cella con formato testo `@` veniva eseguita invece di essere conservata come testo. | Corretto nella revisione locale 0.2.2 | `tests/reliability.test.mjs` |
| DAT-003 | Il getter/setter di ExcelJS usa `merges`/`mergeCells` diversi: celle unite potevano perdersi nelle copie per export, annulla o duplicazione. | Corretto nella 0.2.1 | `tests/reliability.test.mjs` |
| DAT-004 | L'export aggiornava formule e risultati nel modello aperto, anche prima della scelta o riuscita del salvataggio. | Corretto nella 0.2.1 | Esportazioni concorrenti e confronto del modello prima/dopo |
| DAT-005 | Dopo il fallimento del salvataggio di una bozza era possibile cambiare schermata e perdere il testo rimasto solo in memoria. | Corretto nella 0.2.1 | `scripts/reliability-smoke.mjs`: quota esaurita simulata, navigazione bloccata, nuovo salvataggio e riapertura |
| DAT-006 | Un errore sincrono durante il ripristino in blocco poteva lasciare inserimenti parziali. | Corretto nella 0.2.1 | Transazione annullata per un dato non scrivibile; archivio invariato |
| DAT-007 | Formule italiane esportate con nomi locali e virgole decimali non rispettavano la sintassi XLSX. | Corretto nella 0.2.0 | `tests/files.test.mjs`: sintassi invariante, riferimenti assoluti e riapertura |

## P2 Risultati errati

### LIC-001 — Distribuzione del testo della licenza propria

Aperto, rilevato con ispezione statica dei quattro installer pubblici 0.2.2, senza eseguirli. package.json non dichiara license; configurazione e payload non includono il file della licenza propria. Presenti THIRD_PARTY_NOTICES.txt, licenze Electron/Chromium e attribuzione separata Morph-it!, che non costituiscono la licenza di CosmOffice. I metadati author/copyright riportano ancora “Cosmonet”, mentre il nuovo testo usa Daniele Spalletti (danielespalletti@cosmonet.info). La 0.2.2 pubblicata resta con l’assetto precedente, il cui LICENSE è nel tag. Nessun pacchetto o metadato viene corretto qui: allineamento dei futuri pacchetti e revisione professionale sono ancora necessari. Hash dei quattro asset e risultati nel report del passo.

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| FMT-002 | Ordine dei figli sz nei font XLSX e attributo editAs su oneCellAnchor non conformi allo schema Microsoft. | Aperto sul main; correzione solo nel prototipo separato | Audit SDK sui file esportati del corpus |
| FMT-003 | La conservazione delle intestazioni DOCX duplica evenAndOddHeaders dopo compat in word/settings.xml. | Aperto sul main; correzione solo nel prototipo separato | SDK: Sch_UnexpectedElementContentExpectingComplex su 05-intestazioni.docx |
| CAL-001 | Una stringa come `#N/A` veniva confusa con un errore vero; IFERROR, ISERROR e risultati salvati potevano essere errati. | Corretto nella revisione locale 0.2.2 | `tests/formulas.test.mjs`, `tests/reliability.test.mjs`, verifica con LibreOffice |
| CAL-002 | Stringhe vuote e celle vuote erano indistinguibili per ISTEXT e ISBLANK. | Corretto nella revisione locale 0.2.2 | Test dei predicati e dei tipi |
| PDF-001 | Il pulsante «Ruota pagina PDF» ruotava la vista di tutte le pagine e la rotazione spariva nella copia salvata. | Corretto: rotazione persistente della sola pagina selezionata, esiti nel report | Tre PDF del corpus, ricaricamento bozza, salvataggio/riapertura; confronto delle rotazioni di tutte le pagine e dei flussi binari originali |
| DOC-001 | Il formato orizzontale DOCX veniva scambiato due volte, lasciando larghezza e altezza incoerenti. | Corretto nella 0.2.0 | Controllo OOXML della pagina orizzontale in `tests/files.test.mjs` |

## Limiti noti da verificare con il corpus richiesto

### Messaggi e usabilità

- CHART-002: risolto sul campione grafici-ui.xlsx. I fogli con grafici esportano orientamento orizzontale e adattamento a una pagina in larghezza e altezza (altezza aggiunta con autorizzazione esplicita dell’utente). LibreOffice produce 1 pagina orizzontale con tutti i grafici interi, verificata anche visivamente con Poppler. I fogli grandi vengono ridotti in stampa.

- UX-001: i fallimenti di apertura/salvataggio nativi mostravano il prefisso tecnico inglese di Electron. Rimosso al confine IPC per le operazioni sui file; tradotti i codici di file occupato, permessi, spazio esaurito e percorso assente. La prova desktop del fallimento di scrittura controlla anche il messaggio visualizzato.

- DOCX: intestazioni e piè di pagina a sezione singola vengono conservati nell’export ma non mostrati. Commenti, revisioni e oggetti complessi rilevati bloccano l’esportazione: manca il supporto completo alla modifica di questi documenti. Le bozze importate prima di questa correzione non contengono la sorgente DOCX: occorre reimportare l’originale per conservarne intestazioni e piè di pagina.
- PDF: lettura e rotazione persistente della pagina. Mancano modifica testo, OCR, annotazioni e moduli. Senza modifiche, la copia conserva i byte originali. PDF cifrati e firme/campi firma rilevati bloccano la modifica; nessuna certificazione della validità delle firme.
- Aggiornamenti online rimossi e API di rete bloccate. Hunspell nativo resta disabilitato; il controllo italiano applicativo ora usa Morph-it! incluso, con attribuzione e licenza CC BY-SA 2.0.
- I controlli locali precedenti coprono un corpus ristretto generato per i test, non tutti i file Microsoft.

## Prove indipendenti

`scripts/interop.mjs` esegue conversioni con un profilo LibreOffice isolato. LibreOffice può riscrivere una cella di errore costante come formula che restituisce lo stesso errore: il test confronta il significato e non segnala questa trasformazione equivalente come perdita di dati.

I nuovi bug del corpus `tests/fixtures` verranno aggiunti con file, passaggi di riproduzione, comportamento atteso ed esito verificato.

Primo giro del corpus: 9/13 PASS. DAT-008 era una perdita reale. I tre confronti XLSX falliti confrontavano formule testuali identiche carattere per carattere; il serializzatore aggiunge parentesi senza cambiarne il significato. Il test ora confronta la sintassi normalizzata e il risultato, oltre a valori, formati, immagini, unioni e filtri. Queste differenze equivalenti non sono classificate come bug dell’app.

### Problemi del banco di prova

- QA-001: il test PDF eseguiva `reload()` appena inviato il clic «Torna alle bozze», prima della conclusione del gestore asincrono e del salvataggio. Risultavano tre PDF non ruotati. Corretto attendendo la schermata iniziale prima del riavvio; resta il controllo dei byte esportati, delle rotazioni di tutte le pagine e della quota esaurita. La traccia ha smentito la prima ipotesi di perdita durante la normale navigazione dell’app.
- QA-002: il test Electron tentava di chiudere un NetLog di sessione avviato invece dal flag CLI globale, ricevendo `No net log in progress`. Corretto leggendo il log dopo la chiusura del processo. Nessuna connessione è stata necessaria per il controllo.
- QA-003: la creazione dei pacchetti dentro `release/` faceva ricaricare Vite e poteva produrre avvisi watcher `EBUSY`. Esclusi `release/` e `test-results/` dal monitoraggio; i controlli vengono ripetuti senza confezionamento concorrente.
- QA-005: una modifica dei sorgenti mentre la suite browser era attiva ha ricaricato Vite e fatto fallire 01-formule.xlsx. Nessun push effettuato; ripetuta tutta la sequenza a sorgenti fermi.
- QA-004: il confronto di immagini Poppler prima/dopo rotazione era troppo rigido rispetto all’arrotondamento della griglia pixel e all’antialiasing. Il confronto visivo mantiene la soglia di differenza, applica una media locale di un pixel e ammette al massimo un pixel di allineamento; quantità di contenuto e orientamento restano verificati. La prova dei flussi binari controlla separatamente che testo, font e immagini dei campioni restino identici.

### Grafici: compatibilità e verifica indipendente

- CHART-001: LibreOffice perdeva le categorie personalizzate espresse come c:strLit. I nuovi grafici ora usano riferimenti alle celle reali dell’intervallo senza fogli nascosti. I file v1 con categorie diverse sono in sola lettura e consentono soltanto la copia identica, come richiesto dall’utente; nessuna migrazione che sovrascriva o aggiunga celle.
- Grafici esterni o riscritti da altri programmi non sono modificabili; export bloccato per evitare perdita silenziosa. Il supporto completo di questi grafici resta da implementare.
- Non provato: Microsoft Excel reale, grafici avanzati e cartelle grandi. La disposizione e i colori del lettore indipendente possono differire dal pannello CosmOffice.

### Errori rilevati dal validatore Microsoft

- FMT-002: ordine non conforme dei figli font nei fogli ExcelJS e attributo editAs non dichiarato su oneCellAnchor. Normalizzati nell’export, conservando proprietà dei font e immagini.
- FMT-003: la conservazione delle intestazioni DOCX aggiungeva un secondo evenAndOddHeaders dopo compat. Ora sostituisce la voce esistente senza duplicarla.
- Eccezione storica autorizzata: grafici-categorie-v1.xlsx resta invariato. SDK: AperturaFallita, tipo di contenuto del disegno inatteso. Sono possibili rifiuto o recupero in Excel, non provati direttamente.

Il difetto storico esatto resta: The document cannot be opened because there is an invalid part with an unexpected content type. Part Uri=/xl/drawings/cosmoDrawing1.xml; Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml; Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml. Il controllo si interrompe all’apertura: altri difetti non sono esclusi.

## Diagnostica tester

- Limite intenzionale: i messaggi liberi sono omessi, perché possono includere contenuti del documento; restano descrizioni controllate e posizioni anonimizzate. Questo riduce il dettaglio per la diagnosi.
- Preparazione QA: alcune prime esecuzioni non mostravano stabilmente l’evento main simulato. Registrazione cambiata in append dopo normalizzazione e attese esplicite nel test; la causa originaria non è stata dimostrata. Gli esiti delle ripetizioni complete e del pacchetto sono nel report, senza nascondere le prove fallite.
- Non provati arresti reali del sistema operativo/Chromium e guasti di disco durante un crash. Un registro non scrivibile conserva soltanto la memoria e lo segnala.

Consolidamento Facebook: il rapporto usa una riga per ogni evento e solo l’ultima traccia; il test con 50 eventi misura 4.733 byte, sotto 6.144. Le ripetizioni richieste (10 Electron e 10 pacchetto) sono registrate singolarmente nel report corrente, senza presumere risolto un problema solo dalla CI verde.

## Prova guidata: limiti e preparazione QA

- Gli esiti sono dichiarati dal tester, non certificazioni automatiche. Nessuna prova su macchine pulite è dedotta dal selezionare Ok.
- Prima cattura della finestra Electron nascosta: timeout dopo le verifiche degli appunti. Cattura spostata nel browser; prove funzionali restano native e nel pacchetto.
- Prima prova browser: conteggio radio eseguito prima del caricamento lazy (0 anziché 24). Aggiunta attesa esplicita della schermata. Esiti finali nel report.

## Stato dopo lo studio ArtCraft

Aggiornamenti: il prototipo Chromium con sonda UDP Google è stato sostituito da TLS Node isolato. Prime prove reali Electron e pacchetto: audit limitato ai due host e NetLog Chromium privo di connessioni. Il vecchio test rosso resta documentato come origine della scelta, senza riabilitare eccezioni nelle sessioni Chromium.

Preparazione QA consenso: la prima attesa asincrona del test usciva con stato checking; sostituita con attesa della fase ricevuta dall’IPC e chiusura garantita anche se il setup fallisce. Prova ripetuta riuscita: Annulla/chiusura normale senza avvio, consenso esplicito con solo spy. Non è prova dell’installer effettivo.

Protezione Linux: APPIMAGE ereditata da un altro programma non autorizza una sostituzione; serve l’eseguibile CosmOffice dentro la propria APPDIR. Test con target da preservare e caso valido, SHA/consenso verificati. Disattivazione durante la verifica dell’hash revoca l’applicazione e non avvia l’installer.

DIST-001 — risolto e verificato sul server: il primo publisher riconosceva linux-x64.AppImage, mentre electron-builder produce linux-x86_64.AppImage. La run del tag era verde ma pubblicava soltanto Windows, dichiarando Linux mancante nelle note. Nome corretto e test di regressione; AppImage inattese ora bloccano il publisher. La run 45047079344 ha completato Linux; download HTTPS anonimo e SHA-256 riusciti per entrambi, hash Windows invariato. Aggiornati soltanto riepilogo e note; nessun installer sostituito.

Distribuzione: il vecchio workflow richiedeva segreti di firma e creava soltanto bozze, impedendo la pubblicazione pubblica senza certificati. Il nuovo percorso di anteprima elimina questa dipendenza; la prova effettiva di Release e download va riportata dopo il tag. Non è una correzione della fedeltà documentale.

Lo studio statico non riproduce nuovi bug applicativi e non chiude alcun bug di fedeltà. I limiti dichiarati dagli altri progetti non sono bug dimostrati di CosmOffice. Le sole letture e i blocchi di export restano in vigore. [Distinzioni e fonti](ricerca/ARTCRAFT.md).

Blocco noto del precedente prototipo aggiornamenti, non incluso in main: NetLog con controllo attivo rilevava UDP verso [2001:4860:4860::8888]:443, non autorizzato. La nuova soluzione TLS Node è autorizzata ma non implementata o provata; il test del prototipo resta rosso, non un successo della versione corrente. Il main attuale deve continuare a superare offline-smoke senza alcuna connessione.
