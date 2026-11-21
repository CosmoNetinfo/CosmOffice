# Report CosmOffice — rete e PDF

## 1. Obiettivo del passo

Eliminare ogni connessione del processo principale Electron, rendere persistente la rotazione PDF mantenendo i contenuti e verificare salvataggio/riapertura con un lettore indipendente. Preparare la verifica CI del codice pubblicato.

## 2. Cosa hai fatto

- `.github/workflows/build.yml`
- `README.md`
- `THIRD_PARTY_NOTICES.txt`
- `docs/ARCHITECTURE.md`
- `docs/BUG.md`
- `docs/VALIDATION.md`
- `electron/main.cjs`
- `electron/preload.cjs`
- `package-lock.json`
- `package.json`
- `scripts/corpus-smoke.mjs`
- `scripts/desktop-smoke.mjs`
- `scripts/dev.mjs`
- `scripts/fixtures-office.mjs`
- `src/App.jsx`
- `src/PdfViewer.jsx`
- `src/SettingsPage.jsx`
- `src/files.mjs`
- `vite.config.mjs`
- `electron/offline.cjs`
- `scripts/offline-smoke.mjs`
- `scripts/pdf-independent.mjs`
- `src/pdf-editing.mjs`
- `tests/offline.test.mjs`
- `tests/pdf-editing.test.mjs`
- `docs/report/2026-11-21_2244_rete-pdf.md` e `docs/report/ULTIMO.md`: questo report e la sua copia.

Rimosso electron-updater dalle dipendenze dirette e rimosso il percorso online dal main. Nessun controllo periodico, download o installazione online; gli IPC storici restituiscono uno stato disabilitato, anche con vecchie preferenze abilitate. Aggiunto un blocco preventivo delle API Node/Electron e delle richieste non locali delle sessioni. Disabilitati proxy automatici, risoluzione remota e servizi Chromium di rete; ortografia desktop disattivata per evitare download dei dizionari. Lo sviluppo Electron carica file locali, senza server.

Rotazione PDF della sola pagina selezionata tramite pdf-lib 1.17.1 (MIT), inclusa nel pacchetto offline. Operazione registrata subito nella coda delle bozze, attesa da navigazione ed esportazione. Nessuna rasterizzazione nel file salvato. Bloccata la modifica dei PDF cifrati e di firme/campi firma rilevati. Attribuzioni rigenerate con `scripts/notices.mjs`.

Aggiunti test del guardiano, prova in Electron reale con NetLog, verifica indipendente Poppler e prova del pacchetto Windows. Ripuliti i messaggi di errore delle operazioni native sui file. Ignorati artefatti e risultati nel watcher Vite per evitare ricaricamenti durante i controlli.

## 3. Risultato di build e test

Tutti i comandi sotto riportati hanno terminato con codice di uscita 0. Output reali acquisiti dai log, con soli spazi a fine riga rimossi per il controllo Git.

### npm run build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2389 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CoQCUQZa.css               42.62 kB │ gzip:   9.89 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-CrpulAga.js            10.91 kB │ gzip:   4.18 kB
dist/assets/GridEditor-CIJ_ypaT.js           13.25 kB │ gzip:   5.25 kB
dist/assets/SettingsPage-CctHtDjA.js         20.00 kB │ gzip:   6.87 kB
dist/assets/import-docx-CIFFwOMP.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-BWjCyKgQ.js             2,219.19 kB │ gzip: 659.85 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.39s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ DOCX exports real text, bold marks and tables readable by another parser (79.1321ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (62.5335ms)
✔ unknown formulas retain their source without exporting a misleading cached number (9.5018ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.5232ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (8.729ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (15.0606ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.237ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.3364ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (110.8401ms)
✔ references, arithmetic, precedence and percentages (3.2538ms)
✔ Italian aliases, absolute references, text and lazy IF (0.6017ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.5849ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.4791ms)
✔ Excel address limits and column naming (0.9266ms)
✔ conditional sums, lookups, text, dates and error handling (3.2435ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.4099ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.2923ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.5751ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.422ms)
✔ Il processo principale non contiene updater o caricamenti da server (4.2061ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (141.9848ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (27.1228ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (5.7317ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (92.6496ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (13.5359ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (77.5046ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (27.1392ms)
✔ damaged files and mismatched Office extensions are rejected before import (13.3031ms)
✔ unsupported parts produce specific warnings without changing the original file (32.5632ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.8452ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (10.3447ms)
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1478.0728
```

### npm run test:browser

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs

{
  "result": "PASS",
  "scenarios": [
    "DOCX import/modifica/export",
    "Ripristino bozza dopo riavvio",
    "XLSX import/formule/modifica/export",
    "Fogli multipli",
    "PDF rendering/navigazione/ricerca/copia identica",
    "Layout 390px",
    "Zero richieste esterne"
  ],
  "errors": [],
  "external": []
}
{
  "result": "PASS",
  "scenarios": [
    "Incolla intervalli, annulla/ripristina",
    "Rinomina e duplica fogli",
    "Tema/colore/scala/densità/barra laterale applicati",
    "Font/margini/ortografia applicati",
    "Trova e sostituisci",
    "Preferenze persistenti",
    "Backup e ripristino senza sovrascrittura",
    "Conferma svuotamento archivio",
    "Impostazioni a 390px"
  ],
  "errors": []
}
22:33:46 [vite] (client) [console.warn] Warning: Indexing all PDF objects
{
  "result": "PASS",
  "scenarios": [
    "Errore quota: documento conservato e navigazione bloccata",
    "Riprova salvataggio e recupero dopo riavvio",
    "DOCX/PDF danneggiati e estensioni errate respinti senza creare bozze",
    "Avviso specifico per commenti Word",
    "Ripristino archivio atomico anche in caso di dati non scrivibili"
  ],
  "errors": []
}
PASS 01-testo-stili.docx
PASS 02-tabella.docx
PASS 03-immagine.docx
PASS 04-elenchi.docx
PASS 05-intestazioni.docx
PASS 01-formule.xlsx
PASS 02-piu-fogli.xlsx
PASS 03-formati.xlsx
PASS 04-unioni-immagine.xlsx
PASS 05-dati-filtro.xlsx
PASS 01-testo.pdf
PASS 02-scansione.pdf
PASS 03-venti-pagine.pdf
```

### npm run pack

```text
> cosmoffice@0.2.2 pack
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --dir --publish never


> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2389 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CoQCUQZa.css               42.62 kB │ gzip:   9.89 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-CrpulAga.js            10.91 kB │ gzip:   4.18 kB
dist/assets/GridEditor-CIJ_ypaT.js           13.25 kB │ gzip:   5.25 kB
dist/assets/SettingsPage-CctHtDjA.js         20.00 kB │ gzip:   6.87 kB
dist/assets/import-docx-CIFFwOMP.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-BWjCyKgQ.js             2,219.19 kB │ gzip: 659.85 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.08s

> cosmoffice@0.2.2 icons
> node scripts/icons.mjs

Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.
Attribuzioni e licenze raccolte.
  • electron-builder  version=26.18.0 os=10.0.26300
  • loaded configuration  file=V:\CosmonetOffice\electron-builder.config.cjs
  • skipped dependencies rebuild  reason=npmRebuild is set to false
  • packaging       platform=win32 arch=x64 electron=45.4.1 appOutDir=release\win-unpacked
  • downloaded      label=electron progress=100%
  • downloaded electron zip extracted successfully  output=V:\CosmonetOffice\release\win-unpacked
  • searching for node modules  pm=npm searchDir=V:\CosmonetOffice
  • no node modules found in collection, trying next search directory  pm=npm searchDir=V:\CosmonetOffice
  • searching for node modules  pm=traversal searchDir=V:\CosmonetOffice
  • using manual traversal of node_modules to build dependency tree
  • no node modules found in collection, trying next search directory  pm=traversal searchDir=V:\CosmonetOffice
  • no node modules returned while searching directories  searchDirectories=[""]
  • updating asar integrity executable resource  executablePath=release\win-unpacked\CosmOffice.exe
  • no code signing certificate configured, signing is skipped  path=release\win-unpacked\CosmOffice.exe
```

### node scripts/desktop-smoke.mjs

```text
{
  "result": "PASS",
  "package": "Windows x64",
  "checks": [
    "Avvio pacchetto locale",
    "Preload isolato e nessun require nel renderer",
    "Apertura DOCX/XLSX/PDF via IPC e filesystem",
    "Esportazione documento in PDF tramite printToPDF",
    "Worker PDF da file locale",
    "Esportazione PDF identica su disco",
    "Rotazione di pagina 2 salvata su disco e riaperta nel pacchetto",
    "Poppler indipendente: prima pagina a 0°, seconda a 90°",
    "Nessun tentativo di rete nel main del pacchetto",
    "Errore di scrittura: originale preservato e temporanei rimossi",
    "Pagina impostazioni e tema scuro nel pacchetto",
    "Chiusura dopo notifica simulata di arresto del renderer"
  ],
  "errors": []
}
```

### node scripts/offline-smoke.mjs

```text
{
  "result": "PASS",
  "checks": [
    "Avvio Electron da file locale",
    "Nessun tentativo spontaneo di rete dal processo principale",
    "IPC aggiornamenti disabilitati anche con vecchie preferenze abilitate",
    "DOCX, XLSX e PDF aperti senza connessioni",
    "Richiesta intenzionale dal main rilevata e bloccata prima della connessione",
    "NetLog Chromium: nessuna connessione TCP, UDP, QUIC o transazione DNS"
  ],
  "errors": []
}
```

### node scripts/pdf-independent.mjs

```text
{"file":"01-testo.pdf","reader":"Poppler pdfinfo e pdftoppm","pages":1,"rotatedPage":1,"otherPagesUnchanged":true,"contentPixelDifference":6.302,"pixelAlignment":{"dx":-1,"dy":0},"result":"PASS"}
{"file":"02-scansione.pdf","reader":"Poppler pdfinfo e pdftoppm","pages":1,"rotatedPage":1,"otherPagesUnchanged":true,"contentPixelDifference":3.369,"pixelAlignment":{"dx":0,"dy":0},"result":"PASS"}
{"file":"03-venti-pagine.pdf","reader":"Poppler pdfinfo e pdftoppm","pages":20,"rotatedPage":20,"otherPagesUnchanged":true,"contentPixelDifference":5.897,"pixelAlignment":{"dx":-1,"dy":0},"result":"PASS"}
```

### node scripts/fixtures-office.mjs

```text
{"file":"01-testo-stili.docx","variant":"originale","pages":1,"result":"PASS"}
22:41:13 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"01-testo-stili.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"02-tabella.docx","variant":"originale","pages":1,"result":"PASS"}
22:41:18 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"02-tabella.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"03-immagine.docx","variant":"originale","pages":1,"result":"PASS"}
22:41:24 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"03-immagine.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"04-elenchi.docx","variant":"originale","pages":1,"result":"PASS"}
22:41:28 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"04-elenchi.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"05-intestazioni.docx","variant":"originale","pages":1,"result":"PASS"}
22:41:32 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"05-intestazioni.docx","variant":"esportato","pages":1,"result":"PASS"}
22:41:34 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"01-formule.xlsx","variant":"originale","pages":1,"result":"PASS"}
22:41:36 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"01-formule.xlsx","variant":"esportato","pages":2,"result":"PASS"}
22:41:37 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"02-piu-fogli.xlsx","variant":"originale","pages":2,"result":"PASS"}
22:41:39 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"02-piu-fogli.xlsx","variant":"esportato","pages":3,"result":"PASS"}
22:41:41 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"03-formati.xlsx","variant":"originale","pages":1,"result":"PASS"}
22:41:42 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"03-formati.xlsx","variant":"esportato","pages":2,"result":"PASS"}
22:41:44 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"04-unioni-immagine.xlsx","variant":"originale","pages":2,"result":"PASS"}
22:41:46 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"04-unioni-immagine.xlsx","variant":"esportato","pages":3,"result":"PASS"}
22:41:48 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"05-dati-filtro.xlsx","variant":"originale","pages":2,"result":"PASS"}
22:41:50 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"05-dati-filtro.xlsx","variant":"esportato","pages":3,"result":"PASS"}
{"file":"01-testo.pdf","variant":"originale","pages":1,"result":"PASS"}
{"file":"01-testo.pdf","variant":"esportato","pages":1,"result":"PASS"}
{"file":"02-scansione.pdf","variant":"originale","pages":1,"result":"PASS"}
{"file":"02-scansione.pdf","variant":"esportato","pages":1,"result":"PASS"}
{"file":"03-venti-pagine.pdf","variant":"originale","pages":20,"result":"PASS"}
{"file":"03-venti-pagine.pdf","variant":"esportato","pages":20,"result":"PASS"}
```

CI già pubblicata prima del passo: [run 44947918538](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44947918538), commit `a1e73d4f946f55258c618074971bab4b1ab66e89`, conclusione reale `success`. La CI di questo nuovo codice partirà al push: **non è ancora dichiarata verde**. La controllerò prima di concludere, correggendo prima eventuali errori.

## 4. Cosa funziona, provato davvero

- 31 test del motore passati; 18 tentativi intenzionali verso API Node/Electron rilevati e bloccati nella prova isolata, senza aprire connessioni.
- Electron reale: avvio da file, apertura DOCX/XLSX/PDF e impostazioni senza tentativi spontanei dal main. I vecchi IPC di aggiornamento non producono traffico. La richiesta intenzionale `electron.net.request` viene rilevata e bloccata; NetLog Chromium non contiene connessioni TCP/UDP/QUIC o transazioni DNS.
- Tutti i 13 file del corpus aperti, modificati, salvati e riaperti. Per i PDF la modifica è la rotazione persistente dell’ultima pagina, con altre pagine invariate. Prima della modifica la copia è identica byte per byte.
- Bozza PDF ruotata conservata dopo ritorno immediato alle bozze, attesa della schermata iniziale e ricaricamento. Con quota esaurita: navigazione bloccata, PDF modificato ancora esportabile e recupero riuscito dopo il ripristino delle scritture.
- Tre PDF: flussi binari di contenuto, font e immagini invariati nei test del motore; testi di tutte le pagine invariati nel test UI. Poppler conferma numero pagine e orientamenti e renderizza la pagina ruotata con contenuto visivo conservato. Ispezionate le immagini delle tre pagine ruotate.
- Pacchetto Windows avviato: seconda pagina del PDF ruotata, salvata su disco e riaperta. Poppler indipendente conferma prima pagina a 0° e seconda a 90°. Nessun tentativo di rete dal main del pacchetto. Errore di scrittura simulato: destinazione originale preservata, temporanei rimossi e messaggio senza prefisso tecnico inglese.
- LibreOffice ha letto tutti gli originali Office e gli export; PDF.js ha letto anche i PDF esportati. Esiti completi sopra, immagini in `test-results/` (escluse da Git).

## 5. Cosa NON funziona o non hai potuto provare

- Nessun aggiornamento automatico online: rimosso come richiesto. Si installa un nuovo pacchetto locale; non esiste ancora un aggiornamento automatico da cartella locale.
- Controllo ortografico desktop disabilitato: mancano dizionari locali incorporati e relative attribuzioni verificate. La limitazione è visibile nelle impostazioni.
- I PDF permettono lettura e rotazione; mancano modifica testo/immagini, OCR, annotazioni, firma e compilazione moduli. I PDF cifrati o con firme/campi firma rilevati restano in sola lettura. Il test negativo usa un campo firma sintetico, non certifica firme crittografiche reali e non copre tutte le varianti di cifratura.
- Restano i limiti Word/Excel già documentati: paginazione Word non identica, intestazioni non mostrate nell’editor, export Word bloccato su elementi complessi rilevati, motore Excel parziale. Le vecchie bozze Word senza sorgente richiedono reimportazione.
- Non provati installer su computer pulito, dispositivi fisici macOS/Linux, Android/iOS o installazione firmata con certificati reali. Il test Windows avvia il pacchetto non firmato, non simula un’intera installazione su macchina pulita.
- Il controllo rete copre API applicative, sessioni e NetLog nei percorsi eseguiti; non è un monitor del traffico di tutti i processi del sistema operativo.
- CI del nuovo push ancora da controllare al momento di scrivere questo report; non anticipo il risultato.

## 6. Bug noti o dubbi

Aggiornato `docs/BUG.md` con NET-001/NET-002, PDF-001, UX-001 e i problemi QA risolti.

Primo tentativo PDF: 10/13 PASS. La traccia ha mostrato che il test eseguiva `reload()` prima che terminasse il gestore asincrono del clic «Torna alle bozze». La prima diagnosi di perdita durante la normale navigazione era imprecisa; corretta l’attesa della schermata iniziale, mantenendo i confronti dei file.

Primo test NetLog: `No net log in progress`, perché veniva chiuso un log di sessione mentre era stato avviato un log CLI globale. Corretto aspettando la chiusura del processo. I confronti pixel Poppler richiedono una media locale e al massimo un pixel di allineamento per gli arrotondamenti di rasterizzazione; soglia di differenza mantenuta a 25 e controllo separato dei flussi binari esatti. Le differenze finali reali sono riportate nel log Poppler.

Durante una verifica concorrente, il packaging ha causato reload Vite e avvisi watcher `EBUSY`. Esclusi gli artefatti dal watcher e ripetuti i controlli in sequenza. Il tentativo iniziale di download npm nel sandbox è fallito con `ENOTFOUND registry.npmjs.org`; installazione poi riuscita con l’accesso autorizzato per lo sviluppo. Questo download non fa parte del runtime dell’app.

Avvisi rimasti: dimensione del bundle Vite, font LibreOffice `TT: undefined function: 21` e assenza di certificato di firma nelle anteprime. Le prove non equivalgono a compatibilità totale Office o a certificazione dei PDF.

## 7. Hash del commit

Codice verificato: `ea86a064003e9228c9c64acd3b0c230a31b8caa1`.

Il report è nel commit documentale immediatamente successivo, pubblicato insieme al codice nello stesso push. Un report non può contenere il proprio hash: modificarne il testo cambierebbe quell’hash.

## 8. Prossimo passo consigliato

Attendere e verificare tutti i lavori GitHub Actions di questo push. Se un lavoro fallisce, correggerlo prima di aggiungere funzioni. Poi valutare dizionari ortografici locali e ampliare i casi di compatibilità con documenti forniti dagli utenti, senza riattivare chiamate di rete.
