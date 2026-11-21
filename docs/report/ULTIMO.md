# Report CosmOffice — parte 1: CI

## 1. Obiettivo del passo

Verificare tutti i lavori dell'ultimo commit su main prima di procedere con dizionari e grafici.

## 2. Cosa hai fatto

- Verificata la run GitHub Actions 44955609508 del commit 82b1d5a70d9169ed064b065547f59d38203ee434: checks, interop e tutti e tre i lavori desktop risultano completed/success.
- Creato questo report e aggiornata la copia docs/report/ULTIMO.md. Nessuna modifica applicativa in questa parte.

## 3. Risultato di build e test

CI: https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44955609508

Di seguito gli esiti reali locali. Tutti i comandi sono terminati con codice 0.

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
✓ built in 3.09s
[PLUGIN_TIMINGS] JavaScript callbacks ran for 2.2s of this 3.1s build (71%).
The slowest callbacks, timed inside each callback (the wait before a callback starts is excluded, the time it awaits is included):
  - plugin vite:prepare-out-dir renderStart (68%, 2.1s, 1 call)
Additional callback time came from callbacks under 1s.
See https://rolldown.rs/reference/InputOptions.checks#bundlertimings for more details.
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ DOCX exports real text, bold marks and tables readable by another parser (78.4115ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (60.8176ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.8347ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (5.3036ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (10.0188ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.9924ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.1584ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.1823ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (118.186ms)
✔ references, arithmetic, precedence and percentages (3.6015ms)
✔ Italian aliases, absolute references, text and lazy IF (1.1376ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7763ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6263ms)
✔ Excel address limits and column naming (1.1334ms)
✔ conditional sums, lookups, text, dates and error handling (3.0859ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5595ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.3925ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.6571ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5108ms)
✔ Il processo principale non contiene updater o caricamenti da server (5.0774ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (149.8717ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (28.1902ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (7.7835ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (84.297ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (15.6073ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (80.8607ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (21.6901ms)
✔ damaged files and mismatched Office extensions are rejected before import (6.2414ms)
✔ unsupported parts produce specific warnings without changing the original file (37.5629ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (12.6268ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (9.0243ms)
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1187.7252
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
23:33:48 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

## 4. Cosa funziona, provato davvero

Tutti i cinque lavori CI sono verdi. Suite locale completa passata, inclusi 13 campioni di documenti, salvataggio e riapertura PDF ruotato, controllo Poppler e assenza di rete nei percorsi provati del processo principale.

## 5. Cosa NON funziona o non hai potuto provare

- Dizionario italiano incorporato e grafici non ancora implementati: sono le parti successive, non fanno parte del risultato di questo passo.
- Non provato: installazione su computer fisici Linux/macOS e Microsoft Office reale. Il confezionamento multipiattaforma in CI non sostituisce queste prove.

## 6. Bug noti o dubbi

Restano i limiti in docs/BUG.md e README.md. Nessun lavoro CI rosso nell'ultima run controllata. Avvisi di dimensione bundle presenti nella build.

## 7. Hash del commit

Commit controllato: 82b1d5a70d9169ed064b065547f59d38203ee434. Questo passo produce un unico commit documentale; il suo hash finale si trova nella cronologia Git del presente file, evitando un hash autoreferenziale impossibile.

## 8. Prossimo passo consigliato

Incorporare un dizionario italiano con licenza e provenienza verificate e un controllo interamente locale per entrambi gli editor, mantenendo disabilitati i download Hunspell nativi.
