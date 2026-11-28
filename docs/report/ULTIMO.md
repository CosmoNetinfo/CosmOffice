# Android build 3: aggiornamenti e preparazione Release

## 1. Obiettivo

Su richiesta «Fallo», preparare pubblicazione dell’APK corretto e aggiornamenti Android. Desktop pubblico immutato. Pubblicazione soltanto dopo lettura della nuova CI verde.

## 2. Cosa hai fatto

- Trasporto originale AndroidUpdater/UpdatePolicy/ModernTlsFactory/UpdateInstallReceiver, ponte MainActivity e manifest con i soli INTERNET e REQUEST_INSTALL_PACKAGES. HTTPS certificato/hostname di piattaforma, TLS 1.2/1.3. Host runtime: github.com e release-assets.githubusercontent.com; repository CosmoNetinfo/CosmOffice e CDN percorso 1466711071. Nessuna rete del WebView/service worker.
- Impostazioni Android: manuale, annulla, automatici opt-in ogni sei ore solo in primo piano, default spento con preferenza nativa separata. Nessuna richiesta immediata all’avvio/attivazione. Stato aggiornamenti locale coerente con il rapporto tester; nessuna nuova raccolta o dato libero.
- Prima dell’installazione: salvataggio bozze, SHA-256/dimensione, package, versione superiore e stesso certificato; conferma app e installatore Android. Nessun aggiornamento silenzioso.
- VersionCode 3, versione 0.2.3. Fixture debug futura codice 4 solo nei test. Nove casi CI, installazione reale e conservazione di quattro bozze e tema, probe GitHub reale e zero byte UID all’avvio. Prove aggiunte, ancora da eseguire nell’emulatore al momento di questo commit.
- Scripts android-policy-test, android-release-data, android-publish-local; test JVM, browser e release. Pubblicatore richiede main pulito, due CI verdi sullo stesso commit e confronto unsigned CI, poi pubblica APK firmato/manifesto/checksum con make_latest=false e riscarica senza login. Credenziale Git solo in memoria, chiave privata mai trasmessa.
- README, CHANGELOG Android, ANDROID, AGGIORNAMENTI, DECISIONI, ROADMAP, BUG, VALIDATION, CI, CODICE-STUDIATO e questo report. Nessuna dipendenza aggiunta; notices rigenerato e invariato.
- Non toccati LICENSE e condizioni, electron/, motori DOCX/XLSX/PDF, contenuti della Prova guidata/rapporto tester, pacchetti desktop o Release pubblica v0.2.3.

## 3. Esiti reali di build e test

CI precedente commit 045cea6: desktop https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46119064190 success con sei lavori. Android https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46119064203: primo tentativo fallito per ANR Pixel Launcher sopra DocumentsUI, cattura controllata; secondo tentativo success con otto casi. Non è la prova dell’updater nuovo.

Le seguenti uscite sono reali. Il TypeError CONTENUTO_PRIVATO_ANDROID è l’errore simulato del test privacy. I FAIL del validatore su file volutamente errati e sulla copia storica sono i controlli negativi attesi; tutti i tredici nuovi esportati passano. Nessun errore nascosto né test indebolito.

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
✓ built in 1.14s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Release Android: manifest coerente, stesso package e chiave, URL solo progetto (1.2226ms)
✔ Release Android: note derivate dal solo CHANGELOG, complete e senza confondere desktop (0.5688ms)
✔ Compatibilità Android: Promise assente, risoluzione/rifiuto e sottoclassi (3.1383ms)
✔ Compatibilità Android: API esistente preservata, installazione idempotente (1.0446ms)
✔ Compatibilità Android: costruttori non validi rifiutati (1.6213ms)
✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (9.6493ms)
✔ Android: soli permessi di rete aggiornamenti e installazione confermata, nessuno storage esteso (5.6981ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (91.0878ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (77.8518ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (141.2391ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (201.912ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (26.5378ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (27.1657ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (24.9711ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (21.9795ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.652ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (1.1703ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (43.7331ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (3.3004ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (124.6791ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (99.316ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.9336ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.4064ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (17.0867ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (9.9431ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.6741ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.0326ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (208.4944ms)
✔ references, arithmetic, precedence and percentages (4.4493ms)
✔ Italian aliases, absolute references, text and lazy IF (0.8692ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.6817ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.0565ms)
✔ Excel address limits and column naming (1.3606ms)
✔ conditional sums, lookups, text, dates and error handling (3.6928ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5423ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.3757ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7594ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (1.0996ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.7968ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.7859ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.9352ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (6.7339ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (254.41ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (32.4098ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (7.9637ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (120.6649ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (14.8903ms)
✔ Release corrente: note complete per la versione realmente distribuita (8.0626ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.3257ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (53.9062ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.9522ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (40.4755ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (152.5962ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (48.8294ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.6641ms)
✔ unsupported parts produce specific warnings without changing the original file (34.4914ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (12.71ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.595ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (670.413ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1875.7747ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.075ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (5.3304ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.7362ms)
✔ TLS Node: errore di certificato senza fallback (0.6196ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (15.1569ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (2.7139ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (129.8302ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (2.9301ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.5946ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (152.0542ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (1.6078ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (0.82ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (13.8396ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (19.7064ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (4.2393ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (2.9972ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (16.7038ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.4625ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (20.9029ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (3.3128ms)
ℹ tests 80
ℹ suites 0
ℹ pass 80
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3404.1567
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
08:59:02 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
09:00:59 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:04.75
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

### Primo test Android fallito, interruttore da correggere

```text
08:38:30 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

locator.check: Clicking the checkbox did not change its state
Call log:
  - waiting for getByRole('checkbox', { name: 'Aggiornamenti automatici Android' })
    - locator resolved to <input type="checkbox" aria-label="Aggiornamenti automatici Android"/>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action
    - click action done
    - waiting for scheduled navigations to finish
    - navigations have finished

    at V:\CosmonetOffice\scripts\android-browser-smoke.mjs:65:82 {
  log: [
    "  - waiting for getByRole('checkbox', { name: 'Aggiornamenti automatici Android' })",
    '    - locator resolved to <input type="checkbox" aria-label="Aggiornamenti automatici Android"/>',
    '  - attempting click action',
    '    - waiting for element to be visible, enabled and stable',
    '    - element is visible, enabled and stable',
    '    - scrolling into view if needed',
    '    - done scrolling',
    '    - performing click action',
    '    - click action done',
    '    - waiting for scheduled navigations to finish',
    '    - navigations have finished'
  ],
  name: 'Error'
}

Node.js v26.13.1
```

### Secondo test, attesa ACK da correggere

```text
08:42:56 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

true !== false

    at file:///V:/CosmonetOffice/scripts/android-browser-smoke.mjs:67:10 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: true,
  expected: false,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.13.1
```

### Android browser dopo correzione

```text
08:44:45 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### Politica JVM e TLS

```text
PASS policy Android: HTTPS TLS 1.2+, due host, solo repository, asset coerenti, redirect estranei bloccati e scelta del codice superiore.
```

### Regressione PDF con API assenti

```text
PASS PDF senza Promise.withResolvers in pagina/worker: 01-testo.pdf
PASS PDF senza Promise.withResolvers in pagina/worker: 02-scansione.pdf
PASS PDF senza Promise.withResolvers in pagina/worker: 03-venti-pagine.pdf
PASS asset Android di produzione senza URL.parse e Promise.withResolvers; API assente anche nel vero worker PDF, senza fake worker. PDF renderizzato, ruotato, esportato e riaperto; 90 gradi verificati, zero richieste esterne. Porta nativa simulata: non è il test APK.
```

### Gradle fixture futura

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

BUILD SUCCESSFUL in 13s
35 actionable tasks: 11 executed, 24 up-to-date
Note: V:\CosmonetOffice\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### Gradle applicazione e lint

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
> Task :app:processDebugManifestForPackage
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
> Task :app:processDebugResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics UP-TO-DATE
> Task :app:bundleDebugClassesToCompileJar UP-TO-DATE
> Task :app:mergeProjectDexDebug
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics UP-TO-DATE
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:generateDebugAndroidTestLintModel
> Task :app:generateDebugLintReportModel UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel UP-TO-DATE
> Task :app:lintAnalyzeDebug UP-TO-DATE
> Task :app:lintAnalyzeDebugUnitTest UP-TO-DATE
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect UP-TO-DATE
> Task :app:assembleDebugAndroidTest
> Task :app:lintAnalyzeDebugAndroidTest
> Task :app:lintReportDebug UP-TO-DATE
> Task :app:lintDebug

[Incubating] Problems report is available at: file:///V:/CosmonetOffice/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 19s
117 actionable tasks: 19 executed, 98 up-to-date
Note: V:\CosmonetOffice\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### Controllo APK reale

```text
{
  "result": "PASS",
  "version": "0.2.3",
  "androidVersionCode": 3,
  "minAndroid": 10,
  "permissions": [
    "INTERNET",
    "REQUEST_INSTALL_PACKAGES"
  ],
  "legalFilesIdentical": true,
  "localDictionary": true,
  "localPdfWorker": true,
  "compatiblePdfApiAndWorker": true,
  "promiseCompatibilityInPageAndWorker": true,
  "privateKeyInApk": false,
  "signed": false,
  "installable": false
}
```

### Firma e checksum APK

```text
{
  "result": "PASS",
  "version": "0.2.3",
  "signed": true,
  "certificateSha256": "32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e",
  "apkSha256": "fbf21e2a3487bcf2ffc8cf8b3507846786132a535fb9c391996b46683987ba95",
  "unsignedSha256": "e17554796e0fde62db4d70b7c8e232b0446dd71b23add03a94990f3bd3f4b0aa",
  "privateKeyUploaded": false,
  "physicalDeviceTested": false
}
APK firmato: CosmOffice-0.2.3-android-e17554796e0f.apk
```

## 4. Cosa funziona, provato

Sedici comandi locali verdi, 80 unitari, browser Android con ponte dichiaratamente simulato; tre PDF senza API reali pagina/worker, Gradle fixture/app/test/release e lint, politica Java e TLS. APK reale firmato e verificato. SHA-256 APK: fbf21e2a3487bcf2ffc8cf8b3507846786132a535fb9c391996b46683987ba95. Unsigned: e17554796e0fde62db4d70b7c8e232b0446dd71b23add03a94990f3bd3f4b0aa. Certificato: 32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e. Stessa chiave delle build precedenti. Nessun segreto pubblicato.

## 5. Cosa NON funziona o non hai potuto provare

La nuova CI partirà dopo il push: installazione PackageInstaller e probe live non dichiarati passati. Pubblicazione APK non ancora eseguita in questo report. Emulatore non disponibile localmente; non abilitate funzionalità di virtualizzazione o riavvii del computer. Telefono fisico, aggiornamento con chiave di distribuzione, permessi/varianti produttore, tastiera e gesti non provati. Attesa conferma PDF sul telefono segnalato. I periodici non operano in background o ad app chiusa. Nessuna firma/approvazione Google Play. La prova debug 3→4 non equivale alla firma di produzione su telefono.

## 6. Bug noti o dubbi

AND-014 resta aperto: alcune catture mostrano un frame precedente. Primo test checkbox fallito per ACK asincrono: corretto controllo UI e poi attesa esplicita nel test, senza eliminare asserzioni. Warning Gradle/API deprecate conservati negli output; strumenti locali indicano platform-tools/licenze SDK mancanti ma i task necessari sono riusciti. Limiti documentali e trasferimento 10 MB restano. Il probe reale proverà l’elenco Release; il download di un aggiornamento futuro reale richiederà una versione successiva pubblica.

Fonti: https://developer.android.com/reference/android/content/pm/PackageInstaller.SessionParams#setRequireUserAction(int), https://docs.github.com/en/rest/releases/releases#create-a-release; riferimenti firma/WebView/AGP già elencati in CODICE-STUDIATO. Documentazione API, nessun algoritmo copiato. Nessuna idea dello studio né scelta di motore.

## 7. Hash del commit

Base: 045cea6c6e98ea6c88a384418a610424053402a7. Il commit contenente questo report è identificabile con git log -1 --format=%H -- docs/report/2026-11-28_0907_android-aggiornamenti.md; non inserisco un hash futuro inventato o autoreferenziale. Verrà riportato nell’audit successivo alla CI/pubblicazione.

## 8. Prossimo passo consigliato

Leggere entrambe le CI del commit; correggere ogni difetto. Solo dopo verde, confrontare l’APK unsigned CI, firmare lo stesso payload e pubblicare Release Android ordinaria con checksum/manifesto/note italiane; verificare download senza accesso e latest desktop immutato. Poi prova sul telefono, senza disinstallare e dopo esportazione di copie dei documenti importanti.
