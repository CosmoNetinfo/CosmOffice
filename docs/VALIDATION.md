# Verifiche dell’anteprima 0.1.0

Eseguite localmente su Windows il 21 novembre 2026.

| Verifica | Esito |
| --- | --- |
| Compilazione Vite | Superata |
| Test di formule e interoperabilità DOCX/XLSX | 8 test superati |
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
| Controllo npm audit completo dopo override mirati | Zero vulnerabilità note al momento del controllo |

Gli script riproducibili sono in `scripts/smoke.mjs`, `scripts/desktop-smoke.mjs` e `tests/`. I rapporti di esecuzione sono generati in `test-results/`, esclusa dal repository; GitHub Actions conserva i rapporti del browser come artefatti.

Questi test non dimostrano la compatibilità totale Office. Non sono ancora stati collaudati l’installer su un computer pulito, le build native macOS/Linux, il passaggio tra release con aggiornamento automatico, tutte le varianti di PDF protetti, l’OCR, documenti Office complessi o le app mobili. Le build desktop remote sono eseguite dal workflow GitHub.
