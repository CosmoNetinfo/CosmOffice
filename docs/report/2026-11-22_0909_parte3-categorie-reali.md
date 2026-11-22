# Report — parte 3: categorie nelle celle reali

## 1. Obiettivo

Non creare fogli tecnici nascosti nei nuovi XLSX e mantenere l'apertura dei file precedenti senza perdita di informazioni.

## 2. Cosa hai fatto

- src/charts.mjs e src/workbooks.mjs: categorie dei nuovi grafici riferite alle celle reali dell'intervallo; metadati versione 2, riconoscimento senza foglio tecnico e nessuna generazione di veryHidden.
- Per i vecchi grafici v1 con categorie diverse dalle celle: sola lettura, foglio tecnico esistente intatto ed export esclusivamente byte per byte identico. È la soluzione espressamente richiesta dall'utente al posto della proposta di tabelle visibili, rifiutata e non implementata.
- src/GridCharts.jsx e src/GridEditor.jsx: avviso italiano sulla precedente anteprima, comandi di modifica disabilitati per quei file, grafici ancora visibili. Nei nuovi grafici le etichette modificano le celle reali; il pannello avverte che questo vale anche per gli altri grafici che le condividono. Nessuna cella aggiunta per migrare file vecchi.
- tests/chart-legacy.test.mjs, tests/charts.test.mjs e tests/fixtures/legacy/: campione immutabile v1 creato prima della modifica, hash verificato, categorie discordanti conservate, copia originale e nuovi file senza fogli nascosti. I 13 campioni del manifest restano invariati.
- scripts/charts-smoke.mjs e scripts/charts-interop.mjs: verifica interfaccia e round trip LibreOffice senza fogli nascosti; prova negativa dei grafici esterni ancora bloccati; prova di sola copia per i vecchi grafici.
- scripts/charts-desktop-check.mjs e scripts/offline-smoke.mjs: prova del vecchio file anche in Electron e copia identica sul filesystem del pacchetto Windows.
- README.md, docs/BUG.md, questo report e docs/report/ULTIMO.md: comportamento e deroga esplicita per i vecchi file. scripts/notices.mjs eseguito; nessuna nuova libreria.

## 3. Esiti reali di build e test

Sequenza finale a sorgenti fermi: tutti i comandi seguenti terminati con codice 0.

### npm run build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2405 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-DegIELvb.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-8ktBdiiU.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-B1UQfFot.js          203.76 kB │ gzip:  70.73 kB
dist/assets/import-docx-B2FSo26L.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CaqtXkIh.js             2,321.06 kB │ gzip: 695.89 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.46s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (84.6351ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (80.1231ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (132.0776ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (191.8864ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (24.0772ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (30.5931ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (20.7985ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (20.4465ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (118.7017ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (97.1519ms)
✔ unknown formulas retain their source without exporting a misleading cached number (15.2622ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.888ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (13.4576ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (14.7003ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.9321ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (10.384ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (203.6258ms)
✔ references, arithmetic, precedence and percentages (3.9801ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7027ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.6501ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6505ms)
✔ Excel address limits and column naming (1.452ms)
✔ conditional sums, lookups, text, dates and error handling (4.1664ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6431ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4244ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9034ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.726ms)
✔ Il processo principale non contiene updater o caricamenti da server (8.4049ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (210.5919ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (31.2914ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (9.4237ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (85.7928ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (17.5339ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (134.1318ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (41.4702ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.263ms)
✔ unsupported parts produce specific warnings without changing the original file (43.2163ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (10.8206ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (10.1427ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (741.1641ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1945.0771ms)
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3431.0453
```

### npm run test:browser

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs

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
09:02:37 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
PASS ortografia italiana: Write, Grid, impostazioni, parole personali, riavvio pagina e nessuna richiesta esterna.
PASS grafici: categorie nelle celle, nuovi XLSX senza fogli nascosti, dati aggiornati e file riaperti; vecchia anteprima in sola lettura con copia identica; grafici esterni con export bloccato; nessuna richiesta esterna.
```

### node scripts/charts-interop.mjs

```text
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795334652054\ods\grafici-ui.ods using filter : calc8
convert V:\CosmonetOffice\test-results\charts-interop-1795334652054\ods\grafici-ui.ods as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795334652054\xlsx\grafici-ui.xlsx using filter : Calc Office Open XML
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795334652054\xlsx\grafici-ui.pdf using filter : calc_pdf_Export
{
  "result": "PASS",
  "engine": "LibreOffice: XLSX → ODS → XLSX e PDF",
  "charts": [
    {
      "type": "bar",
      "values": [
        [
          37,
          20
        ]
      ],
      "labels": [
        "Gennaio personalizzato",
        "Febbraio"
      ],
      "result": "PASS"
    },
    {
      "type": "line",
      "values": [
        [
          37,
          20
        ]
      ],
      "labels": [
        "Gennaio personalizzato",
        "Febbraio"
      ],
      "result": "PASS"
    },
    {
      "type": "pie",
      "values": [
        [
          37,
          20
        ]
      ],
      "labels": [
        "Gennaio personalizzato",
        "Febbraio"
      ],
      "result": "PASS"
    }
  ],
  "print": {
    "pages": 1,
    "landscape": true
  },
  "output": "V:\\CosmonetOffice\\test-results\\charts-interop-1795334652054",
  "limits": "Microsoft Excel non eseguito. I file riscritti da LibreOffice vengono aperti in sola lettura da CosmOffice per conservarne i grafici. Adattamento a una pagina anche in altezza: i fogli grandi si riducono in stampa."
}
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
✓ 2405 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-DegIELvb.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-8ktBdiiU.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-B1UQfFot.js          203.76 kB │ gzip:  70.73 kB
dist/assets/import-docx-B2FSo26L.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CaqtXkIh.js             2,321.06 kB │ gzip: 695.89 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.11s

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

## 4. Cosa funziona (provato)

41 test del motore e tutte le suite browser passati. I nuovi file hanno categorie nei riferimenti reali A2:A3 e nessun foglio hidden/veryHidden, verificato prima e dopo LibreOffice. Riapertura nell'app e riconoscimento v2 passati. Il vecchio campione conserva A2=Gennaio e la categoria separata Gennaio personalizzato per il grafico a barre; linee e torta restano Gennaio. Grafici visibili ma non modificabili, avviso italiano presente e copia identica provata sia nel browser sia sul filesystem Windows. Nessuna connessione in offline-smoke.

## 5. Cosa NON funziona o non hai potuto provare

I vecchi file con categorie discordanti non sono modificabili: consentono soltanto la copia identica con il foglio tecnico e le impostazioni di stampa originali, come richiesto dall'utente. Non viene tentata una migrazione. Eventuali altri fogli nascosti già presenti nei file degli utenti non vengono cancellati automaticamente. Grafici esterni non riconosciuti ancora in sola lettura con export bloccato fino alla parte 8. Non provato: Microsoft Excel reale, tutte le varianti storiche e file modificati da terzi. Parti 4–8 da svolgere.

## 6. Bug e dubbi

La prima esecuzione mirata passava 5 test su 6: il test immagini inseriva ancora un'etichetta nel modello v1 invece di una cella reale. Un errore nello script di modifica ne aveva impedito l'aggiornamento. Corretto il test senza cambiare il campione storico e ripetuta l'intera sequenza. Non sono state create tabelle visibili né sovrascritti dati per i vecchi file. Restano l'avviso di dimensione bundle e i limiti documentati.

## 7. Hash del commit

Base: 405a613ae05b8574d18c01affd920d22b705eba9, cinque lavori CI verdi, run 44999964554. Codice e report condividono un unico commit della parte 3; hash finale nella cronologia del file e nel riepilogo conclusivo (un hash autoreferenziale non può essere scritto nello stesso commit).

## 8. Prossimo passo

Parte 4: aggiungere alla CI il validatore Open XML SDK Microsoft per gli XLSX e DOCX esportati, rendendo gli errori bloccanti.
