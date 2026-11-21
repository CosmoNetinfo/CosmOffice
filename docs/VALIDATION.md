# Verifiche dell’anteprima 0.2.0

Eseguite localmente su Windows il 21 novembre 2026.

| Verifica | Esito |
| --- | --- |
| Compilazione Vite | Superata |
| Test di formule e interoperabilità DOCX/XLSX/CSV | 13 test superati |
| Test browser su Chrome | Superati |
| Importazione, modifica ed esportazione DOCX | Superata; testo letto con Mammoth dopo l’esportazione |
| Ripristino bozze dopo ricaricamento | Superato |
| XLSX: modifica, formule, più fogli e dati fuori area | Superato |
| Annullamento modifica cella con Escape | Superato |
| Sanitizzazione HTML importato con script e immagini remote | Superata |
| PDF: rendering, navigazione, zoom, ricerca e copia | Superati; copia confrontata byte per byte |
| Layout pagina iniziale a 390 px | Nessuno scorrimento orizzontale |
| Richieste esterne durante il test browser | Zero |
| Pacchetto Windows x64 non firmato | Avvio e apertura DOCX/XLSX/PDF superati |
| Worker PDF nel pacchetto da file locale | Superato |
| Esportazione PDF tramite IPC su disco | Superata; copia identica all’originale |
| Esportazione documento in PDF nel pacchetto Windows | Superata con printToPDF; output PDF letto dal disco |
| Recupero font/dimensioni/colori DOCX e margini/formato esportati | Superato sui documenti generati di verifica |
| SUMIF, COUNTIF, VLOOKUP, SUMPRODUCT, testo, date e IFERROR | Superati sui casi di prova; non equivalgono a un collaudo completo di 102 funzioni |
| Riferimenti e cicli tra fogli | Superati |
| CSV/TSV con virgolette, testo multilinea e decimali italiani | Superati; formule importate come testo |
| Incolla intervalli, annulla/ripristina, rinomina e duplicazione fogli | Superati nel browser |
| Tema, accento, scala, densità e barra laterale | Controlli applicati e preferenze ritrovate dopo ricaricamento |
| Font, margini e ortografia da Impostazioni | Verificati nell’editor |
| Formato numeri, cifre decimali, righe/colonne e linee griglia da Impostazioni | Verificati nell’editor |
| Trova e sostituisci | Superato |
| Backup archivio e ripristino | Superato; nuove copie aggiunte senza sovrascrivere le esistenti |
| Richiesta di conferma svuotamento archivio | Verificata con annullamento e conservazione dei dati |
| Memoria ultima pagina PDF | Superata |
| Stampa PDF | Pagine preparate e richiesta di stampa eseguita contro un’interfaccia simulata; stampante fisica non collaudata |
| Impostazioni su schermo stretto | Verificate a 390 px senza scorrimento orizzontale |
| Controllo npm audit completo dopo override mirati | Zero vulnerabilità note al momento del controllo |

Gli script riproducibili sono in `scripts/smoke.mjs`, `scripts/preferences-smoke.mjs`, `scripts/desktop-smoke.mjs` e `tests/`. I rapporti di esecuzione sono generati in `test-results/`, esclusa dal repository; GitHub Actions conserva i rapporti del browser come artefatti.

La build precedente (0.1.0, commit 60a01b5) ha completato con successo test e pacchetti GitHub Actions per Windows, Linux e macOS Intel/Apple Silicon. La stessa pipeline viene applicata alla 0.2.0.

Questi test non dimostrano la compatibilità totale Office. Non sono ancora stati collaudati l’installer su un computer pulito, l’avvio delle app macOS/Linux su dispositivi reali, il passaggio tra release con aggiornamento automatico, tutte le varianti di PDF protetti, l’OCR, documenti Office complessi o le app mobili.
