# Report CosmOffice — parte 3: grafici nativi XLSX

## 1. Obiettivo del passo

Creare grafici a barre, linee e torta dagli intervalli di CosmoGrid, mantenerli collegati ai dati e conservarli nell'XLSX. Impedire la perdita silenziosa dei grafici importati non gestibili.

Prerequisiti completati: parte 1 con tutti i lavori CI verdi; parte 2 pubblicata in fbb6e67b94f14623b77e2e9b999035a2d3b6163c con tutti i cinque lavori verdi nella run https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44960626738 .

## 2. Cosa hai fatto

- src/charts.mjs: modelli e dati dei grafici, OOXML nativo, relazioni e disegni condivisi con le immagini; categorie personalizzate in un foglio tecnico veryHidden, metadati verificati alla riapertura. Grafici esterni non riconosciuti in sola lettura e originale conservato.
- src/GridCharts.jsx: barre, linee, torta, pannello titolo/etichette/serie/assi/legenda, tabella dei dati accessibile.
- src/GridEditor.jsx, src/workbooks.mjs: creazione da selezione, aggiornamento dopo modifiche, salvataggio anche nelle bozze, annulla/ripristina, rinomina/duplica/elimina foglio; blocco delle modifiche e dell'export per grafici esterni non riconosciuti.
- src/App.jsx, src/office-inspection.mjs, src/styles.css: messaggi italiani corretti e pannello grafici adattabile.
- package.json e package-lock.json: Chart.js 4.5.1 MIT per il rendering locale, scelto perché permette di includere soltanto i tre tipi necessari e relativi componenti; circa 70 KB gzip il modulo Grid completo nella build locale. @xmldom/xmldom 0.9.12 MIT per modificare XML con namespace in modo strutturato, senza sostituzioni testuali fragili. JSZip era già presente. Nessun servizio esterno o CDN.
- scripts/notices.mjs già raccoglie le licenze delle nuove dipendenze; THIRD_PARTY_NOTICES.txt rigenerato. Il lessico italiano della parte 2 resta incluso con attribuzione CC BY-SA 2.0.
- tests/charts.test.mjs: round trip, più serie, formule, immagini, tabelle, ordine OOXML, titoli con caratteri speciali e guardia contro perdita dei grafici esterni.
- scripts/charts-smoke.mjs: creazione dei tre grafici nell'interfaccia, modifica, export, riapertura bozza e file, prova negativa dei grafici esterni. Aggiunto a npm run test:browser.
- scripts/charts-interop.mjs e .github/workflows/build.yml: LibreOffice XLSX → ODS → XLSX e PDF, confronto di grafici, valori, categorie, nomi serie, titoli, assi e legenda anche in CI.
- scripts/charts-desktop-check.mjs, scripts/desktop-smoke.mjs, scripts/offline-smoke.mjs: prove grafici nel pacchetto Windows e nell'Electron con NetLog attivo.
- README.md, docs/BUG.md, questo report e docs/report/ULTIMO.md: istruzioni, bug riprodotti e limiti espliciti.

## 3. Risultato di build e test

Sequenza finale a sorgenti applicativi fermi: tutti i comandi seguenti terminati con codice 0. Esiti reali, senza sostituire gli avvisi con una descrizione generica.

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
dist/assets/PdfViewer-D-Rba5BH.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-DzuMz7TE.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-BEv3ap87.js          203.05 kB │ gzip:  70.48 kB
dist/assets/import-docx-DQAi6B3O.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Du0-VHjk.js             2,319.77 kB │ gzip: 695.45 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.12s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (124.5861ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (26.9596ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (35.9728ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (23.0657ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (23.1741ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (99.2042ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (76.8291ms)
✔ unknown formulas retain their source without exporting a misleading cached number (11.4471ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.7601ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (11.3798ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (16.5939ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.4576ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.9194ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (153.5831ms)
✔ references, arithmetic, precedence and percentages (3.6435ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7496ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.6369ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.5217ms)
✔ Excel address limits and column naming (0.9906ms)
✔ conditional sums, lookups, text, dates and error handling (4.5337ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5025ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.3564ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7102ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.777ms)
✔ Il processo principale non contiene updater o caricamenti da server (7.6332ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (195.8439ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (34.4197ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (8.6158ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (78.3983ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (18.164ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (103.2352ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (32.7828ms)
✔ damaged files and mismatched Office extensions are rejected before import (8.7721ms)
✔ unsupported parts produce specific warnings without changing the original file (44.8405ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (15.3791ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.9844ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (710.2875ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1775.0369ms)
ℹ tests 38
ℹ suites 0
ℹ pass 38
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2732.853
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
08:00:03 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795330896235\ods\grafici-ui.ods using filter : calc8
convert V:\CosmonetOffice\test-results\charts-interop-1795330896235\ods\grafici-ui.ods as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795330896235\xlsx\grafici-ui.xlsx using filter : Calc Office Open XML
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795330896235\xlsx\grafici-ui.pdf using filter : calc_pdf_Export
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
  "output": "V:\\CosmonetOffice\\test-results\\charts-interop-1795330896235",
  "limits": "Microsoft Excel non eseguito. I file riscritti da LibreOffice vengono aperti in sola lettura da CosmOffice per conservarne i grafici."
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
dist/assets/PdfViewer-D-Rba5BH.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-DzuMz7TE.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-BEv3ap87.js          203.05 kB │ gzip:  70.48 kB
dist/assets/import-docx-DQAi6B3O.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Du0-VHjk.js             2,319.77 kB │ gzip: 695.45 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.10s

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

### Fallimento precedente, non nascosto

La prima sequenza completa è stata interrotta: una mia modifica del codice durante la suite browser ha provocato il reload di Vite. Nessun push è stato fatto con quel risultato. Di seguito l'estratto reale; successivamente è stata ripetuta tutta la sequenza, con gli esiti verdi sopra.

```text
07:57:41 [vite] (client) page reload src/charts.mjs
07:57:44 [vite] (client) hmr update /src/App.jsx
FAIL 01-formule.xlsx: locator.press: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Cella J10', exact: true })

PASS 02-piu-fogli.xlsx
PASS 03-formati.xlsx
PASS 04-unioni-immagine.xlsx
PASS 05-dati-filtro.xlsx
PASS 01-testo.pdf
PASS 02-scansione.pdf
PASS 03-venti-pagine.pdf
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: tutti i 13 file selezionati del corpus; diagnostica:

12 !== 13

    at file:///V:/CosmonetOffice/scripts/corpus-smoke.mjs:190:10 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 12,
  expected: 13,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.13.1
```

## 4. Cosa funziona, provato davvero

- Tre grafici creati da A1:B3 nell'interfaccia. B2 modificata da 10 a 37: tutti e tre aggiornati. Titolo, etichette personalizzate, nomi delle serie, assi e legenda modificati.
- Grafici presenti dopo riapertura della bozza al ricaricamento della pagina e dopo export/riapertura dell'XLSX. Il file contiene tre oggetti grafico nativi, non immagini dei grafici.
- LibreOffice conserva tre grafici nativi dopo XLSX → ODS → XLSX: valori [37,20], categorie, nomi serie, titoli, assi e legenda confrontati automaticamente. Prodotto anche un PDF. Verifica visiva dell'interfaccia e della prima pagina PDF tramite Poppler; il limite di stampa è indicato sotto.
- Nel pacchetto Windows, il nuovo helper charts-desktop-check modifica B2 a 91, salva grafici-desktop.xlsx, confronta i valori dei tre grafici e riapre il file nell'app. Tutte le asserzioni passate.
- Grafici importati privi di metadati verificabili: avviso, celle in sola lettura, nessun file esportato. Anche il file riscritto da LibreOffice attiva la protezione. Il core conserva una copia esatta dei byte originali per gli snapshot.
- 38 test del motore passati; corpus originale di 13 file passato. Ortografia italiana e parole personali restano funzionanti nei due editor. Offline-smoke include apertura e modifica dei grafici: nessuna richiesta remota nel NetLog e nessun tentativo spontaneo nel main.

## 5. Cosa NON funziona o non hai potuto provare

- Non provato: Microsoft Excel reale e file creati direttamente da sue versioni specifiche. Sono scritti oggetti OOXML standard e verificati con LibreOffice, ma non dichiaro una certificazione Excel.
- Grafici esterni, o riscritti da Excel/LibreOffice, che non corrispondono esattamente ai metadati CosmOffice non sono modificabili: intera cartella in sola lettura, export bloccato. Restano disponibili l'originale e la bozza con i byte originali. Il supporto completo alla loro modifica resta da implementare.
- Niente grafici 3D, combinati, pivot, assi secondari o selezioni disgiunte. Limiti: 100 grafici, 20 serie, 10.000 celle per intervallo. La torta usa la prima serie numerica. Celle vuote, testo ed errori non diventano numeri inventati: restano senza valore.
- Disposizione e colori del lettore esterno possono differire dal pannello CosmOffice. I grafici XLSX sono ancorati sotto i dati. La stampa/PDF predefinita di LibreOffice divide il campione su 4 pagine, spezzando i grafici: adattamento alla pagina non implementato (CHART-002).
- Non provato: installazione su macchine fisiche pulite Linux/macOS, cartelle enormi e tutte le varianti avanzate di grafici. Restano gli altri limiti Word/Excel/PDF nel README.
- La CI del nuovo commit può essere verificata solo dopo il push: la conclusione finale viene comunicata nella risposta conclusiva. I risultati riportati qui sono quelli locali e la CI verde della base citata sopra.

## 6. Bug noti o dubbi

- DAT-010: rischio di eliminazione dei grafici da parte di ExcelJS. Introdotta guardia sul core e nell'editor; salvataggio delle bozze supportate passa dallo stesso serializzatore dei grafici.
- CHART-001: il primo confronto LibreOffice ha mostrato perdita reale delle categorie personalizzate espresse come c:strLit. Corretto usando celle reali in un foglio tecnico veryHidden; confronto finale passato.
- CHART-002: stampa multipagina del lettore indipendente non adattata automaticamente, rimane aperto.
- Durante la costruzione dei test: bridge simulato incompleto, controllo troppo anticipato della riapertura, conteggio salvataggi azzerato dal reload, conteggio iniziale dei file stile/colore come grafici. Corretti i test mantenendo il confronto dei dati e degli oggetti nativi. Nessuna eccezione al controllo rete.
- QA-005: reload provocato dal lavoro concorrente sui sorgenti; sequenza completa ripetuta a sorgenti fermi. Restano l'avviso dimensione bundle e pacchetti di anteprima non firmati.

## 7. Hash del commit

Base verificata in CI: fbb6e67b94f14623b77e2e9b999035a2d3b6163c. Codice e report vengono pubblicati insieme in un unico commit della parte 3. Un file non può contenere l'hash del proprio commit senza modificarlo: l'hash effettivo si trova nella cronologia di questo file e nella risposta finale.

## 8. Prossimo passo consigliato

Verificare il commit pubblicato su GitHub Actions, quindi provare file reali in Microsoft Excel e ampliare i casi indipendenti. In seguito supportare la modifica dei grafici esterni senza perdere parti, e migliorare l'impaginazione di stampa dei grafici.
