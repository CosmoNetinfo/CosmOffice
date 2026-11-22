# Report — recupero del validatore Open XML

## 1. Obiettivo

Recuperare lo stash, correggere i quattro difetti di schema e rendere Open XML SDK bloccante nella CI.

## 2. Cosa hai fatto

- Stash 3548915d3183ea202e1b4eff398fceb3c459018b recuperato dopo pull --rebase, mantenuto come sicurezza. Conflitti README/BUG risolti preservando lo studio.
- src/charts.mjs: MIME corretto dei disegni; src/xlsx-schema.mjs e src/workbooks.mjs: ordine dei font e rimozione di editAs da oneCellAnchor.
- src/docx-preservation.mjs: evenAndOddHeaders originale conservato una sola volta.
- scripts/openxml-validator/: SDK Microsoft 3.5.1 MIT, progetto .NET 10, lock dipendenze e licenze. Non incluso nell’app.
- scripts/validate-openxml.mjs, scripts/smoke.mjs, scripts/charts-smoke.mjs, package.json, .github/workflows/build.yml: controllo bloccante su 13 esportati, hash invariati, due controlli negativi e audit storico separato.
- scripts/notices.mjs, THIRD_PARTY_NOTICES.txt: attribuzioni SDK/framework/Packaging. .gitignore: bin/obj esclusi.
- README, CHANGELOG, BUG, VALIDATION, ROADMAP, DECISIONI, report e ULTIMO aggiornati. Nessuna altra idea dello studio implementata; nessun motore scelto.

## 3. Esiti reali di build e test

CI della base 3185603 verificata: [run 45007101728](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45007101728), tutti i cinque lavori success. La CI del nuovo commit si avvierà al push: non è ancora dichiarata verde.

Build, 41 test, browser, SDK e LibreOffice conclusi con codice 0. Packaging iniziale fallito per ENOTFOUND github.com nell’ambiente ristretto; ripetuto con accesso autorizzato e passato. Offline e desktop passati con codice 0. NU1900 resta anche nella ripetizione autorizzata del validatore: controllo vulnerabilità NuGet online non dimostrato, compilazione e validazione riuscite. Le righe FAIL sotto sono attese solo per i controlli negativi e la copia storica.

### build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2406 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-BoqpPM_z.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-CqtIzITe.js         19.96 kB │ gzip:   6.85 kB
dist/assets/GridEditor-CPre9MRX.js          203.76 kB │ gzip:  70.73 kB
dist/assets/import-docx-C6W_hlAB.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CSFc0hip.js             2,322.34 kB │ gzip: 696.24 kB

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.44s
```

### unit

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (70.797ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (81.8565ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (122.9251ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (185.32ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (41.7737ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (40.2878ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (39.3668ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (32.1191ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (96.326ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (71.4336ms)
✔ unknown formulas retain their source without exporting a misleading cached number (11.8258ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.2291ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (17.1663ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (9.7723ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.3705ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (9.9238ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (151.5516ms)
✔ references, arithmetic, precedence and percentages (4.0848ms)
✔ Italian aliases, absolute references, text and lazy IF (1.1005ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.6543ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.8668ms)
✔ Excel address limits and column naming (1.1791ms)
✔ conditional sums, lookups, text, dates and error handling (4.7746ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5178ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.5579ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7256ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5285ms)
✔ Il processo principale non contiene updater o caricamenti da server (5.6866ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (232.8161ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (35.3096ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (7.2087ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (105.6502ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (18.1783ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (137.4429ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (43.9072ms)
✔ damaged files and mismatched Office extensions are rejected before import (12.6851ms)
✔ unsupported parts produce specific warnings without changing the original file (40.8892ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (17.3816ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.0737ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (776.5486ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (2038.1776ms)
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3157.2607
```

### browser

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
10:38:26 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

### openxml

```text
> cosmoffice@0.2.2 test:openxml
> node scripts/validate-openxml.mjs

Server MSBuild non disponibile: non è stato possibile connettersi al server entro il timeout; il server potrebbe non essersi avviato. Si esegue il fallback a una compilazione in-process.
  Individuazione dei progetti da ripristinare...
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj ripristinato (in 5,74 sec).
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  OpenXmlCheck -> V:\CosmonetOffice\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.

V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
    Avvisi: 2
    Errori: 0

Tempo trascorso 00:00:29.01
PASS V:\CosmonetOffice\test-results\corpus\01-testo-stili.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\02-tabella.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\03-immagine.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\04-elenchi.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\05-intestazioni.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\01-formule.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\02-piu-fogli.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\03-formati.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\04-unioni-immagine.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\05-dati-filtro.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\openxml\smoke.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\openxml\smoke.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\grafici-ui.xlsx: 0 errori Open XML SDK
FAIL V:\CosmonetOffice\test-results\openxml\negative\schema-errato.docx: 1 errori Open XML SDK
{"id":"Sch_InvalidElementContentExpectingComplex","description":"The element has invalid child element \u0027http://schemas.openxmlformats.org/wordprocessingml/2006/main:cosmoInvalido\u0027.","part":"/word/document.xml","path":"/w:document[1]/w:body[1]"}
FAIL V:\CosmonetOffice\test-results\openxml\negative\schema-errato.xlsx: 1 errori Open XML SDK
{"id":"Sch_AttributeValueDataTypeDetailed","description":"The attribute \u0027orientation\u0027 has invalid value \u0027diagonale\u0027. The Enumeration constraint failed.","part":"/xl/worksheets/sheet1.xml","path":"/x:worksheet[1]/x:pageSetup[1]"}
PASS Open XML SDK: 13 esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.
FAIL V:\CosmonetOffice\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type. 
[Part Uri=/xl/drawings/cosmoDrawing1.xml], 
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml], 
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
ECCEZIONE STORICA VERIFICATA: copia v1 identica, errore MIME del disegno conservato e segnalato nel report separato. Nessuna eccezione per i nuovi esportati.
```

### interop

```text
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795340444882\ods\grafici-ui.ods using filter : calc8
convert V:\CosmonetOffice\test-results\charts-interop-1795340444882\ods\grafici-ui.ods as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795340444882\xlsx\grafici-ui.xlsx using filter : Calc Office Open XML
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795340444882\xlsx\grafici-ui.pdf using filter : calc_pdf_Export
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
  "output": "V:\\CosmonetOffice\\test-results\\charts-interop-1795340444882",
  "limits": "Microsoft Excel non eseguito. I file riscritti da LibreOffice vengono aperti in sola lettura da CosmOffice per conservarne i grafici. Adattamento a una pagina anche in altezza: i fogli grandi si riducono in stampa."
}
```

### pack

```text
> cosmoffice@0.2.2 pack
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --dir --publish never


> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2406 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-BoqpPM_z.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-CqtIzITe.js         19.96 kB │ gzip:   6.85 kB
dist/assets/GridEditor-CPre9MRX.js          203.76 kB │ gzip:  70.73 kB
dist/assets/import-docx-C6W_hlAB.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CSFc0hip.js             2,322.34 kB │ gzip: 696.24 kB

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.43s

> cosmoffice@0.2.2 icons
> node scripts/icons.mjs

Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.
Attribuzioni e licenze raccolte.
  • electron-builder  version=26.18.0 os=10.0.26300
  • loaded configuration  file=V:\CosmonetOffice\electron-builder.config.cjs
  • skipped dependencies rebuild  reason=npmRebuild is set to false
  • packaging       platform=win32 arch=x64 electron=45.4.1 appOutDir=release\win-unpacked
  ⨯ getaddrinfo ENOTFOUND github.com  failedTask=build stackTrace=RequestError: getaddrinfo ENOTFOUND github.com
    at ClientRequest.<anonymous> (V:\CosmonetOffice\node_modules\got\dist\source\core\index.js:970:111)
    at ClientRequest.wrapper (node:events:639:12)
    at ClientRequest.emit (node:events:526:24)
    at ClientRequest.origin.emit (V:\CosmonetOffice\node_modules\@szmarczak\http-timer\dist\source\index.js:43:20)
    at emitErrorEvent (node:_http_client:115:11)
    at TLSSocket.socketErrorListener (node:_http_client:794:5)
    at TLSSocket.emit (node:events:514:20)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at processTicksAndRejections (node:internal/process/task_queues:90:21)
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)
```

### pack-autorizzato

```text
> cosmoffice@0.2.2 pack
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --dir --publish never


> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2406 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-BoqpPM_z.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-CqtIzITe.js         19.96 kB │ gzip:   6.85 kB
dist/assets/GridEditor-CPre9MRX.js          203.76 kB │ gzip:  70.73 kB
dist/assets/import-docx-C6W_hlAB.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CSFc0hip.js             2,322.34 kB │ gzip: 696.24 kB

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.11s
[PLUGIN_TIMINGS] JavaScript callbacks ran for 2.2s of this 3.1s build (70%).
The slowest callbacks, timed inside each callback (the wait before a callback starts is excluded, the time it awaits is included):
  - plugin vite:prepare-out-dir renderStart (67%, 2.1s, 1 call)
Additional callback time came from callbacks under 1s.
See https://rolldown.rs/reference/InputOptions.checks#bundlertimings for more details.


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

### offline

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

### desktop

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

## 4. Cosa funziona, provato

13 nuovi DOCX/XLSX senza errori SDK, due pacchetti errati respinti; validazione in sola lettura. Corpus originale immutato, copia v1 e checksum verificati. Tre grafici riaperti con dati corrispondenti in LibreOffice, stampa PDF su una pagina orizzontale. Apertura/salvataggio nel pacchetto Windows, ortografia, bozze, protezione da errore di scrittura e assenza di connessioni provati dai test.

## 5. Cosa NON funziona o non hai potuto provare

Il vecchio XLSX non supera il validatore: copia identica per autorizzazione esplicita. Errore esatto:

```text
The document cannot be opened because there is an invalid part with an unexpected content type. 
[Part Uri=/xl/drawings/cosmoDrawing1.xml], 
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml], 
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
```

Excel potrebbe rifiutare o recuperare il file: rischio dedotto dall’errore, non prova con Excel reale. La causa era anche nel nostro export attuale: ora corretta per i nuovi file. L’apertura fallita non esclude altri difetti storici.

Non provato: Microsoft Word/Excel reali, sistemi puliti, Mac/Linux fisici, file arbitrari fuori corpus. Schema valido non garantisce fedeltà visiva o calcolo completo. Audit vulnerabilità NuGet online non concluso (NU1900).

## 6. Bug e dubbi

FMT-001/002/003 corretti per i nuovi esportati provati; eccezione storica mai estesa ai nuovi file. Restano i limiti dei grafici esterni, DOCX complessi e formule. Vite segnala un chunk grande. CI di questo commit da controllare dopo il push.

## 7. Hash del commit

Base 3185603b3430757a5c31aeb930b7a4f2adbee2da. Il commit del report è ottenibile con: git log -1 --format=%H -- docs/report/2026-11-22_1118_validatore-openxml.md. Il proprio hash non può essere inserito nel medesimo commit senza cambiarlo; sarà comunicato dopo il commit.

## 8. Prossimo passo

Controllare la CI, poi rapporto tester con messaggi sicuri invece dei messaggi arbitrari che possono includere documenti. Seguiranno release, aggiornamenti GitHub, DMG e bozze di licenza nell’ordine richiesto. Nessuna scelta del motore.

Fonti: [SDK 3.5.1](https://github.com/dotnet/Open-XML-SDK/releases/tag/v3.5.1), [licenza MIT](https://github.com/dotnet/Open-XML-SDK/blob/v3.5.1/LICENSE), [ECMA-376](https://ecma-international.org/publications-and-standards/standards/ecma-376/). Consultazioni in docs/ricerca/CODICE-STUDIATO.md. Nessun codice copyleft consultato o copiato.
