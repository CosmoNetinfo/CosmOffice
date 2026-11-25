# Preparazione della Release pubblica 0.2.3

## 1. Obiettivo

Pubblicare, su richiesta esplicita del titolare del 25 novembre 2026, la Release ordinaria «CosmOffice 0.2.3 (anteprima)», con installer Windows/Linux/Mac, checksum e note sincere. L’autorizzazione revoca il precedente rinvio del tag; non conferma collaudo su PC pulito.

## 2. Cosa hai fatto

- CHANGELOG.md
- README.md
- docs/AGGIORNAMENTI.md
- docs/BUG.md
- docs/CI.md
- docs/DECISIONI.md
- docs/ROADMAP.md
- docs/VALIDATION.md
- tests/release-preview.test.mjs
- docs/report/2026-11-25_1236_prepara-release-023.md e docs/report/ULTIMO.md: copia dello stesso report.

Completata la sezione 0.2.3 del CHANGELOG con data, limiti, prove mancanti, prossimi passi e le quattro domande «Cosa ti aspetti da CosmOffice?». Il generatore esistente richiedeva quella sezione, prima assente per la 0.2.3: aggiunto un test sul numero corrente del package.json, così l’omissione viene scoperta prima della pubblicazione.

README, guida aggiornamenti, decisioni e roadmap distinguono Release pubblica, artefatti di prova e collaudi fisici. Il primo passaggio da 0.2.2 è manuale; anche una build di prova già chiamata 0.2.3 va sostituita manualmente con la Release dello stesso numero. Il feed offre solo numeri superiori. Nessun codice dell’app, motore, workflow, configurazione installer, dipendenza, LICENSE o condizione d’uso cambiato. Avvisi rigenerati senza differenze.

## 3. Esiti reali di build e test

Diciassette comandi eseguiti, tutti exit 0. npm run dist richiama npm run build, icone e avvisi e produce NSIS locale senza pubblicarlo. 73 test unitari passati; browser, SDK, smoke Electron/pacchetto, offline/NetLog, aggiornamenti, licenze e YAML passati. Output reali integrali sotto, ANSI rimossi e percorsi del computer sostituiti. I FAIL SDK sono i controlli negativi attesi e la copia storica immutata, non errori dei nuovi esportati.

### node scripts/notices.mjs — exit 0

```text
Attribuzioni e licenze raccolte.
```

### npm run dist -- --win nsis --x64 — exit 0

```text

> cosmoffice@0.2.3 dist
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --publish never --win nsis --x64


> cosmoffice@0.2.3 build
> node scripts/pdf-assets.mjs && node scripts/legal-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
Licenza e attribuzioni disponibili come file locali per l’anteprima.
vite v8.3.8 building client environment for production...
transforming...
✓ 2416 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.51 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-Cmp-ZIhS.css               47.21 kB │ gzip:  10.82 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-rY2NpnMD.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-BSHHaqIc.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-rKan74uA.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-Brb5dcWk.js         24.10 kB │ gzip:   8.19 kB
dist/assets/MarkdownEditor-DRFsXuKN.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-ByTPASlU.js          203.80 kB │ gzip:  70.76 kB
dist/assets/import-docx-0jbPGvRB.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Inivkjgl.js             2,322.90 kB │ gzip: 696.69 kB

✓ built in 1.13s

> cosmoffice@0.2.3 icons
> node scripts/icons.mjs

Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.
Attribuzioni e licenze raccolte.
  • electron-builder  version=26.18.0 os=10.0.26300
  • loaded configuration  file=<cartella>\electron-builder.config.cjs
  • skipped dependencies rebuild  reason=npmRebuild is set to false
  • packaging       platform=win32 arch=x64 electron=45.4.1 appOutDir=release\win-unpacked
  • downloaded      label=electron progress=100%
  • downloaded electron zip extracted successfully  output=<cartella>\release\win-unpacked
  • searching for node modules  pm=npm searchDir=<cartella>
  • no node modules found in collection, trying next search directory  pm=npm searchDir=<cartella>
  • searching for node modules  pm=traversal searchDir=<cartella>
  • using manual traversal of node_modules to build dependency tree
  • no node modules found in collection, trying next search directory  pm=traversal searchDir=<cartella>
  • no node modules returned while searching directories  searchDirectories=[""]
  • updating asar integrity executable resource  executablePath=release\win-unpacked\CosmOffice.exe
  • no code signing certificate configured, signing is skipped  path=release\win-unpacked\CosmOffice.exe
  • building        target=nsis file=release\CosmOffice-0.2.3-win-x64-Setup.exe archs=x64 oneClick=false perMachine=false
  • no code signing certificate configured, signing is skipped  path=<utente>\AppData\Local\Temp\t-3SZWZO\elevate-staging-1\resources\elevate.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.__uninstaller.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.exe
  • building block map  blockMapFile=release\CosmOffice-0.2.3-win-x64-Setup.exe.blockmap
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (69.6616ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (91.6541ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (125.3813ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (188.4435ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (30.9954ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (43.4716ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (30.7659ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (23.652ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.786ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.9037ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (42.1657ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.3161ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (104.5854ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (77.5675ms)
✔ unknown formulas retain their source without exporting a misleading cached number (19.795ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.5164ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (14.5982ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.5825ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.2329ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.1367ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (155.4569ms)
✔ references, arithmetic, precedence and percentages (5.4231ms)
✔ Italian aliases, absolute references, text and lazy IF (1.3537ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.8104ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.8872ms)
✔ Excel address limits and column naming (1.3576ms)
✔ conditional sums, lookups, text, dates and error handling (4.6045ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.537ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4176ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8191ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5826ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.8719ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.3742ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.9257ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.7603ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (241.744ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (42.2109ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (11.7946ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (127.8121ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (18.8989ms)
✔ Release corrente: note complete per la versione realmente distribuita (6.6823ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (2.3575ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (66.873ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.8114ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (33.0752ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (114.5826ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (30.8678ms)
✔ damaged files and mismatched Office extensions are rejected before import (9.2177ms)
✔ unsupported parts produce specific warnings without changing the original file (36.9024ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.9232ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.0391ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (860.0738ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1825.0007ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.0517ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.2697ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.7039ms)
✔ TLS Node: errore di certificato senza fallback (1.6024ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (25.3262ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.8205ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (129.7278ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (2.7571ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.6844ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (152.938ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.5969ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.0578ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (18.543ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (21.7847ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.9499ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.9373ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (19.6477ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.621ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (29.514ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (5.0305ms)
ℹ tests 73
ℹ suites 0
ℹ pass 73
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3112.8003
```

### npm run test:browser — exit 0

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs

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
12:26:36 [vite] (client) [console.warn] Warning: Indexing all PDF objects
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  Tutti i progetti sono aggiornati per il ripristino.
<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  OpenXmlCheck -> <cartella>\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.

<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
    Avvisi: 2
    Errori: 0

Tempo trascorso 00:00:02.67
PASS <cartella>\test-results\corpus\01-testo-stili.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\02-tabella.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\03-immagine.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\04-elenchi.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\05-intestazioni.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\01-formule.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\02-piu-fogli.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\03-formati.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\04-unioni-immagine.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\05-dati-filtro.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\openxml\smoke.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\openxml\smoke.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\grafici-ui.xlsx: 0 errori Open XML SDK
FAIL <cartella>\test-results\openxml\negative\schema-errato.docx: 1 errori Open XML SDK
{"id":"Sch_InvalidElementContentExpectingComplex","description":"The element has invalid child element \u0027http://schemas.openxmlformats.org/wordprocessingml/2006/main:cosmoInvalido\u0027.","part":"/word/document.xml","path":"/w:document[1]/w:body[1]"}
FAIL <cartella>\test-results\openxml\negative\schema-errato.xlsx: 1 errori Open XML SDK
{"id":"Sch_AttributeValueDataTypeDetailed","description":"The attribute \u0027orientation\u0027 has invalid value \u0027diagonale\u0027. The Enumeration constraint failed.","part":"/xl/worksheets/sheet1.xml","path":"/x:worksheet[1]/x:pageSetup[1]"}
PASS Open XML SDK: 13 esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.
ECCEZIONE STORICA VERIFICATA: copia v1 identica, errore MIME del disegno conservato e segnalato nel report separato. Nessuna eccezione per i nuovi esportati.
FAIL <cartella>\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type.
[Part Uri=/xl/drawings/cosmoDrawing1.xml],
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml],
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
```

### node scripts/markdown-desktop-smoke.mjs — exit 0

```text
Markdown: Home pronta, inizio prove editor
Markdown: salvo 181 caratteri
Markdown: salvo 0 caratteri
Markdown: salvo 317 caratteri
Markdown: salvo 200001 caratteri
PASS Markdown Electron: creazione, modifica, salvataggio nativo, riapertura .md, BOM/CRLF, sorgente ostile conservato senza esecuzione, nessuna richiesta renderer.
```

### node scripts/markdown-desktop-smoke.mjs --package — exit 0

```text
Markdown: Home pronta, inizio prove editor
Markdown: salvo 181 caratteri
Markdown: salvo 0 caratteri
Markdown: salvo 317 caratteri
Markdown: salvo 200001 caratteri
PASS Markdown pacchetto Windows: creazione, modifica, salvataggio nativo, riapertura .md, BOM/CRLF, sorgente ostile conservato senza esecuzione, nessuna richiesta renderer.
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
        "name": "CosmOffice-0.2.2-win-x64-Setup.exe",
        "size": 128031094,
        "sha256": "ce37586a69151fbe56dc555acf2f49f4fc031dfc62cc6e20a3e03c8052c1f69a",
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
        "name": "CosmOffice-0.2.2-win-x64-Setup.exe",
        "size": 128031094,
        "sha256": "ce37586a69151fbe56dc555acf2f49f4fc031dfc62cc6e20a3e03c8052c1f69a",
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
        "THIRD_PARTY_NOTICES.txt": "8e5674f231a242ced415f0bdd5589f8a0abe2960ae0eeefbb8f3946a9ba5d6db"
      },
      "resources": "LICENSE e THIRD_PARTY_NOTICES.txt identici ai sorgenti",
      "asarLicense": true
    }
  ],
  "installed": false
}
```

### node scripts/debug-smoke.mjs — exit 0

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### node scripts/guided-smoke.mjs — exit 0

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

### node test-results/release023/checks.mjs — exit 0

```text
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
PASS motori Office/PDF, diagnostica, prova guidata, aggiornamenti, corpus e LICENSE invariati.
PASS versione 0.2.3, nessun tag, marked 18.3.0 attribuito.
PASS note Release 0.2.3 complete, generabili dal CHANGELOG e passaggio manuale documentato.
```

## 4. Cosa funziona, provato

Note 0.2.3 generabili dal CHANGELOG per i quattro nomi effettivi dei pacchetti. Build NSIS reale, LICENSE e attribuzioni nei file del vero installer, avvio e test di win-unpacked. Apertura/modifica/export dei formati coperti dalle suite e Markdown, conservazione dei sorgenti e della copia storica. Audit Node e NetLog vuoti con aggiornamenti spenti; controllo manuale e download della Release latest effettiva, hash verificato, host estraneo bloccato e spegnimento al termine. Conferma d’installazione provata con spy, senza installare localmente.

CI base 1472135 verificata success: [45600226920](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45600226920), sei lavori verdi. Nel runner NSIS è stato realmente installato/disinstallato con exit 0, finestra/Home e DOCX/XLSX/PDF aperti. Le letture/rendering sono reali, il selettore file è automatizzato.

## 5. Cosa NON funziona o non hai potuto provare

La nuova Release non è ancora pubblicata al momento di questo commit: nessun futuro asset o run dichiarato verde. Dopo push e tag la CI esistente deve costruire e caricare i pacchetti; saranno verificati senza account, inclusi manifesto, sidecar e byte scaricati. Se una piattaforma fallisce, il corpo della Release deve dichiararlo e conservare i pacchetti riusciti.

Non provati: PC Windows fisico pulito, SmartScreen, UAC con antivirus/utente normale, aggiornamento completo fra due versioni pubbliche su PC fisico, vera AppImage in uso e Mac fisico/Gatekeeper. Pacchetti non firmati; non occorrono segreti di firma. Nessuna certificazione di fedeltà Office completa. La licenza necessita ancora di revisione professionale.

## 6. Bug e dubbi

Sezione delle domande mancante, corretta prima del tag e coperta da test. Nessun fallimento nella sequenza locale definitiva. Permangono limiti DOCX/XLSX/PDF/Markdown e avviso Vite sulle dimensioni del bundle, copiati negli output e documentati nelle note. Le vecchie build 0.2.3 non trovano una nuova build con numero uguale: installazione manuale, senza alterare il confronto semantico. Il vecchio tag e gli asset 0.2.2 non vengono sostituiti.

## 7. Hash del commit

Base 1472135c48c2d2e86ccc5deef29b9c68cc887e1f. Hash di questo passo: git log -1 --format=%H -- docs/report/2026-11-25_1236_prepara-release-023.md; comunicato dopo il push. Il tag v0.2.3 punterà al commit di preparazione, senza spostare tag esistenti. La CI di questo commit e quella del tag saranno osservate, non anticipate come riuscite.

## 8. Prossimo passo

Pull --rebase, push main, creazione e push del nuovo tag v0.2.3. Seguire pipeline build e Release, verificare /releases/latest e scaricare anonimamente i quattro installer con confronto SHA-256. Poi rapporto finale dei risultati pubblici e prova del feed dell’app contro la Release nuova; nessuna installazione silenziosa sul computer dell’utente.
