# CosmOffice 0.2.3 preparata su main, senza tag o Release

## 1. Obiettivo

Preparare 0.2.3 con aggiornamenti spenti di default e controllo manuale, Informazioni e licenze locali, pacchetti verificati e screenshot rigenerati. Su aggiunta esplicita, predisporre un lavoro Windows separato che installa NSIS realmente nel runner, apre tre esempi e disinstalla. Nessun tag o Release: decide il titolare dopo la prova su PC Windows pulito. La 0.2.2 pubblica non cambia.

## 2. Cosa hai fatto

### Fatto e file modificati/creati

- electron/updater.cjs: preferenza periodica falsa in assenza di nuovo consenso policy 2; nessuna rete all’avvio nemmeno con periodici autorizzati. Clic unico/duplicati accorpati, chiusura automatica del trasporto e annullamento. SHA-256, versione e consenso d’installazione distinti dalla rete temporanea.
- electron/main.cjs e preload.cjs: annullamento e lettura locale con due soli nomi consentiti; conferma d’installazione valida anche quando la rete è tornata spenta. Nessuna installazione sulla chiusura normale.
- src/preferences.jsx, App.jsx e SettingsPage.jsx: default falso, migrazione vecchio attivo, pulsante esatto «Controlla aggiornamenti ora», messaggi italiani e periodici opt-in. Import JSON conserva il consenso corrente invece di ereditare vecchi attivo.
- src/About.jsx e styles.css: Informazioni con versione/titolare e testi da file locali, attribuzioni consultabili offline. src/debug.mjs: solo numero versione del rapporto browser, formato e filtri intatti.
- package.json e package-lock.json: 0.2.3, riferimento SEE LICENSE IN LICENSE, author del titolare e script di asset locali. Nessuna nuova dipendenza/versione di libreria.
- electron-builder.config.cjs, scripts/legal-assets.mjs e .gitignore: due testi nelle risorse; licenza anche nell’ASAR, copie per anteprima browser escluse dal bundle nativo per evitare la duplicazione delle attribuzioni. Copyright dei nuovi pacchetti allineato al titolare. Nessuna pagina NSIS aggiunta.
- scripts/package-resources-check.mjs: ispezione vera degli archivi NSIS, AppImage e DMG, byte confrontati con i sorgenti della build e versione/licenza dell’ASAR verificate.
- scripts/legal-smoke.mjs e about-browser.mjs: testi locali, versione, importazione del vecchio JSON senza consenso, rifiuto di percorsi arbitrari via IPC e assenza di rete.
- tests/updates-manual.test.mjs, updates.test.mjs, scripts/update-network-smoke.mjs, update-confirm-smoke.mjs, test-profile.mjs e offline-smoke.mjs: nuovo contratto manuale, profili realmente nuovi, annullamento, spegnimento, zero Chromium e due soli host Node. I test TLS/URL/certificati restano attivi.
- .github/workflows/build.yml e release.yml: verifiche bloccanti dei pacchetti e Informazioni. In build.yml, nuovo lavoro windows-installed su Windows hosted separato, timeout 15 minuti e artefatto delle prove.
- scripts/windows-installed-smoke.ps1 e windows-installed-ui.mjs: installazione/disinstallazione reali /S solo nel runner, directory nuova sotto RUNNER_TEMP verificata, finestra visibile, Home, apertura di DOCX/XLSX/PDF reali, licenze nella cartella installata e risorse mostrate dall’app. Solo ritorno del selettore file automatizzato; filesystem, IPC e motori non sostituiti. Nessuna esecuzione locale fingendo variabili CI.
- scripts/screenshots.mjs, undici PNG in docs/images e docs/SCREENSHOTS.md: catture reali dell’anteprima browser, nuove Aggiornamenti/Informazioni, esempi originali e controllo privacy. Comando di aggiornamento desktop disabilitato nel browser: non viene simulato per abbellire l’immagine.
- README.md, CHANGELOG.md, docs/AGGIORNAMENTI.md, DECISIONI.md, ROADMAP.md, BUG.md, VALIDATION.md, CI.md e ricerca/CODICE-STUDIATO.md: stato, scelte e prove. CHANGELOG con tutte le categorie richieste e istruzione «0.2.2 a mano una volta, poi pulsante».
- Questo report e copia identica docs/report/ULTIMO.md.

### Non toccato

LICENSE invariato, SHA-256 f2649c4c63c51b60799de533efbc3c09a71639df963f677492bbe5e865f9006f. Condizioni A immutate, B non adottata. Motori DOCX/XLSX/PDF, formule, corpus originale, politiche/privacy della diagnostica, Prova guidata e relativo formato invariati. Nel rapporto browser cambia soltanto la versione 0.2.2→0.2.3. Nessuna nuova idea dello studio o scelta del motore. Pacchetti/Release/tag 0.2.2 non modificati; nessun tag 0.2.3.

Attribuzioni rigenerate con scripts/notices.mjs e invariate. Consultazioni di metodo solo su file MIT già installati di app-builder-lib/builder-util e @electron/asar 3.4.1, registrate con file, versione e problema in CODICE-STUDIATO.md; nessun codice copiato o nuova dipendenza.

## 3. Esiti reali di build e test

I quattordici comandi definitivi sono tutti exit 0. La costruzione dell’installer esegue esplicitamente npm run build, icone e avvisi prima di electron-builder --publish never. Seguono 70 test unitari, browser, SDK e tutti gli smoke richiesti. Gli output sono copiati sotto: soltanto spazi finali rimossi e percorsi del computer sostituiti con <cartella>/<utente>, senza nascondere errori.

### npm run dist -- --win nsis --x64 (include npm run build) — exit 0

```text

> cosmoffice@0.2.3 dist
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --publish never --win nsis --x64


> cosmoffice@0.2.3 build
> node scripts/pdf-assets.mjs && node scripts/legal-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
Licenza e attribuzioni disponibili come file locali per l’anteprima.
vite v8.3.8 building client environment for production...
transforming...
✓ 2413 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.51 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-D37R9mfN.css               46.04 kB │ gzip:  10.62 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-82L_aV-u.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-DtzVRlz4.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-BB0YR9dV.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-C-2qy7LR.js         23.85 kB │ gzip:   8.10 kB
dist/assets/GridEditor-BQVYqVEB.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-DLCwEqU_.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-D6KTCJuq.js             2,321.46 kB │ gzip: 696.31 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.09s

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
  • no code signing certificate configured, signing is skipped  path=<cartella>\AppData\Local\Temp\t-yzUrnr\elevate-staging-1\resources\elevate.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.__uninstaller.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.exe
  • building block map  blockMapFile=release\CosmOffice-0.2.3-win-x64-Setup.exe.blockmap
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (66.1296ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (88.638ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (122.9436ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (182.3334ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (30.2671ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (34.8808ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (38.2119ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (23.2642ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (7.7289ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.677ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (43.9625ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (3.635ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (101.2025ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (80.4586ms)
✔ unknown formulas retain their source without exporting a misleading cached number (18.3137ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.7616ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.1316ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (11.5244ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.0016ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (9.7965ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (145.3427ms)
✔ references, arithmetic, precedence and percentages (4.5598ms)
✔ Italian aliases, absolute references, text and lazy IF (0.9669ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7481ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6604ms)
✔ Excel address limits and column naming (1.3326ms)
✔ conditional sums, lookups, text, dates and error handling (3.8811ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6185ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4707ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7722ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5916ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.3875ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (10.52ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (274.3256ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (51.2328ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (12.4701ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (115.9055ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (20.0741ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.7695ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (119.2273ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (3.2934ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (120.2279ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (119.8521ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (30.5077ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.8959ms)
✔ unsupported parts produce specific warnings without changing the original file (32.1706ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (15.0222ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (15.1998ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (882.2538ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1807.6609ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.8315ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (3.7102ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.9423ms)
✔ TLS Node: errore di certificato senza fallback (0.8666ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (26.2746ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.8385ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (136.3423ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.2113ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.9267ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (144.2563ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.4712ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.5483ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (16.3147ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (22.5035ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.3478ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (4.9125ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (27.0207ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.7574ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (29.006ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.9735ms)
ℹ tests 70
ℹ suites 0
ℹ pass 70
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3142.5151
```

### npm run test:browser — exit 0

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs

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
00:44:42 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:00.33
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
FAIL <cartella>\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type.
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
        "THIRD_PARTY_NOTICES.txt": "492e9976f56e9d0307ccc5f1a8ba9843216139b80a98b6593025e22e3440a7bb"
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

### node scripts/notices.mjs — exit 0

```text
Attribuzioni e licenze raccolte.
```

### YAML, ambito protetto e identità del pacchetto — exit 0

```text
PASS YAML e dipendenze: build.yml
PASS YAML e dipendenze: release-linux.yml
PASS YAML e dipendenze: release-mac.yml
PASS YAML e dipendenze: release.yml
PASS: LICENSE, motori, corpus, diagnostica e guida invariati; unica variazione del rapporto browser: versione.
PASS: nessuna nuova dipendenza; pacchetto Windows byte-identico ai sorgenti Electron e agli asset compilati attuali.
PASS: undici PNG, collegamenti relativi, dimensioni e metadati; tag v0.2.3 assente.
```

### Sintassi PowerShell, nessuna installazione locale — exit 0

```text
PASS sintassi PowerShell: zero errori; installer non eseguito localmente.
```

### Rigenerazione screenshot e privacy — exit 0

```text
{
  "result": "PASS",
  "captured": [
    {
      "name": "write",
      "width": 1440,
      "height": 1000,
      "bytes": 31083
    },
    {
      "name": "grid",
      "width": 1440,
      "height": 1000,
      "bytes": 29445
    },
    {
      "name": "view",
      "width": 1440,
      "height": 1000,
      "bytes": 24974
    },
    {
      "name": "home",
      "width": 1440,
      "height": 1160,
      "bytes": 39200
    },
    {
      "name": "layout-stretto",
      "width": 390,
      "height": 844,
      "bytes": 18518
    },
    {
      "name": "impostazioni-chiaro",
      "width": 1440,
      "height": 1000,
      "bytes": 31623
    },
    {
      "name": "impostazioni-scuro",
      "width": 1440,
      "height": 1000,
      "bytes": 30968
    },
    {
      "name": "aggiornamenti",
      "width": 1440,
      "height": 1000,
      "bytes": 35371
    },
    {
      "name": "informazioni",
      "width": 1440,
      "height": 1000,
      "bytes": 43626
    },
    {
      "name": "prova-guidata",
      "width": 1440,
      "height": 1440,
      "bytes": 79886
    },
    {
      "name": "segnala-problema",
      "width": 1440,
      "height": 1000,
      "bytes": 67414
    }
  ],
  "external": []
}
```

### Fallimenti incontrati e corretti, non nascosti

1. Prime due ispezioni dell’installer: risorse esterne corrette, ma copia LICENSE nell’ASAR assente. Entrambe exit 1. Il filtro extraResources escludeva il sorgente dal bundle: usare un secondo matcher non bastava. Corretto il sorgente della copia esterna (public/legal/LICENSE); ASAR da LICENSE originale. Il confronto byte per byte non è stato rimosso. Directory e successivi installer reali passano.

#### risorse-primo.log — exit 1

```text
<cartella>\node_modules\@electron\asar\lib\filesystem.js:187
            throw new Error(`"${p}" was not found in this archive`);
                  ^

Error: "LICENSE" was not found in this archive
    at Filesystem.getFile (<cartella>\node_modules\@electron\asar\lib\filesystem.js:187:19)
    at Object.extractFile (<cartella>\node_modules\@electron\asar\lib\asar.js:256:33)
    at verify (file:///<cartella>/scripts/package-resources-check.mjs:14:273)
    at file:///<cartella>/scripts/package-resources-check.mjs:25:2
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:105:5)

Node.js v26.13.1
```

#### risorse-secondo.log — exit 1

```text
<cartella>\node_modules\@electron\asar\lib\filesystem.js:187
            throw new Error(`"${p}" was not found in this archive`);
                  ^

Error: "LICENSE" was not found in this archive
    at Filesystem.getFile (<cartella>\node_modules\@electron\asar\lib\filesystem.js:187:19)
    at Object.extractFile (<cartella>\node_modules\@electron\asar\lib\asar.js:256:33)
    at verify (file:///<cartella>/scripts/package-resources-check.mjs:14:273)
    at file:///<cartella>/scripts/package-resources-check.mjs:25:2
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:105:5)

Node.js v26.13.1
```

2. Prima sequenza finale: offline-smoke chiamava checkUpdates e pretendeva disabled. Con il nuovo contratto tale chiamata è un consenso manuale e raggiunge correttamente idle. Test aggiornato a leggere lo stato senza clic; audit e NetLog ancora obbligatoriamente vuoti. Il clic resta provato nello smoke di rete, non eliminato dai test. Ripetizione passata, poi intera sequenza ripetuta sul pacchetto definitivo con la protezione di import JSON.

~~~text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

'idle' !== 'disabled'

    at file:///<cartella>/scripts/offline-smoke.mjs:24:10 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 'idle',
  expected: 'disabled',
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.13.1
~~~

3. Primo controllo PowerShell: exit 1, cinque errori di parsing causati dall’apostrofo tipografico in una stringa tra apici. Dettagli letti dal parser (trascrizione):

~~~text
Unexpected token 'app' in expression or statement.
The string is missing the terminator: '.
Missing closing '}' in statement block or type definition.
Missing closing '}' in statement block or type definition.
The Try statement is missing its Catch or Finally block.
Issues: 5
~~~

Riscritto soltanto quel messaggio, controllo sintattico finale zero errori. Nessun installer locale eseguito per ottenere un falso risultato CI.

4. Verifica supplementare degli asset ASAR: primo tentativo con separatori non nativi Windows non trovava un file che l’header conteneva. Corretto il nostro helper con path.join, mantenuto il confronto di tutti gli asset. Non modificata la libreria né indebolita l’asserzione. Output iniziale:

~~~text
PASS YAML e dipendenze: build.yml
PASS YAML e dipendenze: release-linux.yml
PASS YAML e dipendenze: release-mac.yml
PASS YAML e dipendenze: release.yml
<cartella>\node_modules\@electron\asar\lib\filesystem.js:187
            throw new Error(`"${p}" was not found in this archive`);
                  ^

Error: "dist/assets/DebugReport-82L_aV-u.js" was not found in this archive
    at Filesystem.getFile (<cartella>\node_modules\@electron\asar\lib\filesystem.js:187:19)
    at Object.extractFile (<cartella>\node_modules\@electron\asar\lib\asar.js:256:33)
    at file:///<cartella>/test-results/v023/controlli.mjs:19:71
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:105:5)

Node.js v26.13.1
~~~

Nei log SDK i rifiuti delle copie volutamente negative e dell’XLSX storico sono attesi; i 13 nuovi esportati sono validi. Avvisi Vite/chunk, PDF negativo ed eventuale NU1900 restano negli output reali, non presentati come assenti.

## 4. Cosa funziona, provato

Nuovo profilo e vecchio attivo: avvio senza richieste Node; NetLog Chromium senza TCP/UDP/QUIC/DNS o HTTP. Clic manuale reale su GitHub, host estraneo respinto, annullamento via IPC e rete spenta al termine in Electron e nel pacchetto Windows. Due host ammessi: github.com e release-assets.githubusercontent.com, quest’ultimo solo per redirect del repository 1466711071. Certificato HTTPS richiesto, nessun fallback HTTP, nessuna telemetria o invio di dati del PC/documenti.

Latest rimane 0.2.2: il controllo normale di 0.2.3 non propone un downgrade. Il download reale 0.2.2 è una prova separata del trasporto, con SHA-256 verificato; nessuna nuova Release simulata. Il consenso nativo è provato nel pacchetto con versione/riconoscimento installazione simulati e spawn-spy: Annulla e chiusura normale non installano; conferma ricontrolla l’hash. Questo test non viene scambiato per installazione reale.

Import JSON e vecchie preferenze non attivano i periodici; confronto file locali della pagina Informazioni e IPC a elenco chiuso provati nel browser e nel pacchetto. LICENSE e THIRD_PARTY_NOTICES.txt verificati negli archivi NSIS reali, identici ai sorgenti; LICENSE anche in ASAR. LIC-001 risolto per il nuovo installer Windows provato; controlli reali su AppImage/DMG predisposti come bloccanti, da verificare nella nuova CI dopo il push.

Screenshot: undici PNG originali, massimo 1600 px e 600 KB, testo visibile/campi controllati contro nome utente e percorsi del computer, metadati rimossi, zero risorse esterne. Revisionati visivamente insieme e nuove schermate anche a piena dimensione. Il titolare nella licenza è il dato pubblico richiesto, non il nome utente del computer. Rigenerazione: npm run build, poi node scripts/screenshots.mjs; procedura in docs/SCREENSHOTS.md. Percorsi relativi nel README verificati.

## 5. Cosa NON funziona o non hai potuto provare

**Installazione reale Windows nel runner:** il lavoro è definito, protetto contro l’esecuzione fuori CI e validato sintatticamente; non è ancora stato eseguito al momento di questo commit. Dopo il push saranno letti gli esiti veri, senza sostituire passi con simulazioni. Il lavoro produrrà test-results/WINDOWS-INSTALLAZIONE.md con i codici reali e immagini/report nell’artefatto verifica-installazione-windows. Se fallisce, il fallimento va riportato e corretto prima di dichiararlo riuscito.

**Non provati:** PC Windows fisico pulito, SmartScreen, UAC con antivirus e utente normale, dialogo OS di selezione file, installazione interattiva consumer. Anche un runner riuscito non li sostituisce. AppImage realmente in uso e hardware Mac/Gatekeeper non provati. Nessun aggiornamento end-to-end verso una Release successiva reale: la 0.2.3 non è pubblicata e non viene creata una versione fittizia per il test.

Linux/Mac: i pacchetti reali saranno verificati nei rispettivi runner, non costruiti fittiziamente su Windows. Firma/notarizzazione assenti come richiesto. Licenza A da rivedere con un professionista; questo lavoro non è consulenza legale. Compatibilità Office parziale, nessun nuovo motore o promessa universale.

La **0.2.2 pubblica non cambia**, compresi installer, checksum, note e tag. La 0.2.3 resta soltanto su main e negli artefatti di test: nessun tag e nessuna Release. Quando il titolare autorizzerà la pubblicazione dopo la prova fisica, chi usa 0.2.2 aggiornerà a mano una volta, poi userà il pulsante.

## 6. Bug e dubbi

Fallimenti sopra conservati e verifiche finali verdi. LIC-001 non chiuso per la vecchia 0.2.2; risolto e verificato nel nuovo NSIS, altre piattaforme subordinate al controllo reale della nuova CI. Vecchio XLSX autorizzato resta copia byte-identica con errore MIME storico: nessuna eccezione per i nuovi file.

Interruttore periodico mantenuto perché ha una funzione effettiva e testata (opt-in, ogni sei ore, mai all’avvio). Non viene rimosso senza decisione; nessuna scelta ulteriore su motore o idee dello studio. Importazione impostazioni conserva il consenso corrente, esplicitato nel messaggio. PC fisico e revisione professionale restano i passaggi necessari per la decisione di rilascio.

## 7. Hash del commit e CI

Base: a9b754b1dd3e3e46766414afe5a48b89f9546fcf. Hash di questo passo: git log -1 --format=%H -- docs/report/2026-11-23_0059_prepara-023.md; comunicato dopo il push, poiché non può essere incluso nel contenuto dello stesso commit.

CI della base a9b754b verificata success: [45078553609](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45078553609), cinque lavori. Le precedenti sono in docs/CI.md. La nuova CI del commit 0.2.3 e il suo lavoro windows-installed esisteranno dopo il push: nessun link/esito futuro anticipato come verde. Il link della nuova run sarà comunicato soltanto dopo averla vista riuscire; nessun tag o Release necessari per farla partire.

## 8. Prossimo passo

Pull --rebase e push su main con controlli locali verdi; seguire la CI, leggere l’ispezione reale AppImage/DMG e l’installazione/disinstallazione Windows. Poi il titolare prova l’installer su PC Windows pulito. Tag e Release 0.2.3 solo dopo sua decisione; il runner non sostituisce quel collaudo.
