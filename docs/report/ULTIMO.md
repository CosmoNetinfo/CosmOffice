# Android: immissione delle celle e raccolta dei file parziali

## 1. Obiettivo

Verificare l’effettiva modifica delle celle prima di attribuire un errore al salvataggio. Continuare il collaudo Android mantenendo reali selettore, filesystem e controlli di integrità.

## 2. Cosa hai fatto

- SmokeInstrumentation.java: attesa della finestra in primo piano, focus del WebView, selezione della cella verificata, eventi di tastiera e Enter del normale editor; B2=701 e B3=2 controllati prima dell’export e dopo la riapertura. Markdown usa la stessa immissione. Sono eventi di tastiera della instrumentation, non una prova della tastiera software del telefono. Word resta modificato via DOM.
- scripts/android-smoke.mjs: file esportati raccolti anche dopo errore della instrumentation; stato del recupero registrato. In caso positivo tutti devono provenire dalla run corrente, evitando file vecchi; parser host controlla anche B3. Nessun file esportato generato dal test al posto dell’app.
- CHANGELOG.md, docs/BUG.md (AND-010), VALIDATION.md, CI.md, report e ULTIMO.md. Nessuna dipendenza aggiunta, notices rigenerati invariati.
- Non toccati: codice app src/, electron/, Android/main/resources, motori, licenze, versione e Release pubblica. Chiave sempre privata, APK firmato locale invariato.

## 3. Esiti reali di build e test

7e9f9c75a0c2d8c406ce43c8235a105b497f4752: [Android 46053874675](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874675) **failure sul terzo caso**, dopo Home e DOCX round trip PASS. XLSX salvato e riaperto, ma B2 non risulta 701. La cattura precedente all’export mostra A1 selezionata e i valori originali (fixture B2=125.5, B3=80), quindi il driver non aveva applicato l’immissione attesa. Non si dichiara un difetto di persistenza del prodotto sulla sola base di questo test.

Artifact ZIP SHA-256 9d01451e062e1d43317a4d2736f4b1d4a2cd8041d35ad038ef4682939026b452 verificato contro GitHub; Home, Word, Grid, errore e selettore PNG recuperati. Home ora disegnata; Word riaperto con testo aggiunto. Dati reali:

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
INSTRUMENTATION_STATUS: stack=java.lang.AssertionError: Attesa scaduta: document.querySelector('[aria-label="Cella B2"]')?.value==='701'
INSTRUMENTATION_STATUS: test=XLSX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: -2
INSTRUMENTATION_RESULT: cosmoffice=FAIL
INSTRUMENTATION_RESULT: stream=
FAIL Android: java.lang.AssertionError: Attesa scaduta: document.querySelector('[aria-label="Cella B2"]')?.value==='701'

INSTRUMENTATION_CODE: -1

```

```text
total 92
-rw-rw---- 1 u0_a195 media_rw  6680 2026-11-27 19:06 android-grid-salvato.xlsx
-rw-rw---- 1 u0_a195 media_rw  6523 2026-11-27 19:05 android-grid.xlsx
-rw-rw---- 1 u0_a195 media_rw 32126 2026-11-27 19:05 android-view.pdf
-rw-rw---- 1 u0_a195 media_rw  9883 2026-11-27 19:06 android-write-salvato.docx
-rw-rw---- 1 u0_a195 media_rw  9657 2026-11-27 19:05 android-write.docx

```

[Desktop 46053874698](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874698): tutti sei i lavori completed/success osservati, inclusa installazione/disinstallazione NSIS nel runner. Le precedenti CI desktop f48c5b9/46051701838, 427942b/46016839517, d3f9aef/46012068280 e 9421c6a/46009717586 osservate con sei success. a57fed7/46014692885 cancelled, non verde.

**16 controlli locali tutti exit 0**, più build/test/Playwright ripetuti dopo la modifica e compilazione APK/lint Android. 75 test unitari passati. La nuova immissione nativa deve ancora essere osservata nella CI. Output integrali, normalizzati soltanto ANSI/percorsi personali/spazi finali:

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
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:processDebugManifestForPackage
> Task :app:compressDebugAndroidTestAssets
> Task :app:checkDebugAndroidTestDuplicateClasses
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:validateSigningDebugAndroidTest
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
> Task :app:createReleaseCompatibleScreenManifests
> Task :app:extractDeepLinksRelease
> Task :app:parseReleaseLocalResources
> Task :app:processReleaseMainManifest
> Task :app:processReleaseManifest
> Task :app:desugarReleaseFileDependencies
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
> Task :app:mergeReleaseResources
> Task :app:mergeExtDexRelease
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseShaders
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:processDebugAndroidTestResources
> Task :app:processDebugResources
> Task :app:mergeReleaseAssets

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:extractReleaseVersionControlInfo
> Task :app:extractProguardFiles
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:collectReleaseDependencies
> Task :app:bundleDebugClassesToCompileJar
> Task :app:mergeReleaseJavaResource
> Task :app:sdkReleaseDependencyData
> Task :app:mergeProjectDexDebug
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:compressReleaseAssets
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:generateDebugAndroidTestLintModel
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:processReleaseManifestForPackage
> Task :app:processReleaseResources

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
> Task :app:lintAnalyzeDebug
> Task :app:packageRelease
> Task :app:createReleaseApkListingFileRedirect
> Task :app:assembleRelease

> Task :app:lintReportDebug
Wrote HTML report to file:///<progetto>/android/app/build/reports/lint-results-debug.html

> Task :app:lintDebug

[Incubating] Problems report is available at: file:///<progetto>/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 22s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
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
✓ built in 1.11s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (12.8638ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (3.2794ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (65.255ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (73.3829ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (128.1475ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (181.6006ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (27.8944ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (38.4364ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (39.8626ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (24.9547ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (4.8832ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.5775ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (36.7809ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (5.0639ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (100.278ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (78.6443ms)
✔ unknown formulas retain their source without exporting a misleading cached number (11.9717ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.5515ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (17.854ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (12.7856ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.6563ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.5455ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (153.209ms)
✔ references, arithmetic, precedence and percentages (5.1847ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7956ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.6973ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.9358ms)
✔ Excel address limits and column naming (1.2358ms)
✔ conditional sums, lookups, text, dates and error handling (3.5517ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6145ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.3888ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9759ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6034ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.2234ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.0856ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.9871ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (6.7452ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (250.4408ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (42.8722ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.4648ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (134.0249ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (20.6939ms)
✔ Release corrente: note complete per la versione realmente distribuita (7.1065ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.2145ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (59.4363ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.8896ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (46.6872ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (113.7237ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (36.3783ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.6791ms)
✔ unsupported parts produce specific warnings without changing the original file (31.6986ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (16.1449ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (14.9206ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (820.2053ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1748.255ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.9217ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.6117ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.3311ms)
✔ TLS Node: errore di certificato senza fallback (1.1426ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (17.462ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.9184ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (131.2921ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.2418ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.7898ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (151.416ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.0681ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.2092ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (16.1256ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (22.9655ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (6.1765ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.6381ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (19.8786ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.6785ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (23.5409ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (5.4175ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3044.0238
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
20:05:52 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
20:07:48 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:02.04
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

✓ built in 1.08s
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

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (15.1673ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (4.4187ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (84.5146ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (68.6252ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (132.9906ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (185.6432ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (29.115ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (32.3175ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (39.3501ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (24.987ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (7.3419ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.8459ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (37.6098ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.2532ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (99.8196ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (75.1283ms)
✔ unknown formulas retain their source without exporting a misleading cached number (14.5554ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.3217ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.7634ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.1188ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.7716ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (13.1762ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (161.0302ms)
✔ references, arithmetic, precedence and percentages (4.2413ms)
✔ Italian aliases, absolute references, text and lazy IF (1.2009ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.0978ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.0579ms)
✔ Excel address limits and column naming (1.4033ms)
✔ conditional sums, lookups, text, dates and error handling (4.3881ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5604ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.3823ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8291ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5601ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.7198ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.0184ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.8035ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (6.0717ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (243.706ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (43.7963ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.6255ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (108.4398ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (18.3292ms)
✔ Release corrente: note complete per la versione realmente distribuita (8.4058ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.8907ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (66.5586ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.1892ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (41.1339ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (122.1541ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (34.9919ms)
✔ damaged files and mismatched Office extensions are rejected before import (9.6128ms)
✔ unsupported parts produce specific warnings without changing the original file (31.3582ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.9926ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.7076ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (875.1582ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1813.1158ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.9135ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.2327ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.6466ms)
✔ TLS Node: errore di certificato senza fallback (0.6615ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (17.0172ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.4301ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (134.6034ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (2.9278ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.6123ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (150.7629ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (1.9762ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.1266ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (15.3389ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (21.6297ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.1916ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (2.9542ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (20.7015ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.6904ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (27.7591ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.6664ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3139.6655
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
PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
20:18:24 [vite] (client) [console.warn] Warning: Indexing all PDF objects
20:20:22 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID
```

## 4. Cosa funziona (provato)

APK debug installato nell’emulatore, Home/permessi e DOCX apertura/modifica/salvataggio/riapertura PASS. File DOCX salvato di 9883 byte, XLSX salvato di 6680 byte; per lo XLSX il cambiamento richiesto non era stato applicato dal driver prima del salvataggio. Catture recuperate e attesa del disegno migliorata. Build, firma locale e risorse restano verificate: APK release SHA-256 07372fc9caaea80f50b95e96bb142cbacf206d20eb2854fb59cfc8e608471079, codice app invariato.

## 5. Cosa NON funziona o non hai potuto provare

XLSX modificato/riaperto con valori richiesti ancora da verificare; nuova immissione e raccolta parziale non ancora osservate nella CI. PDF/MD/appunti non raggiunti nella sesta run. Telefono/tablet fisico, tastiera software, gesti nell’editor, installazione del release firmato sul telefono, aggiornamento in luogo e provider cloud non provati. Release firmato verificato con apksigner, prove emulatorie debug. Nessun APK pubblico/tag, stampa e Word→PDF Android assenti.

## 6. Bug e dubbi

AND-010 resta da verificare: il nuovo controllo prima dell’export distingue mancata immissione da possibile perdita nel salvataggio. Non è stato allentato il risultato atteso: ora si controllano due celle, prima/dopo e col parser. Tutti otto i casi, sette screenshot e hash degli originali restano obbligatori. Warning Java/Gradle e due warning lint conservati. Nessuna modifica del motore o idea dello studio. Chiave non caricata in GitHub.

## 7. Hash dei commit

APK: 9421c6a355ccd335fcc1fe22ade4eed4de9a533b. Test successivi: d3f9aefb46c261619e75eda4475a127f8e3560ca, a57fed7a7361fe9ad72dd1c7485a50978d5d7a52, 427942bf689be5b1cb9ecfa4805cc962ff1559e2, f48c5b9eaa3434e1e2fb0a89bd890c88b32c30ef, 7e9f9c75a0c2d8c406ce43c8235a105b497f4752. Questo passo: git log -1 --format=%H -- docs/report/2026-11-27_2023_android-immissione-celle.md; hash dopo il push.

## 8. Prossimo passo

Leggere la nuova CI e i file eventualmente recuperati anche in caso di fallimento; completare XLSX, PDF, Markdown, appunti e confronti finali. Prima di consegnare l’APK come collaudato servono tutti otto i casi e gli originali invariati. Release desktop 0.2.3 immutata.
