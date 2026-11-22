# Report — controllo tester e rapporto Facebook

## 1. Obiettivo

Verificare le CI richieste, indicare i commenti Facebook come canale manuale, mantenere il rapporto breve e provare debug-smoke dieci volte consecutive in ciascun ambiente.

## 2. Cosa hai fatto

- electron/debug-policy.mjs, electron/debug.cjs e src/debug.mjs: una riga controllata per ogni evento; tutti gli ultimi 50 inclusi, soltanto l’ultima traccia anonimizzata. Metadati limitati in lunghezza. Nessun messaggio arbitrario.
- src/DebugReport.jsx, README e docs/TESTER.md: canale “i commenti del post Facebook di CosmOffice”, nessun invio automatico.
- tests/debug.test.mjs e scripts/debug-check.mjs: limite di 6.144 byte UTF-8; il caso con 50 eventi misura 4.733 byte, senza marcatore privato.
- scripts/debug-repeat.mjs: 10 processi Electron e 10 processi del pacchetto, seriali, interruzione al primo fallimento, log ed esito di ogni esecuzione.
- CHANGELOG, BUG, DECISIONI, ROADMAP, VALIDATION, questo report e ULTIMO aggiornati. Nessuna libreria aggiunta; notices rigenerati nel packaging, invariati.

## 3. Esiti reali di build e test

- Commit SDK 5a493a461f9514c0b954ce3319255509ae906f32: [CI 45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835) tutta verde, cinque lavori success.
- Commit rapporto 9e3173e321ce5ac60b224fb1344821a5e29ca8f4: [CI 45015464220](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45015464220) tutta verde, cinque lavori success; compreso rapporto Linux e pacchetto Windows.

Le 20 ripetizioni sono eseguite sulla variante corrente basata su 9e3173e con rapporto compatto e canale Facebook, non su un checkout immutato di 9e3173e. Nessun fallimento in questa sequenza. Tutti i comandi finali riportati sotto hanno codice 0. NU1900 locale resta un avviso sull’audit vulnerabilità NuGet: non un errore di validazione dei nuovi documenti.

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
dist/assets/DebugReport-wsvarhs-.js           1.83 kB │ gzip:   0.87 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-CTWE_qWJ.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-D7u1P65e.js         20.33 kB │ gzip:   6.97 kB
dist/assets/GridEditor-C9kd2Ybg.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-ChFG3esF.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-JNJyBDXR.js             2,318.80 kB │ gzip: 695.42 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.11s
[PLUGIN_TIMINGS] JavaScript callbacks ran for 2.2s of this 3.1s build (70%).
The slowest callbacks, timed inside each callback (the wait before a callback starts is excluded, the time it awaits is included):
  - plugin vite:prepare-out-dir renderStart (68%, 2.1s, 1 call)
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

### ripetizioni

```text
INIZIO debug-smoke electron 1/10
PASS debug-smoke electron 1/10: codice 0; 21735 ms
INIZIO debug-smoke electron 2/10
PASS debug-smoke electron 2/10: codice 0; 22818 ms
INIZIO debug-smoke electron 3/10
PASS debug-smoke electron 3/10: codice 0; 20662 ms
INIZIO debug-smoke electron 4/10
PASS debug-smoke electron 4/10: codice 0; 20751 ms
INIZIO debug-smoke electron 5/10
PASS debug-smoke electron 5/10: codice 0; 17764 ms
INIZIO debug-smoke electron 6/10
PASS debug-smoke electron 6/10: codice 0; 20859 ms
INIZIO debug-smoke electron 7/10
PASS debug-smoke electron 7/10: codice 0; 22732 ms
INIZIO debug-smoke electron 8/10
PASS debug-smoke electron 8/10: codice 0; 17734 ms
INIZIO debug-smoke electron 9/10
PASS debug-smoke electron 9/10: codice 0; 20787 ms
INIZIO debug-smoke electron 10/10
PASS debug-smoke electron 10/10: codice 0; 20849 ms
INIZIO debug-smoke pacchetto 1/10
PASS debug-smoke pacchetto 1/10: codice 0; 22015 ms
INIZIO debug-smoke pacchetto 2/10
PASS debug-smoke pacchetto 2/10: codice 0; 16712 ms
INIZIO debug-smoke pacchetto 3/10
PASS debug-smoke pacchetto 3/10: codice 0; 16682 ms
INIZIO debug-smoke pacchetto 4/10
PASS debug-smoke pacchetto 4/10: codice 0; 21722 ms
INIZIO debug-smoke pacchetto 5/10
PASS debug-smoke pacchetto 5/10: codice 0; 20774 ms
INIZIO debug-smoke pacchetto 6/10
PASS debug-smoke pacchetto 6/10: codice 0; 18758 ms
INIZIO debug-smoke pacchetto 7/10
PASS debug-smoke pacchetto 7/10: codice 0; 20714 ms
INIZIO debug-smoke pacchetto 8/10
PASS debug-smoke pacchetto 8/10: codice 0; 18723 ms
INIZIO debug-smoke pacchetto 9/10
PASS debug-smoke pacchetto 9/10: codice 0; 23763 ms
INIZIO debug-smoke pacchetto 10/10
PASS debug-smoke pacchetto 10/10: codice 0; 16721 ms
PASS: 10 esecuzioni consecutive in Electron e 10 nel pacchetto. Esiti: V:\CosmonetOffice\test-results\debug-repeat-1795346584533/esiti.json
```

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
dist/assets/DebugReport-wsvarhs-.js           1.83 kB │ gzip:   0.87 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-CTWE_qWJ.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-D7u1P65e.js         20.33 kB │ gzip:   6.97 kB
dist/assets/GridEditor-C9kd2Ybg.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-ChFG3esF.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-JNJyBDXR.js             2,318.80 kB │ gzip: 695.42 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.62s
```

### unit

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (85.6212ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (85.3056ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (143.8102ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (201.5595ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (28.4033ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (26.9951ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (26.2349ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (21.6451ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.9609ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (1.5927ms)
Rapporto con 50 eventi e ultima traccia: 4733 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (46.5174ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (7.2574ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (119.2972ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (107.6406ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.9048ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.0405ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.4182ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (12.3352ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.6131ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.187ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (200.2722ms)
✔ references, arithmetic, precedence and percentages (3.9714ms)
✔ Italian aliases, absolute references, text and lazy IF (0.9943ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.8101ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6444ms)
✔ Excel address limits and column naming (1.0592ms)
✔ conditional sums, lookups, text, dates and error handling (3.0898ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5454ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4091ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8164ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6796ms)
✔ Il processo principale non contiene updater o caricamenti da server (7.8169ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (198.2378ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (40.7364ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (12.2994ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (129.4993ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (12.7098ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (141.4962ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (51.051ms)
✔ damaged files and mismatched Office extensions are rejected before import (12.6357ms)
✔ unsupported parts produce specific warnings without changing the original file (36.3593ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (15.148ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.1063ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (741.5733ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1824.4973ms)
ℹ tests 45
ℹ suites 0
ℹ pass 45
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 4652.5249
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
13:03:32 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:04.86
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

### Esiti individuali reali

```json
[
  {
    "mode": "electron",
    "run": 1,
    "code": 0,
    "result": "PASS",
    "ms": 21735,
    "log": "electron-01.log"
  },
  {
    "mode": "electron",
    "run": 2,
    "code": 0,
    "result": "PASS",
    "ms": 22818,
    "log": "electron-02.log"
  },
  {
    "mode": "electron",
    "run": 3,
    "code": 0,
    "result": "PASS",
    "ms": 20662,
    "log": "electron-03.log"
  },
  {
    "mode": "electron",
    "run": 4,
    "code": 0,
    "result": "PASS",
    "ms": 20751,
    "log": "electron-04.log"
  },
  {
    "mode": "electron",
    "run": 5,
    "code": 0,
    "result": "PASS",
    "ms": 17764,
    "log": "electron-05.log"
  },
  {
    "mode": "electron",
    "run": 6,
    "code": 0,
    "result": "PASS",
    "ms": 20859,
    "log": "electron-06.log"
  },
  {
    "mode": "electron",
    "run": 7,
    "code": 0,
    "result": "PASS",
    "ms": 22732,
    "log": "electron-07.log"
  },
  {
    "mode": "electron",
    "run": 8,
    "code": 0,
    "result": "PASS",
    "ms": 17734,
    "log": "electron-08.log"
  },
  {
    "mode": "electron",
    "run": 9,
    "code": 0,
    "result": "PASS",
    "ms": 20787,
    "log": "electron-09.log"
  },
  {
    "mode": "electron",
    "run": 10,
    "code": 0,
    "result": "PASS",
    "ms": 20849,
    "log": "electron-10.log"
  },
  {
    "mode": "pacchetto",
    "run": 1,
    "code": 0,
    "result": "PASS",
    "ms": 22015,
    "log": "pacchetto-01.log"
  },
  {
    "mode": "pacchetto",
    "run": 2,
    "code": 0,
    "result": "PASS",
    "ms": 16712,
    "log": "pacchetto-02.log"
  },
  {
    "mode": "pacchetto",
    "run": 3,
    "code": 0,
    "result": "PASS",
    "ms": 16682,
    "log": "pacchetto-03.log"
  },
  {
    "mode": "pacchetto",
    "run": 4,
    "code": 0,
    "result": "PASS",
    "ms": 21722,
    "log": "pacchetto-04.log"
  },
  {
    "mode": "pacchetto",
    "run": 5,
    "code": 0,
    "result": "PASS",
    "ms": 20774,
    "log": "pacchetto-05.log"
  },
  {
    "mode": "pacchetto",
    "run": 6,
    "code": 0,
    "result": "PASS",
    "ms": 18758,
    "log": "pacchetto-06.log"
  },
  {
    "mode": "pacchetto",
    "run": 7,
    "code": 0,
    "result": "PASS",
    "ms": 20714,
    "log": "pacchetto-07.log"
  },
  {
    "mode": "pacchetto",
    "run": 8,
    "code": 0,
    "result": "PASS",
    "ms": 18723,
    "log": "pacchetto-08.log"
  },
  {
    "mode": "pacchetto",
    "run": 9,
    "code": 0,
    "result": "PASS",
    "ms": 23763,
    "log": "pacchetto-09.log"
  },
  {
    "mode": "pacchetto",
    "run": 10,
    "code": 0,
    "result": "PASS",
    "ms": 16721,
    "log": "pacchetto-10.log"
  }
]
```

## 4. Cosa funziona, provato

20/20 debug-smoke riusciti: 10 Electron e 10 pacchetto Windows, senza riavviare la sequenza o nascondere errori. Ogni prova verifica errori renderer/promise/main, notifiche di blocco/crash simulate, assenza del marcatore nel rapporto e nel file locale, menu/impostazioni, clipboard reale, persistenza e svuotamento. 50 eventi nel rapporto sotto 6 KB; buffer sempre limitato a 50. Build, 45 test, browser, schema OOXML, offline e desktop passati.

## 5. Cosa NON funziona o non hai potuto provare

Non provati crash reali del sistema operativo/Chromium, spegnimento improvviso, computer puliti, hardware Mac/Linux, Word/Excel reali. Il main e gli arresti della finestra sono simulati senza interrompere realmente Chromium. Non è verificato un limite massimo del servizio Facebook, che l’app non contatta. Nessuna prova guidata, aggiornamento automatico o Release pubblica viene dichiarata realizzata in questo passo.

## 6. Bug e dubbi

Nessun fallimento nella sequenza 10+10; i fallimenti preparatori precedenti restano documentati nel report 2026-11-22_1203_rapporto-tester.md. La sola CI verde non era stata usata come prova di stabilità: qui sono riportate le esecuzioni consecutive richieste. Restano NU1900 e l’avviso Vite sul chunk grande. La copia XLSX storica resta identica con il difetto MIME autorizzato, senza eccezioni per i nuovi esportati.

## 7. Hash dei commit

- Validatore SDK: 5a493a461f9514c0b954ce3319255509ae906f32.
- Rapporto iniziale: 9e3173e321ce5ac60b224fb1344821a5e29ca8f4.
- Questo consolidamento è il commit contenente docs/report/2026-11-22_1310_controllo-tester-facebook.md; hash ottenibile con git log -1 --format=%H -- docs/report/2026-11-22_1310_controllo-tester-facebook.md. Il proprio hash non può essere inserito nel medesimo commit senza cambiarlo.

## 8. Prossimo passo

Prova guidata con Installazione, Word, Excel, Grafici, PDF, Offline, Ortografia, Segnalazione: soltanto Ok/Problema/Non provato, senza campi liberi, esiti locali e otto righe in cima al rapporto. Seguono aggiornamenti, Mac, Release ordinaria 0.2.2 e bozze di licenza. Nessuna scelta del motore e nessun’altra idea implementata.
