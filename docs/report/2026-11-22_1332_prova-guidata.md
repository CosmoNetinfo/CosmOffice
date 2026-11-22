# Report — prova guidata

## 1. Obiettivo

Otto prove con istruzioni italiane, soltanto Ok/Problema/Non provato, persistenza locale e otto righe iniziali nel rapporto copiato.

## 2. Cosa hai fatto

- electron/guided-policy.mjs: otto chiavi e tre soli valori ammessi; campi e valori arbitrari esclusi.
- src/GuidedTest.jsx e src/guided.mjs: schermata, radio, localStorage, anteprima e copia senza invio. Nessun campo libero.
- electron/debug.cjs, main.cjs, preload.cjs, src/debug.mjs, App.jsx e SettingsPage.jsx: accesso da Impostazioni/menu, validazione main e prefisso degli esiti nel rapporto.
- src/preferences.css: aspetto della schermata e scorrimento.
- tests/guided.test.mjs, scripts/guided-check.mjs, guided-smoke.mjs e guided-browser.mjs: privacy, persistenza, contenuto della clipboard reale e schermata. package.json e CI: controlli aggiunti nel browser, Electron Linux e pacchetto Windows.
- README, TESTER, CHANGELOG, BUG, VALIDATION, ROADMAP, DECISIONI, report e ULTIMO aggiornati. Nessuna libreria aggiunta; notices rigenerati, invariati.

## 3. Esiti reali di build e test

Base e8faf0bc3f19ef283c0480aca80094ac4a8b66f7: [CI 45020926005](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45020926005), cinque lavori success verificati. Le 20 ripetizioni richieste del rapporto rimangono documentate nel commit e8faf0b. La nuova CI della guida si avvierà al push.

Preparazione: prima cattura della finestra Electron nascosta in timeout dopo la verifica degli appunti. La cattura è ora nel browser, mentre i controlli funzionali restano nativi. Prima prova browser fallita perché contava i radio prima del caricamento lazy: aggiunta attesa esplicita. Entrambi gli esiti iniziali sono riportati, non nascosti. Le verifiche finali sotto hanno codice 0.

### build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2412 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.51 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-pN1N-dEe.css               45.73 kB │ gzip:  10.56 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-qsGKJ-59.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-C9S9kaM_.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-82GBY_vP.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-DugKEgZk.js         20.56 kB │ gzip:   7.03 kB
dist/assets/GridEditor-DpyLzQHz.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-CTUhEFW8.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Vzw8i3fV.js             2,320.77 kB │ gzip: 696.13 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.15s
```

### unit

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (70.6628ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (73.6839ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (122.1232ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (190.1367ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (35.0891ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (43.4869ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (36.0695ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (27.0921ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.8181ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.6955ms)
Rapporto con 50 eventi e ultima traccia: 4964 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (58.5993ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (5.905ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (101.9747ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (89.0924ms)
✔ unknown formulas retain their source without exporting a misleading cached number (17.268ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.2738ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.2687ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.0623ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.2402ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (9.4297ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (165.7624ms)
✔ references, arithmetic, precedence and percentages (4.0408ms)
✔ Italian aliases, absolute references, text and lazy IF (1.2206ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.966ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.8472ms)
✔ Excel address limits and column naming (1.4978ms)
✔ conditional sums, lookups, text, dates and error handling (4.0419ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5778ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.6094ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8577ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6158ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.6395ms)
✔ Il processo principale non contiene updater o caricamenti da server (7.5456ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (236.5148ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (44.3601ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (11.145ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (104.5773ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (18.7588ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (146.4186ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (42.2991ms)
✔ damaged files and mismatched Office extensions are rejected before import (12.1225ms)
✔ unsupported parts produce specific warnings without changing the original file (45.4617ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (19.8058ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (14.343ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (834.5675ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1876.956ms)
ℹ tests 46
ℹ suites 0
ℹ pass 46
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3126.0948
```

### browser

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs

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
13:25:16 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
PASS prova guidata nel browser: 24 radio, rapporto aggiornato e schermata acquisita.
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

Tempo trascorso 00:00:02.81
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
✓ 2412 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.51 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-pN1N-dEe.css               45.73 kB │ gzip:  10.56 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-qsGKJ-59.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-C9S9kaM_.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-82GBY_vP.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-DugKEgZk.js         20.56 kB │ gzip:   7.03 kB
dist/assets/GridEditor-DpyLzQHz.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-CTUhEFW8.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Vzw8i3fV.js             2,320.77 kB │ gzip: 696.13 kB

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
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

### debug

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### pacchetto

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

### debug-pacchetto

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### Preparazione: guided-native.log

```text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

page.screenshot: Timeout 30000ms exceeded.
Call log:
  - taking page screenshot
  - waiting for fonts to load...
  - fonts loaded

    at checkGuided (V:\CosmonetOffice\scripts\guided-check.mjs:28:14)
    at async file:///V:/CosmonetOffice/scripts/guided-smoke.mjs:8:7 {
  log: [
    '  - taking page screenshot',
    '  - waiting for fonts to load...',
    '  - fonts loaded'
  ],
  name: 'TimeoutError'
}

Node.js v26.13.1
```

### Preparazione: guided-native-ripetuto.log

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

## 4. Cosa funziona, provato

46 test superati. Otto prove e 24 radio; nessun campo editabile libero. Accesso da Impostazioni e menu, scelte conservate dopo ricaricamento, prime otto righe corrispondenti negli appunti Windows, anteprima identica al testo copiato. Campi e valori arbitrari esclusi; nessun tentativo di rete. Prova anche nel pacchetto Windows x64. Rapporto con otto righe più 50 eventi: 4.964 byte UTF-8, sotto 6.144. Immagine della schermata browser esaminata. DOCX/XLSX/PDF, SDK, offline e desktop precedenti restano verdi.

## 5. Cosa NON funziona o non hai potuto provare

Le scelte della guida sono dichiarazioni del tester: non provano automaticamente installazione, Word/Excel reali o tutte le funzioni. Nessun test su computer puliti o hardware Mac/Linux. Cattura grafica della guida nella finestra Electron nascosta non riuscita; verifiche funzionali native e cattura browser riuscite. Non è dimostrata la causa del timeout della cattura. Crash reali del sistema operativo e spegnimento improvviso non provati. Esiti della guida non inclusi nei backup documenti/preferenze; Svuota registro elimina soltanto gli eventi.

## 6. Bug e dubbi

Conteggio anticipato nel test browser corretto con attesa della schermata. Acquisizione grafica spostata nel browser dopo timeout native: non dichiarata prova grafica nativa. Esiti liberi non ammessi e nessun invio aggiunto. Rimangono avviso Vite e NU1900 locale; SDK valido sui nuovi esportati, eccezione storica invariata. Aggiornamenti e Release pubblica non ancora implementati in questo passo.

## 7. Hash dei commit

- SDK: 5a493a461f9514c0b954ce3319255509ae906f32, CI verde.
- Rapporto iniziale: 9e3173e321ce5ac60b224fb1344821a5e29ca8f4, CI verde.
- Consolidamento Facebook e 20 prove: e8faf0bc3f19ef283c0480aca80094ac4a8b66f7, CI verde.
- Questo passo: commit contenente docs/report/2026-11-22_1332_prova-guidata.md, individuabile con git log -1 --format=%H -- docs/report/2026-11-22_1332_prova-guidata.md. Il proprio hash non è inseribile nello stesso commit senza cambiarlo.

## 8. Prossimo passo

Aggiornamenti automatici esclusivamente dalle Release GitHub autorizzate, con interruttore e verifica della rete. Poi DMG/guida Mac, Release ordinaria CosmOffice 0.2.2 (anteprima) e bozze di licenza senza modificare LICENSE. Nessuna scelta del motore o altra idea implementata.
