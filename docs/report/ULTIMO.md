# File Markdown offline in CosmoWrite — 25 novembre 2026

## 1. Obiettivo

Leggere e creare file .md su richiesta del titolare, preservare il sorgente e verificare apertura/modifica/salvataggio senza servizi esterni. Versione 0.2.3 in preparazione: nessun tag e nessuna Release. L’utente ha segnalato di aver installato su Windows; versione, PC pulito ed esiti dei singoli formati non ancora confermati, quindi non registrati come prove riuscite.

## 2. Cosa hai fatto

- .github/workflows/build.yml
- .github/workflows/release.yml
- CHANGELOG.md
- README.md
- THIRD_PARTY_NOTICES.txt
- docs/BUG.md
- docs/CI.md
- docs/DECISIONI.md
- docs/ROADMAP.md
- docs/VALIDATION.md
- docs/ricerca/CODICE-STUDIATO.md
- electron/main.cjs
- package-lock.json
- package.json
- src/App.jsx
- src/backups.mjs
- src/files.mjs
- src/styles.css
- scripts/markdown-check.mjs
- scripts/markdown-desktop-smoke.mjs
- scripts/markdown-smoke.mjs
- src/MarkdownEditor.jsx
- src/markdown.mjs
- tests/markdown.test.mjs
- docs/report/2026-11-25_1158_markdown.md e docs/report/ULTIMO.md: stesso report.

CosmoWrite ha un editor Markdown separato con testo e anteprima: titoli, enfasi, elenchi, tabelle e codice. Nuovo pulsante «Nuovo Markdown», import UTF-8, export .md e riconoscimento delle bozze. Il sorgente, non l’HTML dell’anteprima, è ciò che viene salvato. Backup esteso con fileType MD e controlli di coerenza; i vecchi backup HTML restano compatibili. Due sole aggiunte al main Electron: estensione e filtro .md, stesso salvataggio atomico esistente. Etichetta accessibile del pulsante export anche nel layout stretto.

Nuova dipendenza comunicata prima dell’installazione: marked 18.3.0, MIT (il file LICENSE include anche avviso BSD Markdown). Installazione npm: «added 1 package, and audited 528 packages in 2s», «found 0 vulnerabilities». Nessuna altra versione delle dipendenze cambiata; nel lock npm ha riordinato la voce license senza cambiarla. THIRD_PARTY_NOTICES.txt rigenerato con scripts/notices.mjs. La licenza propria non cambia.

Fonti consultate, registrate anche in docs/ricerca/CODICE-STUDIATO.md: [distribuzione esatta npm, package.json e LICENSE](https://registry.npmjs.org/marked/-/marked-18.3.0.tgz), [API e sanitizzazione separata](https://marked.js.org/using_advanced). Nessuna copia di sorgenti esterni, nessuna idea ArtCraft implementata o scelta del motore Office.

## 3. Esiti reali di build e test

Diciassette comandi definitivi, tutti exit 0. npm run dist esegue esplicitamente npm run build e produce il vero installer NSIS, senza pubblicarlo. 72 test unitari passati, zero fallimenti. Output integrali sotto (stdout e stderr conservati, sequenze ANSI rimosse, percorsi del computer sostituiti). I FAIL del validatore sono i controlli negativi attesi e l’eccezione storica documentata; nessuno dei 13 nuovi esportati ha errori.

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

✓ built in 1.12s

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
  • no code signing certificate configured, signing is skipped  path=<utente>\AppData\Local\Temp\t-JtQDuP\elevate-staging-1\resources\elevate.exe
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

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (88.7016ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (79.4011ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (127.531ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (184.35ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (28.1024ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (31.2595ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (23.979ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (24.1744ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.2906ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.675ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (39.0966ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (3.9483ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (110.0739ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (103.3782ms)
✔ unknown formulas retain their source without exporting a misleading cached number (17.9426ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.6523ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (15.926ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.8565ms)
✔ landscape DOCX uses a physically wider page with matching orientation (11.5646ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.6292ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (196.4057ms)
✔ references, arithmetic, precedence and percentages (4.6743ms)
✔ Italian aliases, absolute references, text and lazy IF (1.3641ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.916ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.7599ms)
✔ Excel address limits and column naming (1.4677ms)
✔ conditional sums, lookups, text, dates and error handling (4.0975ms)
✔ quoted sheet names, absolute references and cycles across sheets (1.3513ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.488ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9259ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.7254ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.4204ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.0506ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.9043ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (6.579ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (242.894ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (31.0025ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (7.6221ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (104.3645ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (11.7872ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (4.2918ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (75.1402ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.3257ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (44.1555ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (139.3149ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (46.4459ms)
✔ damaged files and mismatched Office extensions are rejected before import (11.7828ms)
✔ unsupported parts produce specific warnings without changing the original file (37.6929ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (12.6238ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (14.2028ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (767.4851ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1899.9886ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.635ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.0875ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.2615ms)
✔ TLS Node: errore di certificato senza fallback (0.601ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (17.2346ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.3064ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (128.3042ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (2.8111ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.4852ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (151.7521ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (1.9888ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.5013ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (22.1806ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (24.4544ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.7727ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.315ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (19.5679ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.5944ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (25.8574ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (3.9713ms)
ℹ tests 72
ℹ suites 0
ℹ pass 72
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3473.0953
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
11:49:02 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:05.01
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

### node test-results/markdown/checks.mjs — exit 0

```text
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
PASS motori Office/PDF, diagnostica, prova guidata, aggiornamenti, corpus e LICENSE invariati.
PASS versione 0.2.3, nessun tag, marked 18.3.0 attribuito.
```

Primi tentativi falliti, indagati prima di procedere:

1. Nel contenitore Windows Playwright ha restituito «download.path: canceled». Electron si è arrestato prima dell’app con il messaggio «Sandboxed processes cannot read <cartella>\node_modules\electron\dist: its ACL has an entry for an AppContainer package SID but none for ALL APPLICATION PACKAGES». Entrambe le prove sono state ripetute fuori dal token AppContainer: nessuna ACL modificata e nessuna protezione dell’app rimossa.
2. Nel test browser fuori dal contenitore: «page.waitForEvent: Timeout 30000ms exceeded while waiting for event "download"» dopo ricarica della pagina. Il test cliccava prima del montaggio dell’editor lazy: aggiunta attesa dell’anteprima e ripetuto, passato. Nessun confronto sui byte rimosso.
3. Nel test Electron: «locator.click: Timeout 30000ms exceeded» cercando Esporta MD dopo la prova a 390px, dove il testo era nascosto. Ripristinato il viewport desktop nello smoke, aggiunta etichetta accessibile esplicita al pulsante reale e prova di export a 390px nel browser. Ripetute le prove, passate; poi sequenza definitiva completa sopra.

## 4. Cosa funziona, provato

- Nuovo Markdown, import .md UTF-8, modifica e anteprima formattata reale.
- Export e riapertura tramite filesystem e IPC nativi in Electron e nel pacchetto Windows. Selettori file automatizzati, nessun motore o lettura file simulato.
- Confronto esatto del sorgente: BOM/CRLF senza editing, accenti, sintassi non interpretata, file vuoto dopo rinomina, HTML ostile conservato solo come sorgente. UTF-8 invalido respinto senza creare una bozza.
- Persistenza dopo ricarica browser, backup .md esportato/ripristinato senza conversione HTML; le suite precedenti controllano anche i vecchi formati/backup.
- Script, immagini e risorse esterne rimossi dall’anteprima; nessuna esecuzione e richieste renderer esterne assenti. Audit main Electron/pacchetto vuoti. Offline-smoke conferma zero richieste Node e zero connessioni Chromium nel NetLog.
- Anteprima sospesa oltre 200.000 caratteri, sorgente ancora esportabile, layout e export a 390px. Screenshot automatico test-results/markdown-390.png ispezionato visivamente: nessun dato del computer.
- Vero NSIS costruito: release/CosmOffice-0.2.3-win-x64-Setup.exe; SHA-256 78b5beccd92e6fde5443d225383194d7de75ef7277ed9b3bda08532d1f21c288. Licenza e avvisi ispezionati nel pacchetto reale e confrontati con i file locali. Smoke desktop generale e aggiornamenti passati. Workflow YAML validi.

## 5. Cosa NON funziona o non hai potuto provare

Markdown: niente immagini nell’anteprima (neppure locali), link attivi, matematica renderizzata, ortografia, barra di formattazione o conversione Office/PDF. Il sorgente resta nel file. UTF-8 soltanto; limite apertura 50 MB. L’editor sospende l’anteprima oltre 200.000 caratteri. Dopo editing, i terminatori del testo sono LF; senza editing BOM e CRLF rimangono identici. Nessuna nuova associazione .md/doppio clic nel sistema operativo.

Non provato: installazione di questo nuovo installer su PC Windows fisico pulito, SmartScreen, UAC con antivirus e utente normale; AppImage reale in uso, Mac fisico, tastiere mobili e lettori di schermo reali. La prova locale del pacchetto usa win-unpacked prodotto dalla costruzione NSIS, non un’installazione locale fingendo il runner. La CI dell’esatto commit verrà osservata dopo il push: nessun risultato futuro anticipato. Il lavoro NSIS già presente installerà/disinstallerà realmente nel runner, ma non sostituisce il PC fisico.

## 6. Bug e dubbi

MD-001 e MD-002 in docs/BUG.md: anteprima parziale e normalizzazione LF dopo editing, limiti espliciti. Prevenuta la perdita di formato nel backup distinguendo MD da HTML. Le versioni precedenti prive di supporto MD non possono ripristinare il nuovo archivio che contiene .md; conservare anche i file esportati. Resta l’avviso Vite sul bundle principale oltre 1900 kB, già presente; il componente Markdown è caricato separatamente (circa 54,73 kB, gzip 16,85 kB).

Non toccati: motori DOCX/XLSX/PDF, condizioni LICENSE, rapporto tester, Prova guidata, politica e implementazione degli aggiornamenti, preferenze e dati dei profili utente, corpus originale e installer pubblici 0.2.2. La 0.2.2 pubblica non cambia. Nessun’altra proposta dello studio implementata e nessuna scelta del motore.

## 7. Hash del commit e CI

Base: 6534f413f049caaa26c45408c9335413c17cb861. L’hash del commit che include questo report si ottiene con: git log -1 --format=%H -- docs/report/2026-11-25_1158_markdown.md. Verrà comunicato dopo il push; il documento non può contenere il proprio hash senza modificarlo.

CI della base 6534f41 controllata davvero: [run 45086811898](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45086811898), sei lavori completed/success, compreso windows-installed. La run del nuovo commit nasce dopo il push e qui non è dichiarata verde; link ed esito saranno comunicati solo dopo osservazione. Nessun tag o Release.

## 8. Prossimo passo

Pull --rebase e push su main con controlli verdi; seguire la CI del commit e i nuovi smoke Markdown Linux/Windows, oltre all’installazione/disinstallazione NSIS. Il titolare prova il nuovo installer sul proprio PC e indica versione ed esiti. Solo il titolare decide se autorizzare il rilascio 0.2.3. Nessun’altra funzione proposta o motore scelto in questo passo.
