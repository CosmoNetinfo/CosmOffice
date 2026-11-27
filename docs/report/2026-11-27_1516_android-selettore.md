# Test Android: attesa del selettore e raccolta delle prove

## 1. Obiettivo

Rendere corretta la guida del vero selettore Android e conservare le schermate della prova. Nessuna sostituzione dei dialoghi o del filesystem con risposte simulate.

## 2. Cosa hai fatto

- android/app/src/androidTest/java/it/cosmonet/cosmoffice/SmokeInstrumentation.java: attesa esplicita di DocumentsUI prima della ricerca dei controlli. Prima poteva trovare l’EditText del titolo/celle dentro l’app; rischio individuato nel codice, da verificare con la nuova run. Screenshot nei file privati di test.
- scripts/android-smoke.mjs: recupero screenshot da files/smoke tramite run-as; sette screenshot obbligatori se la prova dichiara PASS. Elenco Download raccolto nel solo emulatore, contenente i nostri campioni.
- CHANGELOG.md, docs/BUG.md, VALIDATION.md, CI.md e report corrente. Correzione documentale: il report precedente elencava CI.md, ma quell’inserimento non era avvenuto a causa dei CRLF; ora è effettivamente aggiornato.
- Codice app Android, src/, electron/, motori, licenze, dipendenze, versione e Release pubblica **non modificati**. Solo test e documentazione.

## 3. Esiti reali di build e test

Seconda run Android, commit d3f9aefb46c261619e75eda4475a127f8e3560ca: [46012068702](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068702), **failure**. Lo staging corretto supera i tre SHA-256; APK installato, Home e permessi PASS. DOCX aperto e modificato, esportazione arriva alla conferma; il test non trova android-write-salvato.docx per riaprirlo. Non si dichiara riuscito il round trip.

Artifact verifiche-Android scaricato e confrontato col digest GitHub f1c0ff8e8c239412cf5306ca767adc485e7c2ccfc0d95ca8a3f7acdcc8dc96ae: contiene log e lint, **nessuno screenshot**. Non sono state inventate immagini della prova. Log completo locale in test-results/android/ci-d3f9.log; estratto reale:

```text
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
2026-11-27T14:05:35.4482217Z INSTRUMENTATION_STATUS: current=1
2026-11-27T14:05:35.4483130Z INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
2026-11-27T14:05:35.4483924Z INSTRUMENTATION_STATUS: numtests=8
2026-11-27T14:05:35.4484739Z INSTRUMENTATION_STATUS: test=Avvio APK e permessi offline
2026-11-27T14:05:35.4485559Z INSTRUMENTATION_STATUS_CODE: 1
2026-11-27T14:05:35.4486555Z INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
2026-11-27T14:05:35.4487744Z INSTRUMENTATION_STATUS: current=1
2026-11-27T14:05:35.4488383Z INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
2026-11-27T14:05:35.4488957Z INSTRUMENTATION_STATUS: numtests=8
2026-11-27T14:05:35.4489622Z INSTRUMENTATION_STATUS: test=Avvio APK e permessi offline
2026-11-27T14:05:35.4490305Z INSTRUMENTATION_STATUS_CODE: 0
2026-11-27T14:05:35.4491138Z INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
2026-11-27T14:05:35.4492252Z INSTRUMENTATION_STATUS: current=2
2026-11-27T14:05:35.4492926Z INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
2026-11-27T14:05:35.4493520Z INSTRUMENTATION_STATUS: numtests=8
2026-11-27T14:05:35.4494155Z INSTRUMENTATION_STATUS: test=DOCX apri modifica salva riapri
2026-11-27T14:05:35.4494760Z INSTRUMENTATION_STATUS_CODE: 1
2026-11-27T14:05:35.4495953Z INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
2026-11-27T14:05:35.4496658Z INSTRUMENTATION_STATUS: current=2
2026-11-27T14:05:35.4497221Z INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
2026-11-27T14:05:35.4497877Z INSTRUMENTATION_STATUS: numtests=8
2026-11-27T14:05:35.4499124Z INSTRUMENTATION_STATUS: stack=java.lang.AssertionError: Controllo del selettore Android non trovato: android-write-salvato.docx
2026-11-27T14:05:35.4500361Z INSTRUMENTATION_STATUS: test=DOCX apri modifica salva riapri
2026-11-27T14:05:35.4501305Z INSTRUMENTATION_STATUS_CODE: -2
2026-11-27T14:05:35.4502271Z INSTRUMENTATION_RESULT: cosmoffice=FAIL
2026-11-27T14:05:35.4502935Z INSTRUMENTATION_RESULT: stream=
2026-11-27T14:05:35.4504007Z FAIL Android: java.lang.AssertionError: Controllo del selettore Android non trovato: android-write-salvato.docx
2026-11-27T14:05:35.4504647Z
2026-11-27T14:05:35.4504948Z INSTRUMENTATION_CODE: -1
```

CI desktop 9421c6a: [46009717586](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717586), sei lavori success osservati, inclusa NSIS installata/disinstallata. Per d3f9aef, [46012068280](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068280): tutti sei i lavori osservati completed/success prima del push, inclusa installazione/disinstallazione NSIS nel runner.

16 controlli locali nuovamente tutti exit 0, più compilazione APK/test APK e lint. 75 test unitari passati. NSIS non ricostruita in questo passo: app e risorse invariate, verificato lo stesso pacchetto reale del passo precedente. Output integrali sotto (ANSI, percorsi personali e soli spazi finali normalizzati).

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
> Task :app:processDebugManifestForPackage
> Task :app:mergeExtDexDebug
> Task :app:mergeLibDexDebug
> Task :app:mergeDebugJavaResource
> Task :app:stripDebugDebugSymbols NO-SOURCE
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
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:compressDebugAndroidTestAssets
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:validateSigningDebugAndroidTest
> Task :app:writeDebugAndroidTestSigningConfigVersions
> Task :app:preReleaseBuild UP-TO-DATE
> Task :app:processDebugResources
> Task :app:mergeReleaseJniLibFolders
> Task :app:processDebugAndroidTestResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:mergeReleaseNativeLibs NO-SOURCE
> Task :app:stripReleaseDebugSymbols NO-SOURCE
> Task :app:extractReleaseNativeSymbolTables NO-SOURCE
> Task :app:mergeReleaseNativeDebugMetadata NO-SOURCE
> Task :app:checkReleaseDuplicateClasses
> Task :app:generateReleaseBuildConfig
> Task :app:javaPreCompileRelease
> Task :app:checkReleaseAarMetadata
> Task :app:bundleDebugClassesToCompileJar
> Task :app:processReleaseNavigationResources
> Task :app:mergeProjectDexDebug
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
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:processReleaseManifestForPackage
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

BUILD SUCCESSFUL in 23s
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
✓ built in 1.09s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (13.6079ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (3.8419ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (71.3478ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (64.4991ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (119.8592ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (172.236ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (25.8015ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (35.016ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (34.8176ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (22.2128ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.4532ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.5209ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (33.974ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (5.2507ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (91.949ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (76.4348ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.3874ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.7983ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (17.0876ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.347ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.5143ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (10.8158ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (137.9173ms)
✔ references, arithmetic, precedence and percentages (5.553ms)
✔ Italian aliases, absolute references, text and lazy IF (0.8475ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7163ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6508ms)
✔ Excel address limits and column naming (1.2896ms)
✔ conditional sums, lookups, text, dates and error handling (4.5301ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5412ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4307ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7528ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5741ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.4336ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.6286ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.6989ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (7.9658ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (225.7448ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (43.0922ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.4788ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (87.8676ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (19.9536ms)
✔ Release corrente: note complete per la versione realmente distribuita (8.1593ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.3283ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (54.3865ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.6489ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (37.4713ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (107.8409ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (31.8431ms)
✔ damaged files and mismatched Office extensions are rejected before import (13.221ms)
✔ unsupported parts produce specific warnings without changing the original file (33.5734ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.274ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.3666ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (833.8287ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1797.5433ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.8989ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (3.5374ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.6824ms)
✔ TLS Node: errore di certificato senza fallback (1.0292ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (16.346ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.3518ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (128.207ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.5268ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.684ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (151.7977ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.2074ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.2799ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (16.7655ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (23.2357ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (7.0037ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.509ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (20.4742ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.7427ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (26.5747ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.2539ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3073.4116
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
15:06:47 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/index.html
15:06:47 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/dictionaries/CC-BY-SA-2.0.html
15:06:48 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
15:06:49 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/index.html
15:06:50 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/dictionaries/CC-BY-SA-2.0.html
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
15:07:02 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
15:07:02 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
15:07:02 [vite] (client) page reload android/build/reports/problems/problems-report.html
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
15:08:51 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:02.13
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

Preparazione campioni con hash esatti; APK installato nell’emulatore e Home/assenza permesso Internet PASS. Prima apertura/modifica DOCX raggiunte nella run; il suo salvataggio non ancora verificato tramite riapertura. Firma APK locale e controlli di byte/licenze dal passo precedente restano validi: codice app immutato, SHA-256 APK firmato 07372fc9caaea80f50b95e96bb142cbacf206d20eb2854fb59cfc8e608471079. Controlli desktop locali tutti verdi.

## 5. Cosa NON funziona o non hai potuto provare

La precedente riapertura del DOCX nel test fallisce. Screenshot non recuperati nella seconda run, ora raccolta corretta ma da verificare. XLSX, PDF, MD e appunti nativi non raggiunti: non dichiarati riusciti. Nuova run necessaria prima di definire collaudato l’APK. Telefono/tablet fisico, tastiera/gesti, aggiornamento Android in luogo e risorse limitate non provati. Nessun tag o APK pubblico. Stampa/Word→PDF Android assenti. Chiave privata non caricata in GitHub, né inclusa nel pacchetto.

## 6. Bug e dubbi

AND-005 chiuso soltanto per la preparazione (hash e installazione provati). AND-006/007 ancora da verificare nella nuova run. Il test poteva modificare il titolo anziché il nome nel selettore: ipotesi coerente con il fallimento, non prova di perdita dati dell’app. L’elenco Download e le schermate rendono verificabile il prossimo esito. Warning Gradle/API Java e due warning lint rimangono; nessun controllo soppresso. Nessuna modifica del motore o idea nuova dello studio.

## 7. Hash dei commit

- 9421c6a355ccd335fcc1fe22ade4eed4de9a533b: APK e progetto Android.
- d3f9aefb46c261619e75eda4475a127f8e3560ca: preparazione campioni, prima run nativa eseguita.
- Questo passo: git log -1 --format=%H -- docs/report/2026-11-27_1516_android-selettore.md; hash comunicato dopo il push.

## 8. Prossimo passo

Leggere il nuovo collaudo Android con attesa del selettore, poi correggere gli eventuali errori reali. Solo dopo PASS consegnare l’APK come provato nell’emulatore; restano test su telefono fisico. Release desktop 0.2.3 e aggiornamenti Windows invariati.
