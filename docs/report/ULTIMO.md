# Android: verificare gli esiti del selettore e il disegno delle schermate

## 1. Obiettivo

Correggere la regressione introdotta nel driver del test e fotografare l’app solo dopo il disegno. Nessuna dichiarazione di salvataggio riuscito senza riapertura e confronto dei file.

## 2. Cosa hai fatto

- SmokeInstrumentation.java: ripristinate azioni di accessibilità sul vero DocumentsUI; il tocco a coordinate aggiunto nel passo precedente non selezionava il file in questo layout. È una regressione del mio test, non una modifica dell’app.
- Il booleano immediato di ACTION_CLICK non determina il successo: dopo l’attivazione il test deve vedere editor o conferma di export con **nome esatto**, poi riaprire il file. Tutti i confronti finali restano obbligatori; nessun output atteso scritto dal test al posto dell’app.
- Screenshot: idle nativo, VisualStateCallback WebView e due frame per le schermate dell’app; catture del selettore diagnostiche. La Home bianca osservata non viene pubblicata come anteprima.
- CHANGELOG.md, docs/BUG.md, VALIDATION.md, CI.md, report e ULTIMO.md aggiornati. Nessuna modifica a src/, electron/, app Android/main/resources, motori, licenze, versione, chiave o Release. Nessuna dipendenza aggiunta; notices rigenerati invariati.

## 3. Esiti reali di build e test

[f48c5b9 / Android 46051701831](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701831): **failure**, primo DOCX non raggiunge document-page. Screenshot errore letto: DocumentsUI ancora aperto con i tre campioni; il tocco non ha attivato l’apertura. Home PNG letto: immagine bianca, pur con DOM disponibile. Quella cattura non prova la resa visiva della Home. Estratto reale:

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
INSTRUMENTATION_STATUS: stack=java.lang.AssertionError: Attesa scaduta: document.querySelector('.document-page')
INSTRUMENTATION_STATUS: test=DOCX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: -2
INSTRUMENTATION_RESULT: cosmoffice=FAIL
INSTRUMENTATION_RESULT: stream=
FAIL Android: java.lang.AssertionError: Attesa scaduta: document.querySelector('.document-page')

INSTRUMENTATION_CODE: -1

```

Artifact ZIP SHA-256 4dc480a9164ab29c6cf467e8f412b897e421182ed6542258582e9ab83f137210 confrontato e coincidente con GitHub. File presenti: log, readiness, Downloads, Home/errore PNG, lint; niente screenshot Word in questa run.

[Desktop dello stesso commit 46051701838](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701838): **sei lavori completed/success osservati**, inclusa NSIS installata/disinstallata nel runner. Anche 427942b/46016839517, d3f9aef/46012068280 e 9421c6a/46009717586 osservati con sei success. a57fed7 desktop 46014692885 cancelled, non verde.

Nuovo passo: **16 controlli locali tutti exit 0**, 75 test unitari passati, più Gradle/lint Android. Questa correzione del driver deve ancora passare nella CI. Output integrali sotto (ANSI, percorsi personali e spazi finali normalizzati).

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
> Task :app:processDebugManifestForPackage
> Task :app:compressDebugAssets
> Task :app:mergeDebugJavaResource
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeExtDexDebug
> Task :app:mergeLibDexDebug
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
> Task :app:processDebugResources
> Task :app:compressDebugAndroidTestAssets
> Task :app:processDebugAndroidTestResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:desugarDebugAndroidTestFileDependencies
> Task :app:processDebugAndroidTestJavaRes NO-SOURCE
> Task :app:checkDebugAndroidTestDuplicateClasses
> Task :app:mergeDebugAndroidTestJavaResource
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
> Task :app:processReleaseMainManifest
> Task :app:parseReleaseLocalResources
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
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:collectReleaseDependencies
> Task :app:mergeReleaseJavaResource
> Task :app:sdkReleaseDependencyData
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:generateDebugAndroidTestLintModel
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
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

BUILD SUCCESSFUL in 21s
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
✓ built in 1.12s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (12.909ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (4.1688ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (71.1124ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (69.2409ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (119.4082ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (171.7571ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (27.3017ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (35.1497ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (38.5901ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (24.4875ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.9616ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7319ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (39.1753ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.7771ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (100.2912ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (77.3423ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.1034ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.9938ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (15.8569ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.4494ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.7031ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.5713ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (153.1637ms)
✔ references, arithmetic, precedence and percentages (4.4572ms)
✔ Italian aliases, absolute references, text and lazy IF (1.1533ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7506ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6587ms)
✔ Excel address limits and column naming (1.2232ms)
✔ conditional sums, lookups, text, dates and error handling (4.2049ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.517ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.3644ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9031ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.986ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.2275ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.2584ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.8358ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.5871ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (234.4772ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (39.8566ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (9.8976ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (90.0522ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (17.9429ms)
✔ Release corrente: note complete per la versione realmente distribuita (9.2916ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.2327ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (56.0803ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.9512ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (37.1903ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (114.0806ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (38.5758ms)
✔ damaged files and mismatched Office extensions are rejected before import (8.9184ms)
✔ unsupported parts produce specific warnings without changing the original file (31.9099ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (14.5538ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (14.9831ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (837.3666ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1797.5916ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.0753ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.6931ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.8429ms)
✔ TLS Node: errore di certificato senza fallback (0.6214ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (19.2127ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.2755ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (122.6092ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.1231ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.7812ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (150.8132ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.3175ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.1053ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (15.4708ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (21.7033ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.1642ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.2183ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (19.1757ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.6084ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (27.5266ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.1418ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3087.5079
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
19:52:19 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
19:54:17 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:02.60
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

Build e controlli locali sopra. Nelle run precedenti: attesa storage esercitata dopo un rifiuto reale, campioni con SHA corretti, APK installato e prima apertura/modifica DOCX con azione di accessibilità; screenshot Word reale recuperato. Nella quinta run non è stato aperto il documento. Firma release verificata localmente; codice app invariato, APK firmato SHA-256 07372fc9caaea80f50b95e96bb142cbacf206d20eb2854fb59cfc8e608471079.

## 5. Cosa NON funziona o non hai potuto provare

Nuovo driver/esiti/frame non ancora osservati in CI. Round trip DOCX, XLSX/PDF/MD e appunti nativi ancora non dichiarati riusciti. Telefono/tablet fisico, tastiera/gesti dell’editor, installazione del release firmato sul telefono, aggiornamento in luogo e provider cloud non provati. Build emulatorie debug; release firmato controllato con apksigner, non installato sul dispositivo. Stampa e Word→PDF Android assenti. Nessun APK pubblico/tag.

## 6. Bug e dubbi

AND-009: regressione del driver a coordinate, ripristino da verificare. AND-008: l’acknowledgement del click può non corrispondere all’esito; questa è un’inferenza coerente con screenshot precedente, non prova di un bug del prodotto. Il PASS richiede conferma nominativa, riapertura, parser, sette screenshot e originali SHA invariati. Nessun controllo di contenuto o integrità soppresso. Warning Java/Gradle e due warning lint restano. Nessuna scelta del motore; chiave fuori Git/CI.

## 7. Hash dei commit

APK: 9421c6a355ccd335fcc1fe22ade4eed4de9a533b. Preparazione e test successivi: d3f9aefb46c261619e75eda4475a127f8e3560ca, a57fed7a7361fe9ad72dd1c7485a50978d5d7a52, 427942bf689be5b1cb9ecfa4805cc962ff1559e2, f48c5b9eaa3434e1e2fb0a89bd890c88b32c30ef. Questo passo: git log -1 --format=%H -- docs/report/2026-11-27_2002_android-esito-selettore.md; hash dopo il push.

## 8. Prossimo passo

Leggere il nuovo collaudo Android e completare gli otto casi con file realmente esportati e originali invariati. Solo allora consegnare l’APK come provato nell’emulatore, mantenendo esplicite le prove fisiche mancanti. Release desktop 0.2.3 immutata.
