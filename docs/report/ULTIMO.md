# CI Android: avvisi ANR esterni all’app

## 1. Obiettivo

Sbloccare le prove reali necessarie prima della Release Android, senza nascondere errori dell’app.

## 2. Cosa hai fatto

- Controllati log e catture di entrambi i tentativi di https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46125501778, commit e51661670724433d3a4580d827e7ae04df08f7c9. Tentativo 1: avviso Pixel Launcher sopra il selettore DOCX. Tentativo 2: avviso Messages sopra il selettore XLSX, dopo DOCX passato. Artifact ZIP verificati con SHA-256 b7f21e90e5650ab8835803c8a4e164dec4911914980d3b3bda8101868167d1e9 e 109d5f8d7c3ad5e73ffec867bc82de65fc1bb934b5fd96a6800763e86e2ec26f; catture native aperte e lette, senza confonderle con gli asset grafici.
- Solo SmokeInstrumentation e UpdateInstallInstrumentation: sul solo hardware emulato ranchu/goldfish, riconoscono il dialogo di sistema android con i due titoli esatti «Pixel Launcher isn't responding» e «Messages isn't responding». Premono Close app, registrano il titolo fisso negli esiti e continuano ad aspettare il vero selettore/installatore. Massimo quattro per processo, poi fallimento. Non chiudono ANR di CosmOffice, DocumentsUI o sconosciuti. Nessuna asserzione dei documenti/installazione/rete rimossa.
- CHANGELOG, BUG, CI, VALIDATION, report e ULTIMO aggiornati. Nessuna modifica al runtime, agli asset o alla versione/firma dell’APK. Nessuna dipendenza, motore, licenza o Release pubblica modificata.

## 3. Esiti reali di build e test

CI desktop e516616: https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46125501770, sei lavori completed/success, anche installazione NSIS reale nel runner. Android ancora rossa nei due tentativi documentati; nuova prova solo dopo il push.

Timeout locale precedente Markdown: il pulsante Nuovo Markdown non è comparso entro 30 secondi. Riproduzione separata con diagnostica di pagina/console passata, poi intera suite passata senza cambiare asserzioni o codice Markdown. La causa del timeout non è accertata: non viene attribuita arbitrariamente al computer o a un difetto corretto.

### Primo browser finale fallito — exit 1

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs && node scripts/android-browser-smoke.mjs

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
09:24:52 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
PASS Informazioni browser: versione 0.2.3, testi uguali ai file locali, attribuzioni, migrazione vecchio attivo e nessuna richiesta esterna.
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: 'Nuovo Markdown' })[22m

    at checkMarkdown (V:\CosmonetOffice\scripts\markdown-check.mjs:4:62)
    at V:\CosmonetOffice\scripts\markdown-smoke.mjs:26:9 {
  log: [ "  - waiting for getByRole('button', { name: 'Nuovo Markdown' })" ],
  name: 'TimeoutError'
}

Node.js v26.13.1
```

Riproduzione diagnostica — exit 0:

```text
PASS Markdown browser: creazione, apertura UTF-8/BOM/CRLF, modifica, export identico, riapertura dopo ricarica, backup, vuoto, HTML ostile, file grande, 390px, nessuna rete esterna.
```

### node scripts/notices.mjs — exit 0

```text
Attribuzioni e licenze raccolte.
```

### npm run build — exit 0

```text

> cosmoffice@0.2.3 build
> node scripts/pdf-assets.mjs && node scripts/legal-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
Licenza e attribuzioni disponibili come file locali per l’anteprima.
vite v8.3.8 building client environment for production...
transforming...
✓ 2417 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.09 kB │ gzip:   0.53 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-Cmp-ZIhS.css               47.21 kB │ gzip:  10.82 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-BbtcNglp.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-1eY_n1gJ.js            2.31 kB │ gzip:   1.05 kB
dist/assets/android-CdRxfKpw.js               2.52 kB │ gzip:   1.21 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-DNZPJU-7.js            11.03 kB │ gzip:   4.23 kB
dist/assets/SettingsPage-B4gigDOI.js         27.03 kB │ gzip:   8.96 kB
dist/assets/MarkdownEditor-3HgGdhT9.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-DMccLee0.js          203.80 kB │ gzip:  70.76 kB
dist/assets/import-docx-s2L4lFoO.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-BijVdz4n.js             2,324.72 kB │ gzip: 697.43 kB

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.53s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Release Android: manifest coerente, stesso package e chiave, URL solo progetto (1.1867ms)
✔ Release Android: note derivate dal solo CHANGELOG, complete e senza confondere desktop (0.6671ms)
✔ Compatibilità Android: Promise assente, risoluzione/rifiuto e sottoclassi (2.675ms)
✔ Compatibilità Android: API esistente preservata, installazione idempotente (1.0474ms)
✔ Compatibilità Android: costruttori non validi rifiutati (2.4464ms)
✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (12.9876ms)
✔ Android: soli permessi di rete aggiornamenti e installazione confermata, nessuno storage esteso (7.2191ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (85.7241ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (89.7172ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (144.8552ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (209.9069ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (29.73ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (32.7094ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (26.494ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (24.8133ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.8472ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7633ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (45.9213ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (3.2398ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (122.5093ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (105.3941ms)
✔ unknown formulas retain their source without exporting a misleading cached number (19.6395ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.5852ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (18.4289ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (11.2238ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.7603ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.6524ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (208.41ms)
✔ references, arithmetic, precedence and percentages (4.3024ms)
✔ Italian aliases, absolute references, text and lazy IF (1.4511ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.9027ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.3287ms)
✔ Excel address limits and column naming (1.5705ms)
✔ conditional sums, lookups, text, dates and error handling (3.9289ms)
✔ quoted sheet names, absolute references and cycles across sheets (1.6013ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.6184ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9482ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6189ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.6528ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.0233ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.7791ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.8427ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (252.8776ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (40.025ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (8.0864ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (116.7285ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (16.7443ms)
✔ Release corrente: note complete per la versione realmente distribuita (7.2083ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.2543ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (63.4354ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.1319ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (44.818ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (157.8531ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (45.1168ms)
✔ damaged files and mismatched Office extensions are rejected before import (11.902ms)
✔ unsupported parts produce specific warnings without changing the original file (37.9334ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.4134ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (14.1676ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (811.9256ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1853.2839ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (4.9657ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (7.4495ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.9394ms)
✔ TLS Node: errore di certificato senza fallback (2.036ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (17.5689ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.0564ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (134.444ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.4245ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.7639ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (150.4656ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.1783ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.498ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (16.8294ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (21.2981ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (4.7926ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.4845ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (23.8702ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.5727ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (22.8162ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.5681ms)
ℹ tests 80
ℹ suites 0
ℹ pass 80
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3600.5195
```

### npm run test:browser — exit 0

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs && node scripts/android-browser-smoke.mjs

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
14:08:20 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
PASS Informazioni browser: versione 0.2.3, testi uguali ai file locali, attribuzioni, migrazione vecchio attivo e nessuna richiesta esterna.
PASS Markdown browser: creazione, apertura UTF-8/BOM/CRLF, modifica, export identico, riapertura dopo ricarica, backup, vuoto, HTML ostile, file grande, 390px, nessuna rete esterna.
14:10:17 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
  Tutti i progetti sono aggiornati per il ripristino.
  OpenXmlCheck -> V:\CosmonetOffice\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.
    Avvisi: 0
    Errori: 0

Tempo trascorso 00:00:04.80
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

### node scripts/debug-smoke.mjs — exit 0

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### node scripts/guided-smoke.mjs — exit 0

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

### node scripts/update-network-smoke.mjs — exit 0

```text
{
  "result": "PASS",
  "package": false,
  "reports": [
    {
      "legacy": false,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": true,
      "cancelled": true,
      "networkOffAfterwards": true,
      "downloaded": {
        "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
        "size": 128054418,
        "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
        "integrity": true,
        "installed": false
      },
      "nodeAudit": [
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "blocked",
          "host": "example.invalid"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        }
      ]
    },
    {
      "legacy": true,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": false,
      "cancelled": false,
      "networkOffAfterwards": true,
      "downloaded": null,
      "nodeAudit": []
    }
  ]
}
```

### node scripts/offline-smoke.mjs — exit 0

```text
{
  "result": "PASS",
  "checks": [
    "Avvio Electron da file locale",
    "Nessun tentativo spontaneo di rete dal processo principale",
    "Controllo aggiornamenti spento: zero richieste nell’audit Node",
    "DOCX, XLSX e PDF aperti senza connessioni",
    "Richiesta intenzionale dal main rilevata e bloccata prima della connessione",
    "NetLog Chromium: nessuna connessione TCP, UDP, QUIC o transazione DNS"
  ],
  "errors": []
}
```

### node scripts/legal-smoke.mjs --package — exit 0

```text
PASS Informazioni pacchetto: file locali identici, attribuzioni, percorso arbitrario respinto e zero richieste Node.
```

### node scripts/package-resources-check.mjs — exit 0

```text
{
  "result": "PASS",
  "checked": [
    {
      "package": "CosmOffice-0.2.3-win-x64-Setup.exe",
      "version": "0.2.3",
      "hashes": {
        "LICENSE": "f2649c4c63c51b60799de533efbc3c09a71639df963f677492bbe5e865f9006f",
        "THIRD_PARTY_NOTICES.txt": "d743f96b9aeb6e6281f4d4bad5bc8787c3c275787cdc7e34467ba5fbece19678"
      },
      "resources": "LICENSE e THIRD_PARTY_NOTICES.txt identici ai sorgenti",
      "asarLicense": true
    }
  ],
  "installed": false
}
```

### node test-results/android/yaml-check.mjs — exit 0

```text
PASS YAML: android.yml
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
```

### node --check scripts/android-smoke.mjs — exit 0

```text

```

### node scripts/update-network-smoke.mjs --package — exit 0

```text
{
  "result": "PASS",
  "package": true,
  "reports": [
    {
      "legacy": false,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": true,
      "cancelled": true,
      "networkOffAfterwards": true,
      "downloaded": {
        "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
        "size": 128054418,
        "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
        "integrity": true,
        "installed": false
      },
      "nodeAudit": [
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "blocked",
          "host": "example.invalid"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        }
      ]
    },
    {
      "legacy": true,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": false,
      "cancelled": false,
      "networkOffAfterwards": true,
      "downloaded": null,
      "nodeAudit": []
    }
  ]
}
```

### node scripts/update-confirm-smoke.mjs — exit 0

```text
PASS consenso nel pacchetto Windows: Annulla non installa; chiusura normale non installa; conferma esplicita salva e chiude, ricontrolla SHA-256 e avvia solo lo spy interattivo. Nessun installer eseguito.
```

### node scripts/desktop-smoke.mjs — exit 0

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

### updates-gradle-fixture.log — exit 0

```text
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build 
Checking the license for package Android SDK Platform-Tools in V:\CosmonetOffice\test-results\android\tools\sdk\licenses
Warning: License for package Android SDK Platform-Tools not accepted.
WARNING: platform-tools package is not installed. Please accept the installation licence to continue
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig
> Task :app:javaPreCompileDebug UP-TO-DATE
> Task :app:checkDebugAarMetadata UP-TO-DATE
> Task :app:processDebugNavigationResources UP-TO-DATE
> Task :app:compileDebugNavigationResources UP-TO-DATE
> Task :app:generateDebugResValues UP-TO-DATE
> Task :app:mapDebugSourceSetPaths UP-TO-DATE
> Task :app:generateDebugResources UP-TO-DATE
> Task :app:mergeDebugResources UP-TO-DATE
> Task :app:packageDebugResources UP-TO-DATE
> Task :app:parseDebugLocalResources UP-TO-DATE
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug UP-TO-DATE
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders UP-TO-DATE
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets UP-TO-DATE
> Task :app:compressDebugAssets UP-TO-DATE
> Task :app:desugarDebugFileDependencies UP-TO-DATE
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:mergeDebugJavaResource UP-TO-DATE
> Task :app:checkDebugDuplicateClasses UP-TO-DATE
> Task :app:mergeExtDexDebug UP-TO-DATE
> Task :app:mergeLibDexDebug UP-TO-DATE
> Task :app:mergeDebugJniLibFolders UP-TO-DATE
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:validateSigningDebug UP-TO-DATE
> Task :app:writeDebugAppMetadata UP-TO-DATE
> Task :app:writeDebugSigningConfigVersions UP-TO-DATE
> Task :app:processDebugManifestForPackage
> Task :app:processDebugResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics UP-TO-DATE
> Task :app:mergeProjectDexDebug
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug

[Incubating] Problems report is available at: file:///V:/CosmonetOffice/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 12s
35 actionable tasks: 11 executed, 24 up-to-date
Note: V:\CosmonetOffice\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### updates-gradle-app.log — exit 0

```text
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build 
Checking the license for package Android SDK Platform-Tools in V:\CosmonetOffice\test-results\android\tools\sdk\licenses
Warning: License for package Android SDK Platform-Tools not accepted.
WARNING: platform-tools package is not installed. Please accept the installation licence to continue
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig
> Task :app:javaPreCompileDebug UP-TO-DATE
> Task :app:checkDebugAarMetadata UP-TO-DATE
> Task :app:processDebugNavigationResources UP-TO-DATE
> Task :app:compileDebugNavigationResources UP-TO-DATE
> Task :app:generateDebugResValues UP-TO-DATE
> Task :app:mapDebugSourceSetPaths UP-TO-DATE
> Task :app:generateDebugResources UP-TO-DATE
> Task :app:mergeDebugResources UP-TO-DATE
> Task :app:packageDebugResources UP-TO-DATE
> Task :app:parseDebugLocalResources UP-TO-DATE
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug UP-TO-DATE
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders UP-TO-DATE
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets UP-TO-DATE
> Task :app:compressDebugAssets UP-TO-DATE
> Task :app:desugarDebugFileDependencies UP-TO-DATE
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:mergeDebugJavaResource UP-TO-DATE
> Task :app:checkDebugDuplicateClasses UP-TO-DATE
> Task :app:mergeExtDexDebug UP-TO-DATE
> Task :app:mergeLibDexDebug UP-TO-DATE
> Task :app:mergeDebugJniLibFolders UP-TO-DATE
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:validateSigningDebug UP-TO-DATE
> Task :app:writeDebugAppMetadata UP-TO-DATE
> Task :app:writeDebugSigningConfigVersions UP-TO-DATE
> Task :app:preDebugAndroidTestBuild SKIPPED
> Task :app:processDebugAndroidTestManifest UP-TO-DATE
> Task :app:generateDebugAndroidTestBuildConfig UP-TO-DATE
> Task :app:javaPreCompileDebugAndroidTest UP-TO-DATE
> Task :app:checkDebugAndroidTestAarMetadata UP-TO-DATE
> Task :app:processDebugAndroidTestNavigationResources UP-TO-DATE
> Task :app:compileDebugAndroidTestNavigationResources UP-TO-DATE
> Task :app:generateDebugAndroidTestResValues UP-TO-DATE
> Task :app:mapDebugAndroidTestSourceSetPaths UP-TO-DATE
> Task :app:generateDebugAndroidTestResources UP-TO-DATE
> Task :app:mergeDebugAndroidTestResources UP-TO-DATE
> Task :app:processDebugAndroidTestResources UP-TO-DATE
> Task :app:mergeDebugAndroidTestShaders UP-TO-DATE
> Task :app:compileDebugAndroidTestShaders NO-SOURCE
> Task :app:generateDebugAndroidTestAssets UP-TO-DATE
> Task :app:mergeDebugAndroidTestAssets UP-TO-DATE
> Task :app:compressDebugAndroidTestAssets UP-TO-DATE
> Task :app:desugarDebugAndroidTestFileDependencies UP-TO-DATE
> Task :app:processDebugAndroidTestJavaRes NO-SOURCE
> Task :app:mergeDebugAndroidTestJavaResource UP-TO-DATE
> Task :app:checkDebugAndroidTestDuplicateClasses UP-TO-DATE
> Task :app:mergeExtDexDebugAndroidTest UP-TO-DATE
> Task :app:mergeLibDexDebugAndroidTest UP-TO-DATE
> Task :app:mergeDebugAndroidTestJniLibFolders UP-TO-DATE
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:validateSigningDebugAndroidTest UP-TO-DATE
> Task :app:writeDebugAndroidTestSigningConfigVersions UP-TO-DATE
> Task :app:preReleaseBuild UP-TO-DATE
> Task :app:mergeReleaseJniLibFolders UP-TO-DATE
> Task :app:mergeReleaseNativeLibs NO-SOURCE
> Task :app:stripReleaseDebugSymbols NO-SOURCE
> Task :app:extractReleaseNativeSymbolTables NO-SOURCE
> Task :app:mergeReleaseNativeDebugMetadata NO-SOURCE
> Task :app:checkReleaseDuplicateClasses UP-TO-DATE
> Task :app:generateReleaseBuildConfig UP-TO-DATE
> Task :app:javaPreCompileRelease UP-TO-DATE
> Task :app:checkReleaseAarMetadata UP-TO-DATE
> Task :app:processReleaseNavigationResources UP-TO-DATE
> Task :app:compileReleaseNavigationResources UP-TO-DATE
> Task :app:generateReleaseResValues UP-TO-DATE
> Task :app:mapReleaseSourceSetPaths UP-TO-DATE
> Task :app:generateReleaseResources UP-TO-DATE
> Task :app:mergeReleaseResources UP-TO-DATE
> Task :app:packageReleaseResources UP-TO-DATE
> Task :app:parseReleaseLocalResources UP-TO-DATE
> Task :app:createReleaseCompatibleScreenManifests UP-TO-DATE
> Task :app:extractDeepLinksRelease UP-TO-DATE
> Task :app:processReleaseMainManifest UP-TO-DATE
> Task :app:processReleaseManifest UP-TO-DATE
> Task :app:processReleaseManifestForPackage UP-TO-DATE
> Task :app:processReleaseResources UP-TO-DATE
> Task :app:compileReleaseJavaWithJavac UP-TO-DATE
> Task :app:dexBuilderRelease UP-TO-DATE
> Task :app:desugarReleaseFileDependencies UP-TO-DATE
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
> Task :app:mergeExtDexRelease UP-TO-DATE
> Task :app:mergeDexRelease UP-TO-DATE
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseGlobalSynthetics UP-TO-DATE
> Task :app:compileReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseShaders UP-TO-DATE
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:mergeReleaseAssets UP-TO-DATE
> Task :app:compressReleaseAssets UP-TO-DATE
> Task :app:extractReleaseVersionControlInfo UP-TO-DATE
> Task :app:extractProguardFiles UP-TO-DATE
> Task :app:generateReleaseLintVitalReportModel UP-TO-DATE
> Task :app:lintVitalAnalyzeRelease UP-TO-DATE
> Task :app:lintVitalReportRelease UP-TO-DATE
> Task :app:lintVitalRelease
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:mergeReleaseJavaResource UP-TO-DATE
> Task :app:optimizeReleaseResources UP-TO-DATE
> Task :app:collectReleaseDependencies UP-TO-DATE
> Task :app:sdkReleaseDependencyData UP-TO-DATE
> Task :app:writeReleaseAppMetadata UP-TO-DATE
> Task :app:writeReleaseSigningConfigVersions UP-TO-DATE
> Task :app:packageRelease UP-TO-DATE
> Task :app:createReleaseApkListingFileRedirect UP-TO-DATE
> Task :app:assembleRelease UP-TO-DATE
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:processDebugManifestForPackage
> Task :app:processDebugResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics UP-TO-DATE
> Task :app:bundleDebugClassesToCompileJar UP-TO-DATE
> Task :app:compileDebugAndroidTestJavaWithJavac UP-TO-DATE
> Task :app:dexBuilderDebugAndroidTest UP-TO-DATE
> Task :app:mergeDebugAndroidTestGlobalSynthetics UP-TO-DATE
> Task :app:mergeProjectDexDebugAndroidTest UP-TO-DATE
> Task :app:packageDebugAndroidTest UP-TO-DATE
> Task :app:createDebugAndroidTestApkListingFileRedirect UP-TO-DATE
> Task :app:assembleDebugAndroidTest UP-TO-DATE
> Task :app:generateDebugAndroidTestLintModel UP-TO-DATE
> Task :app:generateDebugLintReportModel UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel UP-TO-DATE
> Task :app:lintAnalyzeDebug UP-TO-DATE
> Task :app:lintAnalyzeDebugAndroidTest UP-TO-DATE
> Task :app:lintAnalyzeDebugUnitTest UP-TO-DATE
> Task :app:lintReportDebug UP-TO-DATE
> Task :app:lintDebug
> Task :app:mergeProjectDexDebug
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug

[Incubating] Problems report is available at: file:///V:/CosmonetOffice/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 13s
117 actionable tasks: 13 executed, 104 up-to-date
Note: V:\CosmonetOffice\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

## 4. Cosa funziona, provato

Sedici controlli locali verdi, 80 unitari, Gradle debug/test/release/lint; desktop CI con sei success. Prima CI 6bcefd6 aveva nove casi Android passati; questo non prova le nuove fasi d’installazione e rete reale, ancora non raggiunte nei tentativi e516616.

## 5. Cosa NON funziona o non hai potuto provare

Release APK ancora non pubblicata. CI Android non ancora verde con tutte le nuove fasi. Nessun telefono fisico, aggiornamento firmato di distribuzione, varianti produttore, tastiera/gesti, conferma PDF sul telefono segnalato. AND-014 catture con frame precedente resta aperto. Timer solo in primo piano, non background/app chiusa.

## 6. Bug e dubbi

Instabilità dell’immagine Google APIs API 35 confermata nelle due catture; recupero limitato e tracciato nel solo test, da verificare in CI. Un ANR dell’app o del selettore resta un errore. Timeout Markdown non riprodotto e causa sconosciuta, conservato sopra. Nessuna fonte esterna nuova: log, catture e nostro codice di test.

## 7. Hash del commit

Implementazione 6bcefd6f00ce4d8bca8b393ef24c2c6c8988a416; correzione runner e51661670724433d3a4580d827e7ae04df08f7c9. Hash di questo passo ricavabile con git log -1 --format=%H -- docs/report/2026-11-28_1414_android-anr-emulatore.md e registrato nell’audit successivo.

## 8. Prossimo passo

Nuova CI, fino a vera installazione con consenso, bozze conservate e controllo live. Dopo verde, firma dello stesso payload CI e pubblicazione separata con checksum, download anonimi e latest desktop invariato.
