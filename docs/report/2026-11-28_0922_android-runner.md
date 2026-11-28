# Correzione del punto di ingresso del test Android

## 1. Obiettivo

Correggere la CI Android del commit 6bcefd6f00ce4d8bca8b393ef24c2c6c8988a416 prima della pubblicazione autorizzata.

## 2. Cosa hai fatto

- Letti i log reali: https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46124354250 fallita. Nove casi nativi PASS e file esportati verificati; fase successiva fallisce «Unable to find instrumentation info».
- Controllato il manifesto AndroidTest realmente generato: AGP conserva un solo instrumentation con il runner configurato. Il secondo elemento non era un secondo punto d’ingresso effettivo.
- SmokeInstrumentation ora inoltra tre modalità esplicite del solo APK di test (install/verify/online) al codice già presente. Rimosso il manifesto aggiuntivo non efficace; android-smoke usa il runner realmente registrato. Tutte le prove/asserzioni restano richieste, nessuna sostituzione con adb install dell’aggiornamento.
- CHANGELOG, BUG, VALIDATION e CI aggiornati, report e ULTIMO identici. Nessuna modifica al runtime/APK release, desktop o dipendenze. Non toccati LICENSE, motori, bozze/rapporto tester e Release pubblica.

## 3. Esiti reali di build e test

Il primo fallimento CI non viene contato come successo. Estratto esatto:

```text
2026-11-28T08:12:40.6641582Z AssertionError [ERR_ASSERTION]: The input did not match the regular expression /USER_CONFIRMATION_REQUIRED/. Input:
2026-11-28T08:12:40.6641994Z 
2026-11-28T08:12:40.6642701Z 'INSTRUMENTATION_STATUS: Error=Unable to find instrumentation info for: ComponentInfo{it.cosmonet.cosmoffice.test/it.cosmonet.cosmoffice.UpdateInstallInstrumentation}\n' +
2026-11-28T08:12:40.6643539Z   'INSTRUMENTATION_STATUS: id=ActivityManagerService\n' +
2026-11-28T08:12:40.6643972Z   'INSTRUMENTATION_STATUS_CODE: -1\n' +
2026-11-28T08:12:40.6644716Z   'onError: commandError=true message=INSTRUMENTATION_FAILED: it.cosmonet.cosmoffice.test/it.cosmonet.cosmoffice.UpdateInstallInstrumentation\n' +
2026-11-28T08:12:40.6645858Z   'android.util.AndroidException: INSTRUMENTATION_FAILED: it.cosmonet.cosmoffice.test/it.cosmonet.cosmoffice.UpdateInstallInstrumentation\n' +
2026-11-28T08:12:40.6646598Z   '\tat com.android.commands.am.Instrument.run(Instrument.java:543)\n' +
2026-11-28T08:12:40.6647096Z   '\tat com.android.commands.am.Am.runInstrument(Am.java:213)\n' +
2026-11-28T08:12:40.6647549Z   '\tat com.android.commands.am.Am.onRun(Am.java:85)\n' +
2026-11-28T08:12:40.6648031Z   '\tat com.android.internal.os.BaseCommand.run(BaseCommand.java:62)\n' +
2026-11-28T08:12:40.6648506Z   '\tat com.android.commands.am.Am.main(Am.java:54)\n' +
2026-11-28T08:12:40.6648994Z   '\tat com.android.internal.os.RuntimeInit.nativeFinishInit(Native Method)\n' +
2026-11-28T08:12:40.6649830Z   '\tat com.android.internal.os.RuntimeInit.main(RuntimeInit.java:369)\n'
2026-11-28T08:12:40.6650116Z 
2026-11-28T08:12:40.6650394Z     at file:///home/runner/work/CosmOffice/CosmOffice/scripts/android-smoke.mjs:93:8 {
2026-11-28T08:12:40.6650831Z   generatedMessage: true,
2026-11-28T08:12:40.6651091Z   code: 'ERR_ASSERTION',
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
✓ built in 1.45s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Release Android: manifest coerente, stesso package e chiave, URL solo progetto (1.585ms)
✔ Release Android: note derivate dal solo CHANGELOG, complete e senza confondere desktop (0.6003ms)
✔ Compatibilità Android: Promise assente, risoluzione/rifiuto e sottoclassi (3.0986ms)
✔ Compatibilità Android: API esistente preservata, installazione idempotente (1.0044ms)
✔ Compatibilità Android: costruttori non validi rifiutati (2.2256ms)
✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (15.8859ms)
✔ Android: soli permessi di rete aggiornamenti e installazione confermata, nessuno storage esteso (9.0817ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (106.2288ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (92.8156ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (168.6862ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (235.5335ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (37.7213ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (61.3429ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (54.7799ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (45.0895ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (8.696ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (1.3199ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (51.207ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (14.4323ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (149.3653ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (135.189ms)
✔ unknown formulas retain their source without exporting a misleading cached number (27.8586ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (5.1459ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (23.5732ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (19.1768ms)
✔ landscape DOCX uses a physically wider page with matching orientation (14.948ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (17.9756ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (283.8433ms)
✔ references, arithmetic, precedence and percentages (5.0374ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0527ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.8027ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.2366ms)
✔ Excel address limits and column naming (1.4851ms)
✔ conditional sums, lookups, text, dates and error handling (6.6318ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.707ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (2.5067ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.0775ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (2.4231ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.9981ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.4356ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.755ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (13.1249ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (293.7461ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (116.7327ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (31.6987ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (122.038ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (66.6462ms)
✔ Release corrente: note complete per la versione realmente distribuita (8.3676ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (5.4413ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (121.5653ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.2499ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (102.0823ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (187.7157ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (63.8718ms)
✔ damaged files and mismatched Office extensions are rejected before import (21.0404ms)
✔ unsupported parts produce specific warnings without changing the original file (57.2296ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (20.9461ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (17.3798ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (1288.4499ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (2737.7225ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (4.9536ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.9416ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.922ms)
✔ TLS Node: errore di certificato senza fallback (0.7213ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (24.1848ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (2.7762ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (133.7109ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (6.143ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (2.2295ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (152.8416ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.3686ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.8388ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (21.0065ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (34.2213ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (7.4874ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (4.0796ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (20.9541ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.7833ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (52.8176ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (8.1846ms)
ℹ tests 80
ℹ suites 0
ℹ pass 80
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 4666.3384
```

### npm run test:browser — exit 0

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs && node scripts/android-browser-smoke.mjs

09:15:28 [vite] (client) page reload android/build/reports/problems/problems-report.html
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
09:15:52 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
09:17:50 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:02.60
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
> Task :app:processDebugAndroidTestManifest
> Task :app:generateDebugAndroidTestBuildConfig
> Task :app:javaPreCompileDebugAndroidTest UP-TO-DATE
> Task :app:checkDebugAndroidTestAarMetadata UP-TO-DATE
> Task :app:processDebugAndroidTestNavigationResources UP-TO-DATE
> Task :app:compileDebugAndroidTestNavigationResources UP-TO-DATE
> Task :app:generateDebugAndroidTestResValues UP-TO-DATE
> Task :app:mapDebugAndroidTestSourceSetPaths UP-TO-DATE
> Task :app:generateDebugAndroidTestResources UP-TO-DATE
> Task :app:mergeDebugAndroidTestResources UP-TO-DATE
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
> Task :app:processDebugAndroidTestResources
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

BUILD SUCCESSFUL in 23s
117 actionable tasks: 22 executed, 95 up-to-date
Note: V:\CosmonetOffice\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

## 4. Cosa funziona, provato

Compilazione del test corretto, lint e sedici controlli locali verdi. Nove casi dell’app passati nella CI precedente, compresi hash/certificato/timer/annullamento; export verificati indipendentemente. Nuovo runner da provare in CI dopo il push. Desktop del commit 6bcefd6: https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46124354242, tutti sei i lavori completed/success, compresa installazione NSIS nel runner.

## 5. Cosa NON funziona o non hai potuto provare

Prima CI updater rossa e pubblicazione ancora non eseguita. Installazione reale e probe live non ancora raggiunti. Telefono fisico, aggiornamento con firma di distribuzione e conferma del PDF sul telefono ancora non provati. AND-014 rimane aperto. Periodici solo in primo piano, non background/app chiusa.

## 6. Bug e dubbi

Difetto di registrazione del test, non prova di un guasto al trasporto o all’installazione. Corretto dopo verifica del manifesto prodotto; attendere risultato della nuova esecuzione. Le prove non sono state indebolite. Nessuna nuova fonte o codice esterno: solo log/manifesto locale del nostro test.

## 7. Hash del commit

Implementazione: 6bcefd6f00ce4d8bca8b393ef24c2c6c8988a416. Il commit di questo report è ricavabile con git log -1 --format=%H -- docs/report/2026-11-28_0922_android-runner.md; verrà citato nell’audit successivo. Hash proprio non inventato.

## 8. Prossimo passo

Leggere nuova CI completa. Solo dopo verde, confrontare l’unsigned CI e pubblicare APK/manifesto/checksum/note; controllare download anonimi e latest desktop invariato.
