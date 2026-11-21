# Registro dei bug CosmOffice

Ordine: P1 (perdita o alterazione dati, crash, file corrotti), P2 (risultati o comportamento errati), P3 (limiti di impaginazione o usabilità). Uno stato risolto richiede una prova; le incompatibilità non ancora riprodotte non vengono dichiarate risolte.

## P1 Perdita o alterazione dei dati

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| NET-001 | Il processo principale poteva contattare GitHub nelle release firmate per verificare/scaricare aggiornamenti. | Rimosso e bloccato dal guardiano offline; esiti nel report | Test Node delle API, Electron reale con nessun tentativo spontaneo e NetLog; richiesta intenzionale dal main rilevata e bloccata |
| NET-002 | Il controllo ortografico Electron può scaricare dizionari Hunspell dal CDN senza un’azione esplicita dell’utente. | Download evitato disabilitando l’ortografia desktop; manca un dizionario incorporato | Sessioni e webPreferences con spellcheck disattivato; disponibilità indicata nelle impostazioni |
| NET-003 | CI Linux del commit `defa84b`: NetLog registra il tentativo di download `en-us-10-2.bdic` dal CDN Chromium e una sonda UDP verso `[2001:4860:4860::8888]:443`, fuori dalle API JavaScript. Il costruttore Session avvia Hunspell prima dell’evento `session-created`. Windows locale non lo riproduceva. | Correzione: destinazione dizionari solo locale e lingue svuotate per annullare i caricamenti pendenti; risolutore/DoH disabilitati. Verifica CI richiesta | Il test continua a rifiutare ogni TCP/UDP/QUIC/DNS ed è stato rafforzato per rifiutare anche URL remoti nel NetLog. Nessuna eccezione per sonde o CDN. [Run fallita](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44953248300) |
| DAT-008 | `05-intestazioni.docx`: esportare dopo una modifica eliminava intestazione, logo e piè di pagina con campo PAGE. | Corretto, esiti nel report del passo | `scripts/corpus-smoke.mjs`: conservazione parti e relazioni, ricaricamento bozza, backup, doppia esportazione e riapertura |
| DAT-009 | DOCX con commenti, note, revisioni o oggetti non supportati potevano essere esportati eliminando quelle parti, dopo un semplice avviso. | Rischio contenuto: export bloccato sui contenuti rilevati; supporto completo assente | Prova negativa commenti e sezioni multiple in `scripts/corpus-smoke.mjs`. Il rilevamento non copre tutti i possibili oggetti Office. |
| DAT-001 | Inserire `00123` o un identificativo di oltre 15 cifre poteva togliere gli zeri o arrotondare il valore. | Corretto nella revisione locale 0.2.2 | `tests/reliability.test.mjs`, salvataggio e riapertura XLSX; prova nell'app Windows |
| DAT-002 | Una formula digitata in una cella con formato testo `@` veniva eseguita invece di essere conservata come testo. | Corretto nella revisione locale 0.2.2 | `tests/reliability.test.mjs` |
| DAT-003 | Il getter/setter di ExcelJS usa `merges`/`mergeCells` diversi: celle unite potevano perdersi nelle copie per export, annulla o duplicazione. | Corretto nella 0.2.1 | `tests/reliability.test.mjs` |
| DAT-004 | L'export aggiornava formule e risultati nel modello aperto, anche prima della scelta o riuscita del salvataggio. | Corretto nella 0.2.1 | Esportazioni concorrenti e confronto del modello prima/dopo |
| DAT-005 | Dopo il fallimento del salvataggio di una bozza era possibile cambiare schermata e perdere il testo rimasto solo in memoria. | Corretto nella 0.2.1 | `scripts/reliability-smoke.mjs`: quota esaurita simulata, navigazione bloccata, nuovo salvataggio e riapertura |
| DAT-006 | Un errore sincrono durante il ripristino in blocco poteva lasciare inserimenti parziali. | Corretto nella 0.2.1 | Transazione annullata per un dato non scrivibile; archivio invariato |
| DAT-007 | Formule italiane esportate con nomi locali e virgole decimali non rispettavano la sintassi XLSX. | Corretto nella 0.2.0 | `tests/files.test.mjs`: sintassi invariante, riferimenti assoluti e riapertura |

## P2 Risultati errati

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| CAL-001 | Una stringa come `#N/A` veniva confusa con un errore vero; IFERROR, ISERROR e risultati salvati potevano essere errati. | Corretto nella revisione locale 0.2.2 | `tests/formulas.test.mjs`, `tests/reliability.test.mjs`, verifica con LibreOffice |
| CAL-002 | Stringhe vuote e celle vuote erano indistinguibili per ISTEXT e ISBLANK. | Corretto nella revisione locale 0.2.2 | Test dei predicati e dei tipi |
| PDF-001 | Il pulsante «Ruota pagina PDF» ruotava la vista di tutte le pagine e la rotazione spariva nella copia salvata. | Corretto: rotazione persistente della sola pagina selezionata, esiti nel report | Tre PDF del corpus, ricaricamento bozza, salvataggio/riapertura; confronto delle rotazioni di tutte le pagine e dei flussi binari originali |
| DOC-001 | Il formato orizzontale DOCX veniva scambiato due volte, lasciando larghezza e altezza incoerenti. | Corretto nella 0.2.0 | Controllo OOXML della pagina orizzontale in `tests/files.test.mjs` |

## Limiti noti da verificare con il corpus richiesto

### Messaggi e usabilità

- UX-001: i fallimenti di apertura/salvataggio nativi mostravano il prefisso tecnico inglese di Electron. Rimosso al confine IPC per le operazioni sui file; tradotti i codici di file occupato, permessi, spazio esaurito e percorso assente. La prova desktop del fallimento di scrittura controlla anche il messaggio visualizzato.

- DOCX: intestazioni e piè di pagina a sezione singola vengono conservati nell’export ma non mostrati. Commenti, revisioni e oggetti complessi rilevati bloccano l’esportazione: manca il supporto completo alla modifica di questi documenti. Le bozze importate prima di questa correzione non contengono la sorgente DOCX: occorre reimportare l’originale per conservarne intestazioni e piè di pagina.
- PDF: lettura e rotazione persistente della pagina. Mancano modifica testo, OCR, annotazioni e moduli. Senza modifiche, la copia conserva i byte originali. PDF cifrati e firme/campi firma rilevati bloccano la modifica; nessuna certificazione della validità delle firme.
- Aggiornamenti online rimossi e API di rete bloccate. Il controllo ortografico desktop resta disabilitato finché non saranno distribuiti dizionari locali con licenze verificate.
- I controlli locali precedenti coprono un corpus ristretto generato per i test, non tutti i file Microsoft.

## Prove indipendenti

`scripts/interop.mjs` esegue conversioni con un profilo LibreOffice isolato. LibreOffice può riscrivere una cella di errore costante come formula che restituisce lo stesso errore: il test confronta il significato e non segnala questa trasformazione equivalente come perdita di dati.

I nuovi bug del corpus `tests/fixtures` verranno aggiunti con file, passaggi di riproduzione, comportamento atteso ed esito verificato.

Primo giro del corpus: 9/13 PASS. DAT-008 era una perdita reale. I tre confronti XLSX falliti confrontavano formule testuali identiche carattere per carattere; il serializzatore aggiunge parentesi senza cambiarne il significato. Il test ora confronta la sintassi normalizzata e il risultato, oltre a valori, formati, immagini, unioni e filtri. Queste differenze equivalenti non sono classificate come bug dell’app.

### Problemi del banco di prova

- QA-001: il test PDF eseguiva `reload()` appena inviato il clic «Torna alle bozze», prima della conclusione del gestore asincrono e del salvataggio. Risultavano tre PDF non ruotati. Corretto attendendo la schermata iniziale prima del riavvio; resta il controllo dei byte esportati, delle rotazioni di tutte le pagine e della quota esaurita. La traccia ha smentito la prima ipotesi di perdita durante la normale navigazione dell’app.
- QA-002: il test Electron tentava di chiudere un NetLog di sessione avviato invece dal flag CLI globale, ricevendo `No net log in progress`. Corretto leggendo il log dopo la chiusura del processo. Nessuna connessione è stata necessaria per il controllo.
- QA-003: la creazione dei pacchetti dentro `release/` faceva ricaricare Vite e poteva produrre avvisi watcher `EBUSY`. Esclusi `release/` e `test-results/` dal monitoraggio; i controlli vengono ripetuti senza confezionamento concorrente.
- QA-004: il confronto di immagini Poppler prima/dopo rotazione era troppo rigido rispetto all’arrotondamento della griglia pixel e all’antialiasing. Il confronto visivo mantiene la soglia di differenza, applica una media locale di un pixel e ammette al massimo un pixel di allineamento; quantità di contenuto e orientamento restano verificati. La prova dei flussi binari controlla separatamente che testo, font e immagini dei campioni restino identici.
