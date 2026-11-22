# Report — parte 2: stampa dei grafici

## 1. Obiettivo

Impostare la stampa degli XLSX con grafici senza spezzarli e chiudere CHART-002 dopo prova LibreOffice PDF.

## 2. Cosa hai fatto

- src/charts.mjs: nella sola copia di esportazione, fogli con grafici in orizzontale, fitToPage attivo, larghezza 1 pagina e altezza 1 pagina. L'altezza aggiuntiva è stata espressamente autorizzata dall'utente dopo la prova che larghezza 1 e orientamento orizzontale non bastavano.
- tests/chart-print.test.mjs: verifica impostazioni, serializzazione e modello originale non mutato.
- scripts/charts-interop.mjs: il PDF LibreOffice deve avere esattamente una pagina orizzontale; restano i confronti dei dati e dei tre grafici dopo XLSX → ODS → XLSX.
- README.md e docs/BUG.md: comportamento di stampa, riduzione dei fogli grandi e chiusura CHART-002 sul campione provato.
- scripts/notices.mjs eseguito: nessuna nuova dipendenza, attribuzioni già presenti invariate.
- Creato questo report e aggiornata la copia docs/report/ULTIMO.md.

## 3. Esiti reali di build e test

Sequenza finale: tutti i comandi seguenti terminati con codice 0.

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
dist/assets/PdfViewer-B4dqdgi4.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-upAwXs8-.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-CaZZLmAU.js          203.05 kB │ gzip:  70.48 kB
dist/assets/import-docx-DBl4aX8S.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-DbW1uvNr.js             2,319.93 kB │ gzip: 695.51 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.18s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (114.0196ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (154.8994ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (28.5545ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (33.6668ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (29.8967ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (26.2663ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (99.5495ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (68.5141ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.3493ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.3465ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (9.231ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.128ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.1514ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.87ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (148.553ms)
✔ references, arithmetic, precedence and percentages (4.0332ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7022ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.744ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.5488ms)
✔ Excel address limits and column naming (1.4066ms)
✔ conditional sums, lookups, text, dates and error handling (3.8092ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6187ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4108ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.3008ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.9593ms)
✔ Il processo principale non contiene updater o caricamenti da server (7.4551ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (211.0449ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (38.3277ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (9.0933ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (128.3615ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (21.735ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (113.0091ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (30.6779ms)
✔ damaged files and mismatched Office extensions are rejected before import (8.9091ms)
✔ unsupported parts produce specific warnings without changing the original file (43.7382ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (15.2248ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (8.8224ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (807.4013ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1847.6918ms)
ℹ tests 39
ℹ suites 0
ℹ pass 39
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2932.9867
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
08:43:51 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
PASS grafici: barre, linee, torta, aggiornamento dati, titolo/etichette/legenda, bozza e XLSX riaperti; grafici esterni in sola lettura con export bloccato; nessuna richiesta esterna.
```

### node scripts/charts-interop.mjs

```text
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795333526807\ods\grafici-ui.ods using filter : calc8
convert V:\CosmonetOffice\test-results\charts-interop-1795333526807\ods\grafici-ui.ods as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795333526807\xlsx\grafici-ui.xlsx using filter : Calc Office Open XML
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795333526807\xlsx\grafici-ui.pdf using filter : calc_pdf_Export
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
        "Gennaio",
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
        "Gennaio",
        "Febbraio"
      ],
      "result": "PASS"
    }
  ],
  "print": {
    "pages": 1,
    "landscape": true
  },
  "output": "V:\\CosmonetOffice\\test-results\\charts-interop-1795333526807",
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
dist/assets/PdfViewer-B4dqdgi4.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-upAwXs8-.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-CaZZLmAU.js          203.05 kB │ gzip:  70.48 kB
dist/assets/import-docx-DBl4aX8S.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-DbW1uvNr.js             2,319.93 kB │ gzip: 695.51 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.14s

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

39 test del motore passati; tutte le suite browser e il corpus di 13 file passati. LibreOffice produce una pagina orizzontale con tre grafici interi; rendering Poppler della pagina esaminato visivamente. Dati, titoli, etichette e legenda rimangono verificati dopo il round trip indipendente. Pacchetto Windows ricostruito e provato; offline-smoke ancora senza connessioni.

## 5. Cosa NON funziona o non hai potuto provare

Adattare anche l'altezza a una pagina può rendere piccoli i fogli grandi: è il compromesso approvato dall'utente. Non provato: tutte le combinazioni di dimensioni, impostazioni manuali di stampa e Microsoft Excel reale. Le parti 3–8 restano da svolgere, senza anticiparne l'implementazione.

## 6. Bug e dubbi

La prima prova con solo fitToWidth=1, fitToHeight=0 e landscape produceva ancora 2 pagine e spezzava la torta verticalmente. Non è stata dichiarata riuscita. Dopo l'autorizzazione esplicita è stata aggiunta l'altezza 1: PDF di 1 pagina, tutti e tre i grafici interi. CHART-002 chiuso per il campione riprodotto. Rimane l'avviso di dimensione del bundle.

## 7. Hash del commit

Base: 2f208b23c220d40fca5d557f48ffcab71958042b, con cinque lavori CI verdi (run 44998973575). Codice e report vengono pubblicati nello stesso commit della parte 2; l'hash finale è nella cronologia di questo file e nel riepilogo conclusivo. L'hash del proprio commit non può essere inserito autoreferenzialmente senza cambiarlo.

## 8. Prossimo passo

Parte 3: eliminare il foglio tecnico conservando la compatibilità dei file precedenti e verificando nuovamente il round trip LibreOffice.
