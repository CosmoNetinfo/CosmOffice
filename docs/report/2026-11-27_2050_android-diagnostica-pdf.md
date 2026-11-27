# Android: verifica degli export e diagnosi PDF

## 1. Obiettivo

Continuare il collaudo dell’APK: confermare gli export effettivi e ottenere una causa verificabile per il rifiuto del PDF, prima di cambiare il codice dell’app.

## 2. Cosa hai fatto

- SmokeInstrumentation.java: riconosce il rifiuto PDF invece di attendere soltanto un canvas assente. In quel caso esegue una diagnosi con il solo PDF originale incorporato nell’APK di test e lo stesso modulo PDF già caricato; riporta errore tecnico e versione WebView. Nessuna sostituzione del selettore o del salvataggio. Diagnostica solo nel test, non nell’APK distribuito o nei rapporti dei tester.
- Verificati i veri DOCX/XLSX esportati e recuperati dall’artifact della run 46056425324.
- Aggiornati CHANGELOG.md, docs/BUG.md, docs/CI.md, docs/VALIDATION.md, questo report e ULTIMO.md.
- Non toccati src/, electron/, Android/main, motori, licenza, chiave, versione/tag e Release desktop pubblica. Nessuna nuova dipendenza; notices rigenerati invariati.

## 3. Esiti reali di build e test

Commit 491202025b2b4f5d9bd4eb9d4dea6e133d13bef0: [CI desktop 46056425321](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425321) osservata con tutti sei i lavori completed/success, inclusa installazione/disinstallazione NSIS nel runner. [CI Android 46056425324](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425324) failure sul quarto caso PDF; Home, DOCX e XLSX PASS. Non si presenta una CI Android rossa come verde.

SHA-256 ZIP artifact 4230f30380658f4928873c8eb4bc2befbb22d7720548800230146e0f0bf5e8f6 uguale al digest GitHub. Schermata errore ispezionata: Home dopo rifiuto, nessun canvas PDF. Causa non ancora dimostrata. Output reale:

```text
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=1
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Avvio APK e permessi offline
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=1
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Avvio APK e permessi offline
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=2
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=DOCX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=2
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=DOCX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=3
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=XLSX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=3
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=XLSX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=4
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=PDF visualizza ruota salva riapri
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=4
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: stack=java.lang.AssertionError: Attesa scaduta: document.querySelector('.pdf-paper canvas')?.width>0&&!document.querySelector('.pdf-loading')
INSTRUMENTATION_STATUS: test=PDF visualizza ruota salva riapri
INSTRUMENTATION_STATUS_CODE: -2
INSTRUMENTATION_RESULT: cosmoffice=FAIL
INSTRUMENTATION_RESULT: stream=
FAIL Android: java.lang.AssertionError: Attesa scaduta: document.querySelector('.pdf-paper canvas')?.width>0&&!document.querySelector('.pdf-loading')

INSTRUMENTATION_CODE: -1

PASS: SHA-256 artifact uguale a GitHub; Mammoth legge il testo aggiunto nel DOCX; ExcelJS legge B2=701 e B3=2 nello XLSX realmente esportati dall’APK. PDF/MD non esportati nella run fallita.

```

Controlli locali: tutti 16 exit 0; APK debug/test/release e lint compilati, BUILD SUCCESSFUL. Conservati warning SDK Platform-Tools/licenza non accettata, API deprecate Java e Gradle 9. Non equivale a esecuzione dell’emulatore locale. Output integrali, solo ANSI/percorsi personali/spazi finali normalizzati:

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
dist/assets/DebugReport-DFYIwS3f.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-BF6AjW4l.js            2.31 kB │ gzip:   1.05 kB
dist/assets/android-BuIAeMDG.js               2.41 kB │ gzip:   1.18 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-BZBx0KUz.js            11.03 kB │ gzip:   4.23 kB
dist/assets/SettingsPage-DZf3hTRd.js         24.69 kB │ gzip:   8.40 kB
dist/assets/MarkdownEditor-Bc92OywY.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-h7KgLGG3.js          203.80 kB │ gzip:  70.77 kB
dist/assets/import-docx-Ctf4domh.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-C2WGQL4F.js             2,324.24 kB │ gzip: 697.27 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.50s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (11.4015ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (3.9849ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (90.4023ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (83.3456ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (132.4388ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (185.5686ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (29.2115ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (28.3142ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (25.4099ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (21.5304ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.7629ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.6681ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (43.0618ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (5.1099ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (117.0339ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (102.0383ms)
✔ unknown formulas retain their source without exporting a misleading cached number (15.2523ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.4526ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.9317ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (11.4897ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.3743ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.1177ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (203.1233ms)
✔ references, arithmetic, precedence and percentages (4.5521ms)
✔ Italian aliases, absolute references, text and lazy IF (1.4836ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.7866ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.5974ms)
✔ Excel address limits and column naming (2.4237ms)
✔ conditional sums, lookups, text, dates and error handling (3.9467ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6147ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4123ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7455ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6115ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.1441ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.0957ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (1.0262ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (6.9233ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (246.6728ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (38.0191ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (11.3994ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (123.4683ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (14.5574ms)
✔ Release corrente: note complete per la versione realmente distribuita (5.6212ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (4.5233ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (67.8383ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.1078ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (41.428ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (142.6405ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (48.7104ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.6556ms)
✔ unsupported parts produce specific warnings without changing the original file (33.8358ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.6077ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.2457ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (797.3356ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1848.0669ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.5396ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.1389ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.9041ms)
✔ TLS Node: errore di certificato senza fallback (1.1244ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (17.9436ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.8637ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (124.0812ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (2.8057ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.7164ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (152.1584ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (1.9454ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.1894ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (15.6502ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (21.0993ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.7725ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.5381ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (19.3314ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.9336ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (26.9947ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (5.2082ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3562.3889
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
20:43:54 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
20:44:13 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
20:44:13 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
20:44:13 [vite] (client) page reload android/build/reports/problems/problems-report.html
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
20:45:59 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  Tutti i progetti sono aggiornati per il ripristino.
<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  OpenXmlCheck -> <progetto>\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.

<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
    Avvisi: 2
    Errori: 0

Tempo trascorso 00:00:04.64
PASS <progetto>\test-results\corpus\01-testo-stili.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\02-tabella.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\03-immagine.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\04-elenchi.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\05-intestazioni.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\01-formule.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\02-piu-fogli.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\03-formati.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\04-unioni-immagine.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\05-dati-filtro.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\openxml\smoke.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\openxml\smoke.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\grafici-ui.xlsx: 0 errori Open XML SDK
FAIL <progetto>\test-results\openxml\negative\schema-errato.docx: 1 errori Open XML SDK
{"id":"Sch_InvalidElementContentExpectingComplex","description":"The element has invalid child element \u0027http://schemas.openxmlformats.org/wordprocessingml/2006/main:cosmoInvalido\u0027.","part":"/word/document.xml","path":"/w:document[1]/w:body[1]"}
FAIL <progetto>\test-results\openxml\negative\schema-errato.xlsx: 1 errori Open XML SDK
{"id":"Sch_AttributeValueDataTypeDetailed","description":"The attribute \u0027orientation\u0027 has invalid value \u0027diagonale\u0027. The Enumeration constraint failed.","part":"/xl/worksheets/sheet1.xml","path":"/x:worksheet[1]/x:pageSetup[1]"}
PASS Open XML SDK: 13 esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.
FAIL <progetto>\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type.
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

### node scripts/legal-smoke.mjs --package — exit 0

```text
PASS Informazioni pacchetto: file locali identici, attribuzioni, percorso arbitrario respinto e zero richieste Node.
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

### node scripts/update-confirm-smoke.mjs — exit 0

```text
PASS consenso nel pacchetto Windows: Annulla non installa; chiusura normale non installa; conferma esplicita salva e chiude, ricontrolla SHA-256 e avvia solo lo spy interattivo. Nessun installer eseguito.
```

### Gradle APK debug/test/release e lint — exit 0

```text
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build
Checking the license for package Android SDK Platform-Tools in <progetto>\test-results\android\tools\sdk\licenses
Warning: License for package Android SDK Platform-Tools not accepted.
WARNING: platform-tools package is not installed. Please accept the installation licence to continue
> Task :app:clean
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig
> Task :app:javaPreCompileDebug
> Task :app:checkDebugAarMetadata
> Task :app:processDebugNavigationResources
> Task :app:generateDebugResValues
> Task :app:compileDebugNavigationResources
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :app:packageDebugResources
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:mergeDebugResources
> Task :app:parseDebugLocalResources
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets
> Task :app:desugarDebugFileDependencies
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeExtDexDebug
> Task :app:mergeLibDexDebug
> Task :app:mergeDebugJavaResource
> Task :app:compressDebugAssets
> Task :app:validateSigningDebug
> Task :app:writeDebugAppMetadata
> Task :app:writeDebugSigningConfigVersions
> Task :app:preDebugAndroidTestBuild SKIPPED
> Task :app:processDebugAndroidTestManifest
> Task :app:generateDebugAndroidTestBuildConfig
> Task :app:javaPreCompileDebugAndroidTest
> Task :app:checkDebugAndroidTestAarMetadata
> Task :app:processDebugAndroidTestNavigationResources
> Task :app:compileDebugAndroidTestNavigationResources
> Task :app:generateDebugAndroidTestResValues
> Task :app:mapDebugAndroidTestSourceSetPaths
> Task :app:generateDebugAndroidTestResources
> Task :app:mergeDebugAndroidTestResources
> Task :app:mergeDebugAndroidTestShaders
> Task :app:compileDebugAndroidTestShaders NO-SOURCE
> Task :app:generateDebugAndroidTestAssets UP-TO-DATE
> Task :app:mergeDebugAndroidTestAssets
> Task :app:desugarDebugAndroidTestFileDependencies
> Task :app:processDebugAndroidTestJavaRes NO-SOURCE
> Task :app:checkDebugAndroidTestDuplicateClasses
> Task :app:compressDebugAndroidTestAssets
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:validateSigningDebugAndroidTest
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:writeDebugAndroidTestSigningConfigVersions
> Task :app:preReleaseBuild UP-TO-DATE
> Task :app:mergeReleaseJniLibFolders
> Task :app:mergeReleaseNativeLibs NO-SOURCE
> Task :app:stripReleaseDebugSymbols NO-SOURCE
> Task :app:extractReleaseNativeSymbolTables NO-SOURCE
> Task :app:mergeReleaseNativeDebugMetadata NO-SOURCE
> Task :app:checkReleaseDuplicateClasses
> Task :app:generateReleaseBuildConfig
> Task :app:javaPreCompileRelease
> Task :app:checkReleaseAarMetadata
> Task :app:processReleaseNavigationResources
> Task :app:compileReleaseNavigationResources
> Task :app:generateReleaseResValues
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:packageReleaseResources
> Task :app:parseReleaseLocalResources
> Task :app:createReleaseCompatibleScreenManifests
> Task :app:extractDeepLinksRelease
> Task :app:processReleaseMainManifest
> Task :app:mergeReleaseResources
> Task :app:processReleaseManifest
> Task :app:desugarReleaseFileDependencies
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
> Task :app:mergeExtDexRelease
> Task :app:processReleaseManifestForPackage
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseShaders
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:processDebugAndroidTestResources
> Task :app:mergeReleaseAssets
> Task :app:extractReleaseVersionControlInfo
> Task :app:extractProguardFiles
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:processReleaseResources
> Task :app:mergeReleaseJavaResource
> Task :app:compressReleaseAssets

> Task :app:compileReleaseJavaWithJavac

> Task :app:dexBuilderRelease
> Task :app:mergeReleaseGlobalSynthetics
> Task :app:generateReleaseLintVitalReportModel
> Task :app:mergeDexRelease
> Task :app:compileReleaseArtProfile
> Task :app:collectReleaseDependencies
> Task :app:sdkReleaseDependencyData
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:processDebugManifestForPackage
> Task :app:optimizeReleaseResources
> Task :app:processDebugResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:generateDebugLintReportModel
> Task :app:mergeProjectDexDebug
> Task :app:bundleDebugClassesToCompileJar
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics
> Task :app:generateDebugAndroidTestLintModel
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:lintAnalyzeDebugUnitTest
> Task :app:lintVitalAnalyzeRelease
> Task :app:lintVitalReportRelease
> Task :app:lintVitalRelease
> Task :app:packageRelease
> Task :app:createReleaseApkListingFileRedirect
> Task :app:assembleRelease
> Task :app:lintAnalyzeDebugAndroidTest
> Task :app:lintAnalyzeDebug

> Task :app:lintReportDebug
Wrote HTML report to file:///<progetto>/android/app/build/reports/lint-results-debug.html

> Task :app:lintDebug

[Incubating] Problems report is available at: file:///<progetto>/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 50s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### Controllo APK reale — exit 0

```json
{
  "result": "PASS",
  "version": "0.2.3",
  "minAndroid": 10,
  "permissions": [],
  "legalFilesIdentical": true,
  "localDictionary": true,
  "localPdfWorker": true,
  "privateKeyInApk": false,
  "signed": false,
  "installable": false
}
```

## 4. Cosa funziona (provato)

APK debug nell’emulatore: avvio offline senza permesso Internet e round trip DOCX/XLSX passati. Mammoth legge il testo aggiunto nel DOCX; ExcelJS legge B2=701/B3=2 nello XLSX reale esportato. AndroidTest compilato; nessun permesso o chiave nel release unsigned; licenze, worker PDF e dizionario locali presenti. Queste verifiche non provano il rendering PDF Android.

## 5. Cosa NON funziona o non hai potuto provare

Il PDF non si apre nella run osservata; non si dichiara Android pronto. La diagnostica nuova deve ancora girare in CI. Markdown, Informazioni/tema, appunti e verifica finale rete/originali non raggiunti. Nessun telefono/tablet fisico, tastiera software, installazione release firmato su dispositivo, aggiornamento in luogo o provider cloud collaudato. Stampe e Word→PDF Android assenti. APK non pubblicato. Nessuna modifica alla Release desktop 0.2.3.

## 6. Bug e dubbi

AND-010 verificato sulle due celle e negli export. AND-011 aperto: causa del rifiuto PDF non ancora dimostrata; nessun cambio di motore o aggiornamento indiscriminato. La diagnosi non copia contenuto dei documenti reali: legge esclusivamente un campione originale dell’APK di test. Firma privata fuori Git; APK release firmato precedente ancora non collaudato integralmente. Esiti fisici non dedotti dall’emulatore.

## 7. Hash dei commit

Applicazione Android 9421c6a355ccd335fcc1fe22ade4eed4de9a533b. Ultimo test osservato 491202025b2b4f5d9bd4eb9d4dea6e133d13bef0. Hash di questo passo ottenibile dopo il commit con git log -1 --format=%H -- docs/report/2026-11-27_2050_android-diagnostica-pdf.md. La CI del nuovo commit è ancora da osservare al momento della scrittura.

## 8. Prossimo passo

Leggere l’errore preciso del PDF dalla nuova CI e correggere solo la causa dimostrata; completare tutti otto i casi, parsing indipendente dei quattro export e hash degli originali prima della consegna come APK collaudato. Nessuna Release/tag Android creati.
