# Preparazione dei campioni Android e prima CI

## 1. Obiettivo

Correggere l’accesso ai campioni nell’emulatore senza cambiare i permessi dell’app o simulare il selettore. La prima run Android è rossa: non è ancora un APK dichiarato collaudato.

## 2. Cosa hai fatto

- scripts/android-smoke.mjs: staging tramite adb in /data/local/tmp, copia in Download come shell, SHA-256 di ogni campione prima dell’installazione. Diagnostica storage se la copia fallisce. Nessun root, chmod o permesso aggiunto a CosmOffice.
- CHANGELOG.md, docs/BUG.md (AND-005), VALIDATION.md e CI.md: primo fallimento e stato reale dei lavori. Report timestamp e ULTIMO.md identici.
- Nessuna modifica a src/, electron/, al progetto nativo Android, ai motori, alle dipendenze, alle condizioni LICENSE o ai pacchetti pubblici 0.2.3. Chiave privata sempre esterna al repository; nessun caricamento in Secrets.

## 3. Esiti reali di build e test

**Desktop commit 9421c6a355ccd335fcc1fe22ade4eed4de9a533b: tutti sei lavori success**, inclusi interop, Windows/Linux/Mac e installazione/disinstallazione NSIS reale nel runner: [46009717586](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717586). Osservati completati, non dedotti dal YAML.

**Android dello stesso commit: failure**, [46009717455](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717455), [job 140541829584](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717455/job/140541829584). Build/lint e ispezione APK passati; adb push fermato prima dell’installazione. Nessuna delle otto prove native eseguita. Estratto esatto del fallimento; log completo nel job e localmente in test-results/android/ci-9421.log.

```text
2026-11-27T13:47:30.5026906Z tests/fixtures/01-testo-stili.docx: 1 file pushed, 0 skipped. 86.0 MB/s (9657 bytes in 0.000s)
2026-11-27T13:47:30.5034466Z adb: error: failed to copy 'tests/fixtures/01-testo-stili.docx' to '/sdcard/Download/android-write.docx': remote couldn't create file: Operation not permitted
2026-11-27T13:47:30.5076617Z node:internal/errors:986
2026-11-27T13:47:30.5077604Z   const err = new Error(message);
2026-11-27T13:47:30.5162767Z               ^
2026-11-27T13:47:30.5169612Z
2026-11-27T13:47:30.5170680Z Error: Command failed: adb push tests/fixtures/01-testo-stili.docx /sdcard/Download/android-write.docx
2026-11-27T13:47:30.5172442Z tests/fixtures/01-testo-stili.docx: 1 file pushed, 0 skipped. 86.0 MB/s (9657 bytes in 0.000s)
2026-11-27T13:47:30.5183271Z adb: error: failed to copy 'tests/fixtures/01-testo-stili.docx' to '/sdcard/Download/android-write.docx': remote couldn't create file: Operation not permitted
2026-11-27T13:47:30.5184844Z
2026-11-27T13:47:30.5185408Z     at genericNodeError (node:internal/errors:986:15)
2026-11-27T13:47:30.5186712Z     at wrappedFn (node:internal/errors:540:14)
2026-11-27T13:47:30.5187734Z     at checkExecSyncError (node:child_process:943:11)
2026-11-27T13:47:30.5188582Z     at execFileSync (node:child_process:979:15)
2026-11-27T13:47:30.5189644Z     at run (file:///home/runner/work/CosmOffice/CosmOffice/scripts/android-smoke.mjs:10:26)
2026-11-27T13:47:30.5190947Z     at file:///home/runner/work/CosmOffice/CosmOffice/scripts/android-smoke.mjs:19:39 {
2026-11-27T13:47:30.5192288Z   status: 1,
2026-11-27T13:47:30.5192877Z   signal: null,
2026-11-27T13:47:30.5193418Z   output: [
2026-11-27T13:47:30.5193917Z     null,
2026-11-27T13:47:30.5194410Z     '',
2026-11-27T13:47:30.5195398Z     'tests/fixtures/01-testo-stili.docx: 1 file pushed, 0 skipped. 86.0 MB/s (9657 bytes in 0.000s)\n' +
2026-11-27T13:47:30.5197366Z       "adb: error: failed to copy 'tests/fixtures/01-testo-stili.docx' to '/sdcard/Download/android-write.docx': remote couldn't create file: Operation not permitted\n"
2026-11-27T13:47:30.5198749Z   ],
2026-11-27T13:47:30.5199235Z   pid: 3980,
2026-11-27T13:47:30.5199742Z   stdout: '',
2026-11-27T13:47:30.5200789Z   stderr: 'tests/fixtures/01-testo-stili.docx: 1 file pushed, 0 skipped. 86.0 MB/s (9657 bytes in 0.000s)\n' +
2026-11-27T13:47:30.5203198Z     "adb: error: failed to copy 'tests/fixtures/01-testo-stili.docx' to '/sdcard/Download/android-write.docx': remote couldn't create file: Operation not permitted\n"
2026-11-27T13:47:30.5204602Z }
2026-11-27T13:47:30.5204949Z
2026-11-27T13:47:30.5205327Z Node.js v24.22.3
2026-11-27T13:47:30.5209341Z ##[error]The process '/usr/bin/sh' failed with exit code 1
2026-11-27T13:47:30.5211569Z
```

**Nuova correzione: 16 controlli locali tutti exit 0**, 75 test unitari passati. Non è la prova funzionale della copia sul runner: questa avverrà dopo il push. Gli smoke indipendenti hanno usato profili separati. Sotto gli output integrali (ANSI, percorsi personali e soli spazi finali normalizzati). Nessuna nuova dipendenza; notices rigenerati senza differenze.

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
✓ built in 1.15s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (11.1819ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (3.2294ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (82.9195ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (85.5378ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (146.388ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (210.6699ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (31.5381ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (37.0792ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (46.04ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (29.355ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (7.2089ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.5916ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (41.5833ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.0843ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (119.6818ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (97.8891ms)
✔ unknown formulas retain their source without exporting a misleading cached number (15.7057ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.5995ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (25.1239ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.392ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.5081ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (13.2546ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (179.9437ms)
✔ references, arithmetic, precedence and percentages (6.2466ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7952ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7612ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.593ms)
✔ Excel address limits and column naming (1.496ms)
✔ conditional sums, lookups, text, dates and error handling (5.826ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6728ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.5255ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7968ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.7668ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.7249ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.6142ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (1.3769ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (7.4237ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (247.5151ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (44.7318ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (14.0636ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (154.5824ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (21.0488ms)
✔ Release corrente: note complete per la versione realmente distribuita (6.4583ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (4.0208ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (60.599ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.93ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (41.3976ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (135.7319ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (37.3602ms)
✔ damaged files and mismatched Office extensions are rejected before import (16.8268ms)
✔ unsupported parts produce specific warnings without changing the original file (38.4357ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (16.0836ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (21.3411ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (886.8323ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1928.9892ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.8873ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.6168ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.7225ms)
✔ TLS Node: errore di certificato senza fallback (0.6901ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (18.825ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (2.9524ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (133.7837ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.1968ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (2.053ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (150.9053ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.3668ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.2039ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (16.0162ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (20.8122ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (6.7221ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.4227ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (20.6758ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.7181ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (28.4674ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (5.6082ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3308.8239
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
14:53:06 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
14:55:07 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:02.81
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

## 4. Cosa funziona (provato)

Build/app desktop e controlli locali sopra. CI desktop completa, compresa NSIS installata nel runner. APK release compilato, permessi assenti, risorse e licenze incluse, firma e checksum verificati nel passo precedente. Codice app identico a 9421c6a: APK locale firmato SHA-256 07372fc9caaea80f50b95e96bb142cbacf206d20eb2854fb59cfc8e608471079, certificato 32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e.

## 5. Cosa NON funziona o non hai potuto provare

Il test Android precedente non prepara i campioni in Download. La nuova preparazione non è stata ancora osservata nell’emulatore: niente dichiarazione di successo nativo. APK non pubblicato, nessun tag. Telefono/tablet fisico, tastiera e gesti, provider cloud, poco spazio/memoria, aggiornamento Android in luogo e crash reali non provati. Stampa e conversione Word→PDF assenti su Android, limite bridge 10 MB. Registro Android per renderer/promise, non raccolta delle eccezioni Java fatali.

## 6. Bug e dubbi

AND-005 aperto: causa precisa del rifiuto del servizio adbd non dimostrata. Staging più copia shell evita il percorso di scrittura diretta che è fallito; deve essere verificato, mantenendo selettore e filesystem reali. Il codice dell’app e i suoi permessi non cambiano. Sul Windows locale HypervisorPlatform non è attivo: non abilitato né richiesto un riavvio; si usa il runner. Limiti fisici desktop restano invariati. Nessuna scelta del motore o idea dello studio.

## 7. Hash dei commit

Implementazione Android: 9421c6a355ccd335fcc1fe22ade4eed4de9a533b, pubblicata su main. Correzione test di questo report: git log -1 --format=%H -- docs/report/2026-11-27_1500_android-storage-ci.md; hash comunicato dopo il push (autoreferenza non possibile nel contenuto).

## 8. Prossimo passo

Leggere la nuova CI Android e correggere gli eventuali errori reali. Finché non passa, APK soltanto compilato/firmato, non collaudato. Dopo il collaudo nativo resta necessaria la prova su telefono fisico e il backup privato della chiave. Release desktop 0.2.3 invariata.
