# Architettura iniziale

CosmOffice non è una riverniciatura di un eseguibile Microsoft o LibreOffice. È una nuova interfaccia Cosmonet con componenti open source incorporati e limitazioni dichiarate.

- Electron separa accesso ai file e interfaccia. Il renderer non dispone di Node, usa un preload ristretto e richiede finestre native per leggere o esportare file. Le richieste IPC sono accettate solo dalla finestra principale.
- React e Vite producono risorse locali. `electron/offline.cjs`, installato prima dei moduli applicativi, blocca HTTP/HTTPS/HTTP2, socket TCP/TLS/UDP, DNS, fetch e WebSocket Node, oltre alle API net/session Electron. Tutte le sessioni cancellano richieste non locali. Anche lo sviluppo Electron carica file dal disco. Il guardiano registra solo il nome delle API tentate, in memoria locale e senza inviare dati; i test falliscono se l’app tenta una connessione.
- Tiptap/ProseMirror gestisce il documento. Mammoth importa la struttura DOCX, poi una lettura mirata dell’OOXML recupera i principali stili dei run e gli allineamenti quando il paragrafo può essere associato senza perdita. DOMPurify e una lista di stili consentiti sanitizzano l’HTML. Il serializzatore DOCX conserva i nodi e gli stili supportati, mentre Electron gestisce l’esportazione PDF tramite il layout di stampa.
- ExcelJS carica e salva la cartella XLSX, Papa Parse gestisce CSV/TSV e intervalli tabulati. Il modello della cartella viene mantenuto in memoria per conservare anche dati fuori dall’area visibile. Un parser locale risolve riferimenti tra fogli e delega una lista esplicita di 102 funzioni a FormulaJS, senza eval o Function. Funzioni sconosciute, cicli e limiti di lavoro producono errori espliciti. Annulla/ripristina conserva fino a 15 modelli, con un limite dimensionale.
- Mozilla PDF.js usa un worker locale, font e decoder distribuiti con l’app. Il visualizzatore disegna una pagina per volta, include il livello testuale ed esegue la ricerca localmente. Senza modifiche l’export copia i byte originali. La rotazione persistente usa pdf-lib e aggiorna il solo orientamento della pagina scelta, senza rasterizzare i contenuti. L’operazione asincrona viene registrata subito nella coda delle bozze; navigazione ed esportazione la attendono. PDF cifrati e firme/campi firma rilevati bloccano la modifica.
- IndexedDB conserva le bozze e le copie PDF. Le scritture sono serializzate; la normale chiusura della finestra attende le operazioni in corso. L’esportazione su disco scrive un file temporaneo nella cartella scelta e lo rinomina.
- Le preferenze sono validate e conservate in localStorage, applicate tramite un contesto React agli editor e alle variabili dell’interfaccia. I backup ZIP .cosmoffice includono un manifest versionato e i contenuti locali; il ripristino valida i file e li inserisce in una transazione IndexedDB come nuove copie. Password PDF e certificati non fanno parte del backup.
- electron-builder crea i pacchetti desktop. electron-updater è rimosso dalle dipendenze dirette; nessun timer, feed o download di aggiornamento nel runtime. Gli IPC storici rispondono con uno stato disabilitato. I pacchetti nuovi si installano localmente; firma e notarizzazione richiedono un collaudo separato. Il controllo ortografico Electron è spento per evitare i download Hunspell dal CDN; in seguito potrà essere riattivato con dizionari distribuiti e licenze verificate.

## Cosa non viene promesso dalla base attuale

Compatibilità totale Office, motore Excel completo, rendering Word identico, macro, OCR e app mobili richiedono ulteriore sviluppo. Per avvicinarsi alla parità funzionale è opportuno verificare l’integrazione o il fork di un motore Office completo, preservando le licenze e le attribuzioni richieste. Questa decisione non viene mascherata dalla grafica della prima anteprima.

## Consolidamento 0.2.1

L’importazione Office ispeziona prima il contenitore, i limiti dimensionali e le parti potenzialmente non conservate. Il PDF viene verificato dal motore di lettura prima dell’archiviazione, eccetto lo sblocco dei file protetti che resta nel lettore. Questi controlli migliorano i messaggi d’errore e non costituiscono una garanzia di conservazione di ogni elemento Microsoft.

Le esportazioni XLSX clonano il modello e normalizzano la differenza fra i campi `merges` e `mergeCells` del getter/setter ExcelJS. La stessa normalizzazione vale per annulla/ripristina e duplicazione. La duplicazione di fogli con tabelle strutturate viene respinta per evitare copie con nomi tabella duplicati.

Le bozze fallite restano in memoria e vengono riprovate prima di lasciare l’editor. Il ripristino in blocco abortisce la transazione anche per errori sincroni di scrittura. Il renderer non può autorizzare implicitamente una chiusura riuscita quando rimangono bozze fallite; in quel caso la finestra nativa propone di tornare al lavoro o uscire consapevolmente.

## Conservazione dei tipi 0.2.2

Gli errori del motore di calcolo sono oggetti interni distinti dal testo. Il risultato pubblico espone valore e stato di errore separatamente, così un’etichetta come `#N/A` o una stringa restituita da una formula non viene confusa con una cella di errore. La distinzione vale anche per i risultati memorizzati nell’XLSX.

L’ingresso delle celle mantiene come testo gli zeri iniziali, gli identificativi oltre 15 cifre significative e i valori fuori dall’intervallo numerico interoperabile. Il formato testo della cella viene rispettato; le formule in quel formato rimangono testo. Non è possibile recuperare cifre già perse in un file precedentemente arrotondato da un altro programma.

Un lavoro GitHub separato verifica la conversione attraverso LibreOffice senza includere quel programma nel prodotto. I risultati di questo corpus ristretto affiancano i test del motore e dell’interfaccia.
