# Registro dei bug CosmOffice

## AND-013 — immissione nativa del test ancora instabile

32232a6 / [Android 46063967606](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46063967606): Home e DOCX PASS, controllo B3=2 scaduto durante input, prima dell’export XLSX. Screenshot finale nella Home, non nella cella; non basta per attribuire il difetto al salvataggio o dimostrarne una causa precisa. Gli stessi round trip XLSX e PDF erano passati nel tentativo precedente.

Driver aggiornato: Ctrl+A Android, selezione confermata, cancellazione confermata, digitazione e valore atteso, normale blur e nuovo controllo. Rimossi DOM select seguito immediatamente da tasti e spostamento tramite Enter. Restano B2/B3 pre/post e parser sugli export; nessuna modifica app o accesso diretto al modello. Diagnostica solo nell’APK di test con booleani della pagina, focus, tag e lunghezza/selezione, mai contenuto dei campi. Non chiuso prima del risultato nativo, tastiera reale/software ancora non collaudata.

## AND-012 — titolo del modello Markdown nel driver

f60184a / [Android 46061575296, tentativo 2](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575296/attempts/2): Home, DOCX, XLSX e PDF round trip PASS; test fermato prima della creazione Markdown. Il pulsante contiene titolo «Nuovo Markdown» e didascalia «CosmoWrite · .md», mentre il driver confrontava tutto textContent con il solo titolo. Driver corretto: aria-label, altrimenti titolo strong, altrimenti testo completo; confronto sempre esatto. App invariata. Non ancora verificato nel nuovo smoke.

AND-011 verificato sul PDF 01-testo.pdf: apertura/rendering, rotazione, salvataggio/riapertura nativi; pdfinfo 90° e confronto visivo pdftoppm PASS (differenza media sui pixel del contenuto 6.302, soglia esistente 25, allineamento -1/0). Altri campioni PDF non provati nell’APK. DOCX/XLSX della stessa run: SDK zero errori, Mammoth/ExcelJS confermano le modifiche.

Primo tentativo f60184a: timeout del selettore perché un ANR «Pixel Launcher isn't responding» copriva DocumentsUI. Screenshot e file presenti verificati; secondo tentativo stesso codice senza nascondere l’ANR, avanzato fino al difetto del driver Markdown. Non attribuito a CosmOffice e non presentato come run verde.

## AND-011 — PDF rifiutato prima dell’apertura su Android

Diagnosi effae92 / [46059522929](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46059522929): WebView 124.0.6367.219, `TypeError: URL.parse is not a function`. Build Android separata con distribuzione legacy di PDF.js 6.5.438 (stessa versione/motore), API e worker locali; compatibilità core-js MIT inclusa upstream e ora attribuita. Non chiuso finché rendering e round trip non passano nella CI. Nessuna modifica del motore desktop.

4912020 / [Android 46056425324](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425324): Home, DOCX e XLSX round trip PASS; attesa del canvas PDF scaduta. Screenshot finale nella Home, nessun PDF esportato. Causa non ancora dimostrata: aggiunta al solo APK di test una diagnosi diretta sul campione originale per leggere l’errore del caricamento, senza cambiare il motore o il rapporto dei tester. Android non è ancora collaudato completamente.

AND-010 verificato nella stessa run: B2=701 e B3=2 prima/dopo salvataggio. File recuperati dall’artifact, letti con ExcelJS con gli stessi valori; Mammoth trova il testo aggiunto nel DOCX. Nessuna perdita di queste modifiche osservata. La verifica di tutti gli originali resta subordinata al completamento dell’intero smoke.

## AND-010 — immissione delle celle non applicata dal test

7e9f9c7 / [Android 46053874675](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874675): DOCX round trip PASS. XLSX salvato e riaperto, ma controllo B2=701 fallisce. Screenshot prima dell’export mostra ancora A1 selezionata e i valori originali: il test non ha applicato l’immissione prevista, non è dimostrata una perdita nel salvataggio.

Driver aggiornato: finestra in primo piano, focus reale del WebView, cella selezionata verificata, eventi di tastiera e Enter del normale handler; B2/B3 verificati prima e dopo il salvataggio. Parser host controlla entrambi. File esportati raccolti anche in caso di errore, senza dichiarare PASS; nella prova positiva tutti devono essere recuperati nella run corrente. Da verificare in CI.

## AND-009 — regressione del driver a coordinate

[f48c5b9 / Android 46051701831](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701831): Home/permessi passati, DOCX non aperto; screenshot mostra ancora DocumentsUI con i tre campioni. Il tocco a coordinate introdotto nel driver ha peggiorato il test, non è una correzione dell’app. Ripristinata ACTION_CLICK sul selettore reale, con controllo degli esiti effettivi. Il booleano restituito da un controllo che si chiude non determina PASS: servono export con nome esatto, riapertura e confronti di byte.

Home PNG di questa run troppo precoce: DOM presente ma immagine bianca. Aggiunta attesa di stato visivo WebView e due frame prima delle catture dell’app; per il selettore si attende l’idle nativo. Da verificare nella prossima run. Nessuna immagine vuota usata come anteprima pubblica.

## AND-005/007 verificati nel quarto tentativo; AND-008 aperto

Run [46016839526](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46016839526), commit 427942b: storage pronto al secondo tentativo in 1658 ms dopo un primo rifiuto reale; campioni SHA-256 e avvio passati. Artifact con Home/Write/errore PNG: recupero screenshot verificato. Non è un collaudo completo degli editor.

AND-008: il test si ferma sul ritorno negativo dell’azione di accessibilità SAVE; nello screenshot il dialogo è già sparito e l’app elabora il file. Non dimostra da solo un difetto del salvataggio. Test aggiornato: controlli visibili e abilitati, nome confermato nel selettore, tocco tramite UiAutomation e attesa della vera esportazione/riapertura. Screenshot del selettore aggiunto; nessun controllo dei file rimosso. Da verificare in CI.

## AND-005 riaperto: preparazione non stabile al cold boot

Commit a57fed7, [Android 46014692576](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692576): build/check APK passati, cp nella Download respinto prima dell’installazione. Il successo della preparazione su d3f9aef non era sufficiente a considerarla stabile: AND-005 riaperto. Diagnostica: shell UID 2000, Download presente con gruppo media_rw; comando diagnostico is-user-unlocked non disponibile. Non si afferma dimostrata una causa unica. Nuova preparazione: attendere fino a 90 secondi una scrittura e rilettura vere, copiare solo i byte senza metadati, confrontare SHA-256 prima di avviare l’app. AND-006/007 non ancora esercitati nel terzo tentativo. Nessuna simulazione o nuovo permesso.

## AND-005/006/007 — secondo collaudo Android

- AND-005: **preparazione corretta e verificata** nella run 46012068702: i tre SHA-256 sono passati, APK installato e Home/permessi PASS. Non equivale al collaudo degli editor.
- AND-006: il test non trova android-write-salvato.docx dopo il salvataggio. Nel codice, ricerca EditText non vincolata al selettore: può scegliere il titolo dell’app. Aggiunta attesa del pacchetto DocumentsUI; esito ancora da verificare, nessuna diagnosi di perdita dati affermata.
- AND-007: artifact senza screenshot nonostante il salvataggio nella instrumentation. Raccolta spostata nei file interni dell’app e resa obbligatoria in caso di PASS; aggiunto elenco Download nel solo emulatore. Non ancora verificato nella CI.

## AND-005 — preparazione storage del runner

CI Android [46009717455](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717455), commit 9421c6a: compilazione/lint/controllo APK passati, test fermato **prima dell’installazione** per adb push in Download: remote couldn't create file: Operation not permitted. Non prova un difetto degli editor né il loro funzionamento. Preparazione cambiata: staging in /data/local/tmp e copia tramite shell, SHA-256 prima dell’avvio; nessun root o permesso aggiunto all’app. Causa precisa del rifiuto adbd non dimostrata; correzione da verificare nella prossima run, non chiusa.

## Android — 27 novembre 2026

| ID | Problema / limite | Stato e prova |
| --- | --- | --- |
| AND-001 | Target Android recente non accetta onBackPressed per la navigazione gestuale | Corretto con dispatcher API 33+ e tasto precedente sotto API 33; lint passato, interazione nativa ancora da osservare nel report |
| AND-002 | Stampa e conversione Word→PDF non implementate in Android | Limite esplicito, controlli disabilitati/nascosti; desktop invariato |
| AND-003 | Bridge con più copie Base64 in memoria | Limite esplicito 10 MB in lettura/scrittura, anche dimensione stream ignota; prestazioni su telefono non provate |
| AND-004 | Ricompilazione incrementale dopo spostamento risorse icona: mipmap non trovato | Build pulita riuscita; nessun aggiramento del lint, vedi output nel report |

Nessuna incompatibilità dei documenti già dichiarata viene considerata risolta dall’aggiunta dell’APK.

Aggiornamento del 22 novembre 2026: scelta A adottata in LICENSE, con uso gratuito e riserva su codice e marchio. Nessun bug applicativo chiuso. Titolare e recapito forniti: Daniele Spalletti (danielespalletti@cosmonet.info). Restano revisione professionale e verifiche delle singole piattaforme; inclusione nel nuovo NSIS Windows 0.2.3 verificata realmente (LIC-001 sotto). La precedente lacuna sulla concessione d’uso nel repository è affrontata dal nuovo testo; non si dichiara risolta la coerenza con la 0.2.2 già pubblicata.

Ordine: P1 (perdita o alterazione dati, crash, file corrotti), P2 (risultati o comportamento errati), P3 (limiti di impaginazione o usabilità). Uno stato risolto richiede una prova; le incompatibilità non ancora riprodotte non vengono dichiarate risolte.

## P1 Perdita o alterazione dei dati

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| FMT-001 | I nuovi disegni dei grafici dichiaravano application/vnd.openxmlformats-officedocument.drawingml.drawing+xml invece del tipo corretto senza drawingml. Microsoft SDK rifiuta il pacchetto. | Corretto per i nuovi esportati; copia storica v1 invariata per esplicita richiesta utente | Validatore SDK Microsoft, report separato per la copia storica |
| NET-001 | Il processo principale poteva contattare GitHub nelle release firmate per verificare/scaricare aggiornamenti. | Rete generale bloccata; nella 0.2.3 soltanto TLS Node autorizzato su richiesta o periodici opt-in, nessuna rete all’avvio | Test Node delle API, Electron reale con nessun tentativo spontaneo e NetLog; richiesta intenzionale dal main rilevata e bloccata |
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

Risolto e verificato nell’installer Windows NSIS 0.2.3 realmente costruito: LICENSE e THIRD_PARTY_NOTICES.txt nelle risorse, byte identici ai sorgenti; LICENSE anche nell’ASAR, versione e riferimento di licenza nel package.json. Metadati dei nuovi pacchetti allineati al titolare. Due tentativi iniziali fallivano sulla copia ASAR: filtro corretto e test conservato. AppImage e due DMG hanno lo stesso controllo bloccante nella CI del passo, esiti da verificare dopo il push; non anticipati come passati. La 0.2.2 pubblica non viene corretta: resta senza la licenza propria nei payload, con il vecchio LICENSE nel tag. Revisione professionale e collaudo fisico ancora necessari.

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| FMT-002 | Ordine dei figli sz nei font XLSX e attributo editAs su oneCellAnchor non conformi allo schema Microsoft. | Corretto nel main 5a493a4; nuovi esportati riprovati con SDK anche nella preparazione 0.2.3 | Audit SDK sui file esportati del corpus |
| FMT-003 | La conservazione delle intestazioni DOCX duplica evenAndOddHeaders dopo compat in word/settings.xml. | Corretto nel main 5a493a4; nuovi esportati riprovati con SDK anche nella preparazione 0.2.3 | SDK: Sch_UnexpectedElementContentExpectingComplex su 05-intestazioni.docx |
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
- API generali di rete bloccate; nella 0.2.3 eccezione TLS Node alle sole Release del progetto, manuale o periodica opt-in. Hunspell nativo resta disabilitato; il controllo italiano applicativo ora usa Morph-it! incluso, con attribuzione e licenza CC BY-SA 2.0.
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

## Markdown — limiti del passo 25 novembre 2026

- MD-001 (P3, limite dichiarato): anteprima senza immagini, link attivi, formule matematiche, estensioni aggiuntive, ortografia e conversione Office/PDF. Il sorgente conserva la sintassi.
- MD-002 (P3, limite dichiarato): dopo editing i terminatori vengono normalizzati a LF dal campo di testo; senza modifiche BOM/CRLF restano identici. Nessuna sostituzione silenziosa per UTF-8 invalido.
- Verificato e prevenuto: i backup prima non distinguevano Markdown dall’HTML. Nuovi record e manifest ora mantengono `fileType: MD`; prova di esportazione/importazione con confronto del sorgente.

## Pubblicazione 0.2.3 — verifica note

Il generatore Release richiede la sezione «Cosa ti aspetti da CosmOffice?», inizialmente assente nella sezione 0.2.3 del CHANGELOG. Completata prima del tag, con test sul numero corrente del package.json per prevenire il blocco della pubblicazione; nessun difetto dell’app o motore corretto in questo passo. Restano tutti i limiti documentali, firma e collaudi fisici già elencati.

### CI-MAC-001 — controllo DMG con matrice a singola architettura

La pipeline tag produce un DMG per job, ma il controllo risorse introdotto per il job main (che costruisce entrambi) richiedeva sempre i due file. Rilevato dopo il tag 0.2.3, prima dei lavori pacchetti; correzione in main: selezione esplicita x64/arm64 nel job di Release, controllo predefinito sempre su entrambi. Completamento Mac sullo stesso tag con confronto dei sorgenti applicativi, checksum e nessuna sostituzione degli installer esistenti. Esito effettivo in CI e nel report: non si dichiarano verdi i job originali del tag.

CI-MAC-001: correzione verificata nei due job DMG e nella pubblicazione della run 45608286513, tutti success. I job originali del tag restano rossi e sono documentati; nessun tag spostato. LIC-001: LICENSE e avvisi confrontati realmente nei due DMG durante il completamento, oltre alle verifiche Windows/AppImage della pipeline tag. Nessun collaudo fisico dedotto da questi risultati.
