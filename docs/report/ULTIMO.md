# Aggiornamenti TLS Node con consenso e verifica SHA-256

## 1. Obiettivo

Dopo la Release ordinaria e i DMG, introdurre in un commit separato il trasporto TLS Node autorizzato, senza nuove idee dello studio o scelta del motore.

## 2. Cosa hai fatto

- electron/update-policy.cjs, update-worker.cjs, update-transport.cjs e updater.cjs: URL chiusi, HTTPS verificato, worker isolato, audit limitato agli host, download e SHA-256, installazione solo dopo consenso.
- electron/offline.cjs, main.cjs e debug.cjs: difese generali mantenute, IPC, consenso nativo revocabile, protezione bozze, arresto e diagnostica con soli stati ammessi.
- src/App.jsx e SettingsPage.jsx: interruttore persistente per disattivare gli aggiornamenti, stato, controllo e installazione con conferma. L’interruttore richiesto è stato aggiunto; attivo di default nelle nuove installazioni.
- tests/update-transport.test.mjs, updates.test.mjs e offline.test.mjs: host, redirect, certificati, header minimi, hash, revoca anche durante la verifica, AppImage propria, installer interattivo, file esistenti e parziali.
- scripts/test-profile.mjs, offline-smoke.mjs, desktop-smoke.mjs, debug-smoke.mjs e guided-smoke.mjs: profili isolati con preferenza reale spenta, nessuna eccezione di rete nascosta.
- scripts/update-network-smoke.mjs e update-confirm-smoke.mjs: rete reale nei due avvii, audit Node e NetLog, prova nativa del consenso senza eseguire l’installer.
- .github/workflows/build.yml e release.yml: nuove prove bloccanti, Linux Electron e pacchetto Windows.
- README.md, docs/AGGIORNAMENTI.md, DECISIONI.md, ROADMAP.md, BUG.md, VALIDATION.md, CI.md e ricerca/CODICE-STUDIATO.md: comportamento, vincoli, stato e fonti. CHANGELOG.md aggiornato in Non rilasciato.
- Questo report e copia identica ULTIMO.md.

Nessuna nuova dipendenza, nessuna modifica a LICENSE. Attribuzioni rigenerate con scripts/notices.mjs, invariate. Nessun codice esterno copiato. Fonti: API pubbliche Node [worker_threads](https://nodejs.org/api/worker_threads.html) e [HTTPS](https://nodejs.org/api/https.html); documentazione NSIS già installata di app-builder-lib 26.18.0 MIT per verificare il nome dell’uninstaller.

## 3. Esiti reali di build e test

Tutti i comandi finali sotto sono terminati con exit 0. Ambiente locale Windows, Node 26.13.1, Electron 45.4.1; la CI usa Node 24. Output reali copiati senza riassumerli; i percorsi dell’ambiente di test eventualmente presenti sono tecnici, non contenuti del rapporto prodotto dall’app.

### npm run build — exit 0

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
dist/assets/DebugReport-CTeVRXx7.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-CKBMplBJ.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-CxLqW8Jz.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-Dm24br45.js         21.41 kB │ gzip:   7.32 kB
dist/assets/GridEditor-CAFYgh1V.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-0ES-Zfgs.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CZEScb41.js             2,321.36 kB │ gzip: 696.28 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.16s
```

### npm test (ultima esecuzione, 66 test) — exit 0

```text

> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (82.2259ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (81.444ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (137.3856ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (198.1699ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (29.0234ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (34.8148ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (44.6067ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (44.0422ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (10.8029ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7502ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (53.325ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (5.1401ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (116.2608ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (87.5815ms)
✔ unknown formulas retain their source without exporting a misleading cached number (14.0889ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.5441ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.4271ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (9.9898ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.5841ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (9.6286ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (188.5562ms)
✔ references, arithmetic, precedence and percentages (5.7533ms)
✔ Italian aliases, absolute references, text and lazy IF (1.5065ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.3998ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.9483ms)
✔ Excel address limits and column naming (1.7109ms)
✔ conditional sums, lookups, text, dates and error handling (6.0269ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6926ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.7766ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8265ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.9905ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.6816ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (9.6571ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (256.2284ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (42.6279ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.5075ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (136.4739ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (18.8642ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (5.6323ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (87.3372ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.195ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (68.8524ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (137.1381ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (39.1102ms)
✔ damaged files and mismatched Office extensions are rejected before import (14.4728ms)
✔ unsupported parts produce specific warnings without changing the original file (41.3845ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.5496ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.8598ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (849.7447ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (2062.6015ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.5609ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (5.1978ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.7629ms)
✔ TLS Node: errore di certificato senza fallback (1.15ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (21.4412ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (4.2049ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.1447ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (0.8007ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (20.6767ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (25.2006ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (8.4867ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (5.1269ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (20.6917ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.716ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (32.7381ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (6.6835ms)
ℹ tests 66
ℹ suites 0
ℹ pass 66
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3405.8877
```

### npm run test:browser — exit 0

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
19:23:56 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

### npm run test:openxml — exit 0

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

Tempo trascorso 00:00:04.83
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

### npm run pack — exit 0

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
dist/assets/DebugReport-CTeVRXx7.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-CKBMplBJ.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-CxLqW8Jz.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-Dm24br45.js         21.41 kB │ gzip:   7.32 kB
dist/assets/GridEditor-CAFYgh1V.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-0ES-Zfgs.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CZEScb41.js             2,321.36 kB │ gzip: 696.28 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.17s

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
  "state": {
    "phase": "idle",
    "message": "Non ci sono nuove versioni.",
    "version": null,
    "enabled": true,
    "preference": true
  },
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
    },
    {
      "phase": "blocked",
      "host": "example.invalid"
    }
  ],
  "hosts": [
    "github.com",
    "release-assets.githubusercontent.com"
  ],
  "offRequests": 0,
  "chromiumConnections": 0,
  "chromiumRequests": 0,
  "forbiddenHostBlocked": true
}
```

### node scripts/update-network-smoke.mjs --package — exit 0

```text
{
  "result": "PASS",
  "package": true,
  "state": {
    "phase": "idle",
    "message": "Non ci sono nuove versioni.",
    "version": null,
    "enabled": true,
    "preference": true
  },
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
    },
    {
      "phase": "blocked",
      "host": "example.invalid"
    }
  ],
  "hosts": [
    "github.com",
    "release-assets.githubusercontent.com"
  ],
  "offRequests": 0,
  "chromiumConnections": 0,
  "chromiumRequests": 0,
  "forbiddenHostBlocked": true
}
```

### node scripts/update-confirm-smoke.mjs — exit 0

```text
PASS consenso nel pacchetto Windows: Annulla non installa; chiusura normale non installa; conferma esplicita salva e chiude, ricontrolla SHA-256 e avvia solo lo spy interattivo. Nessun installer eseguito.
```

### node scripts/debug-smoke.mjs — exit 0

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### node scripts/guided-smoke.mjs — exit 0

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

### COSMO_DEBUG_PACKAGE=1: debug-smoke — exit 0

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### COSMO_DEBUG_PACKAGE=1: guided-smoke — exit 0

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

## 4. Cosa funziona, provato

Elenco esatto degli host ammessi nell’app: **github.com** e **release-assets.githubusercontent.com**. Solo Release CosmoNetinfo/CosmOffice; CDN solo dopo redirect e percorso del repository numerico 1466711071. Nessun api.github.com nell’app. HTTPS con certificato verificato e TLS minimo 1.2, nessun fallback HTTP. GET senza corpo, cookie, identificativi o telemetria; header applicativi User-Agent: CosmOffice e Accept-Encoding: identity.

Spento: zero richieste Node e zero connessioni Chromium. Acceso: download reale Windows di 128031094 byte sia in Electron sia nel pacchetto, SHA-256 ce37586a69151fbe56dc555acf2f49f4fc031dfc62cc6e20a3e03c8052c1f69a verificato; soltanto i due host, zero connessioni/richieste Chromium, host estraneo bloccato prima del contatto. Spegnimento ferma richieste e revoca il consenso. Test negativi verificano anche redirect estranei e certificati, non solo l’URL iniziale.

Nel pacchetto Windows: Annulla e normale chiusura non installano. Conferma esplicita, bozze salvate e secondo hash precedono lo spawn interattivo senza shell né /S. Nella prova lo spawn è uno spy. AppImage: sostituzione su file di test con hash/formato/permessi, proprio APPDIR e rifiuto di APPIMAGE ereditata da un altro programma. Mac solo avviso/download manuale; nessun DMG scaricato automaticamente.

Release ordinaria [CosmOffice 0.2.2 (anteprima)](https://github.com/CosmoNetinfo/CosmOffice/releases/latest) pubblica e scaricabile senza account: Windows, Linux, Mac Intel e Apple Silicon, ciascuno con checksum e riepilogo. Tutti quattro download anonimi verificati contro SHA-256, sidecar e digest GitHub; Windows/Linux preservati dopo Mac. Note italiane con limiti, prove mancanti, prossimi passi e quattro domande ai tester. DMG verificati in CI con hdiutil/lipo. Guida README “Aprire CosmOffice su Mac” presente.

Screenshot: commit 5ee891b, nove PNG reali generati automaticamente, esempi originali, privacy verificata e nove link relativi del README controllati anonimamente su GitHub (HTTP 200, image/png, byte identici). Rigenerazione: npm run build, poi node scripts/screenshots.mjs; guida docs/SCREENSHOTS.md.

## 5. Cosa NON funziona o non hai potuto provare

**Non provato:** installazione effettiva su computer puliti, UAC/completamento NSIS, sostituzione di una vera AppImage in uso, hardware Mac, Gatekeeper reale e crash del sistema durante la sostituzione. Lo spy dimostra il percorso di consenso, non l’installazione reale. Gli errori di rete mostrano un messaggio breve; un servizio GitHub diverso dall’elenco viene rifiutato.

**0.2.2 pubblica non contiene questo updater:** gli installer restano immutati al tag. Per ricevere futuri aggiornamenti con questa funzione servirà installare manualmente una versione successiva che la includa. Nessuna nuova versione/tag viene pubblicata da questo passo. Firma e notarizzazione assenti; SHA-256 rispetto a GitHub HTTPS non equivale a firma indipendente.

Il vecchio XLSX autorizzato resta copia identica e conserva l’errore MIME storico; tutti i 13 nuovi esportati passano SDK. Compatibilità Office completa, modifica chirurgica dei grafici esterni e nuovo motore non sono dichiarati né implementati.

## 6. Bug e dubbi

Primo tentativo della nuova prova del consenso: exit 1, errore reale:

~~~text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
+ actual - expected
+ 'checking'
- 'ready'
at start (scripts/update-confirm-smoke.mjs:25:10)
~~~

L’attesa originale non assicurava il completamento osservato via IPC. Corretto il test per attendere lo stato terminale reale e chiudere il processo anche se il setup fallisce; non indebolita l’asserzione. Riprova e intera verifica finale passate. Il precedente prototipo Chromium contattava una sonda UDP Google: scartato, nessuna eccezione Chromium rimasta. Il worker Node passa i controlli reali.

Avvisi presenti, non nascosti: chunk Vite grande, PDF danneggiato intenzionale, NU1900 per audit NuGet non raggiungibile. Nessun nuovo errore SDK nei nuovi file. Individuati e coperti da test anche rischio APPIMAGE ereditata e revoca durante hash prima dell’installazione.

## 7. Hash del commit e CI

Base: 8ff6d8d9a272f8ae968fdbca8dc0af0a2b2ac019. Hash di questo passo ottenibile con git log -1 --format=%H -- docs/report/2026-11-22_1943_aggiornamenti-tls-node.md; comunicato dopo il push. Un file incluso nel commit non può contenere il proprio hash definitivo.

[Dieci CI principali precedenti](../CI.md): tutte verdi con cinque lavori success per commit. Ultima base 8ff6d8d: [45050553763](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45050553763), cinque success. Mac della stessa base: [45050553680](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45050553680), tre success (x64, arm64, pubblicazione), tutti gli asset controllati dopo la run. Tag Release [45035965421](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035965421) e completamento Linux [45047079344](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45047079344) success; difetto iniziale DIST-001 documentato e corretto.

La CI di questo nuovo commit non esiste ancora durante la scrittura. Verrà verificata dopo il push e comunicata con il link; nessun verde anticipato.

## 8. Prossimo passo

Pull --rebase, push su main e verifica della nuova CI. Poi collaudo manuale su installazioni pulite Windows, AppImage realmente avviata e Mac fisici prima di dichiarare l’installazione effettiva provata. Una futura Release che includa l’updater richiede una versione successiva; nessuna scelta del motore o altra idea dello studio effettuata.
