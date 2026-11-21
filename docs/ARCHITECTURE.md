# Architettura iniziale

CosmOffice non è una riverniciatura di un eseguibile Microsoft o LibreOffice. È una nuova interfaccia Cosmonet con componenti open source incorporati e limitazioni dichiarate.

- Electron separa accesso ai file e interfaccia. Il renderer non dispone di Node, usa un preload ristretto e richiede finestre native per leggere o esportare file. Le richieste IPC sono accettate solo dalla finestra principale.
- React e Vite producono risorse locali. Nessuna risorsa remota è necessaria al funzionamento. La sessione Electron blocca le richieste di rete del renderer; l’updater opera separatamente nel processo principale.
- Tiptap/ProseMirror gestisce il documento. Mammoth importa DOCX in HTML sanitizzato da DOMPurify; il serializzatore DOCX esporta i nodi supportati. Questa pipeline privilegia il contenuto rispetto alla fedeltà d’impaginazione.
- ExcelJS carica e salva la cartella XLSX. Il modello della cartella viene mantenuto in memoria per conservare anche dati fuori dall’area visibile. Il motore di formule locale analizza una grammatica limitata e non usa eval o Function. Funzioni sconosciute, cicli e limiti di lavoro producono errori espliciti.
- Mozilla PDF.js usa un worker locale, font e decoder distribuiti con l’app. Il visualizzatore disegna una pagina per volta, include il livello testuale ed esegue la ricerca localmente. Le copie esportate provengono dai byte originali, senza ricostruire il PDF.
- IndexedDB conserva le bozze e le copie PDF. Le scritture sono serializzate; la normale chiusura della finestra attende le operazioni in corso. L’esportazione su disco scrive un file temporaneo nella cartella scelta e lo rinomina.
- electron-builder crea i pacchetti desktop. Le anteprime non hanno feed di aggiornamento. Le release richiedono certificati per Windows/macOS; electron-updater usa GitHub Releases. La firma/notarizzazione e il passaggio tra due release devono essere collaudati separatamente.

## Cosa non viene promesso dalla base attuale

Compatibilità totale Office, motore Excel completo, rendering Word identico, macro, OCR e app mobili richiedono ulteriore sviluppo. Per avvicinarsi alla parità funzionale è opportuno verificare l’integrazione o il fork di un motore Office completo, preservando le licenze e le attribuzioni richieste. Questa decisione non viene mascherata dalla grafica della prima anteprima.
