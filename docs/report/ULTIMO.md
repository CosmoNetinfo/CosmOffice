# Prima implementazione APK Android — collaudo in corso

## 1. Obiettivo

Realizzare l’APK Android richiesto e generare la nuova chiave privata autorizzata. Non dichiarare concluso il collaudo nativo prima della run. Base main 4992738e12ecb82c321b9eed541664d7bb8f6213: CI [45641580516](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45641580516) osservata completed/success il 27 novembre 2026. Nessun tag o modifica alla Release desktop pubblica.

## 2. Cosa hai fatto

- android/: progetto nativo originale Java, manifest senza permessi Internet/storage/installazione, backup OS disattivato, asset locali WebView, selettore Android per apertura e copia, limite 10 MB, appunti, Indietro/tema e fallback renderer. Icona dal nostro suite.svg.
- src/android.mjs, files.mjs, App.jsx, preferences.jsx, SettingsPage.jsx, About.jsx, PdfViewer.jsx, debug.mjs: adattamento della piattaforma; stesso motore Office/PDF, controlli stampa/PDF da Word esclusi soltanto in Android, rapporto filtrato persistente locale.
- scripts/android-prepare.mjs, android-check-apk.mjs, android-sign.mjs, android-smoke.mjs, android-browser-smoke.mjs; tests/android.test.mjs; package.json e .gitignore; .github/workflows/android.yml: preparazione, verifica, firma locale, regressione frontend e otto prove native CI.
- README.md, docs/ANDROID.md, DECISIONI.md, ROADMAP.md, BUG.md, VALIDATION.md, ricerca/CODICE-STUDIATO.md, CHANGELOG.md e report: esiti e limiti. scripts/notices.mjs eseguito: nessuna nuova dipendenza runtime, THIRD_PARTY_NOTICES.txt invariato. Nessun sorgente esterno copiato.
- Chiave privata RSA-4096 fuori Git, protetta con ACL; password non mostrata né caricata in CI. APK firmato e sidecar SHA-256 locali. Certificato pubblico 32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e. APK SHA-256 07372fc9caaea80f50b95e96bb142cbacf206d20eb2854fb59cfc8e608471079.

## 3. Esiti reali di build e test

16 comandi finali desktop/regressioni, tutti exit 0. npm run dist esegue npm run build, quindi costruisce NSIS senza installarlo sul PC. 75 test unitari passati, Playwright incluso il ponte Android simulato, Open XML, offline/desktop, aggiornamenti Electron e pacchetto, risorse NSIS, debug/prova guidata e YAML. I FAIL del validatore sui due negativi e sulla copia storica sono attesi e verificati.

Primi fallimenti conservati: comando Gradle iniziale non avviato per quoting Windows; lint ha respinto onBackPressed con target Android recente, corretto con dispatcher API 33+; build incrementale ha perso il riferimento all’icona dopo rinomina della cartella, build pulita riuscita. Il test frontend ha inizialmente rilevato il tema sistema non applicato: corretta la selezione del tema Android. Non tolti controlli per ottenere verde. Sotto gli output reali salvati, inclusi fallimenti Gradle e warning rimasti.

### Gradle primo tentativo: fallimento lint

```text

Welcome to Gradle 8.13!

Here are the highlights of this release:
 - Daemon JVM auto-provisioning
 - Enhancements for Scala plugin and JUnit testing
 - Improvements for build authors and plugin developers

For more details see https://docs.gradle.org/8.13/release-notes.html

To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build 
Checking the license for package Android SDK Platform-Tools in <progetto>\test-results\android\tools\sdk\licenses
Warning: License for package Android SDK Platform-Tools not accepted.
WARNING: platform-tools package is not installed. Please accept the installation licence to continue
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
> Task :app:mergeDebugResources
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:parseDebugLocalResources
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:processDebugManifestForPackage
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:processDebugResources
> Task :app:mergeDebugAssets

> Task :app:compileDebugJavaWithJavac

> Task :app:desugarDebugFileDependencies
> Task :app:compressDebugAssets
> Task :app:dexBuilderDebug
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:mergeDebugGlobalSynthetics
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeExtDexDebug
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeLibDexDebug
> Task :app:mergeDebugJavaResource
> Task :app:mergeProjectDexDebug
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
> Task :app:bundleDebugClassesToCompileJar
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
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:validateSigningDebugAndroidTest
> Task :app:compressDebugAndroidTestAssets
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
> Task :app:processDebugAndroidTestResources
> Task :app:processReleaseNavigationResources
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics
> Task :app:compileReleaseNavigationResources
> Task :app:generateReleaseResValues
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:packageReleaseResources
> Task :app:createReleaseCompatibleScreenManifests
> Task :app:mergeReleaseResources
> Task :app:extractDeepLinksRelease
> Task :app:parseReleaseLocalResources
> Task :app:processReleaseMainManifest
> Task :app:processReleaseManifest
> Task :app:desugarReleaseFileDependencies
> Task :app:mergeReleaseStartupProfile
> Task :app:mergeExtDexRelease
> Task :app:processReleaseManifestForPackage
> Task :app:mergeReleaseArtProfile
> Task :app:mergeReleaseShaders
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:processReleaseResources
> Task :app:mergeReleaseAssets

> Task :app:compileReleaseJavaWithJavac

> Task :app:dexBuilderRelease
> Task :app:mergeReleaseGlobalSynthetics
> Task :app:extractReleaseVersionControlInfo
> Task :app:extractProguardFiles
> Task :app:mergeDexRelease
> Task :app:generateReleaseLintVitalReportModel
> Task :app:compileReleaseArtProfile
> Task :app:compressReleaseAssets
> Task :app:packageDebugAndroidTest
> Task :app:lintVitalAnalyzeRelease
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
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:optimizeReleaseResources
> Task :app:lintAnalyzeDebugUnitTest
> Task :app:lintAnalyzeDebugAndroidTest
> Task :app:lintVitalReportRelease
> Task :app:lintVitalRelease
> Task :app:lintAnalyzeDebug
> Task :app:packageRelease
> Task :app:createReleaseApkListingFileRedirect
> Task :app:assembleRelease

> Task :app:lintReportDebug
Wrote HTML report to file:///<progetto>/android/app/build/reports/lint-results-debug.html
Lint found 1 error and 6 warnings. First failure:
<progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java:301: Error: onBackPressed is no longer called for back gestures; migrate to AndroidX's backward compatible OnBackPressedDispatcher [GestureBackNavigation]
    @Override public void onBackPressed() { back(); }
                          ~~~~~~~~~~~~~


> Task :app:lintDebug FAILED
Lint found 1 error, 6 warnings. First failure:

<progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java:301: Error: onBackPressed is no longer called for back gestures; migrate to AndroidX's backward compatible OnBackPressedDispatcher [GestureBackNavigation]
    @Override public void onBackPressed() { back(); }
                          ~~~~~~~~~~~~~

   Explanation for issues of type "GestureBackNavigation":
   For apps targeting and running on Android 16+ (API 36+), predictive back
   animations are enabled by default. A back gesture does not trigger
   {Activity,Dialog}.onBackPressed, and does not dispatch
   KeyEvent.KEYCODE_BACK.

   Apps should migrate to AndroidX's backward compatible
   OnBackPressedDispatcher.

   This lint check does not consider per-activity opt-in/opt-out, so you may
   need to suppress or baseline reported incidents if migrating per-activity.

   https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture


The full lint text report is located at:
  <progetto>\android\app\build\intermediates\lint_intermediate_text_report\debug\lintReportDebug\lint-results-debug.txt

[Incubating] Problems report is available at: file:///<progetto>/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.
117 actionable tasks: 117 executed
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:lintDebug'.
> Lint found errors in the project; aborting build.
  
  Fix the issues identified by lint, or create a baseline to see only new errors.
  To create a baseline, run `gradlew updateLintBaseline` after adding the following to the module's build.gradle file:
  ```
  android {
      lint {
          baseline = file("lint-baseline.xml")
      }
  }
  ```
  For more details, see https://developer.android.com/studio/write/lint#snapshot
  
  Lint found 1 error, 6 warnings. First failure:
  
  <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java:301: Error: onBackPressed is no longer called for back gestures; migrate to AndroidX's backward compatible OnBackPressedDispatcher [GestureBackNavigation]
      @Override public void onBackPressed() { back(); }
                            ~~~~~~~~~~~~~
  
     Explanation for issues of type "GestureBackNavigation":
     For apps targeting and running on Android 16+ (API 36+), predictive back
     animations are enabled by default. A back gesture does not trigger
     {Activity,Dialog}.onBackPressed, and does not dispatch
     KeyEvent.KEYCODE_BACK.
  
     Apps should migrate to AndroidX's backward compatible
     OnBackPressedDispatcher.
  
     This lint check does not consider per-activity opt-in/opt-out, so you may
     need to suppress or baseline reported incidents if migrating per-activity.
  
     https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture
  
  
  The full lint text report is located at:
    <progetto>\android\app\build\intermediates\lint_intermediate_text_report\debug\lintReportDebug\lint-results-debug.txt

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 1m 56s
```

### Gradle incrementale: risorsa icona mancante

```text
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build 
Checking the license for package Android SDK Platform-Tools in <progetto>\test-results\android\tools\sdk\licenses
Warning: License for package Android SDK Platform-Tools not accepted.
WARNING: platform-tools package is not installed. Please accept the installation licence to continue
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig UP-TO-DATE
> Task :app:javaPreCompileDebug UP-TO-DATE
> Task :app:checkDebugAarMetadata UP-TO-DATE
> Task :app:processDebugNavigationResources
> Task :app:compileDebugNavigationResources UP-TO-DATE
> Task :app:generateDebugResValues UP-TO-DATE
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :app:packageDebugResources
> Task :app:createDebugCompatibleScreenManifests UP-TO-DATE
> Task :app:extractDeepLinksDebug UP-TO-DATE
> Task :app:processDebugMainManifest UP-TO-DATE
> Task :app:processDebugManifest UP-TO-DATE
> Task :app:processDebugManifestForPackage UP-TO-DATE
> Task :app:mergeDebugShaders UP-TO-DATE
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:parseDebugLocalResources
> Task :app:mergeDebugResources
> Task :app:mergeDebugAssets
> Task :app:desugarDebugFileDependencies UP-TO-DATE
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:mergeDebugJavaResource UP-TO-DATE
> Task :app:checkDebugDuplicateClasses UP-TO-DATE
> Task :app:mergeExtDexDebug UP-TO-DATE
> Task :app:mergeLibDexDebug UP-TO-DATE
> Task :app:mergeDebugJniLibFolders UP-TO-DATE
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:compressDebugAssets
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
> Task :app:processReleaseNavigationResources
> Task :app:compileReleaseNavigationResources UP-TO-DATE
> Task :app:generateReleaseResValues UP-TO-DATE
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:mergeReleaseResources
> Task :app:packageReleaseResources
> Task :app:createReleaseCompatibleScreenManifests UP-TO-DATE
> Task :app:extractDeepLinksRelease UP-TO-DATE
> Task :app:processReleaseMainManifest UP-TO-DATE
> Task :app:processReleaseManifest UP-TO-DATE
> Task :app:processReleaseManifestForPackage UP-TO-DATE
> Task :app:desugarReleaseFileDependencies UP-TO-DATE
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
> Task :app:parseReleaseLocalResources
> Task :app:mergeExtDexRelease UP-TO-DATE
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseShaders UP-TO-DATE
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:mergeReleaseAssets
> Task :app:extractReleaseVersionControlInfo UP-TO-DATE
> Task :app:extractProguardFiles UP-TO-DATE
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:mergeReleaseJavaResource UP-TO-DATE
> Task :app:collectReleaseDependencies UP-TO-DATE
> Task :app:sdkReleaseDependencyData UP-TO-DATE
> Task :app:writeReleaseAppMetadata UP-TO-DATE
> Task :app:compressReleaseAssets
> Task :app:writeReleaseSigningConfigVersions UP-TO-DATE
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:processReleaseResources FAILED
> Task :app:processDebugResources FAILED

[Incubating] Problems report is available at: file:///<progetto>/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.
84 actionable tasks: 18 executed, 66 up-to-date

FAILURE: Build completed with 2 failures.

1: Task failed with an exception.
-----------
* What went wrong:
Execution failed for task ':app:processReleaseResources'.
> A failure occurred while executing com.android.build.gradle.internal.res.LinkApplicationAndroidResourcesTask$TaskAction
   > Android resource linking failed
     ERROR: <progetto>\android\app\src\main\AndroidManifest.xml:4:5-16:19: AAPT: error: resource mipmap/ic_launcher (aka it.cosmonet.cosmoffice:mipmap/ic_launcher) not found.
         

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
==============================================================================

2: Task failed with an exception.
-----------
* What went wrong:
Execution failed for task ':app:processDebugResources'.
> A failure occurred while executing com.android.build.gradle.internal.res.LinkApplicationAndroidResourcesTask$TaskAction
   > Android resource linking failed
     ERROR: <progetto>\android\app\src\main\AndroidManifest.xml:4:5-16:19: AAPT: error: resource mipmap/ic_launcher (aka it.cosmonet.cosmoffice:mipmap/ic_launcher) not found.
         

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
==============================================================================

BUILD FAILED in 11s
```

### Gradle build pulita: successo

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
> Task :app:validateSigningDebug
> Task :app:writeDebugAppMetadata
> Task :app:writeDebugSigningConfigVersions
> Task :app:preDebugAndroidTestBuild SKIPPED
> Task :app:compressDebugAssets
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
> Task :app:processDebugManifestForPackage
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:compressDebugAndroidTestAssets
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
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
> Task :app:mergeReleaseResources
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
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
> Task :app:bundleDebugClassesToCompileJar
> Task :app:mergeProjectDexDebug
> Task :app:extractReleaseVersionControlInfo
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics
> Task :app:extractProguardFiles
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:mergeReleaseJavaResource
> Task :app:compressReleaseAssets
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:collectReleaseDependencies
> Task :app:sdkReleaseDependencyData
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:generateDebugAndroidTestLintModel
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:processReleaseManifestForPackage
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
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

BUILD SUCCESSFUL in 29s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### Lint Android reale (zero errori, due avvisi)

```text
<progetto>\android\app\src\main\AndroidManifest.xml:7: Warning: Attribute enableOnBackInvokedCallback is only used in API level 33 and higher (current min is 29) [UnusedAttribute]
        android:supportsRtl="true" android:enableOnBackInvokedCallback="true">
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

   Explanation for issues of type "UnusedAttribute":
   This check finds attributes set in XML files that were introduced in a
   version newer than the oldest version targeted by your application (with
   the minSdkVersion attribute).

   This is not an error; the application will simply ignore the attribute.
   However, if the attribute is important to the appearance or functionality
   of your application, you should consider finding an alternative way to
   achieve the same result with only available attributes, and then you can
   optionally create a copy of the layout in a layout-vNN folder which will be
   used on API NN or higher where you can take advantage of the newer
   attribute.

   Note: This check does not only apply to attributes. For example, some tags
   can be unused too, such as the new <tag> element in layouts introduced in
   API 21.

<progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java:85: Warning: Using setJavaScriptEnabled can introduce XSS vulnerabilities into your application, review carefully [SetJavaScriptEnabled]
        settings.setJavaScriptEnabled(true);
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

   Explanation for issues of type "SetJavaScriptEnabled":
   Your code should not invoke setJavaScriptEnabled if you are not sure that
   your app really requires JavaScript support.

   https://goo.gle/SetJavaScriptEnabled
   https://developer.android.com/training/articles/security-tips

0 errors, 2 warnings
```

### Ispezione APK release unsigned

```text
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

### Firma e checksum

```text
{
  "result": "PASS",
  "version": "0.2.3",
  "signed": true,
  "certificateSha256": "32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e",
  "apkSha256": "07372fc9caaea80f50b95e96bb142cbacf206d20eb2854fb59cfc8e608471079",
  "unsignedSha256": "78332a5cb2cf92c67cb9f1132cab29a4ef990fa6fe47106a390ae48b42f818fb",
  "privateKeyUploaded": false,
  "physicalDeviceTested": false
}
```

### Verifica firma APK

```text
Verifies
Verified using v1 scheme (JAR signing): false
Verified using v2 scheme (APK Signature Scheme v2): false
Verified using v3 scheme (APK Signature Scheme v3): true
Verified using v3.1 scheme (APK Signature Scheme v3.1): false
Verified using v4 scheme (APK Signature Scheme v4): false
Verified for SourceStamp: false
Number of signers: 1
Signer #1 certificate DN: CN=CosmOffice
Signer #1 certificate SHA-256 digest: 32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e
Signer #1 certificate SHA-1 digest: 6b2461bc52bcdf473b762df4eafa46c20b148227
Signer #1 certificate MD5 digest: cfff6e1b20a31911a3b58156a6fdc4c3
Signer #1 key algorithm: RSA
Signer #1 key size (bits): 4096
Signer #1 public key SHA-256 digest: 036d34d98c25b0dd073b728b648f5c70be51bfcf3f4282a1dc6d6464d5d079f2
Signer #1 public key SHA-1 digest: 36e8335353819453591839f870278eb02e600b1d
Signer #1 public key MD5 digest: ab19a5c80edd16f17a59566d737badee
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

✓ built in 1.13s
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

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (10.6411ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (3.9233ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (80.5002ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (76.5115ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (136.0632ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (188.1189ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (33.6249ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (36.0492ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (35.1758ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (27.0437ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.1801ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7594ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (37.3187ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.8685ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (94.3059ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (75.4027ms)
✔ unknown formulas retain their source without exporting a misleading cached number (15.7248ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.3334ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (15.3742ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.4424ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.0208ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (10.6787ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (160.3211ms)
✔ references, arithmetic, precedence and percentages (5.2704ms)
✔ Italian aliases, absolute references, text and lazy IF (1.3953ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.3979ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.9581ms)
✔ Excel address limits and column naming (1.2307ms)
✔ conditional sums, lookups, text, dates and error handling (4.0224ms)
✔ quoted sheet names, absolute references and cycles across sheets (1.254ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (1.0546ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9385ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.7925ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.4929ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.2361ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.768ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (7.0001ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (257.6963ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (44.3582ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (11.0679ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (125.1657ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (19.174ms)
✔ Release corrente: note complete per la versione realmente distribuita (7.0994ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (4.2912ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (66.1156ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (2.2382ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (51.0729ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (109.0292ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (33.9975ms)
✔ damaged files and mismatched Office extensions are rejected before import (8.5799ms)
✔ unsupported parts produce specific warnings without changing the original file (34.1563ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.397ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.1996ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (820.3786ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1805.3132ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.4993ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.1925ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (5.1178ms)
✔ TLS Node: errore di certificato senza fallback (1.8203ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (20.8873ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.8708ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (132.5487ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.3683ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.99ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (148.8428ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.5562ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.1808ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (15.772ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (22.3868ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.149ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.4764ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (20.9363ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.7028ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (28.0653ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.1967ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3117.2076
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
14:33:37 [vite] (client) page reload android/app/src/main/assets/www/index.html
14:33:37 [vite] (client) page reload android/app/src/main/assets/www/dictionaries/CC-BY-SA-2.0.html
14:33:37 [vite] (client) page reload android/app/src/main/assets/www/dictionaries/CC-BY-SA-2.0.html
14:33:37 [vite] (client) page reload android/app/src/main/assets/www/index.html
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
14:33:50 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/dictionaries/CC-BY-SA-2.0.html
14:33:50 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/index.html
14:33:50 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
14:33:52 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/index.html
14:33:52 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/dictionaries/CC-BY-SA-2.0.html
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
14:34:06 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
14:34:06 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
14:34:07 [vite] (client) page reload android/build/reports/problems/problems-report.html
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
14:33:55 [vite] (client) [console.warn] Warning: Indexing all PDF objects
14:35:58 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID
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

Tempo trascorso 00:00:00.30
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
ECCEZIONE STORICA VERIFICATA: copia v1 identica, errore MIME del disegno conservato e segnalato nel report separato. Nessuna eccezione per i nuovi esportati.
FAIL <progetto>\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type. 
[Part Uri=/xl/drawings/cosmoDrawing1.xml], 
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml], 
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
```

### node scripts/notices.mjs — exit 0

```text
Attribuzioni e licenze raccolte.
```

### npm run dist -- --win nsis --x64 — exit 0

```text

> cosmoffice@0.2.3 dist
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --publish never --win nsis --x64


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

✓ built in 1.17s

> cosmoffice@0.2.3 icons
> node scripts/icons.mjs

Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.
Attribuzioni e licenze raccolte.
  • electron-builder  version=26.18.0 os=10.0.26300
  • loaded configuration  file=<progetto>\electron-builder.config.cjs
  • skipped dependencies rebuild  reason=npmRebuild is set to false
  • packaging       platform=win32 arch=x64 electron=45.4.1 appOutDir=release\win-unpacked
  • downloaded      label=electron progress=100%
  • downloaded electron zip extracted successfully  output=<progetto>\release\win-unpacked
  • searching for node modules  pm=npm searchDir=<progetto>
  • no node modules found in collection, trying next search directory  pm=npm searchDir=<progetto>
  • searching for node modules  pm=traversal searchDir=<progetto>
  • using manual traversal of node_modules to build dependency tree
  • no node modules found in collection, trying next search directory  pm=traversal searchDir=<progetto>
  • no node modules returned while searching directories  searchDirectories=[""]
  • updating asar integrity executable resource  executablePath=release\win-unpacked\CosmOffice.exe
  • no code signing certificate configured, signing is skipped  path=release\win-unpacked\CosmOffice.exe
  • building        target=nsis file=release\CosmOffice-0.2.3-win-x64-Setup.exe archs=x64 oneClick=false perMachine=false
  • no code signing certificate configured, signing is skipped  path=<utente>\AppData\Local\Temp\t-9xWqgO\elevate-staging-1\resources\elevate.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.__uninstaller.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.exe
  • building block map  blockMapFile=release\CosmOffice-0.2.3-win-x64-Setup.exe.blockmap
[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
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
        "THIRD_PARTY_NOTICES.txt": "8e5674f231a242ced415f0bdd5589f8a0abe2960ae0eeefbb8f3946a9ba5d6db"
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

### node test-results/android/yaml-check.mjs — exit 0

```text
PASS YAML: android.yml
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
```

## 4. Cosa funziona (provato)

Compilazione reale APK debug/test/release e lint, pacchetto release senza permessi, licenze identiche ai sorgenti, dizionario/worker/decoder locali, firma verificata e checksum. Frontend simulato: apertura DOCX, creazione/salvataggio Markdown, byte, ritorno alle bozze, tema, impostazioni Android, rapporto filtrato persistente e copia; nessuna richiesta esterna nel browser. Regressioni desktop e pacchetto Windows passate negli output sopra. **Non dedurre il funzionamento dell’APK dalla sola compilazione.**

## 5. Cosa NON funziona o non hai potuto provare

- Emulatore Android: workflow preparato, non ancora osservato prima del primo push. Nessun APK dichiarato collaudato o pubblicato.
- Non provato: telefono/tablet fisico, tastiera virtuale/gesti, installazione/aggiornamento reali con la chiave definitiva, Android 10/16, provider cloud, poco spazio/memoria, arresti del sistema o WebView.
- Non implementati: stampa e DOCX→PDF Android, aggiornamenti automatici APK, iOS; sopra 10 MB il trasferimento è rifiutato.
- CI produce unsigned, la firma è locale. Nessuna chiave caricata in Secrets, nessun APK aggiunto alla Release desktop, nessun tag. Nessun nuovo collaudo fisico Windows/Linux/Mac dedotto dai test.

## 6. Bug e dubbi

AND-001/004: correzioni build/lint provate, navigazione nativa ancora da osservare. AND-002/003: limiti espliciti, non risolti. Avvisi Gradle: funzionalità deprecate verso Gradle 9, API Java deprecate; installazione locale platform-tools assente/licenza non accettata, assembly comunque riuscito. Lint: zero errori, warning JavaScript necessario/attributo API 33; non soppressi. Occorre mantenere stessa chiave e aumentare versionCode nei futuri aggiornamenti.

Non toccati: motori documenti/fogli/PDF, editor Grid/Markdown e filtri delle policy diagnostiche, Prova guidata, electron/, LICENSE, package-lock, condizioni della licenza, tag e installer pubblici 0.2.3. Documenti delle prove originali del corpus. Fonti documentali/API elencate con link in docs/ricerca/CODICE-STUDIATO.md e docs/ANDROID.md; nessun codice copiato.

## 7. Hash del commit

Base: 4992738e12ecb82c321b9eed541664d7bb8f6213. Commit di questo passo: git log -1 --format=%H -- docs/report/2026-11-27_1443_android-apk.md; hash comunicato dopo il push, perché inserirlo nel suo stesso contenuto ne cambierebbe l’hash.

## 8. Prossimo passo

Leggere la run Android e correggere eventuali problemi del selettore o del WebView prima di consegnare l’APK come provato. Poi prova su telefono fisico. Conservare una copia privata di chiave e password; non inviarle nei commenti. Pubblicazione Android e caricamento di chiave in CI restano decisioni del titolare, non implementati automaticamente.
