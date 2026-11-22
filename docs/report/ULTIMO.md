# Report — rapporto locale per i tester

## 1. Obiettivo

Fornire una segnalazione manuale con gli ultimi 50 errori, senza inviare dati o includere documenti, nomi, percorsi personali o identificativi.

## 2. Cosa hai fatto

- electron/debug-policy.mjs e electron/debug.cjs: lista chiusa di messaggi/classi, contesto controllato, tre posizioni della traccia anonimizzate, memoria e file locale limitati a 50 eventi. Lettura del registro nuovamente filtrata. Errore di scrittura segnalato, svuotamento senza falso successo.
- electron/main.cjs e preload.cjs: intercettazione errori main, eventi blocco/crash finestra, IPC verificato, clipboard e voce menu.
- src/debug.mjs, main.jsx e App.jsx: errori renderer/promise e React, contesto senza nomi o contenuti; tipo originale e dimensione approssimativa dei file.
- src/DebugReport.jsx, SettingsPage.jsx, preferences.css: schermata leggibile prima della copia, segnaposto contatto, istruzione descrizione, promessa privacy, pulsanti copia/svuota.
- tests/debug.test.mjs, scripts/debug-check.mjs e debug-smoke.mjs: privacy con dati riconoscibili, errori simulati/reali controllati, limite 50, persistenza, copia reale Windows, menu/impostazioni e registro non scrivibile.
- .github/workflows/build.yml: prova Electron Linux e prova nel pacchetto Windows.
- README, docs/TESTER.md, CHANGELOG, BUG, VALIDATION, ROADMAP, DECISIONI, report e ULTIMO aggiornati. Nessuna libreria aggiunta. scripts/notices.mjs eseguito nel packaging: attribuzioni invariate.

## 3. Esiti reali di build e test

La precedente parte è pubblicata come 5a493a461f9514c0b954ce3319255509ae906f32. [CI 45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835): tutti i cinque lavori success, incluso il validatore bloccante. La CI di questo nuovo commit sarà controllata dopo il push.

Prima prova nativa fallita nel sandbox per ACL AppContainer di Windows; ripetuta fuori dal sandbox con autorizzazione. Alcune prime prove della simulazione main sono fallite con AssertionError SyntaxError: causa originaria non dimostrata. Normalizzazione prima dell’append al registro e attese esplicite nel test; esecuzioni successive complete passate sia in Electron sia nel pacchetto. I fallimenti iniziali sono riportati sotto. Una prima verifica completa è passata con 44 test; dopo aver corretto il caso registro non scrivibile è stata ripetuta tutta la sequenza con 45 test. Gli esiti finali seguenti hanno tutti codice 0.

### build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2409 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.52 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-BD9ZjKmC.css               45.01 kB │ gzip:  10.43 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-Dw4b32m3.js           1.80 kB │ gzip:   0.86 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-BqSQLP56.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-DVcWxxE_.js         20.33 kB │ gzip:   6.96 kB
dist/assets/GridEditor-DsENltAA.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-BJQ7gi0l.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Cra6_TEt.js             2,318.60 kB │ gzip: 695.38 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.14s
```

### unit

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (72.3389ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (71.8365ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (123.4851ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (184.8819ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (34.164ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (37.2978ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (40.3056ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (25.8477ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (7.0727ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.6338ms)
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (43.0897ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (6.1595ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (100.4811ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (104.0613ms)
✔ unknown formulas retain their source without exporting a misleading cached number (17.1281ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.3699ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (14.5261ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.0115ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.9931ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.8245ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (179.5029ms)
✔ references, arithmetic, precedence and percentages (4.5171ms)
✔ Italian aliases, absolute references, text and lazy IF (0.8339ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7501ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6921ms)
✔ Excel address limits and column naming (1.4291ms)
✔ conditional sums, lookups, text, dates and error handling (3.9138ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.7567ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.5588ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8461ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5599ms)
✔ Il processo principale non contiene updater o caricamenti da server (9.6437ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (240.6606ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (40.6154ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (11.3048ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (70.2345ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (16.9042ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (127.1139ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (43.9955ms)
✔ damaged files and mismatched Office extensions are rejected before import (14.4163ms)
✔ unsupported parts produce specific warnings without changing the original file (48.0192ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (23.2582ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (16.0939ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (842.3523ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1907.5196ms)
ℹ tests 45
ℹ suites 0
ℹ pass 45
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3084.7871
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
11:57:23 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

  Individuazione dei progetti da ripristinare...
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  Tutti i progetti sono aggiornati per il ripristino.
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  OpenXmlCheck -> V:\CosmonetOffice\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.

V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
    Avvisi: 2
    Errori: 0

Tempo trascorso 00:00:00.34
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

### pack

```text
> cosmoffice@0.2.2 pack
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --dir --publish never


> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2409 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.52 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-BD9ZjKmC.css               45.01 kB │ gzip:  10.43 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-Dw4b32m3.js           1.80 kB │ gzip:   0.86 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-BqSQLP56.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-DVcWxxE_.js         20.33 kB │ gzip:   6.96 kB
dist/assets/GridEditor-DsENltAA.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-BJQ7gi0l.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Cra6_TEt.js             2,318.60 kB │ gzip: 695.38 kB

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

### native

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### pacchetto

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### Preparazione: debug-native.log

```text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

electron.launch: Process failed to launch!
Call log:
  - <launching> "V:\CosmonetOffice\node_modules\electron\dist\electron.exe" "--inspect=0" "--remote-debugging-port=0" "." "--no-sandbox"
  - <launched> pid=14944
  - [pid=14944][out]
  - [pid=14944][err] Debugger listening on ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48
  - [pid=14944][err] For help, see: https://nodejs.org/learn/getting-started/debugging
  - <ws connecting> ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48
  - <ws connected> ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48
  - [pid=14944][err] Debugger attached.
  - [pid=14944][err] [19968:1122/112426.577:FATAL:electron\shell\browser\win\install_dir_access.cc:52] Sandboxed processes cannot read V:\CosmonetOffice\node_modules\electron\dist: its ACL has an entry for an AppContainer package SID but none for ALL APPLICATION PACKAGES, so Windows denies the sandbox token access. Grant it with: icacls "V:\CosmonetOffice\node_modules\electron\dist" /grant *S-1-15-2-1:(OI)(CI)(RX)
  - <ws disconnected> ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48 code=1006 reason=
  - [pid=14944] <kill>
  - [pid=14944] <will force kill>
  - [pid=14944] <process did exit: exitCode=2147483651, signal=null>
  - [pid=14944] starting temporary directories cleanup
  - [pid=14944] finished temporary directories cleanup

    at async file:///V:/CosmonetOffice/scripts/debug-smoke.mjs:5:21 {
  log: [
    '  - <launching> "V:\\CosmonetOffice\\node_modules\\electron\\dist\\electron.exe" "--inspect=0" "--remote-debugging-port=0" "." "--no-sandbox"',
    '  - <launched> pid=14944',
    '  - [pid=14944][out]',
    '  - [pid=14944][err] Debugger listening on ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48',
    '  - [pid=14944][err] For help, see: https://nodejs.org/learn/getting-started/debugging',
    '  - <ws connecting> ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48',
    '  - <ws connected> ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48',
    '  - [pid=14944][err] Debugger attached.',
    '  - [pid=14944][err] [19968:1122/112426.577:FATAL:electron\\shell\\browser\\win\\install_dir_access.cc:52] Sandboxed processes cannot read V:\\CosmonetOffice\\node_modules\\electron\\dist: its ACL has an entry for an AppContainer package SID but none for ALL APPLICATION PACKAGES, so Windows denies the sandbox token access. Grant it with: icacls "V:\\CosmonetOffice\\node_modules\\electron\\dist" /grant *S-1-15-2-1:(OI)(CI)(RX)',
    '  - <ws disconnected> ws://127.0.0.1:57389/ee3d2402-8311-47bb-8127-734bee285c48 code=1006 reason=',
    '  - [pid=14944] <kill>',
    '  - [pid=14944] <will force kill>',
    '  - [pid=14944] <process did exit: exitCode=2147483651, signal=null>',
    '  - [pid=14944] starting temporary directories cleanup',
    '  - [pid=14944] finished temporary directories cleanup'
  ],
  name: 'Error'
}

Node.js v26.13.1
```

### Preparazione: debug-native-autorizzato.log

```text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: SyntaxError
    at checkDebug (file:///V:/CosmonetOffice/scripts/debug-check.mjs:27:189)
    at async file:///V:/CosmonetOffice/scripts/debug-smoke.mjs:8:7 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v26.13.1
```

### Preparazione: debug-native-ripetuto.log

```text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: SyntaxError
    at checkDebug (file:///V:/CosmonetOffice/scripts/debug-check.mjs:30:189)
    at async file:///V:/CosmonetOffice/scripts/debug-smoke.mjs:8:7 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v26.13.1
```

## 4. Cosa funziona, provato

Errori renderer e promise effettivamente non gestiti, evento di eccezione main simulato sul suo ascoltatore reale, notifiche simulate di finestra bloccata e arrestata. Il PDF sintetico contiene lo stesso marcatore nel testo, nel nome e nel percorso: nessuno compare nel rapporto o nel file del registro. Copia esattamente uguale alla textarea negli appunti Windows. Lettura dopo ricaricamento, cancellazione del file logico e limite 50 verificati; errore di scrittura esplicito. Prove native ripetute anche nel pacchetto Windows x64. Screenshot locale esaminato: testo e azioni visibili. Tutti i test precedenti e offline-smoke restano verdi.

## 5. Cosa NON funziona o non hai potuto provare

Non provati crash reali di Windows, Chromium o sistema operativo, spegnimento improvviso, computer puliti, hardware Mac/Linux. Per il main è simulato l’evento monitorato senza provocare un arresto reale. La schermata può richiedere riavvio/ricaricamento se il renderer è già morto; un errore prima dell’inizializzazione o un disco non scrivibile può impedire la persistenza. Nell’anteprima browser registro solo in memoria e informazioni runtime ridotte: il collaudo completo riguarda Electron.

I messaggi liberi sono volutamente omessi; non basta rimuovere i percorsi per garantire che non contengano celle o paragrafi. Le tracce mostrano soltanto posizioni anonimizzate, quindi la diagnosi può essere meno precisa. Il canale di contatto è ancora il segnaposto richiesto. Lo svuotamento non cancella appunti o messaggi già copiati/inviati dall’utente. Non è una certificazione d’integrità del documento.

## 6. Bug e dubbi

Il problema intermittente nella preparazione del test main non è stato attribuito con certezza a una causa. Dopo le modifiche di registrazione e sincronizzazione sono passate più esecuzioni native e due sequenze complete con pacchetto; non si nascondono i fallimenti iniziali. Il caso negativo del registro non scrivibile è ora testato e non restituisce un falso successo. Restano l’avviso Vite sul chunk grande e NU1900 locale per l’audit NuGet; validazione OOXML riuscita. Nessuna nuova connessione. Nessuna proposta OPPORTUNITA diversa dal rapporto esplicitamente richiesto è implementata.

## 7. Hash del commit

Base: 5a493a461f9514c0b954ce3319255509ae906f32. Il commit contenente codice e report è ottenibile con git log -1 --format=%H -- docs/report/2026-11-22_1203_rapporto-tester.md. Il proprio hash non è inseribile nel medesimo commit senza cambiarlo; viene comunicato dopo il commit.

## 8. Prossimo passo

Verificare la CI del rapporto, poi creare la Release ordinaria pubblica CosmOffice 0.2.2 (anteprima), con installer non firmati, checksum e limiti. Seguono aggiornamenti GitHub, DMG/guida Mac e bozze di licenza, senza modificare LICENSE né scegliere un motore.
