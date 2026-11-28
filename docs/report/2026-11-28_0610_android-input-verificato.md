# Android: sequenza di input verificabile

## 1. Obiettivo

Continuare il collaudo dell’APK e isolare l’immissione nativa instabile prima di dichiarare Android collaudato.

## 2. Cosa hai fatto

- SmokeInstrumentation.java: Ctrl+A nativo, selezione confermata, cancellazione nativa e campo vuoto confermato, digitazione e valore atteso; poi blur con il normale handler della cella e nuovo controllo. Tolti DOM select seguito immediatamente da tasti e spostamento tramite Enter. Restano controlli B2/B3 pre/post e parser sui file esportati; nessun accesso diretto al modello.
- Diagnostica solo nell’APK di test: pagina espressa in booleani, focus, tag, lunghezza e intervallo selezionato; nessun contenuto dei campi, nessun dato privato. La diagnostica non entra nel rapporto dei tester o nel release.
- Test rete: accetta soltanto rifiuto della richiesta oppure esatta risposta locale 403/Blocked prevista dal WebViewClient; qualunque risposta ordinaria fallisce. Nessun permesso Internet, rete guest spenta e host estraneo invariati. Non equipara errori HTTP generici a blocco e non prova un contatto esterno.
- Aggiornati CHANGELOG.md, docs/BUG.md, CI.md, VALIDATION.md, questo report e ULTIMO.md.
- Non toccati src/, electron/, Android/main, motori, licenze, dipendenze, versione/tag e Release desktop pubblica. Nessuna modifica del prodotto per ottenere un risultato di test.

## 3. Esiti reali di build e test

32232a6a1e804ea13460127d4d40b506a266f42f: [desktop 46063967642](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46063967642) tutti sei i lavori completed/success osservati, inclusa installazione/disinstallazione NSIS. [Android 46063967606](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46063967606) failure durante input B3=2, prima dell’export XLSX. Home e DOCX PASS. Screenshot finale nella Home: causa precisa dell’uscita dall’editor non dimostrata, non attribuita al salvataggio. Nessuna perdita di dati dichiarata su questa sola evidenza.

Artifact SHA-256 66ad4177c286334a53f5f5768f13bebd4b3d28d581eddf64ba75108befec0192 uguale a GitHub, estratti soltanto emulator/ e log principali, evitando collisioni con le icone. Log reale:

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
INSTRUMENTATION_STATUS: stack=java.lang.AssertionError: Attesa scaduta: document.querySelector('[aria-label="Cella B3"]').value==="2"
INSTRUMENTATION_STATUS: test=XLSX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: -2
INSTRUMENTATION_RESULT: cosmoffice=FAIL
INSTRUMENTATION_RESULT: stream=
FAIL Android: java.lang.AssertionError: Attesa scaduta: document.querySelector('[aria-label="Cella B3"]').value==="2"

INSTRUMENTATION_CODE: -1

```

Tutti 16 controlli locali exit 0, 75 test unitari. Gradle debug/test/release e lint riusciti; esecuzione nativa del driver nuovo ancora da osservare. Output integrali con soli ANSI/percorsi personali/spazi finali normalizzati:

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
✓ built in 1.42s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (14.419ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (4.1764ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (106.1853ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (90.5612ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (158.2005ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (222.3629ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (36.3548ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (30.8493ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (28.9852ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (23.374ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.1875ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.6085ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (44.0188ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.3811ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (137.211ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (125.8882ms)
✔ unknown formulas retain their source without exporting a misleading cached number (19.5002ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.8847ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.9024ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.7736ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.159ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.951ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (231.057ms)
✔ references, arithmetic, precedence and percentages (3.9842ms)
✔ Italian aliases, absolute references, text and lazy IF (0.8758ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7696ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.4812ms)
✔ Excel address limits and column naming (1.4179ms)
✔ conditional sums, lookups, text, dates and error handling (3.9488ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.659ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.497ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8431ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.7523ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.4296ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (3.1463ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (1.1769ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.5042ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (247.7579ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (32.6827ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (8.0839ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (130.9351ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (15.8359ms)
✔ Release corrente: note complete per la versione realmente distribuita (6.4593ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.6881ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (69.2197ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.8422ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (38.9214ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (157.0875ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (55.7089ms)
✔ damaged files and mismatched Office extensions are rejected before import (15.6003ms)
✔ unsupported parts produce specific warnings without changing the original file (46.973ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (14.8528ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (13.1815ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (841.6265ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1917.5559ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.4201ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (3.8526ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.4086ms)
✔ TLS Node: errore di certificato senza fallback (1.115ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (19.9238ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.0104ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (132.8211ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.3765ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.8558ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (151.0544ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.6201ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.1955ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (18.7252ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (21.9993ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (6.2604ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.3079ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (24.0137ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.7752ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (26.2485ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (3.9013ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3750.5877
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
06:04:06 [vite] (client) [console.warn] Warning: Indexing all PDF objects
06:04:06 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/dictionaries/CC-BY-SA-2.0.html
06:04:06 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/index.html
06:04:07 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
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
06:04:23 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
06:04:23 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
06:04:24 [vite] (client) page reload android/build/reports/problems/problems-report.html
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
06:06:12 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
  <progetto>\scripts\openxml-validator\OpenXmlCheck.csproj ripristinato (in 642 ms).
  OpenXmlCheck -> <progetto>\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.
    Avvisi: 0
    Errori: 0

Tempo trascorso 00:00:05.46
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

### Gradle APK e lint della versione definitiva del test — exit 0

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
> Task :app:processDebugManifestForPackage
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
> Task :app:processDebugResources
> Task :app:compressDebugAndroidTestAssets
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:processDebugAndroidTestResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:checkDebugAndroidTestDuplicateClasses
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
> Task :app:mergeProjectDexDebug
> Task :app:bundleDebugClassesToCompileJar
> Task :app:processReleaseNavigationResources
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:compileReleaseNavigationResources
> Task :app:generateReleaseResValues
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:packageReleaseResources
> Task :app:createReleaseCompatibleScreenManifests
> Task :app:extractDeepLinksRelease
> Task :app:mergeReleaseResources
> Task :app:parseReleaseLocalResources
> Task :app:processReleaseMainManifest
> Task :app:processReleaseManifest
> Task :app:desugarReleaseFileDependencies
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
> Task :app:mergeExtDexRelease
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseShaders
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:mergeReleaseAssets
> Task :app:extractReleaseVersionControlInfo
> Task :app:extractProguardFiles
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:mergeReleaseJavaResource
> Task :app:collectReleaseDependencies
> Task :app:sdkReleaseDependencyData
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:generateDebugAndroidTestLintModel
> Task :app:processReleaseManifestForPackage
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:processReleaseResources
> Task :app:compressReleaseAssets

> Task :app:compileReleaseJavaWithJavac

> Task :app:dexBuilderRelease
> Task :app:mergeReleaseGlobalSynthetics
> Task :app:generateReleaseLintVitalReportModel
> Task :app:mergeDexRelease
> Task :app:compileReleaseArtProfile
> Task :app:optimizeReleaseResources
> Task :app:lintAnalyzeDebugUnitTest
> Task :app:lintAnalyzeDebugAndroidTest
> Task :app:lintVitalAnalyzeRelease
> Task :app:lintVitalReportRelease
> Task :app:lintVitalRelease
> Task :app:packageRelease
> Task :app:createReleaseApkListingFileRedirect
> Task :app:assembleRelease
> Task :app:lintAnalyzeDebug

> Task :app:lintReportDebug
Wrote HTML report to file:///<progetto>/android/app/build/reports/lint-results-debug.html

> Task :app:lintDebug

[Incubating] Problems report is available at: file:///<progetto>/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 25s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

## 4. Cosa funziona (provato)

Build/test/browser/Open XML e smoke locali verdi. CI desktop 32232a6 con sei success. Nella precedente f60184a tentativo 2: DOCX/XLSX/PDF round trip nativi, SDK zero errori sui veri export Office, PDF 90° e contenuto visivo verificati con Poppler; questi risultati restano circoscritti a quella prova. APK release firmato locale verificato separatamente, SHA-256 c40f3cf514cdab01be0f443d1dc9df2d80330e187401b96c03d3f0e630e58084, chiave privata esterna a Git e mai caricata.

## 5. Cosa NON funziona o non hai potuto provare

Il test completo Android resta rosso; nuova sequenza ancora da osservare. Markdown e passaggi successivi non raggiunti in quest’ultima run. Non si dichiara risolto un eventuale problema dell’immissione reale: causa precisa ancora non isolata e nessun fix nel prodotto. Telefono/tablet fisico, tastiera software, gesti, installazione/aggiornamento del release firmato sul telefono, Android 10/16, provider cloud, prestazioni e rotazione schermo non provati. Stampe e Word→PDF Android assenti; APK non pubblicato. Release desktop 0.2.3 immutata.

## 6. Bug e dubbi

AND-013 aperto: immissione del driver non stabile, distinguere da un difetto reale di input. Nessuna cancellazione di un controllo dati o prova aggirata: ora selezione, vuoto e conferma sono verificati separatamente. AND-012 titolo Markdown corretto ma ancora non esercitato fino a quel passo in questa run. AND-011 PDF già verificato sul campione 01 nella run precedente, non certifica ogni PDF reale. Warning SDK/Java/Gradle presenti nei log e non nascosti.

## 7. Hash dei commit

APK originario 9421c6a355ccd335fcc1fe22ade4eed4de9a533b; compatibilità PDF f60184ad5bd1fe01e583a71e847ffb181152d150; ultimo test 32232a6a1e804ea13460127d4d40b506a266f42f. Hash di questo passo: git log -1 --format=%H -- docs/report/2026-11-28_0610_android-input-verificato.md. Nuova CI ancora da osservare dopo il push.

## 8. Prossimo passo

Osservare i nuovi dati sul focus e completare tutti otto i casi, con quattro export controllati, sette schermate e originali invariati. Se l’immissione resta instabile, isolare il difetto senza attribuirlo a dati persi o dichiarare Android pronto. Prova fisica distinta, chiave da conservare per gli aggiornamenti.
